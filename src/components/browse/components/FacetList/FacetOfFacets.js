'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';

import { Facet } from './index';
import { Collapse } from './../../../ui/Collapse';

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
        this.state = {
            'facetOpen'     : typeof props.defaultFacetOpen === 'boolean' ? props.defaultFacetOpen : true,
            'facetClosing'  : false,
            'expanded'      : false
        };
    }

    componentDidUpdate(pastProps, pastState){
        const { mounted, defaultFacetOpen, isStatic } = this.props;

        // this.setState(({ facetOpen: currFacetOpen }) => {
        //     if (!pastProps.mounted && mounted && typeof defaultFacetOpen === 'boolean' && defaultFacetOpen !== pastProps.defaultFacetOpen) {
        //         return { 'facetOpen' : true };
        //     }
        //     if (defaultFacetOpen === true && !pastProps.defaultFacetOpen && !currFacetOpen){
        //         return { 'facetOpen' : true };
        //     }
        //     if (currFacetOpen && isStatic && !pastProps.isStatic){
        //         return { 'facetOpen' : false };
        //     }
        //     return null;
        // }, ()=>{
        //     const { facetOpen } = this.state;
        //     if (pastState.facetOpen !== facetOpen){
        //         ReactTooltip.rebuild();
        //     }
        // });
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

    render() {
        const { title, facets: facetList, tooltip } = this.props;
        const { facetOpen, facetClosing } = this.state;

        console.log("log1: facetList[0]", facetList[0]);
        console.log("log1: mapped", facetList.map((facet) => facet.title));
        return (
            <div className={"facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : '')} data-field={title}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")}/>
                    </span>
                    <span className="inline-block col px-0" data-tip={tooltip} data-place="right">{ title }</span>
                    {/* { indicator } */}
                </h5>
                <Collapse in={facetOpen && !facetClosing}>
                    <div className="ml-1">
                        { facetList }
                        {/* facetList.map((facet) => <li key={facet.field}>{facet.title}</li>) */}
                    </div>
                    {/* <span className="mr-1">{facetList.map((facet) => facet.title)}</span> */}
                    {/* { facetList.map
                        (facet) => <h1 key={facet.field}>{facet.title}</h1>)
                    } */}
                </Collapse>
            </div>
        );
    }

    // static isStatic(facet){
    //     const { terms = null, total = 0, aggregation_type = "terms", min = null, max = null } = facet;
    //     return (
    //         aggregation_type === "terms" &&
    //         Array.isArray(terms) &&
    //         terms.length === 1 &&
    //         total <= _.reduce(terms, function(m, t){ return m + (t.doc_count || 0); }, 0)
    //     ) || (
    //         aggregation_type == "stats" &&
    //         min === max
    //     );
    // }

    // constructor(props){
    //     super(props);
    //     this.handleStaticClick = this.handleStaticClick.bind(this);
    //     this.handleTermClick = this.handleTermClick.bind(this);
    //     this.state = { 'filtering' : false };
    // }

    // /**
    //  * For cases when there is only one option for a facet - we render a 'static' row.
    //  * This may change in response to design.
    //  * Unlike in `handleTermClick`, we handle own state/UI here.
    //  *
    //  * @todo Allow to specify interval for histogram & date_histogram in schema instead of hard-coding 'month' interval.
    //  */
    // handleStaticClick(e) {
    //     const { facet, isStatic } = this.props;
    //     const term = facet.terms[0]; // Would only have 1

    //     e.preventDefault();
    //     if (!isStatic) return false;

    //     this.setState({ 'filtering' : true }, () => {
    //         this.handleTermClick(facet, term, e, () =>
    //             this.setState({ 'filtering' : false })
    //         );
    //     });

    // }

    // /**
    //  * Each Term component instance provides their own callback, we just route the navigation request.
    //  *
    //  * @todo Allow to specify interval for histogram & date_histogram in schema instead of hard-coding 'month' interval.
    //  */
    // handleTermClick(facet, term, e, callback) {
    //     const { onFilter, href } = this.props;
    //     onFilter(facet, term, callback, false, href);
    // }

    // render() {
    //     const {
    //         facet, getTermStatus, extraClassname, termTransformFxn, separateSingleTermFacets,
    //         defaultFacetOpen, filters, onFilter, mounted, isStatic
    //     } = this.props;
    //     const { filtering } = this.state;
    //     const { description = null, field, title, terms = [], aggregation_type = "terms" } = facet;
    //     const showTitle = title || field;

    //     if (aggregation_type === "stats") {
    //         return <RangeFacet {...{ facet, filtering, defaultFacetOpen, termTransformFxn, filters, onFilter, mounted, isStatic }} tooltip={description} title={showTitle} />;
    //     }

    //     // Default case for "terms" buckets/facets
    //     if (separateSingleTermFacets && isStatic){
    //         // Only one term exists.
    //         return <StaticSingleTerm {...{ facet, term : terms[0], filtering, showTitle, onClick : this.handleStaticClick, getTermStatus, extraClassname, termTransformFxn }} />;
    //     } else {
    //         return <FacetTermsList {...this.props} onTermClick={this.handleTermClick} tooltip={description} title={showTitle} />;
    //     }

    // }
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