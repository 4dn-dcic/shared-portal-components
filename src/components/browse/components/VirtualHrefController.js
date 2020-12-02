'use strict';

import React, { useMemo } from 'react';
import memoize from 'memoize-one';
import _ from 'underscore';
import url from 'url';
import * as analytics from './../../util/analytics';
import { load as ajaxLoad } from './../../util/ajax';
import { navigate as globalNavigate } from './../../util/navigate';
import { getTermFacetStatus } from './../../util/search-filters';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { generateNextHref } from './FacetList';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../../util/typedefs';



/**
 * Accepts and parses the `href` from Redux / App.
 * Passes `href` downstream to descendant components,
 * as well as onFilter and onClearFilters functions which
 * navigate to new href.
 */
export class VirtualHrefController extends React.PureComponent {

    /**
     * @param {String[]} facets - facets array
     * @param {function} filterFacetFxn - filtering function
     */
    static transformedFacets(facets, filterFacetFxn){
        if (typeof filterFacetFxn !== "function"){
            return facets;
        }
        if (!Array.isArray(facets)) {
            return []; // ? probably to-do if no facets: add placeholder saying no facets ?
        }
        return facets.filter(filterFacetFxn);
    }

    static isClearFiltersBtnVisible(virtualHref = null, originalSearchHref = null){
        if (virtualHref === null) {
            // Case if state.virtualCompoundFilterSet is not null.
            // Is moot since in such case, FacetList will be invisible or at least
            // non-functioning anyways.
            return false;
        }
        const virtualHrefPartsQuery = url.parse(virtualHref || "", true).query || {};
        const origHrefQuery = url.parse(originalSearchHref || "", true).query || {};
        return !_.isEqual(origHrefQuery, virtualHrefPartsQuery);
    }

    constructor(props){
        super(props);
        this.onFilter = this.onFilter.bind(this);
        this.onFilterMultiple = this.onFilterMultiple.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
        this.getTermStatus = this.getTermStatus.bind(this);
        this.virtualNavigate = this.virtualNavigate.bind(this);
        this.memoized = {
            transformedFacets: memoize(VirtualHrefController.transformedFacets),
            isClearFiltersBtnVisible: memoize(
                props.isClearFiltersBtnVisible ||
                function(currentVirtualSearcHref){
                    // We assume props.searchHref doesn't ever change (we don't handle a change of this in any case)
                    VirtualHrefController.isClearFiltersBtnVisible(currentVirtualSearcHref, props.searchHref);
                }
            )
        };

        this.state = {
            "virtualHref" : props.searchHref || null,
            // Takes precedence over virtualHref, if present.
            // TODO: Allow props.compoundFilterSet to init with perhaps.
            "virtualCompoundFilterSet" : null,
            "isContextLoading" : false,
            "virtualContext" : undefined // Let downstream components use defaultProps to fallback
        };
    }

    /** Will not be called if EmbeddedSearchView is not initialized with a `props.searchHref` */
    componentDidMount(){
        const { virtualHref, virtualContext, isContextLoading } = this.state;
        if (!isContextLoading && !virtualContext && virtualHref) { // No results yet loaded.
            this.virtualNavigate(virtualHref);
        }
    }

    /**
     * Unlike App.navigate, this also supports JSON body as first param
     * in order to perform compound search.
     * This props.navigate must only be called by child/downstream components
     * of EmbeddedSearchViews. Children of non-Embedded Search View generally
     * should use the global `navigate`, instead.
     *
     * @param {string|{ filter_blocks: { query:string }[], intersect: boolean, global_flags: string }} navigationTarget - Search href or a compound filterset representation.
     * @param {Object} navOpts - Kept for standardization with App.navigate, not used here.
     * @param {function} callback - Executed after successful response.
     */
    virtualNavigate(navigationTarget, navOpts, callback){
        const { onLoad = null } = this.props;
        const {
            virtualHref: currentHref = null,
            virtualContext: existingContext
        } = this.state;

        let nextHrefFull = null;
        let virtualCompoundFilterSet = null;
        if (typeof navigationTarget === "string") {
            // There is (very large) chance that `nextHref` does not have domain name, path, etc.
            // Resolve based on current virtualHref (else AJAX call may auto-resolve relative to browser URL).
            nextHrefFull = url.resolve(currentHref || "/search/", navigationTarget);
        } else {
            // Minor validation - let throw errors here.
            const { filter_blocks } = navigationTarget;
            if (filter_blocks.length === 0) {
                throw new Error("Must have 1+ filter blocks");
            }
            const anyWithoutQueries = _.any(filter_blocks, function({ query }){
                if (typeof query !== "string") return true;
                return false;
            });
            if (anyWithoutQueries) {
                throw new Error("Each filterblock must have a query");
            }
            virtualCompoundFilterSet = navigationTarget;
        }

        let scopedRequest;

        console.warn('VIRTUAL NAVIGATE CALLED', navigationTarget, nextHrefFull, navOpts);

        this.setState({ "isContextLoading" : true }, () => {

            const onLoadResponse = (nextContext) => {
                const { total, '@graph' : initialResults } = nextContext;
                if (scopedRequest !== this.currRequest) {
                    console.warn("This is no longer the current request", scopedRequest, this.currRequest);
                    return false;
                }

                this.currRequest = null;

                if (typeof total !== "number") {
                    throw new Error("Did not get back a search response");
                }

                if (typeof globalNavigate.updateUserInfo === "function") {
                    globalNavigate.updateUserInfo();
                }

                // Get correct URL from XHR, in case we hit a redirect during the request.
                let responseHref = null;
                if (!virtualCompoundFilterSet) {
                    responseHref = (
                        scopedRequest && scopedRequest.xhr && scopedRequest.xhr.responseURL
                    ) || nextHrefFull;
                }

                if (typeof existingContext === "undefined"){
                    // First time we've loaded response context. Register analytics event.
                    if (Array.isArray(initialResults)){
                        analytics.impressionListOfItems(
                            initialResults,
                            responseHref || "/compound_search",
                            "Embedded Search View"
                        );
                        const evtObj = analytics.eventObjectFromCtx(existingContext);
                        delete evtObj.name;
                        evtObj.eventValue = initialResults.length;
                        analytics.event("VirtualHrefController", "Initial Results Loaded", evtObj);
                    }
                }

                console.info("Loaded Next Context", nextContext);

                this.setState({
                    "virtualContext": nextContext,
                    "isContextLoading": false,
                    "virtualHref": responseHref,
                    "virtualCompoundFilterSet": virtualCompoundFilterSet
                }, () => {
                    if (typeof callback === "function"){
                        callback(nextContext);
                    }
                    if (typeof onLoad === "function"){
                        onLoad(nextContext);
                    }
                });
            };

            if (this.currRequest) {
                // Try cancel existing request if possible.
                this.currRequest.abort();
                this.currRequest = null;
            }

            scopedRequest = this.currRequest = ajaxLoad(
                nextHrefFull ? nextHrefFull : "/compound_search",
                onLoadResponse,
                nextHrefFull ? "GET" : "POST",
                onLoadResponse,
                virtualCompoundFilterSet ? JSON.stringify(virtualCompoundFilterSet) : null
            );

        });

        return scopedRequest;
    }

