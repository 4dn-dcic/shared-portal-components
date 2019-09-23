'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.maybeValid = maybeValid;
exports.getUserGroups = getUserGroups;
exports.getUserInfo = getUserInfo;
exports.getUserDetails = getUserDetails;
exports.saveUserDetails = saveUserDetails;
exports.save = save;
exports.saveUserInfoLocalStorage = saveUserInfoLocalStorage;
exports.saveUserInfo = saveUserInfo;
exports.remove = remove;
exports.addToHeaders = addToHeaders;
exports.isLoggedInAsAdmin = isLoggedInAsAdmin;
exports.decode = exports.cookieStore = void 0;

var _underscore = _interopRequireDefault(require("underscore"));

var _universalCookie = _interopRequireDefault(require("universal-cookie"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _misc = require("./misc");

var _patchedConsole = require("./patched-console");

var _object = require("./object");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var COOKIE_ID = 'jwtToken';
var cookieStore = new _universalCookie["default"]();
exports.cookieStore = cookieStore;
var dummyStorage = {};

function get() {
  var idToken = null;

  if ((0, _misc.isServerSide)()) {
    idToken = null;
  } else {
    idToken = cookieStore.get(COOKIE_ID) || null;
  }

  return idToken;
}

function storeExists() {
  if (typeof Storage === 'undefined' || typeof localStorage === 'undefined' || !localStorage) return false;
  return true;
}

function maybeValid(jwtToken) {
  return typeof jwtToken === 'string' && jwtToken.length > 0 && jwtToken !== "null" && jwtToken !== "expired" ? true : false;
}

function getUserGroups() {
  var userInfo = getUserInfo();
  var userGroups = [];

  if (userInfo) {
    var currGroups = (0, _object.getNestedProperty)(userInfo, ['details', 'groups'], true);

    if (currGroups && Array.isArray(currGroups)) {
      userGroups = currGroups;
    }
  }

  return userGroups;
}

function getUserInfo() {
  try {
    if (storeExists()) {
      return JSON.parse(localStorage.getItem('user_info'));
    } else {
      return JSON.parse(dummyStorage.user_info);
    }
  } catch (e) {
    return null;
  }
}

function getUserDetails() {
  var userInfo = getUserInfo();
  var userDetails = userInfo && userInfo.details || null;
  if (userDetails === 'null') userDetails = null;
  return userDetails;
}

function saveUserDetails(details) {
  var userInfo = getUserInfo();

  if (typeof userInfo !== 'undefined' && userInfo) {
    userInfo.details = details;
    saveUserInfoLocalStorage(userInfo);
    return true;
  } else {
    return false;
  }
}

function save(idToken) {
  cookieStore.set(COOKIE_ID, idToken, {
    path: '/'
  });
  return true;
}

function saveUserInfoLocalStorage(user_info) {
  if (storeExists()) {
    localStorage.setItem("user_info", JSON.stringify(user_info));
  } else {
    dummyStorage.user_info = JSON.stringify(user_info);
  }

  return true;
}

function saveUserInfo(user_info) {
  save(user_info.idToken || user_info.id_token, 'cookie');
  saveUserInfoLocalStorage(user_info);
}

function remove() {
  _patchedConsole.patchedConsoleInstance.warn("REMOVING JWT!!");

  var savedIdToken = cookieStore.get(COOKIE_ID) || null;

  if (savedIdToken) {
    cookieStore.remove(COOKIE_ID, {
      path: '/'
    });
  }

  if (!storeExists()) {
    delete dummyStorage.user_info;
  } else if (localStorage.user_info) {
    localStorage.removeItem("user_info");
  }

  _patchedConsole.patchedConsoleInstance.info('Removed JWT: ' + savedIdToken);

  return true;
}

function addToHeaders() {
  var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var idToken = get('cookie');

  if (idToken && typeof headers.Authorization === 'undefined') {
    headers.Authorization = 'Bearer ' + idToken;
  }

  return headers;
}

function isLoggedInAsAdmin() {
  var details = getUserDetails();

  if (details && Array.isArray(details.groups) && details.groups.indexOf('admin') > -1) {
    return true;
  }

  return false;
}

var decode = (0, _memoizeOne["default"])(function (jwtToken) {
  return jwtToken && _jsonwebtoken["default"].decode(jwtToken);
});
exports.decode = decode;