'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WindowNavigationController = void 0;

var _react = _interopRequireWildcard(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _url = _interopRequireDefault(require("url"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _navigate = require("./../../util/navigate");

var _searchFilters = require("./../../util/search-filters");

var _patchedConsole = require("./../../util/patched-console");

var _FacetList = require("./FacetList");

var _typedefs = require("./../../util/typedefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

/**
 * Accepts and parses the `href` from Redux / App.
 * Passes `href` downstream to descendant components,
 * as well as onFilter and onClearFilters functions which
 * navigate to new href.
 */
var WindowNavigationController = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(WindowNavigationController, _React$PureComponent);

  var _super = _createSuper(WindowNavigationController);

  _createClass(WindowNavigationController, null, [{
    key: "isClearFiltersBtnVisible",
    value: function isClearFiltersBtnVisible(href, context) {
      var urlPartsQuery = _url["default"].parse(href, true).query || {};
      var clearFiltersURL = typeof context.clear_filters === 'string' && context.clear_filters || null;

      var clearFiltersURLQuery = clearFiltersURL && _url["default"].parse(clearFiltersURL, true).query;

      return !!(clearFiltersURLQuery && !_underscore["default"].isEqual(clearFiltersURLQuery, urlPartsQuery));
    }
  }]);

  function WindowNavigationController(props) {
    var _this;

    _classCallCheck(this, WindowNavigationController);

    _this = _super.call(this, props);
    _this.onFilter = _this.onFilter.bind(_assertThisInitialized(_this));
    _this.onFilterMultiple = _this.onFilterMultiple.bind(_assertThisInitialized(_this));
    _this.onClearFilters = _this.onClearFilters.bind(_assertThisInitialized(_this));
    _this.getTermStatus = _this.getTermStatus.bind(_assertThisInitialized(_this));
    _this.memoized = {
      isClearFiltersBtnVisible: (0, _memoizeOne["default"])(WindowNavigationController.isClearFiltersBtnVisible)
    };
    return _this;
  }

  _createClass(WindowNavigationController, [{
    key: "onFilter",
    value: function onFilter(facet, term, callback) {
      var _this$props = this.props,
          href = _this$props.href,
          _this$props$navigate = _this$props.navigate,
          propNavigate = _this$props$navigate === void 0 ? _navigate.navigate : _this$props$navigate,
          contextFilters = _this$props.context.filters;
      return propNavigate((0, _FacetList.generateNextHref)(href, contextFilters, facet, term), {
        'dontScrollToTop': true
      }, typeof callback === "function" ? callback : null);
    }
    /**
     * Works in much the same way as onFilter, except takes in an array of filter objects ({facet, term, callback)}) and generates a composite href before navigating
     * @param {Array} filterObjs An object containing {facet, term, callback}
     * Note: may eventually merge with/use to replace onFilter -- will have to track down and edit in a LOT of places, though. So waiting to confirm this is
     * desired functionality.
     */

  }, {
    key: "onFilterMultiple",
    value: function onFilterMultiple() {
      var filterObjs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var _this$props2 = this.props,
          href = _this$props2.href,
          _this$props2$navigate = _this$props2.navigate,
          propNavigate = _this$props2$navigate === void 0 ? _navigate.navigate : _this$props2$navigate,
          contextFilters = _this$props2.context.filters;

      if (filterObjs.length === 0) {
        _patchedConsole.patchedConsoleInstance.log("Attempted multi-filter, but no objects passed in!");

        return null;
      }

      var newHref = href; // initialize to href

      var callback; // Update href to include facet/term query pairs for each new item

      filterObjs.forEach(function (obj, i) {
        var facet = obj.facet,
            term = obj.term,
            thisCallback = obj.callback;
        var thisHref = (0, _FacetList.generateNextHref)(newHref, contextFilters, facet, term);
        newHref = thisHref;

        if (i === 0) {
          callback = thisCallback;
        }
      });
      return propNavigate(newHref, {
        'dontScrollToTop': true
      }, typeof callback === "function" ? callback : null);
    }
  }, {
    key: "onClearFilters",
    value: function onClearFilters() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var _this$props3 = this.props,
          href = _this$props3.href,
          _this$props3$navigate = _this$props3.navigate,
          propNavigate = _this$props3$navigate === void 0 ? _navigate.navigate : _this$props3$navigate,
          _this$props3$context$ = _this$props3.context.clear_filters,
          clearFiltersURLOriginal = _this$props3$context$ === void 0 ? null : _this$props3$context$;
      var clearFiltersURL = clearFiltersURLOriginal;

      if (!clearFiltersURL) {
        _patchedConsole.patchedConsoleInstance.error("No Clear Filters URL");

        return;
      } // If we have a '#' in URL, add to target URL as well.


      var hashFragmentIdx = href.indexOf('#');

      if (hashFragmentIdx > -1 && clearFiltersURL.indexOf('#') === -1) {
        clearFiltersURL += href.slice(hashFragmentIdx);
      }

      propNavigate(clearFiltersURL, {}, typeof callback === 'function' ? callback : null);
    }
  }, {
    key: "getTermStatus",
    value: function getTermStatus(term, facet) {
      var filters = this.props.context.filters;
      return (0, _searchFilters.getTermFacetStatus)(term, facet, filters);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          children = _this$props4.children,
          propShowClearFiltersBtn = _this$props4.showClearFiltersButton,
          passProps = _objectWithoutProperties(_this$props4, ["children", "showClearFiltersButton"]);

      var href = passProps.href,
          context = passProps.context;
      var showClearFiltersButton = typeof propShowClearFiltersBtn === "boolean" ? propShowClearFiltersBtn : this.memoized.isClearFiltersBtnVisible(href, context || {});

      var propsToPass = _objectSpread(_objectSpread({}, passProps), {}, {
        showClearFiltersButton: showClearFiltersButton,
        onFilter: this.onFilter,
        onFilterMultiple: this.onFilterMultiple,
        onClearFilters: this.onClearFilters,
        getTermStatus: this.getTermStatus
      });

      return _react["default"].Children.map(children, function (child) {
        return /*#__PURE__*/_react["default"].cloneElement(child, propsToPass);
      });
    }
  }]);

  return WindowNavigationController;
}(_react["default"].PureComponent);

exports.WindowNavigationController = WindowNavigationController;