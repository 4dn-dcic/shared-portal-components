'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performFilteringQuery = performFilteringQuery;
exports.FacetList = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _queryString = _interopRequireDefault(require("query-string"));

var _underscore = _interopRequireDefault(require("underscore"));

var _patchedConsole = require("./../../../util/patched-console");

var _searchFilters = require("./../../../util/search-filters");

var _navigate = require("./../../../util/navigate");

var analytics = _interopRequireWildcard(require("./../../../util/analytics"));

var _layout = require("./../../../util/layout");

var _TermsFacet = require("./TermsFacet");

var _RangeFacet = require("./RangeFacet");

var _FacetTermsList = require("./FacetTermsList");

var _FacetOfFacets = require("./FacetOfFacets");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
 * Use this function as part of SearchView and BrowseView to be passed down to FacetList.
 * Should be bound to a component instance, with `this` providing 'href', 'context' (with 'filters' property), and 'navigate'.
 *
 * @todo deprecate somehow. Mixins havent been part of React standards for a while now...
 * @todo Keep in mind is only for TERMS filters. Would not work for date histograms..
 *
 * @param {string} field - Field for which a Facet term was clicked on.
 * @param {string} term - Term clicked on.
 * @param {function} callback - Any function to execute afterwards.
 * @param {boolean} [skipNavigation=false] - If true, will return next targetSearchHref instead of going to it. Use to e.g. batch up filter changes on multiple fields.
 */
function performFilteringQuery(props, facet, term, callback) {
  var skipNavigation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var currentHref = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var propHref = props.href,
      propNavigate = props.navigate,
      context = props.context;
  var targetSearchHref;
  currentHref = currentHref || propHref;
  var statusAndHref = (0, _searchFilters.getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters)(term, facet, context.filters);
  var isUnselecting = !!statusAndHref.href;

  if (statusAndHref.href) {
    targetSearchHref = statusAndHref.href;
  } else {
    if (facet.aggregation_type === "stats") {
      // Keep only 1, delete previous occurences
      var parts = _url["default"].parse(currentHref, true);

      delete parts.query[facet.field];

      var queryStr = _queryString["default"].stringify(parts.query);

      parts.search = queryStr && queryStr.length > 0 ? '?' + queryStr : '';
      currentHref = _url["default"].format(parts);

      if (term.key === null) {
        targetSearchHref = currentHref; // Keep current, stripped down v.
      } else {
        targetSearchHref = (0, _searchFilters.buildSearchHref)(facet.field, term.key, currentHref);
      }
    } else {
      targetSearchHref = (0, _searchFilters.buildSearchHref)(facet.field, term.key, currentHref);
    }
  } // Ensure only 1 type filter is selected at once.
  // Unselect any other type= filters if setting new one.


  if (facet.field === 'type') {
    if (!statusAndHref.href) {
      var _parts = _url["default"].parse(targetSearchHref, true);

      if (Array.isArray(_parts.query.type)) {
        var types = _parts.query.type;

        if (types.length > 1) {
          var queryParts = _underscore["default"].clone(_parts.query);

          delete queryParts[""]; // Safety

          queryParts.type = encodeURIComponent(term.key); // Only 1 Item type selected at once.

          var searchString = _queryString["default"].stringify(queryParts);

          _parts.search = searchString && searchString.length > 0 ? '?' + searchString : '';
          targetSearchHref = _url["default"].format(_parts);
        }
      }
    }
  } // If we have a '#' in URL, add to target URL as well.


  var hashFragmentIdx = currentHref.indexOf('#');

  if (hashFragmentIdx > -1 && targetSearchHref.indexOf('#') === -1) {
    targetSearchHref += currentHref.slice(hashFragmentIdx);
  }

  analytics.event('FacetList', isUnselecting ? 'Unset Filter' : 'Set Filter', {
    'field': facet.field,
    'term': term.key,
    'eventLabel': analytics.eventLabelFromChartNode({
      'field': facet.field,
      'term': term.key
    }),
    'currentFilters': analytics.getStringifiedCurrentFilters((0, _searchFilters.contextFiltersToExpSetFilters)(context.filters || null)) // 'Existing' filters, or filters at time of action, go here.

  });

  if (!skipNavigation) {
    (propNavigate || _navigate.navigate)(targetSearchHref, {
      'dontScrollToTop': true
    }, callback);
  } else {
    return targetSearchHref;
  }
}

