'use strict';

/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import _ from 'underscore';
import queryString from 'querystring';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import Infinite from 'react-infinite';

import { Detail } from './../../ui/ItemDetailList';
import * as analytics from './../../util/analytics';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { isServerSide, isSelectAction } from './../../util/misc';
import { navigate as globalPageNavigate } from './../../util/navigate';
import { itemUtil } from './../../util/object';
import { load } from './../../util/ajax';
import { getPageVerticalScrollPosition, getElementOffset, responsiveGridState } from './../../util/layout';
import { getItemTypeTitle } from './../../util/schema-transforms';
import { requestAnimationFrame as raf, cancelAnimationFrame as caf, style as vizStyle } from './../../viz/utilities';
import { Alerts } from './../../ui/Alerts';

import { ResultRowColumnBlockValue } from './table-commons/ResultRowColumnBlockValue';
import { columnsToColumnDefinitions, getColumnWidthFromDefinition } from './table-commons/ColumnCombiner';
import { HeadersRow } from './table-commons/HeadersRow';
import { basicColumnExtensionMap } from './table-commons/basicColumnExtensionMap';




const ResultRowColumnBlock = React.memo(function ResultRowColumnBlock(props){
    const { columnDefinition, columnNumber, mounted, columnWidths, schemas, windowWidth } = props;
    const { field } = columnDefinition;
    let blockWidth;

    if (mounted){
        blockWidth = columnWidths[field] || getColumnWidthFromDefinition(columnDefinition, mounted, windowWidth);
    } else {
        blockWidth = getColumnWidthFromDefinition(columnDefinition, mounted, windowWidth);
    }

    return ( // props includes result
        <div className="search-result-column-block" style={{ "width" : blockWidth }}
            data-field={field} data-first-visible-column={columnNumber === 0 ? true : undefined}
            data-column-even={columnNumber % 2 === 0}>
            <ResultRowColumnBlockValue {...props} width={blockWidth} schemas={schemas} />
        </div>
    );
});


/** Not used anywhere (?) */
const DefaultDetailPane = React.memo(function DefaultDetailPane({ result }){
    return (
        <div>
            {result.description ?
                <div className="flexible-description-box result-table-result-heading">
                    {result.description}
                </div>
                : null}
            <div className="item-page-detail">
                <h4 className="text-300">Details</h4>
                <Detail context={result} open={false}/>
            </div>
        </div>
    );
});


class ResultDetail extends React.PureComponent{

    static propTypes = {
        'result' : PropTypes.object.isRequired,
        'open' : PropTypes.bool.isRequired,
        'renderDetailPane': PropTypes.func.isRequired,
        'rowNumber' : PropTypes.number,
        'toggleDetailOpen' : PropTypes.func.isRequired,
        'setDetailHeight' : PropTypes.func.isRequired,
        'tableContainerWidth' : PropTypes.number,
        'tableContainerScrollLeft' : PropTypes.number,
        'id' : PropTypes.string,
        'detailPaneHeight' : PropTypes.number
    };

    constructor(props){
        super(props);
        this.setDetailHeightFromPane = this.setDetailHeightFromPane.bind(this);
        this.state = { 'closing' : false };

        this.detailRef = React.createRef();

        // Unsure if worth keeping/using still?
        // Is potentially relevant but not ideally-implemented for BrowseView
        // which has DetailPane which itself has collapsible areas and the height
        // can thus vary outside of the open/closed toggle state in this table.
        // Ideally, those things could hook into `setDetailHeight` maybe...
        this.lastFoundHeight = null;
    }

    /**
     * @todo Call this function in ExperimentSetDetailPane to keep heights up-to-date
     * when Processed Files or Raw Files sections are expanded/collapsed as well as just row itself.
     */
    setDetailHeightFromPane(height = null){
        const { setDetailHeight } = this.props;
        let domElem = null;
        if (typeof height !== 'number'){
            domElem = this.detailRef && this.detailRef.current;
            height = domElem && parseInt(domElem.offsetHeight);
            if (typeof height === 'number' && !isNaN(height)){
                height += 2; // Account for border top & bottom of outer container
                this.lastFoundHeight = height;
            }
        }
        if (isNaN(height) || typeof height !== 'number') {
            height = this.lastFoundHeight || null;
        }
        setDetailHeight(height);
        return height;
    }

    componentDidUpdate(pastProps){
        const { open, setDetailHeight, result, context, rowNumber, href, isOwnPage } = this.props;
        const { open: pastOpen } = pastProps;
        if (pastOpen !== open){
            if (open && typeof setDetailHeight === 'function'){
                this.setDetailHeightFromPane();
                const { display_title } = result;
                analytics.productAddDetailViewed(result, context, {
                    "position": rowNumber,
                    "list": !isOwnPage ? "Embedded Search View": analytics.hrefToListName(href)
                });
                analytics.event("SearchResult DetailPane", "Opened", { eventLabel: display_title });

            } else if (!open && typeof setDetailHeight === 'function') {
                setDetailHeight(null); // Unset back to default (rowHeight)
            }
        }
    }

