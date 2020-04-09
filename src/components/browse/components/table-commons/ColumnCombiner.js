'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import { basicColumnExtensionMap, DEFAULT_WIDTH_MAP } from './basicColumnExtensionMap';
import { responsiveGridState } from './../../../util/layout';
import { isServerSide } from './../../../util/misc';

// eslint-disable-next-line no-unused-vars
import { Item, ColumnDefinition } from './../../../util/typedefs';

/**
 * Primarily combines `props.columns` || `props.context.columns` with `props.columnExtensionMap`
 * to generate final array of `columnDefinitions`.
 *
 * Also:
 * - Filters columns down by `props.filterFacetFxn`, if any present.
 * - Resets `defaultHiddenColumns` if `context.columns` (search type changed) or `props.columns` have changed.
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
        const nextColumns = {};
        Object.keys(columns).forEach(function(key){
            if (filterColumnFxn(key, columns[key])) return;
            nextColumns[key] = columns[key];
        });
        return nextColumns;
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
 * Convert a map of field:title to list of column definitions, setting defaults.
 *
 * @param {Object.<string>} columns         Map of field names to field/column titles, as returned from back-end.
 * @param {Object} columnDefinitionMap      Map of field names to extra column properties such 'render', 'title', 'widthMap', etc.
 * @param {Object[]} constantDefinitions    Preset list of column definitions, each containing at least 'field' and 'title'.
 * @param {Object} defaultWidthMap          Map of responsive grid states (lg, md, sm) to pixel number sizes.
 * @returns {Object[]}                      List of objects containing keys 'title', 'field', 'widthMap', and 'render'.
 */
export function columnsToColumnDefinitions(columns, columnDefinitionMap, defaultWidthMap = DEFAULT_WIDTH_MAP){
    const uninishedColumnDefinitions = _.pairs(columns).map(function([ field, columnProperties ]){
        return { ...columnProperties, field };
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
}


/**
 * Used as equality checker for `columnsToColumnDefinitions` `columns` param memoization.
 *
 * Should handle and fail cases where context and columns object reference values
 * have changed, but not contents. User-selected columns should be preserved upon faceting
 * or similar filtering, but be updated when search type changes.
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

    const pastKeys = Object.keys(cols1);
    const nextKeys = Object.keys(cols2);
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
 * @param {Object<string, Object>} columns - Object containing some column definitions/values.
 */
function defaultHiddenColumnMapFromColumns(columns){
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




/**
 * Adds a `baseWidth` property to each columnDefinition based off widthMap or default value (100).
 * Used in 4DN ItemPageTable, otherwise is deprecated?
 *
 * @deprecated
 */
export function columnDefinitionsToScaledColumnDefinitions(columnDefinitions){
    return columnDefinitions.map(function(colDef){
        const colDef2 = _.clone(colDef);
        colDef2.baseWidth = colDef.widthMap.sm || colDef.widthMap.md || colDef.widthMap.lg || 100;
        if (typeof colDef.render !== 'function'){
            colDef2.render = null;
        }
        return colDef2;
    });
}


/**
 * Determine the typical column width, given current browser width. Defaults to large width if server-side.
 * @todo Consider instead of using this func frequently, storing "scaledWidth" on (new instance of) `columnDefinition`.
 * @todo This would mean this func could be used within this file/module and not need be exported.
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
