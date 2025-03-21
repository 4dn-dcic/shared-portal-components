import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _extends from "@babel/runtime/helpers/extends";
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
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Fade from 'react-bootstrap/esm/Fade';
import { LocalizedTime } from './../../../ui/LocalizedTime';
import { PartialList } from './../../../ui/PartialList';
import { decorateNumberWithCommas } from './../../../util/value-transforms';
import { getSchemaProperty } from './../../../util/schema-transforms';
import { patchedConsoleInstance as console } from './../../../util/patched-console';
import { segmentComponentsByStatus } from './FacetTermsList';
import { ExtendedDescriptionPopoverIcon } from './ExtendedDescriptionPopoverIcon';
import ReactTooltip from 'react-tooltip';
function getRangeStatus(range, toVal, fromVal) {
  var _ref = range || {},
    _ref$from = _ref.from,
    from = _ref$from === void 0 ? null : _ref$from,
    _ref$to = _ref.to,
    to = _ref$to === void 0 ? null : _ref$to;
  if (to === toVal && from === fromVal) {
    return "selected";
  }
  return "none";
}
export function getRangeValuesFromFiltersByField() {
  var facets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var facetsByFilterField = {};
  var valuesByField = {};
  facets.forEach(function (f) {
    if (f.aggregation_type !== "stats" && f.aggregation_type !== "range") {
      return; // Skip
    }

    facetsByFilterField[f.field + ".to"] = f;
    facetsByFilterField[f.field + ".from"] = f;
  });
  filters.forEach(function (f) {
    var filterField = f.field,
      strValue = f.term; // filterField would have .to and .from appended.
    var facet = facetsByFilterField[filterField];
    if (!facet) return; // Skip, not range facet.
    var facetField = facet.field,
      _facet$field_type = facet.field_type,
      field_type = _facet$field_type === void 0 ? "number" : _facet$field_type;
    valuesByField[facetField] = valuesByField[facetField] || {};
    var value =
    // Convert to float if numerical field type or leave as string if datetime, etc.
    field_type === "integer" ? parseInt(strValue) : field_type === "number" ? parseFloat(strValue) : strValue;
    if (facetField + ".to" === filterField) {
      valuesByField[facetField].toVal = value;
    } else if (facetField + ".from" === filterField) {
      valuesByField[facetField].fromVal = value;
    } else {
      throw new Error("Unexpected range facet filter value or type");
    }
  });
  return valuesByField;
}

/**
 * Formats range facet value to be smaller to fit into FacetList & similar.
 *
 * @param {function} termTransformFxn - Schemas.Term.toName passed in from portal app.
 * @param {{ field: string, field_type: string }} fieldFacetObj - Facet definition from backend.
 * @param {number|string} rangeValue - Value to transform.
 * @param {boolean} allowJSX - Passed to termTransformFxn.
 */
