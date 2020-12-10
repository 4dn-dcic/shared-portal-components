'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

import React, { useMemo } from 'react';
import memoize from 'memoize-one';
import _ from 'underscore';
import url from 'url';
import queryString from 'query-string';
import * as analytics from './../../util/analytics';
import { load as ajaxLoad } from './../../util/ajax';
import { navigate as globalNavigate } from './../../util/navigate';
import { getTermFacetStatus } from './../../util/search-filters';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { generateNextHref } from './FacetList'; // eslint-disable-next-line no-unused-vars

import { SearchResponse, Item, ColumnDefinition, URLParts } from './../../util/typedefs';
/**
 * Accepts and parses the `href` from Redux / App.
 * Passes `href` downstream to descendant components,
 * as well as onFilter and onClearFilters functions which
 * navigate to new href.
 */

export var VirtualHrefController = /*#__PURE__*/function (_React$PureComponent) {
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

      var virtualHrefPartsQuery = url.parse(virtualHref || "", true).query || {};
      var origHrefQuery = url.parse(originalSearchHref || "", true).query || {};
      return !_.isEqual(origHrefQuery, virtualHrefPartsQuery);
    }
  }]);

  function VirtualHrefController(props) {
    var _this;

    _classCallCheck(this, VirtualHrefController);

    _this = _super.call(this, props);
    _this.onFilter = _this.onFilter.bind(_assertThisInitialized(_this));
    _this.onClearFilters = _this.onClearFilters.bind(_assertThisInitialized(_this));
    _this.getTermStatus = _this.getTermStatus.bind(_assertThisInitialized(_this));
    _this.virtualNavigate = _this.virtualNavigate.bind(_assertThisInitialized(_this));
    _this.memoized = {
      transformedFacets: memoize(VirtualHrefController.transformedFacets),
      isClearFiltersBtnVisible: memoize(props.isClearFiltersBtnVisible || function (currentVirtualSearcHref) {
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
        nextHrefFull = url.resolve(currentHref || "/search/", navigationTarget); // Divide URL into parts and put into a virtualCompoundFilterSet, in effect making all virtual search
        // requests into POST requests.

        var targetHrefParts = url.parse(nextHrefFull, true);
        var globalFlagsParams = {};
        var filterBlockParams = {};
        var searchType = null;
        Object.keys(targetHrefParts.query).forEach(function (k) {
          if (k === "type") {
            searchType = targetHrefParts.query[k];

            if (Array.isArray(searchType)) {
              // Shouldn't happen, but sometimes we might get 2 type= in URL. E.g. in response 'filters' "remove" property.
              console.warn("Received 2 type= URL params.");
              var _searchType = searchType;

              var _searchType2 = _slicedToArray(_searchType, 1);

              searchType = _searchType2[0];
            }

            return;
          }

          if (k === "sort" || k === "additional_facet") {
            globalFlagsParams[k] = targetHrefParts.query[k];
          } else {
            filterBlockParams[k] = targetHrefParts.query[k];
          }
        }); // If it's a single filter_block requested, we will get back "facets"
        // and similar things in the response, unlike as for response for real
        // compound_search request for multiple filter_blocks which would lack those.
        // We can thus perform a 'drop-in' POST compound_search for 1 filter_block
        // in place of a GET /search/?type=... request.

        virtualCompoundFilterSet = {
          "global_flags": queryString.stringify(globalFlagsParams),
          "search_type": searchType,
          "filter_blocks": [{
            "flags_applied": [],
            "query": queryString.stringify(filterBlockParams)
          }]
        };
      } else {
        // Minor validation - let throw errors here.
        var filter_blocks = navigationTarget.filter_blocks;

        if (filter_blocks.length === 0) {
          throw new Error("Must have 1+ filter blocks");
        }

        var anyWithoutQueries = _.any(filter_blocks, function (_ref) {
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
      console.warn('VIRTUAL NAVIGATE CALLED', navigationTarget, nextHrefFull, navOpts);
      this.setState({
        "isContextLoading": true
      }, function () {
        var onLoadResponse = function (nextContext) {
          var total = nextContext.total,
              initialResults = nextContext['@graph'];

          if (scopedRequest !== _this2.currRequest) {
            console.warn("This is no longer the current request", scopedRequest, _this2.currRequest);
            return false;
          }

          _this2.currRequest = null;

          if (typeof total !== "number") {
            throw new Error("Did not get back a search response");
          }

          if (typeof globalNavigate.updateUserInfo === "function") {
            globalNavigate.updateUserInfo();
          } // Get correct URL from XHR, in case we hit a redirect during the request.
          // (Only for requests with single href, as cannot treat real compound_search multi-filter-block request as href)


          var responseHref = !nextHrefFull ? null : !virtualCompoundFilterSet ? scopedRequest && scopedRequest.xhr && scopedRequest.xhr.responseURL || nextHrefFull : nextHrefFull;

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

          console.info("Loaded Next Context", nextContext);

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

        scopedRequest = _this2.currRequest = ajaxLoad(virtualCompoundFilterSet ? "/compound_search" : nextHrefFull, onLoadResponse, virtualCompoundFilterSet ? "POST" : "GET", onLoadResponse, virtualCompoundFilterSet ? JSON.stringify(virtualCompoundFilterSet) : null);
      });
      return scopedRequest;
    }
  }, {
    key: "onFilter",
    value: function onFilter(facet, term, callback) {
      var _this$state3 = this.state,
          virtualHref = _this$state3.virtualHref,
          _this$state3$virtualC = _this$state3.virtualContext,
          virtualContextFilters = _this$state3$virtualC.filters,
          virtualContextID = _this$state3$virtualC["@id"]; // There are is a scenario or 2 in which case we might get facets visible after
      // a compound search request, if using only 1 filter block.
      // In most cases it'd be after using a `href` to navigate which was translated
      // to a POST, so we'd be using a virtual href, but at times might be from a literal
      // filter set with only 1 filter block. In this case we grab the effectively-searched href
      // from context["@id"].

      var targetHref = generateNextHref(virtualHref || virtualContextID, virtualContextFilters, facet, term);
      return this.virtualNavigate(targetHref, {
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
      return getTermFacetStatus(term, facet, virtualContextFilters);
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

      var _this$state4 = this.state,
          href = _this$state4.virtualHref,
          context = _this$state4.virtualContext,
          requestedCompoundFilterSet = _this$state4.virtualCompoundFilterSet,
          isContextLoading = _this$state4.isContextLoading; // Allow facets=null to mean no facets shown. facets=undefined means to default to context.facets.

      var facets = propFacets === null ? null : this.memoized.transformedFacets(propFacets || context && context.facets || null, filterFacetFxn);
      var showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href);

      var propsToPass = _objectSpread(_objectSpread({}, passProps), {}, {
        context: context,
        href: href,
        // Don't pass down requestedCompoundFilterSet if using (or pretending to use) href
        requestedCompoundFilterSet: href ? null : requestedCompoundFilterSet,
        isContextLoading: isContextLoading,
        facets: facets,
        showClearFiltersButton: showClearFiltersButton,
        navigate: this.virtualNavigate,
        onFilter: this.onFilter,
        onClearFilters: this.onClearFilters,
        getTermStatus: this.getTermStatus
      });

      return React.Children.map(children, function (child) {
        if (! /*#__PURE__*/React.isValidElement(child)) return child;
        return /*#__PURE__*/React.cloneElement(child, propsToPass);
      });
    }
  }]);

  return VirtualHrefController;
}(React.PureComponent);