'use strict';

import React, { useCallback } from 'react';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'querystring';
import memoize from 'memoize-one';
import _ from 'underscore';
import { navigate } from './../../util/navigate';
import { flattenColumnsDefinitionsSortFields, HeadersRow } from './table-commons';


export class SortController extends React.PureComponent {

    static propTypes = {
        /** One of 'href' or 'requestedCompoundFilterSet' is required */
        'href'          : PropTypes.string,
        'requestedCompoundFilterSet': PropTypes.object,
        'context'       : PropTypes.object,
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
    static getSortColumnAndOrderPairs(sortColumns) {
        const colNames = Object.keys(sortColumns).filter(function(sortKey){ return (sortKey !== 'label') && (sortKey !== '_score'); });
        const columns = colNames.map(function(colName){
            // N.B.: "order" is returned from context / search response; we rename it to "direction" here
            return { 'column': colName, 'direction': sortColumns[colName].order || "desc" };
        });
        return columns;
    }

    constructor(props){
        super(props);

        this.handleSortColumnSelection = this.handleSortColumnSelection.bind(this);
        this.handleSortOrderSelection = this.handleSortOrderSelection.bind(this);
        this.handleSortRowDelete = this.handleSortRowDelete.bind(this);
        this.handleSettingsApply = this.handleSettingsApply.bind(this);
        this.memoized = {
            flattenColumnsDefinitionsSortFields : memoize(flattenColumnsDefinitionsSortFields)
        };

        const { sortColumns = [] } = props;

        this.state = {
            /** @type {{ column: string, direction: "asc"|"desc" }[]} */
            'sortingPairs': [ ...sortColumns, { 'column': null, 'direction': 'asc' } ]
        };
    }

    componentDidUpdate(pastProps, pastState) {
        const { sortColumns: pastSortColumns = [] } = pastProps;
        const { sortColumns = [] } = this.props;

        if (sortColumns !== pastSortColumns) {
            this.setState({ 'sortingPairs': [ ...sortColumns, { 'column': null, 'direction': 'asc' } ] });
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
        const { columnDefinitions, size, variant } = this.props;
        const { sortingPairs } = this.state;

        // columnDefinitions are passed as empty arrays when table displays "No Results", so we hide dropdowns
        if (!Array.isArray(columnDefinitions) || !columnDefinitions.length) {
            return null;
        }

        const { allSortFields, allSortFieldsMap } = this.memoized.flattenColumnsDefinitionsSortFields(columnDefinitions);
        const commonProps = {
            allSortFields, allSortFieldsMap,
            size, variant,
            "rowCount": sortingPairs.length,
            "handleSortColumnSelection": this.handleSortColumnSelection,
            "handleSortOrderSelection": this.handleSortOrderSelection,
            "handleSortRowDelete": this.handleSortRowDelete,
            "handleSettingsApply": this.handleSettingsApply,
        };
        return (
            <div className="mb-1">
                { sortingPairs.map(function(pair, index){
                    return <MultiColumnSortOption {...commonProps} {...pair} index={index} key={index} />;
                }) }
            </div>
        );
    }

}
MultiColumnSortSelector.propTypes = {
    'columnDefinitions'     : PropTypes.arrayOf(PropTypes.object).isRequired,
    'sortColumns'           : PropTypes.array.isRequired,
    'onClose'               : PropTypes.func,
    'sortBy'                : PropTypes.func.isRequired,
    'size'                  : PropTypes.string,
    'variant'               : PropTypes.string
};

const MultiColumnSortOption = React.memo(function MultiColumnSortOption(props){
    const {
        allSortFields, allSortFieldsMap, rowCount,
        column, direction, index,
        handleSortColumnSelection, handleSortOrderSelection,
        handleSortRowDelete, handleSettingsApply,
        variant = "outline-secondary",
        size = "sm"
    } = props;

    let title = null;

    if (column === null) {
        title = "Select a column to sort";
    } else {
        const useCol = HeadersRow.getTrimmedColumn(column);
        const foundSortDefinition = allSortFieldsMap[useCol];
        if (foundSortDefinition) {
            // eslint-disable-next-line prefer-destructuring
            title = foundSortDefinition.title;
        } else {
            title = <span className="text-monospace small">{ useCol }</span>;
        }
    }

    const isLastRow = (rowCount - 1 === index);

    const sortOrderTitle = direction !== 'desc' ?
        (<React.Fragment><span className="d-lg-none">ASC</span><span className="d-none d-lg-inline">Ascending</span></React.Fragment>) :
        (<React.Fragment><span className="d-lg-none">DESC</span><span className="d-none d-lg-inline">Descending</span></React.Fragment>);

    const onRemoveClick = useCallback(function(e){
        e.preventDefault();
        e.stopPropagation();
        handleSortRowDelete(index);
    }, [ index, handleSortRowDelete ]);

    return (
        <div className="row mt-1 multi-column-sort">
            <div className="col-8">
                <DropdownButton {...{ title, size }} variant={(variant ? variant + " " : "") + "btn-block text-left"}
                    onSelect={handleSortColumnSelection}>
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
            <div className="col-3 pl-0">
                <DropdownButton title={sortOrderTitle} variant={(variant ? variant + " " : "") + "btn-block text-left"}
                    size={size} onSelect={handleSortOrderSelection}>
                    <DropdownItem key="sort-direction-asc" eventKey={index + "|asc"}>Ascending</DropdownItem>
                    <DropdownItem key="sort-direction-desc" eventKey={index + "|desc"}>Descending</DropdownItem>
                </DropdownButton>
            </div>
            <div className="col-1 pl-0">
                {!isLastRow ?
                    <button type="button" className={`btn btn-${variant} btn-${size} btn-block`} onClick={onRemoveClick} data-tip="Remove sort column">
                        <i className="icon icon-fw fas icon-minus w-100" />
                    </button> :
                    <button type="button" className={`btn btn-primary btn-${size} btn-block`} onClick={handleSettingsApply} data-tip="Re-sort columns">
                        <i className="icon icon-fw fas icon-check w-100" />
                    </button>}
            </div>
        </div>
    );
});
