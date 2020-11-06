'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'querystring';
import memoize from 'memoize-one';
import _ from 'underscore';
import { navigate } from './../../util/navigate';


export class SortController extends React.PureComponent {

    static propTypes = {
        'href'          : PropTypes.string.isRequired,
        'context'       : PropTypes.object.isRequired,
        'navigate'      : PropTypes.func,
        'children'      : PropTypes.node.isRequired
    };

    static defaultProps = {
        'navigate' : function(href, options, callback){
            console.info('Called SortController.props.navigate with:', href,options, callback);
            if (typeof navigate === 'function') return navigate.apply(navigate, arguments);
        }
    };

    /**
     * Grab limit & page (via '(from / limit) + 1 ) from URL, if available.
     *
     * @deprecated
     * @param {string} href - Current page href, with query.
     * @returns {Object} { 'page' : int, 'limit' : int }
     */
    static getPageAndLimitFromURL(href){
        const { query } = url.parse(href, true);
        let limit = parseInt(query.limit || 25);
        let from  = parseInt(query.from  || 0);
        if (isNaN(limit)) limit = 25;
        if (isNaN(from)) from = 0;
        return {
            'page' : (from / limit) + 1,
            'limit' : limit
        };
    }

    static getSortColumnAndReverseFromContext(context){
        const defaults = {
            'sortColumn'    : null,
            'sortReverse'   : false
        };
        if (!context || !context.sort) return defaults;
        let sortKey = _.keys(context.sort);
        if (sortKey.length > 0){
            // Use first if multiple.
            // eslint-disable-next-line prefer-destructuring
            sortKey = sortKey[0];
        } else {
            return defaults;
        }
        const reverse = context.sort[sortKey].order === 'desc';
        return {
            'sortColumn'    : sortKey,
            'sortReverse'   : reverse
        };
    }

    constructor(props){
        super(props);
        this.sortBy = this.sortBy.bind(this);
        this.state = { 'changingPage' : false }; // 'changingPage' = historical name, analogous of 'loading'

        this.memoized = {
            getSortColumnAndReverseFromContext: memoize(SortController.getSortColumnAndReverseFromContext)
        };
    }

    sortBy(key, reverse) {
        const {
            navigate: propNavigate,
            href: currSearchHref = null,
            requestedCompoundFilterSet = null
        } = this.props;

        let href = null;
        if (currSearchHref) {
            href = currSearchHref;
        } else if (requestedCompoundFilterSet) {
            href = "?" + requestedCompoundFilterSet.global_flags || "";
        } else {
            throw new Error("SortController doesn't have `props.href` nor `requestedCompoundFilterSet`.");
        }

        if (typeof propNavigate !== 'function') throw new Error("No navigate function.");
        if (typeof href !== 'string') throw new Error("Browse doesn't have props.href.");

        this.setState({ 'changingPage' : true }, () => {
            const { query, ...urlParts } = url.parse(href, true);

            if (key){
                query.sort = (reverse ? '-' : '' ) + key;
            } else {
                delete query.sort;
            }

            const stringifiedNextQuery = queryString.stringify(query);

            let navTarget = null;
            if (currSearchHref) {
                urlParts.search = '?' + queryString.stringify(query);
                navTarget = url.format(urlParts);
            } else if (requestedCompoundFilterSet) {
                navTarget = { ...requestedCompoundFilterSet, "global_flags": stringifiedNextQuery };
            } else {
                throw new Error("SortController doesn't have `props.href` nor `requestedCompoundFilterSet`.");
            }

            propNavigate(navTarget, { 'replace' : true }, () => {
                this.setState({ 'changingPage' : false });
            });
        });

    }

    render(){
        const { children, context, ...passProps } = this.props;
        const { sortColumn, sortReverse } = this.memoized.getSortColumnAndReverseFromContext(context);
        const childProps = {
            ...passProps,
            context,
            sortColumn, sortReverse,
            sortBy: this.sortBy
        };

        return React.Children.map(children, function(c){
            return React.cloneElement(c, childProps);
        });
    }


}
