'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementTop = getElementTop;
exports.getElementOffset = getElementOffset;
exports.getElementOffsetFine = getElementOffsetFine;
exports.gridContainerWidth = gridContainerWidth;
exports.getScrollingOuterElement = getScrollingOuterElement;
exports.getPageVerticalScrollPosition = getPageVerticalScrollPosition;
exports.animateScrollTo = animateScrollTo;
exports.toggleBodyClass = toggleBodyClass;
exports.isDOMElementChildOfElementWithClass = isDOMElementChildOfElementWithClass;
exports.BrowserFeat = exports.textContentWidth = exports.textHeight = exports.textWidth = exports.responsiveGridState = exports.shortenString = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _misc = require("./misc");

var d3 = _interopRequireWildcard(require("d3"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getElementTop(el) {
  if (!(typeof window !== 'undefined' && window && document && document.body)) return null;
  if (!el || typeof el.getBoundingClientRect !== 'function') return null;
  var bodyRect = document.body.getBoundingClientRect();
  var boundingRect = el.getBoundingClientRect();
  return boundingRect.top - bodyRect.top;
}

function getElementOffset(el) {
  if (!(typeof window !== 'undefined' && window && document && document.body)) return null;
  if (!el || typeof el.getBoundingClientRect !== 'function') return null;
  var bodyRect = document.body.getBoundingClientRect();
  var boundingRect = el.getBoundingClientRect();
  return {
    'top': boundingRect.top - bodyRect.top,
    'left': boundingRect.left - bodyRect.left
  };
}

function getElementOffsetFine(el) {
  var x = 0;
  var y = 0;

  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - (el.tagName === 'BODY' ? window.pageXOffset : el.scrollLeft);
    y += el.offsetTop - (el.tagName === 'BODY' ? window.pageYOffset : el.scrollTop);
    el = el.offsetParent;
  }

  return {
    left: x,
    top: y
  };
}

var shortenString = (0, _memoizeOne["default"])(function (originalText) {
  var maxChars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 28;
  var addEllipsis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var splitOn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ' ';
  var textArr = originalText.split(splitOn),
      nextLength,
      returnArr = [],
      returnStrLen = 0;

  while (typeof textArr[0] === 'string') {
    nextLength = textArr[0].length + splitOn.length;

    if (returnStrLen + nextLength <= maxChars) {
      returnArr.push(textArr.shift());
      returnStrLen += nextLength;
    } else break;
  }

  if (textArr.length === 0) return originalText;
  return returnArr.join(splitOn) + (addEllipsis ? '...' : '');
});
exports.shortenString = shortenString;
var responsiveGridState = (0, _memoizeOne["default"])(function () {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (typeof width !== 'number') {
    return 'xl';
  }

  if (width >= 1200) return 'xl';
  if (width >= 992) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 576) return 'sm';
  return 'xs';
});
exports.responsiveGridState = responsiveGridState;

function gridContainerWidth() {
  var windowWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  switch (responsiveGridState(windowWidth)) {
    case 'xl':
      return 1120;

    case 'lg':
      return 940;

    case 'md':
      return 700;

    case 'sm':
      return 520;

    case 'xs':
      if ((0, _misc.isServerSide)()) return 400;
      return (windowWidth || window.innerWidth) - 20;
  }
}

var textWidth = (0, _memoizeOne["default"])(function (textContent) {
  var font = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "1rem 'Work Sans'";
  var roundToPixel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var canvas, context, width;

  try {
    canvas = textWidth.canvas || (textWidth.canvas = document.createElement("canvas"));
    context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(textContent);
    width = metrics.width;
  } catch (e) {
    console.warn("Failed to get text width with HTML5 canvas method, falling back to DOM method.");
    width = textContentWidth(textContent, 'div', null, null, {
      'font': font
    });
  }

  if (roundToPixel) {
    return Math.floor(width) + 1;
  } else {
    return width;
  }
});
exports.textWidth = textWidth;
var textHeight = (0, _memoizeOne["default"])(function () {
  var textContent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Some String";
  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
  var containerClassName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var containerElement = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var height, contElem;

  if (containerElement && typeof containerElement.cloneNode === 'function') {
    contElem = containerElement.cloneNode(false);
  } else {
    contElem = document.createElement('div');
  }

  contElem.className = "off-screen " + (containerClassName || '');
  contElem.innerHTML = textContent;

  if (style) {
    _underscore["default"].extend(contElem.style, style);
  }

  contElem.style.display = "block";
  contElem.style.width = width + "px";

  if (containerElement && containerElement.parentElement) {
    containerElement.parentElement.appendChild(contElem);
    height = contElem.clientHeight;
    containerElement.parentElement.removeChild(contElem);
  } else {
    document.body.appendChild(contElem);
    height = contElem.clientHeight;
    document.body.removeChild(contElem);
  }

  return height;
});
exports.textHeight = textHeight;
var textContentWidth = (0, _memoizeOne["default"])(function (textContent) {
  var containerElementType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';
  var containerClassName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var widthForHeightCheck = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var style = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var contElem = document.createElement(containerElementType);
  contElem.className = "off-screen " + (containerClassName || '');
  contElem.innerHTML = textContent;
  if (style) contElem.style = style;
  contElem.style.whiteSpace = "nowrap";
  document.body.appendChild(contElem);
  var textLineWidth = contElem.clientWidth;
  var fullContainerHeight;

  if (widthForHeightCheck) {
    contElem.style.whiteSpace = "";
    contElem.style.display = "block";
    contElem.style.width = widthForHeightCheck + "px";
    fullContainerHeight = contElem.clientHeight;
  }

  document.body.removeChild(contElem);

  if (fullContainerHeight) {
    return {
      containerHeight: fullContainerHeight,
      textWidth: textLineWidth
    };
  }

  return textLineWidth;
});
exports.textContentWidth = textContentWidth;

