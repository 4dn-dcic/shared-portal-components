
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
export const patchedConsoleInstance = (function(){

    if (!isServerSide() && window.patchedConsole) return window.patchedConsole; // Re-use instance if available.

    const PatchedConsole = function(){

        /**
         * Check if `BUILDTYPE` constant is not on 'production'.
         *
         * @return {boolean} - True if `BUILDTYPE` != 'production'.
         */
        this.isDebugging = function(){
            // `BUILDTYPE` && `process.env.NODE_ENV` is set in webpack.config.js if running 'npm run build'
            if (typeof BUILDTYPE === 'undefined'){
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

        if (typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.bind === 'undefined') { // Check for seldomly incompatible browsers
            this._available = false;
            this._enabled = false;
        }

        if (!this.isDebugging()) {
            this._enabled = false; // Be silent on production.
        }

        this._nativeMethods = ['log', 'assert', 'dir', 'error', 'info', 'warn', 'clear', 'profile', 'profileEnd'];
        this._nativeConsole = console;

        this._dummyFunc = function(){
            return false;
        };

        this._patchMethods = () => {
            this._nativeMethods.forEach((methodName) => {
                if (!this._enabled) {
                    this[methodName] = this._dummyFunc;
                } else if (!this._nativeConsole[methodName]) {
                    this[methodName] = this._nativeConsole.log.bind(this._nativeConsole);
                } else {
                    this[methodName] = this._nativeConsole[methodName].bind(this._nativeConsole);
                }
            });
            return this;
        };

        // Ability to override, e.g. on production.
        this.on = () => {
            if (!this._available || this._enabled) {
                return false;
            }
            this._enabled = true;
            return this._patchMethods();
        };

        this.off = () => {
            if (!this._enabled) {
                return false;
            }
            this._enabled = false;
            return this._patchMethods();
        };

        this._patchMethods();
    };

    const patchedConsole = new PatchedConsole();

    if (!isServerSide()) {
        window.patchedConsole = patchedConsole;
    }

    return patchedConsole;
})();
