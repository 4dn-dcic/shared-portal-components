import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import Draggable from 'react-draggable';
import { getColumnWidthFromDefinition } from './ColumnCombiner';
import { WindowEventDelegator } from './../../../util/WindowEventDelegator';
import { findParentElement } from './../../../util/layout';
import { requestAnimationFrame as raf } from './../../../viz/utilities';

/**
 * Assumes that is rendered by SearchResultTable and that a SortController instance
 * is above it in the component tree hierarchy (provide sortColumn, sortBy, sortReverse).
 *
 * Can exclude props passed by those two and HeadersRow features/UI will degrade gracefully.
 */
export class HeadersRow extends React.PureComponent {

    static propTypes = {
        'columnDefinitions' : PropTypes.arrayOf(PropTypes.shape({
            'field' : PropTypes.string.isRequired,
            'title' : PropTypes.string,
            'sort_fields' : PropTypes.arrayOf(PropTypes.shape({
                'field' : PropTypes.string.isRequired,
                'title' : PropTypes.string,
            })),
            'render' : PropTypes.func,
            'widthMap' : PropTypes.shape({
                'lg' : PropTypes.number.isRequired,
                'md' : PropTypes.number.isRequired,
                'sm' : PropTypes.number.isRequired
            })
        })).isRequired,
        'mounted' : PropTypes.bool.isRequired,
        'detailPane' : PropTypes.element,
        'renderDetailPane' : PropTypes.func,
        'width' : PropTypes.number,
        'defaultMinColumnWidth' : PropTypes.number,
        'tableContainerScrollLeft' : PropTypes.number,
        'windowWidth' : PropTypes.number,
        // Passed down from CustomColumnController (if used)
        'columnWidths' : PropTypes.objectOf(PropTypes.number),
        'setColumnWidths' : PropTypes.func,
        // Passed down from SortController (if used)
        'sortColumns' : PropTypes.object,
        'sortBy' : PropTypes.func
    };

    static defaultProps = {
        'defaultMinColumnWidth' : 55,
        'tableContainerScrollLeft' : 0
    };

    static alignedWidths(columnDefinitions, columnWidths, tempWidths, windowWidth){
        const isMounted = typeof windowWidth === "number";
        return columnDefinitions.map(function(columnDefinition, i){
            const { field } = columnDefinition;
            return (
                (tempWidths && tempWidths[field]) ||
                (columnWidths && columnWidths[field]) ||
                getColumnWidthFromDefinition(columnDefinition, isMounted, windowWidth)
            );
        });
    }

    static getSortColumnMap(columnDefinitions, sortColumns) {
        const retObj = {};
        columnDefinitions.forEach(function ({ field, sort_fields = [] }) {
            if (sort_fields.length < 2) {
                const useField = (sort_fields[0] && sort_fields[0].field) || field;
                const total = sortColumns.length;
                sortColumns.forEach(function ({ column, direction }, index) {
                    const trimmedColumn = HeadersRow.getTrimmedColumn(column);

                    if (useField === column || (trimmedColumn && useField === trimmedColumn)) {
                        retObj[field] = { ...{ index, direction, total } };
                    }
                });
            } else {
                /** @todo optimize the loops */
                sortColumns.forEach(function ({ column, direction }, index) {
                    const total = sortColumns.length;
                    sort_fields.forEach(function ({ field: sField }) {
                        if (column === sField) {
                            retObj[field] = { ...{ index, direction, total, field: sField, parent: field } };
                        }
                    });
                });
            }
        });
        return retObj;
    }

    static getRootLoadingField(columnDefinitions, loadingField){
        if (!loadingField) return null;
        const colDefLen = columnDefinitions.length;
        for (var colIdx = 0; colIdx < colDefLen; colIdx++){
            const { field: rootField, sort_fields = [] } = columnDefinitions[colIdx];
            if (rootField === loadingField) {
                return rootField;
            }
            for (var sIdx = 0; sIdx < sort_fields.length; sIdx++) {
                const { field: sField } = sort_fields[sIdx];
                if (sField === loadingField) {
                    return rootField;
                }
            }
        }
        return null;
    }

    /**
     * linkTo fields are appended by .display_title by backend so we trim it to find a match
     */
    static getTrimmedColumn = memoize(function getTrimmedColumn(column) {
        if (!column || typeof column !== 'string' || column.length <= 14 || !column.endsWith('.display_title')) {
            return column;
        }

        return column.substring(0, column.length - 14);
    });

