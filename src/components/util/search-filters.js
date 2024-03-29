
var Alerts = null; //require('./../alerts');

import _ from 'underscore';
import url from 'url';
import queryString from 'query-string';
import { navigate } from './navigate';
import { isServerSide } from './misc';


/**
 * @deprecated
 * If the given term is selected, return the href for the term from context.filters.
 *
 * @param {string} term - Term for which existence of active filter is checked.
 * @param {string} field - Field for which filter is checked.
 * @param {{ 'field' : string, 'term' : string, 'remove' : string }[]} filters - Filters as supplied by context.filters in API response.
 * @param {boolean} [includePathName] - If true, will return the pathname in addition to the URI search query.
 * @returns {!string} URL to remove active filter, or null if filter not currently active for provided field:term pair.
 */
export function getUnselectHrefIfSelectedFromResponseFilters(term, facet, filters, includePathName = false) {
    var field   = facet.field,
        isRange = facet.aggregation_type && ['range', 'date_histogram', 'histogram'].indexOf(facet.aggregation_type) > -1,
        i, filter, parts, retHref = '';

    // THE CONTENTS UNDER THIS IF CONDITION WILL CHANGE ONCE WE CREATE NEW 'RANGE' FACET COMPONENT
    if (facet.aggregation_type && ['range', 'date_histogram', 'histogram'].indexOf(facet.aggregation_type) > -1) {
        var toFilter, fromFilter;

        if (facet.aggregation_type === 'range'){
            toFilter    = _.findWhere(filters, { 'field' : field + '.to',   'term' : term.to }),
            fromFilter  = _.findWhere(filters, { 'field' : field + '.from', 'term' : term.from });
        }
        //else if (facet.aggregation_type === 'date_histogram'){
        // var interval = getDateHistogramIntervalFromFacet(facet) || 'month',
        //     toDate = moment.utc(term.key);
        // toDate.add(1, interval + 's');
        // toFilter    = _.findWhere(filters, { 'field' : field + '.to',   'term' : toDate.format().slice(0,10) }),
        // fromFilter  = _.findWhere(filters, { 'field' : field + '.from', 'term' : term.key });
        //}
        else {
            throw new Error('Histogram not currently supported.');
            // Todo: var interval = ....
        }

        if (toFilter && !fromFilter){
            parts = url.parse(toFilter['remove']);
            if (includePathName) {
                retHref += parts.pathname;
            }
            retHref += parts.search;
            return retHref;
        } else if (!toFilter && fromFilter){
            parts = url.parse(fromFilter['remove']);
            if (includePathName) {
                retHref += parts.pathname;
            }
            retHref += parts.search;
            return retHref;
        } else if (toFilter && fromFilter){
            var partsFrom   = url.parse(fromFilter['remove'], true),
                partsTo     = url.parse(toFilter['remove'], true),
                partsFromQ  = partsFrom.query,
                partsToQ    = partsTo.query,
                commonQs    = {};

            _.forEach(_.keys(partsFromQ), function(qk){
                if (typeof partsToQ[qk] !== 'undefined'){
                    if (Array.isArray(partsToQ[qk]) || Array.isArray(partsFromQ[qk])){
                        var a1, a2;
                        if (Array.isArray(partsToQ[qk])) {
                            a1 = partsToQ[qk];
                        } else {
                            a1 = [partsToQ[qk]];
                        }
                        if (Array.isArray(partsFromQ[qk])) {
                            a2 = partsFromQ[qk];
                        } else {
                            a2 = [partsFromQ[qk]];
                        }
                        commonQs[qk] = _.intersection(a1, a2);
                    } else {
                        commonQs[qk] = partsToQ[qk];
                    }
                }
            });

            retHref = '?' + queryString.stringify(commonQs);
            if (includePathName) {
                retHref += partsFrom.pathname;
            }
            return retHref;
        }

    } else {
        // Terms
        for (i = 0; i < filters.length; i++) {
            filter  = filters[i];
            if (filter.field == field && filter.term == term.key) {
                parts = url.parse(filter.remove);
                if (includePathName) {
                    retHref += parts.pathname;
                }
                retHref += parts.search;
                return retHref;
            }
        }

    }
    return null;
}

