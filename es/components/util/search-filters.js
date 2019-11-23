'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnselectHrefIfSelectedFromResponseFilters = getUnselectHrefIfSelectedFromResponseFilters;
exports.getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters;
exports.buildSearchHref = buildSearchHref;
exports.changeFilter = changeFilter;
exports.saveChangedFilters = saveChangedFilters;
exports.getDateHistogramIntervalFromFacet = getDateHistogramIntervalFromFacet;
exports.determineIfTermFacetSelected = determineIfTermFacetSelected;
exports.getTermFacetStatus = getTermFacetStatus;
exports.isTermSelectedAccordingToExpSetFilters = isTermSelectedAccordingToExpSetFilters;
exports.unsetAllTermsForField = unsetAllTermsForField;
exports.filtersToHref = filtersToHref;
exports.contextFiltersToExpSetFilters = contextFiltersToExpSetFilters;
exports.expSetFiltersToURLQuery = expSetFiltersToURLQuery;
exports.expSetFiltersToJSON = expSetFiltersToJSON;
exports.compareExpSetFilters = compareExpSetFilters;
exports.filtersToNodes = filtersToNodes;
exports.convertExpSetFiltersTerms = convertExpSetFiltersTerms;
exports.searchQueryStringFromHref = searchQueryStringFromHref;
exports.filterObjExistsAndNoFiltersSelected = filterObjExistsAndNoFiltersSelected;
exports.getSearchItemType = getSearchItemType;
exports.NON_FILTER_URL_PARAMS = void 0;

var _underscore = _interopRequireDefault(require("underscore"));

var _url = _interopRequireDefault(require("url"));

var _queryString = _interopRequireDefault(require("query-string"));

var _moment = _interopRequireDefault(require("moment"));

var _navigate = require("./navigate");

