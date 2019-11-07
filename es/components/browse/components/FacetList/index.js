'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performFilteringQuery = performFilteringQuery;
exports.anyTermsSelected = anyTermsSelected;
exports.mergeTerms = mergeTerms;
exports.FacetList = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _queryString = _interopRequireDefault(require("query-string"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _patchedConsole = require("./../../../util/patched-console");

var _searchFilters = require("./../../../util/search-filters");

var _navigate = require("./../../../util/navigate");

var analytics = _interopRequireWildcard(require("./../../../util/analytics"));

var _layout = require("./../../../util/layout");

var _RangeFacet = require("./RangeFacet");

var _FacetTermsList = require("./FacetTermsList");

var _StaticSingleTerm = require("./StaticSingleTerm");

var _FacetOfFacets = require("./FacetOfFacets");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
 * Used to render individual facet fields and their available terms in FacetList.
 *
 * @memberof module:facetlist
 * @class Facet
 * @type {Component}
 */
var Facet =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Facet, _React$PureComponent);

  _createClass(Facet, null, [{
    key: "isStatic",
    value: function isStatic(facet) {
      var _facet$terms = facet.terms,
          terms = _facet$terms === void 0 ? null : _facet$terms,
          _facet$total = facet.total,
          total = _facet$total === void 0 ? 0 : _facet$total,
          _facet$aggregation_ty = facet.aggregation_type,
          aggregation_type = _facet$aggregation_ty === void 0 ? "terms" : _facet$aggregation_ty,
          _facet$min = facet.min,
          min = _facet$min === void 0 ? null : _facet$min,
          _facet$max = facet.max,
          max = _facet$max === void 0 ? null : _facet$max;
      return aggregation_type === "terms" && Array.isArray(terms) && terms.length === 1 && total <= _underscore["default"].reduce(terms, function (m, t) {
        return m + (t.doc_count || 0);
      }, 0) || aggregation_type == "stats" && min === max;
    }
  }]);

  function Facet(props) {
    var _this;

    _classCallCheck(this, Facet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Facet).call(this, props));
    _this.handleStaticClick = _this.handleStaticClick.bind(_assertThisInitialized(_this));
    _this.handleTermClick = _this.handleTermClick.bind(_assertThisInitialized(_this));
    _this.state = {
      'filtering': false
    };
    return _this;
  }
  /**
   * For cases when there is only one option for a facet - we render a 'static' row.
   * This may change in response to design.
   * Unlike in `handleTermClick`, we handle own state/UI here.
   *
   * @todo Allow to specify interval for histogram & date_histogram in schema instead of hard-coding 'month' interval.
   */


  _createClass(Facet, [{
    key: "handleStaticClick",
    value: function handleStaticClick(e) {
      var _this2 = this;

      var _this$props = this.props,
          facet = _this$props.facet,
          isStatic = _this$props.isStatic;
      var term = facet.terms[0]; // Would only have 1

      e.preventDefault();
      if (!isStatic) return false;
      this.setState({
        'filtering': true
      }, function () {
        _this2.handleTermClick(facet, term, e, function () {
          return _this2.setState({
            'filtering': false
          });
        });
      });
    }
    /**
     * Each Term component instance provides their own callback, we just route the navigation request.
     *
     * @todo Allow to specify interval for histogram & date_histogram in schema instead of hard-coding 'month' interval.
     */

  }, {
    key: "handleTermClick",
    value: function handleTermClick(facet, term, e, callback) {
      var _this$props2 = this.props,
          onFilter = _this$props2.onFilter,
          href = _this$props2.href;
      onFilter(facet, term, callback, false, href);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          facet = _this$props3.facet,
          getTermStatus = _this$props3.getTermStatus,
          extraClassname = _this$props3.extraClassname,
          termTransformFxn = _this$props3.termTransformFxn,
          separateSingleTermFacets = _this$props3.separateSingleTermFacets,
          defaultFacetOpen = _this$props3.defaultFacetOpen,
          filters = _this$props3.filters,
          onFilter = _this$props3.onFilter,
          mounted = _this$props3.mounted,
          isStatic = _this$props3.isStatic,
          facetList = _this$props3.facetList;
      var filtering = this.state.filtering;

      var _ref = facet || {},
          _ref$description = _ref.description,
          description = _ref$description === void 0 ? null : _ref$description,
          field = _ref.field,
          title = _ref.title,
          _ref$terms = _ref.terms,
          terms = _ref$terms === void 0 ? [] : _ref$terms,
          _ref$aggregation_type = _ref.aggregation_type,
          aggregation_type = _ref$aggregation_type === void 0 ? "terms" : _ref$aggregation_type;

      var showTitle = title || field;

      if (Array.isArray(facetList)) {
        return _react["default"].createElement(_FacetOfFacets.FacetOfFacets, _extends({
          facets: facetList,
          title: field
        }, {
          filters: filters
        }));
      }

      if (aggregation_type === "stats") {
        return _react["default"].createElement(_RangeFacet.RangeFacet, _extends({
          facet: facet,
          filtering: filtering,
          defaultFacetOpen: defaultFacetOpen,
          termTransformFxn: termTransformFxn,
          filters: filters,
          onFilter: onFilter,
          mounted: mounted,
          isStatic: isStatic
        }, {
          tooltip: description,
          title: showTitle
        }));
      } // Default case for "terms" buckets/facets


      if (separateSingleTermFacets && isStatic) {
        // Only one term exists.
        return _react["default"].createElement(_StaticSingleTerm.StaticSingleTerm, {
          facet: facet,
          term: terms[0],
          filtering: filtering,
          showTitle: showTitle,
          onClick: this.handleStaticClick,
          getTermStatus: getTermStatus,
          extraClassname: extraClassname,
          termTransformFxn: termTransformFxn
        });
      } else {
        return _react["default"].createElement(_FacetTermsList.FacetTermsList, _extends({}, this.props, {
          onTermClick: this.handleTermClick,
          tooltip: description,
          title: showTitle
        }));
      }
    }
  }]);

  return Facet;
}(_react["default"].PureComponent);

