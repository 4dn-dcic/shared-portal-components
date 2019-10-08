'use strict';
/**
 * @TODO
 * Export more / all things _if_ we're going to put this up on NPM or similar.
 * Or if we want to pre-compile a (non-minified) dist/shared-portal-components.js
 * to be imported by individual projects though will probably avoid doing for this
 * particular repo but maybe do for future ones like "visualization" if split them
 * out.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.util = void 0;

var importedUtils = _interopRequireWildcard(require("./components/util"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var util = importedUtils;
exports.util = util;