import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import React from 'react';
import _ from 'underscore';
import memoize from "memoize-one";
import * as vizUtil from './../../viz/utilities';
import { console, searchFilters } from './../../util';
export var ActiveFiltersBar = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ActiveFiltersBar, _React$PureComponent);
  var _super = _createSuper(ActiveFiltersBar);
  function ActiveFiltersBar(props) {
    var _this;
    _classCallCheck(this, ActiveFiltersBar);
    _this = _super.call(this, props);
    _this.updateHoverNodes = _.throttle(_this.updateHoverNodes.bind(_assertThisInitialized(_this)), 200);
    _this.renderCrumbs = _this.renderCrumbs.bind(_assertThisInitialized(_this));
    _this.memoized = {
      getSearchItemType: memoize(searchFilters.getSearchItemType)
    };
    return _this;
  }
  _createClass(ActiveFiltersBar, [{
    key: "updateHoverNodes",
    value: function updateHoverNodes() {
      var _this2 = this;
      var sequence = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      vizUtil.requestAnimationFrame(function () {
        _this2.setState({
          'highlighted': sequence
        });
      });
    }
  }, {
    key: "renderCrumbs",
    value: function renderCrumbs() {
      var _this$props = this.props,
        invisible = _this$props.invisible,
        onTermClick = _this$props.onTermClick,
        filters = _this$props.filters,
        context = _this$props.context,
        orderedFieldNames = _this$props.orderedFieldNames,
        schemas = _this$props.schemas,
        termTransformFxn = _this$props.termTransformFxn,
        fieldTransformFxn = _this$props.fieldTransformFxn,
        termClassName = _this$props.termClassName,
        fieldGroupClassName = _this$props.fieldGroupClassName;
      if (invisible) return null;
      if (!Array.isArray(filters) || filters.length === 0) return null;
      var filtersByField = new Map();
      filters.forEach(function (_ref) {
        var field = _ref.field,
          term = _ref.term;
        if (!filtersByField.has(field)) {
          filtersByField.set(field, new Set());
        }
        filtersByField.get(field).add(term);
      });
      var renderedFieldFilterGroups = [];
      var _iterator = _createForOfIteratorHelper(filtersByField),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            field = _step$value[0],
            termSet = _step$value[1];
          // Try to get more accurate title from context.facets list, if available.
          var relatedFacet = Array.isArray(context.facets) && _.findWhere(context.facets, {
            field: field
          });
          var fieldTitle = relatedFacet && relatedFacet.title || fieldTransformFxn(field, schemas, this.memoized.getSearchItemType(context)) || 'N/A';
          var renderedNodes = [];
          var _iterator2 = _createForOfIteratorHelper(termSet),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var term = _step2.value;
              renderedNodes.push( /*#__PURE__*/React.createElement(RegularCrumb, {
                filters: filters,
                field: field,
                term: term,
                termTransformFxn: termTransformFxn,
                key: term,
                onClick: onTermClick,
                className: termClassName
              }));
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          renderedFieldFilterGroups.push( /*#__PURE__*/React.createElement("div", {
            className: fieldGroupClassName,
            key: field,
            "data-field": field
          }, renderedNodes, /*#__PURE__*/React.createElement("div", {
            className: "field-label"
          }, fieldTitle)));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return renderedFieldFilterGroups;
    }
  }, {
    key: "render",
    value: function render() {
      var parentId = this.props.parentId;
      return /*#__PURE__*/React.createElement("div", {
        className: "active-filters-bar",
        id: parentId + '-crumbs'
      }, this.renderCrumbs());
    }
  }]);
  return ActiveFiltersBar;
}(React.PureComponent);
_defineProperty(ActiveFiltersBar, "defaultProps", {
  'schemas': null,
  'parentId': 'main',
  'filters': null,
  'invisible': false,
  'termTransformFxn': function termTransformFxn(field, term) {
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return term;
  },
  'fieldTransformFxn': function fieldTransformFxn(field, term) {
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    return term;
  },
  'onTermClick': function onTermClick(field, term) {
    console.log("Clicked", field, term);
  },
  'fieldGroupClassName': "field-group mb-32",
  'termClassName': "chart-crumb"
});
function Container(_ref2) {
  var sequential = _ref2.sequential,
    children = _ref2.children;
  var title = sequential ? "Examining" : "Currently-selected Filters";
  return /*#__PURE__*/React.createElement("div", {
    className: "active-filters-bar-container"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "crumbs-title"
  }, title), children);
}
var RegularCrumb = /*#__PURE__*/React.memo(function (props) {
  var field = props.field,
    term = props.term,
    _props$color = props.color,
    color = _props$color === void 0 ? null : _props$color,
    termTransformFxn = props.termTransformFxn,
    _onClick = props.onClick,
    className = props.className;
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    "data-term": term,
    style: {
      backgroundColor: color
    }
  }, termTransformFxn(field, term, true), /*#__PURE__*/React.createElement("span", {
    className: "icon-container",
    onClick: function onClick(evt) {
      _onClick(evt, field, term);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-times fas"
  })));
});