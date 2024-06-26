import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
var _excluded = ["children", "facets", "filterFacetFxn", "columns", "searchHref"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _callSuper(_this, derived, args) {
  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, function () {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
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
import { generateNextHref } from './FacetList';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../../util/typedefs';

/**
 * Accepts and parses the `href` from Redux / App.
 * Passes `href` downstream to descendant components,
 * as well as onFilter and onClearFilters functions which
 * navigate to new href.
 */
export var VirtualHrefController = /*#__PURE__*/function (_React$PureComponent) {
  function VirtualHrefController(props) {
    var _this2;
    _classCallCheck(this, VirtualHrefController);
    _this2 = _callSuper(this, VirtualHrefController, [props]);
    _this2.onFilter = _this2.onFilter.bind(_this2);
    _this2.onFilterMultiple = _this2.onFilterMultiple.bind(_this2);
    _this2.onClearFilters = _this2.onClearFilters.bind(_this2);
    _this2.getTermStatus = _this2.getTermStatus.bind(_this2);
    _this2.virtualNavigate = _this2.virtualNavigate.bind(_this2);
    _this2.memoized = {
      transformedFacets: memoize(VirtualHrefController.transformedFacets),
      isClearFiltersBtnVisible: memoize(props.isClearFiltersBtnVisible || function (currentVirtualSearcHref) {
        // We assume props.searchHref doesn't ever change (we don't handle a change of this in any case)
        VirtualHrefController.isClearFiltersBtnVisible(currentVirtualSearcHref, props.searchHref);
      })
    };
    _this2.state = {
      "virtualHref": props.searchHref || null,
      // Takes precedence over virtualHref, if present.
      // TODO: Allow props.compoundFilterSet to init with perhaps.
      "virtualCompoundFilterSet": null,
      "isContextLoading": false,
      "virtualContext": undefined // Let downstream components use defaultProps to fallback
    };
    return _this2;
  }

  /** Will not be called if EmbeddedSearchView is not initialized with a `props.searchHref` */
  _inherits(VirtualHrefController, _React$PureComponent);
  return _createClass(VirtualHrefController, [{
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
      var _this3 = this;
      var _this$props = this.props,
        _this$props$onLoad = _this$props.onLoad,
        onLoad = _this$props$onLoad === void 0 ? null : _this$props$onLoad,
        _this$props$allowPost = _this$props.allowPostRequest,
        allowPostRequest = _this$props$allowPost === void 0 ? false : _this$props$allowPost;
      var _this$state2 = this.state,
        _this$state2$virtualH = _this$state2.virtualHref,
        currentHref = _this$state2$virtualH === void 0 ? null : _this$state2$virtualH,
        existingContext = _this$state2.virtualContext;
      var nextHrefFull = null; // Will become string if navigationTarget is string, else null
      var virtualCompoundFilterSet = null; // Will become object if navigationTarget is object, else null

      if (typeof navigationTarget === "string") {
        // There is (very large) chance that `nextHref` does not have domain name, path, etc.
        // Resolve based on current virtualHref (else AJAX call may auto-resolve relative to browser URL).
        nextHrefFull = url.resolve(currentHref || "/search/", navigationTarget);
        if (allowPostRequest) {
          // Remove this if condition/wrapper/prop once 4DN has a /compound_search

          // Divide URL into parts and put into a virtualCompoundFilterSet, in effect making all virtual search
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
            } else if (!(k === "from" || k === "limit")) {
              filterBlockParams[k] = targetHrefParts.query[k];
            } // Do nothing / filter out.
            // Minor optimization & deprecated workaround --
            // We never expect `from` or `limit` to be in URL for WindowNavigationController
            // but `from0&limit=25` may be present in virtualCompoundFilterSet response's `@id`.
            // We don't need these URL params for non-load-as-you-scroll requests.
          });

          // If it's a single filter_block requested, we will get back "facets"
          // and similar things in the response, unlike as for response for real
          // compound_search request for multiple filter_blocks which would lack those.

          // We can thus perform a 'drop-in' POST compound_search for 1 filter_block
          // in place of a GET /search/?type=... request.
          virtualCompoundFilterSet = {
            // queryString.stringify will convert spaces into %20, but we expect "+" to be used
            // for spaces in search hrefs, so overwrite after each time that stringify is used on URL params.
            "global_flags": queryString.stringify(globalFlagsParams).replaceAll("%20", "+"),
            "search_type": searchType,
            "filter_blocks": [{
              "flags_applied": [],
              "query": queryString.stringify(filterBlockParams).replaceAll("%20", "+")
            }]
          };
        }
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
          if (scopedRequest !== _this3.currRequest) {
            console.warn("This is no longer the current request", scopedRequest, _this3.currRequest);
            return false;
          }
          _this3.currRequest = null;
          if (typeof total !== "number") {
            throw new Error("Did not get back a search response, request was potentially aborted.");
          }

          // Get correct URL from XHR, in case we hit a redirect during the request.
          // (Only for requests with single href, as cannot treat real compound_search multi-filter-block request as href)
          var responseHref = virtualCompoundFilterSet ? null : scopedRequest && scopedRequest.xhr && scopedRequest.xhr.responseURL || nextHrefFull || null;
          if (typeof existingContext === "undefined") {
            // First time we've loaded response context. Register analytics event.
            if (Array.isArray(initialResults)) {
              var impressionedItems = analytics.impressionListOfItems(initialResults, responseHref || "/compound_search", "Embedded Search View");
              analytics.event("view_item_list", "VirtualHrefController", "Initial Results Loaded", null, {
                items: impressionedItems,
                value: initialResults.length,
                filters: analytics.getStringifiedCurrentFilters(nextContext && nextContext.filters || null)
              });
            }
          }
          console.info("Loaded Next Context", nextContext);
          _this3.setState({
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
        if (_this3.currRequest) {
          // Try cancel existing request if possible.
          _this3.currRequest.abort();
          _this3.currRequest = null;
        }

        // We still might perform GET request on 4DN which doesn't yet have /compound_search
        scopedRequest = _this3.currRequest = ajaxLoad(virtualCompoundFilterSet ? "/compound_search" : nextHrefFull, onLoadResponse, virtualCompoundFilterSet ? "POST" : "GET", onLoadResponse, virtualCompoundFilterSet ? JSON.stringify(virtualCompoundFilterSet) : null);
      });
      return scopedRequest;
    }

    /**
     * Can only be called when there's a single filter block  (or searchHref), since depends on a
     * single virtualHref (which === virtualContextID w. 1 single filter block).
     */
  }, {
    key: "onFilter",
    value: function onFilter(facet, term, callback) {
      this.onFilterMultiple([{
        facet: facet,
        term: term
      }], callback);

      // Reset any item selections when a new filter is specified
      this.clearSelectedItems();
    }

    /**
     * Works in much the same way as onFilter, except takes in an array of filter
     * objects ({facet, term, callback)}) and generates a composite href before navigating.
     *
     * Can only be called when there's a single filter block (or searchHref), since depends on a
     * single virtualHref (which === virtualContextID w. 1 single filter block).
     *
     * @todo
     * Possibly eventually merge with/use to replace onFilter for DRYness -- will have to track down
     * and edit in some places though.
     *
     * @param {Array} filterObjs An object containing {facet, term, callback}
     */
  }, {
    key: "onFilterMultiple",
    value: function onFilterMultiple() {
      var filterObjs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var _this$state3 = this.state,
        virtualHref = _this$state3.virtualHref,
        _this$state3$virtualC = _this$state3.virtualContext,
        virtualContextFilters = _this$state3$virtualC.filters,
        virtualContextID = _this$state3$virtualC["@id"];
      if (!virtualHref && !virtualContextID) {
        throw new Error("Cannot filter on a compound filter block search response. Prevent this from being possible in UX.");
      }
      if (filterObjs.length === 0) {
        console.error("Attempted multi-filter, but no objects passed in!");
        return null;
      }

      // We have a virtualContextID present if and only if we have a Compound search request
      // that has only one filter block. In such cases we render the FacetList to allow filtering.
      // It is interchangeable with search URL.
      var newHref = virtualHref || virtualContextID;

      // Update href to include facet/term query pairs for each new item
      filterObjs.forEach(function (obj) {
        var facet = obj.facet,
          term = obj.term;
        var thisHref = generateNextHref(newHref, virtualContextFilters, facet, term);
        newHref = thisHref;
      });

      // Reset any item selections when new filters are specified
      this.clearSelectedItems();
      return this.virtualNavigate(newHref, {
        'dontScrollToTop': true
      }, typeof callback === "function" ? callback : null);
    }

    /** Unlike in case of SearchView, which defaults to response's clear filters URL, this defaults to original searchHref */
  }, {
    key: "onClearFilters",
    value: function onClearFilters() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var _this$props2 = this.props,
        searchHref = _this$props2.searchHref,
        onClearFiltersVirtual = _this$props2.onClearFiltersVirtual;
      if (typeof onClearFiltersVirtual === "function") {
        // If custom function is passed, let it reset filters.
        onClearFiltersVirtual(this.virtualNavigate, callback);
      } else {
        // Reset to original searchHref from current virtual href.
        this.virtualNavigate(searchHref, {}, typeof callback === 'function' ? callback : null);
      }

      // When filters are cleared, again, clear any selectedItems
      this.clearSelectedItems();
    }
  }, {
    key: "getTermStatus",
    value: function getTermStatus(term, facet) {
      var virtualContextFilters = this.state.virtualContext.filters;
      return getTermFacetStatus(term, facet, virtualContextFilters);
    }
  }, {
    key: "clearSelectedItems",
    value: function clearSelectedItems() {
      var _this$props3 = this.props,
        clearSelectedItemsOnFilter = _this$props3.clearSelectedItemsOnFilter,
        selectedItems = _this$props3.selectedItems,
        onResetSelectedItems = _this$props3.onResetSelectedItems;

      // Reset any item selections when a new filter is specified
      if (clearSelectedItemsOnFilter && !onResetSelectedItems) {
        throw new Error("Embedded Search View must be wrapped in SelectedItemsController to clearSelectedItemsOnFilter");
      } else if (clearSelectedItemsOnFilter && selectedItems !== null && selectedItems !== void 0 && selectedItems.size) {
        onResetSelectedItems();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
        children = _this$props4.children,
        propFacets = _this$props4.facets,
        _this$props4$filterFa = _this$props4.filterFacetFxn,
        filterFacetFxn = _this$props4$filterFa === void 0 ? null : _this$props4$filterFa,
        _this$props4$columns = _this$props4.columns,
        propColumns = _this$props4$columns === void 0 ? null : _this$props4$columns,
        originalSearchHref = _this$props4.searchHref,
        passProps = _objectWithoutProperties(_this$props4, _excluded);
      var _this$state4 = this.state,
        href = _this$state4.virtualHref,
        context = _this$state4.virtualContext,
        requestedCompoundFilterSet = _this$state4.virtualCompoundFilterSet,
        isContextLoading = _this$state4.isContextLoading;

      // Allow facets=null to mean no facets shown. facets=undefined means to default to context.facets.
      var facets = propFacets === null ? null : this.memoized.transformedFacets(propFacets || context && context.facets || null, filterFacetFxn);
      var showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href);
      var propsToPass = _objectSpread(_objectSpread({}, passProps), {}, {
        context: context,
        href: href,
        requestedCompoundFilterSet: requestedCompoundFilterSet,
        isContextLoading: isContextLoading,
        facets: facets,
        showClearFiltersButton: showClearFiltersButton,
        navigate: this.virtualNavigate,
        onFilter: this.onFilter,
        onFilterMultiple: this.onFilterMultiple,
        onClearFilters: this.onClearFilters,
        getTermStatus: this.getTermStatus
      });
      return React.Children.map(children, function (child) {
        if (! /*#__PURE__*/React.isValidElement(child)) return child;
        return /*#__PURE__*/React.cloneElement(child, propsToPass);
      });
    }
  }], [{
    key: "transformedFacets",
    value:
    /**
     * @param {String[]} facets - facets array
     * @param {function} filterFacetFxn - filtering function
     */
    function transformedFacets(facets, filterFacetFxn) {
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
}(React.PureComponent);