    constructor(props){
        super(props);
        this.onWindowClick = this.onWindowClick.bind(this);
        this.setShowingSortFieldsFor = this.setShowingSortFieldsFor.bind(this);
        this.sortByField = this.sortByField.bind(this);
        this.setColumnWidthsFromState = this.setColumnWidthsFromState.bind(this);
        this.onAdjusterDrag = this.onAdjusterDrag.bind(this);
        this.state = {
            'widths' : {}, // Store for temporary column widths used while a header's 'width' edge/grabber is being dragged.
            'showingSortFieldsForColumn' : null, // Key/field of column for which sort fields/options are being shown.
            'loadingField' : null // Current key/field of column for which sorted results are being loaded.
        };
        this.memoized = {
            alignedWidths: memoize(HeadersRow.alignedWidths),
            getSortColumnMap: memoize(HeadersRow.getSortColumnMap),
            getRootLoadingField: memoize(HeadersRow.getRootLoadingField),
            getTrimmedColumn: memoize(HeadersRow.getTrimmedColumn)
        };
    }

    componentDidUpdate(pastProps, pastState){
        const { columnWidths, sortColumns, tableContainerScrollLeft } = this.props;
        const { showingSortFieldsForColumn, loadingField } = this.state;
        const { sortColumns: pastSortColumns, tableContainerScrollLeft: pastScrollLeft } = pastProps;

        if (showingSortFieldsForColumn && !pastState.showingSortFieldsForColumn){
            WindowEventDelegator.addHandler("click", this.onWindowClick);
        } else if (!showingSortFieldsForColumn && pastState.showingSortFieldsForColumn) {
            WindowEventDelegator.removeHandler("click", this.onWindowClick);
        }

        const nextState = {};

        if (pastProps.columnWidths !== columnWidths){
            nextState.widths = {};
        }

        // Unset loading icon
        const [{ column: sortColumn = null, direction = null } = {}] = sortColumns || [];
        const [{ column: pastSortColumn = null, direction: pastDirection = null } = {}] = pastSortColumns || [];
        if (loadingField !== null && (sortColumn !== pastSortColumn || direction !== pastDirection)) {
            if (sortColumn === loadingField || HeadersRow.getTrimmedColumn(sortColumn) === loadingField) {
                nextState.loadingField = null;
            }
        }

        // Unset dropdown menu if start scrolling horizontally
        if (tableContainerScrollLeft !== pastScrollLeft) {
            nextState.showingSortFieldsForColumn = null;
        }

        if (Object.keys(nextState).length > 0) {
            this.setState(nextState);
        }

    }

    /** Close dropdown on window click unless click within menu. */
    onWindowClick(evt){
        setTimeout(()=>{
            const { showingSortFieldsForColumn } = this.state;
            const clickedElement = evt.target;
            const clickedChildOfDropdownMenu = !!(findParentElement(clickedElement, (el) => el.getAttribute("data-showing-sort-fields-for") === showingSortFieldsForColumn));
            if (!clickedChildOfDropdownMenu) {
                this.setShowingSortFieldsFor(null);
            }
        }, 0);
    }

    setShowingSortFieldsFor(showingSortFieldsForColumn) {
        this.setState({ showingSortFieldsForColumn });
    }

    /**
     * Determines direction of next sort (descending vs ascending) and sets
     * `state.isLoading` to true (to be unset by `componentDidUpdate`)
     * before calling `props.sortByFxn`.
     */
    sortByField(field){
        const { sortColumns, sortBy, columnDefinitions  } = this.props;
        const [{ column = null, direction = "desc" } = {}] = sortColumns || [];
        const trimmedColumn = HeadersRow.getTrimmedColumn(column);
        let initialSort;
        let sortDirection;

        if (columnDefinitions) {
            const itemField = _.filter(columnDefinitions, function (item) { return item.field == field; });
            initialSort = itemField && itemField[0] && itemField[0].initial_sort;
        }

        const isActive = column === field || (trimmedColumn && trimmedColumn === field);

        if (initialSort && !isActive) { sortDirection = initialSort; }
        else {
            const beDescending = !isActive || (isActive && direction !== "desc");
            sortDirection = beDescending ? "desc" : "asc";
        }

        this.setState({ "loadingField": field, "showingSortFieldsForColumn" : null }, function(){
            sortBy([{ column: field, direction: sortDirection }]);
        });
    }

