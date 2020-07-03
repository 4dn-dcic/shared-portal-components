"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WindowClickEventDelegator = void 0;

var _misc = require("./../util/misc");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Global singleton.
 *
 * To avoid attaching event listeners to window, can import this
 * singleton class instance and add/remove event handlers upon
 * mount and dismount.
 *
 * This is the way classes/instances r created in JS under the modern ECMAScript hood :-P.
 *
 * @todo maybe handle more events rather than just click.
 */
var WindowClickEventDelegator = new function () {
  if ((0, _misc.isServerSide)()) {
    console.warn("WindowClickEventDelegator is not supported server-side.");
    return;
  } // Private inaccessible variables

  /** @type {Object.<string,Set<function>>} */


  var handlersByEvent = {};
  /** @type {Object.<string,function>} */

  var windowEventHandlersByEvent = {};
  /** @type {Object.<string,boolean>} */

  var isInitializedByEvent = {};

  function onWindowEvent(eventName, eventObject) {
    var _iterator = _createForOfIteratorHelper(handlersByEvent[eventName]),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var handlerFxn = _step.value;
        handlerFxn(eventObject);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } // Exposed Methods


  this.addHandler = function (eventName, eventHandlerFxn) {
    if (typeof windowEventHandlersByEvent[eventName] === "undefined") {
      windowEventHandlersByEvent[eventName] = onWindowEvent.bind(null, eventName);
    }

    if (typeof handlersByEvent[eventName] === "undefined") {
      handlersByEvent[eventName] = new Set();
    }

    handlersByEvent[eventName].add(eventHandlerFxn);

    if (!isInitializedByEvent[eventName]) {
      isInitializedByEvent[eventName] = true;
      window.addEventListener(eventName, windowEventHandlersByEvent[eventName], {
        passive: true
      });
    }
  };

  this.removeHandler = function (eventName, eventHandlerFxn) {
    handlersByEvent[eventName]["delete"](eventHandlerFxn);

    if (handlersByEvent[eventName].size === 0) {
      window.removeEventListener(eventName, windowEventHandlersByEvent[eventName]);
      delete handlersByEvent[eventName];
      delete isInitializedByEvent[eventName];
      delete windowEventHandlersByEvent[eventName];
    }
  };
}();
exports.WindowClickEventDelegator = WindowClickEventDelegator;