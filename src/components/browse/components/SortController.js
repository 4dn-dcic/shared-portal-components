'use strict';

import React from 'react';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
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

    constructor(props){
        super(props);
        this.sortBy = this.sortBy.bind(this);
        this.state = { 'changingPage' : false }; // 'changingPage' = historical name, analogous of 'loading'

        this.memoized = {
            getSortColumnAndOrderPairs: memoize(MultiColumnSortSelector.getSortColumnAndOrderPairs)
        };
    }

    /**
     * Handles both `href` and `requestedCompoundFilterSet`, will prioritize
     * operating with just `href` if present and allowing VirtualHrefController
     * to make into POST request if needed. Else will operate w. `requestedCompoundFilterSet`
     * for compound filter-blocks requests.
     */
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
        const { sort = {} } = context || {};
        const sortColumns = this.memoized.getSortColumnAndOrderPairs(sort);
        const childProps = {
            ...passProps,
            context,
            sortColumns,
            sortBy: this.sortBy
        };

        return React.Children.map(children, function(c){
            if (!React.isValidElement(c) || typeof c.type === "string") return c;
            return React.cloneElement(c, childProps);
        });
    }

}

export class MultiColumnSortSelector extends React.PureComponent {

    /**
     * returns array of [field_name, order ("asc"/"desc")] tuples
     */
    static getSortColumnAndOrderPairs(sortColumns, appendDefault = false) {
        const colNames = _.filter(_.keys(sortColumns), (sortKey) =>  sortKey != 'label');
        const columns = colNames.map((colName) => {
            const order = sortColumns[colName].order === 'asc' ? 'asc' : 'desc';
            return { 'column': colName, 'order': order };
        });
        if (appendDefault) {
            columns.push({ 'column': null, order: 'asc' });
        }

        return columns;
    }

    constructor(props){
        super(props);

        this.handleSortColumnSelection = this.handleSortColumnSelection.bind(this);
        this.handleSortOrderSelection = this.handleSortOrderSelection.bind(this);
        this.handleSortRowDelete = this.handleSortRowDelete.bind(this);
        this.handleSettingsApply = this.handleSettingsApply.bind(this);
        this.memoized = {
            getSortColumnAndOrderPairs : memoize(MultiColumnSortSelector.getSortColumnAndOrderPairs)
        };

        const { sortColumns = {} } = props;

        this.state = {
            'sortingPairs': this.memoized.getSortColumnAndOrderPairs(sortColumns, true)
        };
    }

    componentDidUpdate(pastProps, pastState) {
        const { sortColumns : pastSortColumns = {} } = pastProps;
        const { sortColumns = {} } = this.props;

        if (sortColumns !== pastSortColumns) {
            const { sortingPairs } = this.state;
            const updatedPairs = this.memoized.getSortColumnAndOrderPairs(sortColumns, true);
            if (!_.isEqual(sortingPairs, updatedPairs)) {
                this.setState({ 'sortingPairs': updatedPairs });
            }
        }
    }

    handleSortColumnSelection(evt){
        const { sortingPairs } = this.state;
        const newSortingPairs = sortingPairs.slice(0);

        const [sIndex, column] = evt.split('|');
        const index = parseInt(sIndex);
        newSortingPairs[index].column = column;

        //add new empty row if last is selected
        if (index === sortingPairs.length - 1) {
            newSortingPairs.push({ 'column': null, 'order': 'asc' });
        }
        this.setState({ 'sortingPairs': newSortingPairs });
    }

    handleSortOrderSelection(evt) {
        const { sortingPairs } = this.state;
        const newSortingPairs = sortingPairs.slice(0);

        const [sIndex, order] = evt.split('|');
        const index = parseInt(sIndex);
        newSortingPairs[index].order = order;

        this.setState({ 'sortingPairs': newSortingPairs });
    }

    handleSortRowDelete(index) {
        const { sortingPairs } = this.state;
        const newSortingPairs = sortingPairs.slice(0);

        newSortingPairs.splice(index, 1);

        this.setState({ 'sortingPairs': newSortingPairs });
    }

