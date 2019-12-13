"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchAsYouTypeLocal = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _SearchSelectionMenu = require("./SearchSelectionMenu");

var _util = require("./../../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var SearchAsYouTypeLocal =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SearchAsYouTypeLocal, _React$PureComponent);

  _createClass(SearchAsYouTypeLocal, null, [{
    key: "getRegexQuery",
    value: function getRegexQuery(value, filterMethod) {
      switch (filterMethod) {
        case "includes":
          return _util.valueTransforms.escapeRegExp(value.toLowerCase());

        case "startsWith":
        default:
          return "^" + _util.valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)?$";
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
      currentTextValue: props.initializeWithValue ? props.value || "" : ""
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
      var _evt$target$value = evt.target.value,
          value = _evt$target$value === void 0 ? null : _evt$target$value;

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
          propOptionsHeader = _this$props2.optionsHeader,
          allowCustomValue = _this$props2.allowCustomValue,
          passProps = _objectWithoutProperties(_this$props2, ["searchList", "filterMethod", "optionsHeader", "allowCustomValue"]);

      var currentTextValue = this.state.currentTextValue;
      var filteredOptions;
      var optionsHeader = propOptionsHeader;

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

        if (filteredOptions.length === 0 && allowCustomValue) {
          optionsHeader = _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("em", {
            className: "d-block text-center px-4 py-1"
          }, "Adding new entry"), optionsHeader);
        } else if (filteredOptions.length === 0 && !allowCustomValue) {
          optionsHeader = _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("em", {
            className: "d-block text-center px-4 py-1"
          }, "No results found"), optionsHeader);
        }
      }

      return _react["default"].createElement(_SearchSelectionMenu.SearchSelectionMenu, _extends({}, passProps, {
        optionsHeader: optionsHeader,
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
  allowCustomValue: _propTypes["default"].bool,
  initializeWithValue: _propTypes["default"].bool
};