function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _excluded = ["searchList", "filterMethod", "optionsHeader", "allowCustomValue"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { SearchSelectionMenu } from './SearchSelectionMenu';
import { valueTransforms } from './../../util';
export var SearchAsYouTypeLocal = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SearchAsYouTypeLocal, _React$PureComponent);

  var _super = _createSuper(SearchAsYouTypeLocal);

  function SearchAsYouTypeLocal(props) {
    var _this;

    _classCallCheck(this, SearchAsYouTypeLocal);

    _this = _super.call(this, props);
    _this.onTextInputChange = _this.onTextInputChange.bind(_assertThisInitialized(_this));
    _this.onDropdownSelect = _this.onDropdownSelect.bind(_assertThisInitialized(_this));
    _this.state = {
      currentTextValue: props.initializeWithValue ? props.value || "" : ""
    };
    _this.memoized = {
      filterOptions: memoize(SearchAsYouTypeLocal.filterOptions)
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
          passProps = _objectWithoutProperties(_this$props2, _excluded);

      var currentTextValue = this.state.currentTextValue;
      var filteredOptions;
      var optionsHeader = propOptionsHeader;

      if (!Array.isArray(searchList)) {
        // Likely, schemas are not yet loaded?
        filteredOptions = [];
        optionsHeader = /*#__PURE__*/React.createElement("div", {
          className: "text-center py-3"
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-spin icon-circle-notch fas"
        }));
      } else {
        filteredOptions = this.memoized.filterOptions(currentTextValue, searchList, filterMethod);

        if (filteredOptions.length === 0) {
          optionsHeader = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("em", {
            className: "d-block text-center px-4 py-3"
          }, allowCustomValue ? "Adding new entry" : "No results found"), optionsHeader);
        }
      }

      return /*#__PURE__*/React.createElement(SearchSelectionMenu, _extends({}, passProps, {
        optionsHeader: optionsHeader,
        currentTextValue: currentTextValue,
        allowCustomValue: allowCustomValue
      }, {
        options: filteredOptions,
        onTextInputChange: this.onTextInputChange,
        onDropdownSelect: this.onDropdownSelect
      }));
    }
  }], [{
    key: "getRegexQuery",
    value: function getRegexQuery(value, filterMethod) {
      switch (filterMethod) {
        case "includes":
          return valueTransforms.escapeRegExp(value.toLowerCase());

        case "startsWith":
        default:
          return "^" + valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)?$";
      }
    }
  }, {
    key: "filterOptions",
    value: function filterOptions(currTextValue) {
      var allResults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var filterMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "startsWith";
      var regexQuery = SearchAsYouTypeLocal.getRegexQuery(currTextValue, filterMethod);
      return allResults.filter(function (optStr) {
        // toString added in case of integer enums/suggested_enums
        return !!optStr.toString().toLowerCase().match(regexQuery);
      });
    }
  }]);

  return SearchAsYouTypeLocal;
}(React.PureComponent);
SearchAsYouTypeLocal.propTypes = {
  searchList: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  filterMethod: PropTypes.string,
  // "startsWith", "includes" (can add more in future if necessary) -- defaults to startsWith
  allowCustomValue: PropTypes.bool,
  initializeWithValue: PropTypes.bool
};