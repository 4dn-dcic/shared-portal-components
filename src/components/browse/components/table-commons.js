'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import _ from 'underscore';
import memoize from 'memoize-one';
import queryString from 'querystring';
import Draggable from 'react-draggable';

import { LocalizedTime } from './../../ui/LocalizedTime';
import { navigate as globalPageNavigate } from './../../util/navigate';
import { getItemType, getTitleForType } from './../../util/schema-transforms';
import { getNestedProperty, itemUtil } from './../../util/object';
import { responsiveGridState } from './../../util/layout';
import { isServerSide } from './../../util/misc';
import { productClick as trackProductClick, hrefToListName } from './../../util/analytics';

// eslint-disable-next-line no-unused-vars
import { Item, ColumnDefinition } from './../../util/typedefs';


export const DEFAULT_WIDTH_MAP = { 'lg' : 200, 'md' : 180, 'sm' : 120, 'xs' : 120 };


export const basicColumnExtensionMap = {
    'display_title' : {
        'title' : "Title",
        'widthMap' : { 'lg' : 280, 'md' : 250, 'sm' : 200 },
        'minColumnWidth' : 90,
        'order' : -100,
        'render' : function renderDisplayTitleColumn(result, columnDefinition, props, termTransformFxn, width){
            const { href, context, rowNumber, detailOpen, toggleDetailOpen } = props;
            // `href` and `context` reliably refer to search href and context here, i.e. will be passed in from VirtualHrefController.
            let title = itemUtil.getTitleStringFromContext(result);
            const link = itemUtil.atId(result);
            let tooltip;
            let hasPhoto = false;

            /** Registers a list click event for Google Analytics then performs navigation. */
            function handleClick(evt){
                evt.preventDefault();
                evt.stopPropagation();
                trackProductClick(
                    result,
                    { list : hrefToListName(href), position: rowNumber + 1 },
                    function(){
                        // We explicitly use globalPageNavigate here and not props.navigate, as props.navigate might refer
                        // to VirtualHrefController.virtualNavigate and would not bring you to new page.
                        globalPageNavigate(link);
                    },
                    context
                );
                return false;
            }

            if (title && (title.length > 20 || width < 100)) tooltip = title;
            if (link){ // This should be the case always
                title = <a key="title" href={link || '#'} onClick={handleClick}>{ title }</a>;
                if (typeof result.email === 'string' && result.email.indexOf('@') > -1){
                    // Specific case for User items. May be removed or more cases added, if needed.
                    hasPhoto = true;
                    title = (
                        <span key="title">
                            { itemUtil.User.gravatar(result.email, 32, { 'className' : 'in-search-table-title-image', 'data-tip' : result.email }, 'mm') }
                            { title }
                        </span>
                    );
                }
            }

            return (
                <React.Fragment>
                    <TableRowToggleOpenButton open={detailOpen} onClick={toggleDetailOpen} />
                    <div key="title-container" className={"title-block" + (hasPhoto ? ' has-photo' : " text-ellipsis-container")} data-tip={tooltip}>{ title }</div>
                </React.Fragment>
            );
        }
    },
    '@type' : {
        'noSort' : true,
        'order' : -80,
        'render' : function(result, columnDefinition, props, termTransformFxn, width){
            if (!Array.isArray(result['@type'])) return null;
            const leafItemType = getItemType(result);
            const itemTypeTitle = getTitleForType(leafItemType, props.schemas || null);
            const onClick = function(e){
                // Preserve search query, if any, but remove filters (which are usually per-type).
                if (!props.href || props.href.indexOf('/search/') === -1) return;
                e.preventDefault();
                e.stopPropagation();
                const urlParts = url.parse(props.href, true);
                const query = { ...urlParts.query, 'type' : leafItemType };
                if (urlParts.query.q) query.q = urlParts.query.q;
                const nextHref = '/search/?' + queryString.stringify(query);
                // We use props.navigate here first which may refer to VirtualHrefController.virtualNavigate
                // since we're navigating to a search href here.
                (props.navigate || globalPageNavigate)(nextHref);
            };

            return (
                <React.Fragment>
                    <div className="icon-container">
                        <i className="icon icon-fw fas icon-filter clickable mr-05" onClick={onClick} data-tip={"Filter down to only " + itemTypeTitle}/>
                    </div>
                    <span className="item-type-title value">{ itemTypeTitle }</span>
                </React.Fragment>
            );
        }
    },
    'date_created' : {
        'title' : 'Date Created',
        'colTitle' : 'Created',
        'widthMap' : { 'lg' : 140, 'md' : 120, 'sm' : 120 },
        'render' : function dateCreatedTitle(result, columnDefinition, props, termTransformFxn, width){
            if (!result.date_created) return null;
            return (
                <span className="value">
                    <LocalizedTime timestamp={result.date_created} formatType="date-sm" />
                </span>
            );
        },
        'order' : 510
    },
    'last_modified.date_modified' : {
        'title' : 'Date Modified',
        'widthMap' : { 'lg' : 140, 'md' : 120, 'sm' : 120 },
        'render' : function lastModifiedDate(result, columnDefinition, props, termTransformFxn, width){
            if (!result.last_modified) return null;
            if (!result.last_modified.date_modified) return null;
            return (
                <span className="value">
                    <LocalizedTime timestamp={result.last_modified.date_modified} formatType="date-sm" />
                </span>
            );
        },
        'order' : 515
    }
};

