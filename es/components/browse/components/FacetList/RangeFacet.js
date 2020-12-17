'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRangeValuesFromFiltersByField = getRangeValuesFromFiltersByField;
exports.RangeTerm = exports.RangeFacet = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _Collapse = _interopRequireDefault(require("react-bootstrap/esm/Collapse"));

var _DropdownButton = _interopRequireDefault(require("react-bootstrap/esm/DropdownButton"));

var _DropdownItem = _interopRequireDefault(require("react-bootstrap/esm/DropdownItem"));

var _Fade = _interopRequireDefault(require("react-bootstrap/esm/Fade"));

var _Popover = _interopRequireDefault(require("react-bootstrap/esm/Popover"));

var _OverlayTrigger = _interopRequireDefault(require("react-bootstrap/esm/OverlayTrigger"));

var _LocalizedTime = require("./../../../ui/LocalizedTime");

var _PartialList = require("./../../../ui/PartialList");

var _valueTransforms = require("./../../../util/value-transforms");

var _schemaTransforms = require("./../../../util/schema-transforms");

var _patchedConsole = require("./../../../util/patched-console");

var _FacetTermsList = require("./FacetTermsList");

var _ExtendedDescriptionPopoverIcon = require("./ExtendedDescriptionPopoverIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

function getRangeValuesFromFiltersByField() {
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

var RangeFacet = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(RangeFacet, _React$PureComponent);

  var _super = _createSuper(RangeFacet);

  _createClass(RangeFacet, null, [{
    key: "parseAndValidate",
    value: function parseAndValidate(facet, value) {
      var aggregation_type = facet.aggregation_type,
          _facet$field_type2 = facet.field_type,
          field_type = _facet$field_type2 === void 0 ? aggregation_type === "range" ? "number" : "integer" : _facet$field_type2,
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
        _patchedConsole.patchedConsoleInstance.error("Expected number_step to be a positive number");

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

      var _ref2 = increments || {},
          _ref2$from = _ref2.from,
          fromIncrementsOrig = _ref2$from === void 0 ? [] : _ref2$from,
          _ref2$to = _ref2.to,
          toIncrementsOrig = _ref2$to === void 0 ? [] : _ref2$to;

      return {
        "fromIncrements": fromIncrementsOrig.filter(ensureWithinRange),
        "toIncrements": toIncrementsOrig.filter(ensureWithinRange)
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

  function RangeFacet(props) {
    var _this;

    _classCallCheck(this, RangeFacet);

    _this = _super.call(this, props);
    _this.handleOpenToggleClick = _this.handleOpenToggleClick.bind(_assertThisInitialized(_this));
    _this.handleExpandListToggleClick = _this.handleExpandListToggleClick.bind(_assertThisInitialized(_this));
    _this.setFrom = _this.setFrom.bind(_assertThisInitialized(_this));
    _this.setTo = _this.setTo.bind(_assertThisInitialized(_this));
    _this.setToAndFrom = _this.setToAndFrom.bind(_assertThisInitialized(_this));
    _this.selectRange = _this.selectRange.bind(_assertThisInitialized(_this));
    _this.resetFrom = _this.resetFrom.bind(_assertThisInitialized(_this));
    _this.resetTo = _this.resetTo.bind(_assertThisInitialized(_this));
    _this.resetToAndFrom = _this.resetToAndFrom.bind(_assertThisInitialized(_this)); // tentative - will likely be replaced with a prop

    _this.performUpdateFrom = _this.performUpdateFrom.bind(_assertThisInitialized(_this));
    _this.performUpdateTo = _this.performUpdateTo.bind(_assertThisInitialized(_this));
    _this.performUpdateToAndFrom = _this.performUpdateToAndFrom.bind(_assertThisInitialized(_this));
    _this.termTitle = _this.termTitle.bind(_assertThisInitialized(_this));
    _this.memoized = {
      fieldSchema: (0, _memoizeOne["default"])(_schemaTransforms.getSchemaProperty),
      validIncrements: (0, _memoizeOne["default"])(RangeFacet.validIncrements)
    };
    _this.state = _objectSpread(_objectSpread({}, RangeFacet.initialStateValues(props)), {}, {
      "facetClosing": false,
      "expanded": false
    });
    return _this;
  }

  _createClass(RangeFacet, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var previousToVal = pastProps.toVal,
          previousFromVal = pastProps.fromVal;
      var _this$props = this.props,
          toVal = _this$props.toVal,
          fromVal = _this$props.fromVal;

      if (toVal !== previousToVal || fromVal !== previousFromVal) {
        // console.log("update occurred! toVal ", previousToVal, " -> ", toVal);
        // console.log("update occurred! fromVal ", previousFromVal, " -> ", fromVal);
        // force manual update TODO: update for specific filter block switch circumstances
        this.setState({
          toVal: toVal,
          fromVal: fromVal
        });
      }
    }
  }, {
    key: "setFrom",
    value: function setFrom(value, callback) {
      var facet = this.props.facet; // console.log("setFrom called with", value);

      try {
        var fromVal = RangeFacet.parseAndValidate(facet, value);
        this.setState({
          fromVal: fromVal
        }, callback);
      } catch (e) {
        _patchedConsole.patchedConsoleInstance.error("Couldn't set value", e);
      }
    }
  }, {
    key: "setTo",
    value: function setTo(value, callback) {
      var facet = this.props.facet; // console.log("setTo called with", value);

      try {
        var toVal = RangeFacet.parseAndValidate(facet, value);
        this.setState({
          toVal: toVal
        }, callback);
      } catch (e) {
        _patchedConsole.patchedConsoleInstance.error("Couldn't set value", e);
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
        _patchedConsole.patchedConsoleInstance.error("Couldn't set value", e);
      }
    }
  }, {
    key: "performUpdateFrom",
    value: function performUpdateFrom() {
      var _this$props2 = this.props,
          onFilter = _this$props2.onFilter,
          facet = _this$props2.facet;
      var fromVal = this.state.fromVal; // console.log("performUpdateFrom", fromVal);

      onFilter(_objectSpread(_objectSpread({}, facet), {}, {
        field: facet.field + ".from"
      }), {
        key: fromVal
      });
    }
  }, {
    key: "performUpdateTo",
    value: function performUpdateTo() {
      var _this$props3 = this.props,
          onFilter = _this$props3.onFilter,
          facet = _this$props3.facet;
      var toVal = this.state.toVal; // console.log("performUpdateTo", toVal);

      onFilter(_objectSpread(_objectSpread({}, facet), {}, {
        field: facet.field + ".to"
      }), {
        key: toVal
      });
    }
  }, {
    key: "performUpdateToAndFrom",
    value: function performUpdateToAndFrom() {
      var _this$props4 = this.props,
          onFilterMultiple = _this$props4.onFilterMultiple,
          facet = _this$props4.facet;
      var _this$state = this.state,
          toVal = _this$state.toVal,
          fromVal = _this$state.fromVal; // console.log("performUpdate", toVal, fromVal);

      onFilterMultiple([{
        facet: _objectSpread(_objectSpread({}, facet), {}, {
          field: facet.field + ".from"
        }),
        term: {
          key: fromVal
        }
      }, {
        facet: _objectSpread(_objectSpread({}, facet), {}, {
          field: facet.field + ".to"
        }),
        term: {
          key: toVal
        }
      }]);
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
    key: "resetToAndFrom",
    value: function resetToAndFrom(e) {
      e.stopPropagation();
      this.setToAndFrom(null, null, this.performUpdateToAndFrom);
    }
  }, {
    key: "selectRange",
    value: function selectRange(to, from, e) {
      // console.log("selectRange", to, from);
      e.stopPropagation();
      this.setToAndFrom(to, from, this.performUpdateToAndFrom);
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
      this.setState(function (_ref3) {
        var expanded = _ref3.expanded;
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
    value: function termTitle(fieldName, value) {
      var allowJSX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var toPrecision = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var _this$props6 = this.props,
          _this$props6$facet$fi = _this$props6.facet.field_type,
          field_type = _this$props6$facet$fi === void 0 ? "number" : _this$props6$facet$fi,
          termTransformFxn = _this$props6.termTransformFxn;

      if (field_type === "date") {
        return /*#__PURE__*/_react["default"].createElement(_LocalizedTime.LocalizedTime, {
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

      if (absVal.toString().length <= 6) {
        // Else is too long and will go thru toPrecision or toExponential.
        if (absVal >= 1000) {
          return (0, _valueTransforms.decorateNumberWithCommas)(transformedValue);
        } else {
          return transformedValue;
        }
      }

      if (toPrecision) {
        return transformedValue.toPrecision(3);
      }

      return transformedValue.toExponential(3);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          schemas = _this$props7.schemas,
          itemTypeForSchemas = _this$props7.itemTypeForSchemas,
          facet = _this$props7.facet,
          propTitle = _this$props7.title,
          isStatic = _this$props7.isStatic,
          savedFromVal = _this$props7.fromVal,
          savedToVal = _this$props7.toVal,
          facetOpen = _this$props7.facetOpen,
          openPopover = _this$props7.openPopover,
          setOpenPopover = _this$props7.setOpenPopover;
      var aggregation_type = facet.aggregation_type,
          _facet$field_type3 = facet.field_type,
          field_type = _facet$field_type3 === void 0 ? "number" : _facet$field_type3,
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
          facetSchemaDescription = _facet$description === void 0 ? null : _facet$description;
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

      if (field_type === "number" || field_type === "integer") {
        if (aggregation_type === "stats") {
          fromTitle = typeof fromVal === 'number' ? this.termTitle(facet.field, fromVal) : typeof minValue === "number" ? this.termTitle(facet.field, minValue) : /*#__PURE__*/_react["default"].createElement("em", null, "-Infinite");
          toTitle = typeof toVal === 'number' ? this.termTitle(facet.field, toVal) : typeof maxValue === "number" ? this.termTitle(facet.field, maxValue) : /*#__PURE__*/_react["default"].createElement("em", null, "Infinite");
        } else if (aggregation_type === "range") {
          var _ranges$ = ranges[0],
              firstRange = _ranges$ === void 0 ? null : _ranges$;
          var lastRange = ranges[ranges.length - 1] || {};
          fromTitle = typeof fromVal === 'number' ? this.termTitle(facet.field, fromVal) : typeof firstRange.from === "number" ? this.termTitle(facet.field, firstRange.from) : /*#__PURE__*/_react["default"].createElement("em", null, "-Infinite");
          toTitle = typeof toVal === 'number' ? this.termTitle(facet.field, toVal) : typeof lastRange.to === "number" ? this.termTitle(facet.field, lastRange.to) : /*#__PURE__*/_react["default"].createElement("em", null, "Infinite");
        }
      } else if (field_type === "date") {
        fromTitle = this.termTitle(facet.field, fromVal && typeof fromVal === 'string' ? fromVal : minDateTime || 0);
        toTitle = this.termTitle(facet.field, toVal && typeof toVal === 'string' ? toVal : maxDateTime) || /*#__PURE__*/_react["default"].createElement("em", null, "None");

        _patchedConsole.patchedConsoleInstance.log("DATE VALS", fromVal, facet.field, minDateTime, 0, fromTitle, toTitle);
      } else {
        throw new Error("Expected number|integer or date field_type. " + field + ' ' + field_type);
      }

      var isOpen = facetOpen || savedFromVal !== null || savedToVal !== null;
      var fromVariant = savedFromVal === null ? "outline-dark" : "primary";
      var toVariant = savedToVal === null ? "outline-dark" : "primary";
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "facet range-facet" + (facetOpen ? ' open' : ' closed'),
        "data-field": facet.field
      }, /*#__PURE__*/_react["default"].createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-" + (isOpen ? "minus fas" : "plus fas")
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col px-0 line-height-1"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        "data-tip": facetSchemaDescription || fieldSchemaDescription,
        "data-place": "right"
      }, propTitle || facetTitle || field), /*#__PURE__*/_react["default"].createElement(_ExtendedDescriptionPopoverIcon.ExtendedDescriptionPopoverIcon, {
        fieldSchema: fieldSchema,
        facet: facet,
        openPopover: openPopover,
        setOpenPopover: setOpenPopover
      })), /*#__PURE__*/_react["default"].createElement(_Fade["default"], {
        "in": !isOpen
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "closed-terms-count col-auto px-0" + (savedFromVal !== null || savedToVal !== null ? " some-selected" : "")
      }, isStatic ? /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon fas icon-" + (savedFromVal !== null || savedToVal !== null ? "circle" : "minus-circle"),
        style: {
          opacity: savedFromVal !== null || savedToVal !== null ? 0.75 : 0.25
        }
      }) : /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-greater-than-equal fas"
      })))), /*#__PURE__*/_react["default"].createElement(_Collapse["default"], {
        "in": isOpen
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "inner-panel"
      }, /*#__PURE__*/_react["default"].createElement(RangeClear, _extends({
        fromTitle: fromTitle,
        toTitle: toTitle,
        savedFromVal: savedFromVal,
        savedToVal: savedToVal,
        facet: facet
      }, {
        resetAll: this.resetToAndFrom,
        termTransformFxn: this.termTitle,
        resetFrom: fromVal !== null ? this.resetFrom : null,
        resetTo: toVal !== null ? this.resetTo : null
      })), !facetOpen ? null : /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "range-drop-group"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "range-drop"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "mb-0 small"
      }, "From:"), /*#__PURE__*/_react["default"].createElement(RangeDropdown, {
        title: fromTitle,
        value: fromVal,
        savedValue: savedFromVal,
        max: toVal || null,
        increments: fromIncrements,
        variant: fromVariant + " btn-xs",
        onSelect: this.setFrom,
        update: this.performUpdateFrom,
        termTransformFxn: this.termTitle,
        facet: facet,
        id: "from_" + field,
        reset: fromVal !== null ? this.resetFrom : null
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "range-drop ml-05"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "mb-0 small"
      }, "To:"), /*#__PURE__*/_react["default"].createElement(RangeDropdown, {
        title: toTitle,
        value: toVal,
        savedValue: savedToVal,
        min: fromVal || null,
        increments: toIncrements,
        termTransformFxn: this.termTitle,
        variant: toVariant + " btn-xs",
        onSelect: this.setTo,
        update: this.performUpdateTo,
        facet: facet,
        id: "to_" + field,
        reset: toVal !== null ? this.resetTo : null
      }))), ranges && ranges.length > 0 ? /*#__PURE__*/_react["default"].createElement(ListOfRanges, _extends({}, this.props, {
        expanded: expanded
      }, {
        onToggleExpanded: this.handleExpandListToggleClick,
        onTermClick: this.selectRange,
        resetAll: this.resetToAndFrom
      })) : null))));
    }
  }]);

  return RangeFacet;
}(_react["default"].PureComponent);

