'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'query-string';
import _ from 'underscore';
import memoize from 'memoize-one';

import { patchedConsoleInstance as console } from './../../../util/patched-console';
import { getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters, buildSearchHref, contextFiltersToExpSetFilters } from './../../../util/search-filters';
import { navigate } from './../../../util/navigate';
import * as analytics from './../../../util/analytics';
import { responsiveGridState } from './../../../util/layout';

import { RangeFacet } from './RangeFacet';
import { FacetTermsList } from './FacetTermsList';
import { StaticSingleTerm } from './StaticSingleTerm';

/**
 * Component to render out the FacetList for the Browse and ExperimentSet views.
 * It can work with AJAX-ed in back-end data, as is used for the Browse page, or
 * with client-side data from back-end-provided Experiments, as is used for the ExperimentSet view.
 *
 * Some of this code is not super clean and eventually could use some refactoring.
 *
 * @module {Component} facetlist
 */



/**
 * Used to render individual facet fields and their available terms in FacetList.
 *
 * @memberof module:facetlist
 * @class Facet
 * @type {Component}
 */
class Facet extends React.PureComponent {

    static isStatic(facet){
        const { terms = null, total = 0, aggregation_type = "terms", min = null, max = null } = facet;
        return (
            aggregation_type === "terms" &&
            Array.isArray(terms) &&
            terms.length === 1 &&
            total <= _.reduce(terms, function(m, t){ return m + (t.doc_count || 0); }, 0)
        ) || (
            aggregation_type == "stats" &&
            min === max
        );
    }

    constructor(props){
        super(props);
        this.handleStaticClick = this.handleStaticClick.bind(this);
        this.handleTermClick = this.handleTermClick.bind(this);
        this.state = { 'filtering' : false };
    }

    /**
     * For cases when there is only one option for a facet - we render a 'static' row.
     * This may change in response to design.
     * Unlike in `handleTermClick`, we handle own state/UI here.
     *
     * @todo Allow to specify interval for histogram & date_histogram in schema instead of hard-coding 'month' interval.
     */
    handleStaticClick(e) {
        const { facet, isStatic } = this.props;
        const term = facet.terms[0]; // Would only have 1

        e.preventDefault();
        if (!isStatic) return false;

        this.setState({ 'filtering' : true }, () => {
            this.handleTermClick(facet, term, e, () =>
                this.setState({ 'filtering' : false })
            );
        });

    }

    /**
     * Each Term component instance provides their own callback, we just route the navigation request.
     *
     * @todo Allow to specify interval for histogram & date_histogram in schema instead of hard-coding 'month' interval.
     */
    handleTermClick(facet, term, e, callback) {
        const { onFilter, href } = this.props;
        onFilter(facet, term, callback, false, href);
    }

    render() {
        const {
            facet, getTermStatus, extraClassname, termTransformFxn, separateSingleTermFacets,
            defaultFacetOpen, filters, onFilter, mounted, isStatic
        } = this.props;
        const { filtering } = this.state;
        const { description = null, field, title, terms = [], aggregation_type = "terms" } = facet;
        const showTitle = title || field;

        if (aggregation_type === "stats") {
            return <RangeFacet {...{ facet, filtering, defaultFacetOpen, termTransformFxn, filters, onFilter, mounted, isStatic }} tooltip={description} title={showTitle} />;
        }

        // Default case for "terms" buckets/facets
        if (separateSingleTermFacets && isStatic){
            // Only one term exists.
            return <StaticSingleTerm {...{ facet, term : terms[0], filtering, showTitle, onClick : this.handleStaticClick, getTermStatus, extraClassname, termTransformFxn }} />;
        } else {
            return <FacetTermsList {...this.props} onTermClick={this.handleTermClick} tooltip={description} title={showTitle} />;
        }

    }
}
Facet.propTypes = {
    'facet'                 : PropTypes.shape({
        'field'                 : PropTypes.string.isRequired,    // Name of nested field property in experiment objects, using dot-notation.
        'title'                 : PropTypes.string,               // Human-readable Facet Term
        'total'                 : PropTypes.number,               // Total experiments (or terms??) w/ field
        'terms'                 : PropTypes.array.isRequired,     // Possible terms,
        'description'           : PropTypes.string,
        'aggregation_type'      : PropTypes.oneOf(["stats", "terms"])
    }),
    'defaultFacetOpen'      : PropTypes.bool,
    'onFilter'              : PropTypes.func,           // Executed on term click
    'extraClassname'        : PropTypes.string,
    'schemas'               : PropTypes.object,
    'getTermStatus'         : PropTypes.func.isRequired,
    'href'                  : PropTypes.string.isRequired,
    'filters'               : PropTypes.arrayOf(PropTypes.object).isRequired,
    'mounted'               : PropTypes.bool
};