    render(){
        const {
            open, rowNumber, result, isOwnPage = true,
            tableContainerWidth, tableContainerScrollLeft,
            detailPane: propDetailPane,
            renderDetailPane, toggleDetailOpen, setDetailHeight, detailPaneHeight
        } = this.props;
        const { closing } = this.state;

        // Account for vertical scrollbar decreasing width of container.
        const containerWidth = isOwnPage ? tableContainerWidth : tableContainerWidth - 30;

        const propsFromTable = {
            open, toggleDetailOpen, tableContainerScrollLeft,
            setDetailHeight, detailPaneHeight, setDetailHeightFromPane : this.setDetailHeightFromPane
        };

        const detailPane = React.isValidElement(propDetailPane) ? React.cloneElement(propDetailPane, { result, rowNumber, containerWidth, propsFromTable })
            : typeof renderDetailPane === "function" ? renderDetailPane(result, rowNumber, containerWidth, propsFromTable)
                : null;


        return (
            <div className={"result-table-detail-container detail-" + (open || closing ? 'open' : 'closed')} style={{ minHeight: detailPaneHeight }}>
                { open ?
                    <div className="result-table-detail" ref={this.detailRef} style={{
                        width : containerWidth,
                        transform : vizStyle.translate3d(tableContainerScrollLeft)
                    }}>
                        { detailPane }
                        <div className="close-button-container text-center" onClick={toggleDetailOpen} data-tip="Collapse Details">
                            <i className="icon icon-angle-up fas"/>
                        </div>
                    </div>
                    : <div/> }
            </div>
        );
    }
}


class ResultRow extends React.PureComponent {

