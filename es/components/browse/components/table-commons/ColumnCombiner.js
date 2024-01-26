import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["children", "columns", "columnExtensionMap", "filterColumnFxn"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
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
export var ColumnCombiner = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ColumnCombiner, _React$PureComponent);
  var _super = _createSuper(ColumnCombiner);
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
      getDefinitions: memoize(ColumnCombiner.getDefinitions,
      // Func to memoize
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
        }

        // Semi-deep comparison of column keys (fields) -- if using undefined columns,
        // will use columns from context/search response, which will be under a new object
        // reference after each filter, sort, etc call. This allows us to preserve the custom
        // columns we've selected _unless_ Item type or something else changes which changes the
        // column set that comes down from back-end response.
        return !_this.memoized.haveContextColumnsChanged(prevColumns, nextColumns);
      }),
      filteredColumns: memoize(ColumnCombiner.filteredColumns)
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
        passProps = _objectWithoutProperties(_this$props, _excluded);
      var _passProps$context = passProps.context,
        _passProps$context2 = _passProps$context === void 0 ? {} : _passProps$context,
        _passProps$context2$c = _passProps$context2.columns,
        contextColumns = _passProps$context2$c === void 0 ? {} : _passProps$context2$c;
      var columnDefinitions = this.memoized.filteredColumns(this.memoized.getDefinitions(overridePropColumns || contextColumns, columnExtensionMap), filterColumnFxn);
      if (columnDefinitions.length === 0) {
        console.error("No columns available in context nor props. Please provide columns. Ok if resorting to back-end provided columns and waiting for first response to load.");
      }
      var propsToPass = _objectSpread(_objectSpread({}, passProps), {}, {
        /** Final form of all columns to show in table */
        columnDefinitions: columnDefinitions,
        /**
         * Initial column keys/fields from `columnDefinitions` to be hidden from table.
         * Change of this prop value causes reset of hidden columns state.
         */
        defaultHiddenColumns: this.memoized.getDefaultHiddenColumns(columnDefinitions)
      });
      return React.Children.map(children, function (child) {
        return /*#__PURE__*/React.cloneElement(child, propsToPass);
      });
    }
  }], [{
    key: "getDefinitions",
    value:
    /**
     * Merges `columns` from backend context (or prop, via StaticSection) with `columnExtensionMap` prop from front-end.
     * Forms `columnDefinitions` list which is ultimately displayed in result table.
     *
     * @param {Object<string,{ title: string }} columns - Column definitions from backend (e.g. context, StaticSection props)
     * @param {Object<string,{ colTitle: JSX.Element|string, render: function(Item, ...): JSX.Element, widthMap: { sm: number, md: number, lg: number } }} columnExtensionMap - Column definitions/extensions from front-end code.
     * @returns {{ title: string, field: string, render: function, widthMap: { sm: number, md: number, lg: number } }[]} Final form of columns to display
     */
    function getDefinitions(columns, columnExtensionMap) {
      // TODO: Consider changing `defaultHiddenColumnMapFromColumns` to accept array (columnDefinitions) instd of Object (columns).
      // We currently don't put "default_hidden" property in columnExtensionMap, but could, in which case this change would be needed.
      return columnsToColumnDefinitions(columns, columnExtensionMap);
    }

    /**
     * @param {{ field: string, title: string }[]} columns - Column definitions from backend (e.g. context, StaticSection props)
     * @param {function} filterColumnFxn - filtering function
     */
  }, {
    key: "filteredColumns",
    value: function filteredColumns(columns) {
      var filterColumnFxn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return columns.filter(function (colDef) {
        var _colDef$disabled = colDef.disabled,
          disabled = _colDef$disabled === void 0 ? false : _colDef$disabled,
          field = colDef.field;
        if (disabled) return false;
        if (filterColumnFxn && filterColumnFxn(field, colDef)) return false;
        return true;
      });
    }
  }]);
  return ColumnCombiner;
}(React.PureComponent);

/**
 * Convert a map of field:title to list of column definitions, setting defaults.
 *
 * @param {Object.<string>} columns         Map of field names to field/column titles, as returned from back-end.
 * @param {Object} columnExtensionMap       Map of field names to extra column properties such 'render', 'title', 'widthMap', etc.
 * @param {Object[]} constantDefinitions    Preset list of column definitions, each containing at least 'field' and 'title'.
 * @param {Object} defaultWidthMap          Map of responsive grid states (lg, md, sm) to pixel number sizes.
 * @returns {Object[]}                      List of objects containing keys 'title', 'field', 'widthMap', and 'render'.
 */
_defineProperty(ColumnCombiner, "defaultProps", {
  "columns": null,
  // Passed in as prop or defaults to context.columns
  "columnExtensionMap": basicColumnExtensionMap
});
export function columnsToColumnDefinitions(columns, columnExtensionMap) {
  var defaultWidthMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_WIDTH_MAP;
  var columnDefinitions = _.pairs(columns).map(function (_ref5, colPairIndex) {
    var _ref6 = _slicedToArray(_ref5, 2),
      field = _ref6[0],
      columnProperties = _ref6[1];
    var _ref7$field = (columnExtensionMap || {})[field],
      columnExtension = _ref7$field === void 0 ? {} : _ref7$field;
    var ceColTitle = columnExtension.colTitle,
      ceWidthMap = columnExtension.widthMap,
      ceRender = columnExtension.render,
      ceOrder = columnExtension.order,
      ceDisabled = columnExtension.disabled;
    var cpColTitle = columnProperties.colTitle,
      cpWidthMap = columnProperties.widthMap,
      cpOrder = columnProperties.order,
      cpDisabled = columnProperties.disabled;
    var colDef = _objectSpread(_objectSpread(_objectSpread({}, columnExtension), columnProperties), {}, {
      field: field,
      // Precedence to specific columnExtensionMap values over columnProperties ones; fallbacks
      colTitle: ceColTitle || cpColTitle,
      widthMap: ceWidthMap || cpWidthMap || defaultWidthMap,
      render: ceRender || null,
      disabled: typeof ceDisabled === "boolean" ? ceDisabled : typeof cpDisabled === "boolean" ? cpDisabled : false,
      order: typeof ceOrder === "number" ? ceOrder : typeof cpOrder === "number" ? cpOrder : colPairIndex
    });
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
 * @param {{ field: string, default_hidden: boolean? }} columnDefinitions - List containing some column definitions/values.
 */
function defaultHiddenColumnMapFromColumns(columnDefinitions) {
  var hiddenColMap = {};
  columnDefinitions.forEach(function (_ref8) {
    var field = _ref8.field,
      _ref8$default_hidden = _ref8.default_hidden,
      default_hidden = _ref8$default_hidden === void 0 ? false : _ref8$default_hidden;
    if (default_hidden) {
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