import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["href", "context", "navigate", "currentAction", "searchHref", "renderSearchResultTable", "columns", "hideColumns", "facets", "aboveTableComponent", "aboveFacetListComponent", "facetListComponent", "columnExtensionMap", "onLoad", "filterFacetFxn", "filterColumnFxn", "windowWidth", "embeddedTableHeader", "embeddedTableFooter", "onClearFiltersVirtual", "isClearFiltersBtnVisible", "facetColumnClassName", "tableColumnClassName", "allowPostRequest"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
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