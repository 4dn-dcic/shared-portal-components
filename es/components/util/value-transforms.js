'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalize = capitalize;
exports.capitalizeSentence = capitalizeSentence;
exports.bytesToLargerUnit = bytesToLargerUnit;
exports.roundLargeNumber = roundLargeNumber;
exports.roundDecimal = roundDecimal;
exports.decorateNumberWithCommas = decorateNumberWithCommas;
exports.hrefToFilename = hrefToFilename;
exports.escapeRegExp = escapeRegExp;
exports.numberLevels = exports.byteLevels = void 0;

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function capitalize(word) {
  if (typeof word !== 'string') return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function capitalizeSentence(sen) {
  if (typeof sen !== 'string') return sen;
  return sen.split(' ').map(capitalize).join(' ');
}

var byteLevels = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'Exabytes', 'Zettabytes', 'Yottabyte'];
exports.byteLevels = byteLevels;
var numberLevels = ['', 'k', 'm', ' billion', ' trillion', ' quadrillion', ' quintillion'];
exports.numberLevels = numberLevels;

function bytesToLargerUnit(bytes) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (bytes >= 1024 && level < byteLevels.length) {
    return bytesToLargerUnit(bytes / 1024, level + 1);
  } else {
    return Math.round(bytes * 100) / 100 + ' ' + byteLevels[level];
  }
}

function roundLargeNumber(num) {
  var decimalPlaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (num >= 1000 && level < numberLevels.length) {
    return roundLargeNumber(num / 1000, decimalPlaces, level + 1);
  } else {
    var multiplier = Math.pow(10, decimalPlaces);
    return Math.round(num * multiplier) / multiplier + numberLevels[level];
  }
}

function roundDecimal(num) {
  var decimalsVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  if (isNaN(parseInt(num))) throw Error('Not a Number - ', num);
  var multiplier = Math.pow(10, decimalsVisible);
  return Math.round(num * multiplier) / multiplier;
}

function decorateNumberWithCommas(num) {
  if (!num || typeof num !== 'number' || num < 1000) return num; // Put full number into tooltip w. commas.

  var chunked = _underscore["default"].chunk((num + '').split('').reverse(), 3);

  return _underscore["default"].map(chunked, function (c) {
    return c.reverse().join('');
  }).reverse().join(',');
}
/** Only use where filename is expected. */


function hrefToFilename(href) {
  var linkTitle = href.split('/');
  return linkTitle = linkTitle.pop();
}

function escapeRegExp(string) {
  // escapes regex characters from strings
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // handle escapable characters in regexp
}