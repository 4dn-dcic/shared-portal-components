'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
var defaultOptions = {
  "enabled": true,
  "isAnalyticsScriptOnPage": true,
  "enhancedEcommercePlugin": true,
  "itemToProductTransform": function (item) {
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
/** Calls `ga`, ensuring it is present on window. */

function ga2() {
  try {
    return window.ga.apply(window.ga, Array.from(arguments));
  } catch (e) {
    console.error('Could not track event. Fine if this is a test.', e, Array.from(arguments));
  }
}
/**
 * Initialize Google Analytics tracking. Call this from app.js on initial mount perhaps.
 *
 * @export
 * @param {string} [trackingID] - Google Analytics ID.
 * @param {Object} [context] - Current page content / JSON, to get details about Item, etc.
 * @param {Object} [options] - Extra options.
 * @returns {boolean} true if initialized.
 */


export function initializeGoogleAnalytics() {
  var trackingID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var appOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (trackingID === null || typeof trackingID !== 'string') {
    throw new Error("No tracking ID provided");
  }

  if (isServerSide()) return false;

  var _appOptions$initialCo = appOptions.initialContext,
      initialContext = _appOptions$initialCo === void 0 ? null : _appOptions$initialCo,
      _appOptions$initialHr = appOptions.initialHref,
      initialHref = _appOptions$initialHr === void 0 ? null : _appOptions$initialHr,
      appOpts = _objectWithoutProperties(appOptions, ["initialContext", "initialHref"]);

  var options = _objectSpread(_objectSpread({}, defaultOptions), appOpts); // TODO: Check for user-scoped 'do not track' flag, set state.enabled=false


  var _ref = JWT.getUserDetails() || {},
      userUUID = _ref.uuid,
      _ref$groups = _ref.groups,
      userGroups = _ref$groups === void 0 ? [] : _ref$groups;

  if (!options.isAnalyticsScriptOnPage) {
    // If true, we already have <script src="...analytics.js">, e.g. in app.js so should skip this.
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date();
      a = s.createElement(o), m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  }

  state = _.clone(options); // TODO check localStorage for device-scoped 'do not track' flag, set state.enabled=false

  if (!shouldTrack()) {
    console.error("EXITING ANALYTICS INITIALIZATION.");
    return false;
  }

  ga2('create', trackingID, 'auto');
  ga2(function (tracker) {
    var clientID = tracker.get('clientId');
    console.log("Got client id", clientID);

    if (clientID) {
      // Used on backend to associate downloads with user sessions when possible.
      // (previous cookies are *not* overwritten)
      document.cookie = "clientIdentifier=" + clientID + "; path=/";
      console.info("GA: Loaded Tracker & Updated Client ID Cookie");
    }
  });

  if (options.enhancedEcommercePlugin) {
    ga2('require', 'ec');
    console.info("GA: Enhanced ECommerce Plugin");
  }

  if (userUUID) {
    setUserID(userUUID);
    event('Authentication', 'ExistingSessionLogin', {
      userUUID: userUUID,
      name: userUUID,
      userGroups: userGroups && JSON.stringify(userGroups.slice().sort()),
      eventLabel: 'Authenticated ServerSide'
    });
  }

  console.info("GA: Initialized");

  if (initialContext) {
    registerPageView(initialHref, initialContext);
  }

  return true;
}
var lastRegisteredPageViewRealPathNameAndSearch = null;
/**
 * Register a pageview.
 * Used in app.js in App.componentDidUpdate(pastProps, ...).
 *
 * @export
 * @param {string} [href=null] - Page href, defaults to window.location.href.
 * @param {Object} [context={}] - The context prop; JSON representation of page.
 * @returns {boolean} True if success.
 */

export function registerPageView() {
  var href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!shouldTrack()) return false; // Take heed of this notice if it is visible somewhere.

  if (!href) {
    href = window.location && window.location.href;
    console.error("No HREF provided, check.. something. Will still send pageview event to window href", href);
  }

  context = context || state.reduxStore && state.reduxStore.getState().context || null; // Options to send with GA pageview event.

  var parts = url.parse(href, true);

  var pageViewObject = _objectSpread(_objectSpread({}, eventObjectFromCtx(context)), {}, {
    hitType: 'pageview'
  });

  // Store orig href in case we need it later
  var _ref2 = context || {},
      _ref2$accession = _ref2.accession,
      ctxAccession = _ref2$accession === void 0 ? null : _ref2$accession,
      _ref2$Type = _ref2['@type'],
      itemType = _ref2$Type === void 0 ? [] : _ref2$Type,
      ctxUUID = _ref2.uuid,
      _ref2$Graph = _ref2['@graph'],
      searchResponseResults = _ref2$Graph === void 0 ? null : _ref2$Graph,
      _ref2$filters = _ref2.filters,
      searchResponseFilters = _ref2$filters === void 0 ? null : _ref2$filters,
      _ref2$code = _ref2.code,
      code = _ref2$code === void 0 ? null : _ref2$code; // Should be present on all Item responses - except Errors (HTTPForbidden, etc.).
  // Errors would have 'title' such as 'Forbidden'. Or maybe 'Browse'.

  /**
   * Convert pathname with a 'UUID', 'Accession', or 'name' to having a
   * literal "uuid", "accession", or "name" and track the display_title, title, or accession as a
   * separate GA dimension.
   *
   * @private
   * @param {string} pathName - Path part of href being navigated to. Use url.parse to get.
   * @return {string} Adjusted pathName.
   */


  function adjustPageViewPath(pathName) {
    var pathParts = pathName.split('/').filter(function (pathPart) {
      // Gen path array to adjust href further if needed.
      return pathPart.length > 0;
    });

    var _pathParts = _slicedToArray(pathParts, 2),
        possibleItemTypePathPart = _pathParts[0],
        possibleItemUniqueKeyPathPath = _pathParts[1];

    var newPathName = null;

    if (possibleItemUniqueKeyPathPath && typeof possibleItemUniqueKeyPathPath === 'string') {
      // Remove Accession, UUID, and Name from URL and save it to Item name dimension instead.
      if (typeof ctxAccession === 'string' && possibleItemUniqueKeyPathPath === ctxAccession || object.isAccessionRegex(possibleItemUniqueKeyPathPath)) {
        // We gots an accessionable Item. Lets remove its Accession from the path to get nicer Behavior Flows in GA.
        // And let product tracking / Shopping Behavior handle Item details.
        pathParts[1] = 'accession';
        newPathName = '/' + pathParts.join('/') + '/';
      } else if (typeof ctxUUID === 'string' && possibleItemUniqueKeyPathPath === ctxUUID || object.isUUID(possibleItemUniqueKeyPathPath)) {
        pathParts[1] = 'uuid';
        newPathName = '/' + pathParts.join('/') + '/';
      } else if (typeof context.name === 'string' && possibleItemUniqueKeyPathPath === context.name) {
        // Most likely case for Lab, Project, etc.
        pathParts[1] = 'name';
        newPathName = '/' + pathParts.join('/') + '/';
      } else {
        newPathName = pathName;
      }
    } else {
      newPathName = pathName;
    } // Add 'q' and 'type' params back to pathname; they'll be parsed and filtered out by Google Analytics to be used for 'search query' and 'search category' analytics.
    // Other URL params are extracted out and supplied via "current filters" / "dimension1" as JSON.


    if (parts.query && (parts.query.q || parts.query.type)) {
      var qs = queryString.stringify({
        'q': parts.query.q,
        'type': parts.query.type
      });
      newPathName = pathName + (qs ? '?' + qs : '');
    }

    return newPathName;
  }
  /**
   * Check for Items (aka Products) - either a results graph on /browse/, /search/, or collections pages, or an Item page.
   * If any are present, impression list views or detail view accordingly.
   *
   * @private
   * @returns {boolean|Object|Object[]} Representation of what was tracked, or false if nothing was.
   */


  function registerProductView() {
    if (!shouldTrack()) return false;

    if (state.enhancedEcommercePlugin !== true) {
      console.warn("Enhanced ECommerce is not enabled. Will -not- register product views.");
      return false;
    }

    if (Array.isArray(searchResponseResults)) {
      // We have a results page of some kind. Likely, browse, search, or collection.
      // If browse or search page, get current filters and add to pageview event for 'dimension1'.
      if (searchResponseFilters && state.dimensionNameMap.currentFilters) {
        pageViewObject["dimension" + state.dimensionNameMap.currentFilters] = getStringifiedCurrentFilters(searchResponseFilters);
      }

      if (searchResponseResults.length > 0) {
        // We have some results, lets impression them as product list views.
        return impressionListOfItems(searchResponseResults, parts, null, context);
      }

      return false;
    } else if (itemType.indexOf("Item") > -1) {
      // We got an Item view, lets track some details about it.
      var productObj = itemToProductTransform(context);
      console.info("Item Page View (probably). Will track as product:", productObj);
      ga2('ec:addProduct', productObj);
      ga2('ec:setAction', 'detail', productObj);
      return productObj;
    }
  } // Clear query & hostname from HREF & convert accessions, uuids, and certain names to literals.


  var adjustedPathName = adjustPageViewPath(parts.pathname); // Ensure is not the same page but with a new hash or something (RARE - should only happen for Help page table of contents navigation).

  if (lastRegisteredPageViewRealPathNameAndSearch === parts.pathname + parts.search) {
    console.warn('Page did not change, canceling PageView tracking for this navigation.');
    return false;
  }

  lastRegisteredPageViewRealPathNameAndSearch = parts.pathname + parts.search;
  ga2('set', 'page', adjustedPathName); // Set it as current page

  if (shouldAnonymize(itemType)) {
    // Override page title
    pageViewObject.title = ctxAccession || ctxUUID || "[Anonymized Title]";
  }

  pageViewObject.page = adjustedPathName; // Don't need to do re: 'set' 'page', but redundant for safety.

  pageViewObject.location = url.resolve(href, adjustedPathName);

  pageViewObject.hitCallback = function () {
    console.info('Successfuly sent pageview event.', adjustedPathName, pageViewObject);
  };

  registerProductView();
  ga2('send', 'pageview', pageViewObject);

  if (code === 403) {
    // HTTPForbidden Access Denied - save original URL
    event("Navigation", "HTTPForbidden", {
      eventLabel: parts.pathname
    });
  }

  return true;
}
export function eventObjectFromCtx(context) {
  if (!context) return {};

  var _ref3 = context || {},
      _ref3$Type = _ref3['@type'],
      ctxTypes = _ref3$Type === void 0 ? [] : _ref3$Type,
      _ref3$filters = _ref3.filters,
      filters = _ref3$filters === void 0 ? null : _ref3$filters,
      display_title = _ref3.display_title,
      title = _ref3.title,
      accession = _ref3.accession,
      uuid = _ref3.uuid,
      name = _ref3.name; // `display_title` should be present on all Item responses - except Errors (HTTPForbidden, etc.).
  // Errors would have 'title' such as 'Forbidden'. Or maybe 'Browse'.


  var eventObj = {
    name: display_title || title || accession || name || uuid || "UNKNOWN NAME"
  };

  if (shouldAnonymize(ctxTypes)) {
    eventObj.name = accession || uuid || "[Anonymized Title]";
  }

  if (filters) {
    // If search response context, add these.
    eventObj.currentFilters = getStringifiedCurrentFilters(filters);
  }

  return eventObj;
}
/**
 * Primarily for UI interaction events.
 *
 * Rough Guidelines:
 * - For category, try to use name of React Component by which are grouping events by.
 * - For action, try to standardize name to existing ones (search through files for instances of `analytics.event(`).
 *   - For example, "Set Filter", "Unset Filter" for UI interactions which change one or more filters (even if multiple, use '.. Filter')
 * - For fields.eventLabel, try to standardize similarly to action.
 * - For fields.eventValue - do whatever makes sense I guess. Perhaps time vector from previous interaction.
 *
 * @see eventLabelFromChartNode()
 *
 * @param {string} category - Event Category
 * @param {string} action - Event Action
 * @param {Object} fields - Additional fields.
 * @param {string} fields.eventLabel - Event Label, e.g. 'play'.
 * @param {number} [fields.eventValue] - Event Value, must be an integer.
 * @param {Object} [fields.currentFilters] - Current filters set in portal, if on a search page.
 * @param {string} [fields.name] - Name of Item we're on, if any.
 * @param {string} [fields.field] - Name of field being acted on, if any.
 * @param {string} [fields.term] - Name of term being acted on or changed, if any.
 */

export function event(category, action) {
  var fields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var useTimeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  if (!shouldTrack()) return false;

  var eventObj = _.extend({}, fields, {
    'hitType': 'event',
    'eventCategory': category,
    'eventAction': action
  }); // Convert internal dimension names to Google Analytics ones.


  _.pairs(eventObj).forEach(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        key = _ref5[0],
        value = _ref5[1];

    if (typeof state.dimensionNameMap[key] !== 'undefined') {
      eventObj["dimension" + state.dimensionNameMap[key]] = value;
      delete eventObj[key];
    } else if (typeof state.metricNameMap[key] !== 'undefined') {
      eventObj["metric" + state.metricNameMap[key]] = value;
      delete eventObj[key];
    }
  });

  eventObj.hitCallback = function () {
    console.info('Successfuly sent UI event.', eventObj);
  };

  if (useTimeout) {
    setTimeout(function () {
      ga2('send', eventObj);
    }, 0);
  } else {
    ga2('send', eventObj);
  }
}
export function setUserID(userUUID) {
  if (!shouldTrack()) {
    return false;
  }

  ga2('set', 'userId', userUUID);
  console.info("Set analytics user id to", userUUID);
  return true;
}
export function productClick(item) {
  var extraData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  if (!shouldTrack()) {
    if (typeof callback === 'function') callback();
    return true;
  }

  context = context || state.reduxStore && state.reduxStore.getState().context || null;

  var pObj = _.extend(itemToProductTransform(item), extraData);

  var href = extraData.href || window.location.href;
  var evtFromCtx = eventObjectFromCtx(context);

  var eventObj = _objectSpread(_objectSpread({}, evtFromCtx), {}, {
    'hitType': 'event',
    'eventCategory': evtFromCtx.currentFilters ? 'Search Result Link' : 'Product List Link',
    'eventAction': 'click',
    'eventLabel': pObj.id || pObj.name,
    'hitCallback': function hitCallback() {
      console.info('Successfully sent product click event.', eventObj, pObj);

      if (typeof callback === 'function') {
        callback();
      }
    }
  });

  if (!pObj.list) {
    pObj.list = hrefToListName(href);
  }

  ga2('ec:addProduct', pObj);
  ga2('ec:setAction', 'click', _.pick(pObj, 'list')); // Convert internal dimension names to Google Analytics ones.

  _.forEach(_.pairs(eventObj), function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
        key = _ref7[0],
        value = _ref7[1];

    if (typeof state.dimensionNameMap[key] !== 'undefined') {
      eventObj["dimension" + state.dimensionNameMap[key]] = value;
      delete eventObj[key];
    } else if (typeof state.metricNameMap[key] !== 'undefined') {
      eventObj["metric" + state.metricNameMap[key]] = value;
      delete eventObj[key];
    }
  });

  ga2('send', eventObj);
  return true;
}
/**
 * Can be used needed. E.g. in 4DN is used for metadata.tsv download.
 * Does _NOT_ also send a GA event. This must be done outside of func.
 */

