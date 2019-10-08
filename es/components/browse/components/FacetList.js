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

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _patchedConsole = require("./../../util/patched-console");

var _searchFilters = require("./../../util/search-filters");

var _navigate = require("./../../util/navigate");

var analytics = _interopRequireWildcard(require("./../../util/analytics"));

var _layout = require("./../../util/layout");

var _Collapse = require("./../../ui/Collapse");

var _Fade = require("./../../ui/Fade");

var _PartialList = require("./../../ui/PartialList");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
 * Used to render individual terms in FacetList.
 *
 * @memberof module:facetlist.Facet
 * @class Term
 * @type {Component}
 */
var Term =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Term, _React$PureComponent);

  function Term(props) {
    var _this;

    _classCallCheck(this, Term);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Term).call(this, props));
    _this.handleClick = _underscore["default"].debounce(_this.handleClick.bind(_assertThisInitialized(_this)), 500, true);
    _this.state = {
      'filtering': false
    };
    return _this;
  }

  _createClass(Term, [{
    key: "handleClick",
    value: function handleClick(e) {
      var _this2 = this;

      var _this$props = this.props,
          facet = _this$props.facet,
          term = _this$props.term,
          onClick = _this$props.onClick;
      e.preventDefault();
      this.setState({
        'filtering': true
      }, function () {
        onClick(facet, term, e, function () {
          return _this2.setState({
            'filtering': false
          });
        });
      });
    }
    /**
     * INCOMPLETE -
     *   For future, in addition to making a nice date range title, we should
     *   also ensure that can send a date range as a filter and be able to parse it on
     *   back-end.
     * Handle date fields, etc.
     */

    /*
    customTitleRender(){
        const { facet, term, termTransformFxn } = this.props;
         if (facet.aggregation_type === 'range'){
            return (
                (typeof term.from !== 'undefined' ? termTransformFxn(facet.field, term.from, true) : '< ') +
                (typeof term.from !== 'undefined' && typeof term.to !== 'undefined' ? ' - ' : '') +
                (typeof term.to !== 'undefined' ? termTransformFxn(facet.field, term.to, true) : ' >')
            );
        }
         if (facet.aggregation_type === 'date_histogram'){
            var interval = Filters.getDateHistogramIntervalFromFacet(facet);
            if (interval === 'month'){
                return <DateUtility.LocalizedTime timestamp={term.key} formatType="date-month" localize={false} />;
            }
        }
         return null;
    }
    */

  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          term = _this$props2.term,
          facet = _this$props2.facet,
          getTermStatus = _this$props2.getTermStatus,
          termTransformFxn = _this$props2.termTransformFxn;
      var filtering = this.state.filtering;
      var status = getTermStatus(term, facet);
      var count = term && term.doc_count || 0;
      var title = termTransformFxn(facet.field, term.key) || term.key;
      var icon = null;

      if (filtering) {
        icon = _react["default"].createElement("i", {
          className: "icon fas icon-circle-notch icon-spin icon-fw"
        });
      } else if (status === 'selected') {
        icon = _react["default"].createElement("i", {
          className: "icon icon-times-circle icon-fw fas"
        });
      } else if (status === 'omitted') {
        icon = _react["default"].createElement("i", {
          className: "icon icon-minus-circle icon-fw fas"
        });
      } else {
        icon = _react["default"].createElement("i", {
          className: "icon icon-circle icon-fw unselected far"
        });
      }

      if (!title || title === 'null' || title === 'undefined') {
        title = 'None';
      }

      var statusClassName = status !== 'none' ? status === 'selected' ? " selected" : " omitted" : '';
      return _react["default"].createElement("li", {
        className: "facet-list-element " + statusClassName,
        key: term.key,
        "data-key": term.key
      }, _react["default"].createElement("a", {
        className: "term",
        "data-selected": status !== 'none',
        href: "#",
        onClick: this.handleClick,
        "data-term": term.key
      }, _react["default"].createElement("span", {
        className: "facet-selector"
      }, icon), _react["default"].createElement("span", {
        className: "facet-item",
        "data-tip": title.length > 30 ? title : null
      }, title), _react["default"].createElement("span", {
        className: "facet-count"
      }, count)));
    }
  }]);

  return Term;
}(_react["default"].PureComponent);

