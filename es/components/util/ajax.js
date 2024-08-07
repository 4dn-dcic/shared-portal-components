import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
var _excluded = ["children", "fetchedItemPropName", "isFetchingItemPropName"];
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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import React, { useState, useEffect } from 'react';
import { Alerts } from './../ui/Alerts';
import _ from 'underscore';
import * as JWT from './json-web-token';
import { patchedConsoleInstance as console } from './patched-console';
import { exception as analyticsException } from './analytics';
export var AJAXSettings = Object.freeze(function () {
  // Returned from anonymous function since server-side rendering can re-use global state.
  // Also a singleton class b.c. might as well.

  var defaultHeaders = Object.freeze({
    "Content-Type": "application/json; charset=UTF-8",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest" // Allows some server-side libs (incl. pyramid) to identify using `request.is_xhr`.
  });

  var onSessionExpiredCallbacks = new Set();
  // const onLoadCallbacks = new Set();

  function didSessionExpire(xhr) {
    // Derived from https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders#example
    var headersArr = xhr.getAllResponseHeaders().trim().split(/[\r\n]+/);
    var headersLen = headersArr.length;
    for (var i = 0; i < headersLen; i++) {
      var _headersArr$i$split = headersArr[i].split(': '),
        _headersArr$i$split2 = _slicedToArray(_headersArr$i$split, 2),
        header = _headersArr$i$split2[0],
        value = _headersArr$i$split2[1];
      if (header.toLowerCase() === "www-authenticate") {
        if (value.indexOf('title="Session Expired"') > -1) {
          return true;
        }
      }
    }
    return false;
  }

  /** Called by all app AJAX requests */

  return {
    onLoad: function (xhr) {
      var sessionExpired = xhr.status === 401 && didSessionExpire(xhr);
      if (sessionExpired) {
        // Remove existing localStorage userInfo
        JWT.remove();
        console.warn("User session has expired or been unset", xhr);
        onSessionExpiredCallbacks.forEach(function (callback) {
          // One of these should be App's `this.updateAppSessionState`
          callback(xhr);
        });
      }
    },
    defaultHeaders: defaultHeaders,
    addSessionExpiredCallback: function addSessionExpiredCallback(callback) {
      onSessionExpiredCallbacks.add(callback);
    },
    removeSessionExpiredCallback: function removeSessionExpiredCallback(callback) {
      onSessionExpiredCallbacks["delete"](callback);
    }
    // Disabled for now until/unless need for this in future.
    // addOnLoadCallback(callback){
    //     onLoadCallbacks.add(callback);
    // },
    // removeOnLoadCallback(callback){
    //     onLoadCallbacks.delete(callback);
    // }
  };
}());

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
  headers = _objectSpread(_objectSpread({}, AJAXSettings.defaultHeaders), headers);
  var i;
  for (i = 0; i < deleteHeaders.length; i++) {
    delete headers[deleteHeaders[i]];
  }

  // Put everything in the header
  var headerKeys = Object.keys(headers);
  for (i = 0; i < headerKeys.length; i++) {
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
      AJAXSettings.onLoad(xhr);
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
  var deleteHeaders = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var debugResponse = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var xhr;
  var promiseInstance = new Promise(function (resolve, reject) {
    xhr = new XMLHttpRequest();
    xhr.onload = function () {
      AJAXSettings.onLoad(xhr);
      var response = null;
      // response SHOULD be json
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
    if (cache === false) {
      url += '&ts=' + parseInt(Date.now());
    }
    xhr.open(method, url, true);
    xhr = setHeaders(xhr, headers, deleteHeaders || []);
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
    return xhr;
  });

  // This abort below doesn't work consistently. Don't depend on it. Even plain `XHR.abort` isn't reliable.
  // Rely instead on keeping a scoped reference to the initial request,
  // and then check in request callback if this request is still more recent or not,
  // and throw out if has been superseded.
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
 * @param {string} url
 * @param {{}} options
 */
export function fetch(targetURL) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options = _objectSpread({
    'credentials': 'same-origin'
  }, options);
  var _options = options,
    _options$method = _options.method,
    method = _options$method === void 0 ? "GET" : _options$method,
    _options$headers = _options.headers,
    origHeaders = _options$headers === void 0 ? {} : _options$headers,
    _options$body = _options.body,
    data = _options$body === void 0 ? null : _options$body,
    _options$cache = _options.cache,
    cache = _options$cache === void 0 ? true : _options$cache;
  var headers = _objectSpread({}, origHeaders);

  // Strip url fragment.
  var hashIndex = targetURL.indexOf('#');
  if (hashIndex > -1) {
    targetURL = targetURL.slice(0, hashIndex);
  }
  var request = promise(targetURL, method, headers, data, cache);
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
  return _createClass(PromiseQueue, [{
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
  function FetchedItem(props) {
    var _this3;
    _classCallCheck(this, FetchedItem);
    _this3 = _callSuper(this, FetchedItem, [props]);
    _this3.fetchItem = _this3.fetchItem.bind(_this3);
    _this3.state = {
      "fetchedItem": null,
      "isFetchingItem": !!props.atId,
      "fetchedItemError": null
    };
    return _this3;
  }
  _inherits(FetchedItem, _React$Component);
  return _createClass(FetchedItem, [{
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
      var propOnFail = this.props.onFail;
      var onSuccess = function (res) {
        _this4.setState({
          "fetchedItem": res,
          "isFetchingItem": false
        });
      };
      var onFail = function (res) {
        if (typeof propOnFail === "function") {
          propOnFail(res);
        }
        console.error("FetchedItem - CONNECTION ERROR", res);
        analyticsException("ajax.FetchedItem - failed; " + (res && res.code || "unknown"));
        _this4.setState({
          "fetchedItem": null,
          "isFetchingItem": false,
          "error": res
        });
      };
      this.setState({
        "isFetchingItem": true
      }, function () {
        var atId = _this4.props.atId;
        load(atId, onSuccess, "GET", onFail);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        children = _this$props.children,
        fetchedItemPropName = _this$props.fetchedItemPropName,
        isFetchingItemPropName = _this$props.isFetchingItemPropName,
        remainingProps = _objectWithoutProperties(_this$props, _excluded);
      var _this$state = this.state,
        fetchedItem = _this$state.fetchedItem,
        isFetchingItem = _this$state.isFetchingItem,
        fetchedItemError = _this$state.fetchedItemError;
      var passProps = _objectSpread(_objectSpread({}, remainingProps), {}, _defineProperty(_defineProperty({}, fetchedItemPropName, fetchedItem), isFetchingItemPropName, isFetchingItem));
      if (fetchedItemError) {
        delete passProps[isFetchingItemPropName];
        passProps[isFetchingItemPropName + "Error"] = fetchedItemError;
      }
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
}(React.Component);

/**
 * Method for submitting multipart/form-data without dealing with bugs caused by explicitly set headers in Ajax.promise
 * @param {string} postURL              Endpoint to post data to (e.g. /ingestion-submissions/<uuid>/submit_for_ingestion)
 * @param {FormData object} formData    An instance of FormData with data .append()ed
 * @param {function} onErrorCallback    Function to call when request fails (should accept xhr.response as first argument)
 * @param {function} onSuccessCallback  Function to call when request succeeds (should accept xhr.response as first argument)
 * May at some point integrate with ajax.promise (workaround)
 */
_defineProperty(FetchedItem, "defaultProps", {
  "fetchedItemPropName": "fetchedItem",
  "isFetchingItemPropName": "isFetchingItem",
  "onFail": function onFail() {
    Alerts.queue(Alerts.ConnectionError);
  }
});
export function postMultipartFormData() {
  var postURL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var formData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var onErrorCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var onSuccessCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  console.log("Attempting multipart/form-data Ingestion. \n\nPosting to: ".concat(postURL));
  if (!postURL || !formData || !onErrorCallback || !onSuccessCallback) {
    throw new Error("All arguments required. See SPC util/ajax.js for spec.");
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", postURL, true);
  xhr.onreadystatechange = function () {
    // Called when the state changes.
    AJAXSettings.onLoad(xhr);
    if (xhr.readyState !== 4) return;
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      // Request finished successfully
      onSuccessCallback(xhr.response);
    } else {
      onErrorCallback(xhr.response);
    }
  };
  xhr.send(formData);
}