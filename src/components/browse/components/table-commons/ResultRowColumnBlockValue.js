'use strict';

import React from 'react';
import _ from 'underscore';
import memoize from 'memoize-one';
import { getNestedProperty, itemUtil } from './../../../util/object';

/**
 * Implements own `shouldComponentUpdate`.
 * Sometimes, columns other than first column may want to update -- in which case,
 * a `props.shouldComponentUpdateExt` is available but perhaps not fully implemented.
 */
export class ResultRowColumnBlockValue extends React.Component {

    /**
     * Default value rendering function. Fallback when no `render` func defined in columnDefinition.
     * Uses columnDefinition field (column key) to get nested property value from result and display it.
     *
     * @param {Item} result - JSON object representing row data.
     * @param {ColumnDefinition} columnDefinition - Object with column definition data - field, title, widthMap, render function (self)
     * @param {Object} props - Props passed down from SearchResultTable/ResultRowColumnBlock instance.
     * @param {number} width - Unused. Todo - remove?
     * @returns {string|null} String value or null. Your function may return a React element, as well.
     */
    static transformIfNeeded(result, columnDefinition, props, termTransformFxn){

        function filterAndUniq(vals){
            return _.uniq(_.filter(vals, function(v){
                return v !== null && typeof v !== 'undefined';
            }));
        }

        let value = getNestedProperty(result, columnDefinition.field, true);
        if (typeof value === "undefined") value = null;
        if (Array.isArray(value)){ // getNestedProperty may return a multidimensional array, # of dimennsions depending on how many child arrays were encountered in original result obj.
            value = filterAndUniq(value.map(function(v){
                if (Array.isArray(v)){
                    v = filterAndUniq(v);
                    if (v.length === 1) v = v[0];
                    if (v.length === 0) v = null;
                }
                if (typeof termTransformFxn === 'function'){
                    return termTransformFxn(columnDefinition.field, v, false);
                }
                console.warn("No termTransformFxn supplied.");
                return v;
            })).map(function(v){
                if (typeof termTransformFxn === 'function'){
                    return termTransformFxn(columnDefinition.field, v, false);
                }
                return v;
            }).join(', ');
        } else if (typeof termTransformFxn === 'function'){
            value = termTransformFxn(columnDefinition.field, value, true);
        }
        return value;
    }

    static defaultProps = {
        'mounted' : false,
        'toggleDetailOpen' : function(evt){ console.warn('Triggered props.toggleDetailOpen() but no toggleDetailOpen prop passed to ResultRowColumnValue Component.'); },
        'shouldComponentUpdateExt' : null
    };

    constructor(props){
        super(props);
        this.memoized = {
            transformIfNeeded: memoize(ResultRowColumnBlockValue.transformIfNeeded)
        };
    }

    shouldComponentUpdate(nextProps, nextState){
        const { columnDefinition, schemas, result, className } = this.props;
        if (
            nextProps.columnNumber === 0 || // Update title column more frequently.
            nextProps.columnDefinition.field !== columnDefinition.field ||
            nextProps.schemas !== schemas ||
            itemUtil.atId(nextProps.result) !== itemUtil.atId(result) ||
            nextProps.className !== className ||
            (typeof nextProps.shouldComponentUpdateExt === 'function' && nextProps.shouldComponentUpdateExt(nextProps, nextState, this.props, this.state))
        ){
            return true;
        }
        return false;
    }

    render(){
        const {
            result,
            columnDefinition,
            tooltip : propTooltip,
            className,
            termTransformFxn
        } = this.props;

        const renderFxn = columnDefinition.render || this.memoized.transformIfNeeded;

        let value = sanitizeOutputValue(
            renderFxn(result, columnDefinition, _.omit(this.props, 'columnDefinition', 'result'), termTransformFxn)
        );

        let tooltip;
        if (typeof value === 'number'){
            value = <span className="value">{ value }</span>;
        } else if (typeof value === 'string') {
            if (propTooltip === true && value.length > 25) tooltip = value;
            value = <span className="value">{ value }</span>;
        } else if (value === null){
            value = <small className="value">-</small>;
        } else if (React.isValidElement(value) && value.type === "a") {
            // We let other columnRender funcs define their `value` container (if any)
            // But if is link, e.g. from termTransformFxn, then wrap it to center it.
            value = <span className="value">{ value }</span>;
        }

        let cls = "inner";
        if (typeof className === 'string'){
            cls += ' ' + className;
        }
        return (
            <div className={cls} data-tip={tooltip}>{ value }</div>
        );
    }
}


/**
 * Ensure we have a valid React element to render.
 * If not, try to detect if Item object, and generate link.
 * Else, let exception bubble up.
 *
 * Used as fallback for most columns.
 *
 * @static
 * @param {any} value - Value to sanitize.
 */
export function sanitizeOutputValue(value){
    if (typeof value !== 'string' && typeof value !== 'number' && !React.isValidElement(value)){
        if (value && typeof value === 'object'){
            if (typeof value.display_title !== 'undefined'){
                const atId = itemUtil.atId(value);
                if (atId){
                    return <a href={atId}>{ value.display_title }</a>;
                } else {
                    return value.display_title;
                }
            }
        } else if (!value){
            value = null;
        }
    }
    if (value === "None") value = null;
    return value;
}