'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isServerSide = isServerSide;
exports.isSelectAction = isSelectAction;
exports.memoizedUrlParse = void 0;

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _url = _interopRequireDefault(require("url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Check if JS is processing on serverside, vs in browser (clientside).
 * Adapted from react/node_modules/fbjs/lib/ExecutionEnvironment.canUseDOM()
 *
 * @return {boolean} - True if processing on serverside.
 */
function isServerSide() {
  if (typeof SERVERSIDE === 'boolean') {
    // See webpack.config.js of CGAP & 4DN portals, set via `webPack.definePlugin`.
    // Will _NOT_ be available in unit tests (as these import raw JSX afaik).
    return SERVERSIDE;
  } // Fallback


  if (typeof window === 'undefined' || !window || !window.document || !window.document.createElement) {
    return true;
  }

  return false;
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


var memoizedUrlParse = (0, _memoizeOne["default"])(function (href) {
  // This warn message should appear once per unique page/href.
  console.warn("memoizedUrlParse called with", href);
  return _url["default"].parse(href, true);
});
/**
 * Check if actionType is one of the select (selection/multiselect) action types
 * @param {string?} actionType - current action type (if any)
 */

exports.memoizedUrlParse = memoizedUrlParse;

function isSelectAction() {
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