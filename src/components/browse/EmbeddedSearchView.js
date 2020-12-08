'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { patchedConsoleInstance as console } from './../util/patched-console';
import { listToObj } from './../util/object';

import { basicColumnExtensionMap, ColumnCombiner } from './components/table-commons';
import { CustomColumnController } from './components/CustomColumnController';
import { SortController } from './components/SortController';
import { SelectedItemsController } from './components/SelectedItemsController';
import { ControlsAndResults } from './components/ControlsAndResults';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../util/typedefs';
import { VirtualHrefController } from './components/VirtualHrefController';

export { SortController, SelectedItemsController, ColumnCombiner, CustomColumnController };


export class EmbeddedSearchView extends React.PureComponent {

    /**
     * @property {string} searchHref - Base URI to search on.
     * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
     * @property {boolean} separateSingleTermFacets - If true, will push facets w/ only 1 term available to bottom of FacetList.
     * @property {string[]} hideFacets - If `filterFacetFxn` is falsy, and `facets` are undefined, then will be used to filter facets shown.
     * @property {string[]} hideColumns - If `filterColumnFxn` is falsy, and `columns` are undefined, then will be used to filter columns shown.
     */
    static propTypes = {
        // May not be present which prevents VirtualHrefController from navigating upon mount. Useful if want to init with filterSet search or in other place.
        'searchHref'    : PropTypes.string,
        // From Redux store; is NOT passed down. Overriden instead.
        'context'       : PropTypes.object,
        // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
        // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
        'columns'       : PropTypes.object,
        'columnExtensionMap' : PropTypes.object,
        'session'       : PropTypes.bool.isRequired,
        'schemas'       : PropTypes.object,
        'facets'        : PropTypes.array,
        'separateSingleTermFacets' : PropTypes.bool.isRequired,
        'renderDetailPane' : PropTypes.func,
        'detailPane'    : PropTypes.element,
        'onLoad'        : PropTypes.func,
        'hideFacets'    : PropTypes.arrayOf(PropTypes.string),
        'hideColumns'    : PropTypes.arrayOf(PropTypes.string),
        'filterFacetFxn' : PropTypes.func,
        'filterColumnFxn': PropTypes.func,
        'onClearFiltersVirtual' : PropTypes.func,
        'isClearFiltersBtnVisible' : PropTypes.func,
        'embeddedTableHeader' : PropTypes.element,
        'embeddedTableFooter' : PropTypes.element,
        'aboveTableComponent' : PropTypes.element,
        'aboveFacetListComponent' : PropTypes.element,
        'facetListComponent' : PropTypes.element,
        'facetColumnClassName' : PropTypes.string,
        'tableColumnClassName' : PropTypes.string
    };

    static listToObj(hideFacetStrs){
        return listToObj(
            hideFacetStrs.concat(hideFacetStrs.map(function(facetStr){
                return facetStr + "!";
            }))
        );
    }

    static defaultProps = {
        'columnExtensionMap' : basicColumnExtensionMap,
        'separateSingleTermFacets' : true,
        'hideFacets': ["type", "validation_errors.name"],
        'hideColumns': null
    };

    constructor(props){
        super(props);
        this.filterFacetFxn = this.filterFacetFxn.bind(this);
        this.memoized = {
            listToObj: memoize(EmbeddedSearchView.listToObj)
        };
    }

    componentDidMount(){
        ReactTooltip.rebuild();
    }

    filterFacetFxn(facet){
        const { hideFacets = null } = this.props;
        if (!hideFacets) return true;
        const idMap = this.memoized.listToObj(hideFacets);
        if (idMap[facet.field]) return false;
        return true;
    }

    /**
     * All these controllers pass props down to their children.
     * So we don't need to be repetitive here; i.e. may assume 'context' is available
     * in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.
     * As well as in ControlsAndResults.
     *
     * We re-instantiate the VirtualHrefController if receive a new base searchHref.
     * Alternatively, we could create componentDidUpdate in VirtualHrefController.
     */
    render() {
        const {
            href,                   // From Redux store; is NOT passed down. Overriden instead in VirtualHrefController.
            context,                // From Redux store; is NOT passed down. Overriden instead in VirtualHrefController.
            currentAction = null,   // From App.js; is NOT passed down. Always should be null for embedded search views.
            searchHref,             // Initial search href; if blank, then no initial request is made.
            // schemas = null,       // Passed down in passProps
            navigate: propNavigate,  // From Redux store; is NOT passed down. Overriden instead in VirtualHrefController.
            columns = null,
            hideColumns,
            facets,
            aboveTableComponent = null,         // Override default default to be null.
            aboveFacetListComponent = null,     // Override default default to be null.
            facetListComponent,                 // Preserve/use default value (DefaultFaceetListComponent) set by ControlsAndResults unless overriden by parent UI requirements.
            columnExtensionMap = basicColumnExtensionMap,
            onLoad = null,
            filterFacetFxn: propFacetFilterFxn = null,
            filterColumnFxn,
            windowWidth,
            // Will inherit props from VirtualHrefController, including search response `context`.
            embeddedTableHeader = null,
            embeddedTableFooter = null,
            // Optional prop to which virtualNavigate is passed that may override default
            // of navigating back to `searchHref`.
            onClearFiltersVirtual,
            // Optional prop to override VirtualHrefController's own calculation of this.
            // Must be static function that accepts currentSearchHref as first parameter and original searchHref as second one.
            // (On other hand, `SearchView` component accepts boolean `showClearFiltersButton`, as we have `context` etc available there.)
            isClearFiltersBtnVisible,
            facetColumnClassName,               // If undefined, default is set in ControlsAndResults.
            tableColumnClassName: propTableColumnClassName, // If undefined, default is set in ControlsAndResults.
            ...passProps
        } = this.props;

        // If facets are null (hidden/excluded), set table col to be full width of container.
        const tableColumnClassName = facets === null ? "col-12" : propTableColumnClassName;
        // Includes pass-through props like `maxHeight`, `hideFacets`, etc.
        const viewProps = { ...passProps, aboveTableComponent, aboveFacetListComponent, facetListComponent, tableColumnClassName, facetColumnClassName };
        const filterFacetFxn = propFacetFilterFxn || this.filterFacetFxn;

        return (
            <div className="embedded-search-container">
                <VirtualHrefController {...{ searchHref, facets, onLoad, filterFacetFxn, onClearFiltersVirtual, isClearFiltersBtnVisible }} key={searchHref || 1}>
                    <ColumnCombiner {...{ columns, columnExtensionMap }}>
                        <CustomColumnController {...{ windowWidth, filterColumnFxn }} hiddenColumns={hideColumns}>
                            <SortController>
                                { embeddedTableHeader }
                                <ControlsAndResults {...viewProps} isOwnPage={false} />
                                { embeddedTableFooter }
                            </SortController>
                        </CustomColumnController>
                    </ColumnCombiner>
                </VirtualHrefController>
            </div>
        );
    }
}

