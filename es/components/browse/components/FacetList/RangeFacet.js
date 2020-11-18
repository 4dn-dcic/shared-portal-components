'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import Collapse from 'react-bootstrap/esm/Collapse';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Fade from 'react-bootstrap/esm/Fade';
import Popover from 'react-bootstrap/esm/Popover';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import { LocalizedTime } from './../../../ui/LocalizedTime';
import { decorateNumberWithCommas } from './../../../util/value-transforms';
import { getSchemaProperty } from './../../../util/schema-transforms';
import { patchedConsoleInstance as console } from './../../../util/patched-console';
import { ExtendedDescriptionPopoverIcon } from './ExtendedDescriptionPopoverIcon';
export function getRangeValuesFromFiltersByField() {
  var facets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var facetsByFilterField = {};
  var valuesByField = {};
  facets.forEach(function (f) {
    if (f.aggregation_type !== "stats") {
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
        field_type = facet.field_type;
    valuesByField[facetField] = valuesByField[facetField] || {};
    var value = // Convert to float if numerical field type or leave as string if datetime, etc.
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
export var RangeFacet = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(RangeFacet, _React$PureComponent);

  var _super = _createSuper(RangeFacet);

  _createClass(RangeFacet, null, [{
    key: "parseAndValidate",
    value: function parseAndValidate(facet, value) {
      var _facet$field_type = facet.field_type,
          field_type = _facet$field_type === void 0 ? "integer" : _facet$field_type,
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
      } // Remove trailing decimals (if any) (round down)
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
    value: function validIncrements(facet) {
      var min = facet.min,
          max = facet.max,
          increments = facet.increments;

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
      }

      var _ref = increments || {},
          _ref$from = _ref.from,
          fromIncrementsOrig = _ref$from === void 0 ? [] : _ref$from,
          _ref$to = _ref.to,
          toIncrementsOrig = _ref$to === void 0 ? [] : _ref$to;

      return {
        "fromIncrements": fromIncrementsOrig.filter(ensureWithinRange),
        "toIncrements": toIncrementsOrig.filter(ensureWithinRange)
      };
    }
  }]);

  function RangeFacet(props) {
    var _this;

    _classCallCheck(this, RangeFacet);

    _this = _super.call(this, props);
    _this.handleOpenToggleClick = _this.handleOpenToggleClick.bind(_assertThisInitialized(_this));
    _this.setFrom = _this.setFrom.bind(_assertThisInitialized(_this));
    _this.setTo = _this.setTo.bind(_assertThisInitialized(_this));
    _this.resetFrom = _this.resetFrom.bind(_assertThisInitialized(_this));
    _this.resetTo = _this.resetTo.bind(_assertThisInitialized(_this));
    _this.performUpdateFrom = _this.performUpdateFrom.bind(_assertThisInitialized(_this));
    _this.performUpdateTo = _this.performUpdateTo.bind(_assertThisInitialized(_this));
    _this.termTitle = _this.termTitle.bind(_assertThisInitialized(_this));
    _this.memoized = {
      fieldSchema: memoize(getSchemaProperty),
      validIncrements: memoize(RangeFacet.validIncrements)
    };
    var fromVal = props.fromVal,
        toVal = props.toVal,
        _props$facet$field_ty = props.facet.field_type,
        field_type = _props$facet$field_ty === void 0 ? "number" : _props$facet$field_ty;
    _this.state = {
      fromVal: fromVal,
      toVal: toVal,
      facetClosing: false
    };

    if (field_type === "date") {
      // Convert to strings so e.g. "2018" doesn't get interpreted as unix timestamp.
      _this.state.fromVal = fromVal && fromVal.toString() || null;
      _this.state.toVal = toVal && toVal.toString() || null;
    }

    return _this;
  }

  _createClass(RangeFacet, [{
    key: "setFrom",
    value: function setFrom(value, callback) {
      var facet = this.props.facet;

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
    key: "performUpdateFrom",
    value: function performUpdateFrom() {
      var _this$props = this.props,
          onFilter = _this$props.onFilter,
          facet = _this$props.facet;
      var fromVal = this.state.fromVal;
      onFilter(_objectSpread(_objectSpread({}, facet), {}, {
        field: facet.field + ".from"
      }), {
        key: fromVal
      });
    }
  }, {
    key: "performUpdateTo",
    value: function performUpdateTo() {
      var _this$props2 = this.props,
          onFilter = _this$props2.onFilter,
          facet = _this$props2.facet;
      var toVal = this.state.toVal;
      onFilter(_objectSpread(_objectSpread({}, facet), {}, {
        field: facet.field + ".to"
      }), {
        key: toVal
      });
    }
  }, {
    key: "resetFrom",
    value: function resetFrom(e) {
      e.stopPropagation();
      this.setFrom(null, this.performUpdateFrom);
    }
  }, {
    key: "resetTo",
    value: function resetTo(e) {
      e.stopPropagation();
      this.setTo(null, this.performUpdateTo);
    }
  }, {
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      e.preventDefault();
      var _this$props3 = this.props,
          onToggleOpen = _this$props3.onToggleOpen,
          field = _this$props3.facet.field,
          _this$props3$facetOpe = _this$props3.facetOpen,
          facetOpen = _this$props3$facetOpe === void 0 ? false : _this$props3$facetOpe;
      onToggleOpen(field, !facetOpen);
    }
    /**
     * If no other transformations specified, and have a large number, then
     * condense it using `toExponential`.
     */

  }, {
    key: "termTitle",
    value: function termTitle(fieldName, value) {
      var allowJSX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var _this$props4 = this.props,
          _this$props4$facet$fi = _this$props4.facet.field_type,
          field_type = _this$props4$facet$fi === void 0 ? "number" : _this$props4$facet$fi,
          termTransformFxn = _this$props4.termTransformFxn;

      if (field_type === "date") {
        return /*#__PURE__*/React.createElement(LocalizedTime, {
          timestamp: value,
          localize: false
        });
      }

      if (field_type !== "number" && field_type !== "integer") {
        throw new Error("Expect field_type to be 'number' or 'date'.");
      }

      var transformedValue = termTransformFxn(fieldName, value, allowJSX);

      if (typeof transformedValue !== "number") {
        return transformedValue;
      }

      var absVal = Math.abs(transformedValue);

      if (absVal.toString().length <= 7) {
        // Else is too long and will go thru toPrecision or toExponential.
        if (absVal >= 1000) {
          return decorateNumberWithCommas(transformedValue);
        } else {
          return transformedValue;
        }
      }

      return transformedValue.toExponential(3);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          schemas = _this$props5.schemas,
          itemTypeForSchemas = _this$props5.itemTypeForSchemas,
          facet = _this$props5.facet,
          propTitle = _this$props5.title,
          isStatic = _this$props5.isStatic,
          savedFromVal = _this$props5.fromVal,
          savedToVal = _this$props5.toVal,
          facetOpen = _this$props5.facetOpen,
          openPopover = _this$props5.openPopover,
          setOpenPopover = _this$props5.setOpenPopover;
      var _facet$field_type2 = facet.field_type,
          field_type = _facet$field_type2 === void 0 ? "number" : _facet$field_type2,
          field = facet.field,
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
          facetSchemaDescription = _facet$description === void 0 ? null : _facet$description;
      var fieldSchema = this.memoized.fieldSchema(field, schemas, itemTypeForSchemas);
      var fieldSchemaDescription = (fieldSchema || {}).description; // fieldSchema not present if no schemas loaded yet.

      var _this$state = this.state,
          fromVal = _this$state.fromVal,
          toVal = _this$state.toVal;

      var _this$memoized$validI = this.memoized.validIncrements(facet),
          fromIncrements = _this$memoized$validI.fromIncrements,
          toIncrements = _this$memoized$validI.toIncrements;

      var fromTitle, toTitle;

      if (field_type === "number" || field_type === "integer") {
        fromTitle = typeof fromVal === 'number' ? this.termTitle(facet.field, fromVal) : typeof minValue === "number" ? this.termTitle(facet.field, minValue) : /*#__PURE__*/React.createElement("em", null, "-Infinite");
        toTitle = typeof toVal === 'number' ? this.termTitle(facet.field, toVal) : typeof maxValue === "number" ? this.termTitle(facet.field, maxValue) : /*#__PURE__*/React.createElement("em", null, "Infinite");
      } else if (field_type === "date") {
        fromTitle = this.termTitle(facet.field, fromVal && typeof fromVal === 'string' ? fromVal : minDateTime || 0);
        toTitle = this.termTitle(facet.field, toVal && typeof toVal === 'string' ? toVal : maxDateTime) || /*#__PURE__*/React.createElement("em", null, "None");
        console.log("DATE VALS", fromVal, facet.field, minDateTime, 0, fromTitle, toTitle);
      } else {
        throw new Error("Expected number|integer or date field_type. " + field + ' ' + field_type);
      }

      var isOpen = facetOpen || savedFromVal !== null || savedToVal !== null;
      return /*#__PURE__*/React.createElement("div", {
        className: "facet range-facet" + (isOpen ? ' open' : ' closed'),
        "data-field": facet.field
      }, /*#__PURE__*/React.createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, /*#__PURE__*/React.createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-" + (savedFromVal !== null || savedToVal !== null ? "dot-circle far" : isOpen ? "minus fas" : "plus fas")
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
        "in": !isOpen
      }, /*#__PURE__*/React.createElement("span", {
        className: "closed-terms-count col-auto px-0" + (savedFromVal !== null || savedToVal !== null ? " some-selected" : "")
      }, isStatic ? /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-" + (savedFromVal !== null || savedToVal !== null ? "circle" : "minus-circle"),
        style: {
          opacity: savedFromVal !== null || savedToVal !== null ? 0.75 : 0.25
        }
      }) : /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-greater-than-equal fas"
      })))), /*#__PURE__*/React.createElement(Collapse, {
        "in": isOpen
      }, /*#__PURE__*/React.createElement("div", {
        className: "inner-panel"
      }, /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "col-auto mb-0"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-greater-than-equal fas small"
      })), /*#__PURE__*/React.createElement(RangeDropdown, {
        title: fromTitle,
        value: fromVal,
        savedValue: savedFromVal,
        max: toVal || null,
        increments: fromIncrements,
        variant: typeof fromVal === "number" || savedFromVal ? "primary" : "outline-dark",
        onSelect: this.setFrom,
        update: this.performUpdateFrom,
        termTransformFxn: this.termTitle,
        facet: facet,
        id: "from_" + field,
        reset: fromVal !== null ? this.resetFrom : null
      })), /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement("label", {
        className: "col-auto mb-0"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-less-than-equal fas small"
      })), /*#__PURE__*/React.createElement(RangeDropdown, {
        title: toTitle,
        value: toVal,
        savedValue: savedToVal,
        min: fromVal || null,
        increments: toIncrements,
        variant: typeof toVal === "number" || savedToVal ? "primary" : "outline-dark",
        onSelect: this.setTo,
        update: this.performUpdateTo,
        termTransformFxn: this.termTitle,
        facet: facet,
        id: "to_" + field,
        reset: toVal !== null ? this.resetTo : null
      })))));
    }
  }]);

  return RangeFacet;
}(React.PureComponent);

