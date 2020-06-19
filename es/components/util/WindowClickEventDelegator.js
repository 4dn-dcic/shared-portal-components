"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WindowClickEventDelegator = void 0;

var _misc = require("./../util/misc");

/* eslint-disable no-invalid-this */

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
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = handlersByEvent[eventName][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var handlerFxn = _step.value;
        handlerFxn(eventObject);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
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