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

    static getSortColumnAndReverseFromContext(context){
        const defaults = {
            'sortColumn'    : null,
            'sortReverse'   : false
        };
        if (!context || !context.sort) return defaults;
        let sortKey = Object.keys(context.sort);
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
        const { sortColumn, sortReverse } = this.memoized.getSortColumnAndReverseFromContext(context);
        const childProps = {
            ...passProps,
            context,
            sortColumn, sortReverse,
            sortBy: this.sortBy
        };

        return React.Children.map(children, function(c){
            if (!React.isValidElement(c) || typeof c.type === "string") return c;
            return React.cloneElement(c, childProps);
        });
    }

}

export class MultisortColumnSelector extends React.PureComponent {

    constructor(props){
        super(props);

        this.handleSortColumnSelection = this.handleSortColumnSelection.bind(this);
        this.handleSortOrderSelection = this.handleSortOrderSelection.bind(this);
        this.handleSortRowDelete = this.handleSortRowDelete.bind(this);
        this.handleSettingsApply = this.handleSettingsApply.bind(this);

        const { sortColumns = {} } = props;

        const colNames = _.filter(_.keys(sortColumns), (sortKey) =>  sortKey != 'label');
        const columns = colNames.map((colName) => {
            const order = sortColumns[colName].order === 'asc' ? 'asc' : 'desc';
            return { 'name': colName, 'order': order };
        });
        columns.push({ 'name': null, order: 'asc' });

        this.state = {
            'sortColumns': columns
        };
    }

    handleSortColumnSelection(evt){
        const { sortColumns } = this.state;
        const newSortColumns = sortColumns.slice(0);

        const [sIndex, name] = evt.split('|');
        const index = parseInt(sIndex);
        newSortColumns[index].name = name;

        //add new empty row if last is selected
        if (index === sortColumns.length - 1) {
            newSortColumns.push({ 'name': null, 'order': 'asc' });
        }
        this.setState({ 'sortColumns': newSortColumns });
    }

    handleSortOrderSelection(evt) {
        const { sortColumns } = this.state;
        const newSortColumns = sortColumns.slice(0);

        const [sIndex, order] = evt.split('|');
        const index = parseInt(sIndex);
        newSortColumns[index].order = order;

        this.setState({ 'sortColumns': newSortColumns });
    }

    handleSortRowDelete(index) {
        const { sortColumns } = this.state;
        const newSortColumns = sortColumns.slice(0);

        newSortColumns.splice(index, 1);

        this.setState({ 'sortColumns': newSortColumns });
    }

    handleSettingsApply() {
        const { navigate: propNavigate, href: currSearchHref, onClose } = this.props;
        const { sortColumns } = this.state;

        if (typeof propNavigate !== 'function') throw new Error("No navigate function.");
        if (typeof currSearchHref !== 'string') throw new Error("Browse/Search doesn't have props.href.");

        const { query, ...urlParts } = url.parse(currSearchHref, true);
        query.sort = _.filter(sortColumns, (col) => col.name).map((col) => (col.order === 'desc' ? '-' : '') + col.name);


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
        const { sortColumns } = this.state;
        return (
            <div className="row mb-1 clearfix">
                { sortColumns.map((col, idx, all) =>
                    <MultisortOption {...col} key={col.name || idx} allColumns={columnDefinitions} allSortColumns={all} index={idx}
                        handleOptionVisibilityChange={this.handleOptionVisibilityChange}
                        handleSortColumnSelection={this.handleSortColumnSelection}
                        handleSortOrderSelection={this.handleSortOrderSelection}
                        handleSortRowDelete={this.handleSortRowDelete}
                        handleSettingsApply={this.handleSettingsApply} />
                ) }
            </div>
        );
    }

}
MultisortColumnSelector.propTypes = {
    'columnDefinitions'     : PropTypes.object.isRequired,
    'sortColumns'           : PropTypes.object,
    'onClose'               : PropTypes.func.isRequired,
    'navigate'              : PropTypes.func.isRequired,
    'href'                  : PropTypes.string
};

const MultisortOption = React.memo(function MultisortOption(props){
    const { allColumns, allSortColumns, name, order, index, handleSortColumnSelection, handleSortOrderSelection, handleSortRowDelete, handleSettingsApply } = props;
    const found = _.find(allColumns, (item) => item.field === name);
    const isLastRow = (allSortColumns.length - 1 === index);

    return (
        <div className="row col-12 mt-1 multisort-column clearfix" key={name} data-tip={""} data-html>
            <div className="col-8">
                <DropdownButton className={"btn-block"} title={found ? found.title : "Select a column to sort"} variant="outline-secondary" size="sm" onSelect={handleSortColumnSelection}>
                    {
                        allColumns.map(function (col, idx) {
                            return (<DropdownItem key={"sort-column-" + idx} eventKey={index + '|' + col.field} active={col.field === name}>{col.title}</DropdownItem>);
                        })
                    }
                </DropdownButton>
            </div>
            <div className="col-2">
                <DropdownButton className="btn-block" title={order !== 'desc' ? 'Ascending' : 'Descending'} variant="outline-secondary" size="sm" onSelect={handleSortOrderSelection}>
                    <DropdownItem key="sort-order-asc" eventKey={index + "|asc"}>Ascending</DropdownItem>
                    <DropdownItem key="sort-order-desc" eventKey={index + "|desc"}>Descending</DropdownItem>
                </DropdownButton>
            </div>
            <div className="col-2">
                {!isLastRow ?
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleSortRowDelete(index)} data-tip="Remove sort column">
                        <i className={"icon icon-fw fas icon-minus"} />
                    </button> :
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleSettingsApply} data-tip="Re-sort columns">
                        <i className={"icon icon-fw fas icon-check"} />
                    </button>}
            </div>
        </div>
    );
});
