'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

import React, { useMemo, useCallback } from 'react';
import _ from 'underscore';
import { Alerts } from './../../ui/Alerts';
import { itemUtil } from './../../util/object';
import { isSelectAction } from './../../util/misc';
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
  }; // Standard - postMessage

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
  } // Nonstandard - in case browser doesn't support postMessage but does support other cross-window events (unlikely).


  window.dispatchEvent(new CustomEvent('fourfrontselectionclick', {
    'detail': eventJSON
  }));
}
export var SelectedItemsController = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SelectedItemsController, _React$PureComponent);

  var _super = _createSuper(SelectedItemsController);

  function SelectedItemsController(props) {
    var _this;

    _classCallCheck(this, SelectedItemsController);

    _this = _super.call(this, props);
    _this.handleSelectItem = _this.handleSelectItem.bind(_assertThisInitialized(_this));
    _this.handleResetSelectedItems = _this.handleResetSelectedItems.bind(_assertThisInitialized(_this));
    _this.state = {
      "selectedItems": new Map()
    };
    return _this;
  }
  /**
   * This function add/or removes the selected item into an Map in state,
   * if `props.currentAction` is set to "multiselect" or "selection".
   */


  _createClass(SelectedItemsController, [{
    key: "handleSelectItem",
    value: function handleSelectItem(result, isMultiSelect) {
      this.setState(function (_ref) {
        var prevItems = _ref.selectedItems;
        var nextItems = new Map(prevItems);
        var resultID = itemUtil.atId(result);

        if (nextItems.has(resultID)) {
          nextItems["delete"](resultID);
        } else {
          if (!isMultiSelect) {
            nextItems.clear();
          }

          nextItems.set(resultID, result);
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
      var _this2 = this;

      var _this$props = this.props,
          originalColumnExtensionMap = _this$props.columnExtensionMap,
          _this$props$currentAc = _this$props.currentAction,
          currentAction = _this$props$currentAc === void 0 ? null : _this$props$currentAc; // Check if `currentAction` is one of "selection" | "multiselect"

      var inSelectionMode = isSelectAction(currentAction);

      if (!inSelectionMode || !originalColumnExtensionMap) {
        return originalColumnExtensionMap;
      } // Kept for reference in case we want to re-introduce constrain that for 'select' button(s) to be visible in search result rows, there must be parent window.
      //var isThereParentWindow = inSelectionMode && typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window;
      // Render out button and add to title render output for "Select" if we have a 'selection' currentAction.
      // Also add the popLink/target=_blank functionality to links
      // Remove lab.display_title and type columns on selection


      var newColumnExtensionMap = _.clone(originalColumnExtensionMap);

      newColumnExtensionMap.display_title = _objectSpread(_objectSpread({}, newColumnExtensionMap.display_title), {}, {
        'minColumnWidth': (originalColumnExtensionMap.display_title.minColumnWidth || 100) + 20,
        'render': function render(result, parentProps) {
          var selectedItems = _this2.state.selectedItems;
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
          }, /*#__PURE__*/React.createElement(SelectionItemCheckbox, _extends({
            selectedItems: selectedItems
          }, {
            onSelectItem: _this2.handleSelectItem,
            isMultiSelect: currentAction === 'multiselect'
          })), /*#__PURE__*/React.createElement(DisplayTitleColumnDefault, null));
        }
      });
      return newColumnExtensionMap;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          remainingProps = _objectWithoutProperties(_this$props2, ["children"]);

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

  return SelectedItemsController;
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
    className: "mr-2"
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

    window.dispatchEvent(new Event('fourfrontcancelclick')); // CURRENT: If we have parent window, post a message to it as well.

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
    className: "mt-0 mb-0 text-muted col-auto text-400 px-0"
  }, itemTypeFriendlyName + (selectedItems.size === 1 ? '' : 's'), " selected")) : /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mt-0 mb-0 col-auto text-400"
  }, selectedItemDisplayTitle), /*#__PURE__*/React.createElement("h4", {
    className: "mt-0 mb-0 text-muted col-auto text-400 px-0"
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
    className: "btn btn-outline-warning ml-1",
    onClick: onCancel,
    "data-tip": "Cancel selection and close window"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-times"
  }), "\xA0 Cancel"))));
});
/**
 * General purpose sticky footer component
 * TODO: Component can be moved to a separate file.
 */

export function StickyFooter(_ref2) {
  var children = _ref2.children,
      passProps = _objectWithoutProperties(_ref2, ["children"]);

  return /*#__PURE__*/React.createElement("div", _extends({
    className: "sticky-page-footer"
  }, passProps), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, children));
}