/**
 * If the given term is selected or omitted, return the status and href for the term from context.filters.
 *
 * @param {string} term - Term for which existence of active filter is checked.
 * @param {string} field - Field for which filter is checked.
 * @param {{ 'field' : string, 'term' : string, 'remove' : string }[]} filters - Filters as supplied by context.filters in API response.
 * @param {boolean} [includePathName] - If true, will return the pathname in addition to the URI search query.
 * @returns {{ 'status' : string, 'href' : string }} status: one of [selected/omitted/none], href: URL to remove active filter, or null if filter not currently active for provided field:term pair.
 */
export function getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, filters, includePathName = false) {
    //workaround: '!=' condition adds '!' to the end of facet.field in StaticSingleTerm, we remove it
    const field = facet.field.endsWith('!') ? facet.field.slice(0, -1) : facet.field;

    let i, j, filter, parts, retHref = '', found = false, status = "selected";

    const isGroupingTerm = term.terms && Array.isArray(term.terms);

    if (facet.aggregation_type === "stats"){
        for (i = 0; i < filters.length; i++) {
            filter = filters[i];
            const filterTermValue = parseFloat(filter.term);
            if (isNaN(filterTermValue)) continue;
            if ((filter.field === field) && (filterTermValue === term.key)){
                found = true;
                break;
            }
        }
    } else {
        // Terms
        for (i = 0; i < filters.length; i++) {
            filter = filters[i];
            if (!isGroupingTerm && filter.field === field && filter.term === term.key) {
                found = true;
                break;
            } else if (!isGroupingTerm && filter.field.endsWith('!') && filter.field.slice(0, -1) === field && filter.term === term.key) {
                found = true;
                status = "omitted";
                break;
            } else if (isGroupingTerm && (field === filter.field || (filter.field.endsWith('!') && field === filter.field.slice(0, -1))) && term.terms && _.any(term.terms, function (t) { return t.key === filter.term; })) {
                let selectedTermsCount = 0, omittedTermsCount = 0;
                for (j = 0; j < term.terms.length; j++) {
                    const t = term.terms[j];
                    const selected = _.any(filters, function (f) { return f.field === field && f.term === t.key; });
                    if (selected) {
                        selectedTermsCount++;
                    } else {
                        const omitted = _.any(filters, function (f) { return f.field.endsWith('!') && f.field.slice(0, -1) === field && f.term === t.key; });
                        if (omitted) { omittedTermsCount++; }
                    }
                }
                if ((selectedTermsCount + omittedTermsCount) > 0 ) {
                    if (selectedTermsCount == term.terms.length) { found = true; }
                    else if (omittedTermsCount == term.terms.length) { found = true; status = 'omitted'; }
                    else { return { 'status': 'partial', 'href': null }; }
                }
                break;
            }
        }
    }
    if (found) {
        parts = url.parse(filter.remove, isGroupingTerm);
        if (includePathName) {
            retHref += parts.pathname;
        }
        let facetField = facet.field;
        if (isGroupingTerm) {
            if (status === 'omitted' && !facet.field.endsWith("!")) {
                facetField = facet.field + "!";
            } else if (status === 'selected' && facet.field.endsWith("!")) {
                facetField = facet.field.slice(0, -1);
            }
        }
        if (isGroupingTerm && parts.query[facetField]) {
            const tmp = Array.isArray(parts.query[facetField]) ? parts.query[facetField] : [parts.query[facetField]];
            const cloned = _.clone(parts.query);
            cloned[facetField] = _.filter(tmp, function (v) { return !_.any(term.terms, function (t) { return t.key === v; });});
            retHref += '?' + queryString.stringify(cloned);
        } else {
            retHref += parts.search;
        }
        return { status, 'href': retHref };
    }

    return { 'status': 'none', 'href': null };
}

/**
 * Extends `searchBase` (URL) query with that of field:term and returns new URL with field:term filter query included.
 *
 * @param {string} field - What field to build for.
 * @param {string} term - What term to build for.
 * @param {string} searchBase - Original href or search base of current page.
 * @returns {string} href - Search URL.
 */
