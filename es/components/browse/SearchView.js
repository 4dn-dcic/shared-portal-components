'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ColumnCombiner", {
  enumerable: true,
  get: function get() {
    return _tableCommons.ColumnCombiner;
  }
});
Object.defineProperty(exports, "CustomColumnController", {
  enumerable: true,
  get: function get() {
    return _CustomColumnController.CustomColumnController;
  }
});
Object.defineProperty(exports, "SortController", {
  enumerable: true,
  get: function get() {
    return _SortController.SortController;
  }
});
Object.defineProperty(exports, "SelectedItemsController", {
  enumerable: true,
  get: function get() {
    return _SelectedItemsController.SelectedItemsController;
  }
});
exports.SearchView = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _navigate = require("./../util/navigate");

var _misc = require("./../util/misc");

var _patchedConsole = require("./../util/patched-console");

var _tableCommons = require("./components/table-commons");

var _AboveSearchTablePanel = require("./components/AboveSearchTablePanel");

var _CustomColumnController = require("./components/CustomColumnController");

var _SortController = require("./components/SortController");

var _SelectedItemsController = require("./components/SelectedItemsController");

var _WindowNavigationController = require("./components/WindowNavigationController");

var _ControlsAndResults = require("./components/ControlsAndResults");

var _typedefs = require("./../util/typedefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

var SearchView = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SearchView, _React$PureComponent);

  var _super = _createSuper(SearchView);

  function SearchView() {
    _classCallCheck(this, SearchView);

    return _super.apply(this, arguments);
  }

  _createClass(SearchView, [{
    key: "componentDidMount",

    /**
     * @property {string} href - Current URI.
     * @property {!string} [currentAction=null] - Current action, if any.
     * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
     * @property {boolean} separateSingleTermFacets - If true, will push facets w/ only 1 term available to bottom of FacetList.
     */
    value: function componentDidMount() {
      _reactTooltip["default"].rebuild();
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
          propNavigate = _this$props$navigate === void 0 ? _navigate.navigate : _this$props$navigate,
          _this$props$columns = _this$props.columns,
          columns = _this$props$columns === void 0 ? null : _this$props$columns,
          _this$props$columnExt = _this$props.columnExtensionMap,
          columnExtensionMap = _this$props$columnExt === void 0 ? _tableCommons.basicColumnExtensionMap : _this$props$columnExt,
          placeholderReplacementFxn = _this$props.placeholderReplacementFxn,
          windowWidth = _this$props.windowWidth,
          passProps = _objectWithoutProperties(_this$props, ["href", "context", "showClearFiltersButton", "schemas", "currentAction", "facets", "navigate", "columns", "columnExtensionMap", "placeholderReplacementFxn", "windowWidth"]);

      var contextFacets = context.facets; // All these controllers pass props down to their children.
      // So we don't need to be repetitive here; i.e. may assume 'context' is available
      // in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.
      // As well as in ControlsAndResults.

      var childViewProps = _objectSpread(_objectSpread({}, passProps), {}, {
        currentAction: currentAction,
        schemas: schemas,
        windowWidth: windowWidth,
        isOwnPage: true,
        facets: propFacets || contextFacets
      });

      var controllersAndView = /*#__PURE__*/_react["default"].createElement(_WindowNavigationController.WindowNavigationController, _extends({
        href: href,
        context: context,
        showClearFiltersButton: showClearFiltersButton
      }, {
        navigate: propNavigate
      }), /*#__PURE__*/_react["default"].createElement(_tableCommons.ColumnCombiner, {
        columns: columns,
        columnExtensionMap: columnExtensionMap
      }, /*#__PURE__*/_react["default"].createElement(_CustomColumnController.CustomColumnController, null, /*#__PURE__*/_react["default"].createElement(_SortController.SortController, null, /*#__PURE__*/_react["default"].createElement(_ControlsAndResults.ControlsAndResults, childViewProps)))));

      if ((0, _misc.isSelectAction)(currentAction)) {
        // We don't allow "SelectionMode" unless is own page.
        // Could consider changing later once a use case exists.
        controllersAndView =
        /*#__PURE__*/
        // SelectedItemsController must be above ColumnCombiner because it adjusts
        // columnExtensionMap, rather than columnDefinitions. This can be easily changed
        // though if desired.
        _react["default"].createElement(_SelectedItemsController.SelectedItemsController, {
          columnExtensionMap: columnExtensionMap,
          currentAction: currentAction
        }, controllersAndView);
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "search-page-container"
      }, /*#__PURE__*/_react["default"].createElement(_AboveSearchTablePanel.AboveSearchTablePanel, {
        context: context,
        placeholderReplacementFxn: placeholderReplacementFxn
      }), controllersAndView);
    }
  }]);

  return SearchView;
}(_react["default"].PureComponent);

exports.SearchView = SearchView;

_defineProperty(SearchView, "propTypes", {
  'context': _propTypes["default"].object.isRequired,
  'columns': _propTypes["default"].object,
  'columnExtensionMap': _propTypes["default"].object,
  'currentAction': _propTypes["default"].string,
  'href': _propTypes["default"].string.isRequired,
  'session': _propTypes["default"].bool.isRequired,
  'navigate': _propTypes["default"].func,
  'facets': _propTypes["default"].array,
  'isFullscreen': _propTypes["default"].bool.isRequired,
  'toggleFullScreen': _propTypes["default"].func.isRequired,
  'separateSingleTermFacets': _propTypes["default"].bool.isRequired,
  'detailPane': _propTypes["default"].element,
  'renderDetailPane': _propTypes["default"].func,
  'showClearFiltersButton': _propTypes["default"].bool,
  'isOwnPage': _propTypes["default"].bool,
  'schemas': _propTypes["default"].object,
  'placeholderReplacementFxn': _propTypes["default"].func // Passed down to AboveSearchTablePanel StaticSection

});

_defineProperty(SearchView, "defaultProps", {
  'href': null,
  // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
  // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
  'columns': null,
  'navigate': _navigate.navigate,
  'currentAction': null,
  'columnExtensionMap': _tableCommons.basicColumnExtensionMap,
  'separateSingleTermFacets': true,
  'isOwnPage': true
});