exports.RangeFacet = RangeFacet;

var ListOfRanges = /*#__PURE__*/_react["default"].memo(function (props) {
  var facet = props.facet,
      facetOpen = props.facetOpen,
      facetClosing = props.facetClosing,
      _props$persistentCoun = props.persistentCount,
      persistentCount = _props$persistentCoun === void 0 ? 10 : _props$persistentCoun,
      onTermClick = props.onTermClick,
      expanded = props.expanded,
      onToggleExpanded = props.onToggleExpanded,
      termTransformFxn = props.termTransformFxn,
      toVal = props.toVal,
      fromVal = props.fromVal,
      resetAll = props.resetAll;
  var _facet$ranges2 = facet.ranges,
      ranges = _facet$ranges2 === void 0 ? [] : _facet$ranges2;
  /** Create range components and sort by status (selected->omitted->unselected) */

  var _useMemo = (0, _react.useMemo)(function () {
    var _segmentComponentsByS = (0, _FacetTermsList.segmentComponentsByStatus)(ranges.map(function (range) {
      return /*#__PURE__*/_react["default"].createElement(RangeTerm, _extends({
        facet: facet,
        range: range,
        termTransformFxn: termTransformFxn,
        resetAll: resetAll
      }, {
        onClick: onTermClick,
        key: "".concat(range.to, "-").concat(range.from),
        status: getRangeStatus(range, toVal, fromVal)
      }));
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
  }, [ranges, persistentCount, toVal, fromVal]),
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
      expandButtonTitle = /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-minus fas"
      }), " Collapse");
    } else {
      expandButtonTitle = /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-plus fas"
      }), " View ", collapsibleTermsCount, " More", /*#__PURE__*/_react["default"].createElement("span", {
        className: "pull-right"
      }, collapsibleTermsItemCount));
    }

    return /*#__PURE__*/_react["default"].createElement("div", commonProps, /*#__PURE__*/_react["default"].createElement(_PartialList.PartialList, {
      className: "mb-0 active-terms-pl",
      open: facetOpen,
      persistent: activeTermComponents,
      collapsible: /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_PartialList.PartialList, {
        className: "mb-0",
        open: expanded,
        persistent: persistentTerms,
        collapsible: collapsibleTerms
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "pt-08 pb-0"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "view-more-button",
        onClick: onToggleExpanded
      }, expandButtonTitle)))
    }));
  } else {
    return /*#__PURE__*/_react["default"].createElement("div", commonProps, /*#__PURE__*/_react["default"].createElement(_PartialList.PartialList, {
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


var RangeTerm = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(RangeTerm, _React$PureComponent2);

  var _super2 = _createSuper(RangeTerm);

  function RangeTerm(props) {
    var _this2;

    _classCallCheck(this, RangeTerm);

    _this2 = _super2.call(this, props);
    _this2.handleClick = _underscore["default"].debounce(_this2.handleClick.bind(_assertThisInitialized(_this2)), 500, true);
    _this2.state = {
      'filtering': false
    };
    return _this2;
  }

  _createClass(RangeTerm, [{
    key: "handleClick",
    value: function handleClick(e) {
      var _this3 = this;

      var _this$props8 = this.props,
          range = _this$props8.range,
          onClick = _this$props8.onClick;
      var _range$to = range.to,
          to = _range$to === void 0 ? null : _range$to,
          _range$from = range.from,
          from = _range$from === void 0 ? null : _range$from;
      e.preventDefault();
      this.setState({
        'filtering': true
      }, function () {
        onClick(to, from, e, function () {
          return _this3.setState({
            'filtering': false
          });
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
          range = _this$props9.range,
          facet = _this$props9.facet,
          status = _this$props9.status,
          termTransformFxn = _this$props9.termTransformFxn,
          resetAll = _this$props9.resetAll;
      var doc_count = range.doc_count,
          from = range.from,
          to = range.to,
          label = range.label;
      var filtering = this.state.filtering;
      var icon = null;
      var title = (typeof from !== 'undefined' ? from : '< ') + (typeof from !== 'undefined' && typeof to !== 'undefined' ? ' - ' : '') + (typeof to !== 'undefined' ? to : '+ ');

      if (filtering) {
        icon = /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon fas icon-circle-notch icon-spin icon-fw"
        });
      } else if (status === 'selected' || status === 'omitted') {
        icon = /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-dot-circle icon-fw fas"
        });
      } else {
        icon = /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-circle icon-fw unselected far"
        });
      }

      if (!title || title === 'null' || title === 'undefined') {
        title = 'None';
      }

      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "facet-list-element ",
        key: label,
        "data-key": label
      }, /*#__PURE__*/_react["default"].createElement("a", {
        className: "term",
        "data-selected": status !== 'none',
        href: "#",
        onClick: status === "selected" ? resetAll : this.handleClick,
        "data-term": label
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "facet-selector"
      }, icon), /*#__PURE__*/_react["default"].createElement("span", {
        className: "facet-item",
        "data-tip": title.length > 30 ? title : null
      }, title, " ", label ? "(".concat(label, ")") : null), /*#__PURE__*/_react["default"].createElement("span", {
        className: "facet-count"
      }, doc_count || 0)));
    }
  }]);

  return RangeTerm;
}(_react["default"].PureComponent);

