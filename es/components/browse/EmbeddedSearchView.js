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
exports.EmbeddedSearchView = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _navigate = require("./../util/navigate");

var _patchedConsole = require("./../util/patched-console");

var _tableCommons = require("./components/table-commons");

var _CustomColumnController = require("./components/CustomColumnController");

var _SortController = require("./components/SortController");

var _SelectedItemsController = require("./components/SelectedItemsController");

var _ControlsAndResults = require("./components/ControlsAndResults");

var _typedefs = require("./../util/typedefs");

var _VirtualHrefController = require("./components/VirtualHrefController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EmbeddedSearchView =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(EmbeddedSearchView, _React$PureComponent);

  function EmbeddedSearchView() {
    _classCallCheck(this, EmbeddedSearchView);

    return _possibleConstructorReturn(this, _getPrototypeOf(EmbeddedSearchView).apply(this, arguments));
  }

  _createClass(EmbeddedSearchView, [{
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
          _this$props$currentAc = _this$props.currentAction,
          currentAction = _this$props$currentAc === void 0 ? null : _this$props$currentAc,
          searchHref = _this$props.searchHref,
          _this$props$schemas = _this$props.schemas,
          schemas = _this$props$schemas === void 0 ? null : _this$props$schemas,
          _this$props$columns = _this$props.columns,
          columns = _this$props$columns === void 0 ? null : _this$props$columns,
          facets = _this$props.facets,
          _this$props$showAbove = _this$props.showAboveTableControls,
          showAboveTableControls = _this$props$showAbove === void 0 ? false : _this$props$showAbove,
          _this$props$columnExt = _this$props.columnExtensionMap,
          columnExtensionMap = _this$props$columnExt === void 0 ? _tableCommons.basicColumnExtensionMap : _this$props$columnExt,
          _this$props$onLoad = _this$props.onLoad,
          onLoad = _this$props$onLoad === void 0 ? null : _this$props$onLoad,
          passProps = _objectWithoutProperties(_this$props, ["href", "context", "currentAction", "searchHref", "schemas", "columns", "facets", "showAboveTableControls", "columnExtensionMap", "onLoad"]); // If facets are null (hidden/excluded), set table col to be full width of container.


      var tableColumnClassName = facets === null ? "col-12" : undefined;

      var viewProps = _objectSpread({}, passProps, {
        showAboveTableControls: showAboveTableControls,
        schemas: schemas,
        tableColumnClassName: tableColumnClassName
      });

      return _react["default"].createElement("div", {
        className: "embedded-search-container"
      }, _react["default"].createElement(_VirtualHrefController.VirtualHrefController, _extends({
        searchHref: searchHref,
        facets: facets,
        onLoad: onLoad
      }, {
        key: searchHref
      }), _react["default"].createElement(_tableCommons.ColumnCombiner, {
        columns: columns,
        columnExtensionMap: columnExtensionMap
      }, _react["default"].createElement(_CustomColumnController.CustomColumnController, null, _react["default"].createElement(_SortController.SortController, null, _react["default"].createElement(_ControlsAndResults.ControlsAndResults, _extends({}, viewProps, {
        isOwnPage: false
      })))))));
    }
  }]);

  return EmbeddedSearchView;
}(_react["default"].PureComponent);

exports.EmbeddedSearchView = EmbeddedSearchView;

_defineProperty(EmbeddedSearchView, "propTypes", {
  'context': _propTypes["default"].object,
  // From Redux store; is NOT passed down. Overriden instead.
  'columns': _propTypes["default"].object,
  'columnExtensionMap': _propTypes["default"].object,
  'searchHref': _propTypes["default"].string.isRequired,
  'session': _propTypes["default"].bool.isRequired,
  'schemas': _propTypes["default"].object,
  'facets': _propTypes["default"].array,
  'separateSingleTermFacets': _propTypes["default"].bool.isRequired,
  'renderDetailPane': _propTypes["default"].func,
  'showFacets': _propTypes["default"].bool,
  'onLoad': _propTypes["default"].func
});

_defineProperty(EmbeddedSearchView, "defaultProps", {
  'searchHref': null,
  // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
  // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
  'columns': null,
  'navigate': _navigate.navigate,
  'currentAction': null,
  'columnExtensionMap': _tableCommons.basicColumnExtensionMap,
  'separateSingleTermFacets': true,
  'showFacets': false
});