export function buildSearchHref(field, term, searchBase){
    const parts = url.parse(searchBase, true);
    const query = _.clone(parts.query);

    //term is a grouping term, it has sub terms
    if (term.terms && Array.isArray(term.terms)) {
        if (!(field in query)) {
            query[field] = [];
        } else if (typeof query[field] === 'string') {
            query[field] = [query[field]];
        }

        let fieldClear = null;
        if (field.endsWith('!')) {
            //clear include filters (if exists) when exclude is in action
            const fieldInclude = field.slice(0, -1);
            if (fieldInclude in query) {
                fieldClear = fieldInclude;
            }
        } else {
            //clear exclude filters (if exists) when include is in action
            const fieldExclude = field + '!';
            if (fieldExclude in query) {
                fieldClear = fieldExclude;
            }
        }
        //convert query param to array
        if (fieldClear && typeof query[fieldClear] === 'string') {
            query[fieldClear] = [query[fieldClear]];
        }

        term.terms.forEach((t) => {
            //add all sub terms into query
            if (query[field].indexOf(t.key) < 0) {
                query[field].push(t.key);
            }
            //clear
            if (fieldClear) {
                const clearIdx = query[fieldClear].indexOf(t.key);
                if (clearIdx >= 0) {
                    query[fieldClear].splice(clearIdx, 1);
                }
            }
        });
    } else {
        //term is a regular term, has no sub terms
        if (field in query) {
            if (Array.isArray(query[field])) {
                query[field] = query[field].concat(term.key);
            } else {
                query[field] = [query[field]].concat(term.key);
            }
        } else {
            query[field] = term.key;
        }
    }

    const queryStr = queryString.stringify(query);
    parts.search = queryStr && queryStr.length > 0 ? ('?' + queryStr) : '';

    return url.format(parts);
}


/**
 * @deprecated
 * Given a field/term, add or remove filter from expSetFilters (in redux store) within context of current state of filters.
 *
 * @param {string} field                        Field, in object dot notation.
 * @param {string} term                         Term to add/remove from active filters.
 * @param {?Object} [filters=null]              The filters object that term is being added or removed from; if not provided it grabs state from redux store.
 * @param {?function} [callback=null]           Callback function to call after updating redux store.
 * @param {boolean} [returnInsteadOfSave=false] Whether to return a new updated expSetFilters object representing would-be changed state INSTEAD of updating redux store. Useful for doing a batched update.
 * @param {?string} [href=null]                 Current or base href to use for AJAX request if using AJAX to update.
 * @returns {?Object} Next filters object representation, or void if returnInsteadOfSave is false.
 */
export function changeFilter(
    field,
    term,
    filters,
    callback = null,
    returnInsteadOfSave = false,
    href = null,
    excludedQs = {}
){
    if (typeof excludedQs[field] === 'undefined'){

        // store currently selected filters as a dict of sets
        var tempObj = {};
        var newObj = {};

        var expSet = filters[field] ? new Set(filters[field]) : new Set();
        if (expSet.has(term)) {
            // term is already present, so delete it
            expSet.delete(term);
        } else {
            expSet.add(term);
        }
        if(expSet.size > 0){
            tempObj[field] = expSet;
            newObj = _.extend({}, filters, tempObj);
        }else{ //remove key if set is empty
            newObj = _.extend({}, filters);
            delete newObj[field];
        }

        if (returnInsteadOfSave){
            return newObj;
        } else {
            console.info("Saving new filters:", newObj);
            return saveChangedFilters(newObj, href, callback, excludedQs);
        }
    } else {
        return filters;
    }
}


/**
 * @deprecated
 * Update expSetFilters by generating new href from supplied expSetFilters and fetching/navigating to copy of current href/URL with updated query.
 * Before calling, make sure expSetFilters is a new or cloned object (not props.expSetFilters) for Redux to recognize that it has changed.
 *
 * @param {Object} newExpSetFilters    A new or cloned expSetFilters object to save. Can be empty (to clear all filters).
 * @param {?string} [href=null]        Base URL to use for AJAX request, with protocol (i.e. http(s)), hostname (i.e. domain name), and path, at minimum. Required if using AJAX.
 * @param {?function} [callback=null]  Callback function.
 * @returns {void}
 */
