'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchedConsoleInstance = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _misc = require("./misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Custom patched console instance for debugging. Only print out statements if debugging/development environment.
 * Prevent potential issues where console might not be available (earlier IE).
 *
 * @example
 * <caption>Usage:</caption>
 * import { console } from './util';
 * - or -
 * var { console } = require('./util');
 * - or (from same/local directory) -
 * var console = require('./patched-console').default;
 */
var patchedConsoleInstance = function () {
  if (!(0, _misc.isServerSide)() && window.patchedConsole) return window.patchedConsole; // Re-use instance if available.

  var patchedConsole = new function PatchedConsole() {
    var _this = this,
        _arguments = arguments;

    /**
     * Check if `BUILDTYPE` constant is not on 'production'.
     *
     * @return {boolean} - True if `BUILDTYPE` != 'production'.
     */
    this.isDebugging = function () {
      // `BUILDTYPE` && `process.env.NODE_ENV` is set in webpack.config.js if running 'npm run build'
      if (typeof BUILDTYPE === 'undefined') {
        console.warn("BUILDTYPE var is not set - likely running uncompiled ES6 JS -or- compile-time issue.");
        return true;
      }

      if (BUILDTYPE === "production") {
        return false;
      }

      return true;
    };

    this._initArgs = arguments; // arguments variable contains any arguments passed to function in an array.

    this._enabled = true; // Default

    this._available = true;

    if (typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.bind === 'undefined') {
      // Check for seldomly incompatible browsers
      this._available = false;
    }

    if (!this.isDebugging()) {
      this._enabled = false; // Be silent on production.
    }

    this._nativeMethods = ['log', 'assert', 'dir', 'error', 'info', 'warn', 'clear', 'profile', 'profileEnd'];
    this._nativeConsole = console;

    this._dummyFunc = function () {
      return false;
    };

    this._setCustomMethods = function () {
      if (_this._enabled && _this._available && typeof _this._nativeConsole.log !== 'undefined') {
        _this.timeLog = function () {
          // eslint-disable-next-line prefer-spread
          _this._nativeConsole.log.apply(_this._nativeConsole, ['%c(' + (0, _moment["default"])().format('h:mm:ss.SSS') + ') %c%s'].concat('color: darkcyan', 'color: black', Array.prototype.slice.apply(_arguments)));
        };
      } else {
        _this.timeLog = _this._dummyFunc;
      }
    };

    this._patchMethods = function () {
      _this._nativeMethods.forEach(function (methodName) {
        if (!_this._enabled || !_this._available || typeof _this._nativeConsole[methodName] === 'undefined') {
          _this[methodName] = _this._dummyFunc;
        } else {
          _this[methodName] = _this._nativeConsole[methodName].bind(_this._nativeConsole);
        }
      });

      _this._setCustomMethods();

      return _this;
    }; // Ability to override, e.g. on production.


    this.on = function () {
      _this._enabled = true;
      return _this._patchMethods();
    };

    this.off = function () {
      _this._enabled = false;
      return _this._patchMethods();
    };

    this._patchMethods();
  }();

  if (!(0, _misc.isServerSide)()) {
    window.patchedConsole = patchedConsole;
  }

  return patchedConsole;
}();

exports.patchedConsoleInstance = patchedConsoleInstance;