'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { Alerts } from './../ui/Alerts';
import { navigate } from './../util/navigate';
import { isSelectAction } from './../util/misc';
import { getAbstractTypeForType, getSchemaTypeFromSearchContext, getTitleForType } from './../util/schema-transforms';
import { determineIfTermFacetSelected, getTermFacetStatus } from './../util/search-filters';
import { itemUtil } from './../util/object';
import { patchedConsoleInstance as console } from './../util/patched-console';

import { basicColumnExtensionMap, ColumnCombiner } from './components/table-commons';
import { AboveSearchTablePanel } from './components/AboveSearchTablePanel';
import { AboveSearchViewTableControls } from './components/above-table-controls/AboveSearchViewTableControls';
import { CustomColumnController } from './components/CustomColumnController';
import { SearchResultTable } from './components/SearchResultTable';
import { FacetList, generateNextHref, performFilteringQuery } from './components/FacetList';
import { SearchResultDetailPane } from './components/SearchResultDetailPane';
import { SortController } from './components/SortController';
import { SelectedItemsController, SelectStickyFooter } from './components/SelectedItemsController';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../util/typedefs';


/**
 * Provides callbacks for FacetList to filter on term click and check if a term is selected by interfacing with the
 * `href` prop and the `navigate` callback prop or fxn (usually utils/navigate.js).
 *
 * Manages and updates `state.defaultHiddenColumns`, which in turn resets CustomColumnController state with new columns,
 * if search type has changed.
 *
 * Passes other props down to ControlsAndResults.
 */
export function SearchControllersContainer(props){

    // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
    // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
    const { context, href, columns = null, columnExtensionMap, currentAction, navigate: propNavigate = navigate } = props;

    // All these controllers pass props down to their children.
    // So we don't need to be repetitive here; i.e. may assume 'context' is available
    // in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.

    let controllersAndView = (
        <WindowNavigationController {...{ href, context }} navigate={propNavigate}>
            <ColumnCombiner {...{ columns, columnExtensionMap }}>
                <CustomColumnController>
                    <SortController>
                        <ControlsAndResults {...props} />
                    </SortController>
                </CustomColumnController>
            </ColumnCombiner>
        </WindowNavigationController>
    );

    if (isSelectAction(currentAction)) {
        controllersAndView = <SelectedItemsController>{ controllersAndView }</SelectedItemsController>;
    }

    return controllersAndView;

}
SearchControllersContainer.defaultProps = {
    'navigate' : navigate,
    'columns' : null
};

// TODO: FINISH
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
        const { children, ...passProps } = this.props;

        console.log("PROPS", passProps);

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




class ControlsAndResults extends React.PureComponent {

    /**
     * Parses out the specific item type from `props.href` and finds the abstract item type, if any.
     *
     * @param {Object} props Component props.
     * @returns {{ specificType: string, abstractType: string }} The leaf specific Item type and parent abstract type (before 'Item' in `@type` array) as strings in an object.
     * Ex: `{ abstractType: null, specificType: "Item" }`, `{ abstractType: "Experiment", specificType: "ExperimentHiC" }`
     */
    static searchItemTypesFromHref(href, schemas){
        let specificType = 'Item';    // Default
        let abstractType = null;      // Will be equal to specificType if no parent type.

        // May or may not be props.href passed down from Redux (e.g. not if is EmbeddedSearchView)
        const urlParts = url.parse(href, true);

        // Non-zero chance of having array here - though shouldn't occur unless URL entered into browser manually
        // If we do get multiple Item types defined, we treat as if searching `type=Item` (== show `type` facet + column).
        if (typeof urlParts.query.type === 'string') {
            if (urlParts.query.type !== 'Item') {
                specificType = urlParts.query.type;
            }
        }

        abstractType = getAbstractTypeForType(specificType, schemas) || null;
        return { specificType, abstractType };
    }

    static isClearFiltersBtnVisible(href, context){
        const urlPartsQuery = url.parse(href, true).query || {};
        const clearFiltersURL = (typeof context.clear_filters === 'string' && context.clear_filters) || null;
        const clearFiltersURLQuery = clearFiltersURL && url.parse(clearFiltersURL, true).query;

        return !!(clearFiltersURLQuery && !_.isEqual(clearFiltersURLQuery, urlPartsQuery));
    }