export function saveChangedFilters(newExpSetFilters, href=null, callback=null, requiredQs={}){
    if (!Alerts) Alerts = require('../ui/Alerts').Alerts;

    if (!href){
        if (isServerSide()){
            throw new Error("No href provided and cannot get from window as none available server-side.");
        } else {
            console.warn("No HREF (3rd param) supplied, using window.location.href. This might be wrong depending on where we should be browsing.");
            href = window.location.href;
        }
    }

    if (typeof href !== 'string') throw new Error("No valid href (3rd arg) supplied to saveChangedFilters: " + href);

    const origHref = href;
    const newHref = filtersToHref(newExpSetFilters, href, null, false, null, requiredQs);

    navigate(newHref, { replace : true, skipConfirmCheck: true }, (result)=>{
        if (result && result.total === 0){
            // Present an alert box informing user that their new selection is now being UNSELECTED because it returned no results.
            Alerts.queue(Alerts.NoFilterResults);
            // No results, unset new filters.
            navigate(origHref);
        } else {
            // Success. Remove any no result alerts.
            Alerts.deQueue(Alerts.NoFilterResults);
        }
        if (typeof callback === 'function') setTimeout(callback, 0);
    }, (err) =>{
        // Fallback callback
        if (err && (err.status === 404 || err.total === 0)) Alerts.queue(Alerts.NoFilterResults);
        if (typeof callback === 'function') setTimeout(callback, 0);
    });

}


export function getDateHistogramIntervalFromFacet(facet){
    return (facet && facet.aggregation_definition
        && facet.aggregation_definition.date_histogram
        && facet.aggregation_definition.date_histogram.interval
    );
}


/**
 * @deprecated
 * Determine if term and facet objects are 'selected'.
 * The range check is likely to change or be completely removed
 * in response to needing different component to facet ranges.
 *
 * @param {{ key: string }} term - Object for term option
 * @param {{ field: string }} facet - Object for facet, containing field
 * @param {Object} props - Props from FacetList. Should have context.filters.
 * @returns {boolean}
 */
export function determineIfTermFacetSelected(term, facet, props){
    return !!(getUnselectHrefIfSelectedFromResponseFilters(term, facet, props.context.filters));

    // The below might be re-introduced ... but more likely to be removed since we'll have different 'range' Facet component.

    /*
    var field = facet.field || null,
        fromFilter, fromFilterTerm, toFilter, toFilterTerm;

    if (facet.aggregation_type === 'date_histogram'){
        // Instead of checking presense of filters here, we find earliest from and latest to and see if are within range.

        fromFilter = _.sortBy(_.filter(props.context.filters, { 'field' : field + '.from' }), 'term');
        fromFilterTerm = fromFilter.length && fromFilter[0].term;

        toFilter = _.sortBy(_.filter(props.context.filters, { 'field' : field + '.to' }), 'term').reverse();
        toFilterTerm = toFilter.length && toFilter[0].term;

        var toDate = fromFilter && moment.utc(term.key);
        toDate && toDate.add(1, 'months');
        var toDateTerm = toDate.format().slice(0,10);

        if (fromFilterTerm && term.key >= fromFilterTerm && !toFilterTerm) return true;
        if (!fromFilterTerm && toFilterTerm && toDateTerm <= toFilterTerm) return true;
        if (fromFilterTerm && toFilterTerm && toDateTerm <= toFilterTerm && term.key >= fromFilterTerm) return true;
        return false;

        // Check both from and to
        //field       = facet.field || null;
        //fromFilter  = _.findWhere(props.context.filters, { 'field' : field + '.from', 'term' : term.key });
        //toDate      = fromFilter && moment.utc(term.key);

        //toDate && toDate.add(1, 'months');
        //toFilter = toDate && _.findWhere(props.context.filters, { 'field' : field + '.to', 'term' : toDate.format().slice(0,10) });

        //return !!(toFilter);

    } else if (facet.aggregation_type === 'range'){
        fromFilter  = _.sortBy(_.filter(props.context.filters, { 'field' : field + '.from' }), 'term');
        fromFilterTerm = fromFilter.length && fromFilter[0].term;
        toFilter    = _.sortBy(_.filter(props.context.filters, { 'field' : field + '.to' }), 'term').reverse();
        toFilterTerm = toFilter.length && toFilter[0].term;

        if (fromFilterTerm && term.from + '' >= fromFilterTerm && !toFilterTerm) return true;
        if (!fromFilterTerm && toFilterTerm && term.to + '' <= toFilterTerm) return true;
        if (fromFilterTerm && toFilterTerm && term.to + '' <= toFilterTerm && term.from + '' >= fromFilterTerm) return true;
        return false;

        //fromFilter  = _.findWhere(props.context.filters, { 'field' : field + '.from', 'term' : term.from + '' });
        //toFilter    = fromFilter && _.findWhere(props.context.filters, { 'field' : field + '.to', 'term' : term.to + '' });
        //return !!(toFilter);
    } else {
        return !!(getUnselectHrefIfSelectedFromResponseFilters(term, facet, props.context.filters));
    }
    */
}
/**
 * Get status to determine if term and facet objects are 'selected' or 'omitted' or untouched ('none').
 * The range check is likely to change or be completely removed
 * in response to needing different component to facet ranges.
 *
 * @param {{ key: string }} term - Object for term option
 * @param {{ field: string }} facet - Object for facet, containing field
 * @param {Object<string, { field: string, term: string, remove: string }>} contextFilters - from `context.filters`.
 * @returns {string} - returns one of 'selected', 'omitted' or 'none' values
 */
