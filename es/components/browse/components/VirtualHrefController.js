'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualHrefController = void 0;

var _react = _interopRequireWildcard(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _underscore = _interopRequireDefault(require("underscore"));

var _url = _interopRequireDefault(require("url"));

var analytics = _interopRequireWildcard(require("./../../util/analytics"));

var _ajax = require("./../../util/ajax");

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
var VirtualHrefController = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(VirtualHrefController, _React$PureComponent);

  var _super = _createSuper(VirtualHrefController);

  _createClass(VirtualHrefController, null, [{
    key: "transformedFacets",

    /**
     * @param {String[]} facets - facets array
     * @param {function} filterFacetFxn - filtering function
     */
    value: function transformedFacets(facets, filterFacetFxn) {
      if (typeof filterFacetFxn !== "function") {
        return facets;
      }

      if (!Array.isArray(facets)) {
        return []; // ? probably to-do if no facets: add placeholder saying no facets ?
      }

      return facets.filter(filterFacetFxn);
    }
  }, {
    key: "isClearFiltersBtnVisible",
    value: function isClearFiltersBtnVisible() {
      var virtualHref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var originalSearchHref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (virtualHref === null) {
        // Case if state.virtualCompoundFilterSet is not null.
        // Is moot since in such case, FacetList will be invisible or at least
        // non-functioning anyways.
        return false;
      }

      var virtualHrefPartsQuery = _url["default"].parse(virtualHref || "", true).query || {};
      var origHrefQuery = _url["default"].parse(originalSearchHref || "", true).query || {};
      return !_underscore["default"].isEqual(origHrefQuery, virtualHrefPartsQuery);
    }
  }]);

  function VirtualHrefController(props) {
    var _this;

    _classCallCheck(this, VirtualHrefController);

    _this = _super.call(this, props);
    _this.onFilter = _this.onFilter.bind(_assertThisInitialized(_this));
    _this.onFilterMultiple = _this.onFilterMultiple.bind(_assertThisInitialized(_this));
    _this.onClearFilters = _this.onClearFilters.bind(_assertThisInitialized(_this));
    _this.getTermStatus = _this.getTermStatus.bind(_assertThisInitialized(_this));
    _this.virtualNavigate = _this.virtualNavigate.bind(_assertThisInitialized(_this));
    _this.memoized = {
      transformedFacets: (0, _memoizeOne["default"])(VirtualHrefController.transformedFacets),
      isClearFiltersBtnVisible: (0, _memoizeOne["default"])(props.isClearFiltersBtnVisible || function (currentVirtualSearcHref) {
        // We assume props.searchHref doesn't ever change (we don't handle a change of this in any case)
        VirtualHrefController.isClearFiltersBtnVisible(currentVirtualSearcHref, props.searchHref);
      })
    };
    _this.state = {
      "virtualHref": props.searchHref || null,
      // Takes precedence over virtualHref, if present.
      // TODO: Allow props.compoundFilterSet to init with perhaps.
      "virtualCompoundFilterSet": null,
      "isContextLoading": false,
      "virtualContext": undefined // Let downstream components use defaultProps to fallback

    };
    return _this;
  }
  /** Will not be called if EmbeddedSearchView is not initialized with a `props.searchHref` */


  _createClass(VirtualHrefController, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$state = this.state,
          virtualHref = _this$state.virtualHref,
          virtualContext = _this$state.virtualContext,
          isContextLoading = _this$state.isContextLoading;

      if (!isContextLoading && !virtualContext && virtualHref) {
        // No results yet loaded.
        this.virtualNavigate(virtualHref);
      }
    }
    /**
     * Unlike App.navigate, this also supports JSON body as first param
     * in order to perform compound search.
     * This props.navigate must only be called by child/downstream components
     * of EmbeddedSearchViews. Children of non-Embedded Search View generally
     * should use the global `navigate`, instead.
     *
     * @param {string|{ filter_blocks: { query:string }[], intersect: boolean, global_flags: string }} navigationTarget - Search href or a compound filterset representation.
     * @param {Object} navOpts - Kept for standardization with App.navigate, not used here.
     * @param {function} callback - Executed after successful response.
     */

  }, {
    key: "virtualNavigate",
    value: function virtualNavigate(navigationTarget, navOpts, callback) {
      var _this2 = this;

      var _this$props$onLoad = this.props.onLoad,
          onLoad = _this$props$onLoad === void 0 ? null : _this$props$onLoad;
      var _this$state2 = this.state,
          _this$state2$virtualH = _this$state2.virtualHref,
          currentHref = _this$state2$virtualH === void 0 ? null : _this$state2$virtualH,
          existingContext = _this$state2.virtualContext;
      var nextHrefFull = null;
      var virtualCompoundFilterSet = null;

      if (typeof navigationTarget === "string") {
        // There is (very large) chance that `nextHref` does not have domain name, path, etc.
        // Resolve based on current virtualHref (else AJAX call may auto-resolve relative to browser URL).
        nextHrefFull = _url["default"].resolve(currentHref || "/search/", navigationTarget);
      } else {
        // Minor validation - let throw errors here.
        var filter_blocks = navigationTarget.filter_blocks;

        if (filter_blocks.length === 0) {
          throw new Error("Must have 1+ filter blocks");
        }

        var anyWithoutQueries = _underscore["default"].any(filter_blocks, function (_ref) {
          var query = _ref.query;
          if (typeof query !== "string") return true;
          return false;
        });

        if (anyWithoutQueries) {
          throw new Error("Each filterblock must have a query");
        }

        virtualCompoundFilterSet = navigationTarget;
      }

      var scopedRequest;

      _patchedConsole.patchedConsoleInstance.warn('VIRTUAL NAVIGATE CALLED', navigationTarget, nextHrefFull, navOpts);

      this.setState({
        "isContextLoading": true
      }, function () {
        var onLoadResponse = function (nextContext) {
          var total = nextContext.total,
              initialResults = nextContext['@graph'];

          if (scopedRequest !== _this2.currRequest) {
            _patchedConsole.patchedConsoleInstance.warn("This is no longer the current request", scopedRequest, _this2.currRequest);

            return false;
          }

          _this2.currRequest = null;

          if (typeof total !== "number") {
            throw new Error("Did not get back a search response");
          }

          if (typeof _navigate.navigate.updateUserInfo === "function") {
            _navigate.navigate.updateUserInfo();
          } // Get correct URL from XHR, in case we hit a redirect during the request.


          var responseHref = null;

          if (!virtualCompoundFilterSet) {
            responseHref = scopedRequest && scopedRequest.xhr && scopedRequest.xhr.responseURL || nextHrefFull;
          }

          if (typeof existingContext === "undefined") {
            // First time we've loaded response context. Register analytics event.
            if (Array.isArray(initialResults)) {
              analytics.impressionListOfItems(initialResults, responseHref || "/compound_search", "Embedded Search View");
              var evtObj = analytics.eventObjectFromCtx(existingContext);
              delete evtObj.name;
              evtObj.eventValue = initialResults.length;
              analytics.event("VirtualHrefController", "Initial Results Loaded", evtObj);
            }
          }

          _patchedConsole.patchedConsoleInstance.info("Loaded Next Context", nextContext);

          _this2.setState({
            "virtualContext": nextContext,
            "isContextLoading": false,
            "virtualHref": responseHref,
            "virtualCompoundFilterSet": virtualCompoundFilterSet
          }, function () {
            if (typeof callback === "function") {
              callback(nextContext);
            }

            if (typeof onLoad === "function") {
              onLoad(nextContext);
            }
          });
        };

        if (_this2.currRequest) {
          // Try cancel existing request if possible.
          _this2.currRequest.abort();

          _this2.currRequest = null;
        }

        scopedRequest = _this2.currRequest = (0, _ajax.load)(nextHrefFull ? nextHrefFull : "/compound_search", onLoadResponse, nextHrefFull ? "GET" : "POST", onLoadResponse, virtualCompoundFilterSet ? JSON.stringify(virtualCompoundFilterSet) : null);
      });
      return scopedRequest;
    }
  }, {
    key: "onFilter",
    value: function onFilter(facet, term, callback) {
      var _this$state3 = this.state,
          virtualHref = _this$state3.virtualHref,
          virtualContextFilters = _this$state3.virtualContext.filters;
      return this.virtualNavigate((0, _FacetList.generateNextHref)(virtualHref, virtualContextFilters, facet, term), {
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
      var _this$state4 = this.state,
          virtualHref = _this$state4.virtualHref,
          virtualContextFilters = _this$state4.virtualContext.filters;

      if (filterObjs.length === 0) {
        _patchedConsole.patchedConsoleInstance.log("Attempted multi-filter, but no objects passed in!");

        return null;
      }

      var newHref = virtualHref; // initialize to href

      var callback; // Update href to include facet/term query pairs for each new item

      filterObjs.forEach(function (obj, i) {
        var facet = obj.facet,
            term = obj.term,
            thisCallback = obj.callback;
        var thisHref = (0, _FacetList.generateNextHref)(newHref, virtualContextFilters, facet, term);
        newHref = thisHref;

        if (i === 0) {
          callback = thisCallback;
        }
      });
      return this.virtualNavigate(newHref, {
        'dontScrollToTop': true
      }, typeof callback === "function" ? callback : null);
    }
    /** Unlike in case of SearchView, which defaults to response's clear filters URL, this defaults to original searchHref */

  }, {
    key: "onClearFilters",
    value: function onClearFilters() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var _this$props = this.props,
          searchHref = _this$props.searchHref,
          onClearFiltersVirtual = _this$props.onClearFiltersVirtual;

      if (typeof onClearFiltersVirtual === "function") {
        // If custom function is passed, let it reset filters.
        onClearFiltersVirtual(this.virtualNavigate, callback);
      } else {
        // Reset to original searchHref from current virtual href.
        this.virtualNavigate(searchHref, {}, typeof callback === 'function' ? callback : null);
      }
    }
  }, {
    key: "getTermStatus",
    value: function getTermStatus(term, facet) {
      var virtualContextFilters = this.state.virtualContext.filters;
      return (0, _searchFilters.getTermFacetStatus)(term, facet, virtualContextFilters);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          propFacets = _this$props2.facets,
          _this$props2$filterFa = _this$props2.filterFacetFxn,
          filterFacetFxn = _this$props2$filterFa === void 0 ? null : _this$props2$filterFa,
          _this$props2$columns = _this$props2.columns,
          propColumns = _this$props2$columns === void 0 ? null : _this$props2$columns,
          originalSearchHref = _this$props2.searchHref,
          passProps = _objectWithoutProperties(_this$props2, ["children", "facets", "filterFacetFxn", "columns", "searchHref"]);

      var _this$state5 = this.state,
          href = _this$state5.virtualHref,
          context = _this$state5.virtualContext,
          requestedCompoundFilterSet = _this$state5.virtualCompoundFilterSet,
          isContextLoading = _this$state5.isContextLoading; // Allow facets=null to mean no facets shown. facets=undefined means to default to context.facets.

      var facets = propFacets === null ? null : this.memoized.transformedFacets(propFacets || context && context.facets || null, filterFacetFxn);
      var showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href);

      var propsToPass = _objectSpread(_objectSpread({}, passProps), {}, {
        context: context,
        requestedCompoundFilterSet: requestedCompoundFilterSet,
        // Don't pass down href if using requestedCompoundFilterSet
        href: requestedCompoundFilterSet ? null : href,
        isContextLoading: isContextLoading,
        facets: facets,
        showClearFiltersButton: showClearFiltersButton,
        navigate: this.virtualNavigate,
        onFilter: this.onFilter,
        onFilterMultiple: this.onFilterMultiple,
        onClearFilters: this.onClearFilters,
        getTermStatus: this.getTermStatus
      });

      return _react["default"].Children.map(children, function (child) {
        if (! /*#__PURE__*/_react["default"].isValidElement(child)) return child;
        return /*#__PURE__*/_react["default"].cloneElement(child, propsToPass);
      });
    }
  }]);

  return VirtualHrefController;
}(_react["default"].PureComponent);

exports.VirtualHrefController = VirtualHrefController;