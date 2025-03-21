import _extends from "@babel/runtime/helpers/extends";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
var _excluded = ["children"],
  _excluded2 = ["children"];
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { Alerts } from './../../ui/Alerts';
import { itemUtil } from './../../util/object';
import { isSelectAction, storeExists } from './../../util/misc';
import * as logger from '../../util/logger';
import { DisplayTitleColumnWrapper, DisplayTitleColumnDefault } from './../../browse/components/table-commons/basicColumnExtensionMap';
import { getSchemaTypeFromSearchContext, getTitleForType } from './../../util/schema-transforms';
import { patchedConsoleInstance as console } from './../../util/patched-console';

/**
 * Utility function to post message to parent window
 * @param {Array} selectedItems: array of {id:ID of selected Item, if any, json:JSON of selected Item, if present (NOT GUARANTEED TO BE PROVIDED)} object
 * set selectedItems as empty array ([]) to close child window
 */
export function sendDataToParentWindow(itemsListWrappedWithID) {
  if (!itemsListWrappedWithID || itemsListWrappedWithID.length === 0) {
    return;
  }
  var eventJSON = {
    'items': itemsListWrappedWithID,
    'eventType': 'fourfrontselectionclick'
  };

  // Standard - postMessage
  try {
    window.opener.postMessage(eventJSON, '*');
  } catch (err) {
    // Check for presence of parent window and alert if non-existent.
    if (!(typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window)) {
      Alerts.queue({
        'title': 'Failed to send data to parent window.',
        'message': 'Please ensure there is a parent window to which this selection is being sent to. Alternatively, try to drag & drop the Item over instead.'
      });
    } else {
      logger.error('Unexpecter error -- browser may not support postMessage', err);
    }
  }

  // Nonstandard - in case browser doesn't support postMessage but does support other cross-window events (unlikely).
  window.dispatchEvent(new CustomEvent('fourfrontselectionclick', {
    'detail': eventJSON
  }));
}
export var SelectedItemsController = /*#__PURE__*/function (_React$PureComponent) {
  function SelectedItemsController(props) {
    var _this2;
    _classCallCheck(this, SelectedItemsController);
    _this2 = _callSuper(this, SelectedItemsController, [props]);
    _this2.handleSelectItem = _this2.handleSelectItem.bind(_this2);
    _this2.handleResetSelectedItems = _this2.handleResetSelectedItems.bind(_this2);
    _this2.state = {
      "selectedItems": new Map()
    };
    return _this2;
  }
  _inherits(SelectedItemsController, _React$PureComponent);
  return _createClass(SelectedItemsController, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var keepSelectionInStorage = this.props.keepSelectionInStorage;
      this.setState(function () {
        if (keepSelectionInStorage === true && storeExists() && localStorage.getItem("selected_items") !== null) {
          var foundItems = JSON.parse(localStorage.getItem("selected_items"));
          return {
            selectedItems: new Map(foundItems)
          };
        }
      });
    }

    /**
     * This function add/or removes the selected item into an Map in state,
     * if `props.currentAction` is set to "multiselect" or "selection".
     */
  }, {
    key: "handleSelectItem",
    value: function handleSelectItem(result, isMultiSelect) {
      var keepSelectionInStorage = this.props.keepSelectionInStorage;
      this.setState(function (_ref) {
        var prevItems = _ref.selectedItems;
        var nextItems = new Map(prevItems);
        var isList = Array.isArray(result);
        if (!isMultiSelect && isList) {
          throw new Error("Can only supply list if multiselect is also enabled");
        }
        if (isList) {
          // Add/overwrite only.
          result.forEach(function (resultItem) {
            nextItems.set(itemUtil.atId(resultItem), resultItem);
          });
        } else {
          // Toggle on/off.
          var resultAtID = itemUtil.atId(result);
          if (nextItems.has(resultAtID)) {
            nextItems["delete"](resultAtID);
          } else {
            if (!isMultiSelect) {
              nextItems.clear();
            }
            nextItems.set(resultAtID, result);
          }
        }
        if (keepSelectionInStorage && storeExists()) {
          localStorage.setItem("selected_items", JSON.stringify(Array.from(nextItems.entries())));
        }
        return {
          selectedItems: nextItems
        };
      });
    }
  }, {
    key: "handleResetSelectedItems",
    value: function handleResetSelectedItems() {
      var initialResults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var selectedItems = new Map();
      if (Array.isArray(initialResults)) {
        initialResults.forEach(function (result) {
          var atId = itemUtil.atId(result);
          selectedItems.set(atId, result);
        });
      }
      this.setState({
        selectedItems: selectedItems
      });
    }

    /**
     * If in selection mode and a `props.columnExtensionMap` is present,
     * extends columnExtensionMap's display_title render function.
     * Adds in a checkbox element which controls selectedItems state entry.
     */
  }, {
    key: "columnExtensionMapWithSelectButton",
    value: function columnExtensionMapWithSelectButton() {
      var _this3 = this;
      var _this$props = this.props,
        originalColumnExtensionMap = _this$props.columnExtensionMap,
        _this$props$currentAc = _this$props.currentAction,
        currentAction = _this$props$currentAc === void 0 ? null : _this$props$currentAc;

      // Check if `currentAction` is one of "selection" | "multiselect"
      var inSelectionMode = isSelectAction(currentAction);
      if (!inSelectionMode || !originalColumnExtensionMap) {
        return originalColumnExtensionMap;
      }

      // Kept for reference in case we want to re-introduce constrain that for 'select' button(s) to be visible in search result rows, there must be parent window.
      //var isThereParentWindow = inSelectionMode && typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window;

      // Render out button and add to title render output for "Select" if we have a 'selection' currentAction.
      // Also add the popLink/target=_blank functionality to links
      // Remove lab.display_title and type columns on selection
      var newColumnExtensionMap = _.clone(originalColumnExtensionMap);
      newColumnExtensionMap.display_title = _objectSpread(_objectSpread({}, newColumnExtensionMap.display_title), {}, {
        'minColumnWidth': (originalColumnExtensionMap.display_title.minColumnWidth || 100) + 20,
        'render': function render(result, parentProps) {
          var selectedItems = _this3.state.selectedItems;
          var rowNumber = parentProps.rowNumber,
            detailOpen = parentProps.detailOpen,
            toggleDetailOpen = parentProps.toggleDetailOpen,
            href = parentProps.href,
            context = parentProps.context;
          return /*#__PURE__*/React.createElement(DisplayTitleColumnWrapper, {
            result: result,
            href: href,
            context: context,
            rowNumber: rowNumber,
            detailOpen: detailOpen,
            toggleDetailOpen: toggleDetailOpen
          }, /*#__PURE__*/React.createElement(SelectionItemCheckbox, {
            selectedItems: selectedItems,
            onSelectItem: _this3.handleSelectItem,
            isMultiSelect: currentAction === 'multiselect'
          }), /*#__PURE__*/React.createElement(DisplayTitleColumnDefault, null));
        }
      });
      return newColumnExtensionMap;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        children = _this$props2.children,
        remainingProps = _objectWithoutProperties(_this$props2, _excluded);
      var selectedItems = this.state.selectedItems;
      var propsToPass = _objectSpread(_objectSpread({}, remainingProps), {}, {
        selectedItems: selectedItems,
        columnExtensionMap: this.columnExtensionMapWithSelectButton(),
        onSelectItem: this.handleSelectItem,
        onResetSelectedItems: this.handleResetSelectedItems
      });
      return React.Children.map(children, function (child) {
        if (! /*#__PURE__*/React.isValidElement(child)) {
          throw new Error('SelectedItemsSearchController expects props.children to be a valid React component instance(s).');
        }
        return /*#__PURE__*/React.cloneElement(child, propsToPass);
      });
    }
  }]);
}(React.PureComponent);
export var SelectionItemCheckbox = /*#__PURE__*/React.memo(function (props) {
  var selectedItems = props.selectedItems,
    result = props.result,
    isMultiSelect = props.isMultiSelect,
    onSelectItem = props.onSelectItem;
  var isChecked = selectedItems.has(itemUtil.atId(result));
  var onChange = useMemo(function () {
    return onSelectItem.bind(onSelectItem, result, isMultiSelect);
  }, [onSelectItem, result, isMultiSelect]);
  return /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: isChecked,
    onChange: onChange,
    className: "me-2"
  });
});

