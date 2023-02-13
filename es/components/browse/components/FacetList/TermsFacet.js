function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
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
  _inherits(TermsFacet, _React$PureComponent);

  var _super = _createSuper(TermsFacet);

  function TermsFacet(props) {
    var _this;

    _classCallCheck(this, TermsFacet);

    _this = _super.call(this, props);
    _this.handleStaticClick = _this.handleStaticClick.bind(_assertThisInitialized(_this));
    _this.handleTermClick = _this.handleTermClick.bind(_assertThisInitialized(_this));
    _this.state = {
      'filtering': false
    };
    _this.memoized = {
      fieldSchema: memoize(getSchemaProperty)
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
          getTermStatus = _this$props2.getTermStatus,
          extraClassname = _this$props2.extraClassname,
          termTransformFxn = _this$props2.termTransformFxn,
          separateSingleTermFacets = _this$props2.separateSingleTermFacets,
          isStatic = _this$props2.isStatic,
          schemas = _this$props2.schemas,
          itemTypeForSchemas = _this$props2.itemTypeForSchemas;
      var field = facet.field,
          terms = facet.terms;
      var filtering = this.state.filtering; // `fieldSchema` may be null esp. if field is 'fake'.

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
        return /*#__PURE__*/React.createElement(FacetTermsList, _extends({}, this.props, {
          fieldSchema: fieldSchema,
          onTermClick: this.handleTermClick
        }));
      }
    }
  }]);

  return TermsFacet;
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