var RangeDropdown = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(RangeDropdown, _React$PureComponent2);

  var _super2 = _createSuper(RangeDropdown);

  function RangeDropdown(props) {
    var _this2;

    _classCallCheck(this, RangeDropdown);

    _this2 = _super2.call(this, props);
    _this2.onTextInputChange = _this2.onTextInputChange.bind(_assertThisInitialized(_this2));
    _this2.onDropdownSelect = _this2.onDropdownSelect.bind(_assertThisInitialized(_this2));
    _this2.onTextInputFormSubmit = _this2.onTextInputFormSubmit.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(RangeDropdown, [{
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
      var _this$props6 = this.props,
          onSelect = _this$props6.onSelect,
          update = _this$props6.update,
          savedValue = _this$props6.savedValue;

      if (parseFloat(evtKey) === savedValue) {
        return false;
      }

      onSelect(evtKey, update);
    }
  }, {
    key: "onTextInputFormSubmit",
    value: function onTextInputFormSubmit(evt) {
      var _this$props7 = this.props,
          update = _this$props7.update,
          savedValue = _this$props7.savedValue,
          value = _this$props7.value;
      evt.preventDefault();
      evt.stopPropagation();

      if (!(savedValue !== value)) {
        return;
      }

      update();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          _this$props8$variant = _this$props8.variant,
          variant = _this$props8$variant === void 0 ? "outline-dark" : _this$props8$variant,
          _this$props8$size = _this$props8.size,
          size = _this$props8$size === void 0 ? "sm" : _this$props8$size,
          _this$props8$disabled = _this$props8.disabled,
          disabled = _this$props8$disabled === void 0 ? false : _this$props8$disabled,
          _this$props8$classNam = _this$props8.className,
          className = _this$props8$classNam === void 0 ? "range-dropdown-container col" : _this$props8$classNam,
          propMin = _this$props8.min,
          propMax = _this$props8.max,
          value = _this$props8.value,
          savedValue = _this$props8.savedValue,
          _this$props8$placehol = _this$props8.placeholder,
          placeholder = _this$props8$placehol === void 0 ? "Type..." : _this$props8$placehol,
          title = _this$props8.title,
          termTransformFxn = _this$props8.termTransformFxn,
          id = _this$props8.id,
          facet = _this$props8.facet,
          _this$props8$incremen = _this$props8.increments,
          increments = _this$props8$incremen === void 0 ? [] : _this$props8$incremen,
          _this$props8$reset = _this$props8.reset,
          reset = _this$props8$reset === void 0 ? null : _this$props8$reset;
      var updateAble = savedValue !== value;
      var _facet$field_type3 = facet.field_type,
          field_type = _facet$field_type3 === void 0 ? "number" : _facet$field_type3,
          fMin = facet.min,
          fMax = facet.max,
          _facet$number_step2 = facet.number_step,
          step = _facet$number_step2 === void 0 ? "any" : _facet$number_step2;
      var showTitle = title;

      if (typeof reset === "function") {
        showTitle = /*#__PURE__*/React.createElement("div", {
          className: "d-flex"
        }, /*#__PURE__*/React.createElement("div", {
          className: "clear-icon-container col-auto clickable d-flex align-items-center",
          onClick: reset,
          "data-tip": "Click to unset"
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw fas icon-minus-circle"
        })), /*#__PURE__*/React.createElement("div", {
          className: "col px-0"
        }, title));
      }

      if (field_type === "date") {
        return /*#__PURE__*/React.createElement(DropdownButton, _extends({
          variant: variant,
          disabled: disabled,
          className: className,
          size: size,
          id: id
        }, {
          alignRight: true,
          title: showTitle
        }), /*#__PURE__*/React.createElement("form", {
          className: "inline-input-container pb-0 mb-0 border-0",
          onSubmit: this.onTextInputFormSubmit
        }, /*#__PURE__*/React.createElement("div", {
          className: "input-element-container"
        }, /*#__PURE__*/React.createElement("input", {
          type: "date",
          className: "form-control",
          value: value,
          "data-value": value,
          onChange: this.onTextInputChange
        })), /*#__PURE__*/React.createElement("button", {
          type: "submit",
          disabled: !updateAble,
          className: "btn"
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw icon-check fas"
        }))));
      } else if (field_type === "number" || field_type === "integer") {
        var min = typeof propMin === "number" ? propMin : typeof fMin === "number" ? fMin : 0;
        var max = propMax || fMax || null;

        var menuOptsSet = _toConsumableArray(increments).concat([min]).concat([max]).sort(function (a, b) {
          return a - b;
        }).reduce(function (m, incr) {
          if (typeof incr !== "number") {
            return m;
          }

          m.add(incr); // Handles duplicates.

          return m;
        }, new Set());

        var menuOptions = _toConsumableArray(menuOptsSet).map(function (increment) {
          return /*#__PURE__*/React.createElement(DropdownItem, {
            disabled: disabled,
            key: increment,
            eventKey: increment,
            active: increment === savedValue
          }, termTransformFxn(facet.field, increment, true), increment === min ? /*#__PURE__*/React.createElement("small", null, " (min)") : null, increment === max ? /*#__PURE__*/React.createElement("small", null, " (max)") : null);
        });

        return /*#__PURE__*/React.createElement(DropdownButton, _extends({
          variant: variant,
          disabled: disabled,
          className: className,
          size: size,
          id: id
        }, {
          alignRight: true,
          onSelect: this.onDropdownSelect,
          title: showTitle
        }), /*#__PURE__*/React.createElement("form", {
          className: "inline-input-container",
          onSubmit: this.onTextInputFormSubmit
        }, /*#__PURE__*/React.createElement("div", {
          className: "input-element-container"
        }, /*#__PURE__*/React.createElement("input", _extends({
          type: "number",
          className: "form-control"
        }, {
          value: value,
          placeholder: placeholder,
          step: step
        }, {
          onChange: this.onTextInputChange
        }))), /*#__PURE__*/React.createElement("button", {
          type: "submit",
          disabled: !updateAble,
          className: "btn"
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw icon-check fas"
        }))), menuOptions);
      } else {
        throw new Error("Expected number, integer, or date field type.");
      }
    }
  }]);

  return RangeDropdown;
}(React.PureComponent);