"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubmissionViewSearchAsYouTypeAjax = SubmissionViewSearchAsYouTypeAjax;
exports.SquareButton = exports.LinkedObj = exports.optionCustomizationsByType = exports.SearchAsYouTypeAjax = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = require("underscore");

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _Fade = require("./../../ui/Fade");

var _util = require("./../../util/");

var _util2 = require("./../../util");

var _Alerts = require("./../../ui/Alerts");

var _LinkToSelector = require("./LinkToSelector");

var _SearchSelectionMenu = require("./SearchSelectionMenu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var SearchAsYouTypeAjax =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SearchAsYouTypeAjax, _React$PureComponent);

  _createClass(SearchAsYouTypeAjax, null, [{
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
      console.log("running filterOptions with currTextValue of ".concat(currTextValue));
      var regexQuery = SearchAsYouTypeAjax.getRegexQuery(currTextValue, filterMethod);
      return allResults.filter(function (optStr) {
        return !!(optStr || "".toLowerCase().match(regexQuery));
      });
    }
  }]);

  function SearchAsYouTypeAjax(props) {
    var _this;

    _classCallCheck(this, SearchAsYouTypeAjax);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchAsYouTypeAjax).call(this, props));
    _this.state = {
      results: [],
      currentTextValue: props.value || "",
      loading: true,
      // starts out by loading base RequestURL
      error: null
    };
    _this.currentRequest = null;
    _this.hasBeenOpened = false;
    _this.onLoadData = _underscore._.debounce(_this.onLoadData.bind(_assertThisInitialized(_this)), 500, false);
    _this.constructFetchURL = _this.constructFetchURL.bind(_assertThisInitialized(_this));
    _this.onTextInputChange = _this.onTextInputChange.bind(_assertThisInitialized(_this));
    _this.onDropdownSelect = _this.onDropdownSelect.bind(_assertThisInitialized(_this));
    _this.onToggleOpen = _this.onToggleOpen.bind(_assertThisInitialized(_this));
    _this.memoized = {
      filterOptions: (0, _memoizeOne["default"])(SearchAsYouTypeAjax.filterOptions)
    };
    return _this;
  }

  _createClass(SearchAsYouTypeAjax, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var pastResults = pastState.results;
      var results = this.state.results;

      if (results !== pastResults) {
        _reactTooltip["default"].rebuild();
      }
    }
  }, {
    key: "onToggleOpen",
    value: function onToggleOpen(isOpen) {
      // On first open only, start a load
      if (!isOpen) return false;
      if (this.hasBeenOpened) return false;
      this.onLoadData();
      this.hasBeenOpened = true;
    }
  }, {
    key: "onTextInputChange",
    value: function onTextInputChange(evt) {
      var _evt$target$value = evt.target.value,
          value = _evt$target$value === void 0 ? null : _evt$target$value; // this.totalCount++;
      // console.log("this is keypress number: ",  this.totalCount);

      this.setState({
        currentTextValue: value
      });
      this.onLoadData(value);
    }
  }, {
    key: "constructFetchURL",
    value: function constructFetchURL() {
      var _this$props = this.props,
          _this$props$baseHref = _this$props.baseHref,
          baseHref = _this$props$baseHref === void 0 ? SearchAsYouTypeAjax.defaultProps.baseHref : _this$props$baseHref,
          _this$props$fieldsToR = _this$props.fieldsToRequest,
          fieldsToRequest = _this$props$fieldsToR === void 0 ? [] : _this$props$fieldsToR;
      var currentTextValue = this.state.currentTextValue;
      var commonFields = SearchAsYouTypeAjax.defaultProps.fieldsToRequest;
      var requestHref = "".concat(baseHref).concat(currentTextValue ? "&q=" + encodeURIComponent(currentTextValue) : "", "&limit=100&") + commonFields.concat(fieldsToRequest).map(function (field) {
        return "field=" + encodeURIComponent(field);
      }).join('&');
      return requestHref;
    }
  }, {
    key: "onLoadData",
    value: function onLoadData() {
      var _this2 = this;

      this.setState({
        loading: true
      }, function () {
        if (_this2.currentRequest) {
          // if there's already a request running, abort it
          _this2.currentRequest.abort && _this2.currentRequest.abort();
        }

        var requestInThisScope = _this2.currentRequest = _util.ajax.load(_this2.constructFetchURL(), function (response) {
          if (requestInThisScope !== _this2.currentRequest) {
            return false; // some other request has been fired; cancel this one
          }

          _this2.currentRequest = null;

          if (!response || Object.keys(response).length === 0) {
            _this2.setState({
              loading: false,
              results: [],
              error: "Could not get a response from server. Check network and try again."
            });

            return;
          }

          _this2.setState({
            loading: false,
            results: response['@graph'],
            error: null
          });
        }, "GET", function (response, xhr) {
          var _response$Graph = response['@graph'],
              graph = _response$Graph === void 0 ? [] : _response$Graph,
              _response$results = response.results,
              results = _response$results === void 0 ? [] : _response$results,
              _response$error = response.error,
              error = _response$error === void 0 ? null : _response$error;
          var status = xhr.status,
              statusText = xhr.statusText;
          _this2.currentRequest = null;

          if (graph.length === 0) {
            // handle case in which no results found
            _this2.setState({
              loading: false,
              results: results,
              error: null
            });
          } else if (error) {
            // handle more general errors (should we display the actual error message to users?)
            console.log("Status code " + status + " encountered. " + statusText);

            _this2.setState({
              loading: false,
              results: results,
              error: error || "Something went wrong while handling this request."
            });
          }
        });
      });
    }
  }, {
    key: "onDropdownSelect",
    value: function onDropdownSelect(result) {
      var onChange = this.props.onChange;
      onChange(result);
    }
  }, {
    key: "onClickRetry",
    value: function onClickRetry(evt) {
      evt.preventDefault();
      this.onLoadData();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          _this$props2$filterMe = _this$props2.filterMethod,
          filterMethod = _this$props2$filterMe === void 0 ? "startsWith" : _this$props2$filterMe,
          propOptionsHeader = _this$props2.optionsHeader,
          value = _this$props2.value,
          _this$props2$keyCompl = _this$props2.keyComplete,
          keyComplete = _this$props2$keyCompl === void 0 ? {} : _this$props2$keyCompl,
          leftoverProps = _objectWithoutProperties(_this$props2, ["filterMethod", "optionsHeader", "value", "keyComplete"]);

      var _this$state = this.state,
          currentTextValue = _this$state.currentTextValue,
          _this$state$results = _this$state.results,
          results = _this$state$results === void 0 ? [] : _this$state$results,
          loading = _this$state.loading,
          error = _this$state.error;
      var optionsHeader = propOptionsHeader;

      var passProps = _objectSpread({}, leftoverProps, {
        keyComplete: keyComplete,
        value: value
      });

      if (loading && !error) {
        optionsHeader = _react["default"].createElement("div", {
          className: "text-center py-3"
        }, _react["default"].createElement("i", {
          className: "icon icon-spin icon-circle-notch fas"
        }));
      } else {
        if (results.length === 0 && !error) {
          optionsHeader = _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("em", {
            className: "d-block text-center px-4 py-3"
          }, "No results found"), optionsHeader);
        } else if (error) {
          optionsHeader = _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("em", {
            className: "d-block text-center px-4 py-3"
          }, _react["default"].createElement("i", {
            className: "fas icon-warning icon"
          }), " ", error), optionsHeader);
        }
      }

      var intKey = parseInt(value);
      var hideButton = value && !isNaN(value) && !keyComplete[intKey]; // if in the middle of editing a custom linked object for this field

      return _react["default"].createElement("div", {
        className: "d-flex flex-wrap"
      }, hideButton ? null : _react["default"].createElement(_SearchSelectionMenu.SearchSelectionMenu, _extends({}, passProps, {
        optionsHeader: optionsHeader,
        currentTextValue: currentTextValue
      }, {
        alignRight: true,
        showTips: true,
        options: results,
        onToggleOpen: this.onToggleOpen,
        onTextInputChange: this.onTextInputChange,
        onDropdownSelect: this.onDropdownSelect
      })), _react["default"].createElement(LinkedObj, _extends({
        key: "linked-item"
      }, passProps)));
    }
  }]);

  return SearchAsYouTypeAjax;
}(_react["default"].PureComponent);

