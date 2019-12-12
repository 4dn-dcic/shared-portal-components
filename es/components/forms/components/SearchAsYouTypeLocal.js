"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchSelectionMenu = exports.SearchAsYouTypeLocal = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactBootstrap = require("react-bootstrap");

var _util = require("./../../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
Custom Bootstrap Dropdown code adapted from:
https://react-bootstrap.github.io/components/dropdowns/#custom-dropdown-components
*/
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
var CustomToggle = _react["default"].forwardRef(function (_ref, ref) {
  var children = _ref.children,
      _onClick = _ref.onClick;
  return _react["default"].createElement("a", {
    href: "#",
    ref: ref,
    className: "btn btn-outline-dark dropdown-toggle",
    onClick: function onClick(e) {
      e.preventDefault();

      _onClick(e);
    }
  }, children);
});

var SearchAsYouTypeLocal =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SearchAsYouTypeLocal, _React$PureComponent);

  _createClass(SearchAsYouTypeLocal, null, [{
    key: "getRegexQuery",
    value: function getRegexQuery(value, filterMethod) {
      switch (filterMethod) {
        case "includes":
          return _util.valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)$";

        case "startsWith":
        default:
          return "^" + _util.valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)$";
      }
    }
  }, {
    key: "filterOptions",
    value: function filterOptions(currTextValue) {
      var allResults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var filterMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "startsWith";
      var regexQuery = SearchAsYouTypeLocal.getRegexQuery(currTextValue, filterMethod);
      return allResults.filter(function (optStr) {
        return !!optStr.toLowerCase().match(regexQuery);
      });
    }
  }]);

  function SearchAsYouTypeLocal(props) {
    var _this;

    _classCallCheck(this, SearchAsYouTypeLocal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchAsYouTypeLocal).call(this, props));
    _this.onTextInputChange = _this.onTextInputChange.bind(_assertThisInitialized(_this));
    _this.onDropdownSelect = _this.onDropdownSelect.bind(_assertThisInitialized(_this));
    _this.state = {
      currentTextValue: props.value || ""
    };
    _this.memoized = {
      filterOptions: (0, _memoizeOne["default"])(SearchAsYouTypeLocal.filterOptions)
    };
    return _this;
  }

  _createClass(SearchAsYouTypeLocal, [{
    key: "onTextInputChange",
    value: function onTextInputChange(evt) {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          _this$props$allowCust = _this$props.allowCustomValue,
          allowCustomValue = _this$props$allowCust === void 0 ? false : _this$props$allowCust;
      var value = evt.target.value;

      if (allowCustomValue) {
        onChange(value);
      }

      this.setState({
        currentTextValue: value
      });
      return false;
    }
  }, {
    key: "onDropdownSelect",
    value: function onDropdownSelect(eventKey) {
      var onChange = this.props.onChange;
      onChange(eventKey);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          searchList = _this$props2.searchList,
          _this$props2$filterMe = _this$props2.filterMethod,
          filterMethod = _this$props2$filterMe === void 0 ? "startsWith" : _this$props2$filterMe,
          passProps = _objectWithoutProperties(_this$props2, ["searchList", "filterMethod"]);

      var currentTextValue = this.state.currentTextValue;
      var filteredOptions;
      var optionsHeader;
      var optionsFooter;

      if (!Array.isArray(searchList)) {
        // Likely, schemas are not yet loaded?
        filteredOptions = [];
        optionsHeader = _react["default"].createElement("div", {
          className: "text-center py-2"
        }, _react["default"].createElement("i", {
          className: "icon icon-spin icon-circle-notch fas"
        }));
      } else {
        filteredOptions = this.memoized.filterOptions(currentTextValue, searchList, filterMethod);

        if (filteredOptions.length === 0) {
          optionsHeader = _react["default"].createElement("em", {
            className: "d-block text-center px-4"
          }, "Adding new entry");
        }
      }

      return _react["default"].createElement(SearchSelectionMenu, _extends({}, passProps, {
        optionsHeader: optionsHeader,
        optionsFooter: optionsFooter,
        currentTextValue: currentTextValue
      }, {
        options: filteredOptions,
        onTextInputChange: this.onTextInputChange,
        onDropdownSelect: this.onDropdownSelect
      }));
    }
  }]);

  return SearchAsYouTypeLocal;
}(_react["default"].PureComponent);

exports.SearchAsYouTypeLocal = SearchAsYouTypeLocal;
SearchAsYouTypeLocal.propTypes = {
  searchList: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  value: _propTypes["default"].string,
  onChange: _propTypes["default"].func.isRequired,
  filterMethod: _propTypes["default"].string,
  // "startsWith", "includes" (can add more in future if necessary) -- defaults to startsWith
  allowCustomValue: _propTypes["default"].bool
};