    static areWidthsEqual(arr1, arr2){
        if (arr1.length !== arr2.length) return false;
        for (var i = 0; i < arr1.length; i++){
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    static getStyles(rowWidth, rowHeight = 47, rowBottomPadding = 1){
        return {
            /* inner: { minHeight: rowHeight - rowBottomPadding }, */
            outer: { minWidth: rowWidth }
        };
    }

    static propTypes = {
        'result'            : PropTypes.shape({
            '@type'             : PropTypes.arrayOf(PropTypes.string).isRequired,
            '@id'               : PropTypes.string,
            'lab'               : PropTypes.object,
            'display_title'     : PropTypes.string.isRequired,
            'status'            : PropTypes.string,
            'date_created'      : PropTypes.string.isRequired
        }).isRequired,
        'rowNumber'         : PropTypes.number.isRequired,
        'rowHeight'         : PropTypes.number,
        'mounted'           : PropTypes.bool.isRequired,
        'columnDefinitions'     : HeadersRow.propTypes.columnDefinitions,
        'columnWidths' : PropTypes.objectOf(PropTypes.number),
        'renderDetailPane'  : PropTypes.func.isRequired,
        'detailPane' : PropTypes.element,
        'detailOpen' : PropTypes.bool.isRequired,
        'setDetailHeight' : PropTypes.func.isRequired,
        'id' : PropTypes.string.isRequired,
        'context' : PropTypes.object.isRequired
    };

    constructor(props){
        super(props);
        this.toggleDetailOpen = _.throttle(this.toggleDetailOpen.bind(this), 250);
        this.setDetailHeight = this.setDetailHeight.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.memoized = {
            getStyles: memoize(ResultRow.getStyles)
        };
    }

    // componentDidUpdate(pastProps){
    //     _.keys(this.props).forEach((k)=>{
    //         if (pastProps[k] !== this.props[k]){
    //             console.log(k, this.props[k], pastProps[k]);
    //         }
    //     });
    // }

    setDetailHeight(){
        const { id, setDetailHeight : parentSetDetailHeight } = this.props;
        parentSetDetailHeight(id, ...arguments);
    }

    toggleDetailOpen(){
        const { id, toggleDetailPaneOpen } = this.props;
        toggleDetailPaneOpen(id);
    }

    /** Add some JSON data about the result item upon initiating dragstart. */
    handleDragStart(evt){
        if (!evt || !evt.dataTransfer) return;
        const { result, href, schemas } = this.props;

        // TODO: handle lack of href and grab from window.location instead.

        // Result JSON itself.
        evt.dataTransfer.setData('text/4dn-item-json', JSON.stringify(result));

        // Result URL and @id.
        const hrefParts = typeof href === "string" ? url.parse(href) : window.location;
        const atId = itemUtil.atId(result);
        const formedURL = (
            (hrefParts.protocol || '') +
            (hrefParts.hostname ? '//' +  hrefParts.hostname + (hrefParts.port ? ':' + hrefParts.port : '') : '') +
            atId
        );
        evt.dataTransfer.setData('text/plain', formedURL);
        evt.dataTransfer.setData('text/uri-list', formedURL);
        evt.dataTransfer.setData('text/4dn-item-id', atId);

        // Add cool drag image (generate HTML element showing display_title and item type)
        if (!document || !document.createElement) return;
        const element = document.createElement('div');
        element.className = "draggable-item-cursor";
        let innerText = result.display_title;  // document.createTextNode('')
        const innerBoldElem = document.createElement('strong');
        innerBoldElem.appendChild(document.createTextNode(innerText));
        element.appendChild(innerBoldElem);
        element.appendChild(document.createElement('br'));
        innerText = getItemTypeTitle(result, schemas);  // document.createTextNode('')
        element.appendChild(document.createTextNode(innerText));
        document.body.appendChild(element);
        evt.dataTransfer.setDragImage(element, 150, 30);
        setTimeout(()=>{
            document.body.removeChild(element);
        }, 10);
    }

    renderColumns(){
        // TODO (?) prop func to do this to control which columns get which props.
        const { columnDefinitions } = this.props;
        // Contains required 'result', 'rowNumber', 'href', 'columnWidths', 'mounted', 'windowWidth', 'schemas', 'currentAction', 'detailOpen'
        const commonProps = _.omit(this.props, 'tableContainerWidth', 'tableContainerScrollLeft', 'renderDetailPane', 'detailPane', 'id', 'toggleDetailPaneOpen');
        return columnDefinitions.map((columnDefinition, columnNumber) => { // todo: rename columnNumber to columnIndex
            const { field } = columnDefinition;
            const passedProps = {
                ...commonProps, columnDefinition, columnNumber,
                // Only needed on first column (contains title, checkbox)
                'toggleDetailOpen' : columnNumber === 0 ? this.toggleDetailOpen : null
            };
            return <ResultRowColumnBlock {...passedProps} key={field} />;
        });
    }

    render(){
        const { rowNumber, currentAction, rowHeight, rowWidth, detailOpen } = this.props;
        const isDraggable = isSelectAction(currentAction);
        const styles = this.memoized.getStyles(rowWidth, rowHeight);

        /**
         * Props passed to ResultDetail include:
         * `result`, `renderDetailPane`, `rowNumber`, `tableContainerWidth`, `tableContainerScrollLeft`.
         */
        const detailProps = _.omit(this.props,
            'mounted', 'columnDefinitions',
            'detailOpen', 'setDetailHeight', 'columnWidths', 'setColumnWidths'
        );

        const cls = (
            "search-result-row"
            + " detail-" + (detailOpen ? 'open' : 'closed')
            + (isDraggable ? ' is-draggable' : '')
        );

        return (
            <div className={cls} data-row-number={rowNumber} style={styles.outer} /* ref={(r)=>{
                // TODO POTENTIALLY: Use to set height on open/close icon & sticky title column.
                var height = (r && r.offsetHeight) || null;
                if (height && height !== this.rowFullHeight){
                    this.rowFullHeight = height;
                }
            }}*/>
                <div className="columns clearfix result-table-row" draggable={isDraggable}
                    style={styles.inner} // Account for 1px border bottom on parent div
                    onDragStart={isDraggable ? this.handleDragStart : null}>
                    { this.renderColumns() }
                </div>
                <ResultDetail {...detailProps} open={!!(detailOpen)} detailPaneHeight={typeof detailOpen === "number" ? detailOpen : undefined}
                    toggleDetailOpen={this.toggleDetailOpen} setDetailHeight={this.setDetailHeight} />
            </div>
        );
    }
}


class LoadMoreAsYouScroll extends React.PureComponent {

    static propTypes = {
        'href' : PropTypes.string.isRequired,
        'results' : PropTypes.array.isRequired,                     // From parent
        'rowHeight' : PropTypes.number.isRequired,
        'isOwnPage' : PropTypes.bool.isRequired,
        'maxHeight' : PropTypes.number,
        'tableContainerScrollLeft' : PropTypes.number.isRequired,   // From parent
        'tableContainerWidth' : PropTypes.number.isRequired,        // From parent
        'setResults' : PropTypes.func.isRequired,                   // From parent
        'openDetailPanes' : PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.number, PropTypes.bool ])).isRequired, // From parent
        'canLoadMore' : PropTypes.bool.isRequired,                  // From parent
        'children' : PropTypes.arrayOf(PropTypes.element).isRequired, // From parent
        'mounted' : PropTypes.bool,
        'onDuplicateResultsFoundCallback' : PropTypes.func,
        'navigate' : PropTypes.func,
        'openRowHeight' : PropTypes.number.isRequired
    };

    static defaultProps = {
        'debouncePointerEvents' : 150,
        'onDuplicateResultsFoundCallback' : function(){
            Alerts.queue({ 'title' : 'Results Refreshed', 'message' : 'Results have changed while loading and have been refreshed.', 'navigateDisappearThreshold' : 1 });
        },
        'isOwnPage' : true,
    };

    static canLoadMore(totalExpected, results){
        return totalExpected > results.length;
    }

    /**
     * Used for memoization of styles that dont frequently change (prevent needless PureComponent updates).
     * `scrollableStyle` is applied to Infinite's outermost div element/container.
     */
    static getStyles(maxHeight){
        const styles = {};
        styles.scrollableStyle = {
            maxHeight,
            height: null, // Unset, let maxHeight take over.
            overflow: "auto" // Override "hidden scroll" default.
        };
        return styles;
    }

    constructor(props){
        super(props);
        this.handleLoad = _.throttle(this.handleLoad.bind(this), 3000);
        //this.handleScrollingStateChange = this.handleScrollingStateChange.bind(this);
        //this.handleScrollExt = this.handleScrollExt.bind(this);
        this.state = { 'isLoading' : false };
        if (typeof props.mounted === 'undefined'){
            this.state.mounted = false;
        }
        this.memoized = {
            getStyles: memoize(LoadMoreAsYouScroll.getStyles)
        };
        this.lastIsScrolling = false;
        this.infiniteComponentRef = React.createRef();
        this.currRequest = null;
    }

    componentDidMount(){
        if (typeof this.state.mounted === 'boolean') {
            this.setState({ 'mounted' : true });
        }
    }

    handleLoad(){
        const {
            // We usually only have _one_ of href or requestedCompoundFilterSet.
            href: origHref,
            requestedCompoundFilterSet: origCompoundFilterSet,
            results: existingResults = [],
            isOwnPage = true,
            onDuplicateResultsFoundCallback,
            setResults,
            navigate = globalPageNavigate // Use VirtualHrefController.virtualNavigate if is passed in.
        } = this.props;

        const nextFromValue = existingResults.length;

        let nextHref = null;
        let nextCompoundFilterSetRequest = null;
        if (typeof origHref === "string") {
            const parts = url.parse(origHref, true); // memoizedUrlParse not used in case is EmbeddedSearchView.
            const { query } = parts;
            query.from = nextFromValue;
            parts.search = '?' + queryString.stringify(query);
            nextHref = url.format(parts);
        } else {
            nextCompoundFilterSetRequest = {
                ...origCompoundFilterSet,
                "from" : nextFromValue
            };
        }

        let requestInThisScope = null;

        if (this.currRequest) {
            this.currRequest.abort();
        }

        const loadCallback = (resp) => {

            if (requestInThisScope !== this.currRequest){ // Shouldn't occur - extra redundancy
                console.warn("Throwing out outdated load-more-as-you-scroll request.");
                return false;
            }

            const { '@graph' : nextResults = [] } = resp || {};
            const nextResultsLen = nextResults.length;

            if (nextResultsLen > 0){
                // Check if have same result, if so, refresh all results (something has changed on back-end)
                const oldKeys = _.map(existingResults, itemUtil.atId);
                const newKeys = _.map(nextResults, itemUtil.atId);
                const keyIntersection = _.intersection(oldKeys.sort(), newKeys.sort());
                if (keyIntersection.length > 0){
                    console.error('FOUND ALREADY-PRESENT RESULT IN NEW RESULTS', keyIntersection, newKeys);
                    this.setState({ 'isLoading' : false }, ()=>{
                        navigate('', { 'inPlace' : true }, onDuplicateResultsFoundCallback);
                    });
                } else {
                    this.setState({ 'isLoading' : false }, ()=>{
                        analytics.impressionListOfItems(
                            nextResults,
                            nextHref || window.location.href,
                            isOwnPage ? analytics.hrefToListName(nextHref) : "Embedded Search View"
                        );
                        analytics.event('SearchResultTable', "Loaded More Results", { eventValue: nextFromValue });
                        setResults(existingResults.slice(0).concat(nextResults));
                    });
                }
            } else {
                this.setState({  'isLoading' : false });
            }

            this.currRequest = null;
        };

        this.setState({ 'isLoading' : true }, () => {
            this.currRequest = requestInThisScope = load(
                nextCompoundFilterSetRequest ? "/compound_search" : nextHref,
                loadCallback,
                nextCompoundFilterSetRequest ? "POST" : "GET",
                loadCallback,
                nextCompoundFilterSetRequest ? JSON.stringify(nextCompoundFilterSetRequest) : null
            );
        });
    }

    render(){
        const {
            children, rowHeight, openDetailPanes, openRowHeight, tableContainerWidth, tableContainerScrollLeft,
            mounted: propMounted, isOwnPage, maxHeight, canLoadMore
        } = this.props;
        const { mounted: stateMounted, isLoading } = this.state;
        if (!(propMounted || stateMounted)){
            return (
                <div className="react-infinite-container">
                    <div>{ children }</div>
                </div>
            );
        }

        const elementHeight = _.keys(openDetailPanes).length === 0 ? rowHeight : React.Children.map(children, function(c){
            // openRowHeight + openDetailPane height
            const savedHeight = openDetailPanes[c.props.id];
            if (savedHeight && typeof savedHeight === 'number'){
                return openDetailPanes[c.props.id] + openRowHeight;
            }
            return rowHeight;
        });

        return (
            <Infinite
                className="react-infinite-container"
                ref={this.infiniteComponentRef}
                elementHeight={elementHeight}
                containerHeight={(!isOwnPage && maxHeight) || undefined}
                useWindowAsScrollContainer={isOwnPage}
                onInfiniteLoad={this.handleLoad}
                isInfiniteLoading={isLoading}
                timeScrollStateLastsForAfterUserScrolls={250}
                //onChangeScrollState={this.handleScrollingStateChange}
                loadingSpinnerDelegate={<LoadingSpinner width={tableContainerWidth} scrollLeft={tableContainerScrollLeft} />}
                infiniteLoadBeginEdgeOffset={canLoadMore ? 200 : undefined}
                preloadAdditionalHeight={Infinite.containerHeightScaleFactor(1.5)}
                preloadBatchSize={Infinite.containerHeightScaleFactor(1.5)}
                styles={isOwnPage ? null : this.memoized.getStyles(maxHeight)}>
                { children }
            </Infinite>
        );
    }
}