exports.SearchAsYouTypeAjax = SearchAsYouTypeAjax;
SearchAsYouTypeAjax.propTypes = {
  value: _propTypes["default"].any,
  onChange: _propTypes["default"].func,
  baseHref: function baseHref(props, propName, componentName) {
    if (props[propName] && !props[propName].match("^/search/?type=(.+)?$")) {
      return new Error("Invalid prop '".concat(propName, "' supplied to ").concat(componentName, ". Validation failed."));
    }
  },
  fieldsToRequest: _propTypes["default"].arrayOf(_propTypes["default"].string)
};
SearchAsYouTypeAjax.defaultProps = {
  "optionRenderFunction": function optionRenderFunction(result) {
    var title = result.display_title,
        atID = result["@id"],
        description = result.description;
    return _react["default"].createElement("div", {
      "data-tip": description,
      key: atID
    }, _react["default"].createElement("h5", {
      className: "text-300 text-ellipsis-container"
    }, title), _react["default"].createElement("h6", {
      className: "text-mono text-400 text-ellipsis-container"
    }, atID));
  },
  "titleRenderFunction": function titleRenderFunction(result) {
    return result.display_title;
  },
  "baseHref": "/search/?type=Item",
  "fieldsToRequest": ["@id", "display_title", "description"] // additional fields aside from @id, display_title, and description; all already included

};