export function formatRangeVal(termTransformFxn, fieldFacetObj, rangeValue) {
  var allowJSX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var field = fieldFacetObj.field,
    field_type = fieldFacetObj.field_type;
  if (rangeValue === null || typeof rangeValue === "undefined") {
    return rangeValue; // Pass thru lack of value
  }

  if (field_type === "date") {
    return /*#__PURE__*/React.createElement(LocalizedTime, {
      timestamp: rangeValue,
      localize: false,
      formatType: "date-file"
    });
  }
  if (field_type === "number") {
    rangeValue = parseFloat(rangeValue);
  }
  var valToShow = termTransformFxn(field, rangeValue, allowJSX);
  if (typeof valToShow === "number") {
    var absVal = Math.abs(valToShow);
    if (absVal.toString().length <= 6) {
      // Else is too long and will go thru toPrecision or toExponential.
      if (absVal >= 1000) {
        valToShow = decorateNumberWithCommas(valToShow);
      }
    } else {
      valToShow = valToShow.toPrecision(3);
      // Try to prevent trailing 0s e.g. in 0.00000100
      // Taken from https://stackoverflow.com/questions/26299160/using-regex-how-do-i-remove-the-trailing-zeros-from-a-decimal-number
      valToShow = valToShow.replace(/(\.\d*?[1-9])0+$/g, "$1");
    }
  } // else is assumed to be valid JSX already

  return valToShow;
}
export var RangeFacet = /*#__PURE__*/function (_React$PureComponent) {
  function RangeFacet(props) {
    var _this2;
    _classCallCheck(this, RangeFacet);
    _this2 = _callSuper(this, RangeFacet, [props]);
    _this2.handleOpenToggleClick = _this2.handleOpenToggleClick.bind(_this2);
    _this2.handleExpandListToggleClick = _this2.handleExpandListToggleClick.bind(_this2);
    _this2.setFrom = _this2.setFrom.bind(_this2);
    _this2.setTo = _this2.setTo.bind(_this2);
    _this2.setToAndFrom = _this2.setToAndFrom.bind(_this2);
    _this2.selectRange = _this2.selectRange.bind(_this2);
    _this2.resetAll = _this2.selectRange.bind(_this2, null, null);
    _this2.resetFrom = _this2.resetFrom.bind(_this2);
    _this2.resetTo = _this2.resetTo.bind(_this2);
    _this2.performUpdateFrom = _this2.performUpdateFrom.bind(_this2);
    _this2.performUpdateTo = _this2.performUpdateTo.bind(_this2);
    _this2.performUpdateToAndFrom = _this2.performUpdateToAndFrom.bind(_this2);
    _this2.termTitle = _this2.termTitle.bind(_this2);
    _this2.memoized = {
      fieldSchema: memoize(getSchemaProperty),
      validIncrements: memoize(RangeFacet.validIncrements)
    };
    _this2.state = _objectSpread(_objectSpread({}, RangeFacet.initialStateValues(props)), {}, {
      "facetClosing": false,
      "expanded": false
    });
    return _this2;
  }
  _inherits(RangeFacet, _React$PureComponent);
  return _createClass(RangeFacet, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var previousToVal = pastProps.toVal,
        previousFromVal = pastProps.fromVal,
        previousIncluding = pastProps.including;
      var _this$props = this.props,
        toVal = _this$props.toVal,
        fromVal = _this$props.fromVal,
        including = _this$props.including;
      if (toVal !== previousToVal || fromVal !== previousFromVal) {
        // console.log("update occurred! toVal ", previousToVal, " -> ", toVal);
        // console.log("update occurred! fromVal ", previousFromVal, " -> ", fromVal);
        // force manual update TODO: update for specific filter block switch circumstances
        this.setState({
          toVal: toVal,
          fromVal: fromVal
        });
      }

      // Switching to excluding; rebuild tooltips
      if (previousIncluding && !including) {
        ReactTooltip.rebuild();
      }
    }
  }, {
    key: "setFrom",
    value: function setFrom(value, callback) {
      var facet = this.props.facet;
      // console.log("setFrom called with", value);
      try {
        var fromVal = RangeFacet.parseAndValidate(facet, value);
        this.setState({
          fromVal: fromVal
        }, callback);
      } catch (e) {
        console.error("Couldn't set value", e);
      }
    }
  }, {
    key: "setTo",
    value: function setTo(value, callback) {
      var facet = this.props.facet;
      // console.log("setTo called with", value);
      try {
        var toVal = RangeFacet.parseAndValidate(facet, value);
        this.setState({
          toVal: toVal
        }, callback);
      } catch (e) {
        console.error("Couldn't set value", e);
      }
    }
  }, {
    key: "setToAndFrom",
    value: function setToAndFrom(toValue, fromValue, callback) {
      var facet = this.props.facet;
      try {
        var fromVal = RangeFacet.parseAndValidate(facet, fromValue);
        var toVal = RangeFacet.parseAndValidate(facet, toValue);
        this.setState({
          toVal: toVal,
          fromVal: fromVal
        }, callback);
      } catch (e) {
        console.error("Couldn't set value", e);
      }
    }
  }, {
    key: "performUpdateFrom",
    value: function performUpdateFrom(callback) {
      var _this$props2 = this.props,
        onFilter = _this$props2.onFilter,
        facet = _this$props2.facet;
      var fromVal = this.state.fromVal;
      // console.log("performUpdateFrom", fromVal);
      onFilter(_objectSpread(_objectSpread({}, facet), {}, {
        field: facet.field + ".from",
        facetFieldName: facet.field // Used to inform UI in FacetList/index only.
      }), {
        key: fromVal
      }, callback);
    }
  }, {
    key: "performUpdateTo",
    value: function performUpdateTo(callback) {
      var _this$props3 = this.props,
        onFilter = _this$props3.onFilter,
        facet = _this$props3.facet;
      var toVal = this.state.toVal;
      // console.log("performUpdateTo", toVal);
      onFilter(_objectSpread(_objectSpread({}, facet), {}, {
        field: facet.field + ".to",
        facetFieldName: facet.field // Used to inform UI in FacetList/index only.
      }), {
        key: toVal
      }, callback);
    }
  }, {
    key: "performUpdateToAndFrom",
    value: function performUpdateToAndFrom(callback) {
      var _this$props4 = this.props,
        onFilterMultiple = _this$props4.onFilterMultiple,
        facet = _this$props4.facet;
      var _this$state = this.state,
        toVal = _this$state.toVal,
        fromVal = _this$state.fromVal;
      // console.log("performUpdate", toVal, fromVal, facet.field);
      onFilterMultiple([{
        facet: _objectSpread(_objectSpread({}, facet), {}, {
          field: facet.field + ".from",
          facetFieldName: facet.field // Used to inform UI in FacetList/index only.
        }),

        term: {
          key: fromVal
        }
      }, {
        facet: _objectSpread(_objectSpread({}, facet), {}, {
          field: facet.field + ".to",
          facetFieldName: facet.field // Used to inform UI in FacetList/index only.
        }),

        term: {
          key: toVal
        }
      }], callback);
    }
  }, {
    key: "resetFrom",
    value: function resetFrom(callback) {
      var _this3 = this;
      this.setFrom(null, function () {
        _this3.performUpdateFrom(callback);
      });
    }
  }, {
    key: "resetTo",
    value: function resetTo(callback) {
      var _this4 = this;
      this.setTo(null, function () {
        _this4.performUpdateTo(callback);
      });
    }
  }, {
    key: "selectRange",
    value: function selectRange(to, from, callback) {
      var _this5 = this;
      this.setToAndFrom(to, from, function () {
        _this5.performUpdateToAndFrom(callback);
      });
    }
  }, {
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      e.preventDefault();
      var _this$props5 = this.props,
        onToggleOpen = _this$props5.onToggleOpen,
        field = _this$props5.facet.field,
        _this$props5$facetOpe = _this$props5.facetOpen,
        facetOpen = _this$props5$facetOpe === void 0 ? false : _this$props5$facetOpe;
      onToggleOpen(field, !facetOpen);
    }
  }, {
    key: "handleExpandListToggleClick",
    value: function handleExpandListToggleClick(e) {
      e.preventDefault();
      this.setState(function (_ref2) {
        var expanded = _ref2.expanded;
        return {
          'expanded': !expanded
        };
      });
    }

    /**
     * If no other transformations specified, and have a large number, then
     * condense it using `toExponential`.
     */
  }, {
    key: "termTitle",
    value: function termTitle(value) {
      var allowJSX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var _this$props6 = this.props,
        facet = _this$props6.facet,
        termTransformFxn = _this$props6.termTransformFxn;
      return formatRangeVal(termTransformFxn, facet, value, allowJSX);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
        schemas = _this$props7.schemas,
        termTransformFxn = _this$props7.termTransformFxn,
        itemTypeForSchemas = _this$props7.itemTypeForSchemas,
        facet = _this$props7.facet,
        propTitle = _this$props7.title,
        isStatic = _this$props7.isStatic,
        savedFromVal = _this$props7.fromVal,
        savedToVal = _this$props7.toVal,
        facetOpen = _this$props7.facetOpen,
        openPopover = _this$props7.openPopover,
        setOpenPopover = _this$props7.setOpenPopover,
        filteringFieldTerm = _this$props7.filteringFieldTerm,
        including = _this$props7.including;
      var aggregation_type = facet.aggregation_type,
        _facet$field_type2 = facet.field_type,
        field_type = _facet$field_type2 === void 0 ? "number" : _facet$field_type2,
        field = facet.field,
        _facet$ranges = facet.ranges,
        ranges = _facet$ranges === void 0 ? [] : _facet$ranges,
        _facet$min = facet.min,
        minValue = _facet$min === void 0 ? null : _facet$min,
        _facet$min_as_string = facet.min_as_string,
        minDateTime = _facet$min_as_string === void 0 ? null : _facet$min_as_string,
        _facet$max = facet.max,
        maxValue = _facet$max === void 0 ? null : _facet$max,
        _facet$max_as_string = facet.max_as_string,
        maxDateTime = _facet$max_as_string === void 0 ? null : _facet$max_as_string,
        _facet$title = facet.title,
        facetTitle = _facet$title === void 0 ? null : _facet$title,
        _facet$description = facet.description,
        facetSchemaDescription = _facet$description === void 0 ? null : _facet$description,
        _facet$hide_facet_cou = facet.hide_facet_counts,
        hideDocCounts = _facet$hide_facet_cou === void 0 ? false : _facet$hide_facet_cou;
      var fieldSchema = this.memoized.fieldSchema(field, schemas, itemTypeForSchemas);
      var fieldSchemaDescription = (fieldSchema || {}).description; // fieldSchema not present if no schemas loaded yet.
      var _this$state2 = this.state,
        fromVal = _this$state2.fromVal,
        toVal = _this$state2.toVal,
        expanded = _this$state2.expanded;
      var _this$memoized$validI = this.memoized.validIncrements(facet),
        fromIncrements = _this$memoized$validI.fromIncrements,
        toIncrements = _this$memoized$validI.toIncrements;
      var fromTitle, toTitle;

      // This may be deprecated to some extent, since fromTitle/toTitle are only
      // rendered by RangeDropdown if value is present now.
      // We can consider adjusting+moving this logic into RangeDropdown itself, using
      // `formatRangeVal` in place of termTitle.
      if (field_type === "number" || field_type === "integer") {
        if (aggregation_type === "stats") {
          fromTitle = typeof fromVal === 'number' ? this.termTitle(fromVal) : typeof minValue === "number" ? this.termTitle(minValue) : /*#__PURE__*/React.createElement("em", null, "-Infinite");
          toTitle = typeof toVal === 'number' ? this.termTitle(toVal) : typeof maxValue === "number" ? this.termTitle(maxValue) : /*#__PURE__*/React.createElement("em", null, "Infinite");
        } else if (aggregation_type === "range") {
          var _ranges$ = ranges[0],
            firstRange = _ranges$ === void 0 ? null : _ranges$;
          var lastRange = ranges[ranges.length - 1] || {};
          fromTitle = typeof fromVal === 'number' ? this.termTitle(fromVal) : typeof firstRange.from === "number" ? this.termTitle(firstRange.from) : /*#__PURE__*/React.createElement("em", null, "-Infinite");
          toTitle = typeof toVal === 'number' ? this.termTitle(toVal) : typeof lastRange.to === "number" ? this.termTitle(lastRange.to) : /*#__PURE__*/React.createElement("em", null, "Infinite");
        }
      } else if (field_type === "date") {
        fromTitle = this.termTitle(fromVal && typeof fromVal === 'string' ? fromVal : minDateTime || 0);
        toTitle = this.termTitle(toVal && typeof toVal === 'string' ? toVal : maxDateTime) || /*#__PURE__*/React.createElement("em", null, "None");
        console.log("DATE VALS", fromVal, facet.field, minDateTime, 0, fromTitle, toTitle);
      } else {
        throw new Error("Expected number|integer or date field_type. " + field + ' ' + field_type);
      }
      return /*#__PURE__*/React.createElement("div", {
        className: "facet range-facet" + (facetOpen ? ' open' : ' closed'),
        "data-field": facet.field
      }, /*#__PURE__*/React.createElement("h5", {
        className: "facet-title",
        onClick: including ? this.handleOpenToggleClick : null
      }, /*#__PURE__*/React.createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, including ? /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-" + (facetOpen ? "minus fas" : "plus fas")
      }) : /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-exclamation-triangle text-warning fas",
        "data-tip": "Range Facets cannot be edited while in \"excluding\" mode. "
      })), /*#__PURE__*/React.createElement("div", {
        className: "col px-0 line-height-1"
      }, /*#__PURE__*/React.createElement("span", {
        "data-tip": facetSchemaDescription || fieldSchemaDescription,
        "data-place": "right"
      }, propTitle || facetTitle || field), /*#__PURE__*/React.createElement(ExtendedDescriptionPopoverIcon, {
        fieldSchema: fieldSchema,
        facet: facet,
        openPopover: openPopover,
        setOpenPopover: setOpenPopover
      })), /*#__PURE__*/React.createElement(Fade, {
        "in": !(facetOpen || savedFromVal !== null || savedToVal !== null)
      }, /*#__PURE__*/React.createElement("span", {
        className: "closed-terms-count col-auto px-0" + (savedFromVal !== null || savedToVal !== null ? " some-selected" : "")
      }, isStatic ? /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-" + (savedFromVal !== null || savedToVal !== null ? "circle" : "minus-circle"),
        style: {
          opacity: savedFromVal !== null || savedToVal !== null ? 0.75 : 0.25
        }
      }) : /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-greater-than-equal fas"
      })))), /*#__PURE__*/React.createElement("div", {
        className: "facet-list",
        "data-open": including ? facetOpen : false,
        "data-any-active": savedFromVal || savedToVal ? true : false
      }, /*#__PURE__*/React.createElement(PartialList, {
        className: "inner-panel",
        open: including ? facetOpen : false,
        persistent: [/*#__PURE__*/React.createElement(RangeClear, {
          savedFromVal: savedFromVal,
          savedToVal: savedToVal,
          facet: facet,
          fieldSchema: fieldSchema,
          termTransformFxn: termTransformFxn,
          filteringFieldTerm: filteringFieldTerm,
          resetAll: this.resetAll,
          resetFrom: fromVal !== null ? this.resetFrom : null,
          resetTo: toVal !== null ? this.resetTo : null,
          key: 0
        })],
        collapsible: [/*#__PURE__*/React.createElement("div", {
          className: "range-drop-group row",
          key: 0
        }, /*#__PURE__*/React.createElement("div", {
          className: "range-drop col-12 col-sm-6"
        }, /*#__PURE__*/React.createElement("label", {
          className: "mb-0 small me-07"
        }, "From:"), /*#__PURE__*/React.createElement(RangeDropdown, {
          title: fromTitle,
          value: fromVal,
          savedValue: savedFromVal,
          max: toVal || null,
          increments: fromIncrements,
          variant: "outline-secondary",
          onSelect: this.setFrom,
          update: this.performUpdateFrom,
          termTransformFxn: termTransformFxn,
          facet: facet,
          id: "from_" + field,
          reset: fromVal !== null ? this.resetFrom : null
        })), /*#__PURE__*/React.createElement("div", {
          className: "range-drop col-12 col-sm-6"
        }, /*#__PURE__*/React.createElement("label", {
          className: "mb-0 small ms-05 me-07"
        }, "To:"), /*#__PURE__*/React.createElement(RangeDropdown, {
          title: toTitle,
          value: toVal,
          savedValue: savedToVal,
          min: fromVal || null,
          increments: toIncrements,
          termTransformFxn: termTransformFxn,
          variant: "outline-secondary",
          onSelect: this.setTo,
          update: this.performUpdateTo,
          facet: facet,
          id: "to_" + field,
          reset: toVal !== null ? this.resetTo : null
        }))), ranges && ranges.length > 0 ? /*#__PURE__*/React.createElement(ListOfRanges, _extends({
          key: 1
        }, this.props, {
          expanded: expanded,
          hideDocCounts: hideDocCounts,
          onToggleExpanded: this.handleExpandListToggleClick,
          selectRange: this.selectRange
        })) : null]
      })));
    }
  }], [{
    key: "parseAndValidate",
    value: function parseAndValidate(facet, value) {
      var _facet$field_type3 = facet.field_type,
        field_type = _facet$field_type3 === void 0 ? "number" : _facet$field_type3,
        _facet$number_step = facet.number_step,
        number_step = _facet$number_step === void 0 ? "any" : _facet$number_step;
      if (value === "" || value === null) {
        return null;
      }
      if (field_type === "date") {
        // Todo check if valid date string and set state.valid === false, upon which
        // to deny ability to apply.
        return value.toString();
      }
      var numVal = field_type === "integer" ? parseInt(value) : parseFloat(value);
      if (isNaN(numVal)) {
        throw new Error("Is not a number - " + numVal);
      }
      if (number_step === "any") {
        return numVal;
      }
      if (typeof number_step !== "number" || isNaN(number_step) || number_step <= 0) {
        console.error("Expected number_step to be a positive number");
        return numVal;
      }

      // Remove trailing decimals (if any) (round down)
      // Be careful re: float operations (imprecise) and favor integers
      if (number_step >= 1) {
        numVal = Math.floor(numVal / number_step) * number_step;
      } else {
        var diviser = Math.round(1 / number_step);
        numVal = Math.floor(numVal * diviser) / diviser;
      }
      return numVal;
    }
  }, {
    key: "validIncrements",
    value: function (facet) {
      var min = facet.min,
        max = facet.max,
        increments = facet.increments,
        ranges = facet.ranges;
      function ensureWithinRange(increment) {
        if (typeof min === "number" && increment < min) return false;
        if (typeof max === "number" && increment > max) return false;
        return true;
      }
      if (Array.isArray(increments)) {
        var validIncrements = increments.filter(ensureWithinRange);
        return {
          "fromIncrements": validIncrements,
          "toIncrements": validIncrements
        };
      } else if (increments) {
        var _ref4 = increments || {},
          _ref4$from = _ref4.from,
          fromIncrementsOrig = _ref4$from === void 0 ? [] : _ref4$from,
          _ref4$to = _ref4.to,
          toIncrementsOrig = _ref4$to === void 0 ? [] : _ref4$to;
        return {
          "fromIncrements": fromIncrementsOrig.filter(ensureWithinRange),
          "toIncrements": toIncrementsOrig.filter(ensureWithinRange)
        };
      } else if (Array.isArray(ranges)) {
        var allIncrements = new Set();
        ranges.forEach(function (_ref5) {
          var doc_count = _ref5.doc_count,
            fromInc = _ref5.from,
            toInc = _ref5.to;
          // Preserve all values (incl. if no doc_count)
          allIncrements.add(fromInc);
          allIncrements.add(toInc);
        });
        var allIncsArr = _toConsumableArray(allIncrements).sort();
        return {
          "fromIncrements": allIncsArr,
          "toIncrements": allIncsArr
        };
      }
      return {
        "fromIncrements": [],
        "toIncrements": []
      };
    }
  }, {
    key: "initialStateValues",
    value: function initialStateValues(props) {
      var fromVal = props.fromVal,
        toVal = props.toVal,
        _props$facet$field_ty = props.facet.field_type,
        field_type = _props$facet$field_ty === void 0 ? "number" : _props$facet$field_ty;
      var state = {
        fromVal: fromVal,
        toVal: toVal
      };
      if (field_type === "date") {
        // Convert to strings so e.g. "2018" doesn't get interpreted as unix timestamp.
        state.fromVal = fromVal && fromVal.toString() || null;
        state.toVal = toVal && toVal.toString() || null;
      }
      return state;
    }
  }]);
}(React.PureComponent);
var ListOfRanges = /*#__PURE__*/React.memo(function (props) {
  var facet = props.facet,
    facetOpen = props.facetOpen,
    facetClosing = props.facetClosing,
    _props$persistentCoun = props.persistentCount,
    persistentCount = _props$persistentCoun === void 0 ? 10 : _props$persistentCoun,
    selectRange = props.selectRange,
    expanded = props.expanded,
    onToggleExpanded = props.onToggleExpanded,
    termTransformFxn = props.termTransformFxn,
    toVal = props.toVal,
    fromVal = props.fromVal,
    filteringFieldTerm = props.filteringFieldTerm,
    hideDocCounts = props.hideDocCounts;
  var _facet$ranges2 = facet.ranges,
    ranges = _facet$ranges2 === void 0 ? [] : _facet$ranges2,
    facetField = facet.field;

  /** Create range components and sort by status (selected->omitted->unselected) */
  var _useMemo = useMemo(function () {
      var _ref6 = filteringFieldTerm || {},
        currFilteringField = _ref6.field,
        currFilteringTerm = _ref6.term;
      // Ranges always presumed to have a from & to, so ignore if filtering a single value/term.

      var _segmentComponentsByS = segmentComponentsByStatus(ranges.map(function (range) {
          var _range$from = range.from,
            rangeFrom = _range$from === void 0 ? null : _range$from,
            _range$to = range.to,
            rangeTo = _range$to === void 0 ? null : _range$to;
          var isFiltering = currFilteringField === facetField && (
          // Sometimes a range may be 0 - 0 (and result in single value instead of array for currFilteringTerm)

          Array.isArray(currFilteringTerm) && rangeFrom === currFilteringTerm[0] && rangeTo === currFilteringTerm[1] || currFilteringTerm === rangeTo && currFilteringTerm === rangeFrom);
          return /*#__PURE__*/React.createElement(RangeTerm, {
            facet: facet,
            range: range,
            termTransformFxn: termTransformFxn,
            selectRange: selectRange,
            isFiltering: isFiltering,
            hideDocCounts: hideDocCounts,
            key: "".concat(rangeFrom, "-").concat(rangeTo),
            status: getRangeStatus(range, toVal, fromVal)
          });
        })),
        _segmentComponentsByS2 = _segmentComponentsByS.selected,
        selectedTermComponents = _segmentComponentsByS2 === void 0 ? [] : _segmentComponentsByS2,
        _segmentComponentsByS3 = _segmentComponentsByS.omitted,
        omittedTermComponents = _segmentComponentsByS3 === void 0 ? [] : _segmentComponentsByS3,
        _segmentComponentsByS4 = _segmentComponentsByS.none,
        unselectedTermComponents = _segmentComponentsByS4 === void 0 ? [] : _segmentComponentsByS4;
      var selectedLen = selectedTermComponents.length;
      var omittedLen = omittedTermComponents.length;
      var unselectedLen = unselectedTermComponents.length;
      var totalLen = selectedLen + omittedLen + unselectedLen;
      var termComponents = selectedTermComponents.concat(omittedTermComponents).concat(unselectedTermComponents);
      var activeTermComponents = termComponents.slice(0, selectedLen + omittedLen);
      var retObj = {
        termComponents: termComponents,
        activeTermComponents: activeTermComponents,
        unselectedTermComponents: unselectedTermComponents,
        selectedLen: selectedLen,
        omittedLen: omittedLen,
        unselectedLen: unselectedLen,
        totalLen: totalLen
      };
      if (totalLen <= Math.max(persistentCount, selectedLen + omittedLen)) {
        return retObj;
      }
      retObj.persistentTerms = []; //termComponents.slice(0, unselectedStartIdx);

      var i;
      for (i = selectedLen + omittedLen; i < persistentCount; i++) {
        retObj.persistentTerms.push(termComponents[i]);
      }
      retObj.collapsibleTerms = termComponents.slice(i);
      retObj.collapsibleTermsCount = totalLen - i;
      retObj.collapsibleTermsItemCount = retObj.collapsibleTerms.reduce(function (m, termComponent) {
        return m + (termComponent.props.range.doc_count || 0);
      }, 0);
      return retObj;
    }, [ranges, persistentCount, toVal, fromVal, filteringFieldTerm]),
    termComponents = _useMemo.termComponents,
    activeTermComponents = _useMemo.activeTermComponents,
    unselectedTermComponents = _useMemo.unselectedTermComponents,
    totalLen = _useMemo.totalLen,
    selectedLen = _useMemo.selectedLen,
    omittedLen = _useMemo.omittedLen,
    unselectedLen = _useMemo.unselectedLen,
    _useMemo$persistentTe = _useMemo.persistentTerms,
    persistentTerms = _useMemo$persistentTe === void 0 ? null : _useMemo$persistentTe,
    _useMemo$collapsibleT = _useMemo.collapsibleTerms,
    collapsibleTerms = _useMemo$collapsibleT === void 0 ? null : _useMemo$collapsibleT,
    _useMemo$collapsibleT2 = _useMemo.collapsibleTermsCount,
    collapsibleTermsCount = _useMemo$collapsibleT2 === void 0 ? 0 : _useMemo$collapsibleT2,
    _useMemo$collapsibleT3 = _useMemo.collapsibleTermsItemCount,
    collapsibleTermsItemCount = _useMemo$collapsibleT3 === void 0 ? 0 : _useMemo$collapsibleT3;
  var commonProps = {
    "data-any-active": !!(selectedLen || omittedLen),
    "data-all-active": totalLen === selectedLen + omittedLen,
    "data-open": facetOpen,
    "className": "facet-list",
    "key": "facetlist"
  };
  if (Array.isArray(collapsibleTerms) && collapsibleTerms.length > 0) {
    var expandButtonTitle;
    if (expanded) {
      expandButtonTitle = /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-minus fas"
      }), " Collapse");
    } else {
      expandButtonTitle = /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-plus fas"
      }), " View ", collapsibleTermsCount, " More", /*#__PURE__*/React.createElement("span", {
        className: "pull-right"
      }, collapsibleTermsItemCount));
    }
    return /*#__PURE__*/React.createElement("div", commonProps, /*#__PURE__*/React.createElement(PartialList, {
      className: "mb-0 active-terms-pl",
      open: facetOpen,
      persistent: activeTermComponents,
      collapsible: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PartialList, {
        className: "mb-0",
        open: expanded,
        persistent: persistentTerms,
        collapsible: collapsibleTerms
      }), /*#__PURE__*/React.createElement("div", {
        className: "pt-08 pb-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "view-more-button",
        onClick: onToggleExpanded
      }, expandButtonTitle)))
    }));
  } else {
    return /*#__PURE__*/React.createElement("div", commonProps, /*#__PURE__*/React.createElement(PartialList, {
      className: "mb-0 active-terms-pl",
      open: facetOpen,
      persistent: activeTermComponents,
      collapsible: unselectedTermComponents
    }));
  }
});