function getScrollingOuterElement() {
  if (!window || !document) return null;

  if (typeof document.scrollingElement !== 'undefined' && document.scrollingElement) {
    return document.scrollingElement;
  }

  if (document.documentElement && typeof document.documentElement.scrollTop === 'number') {
    return document.documentElement;
  }

  if (document.body && typeof document.body.scrollTop === 'number') {
    return document.body;
  }

  return document.body;
}

function getPageVerticalScrollPosition() {
  if ((0, _misc.isServerSide)() || !window || !document) return null;
  return window.pageYOffset || document.scrollingElement && document.scrollingElement.scrollTop || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
}

function animateScrollTo(to) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 750;
  var offsetBeforeTarget = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 112;
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  if (!document || !document.body) return null;
  var scrollElement = getScrollingOuterElement();
  var elementTop;

  if (typeof to === 'string') {
    var elem = document.getElementById(to);
    if (!elem) throw new Error(to + " not found in document.");
    elementTop = getElementTop(elem);
  } else if (typeof to === 'number') {
    elementTop = to;
  } else throw new Error("Invalid argument 'to' supplied.");

  if (elementTop === null) return null;
  elementTop = Math.max(0, elementTop - offsetBeforeTarget);

  if (scrollElement && scrollElement.scrollHeight && window && window.innerHeight) {
    elementTop = Math.min(scrollElement.scrollHeight - window.innerHeight, elementTop);
  }

  var animation = d3.select(scrollElement).interrupt().transition().duration(duration).tween("bodyScroll", function (scrollTop) {
    return function () {
      var interpolate = d3.interpolateNumber(this.scrollTop, scrollTop);
      return function (t) {
        window.scrollTo(0, interpolate(t));
      };
    };
  }(elementTop));

  if (typeof callback === 'function') {
    animation.on('end', callback);
  }
}

function toggleBodyClass(className) {
  var toggleTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var bodyElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  bodyElement = bodyElement || window && document && document.body || null;
  var allClasses = Array.isArray(className) ? className : typeof className === 'string' ? allClasses = className.split(' ') : null;

  if (!className) {
    throw new Error('Invalid className supplied. Must be a string or array.');
  }

  if (bodyElement) {
    var bodyClasses = bodyElement.className.split(' ');

    _underscore["default"].forEach(allClasses, function (classToToggle, i) {
      var willSet;

      if (typeof toggleTo === 'boolean') {
        willSet = toggleTo;
      } else if (Array.isArray(toggleTo) && typeof toggleTo[i] === 'boolean') {
        willSet = toggleTo[i];
      } else {
        willSet = bodyClasses.indexOf(classToToggle) === -1;
      }

      if (willSet) {
        bodyClasses.push(classToToggle);
        bodyClasses = _underscore["default"].uniq(bodyClasses);
      } else {
        var indexToRemove = bodyClasses.indexOf(classToToggle);

        if (indexToRemove > -1) {
          bodyClasses = _underscore["default"].uniq(bodyClasses.slice(0, indexToRemove).concat(bodyClasses.slice(indexToRemove + 1)));
        }
      }
    });

    bodyElement.className = bodyClasses.length > 0 ? bodyClasses.length === 1 ? bodyClasses[0] : bodyClasses.join(' ') : null;
  }
}

function isDOMElementChildOfElementWithClass(elem, className) {
  var maxDepth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
  var depth = 0;
  var currElem = elem;

  while (depth < maxDepth) {
    console.log('E', elem, elemClasses);
    var elemClasses = (currElem.getAttribute('class') || '').split(' ');

    if (elemClasses.indexOf(className) > -1) {
      return true;
    }

    depth++;
    currElem = currElem.parentElement;
  }

  return false;
}

var BrowserFeat = {
  'feat': {},
  'getBrowserCaps': function getBrowserCaps(feat) {
    if (Object.keys(this.feat).length === 0) {
      this.feat.svg = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');

      this.feat.canvas = function () {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
      }();

      this.feat.todataurlpng = function () {
        var canvas = document.createElement('canvas');
        return !!(canvas && canvas.toDataURL && canvas.toDataURL('image/png').indexOf('data:image/png') === 0);
      }();

      this.feat.csstransforms = function () {
        var elem = document.createElement('tspan');
        return 'transform' in elem.style;
      }();

      this.feat.flexbox = function () {
        var elem = document.createElement('tspan');
        return 'flexBasis' in elem.style;
      }();

      this.feat.uaTrident = function () {
        return navigator.userAgent.indexOf('Trident') > 0;
      }();

      this.feat.uaEdge = function () {
        return navigator.userAgent.indexOf('Edge') > 0;
      }();
    }

    return feat ? this.feat[feat] : this.feat;
  },
  'setHtmlFeatClass': function setHtmlFeatClass() {
    var htmlclass = [];
    this.getBrowserCaps();
    var keys = Object.keys(this.feat);
    var i = keys.length;

    while (i--) {
      if (this.feat[keys[i]]) {
        htmlclass.push(keys[i]);
      } else {
        htmlclass.push('no-' + keys[i]);
      }
    }

    document.documentElement.className = htmlclass.join(' ');
  }
};
exports.BrowserFeat = BrowserFeat;