function SubmissionViewSearchAsYouTypeAjax(props) {
  // Another higher-order-component
  var selectComplete = props.selectComplete,
      nestedField = props.nestedField,
      value = props.value,
      arrayIdx = props.arrayIdx,
      _props$schema$linkTo = props.schema.linkTo,
      linkTo = _props$schema$linkTo === void 0 ? "Item" : _props$schema$linkTo,
      _props$itemType = props.itemType,
      itemType = _props$itemType === void 0 ? linkTo : _props$itemType,
      _props$idToTitleMap = props.idToTitleMap,
      idToTitleMap = _props$idToTitleMap === void 0 ? null : _props$idToTitleMap; // Add some logic based on schema.Linkto props if itemType not already available

  var optionRenderFunction = (optionCustomizationsByType[itemType] && optionCustomizationsByType[itemType].render ? optionCustomizationsByType[itemType].render : null) || SearchAsYouTypeAjax.defaultProps.optionRenderFunction;
  var fieldsToRequest = (optionCustomizationsByType[itemType] && optionCustomizationsByType[itemType].fieldsToRequest ? optionCustomizationsByType[itemType].fieldsToRequest : null) || SearchAsYouTypeAjax.defaultProps.fieldsToRequest;
  var onChange = (0, _react.useMemo)(function () {
    return function (resultItem) {
      console.log("calling SubmissionViewSearchAsYouType onchange");
      console.log("resultItem, ", resultItem);
      return selectComplete(resultItem['@id'], nestedField, itemType, arrayIdx);
    };
  }, [selectComplete, nestedField]);
  var titleRenderFunction = (0, _react.useMemo)(function () {
    return function (resultAtID) {
      return idToTitleMap[resultAtID] || resultAtID;
    };
  }, [idToTitleMap]);
  return _react["default"].createElement(SearchAsYouTypeAjax, _extends({
    value: value,
    onChange: onChange,
    baseHref: "/search/?type=" + linkTo,
    optionRenderFunction: optionRenderFunction,
    fieldsToRequest: fieldsToRequest,
    titleRenderFunction: titleRenderFunction,
    selectComplete: selectComplete
  }, props));
}