export function getTermFacetStatus(term, facet, contextFilters){
    const { status } = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, contextFilters);
    return status;
}

/** @deprecated */
export function isTermSelectedAccordingToExpSetFilters(term, field, expSetFilters = null){
    if (!expSetFilters) expSetFilters = currentExpSetFilters(); // If no expSetFilters are supplied, get them from Redux store.
    if (typeof expSetFilters[field] !== 'undefined' && typeof expSetFilters[field].has === 'function' && expSetFilters[field].has(term)) return true;
    return false;
}


export function unsetAllTermsForField(field, expSetFilters, save = true, href = null){
    var esf = _.clone(expSetFilters);
    delete esf[field];
    if (save && href) return saveChangedFilters(esf, href);
    else return esf;
}



/**
 * Convert expSetFilters to a URL, given a current URL whose path is used to append arguments
 * to (e.g. http://hostname.com/browse/  or http://hostname.com/search/).
 *
 * @param {Object} expSetFilters        Filters as stored in Redux, keyed by facet field containing Set of term keys.
 * @param {string} currentHref          String with at least current host & path which to use as base for resulting URL, e.g. http://localhost:8000/browse/[?type=ExperimentSetReplicate&experimentset_type=...].
 * @param {?string} [sortColumn=null]   Column being sorted on.
 * @param {boolean} [sortReverse=false] If sort is reverse, e.g. incremental instead of decremental.
 * @param {string} [hrefPath]           Override the /path/ in URL returned, e.g. to /browse/.
 * @returns {string} URL which can be used to request filtered results from back-end, e.g. http://localhost:8000/browse/?type=ExperimentSetReplicate&experimentset_type=replicate&from=0&limit=50&field.name=term1&field2.something=term2[...]
 */
export function filtersToHref(expSetFilters, currentHref, sortColumn = null, sortReverse = false, hrefPath = null, requiredQs = {}){
    var baseHref = getBaseHref(currentHref, hrefPath, requiredQs);

    // Include a '?' or '&' if needed.
    var sep = navigate.determineSeparatorChar(baseHref),
        filterQuery = expSetFiltersToURLQuery(expSetFilters),
        urlString = (
            baseHref +
            (filterQuery.length > 0 ? sep + filterQuery : '')
        );

    if (!sortColumn){
        var parts = url.parse(currentHref, true);
        if (parts.query && typeof parts.query.sort === 'string'){
            if (parts.query.sort.charAt(0) === '-'){
                sortReverse = true;
                sortColumn = parts.query.sort.slice(1);
            } else {
                sortColumn = parts.query.sort;
            }
        }
    }

    if (typeof sortColumn === 'string'){
        if (sortReverse){
            urlString += ('&sort=-' + sortColumn);
        } else {
            urlString += ('&sort=' + sortColumn);
        }
    }

    return urlString;
}

/**
 * Hardcoded URL query params which are _definitely_ not filters.
 * Taken from search.py
 */
export const NON_FILTER_URL_PARAMS = [
    'limit', 'y.limit', 'x.limit', 'mode',
    'format', 'frame', 'datastore', 'field', 'region', 'genome',
    'sort', 'from', 'referrer', 'q', 'before', 'after'
];


