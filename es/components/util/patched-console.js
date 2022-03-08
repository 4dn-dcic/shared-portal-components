'use strict';

import { isServerSide } from './misc';
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

export var patchedConsoleInstance = function () {
  if (!isServerSide() && window.patchedConsole) return window.patchedConsole; // Re-use instance if available.

  var patchedConsole = new function PatchedConsole() {
    var _this = this;

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
      this._enabled = false;
    }

    if (!this.isDebugging()) {
      this._enabled = false; // Be silent on production.
    }

    this._nativeMethods = ['log', 'assert', 'dir', 'error', 'info', 'warn', 'clear', 'profile', 'profileEnd'];
    this._nativeConsole = console;

    this._dummyFunc = function () {
      return false;
    };

    this._patchMethods = function () {
      _this._nativeMethods.forEach(function (methodName) {
        if (!_this._enabled) {
          _this[methodName] = _this._dummyFunc;
        } else if (!_this._nativeConsole[methodName]) {
          _this[methodName] = _this._nativeConsole.log.bind(_this._nativeConsole);
        } else {
          _this[methodName] = _this._nativeConsole[methodName].bind(_this._nativeConsole);
        }
      });

      return _this;
    }; // Ability to override, e.g. on production.


    this.on = function () {
      if (!_this._available || _this._enabled) {
        return false;
      }

      _this._enabled = true;
      return _this._patchMethods();
    };

    this.off = function () {
      if (!_this._enabled) {
        return false;
      }

      _this._enabled = false;
      return _this._patchMethods();
    };

    this._patchMethods();
  }();

  if (!isServerSide()) {
    window.patchedConsole = patchedConsole;
  }

  return patchedConsole;
}();