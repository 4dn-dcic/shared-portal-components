import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import Draggable from 'react-draggable';
import { getColumnWidthFromDefinition } from './ColumnCombiner';

/**
 * Assumes that is rendered by SearchResultTable and that a SortController instance
 * is above it in the component tree hierarchy (provide sortColumn, sortBy, sortReverse).
 *
 * Can exclude props passed by those two and HeadersRow features/UI will degrade gracefully.
 */
export class HeadersRow extends React.Component {

    static propTypes = {
        'columnDefinitions' : PropTypes.array.isRequired, //ResultRow.propTypes.columnDefinitions,
        'mounted' : PropTypes.bool.isRequired,
        'renderDetailPane' : PropTypes.func,
        'columnWidths' : PropTypes.objectOf(PropTypes.number),
        'setColumnWidths' : PropTypes.func,
        'width' : PropTypes.number,
        'defaultMinColumnWidth' : PropTypes.number,
        'tableContainerScrollLeft' : PropTypes.number
    };

    static defaultProps = {
        'defaultMinColumnWidth' : 55,
        'tableContainerScrollLeft' : 0
    };

    constructor(props){
        super(props);
        this.setColumnWidthsFromState = this.setColumnWidthsFromState.bind(this);
        this.getWidthFor = this.getWidthFor.bind(this);
        this.onAdjusterDrag = this.onAdjusterDrag.bind(this);
        this.state = { 'widths' : {} };
    }

    componentDidUpdate(pastProps){
        const { columnWidths } = this.props;
        if (pastProps.columnWidths !== columnWidths){
            this.setState({ 'widths' : {} });
        }
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
            columnWidths,
            setColumnWidths,
            width,
            tableContainerScrollLeft
        } = this.props;

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

        return (
            <div className={outerClassName} style={outerStyle}>
                <div className="columns clearfix" style={innerStyle}>
                    {
                        _.map(columnDefinitions, (colDef, i) =>
                            <HeadersRowColumn {..._.pick(this.props, 'sortColumn', 'sortReverse', 'sortBy', 'columnWidths')} colDef={colDef} index={i}
                                onAdjusterDrag={this.onAdjusterDrag} setHeaderWidths={this.setColumnWidthsFromState} width={this.getWidthFor(colDef, i)} key={colDef.field}  />
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
        const { colDef, onAdjusterDrag } = this.props;
        onAdjusterDrag(colDef, event, res);
    }

    /** Updates CustomColumnController.state.columnWidths from HeadersRow.state.widths */
    onStop(event, res){
        const { setHeaderWidths } = this.props;
        setHeaderWidths();
    }

    render(){
        const { sortColumn, sortBy, sortReverse, width, colDef, columnWidths, onAdjusterDrag } = this.props;
        const { noSort, colTitle, title, field } = colDef;
        const showTitle = colTitle || title;
        const tooltip = this.memoized.showTooltip(width, typeof colTitle === "string" ? colTitle : title) ? title : null;
        let sorterIcon;
        if (!colDef.noSort && typeof sortBy === 'function' && width >= 50){
            sorterIcon = <ColumnSorterIcon sortByFxn={sortBy} currentSortColumn={sortColumn} descend={sortReverse} value={colDef.field} />;
        }
        return (
            <div data-field={field} key={field} data-tip={tooltip}
                className={"search-headers-column-block" + (noSort ? " no-sort" : '')}
                style={{ width }}>
                <div className="inner">
                    <span className="column-title">{ showTitle }</span>
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

    static propTypes = {
        'currentSortColumn' : PropTypes.string,
        'descend' : PropTypes.bool,
        'value' : PropTypes.string.isRequired,
        'sortByFxn' : PropTypes.func.isRequired
    };

    static defaultProps = {
        'descend' : false
    };

    constructor(props){
        super(props);
        this.sortClickFxn = this.sortClickFxn.bind(this);
    }

    sortClickFxn(e){
        const { value, descend, currentSortColumn, sortByFxn } = this.props;
        e.preventDefault();
        const reverse = (currentSortColumn === value) && !descend;
        sortByFxn(value, reverse);
    }

    render(){
        const { value, descend, currentSortColumn } = this.props;
        if (typeof value !== 'string' || value.length === 0) {
            return null;
        }
        const style = !descend && currentSortColumn === value ? 'ascend' : 'descend';
        const linkClass = (
            (currentSortColumn === value ? 'active ' : '') +
            'column-sort-icon'
        );
        return (
            <span className={linkClass} onClick={this.sortClickFxn}>
                <ColumnSorterIconElement style={style} />
            </span>
        );
    }
}

const ColumnSorterIconElement = React.memo(function ColumnSorterIconElement({ style }){
    if (style === 'descend'){
        return <i className="icon icon-sort-down fas align-text-top"/>;
    }
    if (style === 'ascend'){
        return <i className="icon icon-sort-up fas align-bottom"/>;
    }
    throw new Error("Unsupported - " + style);
});