var SearchSelectionMenu =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(SearchSelectionMenu, _React$PureComponent2);

  function SearchSelectionMenu(props) {
    var _this2;

    _classCallCheck(this, SearchSelectionMenu);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(SearchSelectionMenu).call(this, props));
    _this2.onToggleOpen = _this2.onToggleOpen.bind(_assertThisInitialized(_this2));
    _this2.state = {
      dropOpen: false
    };
    return _this2;
  }

  _createClass(SearchSelectionMenu, [{
    key: "onToggleOpen",
    value: function onToggleOpen() {
      this.setState(function (_ref2) {
        var dropOpen = _ref2.dropOpen;
        return {
          dropOpen: !dropOpen
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          _this$props3$currentT = _this$props3.currentTextValue,
          currentTextValue = _this$props3$currentT === void 0 ? "" : _this$props3$currentT,
          _this$props3$value = _this$props3.value,
          value = _this$props3$value === void 0 ? "" : _this$props3$value,
          _this$props3$options = _this$props3.options,
          options = _this$props3$options === void 0 ? [] : _this$props3$options,
          _this$props3$optionRe = _this$props3.optionRenderFunction,
          optionRenderFunction = _this$props3$optionRe === void 0 ? null : _this$props3$optionRe,
          onDropdownSelect = _this$props3.onDropdownSelect,
          onTextInputChange = _this$props3.onTextInputChange,
          optionsHeader = _this$props3.optionsHeader,
          optionsFooter = _this$props3.optionsFooter;
      var dropOpen = this.state.dropOpen;
      return _react["default"].createElement(_reactBootstrap.Dropdown, {
        drop: "down",
        flip: false,
        onToggle: this.onToggleOpen,
        show: dropOpen,
        onSelect: onDropdownSelect
      }, _react["default"].createElement(_reactBootstrap.Dropdown.Toggle, {
        as: CustomToggle
      }, value || _react["default"].createElement("span", {
        className: "text-300"
      }, "No value")), _react["default"].createElement(_reactBootstrap.Dropdown.Menu, _extends({
        style: {
          maxWidth: "240px",
          minHeight: "75px"
        },
        as: SearchSelectionMenuBody,
        drop: "down",
        flip: false,
        show: dropOpen,
        onTextInputChange: onTextInputChange,
        toggleOpen: this.onToggleOpen
      }, {
        onTextInputChange: onTextInputChange,
        optionsHeader: optionsHeader,
        optionsFooter: optionsFooter
      }), options.map(function (optStr) {
        var renderedOption = typeof optionRenderFunction === "function" ? optionRenderFunction(optStr) : optStr;
        return _react["default"].createElement(_reactBootstrap.Dropdown.Item, {
          key: optStr,
          eventKey: optStr,
          className: "text-ellipsis-container",
          tabIndex: "3"
        }, renderedOption);
      })));
    }
  }]);

  return SearchSelectionMenu;
}(_react["default"].PureComponent);

exports.SearchSelectionMenu = SearchSelectionMenu;

var SearchSelectionMenuBody = _react["default"].forwardRef(function (props, ref) {
  var value = props.value,
      _props$show = props.show,
      show = _props$show === void 0 ? false : _props$show,
      onTextInputChange = props.onTextInputChange,
      children = props.children,
      style = props.style,
      className = props.className,
      _props$inputPlacehold = props.inputPlaceholder,
      inputPlaceholder = _props$inputPlacehold === void 0 ? "Type to filter..." : _props$inputPlacehold,
      labeledBy = props['aria-labelledby'],
      _props$optionsHeader = props.optionsHeader,
      optionsHeader = _props$optionsHeader === void 0 ? null : _props$optionsHeader,
      _props$optionsFooter = props.optionsFooter,
      optionsFooter = _props$optionsFooter === void 0 ? null : _props$optionsFooter;
  var cls = "search-selection-menu" + (className ? " " + className : "");
  return _react["default"].createElement("div", {
    ref: ref,
    style: (style, {
      overflowY: "hidden",
      width: "240px",
      transform: "translate3d(0,0,0)",
      padding: 0
    }),
    className: cls,
    "aria-labelledby": labeledBy
  }, _react["default"].createElement("div", {
    className: "inner-container"
  }, _react["default"].createElement("div", {
    className: "d-flex align-items-center text-input-container",
    style: {
      borderBottom: "1px solid #eee"
    }
  }, _react["default"].createElement("div", {
    className: "px-3 py-3",
    style: {
      width: "100%"
    }
  }, show ? _react["default"].createElement("input", {
    type: "text",
    autoFocus: true,
    value: value,
    onChange: onTextInputChange,
    placeholder: inputPlaceholder,
    tabIndex: "3",
    className: "form-control"
  }) : null)), _react["default"].createElement("div", {
    className: "scrollable-list-container",
    style: {
      overflowY: "auto",
      maxHeight: "250px"
    }
  }, _react["default"].createElement("ul", {
    className: "list-unstyled mb-0 py-2"
  }, optionsHeader, children, optionsFooter))));
});