import React from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'query-string';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import Overlay from 'react-bootstrap/esm/Overlay';

import { patchedConsoleInstance as console } from './../../../util/patched-console';
import { getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters, buildSearchHref, contextFiltersToExpSetFilters, getTermFacetStatus } from './../../../util/search-filters';
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
import { RangeFacet, getRangeValuesFromFiltersByField } from './RangeFacet';
import { mergeTerms, countActiveTermsByField } from './FacetTermsList';
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
        if (aggregation_type === "stats" || aggregation_type === "range") {
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

    // Endpoint will redirect/correct to this anyway, may as well keep consistent.
    // Alternatively we could/should save href we get back from search response (which
    // should then also be correct... and probably be more reliable.. will try do..)
    return targetSearchHref.replaceAll("%20", "+");
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
        'context' : PropTypes.shape({
            'filters' : PropTypes.arrayOf(PropTypes.object).isRequired, // context.filters
        }).isRequired,
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
        'onFilterMultiple': PropTypes.func, // Same as onFilter, but processes multiple filter changes in one go
        'separateSingleTermFacets' : PropTypes.bool,
        'maxBodyHeight' : PropTypes.number,
        'useRadioIcon': PropTypes.bool.isRequired, // Show either checkbox (False) or radio icon (True) for term component - it is only for styling, not intended to implement single selection (radio) or multiple selection (checkbox)
        'persistSelectedTerms': PropTypes.bool.isRequired // if True selected/omitted terms are escalated to top, otherwise each term is rendered in regular order. Moreover, inline search options are not displayed if it is False.
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
        'onFilterMultiple' : function(filterObjArr) {
            console.log('FacetList: props.onFilterMultiple(');
            filterObjArr.forEach((filterObj, i) => {
                const { facet, term, callback } = filterObj;
                console.log('Item #' + i + ": (" + facet.field, ", " + term.key + ', callback)');
                console.log(facet, term);
                if (i === 0 && typeof callback === 'function') {
                    setTimeout(callback, 1000);
                }
            });
            console.log(")");
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
        },
        'useRadioIcon': false,
        'persistSelectedTerms': true
    };

    /** Remove any duplicates, merge in filters without selections as terms */
    static sortedFinalFacetObjects(facets, filters) {
        return _.sortBy(
            _.map(
                _.uniq(facets, false, function(f){ return f.field; }), // Ensure facets are unique, field-wise.
                function(f){
                    const newFacet = { ...f, order: f.order || 0 };
                    if (f.aggregation_type === "terms") {
                        // Add in any terms specified in `filters` but not in `facet.terms` - in case someone hand-put that into URL or something.
                        newFacet.terms = mergeTerms(f, filters);
                    }
                    return newFacet;
                }
            ),
            'order'
        );
    }

    static getInitialOpenFacetsAfterMount(facetComponents, persistentCount, windowHeight){
        const filteredFlattenedComponents = facetComponents.reduce(function(m, v){
            if (v.props.facet) { // Actual facet, include.
                m.push(v);
            } else { // A group; flatten its children upward
                m = m.concat(v.props.children);
            }
            return m;
        }, []);
        const facetLen = filteredFlattenedComponents.length;

        // We try to initially open some Facets depending on available screen size or props.
        // We might get rid of this feature at some point as the amount of Facets are likely to increase.
        // Or we could just set defaultFacetOpen = false if # facets > 10 or something.
        // Basically seems like should adjust `maxTermsToShow` based on total # of facets...
        const maxTermsToShow = (
            (typeof windowHeight === 'number' && !isNaN(windowHeight) ? Math.floor(windowHeight / 60) : 15)
            - Math.floor(facetLen / 4)
        );

        let facetIndexWherePastXTerms;
        let currTermCount = 0;
        for (facetIndexWherePastXTerms = 0; facetIndexWherePastXTerms < facetLen; facetIndexWherePastXTerms++) {
            if (filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.aggregation_type === "stats") {
                // Range facet with stats aggregation Facet (shows 2 'terms' or fields)
                currTermCount += 2;
            } else if (filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.aggregation_type === "range") {
                // Range facet with range list (see comment for Terms in else)
                currTermCount += Math.min(filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.ranges.length, persistentCount);
            } else {
                // Terms; Take into account 'view more' button
                // Slightly deprecated as doesn;t take into account 'mergeTerms'.
                // Maybe could move mergeTerms stuff up into here.
                currTermCount += Math.min(filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.terms.length, persistentCount);
            }
            if (currTermCount > maxTermsToShow) {
                break;
            }
        }

        const openFacets = {};

        for (var i = 0; i < facetIndexWherePastXTerms; i++) {
            //console.log("XX", facetIndexWherePastXTerms, filteredFlattenedComponents[i], filteredFlattenedComponents, filteredFlattenedComponents[i].props.facet.grouping)
            openFacets[filteredFlattenedComponents[i].props.facet.field] = true;
            if (filteredFlattenedComponents[i].props.facet.grouping) {
                // Set group to be open as well
                openFacets["group:" + filteredFlattenedComponents[i].props.facet.grouping] = true;
            }
        }

        return openFacets;
    }

    /**
     * We use a function instead of functional/memoized components because we want literal list of JSX components.
     * First param (props) is memoized by its keys' values.
     * These JSX components might later be segmented or something.
     *
     * @param {{ href: string, schemas: Object<string, Object>, itemTypeForSchemas: string, termTransformFxn: function, onFilter: function, getTermStatus: function }} props - Passed to all facet components.
     */
    static createFacetComponents(props, useFacets, activeTermCountByField, rangeValuesByField){

        // The logic within `Facet` `render`, `componentDidMount`, etc. isn't executed
        // until is rendered by some other component's render method.
        // We can sort/manipulate/transform these still according to their `props.` values and such.
        const renderedFacets = useFacets.map(function(facet, i){
            const {
                grouping = null,
                field: facetField,
                aggregation_type = "terms"
            } = facet;

            if (aggregation_type === "stats" || aggregation_type === "range") {
                const { fromVal = null, toVal = null } = rangeValuesByField[facetField] || {};
                const anySelected = fromVal !== null || toVal !== null;
                const isStatic = facet.min === facet.max;
                // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
                // This approach used for resetting state.fromVal and state.toVal within RangeFacet.
                return <RangeFacet {...props} {...{ isStatic, grouping, fromVal, toVal, facet }} key={facetField} anyTermsSelected={anySelected}  />;
            }

            if (aggregation_type === "terms"){
                const termsSelectedCount = activeTermCountByField[facetField] || 0;// countTermsSelected(facet.terms, facet, filters);
                const anySelected = termsSelectedCount !== 0;
                const isStatic = !anySelected && facet.terms.length === 1;
                return <TermsFacet {...props} {...{ isStatic, grouping, termsSelectedCount, facet }} key={facetField} anyTermsSelected={anySelected} />;
            }

            throw new Error("Unknown aggregation_type");

        });

        const componentsToReturn = [];  // first populated with ungrouped facets, then facet groups are spliced in
        const groups = new Map();       // { groupTitle: { index: 0, facets: [facet1, facet2, facet3, ...] } }; Map() to preserve order.

        // Separate out facets with .grouping into groups.
        renderedFacets.forEach(function(renderedFacet, idx){
            const { grouping } = renderedFacet.props;
            if (!grouping) {
                // add ungrouped facets straight to componentsToReturn
                componentsToReturn.push(renderedFacet);
                return;
            }

            // Get existing or create new.
            const existingGroup = groups.get(grouping) || ({
                index: componentsToReturn.length,
                children: [],
                facetOpen: false
            });

            existingGroup.children.push(renderedFacet);
            groups.set(grouping, existingGroup);
        });

        const groupsArr = [ ...groups ];

        // Check, render, and add groups into `componentsToReturn`
        groupsArr.forEach(function([groupTitle, facetGroup], groupIndex){
            const { children: facetsInGroup, index } = facetGroup;
            if (facetsInGroup.length === 1) {
                // Doesn't need to be in group, put back into `componentsToReturn`
                componentsToReturn.splice(index, 0, facetsInGroup[0]);
            } else {
                componentsToReturn.splice(index, 0,
                    // `facetGroup` contains `defaultGroupOpen`, `index`, `facets`.
                    <FacetOfFacets {...props} {...facetGroup} title={groupTitle} key={groupTitle} />
                );
            }
            // Increment remaining group indices to match new length of `componentsToReturn`.
            // We're not modifying the actual `groupsArr` list itself ever (e.g. removing/adding)
            // so `fromIdx` / `groupIndex` should always stay stable.
            // We increment facetGroup.index which is the index in `componentsToReturn`.
            groupsArr.slice(groupIndex).forEach(function([ , subsequentFacetGroup]){
                subsequentFacetGroup.index++;
            });
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

    static extendComponentsWithFacetOpen(facetComponents, openFacets){
        return facetComponents.map(function(facetElem){
            // Finally, add in `facetOpen` state.
            // Avoid doing this in `createFacetComponents` since is memoized and does other more expensive ops.
            const {
                facet : { field = null } = {},
                title: groupTitle = null
            } = facetElem.props;

            let facetOpen = false;

            if (typeof field === "string") {
                // Facet Elem
                facetOpen = openFacets[field];
                if (facetOpen) { // Don't clone if don't need to; don't pass openFacets to avoid extraneous re-renders.
                    return React.cloneElement(facetElem, { facetOpen });
                }
                return facetElem;
            } else if (typeof groupTitle === "string") {
                // Group Elem; pass in openFacets always as well to add facetOpen to group children
                facetOpen = openFacets["group:" + groupTitle];
                return React.cloneElement(facetElem, { facetOpen, openFacets });
            } else {
                throw new Error("Unexpected Facet Component");
            }

        });
    }

    /**
     * Used by this.onFilterExtended and this.onFilterMultipleExtended to send google analytics on a selected facet before filtering
     */
    static sendAnalyticsPreFilter(facet, term, contextFilters) {
        const { field } = facet;
        const { key: termKey } = term;

        const statusAndHref = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, contextFilters);
        const isUnselecting = !!(statusAndHref.href);

        return analytics.event('FacetList', (isUnselecting ? 'Unset Filter' : 'Set Filter'), {
            field,
            'term'              : termKey,
            'eventLabel'        : analytics.eventLabelFromChartNode({ field, 'term' : termKey }),
            'currentFilters'    : analytics.getStringifiedCurrentFilters(
                contextFiltersToExpSetFilters(contextFilters || null)
            ), // 'Existing' filters, or filters at time of action, go here.
        });
    }

    constructor(props){
        super(props);

        console.log("FacetList props,", props);
        this.onFilterExtended = this.onFilterExtended.bind(this);
        this.onFilterMultipleExtended = this.onFilterMultipleExtended.bind(this);
        this.getTermStatus = this.getTermStatus.bind(this);
        this.handleToggleFacetOpen = this.handleToggleFacetOpen.bind(this);
        this.handleCollapseAllFacets = this.handleCollapseAllFacets.bind(this);
        this.setOpenPopover = this.setOpenPopover.bind(this);
        this.renderFacetComponents = this.renderFacetComponents.bind(this);
        this.memoized = {
            countActiveTermsByField: memoize(countActiveTermsByField),
            getRangeValuesFromFiltersByField: memoize(getRangeValuesFromFiltersByField),
            sortedFinalFacetObjects: memoize(FacetList.sortedFinalFacetObjects),
            segmentOutCommonProperties: memoize(FacetList.segmentOutCommonProperties),
            createFacetComponents: memoize(FacetList.createFacetComponents, function(paramSetA, paramSetB){
                const [ propsA, ...argsA ] = paramSetA;
                const [ propsB, ...argsB ] = paramSetB;
                var i;
                for (i = 0; i < argsA.length; i++) {
                    if (argsA[i] !== argsB[i]) {
                        return false;
                    }
                }

                const keys = Object.keys(propsA);
                const keysLen = keys.length;
                for (i = 0; i < keysLen; i++) {
                    if (propsA[keys[i]] !== propsB[keys[i]]) {
                        return false;
                    }
                }

                return true;
            }),
            extendComponentsWithFacetOpen: memoize(FacetList.extendComponentsWithFacetOpen),
            getInitialOpenFacetsAfterMount: memoize(FacetList.getInitialOpenFacetsAfterMount)
        };

        this.state = {
            openFacets : {},    // will be keyed by facet.field, value will be bool
            openPopover: null,  // will contain `{ ref: React Ref, popover: JSX element/component }`. We might want to move this functionality up into like App.js.
            filteringFieldTerm: null    // will contain `{ field: string, term: string|[from, to] }`. Used to show loading indicators on clicked-on terms.
        };
    }

    componentDidMount(){
        const { windowHeight, windowWidth, facets, persistentCount = 10, persistSelectedTerms = true, context: { filters } = {} } = this.props;
        const rgs = responsiveGridState(windowWidth || null);
        const { selectableFacetElements } = this.renderFacetComponents(); // Internally memoized - should be performant.

        if (rgs === "xs") {
            ReactTooltip.rebuild();
            return;
        }

        //default open facets for selected terms are not persistent case
        if (persistSelectedTerms === false && filters && filters.length > 0) {
            const openFacets = filters.reduce(function (m, v) {
                if (v && v.field) {
                    m[v.field] = true;
                }
                return m;
            }, {});
            this.setState({ openFacets: openFacets });
            return;
        }

        // Skip if we have many facets. We're simply reusing persistentCount variable here
        // but could really be any number/value (8 ? windowHeight // 100 ?)
        if (selectableFacetElements.length >= persistentCount) {
            ReactTooltip.rebuild();
            return;
        }

        this.setState({
            openFacets: this.memoized.getInitialOpenFacetsAfterMount(selectableFacetElements, persistentCount, windowHeight)
        });
    }

    componentDidUpdate(prevProps, prevState){
        const { context: prevContext } = prevProps;
        const { openFacets: prevOpenFacets, openPopover: prevOpenPopover } = prevState;
        const { openFacets, openPopover } = this.state;
        const { context, addToBodyClassList, removeFromBodyClassList } = this.props;

        if (openFacets !== prevOpenFacets) {
            ReactTooltip.rebuild();
        }

        if (openPopover !== prevOpenPopover && typeof addToBodyClassList === "function" && typeof removeFromBodyClassList === "function") {
            if (!openPopover) {
                removeFromBodyClassList("overflow-hidden");
            } else if (openPopover && !prevOpenPopover) {
                addToBodyClassList("overflow-hidden");
            }
        }

        if (context !== prevContext) {

            const stateChange = {};

            // If new filterset causes a facet to drop into common properties section, clean up openFacets state accordingly.
            const { staticFacetElements } = this.renderFacetComponents(); // Should be performant re: memoization
            const nextOpenFacets = _.clone(openFacets);
            let changedOpenFacets = false;
            staticFacetElements.forEach(function(facetComponent){
                if (nextOpenFacets[facetComponent.props.facet.field]) {
                    delete nextOpenFacets[facetComponent.props.facet.field];
                    changedOpenFacets = true;
                }
            });

            if (changedOpenFacets) {
                stateChange.openFacets = nextOpenFacets;
            }

            // Newly loaded search response should clear any filteringFieldTerm state.
            stateChange.filteringFieldTerm = null;


            this.setState(stateChange);
        }

    }

    /**
     * Calls props.onFilter after sending analytics.
     * N.B. When rangeFacet calls onFilter, it creates a `term` with `key` property
     * as no 'terms' exist when aggregation_type === stats.
     */
    onFilterExtended(facet, term, callback){
        const { onFilter, context: { filters: contextFilters } } = this.props;
        FacetList.sendAnalyticsPreFilter(facet, term, contextFilters);

        // Used to show loading indicators on clicked-on terms.
        // (decorative, not core functionality, so not implemented for `onFilterMultipleExtended`)
        // `facet.facetFieldName` is passed in only from RangeFacet, as the real `field` would have a '.from' or '.to' appendage.
        this.setState({
            "filteringFieldTerm": {
                "field": (facet.facetFieldName || facet.field),
                "term": term.key
            }
        }, function(){
            onFilter(facet, term, callback);
        });
    }

    onFilterMultipleExtended(filterObjArray, callback) {
        const { onFilterMultiple, context: { filters: contextFilters } } = this.props;

        // Detect if setting both values of range field and set state.filteringFieldTerm = { field: string, term:string|[from, to] }.
        const facetFieldNames = new Set();
        const uniqueVals = new Set();

        filterObjArray.forEach((filterObj) => {
            const { facet, term } = filterObj;
            facetFieldNames.add(facet.facetFieldName || null);
            uniqueVals.add(term.key);
            FacetList.sendAnalyticsPreFilter(facet, term, contextFilters);
        });

        if (facetFieldNames.size === 1) {
            // 2 values being set of same field
            // (this is only use-case currently for onFilterMultipleExtended, via RangeFacet, but could change in future)
            const [ facetFieldName ] = [ ...facetFieldNames ];
            if (facetFieldName !== null) {
                this.setState({
                    "filteringFieldTerm": {
                        "field": facetFieldName,
                        "term": uniqueVals.size > 1 ? [...uniqueVals].sort() : [...uniqueVals][0]
                    }
                }, function(){
                    onFilterMultiple(filterObjArray, callback);
                });
                return;
            }
        }

        onFilterMultiple(filterObjArray, callback);
    }

    getTermStatus(term, facet){
        const { context: { filters: contextFilters } } = this.props;
        return getTermFacetStatus(term, facet, contextFilters);
    }

    handleToggleFacetOpen(facetField, nextOpen = null) {
        this.setState(function({ openFacets: prevOpenFacets }){
            const openFacets = _.clone(prevOpenFacets);
            if (typeof nextOpen !== "boolean") {
                nextOpen = openFacets[facetField];
            }

            if (!nextOpen) {
                delete openFacets[facetField];
            } else {
                openFacets[facetField] = true;
            }

            return { openFacets };
        });
    }

    setOpenPopover(nextPopover=null, cb=null){
        this.setState(function({ openPopover = null }){
            if (!openPopover) {
                if (!nextPopover) return null;
                return { openPopover: nextPopover };
            } else {
                if (!nextPopover) {
                    return { openPopover: null };
                }
                const { ref: prevRef, popover: prevPopover } = openPopover;
                const { ref, popover } = nextPopover;
                if (ref === prevRef && popover === prevPopover) {
                    return null;
                }
                return { openPopover: nextPopover };
            }
        }, cb);
    }

    handleCollapseAllFacets(e){
        this.setState({ openFacets : {} });
    }

    /** We want an actual array(s) of JSX components to potentially shift, assess, transform etc. rather than Functional Component that renders list, for example. */
    renderFacetComponents(){
        const {
            facets = null,
            separateSingleTermFacets = false,
            context,
            href, schemas, itemTypeForSchemas, termTransformFxn, persistentCount,
            useRadioIcon, persistSelectedTerms
        } = this.props;
        const { filters } = context;
        const { openFacets, openPopover, filteringFieldTerm } = this.state;
        const facetComponentProps = {
            href, schemas, context, itemTypeForSchemas, termTransformFxn, persistentCount, separateSingleTermFacets,
            openPopover,
            filteringFieldTerm,
            useRadioIcon, persistSelectedTerms,
            onFilter:       this.onFilterExtended,
            onFilterMultiple: this.onFilterMultipleExtended,
            getTermStatus:  this.getTermStatus,
            onToggleOpen:   this.handleToggleFacetOpen,
            setOpenPopover: this.setOpenPopover,
        };

        const { staticFacetElements, selectableFacetElements: rawerSelectableFacetElems } = this.memoized.segmentOutCommonProperties(
            this.memoized.createFacetComponents(
                facetComponentProps,
                this.memoized.sortedFinalFacetObjects(facets, filters),
                this.memoized.countActiveTermsByField(filters),
                this.memoized.getRangeValuesFromFiltersByField(facets, filters),
            ),
            separateSingleTermFacets
        );

        // We can skip extending static facet elements with facetOpen
        const selectableFacetElements = this.memoized.extendComponentsWithFacetOpen(rawerSelectableFacetElems, openFacets);

        return { selectableFacetElements, staticFacetElements };
    }

    render() {
        const {
            facets = null,
            title,
            onClearFilters = null,
            showClearFiltersButton = false,
            maxBodyHeight: maxHeight = null,
            isContextLoading = false
        } = this.props;
        const { openFacets, openPopover } = this.state;
        const { popover: popoverJSX, ref: popoverTargetRef } = openPopover || {};

        if (!facets || !Array.isArray(facets) || facets.length === 0) {
            return (
                <div className="pt-2 pb-2" style={{ color : "#aaa" }}>
                    No facets available
                </div>
            );
        }

        const bodyProps = {
            className: "facets-body" + (typeof maxHeight === "number" ? " has-max-height" : ""),
            style: typeof maxHeight === "number" ? { maxHeight } : null
        };

        const { staticFacetElements, selectableFacetElements } = this.renderFacetComponents();

        return (
            <React.Fragment>
                <div className="facets-container facets with-header-bg" data-context-loading={isContextLoading}>
                    <FacetListHeader {...{ openFacets, title, onClearFilters, showClearFiltersButton }} onCollapseFacets={this.handleCollapseAllFacets} />
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
                { popoverJSX && popoverTargetRef ? ( /* `rootClose rootCloseEvent="click"` didn't work as props here */
                    <Overlay show target={popoverTargetRef} flip placement="auto" rootClose rootCloseDisabled={false}>
                        { popoverJSX }
                    </Overlay>
                ) : null }
            </React.Fragment>
        );
    }
}


export const FacetListHeader = React.memo(function FacetListHeader(props){
    const {
        title = "Properties",
        openFacets = {},
        showClearFiltersButton = false,
        onClearFilters = null,
        onCollapseFacets
    } = props;
    const anyFacetsOpen = Object.keys(openFacets).length !== 0;
    return (
        <div>
            <div className="row facets-header">
                <div className="col facets-title-column text-truncate">
                    <i className="icon icon-fw icon-filter fas"></i>
                    &nbsp;
                    <h4 className="facets-title">{ title }</h4>
                </div>
            </div>
            <div className="row facets-controls">
                <div className="d-flex w-100">
                    <div className="properties-controls d-flex p-1 w-100" role="group" aria-label="Properties Controls">
                        <button type="button" disabled={!anyFacetsOpen} style={{ flex: "1" }} className="btn btn-xs btn-outline-primary" onClick={onCollapseFacets} data-tip="Collapse all facets below">
                            <i className="icon icon-fw icon-minus fas"/> Collapse All
                        </button>
                        { showClearFiltersButton ?
                            <button type="button" disabled={typeof onClearFilters !== "function"} style={{ flex: "1" }} className="btn btn-xs btn-outline-primary" onClick={onClearFilters} data-tip="Clear all filters">
                                <i className="icon icon-fw icon-times fas"/> Clear All
                            </button> : null }
                    </div>
                </div>
            </div>
            {/*
            <div className={"col-auto clear-filters-control" + (showClearFiltersButton ? '' : ' placeholder')}>
                <a href="#" onClick={onClearFilters} className={"btn clear-filters-btn btn-xs " + clearButtonClassName}>
                    <i className="icon icon-fw icon-times fas mr-03"/>
                    <span>Clear All</span>
                </a>
            </div>
            <div className={"col-auto clear-filters-control" + (anyFacetsOpen ? '' : ' placeholder')}>
                <a href="#" onClick={onClearFilters} className={"btn clear-filters-btn btn-xs " + clearButtonClassName}>
                    <i className="icon icon-fw icon-minus fas mr-03"/>
                    <span>Clear All</span>
                </a>
            </div>
            */}
        </div>
    );
});