var _misc = require("./misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Alerts = null; //require('./../alerts');

/**
 * @deprecated
 * If the given term is selected, return the href for the term from context.filters.
 *
 * @param {string} term - Term for which existence of active filter is checked.
 * @param {string} field - Field for which filter is checked.
 * @param {{ 'field' : string, 'term' : string, 'remove' : string }[]} filters - Filters as supplied by context.filters in API response.
 * @param {boolean} [includePathName] - If true, will return the pathname in addition to the URI search query.
 * @returns {!string} URL to remove active filter, or null if filter not currently active for provided field:term pair.
 */
function getUnselectHrefIfSelectedFromResponseFilters(term, facet, filters) {
  var includePathName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var field = facet.field,
      isRange = facet.aggregation_type && ['range', 'date_histogram', 'histogram'].indexOf(facet.aggregation_type) > -1,
      i,
      filter,
      parts,
      retHref = ''; // THE CONTENTS UNDER THIS IF CONDITION WILL CHANGE ONCE WE CREATE NEW 'RANGE' FACET COMPONENT

  if (facet.aggregation_type && ['range', 'date_histogram', 'histogram'].indexOf(facet.aggregation_type) > -1) {
    var toFilter, fromFilter;

    if (facet.aggregation_type === 'range') {
      toFilter = _underscore["default"].findWhere(filters, {
        'field': field + '.to',
        'term': term.to
      }), fromFilter = _underscore["default"].findWhere(filters, {
        'field': field + '.from',
        'term': term.from
      });
    } else if (facet.aggregation_type === 'date_histogram') {
      var interval = getDateHistogramIntervalFromFacet(facet) || 'month',
          toDate = _moment["default"].utc(term.key);

      toDate.add(1, interval + 's');
      toFilter = _underscore["default"].findWhere(filters, {
        'field': field + '.to',
        'term': toDate.format().slice(0, 10)
      }), fromFilter = _underscore["default"].findWhere(filters, {
        'field': field + '.from',
        'term': term.key
      });
    } else {
      throw new Error('Histogram not currently supported.'); // Todo: var interval = ....
    }

    if (toFilter && !fromFilter) {
      parts = _url["default"].parse(toFilter['remove']);

      if (includePathName) {
        retHref += parts.pathname;
      }

      retHref += parts.search;
      return retHref;
    } else if (!toFilter && fromFilter) {
      parts = _url["default"].parse(fromFilter['remove']);

      if (includePathName) {
        retHref += parts.pathname;
      }

      retHref += parts.search;
      return retHref;
    } else if (toFilter && fromFilter) {
      var partsFrom = _url["default"].parse(fromFilter['remove'], true),
          partsTo = _url["default"].parse(toFilter['remove'], true),
          partsFromQ = partsFrom.query,
          partsToQ = partsTo.query,
          commonQs = {};

      _underscore["default"].forEach(_underscore["default"].keys(partsFromQ), function (qk) {
        if (typeof partsToQ[qk] !== 'undefined') {
          if (Array.isArray(partsToQ[qk]) || Array.isArray(partsFromQ[qk])) {
            var a1, a2;

            if (Array.isArray(partsToQ[qk])) {
              a1 = partsToQ[qk];
            } else {
              a1 = [partsToQ[qk]];
            }

            if (Array.isArray(partsFromQ[qk])) {
              a2 = partsFromQ[qk];
            } else {
              a2 = [partsFromQ[qk]];
            }

            commonQs[qk] = _underscore["default"].intersection(a1, a2);
          } else {
            commonQs[qk] = partsToQ[qk];
          }
        }
      });

      retHref = '?' + _queryString["default"].stringify(commonQs);

      if (includePathName) {
        retHref += partsFrom.pathname;
      }

      return retHref;
    }
  } else {
    // Terms
    for (i = 0; i < filters.length; i++) {
      filter = filters[i];

      if (filter.field == field && filter.term == term.key) {
        parts = _url["default"].parse(filter.remove);

        if (includePathName) {
          retHref += parts.pathname;
        }

        retHref += parts.search;
        return retHref;
      }
    }
  }

  return null;
}
/**
 * If the given term is selected or omitted, return the status and href for the term from context.filters.
 *
 * @param {string} term - Term for which existence of active filter is checked.
 * @param {string} field - Field for which filter is checked.
 * @param {{ 'field' : string, 'term' : string, 'remove' : string }[]} filters - Filters as supplied by context.filters in API response.
 * @param {boolean} [includePathName] - If true, will return the pathname in addition to the URI search query.
 * @returns {{ 'status' : string, 'href' : string }} status: one of [selected/omitted/none], href: URL to remove active filter, or null if filter not currently active for provided field:term pair.
 */


function getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, filters) {
  var includePathName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  //workaround: '!=' condition adds '!' to the end of facet.field in StaticSingleTerm, we remove it
  var field = facet.field.endsWith('!') ? facet.field.slice(0, -1) : facet.field;
  var i,
      filter,
      parts,
      retHref = '',
      found = false,
      status = "selected";

  if (facet.aggregation_type === "stats") {
    for (i = 0; i < filters.length; i++) {
      filter = filters[i];
      var filterTermValue = parseFloat(filter.term);
      if (isNaN(filterTermValue)) continue;

      if (filter.field === field && filterTermValue === term.key) {
        found = true;
        break;
      }
    }

    if (found) {
      parts = _url["default"].parse(filter.remove);

      if (includePathName) {
        retHref += parts.pathname;
      }

      retHref += parts.search;
      return {
        status: status,
        'href': retHref
      };
    }
  } else {
    // Terms
    for (i = 0; i < filters.length; i++) {
      filter = filters[i];

      if (filter.field === field && filter.term === term.key) {
        found = true;
        break;
      } else if (filter.field.endsWith('!') && filter.field.slice(0, -1) === field && filter.term === term.key) {
        found = true;
        status = "omitted";
        break;
      }
    }

    if (found) {
      parts = _url["default"].parse(filter.remove);

      if (includePathName) {
        retHref += parts.pathname;
      }

      retHref += parts.search;
      return {
        status: status,
        'href': retHref
      };
    }
  }

  return {
    'status': 'none',
    'href': null
  };
}
/**
 * Extends `searchBase` (URL) query with that of field:term and returns new URL with field:term filter query included.
 *
 * @param {string} field - What field to build for.
 * @param {string} term - What term to build for.
 * @param {string} searchBase - Original href or search base of current page.
 * @returns {string} href - Search URL.
 */