Facet.propTypes = {
  'facet': _propTypes["default"].shape({
    'field': _propTypes["default"].string.isRequired,
    // Name of nested field property in experiment objects, using dot-notation.
    'title': _propTypes["default"].string,
    // Human-readable Facet Term
    'total': _propTypes["default"].number,
    // Total experiments (or terms??) w/ field
    'terms': _propTypes["default"].array.isRequired,
    // Possible terms,
    'description': _propTypes["default"].string,
    'aggregation_type': _propTypes["default"].oneOf(["stats", "terms"])
  }),
  'defaultFacetOpen': _propTypes["default"].bool,
  'onFilter': _propTypes["default"].func,
  // Executed on term click
  'extraClassname': _propTypes["default"].string,
  'schemas': _propTypes["default"].object,
  'getTermStatus': _propTypes["default"].func.isRequired,
  'href': _propTypes["default"].string.isRequired,
  'filters': _propTypes["default"].arrayOf(_propTypes["default"].object).isRequired,
  'mounted': _propTypes["default"].bool
};
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
/* used in FacetList and FacetTermsList*/


function anyTermsSelected() {
  var terms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var facet = arguments.length > 1 ? arguments[1] : undefined;
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var activeTermsForField = {};
  filters.forEach(function (f) {
    if (f.field !== facet.field) return;
    activeTermsForField[f.term] = true;
  });

  for (var i = 0; i < terms.length; i++) {
    if (activeTermsForField[terms[i].key]) {
      return true;
    }
  }

  return false;
}
/* used in FacetList and FacetTermsList */


function mergeTerms(facet, filters) {
  var activeTermsForField = {};
  filters.forEach(function (f) {
    if (f.field !== facet.field) return;
    activeTermsForField[f.term] = true;
  }); // Filter out terms w/ 0 counts (in case).

  var terms = facet.terms.filter(function (term) {
    if (term.doc_count > 0) return true;
    if (activeTermsForField[term.key]) return true;
    return false;
  });
  terms.forEach(function (_ref2) {
    var key = _ref2.key;
    delete activeTermsForField[key];
  }); // Filter out type=Item for now (hardcode)

  if (facet.field === "type") {
    terms = terms.filter(function (t) {
      return t !== 'Item' && t && t.key !== 'Item';
    });
  } // These are terms which might have been manually defined in URL but are not present in data at all.
  // Include them so we can unselect them.


  var unseenTerms = _underscore["default"].keys(activeTermsForField).map(function (term) {
    return {
      key: term,
      doc_count: 0
    };
  });

  return terms.concat(unseenTerms);
}

