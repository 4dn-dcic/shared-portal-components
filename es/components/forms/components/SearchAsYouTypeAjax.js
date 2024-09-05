import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
var _excluded = ["optionsHeader", "value", "keyComplete"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _callSuper(_this, derived, args) {
  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, function () {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import Fade from 'react-bootstrap/esm/Fade';
import { ajax, object, logger } from './../../util/';
import { Alerts } from './../../ui/Alerts';
import { LinkToSelector } from './LinkToSelector';
import { SearchSelectionMenu } from './SearchSelectionMenu';
export var SearchAsYouTypeAjax = /*#__PURE__*/function (_React$PureComponent) {
  function SearchAsYouTypeAjax(props) {
    var _this2;
    _classCallCheck(this, SearchAsYouTypeAjax);
    _this2 = _callSuper(this, SearchAsYouTypeAjax, [props]);
    _this2.state = {
      results: [],
      currentTextValue: props.value || "",
      loading: true,
      // starts out by loading base RequestURL
      error: null
    };
    _this2.currentRequest = null;
    _this2.hasBeenOpened = false;
    _this2.onLoadData = _.debounce(_this2.onLoadData.bind(_this2), 500, false);
    _this2.constructFetchURL = _this2.constructFetchURL.bind(_this2);
    _this2.onTextInputChange = _this2.onTextInputChange.bind(_this2);
    _this2.onDropdownSelect = _this2.onDropdownSelect.bind(_this2);
    _this2.onToggleOpen = _this2.onToggleOpen.bind(_this2);
    return _this2;
  }
  _inherits(SearchAsYouTypeAjax, _React$PureComponent);
  return _createClass(SearchAsYouTypeAjax, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var pastSelectedID = pastProps.value;
      var selectedID = this.props.value;
      var pastResults = pastState.results;
      var results = this.state.results;
      if (results !== pastResults) {
        ReactTooltip.rebuild();
      }
      if (pastSelectedID !== selectedID) {
        this.setState({
          currentTextValue: selectedID || ""
        });
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
        value = _evt$target$value === void 0 ? null : _evt$target$value;
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
      var _this3 = this;
      this.setState({
        loading: true
      }, function () {
        if (_this3.currentRequest) {
          // if there's already a request running, abort it
          _this3.currentRequest.abort && _this3.currentRequest.abort();
        }
        var requestInThisScope = _this3.currentRequest = ajax.load(_this3.constructFetchURL(), function (response) {
          if (requestInThisScope !== _this3.currentRequest) {
            return false; // some other request has been fired; cancel this one
          }

          _this3.currentRequest = null;
          if (!response || Object.keys(response).length === 0) {
            _this3.setState({
              loading: false,
              results: [],
              error: "Could not get a response from server. Check network and try again."
            });
            return;
          }
          _this3.setState({
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
          _this3.currentRequest = null;
          if (graph.length === 0) {
            // handle case in which no results found
            _this3.setState({
              loading: false,
              results: results,
              error: null
            });
          } else if (error) {
            // handle more general errors (should we display the actual error message to users?)
            logger.error("Status code " + status + " encountered. " + statusText);
            _this3.setState({
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
      var _this$props2 = this.props,
        onChange = _this$props2.onChange,
        value = _this$props2.value,
        titleRenderFunction = _this$props2.titleRenderFunction;
      var currentTextValue = this.state.currentTextValue;
      if (!titleRenderFunction(currentTextValue)) {
        console.log("title hasn't been registered");
        // if title hasn't been registered, use the old value
        onChange(result, value);
      } else {
        console.log("calling onDropdownSelect", result);
        onChange(result, result['@id']);
      }
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
        propOptionsHeader = _this$props3.optionsHeader,
        value = _this$props3.value,
        _this$props3$keyCompl = _this$props3.keyComplete,
        keyComplete = _this$props3$keyCompl === void 0 ? {} : _this$props3$keyCompl,
        leftoverProps = _objectWithoutProperties(_this$props3, _excluded);
      var _this$state = this.state,
        currentTextValue = _this$state.currentTextValue,
        _this$state$results = _this$state.results,
        results = _this$state$results === void 0 ? [] : _this$state$results,
        loading = _this$state.loading,
        error = _this$state.error;
      var optionsHeader = propOptionsHeader;
      var passProps = _objectSpread(_objectSpread({}, leftoverProps), {}, {
        keyComplete: keyComplete,
        value: value
      });
      if (loading && !error) {
        optionsHeader = /*#__PURE__*/React.createElement("div", {
          className: "text-center py-3"
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-spin icon-circle-notch fas"
        }));
      } else {
        if (results.length === 0 && !error) {
          var queryLen = currentTextValue.length;
          optionsHeader = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("em", {
            className: "d-block text-center px-4 py-3"
          }, queryLen == 1 ? "Minimum search length is 2 characters" : "No results found"), optionsHeader);
        } else if (error) {
          optionsHeader = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("em", {
            className: "d-block text-center px-4 py-3"
          }, /*#__PURE__*/React.createElement("i", {
            className: "fas icon-warning icon"
          }), " ", error), optionsHeader);
        }
      }
      var intKey = parseInt(value); // if in the middle of editing a custom linked object for this field
      var hideButton = value && !isNaN(value) && !keyComplete[intKey];
      return hideButton ? null : /*#__PURE__*/React.createElement(SearchSelectionMenu, _extends({}, passProps, {
        optionsHeader: optionsHeader,
        currentTextValue: currentTextValue,
        alignRight: true,
        options: results,
        onToggleOpen: this.onToggleOpen,
        onTextInputChange: this.onTextInputChange,
        onDropdownSelect: this.onDropdownSelect
      }));
    }
  }]);
}(React.PureComponent);
SearchAsYouTypeAjax.propTypes = {
  "value": PropTypes.any,
  "onChange": PropTypes.func,
  "baseHref": function baseHref(props, propName, componentName) {
    if (props[propName] && !props[propName].match(/^\/search\/\?type=(.+)?$/)) {
      return new Error("Invalid prop '".concat(propName, "' supplied to ").concat(componentName, " --> ").concat(props[propName], ". Validation failed."));
    }
  },
  "fieldsToRequest": PropTypes.arrayOf(PropTypes.string),
  "titleRenderFunction": PropTypes.func
};
SearchAsYouTypeAjax.defaultProps = {
  "optionRenderFunction": function optionRenderFunction(result) {
    var title = result.display_title,
      atID = result["@id"],
      description = result.description;
    return /*#__PURE__*/React.createElement("div", {
      "data-tip": description,
      key: atID
    }, /*#__PURE__*/React.createElement("h5", {
      className: "text-300 text-truncate my-0"
    }, title), /*#__PURE__*/React.createElement("h6", {
      className: "text-mono text-400 text-truncate my-0"
    }, atID));
  },
  "titleRenderFunction": function titleRenderFunction(result) {
    return result.display_title;
  },
  "baseHref": "/search/?type=Item",
  "fieldsToRequest": ["@id", "display_title", "description"] // additional fields aside from @id, display_title, and description; all already included
};

/**
 * A HOC for wrapping SearchAsYouTypeAjax with SubmissionView specific bits, like
 * the LinkedObj component which renders the "Create New" & "Advanced Search" buttons.
 */
export function SubmissionViewSearchAsYouTypeAjax(props) {
  var selectComplete = props.selectComplete,
    nestedField = props.nestedField,
    value = props.value,
    arrayIdx = props.arrayIdx,
    _props$schema$linkTo = props.schema.linkTo,
    linkTo = _props$schema$linkTo === void 0 ? "Item" : _props$schema$linkTo,
    _props$itemType = props.itemType,
    itemType = _props$itemType === void 0 ? linkTo : _props$itemType,
    _props$idToTitleMap = props.idToTitleMap,
    idToTitleMap = _props$idToTitleMap === void 0 ? null : _props$idToTitleMap;

  // Add some logic based on schema.Linkto props if itemType not already available
  var baseHref = "/search/?type=" + linkTo;

  // console.log("idToTitleMap: ", idToTitleMap);

  // Retrieves Item types from SubmissionView props and uses that to pass SAYTAJAX
  // item-specific options for rendering dropdown items with more/different info than default
  var optionRenderFunction = (optionCustomizationsByType[itemType] && optionCustomizationsByType[itemType].render ? optionCustomizationsByType[itemType].render : null) || SearchAsYouTypeAjax.defaultProps.optionRenderFunction;

  // Retrieves the appropriate fields based on item type
  var fieldsToRequest = (optionCustomizationsByType[itemType] && optionCustomizationsByType[itemType].fieldsToRequest ? optionCustomizationsByType[itemType].fieldsToRequest : null) || SearchAsYouTypeAjax.defaultProps.fieldsToRequest;
  var onChange = useMemo(function () {
    return function (resultItem, valueToReplace) {
      // console.log("calling SubmissionViewSearchAsYouType onchange", arrayIdx);
      return selectComplete(resultItem['@id'], nestedField, itemType, arrayIdx, resultItem.display_title, valueToReplace);
    };
  }, [selectComplete, nestedField, itemType, arrayIdx]);

  // Uses idToTitleMap (similar to SubmissionView.keyDisplay) to keep track of & render display_titles
  // for previously seen objects
  var titleRenderFunction = useMemo(function () {
    return function (resultAtID) {
      return idToTitleMap[resultAtID] || resultAtID;
    };
  }, [idToTitleMap]);
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap"
  }, /*#__PURE__*/React.createElement(SearchAsYouTypeAjax, _extends({
    showTips: true,
    value: value,
    onChange: onChange,
    baseHref: baseHref,
    optionRenderFunction: optionRenderFunction,
    fieldsToRequest: fieldsToRequest,
    titleRenderFunction: titleRenderFunction,
    selectComplete: selectComplete
  }, props)), /*#__PURE__*/React.createElement(LinkedObj, _extends({
    key: "linked-item"
  }, props, {
    value: value,
    baseHref: baseHref
  })));
}
function sexToIcon(sex, showTip) {
  sex = sex.toLowerCase();
  if (sex && typeof sex === "string") {
    if (sex === "f") {
      sex = /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-venus fas",
        "data-tip": showTip ? "Sex: Female" : ""
      });
    } else if (sex === "m") {
      sex = /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-mars fas",
        "data-tip": showTip ? "Sex: Male" : ""
      });
    } else if (sex === "u") {
      sex = /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-genderless fas",
        "data-tip": showTip ? "Sex: Unknown" : ""
      });
    } else {
      sex = /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-question fas",
        "data-tip": showTip ? "Sex: N/A" : ""
      });
    }
  }
  return sex;
}
export var optionCustomizationsByType = {
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
      return (
        /*#__PURE__*/
        // need to better align right col, and adjust relative widths
        React.createElement("div", {
          "data-tip": description,
          key: atID,
          className: "d-flex align-items-center"
        }, /*#__PURE__*/React.createElement("div", {
          className: "col-9"
        }, /*#__PURE__*/React.createElement("h5", {
          className: "text-mono text-300 my-0"
        }, title), /*#__PURE__*/React.createElement("h6", {
          className: "text-mono text-400 my-0"
        }, aliases)), /*#__PURE__*/React.createElement("div", {
          className: "col-3"
        }, /*#__PURE__*/React.createElement("h5", {
          className: "text-300 my-0"
        }, "Age: ", age || "N/A"), /*#__PURE__*/React.createElement("h6", {
          className: "text-mono text-400 my-0"
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
      return /*#__PURE__*/React.createElement("div", {
        "data-tip": description,
        key: atID
      }, /*#__PURE__*/React.createElement("h5", {
        className: "text-300 text-truncate my-0"
      }, title), /*#__PURE__*/React.createElement("h6", {
        className: "text-mono text-400 text-truncate my-0"
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
      return /*#__PURE__*/React.createElement("div", {
        "data-tip": description,
        key: atID
      }, /*#__PURE__*/React.createElement("h5", {
        className: "text-300 w-100 my-0"
      }, title, " (", first_name, " ", last_name, ")"), /*#__PURE__*/React.createElement("h6", {
        className: "text-mono text-400 my-0"
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
      return /*#__PURE__*/React.createElement("div", {
        "data-tip": description,
        key: atID
      }, /*#__PURE__*/React.createElement("h5", {
        className: "text-300 text-truncate my-0"
      }, title), /*#__PURE__*/React.createElement("h6", {
        className: "text-mono text-400 text-truncate my-0"
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
      return /*#__PURE__*/React.createElement("div", {
        "data-tip": description,
        key: atID
      }, /*#__PURE__*/React.createElement("h5", {
        className: "text-300 text-truncate my-0"
      }, title), /*#__PURE__*/React.createElement("h6", {
        className: "text-mono text-400 text-truncate my-0"
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
      return /*#__PURE__*/React.createElement("div", {
        "data-tip": description,
        key: atID
      }, /*#__PURE__*/React.createElement("h5", {
        className: "text-300 text-truncate my-0"
      }, title), /*#__PURE__*/React.createElement("h6", {
        className: "text-mono text-400 my-0"
      }, hpo_id));
    },
    "fieldsToRequest": ["hpo_id"]
  }
};

/** Case for a linked object. */
export var LinkedObj = /*#__PURE__*/function (_React$PureComponent2) {
  function LinkedObj(props) {
    var _this4;
    _classCallCheck(this, LinkedObj);
    _this4 = _callSuper(this, LinkedObj, [props]);
    _this4.setSubmissionStateToLinkedToItem = _this4.setSubmissionStateToLinkedToItem.bind(_this4);
    _this4.handleStartSelectItem = _this4.handleStartSelectItem.bind(_this4);
    _this4.handleFinishSelectItem = _this4.handleFinishSelectItem.bind(_this4);
    _this4.handleCreateNewItemClick = _this4.handleCreateNewItemClick.bind(_this4);
    _this4.handleTextInputChange = _this4.handleTextInputChange.bind(_this4);
    _this4.handleAcceptTypedID = _this4.handleAcceptTypedID.bind(_this4);
    _this4.childWindowAlert = _this4.childWindowAlert.bind(_this4);
    _this4.state = {
      'textInputValue': typeof props.value === 'string' && props.value || ''
    };
    return _this4;
  }
  _inherits(LinkedObj, _React$PureComponent2);
  return _createClass(LinkedObj, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      ReactTooltip.rebuild();
    }
  }, {
    key: "setSubmissionStateToLinkedToItem",
    value: function setSubmissionStateToLinkedToItem(e) {
      var _this$props4 = this.props,
        value = _this$props4.value,
        setSubmissionState = _this$props4.setSubmissionState;
      e.preventDefault();
      e.stopPropagation();
      var intKey = parseInt(value);
      if (isNaN(intKey)) throw new Error('Expected an integer for props.value, received', value);
      setSubmissionState('currKey', intKey);
    }
  }, {
    key: "handleStartSelectItem",
    value: function handleStartSelectItem(e) {
      e.preventDefault();
      if (!window) return;
      var _this$props5 = this.props,
        schema = _this$props5.schema,
        nestedField = _this$props5.nestedField,
        arrayIdx = _this$props5.arrayIdx,
        selectObj = _this$props5.selectObj;
      var itemType = schema.linkTo;
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
      // console.log("calling LinkedObj.handleFinishSelectItem with: ", items);
      var _this$props6 = this.props,
        selectComplete = _this$props6.selectComplete,
        isMultiSelect = _this$props6.isMultiSelect;
      if (!items || !Array.isArray(items) || items.length === 0 || !_.every(items, function (item) {
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
        atIds = _.pluck(items, "id");
      }

      // Check validity of item IDs, and handle items with invalid IDs/URLs
      var invalidTitle = "Invalid Item Selected";
      if (_.every(atIds, function (atId) {
        var isValidAtId = object.isValidAtIDFormat(atId);
        return atId && isValidAtId;
      })) {
        Alerts.deQueue({
          'title': invalidTitle
        });
        selectComplete(atIds); // submit the values
      } else {
        Alerts.queue({
          'title': invalidTitle,
          'message': "You have selected an item or link which doesn't have a valid 4DN ID or URL associated with it. Please try again.",
          'style': 'danger'
        });
        throw new Error('No valid @id available.');
      }
    }
  }, {
    key: "handleCreateNewItemClick",
    value: function handleCreateNewItemClick(e) {
      // console.log("called LinkedObj.handleNewItemClick");
      e.preventDefault();
      var _this$props7 = this.props,
        fieldBeingSelected = _this$props7.fieldBeingSelected,
        selectCancel = _this$props7.selectCancel,
        modifyNewContext = _this$props7.modifyNewContext,
        nestedField = _this$props7.nestedField,
        linkType = _this$props7.linkType,
        arrayIdx = _this$props7.arrayIdx,
        schema = _this$props7.schema;
      if (fieldBeingSelected !== null) selectCancel();
      modifyNewContext(nestedField, null, 'new linked object', linkType, arrayIdx, schema.linkTo);
    }
  }, {
    key: "handleAcceptTypedID",
    value: function handleAcceptTypedID() {
      // console.log(`calling LinkedObj.handleAcceptTypedID(evt=${evt})`);
      var selectComplete = this.props.selectComplete;
      var textInputValue = this.state.textInputValue;
      if (!this || !this.state || !textInputValue) {
        throw new Error('Invalid @id format.');
      }
      selectComplete([textInputValue]);
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
      var _this$props8 = this.props,
        schema = _this$props8.schema,
        nestedField = _this$props8.nestedField,
        isMultiSelect = _this$props8.isMultiSelect;
      var itemType = schema && schema.linkTo;
      var prettyTitle = schema && (schema.parentSchema && schema.parentSchema.title || schema.title);
      var message = /*#__PURE__*/React.createElement("div", null, !isMultiSelect ? /*#__PURE__*/React.createElement("p", {
        className: "mb-0"
      }, "Please either select an Item below and click ", /*#__PURE__*/React.createElement("em", null, "Apply"), " or ", /*#__PURE__*/React.createElement("em", null, "drag and drop"), " an Item (row) from this window into the submissions window.") : /*#__PURE__*/React.createElement("p", {
        className: "mb-0"
      }, "Please select the Item(s) you would like and then press ", /*#__PURE__*/React.createElement("em", null, "Apply"), " below."), /*#__PURE__*/React.createElement("p", {
        className: "mb-0"
      }, "You may use facets on the left-hand side to narrow down results."));
      return {
        title: 'Selecting ' + itemType + ' for field ' + (prettyTitle ? prettyTitle + ' ("' + nestedField + '")' : '"' + nestedField + '"'),
        message: message,
        style: 'info'
      };
    }
  }, {
    key: "renderSelectInputField",
    value: function renderSelectInputField() {
      var _this$props9 = this.props,
        selectCancel = _this$props9.selectCancel,
        schema = _this$props9.schema,
        currType = _this$props9.currType,
        nestedField = _this$props9.nestedField,
        isMultiSelect = _this$props9.isMultiSelect,
        baseHref = _this$props9.baseHref,
        value = _this$props9.value;
      var itemType = schema.linkTo;
      var prettyTitle = schema && (schema.parentSchema && schema.parentSchema.title || schema.title);
      var searchURL = baseHref + "&currentAction=" + (isMultiSelect ? 'multiselect' : 'selection') + '&type=' + itemType;

      // check if we have any schema flags that will affect the searchUrl
      if (schema.ff_flag && schema.ff_flag.startsWith('filter:')) {
        // the field to facet on could be set dynamically
        if (schema.ff_flag == "filter:valid_item_types") {
          searchURL += '&valid_item_types=' + currType;
        }
      }
      return /*#__PURE__*/React.createElement(LinkToSelector, {
        isSelecting: true,
        onSelect: this.handleFinishSelectItem,
        onCloseChildWindow: selectCancel,
        childWindowAlert: this.childWindowAlert,
        value: value,
        dropMessage: "Drop " + (itemType || "Item") + " for field '" + (prettyTitle || nestedField) + "'",
        searchURL: searchURL
      });
    }
  }, {
    key: "renderButtons",
    value: function renderButtons() {
      return /*#__PURE__*/React.createElement("div", {
        className: "linked-object-buttons-container"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-outline-secondary adv-search",
        "data-tip": "Advanced Search",
        onClick: this.handleStartSelectItem
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-search fas"
      })), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-outline-secondary create-new-obj",
        "data-tip": "Create New",
        onClick: this.handleCreateNewItemClick
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-file-medical fas"
      })));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props10 = this.props,
        value = _this$props10.value,
        _this$props10$keyDisp = _this$props10.keyDisplay,
        keyDisplay = _this$props10$keyDisp === void 0 ? {} : _this$props10$keyDisp,
        keyComplete = _this$props10.keyComplete,
        fieldBeingSelected = _this$props10.fieldBeingSelected,
        nestedField = _this$props10.nestedField,
        arrayIdx = _this$props10.arrayIdx,
        fieldBeingSelectedArrayIdx = _this$props10.fieldBeingSelectedArrayIdx;
      var isSelecting = LinkedObj.isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx);
      if (isSelecting) {
        return this.renderSelectInputField();
      }

      // object chosen or being created
      if (value) {
        var thisDisplay = keyDisplay[value] ? /*#__PURE__*/React.createElement(React.Fragment, null, keyDisplay[value], /*#__PURE__*/React.createElement("code", null, value)) : /*#__PURE__*/React.createElement("code", null, value);
        if (isNaN(value)) {
          return this.renderButtons();
        } else {
          // it's a custom object. Either render a link to editing the object
          // or a pop-up link to the object if it's already submitted
          var intKey = parseInt(value);
          // this is a fallback - shouldn't be int because value should be
          // string once the obj is successfully submitted
          if (keyComplete[intKey]) {
            return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
              href: keyComplete[intKey],
              target: "_blank",
              rel: "noopener noreferrer"
            }, thisDisplay), /*#__PURE__*/React.createElement("i", {
              className: "icon icon-fw icon-external-link-alt ms-05 fas"
            }));
          } else {
            return /*#__PURE__*/React.createElement("div", {
              className: "incomplete-linked-object-display-container text-truncate"
            }, /*#__PURE__*/React.createElement("i", {
              className: "icon icon-fw icon-edit far"
            }), "\xA0\xA0", /*#__PURE__*/React.createElement("a", {
              href: "#",
              onClick: this.setSubmissionStateToLinkedToItem,
              "data-tip": "Continue editing/submitting"
            }, thisDisplay), "\xA0");
          }
        }
      } else {
        // nothing chosen/created yet
        return this.renderButtons();
      }
    }
  }], [{
    key: "isInSelectionField",
    value:
    /**
     * @param {string} props.nestedField - Field of LinkedObj
     * @param {number[]|null} props.arrayIdx - Array index (if any) of this item, if any.
     * @param {string} props.fieldBeingSelected - Field currently selected for linkedTo item selection.
     * @param {number[]|null} props.fieldBeingSelectedArrayIdx - Array index (if any) of currently selected for linkedTo item selection.
     * @returns {boolean} Whether is currently selected field/item or not.
     */
    function isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx) {
      if (!fieldBeingSelected || fieldBeingSelected !== nestedField) {
        return false;
      }
      if (arrayIdx === null && fieldBeingSelectedArrayIdx === null) {
        return true;
      }
      if (Array.isArray(arrayIdx) && Array.isArray(fieldBeingSelectedArrayIdx)) {
        return _.every(arrayIdx, function (arrIdx, arrIdxIdx) {
          return arrIdx === fieldBeingSelectedArrayIdx[arrIdxIdx];
        });
      }
      return false;
    }
  }]);
}(React.PureComponent);
export var SquareButton = /*#__PURE__*/React.memo(function (props) {
  var show = props.show,
    disabled = props.disabled,
    onClick = props.onClick,
    tip = props.tip,
    _props$bsStyle = props.bsStyle,
    bsStyle = _props$bsStyle === void 0 ? 'danger' : _props$bsStyle,
    className = props.className,
    buttonContainerClassName = props.buttonContainerClassName,
    _props$icon = props.icon,
    icon = _props$icon === void 0 ? 'times fas' : _props$icon,
    _props$style = props.style,
    style = _props$style === void 0 ? null : _props$style;
  var outerCls = "remove-button-container" + (buttonContainerClassName ? ' ' + buttonContainerClassName : '');
  var btnCls = "btn" + (className ? " " + className : "");
  if (bsStyle) {
    btnCls += " btn-" + bsStyle;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "remove-button-column" + (!show ? ' hidden' : ''),
    style: style
  }, /*#__PURE__*/React.createElement(Fade, {
    "in": show
  }, /*#__PURE__*/React.createElement("div", {
    className: outerCls
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled || !show,
    onClick: onClick,
    "data-tip": tip,
    tabIndex: 2,
    className: btnCls
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-" + icon
  })))));
});