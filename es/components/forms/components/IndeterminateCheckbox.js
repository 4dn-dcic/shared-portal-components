"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndeterminateCheckbox = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var IndeterminateCheckbox =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(IndeterminateCheckbox, _React$PureComponent);

  var _super = _createSuper(IndeterminateCheckbox);

  function IndeterminateCheckbox(props) {
    var _this;

    _classCallCheck(this, IndeterminateCheckbox);

    _this = _super.call(this, props);
    _this.setIndeterminateOnRef = _this.setIndeterminateOnRef.bind(_assertThisInitialized(_this));
    _this.checkboxRef = _react["default"].createRef();
    return _this;
  }

  _createClass(IndeterminateCheckbox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Can be skipped if not set to true.
      if (this.props.indeterminate === true) {
        this.setIndeterminateOnRef();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      if (pastProps.indeterminate !== this.props.indeterminate) {
        this.setIndeterminateOnRef();
      }
    }
  }, {
    key: "setIndeterminateOnRef",
    value: function setIndeterminateOnRef() {
      if (this.checkboxRef.current) {
        this.checkboxRef.current.indeterminate = this.props.indeterminate;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return (
        /*#__PURE__*/
        _react["default"].createElement("input", _extends({
          type: "checkbox"
        }, _underscore["default"].omit(this.props, 'indeterminate'), {
          ref: this.checkboxRef
        }))
      );
    }
  }]);

  return IndeterminateCheckbox;
}(_react["default"].PureComponent);

exports.IndeterminateCheckbox = IndeterminateCheckbox;