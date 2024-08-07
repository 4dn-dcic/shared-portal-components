import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
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
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import url from 'url';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { itemUtil } from './../../util/object';
import { storeExists } from '../../util/misc';

/**
 * Global variable which holds reference to child window, if any.
 * Is re-used if one is open to prevent additional windows being created.
 */
var linkedObjChildWindow = null;

/**
 * Use to help select Items from a second/child window's SearchView.
 *
 * While `props.isSelecting` is true, this component will keep window event listeners active to
 * listen for ondrag/ondrop events as well as for 'message' events (e.g. from other window(s)).
 *
 * Upon receiving a drop or message of an Item, `props.onSelect` is called with the Item's @ID and
 * its context (if available) as parameters. `props.onSelect` is expected to handle setting `props.isSelecting`
 * to false and/or unmounting this component.
 *
 * Upon `props.isSelecting` becoming true (or component mounted with
 * that value), component will initialize/open a child window which will be
 * kept open until is closed or `props.isSelecting` becomes false (or this component becomes
 * unmounted).
 *
 * This component does not render any of its own JSX/HTML, but will render children if any are passed in.
 */
export var LinkToSelector = /*#__PURE__*/function (_React$PureComponent) {
  function LinkToSelector(props) {
    var _this2;
    _classCallCheck(this, LinkToSelector);
    _this2 = _callSuper(this, LinkToSelector, [props]);
    _this2.showAlertInChildWindow = _this2.showAlertInChildWindow.bind(_this2);
    _this2.setChildWindowMessageHandler = _this2.setChildWindowMessageHandler.bind(_this2);
    _this2.handleChildWindowMessage = _this2.handleChildWindowMessage.bind(_this2);
    _this2.receiveData = _this2.receiveData.bind(_this2);
    return _this2;
  }
  _inherits(LinkToSelector, _React$PureComponent);
  return _createClass(LinkToSelector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.manageChildWindow({
        'isSelecting': false
      }, this.props);

      //clear storage
      if (storeExists()) {
        localStorage.removeItem("selected_items");
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      if (pastProps.isSelecting !== this.props.isSelecting) {
        this.manageChildWindow(pastProps, this.props);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.manageChildWindow(this.props, {
        'isSelecting': false
      }, true);
    }
  }, {
    key: "manageChildWindow",
    value: function manageChildWindow(pastProps, nextProps) {
      var _this3 = this;
      var willUnmount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (!window) {
        console.error('No window object available. Fine if this appears in a test.');
        return;
      }
      var _this$props = this.props,
        searchURL = _this$props.searchURL,
        value = _this$props.value,
        onCloseChildWindow = _this$props.onCloseChildWindow;
      var pastInSelection = pastProps.isSelecting;
      var nowInSelection = nextProps.isSelecting;
      if (!pastInSelection && nowInSelection) {
        if (linkedObjChildWindow && !linkedObjChildWindow.closed && linkedObjChildWindow.fourfront && typeof linkedObjChildWindow.fourfront.navigate === 'function') {
          // We have access to the JS of our child window.
          // Call app.navigate(URL) directly instead of reloading entire HTML.
          // MAY NOT WORK FOR SOME BROWSERS --- if so, should be caught by if check
          this.windowObjectReference = linkedObjChildWindow;
          this.windowObjectReference.fourfront.navigate(searchURL, {}, this.showAlertInChildWindow);
          this.windowObjectReference.focus();
        } else {
          var windowFeaturesStr = "menubar=0,toolbar=1,location=0,resizable=1,scrollbars=1,status=1,navigation=1",
            desktopScreenWidth = window && window.screen && (window.screen.availWidth || window.screen.width),
            // Screen dimensions, not window dimensions.
            desktopScreenHeight = window && window.screen && (window.screen.availHeight || window.screen.height),
            childWindowHeight = 600,
            // Defaults if can't get screen dimensions
            childWindowWidth = 1010;
          if (typeof desktopScreenWidth === 'number' && !isNaN(desktopScreenWidth)) {
            childWindowWidth = Math.max(Math.min(1200, desktopScreenWidth - 200), 800);
            windowFeaturesStr += ',left=' + (desktopScreenWidth - childWindowWidth) / 2;
          }
          if (typeof desktopScreenHeight === 'number' && !isNaN(desktopScreenHeight)) {
            childWindowHeight = Math.max(Math.min(800, desktopScreenHeight - 200), 400);
            windowFeaturesStr += ',top=' + (desktopScreenHeight - childWindowHeight) / 2;
          }
          windowFeaturesStr += ',width=' + childWindowWidth + ',height=' + childWindowHeight;
          this.windowObjectReference = linkedObjChildWindow = window.open("about:blank", "selection-search", windowFeaturesStr);
          setTimeout(function () {
            _this3.windowObjectReference && _this3.windowObjectReference.location.assign(searchURL);
          }, 100);
        }
        this.setChildWindowMessageHandler();
        this.childWindowClosedInterval = setInterval(function () {
          // Check every 1s if our child window is still open.
          // If not, stop checking & cleanup event handlers.
          if (!_this3 || !_this3.windowObjectReference || _this3.windowObjectReference.closed) {
            clearInterval(_this3.childWindowClosedInterval);
            delete _this3.childWindowClosedInterval;
            if (_this3 && _this3.windowObjectReference && _this3.windowObjectReference.closed) {
              if (typeof onCloseChildWindow === 'function') {
                onCloseChildWindow(value);
              }
            }
            _this3.cleanChildWindowEventHandlers();
            _this3.windowObjectReference = linkedObjChildWindow = null;
          }
        }, 1000);
      } else if (pastInSelection && !nowInSelection) {
        if (this.childWindowClosedInterval) {
          clearInterval(this.childWindowClosedInterval);
          delete this.childWindowClosedInterval;
          if (willUnmount) {
            this.cleanChildWindow();
          } else {
            this.cleanChildWindowEventHandlers();
          }
        }
      }
    }

    /**
     * This functioned is used as a listener/handler for messages received to this window.
     * Messages might be sent from child window directly to this parent window via e.g. `window.opener.postMessage(message, origin, ...)`
     *
     * @param {MessageEvent} evt - See https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent.
     */
  }, {
    key: "handleChildWindowMessage",
    value: function handleChildWindowMessage(evt) {
      var _this$props2 = this.props,
        value = _this$props2.value,
        onCloseChildWindow = _this$props2.onCloseChildWindow;
      var eventType = evt && evt.data && evt.data.eventType;
      if (!eventType) {
        // We require an 'eventType' to be present in cross-window messages to help ID what the message is.
        console.error("No eventType specified in message. Canceling.");
        return;
      }

      // Authenticate message origin to prevent XSS attacks.
      var eventOriginParts = url.parse(evt.origin);
      if (window.location.host !== eventOriginParts.host) {
        console.error('Received message from unauthorized host. Canceling.');
        return;
      }
      if (window.location.protocol !== eventOriginParts.protocol) {
        console.error('Received message from unauthorized protocol. Canceling.');
        return;
      }

      // The meat of this function/handler. This is what we listen to / expect.
      if (eventType === 'fourfrontselectionclick') {
        var items = evt.data && evt.data.items || evt.detail && evt.detail.items || null;
        if (items && Array.isArray(items) && items.length > 0 && _.every(items, function (item) {
          return item.id && typeof item.id === 'string' && item.json;
        })) {
          return this.receiveData(items);
        }
        return null;
      }
      if (eventType === 'fourfrontcancelclick') {
        this.cleanChildWindow();
        onCloseChildWindow(value);
      }

      // If we have a `props.childWindowAlert`, show it once child window lets us know it has initialized it JS environment.
      if (eventType === 'fourfrontinitialized') {
        return this.showAlertInChildWindow();
      }
    }
  }, {
    key: "setChildWindowMessageHandler",
    value: function setChildWindowMessageHandler() {
      var _this4 = this;
      setTimeout(function () {
        window && window.addEventListener('message', _this4.handleChildWindowMessage);
        console.log('Updated \'message\' event handler');
      }, 200);
    }
  }, {
    key: "cleanChildWindowEventHandlers",
    value: function cleanChildWindowEventHandlers() {
      window.removeEventListener('message', this.handleChildWindowMessage);
      if (!this || !this.windowObjectReference) {
        console.warn('Child window no longer available to unbind event handlers. Fine if closed.');
        return;
      }

      //clear storage
      if (storeExists()) {
        localStorage.removeItem("selected_items");
      }
    }
  }, {
    key: "cleanChildWindow",
    value: function cleanChildWindow() {
      if (this && this.windowObjectReference) {
        if (!this.windowObjectReference.closed) this.windowObjectReference.close();
        this.cleanChildWindowEventHandlers();
        this.windowObjectReference = linkedObjChildWindow = null;
      }
    }

    /**
     *
     * @param {Array} items - array of {id:ID of selected Item, if any, json:JSON of selected Item, if present (NOT GUARANTEED TO BE PROVIDED)} object
     */
  }, {
    key: "receiveData",
    value: function receiveData(items) {
      this.cleanChildWindow();
      this.props.onSelect(items, true);
    }

    /**
     * THIS MAY NOT WORK FOR ALL BROWSERS
     */
  }, {
    key: "showAlertInChildWindow",
    value: function showAlertInChildWindow() {
      var childWindowAlert = this.props.childWindowAlert;
      if (!childWindowAlert) return;
      if (typeof childWindowAlert === 'function') {
        childWindowAlert = childWindowAlert(this.props);
      }
      var childAlerts = this.windowObjectReference && this.windowObjectReference.fourfront && this.windowObjectReference.fourfront.alerts;
      if (!childAlerts) return;
      childAlerts.queue(childWindowAlert);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.enableWindowDrop) {
        return /*#__PURE__*/React.createElement(WindowDropReceiver, this.props);
      }
      return null;
    }
  }]);
}(React.PureComponent);
_defineProperty(LinkToSelector, "propTypes", {
  /** Whether component should be listening for Item to be selected */
  'isSelecting': PropTypes.bool.isRequired,
  /** Callback called when Items are received. Should accept array of {id:@ID, json:Item context (not guaranteed)} object and endDataPost (bool) as param */
  'onSelect': PropTypes.func.isRequired,
  /** Search URL to direct child window to */
  'searchURL': PropTypes.string.isRequired,
  /** Optional alert to show in child window upon initialization. Not guaranteed to appear in all browsers. */
  'childWindowAlert': PropTypes.shape({
    'title': PropTypes.string.isRequired,
    'message': PropTypes.any.isRequired,
    'style': PropTypes.string
  }),
  /** Optional callback called with no params when child window is closed. Could/should unset `props.isSelecting`. */
  'onCloseChildWindow': PropTypes.func,
  // When used with SV, will generally be the IndvObject.selectCancel method
  /** If true, then allows to drag & drop Item to window */
  'enableWindowDrop': PropTypes.bool.isRequired,
  /** Text content of message filling window when being dragged over */
  'dropMessage': PropTypes.string.isRequired
});
_defineProperty(LinkToSelector, "defaultProps", {
  'isSelecting': false,
  'onSelect': function onSelect(selectedItems, endDataPost) {
    console.log("Selected", selectedItems, endDataPost);
  },
  'onCloseChildWindow': function onCloseChildWindow() {
    console.log("Closed child window");
  },
  'searchURL': '/search/?currentAction=selection&type=Item',
  'childWindowAlert': {
    'title': "Selecting Item...",
    'message': /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "mb-0"
    }, "Please either ", /*#__PURE__*/React.createElement("b", null, "drag and drop"), " an Item (row) from this window into the parent window or click its corresponding select (checkbox) button."), /*#__PURE__*/React.createElement("p", {
      className: "mb-0"
    }, "You may also browse around and drag & drop a link into the parent window as well.")),
    'style': "info"
  },
  'dropMessage': "Drop Item Here",
  'enableWindowDrop': true
});
export var WindowDropReceiver = /*#__PURE__*/function (_React$PureComponent2) {
  function WindowDropReceiver(props) {
    var _this5;
    _classCallCheck(this, WindowDropReceiver);
    _this5 = _callSuper(this, WindowDropReceiver, [props]);
    _this5.handleWindowDragOver = _this5.handleWindowDragOver.bind(_this5);
    _this5.refreshWindowDropReceiver = _.throttle(_this5.refreshWindowDropReceiver.bind(_this5), 300);
    _this5.closeWindowDropReceiver = _this5.closeWindowDropReceiver.bind(_this5);
    _this5.handleDrop = _this5.handleDrop.bind(_this5);
    _this5.receiveData = _this5.receiveData.bind(_this5);
    _this5.windowDropReceiverHideTimeout = null;
    return _this5;
  }
  _inherits(WindowDropReceiver, _React$PureComponent2);
  return _createClass(WindowDropReceiver, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.manageWindowOnDragHandler({
        'isSelecting': false
      }, this.props);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      if (pastProps.isSelecting !== this.props.isSelecting) {
        this.manageWindowOnDragHandler(pastProps, this.props);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.manageWindowOnDragHandler(this.props, {
        'isSelecting': false
      });
    }
  }, {
    key: "manageWindowOnDragHandler",
    value: function manageWindowOnDragHandler(pastProps, nextProps) {
      if (!window) {
        console.error('No window object available. Fine if this appears in a test.');
        return;
      }
      var pastInSelection = pastProps.isSelecting,
        nowInSelection = nextProps.isSelecting;
      if (pastInSelection && !nowInSelection) {
        window.removeEventListener('dragenter', this.handleWindowDragEnter);
        window.removeEventListener('dragover', this.handleWindowDragOver);
        window.removeEventListener('drop', this.handleDrop);
        this.closeWindowDropReceiver();
        console.log('Removed window event handlers for WindowDropReceiver');
      } else if (!pastInSelection && nowInSelection) {
        var _this = this;
        setTimeout(function () {
          if (!_this || !_this.props.isSelecting) return false;
          //if (!_this || !_this.isInSelectionField(_this.props)) return false;
          window.addEventListener('dragenter', _this.handleWindowDragEnter);
          window.addEventListener('dragover', _this.handleWindowDragOver);
          window.addEventListener('drop', _this.handleDrop);
          console.log('Added window event handlers for WindowDropReceiver');
        }, 250);
      }
    }

    /**
     * Handles drop event for the (temporarily-existing-while-dragging-over) window drop receiver element.
     * Grabs @ID of Item from evt.dataTransfer, attempting to grab from 'text/4dn-item-id', 'text/4dn-item-json', or 'text/plain'.
     *
     * @see Notes and inline comments for handleChildFourFrontSelectionClick re isValidAtId.
     * @param {DragEvent} Drag event.
     */
  }, {
    key: "handleDrop",
    value: function handleDrop(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      var draggedContext = evt.dataTransfer && evt.dataTransfer.getData('text/4dn-item-json');
      var draggedURI = evt.dataTransfer && evt.dataTransfer.getData('text/plain');
      var draggedID = evt.dataTransfer && evt.dataTransfer.getData('text/4dn-item-id');
      var atId = draggedID || draggedContext & itemUtil.atId(draggedContext) || url.parse(draggedURI).pathname || null;
      this.receiveData(atId, draggedContext);
    }
  }, {
    key: "handleWindowDragEnter",
    value: function handleWindowDragEnter(evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }, {
    key: "handleWindowDragOver",
    value: function handleWindowDragOver(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.refreshWindowDropReceiver(evt);
    }
  }, {
    key: "closeWindowDropReceiver",
    value: function closeWindowDropReceiver() {
      var _this6 = this;
      var elem = this.windowDropReceiverElement;
      if (!elem) return;
      elem.style.opacity = 0;
      setTimeout(function () {
        document.body.removeChild(elem);
        _this6.windowDropReceiverElement = null;
        _this6.windowDropReceiverHideTimeout = null;
      }, 250);
    }
  }, {
    key: "refreshWindowDropReceiver",
    value: function refreshWindowDropReceiver() {
      var _this7 = this;
      if (!document || !document.createElement) return;
      if (this.windowDropReceiverHideTimeout !== null) {
        clearTimeout(this.windowDropReceiverHideTimeout);
        this.windowDropReceiverHideTimeout = setTimeout(this.closeWindowDropReceiver, 500);
        return;
      }
      var dropMessage = this.props.dropMessage,
        element = document.createElement('div');
      element.className = "full-window-drop-receiver";
      var
      //"Drop " + (itemType || "Item") + " for field '" + (prettyTitle || nestedField) +  "'",
      innerBoldElem = document.createElement('h2');
      innerBoldElem.appendChild(document.createTextNode(dropMessage));
      element.appendChild(innerBoldElem);
      element.appendChild(document.createElement('br'));
      document.body.appendChild(element);
      this.windowDropReceiverElement = element;
      setTimeout(function () {
        _this7.windowDropReceiverElement.style.opacity = 1;
      }, 10);
      this.windowDropReceiverHideTimeout = setTimeout(this.closeWindowDropReceiver, 500);
    }
  }, {
    key: "receiveData",
    value: function receiveData(itemAtID, itemContext) {
      if (typeof itemContext === 'string' && itemContext) {
        try {
          itemContext = JSON.parse(itemContext);
        } catch (e) {
          console.warn("Could not parse itemContext into JS data.");
          console.error(e);
        }
      }
      this.props.onSelect([{
        'id': itemAtID,
        'json': itemContext
      }], false);
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);
}(React.PureComponent);
_defineProperty(WindowDropReceiver, "propTypes", {
  /** Whether component should be listening for Item to be selected */
  'isSelecting': PropTypes.bool.isRequired,
  /** Callback called when Item is received. Should accept @ID and Item context (not guaranteed) as params. */
  'onSelect': PropTypes.func.isRequired,
  /** Text content of message filling window when being dragged over */
  'dropMessage': PropTypes.string.isRequired
});
_defineProperty(WindowDropReceiver, "defaultProps", {
  'isSelecting': false,
  'onSelect': function onSelect(items, endDataPost) {
    console.log("Selected", items, endDataPost);
  },
  'dropMessage': "Drop Item Here"
});