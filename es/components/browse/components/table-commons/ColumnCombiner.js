'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import { basicColumnExtensionMap, DEFAULT_WIDTH_MAP } from './basicColumnExtensionMap';
import { responsiveGridState } from './../../../util/layout';
import { isServerSide } from './../../../util/misc';
import { flattenSchemaPropertyToColumnDefinition } from './../../../util/schema-transforms';
import { tipsFromSchema } from './../../../util/object'; // eslint-disable-next-line no-unused-vars

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

export var ColumnCombiner = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ColumnCombiner, _React$PureComponent);

  var _super = _createSuper(ColumnCombiner);

  _createClass(ColumnCombiner, null, [{
    key: "getDefinitions",

    /**
     * Merges `columns` from backend context (or prop, via StaticSection) with `columnExtensionMap` prop from front-end.
     * Forms `columnDefinitions` list which is ultimately displayed in result table.
     *
     * @param {Object<string,{ title: string }} columns - Column definitions from backend (e.g. context, StaticSection props)
     * @param {Object<string,{ colTitle: JSX.Element|string, render: function(Item, ...): JSX.Element, widthMap: { sm: number, md: number, lg: number } }} columnExtensionMap - Column definitions/extensions from front-end code.
     * @returns {{ title: string, field: string, render: function, widthMap: { sm: number, md: number, lg: number } }[]} Final form of columns to display
     */
    value: function getDefinitions(columns, columnExtensionMap, colDefsFromSchema) {
      // TODO: Consider changing `defaultHiddenColumnMapFromColumns` to accept array (columnDefinitions) instd of Object (columns).
      // We currently don't put "default_hidden" property in columnExtensionMap, but could, in which case this change would be needed.
      return columnsToColumnDefinitions(columns, columnExtensionMap, colDefsFromSchema);
    }
    /**
     * @param {Object<string,{ title: string }} columns - Column definitions from backend (e.g. context, StaticSection props)
     * @param {function} filterColumnFxn - filtering function
     */

  }, {
    key: "filteredColumns",
    value: function filteredColumns(columns) {
      var filterColumnFxn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (typeof filterColumnFxn !== "function" || _typeof(columns) !== 'object') {
        return columns;
      }

      var nextColumns = {};
      Object.keys(columns).forEach(function (key) {
        if (filterColumnFxn(key, columns[key])) return;
        nextColumns[key] = columns[key];
      });
      return nextColumns;
    }
  }, {
    key: "getSortFieldDirection",
    value: function getSortFieldDirection(fieldType) {
      switch (fieldType) {
        case 'string':
          return 'asc';

        case 'integer':
          return 'desc';

        case 'number':
          return 'desc';

        case 'date':
          return 'desc';
      }

      return null;
    }
  }]);

  function ColumnCombiner(props) {
    var _this;

    _classCallCheck(this, ColumnCombiner);

    _this = _super.call(this, props);
    _this.memoized = {
      haveContextColumnsChanged: memoize(haveContextColumnsChanged),
      // We want `defaultHiddenColumns` memoized separately from `columnDefinitions`
      // because `defaultHiddenColumns` change triggers reset in `ColumnCombiner`.
      // This is becaused `columnExtensionMap` may change more frequently than `columns`.
      // e.g. in response to SelectedFiles' state.selectedFiles changing display_title column
      // render func in portal-specific logic or `detailPane`, like-wise.
      getDefaultHiddenColumns: memoize(defaultHiddenColumnMapFromColumns, function (_ref, _ref2) {
        var _ref3 = _slicedToArray(_ref, 1),
            nextColumns = _ref3[0];

        var _ref4 = _slicedToArray(_ref2, 1),
            prevColumns = _ref4[0];

        return !_this.memoized.haveContextColumnsChanged(prevColumns, nextColumns);
      }),
      getDefinitions: memoize(ColumnCombiner.getDefinitions, // Func to memoize

      /**
       * Custom "param equality" fxn.
       *
       * @param {Object<string,{ title: string }[]} nextArgSet - Next [ `columns`, `columnExtensionMap` ] args
       * @param {Object<string,{ title: string }[]} prevArgSet - Previous [ `columns`, `columnExtensionMap` ] args
       * @returns {boolean} If false, then memoized func is called.
       */
      function (nextArgSet, prevArgSet) {
        var _nextArgSet = _slicedToArray(nextArgSet, 2),
            nextColumns = _nextArgSet[0],
            nextColDefMap = _nextArgSet[1];

        var _prevArgSet = _slicedToArray(prevArgSet, 2),
            prevColumns = _prevArgSet[0],
            prevColDefMap = _prevArgSet[1];

        if (prevColDefMap !== nextColDefMap) {
          return false; // Update
        } // Semi-deep comparison of column keys (fields) -- if using undefined columns,
        // will use columns from context/search response, which will be under a new object
        // reference after each filter, sort, etc call. This allows us to preserve the custom
        // columns we've selected _unless_ Item type or something else changes which changes the
        // column set that comes down from back-end response.


        return !_this.memoized.haveContextColumnsChanged(prevColumns, nextColumns);
      }),
      filteredColumns: memoize(ColumnCombiner.filteredColumns),
      flattenSchemaPropertyToColumnDefinition: memoize(flattenSchemaPropertyToColumnDefinition),
      tipsFromSchema: memoize(tipsFromSchema)
    };
    return _this;
  }

  _createClass(ColumnCombiner, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          _this$props$columns = _this$props.columns,
          overridePropColumns = _this$props$columns === void 0 ? null : _this$props$columns,
          columnExtensionMap = _this$props.columnExtensionMap,
          _this$props$filterCol = _this$props.filterColumnFxn,
          filterColumnFxn = _this$props$filterCol === void 0 ? null : _this$props$filterCol,
          schemas = _this$props.schemas,
          passProps = _objectWithoutProperties(_this$props, ["children", "columns", "columnExtensionMap", "filterColumnFxn", "schemas"]);

      var _passProps$context = passProps.context;
      _passProps$context = _passProps$context === void 0 ? {} : _passProps$context;
      var contextColumns = _passProps$context.columns,
          context = passProps.context;
      var colDefsFromSchema;

      if (schemas) {
        colDefsFromSchema = this.memoized.flattenSchemaPropertyToColumnDefinition(schemas ? tipsFromSchema(schemas, context) : {}, 0, schemas);
      }

      var columns = this.memoized.filteredColumns(overridePropColumns || contextColumns || {}, filterColumnFxn);

      if (columns.length === 0) {
        console.error("No columns available in context nor props. Please provide columns. Ok if resorting to back-end provided columns and waiting for first response to load.");
      }

      var propsToPass = _objectSpread(_objectSpread({}, passProps), {}, {
        /** Final form of all columns to show in table */
        columnDefinitions: ColumnCombiner.getDefinitions(columns, columnExtensionMap, colDefsFromSchema),

        /**
         * Initial column keys/fields from `columnDefinitions` to be hidden from table.
         * Change of this prop value causes reset of hidden columns state.
         */
        defaultHiddenColumns: this.memoized.getDefaultHiddenColumns(columns)
      });

      return React.Children.map(children, function (child) {
        return /*#__PURE__*/React.cloneElement(child, propsToPass);
      });
    }
  }]);

  return ColumnCombiner;
}(React.PureComponent);
/**
 * Convert a map of field:title to list of column definitions, setting defaults.
 *
 * @param {Object.<string>} columns         Map of field names to field/column titles, as returned from back-end.
 * @param {Object} columnDefinitionMap      Map of field names to extra column properties such 'render', 'title', 'widthMap', etc.
 * @param {Object[]} constantDefinitions    Preset list of column definitions, each containing at least 'field' and 'title'.
 * @param {Object} defaultWidthMap          Map of responsive grid states (lg, md, sm) to pixel number sizes.
 * @returns {Object[]}                      List of objects containing keys 'title', 'field', 'widthMap', and 'render'.
 */

