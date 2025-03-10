import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { navigate } from './../util/navigate';
import { isSelectAction } from './../util/misc';
import { patchedConsoleInstance as console } from './../util/patched-console';

import { basicColumnExtensionMap, ColumnCombiner } from './components/table-commons';
import { AboveSearchTablePanel } from './components/AboveSearchTablePanel';
import { CustomColumnController } from './components/CustomColumnController';
import { SortController } from './components/SortController';
import { SelectedItemsController } from './components/SelectedItemsController';
import { WindowNavigationController } from './components/WindowNavigationController';
import { ControlsAndResults } from './components/ControlsAndResults';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../util/typedefs';

export { SortController, SelectedItemsController, ColumnCombiner, CustomColumnController };


export class SearchView extends React.PureComponent {

    static propTypes = {
        'context'       : PropTypes.object.isRequired,
        'columns'       : PropTypes.object,
        'columnExtensionMap' : PropTypes.object,
        'currentAction' : PropTypes.string,
        'href'          : PropTypes.string.isRequired,
        'session'       : PropTypes.bool.isRequired,
        'navigate'      : PropTypes.func,
        'facets'        : PropTypes.array,
        'isFullscreen'  : PropTypes.bool.isRequired,
        'toggleFullScreen' : PropTypes.func.isRequired,
        'separateSingleTermFacets' : PropTypes.bool.isRequired,
        'detailPane'    : PropTypes.element,
        'renderDetailPane' : PropTypes.func,
        'showClearFiltersButton' : PropTypes.bool,
        'isOwnPage'     : PropTypes.bool,
        'schemas'       : PropTypes.object,
        'placeholderReplacementFxn' : PropTypes.func, // Passed down to AboveSearchTablePanel StaticSection
        'keepSelectionInStorage': PropTypes.bool,
        'searchViewHeader': PropTypes.element,
        'hideFacets' : PropTypes.arrayOf(PropTypes.string),
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
        'isOwnPage'     : true,
        'keepSelectionInStorage': false,
        'hideFacets': [],
    };


    static listToObj(hideFacetStrs){
        const obj = {};
        hideFacetStrs.forEach((str) => obj[str] = str + "!");
        // return  hideFacetStrs.concat(hideFacetStrs.map(function(facetStr){
        //     return facetStr + "!";
        // }));
        return obj;
    }

    constructor(props) {
        super(props);
        this.filterFacetFxn = this.filterFacetFxn.bind(this);
        this.memoized = {
            listToObj: memoize(SearchView.listToObj)
        };
    }

    componentDidMount(){
        ReactTooltip.rebuild();
    }

    filterFacetFxn(facet){
        const { hideFacets = null } = this.props;
        const { field, hide_from_view = false } = facet || {};
        if (!hideFacets) return true;
        const idMap = this.memoized.listToObj(hideFacets);
        if (idMap[field] || hide_from_view) return false;
        return true;
    }

    /**
     * TODO once we have @type : [..more stuff..], change to use instead of `getSchemaTypeFromSearchContext`.
     * For custom styling from CSS stylesheet (e.g. to sync override of rowHeight in both CSS and in props here)
     */
    render() {
        const {
            href,
            context,
            showClearFiltersButton, // If present/bool, overrides WindowNavigationController's internal calculation (if any non-'type' queries in URL)
            schemas = null,
            currentAction = null,
            facets : propFacets,
            navigate: propNavigate = navigate,
            columns = null,
            columnExtensionMap = basicColumnExtensionMap,
            placeholderReplacementFxn,
            keepSelectionInStorage,
            searchViewHeader = null,
            //isOwnPage = true,
            windowWidth,
            hideFacets,
            hideStickyFooter,
            useCustomSelectionController,
            ...passProps
        } = this.props;

        const { facets: contextFacets } = context;

        // All these controllers pass props down to their children.
        // So we don't need to be repetitive here; i.e. may assume 'context' is available
        // in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.
        // As well as in ControlsAndResults.

        const childViewProps = {
            ...passProps, // Includes pass-thru props like 'facetListComponent', 'aboveTableComponent', 'aboveFacetListComponent', etc.
            currentAction,
            schemas,
            href,
            windowWidth,
            isOwnPage: true,
            facets: propFacets || contextFacets,
            hideStickyFooter,
        };

        let controllersAndView = (
            <WindowNavigationController filterFacetFxn={this.filterFacetFxn} {...{ href, context, showClearFiltersButton, hideFacets }} navigate={propNavigate}>
                <ColumnCombiner {...{ columns, columnExtensionMap }}>
                    <CustomColumnController>
                        <SortController>
                            { searchViewHeader }
                            <ControlsAndResults {...childViewProps} />
                        </SortController>
                    </CustomColumnController>
                </ColumnCombiner>
            </WindowNavigationController>
        );

        if (isSelectAction(currentAction) && !useCustomSelectionController){
            // We don't allow "SelectionMode" unless is own page.
            // Could consider changing later once a use case exists.
            controllersAndView = (
                // SelectedItemsController must be above ColumnCombiner because it adjusts
                // columnExtensionMap, rather than columnDefinitions. This can be easily changed
                // though if desired.
                <SelectedItemsController {...{ columnExtensionMap, currentAction, keepSelectionInStorage }}>
                    { controllersAndView }
                </SelectedItemsController>
            );
        }

        return (
            <div className="search-page-container">
                <AboveSearchTablePanel {...{ context, placeholderReplacementFxn }} />
                { controllersAndView }
            </div>
        );
    }
}

