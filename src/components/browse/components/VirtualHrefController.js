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

    static defaultProps = {
        "searchHref" : "/search/?type=Item"
    };
    /**
     * @param {String[]} facets - facets array
     * @param {function} filterFacetFxn - filtering function
     */
    static transformedFacets(facets, filterFacetFxn){
        return facets.filter(filterFacetFxn);
    }
    /**
     *
     * @param {Object} columns - columns object
     * @param {function} filterColumnFxn - filtering function
     */
    static transformedColumns(columns, filterColumnFxn){
        const keys = _.keys(columns);
        return _.pick(columns, keys.filter(filterColumnFxn));
    }

    constructor(props){
        super(props);
        this.onFilter = this.onFilter.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
        this.getTermStatus = this.getTermStatus.bind(this);
        this.virtualNavigate = this.virtualNavigate.bind(this);
        this.memoized = {
            transformedFacets: memoize(VirtualHrefController.transformedFacets),
            transformedColumns: memoize(VirtualHrefController.transformedColumns),
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

    onClearFilters(callback = null){
        const { virtualContext : { clear_filters : clearFiltersURL = null } } = this.state;

        if (!clearFiltersURL) {
            console.error("No Clear Filters URL");
            return;
        }

        this.virtualNavigate(clearFiltersURL, {}, typeof callback === 'function' ? callback : null);
    }

    getTermStatus(term, facet){
        const { virtualContext : { filters: virtualContextFilters } } = this.state;
        return getTermFacetStatus(term, facet, virtualContextFilters);
    }

    render(){
        const { children, facets: propFacets, filterFacetFxn = null, columns: propColumns, filterColumnFxn = null, ...passProps } = this.props;
        const {
            virtualHref: href,
            virtualContext: context,
            isContextLoading
        } = this.state;

        // Allow facets=null to mean no facets shown. facets=undefined means to default to context.facets.
        let facets = propFacets === null ? null : propFacets || (context && context.facets) || null;

        if (typeof filterFacetFxn === "function" && Array.isArray(facets)){
            facets = this.memoized.transformedFacets(facets, filterFacetFxn);
        }

        let columns = propColumns ? propColumns : (context && context.columns) || null;

        if (typeof filterColumnFxn === "function" && typeof columns === 'object'){
            columns = this.memoized.transformedColumns(columns, filterColumnFxn);
        }

        const propsToPass = {
            ...passProps,
            href, context, isContextLoading, facets, columns,
            navigate: this.virtualNavigate,
            onFilter: this.onFilter,
            onClearFilters: this.onClearFilters,
            getTermStatus: this.getTermStatus,
        };

        return React.Children.map(children, function(child){
            return React.cloneElement(child, propsToPass);
        });
    }
}
