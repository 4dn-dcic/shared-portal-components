'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import React, { useState, useEffect } from 'react';
import { Alerts } from './../ui/Alerts';
import _ from 'underscore';
import * as JWT from './json-web-token';
import { patchedConsoleInstance as console } from './patched-console';
/**
 * @private
 */

var defaultHeaders = {
  "Content-Type": "application/json; charset=UTF-8",
  "Accept": "application/json",
  "X-Requested-With": "XMLHttpRequest" // Allows some server-side libs (incl. pyramid) to identify using `request.is_xhr`.

};
/**
 * @private
 * @function
 * @param {XMLHttpRequest} xhr - XHR object.
 * @param {Object} [headers={}] - Headers object.
 * @param {string[]} [deleteHeaders=[]] - List of header key names to exclude, e.g. from extra or default headers object.
 * @returns {XMLHttpRequest} XHR object with set headers.
 */

function setHeaders(xhr) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var deleteHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  headers = JWT.addToHeaders(_.extend({}, defaultHeaders, headers)); // Set defaults, add JWT if set
  // Put everything in the header

  var headerKeys = _.keys(headers);

  for (var i = 0; i < headerKeys.length; i++) {
    if (deleteHeaders.indexOf(headerKeys[i]) > -1) {
      continue;
    }

    xhr.setRequestHeader(headerKeys[i], headers[headerKeys[i]]);
  }

  return xhr;
}

export function load(url, callback) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
  var fallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var headers = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var deleteHeaders = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
  if (typeof window === 'undefined') return null;
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if ([200, 201, 202, 203].indexOf(xhr.status) > -1) {
        if (typeof callback === 'function') {
          callback(JSON.parse(xhr.responseText), xhr);
        }
      } else {
        var response;

        try {
          response = JSON.parse(xhr.responseText);
          console.error('ajax.load error: ', response);
          if (typeof fallback === 'function') fallback(response, xhr);
        } catch (error) {
          console.error('Non-JSON error response:', xhr.responseText);
          if (typeof fallback === 'function') fallback({}, xhr);
        }
      }
    }
  };

  xhr.open(method, url, true);
  xhr = setHeaders(xhr, headers, deleteHeaders || []);

  if (data) {
    xhr.send(data);
  } else {
    xhr.send();
  }

  return xhr;
}
/**
 * Own implementation of an AJAX Promise.
 * Similar to the modern `window.fetch` that most modern browsers support (excl. IE),
 * but adds support for `abort` and all other nice features of the XMLHttpRequest
 * interface.
 */

export function promise(url) {
  var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var cache = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var debugResponse = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var xhr;
  var promiseInstance = new Promise(function (resolve, reject) {
    xhr = new XMLHttpRequest();

    xhr.onload = function () {
      var response = null; // response SHOULD be json

      try {
        response = JSON.parse(xhr.responseText);
        if (debugResponse) console.info('Received data from ' + method + ' ' + url + ':', response);
      } catch (e) {
        console.log(xhr);
        console.error("Non-JSON error response:", xhr.responseText);
        reject(xhr);
        return;
      }

      resolve(response);
    };

    xhr.onerror = reject;

    if (cache === false && url.indexOf('format=json') > -1) {
      url += '&ts=' + parseInt(Date.now());
    }

    xhr.open(method, url, true);
    xhr = setHeaders(xhr, headers);

    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }

    return xhr;
  });
  promiseInstance.xhr = xhr;

  promiseInstance.abort = function () {
    if (promiseInstance.xhr.readyState !== 4) promiseInstance.xhr.abort();
  };

  return promiseInstance;
}
/**
 * Wrapper around function promise() which is slightly more relevant for navigation.
 * Strips hash from URL, sets same origin policy.
 *
 * @export
 * @param {any} url
 * @param {any} options
 */

export function fetch(targetURL, options) {
  options = _.extend({
    'credentials': 'same-origin'
  }, options);
  var http_method = options.method || 'GET';

  var headers = options.headers = _.extend({}, options.headers || {}); // Strip url fragment.


  var hashIndex = targetURL.indexOf('#');

  if (hashIndex > -1) {
    targetURL = targetURL.slice(0, hashIndex);
  }

  var data = options.body ? options.body : null;
  var request = promise(targetURL, http_method, headers, data, options.cache === false ? false : true);
  request.targetURL = targetURL;
  request.xhr_begin = 1 * new Date();
  request.then(function () {
    request.xhr_end = 1 * new Date();
  });
  return request;
}
/** Calls ajax.fetch() internally, but adds 'json' function to return self. */

