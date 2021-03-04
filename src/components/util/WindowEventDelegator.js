/* eslint-disable no-invalid-this */
import { isServerSide } from './../util/misc';
import { patchedConsoleInstance as console } from './patched-console';


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
export const WindowEventDelegator = new (function(){

    // Private inaccessible variables

    /** @type {Object.<string,Set<function>>} */
    const handlersByEvent = {};
    /** @type {Object.<string,function>} */
    const windowEventHandlersByEvent = {};
    /** @type {Object.<string,boolean>} */
    const isInitializedByEvent = {};

    function onWindowEvent(eventName, eventObject){
        for (const handlerFxn of handlersByEvent[eventName]) {
            handlerFxn(eventObject);
        }
    }

    // Exposed Methods

    this.addHandler = function(eventName, eventHandlerFxn){

        if (isServerSide()){
            console.warn("WindowEventDelegator is not supported server-side.");
            return false;
        }

        if (typeof windowEventHandlersByEvent[eventName] === "undefined") {
            windowEventHandlersByEvent[eventName] = onWindowEvent.bind(null, eventName);
        }

        if (typeof handlersByEvent[eventName] === "undefined") {
            handlersByEvent[eventName] = new Set();
        }

        handlersByEvent[eventName].add(eventHandlerFxn);

        if (!isInitializedByEvent[eventName]) {
            isInitializedByEvent[eventName] = true;
            window.addEventListener(
                eventName,
                windowEventHandlersByEvent[eventName],
                { passive: true }
            );
        }
    };

    this.removeHandler = function(eventName, eventHandlerFxn){

        if (isServerSide()){
            console.warn("WindowEventDelegator is not supported server-side.");
            return false;
        }

        handlersByEvent[eventName].delete(eventHandlerFxn);
        if (handlersByEvent[eventName].size === 0) {
            window.removeEventListener(eventName, windowEventHandlersByEvent[eventName]);
            delete handlersByEvent[eventName];
            delete isInitializedByEvent[eventName];
            delete windowEventHandlersByEvent[eventName];
        }
    };

})();
