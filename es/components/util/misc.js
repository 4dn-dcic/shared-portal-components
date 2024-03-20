function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
import memoize from 'memoize-one';
import url from 'url';

/**
 * Check if JS is processing on serverside, vs in browser (clientside).
 * Adapted from react/node_modules/fbjs/lib/ExecutionEnvironment.canUseDOM()
 *
 * @return {boolean} - True if processing on serverside.
 */
export function isServerSide() {
  if (typeof SERVERSIDE === 'boolean') {
    // See webpack.config.js of CGAP & 4DN portals, set via `webPack.definePlugin`.
    // Will _NOT_ be available in unit tests (as these import raw JSX afaik).
    return SERVERSIDE;
  }
  // Fallback
  if (typeof window === 'undefined' || !window || !window.document || !window.document.createElement) {
    return true;
  }
  return false;
}

/**
 * Check to see if localStorage is supported by the browser or environment.
 *
 * @private
 * @returns {boolean} True if supported.
 */
export function storeExists() {
  if (typeof Storage === 'undefined' || typeof localStorage === 'undefined' || !localStorage) return false;
  return true;
}

/**
 * `url.parse`, but globally memoized for performance.
 * **ONLY** pass in the _current_ `props.href` here.
 * Use regular `url.parse` for e.g. `pastProps.href`.
 *
 * If are re-using or transforming the resulting url parts or any
 * of its properties, such as the `query` property, be sure to
 * **clone** it first (since result is cached/memoized for other calls).
 *
 * @param {string} href - Current href.
 */
export var memoizedUrlParse = memoize(function (href) {
  // This warn message should appear once per unique page/href.
  console.warn("memoizedUrlParse called with", href);
  return url.parse(href, true);
});

/**
 * Check if actionType is one of the select (selection/multiselect) action types
 * @param {string?} actionType - current action type (if any)
 */
export function isSelectAction() {
  var actionType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (!actionType || typeof actionType !== "string") {
    return false;
  }
  return isSelectAction.selectionActionMap[actionType] || false;
}
isSelectAction.selectionActionMap = {
  "selection": true,
  "multiselect": true
};
export function isPrimitive(value) {
  var t = _typeof(value);
  return value === null || t === 'string' || t === 'number' || t === 'bigint' || t === 'boolean' || t === 'symbol' || t === 'undefined';
}