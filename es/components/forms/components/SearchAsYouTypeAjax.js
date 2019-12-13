"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchAsYouTypeAjax = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = require("underscore");

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _util = require("../../util/");

var _util2 = require("./../../util");

var _SearchSelectionMenu = require("./SearchSelectionMenu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var SearchAsYouTypeAjax =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SearchAsYouTypeAjax, _React$PureComponent);

  function SearchAsYouTypeAjax(props) {
    var _this;

    _classCallCheck(this, SearchAsYouTypeAjax);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchAsYouTypeAjax).call(this, props));
    _this.state = {
      results: [],
      currentTextValue: props.value || "",
      loading: true // starts out by loading base RequestURL

    };
    _this.totalCount = 0; // todo: remove post-testing

    _this.processedCount = 0; // todo: remove post-testing

    _this.currentRequest = null;
    _this.onLoadData = (0, _underscore.debounce)(_this.onLoadData.bind(_assertThisInitialized(_this)), 500, false);
    _this.constructFetchURL = _this.constructFetchURL.bind(_assertThisInitialized(_this));
    _this.onTextInputChange = _this.onTextInputChange.bind(_assertThisInitialized(_this));
    _this.onDropdownSelect = _this.onDropdownSelect.bind(_assertThisInitialized(_this));
    _this.memoized = {
      filterOptions: (0, _memoizeOne["default"])(SearchAsYouTypeAjax.filterOptions)
    };
    return _this;
  }

  _createClass(SearchAsYouTypeAjax, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.state.currentTextValue;
      this.onLoadData("");
    }
  }, {
    key: "constructFetchURL",
    value: function constructFetchURL() {
      var _this$props$baseReque = this.props.baseRequestURL,
          baseRequestURL = _this$props$baseReque === void 0 ? "/search/?type=Item" : _this$props$baseReque;
      var currentTextValue = this.state.currentTextValue;
      var startQuery = currentTextValue ? "&q=".concat(currentTextValue) : '';
      return "".concat(baseRequestURL).concat(startQuery, "&field=display_title&field=@id&limit=100");
    }
  }, {
    key: "onLoadData",
    value: function onLoadData(query) {
      var _this2 = this;

      this.processedCount++;
      console.log("processing this query: ", query);
      console.log("processed only ", this.processedCount, " out of ", this.totalCount, " requests so far");
      this.setState({
        loading: true
      }, function () {
        if (_this2.currentRequest) {
          _this2.currentRequest.abort && _this2.currentRequest.abort();
        }

        var requestInThisScope = _this2.currentRequest = _util.ajax.load(_this2.constructFetchURL(), function (response) {
          if (requestInThisScope !== _this2.currentRequest) {
            return false; // some other request has been fired and is now set to theis request; cancel it
          }

          _this2.currentRequest = null;
          console.log("this is the response: ", response);

          _this2.setState({
            loading: false,
            results: response['@graph']
          });
        });
      });
    }
  }, {
    key: "onTextInputChange",
    value: function onTextInputChange(evt) {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          _this$props$allowCust = _this$props.allowCustomValue,
          allowCustomValue = _this$props$allowCust === void 0 ? false : _this$props$allowCust;
      var _evt$target$value = evt.target.value,
          value = _evt$target$value === void 0 ? null : _evt$target$value;
      console.log("this is keypress number: ", this.totalCount);

      if (allowCustomValue) {
        onChange(value);
        this.onLoadData(value);
      }

      this.setState({
        currentTextValue: value
      });
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
          _this$props2$filterMe = _this$props2.filterMethod,
          filterMethod = _this$props2$filterMe === void 0 ? "startsWith" : _this$props2$filterMe,
          propOptionsHeader = _this$props2.optionsHeader,
          passProps = _objectWithoutProperties(_this$props2, ["filterMethod", "optionsHeader"]);

      var _this$state = this.state,
          currentTextValue = _this$state.currentTextValue,
          results = _this$state.results,
          loading = _this$state.loading;
      var filteredOptions;
      var optionsHeader = propOptionsHeader;
      var renderArr = [];
      results.forEach(function (obj) {
        return renderArr.push(obj.display_title);
      });

      if (loading) {
        filteredOptions = [];
        optionsHeader = _react["default"].createElement("div", {
          className: "text-center py-2"
        }, _react["default"].createElement("i", {
          className: "icon icon-spin icon-circle-notch fas"
        }));
      } else {
        filteredOptions = this.memoized.filterOptions(currentTextValue, renderArr, filterMethod);

        if (filteredOptions.length === 0) {
          optionsHeader = _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("em", {
            className: "d-block text-center px-4 py-1"
          }, "Adding new entry"), optionsHeader);
        }
      }

      return (// <button onClick={this.onClick}>Test Me</button>
        // <SearchSelectionMenu
        //     onTextInputChange={this.onTextInputChange}
        //     onDropdownSelect={this.onDropdownSelect}
        //     options={renderArr}
        // />
        _react["default"].createElement(_SearchSelectionMenu.SearchSelectionMenu, _extends({}, passProps, {
          optionsHeader: optionsHeader,
          currentTextValue: currentTextValue
        }, {
          options: filteredOptions,
          onTextInputChange: this.onTextInputChange,
          onDropdownSelect: this.onDropdownSelect
        }))
      );
    }
  }], [{
    key: "getRegexQuery",
    value: function getRegexQuery(value, filterMethod) {
      switch (filterMethod) {
        case "includes":
          return _util2.valueTransforms.escapeRegExp(value.toLowerCase());

        case "startsWith":
        default:
          return "^" + _util2.valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)?$";
      }
    }
  }, {
    key: "filterOptions",
    value: function filterOptions(currTextValue) {
      var allResults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var filterMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "startsWith";
      var regexQuery = SearchAsYouTypeAjax.getRegexQuery(currTextValue, filterMethod);
      return allResults.filter(function (optStr) {
        return !!optStr.toLowerCase().match(regexQuery);
      });
    }
  }]);

  return SearchAsYouTypeAjax;
}(_react["default"].PureComponent);

exports.SearchAsYouTypeAjax = SearchAsYouTypeAjax;
SearchAsYouTypeAjax.propTypes = {
  value: _propTypes["default"].string,
  allowCustomValue: _propTypes["default"].bool,
  onChange: _propTypes["default"].func,
  baseRequestURL: function baseRequestURL(props, propName, componentName) {
    console.log("attempting to validate baseRequestURL");
    console.log("props: ", props);
    console.log("propName: ", propName);

    if (props[propName] && !props[propName].match("^/search/?type=(.+)?$")) {
      console.log(props[propName] + " did not validate");
      return new Error("Invalid prop '".concat(propName, "' supplied to ").concat(componentName, ". Validation failed."));
    }
  }
};