Term.propTypes = {
  'facet': _propTypes["default"].shape({
    'field': _propTypes["default"].string.isRequired
  }).isRequired,
  'term': _propTypes["default"].shape({
    'key': _propTypes["default"].string.isRequired,
    'doc_count': _propTypes["default"].number
  }).isRequired,
  'getTermStatus': _propTypes["default"].func.isRequired,
  'onClick': _propTypes["default"].func.isRequired
};

var FacetTermsList =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FacetTermsList, _React$Component);

  function FacetTermsList(props) {
    var _this3;

    _classCallCheck(this, FacetTermsList);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(FacetTermsList).call(this, props));
    _this3.handleOpenToggleClick = _this3.handleOpenToggleClick.bind(_assertThisInitialized(_this3));
    _this3.handleExpandListToggleClick = _this3.handleExpandListToggleClick.bind(_assertThisInitialized(_this3));
    _this3.renderTerms = _this3.renderTerms.bind(_assertThisInitialized(_this3));
    _this3.state = {
      'facetOpen': typeof props.defaultFacetOpen === 'boolean' ? props.defaultFacetOpen : true,
      'facetClosing': false,
      'expanded': false
    };
    return _this3;
  }

  _createClass(FacetTermsList, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var _this$props3 = this.props,
          mounted = _this$props3.mounted,
          defaultFacetOpen = _this$props3.defaultFacetOpen;
      var facetOpen = this.state.facetOpen;

      if (!pastProps.mounted && mounted && typeof defaultFacetOpen === 'boolean' && defaultFacetOpen !== pastProps.defaultFacetOpen || defaultFacetOpen === true && !pastProps.defaultFacetOpen && !facetOpen) {
        this.setState({
          'facetOpen': true
        });
      }

      if (pastState.facetOpen !== facetOpen) {
        _reactTooltip["default"].rebuild();
      }
    }
  }, {
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      var _this4 = this;

      e.preventDefault();
      this.setState(function (_ref) {
        var facetOpen = _ref.facetOpen;

        if (!facetOpen) {
          return {
            'facetOpen': true
          };
        } else {
          return {
            'facetClosing': true
          };
        }
      }, function () {
        setTimeout(function () {
          _this4.setState(function (_ref2) {
            var facetOpen = _ref2.facetOpen,
                facetClosing = _ref2.facetClosing;

            if (facetClosing) {
              return {
                'facetOpen': false,
                'facetClosing': false
              };
            }

            return null;
          });
        }, 350);
      });
    }
  }, {
    key: "handleExpandListToggleClick",
    value: function handleExpandListToggleClick(e) {
      e.preventDefault();
      this.setState(function (_ref3) {
        var expanded = _ref3.expanded;
        return {
          'expanded': !expanded
        };
      });
    }
  }, {
    key: "renderTerms",
    value: function renderTerms(terms) {
      var _this5 = this;

      var _this$props4 = this.props,
          facet = _this$props4.facet,
          persistentCount = _this$props4.persistentCount,
          onTermClick = _this$props4.onTermClick;
      var expanded = this.state.expanded;

      var makeTermComponent = function (term) {
        return _react["default"].createElement(Term, _extends({}, _this5.props, {
          onClick: onTermClick,
          key: term.key,
          term: term,
          total: facet.total
        }));
      };

      if (terms.length > persistentCount) {
        var persistentTerms = terms.slice(0, persistentCount);
        var collapsibleTerms = terms.slice(persistentCount);
        var remainingTermsCount = !expanded ? _underscore["default"].reduce(collapsibleTerms, function (m, term) {
          return m + (term.doc_count || 0);
        }, 0) : null;
        var expandButtonTitle;

        if (expanded) {
          expandButtonTitle = _react["default"].createElement("span", null, _react["default"].createElement("i", {
            className: "icon icon-fw icon-minus fas"
          }), " Collapse");
        } else {
          expandButtonTitle = _react["default"].createElement("span", null, _react["default"].createElement("i", {
            className: "icon icon-fw icon-plus fas"
          }), " View ", terms.length - persistentCount, " More", _react["default"].createElement("span", {
            className: "pull-right"
          }, remainingTermsCount));
        }

        return _react["default"].createElement("div", {
          className: "facet-list"
        }, _react["default"].createElement(_PartialList.PartialList, {
          open: expanded,
          persistent: _underscore["default"].map(persistentTerms, makeTermComponent),
          collapsible: _underscore["default"].map(collapsibleTerms, makeTermComponent)
        }), _react["default"].createElement("div", {
          className: "view-more-button",
          onClick: this.handleExpandListToggleClick
        }, expandButtonTitle));
      } else {
        return _react["default"].createElement("div", {
          className: "facet-list"
        }, _underscore["default"].map(terms, makeTermComponent));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          facet = _this$props5.facet,
          tooltip = _this$props5.tooltip,
          title = _this$props5.title;
      var _this$state = this.state,
          facetOpen = _this$state.facetOpen,
          facetClosing = _this$state.facetClosing; // Filter out terms w/ 0 counts in case of range, etc.

      var terms = _underscore["default"].filter(facet.terms, function (term) {
        return term.doc_count > 0;
      }); // Filter out type=Item for now (hardcode)


      if (facet.field === 'type') {
        terms = _underscore["default"].filter(terms, function (t) {
          return t !== 'Item' && t && t.key !== 'Item';
        });
      }

      var indicator = // Small indicator to help represent how many terms there are available for this Facet.
      _react["default"].createElement(_Fade.Fade, {
        "in": facetClosing || !facetOpen
      }, _react["default"].createElement("span", {
        className: "pull-right closed-terms-count",
        "data-tip": terms.length + " options"
      }, _underscore["default"].range(0, Math.min(Math.ceil(terms.length / 3), 8)).map(function (c) {
        return _react["default"].createElement("i", {
          className: "icon icon-ellipsis-v fas",
          style: {
            opacity: (c + 1) / 5 * 0.67 + 0.33
          },
          key: c
        });
      }))); // List of terms


      return _react["default"].createElement("div", {
        className: "facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : ''),
        "data-field": facet.field
      }, _react["default"].createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, _react["default"].createElement("span", {
        className: "expand-toggle"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")
      })), _react["default"].createElement("span", {
        className: "inline-block",
        "data-tip": tooltip,
        "data-place": "right"
      }, title), indicator), _react["default"].createElement(_Collapse.Collapse, {
        "in": facetOpen && !facetClosing
      }, this.renderTerms(terms)));
    }
  }]);

  return FacetTermsList;
}(_react["default"].Component);

