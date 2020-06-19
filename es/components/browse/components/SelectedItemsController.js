'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendDataToParentWindow = sendDataToParentWindow;
exports.StickyFooter = StickyFooter;
exports.SelectStickyFooter = exports.SelectedItemsController = void 0;

var _react = _interopRequireWildcard(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

var _Alerts = require("./../../ui/Alerts");

var _object = require("./../../util/object");

var _misc = require("./../../util/misc");

var _basicColumnExtensionMap = require("./../../browse/components/table-commons/basicColumnExtensionMap");

var _schemaTransforms = require("./../../util/schema-transforms");

var _patchedConsole = require("./../../util/patched-console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * Utility function to post message to parent window
 * @param {Array} selectedItems: array of {id:ID of selected Item, if any, json:JSON of selected Item, if present (NOT GUARANTEED TO BE PROVIDED)} object
 * set selectedItems as empty array ([]) to close child window
 */
function sendDataToParentWindow(itemsListWrappedWithID) {
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
      _Alerts.Alerts.queue({
        'title': 'Failed to send data to parent window.',
        'message': 'Please ensure there is a parent window to which this selection is being sent to. Alternatively, try to drag & drop the Item over instead.'
      });
    } else {
      _patchedConsole.patchedConsoleInstance.err('Unexpecter error -- browser may not support postMessage', err);
    }
  } // Nonstandard - in case browser doesn't support postMessage but does support other cross-window events (unlikely).


  window.dispatchEvent(new CustomEvent('fourfrontselectionclick', {
    'detail': eventJSON
  }));
}

var SelectedItemsController =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SelectedItemsController, _React$PureComponent);

  var _super = _createSuper(SelectedItemsController);

  function SelectedItemsController(props) {
    var _this;

    _classCallCheck(this, SelectedItemsController);

    _this = _super.call(this, props);
    _this.handleSelectItem = _this.handleSelectItem.bind(_assertThisInitialized(_this));
    _this.handleSelectItemCompleteClick = _this.handleSelectItemCompleteClick.bind(_assertThisInitialized(_this));
    _this.handleSelectCancelClick = _this.handleSelectCancelClick.bind(_assertThisInitialized(_this));
    _this.state = {
      selectedItems: new Map()
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

        var resultID = _object.itemUtil.atId(result);

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
    /**
     * This function sends selected items to parent window for if `props.currentAction` is set to "multiselect" or "singleselect".
     */

  }, {
    key: "handleSelectItemCompleteClick",
    value: function handleSelectItemCompleteClick() {
      var selectedItems = this.state.selectedItems;
      var itemsWrappedWithID = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = selectedItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          itemsWrappedWithID.push({
            id: key,
            json: value
          });
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

      sendDataToParentWindow(itemsWrappedWithID);
    }
    /**
     * This function cancels the selection if `props.currentAction` is set to "multiselect".
     */

  }, {
    key: "handleSelectCancelClick",
    value: function handleSelectCancelClick() {
      var selectedItems = this.state.selectedItems;

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
        _patchedConsole.patchedConsoleInstance.error("Couldn't access opener window.");
      }
    }
    /**
     * Extends columnExtensionMap's display_title render function.
     * Adds in a checkbox element which controls selectedItems state entry.
     *
     * @todo
     * Allow a boolean prop which controls whether we're extending columnExtensionMap
     * or columnDefinitions, which would allow us to put this below ColumnCombiner also
     * if desired.
     * Alternatively, attempt to detect based on presence of props.columnDefinitions
     * or props.columnExtensionMap, throwing error if neither available.
     */

  }, {
    key: "columnExtensionMapWithSelectButton",
    value: function columnExtensionMapWithSelectButton() {
      var _this2 = this;

      var _this$props = this.props,
          originalColumnExtensionMap = _this$props.columnExtensionMap,
          _this$props$currentAc = _this$props.currentAction,
          currentAction = _this$props$currentAc === void 0 ? null : _this$props$currentAc;
      var inSelectionMode = (0, _misc.isSelectAction)(currentAction);

      if (!inSelectionMode || !originalColumnExtensionMap) {
        return originalColumnExtensionMap;
      } // Kept for reference in case we want to re-introduce constrain that for 'select' button(s) to be visible in search result rows, there must be parent window.
      //var isThereParentWindow = inSelectionMode && typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window;


      if (inSelectionMode) {
        // Render out button and add to title render output for "Select" if we have a 'selection' currentAction.
        // Also add the popLink/target=_blank functionality to links
        // Remove lab.display_title and type columns on selection
        var newColumnExtensionMap = _underscore["default"].clone(originalColumnExtensionMap);

        newColumnExtensionMap.display_title = _objectSpread(_objectSpread({}, newColumnExtensionMap.display_title), {}, {
          'minColumnWidth': (originalColumnExtensionMap.display_title.minColumnWidth || 100) + 20,
          'render': function render(result, parentProps) {
            var selectedItems = _this2.state.selectedItems;
            var rowNumber = parentProps.rowNumber,
                detailOpen = parentProps.detailOpen,
                toggleDetailOpen = parentProps.toggleDetailOpen,
                href = parentProps.href,
                context = parentProps.context;
            return (
              /*#__PURE__*/
              _react["default"].createElement(_basicColumnExtensionMap.DisplayTitleColumnWrapper, {
                result: result,
                href: href,
                context: context,
                rowNumber: rowNumber,
                detailOpen: detailOpen,
                toggleDetailOpen: toggleDetailOpen
              },
              /*#__PURE__*/
              _react["default"].createElement(SelectionItemCheckbox, _extends({
                selectedItems: selectedItems,
                isMultiSelect: currentAction === 'multiselect'
              }, {
                handleSelectItem: _this2.handleSelectItem
              })),
              /*#__PURE__*/
              _react["default"].createElement(_basicColumnExtensionMap.DisplayTitleColumnDefault, null))
            );
          }
        });
        return newColumnExtensionMap;
      }

      return originalColumnExtensionMap;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          propsToPass = _objectWithoutProperties(_this$props2, ["children"]);

      var selectedItems = this.state.selectedItems;

      _underscore["default"].extend(propsToPass, {
        selectedItems: selectedItems,
        columnExtensionMap: this.columnExtensionMapWithSelectButton(),
        onSelectItem: this.handleSelectItemClick,
        onCancelSelection: this.handleSelectCancelClick,
        onCompleteSelection: this.handleSelectItemCompleteClick
      });

      return _react["default"].Children.map(children, function (child) {
        if (!
        /*#__PURE__*/
        _react["default"].isValidElement(child)) {
          throw new Error('SelectedItemsSearchController expects props.children to be a valid React component instance(s).');
        }

        return (
          /*#__PURE__*/
          _react["default"].cloneElement(child, propsToPass)
        );
      });
    }
  }]);

  return SelectedItemsController;
}(_react["default"].PureComponent);