const LoadingSpinner = React.memo(function LoadingSpinner({ width: maxWidth, scrollLeft = 0 }){
    const style = { maxWidth, 'transform' : vizStyle.translate3d(scrollLeft) };
    return (
        <div className="search-result-row loading text-center d-flex align-items-center justify-content-center" style={style}>
            <span>
                <i className="icon icon-circle-notch icon-spin fas" />&nbsp; Loading...
            </span>
        </div>
    );
});

class ShadowBorderLayer extends React.Component {

    static shadowStateClass(hiddenLeftEdgeContentWidth = 0, hiddenRightEdgeContentWidth = 0){
        var shadowBorderClassName = "";
        if (hiddenLeftEdgeContentWidth > 0) shadowBorderClassName += ' shadow-left';
        if (hiddenRightEdgeContentWidth > 0) shadowBorderClassName += ' shadow-right';
        return shadowBorderClassName;
    }

    static edgeHiddenContentWidths(fullRowWidth, tableContainerScrollLeft, tableContainerWidth){
        const edges = { 'left' : 0, 'right' : 0 };
        if (fullRowWidth > tableContainerWidth){
            if (tableContainerScrollLeft > 5){
                edges.left = tableContainerScrollLeft;
            }
            if (tableContainerScrollLeft + tableContainerWidth <= fullRowWidth - 5){
                edges.right = ((fullRowWidth - tableContainerWidth) - tableContainerScrollLeft);
            }
        }
        return edges;
    }

    static defaultProps = {
        'horizontalScrollRateOnEdgeButton' : 10
    };

    constructor(props){
        super(props);
        this.scrolling = false;
        this.performScrollAction = this.performScrollAction.bind(this);
        this.handleLeftScrollButtonMouseDown = this.handleScrollButtonMouseDown.bind(this, 'left');
        this.handleRightScrollButtonMouseDown = this.handleScrollButtonMouseDown.bind(this, 'right');
        this.handleScrollButtonUp = this.handleScrollButtonUp.bind(this);
        this.memoized = {
            edgeHiddenContentWidths: memoize(ShadowBorderLayer.edgeHiddenContentWidths)
        };
    }

    shouldComponentUpdate(nextProps){
        const { fullRowWidth, tableContainerScrollLeft, tableContainerWidth } = this.props;
        const { fullRowWidth: nxtRowWidth, tableContainerScrollLeft: nxtLeft, tableContainerWidth: nxtTableWidth } = nextProps;
        if (typeof nextProps.tableContainerWidth !== "number") return false;
        const pastEdges = this.memoized.edgeHiddenContentWidths(fullRowWidth, tableContainerScrollLeft, tableContainerWidth);
        const newEdges = ShadowBorderLayer.edgeHiddenContentWidths(nxtRowWidth, nxtLeft, nxtTableWidth);
        if (newEdges.left !== pastEdges.left || newEdges.right !== pastEdges.right) return true;
        return false;
    }