_defineProperty(ColumnCombiner, "defaultProps", {
  "columns": null,
  // Passed in as prop or defaults to context.columns
  "columnExtensionMap": basicColumnExtensionMap
});

export function columnsToColumnDefinitions(columns, columnDefinitionMap, colDefsFromSchema) {
  var defaultWidthMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_WIDTH_MAP;

  var uninishedColumnDefinitions = _.pairs(columns).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        field = _ref6[0],
        columnProperties = _ref6[1];

    return _objectSpread(_objectSpread({}, columnProperties), {}, {
      field: field
    });
  });

  var columnDefinitions = _.map(uninishedColumnDefinitions, function (colDef, i) {
    var colDefOverride = columnDefinitionMap && columnDefinitionMap[colDef.field];

    if (colDefOverride) {
      var colDef2 = _.extend({}, colDefOverride, colDef);

      colDef = colDef2;
    }

    colDef.widthMap = colDef.widthMap || defaultWidthMap;
    colDef.render = colDef.render || null;
    colDef.order = typeof colDef.order === 'number' ? colDef.order : i;

    if (!colDef.initial_sort) {
      if (colDefsFromSchema && colDefsFromSchema[colDef.field]) {
        var initialSort = ColumnCombiner.getSortFieldDirection(colDefsFromSchema[colDef.field].type);
        colDef.initial_sort = initialSort;
      }
    }

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

export function haveContextColumnsChanged(cols1, cols2) {
  if (cols1 === cols2) return false;
  if (cols1 && !cols2) return true;
  if (!cols1 && cols2) return true;
  var pastKeys = Object.keys(cols1);
  var nextKeys = Object.keys(cols2);
  var pKeysLen = pastKeys.length;
  var i;

  if (pKeysLen !== nextKeys.length) {
    return true;
  }

  pastKeys.sort();
  nextKeys.sort();

  for (i = 0; i < pKeysLen; i++) {
    if (pastKeys[i] !== nextKeys[i]) return true;
  }

  return false;
}
/**
 * @param {Object<string, Object>} columns - Object containing some column definitions/values.
 */

function defaultHiddenColumnMapFromColumns(columns) {
  var hiddenColMap = {};

  _.pairs(columns).forEach(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        field = _ref8[0],
        columnDefinition = _ref8[1];

    if (columnDefinition.default_hidden) {
      hiddenColMap[field] = true;
    } else {
      hiddenColMap[field] = false;
    }
  });

  return hiddenColMap;
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


export function getColumnWidthFromDefinition(columnDefinition) {
  var mounted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var windowWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var w = columnDefinition.width || columnDefinition.baseWidth || null;

  if (typeof w === 'number') {
    return w;
  }

  var widthMap = columnDefinition.widthMap || null;

  if (!widthMap) {
    return 250; // Fallback
  }

  var responsiveGridSize;
  if (!mounted || isServerSide()) responsiveGridSize = 'lg';else responsiveGridSize = responsiveGridState(windowWidth);
  if (responsiveGridSize === 'xs') responsiveGridSize = 'sm';
  if (responsiveGridSize === 'xl') responsiveGridSize = 'lg';
  return widthMap[responsiveGridSize || 'lg'];
}