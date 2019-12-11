'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendDataToParentWindow = sendDataToParentWindow;
exports.SelectedItemsController = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

var _Alerts = require("./../../ui/Alerts");

var _object = require("./../../util/object");

var _patchedConsole = require("./../../util/patched-console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

  function SelectedItemsController(props) {
    var _this;

    _classCallCheck(this, SelectedItemsController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectedItemsController).call(this, props));
    _this.handleSelectItemClick = _this.handleSelectItemClick.bind(_assertThisInitialized(_this));
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
    key: "handleSelectItemClick",
    value: function handleSelectItemClick(result, isMultiSelect) {
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
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          propsToPass = _objectWithoutProperties(_this$props, ["children"]);

      var selectedItems = this.state.selectedItems;

      if (!_react["default"].isValidElement(children)) {
        throw new Error('CustomColumnController expects props.children to be a valid React component instance.');
      }

      _underscore["default"].extend(propsToPass, {
        selectedItems: selectedItems,
        onSelectItem: this.handleSelectItemClick,
        onCancelSelection: this.handleSelectCancelClick,
        onCompleteSelection: this.handleSelectItemCompleteClick
      });

      return _react["default"].Children.map(children, function (child) {
        if (!_react["default"].isValidElement(child)) {
          throw new Error('SelectedItemsSearchController expects props.children to be a valid React component instance(s).');
        }

        return _react["default"].cloneElement(child, propsToPass);
      });
    }
  }]);

  return SelectedItemsController;
}(_react["default"].PureComponent);

exports.SelectedItemsController = SelectedItemsController;