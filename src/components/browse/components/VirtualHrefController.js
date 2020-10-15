'use strict';

import React, { useMemo } from 'react';
import memoize from 'memoize-one';
import _ from 'underscore';
import url from 'url';
import * as analytics from './../../util/analytics';
import { load as ajaxLoad } from './../../util/ajax';
import { navigate } from './../../util/navigate';
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

    static isClearFiltersBtnVisible(virtualHref, originalSearchHref){
        const virtualHrefPartsQuery = url.parse(virtualHref, true).query || {};
        const origHrefQuery = url.parse(originalSearchHref, true).query || {};
        return !_.isEqual(origHrefQuery, virtualHrefPartsQuery);
    }

    static defaultProps = {
        "searchHref" : "/search/?type=Item"
    };

    constructor(props){
        super(props);
        this.onFilter = this.onFilter.bind(this);
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
            "virtualHref" : props.searchHref,
            "isContextLoading" : true,
            "virtualContext" : undefined // Let downstream components use defaultProps to fallback
        };
    }

    componentDidMount(){
        const { virtualHref, virtualContext } = this.state;
        if (!virtualContext && virtualHref) { // No results yet loaded.
            this.virtualNavigate(virtualHref);
        }
    }

    virtualNavigate(nextHref, navOpts, callback){
        const { onLoad = null } = this.props;
        const { virtualHref: currentHref, virtualContext: existingContext } = this.state;

        // There is (very large) chance that `nextHref` does not have domain name, path, etc.
        // Resolve based on current virtualHref (else AJAX call may auto-resolve relative to browser URL).
        const nextHrefFull = url.resolve(currentHref, nextHref);

        let scopedRequest;

        console.log('VIRTUAL NAVIGATE CALLED', nextHref, nextHrefFull, navOpts);

        this.setState({ "isContextLoading" : true }, ()=>{
            const onLoadResponse = (nextContext) => {
                const { total, '@graph' : initialResults } = nextContext;
                if (scopedRequest !== this.currRequest) {
                    console.warn("This is no longer the current request");
                    return false;
                }
                if (typeof total !== "number") {
                    throw new Error("Did not get back a search response");
                }

                if (typeof existingContext === "undefined"){
                    // First time we've loaded response context. Register analytics event.
                    if (Array.isArray(initialResults)){
                        analytics.impressionListOfItems(initialResults, nextHrefFull, "Embedded Search View");
                        const evtObj = analytics.eventObjectFromCtx(existingContext);
                        delete evtObj.name;
                        evtObj.eventValue = initialResults.length;
                        analytics.event("VirtualHrefController", "Initial Results Loaded", evtObj);
                    }
                }

                this.setState({
                    virtualContext: nextContext,
                    isContextLoading: false,
                    virtualHref: nextHrefFull
                }, ()=>{
                    if (typeof callback === "function"){
                        callback(nextContext);
                    }
                    if (typeof onLoad === "function"){
                        onLoad(nextContext);
                    }
                });
            };

            scopedRequest = this.currRequest = ajaxLoad(nextHrefFull, onLoadResponse, "GET", onLoadResponse);

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
            isContextLoading
        } = this.state;

        // Allow facets=null to mean no facets shown. facets=undefined means to default to context.facets.
        const facets = (propFacets === null) ? null :
            this.memoized.transformedFacets(propFacets || (context && context.facets) || null, filterFacetFxn);

        const showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href);

        const propsToPass = {
            ...passProps,
            href, context, isContextLoading, facets, showClearFiltersButton,
            navigate: this.virtualNavigate,
            onFilter: this.onFilter,
            onClearFilters: this.onClearFilters,
            getTermStatus: this.getTermStatus,
        };

        return React.Children.map(children, function(child){
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(child, propsToPass);
        });
    }
}
