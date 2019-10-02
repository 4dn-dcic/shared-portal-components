'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeGoogleAnalytics = initializeGoogleAnalytics;
exports.registerPageView = registerPageView;
exports.event = event;
exports.productClick = productClick;
exports.exception = exception;
exports.eventLabelFromChartNode = eventLabelFromChartNode;
exports.eventLabelFromChartNodes = eventLabelFromChartNodes;
exports.getStringifiedCurrentFilters = getStringifiedCurrentFilters;
exports.getGoogleAnalyticsTrackingData = getGoogleAnalyticsTrackingData;
exports.hrefToListName = hrefToListName;

var _underscore = _interopRequireDefault(require("underscore"));

var _url = _interopRequireDefault(require("url"));

var _queryString = _interopRequireDefault(require("query-string"));

var _misc = require("./misc");

var _patchedConsole = require("./patched-console");

var _searchFilters = require("./search-filters");

var object = _interopRequireWildcard(require("./object"));

var JWT = _interopRequireWildcard(require("./json-web-token"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var defaultOptions = {
  'isAnalyticsScriptOnPage': true,
  'enhancedEcommercePlugin': true,
  'itemToProductTransform': function itemToProductTransform(item) {
    // 4DN-specific, override from own data model.
    return {
      'id': item.accession || object.atIdFromObject(item) || item.uuid,
      'name': item.display_title || item.title || null,
      'category': item['@type'].slice().reverse().slice(1).join('/'),
      'brand': item.lab && item.lab.display_title || item.submitted_by && item.submitted_by.display_title || item.lab || item.submitted_by || null,
      'price': item && item.file_size || null
    };
  },
  // Google Analytics allows custom dimensions to be sent along w/ events, however they are named incrementally w/o customization.
  // Here we track own keywords/keys and transform to Google-Analytics incremented keys.
  'dimensionMap': {
    'currentFilters': 'dimension1',
    'name': 'dimension2',
    'field': 'dimension3',
    'term': 'dimension4'
  }
};
var state = null;
/** Calls `ga`, ensuring it is present on window. */

function ga2() {
  try {
    return window.ga.apply(window.ga, Array.from(arguments));
  } catch (e) {
    _patchedConsole.patchedConsoleInstance.error('Could not track event. Fine if this is a test.', e, Array.from(arguments));
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


function initializeGoogleAnalytics() {
  var trackingID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (trackingID === null || typeof trackingID !== 'string') {
    throw new Error("No tracking ID provided");
  }

  if ((0, _misc.isServerSide)()) return false;
  options = _underscore["default"].extend({}, defaultOptions, options);

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

  if (typeof window.ga === 'undefined') {
    _patchedConsole.patchedConsoleInstance.error("Google Analytics is not initialized. Fine if this appears in a test.");

    return false;
  }

  state = _underscore["default"].clone(options);
  ga2('create', trackingID, 'auto');

  _patchedConsole.patchedConsoleInstance.info("Initialized google analytics.");

  if (options.enhancedEcommercePlugin) {
    ga2('require', 'ec');

    _patchedConsole.patchedConsoleInstance.info("Initialized google analytics : Enhanced ECommerce Plugin");
  }

  registerPageView(null, context);
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

function registerPageView() {
  var href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!shouldTrack()) return false; // Set href from window if not provided. Safe to use because we're not server-side.

  if (!href) href = window.location && window.location.href; // Take heed of this notice if it is visible somewhere.

  if (!href) {
    _patchedConsole.patchedConsoleInstance.error("No HREF defined, check.. something. Will still send pageview event.");
  } // Options to send with GA pageview event.


  var parts = _url["default"].parse(href, true);

  var pageViewObject = {
    'hitType': 'pageview'
  };

  // Store orig href in case we need it later

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
    var newPathName = null;

    if (pathParts[1] && typeof pathParts[1] === 'string') {
      // Remove Accession, UUID, and Name from URL and save it to 'name' dimension instead.
      if (typeof context.accession === 'string' && pathParts[1] === context.accession || object.isAccessionRegex(pathParts[1])) {
        // We gots an accessionable Item. Lets remove its Accession from the path to get nicer Behavior Flows in GA.
        // And let product tracking / Shopping Behavior handle Item details.
        pathParts[1] = 'accession';
        newPathName = '/' + pathParts.join('/') + '/';
        pageViewObject[state.dimensionMap.name] = context.accession || pathParts[1];
      } else if (context.last_name && context.first_name || context['@type'] && context['@type'].indexOf('User') > -1 && pathParts[0] === 'users' && context.uuid && pathParts[1] === context.uuid) {
        // Save User name.
        pathParts[1] = 'uuid';
        newPathName = '/' + pathParts.join('/') + '/';
        pageViewObject[state.dimensionMap.name] = context.title || context.uuid;
      } else if (typeof context.uuid === 'string' && pathParts[1] === context.uuid) {
        pathParts[1] = 'uuid';
        newPathName = '/' + pathParts.join('/') + '/';
        pageViewObject[state.dimensionMap.name] = context.display_title || context.uuid;
      } else if (typeof context.name === 'string' && pathParts[1] === context.name) {
        pathParts[1] = 'name';
        newPathName = '/' + pathParts.join('/') + '/';
        pageViewObject[state.dimensionMap.name] = context.display_title || context.name;
      } else {
        newPathName = pathName;
      }
    } else {
      newPathName = pathName;
    } // Add 'q' and 'type' params back to pathname; they'll be parsed and filtered out by Google Analytics to be used for 'search query' and 'search category' analytics.


    if (parts.query && (parts.query.q || parts.query.type)) {
      var qs = _queryString["default"].stringify({
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
      _patchedConsole.patchedConsoleInstance.warn("Enhanced ECommerce is not enabled. Will -not- register product views.");

      return false;
    }

    if (Array.isArray(context['@graph'])) {
      // We have a results page of some kind. Likely, browse, search, or collection.
      // If browse or search page, get current filters and add to pageview event for 'dimension1'.
      var filtersToRegister = context && context.filters && (0, _searchFilters.contextFiltersToExpSetFilters)(context.filters) || null;

      if (filtersToRegister) {
        pageViewObject[state.dimensionMap.currentFilters] = getStringifiedCurrentFilters(filtersToRegister);
      }

      if (context['@graph'].length > 0) {
        // We have some results, lets impression them as product list views.
        return impressionListOfItems(context['@graph'], parts, context);
      }

      return false;
    } else if (typeof context.accession === 'string') {
      // We got an Item view, lets track some details about it.
      var productObj = state && state.itemToProductTransform(context);

      _patchedConsole.patchedConsoleInstance.info("Item with an accession. Will track as product:", productObj);

      if (context && context.filters) {
        pageViewObject[state.dimensionMap.currentFilters] = productObj[state.dimensionMap.currentFilters] = getStringifiedCurrentFilters((0, _searchFilters.contextFiltersToExpSetFilters)(context.filters));
      }

      ga2('ec:addProduct', productObj);
      ga2('ec:setAction', 'detail', productObj);
      return productObj;
    }
  } // Clear query & hostname from HREF & convert accessions, uuids, and certain names to literals.


  href = adjustPageViewPath(parts.pathname); // Ensure is not the same page but with a new hash or something (RARE - should only happen for Help page table of contents navigation).

  if (lastRegisteredPageViewRealPathNameAndSearch === parts.pathname + parts.search) {
    _patchedConsole.patchedConsoleInstance.warn('Page did not change, canceling PageView tracking for this navigation.');

    return false;
  }

  lastRegisteredPageViewRealPathNameAndSearch = parts.pathname + parts.search;
  ga2('set', 'page', href); // Set it as current page

  registerProductView();

  pageViewObject.hitCallback = function () {
    _patchedConsole.patchedConsoleInstance.info('Successfuly sent pageview event.', href, pageViewObject);
  };

  ga2('send', 'pageview', pageViewObject);
  return true;
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


function event(category, action) {
  var fields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!shouldTrack()) return false;

  var eventObj = _underscore["default"].extend({}, fields, {
    'hitType': 'event',
    'eventCategory': category,
    'eventAction': action
  }); // Convert internal dimension names to Google Analytics ones.


  _underscore["default"].forEach(_underscore["default"].pairs(eventObj), function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    if (typeof state.dimensionMap[key] !== 'undefined') {
      eventObj[state.dimensionMap[key]] = value;
      delete eventObj[key];
    }
  }); // Add current expSetFilters if not present in 'fields' already.
  //if (typeof eventObj[state.dimensionMap.currentFilters] === 'undefined'){
  //    eventObj[state.dimensionMap.currentFilters] = getStringifiedCurrentFilters(Filters.currentExpSetFilters());
  //}


  eventObj.hitCallback = function () {
    _patchedConsole.patchedConsoleInstance.info('Successfuly sent UI event.', eventObj);
  };

  setTimeout(function () {
    ga2('send', eventObj);
  }, 0);
}

function productClick(item) {
  var extraData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  if (!shouldTrack()) {
    if (typeof callback === 'function') callback();
    return true;
  }

  var pObj = _underscore["default"].extend(state.itemToProductTransform(item), extraData);

  var href = extraData.href || window.location.href;
  var eventObj = {
    'hitType': 'event',
    'eventCategory': pObj.list || hrefToListName(href) || 'Search Results',
    'eventAction': 'click',
    'eventLabel': pObj.id || pObj.name,
    'hitCallback': function hitCallback() {
      _patchedConsole.patchedConsoleInstance.info('Successfully sent product click event.', eventObj, pObj);

      if (typeof callback === 'function') {
        callback();
      }
    },
    'name': pObj.name || pObj.id
  };
  ga2('ec:addProduct', _underscore["default"].omit(pObj, 'list'));
  ga2('ec:setAction', 'click', _underscore["default"].pick(pObj, 'list')); // Convert internal dimension names to Google Analytics ones.

  _underscore["default"].forEach(_underscore["default"].pairs(eventObj), function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    if (typeof state.dimensionMap[key] !== 'undefined') {
      eventObj[state.dimensionMap[key]] = value;
      delete eventObj[key];
    }
  }); // Add current filters.


  eventObj[state.dimensionMap.currentFilters] = getStringifiedCurrentFilters((0, _searchFilters.contextFiltersToExpSetFilters)(context && context.filters || null));
  ga2('send', eventObj);
  return true;
}
/**
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
 */


function exception(message) {
  var fatal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // Doesn't test whether should track or not -- assume always track errors.
  var excObj = {
    'hitType': 'exception',
    'exDescription': message,
    'exFatal': fatal
  };

  excObj.hitCallback = function () {
    _patchedConsole.patchedConsoleInstance.info('Successfully sent exception', excObj);
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


function eventLabelFromChartNode(node) {
  var includeParentInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (!node || _typeof(node) !== 'object') return null;
  var labelData = [];
  if (node.field) labelData.push('Field: ' + node.field);
  if (node.term) labelData.push('Term: ' + node.term);
  if (includeParentInfo && node.parent && node.parent.field) labelData.push('Parent Field: ' + node.parent.field);
  if (includeParentInfo && node.parent && node.parent.term) labelData.push('Parent Term: ' + node.parent.term);
  return labelData.join(', ');
}

function eventLabelFromChartNodes(nodes) {
  return nodes.map(eventLabelFromChartNode).join('; ');
}
/**
 * Converts expSetFilters object or href with query (as string) to stringified JSON representation.
 *
 * @param {Object} expSetFilters - expSetFilters object.
 * @returns {string} Stringified JSON to be saved to analytics.
 */


function getStringifiedCurrentFilters(expSetFilters) {
  return JSON.stringify(expSetFilters, _underscore["default"].keys(expSetFilters).sort());
}

function getGoogleAnalyticsTrackingData() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var allData = null;

  try {
    allData = window.ga.getAll()[0].b.data.values;
  } catch (e) {
    _patchedConsole.patchedConsoleInstance.error('Could not get data from current GA tracker.');

    return null;
  }

  if (allData !== null && key === null) return allData;

  if (typeof key === 'string' && _typeof(allData) === 'object' && allData) {
    try {
      return allData[':' + key];
    } catch (e) {
      _patchedConsole.patchedConsoleInstance.error(e);

      return null;
    }
  }
}
/** Generates a list name for analytics "list" property based on href */


function hrefToListName(href) {
  var hrefParts = _url["default"].parse(href, false);

  var strippedPathName = hrefParts.pathname;

  if (strippedPathName.charAt(0) === "/") {
    strippedPathName = strippedPathName.slice(1);
  }

  if (strippedPathName.charAt(strippedPathName.length - 1) === "/") {
    strippedPathName = strippedPathName.slice(0, -1);
  }

  if (hrefParts.search && (hrefParts.search.indexOf('currentAction=selection') || hrefParts.search.indexOf('currentAction=multiselect'))) {
    strippedPathName += " - Selection Action";
  }

  return strippedPathName;
}
/*********************
 * Private Functions *
 *********************/


function shouldTrack() {
  // 1. Ensure we're initialized
  if (!state || (0, _misc.isServerSide)() || typeof window.ga === 'undefined') {
    _patchedConsole.patchedConsoleInstance.error("Google Analytics is not initialized. Fine if this appears in a test.");

    return false;
  } // 2. TODO: Make sure not logged in as admin on a production site.


  var userDetails = JWT.getUserDetails();

  if (userDetails && Array.isArray(userDetails.groups) && userDetails.groups.indexOf('admin') > -1) {
    var urlParts = _url["default"].parse(window.location.href);

    if (urlParts.host.indexOf('4dnucleome.org') > -1) {
      _patchedConsole.patchedConsoleInstance.warn("Logged in as admin on 4dnucleome.org - will NOT track.");

      return false;
    }
  }

  return true;
}
/**
 * @private
 * @returns {Object[]} Representation of what was sent.
 */


function impressionListOfItems(itemList, href) {
  var listName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var from = 0;

  if (typeof href === 'string') {
    // Convert to URL parts.
    href = _url["default"].parse(href, true);
    if (!isNaN(parseInt(href.query.from))) from = parseInt(href.query.from);
  }

  var filtersToRegister = context && context.filters && (0, _searchFilters.contextFiltersToExpSetFilters)(context.filters) || null;
  var commonProductObj = {
    "list": listName || hrefToListName(href)
  };

  if (filtersToRegister) {
    commonProductObj[state.dimensionMap.currentFilters] = getStringifiedCurrentFilters(filtersToRegister);
  }

  _patchedConsole.patchedConsoleInstance.info("Will impression " + itemList.length + ' items.');

  return _underscore["default"].map(itemList, function (item, i) {
    var pObj = _underscore["default"].extend(state.itemToProductTransform(item), commonProductObj, {
      'position': from + i + 1
    });

    ga2('ec:addImpression', pObj);
    return pObj;
  });
}