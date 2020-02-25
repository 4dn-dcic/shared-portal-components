'use strict';

import React from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'query-string';
import _ from 'underscore';

import { patchedConsoleInstance as console } from './../../../util/patched-console';
import { getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters, buildSearchHref, contextFiltersToExpSetFilters, getTermFacetStatus } from './../../../util/search-filters';
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
 *
 * @param {string} currentHref - Current search URL.
 * @param {{ field: string, term: string, remove: string }[]} contextFilters - List of currently-applied filters from context.
 * @param {{ field: string, aggregation_type: string }} facet - Facet definition for field for which a term was clicked on.
 * @param {{ key: string }} term - Term clicked on.
 */
export function generateNextHref(currentHref, contextFilters, facet, term){
    let targetSearchHref = null;

    const { field, aggregation_type = "terms" } = facet;
    const { status: termStatus, href: unselectHref } = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, contextFilters);
    // If present in context.filters, means is selected OR omitted. We want to make sure is _neither_ of those here.
    // Omitted and selected filters are both treated the same (as "active" filters, even if are exclusionary).
    const willUnselect = !!(unselectHref);

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


export class FacetList extends React.PureComponent {

    static propTypes = {
        'facets' : PropTypes.arrayOf(PropTypes.shape({
            'field' : PropTypes.string,           // Nested field in experiment(_set), using dot-notation.
            'terms' : PropTypes.arrayOf(PropTypes.shape({
                'doc_count' : PropTypes.number,   // Exp(set)s matching term
                'key' : PropTypes.string          // Unique key/title of term.
            })),
            'title' : PropTypes.string,           // Title of facet
            'total' : PropTypes.number            // # of experiment(_set)s
        })),
        'filters' : PropTypes.arrayOf(PropTypes.object).isRequired, // context.filters
        'itemTypeForSchemas' : PropTypes.string.isRequired, // For tooltips
        'showClearFiltersButton' : PropTypes.bool.isRequired,
        'onClearFilters' : PropTypes.func.isRequired,
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
        'separateSingleTermFacets' : PropTypes.bool,
        'maxBodyHeight' : PropTypes.number
    };

    static defaultProps = {
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
        // 'itemTypeForSchemas': 'ExperimentSetReplicate', - let PropType check catch lack of presence of this
        'termTransformFxn' : function(field, term, allowJSXOutput = false, addDescriptionTipForLinkTos = true){
            return term;
        }
    };