function sexToIcon(sex, showTip) {
  sex = sex.toLowerCase();

  if (sex && typeof sex === "string") {
    if (sex === "f") {
      sex = _react["default"].createElement("i", {
        className: "icon icon-fw icon-venus fas",
        "data-tip": showTip ? "Sex: Female" : ""
      });
    } else if (sex === "m") {
      sex = _react["default"].createElement("i", {
        className: "icon icon-fw icon-mars fas",
        "data-tip": showTip ? "Sex: Male" : ""
      });
    } else if (sex === "u") {
      sex = _react["default"].createElement("i", {
        className: "icon icon-fw icon-genderless fas",
        "data-tip": showTip ? "Sex: Unknown" : ""
      });
    } else {
      sex = _react["default"].createElement("i", {
        className: "icon icon-fw icon-question fas",
        "data-tip": showTip ? "Sex: N/A" : ""
      });
    }
  }

  return sex;
}

var optionCustomizationsByType = {
  "Institution": {
    // "render" is same as default
    "fieldsToRequest": []
  },
  "Individual": {
    "render": function render(result) {
      var title = result.display_title,
          atID = result["@id"],
          description = result.description,
          _result$sex = result.sex,
          sex = _result$sex === void 0 ? null : _result$sex,
          _result$age = result.age,
          age = _result$age === void 0 ? null : _result$age,
          _result$aliases = result.aliases,
          aliases = _result$aliases === void 0 ? [] : _result$aliases;
      return (// need to better align right col, and adjust relative widths
        _react["default"].createElement("div", {
          "data-tip": description,
          key: atID,
          className: "d-flex"
        }, _react["default"].createElement("div", {
          className: "col"
        }, _react["default"].createElement("h5", {
          className: "text-300"
        }, title), _react["default"].createElement("h6", {
          className: "text-mono text-400"
        }, aliases)), _react["default"].createElement("div", {
          className: "col"
        }, _react["default"].createElement("h5", {
          className: "text-300"
        }, "Age: ", age || "N/A"), _react["default"].createElement("h6", {
          className: "text-mono text-400"
        }, " Sex: ", sexToIcon(sex, false), " ")))
      );
    },
    "fieldsToRequest": ['sex', 'age', 'aliases', 'description']
  },
  "Cohort": {
    "render": function render(result) {
      var title = result.display_title,
          atID = result["@id"],
          description = result.description,
          accession = result.accession;
      return _react["default"].createElement("div", {
        "data-tip": description,
        key: atID
      }, _react["default"].createElement("h5", {
        className: "text-300 text-ellipsis-container"
      }, title), _react["default"].createElement("h6", {
        className: "text-mono text-400 text-ellipsis-container"
      }, accession));
    },
    "fieldsToRequest": ['accession', 'status', 'date_created']
  },
  "User": {
    "render": function render(result) {
      var title = result.display_title,
          atID = result["@id"],
          description = result.description,
          email = result.email,
          role = result.role,
          first_name = result.first_name,
          last_name = result.last_name;
      return _react["default"].createElement("div", {
        "data-tip": description,
        key: atID
      }, _react["default"].createElement("h5", {
        className: "text-300 w-100"
      }, title, " (", first_name, " ", last_name, ")"), _react["default"].createElement("h6", {
        className: "text-mono text-400"
      }, email));
    },
    "fieldsToRequest": ['email', 'role', 'first_name', 'last_name', 'submits_for']
  },
  "Document": {
    "render": function render(result) {
      var title = result.display_title,
          atID = result["@id"],
          description = result.description,
          status = result.status,
          date_created = result.date_created,
          submitted_by = result.submitted_by;
      return _react["default"].createElement("div", {
        "data-tip": description,
        key: atID
      }, _react["default"].createElement("h5", {
        className: "text-300 text-ellipsis-container"
      }, title), _react["default"].createElement("h6", {
        className: "text-mono text-400 text-ellipsis-container"
      }, atID));
    },
    "fieldsToRequest": ['status', 'description', 'date_created', 'submitted_by']
  },
  "Project": {
    "render": function render(result) {
      var title = result.display_title,
          atID = result["@id"],
          description = result.description,
          status = result.status,
          date_created = result.date_created,
          submitted_by = result.submitted_by;
      return _react["default"].createElement("div", {
        "data-tip": description,
        key: atID
      }, _react["default"].createElement("h5", {
        className: "text-300 text-ellipsis-container"
      }, title), _react["default"].createElement("h6", {
        className: "text-mono text-400 text-ellipsis-container"
      }, atID));
    },
    "fieldsToRequest": ['status', 'description', 'date_created', 'submitted_by']
  },
  "Phenotype": {
    "render": function render(result) {
      var title = result.display_title,
          atID = result["@id"],
          description = result.description,
          hpo_id = result.hpo_id;
      return _react["default"].createElement("div", {
        "data-tip": description,
        key: atID
      }, _react["default"].createElement("h5", {
        className: "text-300 text-ellipsis-container"
      }, title), _react["default"].createElement("h6", {
        className: "text-mono text-400"
      }, hpo_id));
    },
    "fieldsToRequest": ["hpo_id"]
  }
};
/** Case for a linked object. */