/**
 * Ensure we have a valid React element to render.
 * If not, try to detect if Item object, and generate link.
 * Else, let exception bubble up.
 *
 * @static
 * @param {any} value - Value to sanitize.
 */
export function sanitizeOutputValue(value){
    if (typeof value !== 'string' && typeof value !== 'number' && !React.isValidElement(value)){
        if (value && typeof value === 'object'){
            if (typeof value.display_title !== 'undefined'){
                const atId = itemUtil.atId(value);
                if (atId){
                    return <a href={atId}>{ value.display_title }</a>;
                } else {
                    return value.display_title;
                }
            }
        } else if (!value){
            value = null;
        }
    }
    if (value === "None") value = null;
    return value;
}


export const TableRowToggleOpenButton = React.memo(function TableRowToggleOpenButton({ onClick, toggleDetailOpen, open }){
    return (
        <div className="inline-block toggle-detail-button-container">
            <button type="button" className="toggle-detail-button" onClick={onClick || toggleDetailOpen}>
                <div className="icon-container">
                    <i className={"icon icon-fw fas icon-" + (open ? 'minus' : 'plus') }/>
                </div>
            </button>
        </div>
    );
});


/**
 * Should handle and fail cases where context and columns object reference values
 * have changed, but not contents. User-selected columns should be preserved upon faceting
 * or similar filtering, but be updated when search type changes.
 *
 * Used as equality checker for `columnsToColumnDefinitions` `columns` param memoization as well.
 *
 * @param {Object.<Object>} cols1 Previous object of columns, to be passed in from a lifecycle method.
 * @param {Object.<Object>} cols2 Next object of columns, to be passed in from a lifecycle method.
 *
 * @returns {boolean} If context columns have changed, which should be about same as if type has changed.
 */
export function haveContextColumnsChanged(cols1, cols2){

    if (cols1 === cols2) return false;
    if (cols1 && !cols2) return true;
    if (!cols1 && cols2) return true;

    const pastKeys = _.keys(cols1);
    const nextKeys = _.keys(cols2);
    const pKeysLen = pastKeys.length;
    let i;

    if (pKeysLen !== nextKeys.length){
        return true;
    }

    pastKeys.sort();
    nextKeys.sort();

    for (i = 0; i < pKeysLen; i++){
        if (pastKeys[i] !== nextKeys[i]) return true;
    }
    return false;
}


/**
 * Convert a map of field:title to list of column definitions, setting defaults.
 *
 * @param {Object.<string>} columns         Map of field names to field/column titles, as returned from back-end.
 * @param {Object} columnDefinitionMap      Map of field names to extra column properties such 'render', 'title', 'widthMap', etc.
 * @param {Object[]} constantDefinitions    Preset list of column definitions, each containing at least 'field' and 'title'.
 * @param {Object} defaultWidthMap          Map of responsive grid states (lg, md, sm) to pixel number sizes.
 * @returns {Object[]}                      List of objects containing keys 'title', 'field', 'widthMap', and 'render'.
 */
