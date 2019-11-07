'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import { Collapse } from './../../../ui/Collapse';
import { Fade } from './../../../ui/Fade';
import { anyTermsSelected as anyTermsSelectedPerFacet, mergeTerms }  from './index';

/**
 * Used to render individual facet fields and their available terms in FacetList.
 *
 * @memberof module:facetlist
 * @class Facet
 * @type {Component}
 */
export class FacetOfFacets extends React.PureComponent {
    constructor(props){
        super(props);
        this.handleOpenToggleClick = this.handleOpenToggleClick.bind(this);
        this.handleExpandListToggleClick = this.handleExpandListToggleClick.bind(this);
        this.checkAllTerms = this.checkAllTerms.bind(this);
        this.state = {
            'facetOpen'     : typeof props.defaultFacetOpen === 'boolean' ? props.defaultFacetOpen : true,
            'facetClosing'  : false,
            'expanded'      : false
        };
        this.memoized = {
            checkAllTerms: memoize(this.checkAllTerms),
            anyTermsSelectedPerFacet: memoize(anyTermsSelectedPerFacet),
            mergeTerms: memoize(mergeTerms)
        };
    }

    handleOpenToggleClick(e) {
        e.preventDefault();
        this.setState(function({ facetOpen }){
            const willBeOpen = !facetOpen;
            if (willBeOpen) {
                return { 'facetOpen': true };
            } else {
                return { 'facetClosing': true };
            }
        }, ()=>{
            setTimeout(()=>{
                this.setState(function({ facetOpen, facetClosing }){
                    if (facetClosing){
                        return { 'facetOpen' : false, 'facetClosing' : false };
                    }
                    return null;
                });
            }, 350);
        });
    }

    handleExpandListToggleClick(e){
        e.preventDefault();
        this.setState(function({ expanded }){
            return { 'expanded' : !expanded };
        });
    }

    checkAllTerms() {
        const { facets = [], filters = [] } = this.props;
        let anySelected = false;
        // console.log("log1: running CheckAllTerms on facetList: ", facets);
        facets.forEach((facet) => {
            // console.log("log1: examining this facet for selected terms: ", facet.props.facet);
            // console.log("log1: seeking match with these filters", filters);
            const terms = this.memoized.mergeTerms(facet.props.facet, filters);
            // console.log("log1: merged terms, ", terms);
            const anyTermsSelectedThisFacet = this.memoized.anyTermsSelectedPerFacet(terms, facet.props.facet, filters);
            if (anyTermsSelectedThisFacet === true) {
                anySelected = true;
            }
        });
        return anySelected;
    }

    render() {
        const { title, facets, tooltip } = this.props;
        const { facetOpen, facetClosing } = this.state;

        const anyTermsSelected = this.memoized.checkAllTerms();

        return (
            <div className={"facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : '')} data-field={title}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")}/>
                    </span>
                    <span className="inline-block col px-0" data-tip={tooltip} data-place="right">{ title }</span>
                    <Fade in={facetClosing || !facetOpen}>
                        <span className={"closed-terms-count col-auto px-0" + (anyTermsSelected ? " some-selected" : "")}
                            data-tip={`Nested filters (${facets.length}) ${ anyTermsSelected ? " with at least 1 selected." : ""}`}>
                            <i className={"icon fas icon-layer-group" } style={{ opacity: anyTermsSelected ? 0.75 : 0.25 }}/>
                        </span>
                    </Fade>
                </h5>
                <Collapse in={facetOpen && !facetClosing}>
                    <div className="ml-2">
                        { facets }
                    </div>
                </Collapse>
            </div>
        );
    }
}
// FacetOfFacets.propTypes = {
//     'facet'                 : PropTypes.shape({
//         'field'                 : PropTypes.string.isRequired,    // Name of nested field property in experiment objects, using dot-notation.
//         'title'                 : PropTypes.string,               // Human-readable Facet Term
//         'total'                 : PropTypes.number,               // Total experiments (or terms??) w/ field
//         'terms'                 : PropTypes.array.isRequired,     // Possible terms,
//         'description'           : PropTypes.string,
//         'aggregation_type'      : PropTypes.oneOf(["stats", "terms"])
//     }),
//     'defaultFacetOpen'      : PropTypes.bool,
//     'onFilter'              : PropTypes.func,           // Executed on term click
//     'extraClassname'        : PropTypes.string,
//     'schemas'               : PropTypes.object,
//     'getTermStatus'         : PropTypes.func.isRequired,
//     'href'                  : PropTypes.string.isRequired,
//     'filters'               : PropTypes.arrayOf(PropTypes.object).isRequired,
//     'mounted'               : PropTypes.bool
// };