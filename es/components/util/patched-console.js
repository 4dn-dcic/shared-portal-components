'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchedConsoleInstance = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _misc = require("./misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var patchedConsoleInstance = function () {
  if (!(0, _misc.isServerSide)() && window.patchedConsole) return window.patchedConsole;
  var patchedConsole = new function PatchedConsole() {
    this.isDebugging = function () {
      if (typeof BUILDTYPE === 'undefined') {
        console.warn("BUILDTYPE var is not set - likely running uncompiled ES6 JS -or- compile-time issue.");
        return true;
      }

      if (BUILDTYPE === "production") {
        return false;
      }

      return true;
    };

    this._initArgs = arguments;
    this._enabled = true;
    this._available = true;

    if (typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.bind === 'undefined') {
      this._available = false;
    }

    if (!this.isDebugging()) {
      this._enabled = false;
    }

    this._nativeMethods = ['log', 'assert', 'dir', 'error', 'info', 'warn', 'clear', 'profile', 'profileEnd'];
    this._nativeConsole = console;

    this._dummyFunc = function () {
      return false;
    };

    this._setCustomMethods = function () {
      if (this._enabled && this._available && typeof this._nativeConsole.log !== 'undefined') {
        this.timeLog = function () {
          this._nativeConsole.log.apply(this._nativeConsole, ['%c(' + (0, _moment.default)().format('h:mm:ss.SSS') + ') %c%s'].concat('color: darkcyan', 'color: black', Array.prototype.slice.apply(arguments)));
        }.bind(this);
      } else {
        this.timeLog = this._dummyFunc;
      }
    }.bind(this);

    this._patchMethods = function () {
      this._nativeMethods.forEach(function (methodName) {
        if (!this._enabled || !this._available || typeof this._nativeConsole[methodName] === 'undefined') {
          this[methodName] = this._dummyFunc;
        } else {
          this[methodName] = this._nativeConsole[methodName].bind(this._nativeConsole);
        }
      }.bind(this));

      this._setCustomMethods();

      return this;
    }.bind(this);

    this.on = function () {
      this._enabled = true;
      return this._patchMethods();
    }.bind(this);

    this.off = function () {
      this._enabled = false;
      return this._patchMethods();
    }.bind(this);

    this._patchMethods();
  }();

  if (!(0, _misc.isServerSide)()) {
    window.patchedConsole = patchedConsole;
  }

  return patchedConsole;
}();

exports.patchedConsoleInstance = patchedConsoleInstance;