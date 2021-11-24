'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _excluded = ["alerts", "children"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Fade from 'react-bootstrap/esm/Fade';
import { AlertObj } from './../util/typedefs';
var defaultNavigateDisappearThreshold = 1;
var alertNavigatationCountMap = {};
var store = null;
/**
 * A Component and utility (via Component's 'statics' property & functions) to
 * queue and dequeue alerts from appearing at top of pages. Alerts, once queued, will persist until they are closed by
 * the end user, which is the same functionality as calling Alerts.deQueue(alert) from anywhere in application, supplying the same
 * title for alert that was queued.
 */

export var Alerts = /*#__PURE__*/function (_React$Component) {
  _inherits(Alerts, _React$Component);

  var _super = _createSuper(Alerts);

  /** @ignore */
  function Alerts(props) {
    var _this;

    _classCallCheck(this, Alerts);

    _this = _super.call(this, props);
    _this.setDismissing = _this.setDismissing.bind(_assertThisInitialized(_this));
    /**
     * State object for component.
     *
     * @type {Object}
     * @private
     * @property {AlertObj[]} state.dismissing - List of alerts currently being faded out.
     */

    _this.state = {
      'dismissing': []
    };
    return _this;
  }
  /**
   * Called when 'fade out' of an alert is initialized.
   * @private
   */


  _createClass(Alerts, [{
    key: "setDismissing",
    value: function setDismissing(dismissing) {
      this.setState({
        dismissing: dismissing
      });
    }
    /**
     * Renders out Bootstrap Alerts for any queued alerts.
     *
     * @private
     * @returns {JSX.Element} A `<div>` element containing AlertItems as children.
     */

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          alerts = _this$props.alerts,
          children = _this$props.children,
          passProps = _objectWithoutProperties(_this$props, _excluded);

      var dismissing = this.state.dismissing;
      if (alerts.length === 0) return null;
      return /*#__PURE__*/React.createElement("div", passProps, _.map(alerts, function (alert, index, alerts) {
        return /*#__PURE__*/React.createElement(AlertItem, _extends({
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
  }], [{
    key: "setStore",
    value:
    /** This must be called with the current Redux store for the app before Alerts can be used. */
    function setStore(useStore) {
      store = useStore;
    }
    /**
     * Open an alert box.
     * More specifically, saves a new alert to Redux store 'alerts' field.
     *
     * @public
     * @param {AlertObj} alert              Object used to represent alert message element contents at top of page.
     * @param {function} [callback]         Optional function to be ran after queuing.
     * @param {AlertObj[]} [currentAlerts]  Current alerts, if any. Pass in for performance, else will retrieve them from Redux.
     * @returns {void} Nothing
     */

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

      var duplicateTitleAlertIdx = _.findIndex(currentAlerts, {
        'title': alert.title
      });

      var newAlerts = currentAlerts.slice(0);

      if (typeof duplicateTitleAlertIdx === 'number' && duplicateTitleAlertIdx > -1) {
        // Same alert already set, lets update it instead of adding new one.
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
    /**
     * Close an alert box.
     *
     * @todo Allow `alert` param to be an array to deque multiple alerts at once.
     *
     * @public
     * @param {AlertObj|AlertObj[]} alert - Object or list of objects with at least 'title'.
     * @param {AlertObj[]} [currentAlerts] - Current alerts, if any. Pass in for performance, else will retrieve them from Redux.
     * @returns {void} Nothing
     */

  }, {
    key: "deQueue",
    value: function deQueue(alert) {
      var currentAlerts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!store) {
        console.error("no store available. canceling.");
        return;
      }

      if (!Array.isArray(currentAlerts)) currentAlerts = store.getState().alerts;
      var alertsToRemove = Array.isArray(alert) ? alert : [alert];
      var nextAlerts = currentAlerts.slice(0);
      alertsToRemove.forEach(function (alertToRemove) {
        var idxToDelete = nextAlerts.findIndex(function (a) {
          return a === alertToRemove || a.title === alertToRemove.title;
        });

        if (idxToDelete > -1) {
          nextAlerts.splice(idxToDelete, 1);
        }
      });

      if (nextAlerts.length < currentAlerts.length) {
        store.dispatch({
          type: {
            'alerts': nextAlerts
          }
        });
      }
    }
    /**
     * This is called after each navigation within the portal.
     * It increments counter per each alert title, and if counter exceeds
     * limit of any `alert.navigateDisappearThreshold`, the alerts is dequeued.
     *
     * @static
     * @param {AlertObj[]} [currentAlerts=null] Current alerts, if any. Pass in for performance, else will retrieve them from Redux.
     * @returns {undefined} Nothing
     */

  }, {
    key: "updateCurrentAlertsTitleMap",
    value: function updateCurrentAlertsTitleMap() {
      var currentAlerts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (!Array.isArray(currentAlerts)) currentAlerts = store.getState().alerts;

      var titles = _.pluck(currentAlerts, 'title').sort();

      var removedTitles = _.difference(_.keys(alertNavigatationCountMap).sort(), titles);

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

  return Alerts;
}(React.Component);

_defineProperty(Alerts, "defaultProps", {
  "className": "alerts mt-2"
});

Alerts.propTypes = {
  /**
   * List of Alert objects currently being displayed. Should be passed down from Redux store from App.
   *
   * @type {AlertObj[]}
   */
  'alerts': PropTypes.arrayOf(PropTypes.shape({
    'title': PropTypes.string.isRequired,
    'message': PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    'style': PropTypes.oneOf(["warning", "danger", "success", "info", "primary", "secondary", "light", "dark"]),
    'navigationDissappearThreshold': PropTypes.number
  }))
};
/**
 * Reusable Alert Definitions
 */

export var LoggedOut = Alerts.LoggedOut = {
  "title": "Logged Out",
  "message": "You have been logged out.",
  "style": 'danger',
  'navigateDisappearThreshold': 2
};
export var NoFilterResults = Alerts.NoFilterResults = {
  'title': "No Results",
  'message': "Selecting this filter returned no results so it was deselected.",
  'style': "warning",
  'navigateDisappearThreshold': 3
};
export var ConnectionError = Alerts.ConnectionError = {
  "title": "Connection Error",
  "message": "Check your internet connection",
  "style": "danger",
  'navigateDisappearThreshold': 1
};
export var LoginFailed = Alerts.LoginFailed = {
  "title": "Login Failed",
  "message": "Your attempt to login failed - please check your credentials or try again later.",
  "style": "danger",
  'navigateDisappearThreshold': 1
};
/**
 * Component which renders out an individual Alert.
 * Rendered by `Alerts` component.
 *
 * @ignore
 * @private
 */

var AlertItem = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(AlertItem, _React$PureComponent);

  var _super2 = _createSuper(AlertItem);

  function AlertItem(props) {
    var _this3;

    _classCallCheck(this, AlertItem);

    _this3 = _super2.call(this, props);
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

      if (_.findIndex(nextDismissing, alert) === -1) {
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
      setDismissing(_.without(dismissing, alert));
      store.dispatch({
        type: {
          'alerts': _.without(alerts, alert)
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
      var hasMessage = !!message;
      return /*#__PURE__*/React.createElement(Fade, {
        timeout: 500,
        "in": _.findIndex(dismissing, alert) === -1,
        onExited: this.finishDismiss,
        unmountOnExit: true
      }, /*#__PURE__*/React.createElement("div", {
        className: "alert alert-dismissable alert-" + (bsStyle || 'danger') + (noCloseButton === true ? ' no-close-button' : '')
      }, noCloseButton !== true ? /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "close",
        onClick: this.dismiss
      }, /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true"
      }, "\xD7"), /*#__PURE__*/React.createElement("span", {
        className: "sr-only"
      }, "Close alert")) : null, /*#__PURE__*/React.createElement("h4", {
        className: "alert-heading mt-0" + (hasMessage ? " mb-05" : " mb-0")
      }, title), hasMessage ? /*#__PURE__*/React.createElement("div", {
        className: "mb-0"
      }, message) : null));
    }
  }]);

  return AlertItem;
}(React.PureComponent);