    onFilter(facet, term, callback){
        const { virtualHref, virtualContext : { filters: virtualContextFilters } } = this.state;

        return this.virtualNavigate(
            generateNextHref(virtualHref, virtualContextFilters, facet, term),
            { 'dontScrollToTop' : true },
            typeof callback === "function" ? callback : null
        );
    }

    /**
     * Works in much the same way as onFilter, except takes in an array of filter objects ({facet, term, callback)}) and generates a composite href before navigating
     * @param {Array} filterObjs An object containing {facet, term, callback}
     * Note: may eventually merge with/use to replace onFilter -- will have to track down and edit in a LOT of places, though. So waiting to confirm this is
     * desired functionality.
     */
    onFilterMultiple(filterObjs = []) {
        const { virtualHref, virtualContext : { filters: virtualContextFilters } } = this.state;

        if (filterObjs.length === 0) { console.log("Attempted multi-filter, but no objects passed in!"); return null; }

        let newHref = virtualHref; // initialize to href
        let callback;

        // Update href to include facet/term query pairs for each new item
        filterObjs.forEach((obj, i) => {
            const { facet, term, callback: thisCallback } = obj;
            const thisHref = generateNextHref(newHref, virtualContextFilters, facet, term);
            newHref = thisHref;
            if (i === 0) {
                callback = thisCallback;
            }
        });

        return this.virtualNavigate(
            newHref,
            { 'dontScrollToTop' : true },
            typeof callback === "function" ? callback : null
        );
    }


    /** Unlike in case of SearchView, which defaults to response's clear filters URL, this defaults to original searchHref */
    onClearFilters(callback = null){
        const { searchHref, onClearFiltersVirtual } = this.props;
        if (typeof onClearFiltersVirtual === "function") {
            // If custom function is passed, let it reset filters.
            onClearFiltersVirtual(
                this.virtualNavigate,
                callback
            );
        } else {
            // Reset to original searchHref from current virtual href.
            this.virtualNavigate(searchHref, {}, typeof callback === 'function' ? callback : null);
        }
    }

    getTermStatus(term, facet){
        const { virtualContext : { filters: virtualContextFilters } } = this.state;
        return getTermFacetStatus(term, facet, virtualContextFilters);
    }

    render(){
        const {
            children,
            facets: propFacets, // `null` has special meaning for `facets` (hidden) so do not default to it here.
            filterFacetFxn = null,
            columns: propColumns = null,
            searchHref: originalSearchHref,
            ...passProps
        } = this.props;
        const {
            virtualHref: href,
            virtualContext: context,
            virtualCompoundFilterSet: requestedCompoundFilterSet,
            isContextLoading
        } = this.state;

        // Allow facets=null to mean no facets shown. facets=undefined means to default to context.facets.
        const facets = (propFacets === null) ? null :
            this.memoized.transformedFacets(propFacets || (context && context.facets) || null, filterFacetFxn);

        const showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href);

        const propsToPass = {
            ...passProps,
            context,
            requestedCompoundFilterSet,
            // Don't pass down href if using requestedCompoundFilterSet
            href: requestedCompoundFilterSet ? null : href,
            isContextLoading, facets, showClearFiltersButton,
            navigate: this.virtualNavigate,
            onFilter: this.onFilter,
            onFilterMultiple: this.onFilterMultiple,
            onClearFilters: this.onClearFilters,
            getTermStatus: this.getTermStatus,
        };

        return React.Children.map(children, function(child){
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(child, propsToPass);
        });
    }
}