export const columnsToColumnDefinitions = memoize(function(columns, columnDefinitionMap, defaultWidthMap = DEFAULT_WIDTH_MAP){
    const uninishedColumnDefinitions = _.pairs(columns).map(function([ field, columnProperties ]){
        return _.extend({ field }, columnProperties);
    });

    const columnDefinitions = _.map(uninishedColumnDefinitions, function(colDef, i){
        const colDefOverride = columnDefinitionMap && columnDefinitionMap[colDef.field];
        if (colDefOverride){
            var colDef2 = _.extend({}, colDefOverride, colDef);
            colDef = colDef2;
        }
        // Add defaults for any required-for-view but not-present properties.
        if (colDef.widthMap && colDef.widthMap.sm && typeof colDef.widthMap.xs !== 'number'){
            colDef.widthMap.xs = colDef.widthMap.sm;
        }
        colDef.widthMap = colDef.widthMap || defaultWidthMap;
        colDef.render = colDef.render || null;
        colDef.order = typeof colDef.order === 'number' ? colDef.order : i;

        return colDef;
    });

    return _.sortBy(columnDefinitions, 'order');
});

/**
 * @param {Object<string, Object>} columns - Object containing some column definitions/values.
 */
export function defaultHiddenColumnMapFromColumns(columns){
    const hiddenColMap = {};
    _.pairs(columns).forEach(function([ field, columnDefinition ]){
        if (columnDefinition.default_hidden){
            hiddenColMap[field] = true;
        } else {
            hiddenColMap[field] = false;
        }
    });
    return hiddenColMap;
}
/*, function(newArgs, lastArgs){
    // We allow different object references to be considered equal as long as their values are equal.
    return !haveContextColumnsChanged(lastArgs[0], newArgs[0]);
}); */

/**
 * Adds a `baseWidth` property to each columnDefinition based off widthMap or default value (100).
 * Used in 4DN ItemPageTable, otherwise is deprecated?
 */
export const columnDefinitionsToScaledColumnDefinitions = memoize(function(columnDefinitions){
    return columnDefinitions.map(function(colDef){
        const colDef2 = _.clone(colDef);
        colDef2.baseWidth = colDef.widthMap.sm || colDef.widthMap.md || colDef.widthMap.lg || 100;
        if (typeof colDef.render !== 'function'){
            colDef2.render = null;
        }
        return colDef2;
    });
});


/**
 * Combines `props.columns` || `props.context.columns` with `props.columnExtensionMap` to generate
 * final array of `columnDefinitions`.
 *
 * @param {{ columns: Object.<string, Object>?, context: { columns: Object.<string, Object> }, columnExtensionMap: Object.<string, Object> }} props - Props with column info.
 * @returns {JSX.Element} Clone of children, passing in `columnDefinitions` {{ field: string, ... }[]} and `defaultHiddenColumns` {Object<string, bool>}.
 */

export class ColumnCombiner extends React.PureComponent {

    /**
     * Merges `columns` from backend context (or prop, via StaticSection) with `columnExtensionMap` prop from front-end.
     * Forms `columnDefinitions` list which is ultimately displayed in result table.
     *
     * @param {Object<string,{ title: string }} columns - Column definitions from backend (e.g. context, StaticSection props)
     * @param {Object<string,{ colTitle: JSX.Element|string, render: function(Item, ...): JSX.Element, widthMap: { sm: number, md: number, lg: number } }} columnExtensionMap - Column definitions/extensions from front-end code.
     * @returns {{ title: string, field: string, render: function, widthMap: { sm: number, md: number, lg: number } }[]} Final form of columns to display
     */
    static getDefinitions(columns, columnExtensionMap){
        // TODO: Consider changing `defaultHiddenColumnMapFromColumns` to accept array (columnDefinitions) instd of Object (columns).
        // We currently don't put "default_hidden" property in columnExtensionMap, but could, in which case this change would be needed.
        return columnsToColumnDefinitions(columns, columnExtensionMap);
    }