/**
 * Convert back-end-supplied 'context.filters' array of filter objects into commonly-used 'expSetFilters' structure.
 * Replaces now-removed 'hrefToFilters' function and copy of expSetFilters passed down from Redux store.
 *
 * @param {{ term : string, field : string, remove : string }[]} contextFilters     Array of filters supplied from back-end search.py.
 * @param {string} [browseBaseState] - Supply 'only_4dn' or 'all' to control which URI query params are filtered out. If 'search' is supplied, none are excluded.
 * @returns {Object} Object with fields (string, dot-separated-nested) as keys and Sets of terms (string) as values for those keys.
 */
export function contextFiltersToExpSetFilters(contextFilters, excludedQs = {}){
    if (!Array.isArray(contextFilters)){
        console.warn('No context filters available or supplied. Fine if this message appears outside of a /search/ or /browse/ page.');
        return {};
    }
    if (contextFilters.length === 0) return {};
    return _.reduce(contextFilters, function(memo, filterObj){
        if (excludedQs && typeof excludedQs[filterObj.field] !== 'undefined'){
            if (excludedQs[filterObj.field] === true) return memo;
            if (typeof excludedQs[filterObj.field] === 'string' && excludedQs[filterObj.field] === filterObj.term){
                return memo;
            }
            if (Array.isArray(excludedQs[filterObj.field]) && excludedQs[filterObj.field].indexOf(filterObj.term) > -1){
                return memo;
            }
            return memo;
        }
        if (typeof memo[filterObj.field] === 'undefined'){
            memo[filterObj.field] = new Set([filterObj.term]);
        } else {
            memo[filterObj.field].add(filterObj.term);
        }
        return memo;
    }, {});
}


/** Convert expSetFilters, e.g. as stored in Redux, into a partial URL query: field.name=term1&field2.something=term2[&field3...] */
export function expSetFiltersToURLQuery(expSetFilters){
    return _.map(_.pairs(expSetFiltersToJSON(expSetFilters)), function([field, terms]){
        return _.map(terms, function(t){
            // `t` term already ran thru encodeURIComponent in `expSetFiltersToJSON`
            return encodeURIComponent(field) + '=' + t.replace(/%20/g, "+");
        }).join('&');
    }).join('&');
}

/** Normally we have Set objects for Field terms which we convert to arrays */
export function expSetFiltersToJSON(expSetFilters){
    return _.object(_.map(_.pairs(expSetFilters), function([field, setOfTerms]){
        // Encode to be URI safe -
        const termsArray = _.map([...setOfTerms], function(term){ return encodeURIComponent(term); });
        return [field, termsArray];
    }));
}

/**
 * Compare two versions of 'expSetFilters' structure to check if they are equal.
 * Used by ChartDataController.
 *
 * @param {Object} expSetFiltersA - 1st set of filters, object with facet/field as keys and Sets of terms as values.
 * @param {Object} expSetFiltersB - 2nd set of filters, same as param expSetFiltersA.
 * @returns {boolean} true if equal.
 */
export function compareExpSetFilters(expSetFiltersA, expSetFiltersB){
    if ((expSetFiltersA && !expSetFiltersB) || (!expSetFiltersA && expSetFiltersB)) return false;
    var keysA = _.keys(expSetFiltersA);
    if (keysA.length !== _.keys(expSetFiltersB).length) return false;
    for (var i = 0; i < keysA.length; i++){
        if (typeof expSetFiltersB[keysA[i]] === 'undefined') return false;
        if (expSetFiltersA[keysA[i]] instanceof Set && expSetFiltersB[keysA[i]] instanceof Set){
            if (expSetFiltersA[keysA[i]].size !== expSetFiltersB[keysA[i]].size) return false;
            for (var termFromSetA of expSetFiltersA[keysA[i]]){
                if (!expSetFiltersB[keysA[i]].has(termFromSetA)) return false;
            }
        }
    }
    return true;
}