export function productsAddToCart(items) {
  var extraData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (items.length < 50) {
    if (!shouldTrack()) return false;
    var count = addProductsEE(items, extraData);
    console.info("Adding ".concat(count, " items to cart."));
    ga2('ec:setAction', 'add');
  } else {
    console.info("We do not run analystic because the number of files is high ".concat(items.length, " items."));
  }
}
export function productsRemoveFromCart(items) {
  var extraData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!shouldTrack()) return false;
  var count = addProductsEE(items, extraData);
  ga2('ec:setAction', 'remove');
  console.info("Removing ".concat(count, " items from cart."));
}
/**
 * Can be used needed. E.g. in 4DN is used for metadata.tsv download.
 * Does _NOT_ also send a GA event. This must be done outside of func.
 */

export function productsCheckout(items) {
  var extraData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (items.length < 50) {
    if (!shouldTrack()) return false;

    var _ref8 = extraData || {},
        _ref8$step = _ref8.step,
        step = _ref8$step === void 0 ? 1 : _ref8$step,
        _ref8$option = _ref8.option,
        option = _ref8$option === void 0 ? null : _ref8$option,
        extData = _objectWithoutProperties(_ref8, ["step", "option"]);

    var count = addProductsEE(items, extData);
    ga2('ec:setAction', 'checkout', {
      step: step,
      option: option
    });
    console.info("Checked out ".concat(count, " items."));
  } else {
    console.info("We do not run analystic because the number of files is high ".concat(items.length, " items."));
  }
}
export function productAddDetailViewed(item) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var extraData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!shouldTrack()) return false;

  var productObj = _.extend(itemToProductTransform(item), extraData);

  console.info("Item Details Viewed. Will track as product:", productObj);

  if (context && context.filters && state.dimensionNameMap.currentFilters) {
    productObj["dimension" + state.dimensionNameMap.currentFilters] = getStringifiedCurrentFilters(context.filters);
  }

  ga2('ec:addProduct', productObj);
  ga2('ec:setAction', 'detail', productObj);
}
/**
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
 */

