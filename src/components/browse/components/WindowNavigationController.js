'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
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
export class WindowNavigationController extends React.PureComponent {

    constructor(props){
        super(props);
        this.onFilter = this.onFilter.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
        this.getTermStatus = this.getTermStatus.bind(this);
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

    onClearFilters(callback = null){
        const {
            href,
            navigate: propNavigate = navigate,
            context: { clear_filters : clearFiltersURLOriginal = null }
        } = this.props;

        let clearFiltersURL = clearFiltersURLOriginal;

        if (!clearFiltersURL) {
            console.error("No Clear Filters URL");
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
            ...passProps
        } = this.props;

        const propsToPass = {
            ...passProps,
            onFilter: this.onFilter,
            onClearFilters: this.onClearFilters,
            getTermStatus: this.getTermStatus,
        };

        return React.Children.map(children, function(child){
            return React.cloneElement(child, propsToPass);
        });
    }
}