    /** Updates CustomColumnController.state.columnWidths from HeadersRow.state.widths */
    setColumnWidthsFromState(){
        raf(() => {
            const { setColumnWidths, columnWidths } = this.props;
            const { widths } = this.state;
            if (typeof setColumnWidths !== 'function'){
                throw new Error('props.setHeaderWidths not a function');
            }
            setColumnWidths({ ...columnWidths, ...widths });
        });
    }

    onAdjusterDrag(columnDefinition, evt, r){
        const { field } = columnDefinition;
        this.setState(function({ widths }, { defaultMinColumnWidth }){
            return { 'widths' : { ...widths, [field] : Math.max(columnDefinition.minColumnWidth || defaultMinColumnWidth || 55, r.x) } };
        });
    }

    render(){
        const {
            columnDefinitions,
            renderDetailPane,
            detailPane,
            sortColumns = [],
            sortBy,
            columnWidths,
            setColumnWidths,
            width,
            tableContainerScrollLeft,
            windowWidth
        } = this.props;
        const { showingSortFieldsForColumn, widths, loadingField } = this.state;
        const sortColumnMap = this.memoized.getSortColumnMap(columnDefinitions, sortColumns);
        const leftOffset = 0 - tableContainerScrollLeft;
        const isSortable = typeof sortBy === "function";
        const isAdjustable = !!(typeof setColumnWidths === "function" && columnWidths);
        const outerClassName = (
            "search-headers-row"
            + (isAdjustable ? '' : ' non-adjustable')
            + ((typeof renderDetailPane !== 'function' && !detailPane) ? ' no-detail-pane' : '')
        );
        const outerStyle = {
            'width' : width || null // Only passed in from ItemPage
        };
        const innerStyle = {
            left: leftOffset,
            //transform: "translate3d(" + leftOffset + "px, 0px, 0px)"
        };

        const commonProps = {
            sortByField: isSortable ? this.sortByField : null,                      // Disable sorting if no sortBy func.
            setHeaderWidths: isAdjustable ? this.setColumnWidthsFromState : null,   // Disable resizing cols if no setColumnWidths func.
            onAdjusterDrag: isAdjustable ? this.onAdjusterDrag : null,              // Disable resizing cols if no setColumnWidths func.
            setShowingSortFieldsFor: isSortable ? this.setShowingSortFieldsFor : null // Disable sorting if no sortBy func.
        };

        const alignedWidths = this.memoized.alignedWidths(columnDefinitions, columnWidths, widths, windowWidth);
        const rootLoadingField = this.memoized.getRootLoadingField(columnDefinitions, loadingField);
        let sortColumn = null, sortReverse = null;
        if (showingSortFieldsForColumn) {
            const col = sortColumnMap[showingSortFieldsForColumn];
            if (col) {
                sortColumn = col.field || showingSortFieldsForColumn;
                sortReverse = col.direction === 'desc';
            }
        }
        return (
            <div className={outerClassName} style={outerStyle} data-showing-sort-fields-for={showingSortFieldsForColumn}>
                <div className="headers-columns-overflow-container">
                    <div className="columns clearfix" style={innerStyle}>
                        { columnDefinitions.map(function(columnDefinition, index){
                            const { field } = columnDefinition;
                            const showingSortOptionsMenu = showingSortFieldsForColumn && showingSortFieldsForColumn === field;
                            const isLoading = (rootLoadingField && rootLoadingField === field);
                            return (
                                // `props.active` may be undefined, object with more fields, or array where first item is `descending` flag (bool).
                                <HeadersRowColumn {...commonProps} {...{ columnDefinition, index, showingSortOptionsMenu, isLoading }}
                                    width={alignedWidths[index]} key={field} sortMap={sortColumnMap[field]} />
                            );
                        }) }
                    </div>
                </div>
                { showingSortFieldsForColumn !== null ?
                    <SortOptionsMenuContainer {...{ showingSortFieldsForColumn, columnDefinitions, sortColumn, sortReverse, alignedWidths, leftOffset }} sortByField={this.sortByField} />
                    : null }
            </div>
        );
    }
}

class HeadersRowColumn extends React.PureComponent {

    constructor(props){
        super(props);
        this.onDrag = this.onDrag.bind(this);
        this.onStop = this.onStop.bind(this);
        this.memoized = {
            showTooltip : memoize(function(colWidth, titleStr){
                return ((colWidth - 40) / 7) < (titleStr || "").length;
            })
        };
    }

