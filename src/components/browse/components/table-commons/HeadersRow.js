import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import Draggable from 'react-draggable';
import { getColumnWidthFromDefinition } from './ColumnCombiner';
import { WindowClickEventDelegator } from './../../../util/WindowClickEventDelegator';
import { findParentElement } from './../../../util/layout';

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
        'renderDetailPane' : PropTypes.func,
        'width' : PropTypes.number,
        'defaultMinColumnWidth' : PropTypes.number,
        'tableContainerScrollLeft' : PropTypes.number,
        // Passed down from CustomColumnController (if used)
        'columnWidths' : PropTypes.objectOf(PropTypes.number),
        'setColumnWidths' : PropTypes.func,
        // Passed down from SortController (if used)
        'sortColumn' : PropTypes.string,
        'sortReverse' : PropTypes.bool,
        'sortByFxn' : PropTypes.func
    };

    static defaultProps = {
        'defaultMinColumnWidth' : 55,
        'tableContainerScrollLeft' : 0
    };

    constructor(props){
        super(props);
        this.onWindowClick = this.onWindowClick.bind(this);
        this.setShowingSortFieldsFor = this.setShowingSortFieldsFor.bind(this);
        this.setColumnWidthsFromState = this.setColumnWidthsFromState.bind(this);
        this.getWidthFor = this.getWidthFor.bind(this);
        this.onAdjusterDrag = this.onAdjusterDrag.bind(this);
        this.state = {
            'widths' : {}, // Store for temporary column widths used while a header's 'width' edge/grabber is being dragged.
            'showingSortFieldsForColumn' : null // Key/field of column for which sort fields/options are being shown.
        };
    }

    componentDidUpdate(pastProps, pastState){
        const { columnWidths } = this.props;
        const { showingSortFieldsForColumn } = this.state;

        if (pastProps.columnWidths !== columnWidths){
            this.setState({ 'widths' : {} });
        }

        if (showingSortFieldsForColumn && !pastState.showingSortFieldsForColumn){
            WindowClickEventDelegator.addHandler("click", this.onWindowClick, { passive: true });
        } else if (!showingSortFieldsForColumn && pastState.showingSortFieldsForColumn) {
            WindowClickEventDelegator.removeHandler("click", this.onWindowClick);
        }
    }

    /** Close dropdown on window click unless click within menu. */
    onWindowClick(evt){
        setTimeout(()=>{
            const { showingSortFieldsForColumn } = this.state;
            const clickedElement = evt.target;
            const clickedChildOfDropdownMenu = !!(findParentElement(clickedElement, (el) => el.getAttribute("data-column-key") === showingSortFieldsForColumn));
            if (!clickedChildOfDropdownMenu) {
                this.setShowingSortFieldsFor(null);
            }
        }, 0);
    }

    setShowingSortFieldsFor(showingSortFieldsForColumn) {
        this.setState({ showingSortFieldsForColumn });
    }

    /** Updates CustomColumnController.state.columnWidths from HeadersRow.state.widths */
    setColumnWidthsFromState(){
        const { setColumnWidths, columnWidths } = this.props;
        const { widths } = this.state;
        if (typeof setColumnWidths !== 'function'){
            throw new Error('props.setHeaderWidths not a function');
        }
        setTimeout(function(){
            setColumnWidths({ ...columnWidths, ...widths });
        }, 0);
    }

    getWidthFor(columnDefinition){
        const { field } = columnDefinition;
        const { columnWidths, mounted, windowWidth } = this.props;
        const { widths } = this.state;
        return (
            (widths && widths[field]) ||
            (columnWidths && columnWidths[field]) ||
            getColumnWidthFromDefinition(columnDefinition, mounted, windowWidth)
        );
    }

    onAdjusterDrag(columnDefinition, evt, r){
        const { field } = columnDefinition;
        this.setState(({ widths }, { defaultMinColumnWidth })=>{
            const nextWidths = _.clone(widths);
            nextWidths[field] = Math.max(columnDefinition.minColumnWidth || defaultMinColumnWidth || 55, r.x);
            return { 'widths' : nextWidths };
        });
    }

    render(){
        const {
            columnDefinitions,
            renderDetailPane,
            sortColumn = null,
            sortReverse = false,
            sortBy,
            columnWidths,
            setColumnWidths,
            width,
            tableContainerScrollLeft
        } = this.props;
        const { showingSortFieldsForColumn } = this.state;

        const leftOffset = 0 - tableContainerScrollLeft;
        const isAdjustable = !!(typeof setColumnWidths === "function" && columnWidths);
        const outerClassName = (
            "search-headers-row"
            + (isAdjustable ? '' : ' non-adjustable')
            + (typeof renderDetailPane !== 'function' ? ' no-detail-pane' : '')
        );
        const outerStyle = {
            'width' : width || null // Only passed in from ItemPage
        };
        const innerStyle = {
            left: leftOffset,
            //transform: "translate3d(" + leftOffset + "px, 0px, 0px)"
        };

        const commonProps = {
            sortColumn, sortReverse, sortBy, columnWidths, showingSortFieldsForColumn,
            setHeaderWidths: this.setColumnWidthsFromState,
            onAdjusterDrag: this.onAdjusterDrag,
            setShowingSortFieldsFor: this.setShowingSortFieldsFor
        };

        return (
            <div className={outerClassName} style={outerStyle}>
                <div className="columns clearfix" style={innerStyle}>
                    {
                        columnDefinitions.map((columnDefinition, index) =>
                            <HeadersRowColumn {...commonProps} {...{ columnDefinition, index }} width={this.getWidthFor(columnDefinition, index)} key={columnDefinition.field} />
                        )
                    }
                </div>
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
            sortColumn: currentSortColumn,
            sortBy: sortByFxn,
            sortReverse: descend,
            width,
            columnDefinition,
            columnWidths,
            onAdjusterDrag,
            showingSortFieldsForColumn,
            setShowingSortFieldsFor
        } = this.props;
        const { noSort, colTitle, title, field, description = null } = columnDefinition;
        const showTitle = colTitle || title;
        const titleTooltip = this.memoized.showTooltip(width, typeof colTitle === "string" ? colTitle : title) ? title : null;
        const tooltip = description ? (titleTooltip ? `<h5 class="mb-03">${titleTooltip}</h5>` + description : description) : (titleTooltip? titleTooltip : null);
        let sorterIcon;
        if (!noSort && typeof sortByFxn === 'function' && width >= 50){
            sorterIcon = <ColumnSorterIcon {...{ columnDefinition, sortByFxn, currentSortColumn, descend, showingSortFieldsForColumn, setShowingSortFieldsFor }} />;
        }
        return (
            <div data-field={field} data-column-key={field} key={field}
                className={"search-headers-column-block" + (noSort ? " no-sort" : '')}
                style={{ width }}>
                <div className="inner">
                    <div className="column-title">
                        <span data-tip={tooltip} data-html>{ showTitle }</span>
                    </div>
                    { sorterIcon }
                </div>
                { columnWidths && typeof onAdjusterDrag === "function" ?
                    <Draggable position={{ x: width, y: 0 }} axis="x" onDrag={this.onDrag} onStop={this.onStop}>
                        <div className="width-adjuster"/>
                    </Draggable>
                    : null }
            </div>
        );
    }
}

