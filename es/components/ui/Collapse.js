"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collapse = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _style = _interopRequireDefault(require("dom-helpers/style"));

var _end = _interopRequireDefault(require("dom-helpers/transition/end"));

var _underscore = _interopRequireDefault(require("underscore"));

var _bootstrapUtils = require("./bootstrap-utils");

var _Transition = _interopRequireWildcard(require("react-transition-group/Transition"));

var _collapseStyles;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** TAKEN FROM https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Collapse.js **/
var MARGINS = {
  height: ['marginTop', 'marginBottom'],
  width: ['marginLeft', 'marginRight']
};

function getDimensionValue(dimension, elem) {
  var offset = "offset".concat(dimension[0].toUpperCase()).concat(dimension.slice(1));
  var value = elem[offset];
  var margins = MARGINS[dimension];
  return value + parseInt((0, _style["default"])(elem, margins[0]), 10) + parseInt((0, _style["default"])(elem, margins[1]), 10);
}

var collapseStyles = (_collapseStyles = {}, _defineProperty(_collapseStyles, _Transition.EXITED, 'collapse'), _defineProperty(_collapseStyles, _Transition.EXITING, 'collapsing'), _defineProperty(_collapseStyles, _Transition.ENTERING, 'collapsing'), _defineProperty(_collapseStyles, _Transition.ENTERED, 'collapse show in'), _collapseStyles);

var Collapse =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Collapse, _React$PureComponent);

  function Collapse(props) {
    var _this;

    _classCallCheck(this, Collapse);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Collapse).call(this, props));

    _underscore["default"].bindAll(_assertThisInitialized(_this), 'getDimension', 'handleEnter', 'handleEntering', 'handleEntered', 'handleExit', 'handleExiting');

    return _this;
  }

  _createClass(Collapse, [{
    key: "getDimension",
    value: function getDimension() {
      var dimension = this.props.dimension;
      return typeof dimension === 'function' ? dimension() : dimension;
    }
    /* -- Expanding -- */

  }, {
    key: "handleEnter",
    value: function handleEnter(elem) {
      elem.style[this.getDimension()] = '0';
    }
  }, {
    key: "handleEntering",
    value: function handleEntering(elem) {
      var dimension = this.getDimension();
      elem.style[dimension] = this._getScrollDimensionValue(elem, dimension);
    }
  }, {
    key: "handleEntered",
    value: function handleEntered(elem) {
      elem.style[this.getDimension()] = null;
    }
    /* -- Collapsing -- */

  }, {
    key: "handleExit",
    value: function handleExit(elem) {
      var dimension = this.getDimension();
      var getDimensionValue = this.props.getDimensionValue;
      elem.style[dimension] = "".concat(getDimensionValue(dimension, elem), "px");
      elem.offsetHeight;
    }
  }, {
    key: "handleExiting",
    value: function handleExiting(elem) {
      elem.style[this.getDimension()] = null;
    } // for testing

  }, {
    key: "_getScrollDimensionValue",
    value: function _getScrollDimensionValue(elem, dimension) {
      var scroll = "scroll".concat(dimension[0].toUpperCase()).concat(dimension.slice(1));
      return "".concat(elem[scroll], "px");
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          onEnter = _this$props.onEnter,
          onEntering = _this$props.onEntering,
          onEntered = _this$props.onEntered,
          onExit = _this$props.onExit,
          onExiting = _this$props.onExiting,
          className = _this$props.className,
          children = _this$props.children,
          props = _objectWithoutProperties(_this$props, ["onEnter", "onEntering", "onEntered", "onExit", "onExiting", "className", "children"]);

      delete props.dimension;
      delete props.getDimensionValue;
      var handleEnter = (0, _bootstrapUtils.createChainedFunction)(this.handleEnter, onEnter);
      var handleEntering = (0, _bootstrapUtils.createChainedFunction)(this.handleEntering, onEntering);
      var handleEntered = (0, _bootstrapUtils.createChainedFunction)(this.handleEntered, onEntered);
      var handleExit = (0, _bootstrapUtils.createChainedFunction)(this.handleExit, onExit);
      var handleExiting = (0, _bootstrapUtils.createChainedFunction)(this.handleExiting, onExiting);
      return _react["default"].createElement(_Transition["default"], _extends({
        addEndListener: _end["default"]
      }, props, {
        "aria-expanded": props.role ? props["in"] : null,
        onEnter: handleEnter,
        onEntering: handleEntering,
        onEntered: handleEntered,
        onExit: handleExit,
        onExiting: handleExiting
      }), function (state, innerProps) {
        var cls = _underscore["default"].filter([className, children.props.className, collapseStyles[state], _this2.getDimension() === 'width' && 'width']).join(' ');

        return _react["default"].cloneElement(children, _objectSpread({}, innerProps, {
          className: cls
        }));
      });
    }
  }]);

  return Collapse;
}(_react["default"].PureComponent);

exports.Collapse = Collapse;
Collapse.defaultProps = {
  "in": false,
  timeout: 300,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  dimension: 'height',
  getDimensionValue: getDimensionValue
};