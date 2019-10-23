'use strict';

import React from 'react';
import _ from 'underscore';
import memoize from "memoize-one";
import * as vizUtil from './../../viz/utilities';
import { console, searchFilters } from './../../util';



export class ActiveFiltersBar extends React.PureComponent {

    static defaultProps = {
        'schemas' : null,
        'parentId' : 'main',
        'filters' : null,
        'invisible' : false,
        'termTransformFxn' : function(field, term, allowJSX=true){
            return term;
        },
        'fieldTransformFxn' : function(field, term, itemType=null){
            return term;
        },
        'onTermClick' : function(field, term){
            console.log("Clicked", field, term);
        },
        'fieldGroupClassName' : "field-group mb-32",
        'termClassName': "chart-crumb"
    };

    constructor(props){
        super(props);
        this.updateHoverNodes = _.throttle(this.updateHoverNodes.bind(this), 200);
        this.renderCrumbs = this.renderCrumbs.bind(this);
        this.memoized = {
            getSearchItemType: memoize(searchFilters.getSearchItemType)
        };
    }

    updateHoverNodes(sequence = []){
        vizUtil.requestAnimationFrame(()=>{
            this.setState({ 'highlighted' :  sequence });
        });
    }

    renderCrumbs(){
        const {
            invisible,
            onTermClick,
            filters,
            context,
            orderedFieldNames, // todo - maybe order by this if present
            schemas,
            termTransformFxn,
            fieldTransformFxn,
            termClassName,
            fieldGroupClassName
        } = this.props;

        if (invisible) return null;
        if (!Array.isArray(filters) || filters.length === 0) return null;

        const filtersByField = new Map();

        filters.forEach(function({ field, term }){
            if (!filtersByField.has(field)) {
                filtersByField.set(field, new Set());
            }
            filtersByField.get(field).add(term);
        });

        const renderedFieldFilterGroups = [];

        for (const [field, termSet] of filtersByField) {

            // Try to get more accurate title from context.facets list, if available.
            const relatedFacet = Array.isArray(context.facets) && _.findWhere(context.facets, { field });
            const fieldTitle = (
                (relatedFacet && relatedFacet.title) ||
                fieldTransformFxn(field, schemas, this.memoized.getSearchItemType(context)) ||
                'N/A'
            );
            const renderedNodes = [];
            for (const term of termSet){
                renderedNodes.push(
                    <RegularCrumb {...{ filters, field, term, termTransformFxn }}
                        key={term} onClick={onTermClick} className={termClassName} />
                );
            }

            renderedFieldFilterGroups.push(
                <div className={fieldGroupClassName} key={field} data-field={field}>
                    { renderedNodes }
                    <div className="field-label">{ fieldTitle }</div>
                </div>
            );
        }

        return renderedFieldFilterGroups;
    }

    render(){
        const { parentId } = this.props;
        return (<div className="active-filters-bar" id={parentId + '-crumbs'}>{ this.renderCrumbs() }</div>);
    }

}

function Container({ sequential, children }){
    const title = sequential ? "Examining" : "Currently-selected Filters";
    return (
        <div className="active-filters-bar-container">
            <h5 className="crumbs-title">
                { title }
            </h5>
            { children }
        </div>
    );
}


const RegularCrumb = React.memo(function RegularCrumb(props){
    const { field, term, color = null, termTransformFxn, onClick, className } = props;
    return (
        <span className={className}
            data-term={term}
            style={{ backgroundColor : color }}>
            { termTransformFxn(field, term, true) }
            <span className="icon-container" onClick={(evt)=>{
                onClick(evt, field, term);
            }}>
                <i className="icon icon-times fas"/>
            </span>
        </span>
    );
});

