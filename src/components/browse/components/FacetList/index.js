'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'query-string';
import _ from 'underscore';

import { patchedConsoleInstance as console } from './../../../util/patched-console';
import { getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters, buildSearchHref, contextFiltersToExpSetFilters } from './../../../util/search-filters';
import { navigate } from './../../../util/navigate';
import * as analytics from './../../../util/analytics';
import { responsiveGridState } from './../../../util/layout';

/**
 * Not too sure whether href in performFilteringQuery will
 * always be the redux-provided props.href esp. in case of
 * embedded search views. Since func is only executed onClick
 * and not as part of view render, is (more) OK to use url.parse
 * vs memoizedUrlParse IMO.
 */
// import { memoizedUrlParse } from './../../../util/misc';

import { TermsFacet } from './TermsFacet';
import { RangeFacet, getValueFromFilters as getRangeValueFromFilters } from './RangeFacet';
import { FacetTermsList, mergeTerms, anyTermsSelected, countTermsSelected } from './FacetTermsList';
import { FacetOfFacets } from './FacetOfFacets';

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
 * Returns a new href based on current href, current filters, a facet, and term to toggle.
 * @todo Refactor maybe later. I dont remember what the sub-functions do too well. Could be made more clear.
 */
// TODO: FINISH
export function generateNextHref(currentHref, contextFilters, facet, term){
    let targetSearchHref = null;

    const { field, aggregation_type = "terms" } = facet;
    const { status: termStatus, href: unselectHref } = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(toggleTerm, toggleFacet, contextFilters);
    const willUnselect = !!(statusAndHref.href); // If present in context.filters, means is selected.

    if (willUnselect) {
        targetSearchHref = unselectHref;
    } else {
        if (aggregation_type === "stats") {
            // Keep only 1, delete previous occurences
            // This is only for "range" facets (aggregation_type=stats) where want to ensure that have multiple "date_created.to" values in URL for example.
            const parts = url.parse(currentHref, true);
            delete parts.query[field];
            const queryStr = queryString.stringify(parts.query);
            parts.search = queryStr && queryStr.length > 0 ? ('?' + queryStr) : '';
            const correctedHref = url.format(parts);
            if (term.key === null) {
                targetSearchHref = correctedHref; // Keep current, stripped down v.
            } else {
                targetSearchHref = buildSearchHref(field, term.key, correctedHref);
            }
        } else {
            targetSearchHref = buildSearchHref(field, term.key, currentHref);
        }
    }

    // If we have a '#' in URL, add to target URL as well.
    const hashFragmentIdx = currentHref.indexOf('#');
    if (hashFragmentIdx > -1 && targetSearchHref.indexOf('#') === -1){
        targetSearchHref += currentHref.slice(hashFragmentIdx);
    }


    // Ensure only 1 `type` filter is selected at once.
    // Unselect any other type= filters if setting new one.
    if (field === 'type' && !willUnselect){
        const parts = url.parse(targetSearchHref, true);
        if (Array.isArray(parts.query.type)){
            const types = parts.query.type;
            if (types.length > 1){
                const queryParts = _.clone(parts.query);
                delete queryParts[""]; // Safety
                queryParts.type = encodeURIComponent(term.key); // Only 1 Item type selected at once.
                const searchString = queryString.stringify(queryParts);
                parts.search = searchString && searchString.length > 0 ? ('?' + searchString) : '';
                targetSearchHref = url.format(parts);
            }
        }
    }

    return targetSearchHref;
}



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
            console.log("TOUCH");
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
        this.renderFacets = this.renderFacets.bind(this);
        this.state = {
            'mounted' : false
        };
    }

    componentDidMount(){
        this.setState({ 'mounted' : true });
    }

    renderFacets(){
        const {
            facets, href, onFilter, schemas, getTermStatus, filters,
            itemTypeForSchemas, windowWidth, persistentCount, termTransformFxn, separateSingleTermFacets,
            windowHeight
        } = this.props;
        const { mounted } = this.state;

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

        const commonProps = { // Passed to all Facets
            onFilter, href, getTermStatus, filters, schemas, itemTypeForSchemas,
            mounted, termTransformFxn, separateSingleTermFacets
        };

        // We try to initially open some Facets depending on available screen size or props.
        // We might get rid of this feature at some point as the amount of Facets are likely to increase.
        // Or we could just set defaultFacetOpen = false if # facets > 10 or something.
        // Basically seems like should adjust `maxTermsToShow` based on total # of facets...
        const maxTermsToShow = (
            (typeof windowHeight === 'number' && !isNaN(windowHeight) ? Math.floor(windowHeight / 60) : 15)
            - Math.floor(useFacets.length / 4)
        );

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

        const rgs = responsiveGridState(windowWidth || null);

        // The logic within `Facet` `render`, `componentDidMount`, etc. isn't executed
        // until is rendered by some other component's render method.
        // We can sort/manipulate/transform these still according to their `props.` values and such.
        const renderedFacets = useFacets.map(function(facet, i){
            const {
                grouping = null,
                field: facetField,
                aggregation_type = "terms"
            } = facet;

            // Default Open if mounted and:
            let defaultFacetOpen = !mounted ? false : !!(rgs !== 'xs' && i < (facetIndexWherePastXTerms || 1));

            if (aggregation_type === "stats") {
                const { fromVal, toVal } = getRangeValueFromFilters(facet, filters);
                const anySelected = fromVal !== null || toVal !== null;
                const isStatic = facet.min === facet.max;
                defaultFacetOpen = defaultFacetOpen || (!isStatic && _.any(filters || [], function(fltr){
                    return (fltr.field === facetField + ".from") || (fltr.field === facetField + ".to");
                })) || false;
                return <RangeFacet {...commonProps} facet={facet} key={facetField} anyTermsSelected={anySelected} {...{ defaultFacetOpen, isStatic, grouping, fromVal, toVal }} />;
            }
            if (aggregation_type === "terms"){
                const terms = mergeTerms(facet, filters); // Add in any terms specified in `filters` but not in `facet.terms` - in case someone hand-put that into URL.
                const termsSelectedCount = countTermsSelected(terms, facet, filters);
                const anySelected = termsSelectedCount !== 0;
                const isStatic = TermsFacet.isStatic(facet);
                defaultFacetOpen = defaultFacetOpen || (!isStatic && _.any(filters || [], function(fltr){
                    return fltr.field === facetField;
                })) || false;
                return <TermsFacet {...commonProps} facet={facet} key={facetField} anyTermsSelected={anySelected} {...{ defaultFacetOpen, isStatic, grouping, terms, termsSelectedCount }} />;
            }
            throw new Error("Unknown aggregation_type");
        });

        const componentsToReturn = [];  // first populated with ungrouped facets, then facet groups are spliced in
        const groups = new Map();       // { groupTitle: { index: 0, facets: [facet1, facet2, facet3, ...] } }; Map() to preserve order.

        // Separate out facets with .grouping into groups.
        renderedFacets.forEach(function(renderedFacet, idx){
            const { grouping, defaultFacetOpen } = renderedFacet.props;
            if (!grouping) {
                // add ungrouped facets straight to componentsToReturn
                componentsToReturn.push(renderedFacet);
                return;
            }

            // Get existing or create new.
            const existingGroup = groups.get(grouping) || ({
                index: componentsToReturn.length,
                facets: [],
                defaultGroupOpen: false
            });

            // If any facets are open by default, have group open by default also.
            if (defaultFacetOpen) {
                existingGroup.defaultGroupOpen = true;
            }
            existingGroup.facets.push(renderedFacet);
            groups.set(grouping, existingGroup);
        });

        const groupsArr = [ ...groups ];

        // Check, render, and add groups into `componentsToReturn`
        groupsArr.forEach(function([groupTitle, facetGroup], groupIndex){
            const { facets: facetsInGroup, index } = facetGroup;
            if (facetsInGroup.length === 1) {
                // Doesn't need to be in group, put back into `componentsToReturn`
                componentsToReturn.splice(index, 0, facetsInGroup[0]);
                // Increment remaining group indices to match new length of `componentsToReturn`.
                // We're not modifying the actual `groupsArr` list itself ever (e.g. removing/adding)
                // so `fromIdx` / `groupIndex` should always stay stable.
                // We increment facetGroup.index which is the index in `componentsToReturn`.
                groupsArr.slice(groupIndex).forEach(function([ , subsequentFacetGroup]){
                    subsequentFacetGroup.index++;
                });
                return;
            }

            // `facetGroup` contains `defaultGroupOpen`, `index`, `facets`.
            const renderedGroup = <FacetOfFacets {...commonProps} {...facetGroup} title={groupTitle} key={groupTitle} />;
            componentsToReturn.splice(index, 0, renderedGroup);
        });

        return componentsToReturn;
    }

    render() {
        const { debug, facets, className, title, showClearFiltersButton, onClearFilters, separateSingleTermFacets } = this.props;
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

        const allFacetElements = this.renderFacets();

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

