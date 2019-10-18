'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RangeFacet = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _reactBootstrap = require("react-bootstrap");

var _patchedConsole = require("./../../../util/patched-console");

var _Collapse = require("./../../../ui/Collapse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RangeFacet =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(RangeFacet, _React$PureComponent);

  _createClass(RangeFacet, null, [{
    key: "parseNumber",
    value: function parseNumber(facet, value) {
      var _facet$field_type = facet.field_type,
          field_type = _facet$field_type === void 0 ? "integer" : _facet$field_type;

      if (value === "" || value === null) {
        return null;
      }

      var numVal = field_type === "integer" ? parseInt(value) : parseFloat(value);

      if (isNaN(numVal)) {
        throw new Error("Is not a number - " + numVal);
      }

      return numVal;
    }
  }, {
    key: "parseAndValidate",
    value: function parseAndValidate(facet, value) {
      var min = facet.min,
          max = facet.max;
      var numVal = RangeFacet.parseNumber(facet, value);

      if (numVal === null) {
        return null;
      }

      if (typeof min === "number") {
        if (min === numVal) {
          return null;
        }

        if (numVal < min) {
          return min;
        }
      }

      if (typeof max === "number") {
        if (max === numVal) {
          return null;
        }

        if (numVal > max) {
          return max;
        }
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
  }, {
    key: "getValueFromFilters",
    value: function getValueFromFilters(facet) {
      var filters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var field = facet.field;

      var toFilter = _underscore["default"].findWhere(filters, {
        field: field + ".to"
      });

      var fromFilter = _underscore["default"].findWhere(filters, {
        field: field + ".from"
      });

      var fromVal = null;
      var toVal = null;

      if (fromFilter) {
        fromVal = RangeFacet.parseNumber(facet, fromFilter.term);
      }

      if (toFilter) {
        toVal = RangeFacet.parseNumber(facet, toFilter.term);
      }

      return {
        fromVal: fromVal,
        toVal: toVal
      };
    }
  }]);

  function RangeFacet(props) {
    var _this;

    _classCallCheck(this, RangeFacet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RangeFacet).call(this, props));
    _this.handleOpenToggleClick = _this.handleOpenToggleClick.bind(_assertThisInitialized(_this));
    _this.setFrom = _this.setFrom.bind(_assertThisInitialized(_this));
    _this.setTo = _this.setTo.bind(_assertThisInitialized(_this));
    _this.resetFrom = _this.resetFrom.bind(_assertThisInitialized(_this));
    _this.resetTo = _this.resetTo.bind(_assertThisInitialized(_this));
    _this.performUpdateFrom = _this.performUpdateFrom.bind(_assertThisInitialized(_this));
    _this.performUpdateTo = _this.performUpdateTo.bind(_assertThisInitialized(_this));
    _this.memoized = {
      validIncrements: (0, _memoizeOne["default"])(RangeFacet.validIncrements),
      getValueFromFilters: (0, _memoizeOne["default"])(RangeFacet.getValueFromFilters)
    };
    _this.state = _objectSpread({
      facetOpen: props.defaultFacetOpen || false,
      facetClosing: false
    }, _this.memoized.getValueFromFilters(props.facet, props.filters));
    return _this;
  }

  _createClass(RangeFacet, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var _this2 = this;

      var _this$props = this.props,
          mounted = _this$props.mounted,
          defaultFacetOpen = _this$props.defaultFacetOpen,
          isStatic = _this$props.isStatic;
      this.setState(function (_ref2) {
        var currFacetOpen = _ref2.facetOpen;

        if (!pastProps.mounted && mounted && typeof defaultFacetOpen === 'boolean' && defaultFacetOpen !== pastProps.defaultFacetOpen) {
          return {
            'facetOpen': true
          };
        }

        if (defaultFacetOpen === true && !pastProps.defaultFacetOpen && !currFacetOpen) {
          return {
            'facetOpen': true
          };
        }

        if (currFacetOpen && isStatic && !pastProps.isStatic) {
          return {
            'facetOpen': false
          };
        }

        return null;
      }, function () {
        var facetOpen = _this2.state.facetOpen;

        if (pastState.facetOpen !== facetOpen) {
          _reactTooltip["default"].rebuild();
        }
      });
    }
  }, {
    key: "setFrom",
    value: function setFrom(value, callback) {
      var facet = this.props.facet;
      var min = facet.min,
          max = facet.max;

      try {
        var fromVal = RangeFacet.parseAndValidate(facet, value);
        this.setState(function (_ref3) {
          var toVal = _ref3.toVal;

          if (fromVal === null || fromVal === min) {
            return {
              fromVal: null
            };
          }

          if (typeof toVal === "number" && toVal < fromVal) {
            fromVal = toVal;
          }

          if (typeof min === "number" && fromVal < min) {
            fromVal = min;
          }

          if (typeof max === "number" && fromVal > max) {
            fromVal = max;
          }

          return {
            fromVal: fromVal
          };
        }, callback);
      } catch (e) {
        _patchedConsole.patchedConsoleInstance.error("Couldn't set value", e);
      }
    }
  }, {
    key: "setTo",
    value: function setTo(value, callback) {
      var facet = this.props.facet;
      var min = facet.min,
          max = facet.max;

      try {
        var toVal = RangeFacet.parseAndValidate(facet, value);
        this.setState(function (_ref4) {
          var fromVal = _ref4.fromVal;

          if (toVal === null || toVal === max) {
            return {
              toVal: null
            };
          }

          if (typeof fromVal === "number" && fromVal > toVal) {
            toVal = fromVal;
          }

          if (typeof min === "number" && toVal < min) {
            toVal = min;
          }

          if (typeof max === "number" && toVal > max) {
            toVal = max;
          }

          return {
            toVal: toVal
          };
        }, callback);
      } catch (e) {
        _patchedConsole.patchedConsoleInstance.error("Couldn't set value", e);
      }
    }
  }, {
    key: "performUpdateFrom",
    value: function performUpdateFrom() {
      var _this$props2 = this.props,
          onFilter = _this$props2.onFilter,
          facet = _this$props2.facet;
      var fromVal = this.state.fromVal;
      onFilter(_objectSpread({}, facet, {
        field: facet.field + ".from"
      }), {
        key: fromVal
      }, null, false);
    }
  }, {
    key: "performUpdateTo",
    value: function performUpdateTo() {
      var _this$props3 = this.props,
          onFilter = _this$props3.onFilter,
          facet = _this$props3.facet;
      var toVal = this.state.toVal;
      onFilter(_objectSpread({}, facet, {
        field: facet.field + ".to"
      }), {
        key: toVal
      }, null, false);
    }
  }, {
    key: "resetFrom",
    value: function resetFrom() {
      this.setFrom(null, this.performUpdateFrom);
    }
  }, {
    key: "resetTo",
    value: function resetTo() {
      this.setTo(null, this.performUpdateTo);
    }
  }, {
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick() {
      this.setState(function (_ref5) {
        var facetOpen = _ref5.facetOpen;
        return {
          facetOpen: !facetOpen
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          facet = _this$props4.facet,
          title = _this$props4.title,
          tooltip = _this$props4.tooltip,
          termTransformFxn = _this$props4.termTransformFxn,
          filters = _this$props4.filters,
          isStatic = _this$props4.isStatic;
      var field = facet.field,
          min = facet.min,
          max = facet.max;
      var _this$state = this.state,
          facetOpen = _this$state.facetOpen,
          facetClosing = _this$state.facetClosing,
          fromVal = _this$state.fromVal,
          toVal = _this$state.toVal;

      var _this$memoized$validI = this.memoized.validIncrements(facet),
          fromIncrements = _this$memoized$validI.fromIncrements,
          toIncrements = _this$memoized$validI.toIncrements;

      var _this$memoized$getVal = this.memoized.getValueFromFilters(facet, filters),
          savedFromVal = _this$memoized$getVal.fromVal,
          savedToVal = _this$memoized$getVal.toVal;

      return _react["default"].createElement("div", {
        className: "facet range-facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : ''),
        "data-field": facet.field
      }, _react["default"].createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, _react["default"].createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")
      })), _react["default"].createElement("span", {
        className: "inline-block col px-0",
        "data-tip": tooltip,
        "data-place": "right"
      }, title), _react["default"].createElement(_reactBootstrap.Fade, {
        "in": facetClosing || !facetOpen
      }, _react["default"].createElement("span", {
        className: "closed-terms-count col-auto px-0" + (savedFromVal !== null || savedToVal !== null ? " text-primary" : "")
      }, isStatic ? _react["default"].createElement("i", {
        className: "icon fas icon-" + (savedFromVal !== null || savedToVal !== null ? "circle" : "minus-circle"),
        style: {
          opacity: savedFromVal !== null || savedToVal !== null ? 0.75 : 0.25
        }
      }) : _react["default"].createElement("i", {
        className: "icon icon-fw icon-greater-than-equal fas"
      })))), _react["default"].createElement(_Collapse.Collapse, {
        "in": facetOpen && !facetClosing
      }, _react["default"].createElement("div", {
        className: "inner-panel"
      }, _react["default"].createElement("div", {
        className: "row"
      }, _react["default"].createElement("label", {
        className: "col-auto mb-0"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-greater-than-equal fas small"
      })), _react["default"].createElement(RangeDropdown, _extends({
        title: termTransformFxn(facet.field, typeof fromVal === 'number' ? fromVal : min, true),
        value: fromVal,
        onSelect: this.setFrom,
        max: toVal || null,
        increments: fromIncrements,
        variant: typeof fromVal === "number" || savedFromVal ? "primary" : "outline-dark",
        savedValue: savedFromVal
      }, {
        termTransformFxn: termTransformFxn,
        facet: facet
      }, {
        id: "from_" + field,
        update: this.performUpdateFrom
      })), _react["default"].createElement("div", {
        className: "clear-icon-container col-auto" + (fromVal === null ? " disabled" : " clickable"),
        onClick: fromVal !== null ? this.resetFrom : null
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas icon-" + (fromVal === null ? "pencil" : "times-circle")
      }))), _react["default"].createElement("div", {
        className: "row"
      }, _react["default"].createElement("label", {
        className: "col-auto mb-0"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-less-than-equal fas small"
      })), _react["default"].createElement(RangeDropdown, _extends({
        title: termTransformFxn(facet.field, typeof toVal === 'number' ? toVal : max, true),
        value: toVal,
        onSelect: this.setTo,
        min: fromVal || null,
        increments: toIncrements,
        variant: typeof toVal === "number" || savedToVal ? "primary" : "outline-dark",
        savedValue: savedToVal
      }, {
        termTransformFxn: termTransformFxn,
        facet: facet
      }, {
        id: "to_" + field,
        update: this.performUpdateTo
      })), _react["default"].createElement("div", {
        className: "clear-icon-container col-auto" + (toVal === null ? " disabled" : " clickable"),
        onClick: toVal !== null ? this.resetTo : null
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas icon-" + (toVal === null ? "pencil" : "times-circle")
      }))))));
    }
  }]);

  return RangeFacet;
}(_react["default"].PureComponent);