function buildSearchHref(field, term, searchBase) {
  var parts = _url["default"].parse(searchBase, true);

  var query = _underscore["default"].clone(parts.query); // format multiple filters on the same field


  if (field in query) {
    if (Array.isArray(query[field])) {
      query[field] = query[field].concat(term);
    } else {
      query[field] = [query[field]].concat(term);
    }
  } else {
    query[field] = term;
  }

  var queryStr = _queryString["default"].stringify(query);

  parts.search = queryStr && queryStr.length > 0 ? '?' + queryStr : '';
  return _url["default"].format(parts);
}
/**
 * Given a field/term, add or remove filter from expSetFilters (in redux store) within context of current state of filters.
 *
 * @param {string} field                        Field, in object dot notation.
 * @param {string} term                         Term to add/remove from active filters.
 * @param {?Object} [filters=null]              The filters object that term is being added or removed from; if not provided it grabs state from redux store.
 * @param {?function} [callback=null]           Callback function to call after updating redux store.
 * @param {boolean} [returnInsteadOfSave=false] Whether to return a new updated expSetFilters object representing would-be changed state INSTEAD of updating redux store. Useful for doing a batched update.
 * @param {?string} [href=null]                 Current or base href to use for AJAX request if using AJAX to update.
 * @returns {?Object} Next filters object representation, or void if returnInsteadOfSave is false.
 */


function changeFilter(field, term, filters) {
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var returnInsteadOfSave = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var href = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var excludedQs = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  if (typeof excludedQs[field] === 'undefined') {
    // store currently selected filters as a dict of sets
    var tempObj = {};
    var newObj = {};
    var expSet = filters[field] ? new Set(filters[field]) : new Set();

    if (expSet.has(term)) {
      // term is already present, so delete it
      expSet["delete"](term);
    } else {
      expSet.add(term);
    }

    if (expSet.size > 0) {
      tempObj[field] = expSet;
      newObj = _underscore["default"].extend({}, filters, tempObj);
    } else {
      //remove key if set is empty
      newObj = _underscore["default"].extend({}, filters);
      delete newObj[field];
    }

    if (returnInsteadOfSave) {
      return newObj;
    } else {
      console.info("Saving new filters:", newObj);
      return saveChangedFilters(newObj, href, callback, excludedQs);
    }
  } else {
    return filters;
  }
}
/**
 * Update expSetFilters by generating new href from supplied expSetFilters and fetching/navigating to copy of current href/URL with updated query.
 * Before calling, make sure expSetFilters is a new or cloned object (not props.expSetFilters) for Redux to recognize that it has changed.
 *
 * @param {Object} newExpSetFilters    A new or cloned expSetFilters object to save. Can be empty (to clear all filters).
 * @param {?string} [href=null]        Base URL to use for AJAX request, with protocol (i.e. http(s)), hostname (i.e. domain name), and path, at minimum. Required if using AJAX.
 * @param {?function} [callback=null]  Callback function.
 * @returns {void}
 */


function saveChangedFilters(newExpSetFilters) {
  var href = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var requiredQs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (!Alerts) Alerts = require('../ui/Alerts').Alerts;

  if (!href) {
    if ((0, _misc.isServerSide)()) {
      throw new Error("No href provided and cannot get from window as none available server-side.");
    } else {
      console.warn("No HREF (3rd param) supplied, using window.location.href. This might be wrong depending on where we should be browsing.");
      href = window.location.href;
    }
  }

  if (typeof href !== 'string') throw new Error("No valid href (3rd arg) supplied to saveChangedFilters: " + href);
  var origHref = href;
  var newHref = filtersToHref(newExpSetFilters, href, null, false, null, requiredQs);
  (0, _navigate.navigate)(newHref, {
    replace: true,
    skipConfirmCheck: true
  }, function (result) {
    if (result && result.total === 0) {
      // Present an alert box informing user that their new selection is now being UNSELECTED because it returned no results.
      Alerts.queue(Alerts.NoFilterResults); // No results, unset new filters.

      (0, _navigate.navigate)(origHref);
    } else {
      // Success. Remove any no result alerts.
      Alerts.deQueue(Alerts.NoFilterResults);
    }

    if (typeof callback === 'function') setTimeout(callback, 0);
  }, function (err) {
    // Fallback callback
    if (err && (err.status === 404 || err.total === 0)) Alerts.queue(Alerts.NoFilterResults);
    if (typeof callback === 'function') setTimeout(callback, 0);
  });
}