    /** Updates HeadersRow.state.widths {Object<string,numer>} */
    onDrag(event, res){
        const { columnDefinition, onAdjusterDrag } = this.props;
        onAdjusterDrag(columnDefinition, event, res);
    }

    /** Updates CustomColumnController.state.columnWidths from HeadersRow.state.widths */
    onStop(event, res){
        const { setHeaderWidths } = this.props;
        setHeaderWidths();
    }

    render(){
        const {
            sortByField,
            width,
            columnDefinition,
            onAdjusterDrag,
            showingSortOptionsMenu,
            setShowingSortFieldsFor,
            sortMap,
            isLoading = false
        } = this.props;
        const { noSort, colTitle, title, field, description = null } = columnDefinition;
        const showTitle = colTitle || title;
        const titleTooltip = this.memoized.showTooltip(width, typeof colTitle === "string" ? colTitle : title) ? title : null;
        const tooltip = description ? (titleTooltip ? `<h5 class="mb-03">${titleTooltip}</h5>` + description : description) : (titleTooltip? titleTooltip : null);
        let sorterIcon;
        if (!noSort && typeof sortByField === 'function' && width >= 50){
            sorterIcon = <ColumnSorterIcon {...{ columnDefinition, sortByField, showingSortOptionsMenu, setShowingSortFieldsFor, sortMap, isLoading }} />;
        }
        const cls = (
            "search-headers-column-block"
            + (noSort ? " no-sort" : '')
            + (showingSortOptionsMenu ? " showing-sort-field-options" : "")
        );
        return (
            <div data-field={field} data-column-key={field} key={field} className={cls} style={{ width }}>
                <div className="inner">
                    <div className="column-title">
                        <span data-tip={tooltip} data-html>{ showTitle }</span>
                    </div>
                    { sorterIcon }
                </div>
                { typeof onAdjusterDrag === "function" ?
                    <Draggable position={{ x: width, y: 0 }} axis="x" onDrag={this.onDrag} onStop={this.onStop}>
                        <div className="width-adjuster"/>
                    </Draggable>
                    : null }
            </div>
        );
    }
}

class ColumnSorterIcon extends React.PureComponent {

    static getDescend(active) {
        if (Array.isArray(active)) {
            return active[0];
        }
        const keys = Object.keys(active);
        return active[keys[0]][0];
    }

    static propTypes = {
        'active' : PropTypes.any,
        'sortMap': PropTypes.object,
        'columnDefinition' : PropTypes.object, // See HeadersRow.proptypes.columnDefinitions
        'sortByField' : PropTypes.func.isRequired,
        'showingSortOptionsMenu' : PropTypes.bool,
        'setShowingSortFieldsFor' : PropTypes.func,
        'isLoading' : PropTypes.bool
    };

    static defaultProps = {
        'descend' : false
    };

    constructor(props){
        super(props);
        this.onIconClick = this.onIconClick.bind(this);
        this.memoized = {
            isActive: memoize(ColumnSorterIcon.isActive)
        };
    }

    /**
     * Sorts column or opens/closes multisort menu
     * if multiple options.
     *
     * @param {React.SyntheticEvent} e - Click event object.
     */
    onIconClick(e){
        e.preventDefault();
        const {
            columnDefinition : {
                field,
                sort_fields = []
            },
            showingSortOptionsMenu = false,
            setShowingSortFieldsFor,
            sortByField
        } = this.props;

        if (showingSortOptionsMenu) {
            // We're currently showing options for this col/icon; unset.
            setShowingSortFieldsFor(null);
            return;
        }

        if (sort_fields.length >= 2) {
            // Show options in UI
            setShowingSortFieldsFor(field);
            return;
        }

        const [ { field: firstSortField = null } = {} ] = sort_fields;

        // If not multiple options, just sort on the only sort field available.
        // Whether is a single item in sort_fields list or the field/key of column (if no sort_fields).
        sortByField(firstSortField || field);
    }

