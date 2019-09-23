'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginFailed = exports.ConnectionError = exports.NoFilterResults = exports.LoggedOut = exports.Alerts = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _Fade = require("./Fade");

var _typedefs = require("./../util/typedefs");

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultNavigateDisappearThreshold = 1;
var alertNavigatationCountMap = {};
var store = null;

var Alerts = function (_React$Component) {
  _inherits(Alerts, _React$Component);

  _createClass(Alerts, null, [{
    key: "setStore",
    value: function setStore(useStore) {
      store = useStore;
    }
  }, {
    key: "queue",
    value: function queue(alert) {
      var currentAlerts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (!store) {
        console.error("no store available. canceling.");
        return;
      }

      if (!Array.isArray(currentAlerts)) {
        currentAlerts = store.getState().alerts;
      }

      var duplicateTitleAlertIdx = _underscore["default"].findIndex(currentAlerts, {
        'title': alert.title
      });

      var newAlerts = currentAlerts.slice(0);

      if (typeof duplicateTitleAlertIdx === 'number' && duplicateTitleAlertIdx > -1) {
        newAlerts.splice(duplicateTitleAlertIdx, 1, alert);
      } else {
        newAlerts.push(alert);
      }

      store.dispatch({
        type: {
          'alerts': newAlerts
        }
      });
    }
  }, {
    key: "deQueue",
    value: function deQueue(alert) {
      var currentAlerts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!store) {
        console.error("no store available. canceling.");
        return;
      }

      if (!Array.isArray(currentAlerts)) currentAlerts = store.getState().alerts;
      currentAlerts = currentAlerts.filter(function (a) {
        return a.title != alert.title;
      });
      store.dispatch({
        type: {
          'alerts': currentAlerts
        }
      });
    }
  }, {
    key: "updateCurrentAlertsTitleMap",
    value: function updateCurrentAlertsTitleMap() {
      var currentAlerts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (!Array.isArray(currentAlerts)) currentAlerts = store.getState().alerts;

      var titles = _underscore["default"].pluck(currentAlerts, 'title').sort();

      var removedTitles = _underscore["default"].difference(_underscore["default"].keys(alertNavigatationCountMap).sort(), titles);

      removedTitles.forEach(function (rt) {
        delete alertNavigatationCountMap[rt];
      });
      currentAlerts.forEach(function (a) {
        if (typeof alertNavigatationCountMap[a.title] === 'undefined') {
          alertNavigatationCountMap[a.title] = [1, a.navigateDisappearThreshold || defaultNavigateDisappearThreshold];
        } else {
          alertNavigatationCountMap[a.title][0]++;
        }

        if (alertNavigatationCountMap[a.title][0] >= alertNavigatationCountMap[a.title][1]) {
          Alerts.deQueue(a, currentAlerts);
        }
      });
    }
  }]);

  function Alerts(props) {
    var _this;

    _classCallCheck(this, Alerts);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Alerts).call(this, props));
    _this.setDismissing = _this.setDismissing.bind(_assertThisInitialized(_this));
    _this.state = {
      'dismissing': []
    };
    return _this;
  }

  _createClass(Alerts, [{
    key: "setDismissing",
    value: function setDismissing(dismissing) {
      this.setState({
        dismissing: dismissing
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          alerts = _this$props.alerts,
          children = _this$props.children,
          passProps = _objectWithoutProperties(_this$props, ["alerts", "children"]);

      var dismissing = this.state.dismissing;
      if (alerts.length === 0) return null;
      return _react["default"].createElement("div", passProps, _underscore["default"].map(alerts, function (alert, index, alerts) {
        return _react["default"].createElement(AlertItem, _extends({
          alert: alert,
          index: index,
          alerts: alerts
        }, {
          setDismissing: _this2.setDismissing,
          dismissing: dismissing,
          key: index
        }));
      }));
    }
  }]);

  return Alerts;
}(_react["default"].Component);

exports.Alerts = Alerts;

_defineProperty(Alerts, "defaultProps", {
  "className": "alerts mt-2"
});

Alerts.propTypes = {
  'alerts': _propTypes["default"].arrayOf(_propTypes["default"].shape({
    'title': _propTypes["default"].string.isRequired,
    'message': _propTypes["default"].string.isRequired,
    'style': _propTypes["default"].string,
    'navigationDissappearThreshold': _propTypes["default"].number
  }))
};
var LoggedOut = Alerts.LoggedOut = {
  "title": "Logged Out",
  "message": "You have been logged out.",
  "style": 'danger',
  'navigateDisappearThreshold': 2
};
exports.LoggedOut = LoggedOut;
var NoFilterResults = Alerts.NoFilterResults = {
  'title': "No Results",
  'message': "Selecting this filter returned no results so it was deselected.",
  'style': "warning",
  'navigateDisappearThreshold': 3
};
exports.NoFilterResults = NoFilterResults;
var ConnectionError = Alerts.ConnectionError = {
  "title": "Connection Error",
  "message": "Check your internet connection",
  "style": "danger",
  'navigateDisappearThreshold': 1
};
exports.ConnectionError = ConnectionError;
var LoginFailed = Alerts.LoginFailed = {
  "title": "Login Failed",
  "message": "Your attempt to login failed - please check your credentials or try again later.",
  "style": "danger",
  'navigateDisappearThreshold': 1
};
exports.LoginFailed = LoginFailed;

var AlertItem = function (_React$PureComponent) {
  _inherits(AlertItem, _React$PureComponent);

  function AlertItem(props) {
    var _this3;

    _classCallCheck(this, AlertItem);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(AlertItem).call(this, props));
    _this3.dismiss = _this3.dismiss.bind(_assertThisInitialized(_this3));
    _this3.finishDismiss = _this3.finishDismiss.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(AlertItem, [{
    key: "dismiss",
    value: function dismiss(e) {
      e.stopPropagation();
      e.preventDefault();
      var _this$props2 = this.props,
          alert = _this$props2.alert,
          dismissing = _this$props2.dismissing,
          setDismissing = _this$props2.setDismissing;
      var nextDismissing = dismissing.slice(0);

      if (_underscore["default"].findIndex(nextDismissing, alert) === -1) {
        nextDismissing.push(alert);
      }

      setDismissing(nextDismissing);
    }
  }, {
    key: "finishDismiss",
    value: function finishDismiss() {
      var _this$props3 = this.props,
          alert = _this$props3.alert,
          dismissing = _this$props3.dismissing,
          setDismissing = _this$props3.setDismissing,
          alerts = _this$props3.alerts;
      setDismissing(_underscore["default"].without(dismissing, alert));
      store.dispatch({
        type: {
          'alerts': _underscore["default"].without(alerts, alert)
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          alert = _this$props4.alert,
          dismissing = _this$props4.dismissing;
      var bsStyle = alert.style,
          noCloseButton = alert.noCloseButton,
          title = alert.title,
          message = alert.message;
      return _react["default"].createElement(_Fade.Fade, {
        timeout: 500,
        "in": _underscore["default"].findIndex(dismissing, alert) === -1,
        onExited: this.finishDismiss,
        unmountOnExit: true
      }, _react["default"].createElement("div", {
        className: "alert alert-dismissable alert-" + (bsStyle || 'danger') + (noCloseButton === true ? ' no-close-button' : '')
      }, noCloseButton !== true ? _react["default"].createElement("button", {
        type: "button",
        className: "close",
        onClick: this.dismiss
      }, _react["default"].createElement("span", {
        "aria-hidden": "true"
      }, "\xD7"), _react["default"].createElement("span", {
        className: "sr-only"
      }, "Close alert")) : null, _react["default"].createElement("h4", {
        className: "alert-heading mt-0 mb-05"
      }, title), _react["default"].createElement("div", {
        className: "mb-0"
      }, message)));
    }
  }]);

  return AlertItem;
}(_react["default"].PureComponent);