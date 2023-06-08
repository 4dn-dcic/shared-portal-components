import React, { useMemo } from 'react';
import memoize from 'memoize-one';
import url from 'url';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { navigate } from './../../util/navigate';
import { getTermFacetStatus } from './../../util/search-filters';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import * as logger from '../../util/logger';
import { generateNextHref } from './FacetList';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../../util/typedefs';


/**
 * Accepts and parses the `href` from Redux / App.
 * Passes `href` downstream to descendant components,
 * as well as onFilter and onClearFilters functions which
 * navigate to new href.
 */
export class WindowNavigationController extends React.PureComponent {

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

    static isClearFiltersBtnVisible(href, context){
        const urlPartsQuery = url.parse(href, true).query || {};
        const clearFiltersURL = (typeof context.clear_filters === 'string' && context.clear_filters) || null;
        const clearFiltersURLQuery = clearFiltersURL && url.parse(clearFiltersURL, true).query;

        return !!(clearFiltersURLQuery && !_.isEqual(clearFiltersURLQuery, urlPartsQuery));
    }

    constructor(props){
        super(props);
        this.onFilter = this.onFilter.bind(this);
        this.onFilterMultiple = this.onFilterMultiple.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
        this.getTermStatus = this.getTermStatus.bind(this);
        this.memoized = {
            transformedFacets: memoize(WindowNavigationController.transformedFacets),
            isClearFiltersBtnVisible: memoize(WindowNavigationController.isClearFiltersBtnVisible)
        };
    }

    onFilter(facet, term, callback){
        const {
            href,
            navigate: propNavigate = navigate,
            context: { filters : contextFilters }
        } = this.props;

        return propNavigate(
            generateNextHref(href, contextFilters, facet, term),
            { 'dontScrollToTop' : true },
            typeof callback === "function" ? callback : null
        );
    }

    /**
     * Works in much the same way as onFilter, except takes in an array of filter objects ({facet, term)}) and generates a composite href before navigating
     * @param {Array} filterObjs An object containing {facet, term, callback}
     * Note: may eventually merge with/use to replace onFilter -- will have to track down and edit in a LOT of places, though. So waiting to confirm this is
     * desired functionality.
     */
    onFilterMultiple(filterObjs = [], callback = null) {
        const {
            href, navigate: propNavigate = navigate,
            context: { filters : contextFilters }
        } = this.props;

        if (filterObjs.length === 0) { console.log("Attempted multi-filter, but no objects passed in!"); return null; }

        let newHref = href; // initialize to href

        // Update href to include facet/term query pairs for each new item
        filterObjs.forEach((obj, i) => {
            const { facet, term } = obj;
            const thisHref = generateNextHref(newHref, contextFilters, facet, term);
            newHref = thisHref;
        });

        return propNavigate(
            newHref,
            { 'dontScrollToTop' : true },
            typeof callback === "function" ? callback : null
        );
    }

    onClearFilters(callback = null){
        const {
            href,
            navigate: propNavigate = navigate,
            context: { clear_filters : clearFiltersURLOriginal = null }
        } = this.props;

        let clearFiltersURL = clearFiltersURLOriginal;

        if (!clearFiltersURL) {
            logger.error("No Clear Filters URL");
            return;
        }

        // If we have a '#' in URL, add to target URL as well.
        const hashFragmentIdx = href.indexOf('#');
        if (hashFragmentIdx > -1 && clearFiltersURL.indexOf('#') === -1){
            clearFiltersURL += href.slice(hashFragmentIdx);
        }

        propNavigate(clearFiltersURL, {}, typeof callback === 'function' ? callback : null);
    }

    getTermStatus(term, facet){
        const { context: { filters } } = this.props;
        return getTermFacetStatus(term, facet, filters);
    }

    render(){
        const {
            children,
            filterFacetFxn,
            facets: propFacets, // `null` has special meaning for `facets` (hidden) so do not default to it here.
            showClearFiltersButton: propShowClearFiltersBtn,
            ...passProps
        } = this.props;
        const { href, context } = passProps;
        const showClearFiltersButton = typeof propShowClearFiltersBtn === "boolean" ?
            propShowClearFiltersBtn : this.memoized.isClearFiltersBtnVisible(href, context || {});

        // Allow facets=null to mean no facets shown. facets=undefined means to default to context.facets.
        const facets = (propFacets === null) ? null :
            WindowNavigationController.transformedFacets(propFacets || (context && context.facets) || null, filterFacetFxn);

        const propsToPass = {
            ...passProps, facets,
            showClearFiltersButton,
            onFilter: this.onFilter,
            onFilterMultiple: this.onFilterMultiple,
            onClearFilters: this.onClearFilters,
            getTermStatus: this.getTermStatus,
        };

        return React.Children.map(children, function(child){
            return React.cloneElement(child, propsToPass);
        });
    }
}