    render(){
        const { columnDefinition, active = null, sortMap = null, showingSortOptionsMenu = false, isLoading = false } = this.props;
        const { field, sort_fields = [] } = columnDefinition;
        if (typeof field !== 'string' || field.length === 0) {
            return null;
        }
        const hasMultipleSortOptions = sort_fields.length >= 2;
        const { direction: sortDirection = 'asc', index: sortIndex = 0, total: sortTotal = 1 } = sortMap || {};
        const sequence = sortMap && sortTotal > 1 ? sortIndex + 1 : null;
        const descend = (sortMap && sortDirection === 'desc') || false;
        const cls = (
            (sortMap ? 'active ' : '') +
            (hasMultipleSortOptions ? 'multiple-sort-options ' : '') +
            'column-sort-icon'
        );
        let tooltip = null;
        if (showingSortOptionsMenu) {
            tooltip = "Close sort options";
        } else if (hasMultipleSortOptions && sortMap) {
            const found = sort_fields.find(function({ field }){
                return field === sortMap.field;
            });
            tooltip = found ? `Sorted by <span class="text-600">${found.title || found.field}</span>` : null;
        } else if (hasMultipleSortOptions) {
            tooltip = "" + sort_fields.length + " sort options";
        }
        return (
            <span className={cls} onClick={this.onIconClick} data-tip={tooltip} data-html>
                <ColumnSorterIconElement {...{ showingSortOptionsMenu, hasMultipleSortOptions, isLoading, sequence }} descend={!sortMap || descend} />
            </span>
        );
    }
}

function SortOptionsMenuContainer(props){
    const {
        showingSortFieldsForColumn,
        columnDefinitions,
        sortColumn: currentSortColumn,
        sortReverse: descend,
        sortByField,
        alignedWidths,
        leftOffset = 0
    } = props;

    if (!showingSortFieldsForColumn) {
        return null;
    }

    const activeColumnDefinitionIndex = useMemo(function(){
        const colDefLen = columnDefinitions.length;
        for (var i = 0; i < colDefLen; i++){
            if (columnDefinitions[i].field === showingSortFieldsForColumn) {
                return i;
            }
        }
        return -1;
    }, [ columnDefinitions, showingSortFieldsForColumn ]);

    // Position it under col for which open for in headers row.
    const widthUntilActiveColumnEnd = useMemo(function(){
        let sumWidths = 0;
        for (var i = 0; i <= activeColumnDefinitionIndex; i++){
            sumWidths += alignedWidths[i];
        }
        return sumWidths;
    }, [ alignedWidths, activeColumnDefinitionIndex ]);

    const activeColumnDefinition = columnDefinitions[activeColumnDefinitionIndex];
    const { sort_fields } = activeColumnDefinition;
    // Account for scrollLeft of searchresults/header; 200 is min width for menu
    const style = { left: Math.max(200, widthUntilActiveColumnEnd + leftOffset) };

    return (
        <div className="headers-columns-dropdown-menu-container">
            <SortOptionsMenu {...{ currentSortColumn, descend, sort_fields, sortByField, style }} />
        </div>
    );
}

const SortOptionsMenu = React.memo(function SortOptionsMenu({
    header = <h5 className="dropdown-header mt-0 px-3 pt-03 text-600">Sort by</h5>,
    currentSortColumn,
    sort_fields,
    sortByField,
    descend = false,
    style = null
}){
    const options = sort_fields.map(function({ field, title = null }){
        // TODO grab title from schemas if not provided.
        const isActive = currentSortColumn === field;
        const cls = (
            "dropdown-item" +
            " clickable no-highlight no-user-select" +
            " d-flex align-items-center justify-content-between" +
            (isActive ? " active" : "")
        );
        const onClick = sortByField.bind(sortByField, field);
        return (
            <div className={cls} key={field} onClick={onClick}>
                { title || field }
                { !isActive ? null : <i className={`small icon fas ml-12 icon-arrow-${descend ? "down" : "up"}`}/> }
            </div>
        );
    });

    return (
        <div className="dropdown-menu show" style={style}>
            { header }
            { options }
        </div>
    );
});

const ColumnSorterIconElement = React.memo(function ColumnSorterIconElement({ descend, showingSortOptionsMenu, isLoading = false, sequence : propSequence }){

    if (isLoading) {
        return <i className="icon icon-fw icon-circle-notch icon-spin fas"/>;
    }
    if (showingSortOptionsMenu) {
        return <i className="icon icon-fw icon-times fas"/>;
    }

    let sequence = null;
    if (propSequence && typeof propSequence === 'number') {
        sequence = (<sup>{propSequence}</sup>);
    }

    if (descend){
        return (
            <React.Fragment>
                <i className="sort-icon icon icon-fw icon-sort-down fas align-top" />
                {sequence}
            </React.Fragment>);
    } else {
        return (
            <React.Fragment>
                <i className="sort-icon icon icon-fw icon-sort-up fas align-bottom" />
                {sequence}
            </React.Fragment>);
    }
});
