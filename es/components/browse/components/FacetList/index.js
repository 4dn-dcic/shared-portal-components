import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _extends from "@babel/runtime/helpers/extends";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _toArray from "@babel/runtime/helpers/toArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import React from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'query-string';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import Overlay from 'react-bootstrap/esm/Overlay';
import { patchedConsoleInstance as console } from './../../../util/patched-console';
import { getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters, buildSearchHref, contextFiltersToExpSetFilters, getTermFacetStatus } from './../../../util/search-filters';
import * as analytics from './../../../util/analytics';
import { responsiveGridState } from './../../../util/layout';

/**
 * Not too sure whether href in performFilteringQuery will
 * always be the redux-provided props.href esp. in case of
 * embedded search views. Since func is only executed onClick
 * and not as part of view render, is (more) OK to use url.parse
 * vs memoizedUrlParse IMO.
 */
// import { memoizedUrlParse } from './../../../util/misc';

import { TermsFacet } from './TermsFacet';
import { RangeFacet, getRangeValuesFromFiltersByField } from './RangeFacet';
import { mergeTerms, countActiveTermsByField } from './FacetTermsList';
import { FacetOfFacets } from './FacetOfFacets';
import FontAwesomeV6Icons from '../../../ui/FontAwesomeV6Icons';
import { IconToggle } from '../../../forms/components/Toggle';

/**
 * Component to render out the FacetList for the Browse and ExperimentSet views.
 * It can work with AJAX-ed in back-end data, as is used for the Browse page, or
 * with client-side data from back-end-provided Experiments, as is used for the ExperimentSet view.
 *
 * Some of this code is not super clean and eventually could use some refactoring.
 *
 * @module {Component} facetlist
 */

/**
 * Returns a new href based on current href, current filters, a facet, and term to toggle.
 * @todo Refactor maybe later. I dont remember what the sub-functions do too well. Could be made more clear.
 *
 * @param {string} currentHref - Current search URL.
 * @param {{ field: string, term: string, remove: string }[]} contextFilters - List of currently-applied filters from context.
 * @param {{ field: string, aggregation_type: string }} facet - Facet definition for field for which a term was clicked on.
 * @param {{ key: string }} term - Term clicked on.
 */