exports.RangeTerm = RangeTerm;
RangeTerm.propTypes = {
  'facet': _propTypes["default"].shape({
    'field': _propTypes["default"].string.isRequired
  }).isRequired,
  'range': _propTypes["default"].shape({
    'from': _propTypes["default"].number,
    'to': _propTypes["default"].number,
    'label': _propTypes["default"].string,
    'doc_count': _propTypes["default"].number
  }).isRequired,
  'onClick': _propTypes["default"].func.isRequired
};

var RangeClear = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(RangeClear, _React$PureComponent3);

  var _super3 = _createSuper(RangeClear);

  function RangeClear() {
    _classCallCheck(this, RangeClear);

    return _super3.apply(this, arguments);
  }

  _createClass(RangeClear, [{
    key: "render",
    value: function render() {
      var _this$props10 = this.props,
          savedFromVal = _this$props10.savedFromVal,
          savedToVal = _this$props10.savedToVal,
          resetTo = _this$props10.resetTo,
          resetFrom = _this$props10.resetFrom,
          resetAll = _this$props10.resetAll,
          facet = _this$props10.facet,
          termTransformFxn = _this$props10.termTransformFxn;
      var facetField = facet.field,
          facetTitle = facet.title;
      var savedFromTitle = termTransformFxn(facetField, savedFromVal, true);
      var savedToTitle = termTransformFxn(facetField, savedToVal, true);

      if (savedFromVal === null && savedToVal === null) {
        return null;
      } else if (savedFromVal !== null && savedToVal !== null) {
        // To and From present
        savedToVal < savedFromVal ? "btn-warning" : "btn-primary";
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "range-clear"
        }, /*#__PURE__*/_react["default"].createElement("li", {
          className: "selected facet-list-element clickable"
        }, /*#__PURE__*/_react["default"].createElement("a", {
          onClick: resetAll
        }, /*#__PURE__*/_react["default"].createElement("span", {
          className: "facet-selector"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw fas icon-minus-circle"
        })), /*#__PURE__*/_react["default"].createElement("span", {
          className: "facet-item",
          style: {
            textAlign: "center",
            marginLeft: "-5px"
          }
        }, savedFromTitle, " ", /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon fas icon-less-than-equal icon-xs px-1"
        }), " ", facetTitle, " ", /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon fas icon-less-than-equal icon-xs px-1"
        }), " ", savedToTitle))));
      } else {
        // Only To or From present
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "range-clear"
        }, /*#__PURE__*/_react["default"].createElement("li", {
          className: "selected facet-list-element clickable"
        }, /*#__PURE__*/_react["default"].createElement("a", {
          onClick: resetTo === null ? resetFrom : resetTo
        }, /*#__PURE__*/_react["default"].createElement("span", {
          className: "facet-selector"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw fas icon-minus-circle"
        })), /*#__PURE__*/_react["default"].createElement("span", {
          className: "facet-item",
          style: {
            textAlign: "center",
            marginLeft: "-5px"
          }
        }, savedToVal !== null ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, facetTitle, " ", /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon fas icon-less-than-equal icon-xs px-1"
        }), " ", savedToTitle) : null, savedFromVal !== null ? /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, savedFromTitle, " ", /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon fas icon-less-than-equal icon-xs px-1"
        }), " ", facetTitle) : null))));
      }
    }
  }]);

  return RangeClear;
}(_react["default"].PureComponent);

