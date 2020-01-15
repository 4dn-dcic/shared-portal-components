'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { patchedConsoleInstance as console } from './../util/patched-console';

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
     */
    static propTypes = {
        'searchHref'    : PropTypes.string.isRequired,
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
        'onLoad'        : PropTypes.func,
        'hideFacets'    : PropTypes.arrayOf(PropTypes.string)
    };

    static listToObj(hideFacetStrs){
        const obj = {};
        hideFacetStrs.forEach(function(field){
            obj[field] = true;
            obj[field + "!"] = true;
        });
        return obj;
    }

    static defaultProps = {
        'columnExtensionMap' : basicColumnExtensionMap,
        'separateSingleTermFacets' : true,
        'hideFacets': ["type", "validation_errors.name"]
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
            searchHref,
            schemas = null,
            //facets : propFacets,
            navigate: propNavigate,  // From Redux store; is NOT passed down. Overriden instead in VirtualHrefController.
            columns = null,
            facets,
            showAboveTableControls = false,
            columnExtensionMap = basicColumnExtensionMap,
            onLoad = null,
            filterFacetFxn: propFacetFilterFxn = null,
            ...passProps
        } = this.props;

        // If facets are null (hidden/excluded), set table col to be full width of container.
        const tableColumnClassName = facets === null ? "col-12" : undefined;
        const viewProps = { ...passProps, showAboveTableControls, schemas, tableColumnClassName };
        const filterFacetFxn = propFacetFilterFxn || this.filterFacetFxn;

        return (
            <div className="embedded-search-container">
                <VirtualHrefController {...{ searchHref, facets, onLoad, filterFacetFxn }} key={searchHref}>
                    <ColumnCombiner {...{ columns, columnExtensionMap }}>
                        <CustomColumnController>
                            <SortController>
                                <ControlsAndResults {...viewProps} isOwnPage={false} />
                            </SortController>
                        </CustomColumnController>
                    </ColumnCombiner>
                </VirtualHrefController>
            </div>
        );
    }
}

