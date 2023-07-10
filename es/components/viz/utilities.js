function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
import React from 'react';
import _ from 'underscore';
import { isServerSide } from './../util/misc';
import { patchedConsoleInstance as console } from './../util/patched-console';

/**
 * Utility functions for aiding with visualizations.
 *
 * @module {Object} viz/utilities
 */

/**
 * Taken from http://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
 * Somewhat deprecated as we use D3 color scales for most part now.
 *
 * @deprecated
 * @param {string} str - String to generate a color from. Any string.
 * @returns {string} A CSS color.
 */
export function stringToColor(str) {
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

/**
 * Helper function for window.requestAnimationFrame. Falls back to browser-prefixed versions if default not available, or falls back to setTimeout with 0ms delay if no requestAnimationFrame available at all.
 *
 * @param {function} cb - Callback method.
 * @returns {undefined|string} Undefined or timeout ID if falling back to setTimeout.
 */
export function requestAnimationFrame(cb) {
  if (!isServerSide() && typeof window !== 'undefined') {
    if (typeof window.requestAnimationFrame !== 'undefined') return window.requestAnimationFrame(cb);
    if (typeof window.webkitRequestAnimationFrame !== 'undefined') return window.webkitRequestAnimationFrame(cb);
    if (typeof window.mozRequestAnimationFrame !== 'undefined') return window.mozRequestAnimationFrame(cb);
  }
  return setTimeout(cb, 0); // Mock it for old browsers and server-side.
}

export function cancelAnimationFrame(identifier) {
  if (!isServerSide() && typeof window !== 'undefined') {
    if (typeof window.cancelAnimationFrame !== 'undefined') return window.cancelAnimationFrame(identifier);
    if (typeof window.webkitCancelAnimationFrame !== 'undefined') return window.webkitCancelAnimationFrame(identifier);
    if (typeof window.mozCancelAnimationFrame !== 'undefined') return window.mozCancelAnimationFrame(identifier);
  }
  return clearTimeout(identifier); // Mock it for old browsers and server-side.
}

export function stackDotsInContainer(count) {
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  var dotSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
  var dotSpacing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
  var snakeOrdering = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var centerLowCount = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  var dotRadius = dotSize / 2;
  var currX = dotRadius;
  var currY = dotRadius;
  if (centerLowCount && count * dotSize + (count - 1) * dotSpacing < height) {
    // Center vertically if low count
    currY = height / 2 - (dotSpacing * (count - 1) + dotSize * count) / 2 + dotRadius;
  }
  var counter = 0;
  var direction = snakeOrdering ? "up" : null;
  var dotCoords = [];
  while (counter < count) {
    dotCoords.push([currX, currY]);
    counter++;
    if (direction === "up" || direction === null) {
      currY += dotSize + dotSpacing;
      if (currY > height - dotRadius) {
        currX += dotSize + dotSpacing;
        if (direction === "up") {
          direction = "down";
          currY = height - dotRadius;
        } else {
          currY = dotRadius;
        }
      }
    } else {
      currY -= dotSize + dotSpacing;
      if (currY < dotRadius) {
        currX += dotSize + dotSpacing;
        direction = "up";
        currY = dotRadius;
      }
    }
  }
  return dotCoords;
}

/**
 * Used in Barplot/Chart.js to merge 'style' options. Only merges keys which are present on `styleOptsToExtend`.
 * Similar to underscore's `_.extend` but arguments are reversed and... sort of unnecessary.
 *
 * @deprecated
 * @param {Object} styleOptsToExtendFrom     Object of styles to extend from.
 * @param {Object} styleOptsToExtend         Object of styles to extend to.
 * @returns {Object} Returns `styleOptsToExtend` with key vals overriden from `styleOptsToExtendFrom`.
 */
export function extendStyleOptions(styleOptsToExtendFrom, styleOptsToExtend) {
  if (!styleOptsToExtend) throw new Error("No default style options provided.");
  if (!styleOptsToExtendFrom) return styleOptsToExtend;else {
    _.keys(styleOptsToExtend).forEach(function (styleProp) {
      if (typeof styleOptsToExtendFrom[styleProp] === 'undefined') return;
      if (_typeof(styleOptsToExtendFrom[styleProp]) === 'object' && styleOptsToExtendFrom[styleProp]) {
        _.extend(styleOptsToExtend[styleProp], styleOptsToExtendFrom[styleProp]);
      } else {
        styleOptsToExtend[styleProp] = styleOptsToExtendFrom[styleProp];
      }
    });
    return styleOptsToExtend;
  }
}
export function transformBarPlotAggregationsToD3CompatibleHierarchy(rootField) {
  var aggregateType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'experiment_sets';
  function genChildren(currField) {
    return _.map(_.pairs(currField.terms), function (term_pair) {
      var termName = term_pair[0];
      var termObj = term_pair[1];
      var isLeafTerm = typeof termObj.experiment_sets === 'number' && typeof termObj.field === 'undefined';
      if (isLeafTerm) {
        return {
          'name': termName,
          'size': termObj[aggregateType]
        };
      } else if (_typeof(termObj.terms) === 'object' && termObj.terms) {
        // Double check that not leaf (have sub-terms)
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

/**
 * Object containing functions which might help in setting a CSS style.
 *
 * @constant
 */
export var style = {
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
  /**
   * @param {number} rotation - How much to rotate, in degrees.
   * @param {string|string[]|Object} [axes='z'] - Axes around which to rotate.
   */
  rotate3d: function rotate3d(rotation) {
    var axes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['z'];
    if (typeof axes === 'string') axes = axes.split(',').map(function (axis) {
      return axis.trim();
    });
    if (Array.isArray(axes)) axes = _.extend({
      'x': 0,
      'y': 0,
      'z': 0
    }, _.object(axes.map(function (axis) {
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
var highlightTermFxn = _.debounce(function () {
  var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'experiments_in_set.biosample.biosource.organism.name';
  var term = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'human';
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (isServerSide()) return false;
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
    _.each(document.querySelectorAll('[data-field]:not(.no-highlight)'), function (fieldContainerElement) {
      setHighlightClass(fieldContainerElement, true);
    });
    if (colorIsSet) {
      _.each(document.querySelectorAll('[data-field' + (field ? '="' + field + '"' : '') + ']:not(.no-highlight)'), function (fieldContainerElement) {
        setHighlightClass(fieldContainerElement, false);
      });
    }

    // unhighlight previously selected terms, if any.
    _.each(document.querySelectorAll('[data-term]:not(.no-highlight)'), function (termElement) {
      var dataField = termElement.getAttribute('data-field');
      if (field && dataField && dataField === field) return; // Skip, we need to leave as highlighted as also our field container.
      var isSVG = setHighlightClass(termElement, true);
      if (!isSVG && termElement.className.indexOf('no-highlight-color') === -1) termElement.style.backgroundColor = '';
    });
    if (colorIsSet) {
      _.each(document.querySelectorAll('[data-term="' + term + '"]:not(.no-highlight)'), function (termElement) {
        var isSVG = setHighlightClass(termElement, false);
        if (!isSVG && termElement.className.indexOf('no-highlight-color') === -1) termElement.style.backgroundColor = color;
      });
    }
  });
  return true;
}, 50);

/**
 * Highlights all terms on document (changes background color) of given field,term.
 * @param {string} field - Field, in object dot notation.
 * @param {string} term - Term to highlight.
 * @param {string} color - A valid CSS color.
 */
export function highlightTerm() {
  arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'experiments_in_set.biosample.biosource.organism.name';
  arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'human';
  arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return highlightTermFxn.apply(void 0, arguments);
}

/**
 * Resets background color of terms.
 */
export function unhighlightTerms() {
  var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return highlightTermFxn(field, null, '');
}