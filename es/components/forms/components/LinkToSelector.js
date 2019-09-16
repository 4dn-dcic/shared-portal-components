'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WindowDropReceiver = exports.LinkToSelector = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _url = _interopRequireDefault(require("url"));

var _patchedConsole = require("./../../util/patched-console");

var _object = require("./../../util/object");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var linkedObjChildWindow = null;

var LinkToSelector = function (_React$PureComponent) {
  _inherits(LinkToSelector, _React$PureComponent);

  function LinkToSelector(props) {
    var _this2;

    _classCallCheck(this, LinkToSelector);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(LinkToSelector).call(this, props));
    _this2.showAlertInChildWindow = _this2.showAlertInChildWindow.bind(_assertThisInitialized(_this2));
    _this2.setChildWindowMessageHandler = _this2.setChildWindowMessageHandler.bind(_assertThisInitialized(_this2));
    _this2.handleChildWindowMessage = _this2.handleChildWindowMessage.bind(_assertThisInitialized(_this2));
    _this2.receiveData = _this2.receiveData.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(LinkToSelector, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.manageChildWindow({
        'isSelecting': false
      }, this.props);
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
        _patchedConsole.patchedConsoleInstance.error('No window object available. Fine if this appears in a test.');

        return;
      }

      var _this$props = this.props,
          searchURL = _this$props.searchURL,
          onCloseChildWindow = _this$props.onCloseChildWindow;
      var pastInSelection = pastProps.isSelecting;
      var nowInSelection = nextProps.isSelecting;

      if (!pastInSelection && nowInSelection) {
        if (linkedObjChildWindow && !linkedObjChildWindow.closed && linkedObjChildWindow.fourfront && typeof linkedObjChildWindow.fourfront.navigate === 'function') {
          this.windowObjectReference = linkedObjChildWindow;
          this.windowObjectReference.fourfront.navigate(searchURL, {}, this.showAlertInChildWindow);
          this.windowObjectReference.focus();
        } else {
          var windowFeaturesStr = "menubar=0,toolbar=1,location=0,resizable=1,scrollbars=1,status=1,navigation=1",
              desktopScreenWidth = window && window.screen && (window.screen.availWidth || window.screen.width),
              desktopScreenHeight = window && window.screen && (window.screen.availHeight || window.screen.height),
              childWindowHeight = 600,
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
            _this3.windowObjectReference.location.assign(searchURL);
          }, 100);
        }

        this.setChildWindowMessageHandler();
        this.childWindowClosedInterval = setInterval(function () {
          if (!_this3 || !_this3.windowObjectReference || _this3.windowObjectReference.closed) {
            clearInterval(_this3.childWindowClosedInterval);
            delete _this3.childWindowClosedInterval;

            if (_this3 && _this3.windowObjectReference && _this3.windowObjectReference.closed) {
              if (typeof onCloseChildWindow === 'function') {
                onCloseChildWindow();
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
  }, {
    key: "handleChildWindowMessage",
    value: function handleChildWindowMessage(evt) {
      var eventType = evt && evt.data && evt.data.eventType;

      if (!eventType) {
        _patchedConsole.patchedConsoleInstance.error("No eventType specified in message. Canceling.");

        return;
      }

      var eventOriginParts = _url.default.parse(evt.origin);

      if (window.location.host !== eventOriginParts.host) {
        _patchedConsole.patchedConsoleInstance.error('Received message from unauthorized host. Canceling.');

        return;
      }

      if (window.location.protocol !== eventOriginParts.protocol) {
        _patchedConsole.patchedConsoleInstance.error('Received message from unauthorized protocol. Canceling.');

        return;
      }

      if (eventType === 'fourfrontselectionclick') {
        var items = evt.data && evt.data.items || evt.detail && evt.detail.items || null;

        if (items && Array.isArray(items) && items.length > 0 && _underscore.default.every(items, function (item) {
          return item.id && typeof item.id === 'string' && item.json;
        })) {
          return this.receiveData(items);
        }

        return null;
      }

      if (eventType === 'fourfrontcancelclick') {
        this.cleanChildWindow();
        this.props.onCloseChildWindow();
      }

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

        _patchedConsole.patchedConsoleInstance.log('Updated \'message\' event handler');
      }, 200);
    }
  }, {
    key: "cleanChildWindowEventHandlers",
    value: function cleanChildWindowEventHandlers() {
      window.removeEventListener('message', this.handleChildWindowMessage);

      if (!this || !this.windowObjectReference) {
        _patchedConsole.patchedConsoleInstance.warn('Child window no longer available to unbind event handlers. Fine if closed.');
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
  }, {
    key: "receiveData",
    value: function receiveData(items) {
      this.cleanChildWindow();
      this.props.onSelect(items, true);
    }
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
        return _react.default.createElement(WindowDropReceiver, this.props);
      }

      return null;
    }
  }]);

  return LinkToSelector;
}(_react.default.PureComponent);

