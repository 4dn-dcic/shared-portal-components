"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownMenu = exports.DropdownButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _WindowClickEventDelegator = require("./../util/WindowClickEventDelegator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// THIS IS A WORK IN PROGRESS
// TODO: create a "DropdownWindowClickManager" or similarly-named global singleton class
// Will keep track of all DropdownButtons mounted in view to ensure only one open ever at once.
// Will be similar to WindowClickEventDelegator BUT should be more performant
// (else can just use WindowClickEventDelegator directly, as is in code below now)
// by only iterating over clicked element's ancestors (to see if clicked elem is child of _the only_ open dropdown menu) once re: all dropdowns.
var DropdownButton =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(DropdownButton, _React$PureComponent);

  var _super = _createSuper(DropdownButton);

  function DropdownButton(props) {
    var _this;

    _classCallCheck(this, DropdownButton);

    _this = _super.call(this, props);
    _this.onWindowClick = _this.onWindowClick.bind(_assertThisInitialized(_this));
    _this.state = {
      'open': false
    };
    return _this;
  }

  _createClass(DropdownButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _WindowClickEventDelegator.WindowClickEventDelegator.addHandler(this.onWindowClick);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _WindowClickEventDelegator.WindowClickEventDelegator.removeHandler(this.onWindowClick);
    }
    /** Close dropdown on window click unless click within menu. */

  }, {
    key: "onWindowClick",
    value: function onWindowClick() {// TODO check event target, see if parent of it is our dropdown-menu, if so cancel, else close.
      // Funcs already exist for this in utils/layout
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          title = _this$props.title,
          variant = _this$props.variant,
          size = _this$props.size;
      var open = this.state.open;
      return (
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "dropdown"
        },
        /*#__PURE__*/
        _react["default"].createElement("button", {
          type: "button",
          className: // TODO finish handling other props
          "dropdown-toggle btn" + ("btn-" + (variant || "primary")) + ("btn-" + (size || "md")),
          role: "button",
          "data-toggle": "dropdown",
          "aria-haspopup": "true",
          "aria-expanded": "false"
        }, title),
        /*#__PURE__*/
        _react["default"].createElement(DropdownMenu, {
          children: children,
          open: open
        }))
      );
    }
  }]);

  return DropdownButton;
}(_react["default"].PureComponent);

exports.DropdownButton = DropdownButton;

_defineProperty(DropdownButton, "defaultProps", {
  'children': [
  /*#__PURE__*/
  _react["default"].createElement("a", {
    className: "dropdown-item",
    href: "#",
    key: 1
  }, "Action"),
  /*#__PURE__*/
  _react["default"].createElement("a", {
    className: "dropdown-item",
    href: "#",
    key: 2
  }, "Another action"),
  /*#__PURE__*/
  _react["default"].createElement("a", {
    className: "dropdown-item",
    href: "#",
    key: 3
  }, "Something else here")],
  'title': "Hello World"
});

var DropdownMenu =
/*#__PURE__*/
_react["default"].memo(function (props) {
  var children = props.children,
      open = props.open;
  if (!open) return null;
  return (
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "dropdown-menu show"
    }, children)
  );
}); // TODO create plain Dropdown. Or not. Idk. Can easily create (more) custom Dropdown togglers and whatnot by emulating the above DropdownButton so not sure is worth adding more complexity...


exports.DropdownMenu = DropdownMenu;