function getDateHistogramIntervalFromFacet(facet) {
  return facet && facet.aggregation_definition && facet.aggregation_definition.date_histogram && facet.aggregation_definition.date_histogram.interval;
}
/**
 * @deprecated
 * Determine if term and facet objects are 'selected'.
 * The range check is likely to change or be completely removed
 * in response to needing different component to facet ranges.
 *
 * @param {{ key: string }} term - Object for term option
 * @param {{ field: string }} facet - Object for facet, containing field
 * @param {Object} props - Props from FacetList. Should have context.filters.
 * @returns {boolean}
 */


function determineIfTermFacetSelected(term, facet, props) {
  return !!getUnselectHrefIfSelectedFromResponseFilters(term, facet, props.context.filters); // The below might be re-introduced ... but more likely to be removed since we'll have different 'range' Facet component.

  /*
  var field = facet.field || null,
      fromFilter, fromFilterTerm, toFilter, toFilterTerm;
   if (facet.aggregation_type === 'date_histogram'){
      // Instead of checking presense of filters here, we find earliest from and latest to and see if are within range.
       fromFilter = _.sortBy(_.filter(props.context.filters, { 'field' : field + '.from' }), 'term');
      fromFilterTerm = fromFilter.length && fromFilter[0].term;
       toFilter = _.sortBy(_.filter(props.context.filters, { 'field' : field + '.to' }), 'term').reverse();
      toFilterTerm = toFilter.length && toFilter[0].term;
       var toDate = fromFilter && moment.utc(term.key);
      toDate && toDate.add(1, 'months');
      var toDateTerm = toDate.format().slice(0,10);
       if (fromFilterTerm && term.key >= fromFilterTerm && !toFilterTerm) return true;
      if (!fromFilterTerm && toFilterTerm && toDateTerm <= toFilterTerm) return true;
      if (fromFilterTerm && toFilterTerm && toDateTerm <= toFilterTerm && term.key >= fromFilterTerm) return true;
      return false;
       // Check both from and to
      //field       = facet.field || null;
      //fromFilter  = _.findWhere(props.context.filters, { 'field' : field + '.from', 'term' : term.key });
      //toDate      = fromFilter && moment.utc(term.key);
       //toDate && toDate.add(1, 'months');
      //toFilter = toDate && _.findWhere(props.context.filters, { 'field' : field + '.to', 'term' : toDate.format().slice(0,10) });
       //return !!(toFilter);
   } else if (facet.aggregation_type === 'range'){
      fromFilter  = _.sortBy(_.filter(props.context.filters, { 'field' : field + '.from' }), 'term');
      fromFilterTerm = fromFilter.length && fromFilter[0].term;
      toFilter    = _.sortBy(_.filter(props.context.filters, { 'field' : field + '.to' }), 'term').reverse();
      toFilterTerm = toFilter.length && toFilter[0].term;
       if (fromFilterTerm && term.from + '' >= fromFilterTerm && !toFilterTerm) return true;
      if (!fromFilterTerm && toFilterTerm && term.to + '' <= toFilterTerm) return true;
      if (fromFilterTerm && toFilterTerm && term.to + '' <= toFilterTerm && term.from + '' >= fromFilterTerm) return true;
      return false;
       //fromFilter  = _.findWhere(props.context.filters, { 'field' : field + '.from', 'term' : term.from + '' });
      //toFilter    = fromFilter && _.findWhere(props.context.filters, { 'field' : field + '.to', 'term' : term.to + '' });
      //return !!(toFilter);
  } else {
      return !!(getUnselectHrefIfSelectedFromResponseFilters(term, facet, props.context.filters));
  }
  */
}
/**
 * Get status to determine if term and facet objects are 'selected' or 'omitted' or untouched ('none').
 * The range check is likely to change or be completely removed
 * in response to needing different component to facet ranges.
 *
 * @param {{ key: string }} term - Object for term option
 * @param {{ field: string }} facet - Object for facet, containing field
 * @param {Object} props - Props from FacetList. Should have context.filters.
 * @returns {string} - returns one of 'selected', 'omitted' or 'none' values
 */


