'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToColor = stringToColor;
exports.requestAnimationFrame = requestAnimationFrame;
exports.extendStyleOptions = extendStyleOptions;
exports.transformBarPlotAggregationsToD3CompatibleHierarchy = transformBarPlotAggregationsToD3CompatibleHierarchy;
exports.highlightTerm = highlightTerm;
exports.unhighlightTerms = unhighlightTerms;
exports.style = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

var _misc = require("./../util/misc");

var _patchedConsole = require("./../util/patched-console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function stringToColor(str) {
  var hash = 0,
      color = '#',
      i;

  for (i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (i = 0; i < 3; i++) {
    var value = hash >> i * 8 & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}

function requestAnimationFrame(cb) {
  if (!(0, _misc.isServerSide)() && typeof window !== 'undefined') {
    if (typeof window.requestAnimationFrame !== 'undefined') return window.requestAnimationFrame(cb);
    if (typeof window.webkitRequestAnimationFrame !== 'undefined') return window.webkitRequestAnimationFrame(cb);
    if (typeof window.mozRequestAnimationFrame !== 'undefined') return window.mozRequestAnimationFrame(cb);
  }

  return setTimeout(cb, 0);
}

function extendStyleOptions(styleOptsToExtendFrom, styleOptsToExtend) {
  if (!styleOptsToExtend) throw new Error("No default style options provided.");
  if (!styleOptsToExtendFrom) return styleOptsToExtend;else {
    _underscore["default"].keys(styleOptsToExtend).forEach(function (styleProp) {
      if (typeof styleOptsToExtendFrom[styleProp] === 'undefined') return;

      if (_typeof(styleOptsToExtendFrom[styleProp]) === 'object' && styleOptsToExtendFrom[styleProp]) {
        _underscore["default"].extend(styleOptsToExtend[styleProp], styleOptsToExtendFrom[styleProp]);
      } else {
        styleOptsToExtend[styleProp] = styleOptsToExtendFrom[styleProp];
      }
    });

    return styleOptsToExtend;
  }
}

function transformBarPlotAggregationsToD3CompatibleHierarchy(rootField) {
  var aggregateType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'experiment_sets';

  function genChildren(currField) {
    return _underscore["default"].map(_underscore["default"].pairs(currField.terms), function (term_pair) {
      var termName = term_pair[0];
      var termObj = term_pair[1];
      var isLeafTerm = typeof termObj.experiment_sets === 'number' && typeof termObj.field === 'undefined';

      if (isLeafTerm) {
        return {
          'name': termName,
          'size': termObj[aggregateType]
        };
      } else if (_typeof(termObj.terms) === 'object' && termObj.terms) {
        return {
          'name': termName,
          'children': genChildren(termObj)
        };
      } else {
        return {
          'name': termName,
          'size': termObj.total && typeof termObj.total[aggregateType] === 'number' ? termObj.total[aggregateType] : 1
        };
      }
    });
  }

  return {
    'name': rootField.field,
    'children': genChildren(rootField)
  };
}

var style = {
  translate3d: function translate3d() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var append = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'px';
    if (!append) append = '';
    return 'translate3d(' + x + append + ',' + y + append + ',' + z + append + ')';
  },
  translate: function translate() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var append = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'px';
    if (!append) append = '';
    return 'translate(' + x + append + ',' + y + append + ')';
  },
  rotate3d: function rotate3d(rotation) {
    var axes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['z'];
    if (typeof axes === 'string') axes = axes.split(',').map(function (axis) {
      return axis.trim();
    });
    if (Array.isArray(axes)) axes = _underscore["default"].extend({
      'x': 0,
      'y': 0,
      'z': 0
    }, _underscore["default"].object(axes.map(function (axis) {
      return [axis, 1];
    })));
    return 'rotate3d(' + axes.x + ',' + axes.y + ',' + axes.z + ',' + rotation + 'deg)';
  },
  scale3d: function scale3d() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (!y) y = x;
    if (!z) z = 1;
    return 'scale3d(' + x + ',' + y + ',' + z + ')';
  }
};
exports.style = style;

var highlightTermFxn = _underscore["default"].debounce(function () {
  var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'experiments_in_set.biosample.biosource.individual.organism.name';
  var term = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'human';
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if ((0, _misc.isServerSide)()) return false;
  if (!document.querySelectorAll) return false;

  function setHighlightClass(el) {
    var off = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var isSVG, className;

    if (el.className.baseVal) {
      isSVG = true;
      className = el.className.baseVal;
    } else {
      isSVG = false;
      className = el.className;
    }

    if (el.classList && el.classList.add) {
      if (!off) el.classList.add('highlight');else el.classList.remove('highlight');
      return isSVG;
    }

    if (!off) {
      if (className.indexOf(' highlight') < 0) className = className + ' highlight';
    } else {
      if (className.indexOf(' highlight') > -1) className = className.replace(' highlight', '');
    }

    if (isSVG) el.className.baseVal = className;else el.className = className;
    return isSVG;
  }

  requestAnimationFrame(function () {
    var colorIsSet = color === null || color === false ? false : typeof color === 'string' ? color.length > 0 : _typeof(color) === 'object' ? true : false;

    _underscore["default"].each(document.querySelectorAll('[data-field]:not(.no-highlight)'), function (fieldContainerElement) {
      setHighlightClass(fieldContainerElement, true);
    });

    if (colorIsSet) {
      _underscore["default"].each(document.querySelectorAll('[data-field' + (field ? '="' + field + '"' : '') + ']:not(.no-highlight)'), function (fieldContainerElement) {
        setHighlightClass(fieldContainerElement, false);
      });
    }

    _underscore["default"].each(document.querySelectorAll('[data-term]:not(.no-highlight)'), function (termElement) {
      var dataField = termElement.getAttribute('data-field');
      if (field && dataField && dataField === field) return;
      var isSVG = setHighlightClass(termElement, true);
      if (!isSVG && termElement.className.indexOf('no-highlight-color') === -1) termElement.style.backgroundColor = '';
    });

    if (colorIsSet) {
      _underscore["default"].each(document.querySelectorAll('[data-term="' + term + '"]:not(.no-highlight)'), function (termElement) {
        var isSVG = setHighlightClass(termElement, false);
        if (!isSVG && termElement.className.indexOf('no-highlight-color') === -1) termElement.style.backgroundColor = color;
      });
    }
  });
  return true;
}, 50);

function highlightTerm() {
  arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'experiments_in_set.biosample.biosource.individual.organism.name';
  arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'human';
  arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return highlightTermFxn.apply(void 0, arguments);
}

function unhighlightTerms() {
  var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return highlightTermFxn(field, null, '');
}