/**
 * Use this function as part of SearchView and BrowseView to be passed down to FacetList.
 * Should be bound to a component instance, with `this` providing 'href', 'context' (with 'filters' property), and 'navigate'.
 *
 * @todo deprecate somehow. Mixins havent been part of React standards for a while now...
 * @todo Keep in mind is only for TERMS filters. Would not work for date histograms..
 *
 * @param {string} field - Field for which a Facet term was clicked on.
 * @param {string} term - Term clicked on.
 * @param {function} callback - Any function to execute afterwards.
 * @param {boolean} [skipNavigation=false] - If true, will return next targetSearchHref instead of going to it. Use to e.g. batch up filter changes on multiple fields.
 */
export function performFilteringQuery(props, facet, term, callback, skipNavigation = false, currentHref = null){
    const { href: propHref, navigate: propNavigate, context } = props;
    let targetSearchHref;

    currentHref = currentHref || propHref;

    const statusAndHref = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, context.filters);
    const isUnselecting = !!(statusAndHref.href);

    if (statusAndHref.href){
        targetSearchHref = statusAndHref.href;
    } else {
        if (facet.aggregation_type === "stats") { // Keep only 1, delete previous occurences
            const parts = url.parse(currentHref, true);
            delete parts.query[facet.field];
            const queryStr = queryString.stringify(parts.query);
            parts.search = queryStr && queryStr.length > 0 ? ('?' + queryStr) : '';
            currentHref = url.format(parts);
            if (term.key === null) {
                targetSearchHref = currentHref; // Keep current, stripped down v.
            } else {
                targetSearchHref = buildSearchHref(facet.field, term.key, currentHref);
            }
        } else {
            targetSearchHref = buildSearchHref(facet.field, term.key, currentHref);
        }
    }

    // Ensure only 1 type filter is selected at once.
    // Unselect any other type= filters if setting new one.
    if (facet.field === 'type'){
        if (!(statusAndHref.href)){
            const parts = url.parse(targetSearchHref, true);
            if (Array.isArray(parts.query.type)){
                var types = parts.query.type;
                if (types.length > 1){
                    var queryParts = _.clone(parts.query);
                    delete queryParts[""]; // Safety
                    queryParts.type = encodeURIComponent(term.key); // Only 1 Item type selected at once.
                    var searchString = queryString.stringify(queryParts);
                    parts.search = searchString && searchString.length > 0 ? ('?' + searchString) : '';
                    targetSearchHref = url.format(parts);
                }
            }
        }
    }

    // If we have a '#' in URL, add to target URL as well.
    const hashFragmentIdx = currentHref.indexOf('#');
    if (hashFragmentIdx > -1 && targetSearchHref.indexOf('#') === -1){
        targetSearchHref += currentHref.slice(hashFragmentIdx);
    }

    analytics.event('FacetList', (isUnselecting ? 'Unset Filter' : 'Set Filter'), {
        'field'             : facet.field,
        'term'              : term.key,
        'eventLabel'        : analytics.eventLabelFromChartNode({ 'field' : facet.field, 'term' : term.key }),
        'currentFilters'    : analytics.getStringifiedCurrentFilters(
            contextFiltersToExpSetFilters(context.filters || null)
        ), // 'Existing' filters, or filters at time of action, go here.
    });

    if (!skipNavigation){
        (propNavigate || navigate)(targetSearchHref, { 'dontScrollToTop' : true }, callback);
    } else {
        return targetSearchHref;
    }

}

