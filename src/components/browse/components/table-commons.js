'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import _ from 'underscore';
import memoize from 'memoize-one';
import queryString from 'querystring';
import Draggable from 'react-draggable';

import { LocalizedTime } from './../../ui/LocalizedTime';
import { navigate } from './../../util/navigate';
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
            const { href, rowNumber, currentAction, navigate: propNavigate, detailOpen, toggleDetailOpen } = props;
            let title = itemUtil.getTitleStringFromContext(result);
            const link = itemUtil.atId(result);
            let tooltip;
            let hasPhoto = false;

            /** Registers a list click event for Google Analytics then performs navigation. */
            function handleClick(evt){
                evt.preventDefault();
                evt.stopPropagation();
                trackProductClick(result, {
                    'list'      : hrefToListName(href),
                    'position'  : rowNumber + 1
                }, function(){
                    (propNavigate || navigate)(link);
                });
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
                var urlParts = url.parse(props.href, true),
                    query = { 'type' : leafItemType };
                if (urlParts.query.q) query.q = urlParts.query.q;
                var nextHref = '/search/?' + queryString.stringify(query);
                (props.navigate || navigate)(nextHref);
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
    if (typeof value !== 'string' && !React.isValidElement(value)){
        if (value && typeof value === 'object'){
            if (typeof value.display_title !== 'undefined'){
                const atId = itemUtil.atId(value);
                if (atId){
                    return <a href={atId}>{ value.display_title }</a>;
                } else {
                    return value.display_title;
                }
            }
        } else if (!value) value = null;
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
    var pKeys       = _.keys(cols1),
        pKeysLen    = pKeys.length,
        nKeys       = _.keys(cols2),
        i;

    if (pKeysLen !== nKeys.length) return true;
    for (i = 0; i < pKeysLen; i++){
        if (pKeys[i] !== nKeys[i]) return true;
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
    var uninishedColumnDefinitions = _.map(
        _.pairs(columns),
        function([field, columnProperties]){
            return _.extend({ field }, columnProperties);
        }
    );

    var columnDefinitions = _.map(uninishedColumnDefinitions, function(colDef, i){
        var colDefOverride = columnDefinitionMap && columnDefinitionMap[colDef.field];
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


export const defaultHiddenColumnMapFromColumns = memoize(function(columns){
    var hiddenColMap = {};
    _.forEach(_.pairs(columns), function([ field, columnDefinition ]){
        if (columnDefinition.default_hidden){
            hiddenColMap[field] = true;
        } else {
            hiddenColMap[field] = false;
        }
    });
    return hiddenColMap;
}, function(newArgs, lastArgs){
    // We allow different object references to be considered equal as long as their values are equal.
    return !haveContextColumnsChanged(lastArgs[0], newArgs[0]);
});

/**
 * Adds a `baseWidth` property to each columnDefinition based off widthMap or default value (100).
 */
export const columnDefinitionsToScaledColumnDefinitions = memoize(function(columnDefinitions){
    return _.map(columnDefinitions, function(colDef){
        var colDef2 = _.clone(colDef);
        colDef2.baseWidth = colDef.widthMap.sm || colDef.widthMap.md || colDef.widthMap.lg || 100;
        if (typeof colDef.render !== 'function'){
            colDef2.render = null;
        }
        return colDef2;
    });
});


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

    var w = columnDefinition.width || columnDefinition.baseWidth || null;
    if (typeof w === 'number'){
        return w;
    }
    var widthMap = columnDefinition.widthMap || null;
    if (widthMap){
        let responsiveGridSize;
        if (!mounted || isServerSide()) responsiveGridSize = 'lg';
        else responsiveGridSize = responsiveGridState(windowWidth);
        if (responsiveGridSize === 'xs') responsiveGridSize = 'sm';
        if (responsiveGridSize === 'xl') responsiveGridSize = 'lg';
        return widthMap[responsiveGridSize || 'lg'];
    }
    return 250; // Fallback.
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
        if (!value) value = null;
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
            value = <small className="text-300">-</small>;
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
        let sorterIcon;
        if (!colDef.noSort && typeof sortBy === 'function' && width >= 50){
            sorterIcon = <ColumnSorterIcon sortByFxn={sortBy} currentSortColumn={sortColumn} descend={sortReverse} value={colDef.field} />;
        }
        return (
            <div
                data-field={colDef.field}
                key={colDef.field}
                className={"search-headers-column-block" + (colDef.noSort ? " no-sort" : '')}
                style={{ width }}>
                <div className="inner">
                    <span className="column-title">{ colDef.colTitle || colDef.title }</span>
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

    static fullRowWidth = memoize(function(columnDefinitions, mounted=true, dynamicWidths=null, windowWidth=null){
        return _.reduce(columnDefinitions, function(fw, colDef, i){
            var w;
            if (typeof colDef === 'number') w = colDef;
            else {
                if (Array.isArray(dynamicWidths) && dynamicWidths[i]) w = dynamicWidths[i];
                else w = getColumnWidthFromDefinition(colDef, mounted, windowWidth);
            }
            if (typeof w !== 'number') w = 0;
            return fw + w;
        }, 0);
    });

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
        const { headerColumnWidths, mounted, columnDefinitions } = this.props;
        const { widths } = this.state;
        return (
            (Array.isArray(widths) && widths[idx]) ||
            (Array.isArray(headerColumnWidths) && headerColumnWidths[idx]) ||
            getColumnWidthFromDefinition(columnDefinitions[idx], mounted)
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