function getTermFacetStatus(term, facet, props) {
  var statusAndHref = getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters(term, facet, props.context.filters);
  return statusAndHref.status;
}
/** @deprecated */


function isTermSelectedAccordingToExpSetFilters(term, field) {
  var expSetFilters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (!expSetFilters) expSetFilters = currentExpSetFilters(); // If no expSetFilters are supplied, get them from Redux store.

  if (typeof expSetFilters[field] !== 'undefined' && typeof expSetFilters[field].has === 'function' && expSetFilters[field].has(term)) return true;
  return false;
}

function unsetAllTermsForField(field, expSetFilters) {
  var save = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var href = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var esf = _underscore["default"].clone(expSetFilters);

  delete esf[field];
  if (save && href) return saveChangedFilters(esf, href);else return esf;
}
/**
 * Convert expSetFilters to a URL, given a current URL whose path is used to append arguments
 * to (e.g. http://hostname.com/browse/  or http://hostname.com/search/).
 *
 * @param {Object} expSetFilters        Filters as stored in Redux, keyed by facet field containing Set of term keys.
 * @param {string} currentHref          String with at least current host & path which to use as base for resulting URL, e.g. http://localhost:8000/browse/[?type=ExperimentSetReplicate&experimentset_type=...].
 * @param {?string} [sortColumn=null]   Column being sorted on.
 * @param {boolean} [sortReverse=false] If sort is reverse, e.g. incremental instead of decremental.
 * @param {string} [hrefPath]           Override the /path/ in URL returned, e.g. to /browse/.
 * @returns {string} URL which can be used to request filtered results from back-end, e.g. http://localhost:8000/browse/?type=ExperimentSetReplicate&experimentset_type=replicate&from=0&limit=50&field.name=term1&field2.something=term2[...]
 */


function filtersToHref(expSetFilters, currentHref) {
  var sortColumn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var sortReverse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var hrefPath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var requiredQs = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var baseHref = getBaseHref(currentHref, hrefPath, requiredQs); // Include a '?' or '&' if needed.

  var sep = _navigate.navigate.determineSeparatorChar(baseHref),
      filterQuery = expSetFiltersToURLQuery(expSetFilters),
      urlString = baseHref + (filterQuery.length > 0 ? sep + filterQuery : '');

  if (!sortColumn) {
    var parts = _url["default"].parse(currentHref, true);

    if (parts.query && typeof parts.query.sort === 'string') {
      if (parts.query.sort.charAt(0) === '-') {
        sortReverse = true;
        sortColumn = parts.query.sort.slice(1);
      } else {
        sortColumn = parts.query.sort;
      }
    }
  }

  if (typeof sortColumn === 'string') {
    if (sortReverse) {
      urlString += '&sort=-' + sortColumn;
    } else {
      urlString += '&sort=' + sortColumn;
    }
  }

  return urlString;
}
/**
 * Hardcoded URL query params which are _definitely_ not filters.
 * Taken from search.py
 */


var NON_FILTER_URL_PARAMS = ['limit', 'y.limit', 'x.limit', 'mode', 'format', 'frame', 'datastore', 'field', 'region', 'genome', 'sort', 'from', 'referrer', 'q', 'before', 'after'];
/**
 * Convert back-end-supplied 'context.filters' array of filter objects into commonly-used 'expSetFilters' structure.
 * Replaces now-removed 'hrefToFilters' function and copy of expSetFilters passed down from Redux store.
 *
 * @param {{ term : string, field : string, remove : string }[]} contextFilters     Array of filters supplied from back-end search.py.
 * @param {string} [browseBaseState] - Supply 'only_4dn' or 'all' to control which URI query params are filtered out. If 'search' is supplied, none are excluded.
 * @returns {Object} Object with fields (string, dot-separated-nested) as keys and Sets of terms (string) as values for those keys.
 */