class ColumnSorterIcon extends React.PureComponent {

    static isActive(columnDefinition, currentSortColumn) {
        const { field, sort_fields = null } = columnDefinition;
        if (!Array.isArray(sort_fields)){
            return field === currentSortColumn;
        }
        for (var i = 0; i < sort_fields.length; i++) {
            if (sort_fields[i].field === currentSortColumn) {
                return true;
            }
        }
        return false;
    }

    static propTypes = {
        'currentSortColumn' : PropTypes.string,
        'descend' : PropTypes.bool,
        'columnDefinition' : HeadersRow.propTypes.columnDefinitions,
        'sortByFxn' : PropTypes.func.isRequired,
        'showingSortFieldsForColumn' : PropTypes.string,
        'setShowingSortFieldsFor' : PropTypes.func
    };

    static defaultProps = {
        'descend' : false
    };

    constructor(props){
        super(props);
        this.onIconClick = this.onIconClick.bind(this);
        this.sortByField = this.sortByField.bind(this);
        this.memoized = {
            isActive: memoize(ColumnSorterIcon.isActive)
        };
        this.state = {
            isLoading: false
        };
    }

    componentDidUpdate(pastProps){
        const { isLoading } = this.state;
        if (!isLoading) return;
        const { currentSortColumn, descend } = this.props;
        if (currentSortColumn !== pastProps.currentSortColumn || descend !== pastProps.descend) {
            this.setState({ isLoading: false });
        }
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
            columnDefinition : { field, sort_fields = [] },
            showingSortFieldsForColumn = null,
            setShowingSortFieldsFor
        } = this.props;