var FacetList =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(FacetList, _React$PureComponent);

  function FacetList(props) {
    var _this;

    _classCallCheck(this, FacetList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FacetList).call(this, props));
    _this.renderFacets = _this.renderFacets.bind(_assertThisInitialized(_this));
    _this.state = {
      'mounted': false
    };
    return _this;
  }

  _createClass(FacetList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        'mounted': true
      });
    }
  }, {
    key: "renderFacets",
    value: function renderFacets() {
      var _this$props = this.props,
          facets = _this$props.facets,
          href = _this$props.href,
          onFilter = _this$props.onFilter,
          schemas = _this$props.schemas,
          getTermStatus = _this$props.getTermStatus,
          filters = _this$props.filters,
          itemTypeForSchemas = _this$props.itemTypeForSchemas,
          windowWidth = _this$props.windowWidth,
          persistentCount = _this$props.persistentCount,
          termTransformFxn = _this$props.termTransformFxn,
          separateSingleTermFacets = _this$props.separateSingleTermFacets,
          windowHeight = _this$props.windowHeight;
      var mounted = this.state.mounted; // Ensure each facets has an `order` property and default it to 0 if not.
      // And then sort by `order`.

      var useFacets = _underscore["default"].sortBy(_underscore["default"].map(_underscore["default"].uniq(facets, false, function (f) {
        return f.field;
      }), // Ensure facets are unique, field-wise.
      function (f) {
        if (typeof f.order !== 'number') {
          return _underscore["default"].extend({
            'order': 0
          }, f);
        }

        return f;
      }), 'order');

      var commonProps = {
        // Passed to all Facets
        onFilter: onFilter,
        href: href,
        getTermStatus: getTermStatus,
        filters: filters,
        schemas: schemas,
        itemTypeForSchemas: itemTypeForSchemas,
        mounted: mounted,
        termTransformFxn: termTransformFxn,
        separateSingleTermFacets: separateSingleTermFacets
      }; // We try to initially open some Facets depending on available screen size or props.
      // We might get rid of this feature at some point as the amount of Facets are likely to increase.
      // Or we could just set defaultFacetOpen = false if # facets > 10 or something.
      // Basically seems like should adjust `maxTermsToShow` based on total # of facets...

      var maxTermsToShow = (typeof windowHeight === 'number' && !isNaN(windowHeight) ? Math.floor(windowHeight / 60) : 15) - Math.floor(useFacets.length / 4);
      var facetIndexWherePastXTerms = useFacets.reduce(function (m, facet, index) {
        if (m.end) return m;
        m.facetIndex = index;

        if (facet.aggregation_type === "stats") {
          m.termCount = m.termCount + 2;
        } else {
          m.termCount = m.termCount + Math.min( // Take into account 'view more' button
          facet.terms.length, persistentCount || _FacetTermsList.FacetTermsList.defaultProps.persistentCount);
        }

        if (m.termCount > maxTermsToShow) m.end = true;
        return m;
      }, {
        facetIndex: 0,
        termCount: 0,
        end: false
      }).facetIndex;
      var rgs = (0, _layout.responsiveGridState)(windowWidth || null); // The logic within `Facet` `render`, `componentDidMount`, etc. isn't executed
      // until is rendered by some other component's render method.
      // We can sort/manipulate/transform these still according to their `props.` values and such.

      var renderedFacets = useFacets.map(function (facet, i) {
        var _facet$grouping = facet.grouping,
            grouping = _facet$grouping === void 0 ? null : _facet$grouping,
            facetField = facet.field,
            _facet$aggregation_ty = facet.aggregation_type,
            aggregation_type = _facet$aggregation_ty === void 0 ? "terms" : _facet$aggregation_ty; // Default Open if mounted and:

        var defaultFacetOpen = !mounted ? false : !!(rgs !== 'xs' && i < (facetIndexWherePastXTerms || 1));

        if (aggregation_type === "stats") {
          var _getRangeValueFromFil = (0, _RangeFacet.getValueFromFilters)(facet, filters),
              fromVal = _getRangeValueFromFil.fromVal,
              toVal = _getRangeValueFromFil.toVal;

          var isStatic = facet.min === facet.max;
          defaultFacetOpen = defaultFacetOpen || !isStatic && _underscore["default"].any(filters || [], function (fltr) {
            return fltr.field === facetField + ".from" || fltr.field === facetField + ".to";
          }) || false;
          return _react["default"].createElement(_RangeFacet.RangeFacet, _extends({}, commonProps, {
            facet: facet,
            key: facetField,
            anyTermsSelected: fromVal !== null || toVal !== null
          }, {
            defaultFacetOpen: defaultFacetOpen,
            isStatic: isStatic,
            grouping: grouping,
            fromVal: fromVal,
            toVal: toVal
          }));
        }

        if (aggregation_type === "terms") {
          var terms = (0, _FacetTermsList.mergeTerms)(facet, filters); // Add in any terms specified in `filters` but not in `facet.terms` - in case someone hand-put that into URL.

          var _anySelected = (0, _FacetTermsList.anyTermsSelected)(terms, facet, filters);

          var _isStatic = _TermsFacet.TermsFacet.isStatic(facet);

          defaultFacetOpen = defaultFacetOpen || !_isStatic && _underscore["default"].any(filters || [], function (fltr) {
            return fltr.field === facetField;
          }) || false;
          return _react["default"].createElement(_TermsFacet.TermsFacet, _extends({}, commonProps, {
            facet: facet,
            key: facetField,
            anyTermsSelected: _anySelected
          }, {
            defaultFacetOpen: defaultFacetOpen,
            isStatic: _isStatic,
            grouping: grouping,
            terms: terms
          }));
        }

        throw new Error("Unknown aggregation_type");
      });
      var componentsToReturn = []; // first populated with ungrouped facets, then facet groups are spliced in

      var groups = new Map(); // { groupTitle: { index: 0, facets: [facet1, facet2, facet3, ...] } }; Map() to preserve order.
      // Separate out facets with .grouping into groups.

      renderedFacets.forEach(function (renderedFacet) {
        var _renderedFacet$props = renderedFacet.props,
            grouping = _renderedFacet$props.grouping,
            defaultFacetOpen = _renderedFacet$props.defaultFacetOpen;

        if (!grouping) {
          // add ungrouped facets straight to componentsToReturn
          componentsToReturn.push(renderedFacet);
          return;
        } // Get existing or create new.


        var existingGroup = groups.get(grouping) || {
          index: componentsToReturn.length,
          facets: [],
          defaultGroupOpen: false
        }; // If any facets are open by default, have group open by default also.

        if (defaultFacetOpen) {
          existingGroup.defaultGroupOpen = true;
        }

        existingGroup.facets.push(renderedFacet);
        groups.set(grouping, existingGroup);
      });

      var groupsArr = _toConsumableArray(groups); // Check, render, and add groups into `componentsToReturn`


      groupsArr.forEach(function (_ref, groupIndex) {
        var _ref2 = _slicedToArray(_ref, 2),
            groupTitle = _ref2[0],
            facetGroup = _ref2[1];

        var facetsInGroup = facetGroup.facets,
            index = facetGroup.index;

        if (facetsInGroup.length === 1) {
          // Doesn't need to be in group, put back into `componentsToReturn`
          componentsToReturn.splice(index, 0, facetsInGroup[0]); // Increment remaining group indices to match new length of `componentsToReturn`.
          // We're not modifying the actual `groupsArr` list itself ever (e.g. removing/adding)
          // so `fromIdx` / `groupIndex` should always stay stable.
          // We increment facetGroup.index which is the index in `componentsToReturn`.

          groupsArr.slice(groupIndex).forEach(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                subsequentFacetGroup = _ref4[1];

            subsequentFacetGroup.index++;
          });
          return;
        } // `facetGroup` contains `defaultGroupOpen`, `index`, `facets`.


        var renderedGroup = _react["default"].createElement(_FacetOfFacets.FacetOfFacets, _extends({}, commonProps, facetGroup, {
          title: groupTitle,
          key: groupTitle
        }));

        componentsToReturn.splice(index, 0, renderedGroup);
      });
      return componentsToReturn;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          debug = _this$props2.debug,
          facets = _this$props2.facets,
          className = _this$props2.className,
          title = _this$props2.title,
          showClearFiltersButton = _this$props2.showClearFiltersButton,
          onClearFilters = _this$props2.onClearFilters,
          separateSingleTermFacets = _this$props2.separateSingleTermFacets;
      if (debug) _patchedConsole.patchedConsoleInstance.log('render facetlist');

      if (!facets || !Array.isArray(facets) || facets.length === 0) {
        return _react["default"].createElement("div", {
          className: "pt-2 pb-2",
          style: {
            color: "#aaa"
          }
        }, "No facets available");
      }

      var clearButtonClassName = className && className.indexOf('with-header-bg') > -1 ? "btn-outline-white" : "btn-outline-default";
      var allFacetElements = this.renderFacets();
      var staticFacetElements = [];
      var selectableFacetElements = [];

      if (separateSingleTermFacets) {
        allFacetElements.forEach(function (renderedFacet) {
          if (renderedFacet.props.isStatic) {
            staticFacetElements.push(renderedFacet);
          } else {
            selectableFacetElements.push(renderedFacet);
          }
        });
      } else {
        selectableFacetElements = allFacetElements;
      }

      return _react["default"].createElement("div", {
        className: "facets-container facets" + (className ? ' ' + className : '')
      }, _react["default"].createElement("div", {
        className: "row facets-header"
      }, _react["default"].createElement("div", {
        className: "col facets-title-column text-ellipsis-container"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-filter fas"
      }), "\xA0", _react["default"].createElement("h4", {
        className: "facets-title"
      }, title)), _react["default"].createElement("div", {
        className: "col-auto clear-filters-control" + (showClearFiltersButton ? '' : ' placeholder')
      }, _react["default"].createElement("a", {
        href: "#",
        onClick: onClearFilters,
        className: "btn clear-filters-btn btn-xs " + clearButtonClassName
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-times fas mr-03"
      }), _react["default"].createElement("span", null, "Clear All")))), _react["default"].createElement("div", {
        className: "facets-body"
      }, selectableFacetElements, staticFacetElements.length > 0 ? _react["default"].createElement("div", {
        className: "row facet-list-separator"
      }, _react["default"].createElement("div", {
        className: "col-12"
      }, staticFacetElements.length, " Common Properties")) : null, staticFacetElements));
    }
  }]);

  return FacetList;
}(_react["default"].PureComponent);

