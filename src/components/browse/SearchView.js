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
import { patchedConsoleInstance as console } from './../util/patched-console';

import { basicColumnExtensionMap, ColumnCombiner } from './components/table-commons';
import { AboveSearchTablePanel } from './components/AboveSearchTablePanel';
import { AboveSearchViewTableControls } from './components/above-table-controls/AboveSearchViewTableControls';
import { CustomColumnController } from './components/CustomColumnController';
import { SearchResultTable } from './components/SearchResultTable';
import { FacetList } from './components/FacetList';
import { SearchResultDetailPane } from './components/SearchResultDetailPane';
import { SortController } from './components/SortController';
import { SelectedItemsController, SelectStickyFooter } from './components/SelectedItemsController';
import { WindowNavigationController } from './components/WindowNavigationController';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../util/typedefs';

export { SortController, SelectedItemsController, ColumnCombiner, CustomColumnController };



class ControlsAndResults extends React.PureComponent {

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
        const searchItemType = this.memoized.getSchemaTypeFromSearchContext(context);
        const searchAbstractItemType = this.memoized.getAbstractTypeForType(searchItemType, schemas);

        // Facets are transformed by the SearchView component to make adjustments to the @type facet re: currentAction.

        const showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href, context);

        const searchResultTableProps = {
            context, href, currentAction, schemas, hiddenColumns, results, columnDefinitions,
            sortBy, sortColumn, sortReverse, termTransformFxn, windowWidth, registerWindowOnScrollHandler, rowHeight
        };

        const facetListProps = {
            facets, filters, schemas, currentAction, showClearFiltersButton,
            session, onFilter, windowWidth, windowHeight, termTransformFxn, separateSingleTermFacets,
            itemTypeForSchemas: searchItemType
        };

        const aboveTableControlsProps = {
            // 'isFullscreen' & 'toggleFullScreen' are specific to 4DN's App.js, we could ideally refactor this out eventually.
            // Perhaps in same way as 'topLeftChildren' is setup... food 4 thought.
            context, showTotalResults, hiddenColumns, columnDefinitions, addHiddenColumn, removeHiddenColumn,
            isFullscreen, toggleFullScreen, currentAction, windowWidth, windowHeight, topLeftChildren
        };

        return (
            <div className="row search-view-controls-and-results" data-search-item-type={searchItemType} data-search-abstract-type={searchAbstractItemType}>
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
        'columns'       : PropTypes.object,
        'columnExtensionMap' : PropTypes.object,
        'currentAction' : PropTypes.string,
        'href'          : PropTypes.string.isRequired,
        'session'       : PropTypes.bool.isRequired,
        'navigate'      : PropTypes.func,
        'schemas'       : PropTypes.object,
        'facets'        : PropTypes.array,
        'isFullscreen'  : PropTypes.bool.isRequired,
        'toggleFullScreen' : PropTypes.func.isRequired,
        'separateSingleTermFacets' : PropTypes.bool.isRequired,
        'renderDetailPane' : PropTypes.func,
        'isOwnPage'     : PropTypes.bool
    };

    /**
     * @property {string} href - Current URI.
     * @property {!string} [currentAction=null] - Current action, if any.
     * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
     * @property {boolean} separateSingleTermFacets - If true, will push facets w/ only 1 term available to bottom of FacetList.
     */
    static defaultProps = {
        'href'          : null,
        // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
        // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
        'columns'       : null,
        'navigate'      : navigate,
        'currentAction' : null,
        'columnExtensionMap' : basicColumnExtensionMap,
        'separateSingleTermFacets' : true,
        'isOwnPage'     : true
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
            href,
            context,
            schemas = null,
            currentAction = null,
            facets : propFacets,
            navigate: propNavigate = navigate,
            columns = null,
            columnExtensionMap = basicColumnExtensionMap,
            isOwnPage = true,
            ...passProps
        } = this.props;

        const { facets: contextFacets } = context;

        // All these controllers pass props down to their children.
        // So we don't need to be repetitive here; i.e. may assume 'context' is available
        // in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.
        // As well as in ControlsAndResults.

        const childViewProps = {
            ...passProps,
            currentAction,
            schemas,
            isOwnPage,
            facets: propFacets || contextFacets
        };

        let controllersAndView = (
            <ColumnCombiner {...{ columns, columnExtensionMap }}>
                <CustomColumnController>
                    <SortController>
                        <ControlsAndResults {...childViewProps} />
                    </SortController>
                </CustomColumnController>
            </ColumnCombiner>
        );

        if (isOwnPage) {
            // Default case
            if (isSelectAction(currentAction)){
                // We don't allow "SelectionMode" unless is own page.
                // Could consider changing later once use case exists.
                controllersAndView = (
                    // SelectedItemsController must be above ColumnCombiner because it adjusts
                    // columnExtensionMap, rather than columnDefinitions. This can be easily changed
                    // though if desired.
                    <SelectedItemsController {...{ columnExtensionMap, currentAction }}>
                        { controllersAndView }
                    </SelectedItemsController>
                );
            }

            controllersAndView = (
                <WindowNavigationController {...{ href, context }} navigate={propNavigate}>
                    { controllersAndView }
                </WindowNavigationController>
            );

        } else {
            // Use virtual href controller
        }

        return (
            <div className="search-page-container">
                <AboveSearchTablePanel {...{ href, context, schemas }} />
                { controllersAndView }
            </div>
        );
    }
}

