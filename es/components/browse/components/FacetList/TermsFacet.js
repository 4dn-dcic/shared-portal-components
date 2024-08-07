import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
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
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { getSchemaProperty } from './../../../util/schema-transforms';
import { FacetTermsList } from './FacetTermsList';
import { StaticSingleTerm } from './StaticSingleTerm';

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
export var TermsFacet = /*#__PURE__*/function (_React$PureComponent) {
  function TermsFacet(props) {
    var _this2;
    _classCallCheck(this, TermsFacet);
    _this2 = _callSuper(this, TermsFacet, [props]);
    _this2.handleStaticClick = _this2.handleStaticClick.bind(_this2);
    _this2.handleTermClick = _this2.handleTermClick.bind(_this2);
    _this2.handleBasicTermSearch = _this2.handleBasicTermSearch.bind(_this2);
    _this2.state = {
      'filtering': false,
      'searchText': ''
    };
    _this2.memoized = {
      fieldSchema: memoize(getSchemaProperty)
    };
    return _this2;
  }

  /**
   * For cases when there is only one option for a facet - we render a 'static' row.
   * This may change in response to design.
   * Unlike in `handleTermClick`, we handle own state/UI here.
   *
   * @todo Allow to specify interval for histogram & date_histogram in schema instead of hard-coding 'month' interval.
   */
  _inherits(TermsFacet, _React$PureComponent);
  return _createClass(TermsFacet, [{
    key: "handleStaticClick",
    value: function handleStaticClick(e) {
      var _this3 = this;
      var _this$props = this.props,
        facet = _this$props.facet,
        isStatic = _this$props.isStatic;
      var term = facet.terms[0]; // Would only have 1

      e.preventDefault();
      if (!isStatic) return false;
      this.setState({
        'filtering': true
      }, function () {
        _this3.handleTermClick(facet, term, e, function () {
          return _this3.setState({
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
    key: "handleBasicTermSearch",
    value: function handleBasicTermSearch(e) {
      e.preventDefault();
      var newValue = e.target.value;
      this.setState({
        'searchText': newValue
      }, function () {
        setTimeout(function () {
          ReactTooltip.rebuild();
        }, 1000);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        facet = _this$props2.facet,
        getTermStatus = _this$props2.getTermStatus,
        extraClassname = _this$props2.extraClassname,
        termTransformFxn = _this$props2.termTransformFxn,
        separateSingleTermFacets = _this$props2.separateSingleTermFacets,
        isStatic = _this$props2.isStatic,
        schemas = _this$props2.schemas,
        itemTypeForSchemas = _this$props2.itemTypeForSchemas;
      var field = facet.field,
        terms = facet.terms;
      var _this$state = this.state,
        filtering = _this$state.filtering,
        searchText = _this$state.searchText;
      // `fieldSchema` may be null esp. if field is 'fake'.
      var fieldSchema = this.memoized.fieldSchema(field, schemas, itemTypeForSchemas);
      if (separateSingleTermFacets && isStatic) {
        // Only one term exists.
        return /*#__PURE__*/React.createElement(StaticSingleTerm, {
          fieldSchema: fieldSchema,
          facet: facet,
          filtering: filtering,
          getTermStatus: getTermStatus,
          extraClassname: extraClassname,
          termTransformFxn: termTransformFxn,
          term: terms[0],
          onClick: this.handleStaticClick
        });
      } else {
        var passProps = _objectSpread(_objectSpread({}, this.props), {}, {
          fieldSchema: fieldSchema,
          searchText: searchText,
          onTermClick: this.handleTermClick,
          handleBasicTermSearch: this.handleBasicTermSearch
        });
        return /*#__PURE__*/React.createElement(FacetTermsList, passProps);
      }
    }
  }]);
}(React.PureComponent);
TermsFacet.propTypes = {
  'facet': PropTypes.shape({
    'field': PropTypes.string.isRequired,
    // Name of nested field property in experiment objects, using dot-notation.
    'title': PropTypes.string,
    // Human-readable Facet Term
    'total': PropTypes.number,
    // Total experiments (or terms??) w/ field
    'terms': PropTypes.array.isRequired,
    // Possible terms,
    'description': PropTypes.string,
    'aggregation_type': PropTypes.oneOf(["stats", "terms"])
  }),
  'defaultFacetOpen': PropTypes.bool,
  'onFilter': PropTypes.func,
  // Executed on term click
  'extraClassname': PropTypes.string,
  'schemas': PropTypes.object,
  'getTermStatus': PropTypes.func.isRequired,
  'windowWidth': PropTypes.number,
  'termTransformFxn': PropTypes.func,
  'separateSingleTermFacets': PropTypes.bool,
  'isStatic': PropTypes.bool,
  'itemTypeForSchemas': PropTypes.string
};