exports.RangeFacet = RangeFacet;

var RangeDropdown =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(RangeDropdown, _React$PureComponent2);

  function RangeDropdown(props) {
    var _this3;

    _classCallCheck(this, RangeDropdown);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(RangeDropdown).call(this, props));
    _this3.onTextInputChange = _this3.onTextInputChange.bind(_assertThisInitialized(_this3));
    _this3.onDropdownSelect = _this3.onDropdownSelect.bind(_assertThisInitialized(_this3));
    _this3.onTextInputFormSubmit = _this3.onTextInputFormSubmit.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(RangeDropdown, [{
    key: "onTextInputChange",
    value: function onTextInputChange(evt) {
      var onSelect = this.props.onSelect;
      var nextValue = evt.target.value;
      onSelect(nextValue);
    }
  }, {
    key: "onDropdownSelect",
    value: function onDropdownSelect(evtKey) {
      var _this$props5 = this.props,
          onSelect = _this$props5.onSelect,
          update = _this$props5.update,
          savedValue = _this$props5.savedValue;

      if (parseFloat(evtKey) === savedValue) {
        return false;
      }

      onSelect(evtKey, update);
    }
  }, {
    key: "onTextInputFormSubmit",
    value: function onTextInputFormSubmit(evt) {
      var _this$props6 = this.props,
          update = _this$props6.update,
          savedValue = _this$props6.savedValue,
          value = _this$props6.value;
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
      var _this$props7 = this.props,
          _this$props7$variant = _this$props7.variant,
          variant = _this$props7$variant === void 0 ? "outline-dark" : _this$props7$variant,
          _this$props7$size = _this$props7.size,
          size = _this$props7$size === void 0 ? "sm" : _this$props7$size,
          _this$props7$disabled = _this$props7.disabled,
          disabled = _this$props7$disabled === void 0 ? false : _this$props7$disabled,
          _this$props7$classNam = _this$props7.className,
          className = _this$props7$classNam === void 0 ? "range-dropdown-container col" : _this$props7$classNam,
          propMin = _this$props7.min,
          propMax = _this$props7.max,
          value = _this$props7.value,
          savedValue = _this$props7.savedValue,
          _this$props7$placehol = _this$props7.placeholder,
          placeholder = _this$props7$placehol === void 0 ? "Type..." : _this$props7$placehol,
          title = _this$props7.title,
          termTransformFxn = _this$props7.termTransformFxn,
          id = _this$props7.id,
          facet = _this$props7.facet,
          _this$props7$incremen = _this$props7.increments,
          increments = _this$props7$incremen === void 0 ? [] : _this$props7$incremen;
      var fMin = facet.min,
          fMax = facet.max;
      var min = typeof propMin === "number" ? propMin : typeof fMin === "number" ? fMin : 0;
      var max = propMax || fMax || null;

      var menuOptions = _toConsumableArray([].concat([min]).concat(increments).concat([max]).sort(function (a, b) {
        return a - b;
      }).reduce(function (m, incr) {
        if (typeof incr !== "number") {
          return m;
        }

        m.add(incr); // Handles duplicates.

        return m;
      }, new Set())).map(function (increment) {
        return _react["default"].createElement(_reactBootstrap.DropdownItem, {
          disabled: typeof min === "number" && increment < min || typeof max === "number" && increment > max,
          key: increment,
          eventKey: increment,
          active: increment === savedValue
        }, termTransformFxn(facet.field, increment, true), increment === min ? _react["default"].createElement("small", null, " (min)") : null, increment === max ? _react["default"].createElement("small", null, " (max)") : null);
      });

      return _react["default"].createElement(_reactBootstrap.DropdownButton, _extends({
        variant: variant,
        disabled: disabled,
        className: className,
        title: title,
        size: size,
        id: id
      }, {
        alignRight: true,
        onSelect: this.onDropdownSelect
      }), _react["default"].createElement("form", {
        className: "inline-input-container",
        onSubmit: this.onTextInputFormSubmit
      }, _react["default"].createElement("input", _extends({
        type: "number",
        className: "form-control"
      }, {
        min: min,
        max: max,
        value: value,
        placeholder: placeholder
      }, {
        onChange: this.onTextInputChange
      })), _react["default"].createElement("button", {
        type: "submit",
        disabled: !(savedValue !== value),
        className: "btn"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-check fas"
      }))), menuOptions);
    }
  }]);

  return RangeDropdown;
}(_react["default"].PureComponent);