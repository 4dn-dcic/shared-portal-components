
/**
 * A directory of methods and maybe a mini-component or two for common use.
 *
 * @module util
 */


// Misc functions are top-level
export { isServerSide, isSelectAction, memoizedUrlParse } from './misc';


// Transforms, manipulations, parsers, etc. re: objects.
import * as objectMethods from './object';
export const object = objectMethods;


// Navigation
export { navigate } from './navigate';


// Analytics
import * as analyticsMethods from './analytics';
export const analytics = analyticsMethods;


// Layout
import * as layoutMethods from './layout';
export const layout = layoutMethods;


// AJAX
import * as ajaxMethods from './ajax';
export const ajax = ajaxMethods;


// Reporting
import * as loggerMethods from './logger';
export const logger = loggerMethods;


// Patches over browser window's console and disables logging (e.g. console.log) on production. Just import from this module to patch.
import { patchedConsoleInstance } from './patched-console';
export const console = patchedConsoleInstance;


// Type definitions
import * as typeDefinitions from './typedefs';
export const typedefs = typeDefinitions;


// Functions related to JWT encoding/decoding/storage. Prevent name interference with 'jwt' NPM package.
import * as JWTMethods from './json-web-token';
export const JWT = JWTMethods;


//import * as experimentTransformFunctions from './experiments-transforms';
//export const expFxn = experimentTransformFunctions;


import * as searchFiltersImported from './search-filters';
export const searchFilters = searchFiltersImported;

//export { itemTypeHierarchy } from './itemTypeHierarchy';

//import * as SchemaUtilities from './Schemas';
//export const Schemas = SchemaUtilities;

import * as schemaTransformsImported from './schema-transforms';
export const schemaTransforms = schemaTransformsImported;

import * as valueTransformsImported from './value-transforms';
export const valueTransforms = valueTransformsImported;


// Transforms, manipulations, parsers, etc. re: objects.
import * as fileUtilities from './file';
export const commonFileUtil = fileUtilities;

//import * as SearchEngineOptimizationUtilities from './seo';
//export const SEO = SearchEngineOptimizationUtilities;

// Helpers for managing SubmissionView state (Context, Hierarchy, etc.)
import * as submissionViewUtilities from './submission-view';
export const submissionStateUtil = submissionViewUtilities;

export { WindowEventDelegator } from './WindowEventDelegator';