FacetTermsList.defaultProps = {
  'persistentCount': 10
};
/**
 * Used to render individual facet fields and their available terms in FacetList.
 *
 * @memberof module:facetlist
 * @class Facet
 * @type {Component}
 */

var Facet =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(Facet, _React$PureComponent2);

  _createClass(Facet, null, [{
    key: "isStatic",
    value: function isStatic(facet) {
      return facet.terms.length === 1 && facet.total <= _underscore["default"].reduce(facet.terms, function (m, t) {
        return m + (t.doc_count || 0);
      }, 0);
    }
  }]);

  function Facet(props) {
    var _this6;

    _classCallCheck(this, Facet);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Facet).call(this, props));
    _this6.isStatic = (0, _memoizeOne["default"])(Facet.isStatic);
    _this6.handleStaticClick = _this6.handleStaticClick.bind(_assertThisInitialized(_this6));
    _this6.handleTermClick = _this6.handleTermClick.bind(_assertThisInitialized(_this6));
    _this6.state = {
      'filtering': false
    };
    return _this6;
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
      var _this7 = this;

      var facet = this.props.facet;
      var term = facet.terms[0]; // Would only have 1

      e.preventDefault();
      if (!this.isStatic(facet)) return false;
      this.setState({
        'filtering': true
      }, function () {
        _this7.handleTermClick(facet, term, e, function () {
          return _this7.setState({
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
      var _this$props6 = this.props,
          onFilter = _this$props6.onFilter,
          href = _this$props6.href;
      onFilter(facet, term, callback, false, href);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          facet = _this$props7.facet,
          getTermStatus = _this$props7.getTermStatus,
          extraClassname = _this$props7.extraClassname,
          termTransformFxn = _this$props7.termTransformFxn,
          separateSingleTermFacets = _this$props7.separateSingleTermFacets;
      var filtering = this.state.filtering;
      var _facet$description = facet.description,
          description = _facet$description === void 0 ? null : _facet$description,
          field = facet.field,
          title = facet.title,
          _facet$terms = facet.terms,
          terms = _facet$terms === void 0 ? [] : _facet$terms;
      var showTitle = title || field;

      if (separateSingleTermFacets && this.isStatic(facet)) {
        // Only one term exists.
        return _react["default"].createElement(StaticSingleTerm, {
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
        return _react["default"].createElement(FacetTermsList, _extends({}, this.props, {
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
    'description': _propTypes["default"].string
  }),
  'defaultFacetOpen': _propTypes["default"].bool,
  'onFilter': _propTypes["default"].func,
  // Executed on term click
  'extraClassname': _propTypes["default"].string,
  'schemas': _propTypes["default"].object,
  'getTermStatus': _propTypes["default"].func.isRequired,
  'href': _propTypes["default"].string.isRequired
};

var StaticSingleTerm = _react["default"].memo(function (_ref4) {
  var term = _ref4.term,
      facet = _ref4.facet,
      showTitle = _ref4.showTitle,
      filtering = _ref4.filtering,
      onClick = _ref4.onClick,
      getTermStatus = _ref4.getTermStatus,
      extraClassname = _ref4.extraClassname,
      termTransformFxn = _ref4.termTransformFxn;
  var _facet$description2 = facet.description,
      description = _facet$description2 === void 0 ? null : _facet$description2,
      field = facet.field;
  var status = getTermStatus(term, facet);
  var selectedOrOmitted = status !== 'none';
  var statusClassName = selectedOrOmitted ? status === 'selected' ? 'selected' : 'omitted' : '';
  var termName = termTransformFxn(field, term.key);

  if (!termName || termName === 'null' || termName === 'undefined') {
    termName = 'None';
  }

  return _react["default"].createElement("div", {
    className: "facet static " + statusClassName + (filtering ? ' filtering' : '') + (extraClassname ? ' ' + extraClassname : ''),
    "data-field": field
  }, _react["default"].createElement("div", {
    className: "facet-static-row clearfix"
  }, _react["default"].createElement("h5", {
    className: "facet-title"
  }, _react["default"].createElement("span", {
    className: "inline-block",
    "data-tip": description,
    "data-place": "right"
  }, "\xA0", showTitle)), _react["default"].createElement("div", {
    className: "facet-item term " + statusClassName + (filtering ? ' filtering' : '')
  }, _react["default"].createElement("span", {
    onClick: onClick,
    title: 'All results ' + (status !== 'omitted' ? 'have ' : 'omitted ') + term.key + (status !== 'omitted' ? ' as their ' : ' from their ') + showTitle.toLowerCase() + '; ' + (selectedOrOmitted ? 'currently active as portal-wide filter.' : 'not currently active as portal-wide filter.')
  }, _react["default"].createElement("i", {
    className: "icon icon-fw " + (filtering ? 'icon-spin icon-circle-notch' : selectedOrOmitted ? status === 'selected' ? 'icon-times-circle fas' : 'icon-minus-circle fas' : 'icon-circle fas')
  }), termName))));
});
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
    targetSearchHref = (0, _searchFilters.buildSearchHref)(facet.field, term.key, currentHref);
    /*
    var interval, nextHref;
    if (facet.aggregation_type === 'date_histogram'){
        interval = Filters.getDateHistogramIntervalFromFacet(facet) || 'month';
        nextHref            = buildSearchHref(facet.field + '.from', term.key, currentHref); //onFilter(facet.field + '.from', term.key, null, true, href);
        var toDate = moment.utc(term.key);
        toDate.add(1, interval + 's');
        targetSearchHref    = buildSearchHref(facet.field + '.to', toDate.format().slice(0,10), nextHref); // onFilter(facet.field + '.to', toDate.format().slice(0,10), null, true, nextHref);
    } else if (facet.aggregation_type === 'range') {
        nextHref            = buildSearchHref(facet.field + '.from', term.from, currentHref);
        targetSearchHref    = buildSearchHref(facet.field + '.to', term.to, nextHref);
    } else { // Default - regular term matching
        targetSearchHref    = buildSearchHref(facet.field, term.key, currentHref);
    }
    */
  } // Ensure only 1 type filter is selected at once.
  // Unselect any other type= filters if setting new one.


  if (facet.field === 'type') {
    if (!statusAndHref.href) {
      var parts = _url["default"].parse(targetSearchHref, true);

      if (Array.isArray(parts.query.type)) {
        var types = parts.query.type;

        if (types.length > 1) {
          var queryParts = _underscore["default"].clone(parts.query);

          delete queryParts[""]; // Safety

          queryParts.type = encodeURIComponent(term.key); // Only 1 Item type selected at once.

          var searchString = _queryString["default"].stringify(queryParts);

          parts.search = searchString && searchString.length > 0 ? '?' + searchString : '';
          targetSearchHref = _url["default"].format(parts);
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
function (_React$PureComponent3) {
  _inherits(FacetList, _React$PureComponent3);

  function FacetList(props) {
    var _this8;

    _classCallCheck(this, FacetList);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(FacetList).call(this, props));
    _this8.searchQueryTerms = _this8.searchQueryTerms.bind(_assertThisInitialized(_this8));
    _this8.state = {
      'mounted': false
    };
    return _this8;
  }

  _createClass(FacetList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        'mounted': true
      });
    }
  }, {
    key: "searchQueryTerms",
    value: function searchQueryTerms() {
      var _this$props8 = this.props,
          propHref = _this$props8.href,
          context = _this$props8.context;
      var href = propHref || context && context['@id'] ? context['@id'] : null;
      if (!href) return null;
      return href && _url["default"].parse(href, true).query;
    }
  }, {
    key: "renderFacets",
    value: function renderFacets() {
      var maxTermsToShow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
      var _this$props9 = this.props,
          facets = _this$props9.facets,
          href = _this$props9.href,
          onFilter = _this$props9.onFilter,
          schemas = _this$props9.schemas,
          getTermStatus = _this$props9.getTermStatus,
          itemTypeForSchemas = _this$props9.itemTypeForSchemas,
          windowWidth = _this$props9.windowWidth,
          persistentCount = _this$props9.persistentCount,
          termTransformFxn = _this$props9.termTransformFxn,
          separateSingleTermFacets = _this$props9.separateSingleTermFacets;
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

      var facetIndexWherePastXTerms = _underscore["default"].reduce(useFacets, function (m, facet, index) {
        if (m.end) return m;
        m.facetIndex = index;
        m.termCount = m.termCount + Math.min( // Take into account 'view more' button
        facet.terms.length, persistentCount || FacetTermsList.defaultProps.persistentCount);
        if (m.termCount > maxTermsToShow) m.end = true;
        return m;
      }, {
        facetIndex: 0,
        termCount: 0,
        end: false
      }).facetIndex;

      return _underscore["default"].map(useFacets, function (facet, i) {
        return _react["default"].createElement(Facet, _extends({
          onFilter: onFilter,
          facet: facet,
          href: href,
          getTermStatus: getTermStatus,
          schemas: schemas,
          itemTypeForSchemas: itemTypeForSchemas,
          mounted: mounted,
          termTransformFxn: termTransformFxn,
          separateSingleTermFacets: separateSingleTermFacets
        }, {
          key: facet.field,
          defaultFacetOpen: !mounted ? false : !!(_underscore["default"].any(facet.terms, function (t) {
            return getTermStatus(t, facet) !== 'none';
          }) || (0, _layout.responsiveGridState)(windowWidth || null) !== 'xs' && i < (facetIndexWherePastXTerms || 1))
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props10 = this.props,
          debug = _this$props10.debug,
          facets = _this$props10.facets,
          className = _this$props10.className,
          title = _this$props10.title,
          showClearFiltersButton = _this$props10.showClearFiltersButton,
          onClearFilters = _this$props10.onClearFilters,
          windowHeight = _this$props10.windowHeight,
          separateSingleTermFacets = _this$props10.separateSingleTermFacets;
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
          if (Facet.isStatic(renderedFacet.props.facet)) {
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
  'context': _propTypes["default"].object,
  // Unused -ish,
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