exports.NON_FILTER_URL_PARAMS = NON_FILTER_URL_PARAMS;

function contextFiltersToExpSetFilters(contextFilters) {
  var excludedQs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!Array.isArray(contextFilters)) {
    console.warn('No context filters available or supplied. Fine if this message appears outside of a /search/ or /browse/ page.');
    return {};
  }

  if (contextFilters.length === 0) return {};
  return _underscore["default"].reduce(contextFilters, function (memo, filterObj) {
    if (excludedQs && typeof excludedQs[filterObj.field] !== 'undefined') {
      if (excludedQs[filterObj.field] === true) return memo;

      if (typeof excludedQs[filterObj.field] === 'string' && excludedQs[filterObj.field] === filterObj.term) {
        return memo;
      }

      if (Array.isArray(excludedQs[filterObj.field]) && excludedQs[filterObj.field].indexOf(filterObj.term) > -1) {
        return memo;
      }

      return memo;
    }

    if (typeof memo[filterObj.field] === 'undefined') {
      memo[filterObj.field] = new Set([filterObj.term]);
    } else {
      memo[filterObj.field].add(filterObj.term);
    }

    return memo;
  }, {});
}
/** Convert expSetFilters, e.g. as stored in Redux, into a partial URL query: field.name=term1&field2.something=term2[&field3...] */


function expSetFiltersToURLQuery(expSetFilters) {
  return _underscore["default"].map(_underscore["default"].pairs(expSetFiltersToJSON(expSetFilters)), function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        field = _ref2[0],
        terms = _ref2[1];

    return _underscore["default"].map(terms, function (t) {
      // `t` term already ran thru encodeURIComponent in `expSetFiltersToJSON`
      return encodeURIComponent(field) + '=' + t.replace(/%20/g, "+");
    }).join('&');
  }).join('&');
}
/** Normally we have Set objects for Field terms which we convert to arrays */


function expSetFiltersToJSON(expSetFilters) {
  return _underscore["default"].object(_underscore["default"].map(_underscore["default"].pairs(expSetFilters), function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        field = _ref4[0],
        setOfTerms = _ref4[1];

    // Encode to be URI safe -
    var termsArray = _underscore["default"].map(_toConsumableArray(setOfTerms), function (term) {
      return encodeURIComponent(term);
    });

    return [field, termsArray];
  }));
}
/**
 * Compare two versions of 'expSetFilters' structure to check if they are equal.
 * Used by ChartDataController.
 *
 * @param {Object} expSetFiltersA - 1st set of filters, object with facet/field as keys and Sets of terms as values.
 * @param {Object} expSetFiltersB - 2nd set of filters, same as param expSetFiltersA.
 * @returns {boolean} true if equal.
 */