    /**
     * @param {Object<string,{ title: string }} columns - Column definitions from backend (e.g. context, StaticSection props)
     * @param {function} filterColumnFxn - filtering function
     */
    static filteredColumns(columns, filterColumnFxn = null){
        if (typeof filterColumnFxn !== "function" || typeof columns !== 'object'){
            return columns;
        }
        const keys = _.keys(columns);
        return _.pick(columns, keys.filter(filterColumnFxn));
    }

    static defaultProps = {
        "columns" : null, // Passed in as prop or defaults to context.columns
        "columnExtensionMap": basicColumnExtensionMap
    };

    constructor(props){
        super(props);
        this.memoized = {
            haveContextColumnsChanged: memoize(haveContextColumnsChanged),
            // We want `defaultHiddenColumns` memoized separately from `columnDefinitions`
            // because `defaultHiddenColumns` change triggers reset in `ColumnCombiner`.
            // This is becaused `columnExtensionMap` may change more frequently than `columns`.
            // e.g. in response to SelectedFiles' state.selectedFiles changing.
            getDefaultHiddenColumns: memoize(
                defaultHiddenColumnMapFromColumns,
                ([ nextColumns ], [ prevColumns ]) => !this.memoized.haveContextColumnsChanged(prevColumns, nextColumns)
            ),
            getDefinitions: memoize(
                ColumnCombiner.getDefinitions, // Func to memoize
                /**
                 * Custom "param equality" fxn.
                 *
                 * @param {Object<string,{ title: string }[]} nextArgSet - Next [ `columns`, `columnExtensionMap` ] args
                 * @param {Object<string,{ title: string }[]} prevArgSet - Previous [ `columns`, `columnExtensionMap` ] args
                 * @returns {boolean} If false, then memoized func is called.
                 */
                (nextArgSet, prevArgSet) => {
                    const [ nextColumns, nextColDefMap ] = nextArgSet;
                    const [ prevColumns, prevColDefMap ] = prevArgSet;

                    if (prevColDefMap !== nextColDefMap) {
                        return false; // Update
                    }

                    // Semi-deep comparison of column keys (fields) -- if using undefined columns,
                    // will use columns from context/search response, which will be under a new object
                    // reference after each filter, sort, etc call. This allows us to preserve the custom
                    // columns we've selected _unless_ Item type or something else changes which changes the
                    // column set that comes down from back-end response.
                    return !this.memoized.haveContextColumnsChanged(prevColumns, nextColumns);
                }
            ),
            filteredColumns: memoize(ColumnCombiner.filteredColumns)
        };
    }

    render(){
        const {
            children,
            columns: overridePropColumns = null,
            columnExtensionMap,
            filterColumnFxn = null,
            ...passProps
        } = this.props;
        const { context : { columns: contextColumns } = {} } = passProps;
        const columns = this.memoized.filteredColumns(overridePropColumns || contextColumns || {}, filterColumnFxn);

        if (columns.length === 0) {
            console.error("No columns available in context nor props. Please provide columns. Ok if resorting to back-end provided columns and waiting for first response to load.");
        }

        const propsToPass = {
            ...passProps,
            /** Final form of all columns to show in table */
            columnDefinitions: this.memoized.getDefinitions(columns, columnExtensionMap),
            /**
             * Initial column keys/fields from `columnDefinitions` to be hidden from table.
             * Change of this prop value causes reset of hidden columns state.
             */
            defaultHiddenColumns: this.memoized.getDefaultHiddenColumns(columns)
        };

        return React.Children.map(children, function(child){
            return React.cloneElement(child, propsToPass);
        });
    }
}


/**
 * Determine the typical column width, given current browser width. Defaults to large width if server-side.
 *
 * @param {ColumnDefinition} columnDefinition - JSON of column definition, should have widthMap or width or baseWidth.
 * @param {Object} columnDefinition.widthMap - Map of integer sizes to use at 'lg', 'md', or 'sm' sizes.
 * @param {boolean} [mounted=true]  - Whether component calling this function is mounted. If false, uses 'lg' to align with server-side render.
 * @param {number} [windowWidth=null] - Current window width.
 * @returns {string|number} Width for div column block to be used at current screen/browser size.
 */
