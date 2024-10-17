
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
     * @todo Maybe use Sets if more performant.
     * @param {Item} result - JSON object representing row data.
     * @param {string} field - Field for which this value is for.
     * @param {function} termTransformFxn - Transform value(s)
     * @returns {string|null} String value or null. Your function may return a React element, as well.
     */
    static transformIfNeeded(result, field, termTransformFxn){

        function flattenSet(valArr, uniqSet = null){
            uniqSet = uniqSet || new Set();
            if (Array.isArray(valArr)){
                for (var i = 0; i < valArr.length; i++) {
                    flattenSet(valArr[i], uniqSet);
                }
                return uniqSet;
            }
            // Else is single value (not array) -
            if (valArr !== null && typeof valArr !== 'undefined'){
                uniqSet.add(valArr);
            }
            return uniqSet;
        }

        const uniquedValues = [ ...flattenSet(getNestedProperty(result, field, true)) ];
        const uniquedValuesLen = uniquedValues.length;

        // No value found - let it default to 'null' and be handled as such
        if (uniquedValuesLen === 0) { // All null or undefined.
            return null;
        }

        if (typeof uniquedValues[0] === "object" && uniquedValues[0]["@id"] && typeof termTransformFxn === "function") {
            // If LinkTo Item(s), return array of JSX elements (spans) which wrap links (assuming is output from termTransformFxn).
            const uniquedLinkToItems = _.uniq(uniquedValues, false, "@id");
            return uniquedLinkToItems.map(function(v, i){
                const transformedValue = termTransformFxn(field, v, true); // `allowJSXOutput=true` == likely a link element.
                if (i === 0 && uniquedLinkToItems.length === 1) {
                    return transformedValue; // Only 1 value, no need to wrap in <span>, {value}</span> to provide comma(s).
                }
                return (
                    <span key={i} className="link-wrapper">{ i > 0 ? ", " : null }{ transformedValue }</span>
                );
            });
        } else if (typeof termTransformFxn === "function") {
            return uniquedValues.map(function(v){
                return termTransformFxn(field, v, false); // `allowJSXOutput=false` == don't allow JSX element/component(s) because joining w. ", ".
            }).join(', '); // Most often will be just 1 value in set/array.
        } else {
            console.warn("No termTransformFxn supplied.");
            return uniquedValues.join(', ');
        }
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
            nextProps.columnNumber === 0 || // Update title column more frequently as it has expansion controls, checkboxes, etc.
            nextProps.columnDefinition.field !== columnDefinition.field ||
            nextProps.columnDefinition.render !== columnDefinition.render ||
            nextProps.schemas !== schemas ||
            (nextProps.result !== result && itemUtil.atId(nextProps.result) !== itemUtil.atId(result)) ||
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
            termTransformFxn,
            defaultAlignment = "text-center"
        } = this.props;
        const {
            field,
            render: renderFxn = null,
            tooltip: colDefTooltip
        } = columnDefinition;

        const showTooltip = propTooltip === true || colDefTooltip === true;

        let value = renderFxn ?
            renderFxn(result, _.omit(this.props, 'result'))
            : this.memoized.transformIfNeeded(result, field, termTransformFxn); // Simple fallback transformation to unique arrays

        // Wrap `value` in a span (provides ellipsis, etc) if is primitive (not custom render fxn output)
        // Could prly make this less verbose later.. we _do_ want to wrap primitive values output from custom render fxn.

        let tooltip;
        if (typeof value === 'number'){
            value = <span className="value">{ value }</span>;
        } else if (typeof value === 'string') {
            if (showTooltip && value.length > 25) tooltip = value;
            value = <span className={"value " + defaultAlignment}>{ value }</span>;
        } else if (value === null){
            value = <small className="value text-center">-</small>;
        } else if (
            (React.isValidElement(value) && value.type === "a") ||
            (Array.isArray(value) && React.isValidElement(value[0]) && (value[0].type === "a" || value[0].props.className === "link-wrapper"))
        ) {
            // We let other columnRender funcs define their `value` container (if any)
            // But if is link, e.g. from termTransformFxn, then wrap it to center it.
            value = <span className={"value " + defaultAlignment}>{ value }</span>;
        } else if (typeof value === "boolean") {
            value = <span className={"value " + defaultAlignment}>{ value }</span>;
        } else if (!renderFxn){
            value = <span className="value">{ value }</span>; // JSX from termTransformFxn - assume doesn't take table cell layouting into account.
        } // else is likely JSX from custom render function -- leave as-is

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
                    return <a href={atId} className="link-underline-hover">{ value.display_title }</a>;
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