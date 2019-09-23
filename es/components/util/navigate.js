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

var cachedNavFunction = null;
var callbackFunctions = [];

var navigate = function (href) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var fallbackCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var includeReduxDispatch = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  if (typeof cachedNavFunction !== 'function') throw new Error('No navigate function cached.');

  var callbackFxn = function (jsonResponse) {
    if (callbackFunctions.length > 0) _underscore["default"].forEach(callbackFunctions, function (cb) {
      cb(jsonResponse);
    });
    if (typeof callback === 'function') callback(jsonResponse);
  };

  return cachedNavFunction.call(cachedNavFunction, href, options, callbackFxn, fallbackCallback, includeReduxDispatch);
};

exports.navigate = navigate;

navigate.setNavigateFunction = function (navFxn) {
  if (typeof navFxn !== 'function') throw new Error("Not a function.");
  cachedNavFunction = navFxn;
};

navigate.determineSeparatorChar = function (href) {
  return ['?', '&'].indexOf(href.charAt(href.length - 1)) > -1 ? '' : href.match(/\?./) ? '&' : '?';
};

navigate.isSearchHref = function (href) {
  if (typeof href === 'string') href = _url["default"].parse(href);
  if (href.pathname.slice(0, 8) === '/search/') return true;
  return false;
};

navigate.registerCallbackFunction = function (fxn) {
  callbackFunctions.push(fxn);
};

navigate.deregisterCallbackFunction = function (fxn) {
  callbackFunctions = _underscore["default"].without(callbackFunctions, fxn);
};

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
    if (typeof targetObj[tKey] === 'string') targetObj[tKey] = [targetObj[tKey]];
    targetObj[tKey] = _underscore["default"].uniq(_underscore["default"].filter(targetObj[tKey]));
    if (targetObj[tKey].length === 0) delete targetObj[tKey];
  });

  return targetObj;
};

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