export class FacetList extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {
            'mounted' : false
        };
    }

    componentDidMount(){
        this.setState({ 'mounted' : true });
    }

    groupFacets() {
        const { facets } = this.props;
        const grouped = []; // { field: green, }
        const groupIndices = {}; // green : 0 where in grouped

        facets.forEach((facet)=> {
            if (facet.grouping) {
                // check if there's a facet group in grouped;
                if (groupIndices.hasOwnProperty(facet.grouping)) {
                    const i = groupIndices[facet.grouping];
                    grouped[i].facetList.push(facet);
                } else  {
                    grouped.push({ field: facet.grouping, facetList: [facet] });
                    groupIndices[facet.grouping] = grouped.length - 1;
                }
            } else {
                grouped.push({ field: facet.field, facet: facet });
            }
        });

        return grouped;
    }

    renderFacets(maxTermsToShow = 12){
        const {
            facets, href, onFilter, schemas, getTermStatus, filters,
            itemTypeForSchemas, windowWidth, persistentCount, termTransformFxn, separateSingleTermFacets
        } = this.props;
        const { mounted } = this.state;

        console.log("log1: ", facets);
        // Ensure each facets has an `order` property and default it to 0 if not.
        // And then sort by `order`.
        const useFacets = _.sortBy(
            _.map(
                _.uniq(facets, false, function(f){ return f.field; }), // Ensure facets are unique, field-wise.
                function(f){
                    if (typeof f.order !== 'number'){
                        return _.extend({ 'order' : 0 }, f);
                    }
                    return f;
                }
            ),
            'order'
        );

        console.log("log1: equal?" , facets === useFacets);
        console.log("log1: this.groupFacets() ", this.groupFacets());
        console.log("log1: usefacets: ", useFacets);

        const commonProps = {
            onFilter, href, getTermStatus, filters, schemas, itemTypeForSchemas,
            mounted, termTransformFxn, separateSingleTermFacets
        };

        const facetIndexWherePastXTerms = useFacets.reduce(function(m, facet, index){
            if (m.end) return m;
            m.facetIndex = index;
            if (facet.aggregation_type === "stats") {
                m.termCount = m.termCount + 2;
            } else {
                m.termCount = m.termCount + Math.min( // Take into account 'view more' button
                    facet.terms.length, persistentCount || FacetTermsList.defaultProps.persistentCount
                );
            }
            if (m.termCount > maxTermsToShow) m.end = true;
            return m;
        }, { facetIndex : 0, termCount: 0, end : false }).facetIndex;

        console.log("log1: facetIndexWherePastXTerms", facetIndexWherePastXTerms);

        const rgs = responsiveGridState(windowWidth || null);

        return useFacets.map(function(facet, i){
            const isStatic = Facet.isStatic(facet);
            const defaultFacetOpen = !mounted ? false : !isStatic && !!(
                ( rgs !== 'xs' && i < (facetIndexWherePastXTerms || 1) ) ||
                (facet.aggregation_type === "stats" && _.any(filters || [], function(fltr){
                    return (fltr.field === facet.field + ".from") || (fltr.field === facet.field + ".to");
                })) ||
                (facet.aggregation_type === "terms" && _.any(filters || [], function(fltr){
                    return fltr.field === facet.field;
                }))
            );
            return <Facet {...commonProps} facet={facet} key={facet.field} {...{ defaultFacetOpen, isStatic }} />;
        });
    }

    render() {
        const { debug, facets, className, title, showClearFiltersButton, onClearFilters, windowHeight, separateSingleTermFacets } = this.props;
        if (debug) console.log('render facetlist');

        if (!facets || !Array.isArray(facets) || facets.length === 0) {
            return (
                <div className="pt-2 pb-2" style={{ color : "#aaa" }}>
                    No facets available
                </div>
            );
        }

        const clearButtonClassName = (
            (className && className.indexOf('with-header-bg') > -1) ?
                "btn-outline-white" : "btn-outline-default"
        );
        const maxTermsToShow = typeof windowHeight === 'number' && !isNaN(windowHeight) ? Math.floor(windowHeight / 60) : 12;
        const allFacetElements = this.renderFacets(maxTermsToShow);

        const staticFacetElements = [];
        let selectableFacetElements = [];
        if (separateSingleTermFacets){
            allFacetElements.forEach(function(renderedFacet){
                if (renderedFacet.props.isStatic){
                    staticFacetElements.push(renderedFacet);
                } else {
                    selectableFacetElements.push(renderedFacet);
                }
            });
        } else {
            selectableFacetElements = allFacetElements;
        }

        return (
            <div className={"facets-container facets" + (className ? ' ' + className : '')}>
                <div className="row facets-header">
                    <div className="col facets-title-column text-ellipsis-container">
                        <i className="icon icon-fw icon-filter fas"></i>
                        &nbsp;
                        <h4 className="facets-title">{ title }</h4>
                    </div>
                    <div className={"col-auto clear-filters-control" + (showClearFiltersButton ? '' : ' placeholder')}>
                        <a href="#" onClick={onClearFilters} className={"btn clear-filters-btn btn-xs " + clearButtonClassName}>
                            <i className="icon icon-fw icon-times fas mr-03"/>
                            <span>Clear All</span>
                        </a>
                    </div>
                </div>
                <div className="facets-body">
                    { selectableFacetElements }
                    { staticFacetElements.length > 0 ?
                        <div className="row facet-list-separator">
                            <div className="col-12">
                                { staticFacetElements.length } Common Properties
                            </div>
                        </div>
                        : null }
                    { staticFacetElements }
                </div>
            </div>
        );
    }
}
FacetList.propTypes = {
    'facets' : PropTypes.arrayOf(PropTypes.shape({
        'field' : PropTypes.string,           // Nested field in experiment(_set), using dot-notation.
        'terms' : PropTypes.arrayOf(PropTypes.shape({
            'doc_count' : PropTypes.number,   // Exp(set)s matching term
            'key' : PropTypes.string          // Unique key/title of term.
        })),
        'title' : PropTypes.string,           // Title of facet
        'total' : PropTypes.number            // # of experiment(_set)s
    })),
    /**
     * In lieu of facets, which are only generated by search.py, can
     * use and format schemas, which are available to experiment-set-view.js through item.js.
     */
    'schemas' : PropTypes.object,
    // { '<schemaKey : string > (active facet categories)' : Set (active filters within category) }
    'title' : PropTypes.string,         // Title to put atop FacetList
    'className' : PropTypes.string,     // Extra class
    'href' : PropTypes.string,
    'onFilter' : PropTypes.func,        // What happens when Term is clicked.
    'separateSingleTermFacets' : PropTypes.bool.isRequired
};
FacetList.defaultProps = {
    'facets'            : null,
    'title'             : "Properties",
    'debug'             : false,
    'showClearFiltersButton' : false,
    'separateSingleTermFacets' : false,

    /**
     * These 'default' functions don't do anything except show parameters passed.
     * Callback must be called because it changes Term's 'loading' state back to false.
     */
    'onFilter'          : function(facet, term, callback){
        // Set redux filter accordingly, or update search query/href.
        console.log('FacetList: props.onFilter(' + facet.field + ', ' + term.key + ', callback)');
        console.log(facet, term);
        if (typeof callback === 'function'){
            setTimeout(callback, 1000);
        }
    },
    'onClearFilters'    : function(e, callback){
        // Clear Redux filters, or go base search url.
        e.preventDefault();
        console.log('FacetList: props.onClearFilters(e, callback)');
        if (typeof callback === 'function'){
            setTimeout(callback, 1000);
        }
    },
    'getTermStatus': function (term, facet) {
        // Check against responseContext.filters, or expSetFilters in Redux store.
        return { 'status': 'none', 'href': null };
    },
    'itemTypeForSchemas': 'ExperimentSetReplicate',
    'termTransformFxn' : function(field, term, allowJSXOutput = false, addDescriptionTipForLinkTos = true){
        return term;
    }
};

