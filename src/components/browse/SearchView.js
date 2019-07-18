'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';

import { Alerts } from './../ui/Alerts';
import { navigate } from './../util/navigate';
import { getAbstractTypeForType } from './../util/schema-transforms';
import { determineIfTermFacetSelected } from './../util/search-filters';
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
        this.isTermSelected = this.isTermSelected.bind(this);
    }

    onFilter(facet, term, callback, skipNavigation = false, currentHref = null){
        performFilteringQuery(this.props, facet, term, callback, skipNavigation, currentHref);
    }

    isTermSelected(term, facet){
        return determineIfTermFacetSelected(term, facet, this.props);
    }

    render(){
        const { context } = this.props;
        const defaultHiddenColumns = defaultHiddenColumnMapFromColumns(context.columns);

        return (
            <CustomColumnController defaultHiddenColumns={defaultHiddenColumns}>
                <SortController {..._.pick(this.props, 'href', 'context', 'navigate')}>
                    <ControlsAndResults {...this.props} isTermSelected={this.isTermSelected} onFilter={this.onFilter} />
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

        this.searchResultTableRef = React.createRef();
    }

    /**
     * This is the callback for the "select" button shown in the
     * display_title column when `props.currentAction` is set to "selection".
     */
    handleSelectItemClick(result, evt){
        var eventJSON = { 'json' : result, 'id' : itemUtil.atId(result), 'eventType' : 'fourfrontselectionclick' };

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
        const inSelectionMode = currentAction === 'selection';
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
                    const currentTitleBlock = origDisplayTitleRenderFxn(
                        result, columnDefinition, _.extend({}, props, { currentAction }), width, true
                    );
                    const newChildren = currentTitleBlock.props.children.slice(0);
                    newChildren.unshift(
                        <div className="select-button-container">
                            <button type="button" className="select-button" onClick={this.handleSelectItemClick.bind(this, result)}>
                                <i className="icon icon-fw icon-check fas"/>
                            </button>
                        </div>
                    );
                    return React.cloneElement(currentTitleBlock, { 'children' : newChildren });
                }
            });
        }
        return columnExtensionMap;
    }

    forceUpdateOnSelf(){
        var searchResultTable   = this.searchResultTableRef.current,
            dimContainer        = searchResultTable && searchResultTable.getDimensionContainer();
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
                            {..._.pick(this.props, 'isTermSelected', 'schemas', 'session', 'onFilter',
                                'currentAction', 'windowWidth', 'windowHeight', 'termTransformFxn')} />
                    </div>
                    : null }
                <div className={tableColumnClassName}>
                    <AboveSearchViewTableControls showTotalResults={context.total} parentForceUpdate={this.forceUpdateOnSelf}
                        {..._.pick(this.props, 'addHiddenColumn', 'removeHiddenColumn', 'isFullscreen', 'context', 'columns',
                            'currentAction', 'windowWidth', 'windowHeight', 'toggleFullScreen')}
                        {...{ hiddenColumns, columnDefinitions }}/>
                    <SearchResultTable ref={this.searchResultTableRef} renderDetailPane={this.renderSearchDetailPane} totalExpected={context.total}
                        {..._.pick(this.props, 'href', 'sortBy', 'sortColumn', 'sortReverse',
                            'currentAction', 'windowWidth', 'registerWindowOnScrollHandler', 'schemas')}
                        {...{ hiddenColumns, results, columnDefinitions }} />
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
        'toggleFullScreen' : PropTypes.func.isRequired
    };

    /**
     * @public
     * @type {Object}
     * @property {string} href - Current URI.
     * @property {string} [currentAction=null] - Current action, if any.
     * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
     */
    static defaultProps = {
        'href'          : null,
        'currentAction' : null,
        'columnExtensionMap' : basicColumnExtensionMap
    };

    componentDidMount(){
        ReactTooltip.rebuild();
    }

    render() {
        const { facets : propFacets, navigate: propNavigate, context } = this.props;
        return (
            <div className="container" id="content">
                <div className="search-page-container">
                    <AboveSearchTablePanel {..._.pick(this.props, 'href', 'context', 'schemas')} />
                    <SearchControllersContainer {...this.props} facets={propFacets || context.facets} navigate={propNavigate || navigate} />
                </div>
            </div>
        );
    }
}