/** Move to own file later maybe. Especially if functionality expands. */
export var SelectStickyFooter = /*#__PURE__*/React.memo(function (props) {
  var context = props.context,
    schemas = props.schemas,
    selectedItems = props.selectedItems,
    currentAction = props.currentAction;

  /** This function sends selected items to parent window. */
  var onComplete = useCallback(function () {
    var itemsWrappedWithID = [];
    var _iterator = _createForOfIteratorHelper(selectedItems),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];
        itemsWrappedWithID.push({
          "id": key,
          "json": value
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    sendDataToParentWindow(itemsWrappedWithID);
  }, [selectedItems]);
  var onCancel = useCallback(function () {
    if (selectedItems.size > 0) {
      if (!window.confirm('Leaving will cause all selected item(s) to be lost. Are you sure you want to proceed?')) {
        return;
      }
    }
    window.dispatchEvent(new Event('fourfrontcancelclick'));
    // CURRENT: If we have parent window, post a message to it as well.
    if (window.opener) {
      window.opener.postMessage({
        'eventType': 'fourfrontcancelclick'
      }, '*');
    } else {
      logger.error("Couldn't access opener window.");
    }
  }, [selectedItems]);
  var itemTypeFriendlyName = getTitleForType(getSchemaTypeFromSearchContext(context), schemas);
  var selectedItemDisplayTitle = currentAction === 'selection' && selectedItems.size === 1 ? selectedItems.entries().next().value[1].display_title : "Nothing";
  return /*#__PURE__*/React.createElement(StickyFooter, null, /*#__PURE__*/React.createElement("div", {
    className: "row selection-controls-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col mb-05 mt-05"
  }, currentAction === 'multiselect' ? /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mt-0 mb-0 col-auto text-600"
  }, selectedItems.size), /*#__PURE__*/React.createElement("h4", {
    className: "mt-0 mb-0 text-body-secondary col-auto text-400 px-0"
  }, itemTypeFriendlyName + (selectedItems.size === 1 ? '' : 's'), " selected")) : /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mt-0 mb-0 col-auto text-400"
  }, selectedItemDisplayTitle), /*#__PURE__*/React.createElement("h4", {
    className: "mt-0 mb-0 text-body-secondary col-auto text-400 px-0"
  }, "selected"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-auto"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-success",
    onClick: onComplete,
    disabled: selectedItems.size === 0,
    "data-tip": "Select checked items and close window"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-check"
  }), "\xA0 Apply"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-warning ms-1",
    onClick: onCancel,
    "data-tip": "Cancel selection and close window"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-times"
  }), "\xA0 Cancel"))));
});
export var BackNavigationStickyFooter = /*#__PURE__*/React.memo(function (props) {
  var _props$text = props.text,
    text = _props$text === void 0 ? 'Return to Selection List' : _props$text,
    _props$tooltip = props.tooltip,
    tooltip = _props$tooltip === void 0 ? 'Go to selection page' : _props$tooltip,
    _props$navigateToInit = props.navigateToInitialPage,
    navigateToInitialPage = _props$navigateToInit === void 0 ? true : _props$navigateToInit;
  var onBackButtonClick = useCallback(function () {
    if (window.history.length === 0) {
      return;
    }
    history.go(navigateToInitialPage === true ? -(window.history.length - 1) : -1);
  });
  return /*#__PURE__*/React.createElement(StickyFooter, null, /*#__PURE__*/React.createElement("div", {
    className: "row selection-controls-footer pull-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-auto"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-warning ms-1",
    onClick: onBackButtonClick,
    "data-tip": tooltip || ''
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-arrow-left"
  }), "\xA0 ", text || ''))));
});
BackNavigationStickyFooter.propTypes = {
  'text': PropTypes.string,
  'tooltip': PropTypes.string,
  'navigateToInitialPage': PropTypes.bool
};

/**
 * General purpose sticky footer component
 * TODO: Component can be moved to a separate file.
 */
export function StickyFooter(_ref2) {
  var children = _ref2.children,
    passProps = _objectWithoutProperties(_ref2, _excluded2);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sticky-page-footer"
  }, passProps), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, children));
}