exports.optionCustomizationsByType = optionCustomizationsByType;

var LinkedObj =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(LinkedObj, _React$PureComponent2);

  _createClass(LinkedObj, null, [{
    key: "isInSelectionField",

    /**
     * @param {Object} props - Props passed from LinkedObj or BuildField.
     * @param {string} props.nestedField - Field of LinkedObj
     * @param {number[]|null} props.arrayIdx - Array index (if any) of this item, if any.
     * @param {string} props.fieldBeingSelected - Field currently selected for linkedTo item selection.
     * @param {number[]|null} props.fieldBeingSelectedArrayIdx - Array index (if any) of currently selected for linkedTo item selection.
     * @returns {boolean} Whether is currently selected field/item or not.
     */
    value: function isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx) {
      //if (!props) return false;
      //const { fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx } = props;
      if (!fieldBeingSelected || fieldBeingSelected !== nestedField) {
        return false;
      }

      if (arrayIdx === null && fieldBeingSelectedArrayIdx === null) {
        return true;
      }

      if (Array.isArray(arrayIdx) && Array.isArray(fieldBeingSelectedArrayIdx)) {
        return _underscore._.every(arrayIdx, function (arrIdx, arrIdxIdx) {
          return arrIdx === fieldBeingSelectedArrayIdx[arrIdxIdx];
        });
      }

      return false;
    }
  }]);

  function LinkedObj(props) {
    var _this3;

    _classCallCheck(this, LinkedObj);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(LinkedObj).call(this, props));
    _this3.updateContext = _this3.updateContext.bind(_assertThisInitialized(_this3));
    _this3.setSubmissionStateToLinkedToItem = _this3.setSubmissionStateToLinkedToItem.bind(_assertThisInitialized(_this3));
    _this3.handleStartSelectItem = _this3.handleStartSelectItem.bind(_assertThisInitialized(_this3));
    _this3.handleFinishSelectItem = _this3.handleFinishSelectItem.bind(_assertThisInitialized(_this3));
    _this3.handleCreateNewItemClick = _this3.handleCreateNewItemClick.bind(_assertThisInitialized(_this3));
    _this3.handleTextInputChange = _this3.handleTextInputChange.bind(_assertThisInitialized(_this3));
    _this3.handleAcceptTypedID = _this3.handleAcceptTypedID.bind(_assertThisInitialized(_this3));
    _this3.childWindowAlert = _this3.childWindowAlert.bind(_assertThisInitialized(_this3));
    _this3.state = {
      'textInputValue': typeof props.value === 'string' && props.value || ''
    };
    return _this3;
  }

  _createClass(LinkedObj, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateContext();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.updateContext();

      _reactTooltip["default"].rebuild();
    }
    /**
     * Mechanism for changing value of linked object in parent context
     * from {number} keyIdx to {string} path of newly submitted object.
     */

  }, {
    key: "updateContext",
    value: function updateContext() {
      var _this$props3 = this.props,
          keyComplete = _this$props3.keyComplete,
          value = _this$props3.value,
          linkType = _this$props3.linkType,
          arrayIdx = _this$props3.arrayIdx,
          nestedField = _this$props3.nestedField,
          modifyNewContext = _this$props3.modifyNewContext;

      if (keyComplete[value] && !isNaN(value)) {
        modifyNewContext(nestedField, keyComplete[value], 'finished linked object', linkType, arrayIdx);

        _reactTooltip["default"].rebuild();
      }
    }
  }, {
    key: "setSubmissionStateToLinkedToItem",
    value: function setSubmissionStateToLinkedToItem(e) {
      e.preventDefault();
      e.stopPropagation();
      var intKey = parseInt(this.props.value);
      if (isNaN(intKey)) throw new Error('Expected an integer for props.value, received', this.props.value);
      this.props.setSubmissionState('currKey', intKey);
      console.log("called LinkedObj.setSubmissionStateToLinkedToItem");
    }
  }, {
    key: "handleStartSelectItem",
    value: function handleStartSelectItem(e) {
      e.preventDefault();
      if (!window) return;
      var _this$props4 = this.props,
          schema = _this$props4.schema,
          nestedField = _this$props4.nestedField,
          currType = _this$props4.currType,
          linkType = _this$props4.linkType,
          arrayIdx = _this$props4.arrayIdx,
          selectObj = _this$props4.selectObj,
          selectCancel = _this$props4.selectCancel;
      var itemType = schema.linkTo;
      console.log("calling LinkedObj.handleStartSelectItem -> selectObj(itemType=".concat(itemType, ", nestedField=").concat(nestedField, ", arrayIdx=").concat(arrayIdx, ")"));
      selectObj(itemType, nestedField, arrayIdx);
    }
    /**
     * Handles drop event for the (temporarily-existing-while-dragging-over) window drop receiver element.
     * Grabs @ID of Item from evt.dataTransfer, attempting to grab from 'text/4dn-item-id', 'text/4dn-item-json', or 'text/plain'.
     * @see Notes and inline comments for handleChildFourFrontSelectionClick re isValidAtId.
     */

  }, {
    key: "handleFinishSelectItem",
    value: function handleFinishSelectItem(items) {
      console.log("calling handleFinishSelectItem(items={obj})");
      console.log("items: ", items);
      console.log("props: selectComplete=".concat(selectComplete, ", isMultiSelect=").concat(isMultiSelect));
      var _this$props5 = this.props,
          selectComplete = _this$props5.selectComplete,
          isMultiSelect = _this$props5.isMultiSelect;

      if (!items || !Array.isArray(items) || items.length === 0 || !_underscore._.every(items, function (item) {
        return item.id && typeof item.id === 'string' && item.json;
      })) {
        return;
      }

      var atIds;

      if (!(isMultiSelect || false)) {
        if (items.length > 1) {
          console.warn('Multiple items selected but we only get a single item, since handler\'s not supporting multiple items!');
        }

        var _items = _slicedToArray(items, 1),
            _items$ = _items[0],
            atId = _items$.id,
            itemContext = _items$.json;

        atIds = [atId];
      } else {
        atIds = _underscore._.pluck(items, "id");
      } // Check validity of item IDs, and handle items with invalid IDs/URLs


      var invalidTitle = "Invalid Item Selected";

      if (_underscore._.every(atIds, function (atId) {
        var isValidAtId = _util.object.isValidAtIDFormat(atId);

        return atId && isValidAtId;
      })) {
        _Alerts.Alerts.deQueue({
          'title': invalidTitle
        });

        console.log("calling selectComplete(".concat(atIds, ")"));
        selectComplete(atIds); // submit the values
      } else {
        _Alerts.Alerts.queue({
          'title': invalidTitle,
          'message': "You have selected an item or link which doesn't have a valid 4DN ID or URL associated with it. Please try again.",
          'style': 'danger'
        });

        throw new Error('No valid @id available.');
      }

      console.log("called LinkedObj.handleFinishSelectItem");
    }
  }, {
    key: "handleCreateNewItemClick",
    value: function handleCreateNewItemClick(e) {
      console.log("called LinkedObj.handleNewItemClick");
      e.preventDefault();
      var _this$props6 = this.props,
          fieldBeingSelected = _this$props6.fieldBeingSelected,
          selectCancel = _this$props6.selectCancel,
          modifyNewContext = _this$props6.modifyNewContext,
          nestedField = _this$props6.nestedField,
          linkType = _this$props6.linkType,
          arrayIdx = _this$props6.arrayIdx,
          schema = _this$props6.schema;
      if (fieldBeingSelected !== null) selectCancel();
      modifyNewContext(nestedField, null, 'new linked object', linkType, arrayIdx, schema.linkTo);
    }
  }, {
    key: "handleAcceptTypedID",
    value: function handleAcceptTypedID(evt) {
      console.log("calling LinkedObj.handleAcceptTypedID(evt=".concat(evt, ")"));

      if (!this || !this.state || !this.state.textInputValue) {
        throw new Error('Invalid @id format.');
      }

      var atIds = [this.state.textInputValue];
      this.props.selectComplete(atIds);
    }
  }, {
    key: "handleTextInputChange",
    value: function handleTextInputChange(evt) {
      this.setState({
        'textInputValue': evt.target.value
      });
    }
  }, {
    key: "childWindowAlert",
    value: function childWindowAlert() {
      var _this$props7 = this.props,
          schema = _this$props7.schema,
          nestedField = _this$props7.nestedField,
          isMultiSelect = _this$props7.isMultiSelect;
      var itemType = schema && schema.linkTo;
      var prettyTitle = schema && (schema.parentSchema && schema.parentSchema.title || schema.title);
      // const message = (
      //     <div>
      //         { !isMultiSelect?
      //             <p className="mb-0">
      //                 Please either select an Item below and click <em>Apply</em> or <em>drag and drop</em> an Item (row) from this window into the submissions window.
      //             </p>
      //             :
      //             <p className="mb-0">
      //                 Please select the Item(s) you would like and then press <em>Apply</em> below.
      //             </p>
      //         }
      //         <p className="mb-0">You may use facets on the left-hand side to narrow down results.</p>
      //     </div>
      // );
      return {
        title: 'Selecting ' + itemType + ' for field ' + (prettyTitle ? prettyTitle + ' ("' + nestedField + '")' : '"' + nestedField + '"'),
        message: null,
        style: 'info'
      };
    }
  }, {
    key: "renderSelectInputField",
    value: function renderSelectInputField() {
      var _this$props8 = this.props,
          value = _this$props8.value,
          selectCancel = _this$props8.selectCancel,
          schema = _this$props8.schema,
          currType = _this$props8.currType,
          nestedField = _this$props8.nestedField,
          isMultiSelect = _this$props8.isMultiSelect,
          baseHref = _this$props8.baseHref;
      this.state.textInputValue; // const canShowAcceptTypedInput = typeof textInputValue === 'string' && textInputValue.length > 3;
      // const extClass = !canShowAcceptTypedInput && textInputValue ? ' has-error' : '';

      var itemType = schema.linkTo;
      var prettyTitle = schema && (schema.parentSchema && schema.parentSchema.title || schema.title);
      var searchURL = baseHref + "&currentAction=" + (isMultiSelect ? 'multiselect' : 'selection') + '&type=' + itemType;
      console.log("this.props", this.props); // check if we have any schema flags that will affect the searchUrl

      if (schema.ff_flag && schema.ff_flag.startsWith('filter:')) {
        // the field to facet on could be set dynamically
        if (schema.ff_flag == "filter:valid_item_types") {
          searchURL += '&valid_item_types=' + currType;
        }
      }

      return _react["default"].createElement(_LinkToSelector.LinkToSelector, {
        isSelecting: true,
        onSelect: this.handleFinishSelectItem,
        onCloseChildWindow: selectCancel,
        childWindowAlert: this.childWindowAlert,
        dropMessage: "Drop " + (itemType || "Item") + " for field '" + (prettyTitle || nestedField) + "'",
        searchURL: searchURL
      });
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      return _react["default"].createElement("div", {
        className: "linked-object-buttons-container"
      }, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-outline-secondary adv-search",
        "data-tip": "Advanced Search",
        onClick: this.handleStartSelectItem
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-search fas"
      })), _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-outline-secondary create-new-obj",
        "data-tip": "Create New",
        onClick: this.handleCreateNewItemClick
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-file-medical fas"
      })));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
          value = _this$props9.value,
          _this$props9$keyDispl = _this$props9.keyDisplay,
          keyDisplay = _this$props9$keyDispl === void 0 ? {} : _this$props9$keyDispl,
          keyComplete = _this$props9.keyComplete,
          fieldBeingSelected = _this$props9.fieldBeingSelected,
          nestedField = _this$props9.nestedField,
          arrayIdx = _this$props9.arrayIdx,
          fieldBeingSelectedArrayIdx = _this$props9.fieldBeingSelectedArrayIdx;
      var isSelecting = LinkedObj.isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx);

      if (isSelecting) {
        return this.renderSelectInputField();
      } // object chosen or being created


      if (value) {
        var thisDisplay = keyDisplay[value] ? keyDisplay[value] + " (<code>" + value + "</code>)" : "<code>" + value + "</code>";

        if (isNaN(value)) {
          return this.renderButtons();
        } else {
          // it's a custom object. Either render a link to editing the object
          // or a pop-up link to the object if it's already submitted
          var intKey = parseInt(value); // this is a fallback - shouldn't be int because value should be
          // string once the obj is successfully submitted

          if (keyComplete[intKey]) {
            return _react["default"].createElement("div", null, _react["default"].createElement("a", {
              href: keyComplete[intKey],
              target: "_blank",
              rel: "noopener noreferrer"
            }, thisDisplay), _react["default"].createElement("i", {
              className: "icon icon-fw icon-external-link-alt ml-05 fas"
            }));
          } else {
            return _react["default"].createElement("div", {
              className: "incomplete-linked-object-display-container text-ellipsis-container"
            }, _react["default"].createElement("i", {
              className: "icon icon-fw icon-sticky-note far"
            }), "\xA0\xA0", _react["default"].createElement("a", {
              href: "#",
              onClick: this.setSubmissionStateToLinkedToItem,
              "data-tip": "Continue editing/submitting"
            }, thisDisplay), "\xA0", _react["default"].createElement("i", {
              style: {
                'fontSize': '0.85rem'
              },
              className: "icon icon-fw icon-pencil ml-05 fas"
            }));
          }
        }
      } else {
        // nothing chosen/created yet
        return this.renderButtons();
      }
    }
  }]);

  return LinkedObj;
}(_react["default"].PureComponent);

