import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import React from 'react';
// import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/esm/Dropdown';
import { VerticalScrollContainer } from './VerticalScrollContainer';
export var SearchSelectionMenu = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SearchSelectionMenu, _React$PureComponent);
  var _super = _createSuper(SearchSelectionMenu);
  function SearchSelectionMenu(props) {
    var _this;
    _classCallCheck(this, SearchSelectionMenu);
    _this = _super.call(this, props);
    _this.state = {
      dropOpen: false,
      refreshKey: 0 // incremented to force a refresh of dropdown
    };

    _this.dropdown = /*#__PURE__*/React.createRef();
    _this.onToggleOpen = _this.onToggleOpen.bind(_assertThisInitialized(_this));
    _this.onKeyDown = _this.onKeyDown.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(SearchSelectionMenu, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _prevProps$options = prevProps.options,
        oldOptions = _prevProps$options === void 0 ? [] : _prevProps$options;
      var _this$props$options = this.props.options,
        newOptions = _this$props$options === void 0 ? [] : _this$props$options;
      this.state.refreshKey;
      if (oldOptions.length !== 0 && oldOptions.length !== newOptions.length) {
        // TODO: calling setState in componentDidUpdate toggles SAYTAjax dropdown as closed
        // in the first click. We actually prevent entering this block by adding (oldOptions.length !== 0) condition.
        // We are not sure whether to remove this block at all in the future. (https://twitter.com/dan_abramov/status/977181473424932864)

        // used to force Popper.js to refresh and reposition the dropdown
        // if the length of results changes (drop may no longer align correctly, esp.
        // if dropping "up" to avoid collision with bottom of window)
        // TODO: add some more checks to make this more specific to ONLY cases
        // where the drop no longer aligns w/button

        // IMO, removing this block at all would be a better approach.
        // this.setState(function (existingState, existingProps) {
        //     const { refreshKey } = existingState;
        //     // todo: maybe read existingProps here as well and then cancel-out (return null) if no update needed.
        //     return { "refreshKey": refreshKey + 1 };
        // });
      }
    }
  }, {
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
    key: "onKeyDown",
    value: function onKeyDown(e) {
      var _this$props = this.props,
        options = _this$props.options,
        allowCustomValue = _this$props.allowCustomValue;
      if (e.key === "Enter") {
        // create the illusion of "submitting the value"; really just close the window
        if (allowCustomValue) {
          e.preventDefault();
          this.onToggleOpen();
        }
      } else if (e.key === "ArrowDown" && options.length !== 0) {
        // add focus to the first item in filtered items
        var x = document.querySelector(".dropdown > .dropdown-menu.show .list-unstyled");
        if (x.childNodes[0]) {
          x.childNodes[0].focus();
          e.preventDefault();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.onToggleOpen();
      }
      // otherwise handle as default
    }
  }, {
    key: "render",
    value: function render() {
      var _React$createElement;
      var _this$props2 = this.props,
        _this$props2$currentT = _this$props2.currentTextValue,
        currentTextValue = _this$props2$currentT === void 0 ? "" : _this$props2$currentT,
        _this$props2$value = _this$props2.value,
        value = _this$props2$value === void 0 ? "" : _this$props2$value,
        _this$props2$options = _this$props2.options,
        options = _this$props2$options === void 0 ? [] : _this$props2$options,
        _this$props2$optionRe = _this$props2.optionRenderFunction,
        optionRenderFunction = _this$props2$optionRe === void 0 ? null : _this$props2$optionRe,
        titleRenderFunction = _this$props2.titleRenderFunction,
        onDropdownSelect = _this$props2.onDropdownSelect,
        onTextInputChange = _this$props2.onTextInputChange,
        optionsHeader = _this$props2.optionsHeader,
        optionsFooter = _this$props2.optionsFooter,
        className = _this$props2.className,
        _this$props2$variant = _this$props2.variant,
        variant = _this$props2$variant === void 0 ? "outline-secondary" : _this$props2$variant,
        _this$props2$showTips = _this$props2.showTips,
        showTips = _this$props2$showTips === void 0 ? false : _this$props2$showTips;
      var _this$state = this.state,
        dropOpen = _this$state.dropOpen,
        refreshKey = _this$state.refreshKey;
      var cls = "search-selection-menu" + (className ? " " + className : "");
      var showValue = value && titleRenderFunction(value) || /*#__PURE__*/React.createElement("span", {
        className: "text-300"
      }, "No value");
      return /*#__PURE__*/React.createElement(Dropdown, {
        flip: "true",
        onToggle: this.onToggleOpen,
        show: dropOpen,
        className: cls
      }, /*#__PURE__*/React.createElement(Dropdown.Toggle, {
        variant: variant,
        "data-tip": showTips ? value : null
      }, showValue), /*#__PURE__*/React.createElement(Dropdown.Menu, (_React$createElement = {
        key: refreshKey,
        as: SearchSelectionMenuBody,
        onTextInputChange: onTextInputChange,
        optionsHeader: optionsHeader,
        optionsFooter: optionsFooter,
        currentTextValue: currentTextValue,
        style: {
          margin: 0
        } /* Style margin:0 is short term workaround to popperJS warning, see: https://github.com/react-bootstrap/react-bootstrap/issues/6017 */,
        flip: true,
        show: dropOpen
      }, _defineProperty(_React$createElement, "onTextInputChange", onTextInputChange), _defineProperty(_React$createElement, "toggleOpen", this.onToggleOpen), _defineProperty(_React$createElement, "ref", this.dropdown), _defineProperty(_React$createElement, "onKeyDown", this.onKeyDown), _React$createElement), options.map(function (option, idx) {
        var renderedOption = typeof optionRenderFunction === "function" ? optionRenderFunction(option) : option;
        return /*#__PURE__*/React.createElement(Dropdown.Item, {
          "data-index": idx,
          onClick: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            onDropdownSelect(option);
          },
          key: idx,
          eventKey: idx,
          className: "text-truncate",
          tabIndex: "3"
        }, renderedOption);
      })));
    }
  }]);
  return SearchSelectionMenu;
}(React.PureComponent);
_defineProperty(SearchSelectionMenu, "defaultProps", {
  titleRenderFunction: function titleRenderFunction(option) {
    return option;
  }
});
var SearchSelectionMenuBody = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var currentTextValue = props.currentTextValue,
    _props$show = props.show,
    show = _props$show === void 0 ? false : _props$show,
    onTextInputChange = props.onTextInputChange,
    onKeyDown = props.onKeyDown,
    children = props.children,
    className = props.className,
    _props$inputPlacehold = props.inputPlaceholder,
    inputPlaceholder = _props$inputPlacehold === void 0 ? "Type to filter..." : _props$inputPlacehold,
    labeledBy = props['aria-labelledby'],
    _props$optionsHeader = props.optionsHeader,
    optionsHeader = _props$optionsHeader === void 0 ? null : _props$optionsHeader,
    _props$optionsFooter = props.optionsFooter,
    optionsFooter = _props$optionsFooter === void 0 ? null : _props$optionsFooter,
    style = props.style;
  var cls = "search-selection-menu-body" + (className ? " " + className : "");
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: cls,
    "aria-labelledby": labeledBy,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-3 py-3 text-input-container"
  }, show ? /*#__PURE__*/React.createElement("input", {
    type: "text",
    autoFocus: true,
    value: currentTextValue,
    onChange: onTextInputChange,
    onKeyDown: onKeyDown,
    placeholder: inputPlaceholder,
    tabIndex: "3",
    className: "form-control"
  }) : null), /*#__PURE__*/React.createElement(VerticalScrollContainer, {
    header: optionsHeader,
    footer: optionsFooter,
    items: children
  })));
});