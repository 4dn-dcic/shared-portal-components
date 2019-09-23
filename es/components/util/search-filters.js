'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUnselectHrefIfSelectedFromResponseFilters = getUnselectHrefIfSelectedFromResponseFilters;
exports.buildSearchHref = buildSearchHref;
exports.changeFilter = changeFilter;
exports.saveChangedFilters = saveChangedFilters;
exports.getDateHistogramIntervalFromFacet = getDateHistogramIntervalFromFacet;
exports.determineIfTermFacetSelected = determineIfTermFacetSelected;
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

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Alerts = null;

function getUnselectHrefIfSelectedFromResponseFilters(term, facet, filters) {
  var includePathName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var field = facet.field,
      isRange = facet.aggregation_type && ['range', 'date_histogram', 'histogram'].indexOf(facet.aggregation_type) > -1,
      i,
      filter,
      parts,
      retHref = '';

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
      throw new Error('Histogram not currently supported.');
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

function buildSearchHref(field, term, searchBase) {
  var parts = _url["default"].parse(searchBase, true);

  var query = _underscore["default"].clone(parts.query);

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

function changeFilter(field, term, filters) {
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var returnInsteadOfSave = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var href = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var excludedQs = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  if (typeof excludedQs[field] === 'undefined') {
    var tempObj = {};
    var newObj = {};
    var expSet = filters[field] ? new Set(filters[field]) : new Set();

    if (expSet.has(term)) {
      expSet["delete"](term);
    } else {
      expSet.add(term);
    }

    if (expSet.size > 0) {
      tempObj[field] = expSet;
      newObj = _underscore["default"].extend({}, filters, tempObj);
    } else {
      newObj = _underscore["default"].extend({}, filters);
      delete newObj[field];
    }

    if (returnInsteadOfSave) {
      return newObj;
    } else {
      console.info("Saving new filters:", newObj);
      return saveChangedFilters(newObj, href, callback);
    }
  } else {
    return filters;
  }
}

function saveChangedFilters(newExpSetFilters) {
  var href = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
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
  var newHref = filtersToHref(newExpSetFilters, href);
  (0, _navigate.navigate)(newHref, {
    replace: true,
    skipConfirmCheck: true
  }, function (result) {
    if (result && result.total === 0) {
      Alerts.queue(Alerts.NoFilterResults);
      (0, _navigate.navigate)(origHref);
    } else {
      Alerts.deQueue(Alerts.NoFilterResults);
    }

    if (typeof callback === 'function') setTimeout(callback, 0);
  }, function (err) {
    if (err && (err.status === 404 || err.total === 0)) Alerts.queue(Alerts.NoFilterResults);
    if (typeof callback === 'function') setTimeout(callback, 0);
  });
}

function getDateHistogramIntervalFromFacet(facet) {
  return facet && facet.aggregation_definition && facet.aggregation_definition.date_histogram && facet.aggregation_definition.date_histogram.interval;
}

function determineIfTermFacetSelected(term, facet, props) {
  return !!getUnselectHrefIfSelectedFromResponseFilters(term, facet, props.context.filters);
}

function isTermSelectedAccordingToExpSetFilters(term, field) {
  var expSetFilters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (!expSetFilters) expSetFilters = currentExpSetFilters();
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

function filtersToHref(expSetFilters, currentHref) {
  var sortColumn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var sortReverse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var hrefPath = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var baseHref = getBaseHref(currentHref, hrefPath);

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

var NON_FILTER_URL_PARAMS = ['limit', 'y.limit', 'x.limit', 'mode', 'format', 'frame', 'datastore', 'field', 'region', 'genome', 'sort', 'from', 'referrer', 'q', 'before', 'after'];
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

function expSetFiltersToURLQuery(expSetFilters) {
  return _underscore["default"].map(_underscore["default"].pairs(expSetFiltersToJSON(expSetFilters)), function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        field = _ref2[0],
        terms = _ref2[1];

    return _underscore["default"].map(terms, function (t) {
      return encodeURIComponent(field) + '=' + t.replace(/%20/g, "+");
    }).join('&');
  }).join('&');
}

function expSetFiltersToJSON(expSetFilters) {
  return _underscore["default"].object(_underscore["default"].map(_underscore["default"].pairs(expSetFilters), function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        field = _ref4[0],
        setOfTerms = _ref4[1];

    var termsArray = _underscore["default"].map(_toConsumableArray(setOfTerms), function (term) {
      return encodeURIComponent(term);
    });

    return [field, termsArray];
  }));
}

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
  var sortObj = null;
  if (Array.isArray(orderedFieldNames)) sortObj = _underscore["default"].invert(_underscore["default"].object(_underscore["default"].pairs(orderedFieldNames)));
  return (0, _underscore["default"])(expSetFilters).chain().pairs().sortBy(function (fieldPair) {
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
      termNodes.push('spacer');
      return m.concat(termNodes);
    } else {
      m.push(termNodes);
      return m;
    }
  }, []).value();
}

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

function getBaseHref() {
  var currentHref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/browse/';
  var hrefPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var urlParts = _url["default"].parse(currentHref, true);

  if (!hrefPath) {
    hrefPath = urlParts.pathname;
  }

  var baseHref = urlParts.protocol && urlParts.host ? urlParts.protocol + '//' + urlParts.host + hrefPath : hrefPath;

  var hrefQuery = _underscore["default"].pick(urlParts.query, 'type', 'q');

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
  var searchQueryString = null;
  var searchQueryMatch = href.match(/(\?|&)(q)(=)[\w\s\+\-\%\.\*\!\(\)]+/);

  if (searchQueryMatch) {
    searchQueryString = searchQueryMatch[0].replace(searchQueryMatch.slice(1).join(''), '').replace(/\+/g, ' ');

    if (decodeURIComponent) {
      searchQueryString = decodeURIComponent(searchQueryString);
    }
  }

  return searchQueryString;
}

function filterObjExistsAndNoFiltersSelected(expSetFilters) {
  return _typeof(expSetFilters) === 'object' && expSetFilters !== null && _underscore["default"].keys(expSetFilters).length === 0;
}