    handleScrollButtonMouseDown(direction = "right", evt){
        if (evt.button === 0) { // Left click
            this.scrolling = true;
            this.performScrollAction(direction);
        }
    }

    performScrollAction(direction = "right"){
        const { horizontalScrollRateOnEdgeButton, tableContainerWidth, fullRowWidth, tableContainerScrollLeft, getScrollContainer, setContainerScrollLeft } = this.props;
        const scrollAction = (depth) => {
            const scrollContainer = getScrollContainer();
            if (!scrollContainer) return;
            const change = (direction === 'right' ? 1 : -1) * horizontalScrollRateOnEdgeButton;
            const maxScrollLeft = fullRowWidth - tableContainerWidth;
            const leftOffset = Math.max(0, Math.min(maxScrollLeft, scrollContainer.scrollLeft + change));
            scrollContainer.scrollLeft = leftOffset;
            setContainerScrollLeft(leftOffset);

            if (depth >= 10000){
                console.error("Reached depth 10k on a recursive function 'performScrollAction.'");
                return;
            }

            if (this.scrolling) {
                raf(function(){
                    scrollAction(depth + 1);
                });
            }
        };

        scrollAction(0);
    }

    handleScrollButtonUp(){
        this.scrolling = false;
    }

    render(){
        const { tableContainerWidth, fullRowWidth, tableContainerScrollLeft, fixedPositionArrows = true } = this.props;
        if (!tableContainerWidth) return null;
        if (fullRowWidth <= tableContainerWidth) return null;
        const edges = this.memoized.edgeHiddenContentWidths(fullRowWidth, tableContainerScrollLeft, tableContainerWidth);
        const cls = (
            "shadow-border-layer hidden-xs" +
            ShadowBorderLayer.shadowStateClass(edges.left, edges.right) +
            (fixedPositionArrows ? ' fixed-position-arrows' : '')
        );
        return (
            <div className={cls}>
                <div className={"edge-scroll-button left-edge" + (typeof edges.left !== 'number' || edges.left === 0 ? " faded-out" : "")}
                    onMouseDown={this.handleLeftScrollButtonMouseDown} onMouseUp={this.handleScrollButtonUp} onMouseOut={this.handleScrollButtonUp}>
                    <i className="icon icon-caret-left fas"/>
                </div>
                <div className={"edge-scroll-button right-edge" + (typeof edges.right !== 'number' || edges.right === 0 ? " faded-out" : "")}
                    onMouseDown={this.handleRightScrollButtonMouseDown} onMouseUp={this.handleScrollButtonUp} onMouseOut={this.handleScrollButtonUp}>
                    <i className="icon icon-caret-right fas"/>
                </div>
            </div>
        );
    }
}


class DimensioningContainer extends React.PureComponent {

    static setDetailPanesLeftOffset(detailPanes, leftOffset = 0, cb = null){
        if (detailPanes && detailPanes.length > 0){
            var transformStyle = vizStyle.translate3d(leftOffset);
            _.forEach(detailPanes, function(d){
                d.style.transform = transformStyle;
            });
        }
        if (typeof cb === 'function') cb();
    }

    static findDetailPaneElements(){
        if (document && document.querySelectorAll){
            return Array.from(document.querySelectorAll('.result-table-detail'));
        }
        return null;
    }

    static fullRowWidth(visibleColumnDefinitions, mounted=true, dynamicWidths=null, windowWidth=null){
        return _.reduce(visibleColumnDefinitions, function(fw, colDef){
            let w;
            if (dynamicWidths && typeof dynamicWidths[colDef.field] === "number") {
                w = dynamicWidths[colDef.field];
            } else {
                w = getColumnWidthFromDefinition(colDef, mounted, windowWidth);
            }
            if (isNaN(w)) {
                throw new Error("Could not get row/col width");
            }
            return fw + w;
        }, 0);
    }

    static getTableDims(scrollContainer, windowWidth){
        if (!SearchResultTable.isDesktopClientside(windowWidth)){
            return {
                'tableContainerWidth'       : (scrollContainer && scrollContainer.offsetWidth) || null,
                'tableContainerScrollLeft'  : null
            };
        }
        return {
            'tableContainerWidth'       : (scrollContainer && scrollContainer.offsetWidth) || null,
            'tableContainerScrollLeft'  : (scrollContainer && typeof scrollContainer.scrollLeft === 'number') ? scrollContainer.scrollLeft : null
        };
    }

    static getDerivedStateFromProps({ results: ctxResults = [] }, { originalResults }){
        if (ctxResults !== originalResults) {
            // `context` has changed upstream, reset results and detail panes.
            return {
                'results' : ctxResults.slice(0),
                'openDetailPanes' : {},
                'originalResults' : ctxResults
            };
        }
        return null;
    }