export function filtersToNodes(expSetFilters = {}, orderedFieldNames = null, termTranformFxn = null, flatten = false){
    // Convert orderedFieldNames into object/hash for faster lookups.
    var sortObj = null;
    if (Array.isArray(orderedFieldNames)) sortObj = _.invert(_.object(_.pairs(orderedFieldNames)));

    return _(expSetFilters).chain()
        .pairs() // fieldPair[0] = field, fieldPair[1] = Set of terms
        .sortBy(function(fieldPair){
            if (sortObj && typeof sortObj[fieldPair[0]] !== 'undefined') return parseInt(sortObj[fieldPair[0]]);
            else return fieldPair[0];
        })
        .reduce(function(m, fieldPair){
            var termNodes = [...fieldPair[1]].map(function(term){
                return {
                    'data' : {
                        'term' : term,
                        'name' : (termTranformFxn && termTranformFxn(fieldPair[0], term)) || term,
                        'field' : fieldPair[0]
                    }
                };
            });
            if (flatten){
                // [field1:term1, field1:term2, field1:term3, field2:term1]
                termNodes.push('spacer');
                return m.concat(termNodes);
            } else {
                // [[field1:term1, field1:term2, field1:term3],[field2:term1, field2:term2], ...]
                m.push(termNodes);
                return m;
            }
        }, [])
        .value();
}

/**
 * JSON.stringify() cannot store Set objects, which are used in expSetFilters, so we must convert
 * the Sets to/from Arrays upon needing to use JSON.stringify() and after returning from JSON.parse(),
 * such as when saving or grabbing the expSetFilter to/from the <script data-prop-name="expSetFilters"...>...</script>
 * element which is used to pass the filters from server-side render to client-side React initiatilization.
 *
 * @param {Object} expSetFilters  Object keyed by field name/key containing term key strings in form of Set or Array, which need to be converted to Set or Array.
 * @param {string} [to='array']   One of 'array' or 'set' for what to convert expSetFilter's terms to.
 */
export function convertExpSetFiltersTerms(expSetFilters, to = 'array'){
    return _(expSetFilters).chain()
        .pairs()
        .map(function(pair){
            if (to === 'array'){
                return [pair[0], [...pair[1]]];
            } else if (to === 'set'){
                return [pair[0], new Set(pair[1])];
            }
            throw new Error("Not one of set or array");
        })
        .object()
        .value();
}


/** Return URL without any queries or hash, ending at pathname. Add hardcoded stuff for /browse/ or /search/ endpoints. */
function getBaseHref(currentHref = '/browse/', hrefPath = null, requiredQs = {}) {
    const urlParts = url.parse(currentHref, true);
    if (!hrefPath) {
        hrefPath = urlParts.pathname;
    }

    const baseHref = (urlParts.protocol && urlParts.host) ? urlParts.protocol + '//' + urlParts.host + hrefPath : hrefPath;
    const hrefQuery = _.pick(urlParts.query, 'type', 'q');
    if (hrefPath.indexOf('/browse/') > -1) {
        _.extend(hrefQuery, requiredQs);
    }
    if (hrefPath.indexOf('/search/') > -1) {
        if (typeof hrefQuery.type !== 'string') {
            hrefQuery.type = 'Item';
        }
    }

    return baseHref + (_.keys(hrefQuery).length > 0 ? '?' + queryString.stringify(hrefQuery) : '');
}

export function searchQueryStringFromHref(href){
    if (!href) return null;
    if (typeof href !== 'string') return null;
    var searchQueryString = null;
    // eslint-disable-next-line no-useless-escape
    var searchQueryMatch = href.match(/(\?|&)(q)(=)[\w\s\+\-\%\.\*\!\(\)]+/);
    if (searchQueryMatch){
        searchQueryString = searchQueryMatch[0].replace(searchQueryMatch.slice(1).join(''), '').replace(/\+/g, ' ');
        if (decodeURIComponent){
            searchQueryString = decodeURIComponent(searchQueryString);
        }
    }
    return searchQueryString;

}


/** Check whether expSetFiles exists and is empty. */
export function filterObjExistsAndNoFiltersSelected(expSetFilters){
    return (
        typeof expSetFilters === 'object'
        && expSetFilters !== null
        && _.keys(expSetFilters).length === 0
    );
}


export function getSearchItemType(context){
    const { filters = [] } = context;
    for (let i = 0; i < filters.length; i++){
        const { field, term } = filters[i];
        if (field === "type") {
            if (term !== "Item") {
                return term;
            }
        }
    }
    return null;
}