export function getColumnWidthFromDefinition(columnDefinition, mounted=true, windowWidth=null){
    const w = columnDefinition.width || columnDefinition.baseWidth || null;
    if (typeof w === 'number'){
        return w;
    }

    const widthMap = columnDefinition.widthMap || null;

    if (!widthMap) {
        return 250; // Fallback
    }

    let responsiveGridSize;
    if (!mounted || isServerSide()) responsiveGridSize = 'lg';
    else responsiveGridSize = responsiveGridState(windowWidth);
    if (responsiveGridSize === 'xs') responsiveGridSize = 'sm';
    if (responsiveGridSize === 'xl') responsiveGridSize = 'lg';
    return widthMap[responsiveGridSize || 'lg'];
}


export class ResultRowColumnBlockValue extends React.Component {

    /**
     * Default value rendering function.
     * Uses columnDefinition field (column key) to get nested property value from result and display it.
     *
     * @param {Item} result - JSON object representing row data.
     * @param {ColumnDefinition} columnDefinition - Object with column definition data - field, title, widthMap, render function (self)
     * @param {Object} props - Props passed down from SearchResultTable/ResultRowColumnBlock instance.
     * @param {number} width - Unused. Todo - remove?
     * @returns {string|null} String value or null. Your function may return a React element, as well.
     */
    static transformIfNeeded(result, columnDefinition, props, termTransformFxn){

        function filterAndUniq(vals){
            return _.uniq(_.filter(vals, function(v){
                return v !== null && typeof v !== 'undefined';
            }));
        }

        let value = getNestedProperty(result, columnDefinition.field, true);
        if (typeof value === "undefined") value = null;
        if (Array.isArray(value)){ // getNestedProperty may return a multidimensional array, # of dimennsions depending on how many child arrays were encountered in original result obj.
            value = filterAndUniq(value.map(function(v){
                if (Array.isArray(v)){
                    v = filterAndUniq(v);
                    if (v.length === 1) v = v[0];
                    if (v.length === 0) v = null;
                }
                if (typeof termTransformFxn === 'function'){
                    return termTransformFxn(columnDefinition.field, v, false);
                }
                console.warn("No termTransformFxn supplied.");
                return v;
            })).map(function(v){
                if (typeof termTransformFxn === 'function'){
                    return termTransformFxn(columnDefinition.field, v, false);
                }
                return v;
            }).join(', ');
        } else if (typeof termTransformFxn === 'function'){
            value = termTransformFxn(columnDefinition.field, value, true);
        }
        return value;
    }

    static defaultProps = {
        'mounted' : false,
        'toggleDetailOpen' : function(evt){ console.warn('Triggered props.toggleDetailOpen() but no toggleDetailOpen prop passed to ResultRowColumnValue Component.'); },
        'shouldComponentUpdateExt' : null
    };

    constructor(props){
        super(props);
        this.memoized = {
            transformIfNeeded: memoize(ResultRowColumnBlockValue.transformIfNeeded)
        };
    }

    shouldComponentUpdate(nextProps, nextState){
        const { columnDefinition, schemas, result, className } = this.props;
        if (
            nextProps.columnNumber === 0 ||
            nextProps.columnDefinition.field !== columnDefinition.field ||
            nextProps.schemas !== schemas ||
            itemUtil.atId(nextProps.result) !== itemUtil.atId(result) ||
            nextProps.className !== className ||
            (typeof nextProps.shouldComponentUpdateExt === 'function' && nextProps.shouldComponentUpdateExt(nextProps, nextState, this.props, this.state))
        ){
            return true;
        }
        return false;
    }