export function exception(message) {
  var fatal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // Doesn't test whether should track or not -- assume always track errors.
  var excObj = {
    'hitType': 'exception',
    'exDescription': message,
    'exFatal': fatal
  };

  excObj.hitCallback = function () {
    console.info('Successfully sent exception', excObj);
  };

  ga2('send', excObj);
  return true;
}
/**
 * Given a 'node' object with a field, term, and potential parent node, generate a descriptive string to use as event label.
 *
 * @param {{ field : string, term : string }} node - Node object with at least 'field' and 'term'.
 * @param {boolean} [includeParentInfo=true] - Whether to add text for Parent Field and Parent Term (if any).
 * @returns {string} Label for analytics event.
 */

export function eventLabelFromChartNode(node) {
  var includeParentInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (!node || _typeof(node) !== 'object') return null;
  var labelData = [];
  if (node.field) labelData.push('Field: ' + node.field);
  if (node.term) labelData.push('Term: ' + node.term);
  if (includeParentInfo && node.parent && node.parent.field) labelData.push('Parent Field: ' + node.parent.field);
  if (includeParentInfo && node.parent && node.parent.term) labelData.push('Parent Term: ' + node.parent.term);
  return labelData.join(', ');
}
export function eventLabelFromChartNodes(nodes) {
  return nodes.map(eventLabelFromChartNode).join('; ');
}
/**
 * Converts expSetFilters object or href with query (as string) to stringified JSON representation.
 *
 * @param {Object} expSetFilters - expSetFilters object.
 * @returns {string} Stringified JSON to be saved to analytics.
 */