exports.FacetList = FacetList;
FacetList.propTypes = {
  'facets': _propTypes["default"].arrayOf(_propTypes["default"].shape({
    'field': _propTypes["default"].string,
    // Nested field in experiment(_set), using dot-notation.
    'terms': _propTypes["default"].arrayOf(_propTypes["default"].shape({
      'doc_count': _propTypes["default"].number,
      // Exp(set)s matching term
      'key': _propTypes["default"].string // Unique key/title of term.

    })),
    'title': _propTypes["default"].string,
    // Title of facet
    'total': _propTypes["default"].number // # of experiment(_set)s

  })),

  /**
   * In lieu of facets, which are only generated by search.py, can
   * use and format schemas, which are available to experiment-set-view.js through item.js.
   */
  'schemas': _propTypes["default"].object,
  // { '<schemaKey : string > (active facet categories)' : Set (active filters within category) }
  'title': _propTypes["default"].string,
  // Title to put atop FacetList
  'className': _propTypes["default"].string,
  // Extra class
  'href': _propTypes["default"].string,
  'onFilter': _propTypes["default"].func,
  // What happens when Term is clicked.
  'separateSingleTermFacets': _propTypes["default"].bool.isRequired
};
FacetList.defaultProps = {
  'facets': null,
  'title': "Properties",
  'debug': false,
  'showClearFiltersButton': false,
  'separateSingleTermFacets': false,

  /**
   * These 'default' functions don't do anything except show parameters passed.
   * Callback must be called because it changes Term's 'loading' state back to false.
   */
  'onFilter': function onFilter(facet, term, callback) {
    // Set redux filter accordingly, or update search query/href.
    _patchedConsole.patchedConsoleInstance.log('FacetList: props.onFilter(' + facet.field + ', ' + term.key + ', callback)');

    _patchedConsole.patchedConsoleInstance.log(facet, term);

    if (typeof callback === 'function') {
      setTimeout(callback, 1000);
    }
  },
  'onClearFilters': function onClearFilters(e, callback) {
    // Clear Redux filters, or go base search url.
    e.preventDefault();

    _patchedConsole.patchedConsoleInstance.log('FacetList: props.onClearFilters(e, callback)');

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
  'itemTypeForSchemas': 'ExperimentSetReplicate',
  'termTransformFxn': function termTransformFxn(field, term) {
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    return term;
  }
};