export function fetchPolyfill(url, options) {
  var req = fetch(url, options);
  req.then(function (resp) {
    resp.json = function () {
      return resp;
    };
  });
  return req;
}
/**
 * A class utility for executing promise-chains in a sequential manner. Includes some
 * scaffolding for aborting promises; needs more work in future.
 *
 * In drag-and-drop upload, this class ensures that each Item is uploaded and linked
 * before starting the upload of the next item, so that the new atIds can be collected
 * and patched to the parent together.
 */

export var PromiseQueue = /*#__PURE__*/function () {
  function PromiseQueue() {
    _classCallCheck(this, PromiseQueue);

    this.queue = [];
    this.pendingPromise = false;
    this.stop = false;
  }

  _createClass(PromiseQueue, [{
    key: "enqueue",
    value: function enqueue(promise) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.queue.push({
          promise: promise,
          resolve: resolve,
          reject: reject
        });

        _this.dequeue();
      });
    }
  }, {
    key: "dequeue",
    value: function dequeue() {
      var _this2 = this;

      if (this.pendingPromise) {
        return false;
      }

      if (this.stop) {
        this.queue = [];
        this.stop = false;
        return;
      }

      var item = this.queue.shift();

      if (!item) {
        return false;
      }

      try {
        this.pendingPromise = true;
        item.promise().then(function (value) {
          _this2.pendingPromise = false;
          item.resolve(value);

          _this2.dequeue();
        })["catch"](function (err) {
          _this2.pendingPromise = false;
          item.reject(err);

          _this2.dequeue();
        });
      } catch (err) {
        this.pendingPromise = false;
        item.reject(err);
        this.dequeue();
      }

      return true;
    }
  }]);

  return PromiseQueue;
}();
/**
 * Helper component which will simply AJAX an Item in and pass it down as `props.fetchedItem`
 * (or other prop name, which may be set via `fetchedItemPropName`).
 *
 * Meant to make changing between using Items' embedded_list & AJAXing linkTos simple.
 * Idea roughly taken from existing 'Fetched' from ENCODE (https://github.com/ENCODE-DCC/encoded/blob/d78448b0a332ec4f056df65f6dee9cf8bacb1ab3/src/encoded/static/components/fetched.js),
 * albeit quite a bit simpler hopefully.
 */

export var FetchedItem = /*#__PURE__*/function (_React$Component) {
  _inherits(FetchedItem, _React$Component);

  var _super = _createSuper(FetchedItem);

  function FetchedItem(props) {
    var _this3;

    _classCallCheck(this, FetchedItem);

    _this3 = _super.call(this, props);
    _this3.fetchItem = _this3.fetchItem.bind(_assertThisInitialized(_this3));
    _this3.state = {
      "fetchedItem": null,
      "isFetchingItem": !!props.atId
    };
    return _this3;
  }

  _createClass(FetchedItem, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchItem();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_ref) {
      var pastAtId = _ref.atId;
      var atId = this.props.atId;

      if (atId !== pastAtId) {
        this.fetchItem();
      }
    }
  }, {
    key: "fetchItem",
    value: function fetchItem() {
      var _this4 = this;

      var onSuccess = function (res) {
        _this4.setState({
          "fetchedItem": res,
          "isFetchingItem": false
        });
      };

      var onFail = function () {
        Alerts.queue(Alerts.ConnectionError);
        onSuccess(null);
      };

      this.setState({
        isFetchingItem: true
      }, function () {
        var atId = _this4.props.atId;
        load(atId, onSuccess, "GET", onFail);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _objectSpread2;

      var _this$props = this.props,
          children = _this$props.children,
          fetchedItemPropName = _this$props.fetchedItemPropName,
          isFetchingItemPropName = _this$props.isFetchingItemPropName,
          remainingProps = _objectWithoutProperties(_this$props, ["children", "fetchedItemPropName", "isFetchingItemPropName"]);

      var _this$state = this.state,
          fetchedItem = _this$state.fetchedItem,
          isFetchingItem = _this$state.isFetchingItem;

      var passProps = _objectSpread(_objectSpread({}, remainingProps), {}, (_objectSpread2 = {}, _defineProperty(_objectSpread2, fetchedItemPropName, fetchedItem), _defineProperty(_objectSpread2, isFetchingItemPropName, isFetchingItem), _objectSpread2));

      return React.Children.map(children, function (child) {
        if (! /*#__PURE__*/React.isValidElement(child)) {
          return child;
        }

        if (typeof child.type === "string") {
          return child;
        }

        return /*#__PURE__*/React.cloneElement(child, passProps);
      });
    }
  }]);

  return FetchedItem;
}(React.Component);

_defineProperty(FetchedItem, "defaultProps", {
  "fetchedItemPropName": "fetchedItem",
  "isFetchingItemPropName": "isFetchingItem"
});