export function generateNextHref(currentHref, contextFilters, facet, term) {
  var targetSearchHref = null;
  var field = facet.field,
    _facet$aggregation_ty = facet.aggregation_type,
    aggregation_type = _facet$aggregation_ty === void 0 ? "terms" : _facet$aggregation_ty;
  var _getStatusAndUnselect = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, contextFilters),
    termStatus = _getStatusAndUnselect.status,
    unselectHref = _getStatusAndUnselect.href;
  // If present in context.filters, means is selected OR omitted. We want to make sure is _neither_ of those here.
  // Omitted and selected filters are both treated the same (as "active" filters, even if are exclusionary).
  var willUnselect = !!unselectHref;
  if (willUnselect) {
    targetSearchHref = unselectHref;
  } else {
    if (aggregation_type === "stats" || aggregation_type === "range") {
      // Keep only 1, delete previous occurences
      // This is only for "range" facets (aggregation_type=stats) where want to ensure that have multiple "date_created.to" values in URL for example.
      var parts = url.parse(currentHref, true);
      delete parts.query[field];
      var queryStr = queryString.stringify(parts.query);
      parts.search = queryStr && queryStr.length > 0 ? '?' + queryStr : '';
      var correctedHref = url.format(parts);
      if (term.key === null) {
        targetSearchHref = correctedHref; // Keep current, stripped down v.
      } else {
        targetSearchHref = buildSearchHref(field, term, correctedHref);
      }
    } else {
      targetSearchHref = buildSearchHref(field, term, currentHref);
    }
  }

  // If we have a '#' in URL, add to target URL as well.
  var hashFragmentIdx = currentHref.indexOf('#');
  if (hashFragmentIdx > -1 && targetSearchHref.indexOf('#') === -1) {
    targetSearchHref += currentHref.slice(hashFragmentIdx);
  }

  // Ensure only 1 `type` filter is selected at once.
  // Unselect any other type= filters if setting new one.
  if (field === 'type' && !willUnselect) {
    var _parts = url.parse(targetSearchHref, true);
    if (Array.isArray(_parts.query.type)) {
      var types = _parts.query.type;
      if (types.length > 1) {
        var queryParts = _.clone(_parts.query);
        delete queryParts[""]; // Safety
        queryParts.type = encodeURIComponent(term.key); // Only 1 Item type selected at once.
        var searchString = queryString.stringify(queryParts);
        _parts.search = searchString && searchString.length > 0 ? '?' + searchString : '';
        targetSearchHref = url.format(_parts);
      }
    }
  }

  // Endpoint will redirect/correct to this anyway, may as well keep consistent.
  // Alternatively we could/should save href we get back from search response (which
  // should then also be correct... and probably be more reliable.. will try do..)
  return targetSearchHref.replaceAll("%20", "+");
}
export var FacetList = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FacetList, _React$PureComponent);
  var _super = _createSuper(FacetList);
  function FacetList(props) {
    var _this;
    _classCallCheck(this, FacetList);
    _this = _super.call(this, props);
    console.log("FacetList props,", props);
    _this.onFilterExtended = _this.onFilterExtended.bind(_assertThisInitialized(_this));
    _this.onFilterMultipleExtended = _this.onFilterMultipleExtended.bind(_assertThisInitialized(_this));
    _this.getTermStatus = _this.getTermStatus.bind(_assertThisInitialized(_this));
    _this.handleToggleFacetOpen = _this.handleToggleFacetOpen.bind(_assertThisInitialized(_this));
    _this.handleCollapseAllFacets = _this.handleCollapseAllFacets.bind(_assertThisInitialized(_this));
    _this.setOpenPopover = _this.setOpenPopover.bind(_assertThisInitialized(_this));
    _this.renderFacetComponents = _this.renderFacetComponents.bind(_assertThisInitialized(_this));
    _this.onToggleIncluding = _this.onToggleIncluding.bind(_assertThisInitialized(_this));
    _this.memoized = {
      countActiveTermsByField: memoize(countActiveTermsByField),
      getRangeValuesFromFiltersByField: memoize(getRangeValuesFromFiltersByField),
      sortedFinalFacetObjects: memoize(FacetList.sortedFinalFacetObjects),
      segmentOutCommonProperties: memoize(FacetList.segmentOutCommonProperties),
      createFacetComponents: memoize(FacetList.createFacetComponents, function (paramSetA, paramSetB) {
        var _paramSetA = _toArray(paramSetA),
          propsA = _paramSetA[0],
          argsA = _paramSetA.slice(1);
        var _paramSetB = _toArray(paramSetB),
          propsB = _paramSetB[0],
          argsB = _paramSetB.slice(1);
        var i;
        for (i = 0; i < argsA.length; i++) {
          if (argsA[i] !== argsB[i]) {
            return false;
          }
        }
        var keys = Object.keys(propsA);
        var keysLen = keys.length;
        for (i = 0; i < keysLen; i++) {
          if (propsA[keys[i]] !== propsB[keys[i]]) {
            return false;
          }
        }
        return true;
      }),
      extendComponentsWithFacetOpen: memoize(FacetList.extendComponentsWithFacetOpen),
      getInitialOpenFacetsAfterMount: memoize(FacetList.getInitialOpenFacetsAfterMount)
    };
    _this.state = {
      including: true,
      // if false, show "not facets" or exclude facets
      openFacets: {},
      // will be keyed by facet.field, value will be bool
      openPopover: null,
      // will contain `{ ref: React Ref, popover: JSX element/component }`. We might want to move this functionality up into like App.js.
      filteringFieldTerm: null // will contain `{ field: string, term: string|[from, to] }`. Used to show loading indicators on clicked-on terms.
    };
    return _this;
  }
  _createClass(FacetList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
        windowHeight = _this$props.windowHeight,
        windowWidth = _this$props.windowWidth,
        facets = _this$props.facets,
        _this$props$persisten = _this$props.persistentCount,
        persistentCount = _this$props$persisten === void 0 ? 10 : _this$props$persisten,
        _this$props$persistSe = _this$props.persistSelectedTerms,
        persistSelectedTerms = _this$props$persistSe === void 0 ? true : _this$props$persistSe,
        _this$props$context = _this$props.context,
        _this$props$context2 = _this$props$context === void 0 ? {} : _this$props$context,
        filters = _this$props$context2.filters;
      var rgs = responsiveGridState(windowWidth || null);
      var _this$renderFacetComp = this.renderFacetComponents(),
        selectableFacetElements = _this$renderFacetComp.selectableFacetElements; // Internally memoized - should be performant.

      if (rgs === "xs") {
        ReactTooltip.rebuild();
        return;
      }

      //default open facets for selected terms are not persistent case
      if (persistSelectedTerms === false && filters && filters.length > 0) {
        var openFacets = filters.reduce(function (m, v) {
          if (v && v.field) {
            m[v.field] = true;
          }
          return m;
        }, {});
        this.setState({
          openFacets: openFacets
        });
        return;
      }

      // Skip if we have many facets. We're simply reusing persistentCount variable here
      // but could really be any number/value (8 ? windowHeight // 100 ?)
      if (selectableFacetElements.length >= persistentCount) {
        ReactTooltip.rebuild();
        return;
      }
      this.setState({
        openFacets: this.memoized.getInitialOpenFacetsAfterMount(selectableFacetElements, persistentCount, windowHeight)
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var prevContext = prevProps.context;
      var prevOpenFacets = prevState.openFacets,
        prevOpenPopover = prevState.openPopover;
      var _this$state = this.state,
        openFacets = _this$state.openFacets,
        openPopover = _this$state.openPopover;
      var _this$props2 = this.props,
        context = _this$props2.context,
        addToBodyClassList = _this$props2.addToBodyClassList,
        removeFromBodyClassList = _this$props2.removeFromBodyClassList;
      if (openFacets !== prevOpenFacets) {
        ReactTooltip.rebuild();
      }
      if (openPopover !== prevOpenPopover && typeof addToBodyClassList === "function" && typeof removeFromBodyClassList === "function") {
        if (!openPopover) {
          removeFromBodyClassList("overflow-hidden");
        } else if (openPopover && !prevOpenPopover) {
          addToBodyClassList("overflow-hidden");
        }
      }
      if (context !== prevContext) {
        var stateChange = {};

        // If new filterset causes a facet to drop into common properties section, clean up openFacets state accordingly.
        var _this$renderFacetComp2 = this.renderFacetComponents(),
          staticFacetElements = _this$renderFacetComp2.staticFacetElements; // Should be performant re: memoization
        var nextOpenFacets = _.clone(openFacets);
        var changedOpenFacets = false;
        staticFacetElements.forEach(function (facetComponent) {
          if (nextOpenFacets[facetComponent.props.facet.field]) {
            delete nextOpenFacets[facetComponent.props.facet.field];
            changedOpenFacets = true;
          }
        });
        if (changedOpenFacets) {
          stateChange.openFacets = nextOpenFacets;
        }

        // Newly loaded search response should clear any filteringFieldTerm state.
        stateChange.filteringFieldTerm = null;
        this.setState(stateChange);
      }
    }
  }, {
    key: "onToggleIncluding",
    value: function onToggleIncluding(e, callback) {
      var including = this.state.including;
      if (callback) {
        this.setState({
          including: !including
        }, callback);
      } else {
        this.setState({
          including: !including
        });
      }
    }

    /**
     * Calls props.onFilter after sending analytics.
     * N.B. When rangeFacet calls onFilter, it creates a `term` with `key` property
     * as no 'terms' exist when aggregation_type === stats.
     */
  }, {
    key: "onFilterExtended",
    value: function onFilterExtended(facet, term, callback) {
      var including = this.state.including;
      var _this$props3 = this.props,
        onFilter = _this$props3.onFilter,
        contextFilters = _this$props3.context.filters;
      var aggregation_type = facet.aggregation_type;
      if (!including
      // @TODO One day add support for range and stats (probably just stats) here and in onFilterMultipleExtended
      && aggregation_type != "range" && aggregation_type != "stats") {
        facet.field += "!";
      }
      FacetList.sendAnalyticsPreFilter(facet, term, contextFilters);

      // Used to show loading indicators on clicked-on terms.
      // (decorative, not core functionality, so not implemented for `onFilterMultipleExtended`)
      // `facet.facetFieldName` is passed in only from RangeFacet, as the real `field` would have a '.from' or '.to' appendage.
      this.setState({
        "filteringFieldTerm": {
          "field": facet.facetFieldName || facet.field,
          "term": term.key
        }
      }, function () {
        onFilter(facet, term, callback);
      });
    }
  }, {
    key: "onFilterMultipleExtended",
    value: function onFilterMultipleExtended(filterObjArray, callback) {
      var including = this.state.including;
      var _this$props4 = this.props,
        onFilterMultiple = _this$props4.onFilterMultiple,
        contextFilters = _this$props4.context.filters;

      // Detect if setting both values of range field and set state.filteringFieldTerm = { field: string, term:string|[from, to] }.
      var facetFieldNames = new Set();
      var uniqueVals = new Set();
      filterObjArray.forEach(function (filterObj) {
        var facet = filterObj.facet,
          term = filterObj.term;
        var aggregation_type = facet.aggregation_type;
        if (!including && aggregation_type != "range" && aggregation_type != "stats") {
          facet.field += "!";
        }
        facetFieldNames.add(facet.facetFieldName || null);
        uniqueVals.add(term.key);
        FacetList.sendAnalyticsPreFilter(facet, term, contextFilters);
      });
      if (facetFieldNames.size === 1) {
        // 2 values being set of same field
        // (this is only use-case currently for onFilterMultipleExtended, via RangeFacet, but could change in future)
        var _ref = _toConsumableArray(facetFieldNames),
          facetFieldName = _ref[0];
        if (facetFieldName !== null) {
          this.setState({
            "filteringFieldTerm": {
              "field": facetFieldName,
              "term": uniqueVals.size > 1 ? _toConsumableArray(uniqueVals).sort() : _toConsumableArray(uniqueVals)[0]
            }
          }, function () {
            onFilterMultiple(filterObjArray, callback);
          });
          return;
        }
      }
      onFilterMultiple(filterObjArray, callback);
    }
  }, {
    key: "getTermStatus",
    value: function getTermStatus(term, facet) {
      var contextFilters = this.props.context.filters;
      return getTermFacetStatus(term, facet, contextFilters);
    }
  }, {
    key: "handleToggleFacetOpen",
    value: function handleToggleFacetOpen(facetField) {
      var nextOpen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState(function (_ref2) {
        var prevOpenFacets = _ref2.openFacets;
        var openFacets = _.clone(prevOpenFacets);
        if (typeof nextOpen !== "boolean") {
          nextOpen = openFacets[facetField];
        }
        if (!nextOpen) {
          delete openFacets[facetField];
        } else {
          openFacets[facetField] = true;
        }
        return {
          openFacets: openFacets
        };
      });
    }
  }, {
    key: "setOpenPopover",
    value: function setOpenPopover() {
      var nextPopover = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState(function (_ref3) {
        var _ref3$openPopover = _ref3.openPopover,
          openPopover = _ref3$openPopover === void 0 ? null : _ref3$openPopover;
        if (!openPopover) {
          if (!nextPopover) return null;
          return {
            openPopover: nextPopover
          };
        } else {
          if (!nextPopover) {
            return {
              openPopover: null
            };
          }
          var prevRef = openPopover.ref,
            prevPopover = openPopover.popover;
          var ref = nextPopover.ref,
            popover = nextPopover.popover;
          if (ref === prevRef && popover === prevPopover) {
            return null;
          }
          return {
            openPopover: nextPopover
          };
        }
      }, cb);
    }
  }, {
    key: "handleCollapseAllFacets",
    value: function handleCollapseAllFacets() {
      this.setState({
        openFacets: {}
      });
    }

    /** We want an actual array(s) of JSX components to potentially shift, assess, transform etc. rather than Functional Component that renders list, for example. */
  }, {
    key: "renderFacetComponents",
    value: function renderFacetComponents() {
      var _this$props5 = this.props,
        _this$props5$facets = _this$props5.facets,
        facets = _this$props5$facets === void 0 ? null : _this$props5$facets,
        _this$props5$separate = _this$props5.separateSingleTermFacets,
        separateSingleTermFacets = _this$props5$separate === void 0 ? false : _this$props5$separate,
        context = _this$props5.context,
        href = _this$props5.href,
        schemas = _this$props5.schemas,
        itemTypeForSchemas = _this$props5.itemTypeForSchemas,
        termTransformFxn = _this$props5.termTransformFxn,
        persistentCount = _this$props5.persistentCount,
        useRadioIcon = _this$props5.useRadioIcon,
        persistSelectedTerms = _this$props5.persistSelectedTerms;
      var filters = context.filters;
      var _this$state2 = this.state,
        openFacets = _this$state2.openFacets,
        openPopover = _this$state2.openPopover,
        filteringFieldTerm = _this$state2.filteringFieldTerm,
        including = _this$state2.including;
      var facetComponentProps = {
        href: href,
        schemas: schemas,
        context: context,
        itemTypeForSchemas: itemTypeForSchemas,
        termTransformFxn: termTransformFxn,
        persistentCount: persistentCount,
        separateSingleTermFacets: separateSingleTermFacets,
        openPopover: openPopover,
        including: including,
        filteringFieldTerm: filteringFieldTerm,
        useRadioIcon: useRadioIcon,
        persistSelectedTerms: persistSelectedTerms,
        onFilter: this.onFilterExtended,
        onFilterMultiple: this.onFilterMultipleExtended,
        getTermStatus: this.getTermStatus,
        onToggleOpen: this.handleToggleFacetOpen,
        setOpenPopover: this.setOpenPopover
      };
      var _this$memoized$segmen = this.memoized.segmentOutCommonProperties(this.memoized.createFacetComponents(facetComponentProps, this.memoized.sortedFinalFacetObjects(facets, filters), this.memoized.countActiveTermsByField(filters), this.memoized.getRangeValuesFromFiltersByField(facets, filters)), separateSingleTermFacets),
        staticFacetElements = _this$memoized$segmen.staticFacetElements,
        rawerSelectableFacetElems = _this$memoized$segmen.selectableFacetElements;

      // We can skip extending static facet elements with facetOpen
      var selectableFacetElements = this.memoized.extendComponentsWithFacetOpen(rawerSelectableFacetElems, openFacets);
      return {
        selectableFacetElements: selectableFacetElements,
        staticFacetElements: staticFacetElements
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
        _this$props6$facets = _this$props6.facets,
        facets = _this$props6$facets === void 0 ? null : _this$props6$facets,
        title = _this$props6.title,
        _this$props6$onClearF = _this$props6.onClearFilters,
        onClearFilters = _this$props6$onClearF === void 0 ? null : _this$props6$onClearF,
        _this$props6$showClea = _this$props6.showClearFiltersButton,
        showClearFiltersButton = _this$props6$showClea === void 0 ? false : _this$props6$showClea,
        _this$props6$maxBodyH = _this$props6.maxBodyHeight,
        maxHeight = _this$props6$maxBodyH === void 0 ? null : _this$props6$maxBodyH,
        _this$props6$isContex = _this$props6.isContextLoading,
        isContextLoading = _this$props6$isContex === void 0 ? false : _this$props6$isContex;
      var _this$state3 = this.state,
        openFacets = _this$state3.openFacets,
        openPopover = _this$state3.openPopover,
        including = _this$state3.including;
      var _ref4 = openPopover || {},
        popoverJSX = _ref4.popover,
        popoverTargetRef = _ref4.ref;
      if (!facets || !Array.isArray(facets) || facets.length === 0) {
        return /*#__PURE__*/React.createElement("div", {
          className: "pt-2 pb-2",
          style: {
            color: "#aaa"
          }
        }, "No facets available");
      }
      var bodyProps = {
        className: "facets-body" + (typeof maxHeight === "number" ? " has-max-height" : ""),
        style: typeof maxHeight === "number" ? {
          maxHeight: maxHeight
        } : null
      };
      var _this$renderFacetComp3 = this.renderFacetComponents(),
        staticFacetElements = _this$renderFacetComp3.staticFacetElements,
        selectableFacetElements = _this$renderFacetComp3.selectableFacetElements;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "facets-container facets with-header-bg",
        "data-context-loading": isContextLoading
      }, /*#__PURE__*/React.createElement(FacetListHeader, {
        openFacets: openFacets,
        title: title,
        onClearFilters: onClearFilters,
        showClearFiltersButton: showClearFiltersButton,
        including: including,
        onToggleIncluding: this.onToggleIncluding,
        onCollapseFacets: this.handleCollapseAllFacets
      }), /*#__PURE__*/React.createElement("div", bodyProps, selectableFacetElements, staticFacetElements.length > 0 ? /*#__PURE__*/React.createElement("div", {
        className: "row facet-list-separator"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col-12"
      }, staticFacetElements.length, " Common Properties")) : null, staticFacetElements)), popoverJSX && popoverTargetRef ?
      /*#__PURE__*/
      /* `rootClose rootCloseEvent="click"` didn't work as props here */
      React.createElement(Overlay, {
        show: true,
        target: popoverTargetRef,
        flip: true,
        placement: "auto",
        rootClose: true,
        rootCloseDisabled: false
      }, popoverJSX) : null);
    }
  }], [{
    key: "sortedFinalFacetObjects",
    value: /** Remove any duplicates, merge in filters without selections as terms */
    function sortedFinalFacetObjects(facets, filters) {
      return _.sortBy(_.map(_.uniq(facets, false, function (f) {
        return f.field;
      }),
      // Ensure facets are unique, field-wise.
      function (f) {
        var newFacet = _objectSpread(_objectSpread({}, f), {}, {
          order: f.order || 0
        });
        if (f.aggregation_type === "terms") {
          // Add in any terms specified in `filters` but not in `facet.terms` - in case someone hand-put that into URL or something.
          newFacet.terms = mergeTerms(f, filters);
        }
        return newFacet;
      }), 'order');
    }
  }, {
    key: "getInitialOpenFacetsAfterMount",
    value: function getInitialOpenFacetsAfterMount(facetComponents, persistentCount, windowHeight) {
      var filteredFlattenedComponents = facetComponents.reduce(function (m, v) {
        if (v.props.facet) {
          // Actual facet, include.
          m.push(v);
        } else {
          // A group; flatten its children upward
          m = m.concat(v.props.children);
        }
        return m;
      }, []);
      var facetLen = filteredFlattenedComponents.length;

      // We try to initially open some Facets depending on available screen size or props.
      // We might get rid of this feature at some point as the amount of Facets are likely to increase.
      // Or we could just set defaultFacetOpen = false if # facets > 10 or something.
      // Basically seems like should adjust `maxTermsToShow` based on total # of facets...
      var maxTermsToShow = (typeof windowHeight === 'number' && !isNaN(windowHeight) ? Math.floor(windowHeight / 60) : 15) - Math.floor(facetLen / 4);
      var facetIndexWherePastXTerms;
      var currTermCount = 0;
      for (facetIndexWherePastXTerms = 0; facetIndexWherePastXTerms < facetLen; facetIndexWherePastXTerms++) {
        if (filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.aggregation_type === "stats") {
          // Range facet with stats aggregation Facet (shows 2 'terms' or fields)
          currTermCount += 2;
        } else if (filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.aggregation_type === "range") {
          // Range facet with range list (see comment for Terms in else)
          currTermCount += Math.min(filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.ranges.length, persistentCount);
        } else {
          // Terms; Take into account 'view more' button
          // Slightly deprecated as doesn;t take into account 'mergeTerms'.
          // Maybe could move mergeTerms stuff up into here.
          currTermCount += Math.min(filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.terms.length, persistentCount);
        }
        if (currTermCount > maxTermsToShow) {
          break;
        }
      }
      var openFacets = {};
      for (var i = 0; i < facetIndexWherePastXTerms; i++) {
        openFacets[filteredFlattenedComponents[i].props.facet.field] = true;
        if (filteredFlattenedComponents[i].props.facet.grouping) {
          // Set group to be open as well
          openFacets["group:" + filteredFlattenedComponents[i].props.facet.grouping] = true;
        }
      }
      return openFacets;
    }

    /**
     * We use a function instead of functional/memoized components because we want literal list of JSX components.
     * First param (props) is memoized by its keys' values.
     * These JSX components might later be segmented or something.
     *
     * @param {{ href: string, schemas: Object<string, Object>, itemTypeForSchemas: string, termTransformFxn: function, onFilter: function, getTermStatus: function }} props - Passed to all facet components.
     */
  }, {
    key: "createFacetComponents",
    value: function createFacetComponents(props, useFacets, activeTermCountByField, rangeValuesByField) {
      var including = props.including;

      // The logic within `Facet` `render`, `componentDidMount`, etc. isn't executed
      // until is rendered by some other component's render method.
      // We can sort/manipulate/transform these still according to their `props.` values and such.
      var renderedFacets = useFacets.map(function (facet) {
        var _facet$grouping = facet.grouping,
          grouping = _facet$grouping === void 0 ? null : _facet$grouping,
          facetField = facet.field,
          _facet$aggregation_ty2 = facet.aggregation_type,
          aggregation_type = _facet$aggregation_ty2 === void 0 ? "terms" : _facet$aggregation_ty2;
        if (aggregation_type === "stats" || aggregation_type === "range") {
          var _ref5 = rangeValuesByField[facetField] || {},
            _ref5$fromVal = _ref5.fromVal,
            fromVal = _ref5$fromVal === void 0 ? null : _ref5$fromVal,
            _ref5$toVal = _ref5.toVal,
            toVal = _ref5$toVal === void 0 ? null : _ref5$toVal;
          var isStatic = facet.min === facet.max;
          // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
          // This approach used for resetting state.fromVal and state.toVal within RangeFacet.
          return /*#__PURE__*/React.createElement(RangeFacet, _extends({}, props, {
            isStatic: isStatic,
            grouping: grouping,
            fromVal: fromVal,
            toVal: toVal,
            facet: facet,
            including: including,
            key: facetField,
            anyTermsSelected: fromVal !== null || toVal !== null
          }));
        }
        if (aggregation_type === "terms") {
          // Account for omitted fields; ensure a facet with the cleaned field is passed in
          var cleanFacet = _objectSpread({}, facet);
          var lastCharIdx = facetField.length - 1;
          var cleanField = facetField.charAt(lastCharIdx) === "!" ? facetField.slice(0, lastCharIdx) : facetField;
          cleanFacet.field = cleanField;
          var termsSelectedCount = activeTermCountByField[cleanField] || 0; // countTermsSelected(facet.terms, facet, filters);
          var _anySelected = termsSelectedCount !== 0;
          var _isStatic = !_anySelected && facet.terms.length === 1;
          return /*#__PURE__*/React.createElement(TermsFacet, _extends({}, props, {
            facet: cleanFacet,
            isStatic: _isStatic,
            grouping: grouping,
            termsSelectedCount: termsSelectedCount,
            including: including,
            key: facetField,
            anyTermsSelected: _anySelected
          }));
        }
        throw new Error("Unknown aggregation_type");
      });
      var componentsToReturn = []; // first populated with ungrouped facets, then facet groups are spliced in
      var groups = new Map(); // { groupTitle: { index: 0, facets: [facet1, facet2, facet3, ...] } }; Map() to preserve order.

      // Separate out facets with .grouping into groups.
      renderedFacets.forEach(function (renderedFacet) {
        var grouping = renderedFacet.props.grouping;
        if (!grouping) {
          // add ungrouped facets straight to componentsToReturn
          componentsToReturn.push(renderedFacet);
          return;
        }

        // Get existing or create new.
        var existingGroup = groups.get(grouping) || {
          index: componentsToReturn.length,
          children: [],
          facetOpen: false
        };
        existingGroup.children.push(renderedFacet);
        groups.set(grouping, existingGroup);
      });
      var groupsArr = _toConsumableArray(groups);

      // Check, render, and add groups into `componentsToReturn`
      groupsArr.forEach(function (_ref6, groupIndex) {
        var _ref7 = _slicedToArray(_ref6, 2),
          groupTitle = _ref7[0],
          facetGroup = _ref7[1];
        var facetsInGroup = facetGroup.children,
          index = facetGroup.index;
        if (facetsInGroup.length === 1) {
          // Doesn't need to be in group, put back into `componentsToReturn`
          componentsToReturn.splice(index, 0, facetsInGroup[0]);
        } else {
          componentsToReturn.splice(index, 0,
          /*#__PURE__*/
          // `facetGroup` contains `defaultGroupOpen`, `index`, `facets`.
          React.createElement(FacetOfFacets, _extends({}, props, facetGroup, {
            title: groupTitle,
            key: groupTitle
          })));
        }
        // Increment remaining group indices to match new length of `componentsToReturn`.
        // We're not modifying the actual `groupsArr` list itself ever (e.g. removing/adding)
        // so `fromIdx` / `groupIndex` should always stay stable.
        // We increment facetGroup.index which is the index in `componentsToReturn`.
        groupsArr.slice(groupIndex).forEach(function (_ref8) {
          var _ref9 = _slicedToArray(_ref8, 2),
            subsequentFacetGroup = _ref9[1];
          subsequentFacetGroup.index++;
        });
      });
      return componentsToReturn;
    }
  }, {
    key: "segmentOutCommonProperties",
    value: function segmentOutCommonProperties(facetComponents, separateSingleTermFacets) {
      var staticFacetElements = [];
      var selectableFacetElements = [];
      if (separateSingleTermFacets) {
        facetComponents.forEach(function (renderedFacet) {
          if (renderedFacet.props.isStatic) {
            staticFacetElements.push(renderedFacet);
          } else {
            selectableFacetElements.push(renderedFacet);
          }
        });
      } else {
        selectableFacetElements = facetComponents;
      }
      return {
        selectableFacetElements: selectableFacetElements,
        staticFacetElements: staticFacetElements
      };
    }
  }, {
    key: "extendComponentsWithFacetOpen",
    value: function extendComponentsWithFacetOpen(facetComponents, openFacets) {
      return facetComponents.map(function (facetElem) {
        // Finally, add in `facetOpen` state.
        // Avoid doing this in `createFacetComponents` since is memoized and does other more expensive ops.
        var _facetElem$props = facetElem.props,
          _facetElem$props$face = _facetElem$props.facet,
          _facetElem$props$face2 = _facetElem$props$face === void 0 ? {} : _facetElem$props$face,
          _facetElem$props$face3 = _facetElem$props$face2.field,
          field = _facetElem$props$face3 === void 0 ? null : _facetElem$props$face3,
          _facetElem$props$titl = _facetElem$props.title,
          groupTitle = _facetElem$props$titl === void 0 ? null : _facetElem$props$titl;
        var facetOpen = false;
        if (typeof field === "string") {
          // Facet Elem
          facetOpen = openFacets[field];
          if (facetOpen) {
            // Don't clone if don't need to; don't pass openFacets to avoid extraneous re-renders.
            return /*#__PURE__*/React.cloneElement(facetElem, {
              facetOpen: facetOpen
            });
          }
          return facetElem;
        } else if (typeof groupTitle === "string") {
          // Group Elem; pass in openFacets always as well to add facetOpen to group children
          facetOpen = openFacets["group:" + groupTitle];
          return /*#__PURE__*/React.cloneElement(facetElem, {
            facetOpen: facetOpen,
            openFacets: openFacets
          });
        } else {
          throw new Error("Unexpected Facet Component");
        }
      });
    }

    /**
     * Used by this.onFilterExtended and this.onFilterMultipleExtended to send google analytics on a selected facet before filtering
     */
  }, {
    key: "sendAnalyticsPreFilter",
    value: function sendAnalyticsPreFilter(facet, term, contextFilters) {
      var field = facet.field;
      var termKey = term.key;
      var statusAndHref = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, contextFilters);
      var isUnselecting = !!statusAndHref.href;
      return analytics.event('FacetList', isUnselecting ? 'Unset Filter' : 'Set Filter', {
        field: field,
        'term': termKey,
        'event_label': analytics.eventLabelFromChartNode({
          field: field,
          'term': termKey
        }),
        'current_filters': analytics.getStringifiedCurrentFilters(contextFiltersToExpSetFilters(contextFilters || null)) // 'Existing' filters, or filters at time of action, go here.
      });
    }
  }]);
  return FacetList;
}(React.PureComponent);
_defineProperty(FacetList, "propTypes", {
  'facets': PropTypes.arrayOf(PropTypes.shape({
    'field': PropTypes.string,
    // Nested field in experiment(_set), using dot-notation.
    'terms': PropTypes.arrayOf(PropTypes.shape({
      'doc_count': PropTypes.number,
      // Exp(set)s matching term
      'key': PropTypes.string // Unique key/title of term.
    })),

    'title': PropTypes.string,
    // Title of facet
    'total': PropTypes.number // # of experiment(_set)s
  })),

  'context': PropTypes.shape({
    'filters': PropTypes.arrayOf(PropTypes.object).isRequired // context.filters
  }).isRequired,
  'itemTypeForSchemas': PropTypes.string.isRequired,
  // For tooltips
  'showClearFiltersButton': PropTypes.bool.isRequired,
  'onClearFilters': PropTypes.func.isRequired,
  /**
   * In lieu of facets, which are only generated by search.py, can
   * use and format schemas, which are available to experiment-set-view.js through item.js.
   */
  'schemas': PropTypes.object,
  // { '<schemaKey : string > (active facet categories)' : Set (active filters within category) }
  'title': PropTypes.string,
  // Title to put atop FacetList
  'className': PropTypes.string,
  // Extra class
  'href': PropTypes.string,
  'onFilter': PropTypes.func,
  // What happens when Term is clicked.
  'onFilterMultiple': PropTypes.func,
  // Same as onFilter, but processes multiple filter changes in one go
  'separateSingleTermFacets': PropTypes.bool,
  'maxBodyHeight': PropTypes.number,
  'useRadioIcon': PropTypes.bool.isRequired,
  // Show either checkbox (False) or radio icon (True) for term component - it is only for styling, not intended to implement single selection (radio) or multiple selection (checkbox)
  'persistSelectedTerms': PropTypes.bool.isRequired // if True selected/omitted terms are escalated to top, otherwise each term is rendered in regular order. Moreover, inline search options are not displayed if it is False.
});
_defineProperty(FacetList, "defaultProps", {
  /**
   * These 'default' functions don't do anything except show parameters passed.
   * Callback must be called because it changes Term's 'loading' state back to false.
   */
  'onFilter': function onFilter(facet, term, callback) {
    // Set redux filter accordingly, or update search query/href.
    console.log('FacetList: props.onFilter(' + facet.field + ', ' + term.key + ', callback)');
    console.log(facet, term);
    if (typeof callback === 'function') {
      setTimeout(callback, 1000);
    }
  },
  'onFilterMultiple': function onFilterMultiple(filterObjArr) {
    console.log('FacetList: props.onFilterMultiple(');
    filterObjArr.forEach(function (filterObj, i) {
      var facet = filterObj.facet,
        term = filterObj.term,
        callback = filterObj.callback;
      console.log('Item #' + i + ": (" + facet.field, ", " + term.key + ', callback)');
      console.log(facet, term);
      if (i === 0 && typeof callback === 'function') {
        setTimeout(callback, 1000);
      }
    });
    console.log(")");
  },
  'onClearFilters': function onClearFilters(e, callback) {
    // Clear Redux filters, or go base search url.
    e.preventDefault();
    console.log('FacetList: props.onClearFilters(e, callback)');
    if (typeof callback === 'function') {
      setTimeout(callback, 1000);
    }
  },
  'getTermStatus': function getTermStatus() {
    // Check against responseContext.filters, or expSetFilters in Redux store.
    return {
      'status': 'none',
      'href': null
    };
  },
  // 'itemTypeForSchemas': 'ExperimentSetReplicate', - let PropType check catch lack of presence of this
  'termTransformFxn': function termTransformFxn(field, term) {
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    return term;
  },
  'useRadioIcon': false,
  'persistSelectedTerms': true
});
export var FacetListHeader = /*#__PURE__*/React.memo(function (props) {
  var _props$including = props.including,
    including = _props$including === void 0 ? true : _props$including,
    onToggleIncluding = props.onToggleIncluding,
    _props$compound = props.compound,
    compound = _props$compound === void 0 ? false : _props$compound,
    _props$title = props.title,
    title = _props$title === void 0 ? "Properties" : _props$title,
    _props$openFacets = props.openFacets,
    openFacets = _props$openFacets === void 0 ? {} : _props$openFacets,
    _props$showClearFilte = props.showClearFiltersButton,
    showClearFiltersButton = _props$showClearFilte === void 0 ? false : _props$showClearFilte,
    _props$onClearFilters = props.onClearFilters,
    onClearFilters = _props$onClearFilters === void 0 ? null : _props$onClearFilters,
    onCollapseFacets = props.onCollapseFacets;
  var anyFacetsOpen = Object.keys(openFacets).length !== 0;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row facets-header",
    "data-excluding": !including
  }, /*#__PURE__*/React.createElement("div", {
    className: "col facets-title-column text-truncate"
  }, !compound && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconToggle, {
    activeIdx: including ? 0 : 1,
    options: [{
      title: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FontAwesomeV6Icons, {
        cls: "mb-02 pb-02",
        filename: "filter-solid.svg"
      })),
      onClick: onToggleIncluding
    }, {
      title: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FontAwesomeV6Icons, {
        cls: "mb-02",
        filename: "filter-circle-xmark-solid.svg"
      })),
      onClick: onToggleIncluding
    }]
  }), /*#__PURE__*/React.createElement("h4", {
    className: "facets-title"
  }, "".concat(including ? "Included" : "Excluded", " ").concat(title))), compound && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-filter fas"
  }), "\xA0", /*#__PURE__*/React.createElement("h4", {
    className: "facets-title"
  }, title)))), !compound && /*#__PURE__*/React.createElement("div", {
    className: "row facets-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "properties-controls d-flex py-1 w-100",
    role: "group",
    "aria-label": "Properties Controls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: !anyFacetsOpen,
    style: {
      flex: "1"
    },
    className: "btn btn-xs btn-outline-secondary",
    onClick: onCollapseFacets,
    "data-tip": "Collapse all facets below"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-minus fas"
  }), " Collapse All"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: typeof onClearFilters !== "function",
    style: {
      flex: "1"
    },
    className: "btn btn-xs btn-outline-secondary",
    onClick: onClearFilters,
    "data-tip": "Clear all filters"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-times fas"
  }), " Clear All")))));
});