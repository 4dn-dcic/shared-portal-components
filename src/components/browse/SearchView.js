'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';

import { Alerts } from './../ui/Alerts';
import { navigate } from './../util/navigate';
import { isSelectAction } from './../util/misc';
import { getAbstractTypeForType, getSchemaTypeFromSearchContext } from './../util/schema-transforms';
import { determineIfTermFacetSelected, getTermFacetStatus } from './../util/search-filters';
import { itemUtil } from './../util/object';
import { patchedConsoleInstance as console } from './../util/patched-console';

import { basicColumnExtensionMap, columnsToColumnDefinitions, defaultHiddenColumnMapFromColumns } from './components/table-commons';
import { AboveSearchTablePanel } from './components/AboveSearchTablePanel';
import { AboveSearchViewTableControls } from './components/above-table-controls/AboveSearchViewTableControls';
import { CustomColumnController } from './components/CustomColumnController';
import { SearchResultTable } from './components/SearchResultTable';
import { FacetList, performFilteringQuery } from './components/FacetList';
import { SearchResultDetailPane } from './components/SearchResultDetailPane';
import { SortController } from './components/SortController';

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
export class SearchControllersContainer extends React.PureComponent {

    static defaultProps = {
        'navigate' : navigate
    };

    constructor(props){
        super(props);
        this.onFilter = this.onFilter.bind(this);
        this.getTermStatus = this.getTermStatus.bind(this);
    }

    onFilter(facet, term, callback, skipNavigation = false, currentHref = null){
        performFilteringQuery(this.props, facet, term, callback, skipNavigation, currentHref);
    }

    getTermStatus(term, facet){
        return getTermFacetStatus(term, facet, this.props);
    }