    constructor(props){
        super(props);
        this.getScrollContainer = this.getScrollContainer.bind(this);
        this.getScrollableElement = this.getScrollableElement.bind(this);
        this.throttledUpdate = _.debounce(this.forceUpdate.bind(this), 500);
        this.toggleDetailPaneOpen = _.throttle(this.toggleDetailPaneOpen.bind(this), 500);
        this.setDetailHeight = this.setDetailHeight.bind(this);
        //this.setContainerScrollLeft = this.setContainerScrollLeft.bind(this);
        this.setContainerScrollLeft = _.throttle(this.setContainerScrollLeft.bind(this), 250);
        this.onHorizontalScroll = this.onHorizontalScroll.bind(this);
        this.setResults = this.setResults.bind(this);
        this.canLoadMore = this.canLoadMore.bind(this);
        const { results: originalResults = [] } = props;
        this.state = {
            'mounted'   : false,
            'results'   : originalResults.slice(0),
            // { row key : detail pane height } used for determining if detail pane is open + height for Infinite listview
            'openDetailPanes' : {},
            'tableContainerScrollLeft' : 0,
            'tableContainerWidth' : 0,
            originalResults // Reference to original results in order to utilize getDerivedStateFromProps.
        };

        if (this.state.results.length > 0 && Array.isArray(props.defaultOpenIndices) && props.defaultOpenIndices.length > 0){
            this.state.openDetailPanes[ itemUtil.atId(this.state.results[0]) ] = true;
        }

        this.outerRef = React.createRef();
        this.outerContainerSizeInterval = null;
        this.scrollHandlerUnsubscribeFxn = null;

        this.memoized = {
            fullRowWidth: memoize(DimensioningContainer.fullRowWidth)
        };
    }

    getScrollContainer(){
        const outerContainerElem = this.outerRef.current;
        // THIS IS SUBJECT TO CHANGE RE: REACT-INFINITE LIBRARY. ACCESSING IN SUCH WAY IS ANTI-PATTERN TO BEGIN WITH...
        // React-infinite hasn't been updated as of mid-2018 (as of January 2020) so certain newer patterns aren't being utilized,
        // such as forwardRef. Theoretically it might be worth considering making PRs to the library if can be more certain they'd be
        // reviewed and merged..

        //const scrollContainer = infiniteComponent && infiniteComponent.scrollable;
        const scrollContainer = outerContainerElem.querySelector(".react-infinite-container");
        if (!scrollContainer) {
            throw new Error("Could not get scroll container from React-Infinite. Check to see if library has been updated");
        }
        return scrollContainer;
    }

    getScrollableElement(){
        return this.getScrollContainer().children[0];
    }

    componentDidMount(){
        const nextState = { 'mounted' : true };

        // Maybe todo: play with 'experimental technology' for controlling columing widths (& compare performance),
        // see https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/styleSheets
        // and https://developer.mozilla.org/en-US/docs/Web/API/CSSStylesheet.
        // Probably do in separate component since seems like hefty-enough logic to separate/modularize.
        // this.isDynamicStylesheetSupported = typeof document.styleSheets !== "undefined";
        // if (this.isDynamicStylesheetSupported) {
        //    insert new <style> element somewhere (new stylesheet?), save reference (prly doesnt do ton.. w/e)
        //    check that new sheet exists in document.styleSheets, start setting widths per column via CSS rules
        //    deleting and inserting upon any changes, accordingly. Use componentDidUpdate or useEffect for this,
        //    re: props.widths (this table's state.widths) changes.
        //    (This all within new component if supported, else pass widths down to cols as fallback (?) from this component)
        // }

        // Detect if table width changes (and update dims if true) every 5sec
        // No way to attach resize event listener to an element (only to window)
        // and element might change width independent of window (e.g. open/hide
        // facetlist in future, expand table to fullscreen, etc.)
        this.outerContainerSizeInterval = setInterval(()=>{
            this.setState(({ tableContainerWidth: pastWidth }, { windowWidth }) => {
                const currDims = DimensioningContainer.getTableDims(this.getScrollContainer(), windowWidth);
                if (pastWidth !== currDims.tableContainerWidth){
                    return currDims;
                }
                return null;
            });
        }, 5000);

        this.setState(nextState, ReactTooltip.rebuild);
    }

    componentWillUnmount(){
        if (this.scrollHandlerUnsubscribeFxn){
            this.scrollHandlerUnsubscribeFxn();
            delete this.scrollHandlerUnsubscribeFxn;
        }
        if (this.outerContainerSizeInterval){
            clearInterval(this.outerContainerSizeInterval);
            this.outerContainerSizeInterval = null;
        }
        const scrollContainer = this.getScrollContainer();
        scrollContainer && scrollContainer.removeEventListener('scroll', this.onHorizontalScroll);
    }

    componentDidUpdate(pastProps, pastState){
        const { results: loadedResults, mounted } = this.state;
        const { results: pastLoadedResults, mounted: pastMounted } = pastState;
        const { windowWidth } = this.props;
        const { windowWidth: pastWindowWidth } = pastProps;

        if (pastLoadedResults !== loadedResults){
            ReactTooltip.rebuild();
        }

        const didMount = !pastMounted && mounted;

        if (didMount || pastWindowWidth !== windowWidth){
            // This used to be in componentDidMount, however X-axis scroll container is now react-infinite elem
            // which doesn't appear until after mount
            const scrollContainer = this.getScrollContainer();
            const nextState = DimensioningContainer.getTableDims(scrollContainer, windowWidth);
            this.setState(nextState, didMount ? ReactTooltip.rebuild : null);
            if (didMount && scrollContainer) {
                scrollContainer.addEventListener('scroll', this.onHorizontalScroll);
            }
        }

    }

    toggleDetailPaneOpen(rowKey, cb = null){
        this.setState(function({ openDetailPanes }){
            openDetailPanes = _.clone(openDetailPanes);
            if (openDetailPanes[rowKey]){
                delete openDetailPanes[rowKey];
            } else {
                openDetailPanes[rowKey] = true;
            }
            return { openDetailPanes };
        }, cb);
    }

    setDetailHeight(rowKey, height, cb){
        this.setState(function({ openDetailPanes }){
            openDetailPanes = _.clone(openDetailPanes);
            if (typeof openDetailPanes[rowKey] === 'undefined'){
                return null;
            }
            openDetailPanes[rowKey] = typeof height === "number" && !isNaN(height) ? height : true;
            return { openDetailPanes };
        }, cb);
    }

    setContainerScrollLeft(tableContainerScrollLeft){
        this.setState({ tableContainerScrollLeft });
    }