    constructor(props){
        super(props);
        this.forceUpdateOnSelf = this.forceUpdateOnSelf.bind(this);
        this.onClearFiltersClick = this.onClearFiltersClick.bind(this);
        this.columnExtensionMapWithSelectButton = this.columnExtensionMapWithSelectButton.bind(this);
        this.renderSearchDetailPane = this.renderSearchDetailPane.bind(this);

        this.memoized = {
            searchItemTypesFromHref : memoize(ControlsAndResults.searchItemTypesFromHref),
            isClearFiltersBtnVisible: memoize(ControlsAndResults.isClearFiltersBtnVisible)
        };

        this.searchResultTableRef = React.createRef();
    }

    columnExtensionMapWithSelectButton(columnExtensionMap, currentAction, specificType, abstractType){
        const inSelectionMode = isSelectAction(currentAction);

        if (!inSelectionMode && (!abstractType || abstractType !== specificType)){
            return columnExtensionMap;
        }

        columnExtensionMap = _.clone(columnExtensionMap); // Avoid modifying in place
        const origDisplayTitleRenderFxn = (
            (columnExtensionMap.display_title && columnExtensionMap.display_title.render) ||
            basicColumnExtensionMap.display_title.render
        );

        // Kept for reference in case we want to re-introduce constrain that for 'select' button(s) to be visible in search result rows, there must be parent window.
        //var isThereParentWindow = inSelectionMode && typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window;

        if (inSelectionMode) {
            // Render out button and add to title render output for "Select" if we have a 'selection' currentAction.
            // Also add the popLink/target=_blank functionality to links
            // Remove lab.display_title and type columns on selection
            columnExtensionMap.display_title = _.extend({}, columnExtensionMap.display_title, {
                'minColumnWidth' : 120,
                'render' : (result, columnDefinition, props, width) => {
                    //set select click handler according to currentAction type (selection or multiselect)
                    const { selectedItems } = this.state;
                    const isChecked = selectedItems.has(itemUtil.atId(result));
                    const isMultiSelect = (currentAction === 'multiselect');
                    const checkBoxControl = (
                        <input type="checkbox" checked={isChecked} onChange={this.handleSelectItemClick.bind(this, result, isMultiSelect)} className="mr-2" />
                    );
                    const currentTitleBlock = origDisplayTitleRenderFxn(
                        result, columnDefinition, _.extend({}, props, { currentAction }), width, true
                    );
                    const newChildren = currentTitleBlock.props.children.slice(0);
                    newChildren.unshift(checkBoxControl);
                    return React.cloneElement(currentTitleBlock, { 'children' : newChildren });
                }
            });
        }
        return columnExtensionMap;
    }

    forceUpdateOnSelf(){
        const searchResultTable = this.searchResultTableRef.current;
        const dimContainer = searchResultTable && searchResultTable.getDimensionContainer();
        return dimContainer && dimContainer.resetWidths();
    }

    onClearFiltersClick(evt, callback = null){
        const { onClearFilters } = this.props;
        evt.preventDefault();
        evt.stopPropagation();
        onClearFilters(callback);
    }

    renderSearchDetailPane(result, rowNumber, containerWidth, propsFromTable){
        const { renderDetailPane, windowWidth, schemas } = this.props;
        if (typeof renderDetailPane === "function") {
            return renderDetailPane(result, rowNumber, containerWidth, { ...propsFromTable, schemas, windowWidth });
        }
        return <SearchResultDetailPane {...{ result, rowNumber, containerWidth, schemas, windowWidth }} />;
    }

    /**
     * Expands `this.props` and feeds them into appropriate places in view.
     * Derives some info using memoized fxns.
     */
    render() {
        const {
            // From Redux store or App.js:
            context, schemas, currentAction, windowWidth, windowHeight, registerWindowOnScrollHandler, session, isFullscreen, toggleFullScreen,

            // From SearchView or similar portal-specific HOCs (e.g. BrowseView, ...):
            facets, facetColumnClassName, tableColumnClassName, termTransformFxn, rowHeight,
            separateSingleTermFacets, topLeftChildren,

            // From WindowNavigationController (or similar) (possibly from Redux store re: href)
            href, onFilter,

            // From CustomColumnController:
            hiddenColumns, addHiddenColumn, removeHiddenColumn,
            // From ColumnCombiner:
            columnDefinitions,
            // From SelectedItemsController:
            selectedItems = null, onCompleteSelection, onCancelSelection,
            // From SortController:
            sortBy, sortColumn, sortReverse
        } = this.props;

        // Initial results. Will get cloned to SearchResultTable state and added onto during load-as-you-scroll.
        const { "@graph" : results, filters, total: showTotalResults = 0 } = context;


        // Facets are transformed by the SearchView component to make adjustments to the @type facet re: currentAction.
        const { specificType: itemTypeForSchemas, abstractType }  = this.memoized.searchItemTypesFromHref(href, schemas);
        const showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href, context);

