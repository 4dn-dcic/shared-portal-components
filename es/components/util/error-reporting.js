'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import _ from 'underscore';
import url from 'url';
import queryString from 'query-string';
import { isServerSide } from './misc';
import { patchedConsoleInstance as console } from './patched-console';
import { contextFiltersToExpSetFilters, expSetFiltersToJSON } from './search-filters';
import * as object from './object';
import * as JWT from './json-web-token';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
var defaultOptions = {
  "enabled": true,
  "isAnalyticsScriptOnPage": true,
  "enhancedEcommercePlugin": true,
  "itemToProductTransform": function itemToProductTransform(item) {
    // 4DN-specific, override from own data model.
    var itemID = item["@id"],
        itemUUID = item.uuid,
        itemType = item["@type"],
        display_title = item.display_title,
        title = item.title,
        _item$lab = item.lab;
    _item$lab = _item$lab === void 0 ? {} : _item$lab;
    var ownLabTitle = _item$lab.display_title,
        _item$file_type_detai = item.file_type_detailed,
        file_type_detailed = _item$file_type_detai === void 0 ? null : _item$file_type_detai,
        _item$track_and_facet = item.track_and_facet_info;
    _item$track_and_facet = _item$track_and_facet === void 0 ? {} : _item$track_and_facet;
    var tfi_expType = _item$track_and_facet.experiment_type,
        _item$experiment_type = item.experiment_type;
    _item$experiment_type = _item$experiment_type === void 0 ? {} : _item$experiment_type;
    var exp_expType = _item$experiment_type.display_title,
        _item$experiments_in_ = item.experiments_in_set;
    _item$experiments_in_ = _item$experiments_in_ === void 0 ? [{}] : _item$experiments_in_;

    var _item$experiments_in_2 = _slicedToArray(_item$experiments_in_, 1),
        _item$experiments_in_3 = _item$experiments_in_2[0];

    _item$experiments_in_3 = _item$experiments_in_3 === void 0 ? {} : _item$experiments_in_3;
    var _item$experiments_in_4 = _item$experiments_in_3.experiment_type;
    _item$experiments_in_4 = _item$experiments_in_4 === void 0 ? {} : _item$experiments_in_4;
    var set_expType = _item$experiments_in_4.display_title,
        _item$from_experiment = item.from_experiment,
        from_experiment = _item$from_experiment === void 0 ? null : _item$from_experiment,
        _item$from_experiment2 = item.from_experiment_set,
        from_experiment_set = _item$from_experiment2 === void 0 ? null : _item$from_experiment2;
    var labTitle = ownLabTitle || from_experiment && from_experiment.from_experiment_set && from_experiment.from_experiment_set.lab && from_experiment.from_experiment_set.lab.display_title || from_experiment_set && from_experiment_set.lab && from_experiment_set.lab.display_title || null;

    var prodItem = _defineProperty({
      'id': itemID || itemUUID,
      'name': display_title || title || null,
      'category': Array.isArray(itemType) ? itemType.slice().reverse().slice(1).join('/') : "Unknown",
      'brand': labTitle
    }, "dimension" + state.dimensionNameMap.name, display_title || title || null);

    if (typeof file_type_detailed === "string") {
      // We set file format as "variant"
      var _file_type_detailed$m = file_type_detailed.match(/(.*?)\s(\(.*?\))/),
          _file_type_detailed$m2 = _slicedToArray(_file_type_detailed$m, 3),
          fileTypeMatch = _file_type_detailed$m2[1],
          fileFormatMatch = _file_type_detailed$m2[2];

      if (fileFormatMatch) {
        prodItem.variant = fileTypeMatch;
      }
    }

    if (tfi_expType) {
      prodItem["dimension" + state.dimensionNameMap.experimentType] = tfi_expType;
    } else if (from_experiment && from_experiment.experiment_type && from_experiment.experiment_type.display_title) {
      prodItem["dimension" + state.dimensionNameMap.experimentType] = from_experiment.experiment_type.display_title;
    } else if (exp_expType || set_expType) {
      prodItem["dimension" + state.dimensionNameMap.experimentType] = exp_expType || set_expType;
    }

    return prodItem;
  },
  // Google Analytics allows custom dimensions to be sent along w/ events, however they are named incrementally w/o customization.
  // Here we track own keywords/keys and transform to Google-Analytics incremented keys.
  "dimensionNameMap": {
    "currentFilters": 1,
    "name": 2,
    "field": 3,
    "term": 4,
    "experimentType": 5,
    "userGroups": 6
  },
  "metricNameMap": {
    "filesize": 1,
    "downloads": 2
  },
  "anonymizeTypes": ["User"],
  "excludeAdminTrackingOnHostnames": ["data.4dnucleome.org"],
  "reduxStore": null
};
var state = null;
/**
 * Initialize Sentry Reporting. Call this from app.js on initial mount perhaps.
 *
 * @export
 * @param {string} [dsn] - Sentry dsn.
 * @param {Object} [context] - Current page content / JSON, to get details about Item, etc.
 * @param {Object} [options] - Extra options.
 * @returns {boolean} true if initialized.
 */

export function initializeSentry() {
  var dsn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var appOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (dsn === null || typeof dsn !== 'string') {
    throw new Error("No dsn provided");
  }

  if (isServerSide()) return false;

  var _appOptions$initialCo = appOptions.initialContext,
      initialContext = _appOptions$initialCo === void 0 ? null : _appOptions$initialCo,
      _appOptions$initialHr = appOptions.initialHref,
      initialHref = _appOptions$initialHr === void 0 ? null : _appOptions$initialHr,
      appOpts = _objectWithoutProperties(appOptions, ["initialContext", "initialHref"]);

  _objectSpread(_objectSpread({}, defaultOptions), appOpts);

  Sentry.init({
    dsn: dsn,
    integrations: [new Integrations.BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  });

  if (!shouldTrack()) {
    console.error("EXITING ANALYTICS INITIALIZATION.");
    return false;
  }

  console.info("Sentry: Initialized");
  return true;
}
/**
 *
 */

export function captureException(message) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Sentry.Severity.Warning;
  var fatal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!shouldTrack()) return false;
  Sentry.withScope(function (scope) {
    scope.setLevel(level);
    Sentry.captureException(message);
  }); //Sentry.captureException(message);

  return true;
}
/*********************
 * Private Functions *
 *********************/

function shouldTrack() {
  console.error("Sentry Reporting is not initialized. Fine if this appears in a test.");
  return false;
}