    /**
     * We use a function instead of functional/memoized components because we want literal list of JSX components.
     * These JSX components might later be segmented or something.
     */
    static createFacetComponents(props){
        const {
            href, filters, schemas, itemTypeForSchemas, termTransformFxn, onFilter, getTermStatus, facets,
            windowWidth, windowHeight,
            persistentCount = FacetTermsList.defaultProps.persistentCount,
            separateSingleTermFacets = false
        } = props;

        console.log("CREATING COMPS");

        const commonProps = { // Passed to all Facets
            href, filters, schemas, itemTypeForSchemas,
            termTransformFxn, separateSingleTermFacets,
            onFilter, getTermStatus, windowWidth
        };

        // Ensure each facets has an `order` property and default it to 0 if not.
        // Also 'merge in terms' for each facet (i.e. add in active filtered terms with 0 results)
        // And then sort by `order`.
        const useFacets = _.sortBy(
            _.map(
                _.uniq(facets, false, function(f){ return f.field; }), // Ensure facets are unique, field-wise.
                function(f){
                    const newFacet = { ...f, order: f.order || 0 };
                    if (f.aggregation_type === "terms") {
                        newFacet.terms = mergeTerms(f, filters);
                    }
                    return newFacet;
                }
            ),
            'order'
        );
        const facetLen = useFacets.length;

        // We try to initially open some Facets depending on available screen size or props.
        // We might get rid of this feature at some point as the amount of Facets are likely to increase.
        // Or we could just set defaultFacetOpen = false if # facets > 10 or something.
        // Basically seems like should adjust `maxTermsToShow` based on total # of facets...
        const maxTermsToShow = (
            (typeof windowHeight === 'number' && !isNaN(windowHeight) ? Math.floor(windowHeight / 60) : 15)
            - Math.floor(useFacets.length / 4)
        );

        let facetIndexWherePastXTerms;
        let currTermCount = 0;
        for (facetIndexWherePastXTerms = 0; facetIndexWherePastXTerms < facetLen; facetIndexWherePastXTerms++) {
            if (useFacets[facetIndexWherePastXTerms].aggregation_type === "stats") { // Range Facet (shows 2 'terms' or fields)
                currTermCount += 2;
            } else {
                // Terms; Take into account 'view more' button
                // Slightly deprecated as doesn;t take into account 'mergeTerms'.
                // Maybe could move mergeTerms stuff up into here.
                currTermCount += Math.min(useFacets[facetIndexWherePastXTerms].terms.length, persistentCount);
            }
            if (currTermCount > maxTermsToShow) {
                break;
            }
        }

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

            // Default Open if ~~mounted~~ windowWidth not null (aka we mounted) and:
            const defaultFacetOpen = typeof windowWidth !== "number" ? false : !!(rgs !== 'xs' && i < (facetIndexWherePastXTerms || 1));

            if (aggregation_type === "stats") {
                const { fromVal, toVal } = getRangeValueFromFilters(facet, filters);
                const anySelected = fromVal !== null || toVal !== null;
                const isStatic = facet.min === facet.max;
                // defaultFacetOpen = defaultFacetOpen || (!isStatic && _.any(filters || [], function(fltr){
                //     return (fltr.field === facetField + ".from") || (fltr.field === facetField + ".to");
                // })) || false;
                return <RangeFacet {...commonProps} facet={facet} key={facetField} anyTermsSelected={anySelected} {...{ defaultFacetOpen, isStatic, grouping, fromVal, toVal }} />;
            }
            if (aggregation_type === "terms"){
                //const terms = mergeTerms(facet, filters); // Add in any terms specified in `filters` but not in `facet.terms` - in case someone hand-put that into URL.
                const termsSelectedCount = countTermsSelected(facet.terms, facet, filters);
                const anySelected = termsSelectedCount !== 0;
                const isStatic = !anySelected && facet.terms.length === 1; // TermsFacet.isStatic(facet);
                //defaultFacetOpen = defaultFacetOpen || anySelected;
                return <TermsFacet {...commonProps} terms={facet.terms} facet={facet} key={facetField} anyTermsSelected={anySelected} {...{ defaultFacetOpen, isStatic, grouping, termsSelectedCount }} />;
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

    static segmentOutCommonProperties(facetComponents, separateSingleTermFacets){
        const staticFacetElements = [];
        let selectableFacetElements = [];
        if (separateSingleTermFacets){
            facetComponents.forEach(function(renderedFacet){
                if (renderedFacet.props.isStatic){
                    staticFacetElements.push(renderedFacet);
                } else {
                    selectableFacetElements.push(renderedFacet);
                }
            });
        } else {
            selectableFacetElements = facetComponents;
        }
        return { selectableFacetElements, staticFacetElements };
    }

    constructor(props){
        super(props);
        this.onFilterExtended = this.onFilterExtended.bind(this);
        this.getTermStatus = this.getTermStatus.bind(this);
        this.renderFacets = this.renderFacets.bind(this);
        this.memoized = {
            segmentOutCommonProperties: memoize(FacetList.segmentOutCommonProperties),
            createFacetComponents: memoize(FacetList.createFacetComponents, function(paramSetA, paramSetB){
                const [ propsA, ...argsA ] = paramSetA;
                const [ propsB, ...argsB ] = paramSetB;
                var i;
                for (i = 0; i < argsA.length; i++) {
                    if (argsA[i] !== argsB[i]) {
                        //console.log("CHANGED1", argsA[i], argsB[i])
                        return false;
                    }
                }

                const keys = Object.keys(propsA);
                const keysLen = keys.length;
                for (i = 0; i < keysLen; i++) {
                    if (propsA[keys[i]] !== propsB[keys[i]]) {
                        //console.log("CHANGED2", keys[i], propsA[keys[i]], propsB[keys[i]])
                        return false;
                    }
                }

                return true;
            })
        };
    }

    /**
     * Calls props.onFilter after sending analytics.
     * N.B. When rangeFacet calls onFilter, it creates a `term` with `key` property
     * as no 'terms' exist when aggregation_type === stats.
     */
    onFilterExtended(facet, term, callback){
        const { onFilter, filters: contextFilters } = this.props;
        const { field } = facet;
        const { key: termKey } = term;

        const statusAndHref = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, contextFilters);
        const isUnselecting = !!(statusAndHref.href);

        analytics.event('FacetList', (isUnselecting ? 'Unset Filter' : 'Set Filter'), {
            field,
            'term'              : termKey,
            'eventLabel'        : analytics.eventLabelFromChartNode({ field, 'term' : termKey }),
            'currentFilters'    : analytics.getStringifiedCurrentFilters(
                contextFiltersToExpSetFilters(contextFilters || null)
            ), // 'Existing' filters, or filters at time of action, go here.
        });

        return onFilter(...arguments);
    }

    getTermStatus(term, facet){
        const { filters: contextFilters } = this.props;
        return getTermFacetStatus(term, facet, contextFilters);
    }

    /** Internally calls memoized function to return list of rendered facet JSX components. */
    renderFacets(){
        const propsUsed = {
            ..._.pick(this.props, "facets", "href", "schemas", "filters", "itemTypeForSchemas", "windowWidth", "windowHeight", "termTransformFxn", "persistentCount", "separateSingleTermFacets"),
            onFilter: this.onFilterExtended,
            getTermStatus: this.getTermStatus
        };
        return this.memoized.createFacetComponents(propsUsed);
    }

    render() {
        const {
            facets = null,
            className,
            title = "Properties",
            onClearFilters,
            showClearFiltersButton = false,
            separateSingleTermFacets = false,
            maxBodyHeight: maxHeight = null
        } = this.props;

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
        const bodyProps = {
            className: "facets-body" + (typeof maxHeight === "number" ? " has-max-height" : ""),
            style: typeof maxHeight === "number" ? { maxHeight } : null
        };

        const { staticFacetElements, selectableFacetElements } = this.memoized.segmentOutCommonProperties(allFacetElements, separateSingleTermFacets);

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
                <div {...bodyProps}>
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