        const searchResultTableProps = {
            context, href, currentAction, schemas, hiddenColumns, results, columnDefinitions,
            sortBy, sortColumn, sortReverse, termTransformFxn, windowWidth, registerWindowOnScrollHandler, rowHeight
        };

        const facetListProps = {
            facets, filters, itemTypeForSchemas, schemas, currentAction, showClearFiltersButton,
            session, onFilter, windowWidth, windowHeight, termTransformFxn, separateSingleTermFacets
        };

        const aboveTableControlsProps = {
            // 'isFullscreen' & 'toggleFullScreen' are specific to 4DN's App.js, we could ideally refactor this out eventually.
            // Perhaps in same way as 'topLeftChildren' is setup... food 4 thought.
            context, showTotalResults, hiddenColumns, columnDefinitions, addHiddenColumn, removeHiddenColumn,
            isFullscreen, toggleFullScreen, currentAction, windowWidth, windowHeight, topLeftChildren
        };

        return (
            <div className="row">
                { facets.length ?
                    <div className={facetColumnClassName}>
                        <div className="above-results-table-row"/>{/* <-- temporary-ish */}
                        <FacetList {...facetListProps} className="with-header-bg" onClearFilters={this.onClearFiltersClick} />
                    </div>
                    : null }
                <div className={tableColumnClassName}>
                    <AboveSearchViewTableControls {...aboveTableControlsProps} parentForceUpdate={this.forceUpdateOnSelf} />
                    <SearchResultTable {...searchResultTableProps} ref={this.searchResultTableRef} renderDetailPane={this.renderSearchDetailPane} />
                    { isSelectAction(currentAction) && selectedItems !== null ?
                        <SelectStickyFooter {...{ context, schemas, selectedItems, currentAction }}
                            onComplete={onCompleteSelection} onCancel={onCancelSelection} />
                        : null}
                </div>
            </div>
        );
    }

}


export class SearchView extends React.PureComponent {

    static propTypes = {
        'context'       : PropTypes.object.isRequired,
        'currentAction' : PropTypes.string,
        'href'          : PropTypes.string.isRequired,
        'session'       : PropTypes.bool.isRequired,
        'navigate'      : PropTypes.func,
        'facets'        : PropTypes.array,
        'isFullscreen'  : PropTypes.bool.isRequired,
        'toggleFullScreen' : PropTypes.func.isRequired,
        'separateSingleTermFacets' : PropTypes.bool.isRequired,
        'renderDetailPane' : PropTypes.func
    };

    /**
     * @property {string} href - Current URI.
     * @property {!string} [currentAction=null] - Current action, if any.
     * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
     * @property {boolean} separateSingleTermFacets - If true, will push facets w/ only 1 term available to bottom of FacetList.
     */
    static defaultProps = {
        'href'          : null,
        'currentAction' : null,
        'columnExtensionMap' : basicColumnExtensionMap,
        'separateSingleTermFacets' : true
    };

    componentDidMount(){
        ReactTooltip.rebuild();
    }

    /**
     * TODO once we have @type : [..more stuff..], change to use instead of `getSchemaTypeFromSearchContext`.
     * For custom styling from CSS stylesheet (e.g. to sync override of rowHeight in both CSS and in props here)
     */
    render() {
        const {
            facets : propFacets,
            navigate: propNavigate = navigate,
            href, context, schemas
        } = this.props;
        const { facets: contextFacets } = context;
        const searchItemType = getSchemaTypeFromSearchContext(context);

        // TODO: Attempt to pass in ControlsAndResults as props.children.
        return (
            <div className="search-page-container" data-search-item-type={searchItemType}>
                <AboveSearchTablePanel {...{ href, context, schemas }} />
                <SearchControllersContainer {...this.props} facets={propFacets || contextFacets} navigate={propNavigate} />
            </div>
        );
    }
}

