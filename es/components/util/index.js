'use strict';
/**
 * A directory of methods and maybe a mini-component or two for common use.
 *
 * @module util
 */
// Misc functions are top-level

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "isServerSide", {
  enumerable: true,
  get: function get() {
    return _misc.isServerSide;
  }
});
Object.defineProperty(exports, "isSelectAction", {
  enumerable: true,
  get: function get() {
    return _misc.isSelectAction;
  }
});
Object.defineProperty(exports, "memoizedUrlParse", {
  enumerable: true,
  get: function get() {
    return _misc.memoizedUrlParse;
  }
});
Object.defineProperty(exports, "navigate", {
  enumerable: true,
  get: function get() {
    return _navigate.navigate;
  }
});
exports.commonFileUtil = exports.valueTransforms = exports.schemaTransforms = exports.searchFilters = exports.JWT = exports.typedefs = exports.console = exports.ajax = exports.layout = exports.analytics = exports.object = void 0;

var _misc = require("./misc");

var objectMethods = _interopRequireWildcard(require("./object"));

var _navigate = require("./navigate");

var analyticsMethods = _interopRequireWildcard(require("./analytics"));

var layoutMethods = _interopRequireWildcard(require("./layout"));

var ajaxMethods = _interopRequireWildcard(require("./ajax"));

var _patchedConsole = require("./patched-console");

var typeDefinitions = _interopRequireWildcard(require("./typedefs"));

var JWTMethods = _interopRequireWildcard(require("./json-web-token"));

var searchFiltersImported = _interopRequireWildcard(require("./search-filters"));

var schemaTransformsImported = _interopRequireWildcard(require("./schema-transforms"));

var valueTransformsImported = _interopRequireWildcard(require("./value-transforms"));

var fileUtilities = _interopRequireWildcard(require("./file"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Transforms, manipulations, parsers, etc. re: objects.
var object = objectMethods; // Navigation

exports.object = object;
var analytics = analyticsMethods; // Layout

exports.analytics = analytics;
var layout = layoutMethods; // AJAX

exports.layout = layout;
var ajax = ajaxMethods; // Patches over browser window's console and disables logging (e.g. console.log) on production. Just import from this module to patch.

exports.ajax = ajax;
var console = _patchedConsole.patchedConsoleInstance; // Type definitions

exports.console = console;
var typedefs = typeDefinitions; // Functions related to JWT encoding/decoding/storage. Prevent name interference with 'jwt' NPM package.

exports.typedefs = typedefs;
var JWT = JWTMethods; //import * as experimentTransformFunctions from './experiments-transforms';
//export const expFxn = experimentTransformFunctions;

exports.JWT = JWT;
var searchFilters = searchFiltersImported; //export { itemTypeHierarchy } from './itemTypeHierarchy';
//import * as SchemaUtilities from './Schemas';
//export const Schemas = SchemaUtilities;

exports.searchFilters = searchFilters;
var schemaTransforms = schemaTransformsImported;
exports.schemaTransforms = schemaTransforms;
var valueTransforms = valueTransformsImported; // Transforms, manipulations, parsers, etc. re: objects.

exports.valueTransforms = valueTransforms;
var commonFileUtil = fileUtilities; //import * as SearchEngineOptimizationUtilities from './seo';
//export const SEO = SearchEngineOptimizationUtilities;

exports.commonFileUtil = commonFileUtil;