exports.LinkToSelector = LinkToSelector;

_defineProperty(LinkToSelector, "propTypes", {
  'isSelecting': _propTypes.default.bool.isRequired,
  'onSelect': _propTypes.default.func.isRequired,
  'searchURL': _propTypes.default.string.isRequired,
  'childWindowAlert': _propTypes.default.shape({
    'title': _propTypes.default.string.isRequired,
    'message': _propTypes.default.any.isRequired,
    'style': _propTypes.default.string
  }),
  'onCloseChildWindow': _propTypes.default.func,
  'enableWindowDrop': _propTypes.default.bool.isRequired,
  'dropMessage': _propTypes.default.string.isRequired
});

_defineProperty(LinkToSelector, "defaultProps", {
  'isSelecting': false,
  'onSelect': function onSelect(selectedItems, endDataPost) {
    _patchedConsole.patchedConsoleInstance.log("Selected", selectedItems, endDataPost);
  },
  'onCloseChildWindow': function onCloseChildWindow() {
    _patchedConsole.patchedConsoleInstance.log("Closed child window");
  },
  'searchURL': '/search/?type=Item',
  'childWindowAlert': null,
  'dropMessage': "Drop Item Here",
  'enableWindowDrop': true
});

var WindowDropReceiver = function (_React$PureComponent2) {
  _inherits(WindowDropReceiver, _React$PureComponent2);

  function WindowDropReceiver(props) {
    var _this5;

    _classCallCheck(this, WindowDropReceiver);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(WindowDropReceiver).call(this, props));
    _this5.handleWindowDragOver = _this5.handleWindowDragOver.bind(_assertThisInitialized(_this5));
    _this5.refreshWindowDropReceiver = _underscore.default.throttle(_this5.refreshWindowDropReceiver.bind(_assertThisInitialized(_this5)), 300);
    _this5.closeWindowDropReceiver = _this5.closeWindowDropReceiver.bind(_assertThisInitialized(_this5));
    _this5.handleDrop = _this5.handleDrop.bind(_assertThisInitialized(_this5));
    _this5.receiveData = _this5.receiveData.bind(_assertThisInitialized(_this5));
    _this5.windowDropReceiverHideTimeout = null;
    return _this5;
  }

  _createClass(WindowDropReceiver, [{
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
        _patchedConsole.patchedConsoleInstance.error('No window object available. Fine if this appears in a test.');

        return;
      }

      var pastInSelection = pastProps.isSelecting,
          nowInSelection = nextProps.isSelecting;

      if (pastInSelection && !nowInSelection) {
        window.removeEventListener('dragenter', this.handleWindowDragEnter);
        window.removeEventListener('dragover', this.handleWindowDragOver);
        window.removeEventListener('drop', this.handleDrop);
        this.closeWindowDropReceiver();

        _patchedConsole.patchedConsoleInstance.log('Removed window event handlers for WindowDropReceiver');
      } else if (!pastInSelection && nowInSelection) {
        var _this = this;

        setTimeout(function () {
          if (!_this || !_this.props.isSelecting) return false;
          window.addEventListener('dragenter', _this.handleWindowDragEnter);
          window.addEventListener('dragover', _this.handleWindowDragOver);
          window.addEventListener('drop', _this.handleDrop);

          _patchedConsole.patchedConsoleInstance.log('Added window event handlers for WindowDropReceiver');
        }, 250);
      }
    }
  }, {
    key: "handleDrop",
    value: function handleDrop(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      var draggedContext = evt.dataTransfer && evt.dataTransfer.getData('text/4dn-item-json');
      var draggedURI = evt.dataTransfer && evt.dataTransfer.getData('text/plain');
      var draggedID = evt.dataTransfer && evt.dataTransfer.getData('text/4dn-item-id');
      var atId = draggedID || draggedContext & _object.itemUtil.atId(draggedContext) || _url.default.parse(draggedURI).pathname || null;
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
      var innerBoldElem = document.createElement('h2');
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
          _patchedConsole.patchedConsoleInstance.warn("Could not parse itemContext into JS data.");

          _patchedConsole.patchedConsoleInstance.error(e);
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

  return WindowDropReceiver;
}(_react.default.PureComponent);

exports.WindowDropReceiver = WindowDropReceiver;

_defineProperty(WindowDropReceiver, "propTypes", {
  'isSelecting': _propTypes.default.bool.isRequired,
  'onSelect': _propTypes.default.func.isRequired,
  'dropMessage': _propTypes.default.string.isRequired
});

_defineProperty(WindowDropReceiver, "defaultProps", {
  'isSelecting': false,
  'onSelect': function onSelect(items, endDataPost) {
    _patchedConsole.patchedConsoleInstance.log("Selected", items, endDataPost);
  },
  'dropMessage': "Drop Item Here"
});