        if (showingSortFieldsForColumn === field) {
            // We're currently showing options for this col/icon; unset.
            setShowingSortFieldsFor(null);
            return;
        }

        if (sort_fields.length >= 2) {
            // Show options in UI
            setShowingSortFieldsFor(field);
            return;
        }

        // If not multiple options, just sort on the only sort field available.
        // Whether is a single item in sort_fields list or the field/key of column (if no sort_fields).
        this.sortByField(sort_fields[0] || field);
    }

    /**
     * Determines direction of next sort (descending vs ascending) and sets
     * `state.isLoading` to true (to be unset by `componentDidUpdate`)
     * before calling `props.sortByFxn`.
     */
    sortByField(field){
        const { descend, currentSortColumn, sortByFxn } = this.props;
        const isActive = currentSortColumn === field;
        const beDescending = !isActive || (isActive && !descend);
        this.setState({ isLoading: true }, function(){
            sortByFxn(field, beDescending);
        });
    }

    render(){
        const { columnDefinition, descend, currentSortColumn, showingSortFieldsForColumn = null } = this.props;
        const { isLoading } = this.state;
        const { field, sort_fields = [] } = columnDefinition;
        if (typeof field !== 'string' || field.length === 0) {
            return null;
        }
        const isActive = this.memoized.isActive(columnDefinition, currentSortColumn);
        const hasMultipleSortOptions = sort_fields.length >= 2;
        const isShowingSortFields = showingSortFieldsForColumn === field;
        const cls = (
            (isActive ? 'active ' : '') +
            (hasMultipleSortOptions ? 'multiple-sort-options ' : '') +
            'column-sort-icon'
        );
        let tooltip = null;
        if (isShowingSortFields) {
            tooltip = "Close sort options";
        } else if (hasMultipleSortOptions && isActive) {
            const sortedBy = sort_fields.find(function({ field: f }){ return f === currentSortColumn; });
            tooltip = sortedBy ? `Sorted by <span class="text-600">${sortedBy.title || sortedBy.field}</span>` : null;
        }
        const icon = (
            <span className={cls} onClick={this.onIconClick} data-tip={tooltip} data-html>
                <ColumnSorterIconElement {...{ isLoading, isShowingSortFields, hasMultipleSortOptions }} descend={!isActive || descend} />
            </span>
        );

        if (!isShowingSortFields) {
            return icon;
        }

        return (
            <React.Fragment>
                { icon }
                <SortOptionsMenu {...{ currentSortColumn, sort_fields, descend }} sortByField={this.sortByField} />
            </React.Fragment>
        );
    }
}

const SortOptionsMenu = React.memo(function SortOptionsMenu({ currentSortColumn, sort_fields, sortByField, descend = false }){

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

    return <div className="dropdown-menu dropdown-menu-right show">{ options }</div>;
});

const ColumnSorterIconElement = React.memo(function ColumnSorterIconElement({ descend, isShowingSortFields, isLoading = false }){
    if (isLoading) {
        return <i className="icon icon-fw icon-circle-o-notch icon-spin fas"/>;
    }
    if (isShowingSortFields) {
        return <i className="icon icon-fw icon-times fas"/>;
    }
    if (descend){
        return <i className="sort-icon icon icon-fw icon-arrow-down fas"/>;
    } else {
        return <i className="sort-icon icon icon-fw icon-arrow-up fas"/>;
    }
});
