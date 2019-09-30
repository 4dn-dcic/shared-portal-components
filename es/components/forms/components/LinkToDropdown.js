'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkToDropdown = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _util = require("./../../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LinkToDropdown = function (_React$PureComponent) {
  _inherits(LinkToDropdown, _React$PureComponent);

  function LinkToDropdown(props) {
    var _this;

    _classCallCheck(this, LinkToDropdown);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LinkToDropdown).call(this, props));
    _this.loadViableOptions = _this.loadViableOptions.bind(_assertThisInitialized(_this));
    _this.handleSelect = _this.handleSelect.bind(_assertThisInitialized(_this));
    _this.handleSearchTextChange = _this.handleSearchTextChange.bind(_assertThisInitialized(_this));
    _this.state = {
      loading: true,
      optionResults: null,
      error: null,
      typedSearchQuery: ""
    };
    _this.searchCache = new Map();
    return _this;
  }

  _createClass(LinkToDropdown, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadViableOptions();
    }
  }, {
    key: "loadViableOptions",
    value: function loadViableOptions() {
      var _this2 = this;

      var searchURLBase = this.props.searchURL;
      var requestHref = searchURLBase + "&limit=1000&" + LinkToDropdown.fieldsToRequest.map(function (field) {
        return "field=" + encodeURIComponent(field);
      }).join('&');

      var cb = function (response) {
        if (!response || Object.keys(response).length === 0) {
          _this2.setState({
            loading: false,
            error: "Could not get valid options, check network and try again."
          });

          return;
        }

        if (response.total === 0) {
          _this2.setState({
            loading: false,
            error: "No valid options found."
          });

          return;
        }

        _this2.setState({
          loading: false,
          error: null,
          optionResults: response['@graph']
        });
      };

      this.setState({
        loading: true
      }, function () {
        _util.ajax.load(requestHref, cb, 'GET', cb);
      });
    }
  }, {
    key: "handleSelect",
    value: function handleSelect(itemID) {
      var onSelect = this.props.onSelect;
      var _this$state$optionRes = this.state.optionResults,
          optionResults = _this$state$optionRes === void 0 ? [] : _this$state$optionRes;
      var optionsLen = optionResults.length;
      var selectedItem = null;

      for (var i = 0; i < optionsLen; i++) {
        if (optionResults[i]['@id'] === itemID) {
          selectedItem = optionResults[i];
          break;
        }
      }

      if (selectedItem === null) {
        throw new Error("Couldn't find ID in resultlist - " + itemID);
      }

      onSelect(itemID, selectedItem);
    }
  }, {
    key: "handleSearchTextChange",
    value: function handleSearchTextChange(evt) {
      var typedSearchQuery = evt.target.value;
      this.setState({
        typedSearchQuery: typedSearchQuery
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$variant = _this$props.variant,
          variant = _this$props$variant === void 0 ? "outline-dark" : _this$props$variant,
          _this$props$selectedT = _this$props.selectedTitle,
          selectedTitle = _this$props$selectedT === void 0 ? null : _this$props$selectedT,
          _this$props$selectedI = _this$props.selectedID,
          selectedID = _this$props$selectedI === void 0 ? null : _this$props$selectedI,
          _this$props$className = _this$props.className,
          propClsName = _this$props$className === void 0 ? null : _this$props$className;
      var _this$state = this.state,
          error = _this$state.error,
          optionResults = _this$state.optionResults,
          loading = _this$state.loading,
          typedSearchQuery = _this$state.typedSearchQuery;
      var searchAsYouType = optionResults && optionResults.length > 8;
      var title;
      var disabled = false;
      var filteredOptions = optionResults;
      var renderedOptions = null;

      if (loading) {
        title = _react["default"].createElement("i", {
          className: "icon icon-fw icon-spin icon-circle-notch fas"
        });
        disabled = true;
      } else if (error || !Array.isArray(optionResults)) {
        title = _react["default"].createElement("span", {
          className: "error"
        }, error);
        disabled = true;
      } else {
        if (searchAsYouType && typedSearchQuery) {
          var cachedResults = this.searchCache.get(typedSearchQuery);

          if (cachedResults) {
            filteredOptions = cachedResults;
          } else {
            var regexTest = new RegExp(typedSearchQuery);
            filteredOptions = optionResults.filter(function (selectableItem) {
              var display_title = selectableItem.display_title,
                  itemID = selectableItem['@id'];
              return regexTest.test(display_title) || regexTest.test(itemID);
            });

            if (this.searchCache.size >= 100) {
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = this.searchCache[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var _step$value = _slicedToArray(_step.value, 2),
                      key = _step$value[0],
                      val = _step$value[1];

                  this.searchCache["delete"](key);
                  break;
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }
            }

            this.searchCache.set(typedSearchQuery, filteredOptions);
          }
        }

        renderedOptions = filteredOptions.map(function (selectableItem) {
          var display_title = selectableItem.display_title,
              itemID = selectableItem['@id'];
          return _react["default"].createElement(_reactBootstrap.DropdownItem, {
            className: "selectable-item-option",
            key: itemID,
            eventKey: itemID,
            active: selectedID === itemID
          }, _react["default"].createElement("div", {
            className: "row"
          }, _react["default"].createElement("div", {
            className: "col"
          }, _react["default"].createElement("span", {
            className: "text-600 d-block"
          }, display_title)), _react["default"].createElement("div", {
            className: "col-auto d-none d-md-inline-block"
          }, _react["default"].createElement("i", {
            className: "icon icon-fw icon-link fas small mr-05"
          }), _react["default"].createElement("span", {
            className: "text-monospace small"
          }, itemID))));
        });
        title = selectedTitle || "Select...";
      }

      var className = "linkto-dropdown" + (propClsName ? " " + propClsName : "");
      return _react["default"].createElement(_reactBootstrap.DropdownButton, _extends({
        variant: variant,
        title: title,
        disabled: disabled,
        className: className
      }, {
        onSelect: this.handleSelect
      }), searchAsYouType ? _react["default"].createElement("div", {
        className: "search-as-you-type-container"
      }, _react["default"].createElement("input", {
        type: "text",
        className: "form-control",
        value: typedSearchQuery,
        onChange: this.handleSearchTextChange,
        placeholder: "Search..."
      })) : null, renderedOptions);
    }
  }]);

  return LinkToDropdown;
}(_react["default"].PureComponent);

exports.LinkToDropdown = LinkToDropdown;

_defineProperty(LinkToDropdown, "defaultProps", {
  'searchURL': "/search/?type=Project",
  'selectedID': null,
  'selectedTitle': null,
  'onSelect': function onSelect(itemID, itemJson) {
    _util.console.info("Selected!", itemID, itemJson);
  }
});

_defineProperty(LinkToDropdown, "fieldsToRequest", ['@id', 'display_title']);