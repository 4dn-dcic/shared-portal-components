"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubmissionViewSearchAsYouTypeAjax = SubmissionViewSearchAsYouTypeAjax;
exports.optionCustomizationsByType = exports.SearchAsYouTypeAjax = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = require("underscore");

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _util = require("./../../util/");

var _util2 = require("./../../util");

var _SearchSelectionMenu = require("./SearchSelectionMenu");

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
    }; // this.totalCount = 0; // todo: remove post-testing
    // this.processedCount = 0; // todo: remove post-testing

    _this.currentRequest = null;
    _this.hasBeenOpened = false;
    _this.onLoadData = (0, _underscore.debounce)(_this.onLoadData.bind(_assertThisInitialized(_this)), 500, false);
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
      // this.totalCount++;
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
      var _this$props = this.props,
          onChange = _this$props.onChange,
          _this$props$allowCust = _this$props.allowCustomValue,
          allowCustomValue = _this$props$allowCust === void 0 ? false : _this$props$allowCust;
      var _evt$target$value = evt.target.value,
          value = _evt$target$value === void 0 ? null : _evt$target$value; // this.totalCount++;
      // console.log("this is keypress number: ",  this.totalCount);

      if (allowCustomValue) {
        onChange(value);
      }

      this.setState({
        currentTextValue: value
      });
      this.onLoadData(value);
    }
  }, {
    key: "constructFetchURL",
    value: function constructFetchURL() {
      var _this$props2 = this.props,
          _this$props2$baseHref = _this$props2.baseHref,
          baseHref = _this$props2$baseHref === void 0 ? SearchAsYouTypeAjax.defaultProps.baseHref : _this$props2$baseHref,
          _this$props2$fieldsTo = _this$props2.fieldsToRequest,
          fieldsToRequest = _this$props2$fieldsTo === void 0 ? [] : _this$props2$fieldsTo;
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
      var _this$props3 = this.props,
          _this$props3$filterMe = _this$props3.filterMethod,
          filterMethod = _this$props3$filterMe === void 0 ? "startsWith" : _this$props3$filterMe,
          propOptionsHeader = _this$props3.optionsHeader,
          allowCustomValue = _this$props3.allowCustomValue,
          passProps = _objectWithoutProperties(_this$props3, ["filterMethod", "optionsHeader", "allowCustomValue"]);

      var _this$state = this.state,
          currentTextValue = _this$state.currentTextValue,
          _this$state$results = _this$state.results,
          results = _this$state$results === void 0 ? [] : _this$state$results,
          loading = _this$state.loading,
          error = _this$state.error;
      var optionsHeader = propOptionsHeader;

      if (loading && !error) {
        optionsHeader = _react["default"].createElement("div", {
          className: "text-center py-2"
        }, _react["default"].createElement("i", {
          className: "icon icon-spin icon-circle-notch fas"
        }));
      } else {
        if (results.length === 0 && !error) {
          optionsHeader = _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("em", {
            className: "d-block text-center px-4 py-1"
          }, allowCustomValue ? "Adding new entry" : "No results found"), optionsHeader);
        } else if (error) {
          optionsHeader = _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("em", {
            className: "d-block text-center px-4 py-1"
          }, _react["default"].createElement("i", {
            className: "fas icon-warning icon"
          }), " ", error), optionsHeader);
        }
      }

      return _react["default"].createElement(_SearchSelectionMenu.SearchSelectionMenu, _extends({}, passProps, {
        optionsHeader: optionsHeader,
        currentTextValue: currentTextValue
      }, {
        options: results,
        onToggleOpen: this.onToggleOpen,
        onTextInputChange: this.onTextInputChange,
        onDropdownSelect: this.onDropdownSelect
      }));
    }
  }]);

  return SearchAsYouTypeAjax;
}(_react["default"].PureComponent);

exports.SearchAsYouTypeAjax = SearchAsYouTypeAjax;
SearchAsYouTypeAjax.propTypes = {
  value: _propTypes["default"].any,
  allowCustomValue: _propTypes["default"].bool,
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
      className: "text-300"
    }, title), _react["default"].createElement("h6", {
      className: "text-mono text-400"
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
  var onChangeProp = props.onChange,
      value = props.value,
      itemTypeProp = props.itemTypeProp;
  var itemType = itemType || itemTypeProp || "Item"; // "some logic based on SubmissionView props if itemType not already available"

  var optionRenderFunction = (optionCustomizationsByType[itemType] && optionCustomizationsByType[itemType].render ? optionCustomizationsByType[itemType].render : null) || SearchAsYouTypeAjax.defaultProps.optionRenderFunction;
  var fieldsToRequest = (optionCustomizationsByType[itemType] && optionCustomizationsByType[itemType].fieldsToRequest ? optionCustomizationsByType[itemType].fieldsToRequest : null) || SearchAsYouTypeAjax.defaultProps.fieldsToRequest;
  return _react["default"].createElement(SearchAsYouTypeAjax, _extends({
    value: value,
    onChange: function (resultItem) {
      // Should probably be a method on class, or similar approach so that doesn't get re-instantiated on each render
      return onChangeProp(resultItem['@id']);
    },
    baseHref: "/search/?type=" + itemType,
    optionRenderFunction: optionRenderFunction,
    fieldsToRequest: fieldsToRequest
  }, {
    titleRenderFunction: submissionViewTitleRenderFunction
  }));
}

function submissionViewTitleRenderFunction(resultAtID) {
  return resultAtID;
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
    "render": function render(result) {
      var title = result.display_title,
          atID = result["@id"],
          description = result.description;
      return _react["default"].createElement("div", {
        "data-tip": description,
        key: atID
      }, _react["default"].createElement("h5", {
        className: "text-300"
      }, title), _react["default"].createElement("h6", {
        className: "text-mono text-400"
      }, atID));
    },
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
        className: "text-300"
      }, title), _react["default"].createElement("h6", {
        className: "text-mono text-400"
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
        className: "text-300"
      }, title), _react["default"].createElement("h6", {
        className: "text-mono text-400"
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
        className: "text-300"
      }, title), _react["default"].createElement("h6", {
        className: "text-mono text-400"
      }, atID), _react["default"].createElement("h7", {
        className: "text-mono text-400"
      }, submitted_by.display_title));
    },
    "fieldsToRequest": ['status', 'description', 'date_created', 'submitted_by']
  },
  // "Disorder" : { // todo: currently not in use on cgap
  //     "render" : function(result){
  //         const { display_title: title, "@id" : atID, description } = result;
  //         return (
  //             <div data-tip={description} key={atID}>
  //                 <h5 className="text-300">{ title }</h5>
  //                 <h6 className="text-mono text-400">{ atID }</h6>
  //             </div>
  //         );
  //     },
  //     "fieldsToRequest" : []
  // },
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
        className: "text-300"
      }, title), _react["default"].createElement("h6", {
        className: "text-mono text-400"
      }, hpo_id));
    },
    "fieldsToRequest": ["hpo_id"]
  }
};
exports.optionCustomizationsByType = optionCustomizationsByType;