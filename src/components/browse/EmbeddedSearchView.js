'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { navigate } from './../util/navigate';
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

    static propTypes = {
        'context'       : PropTypes.object.isRequired,
        'columns'       : PropTypes.object,
        'columnExtensionMap' : PropTypes.object,
        'searchHref'    : PropTypes.string.isRequired,
        'session'       : PropTypes.bool.isRequired,
        'schemas'       : PropTypes.object,
        'facets'        : PropTypes.array,
        'separateSingleTermFacets' : PropTypes.bool.isRequired,
        'renderDetailPane' : PropTypes.func,
        'showFacets'    : PropTypes.bool
    };

    /**
     * @property {string} href - Current URI.
     * @property {!string} [currentAction=null] - Current action, if any.
     * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
     * @property {boolean} separateSingleTermFacets - If true, will push facets w/ only 1 term available to bottom of FacetList.
     */
    static defaultProps = {
        'searchHref'    : null,
        // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
        // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
        'columns'       : null,
        'navigate'      : navigate,
        'currentAction' : null,
        'columnExtensionMap' : basicColumnExtensionMap,
        'separateSingleTermFacets' : true,
        'showFacets'    : false
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
            href,                   // From Redux store; is NOT passed down. Overriden instead.
            context,                // From Redux store; is NOT passed down. Overriden instead.
            currentAction = null,   // From App.js; is NOT passed down. Always should be null.
            searchHref,
            schemas = null,
            //facets : propFacets,
            //navigate: propNavigate = navigate,
            columns = null,
            facets,
            showAboveTableControls = false,
            columnExtensionMap = basicColumnExtensionMap,
            //isOwnPage = true,
            ...passProps
        } = this.props;

        //const { facets: contextFacets } = context;

        // All these controllers pass props down to their children.
        // So we don't need to be repetitive here; i.e. may assume 'context' is available
        // in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.
        // As well as in ControlsAndResults.

        // We re-instantiate the VirtualHrefController if receive a new base searchHref.
        // Alternatively, we could create componentDidUpdate in VirtualHrefController.

        return (
            <div className="embedded-search-container">
                <VirtualHrefController {...{ searchHref, facets }} key={searchHref}>
                    <ColumnCombiner {...{ columns, columnExtensionMap }}>
                        <CustomColumnController>
                            <SortController>
                                <ControlsAndResults {...{ ...passProps, showAboveTableControls, schemas }} isOwnPage={false} />
                            </SortController>
                        </CustomColumnController>
                    </ColumnCombiner>
                </VirtualHrefController>
            </div>
        );
    }
}