exports.LinkedObj = LinkedObj;

var SquareButton = _react["default"].memo(function (props) {
  var show = props.show,
      disabled = props.disabled,
      onClick = props.onClick,
      tip = props.tip,
      bsStyle = props.bsStyle,
      className = props.className,
      buttonContainerClassName = props.buttonContainerClassName,
      icon = props.icon,
      style = props.style;
  var outerCls = "remove-button-container" + (buttonContainerClassName ? ' ' + buttonContainerClassName : '');
  var btnCls = "btn" + (className ? " " + className : "");

  if (bsStyle) {
    btnCls += " btn-" + bsStyle;
  }

  return _react["default"].createElement("div", {
    className: "remove-button-column" + (!show ? ' hidden' : ''),
    style: style
  }, _react["default"].createElement(_Fade.Fade, {
    "in": show
  }, _react["default"].createElement("div", {
    className: outerCls
  }, _react["default"].createElement("button", {
    type: "button",
    disabled: disabled || !show,
    onClick: onClick,
    "data-tip": tip,
    tabIndex: 2,
    className: btnCls
  }, _react["default"].createElement("i", {
    className: "icon icon-fw icon-" + icon
  })))));
});

exports.SquareButton = SquareButton;
SquareButton.defaultProps = {
  'bsStyle': 'danger',
  'icon': 'times fas',
  'style': null
};