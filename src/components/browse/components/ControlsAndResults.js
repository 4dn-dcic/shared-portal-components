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
            facetListComponent = <DefaultFacetListComponent />,
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


        /**
         * To Consider:
         * We could have 1 collection/object of props that is combination of
         * `aboveTableControlsProps` + `facetListProps` and gets passed down
         * to all children. This would allow more flexibility to put elements
         * or controls in various places around table, such as FacetList in
         * table header.
         */

        const commonChildProps = {
            // Props which don't change too frequently and/or are useful to many components -
            context, navigate, // <- search response context, prop navigate (could be virtual or global)
            schemas, session,
            columnDefinitions, facets,
            hiddenColumns, addHiddenColumn, removeHiddenColumn,
            currentAction, windowWidth, windowHeight,
            isContextLoading,
            onFilter,
            onClearFilters: this.onClearFiltersClick,
            termTransformFxn,
            itemTypeForSchemas: searchItemType,
            addToBodyClassList, removeFromBodyClassList
        };

        let extendedAboveTableComponent;
        let extendedAboveFacetListComponent;
        let extendedFacetListComponent;

        const extendChild = function(propsToPass, child){
            if (!React.isValidElement(child) || typeof child.type === "string") {
                return child;
            }
            return React.cloneElement(child, propsToPass);
        };

        if (aboveTableComponent) {
            extendedAboveTableComponent = React.Children.map(aboveTableComponent, extendChild.bind(null, commonChildProps));
        }

        if (aboveFacetListComponent) {
            extendedAboveFacetListComponent = React.Children.map(aboveFacetListComponent, extendChild.bind(null, commonChildProps));
        }

        if (facets !== null && facetListComponent) {
            const facetListProps = {
                ...commonChildProps,
                showClearFiltersButton,
                separateSingleTermFacets,
                requestedCompoundFilterSet,
                maxBodyHeight: (!isOwnPage && maxHeight) || null
            };
            extendedFacetListComponent = React.Children.map(facetListComponent, extendChild.bind(null, facetListProps));
        }

        return (
            <div className="row search-view-controls-and-results" data-search-item-type={searchItemType} data-search-abstract-type={searchAbstractItemType}>
                { facets === null ? null : (
                    <div className={facetColumnClassName}>
                        { extendedAboveFacetListComponent }
                        { extendedFacetListComponent }
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

/**
 * Should handle most if not all cases.
 * Paramaterized into own component to allow to swap in different `props.facetListComponent`.
 */
function DefaultFacetListComponent(props){
    const { facets, isContextLoading, requestedCompoundFilterSet, context } = props;
    const { "@id" : ctxHref = null } = context || {};
    // If we have an explicit "@id" (ctxHref) then we had a single filter block requested.
    if (Array.isArray(facets) && facets.length > 0) {
        return <FacetList {...props} />;
    }
    if (requestedCompoundFilterSet && !ctxHref) {
        // 'real' (multiple filter blocks) compound search used, FacetList UI cannot be used -
        return (
            <div className="facets-container with-header-bg">
                <FacetListHeader />
                <div className="py-4">
                    <h4 className="text-400 text-center">Compound Filter</h4>
                </div>
            </div>
        );
    }
    if (isContextLoading) {
        return (
            <div className="facets-container with-header-bg">
                <FacetListHeader />
                <div className="text-center py-4 text-secondary">
                    <i className="icon icon-spin icon-circle-notch fas icon-2x" />
                </div>
            </div>
        );
    }
    return null;
}
