"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchSelectionMenu = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactBootstrap = require("react-bootstrap");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SearchSelectionMenu =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SearchSelectionMenu, _React$PureComponent);

  function SearchSelectionMenu(props) {
    var _this;

    _classCallCheck(this, SearchSelectionMenu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchSelectionMenu).call(this, props));
    _this.onToggleOpen = _this.onToggleOpen.bind(_assertThisInitialized(_this));
    _this.state = {
      dropOpen: false
    };
    return _this;
  }

  _createClass(SearchSelectionMenu, [{
    key: "onToggleOpen",
    value: function onToggleOpen() {
      var _this2 = this;

      this.setState(function (_ref) {
        var dropOpen = _ref.dropOpen;
        return {
          dropOpen: !dropOpen
        };
      }, function () {
        var onToggleOpen = _this2.props.onToggleOpen;
        var dropOpen = _this2.state.dropOpen;

        if (typeof onToggleOpen === "function") {
          onToggleOpen(dropOpen);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$currentTe = _this$props.currentTextValue,
          currentTextValue = _this$props$currentTe === void 0 ? "" : _this$props$currentTe,
          _this$props$value = _this$props.value,
          value = _this$props$value === void 0 ? "" : _this$props$value,
          _this$props$options = _this$props.options,
          options = _this$props$options === void 0 ? [] : _this$props$options,
          _this$props$optionRen = _this$props.optionRenderFunction,
          optionRenderFunction = _this$props$optionRen === void 0 ? null : _this$props$optionRen,
          titleRenderFunction = _this$props.titleRenderFunction,
          onDropdownSelect = _this$props.onDropdownSelect,
          onTextInputChange = _this$props.onTextInputChange,
          optionsHeader = _this$props.optionsHeader,
          optionsFooter = _this$props.optionsFooter,
          className = _this$props.className;
      var dropOpen = this.state.dropOpen;
      var cls = "search-selection-menu" + (className ? " " + className : "");

      var showValue = value && titleRenderFunction(value) || _react["default"].createElement("span", {
        className: "text-300"
      }, "No value");

      return _react["default"].createElement(_reactBootstrap.Dropdown, {
        drop: "down",
        flip: false,
        onToggle: this.onToggleOpen,
        show: dropOpen,
        className: cls
      }, _react["default"].createElement(_reactBootstrap.Dropdown.Toggle, {
        variant: "outline-dark",
        "data-tip": value
      }, showValue), _react["default"].createElement(_reactBootstrap.Dropdown.Menu, _extends({
        as: SearchSelectionMenuBody
      }, {
        onTextInputChange: onTextInputChange,
        optionsHeader: optionsHeader,
        optionsFooter: optionsFooter,
        currentTextValue: currentTextValue
      }, {
        drop: "down",
        flip: false,
        show: dropOpen,
        onTextInputChange: onTextInputChange,
        toggleOpen: this.onToggleOpen
      }), options.map(function (option, idx) {
        var renderedOption = typeof optionRenderFunction === "function" ? optionRenderFunction(option) : option;
        return _react["default"].createElement(_reactBootstrap.Dropdown.Item, {
          "data-index": idx,
          onClick: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            onDropdownSelect(option);
          },
          key: idx,
          eventKey: idx,
          className: "text-ellipsis-container",
          tabIndex: "3"
        }, renderedOption);
      })));
    }
  }]);

  return SearchSelectionMenu;
}(_react["default"].PureComponent);

exports.SearchSelectionMenu = SearchSelectionMenu;

_defineProperty(SearchSelectionMenu, "defaultProps", {
  titleRenderFunction: function titleRenderFunction(option) {
    return option;
  }
});

var SearchSelectionMenuBody = _react["default"].forwardRef(function (props, ref) {
  var currentTextValue = props.currentTextValue,
      _props$show = props.show,
      show = _props$show === void 0 ? false : _props$show,
      onTextInputChange = props.onTextInputChange,
      children = props.children,
      className = props.className,
      _props$inputPlacehold = props.inputPlaceholder,
      inputPlaceholder = _props$inputPlacehold === void 0 ? "Type to filter..." : _props$inputPlacehold,
      labeledBy = props['aria-labelledby'],
      _props$optionsHeader = props.optionsHeader,
      optionsHeader = _props$optionsHeader === void 0 ? null : _props$optionsHeader,
      _props$optionsFooter = props.optionsFooter,
      optionsFooter = _props$optionsFooter === void 0 ? null : _props$optionsFooter;
  var cls = "search-selection-menu-body" + (className ? " " + className : "");
  return _react["default"].createElement("div", {
    ref: ref,
    className: cls,
    "aria-labelledby": labeledBy
  }, _react["default"].createElement("div", {
    className: "inner-container"
  }, _react["default"].createElement("div", {
    className: "px-3 py-3 text-input-container"
  }, show ? _react["default"].createElement("input", {
    type: "text",
    autoFocus: true,
    value: currentTextValue,
    onChange: onTextInputChange,
    placeholder: inputPlaceholder,
    tabIndex: "3",
    className: "form-control"
  }) : null), _react["default"].createElement("div", {
    className: "scrollable-list-container"
  }, _react["default"].createElement("ul", {
    className: "list-unstyled mb-0 py-2"
  }, optionsHeader, children, optionsFooter))));
});