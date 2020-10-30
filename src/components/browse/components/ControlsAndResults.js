'use strict';

import React from 'react';
import memoize from 'memoize-one';
import { isSelectAction } from './../../util/misc';
import { getAbstractTypeForType, getSchemaTypeFromSearchContext } from './../../util/schema-transforms';
import { patchedConsoleInstance as console } from './../../util/patched-console';

import { AboveSearchViewTableControls } from './above-table-controls/AboveSearchViewTableControls';
import { SearchResultTable } from './SearchResultTable';
import { FacetList, FacetListHeader } from './FacetList';
import { SearchResultDetailPane } from './SearchResultDetailPane';
import { SelectStickyFooter } from './SelectedItemsController';



export class ControlsAndResults extends React.PureComponent {

    constructor(props){
        super(props);
        this.onClearFiltersClick = this.onClearFiltersClick.bind(this);
        this.renderSearchDetailPane = this.renderSearchDetailPane.bind(this);

        this.memoized = {
            getSchemaTypeFromSearchContext: memoize(getSchemaTypeFromSearchContext),
            getAbstractTypeForType: memoize(getAbstractTypeForType)
        };

        this.searchResultTableRef = React.createRef();
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
            schemas, currentAction, windowWidth, windowHeight, registerWindowOnScrollHandler, session,
            addToBodyClassList, removeFromBodyClassList,

            // From SearchView or similar portal-specific HOCs (e.g. BrowseView, ...):
            facets, termTransformFxn, rowHeight,
            separateSingleTermFacets, navigate,
            facetColumnClassName = "col-12 col-sm-5 col-lg-4 col-xl-3",
            tableColumnClassName = "col-12 col-sm-7 col-lg-8 col-xl-9",
            // Default is component that renders out predefined buttons if receives props/data for them such as "Create New", "Full Screen", and "Column Selector".
            aboveTableComponent = <AboveSearchViewTableControls />, // Gets cloned further down in code to receive props from this ControlsAndResults component.
            // Default is blank element with same height as AboveSearchViewTableControls that allows to align tops of FacetList+Table headings.
            aboveFacetListComponent = <div className="above-results-table-row"/>,
            defaultOpenIndices = null,
            detailPane = null,

            // From WindowNavigationController or VirtualHrefController (or similar) (possibly from Redux store re: href & context)
            context, href, requestedCompoundFilterSet,
            onFilter, showClearFiltersButton = false,
            isOwnPage = true,         // <- False when rendered by EmbeddedSearchView, else is true when from a SearchView
            isContextLoading = false, // <- Only applicable for EmbeddedSearchView, passed in by VirtualHrefController only, else is false always since we initialize immediately over search-response context that already has first 25 results

            // From EmbeddedSearchView/manual-entry, used if isOwnPage is true
            maxHeight = SearchResultTable.defaultProps.maxHeight,

            // From CustomColumnController:
            hiddenColumns, addHiddenColumn, removeHiddenColumn, visibleColumnDefinitions,
            setColumnWidths, columnWidths,
            // From ColumnCombiner or CustomColumnController (if props.hideColumns present):
            columnDefinitions,
            // From SelectedItemsController:
            onCompleteSelection, onCancelSelection,
            selectedItems = null,
            // From SortController:
            sortBy, sortColumn, sortReverse
        } = this.props;

        // Initial results. Will get cloned to SearchResultTable state and added onto during load-as-you-scroll.
        const { "@graph" : results, filters } = context || {};
        const searchItemType = this.memoized.getSchemaTypeFromSearchContext(context || {});
        const searchAbstractItemType = this.memoized.getAbstractTypeForType(searchItemType, schemas);

        const searchResultTableProps = {
            context, href, requestedCompoundFilterSet, navigate, currentAction, schemas, results,
            columnDefinitions, visibleColumnDefinitions,
            setColumnWidths, columnWidths, detailPane,
            isOwnPage, sortBy, sortColumn, sortReverse, termTransformFxn, windowWidth, registerWindowOnScrollHandler, rowHeight,
            defaultOpenIndices, maxHeight,
            isContextLoading // <- Only applicable for EmbeddedSearchView, else is false always
        };

        const facetListProps = {
            facets, filters, schemas, currentAction, showClearFiltersButton, isContextLoading,
            session, onFilter, windowWidth, windowHeight, termTransformFxn, separateSingleTermFacets,
            itemTypeForSchemas: searchItemType,
            maxBodyHeight: (!isOwnPage && maxHeight) || null,
            onClearFilters: this.onClearFiltersClick,
            addToBodyClassList, removeFromBodyClassList
        };

        const aboveTableControlsProps = {
            context, columnDefinitions,
            navigate,
            // TODO: compoundSearchNavigate,
            hiddenColumns, addHiddenColumn, removeHiddenColumn,
            currentAction, windowWidth, windowHeight
        };

        let extendedAboveTableComponent, extendedAboveFacetListComponent;

        const extendChild = function(child){
            if (typeof child.type === "string") { // Element, not component
                return child;
            }
            return React.cloneElement(child, aboveTableControlsProps);
        };

        if (aboveTableComponent) {
            extendedAboveTableComponent = React.Children.map(aboveTableComponent, extendChild);
        }

        if (aboveFacetListComponent) {
            extendedAboveFacetListComponent = React.Children.map(aboveFacetListComponent, extendChild);
        }

        return (
            <div className="row search-view-controls-and-results" data-search-item-type={searchItemType} data-search-abstract-type={searchAbstractItemType}>
                { facets === null ? null: ( // TODO: Hide if using `requestedCompoundFilterSet` instead of `href`
                    <div className={facetColumnClassName}>
                        { extendedAboveFacetListComponent }
                        { Array.isArray(facets) && facets.length > 0 ?
                            <FacetList {...facetListProps} />
                            : isContextLoading ?
                                <div className="facets-container with-header-bg">
                                    <FacetListHeader />
                                    <div className="text-center py-4 text-secondary">
                                        <i className="icon icon-spin icon-circle-notch fas icon-2x" />
                                    </div>
                                </div>
                                : null }
                    </div>
                ) }
                <div className={tableColumnClassName}>
                    { extendedAboveTableComponent }
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
