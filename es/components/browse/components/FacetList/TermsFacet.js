'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TermsFacet = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _FacetTermsList = require("./FacetTermsList");

var _StaticSingleTerm = require("./StaticSingleTerm");

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
 */
var TermsFacet =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(TermsFacet, _React$PureComponent);

  _createClass(TermsFacet, null, [{
    key: "isStatic",
    value: function isStatic(facet) {
      var _facet$terms = facet.terms,
          terms = _facet$terms === void 0 ? null : _facet$terms,
          _facet$total = facet.total,
          total = _facet$total === void 0 ? 0 : _facet$total;
      return Array.isArray(terms) && terms.length === 1 && total <= _underscore["default"].reduce(terms, function (m, t) {
        return m + (t.doc_count || 0);
      }, 0);
    }
  }]);

  function TermsFacet(props) {
    var _this;

    _classCallCheck(this, TermsFacet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TermsFacet).call(this, props));
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


  _createClass(TermsFacet, [{
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
      var onFilter = this.props.onFilter;
      onFilter(facet, term, callback);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          facet = _this$props2.facet,
          terms = _this$props2.terms,
          getTermStatus = _this$props2.getTermStatus,
          extraClassname = _this$props2.extraClassname,
          termTransformFxn = _this$props2.termTransformFxn,
          separateSingleTermFacets = _this$props2.separateSingleTermFacets,
          isStatic = _this$props2.isStatic;
      var filtering = this.state.filtering;

      var _ref = facet || {},
          field = _ref.field,
          title = _ref.title,
          _ref$description = _ref.description,
          description = _ref$description === void 0 ? null : _ref$description;

      var showTitle = title || field;

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

  return TermsFacet;
}(_react["default"].PureComponent);

exports.TermsFacet = TermsFacet;
TermsFacet.propTypes = {
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