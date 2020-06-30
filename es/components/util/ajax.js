'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;
exports.promise = promise;
exports.fetch = fetch;
exports.fetchPolyfill = fetchPolyfill;

var _underscore = _interopRequireDefault(require("underscore"));

var JWT = _interopRequireWildcard(require("./json-web-token"));

var _patchedConsole = require("./patched-console");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  headers = JWT.addToHeaders(_underscore["default"].extend({}, defaultHeaders, headers)); // Set defaults, add JWT if set
  // Put everything in the header

  var headerKeys = _underscore["default"].keys(headers);

  for (var i = 0; i < headerKeys.length; i++) {
    if (deleteHeaders.indexOf(headerKeys[i]) > -1) {
      continue;
    }

    xhr.setRequestHeader(headerKeys[i], headers[headerKeys[i]]);
  }

  return xhr;
}

function load(url, callback) {
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

          _patchedConsole.patchedConsoleInstance.error('ajax.load error: ', response);

          if (typeof fallback === 'function') fallback(response, xhr);
        } catch (error) {
          _patchedConsole.patchedConsoleInstance.error('Non-JSON error response:', xhr.responseText);

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


function promise(url) {
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
        if (debugResponse) _patchedConsole.patchedConsoleInstance.info('Received data from ' + method + ' ' + url + ':', response);
      } catch (e) {
        _patchedConsole.patchedConsoleInstance.log(xhr);

        _patchedConsole.patchedConsoleInstance.error("Non-JSON error response:", xhr.responseText);

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


function fetch(targetURL, options) {
  options = _underscore["default"].extend({
    'credentials': 'same-origin'
  }, options);
  var http_method = options.method || 'GET';

  var headers = options.headers = _underscore["default"].extend({}, options.headers || {}); // Strip url fragment.


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


function fetchPolyfill(url, options) {
  var req = fetch(url, options);
  req.then(function (resp) {
    resp.json = function () {
      return resp;
    };
  });
  return req;
}