    onHorizontalScroll(e){
        const innerElem = e.target;

        // ( Shouldn't need to do commented out stuff if layout is within width )
        // Bound it, test again
        // const { columnDefinitions, windowWidth } = this.props;
        // const fullRowWidth = this.memoized.fullRowWidth(columnDefinitions, mounted, widths, windowWidth);
        // nextScrollLeft = Math.min(
        //     nextScrollLeft,
        //     (fullRowWidth - tableContainerWidth)
        // );

        if (this.horizScrollRAF){
            caf(this.horizScrollRAF);
        }

        this.horizScrollRAF = raf(()=>{
            const { tableContainerScrollLeft } = this.state;
            let nextScrollLeft = innerElem.scrollLeft;

            if (nextScrollLeft < 0) {
                nextScrollLeft = 0; // Might occur right after changing column widths or something.
            }

            const columnsWrapperElement = innerElem.parentElement.childNodes[0].childNodes[0].childNodes[0];
            columnsWrapperElement.style.left = `-${nextScrollLeft}px`;

            if (nextScrollLeft !== tableContainerScrollLeft) { // Shouldn't occur or matter but presence of this seems to improve smoothness (?)
                this.setContainerScrollLeft(nextScrollLeft);
            }

            delete this.horizScrollRAF;
        });

        return false;
    }

    setResults(results, cb){
        this.setState({
            'results' : _.uniq(results, false, itemUtil.atId)
        }, cb);
    }

    canLoadMore(){
        const { context : { total = 0 } = {}, isContextLoading = false } = this.props;
        const { results = [] } = this.state;
        return !isContextLoading && LoadMoreAsYouScroll.canLoadMore(total, results);
    }

    render(){
        const {
            columnDefinitions, // Has been renamed from 'visibleColumnDefinitions' in SearchResultTable (if was present)
            windowWidth,
            context, // May be page context or virtualContext
            isOwnPage = true,
            navigate,
            rowHeight = 47, // `rowHeight - rowBottomPadding` must be aligned in CSS stylesheets
            openRowHeight = 57,
            maxHeight = 500, // Only used if not isOwnPage
            isContextLoading = false,
            setColumnWidths,
            columnWidths
        } = this.props;
        const { results, tableContainerWidth, tableContainerScrollLeft, mounted, openDetailPanes } = this.state;

        const fullRowWidth = this.memoized.fullRowWidth(columnDefinitions, mounted, columnWidths, windowWidth);
        const canLoadMore = this.canLoadMore();
        const anyResults = results.length > 0;

        const headerRowCommonProps = {
            ..._.pick(this.props, 'columnDefinitions', 'sortBy', 'sortColumn', 'sortReverse',
                'defaultMinColumnWidth', 'renderDetailPane', 'detailPane', 'windowWidth'),
            mounted, results, rowHeight, setColumnWidths, columnWidths,
            tableContainerScrollLeft
        };

        const resultRowCommonProps = _.extend(
            _.pick(this.props, 'renderDetailPane', 'detailPane', 'href', 'currentAction', 'schemas', 'termTransformFxn'),
            {
                context, rowHeight, navigate, isOwnPage, columnWidths,
                columnDefinitions, tableContainerWidth, tableContainerScrollLeft, windowWidth,
                'mounted' : mounted || false,
                'rowWidth' : fullRowWidth,
                'toggleDetailPaneOpen' : this.toggleDetailPaneOpen,
                'setDetailHeight' : this.setDetailHeight,
            }
        );

        const loadMoreAsYouScrollProps = {
            ..._.pick(this.props, 'href', 'onDuplicateResultsFoundCallback', 'schemas', 'navigate'),
            context, rowHeight, openRowHeight,
            results, openDetailPanes, maxHeight, isOwnPage, fullRowWidth, canLoadMore, anyResults,
            tableContainerWidth, tableContainerScrollLeft, windowWidth, mounted,
            setResults: this.setResults
        };

        let headersRow = null;
        let shadowBorderLayer = null;

        if (anyResults) {
            headersRow = <HeadersRow {...headerRowCommonProps} />;
            shadowBorderLayer = (
                <ShadowBorderLayer {...{ tableContainerScrollLeft, tableContainerWidth, fullRowWidth }}
                    setContainerScrollLeft={this.setContainerScrollLeft} fixedPositionArrows={isOwnPage}
                    getScrollContainer={this.getScrollContainer} />
            );
        }

        const renderChildren = !anyResults ? (
            <div className="text-center py-5">
                <h3 className="text-300">No Results</h3>
            </div>
        ) : results.map(function(result, idx){
            const id = itemUtil.atId(result);
            const detailOpen = openDetailPanes[id] || false;
            // We can skip passing tableContainerScrollLeft unless detail pane open to improve performance
            // else all rows get re-rendered (in virtual DOM atleast) on horizontal scroll due to prop value
            // changing. Alternatively could've made a shouldComponentUpdate in ResultRow (but need to keep track of more).
            return (
                <ResultRow {...resultRowCommonProps} {...{ result, id, detailOpen }} rowNumber={idx} key={id}
                    tableContainerScrollLeft={detailOpen ? tableContainerScrollLeft : 0}/>
            );
        });

        if (anyResults && !canLoadMore) {
            renderChildren.push(
                <div className="fin search-result-row" key="fin-last-item" style={{
                    // Account for vertical scrollbar decreasing width of container.
                    width: tableContainerWidth - (isOwnPage ? 0 : 30),
                    transform: vizStyle.translate3d(tableContainerScrollLeft)
                }}>
                    <div className="inner">
                        - <span>fin</span> -
                    </div>
                </div>
            );
        }

        return (
            <div className={"search-results-outer-container" + (isOwnPage ? " is-own-page" : " is-within-page")}
                ref={this.outerRef} data-context-loading={isContextLoading}>
                <div className={"search-results-container" + (canLoadMore === false ? ' fully-loaded' : '')}>
                    { headersRow }
                    <LoadMoreAsYouScroll {...loadMoreAsYouScrollProps}>
                        { renderChildren }
                    </LoadMoreAsYouScroll>
                    { shadowBorderLayer }
                </div>
            </div>
        );
    }

}