    render(){
        const {
            result,
            columnDefinition,
            tooltip : propTooltip,
            className,
            termTransformFxn
        } = this.props;

        const renderFxn = columnDefinition.render || this.memoized.transformIfNeeded;

        let value = sanitizeOutputValue(
            renderFxn(result, columnDefinition, _.omit(this.props, 'columnDefinition', 'result'), termTransformFxn)
        );

        let tooltip;
        if (typeof value === 'number'){
            value = <span className="value">{ value }</span>;
        } else if (typeof value === 'string') {
            if (propTooltip === true && value.length > 25) tooltip = value;
            value = <span className="value">{ value }</span>;
        } else if (value === null){
            value = <small className="value">-</small>;
        } else if (React.isValidElement(value) && value.type === "a") {
            // We let other columnRender funcs define their `value` container (if any)
            // But if is link, e.g. from termTransformFxn, then wrap it to center it.
            value = <span className="value">{ value }</span>;
        }

        let cls = "inner";
        if (typeof className === 'string'){
            cls += ' ' + className;
        }
        return (
            <div className={cls} data-tip={tooltip}>{ value }</div>
        );
    }
}


export class ColumnSorterIcon extends React.PureComponent {

    static icon(style="descend"){
        if (style === 'descend')        return <i className="icon icon-sort-down fas align-text-top"/>;
        else if (style === 'ascend')    return <i className="icon icon-sort-up fas align-bottom"/>;
    }

    static propTypes = {
        'currentSortColumn' : PropTypes.string,
        'descend' : PropTypes.bool,
        'value' : PropTypes.string.isRequired,
        'sortByFxn' : PropTypes.func.isRequired
    };

    static defaultProps = {
        'descend' : false
    };

    constructor(props){
        super(props);
        this.sortClickFxn = this.sortClickFxn.bind(this);
    }

    sortClickFxn(e){
        const { value, descend, currentSortColumn, sortByFxn } = this.props;
        e.preventDefault();
        const reverse = (currentSortColumn === value) && !descend;
        sortByFxn(value, reverse);
    }

    render(){
        const { value, descend, currentSortColumn } = this.props;
        if (typeof value !== 'string' || value.length === 0) {
            return null;
        }
        const style = !descend && currentSortColumn === value ? 'ascend' : 'descend';
        const linkClass = (
            (currentSortColumn === value ? 'active ' : '') +
            'column-sort-icon'
        );
        return <span className={linkClass} onClick={this.sortClickFxn}>{ ColumnSorterIcon.icon(style) }</span>;
    }
}


class HeadersRowColumn extends React.PureComponent {

    constructor(props){
        super(props);
        _.bindAll(this, 'onDrag', 'onStop');
        this.memoized = {
            showTooltip : memoize(function(colWidth, titleStr){
                return ((colWidth - 40) / 7) < (titleStr || "").length;
            })
        };
    }

    onDrag(event, res){
        const { index, onAdjusterDrag } = this.props;
        onAdjusterDrag(index, event, res);
    }

    onStop(event, res){
        const { index, setHeaderWidths } = this.props;
        setHeaderWidths(index, event, res);
    }

    render(){
        const { sortColumn, sortBy, sortReverse, width, colDef, headerColumnWidths } = this.props;
        const { noSort, colTitle, title, field } = colDef;
        const showTitle = colTitle || title;
        const tooltip = this.memoized.showTooltip(width, typeof colTitle === "string" ? colTitle : title) ? title : null;
        let sorterIcon;
        if (!colDef.noSort && typeof sortBy === 'function' && width >= 50){
            sorterIcon = <ColumnSorterIcon sortByFxn={sortBy} currentSortColumn={sortColumn} descend={sortReverse} value={colDef.field} />;
        }
        return (
            <div data-field={field} key={field} data-tip={tooltip}
                className={"search-headers-column-block" + (noSort ? " no-sort" : '')}
                style={{ width }}>
                <div className="inner">
                    <span className="column-title">{ showTitle }</span>
                    { sorterIcon }
                </div>
                { Array.isArray(headerColumnWidths) ?
                    <Draggable position={{ x: width, y: 0 }} axis="x" onDrag={this.onDrag} onStop={this.onStop}>
                        <div className="width-adjuster"/>
                    </Draggable>
                    : null }
            </div>
        );
    }
}



export class HeadersRow extends React.Component {