export function getStringifiedCurrentFilters(contextFilters) {
  if (!contextFilters) return null; // Deprecated naming and data structure; we can refactor to get rid of notion of expset filters.

  var expSetFilters = contextFiltersToExpSetFilters(contextFilters);
  return JSON.stringify(expSetFiltersToJSON(expSetFilters), _.keys(expSetFilters).sort());
}
export function getGoogleAnalyticsTrackingData() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var allData = null;

  try {
    allData = window.ga.getAll()[0].b.data.values;
  } catch (e) {
    console.error('Could not get data from current GA tracker.');
    return null;
  }

  if (allData !== null && key === null) return allData;

  if (typeof key === 'string' && _typeof(allData) === 'object' && allData) {
    try {
      return allData[':' + key];
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
/**
 * Generates a list name for analytics "list" property based on href pathname.
 */

export function hrefToListName(href) {
  var hrefParts = url.parse(href, false);
  var strippedPathName = hrefParts.pathname;

  if (strippedPathName.charAt(0) === "/") {
    strippedPathName = strippedPathName.slice(1);
  }

  if (strippedPathName.charAt(strippedPathName.length - 1) === "/") {
    strippedPathName = strippedPathName.slice(0, -1);
  }

  if (hrefParts.search && (hrefParts.search.indexOf('currentAction=selection') > -1 || hrefParts.search.indexOf('currentAction=multiselect') > -1)) {
    strippedPathName += " - Selection Action";
  }

  return strippedPathName;
}
/*********************
 * Private Functions *
 *********************/

function shouldTrack() {
  // 1. Ensure we're initialized
  if (!state) {
    console.error("Google Analytics is not initialized. Fine if this appears in a test.");
    return false;
  }

  if (!state.enabled) {
    console.warn("Google Analytics is not enabled. Fine if expected, else check config.");
    return false;
  }

  if (isServerSide()) {
    console.warn("Google Analytics will not be sent events while serverside. Fine if this appears in a test.");
    return false;
  }

  if (typeof window.ga === 'undefined') {
    console.error("Google Analytics library is not loaded/available. Fine if disabled via AdBlocker, else check `analytics.js` loading.");
    return false;
  } // 2. TODO: Check if User wants to be excluded from tracking
  // 2. TODO: Make sure not logged in as admin on a production site.
  // if (JWT.getUserGroups().indexOf('admin') > -1){
  //     const urlParts = url.parse(window.location.href);
  //     if (
  //         Array.isArray(state.excludeAdminTrackingOnHostnames) &&
  //         state.excludeAdminTrackingOnHostnames.indexOf(urlParts.host) > -1
  //     ){
  //         console.warn(`Logged in as admin on ${urlParts.host} - will NOT track.`);
  //         return false;
  //     } else {
  //         console.info(`Logged in as admin but ${urlParts.host} is not an excluded hostname - WILL track (for testing).`); // Too verbose ?
  //     }
  // }


  return true;
}

function shouldAnonymize(itemTypes) {
  var anonymizeMap = {};
  state.anonymizeTypes.forEach(function (anonType) {
    anonymizeMap[anonType] = true;
  });
  var i = (itemTypes || []).length;

  for (i = itemTypes.length; i > -1; i--) {
    if (anonymizeMap[itemTypes[i]]) {
      return true;
    }
  }

  return false;
}

function itemToProductTransform(item) {
  var _item$Type = item['@type'],
      itemTypes = _item$Type === void 0 ? [] : _item$Type,
      accession = item.accession,
      uuid = item.uuid;
  var prodItem = state.itemToProductTransform(item);

  if (shouldAnonymize(itemTypes)) {
    prodItem.name = accession || uuid || "[Anonymized Title]";
  }

  return prodItem;
}

function addProductsEE(items) {
  var extData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (items && !Array.isArray(items)) {
    items = [items];
  }

  var count = 0;
  var seen = {}; // Prevent duplicates

  items.forEach(function (item) {
    var display_title = item.display_title,
        id = item['@id'],
        itemType = item['@type'],
        error = item.error;

    if (!id || !display_title || !Array.isArray(itemType)) {
      if (error) {
        // Likely no view permissions, ok.
        return false;
      }

      var errMsg = "Analytics Product Tracking: Could not access necessary product/item fields";
      exception(errMsg);
      console.error(errMsg, item);
      return false;
    }

    if (seen[id]) {
      return;
    }

    seen[id] = true;

    var pObj = _.extend(itemToProductTransform(item), extData);

    if (typeof pObj.id !== "string") {
      console.error("No product id available, cannot track", pObj);
      return;
    }

    ga2('ec:addProduct', _objectSpread(_objectSpread({}, pObj), {}, {
      quantity: 1
    }));
    count++;
  });
  return count;
}
/**
 * Exported, but use with care. There must be an event or pageview sent immediately afterwards.
 *
 * @returns {Object[]} Representation of what was sent.
 */


export function impressionListOfItems(itemList) {
  var href = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var listName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  if (itemList.length < 50) {
    if (!shouldTrack()) return false;
    context = context || state && state.reduxStore && state.reduxStore.getState().context || null;
    var from = 0;

    if (typeof href === 'string') {
      // Convert to URL parts.
      href = url.parse(href, true);
      if (!isNaN(parseInt(href.query.from))) from = parseInt(href.query.from);
    }

    href = href || window.location.href;
    var commonProductObj = {
      "list": listName || href && hrefToListName(href)
    };

    if (context && context.filters && state.dimensionNameMap.currentFilters) {
      commonProductObj["dimension" + state.dimensionNameMap.currentFilters] = getStringifiedCurrentFilters(context.filters);
    }

    var resultsImpressioned = itemList.filter(function (item) {
      // Ensure we have permissions, can get product SKU, etc.
      var display_title = item.display_title,
          id = item['@id'],
          _item$error = item.error,
          error = _item$error === void 0 ? null : _item$error,
          itemType = item['@type'];

      if (!id || !display_title || !Array.isArray(itemType)) {
        if (error) {
          // Likely no view permissions, ok.
          return false;
        }

        var errMsg = "Analytics Product Tracking: Could not access necessary product/item fields";
        exception(errMsg);
        console.error(errMsg, item);
        return false;
      }

      return true;
    }).map(function (item, i) {
      var pObj = _.extend(itemToProductTransform(item), commonProductObj, {
        'position': from + i + 1
      });

      ga2('ec:addImpression', pObj);
      return pObj;
    });
    console.info("Impressioned ".concat(resultsImpressioned.length, " items starting at position ").concat(from + 1, " in list \"").concat(commonProductObj.list, "\""));
    return resultsImpressioned;
  } else {
    return false;
  }
}