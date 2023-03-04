var _excluded = ["href", "context", "navigate", "currentAction", "searchHref", "renderSearchResultTable", "columns", "hideColumns", "facets", "aboveTableComponent", "aboveFacetListComponent", "facetListComponent", "columnExtensionMap", "onLoad", "filterFacetFxn", "filterColumnFxn", "windowWidth", "embeddedTableHeader", "embeddedTableFooter", "onClearFiltersVirtual", "isClearFiltersBtnVisible", "facetColumnClassName", "tableColumnClassName", "allowPostRequest"];
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { patchedConsoleInstance as console } from './../util/patched-console';
import { listToObj as _listToObj } from './../util/object';
import { basicColumnExtensionMap, ColumnCombiner } from './components/table-commons';
import { CustomColumnController } from './components/CustomColumnController';
import { SortController } from './components/SortController';
import { SelectedItemsController } from './components/SelectedItemsController';
import { ControlsAndResults } from './components/ControlsAndResults';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../util/typedefs';
import { VirtualHrefController } from './components/VirtualHrefController';
export { SortController, SelectedItemsController, ColumnCombiner, CustomColumnController };
export var EmbeddedSearchView = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(EmbeddedSearchView, _React$PureComponent);
  var _super = _createSuper(EmbeddedSearchView);
  function EmbeddedSearchView(props) {
    var _this;
    _classCallCheck(this, EmbeddedSearchView);
    _this = _super.call(this, props);
    _this.filterFacetFxn = _this.filterFacetFxn.bind(_assertThisInitialized(_this));
    _this.memoized = {
      listToObj: memoize(EmbeddedSearchView.listToObj)
    };
    return _this;
  }
  _createClass(EmbeddedSearchView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      ReactTooltip.rebuild();
    }
  }, {
    key: "filterFacetFxn",
    value: function filterFacetFxn(facet) {
      var _this$props$hideFacet = this.props.hideFacets,
        hideFacets = _this$props$hideFacet === void 0 ? null : _this$props$hideFacet;
      if (!hideFacets) return true;
      var idMap = this.memoized.listToObj(hideFacets);
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
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        href = _this$props.href,
        context = _this$props.context,
        propNavigate = _this$props.navigate,
        _this$props$currentAc = _this$props.currentAction,
        currentAction = _this$props$currentAc === void 0 ? null : _this$props$currentAc,
        searchHref = _this$props.searchHref,
        _this$props$renderSea = _this$props.renderSearchResultTable,
        renderSearchResultTable = _this$props$renderSea === void 0 ? true : _this$props$renderSea,
        _this$props$columns = _this$props.columns,
        columns = _this$props$columns === void 0 ? null : _this$props$columns,
        hideColumns = _this$props.hideColumns,
        facets = _this$props.facets,
        _this$props$aboveTabl = _this$props.aboveTableComponent,
        aboveTableComponent = _this$props$aboveTabl === void 0 ? null : _this$props$aboveTabl,
        _this$props$aboveFace = _this$props.aboveFacetListComponent,
        aboveFacetListComponent = _this$props$aboveFace === void 0 ? null : _this$props$aboveFace,
        facetListComponent = _this$props.facetListComponent,
        _this$props$columnExt = _this$props.columnExtensionMap,
        columnExtensionMap = _this$props$columnExt === void 0 ? basicColumnExtensionMap : _this$props$columnExt,
        _this$props$onLoad = _this$props.onLoad,
        onLoad = _this$props$onLoad === void 0 ? null : _this$props$onLoad,
        _this$props$filterFac = _this$props.filterFacetFxn,
        propFacetFilterFxn = _this$props$filterFac === void 0 ? null : _this$props$filterFac,
        filterColumnFxn = _this$props.filterColumnFxn,
        windowWidth = _this$props.windowWidth,
        _this$props$embeddedT = _this$props.embeddedTableHeader,
        embeddedTableHeader = _this$props$embeddedT === void 0 ? null : _this$props$embeddedT,
        _this$props$embeddedT2 = _this$props.embeddedTableFooter,
        embeddedTableFooter = _this$props$embeddedT2 === void 0 ? null : _this$props$embeddedT2,
        onClearFiltersVirtual = _this$props.onClearFiltersVirtual,
        isClearFiltersBtnVisible = _this$props.isClearFiltersBtnVisible,
        facetColumnClassName = _this$props.facetColumnClassName,
        propTableColumnClassName = _this$props.tableColumnClassName,
        _this$props$allowPost = _this$props.allowPostRequest,
        allowPostRequest = _this$props$allowPost === void 0 ? false : _this$props$allowPost,
        passProps = _objectWithoutProperties(_this$props, _excluded);

      // If facets are null (hidden/excluded) and no props.tableColumnClassName set table col to be full width of container instead of the default set by ControlsAndResults.
      var tableColumnClassName = propTableColumnClassName || (facets === null ? "col-12" : undefined);
      // Includes pass-through props like `maxHeight`, `hideFacets`, etc.
      var viewProps = _objectSpread(_objectSpread({}, passProps), {}, {
        aboveTableComponent: aboveTableComponent,
        aboveFacetListComponent: aboveFacetListComponent,
        facetListComponent: facetListComponent,
        tableColumnClassName: tableColumnClassName,
        facetColumnClassName: facetColumnClassName
      });
      var filterFacetFxn = propFacetFilterFxn || this.filterFacetFxn;
      return /*#__PURE__*/React.createElement("div", {
        className: "embedded-search-container"
      }, /*#__PURE__*/React.createElement(VirtualHrefController, {
        searchHref: searchHref,
        facets: facets,
        onLoad: onLoad,
        filterFacetFxn: filterFacetFxn,
        onClearFiltersVirtual: onClearFiltersVirtual,
        isClearFiltersBtnVisible: isClearFiltersBtnVisible,
        allowPostRequest: allowPostRequest,
        key: searchHref || 1
      }, /*#__PURE__*/React.createElement(ColumnCombiner, {
        columns: columns,
        columnExtensionMap: columnExtensionMap
      }, /*#__PURE__*/React.createElement(CustomColumnController, {
        windowWidth: windowWidth,
        filterColumnFxn: filterColumnFxn,
        hiddenColumns: hideColumns
      }, /*#__PURE__*/React.createElement(SortController, null, embeddedTableHeader, renderSearchResultTable ? /*#__PURE__*/React.createElement(ControlsAndResults, _extends({}, viewProps, {
        isOwnPage: false
      })) : null, embeddedTableFooter)))));
    }
  }], [{
    key: "listToObj",
    value:
    /**
     * @property {string} searchHref - Base URI to search on.
     * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
     * @property {boolean} separateSingleTermFacets - If true, will push facets w/ only 1 term available to bottom of FacetList.
     * @property {string[]} hideFacets - If `filterFacetFxn` is falsy, and `facets` are undefined, then will be used to filter facets shown.
     * @property {string[]} hideColumns - If `filterColumnFxn` is falsy, and `columns` are undefined, then will be used to filter columns shown.
     */

    function listToObj(hideFacetStrs) {
      return _listToObj(hideFacetStrs.concat(hideFacetStrs.map(function (facetStr) {
        return facetStr + "!";
      })));
    }
  }]);
  return EmbeddedSearchView;
}(React.PureComponent);
_defineProperty(EmbeddedSearchView, "propTypes", {
  // May not be present which prevents VirtualHrefController from navigating upon mount. Useful if want to init with filterSet search or in other place.
  'searchHref': PropTypes.string,
  // From Redux store; context, href, & navigate are NOT passed down. Overriden instead.
  'context': PropTypes.object,
  'href': PropTypes.string,
  'navigate': PropTypes.func,
  'currentAction': PropTypes.string,
  // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
  // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
  'columns': PropTypes.object,
  'columnExtensionMap': PropTypes.object,
  'session': PropTypes.bool,
  'schemas': PropTypes.object,
  'windowWidth': PropTypes.number,
  'renderSearchResultTable': PropTypes.bool,
  'facets': PropTypes.array,
  'separateSingleTermFacets': PropTypes.bool.isRequired,
  'renderDetailPane': PropTypes.func,
  'detailPane': PropTypes.element,
  'onLoad': PropTypes.func,
  'hideFacets': PropTypes.arrayOf(PropTypes.string),
  'hideColumns': PropTypes.arrayOf(PropTypes.string),
  'filterFacetFxn': PropTypes.func,
  'filterColumnFxn': PropTypes.func,
  'onClearFiltersVirtual': PropTypes.func,
  'isClearFiltersBtnVisible': PropTypes.func,
  'embeddedTableHeader': PropTypes.element,
  'embeddedTableFooter': PropTypes.element,
  'aboveTableComponent': PropTypes.element,
  'aboveFacetListComponent': PropTypes.element,
  'facetListComponent': PropTypes.element,
  'facetColumnClassName': PropTypes.string,
  'tableColumnClassName': PropTypes.string,
  'allowPostRequest': PropTypes.bool,
  'targetTabKey': PropTypes.string
});
_defineProperty(EmbeddedSearchView, "defaultProps", {
  'columnExtensionMap': basicColumnExtensionMap,
  'separateSingleTermFacets': true,
  'hideFacets': ["type", "validation_errors.name"],
  'hideColumns': null
});