exports.SelectedItemsController = SelectedItemsController;

var SelectionItemCheckbox =
/*#__PURE__*/
_react["default"].memo(function (props) {
  var selectedItems = props.selectedItems,
      result = props.result,
      isMultiSelect = props.isMultiSelect,
      handleSelectItem = props.handleSelectItem;
  var isChecked = selectedItems.has(_object.itemUtil.atId(result));
  var onChange = (0, _react.useMemo)(function () {
    return handleSelectItem.bind(handleSelectItem, result, isMultiSelect);
  }, [handleSelectItem, result, isMultiSelect]);
  return (
    /*#__PURE__*/
    _react["default"].createElement("input", {
      type: "checkbox",
      checked: isChecked,
      onChange: onChange,
      className: "mr-2"
    })
  );
});
/** Move to own file later maybe. Especially if functionality expands. */


var SelectStickyFooter =
/*#__PURE__*/
_react["default"].memo(function (props) {
  var context = props.context,
      schemas = props.schemas,
      selectedItems = props.selectedItems,
      onComplete = props.onComplete,
      onCancel = props.onCancel,
      currentAction = props.currentAction;
  var itemTypeFriendlyName = (0, _schemaTransforms.getTitleForType)((0, _schemaTransforms.getSchemaTypeFromSearchContext)(context), schemas);
  var selectedItemDisplayTitle = currentAction === 'selection' && selectedItems.size === 1 ? selectedItems.entries().next().value[1].display_title : "Nothing";
  return (
    /*#__PURE__*/
    _react["default"].createElement(StickyFooter, null,
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "row selection-controls-footer"
    },
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "col mb-05 mt-05"
    }, currentAction === 'multiselect' ?
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "row"
    },
    /*#__PURE__*/
    _react["default"].createElement("h3", {
      className: "mt-0 mb-0 col-auto text-600"
    }, selectedItems.size),
    /*#__PURE__*/
    _react["default"].createElement("h4", {
      className: "mt-0 mb-0 text-muted col-auto text-400 px-0"
    }, itemTypeFriendlyName + (selectedItems.size === 1 ? '' : 's'), " selected")) :
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "row"
    },
    /*#__PURE__*/
    _react["default"].createElement("h4", {
      className: "mt-0 mb-0 col-auto text-400"
    }, selectedItemDisplayTitle),
    /*#__PURE__*/
    _react["default"].createElement("h4", {
      className: "mt-0 mb-0 text-muted col-auto text-400 px-0"
    }, "selected"))),
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "col-12 col-md-auto"
    },
    /*#__PURE__*/
    _react["default"].createElement("button", {
      type: "button",
      className: "btn btn-success",
      onClick: onComplete,
      disabled: selectedItems.size === 0,
      "data-tip": "Select checked items and close window"
    },
    /*#__PURE__*/
    _react["default"].createElement("i", {
      className: "icon icon-fw fas icon-check"
    }), "\xA0 Apply"),
    /*#__PURE__*/
    _react["default"].createElement("button", {
      type: "button",
      className: "btn btn-outline-warning ml-1",
      onClick: onCancel,
      "data-tip": "Cancel selection and close window"
    },
    /*#__PURE__*/
    _react["default"].createElement("i", {
      className: "icon icon-fw fas icon-times"
    }), "\xA0 Cancel"))))
  );
});
/**
 * General purpose sticky footer component
 * TODO: Component can be moved to a separate file.
 */


exports.SelectStickyFooter = SelectStickyFooter;

function StickyFooter(_ref2) {
  var children = _ref2.children,
      passProps = _objectWithoutProperties(_ref2, ["children"]);

  return (
    /*#__PURE__*/
    _react["default"].createElement("div", _extends({
      className: "sticky-page-footer"
    }, passProps),
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "container"
    }, children))
  );
}