var FacetList =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(FacetList, _React$PureComponent2);

  function FacetList(props) {
    var _this3;

    _classCallCheck(this, FacetList);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(FacetList).call(this, props));
    _this3.state = {
      'mounted': false
    };
    _this3.memoized = {
      anyTermsSelected: (0, _memoizeOne["default"])(anyTermsSelected),
      mergeTerms: (0, _memoizeOne["default"])(mergeTerms)
    };
    _this3.renderFacets = _this3.renderFacets.bind(_assertThisInitialized(_this3));
    return _this3;
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
      var maxTermsToShow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
      var _this$props4 = this.props,
          facets = _this$props4.facets,
          href = _this$props4.href,
          onFilter = _this$props4.onFilter,
          schemas = _this$props4.schemas,
          getTermStatus = _this$props4.getTermStatus,
          filters = _this$props4.filters,
          itemTypeForSchemas = _this$props4.itemTypeForSchemas,
          windowWidth = _this$props4.windowWidth,
          persistentCount = _this$props4.persistentCount,
          termTransformFxn = _this$props4.termTransformFxn,
          separateSingleTermFacets = _this$props4.separateSingleTermFacets;
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
        onFilter: onFilter,
        href: href,
        getTermStatus: getTermStatus,
        filters: filters,
        schemas: schemas,
        itemTypeForSchemas: itemTypeForSchemas,
        mounted: mounted,
        termTransformFxn: termTransformFxn,
        separateSingleTermFacets: separateSingleTermFacets
      };
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
      var rgs = (0, _layout.responsiveGridState)(windowWidth || null);

      function generateFacet(facet, i) {
        var isStatic = Facet.isStatic(facet);
        var defaultFacetOpen = !mounted ? false : !isStatic && !!(rgs !== 'xs' && i < (facetIndexWherePastXTerms || 1) || facet.aggregation_type === "stats" && _underscore["default"].any(filters || [], function (fltr) {
          return fltr.field === facet.field + ".from" || fltr.field === facet.field + ".to";
        }) || facet.aggregation_type === "terms" && _underscore["default"].any(filters || [], function (fltr) {
          return fltr.field === facet.field;
        }));
        return _react["default"].createElement(Facet, _extends({}, commonProps, {
          facet: facet,
          key: facet.field
        }, {
          defaultFacetOpen: defaultFacetOpen,
          isStatic: isStatic
        }));
      }

      var allFacets = []; // first populated with ungrouped assets, then grouped assets are spliced in

      var groupedOnly = []; // only facet groups

      var inGroupIndices = {}; // map group names to index in GroupedOnly for quick lookup

      var spliceIndices = {}; // map group names to index in allFacets where a nested facet should be spliced

      useFacets.forEach(function (facet, i) {
        if (!facet.grouping) {
          allFacets.push(generateFacet(facet, i - 1)); // add ungrouped facets straight to allFacets
        } else {
          // add or update facet groups and store in groupedOnly
          var terms = this.memoized.mergeTerms(facet, filters);
          var areTermsSelected = this.memoized.anyTermsSelected(terms, facet, filters); // keep track of what index in allFacets a particular group should be added at

          if (!spliceIndices.hasOwnProperty(facet.grouping)) {
            spliceIndices[facet.grouping] = allFacets.length;
          } // check if there's a facet group in groupedOnly;


          if (inGroupIndices.hasOwnProperty(facet.grouping)) {
            var _i = inGroupIndices[facet.grouping];

            groupedOnly[_i].facets.push(generateFacet(facet, _i)); // if any terms are selected, update group selected status


            if (!groupedOnly[_i].areTermsSelected && areTermsSelected) {
              groupedOnly[_i].areTermsSelected = true;
            }
          } else {
            groupedOnly.push({
              key: facet.grouping,
              title: facet.grouping,
              facets: [generateFacet(facet, i)],
              areTermsSelected: areTermsSelected
            });
            inGroupIndices[facet.grouping] = groupedOnly.length - 1;
          }
        }
      }.bind(this)); // splice back in the nested facets

      groupedOnly.forEach(function (group, i) {
        allFacets.splice(spliceIndices[group.title] + i, 0, _react["default"].createElement(_FacetOfFacets.FacetOfFacets, _extends({}, commonProps, group, {
          defaultFacetOpen: false,
          isStatic: false
        })));
      });
      return allFacets;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          debug = _this$props5.debug,
          facets = _this$props5.facets,
          className = _this$props5.className,
          title = _this$props5.title,
          showClearFiltersButton = _this$props5.showClearFiltersButton,
          onClearFilters = _this$props5.onClearFilters,
          windowHeight = _this$props5.windowHeight,
          separateSingleTermFacets = _this$props5.separateSingleTermFacets;
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
      var maxTermsToShow = typeof windowHeight === 'number' && !isNaN(windowHeight) ? Math.floor(windowHeight / 60) : 12;
      var allFacetElements = this.renderFacets(maxTermsToShow);
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