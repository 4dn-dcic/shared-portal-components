'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.navigate = void 0;

var _url = _interopRequireDefault(require("url"));

var _queryString = _interopRequireDefault(require("query-string"));

var _underscore = _interopRequireDefault(require("underscore"));

var _typedefs = require("./typedefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// let cachedAppRootComponentInstance = null;
var cachedNavFunction = null;
var cachedUpdateUserInfoFunction = null;
var callbackFunctions = [];
/**
 * All of this is very much of a React anti-pattern...
 * Much of navigate probably could be more static/global and work w. Redux store maybe,
 * especially if `session` and similar is moved to Redux store from App component(s).
 *
 * Navigation function, defined globally to act as alias of App.navigate.
 * Is set in App constructor via navigate.setNavigateFunction.
 *
 * Singleton function, defined the old fashioned way (pre ES6).
 * Uses the same parameters as app.prototype.navigate(..).
 *
 * Use by importing and calling in the same way app.navigate might be used.
 *
 * @todo Utilize `cachedAppRootComponentInstance` instead, once we've migrated to `initializeFromApp` for all projects.
 *
 * @param {string}       href                        Where to navigate to.
 * @param {NavigateOpts} [options={}]                Additional options, examine App.navigate for details.
 * @param {function}     [callback]                  Optional callback, accepts the response object.
 * @param {function}     [fallbackCallback]          Optional callback called if any error with response, including 404 error. Accepts response object -or- error object, if AJAX request failed.
 * @param {Object}       [includeReduxDispatch={}]   Optional state to save to Redux store, in addition to the 'href' and 'context' set by navigate function.
 *
 * @example
 * var { navigate } = require('./util');
 * navigate('/a/different/page', options);
 */

var navigate = function (href) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var fallbackCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var includeReduxDispatch = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  if (typeof cachedNavFunction !== 'function') throw new Error('No navigate function cached.');

  var callbackFxn = function (jsonResponse) {
    if (callbackFunctions.length > 0) _underscore["default"].forEach(callbackFunctions, function (cb) {
      cb(jsonResponse);
    }); // Any registered callbacks.

    if (typeof callback === 'function') callback(jsonResponse); // Original callback
  };

  return cachedNavFunction(href, options, callbackFxn, fallbackCallback, includeReduxDispatch);
};
/******* PUBLIC STATIC FUNCTIONS *******/

/**
 * This is called in app initialization to alias app.navigate into this global module/function.
 *
 * @returns {void}
 */


exports.navigate = navigate;

navigate.initializeFromApp = function (rootAppComponentInstance) {
  if (typeof rootAppComponentInstance.navigate !== 'function') throw new Error("`rootAppComponentInstance.navigate` is not a function."); // cachedAppRootComponentInstance = rootAppComponentInstance; // <-- Super anti-pattern...

  cachedNavFunction = rootAppComponentInstance.navigate;
  cachedUpdateUserInfoFunction = rootAppComponentInstance.updateUserInfo;
};
/**
 * This is called in app initialization to alias app.navigate into this global module/function.
 *
 * @deprecated Replaced by `navigate.initializeFromApp`.
 * @param {function} navFxn - The `navigate` function bound to `App` component to be aliased.
 * @returns {void}
 */


navigate.setNavigateFunction = function (navFxn) {
  if (typeof navFxn !== 'function') throw new Error("Not a function.");
  cachedNavFunction = navFxn;
};

navigate.updateUserInfo = function () {
  return cachedUpdateUserInfoFunction.apply(void 0, arguments);
};

navigate.determineSeparatorChar = function (href) {
  return ['?', '&'].indexOf(href.charAt(href.length - 1)) > -1 ? // Is last character a '&' or '?' ?
  '' : href.match(/\?./) ? '&' : '?';
};
/** Utility function to check if we are on a search page. */


navigate.isSearchHref = function (href) {
  if (typeof href === 'string') href = _url["default"].parse(href);
  if (href.pathname.slice(0, 8) === '/search/') return true;
  return false;
};
/** Register a function to be called on each navigate response. */


navigate.registerCallbackFunction = function (fxn) {
  callbackFunctions.push(fxn);
};

navigate.deregisterCallbackFunction = function (fxn) {
  callbackFunctions = _underscore["default"].without(callbackFunctions, fxn);
};
/** Useful for param lists */


navigate.mergeObjectsOfLists = function () {
  if (arguments.length < 2) throw Error('Expecting multiple objects as params');
  var targetObj = arguments[0];
  var sourceObjs = Array.prototype.slice.call(arguments, 1);

  _underscore["default"].forEach(sourceObjs, function (o) {
    _underscore["default"].forEach(_underscore["default"].keys(o), function (oKey) {
      if (typeof targetObj[oKey] === 'undefined') targetObj[oKey] = [];
      if (typeof targetObj[oKey] === 'string') targetObj[oKey] = [targetObj[oKey]];

      if (Array.isArray(o[oKey])) {
        if (!_underscore["default"].every(o[oKey], function (v) {
          return typeof v === 'string';
        })) throw new Error('Must have list of strings as object vals.');
        targetObj[oKey] = targetObj[oKey].concat(o[oKey]);
      } else if (typeof o[oKey] === 'string') {
        targetObj[oKey].push(o[oKey]);
      } else {
        throw new Error('Must have strings or list of strings as object vals.');
      }
    });
  });

  _underscore["default"].forEach(_underscore["default"].keys(targetObj), function (tKey) {
    if (typeof targetObj[tKey] === 'string') targetObj[tKey] = [targetObj[tKey]]; // Keys which perhaps don't exist on sourceObjs

    targetObj[tKey] = _underscore["default"].uniq(_underscore["default"].filter(targetObj[tKey]));
    if (targetObj[tKey].length === 0) delete targetObj[tKey];
  });

  return targetObj;
};
/** Test if same origin on 2 hrefs. Ported from ENCODE/libs/origin. */


navigate.sameOrigin = function (from, to) {
  if (typeof to === 'undefined') {
    to = from;
    from = document.location.href;
  }

  if (typeof from === 'string') from = _url["default"].parse(from);
  if (typeof to === 'string') to = _url["default"].parse(_url["default"].resolve(from.href, to));
  if (to.protocol === 'data:' || to.protocol === 'javascript:') return true;
  if (from.protocol !== to.protocol) return false;
  if (from.protocol === 'file:') return from.pathname === to.pathname;
  return from.host === to.host;
};