    static propTypes = {
        'columnDefinitions' : PropTypes.array.isRequired,//ResultRow.propTypes.columnDefinitions,
        'mounted' : PropTypes.bool.isRequired,
        /** @deprecated */
        'isSticky' : PropTypes.bool,
        /** @deprecated */
        'stickyStyle' : PropTypes.object,
        /** @deprecated ?? */
        'tableLeftOffset' : PropTypes.number,
        /** @deprecated ?? */
        'tableContainerWidth' : PropTypes.number,
        /** @deprecated */
        'stickyHeaderTopOffset' : PropTypes.number,
        'renderDetailPane' : PropTypes.func,
        'headerColumnWidths' : PropTypes.arrayOf(PropTypes.number),
        'setHeaderWidths' : PropTypes.func,
        'width' : PropTypes.number,
        'defaultMinColumnWidth' : PropTypes.number,
        'tableContainerScrollLeft' : PropTypes.number
    };

    static defaultProps = {
        'isSticky' : false,
        'tableLeftOffset' : 0,
        'defaultMinColumnWidth' : 55,
        'tableContainerScrollLeft' : 0
    };

    constructor(props){
        super(props);
        this.throttledSetHeaderWidths = _.debounce(_.throttle(this.setHeaderWidths.bind(this), 1000), 350);
        this.setHeaderWidths = this.setHeaderWidths.bind(this);
        this.onAdjusterDrag = this.onAdjusterDrag.bind(this);
        this.state = {
            'widths' : (props.headerColumnWidths && props.headerColumnWidths.slice(0)) || null
        };
    }

    componentDidUpdate(pastProps){
        const { headerColumnWidths } = this.props;
        if (pastProps.headerColumnWidths !== headerColumnWidths){
            this.setState({ 'widths' : headerColumnWidths.slice(0) });
        }
    }

    setHeaderWidths(idx, evt, r){
        const { setHeaderWidths } = this.props;
        const { widths } = this.state;
        if (typeof setHeaderWidths !== 'function'){
            throw new Error('props.setHeaderWidths not a function');
        }
        setTimeout(()=> setHeaderWidths(widths.slice(0)), 0);
    }

    getWidthFor(idx){
        const { headerColumnWidths, mounted, columnDefinitions, windowWidth } = this.props;
        const { widths } = this.state;
        return (
            (Array.isArray(widths) && widths[idx]) ||
            (Array.isArray(headerColumnWidths) && headerColumnWidths[idx]) ||
            getColumnWidthFromDefinition(columnDefinitions[idx], mounted, windowWidth)
        );
    }

    onAdjusterDrag(idx, evt, r){
        this.setState(({ widths }, { columnDefinitions, defaultMinColumnWidth })=>{
            const nextWidths = widths.slice(0);
            nextWidths[idx] = Math.max(columnDefinitions[idx].minColumnWidth || defaultMinColumnWidth || 55, r.x);
            return { 'widths' : nextWidths };
        });
    }

    render(){
        const { tableLeftOffset, tableContainerWidth, columnDefinitions, stickyHeaderTopOffset, renderDetailPane, headerColumnWidths, width, tableContainerScrollLeft } = this.props;
        const { widths } = this.state;
        const isAdjustable = headerColumnWidths && widths;
        const outerClassName = (
            "search-headers-row"
            + (isAdjustable ? '' : ' non-adjustable')
            + (typeof renderDetailPane !== 'function' ? ' no-detail-pane' : '')
        );

        const outerStyle = {
            'width' : width || null // Only passed in from ItemPage
        };

        const leftOffset = 0 - tableContainerScrollLeft - (tableLeftOffset || 0);

        const innerStyle = {
            left: leftOffset,
            //transform: "translate3d(" + leftOffset + "px, 0px, 0px)"
        };

        return (
            <div className={outerClassName} style={outerStyle}>
                <div className="columns clearfix" style={innerStyle}>
                    {
                        _.map(columnDefinitions, (colDef, i)=>
                            <HeadersRowColumn {..._.pick(this.props, 'sortColumn', 'sortReverse', 'sortBy', 'headerColumnWidths')} colDef={colDef} index={i}
                                onAdjusterDrag={this.onAdjusterDrag} setHeaderWidths={this.setHeaderWidths} width={this.getWidthFor(i)} key={colDef.field}  />
                        )
                    }
                </div>
            </div>
        );
    }
}
