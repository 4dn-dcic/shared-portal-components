function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var _excluded = ["href", "context", "showClearFiltersButton", "schemas", "currentAction", "facets", "navigate", "columns", "columnExtensionMap", "placeholderReplacementFxn", "windowWidth"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
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
import { ControlsAndResults } from './components/ControlsAndResults'; // eslint-disable-next-line no-unused-vars

import { SearchResponse, Item, ColumnDefinition, URLParts } from './../util/typedefs';
export { SortController, SelectedItemsController, ColumnCombiner, CustomColumnController };
export var SearchView = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SearchView, _React$PureComponent);

  var _super = _createSuper(SearchView);

  function SearchView() {
    _classCallCheck(this, SearchView);

    return _super.apply(this, arguments);
  }

  _createClass(SearchView, [{
    key: "componentDidMount",
    value:
    /**
     * @property {string} href - Current URI.
     * @property {!string} [currentAction=null] - Current action, if any.
     * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
     * @property {boolean} separateSingleTermFacets - If true, will push facets w/ only 1 term available to bottom of FacetList.
     */
    function componentDidMount() {
      ReactTooltip.rebuild();
    }
    /**
     * TODO once we have @type : [..more stuff..], change to use instead of `getSchemaTypeFromSearchContext`.
     * For custom styling from CSS stylesheet (e.g. to sync override of rowHeight in both CSS and in props here)
     */

  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          href = _this$props.href,
          context = _this$props.context,
          showClearFiltersButton = _this$props.showClearFiltersButton,
          _this$props$schemas = _this$props.schemas,
          schemas = _this$props$schemas === void 0 ? null : _this$props$schemas,
          _this$props$currentAc = _this$props.currentAction,
          currentAction = _this$props$currentAc === void 0 ? null : _this$props$currentAc,
          propFacets = _this$props.facets,
          _this$props$navigate = _this$props.navigate,
          propNavigate = _this$props$navigate === void 0 ? navigate : _this$props$navigate,
          _this$props$columns = _this$props.columns,
          columns = _this$props$columns === void 0 ? null : _this$props$columns,
          _this$props$columnExt = _this$props.columnExtensionMap,
          columnExtensionMap = _this$props$columnExt === void 0 ? basicColumnExtensionMap : _this$props$columnExt,
          placeholderReplacementFxn = _this$props.placeholderReplacementFxn,
          windowWidth = _this$props.windowWidth,
          passProps = _objectWithoutProperties(_this$props, _excluded);

      var contextFacets = context.facets; // All these controllers pass props down to their children.
      // So we don't need to be repetitive here; i.e. may assume 'context' is available
      // in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.
      // As well as in ControlsAndResults.

      var childViewProps = _objectSpread(_objectSpread({}, passProps), {}, {
        // Includes pass-thru props like 'facetListComponent', 'aboveTableComponent', 'aboveFacetListComponent', etc.
        currentAction: currentAction,
        schemas: schemas,
        href: href,
        windowWidth: windowWidth,
        isOwnPage: true,
        facets: propFacets || contextFacets
      });

      var controllersAndView = /*#__PURE__*/React.createElement(WindowNavigationController, {
        href: href,
        context: context,
        showClearFiltersButton: showClearFiltersButton,
        navigate: propNavigate
      }, /*#__PURE__*/React.createElement(ColumnCombiner, {
        columns: columns,
        columnExtensionMap: columnExtensionMap
      }, /*#__PURE__*/React.createElement(CustomColumnController, null, /*#__PURE__*/React.createElement(SortController, null, /*#__PURE__*/React.createElement(ControlsAndResults, childViewProps)))));

      if (isSelectAction(currentAction)) {
        // We don't allow "SelectionMode" unless is own page.
        // Could consider changing later once a use case exists.
        controllersAndView =
        /*#__PURE__*/
        // SelectedItemsController must be above ColumnCombiner because it adjusts
        // columnExtensionMap, rather than columnDefinitions. This can be easily changed
        // though if desired.
        React.createElement(SelectedItemsController, {
          columnExtensionMap: columnExtensionMap,
          currentAction: currentAction
        }, controllersAndView);
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "search-page-container"
      }, /*#__PURE__*/React.createElement(AboveSearchTablePanel, {
        context: context,
        placeholderReplacementFxn: placeholderReplacementFxn
      }), controllersAndView);
    }
  }]);

  return SearchView;
}(React.PureComponent);

_defineProperty(SearchView, "propTypes", {
  'context': PropTypes.object.isRequired,
  'columns': PropTypes.object,
  'columnExtensionMap': PropTypes.object,
  'currentAction': PropTypes.string,
  'href': PropTypes.string.isRequired,
  'session': PropTypes.bool.isRequired,
  'navigate': PropTypes.func,
  'facets': PropTypes.array,
  'isFullscreen': PropTypes.bool.isRequired,
  'toggleFullScreen': PropTypes.func.isRequired,
  'separateSingleTermFacets': PropTypes.bool.isRequired,
  'detailPane': PropTypes.element,
  'renderDetailPane': PropTypes.func,
  'showClearFiltersButton': PropTypes.bool,
  'isOwnPage': PropTypes.bool,
  'schemas': PropTypes.object,
  'placeholderReplacementFxn': PropTypes.func // Passed down to AboveSearchTablePanel StaticSection

});

_defineProperty(SearchView, "defaultProps", {
  'href': null,
  // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
  // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
  'columns': null,
  'navigate': navigate,
  'currentAction': null,
  'columnExtensionMap': basicColumnExtensionMap,
  'separateSingleTermFacets': true,
  'isOwnPage': true
});