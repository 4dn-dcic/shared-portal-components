import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
var _excluded = ["searchList", "filterMethod", "optionsHeader", "allowCustomValue", "customFilterFunction"];

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
          customFilterFunction = _this$props2.customFilterFunction,
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
        if (customFilterFunction) {
          filteredOptions = customFilterFunction(currentTextValue, searchList, filterMethod);
        } else {
          filteredOptions = this.memoized.filterOptions(currentTextValue, searchList, filterMethod);
        }

        if (filteredOptions.length === 0) {
          optionsHeader = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("em", {
            className: "d-block text-center px-4 py-3"
          }, allowCustomValue ? "Adding new entry" : "No results found"), optionsHeader);
        }
      }

      return /*#__PURE__*/React.createElement(SearchSelectionMenu, _extends({}, passProps, {
        optionsHeader: optionsHeader,
        currentTextValue: currentTextValue,
        allowCustomValue: allowCustomValue,
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
  initializeWithValue: PropTypes.bool,
  optionRenderFunction: PropTypes.func,
  titleRenderFunction: PropTypes.func,
  customFilterFunction: PropTypes.func
};