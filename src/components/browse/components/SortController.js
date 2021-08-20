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
import { flattenColumnsDefinitionsSortFields } from './table-commons';


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
    sortBy(sortingPairs, callback) {
        const {
            navigate: propNavigate,
            href: currSearchHref = null,
            requestedCompoundFilterSet = null
        } = this.props;

        let hrefSourceWithSort = null;

        if (currSearchHref) {
            hrefSourceWithSort = currSearchHref;
        } else if (requestedCompoundFilterSet) {
            // For compound filter sets, we keep `sort` URL param in `global_flags` at moment.
            hrefSourceWithSort = "?" + requestedCompoundFilterSet.global_flags || "";
        } else {
            throw new Error("SortController doesn't have `props.href` nor `requestedCompoundFilterSet`.");
        }


        this.setState({ 'changingPage' : true }, () => {

            const { query, ...urlParts } = url.parse(hrefSourceWithSort, true);
            const useSortPairs = sortingPairs.slice();
            const sortingPairsLen = sortingPairs.length;
            // Exclude last empty column (null column)
            if (sortingPairsLen > 0 && sortingPairs[sortingPairsLen - 1].column === null) {
                useSortPairs.pop();
            }
            query.sort = useSortPairs.map(function({ column, direction }){
                return (direction === 'desc' ? '-' : '') + column;
            });

            const stringifiedNextQuery = queryString.stringify(query);
            let navTarget = null;
            if (currSearchHref) {
                // Using search href
                urlParts.search = '?' + stringifiedNextQuery;
                navTarget = url.format(urlParts);
            } else if (requestedCompoundFilterSet) {
                // Using /compound_search POST requests
                navTarget = {
                    ...requestedCompoundFilterSet,
                    "global_flags": stringifiedNextQuery
                };
            } else {
                throw new Error("SortController doesn't have `props.href` nor `requestedCompoundFilterSet`.");
            }

            propNavigate(navTarget, { 'replace' : true }, () => {
                this.setState({ 'changingPage' : false }, callback);
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
     * @param {Object.<string, { order: string }>} sortColumns The "sort" property of search response or `context`, keyed by field.
     * @returns {[ string, "desc" | "asc"][]} Array of [field_name, direction ("asc"/"desc")] tuples
     */
    static getSortColumnAndOrderPairs(sortColumns, appendDefault = false) {
        const colNames = Object.keys(sortColumns).filter(function(sortKey){ return (sortKey !== 'label') && (sortKey !== '_score'); });
        const columns = colNames.map(function(colName){
            // N.B.: "order" is returned from context / search response; we rename it to "direction" here
            return { 'column': colName, 'direction': sortColumns[colName].order || "desc" };
        });

        if (appendDefault) {
            columns.push({ 'column': null, 'direction': 'asc' });
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
            getSortColumnAndOrderPairs : memoize(MultiColumnSortSelector.getSortColumnAndOrderPairs),
            flattenColumnsDefinitionsSortFields : memoize(flattenColumnsDefinitionsSortFields)
        };

        const { sortColumns = {} } = props;

        this.state = {
            /** @type {{ column: string, direction: "asc"|"desc" }[]} */
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

    handleSortColumnSelection(eventKey){
        this.setState(function({ sortingPairs: existingPairs }){
            const sortingPairs = existingPairs.slice(0);
            const [ sIndex, column ] = eventKey.split('|');
            const index = parseInt(sIndex);
            sortingPairs[index].column = column;

            // add new empty row if last is selected
            if (index === sortingPairs.length - 1) {
                sortingPairs.push({ 'column': null, 'direction': 'asc' });
            }

            return { sortingPairs };
        });
    }

    handleSortOrderSelection(eventKey) {
        this.setState(function({ sortingPairs: existingPairs }){
            const sortingPairs = existingPairs.slice(0);
            const [ sIndex, direction ] = eventKey.split('|');
            const index = parseInt(sIndex);
            sortingPairs[index].direction = direction;
            return { sortingPairs };
        });
    }

    handleSortRowDelete(indexToDelete) {
        this.setState(function({ sortingPairs: existingPairs }){
            const sortingPairs = existingPairs.slice(0);
            sortingPairs.splice(indexToDelete, 1);
            return { sortingPairs };
        });
    }

    handleSettingsApply() {
        const { sortBy, onClose } = this.props;
        const { sortingPairs } = this.state;
        sortBy(sortingPairs, () => {
            if (onClose && typeof onClose === 'function') {
                onClose();
            }
        });
    }

    render(){
        const { columnDefinitions } = this.props;
        const { sortingPairs } = this.state;

        // columnDefinitions are passed as empty arrays when table displays "No Results", so we hide dropdowns
        if (!Array.isArray(columnDefinitions) || !columnDefinitions.length) {
            return null;
        }

        const { allSortFields, allSortFieldsMap } = this.memoized.flattenColumnsDefinitionsSortFields(columnDefinitions);
        return (
            <div className="row mb-1 clearfix">
                { sortingPairs.map((pair, index, all) =>
                    <MultiColumnSortOption {...pair} {...{ index, allSortFields, allSortFieldsMap }} key={index}
                        rowCount={all.length}
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
    'columnDefinitions'     : PropTypes.arrayOf(PropTypes.object).isRequired,
    'sortColumns'           : PropTypes.object,
    'onClose'               : PropTypes.func.isRequired,
    'sortBy'                : PropTypes.func.isRequired
};

const MultiColumnSortOption = React.memo(function MultiColumnSortOption(props){
    const { allSortFields, allSortFieldsMap, rowCount, column, direction, index, handleSortColumnSelection, handleSortOrderSelection, handleSortRowDelete, handleSettingsApply } = props;
    const titleColumn = column && (allSortFieldsMap[column] || (column.endsWith('.display_title') && allSortFieldsMap[column.substring(0, column.length - 14)] ));
    const isLastRow = (rowCount - 1 === index);
    const sortOrderTitle = direction !== 'desc' ?
        (<React.Fragment><span className="d-lg-none">ASC</span><span className="d-none d-lg-inline">Ascending</span></React.Fragment>) :
        (<React.Fragment><span className="d-lg-none">DESC</span><span className="d-none d-lg-inline">Descending</span></React.Fragment>);

    return (
        <div className="row col-12 mt-1 multi-column-sort clearfix" key={column} data-tip={""} data-html>
            <div className="col-8">
                <DropdownButton title={titleColumn ? titleColumn.title : "Select a column to sort"} variant="outline-secondary btn-block text-left"
                    size="sm" onSelect={handleSortColumnSelection}>
                    {
                        allSortFields.map(function (col, idx) {
                            const { field, title, hasSubFields, noSort } = col;
                            return (
                                !hasSubFields ?
                                    <DropdownItem key={"sort-column-" + idx} eventKey={index + '|' + field} active={field === column} disabled={!!noSort}>
                                        { title }
                                    </DropdownItem>
                                    : null
                            );
                        })
                    }
                </DropdownButton>
            </div>
            <div className="col-3">
                <DropdownButton title={sortOrderTitle} variant="outline-secondary btn-block text-left" size="sm" onSelect={handleSortOrderSelection}>
                    <DropdownItem key="sort-direction-asc" eventKey={index + "|asc"}>Ascending</DropdownItem>
                    <DropdownItem key="sort-direction-desc" eventKey={index + "|desc"}>Descending</DropdownItem>
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