    handleSettingsApply() {
        const { navigate: propNavigate, href: currSearchHref, onClose } = this.props;
        const { sortingPairs } = this.state;

        if (typeof propNavigate !== 'function') throw new Error("No navigate function.");
        if (typeof currSearchHref !== 'string') throw new Error("Browse/Search doesn't have props.href.");

        const { query, ...urlParts } = url.parse(currSearchHref, true);
        query.sort = _.filter(sortingPairs, (pair) => pair.column).map((pair) => (pair.order === 'desc' ? '-' : '') + pair.column);


        urlParts.search = '?' + queryString.stringify(query);
        const navTarget = url.format(urlParts);

        propNavigate(navTarget, { 'replace': true }, () => {
            if (onClose && typeof onClose === 'function') {
                onClose();
            }
        });
    }

    render(){
        const { columnDefinitions } = this.props;
        const { sortingPairs } = this.state;
        return (
            <div className="row mb-1 clearfix">
                { sortingPairs.map((pair, idx, all) =>
                    <MultiColumnSortOption {...pair} key={pair.column || idx} allColumns={columnDefinitions} allSortColumns={all} index={idx}
                        handleSortColumnSelection={this.handleSortColumnSelection}
                        handleSortOrderSelection={this.handleSortOrderSelection}
                        handleSortRowDelete={this.handleSortRowDelete}
                        handleSettingsApply={this.handleSettingsApply} />
                ) }
            </div>
        );
    }

}
MultiColumnSortSelector.propTypes = {
    'columnDefinitions'     : PropTypes.object.isRequired,
    'sortColumns'           : PropTypes.object,
    'onClose'               : PropTypes.func.isRequired,
    'navigate'              : PropTypes.func.isRequired,
    'href'                  : PropTypes.string
};

const MultiColumnSortOption = React.memo(function MultiColumnSortOption(props){
    const { allColumns, allSortColumns, column, order, index, handleSortColumnSelection, handleSortOrderSelection, handleSortRowDelete, handleSettingsApply } = props;
    const found = _.find(allColumns, (item) => item.field === column);
    const isLastRow = (allSortColumns.length - 1 === index);
    const sortOrderTitle = order !== 'desc' ?
        (
            <React.Fragment>
                <span className="d-lg-none">ASC</span><span className="d-none d-lg-inline">Ascending</span>
            </React.Fragment>) :
        (
            <React.Fragment>
                <span className="d-lg-none">DESC</span><span className="d-none d-lg-inline">Descending</span>
            </React.Fragment>);

    return (
        <div className="row col-12 mt-1 multi-column-sort clearfix" key={column} data-tip={""} data-html>
            <div className="col-8">
                <DropdownButton className={"btn-block"} title={found ? found.title : "Select a column to sort"} variant="outline-secondary" size="sm" onSelect={handleSortColumnSelection}>
                    {
                        allColumns.map(function (col, idx) {
                            return (<DropdownItem key={"sort-column-" + idx} eventKey={index + '|' + col.field} active={col.field === column} disabled={!!col.noSort}>{col.title}</DropdownItem>);
                        })
                    }
                </DropdownButton>
            </div>
            <div className="col-3">
                <DropdownButton className="btn-block" title={sortOrderTitle} variant="outline-secondary" size="sm" onSelect={handleSortOrderSelection}>
                    <DropdownItem key="sort-order-asc" eventKey={index + "|asc"}>Ascending</DropdownItem>
                    <DropdownItem key="sort-order-desc" eventKey={index + "|desc"}>Descending</DropdownItem>
                </DropdownButton>
            </div>
            <div className="col-1 pl-0 pr-0">
                {!isLastRow ?
                    <button type="button" className="btn btn-outline-secondary btn-sm w-100" onClick={() => handleSortRowDelete(index)} data-tip="Remove sort column">
                        <i className={"icon icon-fw fas icon-minus w-100"} />
                    </button> :
                    <button type="button" className="btn btn-primary btn-sm w-100" onClick={handleSettingsApply} data-tip="Re-sort columns">
                        <i className={"icon icon-fw fas icon-check w-100"} />
                    </button>}
            </div>
        </div>
    );
});