function compareExpSetFilters(expSetFiltersA, expSetFiltersB) {
  if (expSetFiltersA && !expSetFiltersB || !expSetFiltersA && expSetFiltersB) return false;

  var keysA = _underscore["default"].keys(expSetFiltersA);

  if (keysA.length !== _underscore["default"].keys(expSetFiltersB).length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (typeof expSetFiltersB[keysA[i]] === 'undefined') return false;

    if (expSetFiltersA[keysA[i]] instanceof Set && expSetFiltersB[keysA[i]] instanceof Set) {
      if (expSetFiltersA[keysA[i]].size !== expSetFiltersB[keysA[i]].size) return false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = expSetFiltersA[keysA[i]][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var termFromSetA = _step.value;
          if (!expSetFiltersB[keysA[i]].has(termFromSetA)) return false;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }

  return true;
}

function filtersToNodes() {
  var expSetFilters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var orderedFieldNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var termTranformFxn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var flatten = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  // Convert orderedFieldNames into object/hash for faster lookups.
  var sortObj = null;
  if (Array.isArray(orderedFieldNames)) sortObj = _underscore["default"].invert(_underscore["default"].object(_underscore["default"].pairs(orderedFieldNames)));
  return (0, _underscore["default"])(expSetFilters).chain().pairs() // fieldPair[0] = field, fieldPair[1] = Set of terms
  .sortBy(function (fieldPair) {
    if (sortObj && typeof sortObj[fieldPair[0]] !== 'undefined') return parseInt(sortObj[fieldPair[0]]);else return fieldPair[0];
  }).reduce(function (m, fieldPair) {
    var termNodes = _toConsumableArray(fieldPair[1]).map(function (term) {
      return {
        'data': {
          'term': term,
          'name': termTranformFxn && termTranformFxn(fieldPair[0], term) || term,
          'field': fieldPair[0]
        }
      };
    });

    if (flatten) {
      // [field1:term1, field1:term2, field1:term3, field2:term1]
      termNodes.push('spacer');
      return m.concat(termNodes);
    } else {
      // [[field1:term1, field1:term2, field1:term3],[field2:term1, field2:term2], ...]
      m.push(termNodes);
      return m;
    }
  }, []).value();
}
/**
 * JSON.stringify() cannot store Set objects, which are used in expSetFilters, so we must convert
 * the Sets to/from Arrays upon needing to use JSON.stringify() and after returning from JSON.parse(),
 * such as when saving or grabbing the expSetFilter to/from the <script data-prop-name="expSetFilters"...>...</script>
 * element which is used to pass the filters from server-side render to client-side React initiatilization.
 *
 * @param {Object} expSetFilters  Object keyed by field name/key containing term key strings in form of Set or Array, which need to be converted to Set or Array.
 * @param {string} [to='array']   One of 'array' or 'set' for what to convert expSetFilter's terms to.
 */


function convertExpSetFiltersTerms(expSetFilters) {
  var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'array';
  return (0, _underscore["default"])(expSetFilters).chain().pairs().map(function (pair) {
    if (to === 'array') {
      return [pair[0], _toConsumableArray(pair[1])];
    } else if (to === 'set') {
      return [pair[0], new Set(pair[1])];
    }

    throw new Error("Not one of set or array");
  }).object().value();
}
/** Return URL without any queries or hash, ending at pathname. Add hardcoded stuff for /browse/ or /search/ endpoints. */


function getBaseHref() {
  var currentHref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/browse/';
  var hrefPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var requiredQs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var urlParts = _url["default"].parse(currentHref, true);

  if (!hrefPath) {
    hrefPath = urlParts.pathname;
  }

  var baseHref = urlParts.protocol && urlParts.host ? urlParts.protocol + '//' + urlParts.host + hrefPath : hrefPath;

  var hrefQuery = _underscore["default"].pick(urlParts.query, 'type', 'q');

  if (hrefPath.indexOf('/browse/') > -1) {
    _underscore["default"].extend(hrefQuery, requiredQs);
  }

  if (hrefPath.indexOf('/search/') > -1) {
    if (typeof hrefQuery.type !== 'string') {
      hrefQuery.type = 'Item';
    }
  }

  return baseHref + (_underscore["default"].keys(hrefQuery).length > 0 ? '?' + _queryString["default"].stringify(hrefQuery) : '');
}

function searchQueryStringFromHref(href) {
  if (!href) return null;
  if (typeof href !== 'string') return null;
  var searchQueryString = null; // eslint-disable-next-line no-useless-escape

  var searchQueryMatch = href.match(/(\?|&)(q)(=)[\w\s\+\-\%\.\*\!\(\)]+/);

  if (searchQueryMatch) {
    searchQueryString = searchQueryMatch[0].replace(searchQueryMatch.slice(1).join(''), '').replace(/\+/g, ' ');

    if (decodeURIComponent) {
      searchQueryString = decodeURIComponent(searchQueryString);
    }
  }

  return searchQueryString;
}
/** Check whether expSetFiles exists and is empty. */


function filterObjExistsAndNoFiltersSelected(expSetFilters) {
  return _typeof(expSetFilters) === 'object' && expSetFilters !== null && _underscore["default"].keys(expSetFilters).length === 0;
}

function getSearchItemType(context) {
  var _context$filters = context.filters,
      filters = _context$filters === void 0 ? [] : _context$filters;

  for (var i = 0; i < filters.length; i++) {
    var _filters$i = filters[i],
        field = _filters$i.field,
        term = _filters$i.term;

    if (field === "type") {
      if (term !== "Item") {
        return term;
      }
    }
  }

  return null;
}