var RangeDropdown = /*#__PURE__*/function (_React$PureComponent4) {
  _inherits(RangeDropdown, _React$PureComponent4);

  var _super4 = _createSuper(RangeDropdown);

  function RangeDropdown(props) {
    var _this4;

    _classCallCheck(this, RangeDropdown);

    _this4 = _super4.call(this, props);
    _this4.state = {
      showMenu: false,
      toggling: false
    };
    _this4.onTextInputChange = _this4.onTextInputChange.bind(_assertThisInitialized(_this4));
    _this4.onDropdownSelect = _this4.onDropdownSelect.bind(_assertThisInitialized(_this4));
    _this4.onTextInputFormSubmit = _this4.onTextInputFormSubmit.bind(_assertThisInitialized(_this4));
    _this4.onTextInputKeyDown = _this4.onTextInputKeyDown.bind(_assertThisInitialized(_this4));
    _this4.toggleDrop = _this4.toggleDrop.bind(_assertThisInitialized(_this4));
    _this4.onBlur = _this4.onBlur.bind(_assertThisInitialized(_this4));
    return _this4;
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
      var _this$props11 = this.props,
          onSelect = _this$props11.onSelect,
          update = _this$props11.update,
          savedValue = _this$props11.savedValue;

      if (parseFloat(evtKey) === savedValue) {
        return false;
      }

      onSelect(evtKey, update);
    }
  }, {
    key: "onTextInputFormSubmit",
    value: function onTextInputFormSubmit(evt) {
      var _this$props12 = this.props,
          update = _this$props12.update,
          savedValue = _this$props12.savedValue,
          value = _this$props12.value;
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

      _patchedConsole.patchedConsoleInstance.log("evt.key", evt.key);

      _patchedConsole.patchedConsoleInstance.log("evt.keycode", evt.keyCode);
    }
  }, {
    key: "toggleDrop",
    value: function toggleDrop() {
      var _this5 = this;

      var _this$state3 = this.state,
          showMenu = _this$state3.showMenu,
          toggling = _this$state3.toggling; // Note: toggling state addresses bug where state updates stack and end up resulting in no state change

      if (!toggling) {
        this.setState({
          showMenu: !showMenu,
          toggling: true
        }, function () {
          _this5.setState({
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
      var _this$props13 = this.props,
          _this$props13$variant = _this$props13.variant,
          variant = _this$props13$variant === void 0 ? "outline-dark" : _this$props13$variant,
          _this$props13$size = _this$props13.size,
          size = _this$props13$size === void 0 ? "sm" : _this$props13$size,
          _this$props13$disable = _this$props13.disabled,
          disabled = _this$props13$disable === void 0 ? false : _this$props13$disable,
          _this$props13$classNa = _this$props13.className,
          className = _this$props13$classNa === void 0 ? "range-dropdown-container col" : _this$props13$classNa,
          propMin = _this$props13.min,
          propMax = _this$props13.max,
          value = _this$props13.value,
          savedValue = _this$props13.savedValue,
          _this$props13$placeho = _this$props13.placeholder,
          placeholder = _this$props13$placeho === void 0 ? "Type..." : _this$props13$placeho,
          title = _this$props13.title,
          termTransformFxn = _this$props13.termTransformFxn,
          id = _this$props13.id,
          facet = _this$props13.facet,
          _this$props13$increme = _this$props13.increments,
          increments = _this$props13$increme === void 0 ? [] : _this$props13$increme,
          _this$props13$reset = _this$props13.reset,
          reset = _this$props13$reset === void 0 ? null : _this$props13$reset,
          tooltip = _this$props13.tooltip;
      var updateAble = savedValue !== value;
      var _facet$field_type4 = facet.field_type,
          field_type = _facet$field_type4 === void 0 ? "number" : _facet$field_type4,
          fMin = facet.min,
          fMax = facet.max,
          _facet$number_step2 = facet.number_step,
          step = _facet$number_step2 === void 0 ? "any" : _facet$number_step2;

      var emptyValue = /*#__PURE__*/_react["default"].createElement("span", {
        className: "mx-1"
      }, "-");

      var showTitle = /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col px-0"
      }, value !== null ? title : emptyValue));

      if (field_type === "date") {
        return /*#__PURE__*/_react["default"].createElement(_DropdownButton["default"], _extends({
          variant: variant,
          disabled: disabled,
          className: className,
          size: size,
          id: id
        }, {
          alignRight: true,
          title: showTitle,
          show: showMenu,
          onToggle: this.toggleDrop,
          onBlur: this.onBlur,
          "data-tip": tooltip,
          "data-html": true
        }), /*#__PURE__*/_react["default"].createElement("form", {
          className: "inline-input-container pb-0 mb-0 border-0",
          onSubmit: this.onTextInputFormSubmit
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "input-element-container"
        }, /*#__PURE__*/_react["default"].createElement("input", {
          type: "date",
          className: "form-control",
          value: value,
          "data-value": value,
          onKeyDown: this.onTextInputKeyDown,
          onChange: this.onTextInputChange
        })), /*#__PURE__*/_react["default"].createElement("button", {
          type: "submit",
          disabled: !updateAble,
          className: "btn"
        }, /*#__PURE__*/_react["default"].createElement("i", {
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
          return /*#__PURE__*/_react["default"].createElement(_DropdownItem["default"], {
            disabled: disabled,
            key: increment,
            eventKey: increment === 0 ? increment.toString() : increment,
            active: increment === savedValue
          }, termTransformFxn(facet.field, increment, true), increment === min ? /*#__PURE__*/_react["default"].createElement("small", null, " (min)") : null, increment === max ? /*#__PURE__*/_react["default"].createElement("small", null, " (max)") : null);
        });

        return /*#__PURE__*/_react["default"].createElement(_DropdownButton["default"], _extends({
          variant: variant,
          disabled: disabled,
          className: className,
          size: size,
          id: id
        }, {
          alignRight: true,
          onSelect: this.onDropdownSelect,
          title: showTitle,
          show: showMenu,
          onToggle: this.toggleDrop,
          onBlur: this.onBlur,
          "data-tip": tooltip,
          "data-html": true
        }), /*#__PURE__*/_react["default"].createElement("form", {
          className: "inline-input-container",
          onSubmit: this.onTextInputFormSubmit
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "input-element-container"
        }, /*#__PURE__*/_react["default"].createElement("input", _extends({
          type: "number",
          className: "form-control"
        }, {
          value: value,
          placeholder: placeholder,
          step: step
        }, {
          onKeyDown: this.onTextInputKeyDown,
          onChange: this.onTextInputChange
        }))), /*#__PURE__*/_react["default"].createElement("button", {
          type: "submit",
          disabled: !updateAble,
          className: "btn"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw icon-check fas"
        }))), menuOptions);
      } else {
        throw new Error("Expected number, integer, or date field type.");
      }
    }
  }]);

  return RangeDropdown;
}(_react["default"].PureComponent);