/**
 * Used to render a term with range functionality in FacetList. Basically same as FacetTermsList > Term... maybe merge later
 */
export var RangeTerm = /*#__PURE__*/function (_React$PureComponent2) {
  function RangeTerm(props) {
    var _this6;
    _classCallCheck(this, RangeTerm);
    _this6 = _callSuper(this, RangeTerm, [props]);
    _this6.handleClick = _this6.handleClick.bind(_this6);
    return _this6;
  }
  _inherits(RangeTerm, _React$PureComponent2);
  return _createClass(RangeTerm, [{
    key: "handleClick",
    value: function handleClick(e) {
      var _this$props8 = this.props,
        range = _this$props8.range,
        selectRange = _this$props8.selectRange,
        status = _this$props8.status;
      var _range$to2 = range.to,
        to = _range$to2 === void 0 ? null : _range$to2,
        _range$from2 = range.from,
        from = _range$from2 === void 0 ? null : _range$from2;
      e.preventDefault();
      e.stopPropagation();
      var isSelected = status === "selected";
      selectRange(isSelected ? null : to, isSelected ? null : from);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
        range = _this$props9.range,
        status = _this$props9.status,
        _this$props9$isFilter = _this$props9.isFiltering,
        isFiltering = _this$props9$isFilter === void 0 ? false : _this$props9$isFilter,
        _this$props9$hideDocC = _this$props9.hideDocCounts,
        hideDocCounts = _this$props9$hideDocC === void 0 ? false : _this$props9$hideDocC;
      var doc_count = range.doc_count,
        from = range.from,
        to = range.to,
        label = range.label;
      var icon = null;
      var title = (typeof from !== 'undefined' ? from : "≤ ") + (typeof from !== 'undefined' && typeof to !== 'undefined' ? ' - ' : '') + (typeof to !== 'undefined' ? to : '+ ');
      if (isFiltering) {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon fas icon-circle-notch icon-spin icon-fw"
        });
      } else if (status === 'selected' || status === 'omitted') {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon icon-dot-circle icon-fw fas"
        });
      } else {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon icon-circle icon-fw unselected far"
        });
      }
      if (!title || title === 'null' || title === 'undefined') {
        title = 'None';
      }
      var displayLabel;
      if (label && label.includes("(")) {
        // if there are parenthesis, don't add another set
        displayLabel = label;
      } else if (label) {
        displayLabel = "(" + label + ")";
      } else {
        displayLabel = null;
      }
      return /*#__PURE__*/React.createElement("li", {
        className: "facet-list-element ",
        key: label,
        "data-key": label
      }, /*#__PURE__*/React.createElement("a", {
        className: "term",
        "data-selected": status !== 'none',
        href: "#",
        onClick: this.handleClick,
        "data-term": label
      }, /*#__PURE__*/React.createElement("span", {
        className: "facet-selector"
      }, icon), /*#__PURE__*/React.createElement("span", {
        className: "facet-item",
        "data-tip": title.length > 30 ? title : null
      }, title, " ", displayLabel), !hideDocCounts ? /*#__PURE__*/React.createElement("span", {
        className: "facet-count"
      }, doc_count || 0) : null));
    }
  }]);
}(React.PureComponent);
RangeTerm.propTypes = {
  'facet': PropTypes.shape({
    'field': PropTypes.string.isRequired
  }).isRequired,
  'range': PropTypes.shape({
    'from': PropTypes.number,
    'to': PropTypes.number,
    'label': PropTypes.string,
    'doc_count': PropTypes.number
  }).isRequired,
  'selectRange': PropTypes.func,
  'isFiltering': PropTypes.bool,
  'status': PropTypes.string,
  // TODO Since only 3 (?) values for this, should make into integer/enum.
  'hideDocCounts': PropTypes.bool
};
export function FormattedToFromRangeValue(props) {
  var termTransformFxn = props.termTransformFxn,
    facet = props.facet,
    _props$title = props.title,
    abbreviatedTitle = _props$title === void 0 ? /*#__PURE__*/React.createElement("em", null, "N") : _props$title,
    _props$from = props.from,
    from = _props$from === void 0 ? null : _props$from,
    _props$to = props.to,
    to = _props$to === void 0 ? null : _props$to;
  if (from === null && to === null) {
    throw new Error("Expected at least from or to value to be present");
  }
  var fromTitle = formatRangeVal(termTransformFxn, facet, from);
  var toTitle = formatRangeVal(termTransformFxn, facet, to);
  if (from !== null && to !== null) {
    // Both To and From present
    return /*#__PURE__*/React.createElement(React.Fragment, null, fromTitle, " ", /*#__PURE__*/React.createElement("i", {
      className: "icon fas icon-less-than-equal icon-xs px-1"
    }), " ", abbreviatedTitle, " ", /*#__PURE__*/React.createElement("i", {
      className: "icon fas icon-less-than-equal icon-xs px-1"
    }), " ", toTitle);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, toTitle !== null ? /*#__PURE__*/React.createElement(React.Fragment, null, abbreviatedTitle, " ", /*#__PURE__*/React.createElement("i", {
    className: "icon fas icon-less-than-equal icon-xs px-1"
  }), " ", toTitle) : null, fromTitle !== null ? /*#__PURE__*/React.createElement(React.Fragment, null, fromTitle, " ", /*#__PURE__*/React.createElement("i", {
    className: "icon fas icon-less-than-equal icon-xs px-1"
  }), " ", abbreviatedTitle) : null);
}
var RangeClear = /*#__PURE__*/React.memo(function (props) {
  var savedFromVal = props.savedFromVal,
    savedToVal = props.savedToVal,
    resetTo = props.resetTo,
    resetFrom = props.resetFrom,
    resetAll = props.resetAll,
    facet = props.facet,
    _props$fieldSchema = props.fieldSchema,
    fieldSchema = _props$fieldSchema === void 0 ? null : _props$fieldSchema,
    termTransformFxn = props.termTransformFxn,
    filteringFieldTerm = props.filteringFieldTerm;
  var facetField = facet.field,
    facetTitle = facet.title,
    _facet$abbreviation = facet.abbreviation,
    facetAbbreviation = _facet$abbreviation === void 0 ? null : _facet$abbreviation;
  var _ref7$abbreviation = (fieldSchema || {}).abbreviation,
    fieldAbbreviation = _ref7$abbreviation === void 0 ? null : _ref7$abbreviation;
  var _ref8 = filteringFieldTerm || {},
    currFilteringField = _ref8.field,
    currFilteringTerm = _ref8.term;
  var abbreviatedTitle = facetAbbreviation || fieldAbbreviation || (facetTitle.length > 5 ? /*#__PURE__*/React.createElement("em", null, "N") : facetTitle);
  if (savedFromVal === null && savedToVal === null) {
    return null;
  }
  return /*#__PURE__*/React.createElement("li", {
    className: "selected facet-list-element clickable"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (savedFromVal !== null && savedToVal !== null) {
        // To and From both present
        resetAll();
      } else if (resetTo === null) {
        // Only From present
        resetFrom();
      } else {
        // Only To present
        resetTo();
      }
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "facet-selector"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-" + (currFilteringTerm === null && facetField === currFilteringField ? "circle-notch icon-spin" : "minus-circle")
  })), /*#__PURE__*/React.createElement("span", {
    className: "facet-item text-center",
    style: {
      marginLeft: "-5px"
    }
  }, /*#__PURE__*/React.createElement(FormattedToFromRangeValue, {
    termTransformFxn: termTransformFxn,
    facet: facet,
    from: savedFromVal,
    to: savedToVal,
    title: abbreviatedTitle
  }))));
});
var RangeDropdown = /*#__PURE__*/function (_React$PureComponent3) {
  function RangeDropdown(props) {
    var _this7;
    _classCallCheck(this, RangeDropdown);
    _this7 = _callSuper(this, RangeDropdown, [props]);
    _this7.state = {
      showMenu: false,
      toggling: false
    };
    _this7.onTextInputChange = _this7.onTextInputChange.bind(_this7);
    _this7.onDropdownSelect = _this7.onDropdownSelect.bind(_this7);
    _this7.onTextInputFormSubmit = _this7.onTextInputFormSubmit.bind(_this7);
    _this7.onTextInputKeyDown = _this7.onTextInputKeyDown.bind(_this7);
    _this7.toggleDrop = _this7.toggleDrop.bind(_this7);
    _this7.onBlur = _this7.onBlur.bind(_this7);
    return _this7;
  }
  _inherits(RangeDropdown, _React$PureComponent3);
  return _createClass(RangeDropdown, [{
    key: "onTextInputChange",
    value: function onTextInputChange(evt) {
      var onSelect = this.props.onSelect;
      var nextValue = evt.target.value;
      onSelect(nextValue);
    }

    /** Handles _numbers_ only. */
  }, {
    key: "onDropdownSelect",
    value: function onDropdownSelect(evtKey) {
      var _this$props10 = this.props,
        onSelect = _this$props10.onSelect,
        savedValue = _this$props10.savedValue;
      if (parseFloat(evtKey) === savedValue) {
        return false;
      }

      // We previously supplied props.update as callback (2nd) arg to `onSelect`
      // here, but removed it since onBlur is ran when Dropdown menu loses focus
      // which itself then calls props.update again.
      onSelect(evtKey);
    }

    /** This is called when DropdownButton loses focus (onBlur) as well */
  }, {
    key: "onTextInputFormSubmit",
    value: function onTextInputFormSubmit(evt) {
      var _this$props11 = this.props,
        update = _this$props11.update,
        savedValue = _this$props11.savedValue,
        value = _this$props11.value;
      evt.preventDefault();
      evt.stopPropagation();
      if (!(savedValue !== value)) {
        return;
      }
      update();
      this.toggleDrop();
    }
  }, {
    key: "onTextInputKeyDown",
    value: function onTextInputKeyDown(evt) {
      if (evt.key === "Enter" || evt.keyCode === 13) {
        this.onTextInputFormSubmit(evt);
        this.toggleDrop();
      }
      console.log("evt.key", evt.key);
      console.log("evt.keycode", evt.keyCode);
    }
  }, {
    key: "toggleDrop",
    value: function toggleDrop() {
      var _this8 = this;
      var _this$state3 = this.state,
        showMenu = _this$state3.showMenu,
        toggling = _this$state3.toggling;
      // Note: toggling state addresses bug where state updates stack and end up resulting in no state change
      if (!toggling) {
        this.setState({
          showMenu: !showMenu,
          toggling: true
        }, function () {
          _this8.setState({
            toggling: false
          });
        });
      }
    }
  }, {
    key: "onBlur",
    value: function onBlur(evt) {
      // Update saved value with current value of input when clicking off
      this.onTextInputFormSubmit(evt);
    }
  }, {
    key: "render",
    value: function render() {
      var showMenu = this.state.showMenu;
      var _this$props12 = this.props,
        _this$props12$variant = _this$props12.variant,
        variant = _this$props12$variant === void 0 ? "outline-dark w-100" : _this$props12$variant,
        _this$props12$size = _this$props12.size,
        size = _this$props12$size === void 0 ? "xs" : _this$props12$size,
        _this$props12$disable = _this$props12.disabled,
        disabled = _this$props12$disable === void 0 ? false : _this$props12$disable,
        _this$props12$classNa = _this$props12.className,
        className = _this$props12$classNa === void 0 ? "rcol dropdown flex-grow-1" : _this$props12$classNa,
        propMin = _this$props12.min,
        propMax = _this$props12.max,
        value = _this$props12.value,
        savedValue = _this$props12.savedValue,
        _this$props12$placeho = _this$props12.placeholder,
        placeholder = _this$props12$placeho === void 0 ? "Type..." : _this$props12$placeho,
        title = _this$props12.title,
        termTransformFxn = _this$props12.termTransformFxn,
        id = _this$props12.id,
        facet = _this$props12.facet,
        _this$props12$increme = _this$props12.increments,
        increments = _this$props12$increme === void 0 ? [] : _this$props12$increme,
        _this$props12$reset = _this$props12.reset,
        reset = _this$props12$reset === void 0 ? null : _this$props12$reset,
        tooltip = _this$props12.tooltip;
      var updateAble = savedValue !== value;
      var _facet$field_type4 = facet.field_type,
        field_type = _facet$field_type4 === void 0 ? "number" : _facet$field_type4,
        fMin = facet.min,
        fMax = facet.max,
        _facet$number_step2 = facet.number_step,
        step = _facet$number_step2 === void 0 ? "any" : _facet$number_step2;
      var emptyValue = /*#__PURE__*/React.createElement("span", {
        className: "mx-1"
      }, "-");
      var showTitle = /*#__PURE__*/React.createElement("div", {
        className: "d-flex"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col px-0"
      }, value !== null ? title : emptyValue));
      if (field_type === "date") {
        return /*#__PURE__*/React.createElement(DropdownButton, {
          variant: variant,
          disabled: disabled,
          className: className,
          size: size,
          id: id,
          title: showTitle,
          show: showMenu,
          onToggle: this.toggleDrop,
          onBlur: this.onBlur,
          "data-tip": tooltip,
          "data-html": true
        }, /*#__PURE__*/React.createElement("form", {
          className: "inline-input-container pb-0 mb-0 border-0",
          onSubmit: this.onTextInputFormSubmit
        }, /*#__PURE__*/React.createElement("div", {
          className: "input-element-container"
        }, /*#__PURE__*/React.createElement("input", {
          type: "date",
          className: "form-control",
          value: value === null ? "" : value,
          "data-value": value,
          onKeyDown: this.onTextInputKeyDown,
          onChange: this.onTextInputChange
        })), /*#__PURE__*/React.createElement("button", {
          type: "submit",
          disabled: !updateAble,
          className: "btn border-0"
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw icon-check fas"
        }))));
      } else if (field_type === "number" || field_type === "integer") {
        var min = typeof propMin === "number" ? propMin : typeof fMin === "number" ? fMin : null;
        var max = propMax || fMax || null;
        var incrementsList = increments.slice();
        if (min !== null) incrementsList.push(min);
        if (max !== null) incrementsList.push(max);
        var menuOptsSet = incrementsList.sort(function (a, b) {
          return a - b;
        }).reduce(function (m, incr) {
          if (typeof incr !== "number") {
            return m;
          }
          m.add(incr); // Handles duplicates.
          return m;
        }, new Set());
        var menuOptions = _toConsumableArray(menuOptsSet).map(function (increment) {
          var optTitle = formatRangeVal(termTransformFxn, facet, increment);
          return /*#__PURE__*/React.createElement(DropdownItem, {
            disabled: disabled,
            key: increment,
            eventKey: increment === 0 ? increment.toString() : increment,
            active: increment === savedValue
          }, optTitle, increment === min ? /*#__PURE__*/React.createElement("small", null, " (min)") : null, increment === max ? /*#__PURE__*/React.createElement("small", null, " (max)") : null);
        });
        return /*#__PURE__*/React.createElement(DropdownButton, {
          variant: variant,
          disabled: disabled,
          className: className,
          size: size,
          id: id,
          onSelect: this.onDropdownSelect,
          title: showTitle,
          show: showMenu,
          onToggle: this.toggleDrop,
          onBlur: this.onBlur,
          "data-tip": tooltip,
          "data-html": true
        }, /*#__PURE__*/React.createElement("form", {
          className: "inline-input-container" + (menuOptions.length > 0 ? " has-options" : ""),
          onSubmit: this.onTextInputFormSubmit
        }, /*#__PURE__*/React.createElement("div", {
          className: "input-element-container"
        }, /*#__PURE__*/React.createElement("input", {
          type: "number",
          className: "form-control",
          placeholder: placeholder,
          step: step,
          onKeyDown: this.onTextInputKeyDown,
          onChange: this.onTextInputChange,
          value: value === null ? "" : value
        })), /*#__PURE__*/React.createElement("button", {
          type: "submit",
          disabled: !updateAble,
          className: "btn border-0"
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw icon-check fas"
        }))), menuOptions);
      } else {
        throw new Error("Expected number, integer, or date field type.");
      }
    }
  }]);
}(React.PureComponent);