/**
 * Reusable table for displaying search results according to column definitions.
 *
 * @todo Maybe make into functional component w/ useMemo-ized `filterOutHiddenCols` dep. on syntactic preference.
 *
 * @class SearchResultTable
 * @prop {Object[]}         results             Results as returned from back-end, e.g. props.context['@graph'].
 * @prop {Object[]}         columns             List of column definitions.
 * @prop {Object}           [defaultWidthMap]   Default column widths per responsive grid state. Applied to all non-constant columns.
 * @prop {string[]}         [hiddenColumns]     Keys of columns to remove from final columnDefinitions before rendering.
 * @prop {function}         [renderDetailPane]  An instance of a React component which will receive prop 'result'.
 * @prop {string}           sortColumn          Current sort column, as fed by SortController.
 * @prop {boolean}          sortReverse         Whether current sort column is reversed, as fed by SortController.
 * @prop {function}         sortBy              Callback function for performing a sort, acceping 'sortColumn' and 'sortReverse' as params. As fed by SortController.
 * @prop {function}         termTransformFxn    Function passed from parent portal to transform system values into human readable values. Is portal-specific; not used if `render` for field in columnExtensionMap/columnDefinition exists/used.
 */
export class SearchResultTable extends React.Component {

    static isDesktopClientside(windowWidth){
        return !isServerSide() && responsiveGridState(windowWidth) !== 'xs';
    }

    static propTypes = {
        'results'           : PropTypes.arrayOf(ResultRow.propTypes.result).isRequired,
        // Either href or requestedCompoundFilterSet should be present:
        'href'              : PropTypes.string,
        'requestedCompoundFilterSet' : PropTypes.object,
        'columnDefinitions' : PropTypes.arrayOf(PropTypes.object),
        'defaultWidthMap'   : PropTypes.shape({ 'lg' : PropTypes.number.isRequired, 'md' : PropTypes.number.isRequired, 'sm' : PropTypes.number.isRequired }).isRequired,
        'hiddenColumns'     : PropTypes.objectOf(PropTypes.bool),
        // One of the following 2 is recommended for custom detail panes:
        'renderDetailPane'  : PropTypes.func,
        'detailPane'        : PropTypes.element,
        'context'           : PropTypes.shape({
            'total'             : PropTypes.number.isRequired
        }).isRequired,
        'windowWidth'       : PropTypes.number.isRequired,
        'registerWindowOnScrollHandler' : PropTypes.func.isRequired,
        'columnExtensionMap' : PropTypes.objectOf(PropTypes.shape({
            "title" : PropTypes.string.isRequired,
            "widthMap" : PropTypes.shape({ 'lg' : PropTypes.number, 'md' : PropTypes.number, 'sm' : PropTypes.number }),
            "minColumnWidth" : PropTypes.number,
            "order" : PropTypes.number,
            "render" : PropTypes.func,
            "noSort" : PropTypes.bool
        })),
        'termTransformFxn' : PropTypes.func.isRequired,
        'isOwnPage' : PropTypes.bool,
        'maxHeight' : PropTypes.number, //PropTypes.oneOfType([PropTypes.number, PropTypes.string]) // Used only if isOwnPage is false
        'isContextLoading' : PropTypes.bool
    };

    static defaultProps = {
        //'columnExtensionMap' : basicColumnExtensionMap,
        'columnDefinitions' : columnsToColumnDefinitions({ 'display_title' : { 'title' : 'Title' } }, basicColumnExtensionMap), // Fallback - just title column.
        'renderDetailPane' : function(result, rowNumber, width, props){ return <DefaultDetailPane {...props} {...{ result, rowNumber, width }} />; },
        'detailPane' : null,
        'defaultMinColumnWidth' : 55,
        'hiddenColumns' : null,
        // This value (the default or if passed in) should be aligned to value in CSS.
        // Must account for any border or padding at bottom/top of row, as well.
        'rowHeight' : 47,
        'openRowHeight' : 57,
        'fullWidthInitOffset' : 60,
        'fullWidthContainerSelectorString' : '.browse-page-container',
        'currentAction' : null,
        'isOwnPage' : true,
        'maxHeight' : 400, // Used only if isOwnPage is false; todo: maybe move this defaultProp definition higher up into EmbeddedSearchView and leave null here.
        'isContextLoading' : false // Used only if isOwnPage is false
    };

    render(){
        const { context, visibleColumnDefinitions, columnDefinitions, isContextLoading = false, isOwnPage } = this.props;

        if (isContextLoading && !context) {
            // Initial context (pre-sort, filter, etc) loading.
            // Only applicable for EmbeddedSearchView
            // Maybe move up to ControlsAndResults?
            return (
                <div className={"search-results-outer-container text-center" + (isOwnPage ? " is-own-page" : " is-within-page")}>
                    <div className="search-results-container text-center text-secondary py-5">
                        <i className="icon icon-fw icon-spin icon-circle-notch fas icon-2x" />
                    </div>
                </div>
            );
        }

        // We filter down the columnDefinitions here (rather than in CustomColumnController)
        // because they are still necessary for UI for selection of visible/invisible columns
        // in SearchView/ControlsAndResults/AboveSearchViewTableControls/....
        return (
            <DimensioningContainer
                {..._.omit(this.props, 'hiddenColumns', 'columnDefinitionOverrideMap', 'defaultWidthMap')}
                columnDefinitions={visibleColumnDefinitions || columnDefinitions} />
        );
    }
}
