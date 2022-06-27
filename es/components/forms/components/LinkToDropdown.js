function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { ajax, console } from './../../util';
export var LinkToDropdown = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(LinkToDropdown, _React$PureComponent);

  var _super = _createSuper(LinkToDropdown);

  function LinkToDropdown(props) {
    var _this;

    _classCallCheck(this, LinkToDropdown);

    _this = _super.call(this, props);
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
      // Todo, call from componentDidUpdate if session has changed
      // _IF_ is possible this is needed (e.g. anonymous users could select things)
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
        ajax.load(requestHref, cb, 'GET', cb);
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

      onSelect(selectedItem, itemID);
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
      var _this$state = this.state,
          error = _this$state.error,
          optionResults = _this$state.optionResults,
          loading = _this$state.loading,
          typedSearchQuery = _this$state.typedSearchQuery;
      var _this$props = this.props,
          _this$props$variant = _this$props.variant,
          variant = _this$props$variant === void 0 ? "outline-dark" : _this$props$variant,
          _this$props$selectedT = _this$props.selectedTitle,
          selectedTitle = _this$props$selectedT === void 0 ? null : _this$props$selectedT,
          _this$props$selectedI = _this$props.selectedID,
          selectedID = _this$props$selectedI === void 0 ? null : _this$props$selectedI,
          _this$props$className = _this$props.className,
          propClsName = _this$props$className === void 0 ? null : _this$props$className,
          _this$props$searchAsY = _this$props.searchAsYouType,
          searchAsYouType = _this$props$searchAsY === void 0 ? optionResults && optionResults.length > 8 : _this$props$searchAsY;
      var title;
      var disabled = false;
      var filteredOptions = optionResults;
      var renderedOptions = null;

      if (loading) {
        title = /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw icon-spin icon-circle-notch fas"
        });
        disabled = true;
      } else if (error || !Array.isArray(optionResults)) {
        title = /*#__PURE__*/React.createElement("span", {
          className: "error"
        }, error);
        disabled = true;
      } else {
        if (optionResults.length === 1 && selectedID === optionResults[0]['@id']) {
          disabled = true;
        } else {
          if (searchAsYouType && typedSearchQuery) {
            var cachedResults = this.searchCache.get(typedSearchQuery);

            if (cachedResults) {
              filteredOptions = cachedResults;
            } else {
              var regexTest = new RegExp(typedSearchQuery, "i");
              filteredOptions = optionResults.filter(function (selectableItem) {
                var display_title = selectableItem.display_title,
                    itemID = selectableItem['@id'];
                return regexTest.test(display_title) || regexTest.test(itemID);
              });

              if (this.searchCache.size >= 100) {
                var _iterator = _createForOfIteratorHelper(this.searchCache),
                    _step;

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        key = _step$value[0],
                        val = _step$value[1];

                    this.searchCache["delete"](key);
                    break; // Just need to delete first (oldest) val.
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
              }

              this.searchCache.set(typedSearchQuery, filteredOptions);
            }
          }

          renderedOptions = filteredOptions.map(function (selectableItem) {
            var display_title = selectableItem.display_title,
                itemID = selectableItem['@id'];
            return /*#__PURE__*/React.createElement(DropdownItem, {
              className: "selectable-item-option",
              key: itemID,
              eventKey: itemID,
              active: selectedID === itemID
            }, /*#__PURE__*/React.createElement("div", {
              className: "row"
            }, /*#__PURE__*/React.createElement("div", {
              className: "col"
            }, /*#__PURE__*/React.createElement("span", {
              className: "text-600 d-block"
            }, display_title)), /*#__PURE__*/React.createElement("div", {
              className: "col-auto d-none d-md-inline-block"
            }, /*#__PURE__*/React.createElement("i", {
              className: "icon icon-fw icon-link fas small mr-05"
            }), /*#__PURE__*/React.createElement("span", {
              className: "text-monospace small"
            }, itemID))));
          });
        }

        title = selectedTitle || "Select...";
      }

      var className = "linkto-dropdown" + (propClsName ? " " + propClsName : "");
      return /*#__PURE__*/React.createElement(DropdownButton, {
        variant: variant,
        title: title,
        disabled: disabled,
        className: className,
        onSelect: this.handleSelect
      }, searchAsYouType ? /*#__PURE__*/React.createElement("div", {
        className: "search-as-you-type-container"
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        className: "form-control",
        value: typedSearchQuery,
        onChange: this.handleSearchTextChange,
        placeholder: "Search..."
      })) : null, renderedOptions);
    }
  }]);

  return LinkToDropdown;
}(React.PureComponent);

_defineProperty(LinkToDropdown, "defaultProps", {
  'searchURL': "/search/?type=Project",
  'selectedID': null,
  'selectedTitle': null,
  'searchAsYouType': null,

  /**
   * Example function to use.
   * Once selected, selectedTitle and selectedID should be passed back down to
   * this component.
   *
   * @param {*} itemID - The "@id" of selected item.
   * @param {*} itemJson - JSON/context of selected item. Will only contain limited subset of fields, e.g. type and title.
   */
  'onSelect': function onSelect(itemJson, itemID) {
    console.info("Selected!", itemID, itemJson);
  }
});

_defineProperty(LinkToDropdown, "fieldsToRequest", ['@id', 'display_title']);