    render(){
        const { context } = this.props;
        const defaultHiddenColumns = defaultHiddenColumnMapFromColumns(context.columns);

        return (
            <CustomColumnController defaultHiddenColumns={defaultHiddenColumns}>
                <SortController {..._.pick(this.props, 'href', 'context', 'navigate')}>
                    <ControlsAndResults {...this.props} getTermStatus={this.getTermStatus} onFilter={this.onFilter} />
                </SortController>
            </CustomColumnController>
        );
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
    static searchItemTypesFromHref = memoize(function(href, schemas){
        let specificType = 'Item';    // Default
        let abstractType = null;      // Will be equal to specificType if no parent type.
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
    });

    constructor(props){
        super(props);
        this.forceUpdateOnSelf = this.forceUpdateOnSelf.bind(this);
        this.handleClearFilters = this.handleClearFilters.bind(this);
        this.columnExtensionMapWithSelectButton = this.columnExtensionMapWithSelectButton.bind(this);
        this.renderSearchDetailPane = this.renderSearchDetailPane.bind(this);
        this.handleSelectItemCompleteClick = this.handleSelectItemCompleteClick.bind(this);
        this.handleSelectCancelClick = this.handleSelectCancelClick.bind(this);
        this.state = {
            selectedItems : new Map()
        };

        this.searchResultTableRef = React.createRef();
    }
    /**
     * This function add/or removes the selected item into an Map in state,
     * if `props.currentAction` is set to "multiselect" or "selection".
     */
    handleSelectItemClick(result, isMultiSelect, evt) {
        this.setState(function({ selectedItems: prevItems }){
            const nextItems = new Map(prevItems);
            const resultID = itemUtil.atId(result);
            if (nextItems.has(resultID)) {
                nextItems.delete(resultID);
            } else {
                if (!isMultiSelect) {
                    nextItems.clear();
                }
                nextItems.set(resultID, result);
            }
            return { selectedItems: nextItems };
        });
    }
    /**
     * This function sends selected items to parent window for if `props.currentAction` is set to "multiselect" or "singleselect".
     */
    handleSelectItemCompleteClick(evt){
        const { selectedItems } = this.state;
        const itemsWrappedWithID = [];
        for (const [key, value] of selectedItems){
            itemsWrappedWithID.push({ id: key, json: value });
        }
        this.sendDataToParentWindow(itemsWrappedWithID);
    }
    /**
     * This function cancels the selection if `props.currentAction` is set to "multiselect".
     */
    handleSelectCancelClick(evt){
        const { selectedItems } = this.state;
        if (selectedItems.size > 0) {
            if (!window.confirm('Leaving will cause all selected item(s) to be lost. Are you sure you want to proceed?')) {
                return;
            }
        }

        window.dispatchEvent(new Event('fourfrontcancelclick'));
        // CURRENT: If we have parent window, post a message to it as well.
        if (window.opener){
            window.opener.postMessage({ 'eventType': 'fourfrontcancelclick' }, '*');
        } else {
            console.error("Couldn't access opener window.");
        }
    }

    /**
     * Utility function to post message to parent window
     * @param {Array} selectedItems: array of {id:ID of selected Item, if any, json:JSON of selected Item, if present (NOT GUARANTEED TO BE PROVIDED)} object
     * set selectedItems as empty array ([]) to close child window
     */
    sendDataToParentWindow(itemsListWrappedWithID) {
        if (!itemsListWrappedWithID || itemsListWrappedWithID.length === 0) {
            return;
        }

        const eventJSON = { 'items': itemsListWrappedWithID, 'eventType': 'fourfrontselectionclick' };

        // Standard - postMessage
        try {
            window.opener.postMessage(eventJSON, '*');
        } catch (err){
            // Check for presence of parent window and alert if non-existent.
            if (!(typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window)){
                Alerts.queue({
                    'title' : 'Failed to send data to parent window.',
                    'message' : 'Please ensure there is a parent window to which this selection is being sent to. Alternatively, try to drag & drop the Item over instead.'
                });
            } else {
                console.err('Unexpecter error -- browser may not support postMessage', err);
            }
        }

        // Nonstandard - in case browser doesn't support postMessage but does support other cross-window events (unlikely).
        window.dispatchEvent(new CustomEvent('fourfrontselectionclick', { 'detail' : eventJSON }));
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

    handleClearFilters(evt, callback = null){
        evt.preventDefault();
        evt.stopPropagation();
        const { href, context, navigate: propNavigate } = this.props;
        let clearFiltersURL = (typeof context.clear_filters === 'string' && context.clear_filters) || null;
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

    isClearFiltersBtnVisible(){
        const { href, context } = this.props;
        const urlPartsQuery = url.parse(href, true).query;
        const clearFiltersURL = (typeof context.clear_filters === 'string' && context.clear_filters) || null;
        const clearFiltersURLQuery = clearFiltersURL && url.parse(clearFiltersURL, true).query;

        return !!(clearFiltersURLQuery && !_.isEqual(clearFiltersURLQuery, urlPartsQuery));
    }

    renderSearchDetailPane(result, rowNumber, containerWidth){
        const { windowWidth, schemas } = this.props;
        return <SearchResultDetailPane {...{ result, rowNumber, containerWidth, schemas, windowWidth }} />;
    }

    render() {
        const {
            context, schemas, hiddenColumns, columnExtensionMap, currentAction, href, facets: propFacets,
            tableColumnClassName, facetColumnClassName
        } = this.props;
        const { selectedItems } = this.state;
        const results                         = context['@graph'];
        // Facets are transformed by the SearchView component to make adjustments to the @type facet re: currentAction.
        const facets                          = propFacets || context.facets;
        const { specificType, abstractType }  = ControlsAndResults.searchItemTypesFromHref(href, schemas);
        const selfExtendedColumnExtensionMap  = this.columnExtensionMapWithSelectButton(columnExtensionMap, currentAction, specificType, abstractType);
        const columnDefinitions               = columnsToColumnDefinitions(context.columns || {}, selfExtendedColumnExtensionMap);

        return (
            <div className="row">
                { facets.length ?
                    <div className={facetColumnClassName}>
                        <div className="above-results-table-row"/>{/* <-- temporary-ish */}
                        <FacetList className="with-header-bg" facets={facets} filters={context.filters}
                            onClearFilters={this.handleClearFilters} itemTypeForSchemas={specificType}
                            showClearFiltersButton={this.isClearFiltersBtnVisible()}
                            {..._.pick(this.props, 'getTermStatus', 'schemas', 'session', 'onFilter',
                                'currentAction', 'windowWidth', 'windowHeight', 'termTransformFxn', 'separateSingleTermFacets')} />
                    </div>
                    : null }
                <div className={tableColumnClassName}>
                    <AboveSearchViewTableControls showTotalResults={context.total} parentForceUpdate={this.forceUpdateOnSelf}
                        {..._.pick(this.props, 'addHiddenColumn', 'removeHiddenColumn', 'isFullscreen', 'context', 'columns',
                            'currentAction', 'windowWidth', 'windowHeight', 'toggleFullScreen')}
                        {...{ hiddenColumns, columnDefinitions }}/>
                    <SearchResultTable ref={this.searchResultTableRef} renderDetailPane={this.renderSearchDetailPane} totalExpected={context.total}
                        {..._.pick(this.props, 'href', 'sortBy', 'sortColumn', 'sortReverse', 'termTransformFxn',
                            'currentAction', 'windowWidth', 'registerWindowOnScrollHandler', 'schemas', 'rowHeight')}
                        {...{ hiddenColumns, results, columnDefinitions }} />
                    {isSelectAction(currentAction) ?
                        <SelectStickyFooter {...{ context, schemas, selectedItems, currentAction }}
                            onComplete={this.handleSelectItemCompleteClick} onCancel={this.handleSelectCancelClick} />
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
        'separateSingleTermFacets' : PropTypes.bool.isRequired
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

    render() {
        const { facets : propFacets, navigate: propNavigate, context } = this.props;
        return (
            // TODO once we have @type : [..more stuff..], apply some HTML attributes to this search-page-container to allow
            // custom styling from CSS stylesheet (e.g. to sync override of rowHeight in both CSS and in props here)
            <div className="search-page-container">
                <AboveSearchTablePanel {..._.pick(this.props, 'href', 'context', 'schemas')} />
                <SearchControllersContainer {...this.props} facets={propFacets || context.facets} navigate={propNavigate || navigate} />
            </div>
        );
    }
}


const SelectStickyFooter = React.memo(function SelectStickyFooter(props){
    const {
        context, schemas, selectedItems,
        onComplete, onCancel, currentAction
    } = props;
    const itemTypeFriendlyName = getSchemaTypeFromSearchContext(context, schemas);
    const selectedItemDisplayTitle = currentAction === 'selection' && selectedItems.size === 1 ? selectedItems.entries().next().value[1].display_title : "Nothing";
    return (
        <StickyFooter>
            <div className="row selection-controls-footer">
                <div className="col mb-05 mt-05">
                    {currentAction === 'multiselect' ?
                        <div className="row">
                            <h3 className="mt-0 mb-0 col-auto text-600">{ selectedItems.size }</h3>
                            <h4 className="mt-0 mb-0 text-muted col-auto text-400 px-0">
                                { itemTypeFriendlyName + (selectedItems.size === 1 ? '' : 's') } selected
                            </h4>
                        </div>
                        :
                        <div className="row">
                            <h4 className="mt-0 mb-0 col-auto text-400">{ selectedItemDisplayTitle }</h4>
                            <h4 className="mt-0 mb-0 text-muted col-auto text-400 px-0">selected</h4>
                        </div>
                    }
                </div>
                <div className="col-12 col-md-auto">
                    <button type="button" className="btn btn-success" onClick={onComplete} disabled={selectedItems.size === 0} data-tip="Select checked items and close window">
                        <i className="icon icon-fw fas icon-check"></i>&nbsp; Apply
                    </button>
                    <button type="button" className="btn btn-outline-warning ml-1" onClick={onCancel} data-tip="Cancel selection and close window">
                        <i className="icon icon-fw fas icon-times"></i>&nbsp; Cancel
                    </button>
                </div>
            </div>
        </StickyFooter>
    );
});

/**
 * General purpose sticky footer component
 * @param {*} props
 * TODO: Component can be moved to a separate file.
 */
export function StickyFooter(props) {
    const { children, ...passProps } = props;
    return (
        <div className="sticky-page-footer" {...passProps}>
            <div className="container">{ children }</div>
        </div>
    );
}