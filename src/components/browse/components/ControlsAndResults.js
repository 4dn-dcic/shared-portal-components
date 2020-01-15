'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { isSelectAction } from './../../util/misc';
import { getAbstractTypeForType, getSchemaTypeFromSearchContext } from './../../util/schema-transforms';
import { patchedConsoleInstance as console } from './../../util/patched-console';

import { AboveSearchViewTableControls } from './above-table-controls/AboveSearchViewTableControls';
import { SearchResultTable } from './SearchResultTable';
import { FacetList } from './FacetList';
import { SearchResultDetailPane } from './SearchResultDetailPane';
import { SelectStickyFooter } from './SelectedItemsController';



export class ControlsAndResults extends React.PureComponent {

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
        this.renderSearchDetailPane = this.renderSearchDetailPane.bind(this);

        this.memoized = {
            getSchemaTypeFromSearchContext: memoize(getSchemaTypeFromSearchContext),
            getAbstractTypeForType: memoize(getAbstractTypeForType),
            isClearFiltersBtnVisible: memoize(ControlsAndResults.isClearFiltersBtnVisible)
        };

        this.searchResultTableRef = React.createRef();
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
            facets, termTransformFxn, rowHeight,
            separateSingleTermFacets, topLeftChildren, navigate,
            facetColumnClassName = "col-12 col-sm-5 col-lg-4 col-xl-3",
            tableColumnClassName = "col-12 col-sm-7 col-lg-8 col-xl-9",
            showAboveTableControls = true,
            defaultOpenIndices = null,

            // From WindowNavigationController or VirtualHrefController (or similar) (possibly from Redux store re: href)
            href, onFilter,
            isOwnPage = true,
            isInitialContextLoading = false,

            // From EmbeddedSearchView/manual-entry, used if isOwnPage is true
            maxHeight = SearchResultTable.defaultProps.maxHeight,

            // From CustomColumnController:
            hiddenColumns, addHiddenColumn, removeHiddenColumn,
            // From ColumnCombiner:
            columnDefinitions,
            // From SelectedItemsController:
            onCompleteSelection, onCancelSelection,
            selectedItems = null,
            // From SortController:
            sortBy, sortColumn, sortReverse
        } = this.props;

        // Initial results. Will get cloned to SearchResultTable state and added onto during load-as-you-scroll.
        const { "@graph" : results, filters, total: showTotalResults = 0 } = context;
        const searchItemType = this.memoized.getSchemaTypeFromSearchContext(context);
        const searchAbstractItemType = this.memoized.getAbstractTypeForType(searchItemType, schemas);

        // Facets are transformed by the SearchView component to make adjustments to the @type facet re: currentAction.

        const showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href, context);

        const searchResultTableProps = {
            context, href, navigate, currentAction, schemas, hiddenColumns, results, columnDefinitions, isOwnPage,
            sortBy, sortColumn, sortReverse, termTransformFxn, windowWidth, registerWindowOnScrollHandler, rowHeight,
            defaultOpenIndices, maxHeight, isInitialContextLoading // <- Only applicable for EmbeddedSearchView, else is false always
        };

        const facetListProps = {
            facets, filters, schemas, currentAction, showClearFiltersButton,
            session, onFilter, windowWidth, windowHeight, termTransformFxn, separateSingleTermFacets,
            itemTypeForSchemas: searchItemType,
            className: "with-header-bg",
            maxBodyHeight: (!isOwnPage && maxHeight) || null,
            onClearFilters: this.onClearFiltersClick
        };

        const aboveTableControlsProps = {
            // 'isFullscreen' & 'toggleFullScreen' are specific to 4DN's App.js, we could ideally refactor this out eventually.
            // Perhaps in same way as 'topLeftChildren' is setup... food 4 thought.
            context, showTotalResults, hiddenColumns, columnDefinitions, addHiddenColumn, removeHiddenColumn,
            isFullscreen, toggleFullScreen, currentAction, windowWidth, windowHeight, topLeftChildren
        };

        return (
            <div className="row search-view-controls-and-results" data-search-item-type={searchItemType} data-search-abstract-type={searchAbstractItemType}>
                { Array.isArray(facets) && facets.length ?
                    <div className={facetColumnClassName}>
                        { showAboveTableControls? // temporary-ish
                            <div className="above-results-table-row"/>
                            : null }
                        <FacetList {...facetListProps} />
                    </div>
                    : null }
                <div className={tableColumnClassName}>
                    { showAboveTableControls?
                        <AboveSearchViewTableControls {...aboveTableControlsProps} parentForceUpdate={this.forceUpdateOnSelf} />
                        : null }
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
