function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

import React from 'react';
/**
 * Since v6 of Font Awesome will require a pretty big upgrade w/some breaking changes,
 * and we have urgent need for one or two of the icons from that subset, this file will temporarily
 * house an icon component that can be used to load these icons as SVGs across CGAP & 4DN. This is a
 * SHORT TERM FIX for cases where there are no alternative options than to use an icon from v6.
 *
 * (Please don't start using this everywhere; it's for iconography-related emergencies ONLY.)
 *
 * This also will become deprecated when v6 upgrade is complete; delete after that point, and
 * update references.
 *
 * VERY IMPORTANT NOTE: The SVG file must be accessible on the PARENT REPO (CGAP/4DN) at
 * /static/img/fontawesomev6/<icon> in order to be used here. It must have the same name across both repos,
 * so best to just keep the name of the SVG file as downloaded from Fontawesome's site.
 */

var FontAwesomeV6Icons = /*#__PURE__*/React.memo(function (_ref) {
  var _ref$filename = _ref.filename,
      filename = _ref$filename === void 0 ? "filter-circle-xmark-solid.svg" : _ref$filename,
      _ref$hexColor = _ref.hexColor,
      hexColor = _ref$hexColor === void 0 ? "#ffffff" : _ref$hexColor,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? "16px" : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? "16px" : _ref$height,
      _ref$alt = _ref.alt,
      alt = _ref$alt === void 0 ? "An icon" : _ref$alt,
      _ref$cls = _ref.cls,
      cls = _ref$cls === void 0 ? "" : _ref$cls;
  // Must generate new icon fill color from provided hex code
  var rgbArr = hexToRgb(hexColor);
  var color = new Color(rgbArr[0], rgbArr[1], rgbArr[2]);
  var solver = new Solver(color);
  var filter = solver.solve();
  return /*#__PURE__*/React.createElement("img", {
    className: cls,
    style: {
      width: width,
      height: height,
      filter: filter
    },
    alt: alt,
    src: "/static/img/fontawesomev6/" + filename
  });
});
export default FontAwesomeV6Icons;
/**
 * Code snatched from here: https://codepen.io/sosuke/pen/Pjoqqp (and slightly adjusted)
 * for purposes of generating filter strings from hex code, since fill/bg-color/color attributes
 * do not seem to work on SVGs imported via img tags.
 */

var Color = /*#__PURE__*/function () {
  function Color(r, g, b) {
    _classCallCheck(this, Color);

    this.set(r, g, b);
  }

  _createClass(Color, [{
    key: "toString",
    value: function toString() {
      return "rgb(".concat(Math.round(this.r), ", ").concat(Math.round(this.g), ", ").concat(Math.round(this.b), ")");
    }
  }, {
    key: "set",
    value: function set(r, g, b) {
      this.r = this.clamp(r);
      this.g = this.clamp(g);
      this.b = this.clamp(b);
    }
  }, {
    key: "hueRotate",
    value: function hueRotate() {
      var angle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      angle = angle / 180 * Math.PI;
      var sin = Math.sin(angle);
      var cos = Math.cos(angle);
      this.multiply([0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928, 0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.140, 0.072 - cos * 0.072 - sin * 0.283, 0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072]);
    }
  }, {
    key: "grayscale",
    value: function grayscale() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.multiply([0.2126 + 0.7874 * (1 - value), 0.7152 - 0.7152 * (1 - value), 0.0722 - 0.0722 * (1 - value), 0.2126 - 0.2126 * (1 - value), 0.7152 + 0.2848 * (1 - value), 0.0722 - 0.0722 * (1 - value), 0.2126 - 0.2126 * (1 - value), 0.7152 - 0.7152 * (1 - value), 0.0722 + 0.9278 * (1 - value)]);
    }
  }, {
    key: "sepia",
    value: function sepia() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.multiply([0.393 + 0.607 * (1 - value), 0.769 - 0.769 * (1 - value), 0.189 - 0.189 * (1 - value), 0.349 - 0.349 * (1 - value), 0.686 + 0.314 * (1 - value), 0.168 - 0.168 * (1 - value), 0.272 - 0.272 * (1 - value), 0.534 - 0.534 * (1 - value), 0.131 + 0.869 * (1 - value)]);
    }
  }, {
    key: "saturate",
    value: function saturate() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.multiply([0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value, 0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value, 0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value]);
    }
  }, {
    key: "multiply",
    value: function multiply(matrix) {
      var newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
      var newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
      var newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
      this.r = newR;
      this.g = newG;
      this.b = newB;
    }
  }, {
    key: "brightness",
    value: function brightness() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.linear(value);
    }
  }, {
    key: "contrast",
    value: function contrast() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.linear(value, -(0.5 * value) + 0.5);
    }
  }, {
    key: "linear",
    value: function linear() {
      var slope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var intercept = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.r = this.clamp(this.r * slope + intercept * 255);
      this.g = this.clamp(this.g * slope + intercept * 255);
      this.b = this.clamp(this.b * slope + intercept * 255);
    }
  }, {
    key: "invert",
    value: function invert() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
      this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
      this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
    }
  }, {
    key: "hsl",
    value: function hsl() {
      // Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
      var r = this.r / 255;
      var g = this.g / 255;
      var b = this.b / 255;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h,
          s,
          l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
      }

      return {
        h: h * 100,
        s: s * 100,
        l: l * 100
      };
    }
  }, {
    key: "clamp",
    value: function clamp(value) {
      if (value > 255) {
        value = 255;
      } else if (value < 0) {
        value = 0;
      }

      return value;
    }
  }]);

  return Color;
}();

var Solver = /*#__PURE__*/function () {
  function Solver(target) {
    _classCallCheck(this, Solver);

    this.target = target;
    this.targetHSL = target.hsl();
    this.reusedColor = new Color(0, 0, 0);
  }

  _createClass(Solver, [{
    key: "solve",
    value: function solve() {
      var result = this.solveNarrow(this.solveWide());
      return this.css(result.values);
    }
  }, {
    key: "solveWide",
    value: function solveWide() {
      var a = [60, 180, 18000, 600, 1.2, 1.2];
      var best = {
        loss: Infinity
      };

      for (var i = 0; best.loss > 25 && i < 3; i++) {
        var result = this.spsa(5, a, 15, [50, 20, 3750, 50, 100, 100], 1000);

        if (result.loss < best.loss) {
          best = result;
        }
      }

      return best;
    }
  }, {
    key: "solveNarrow",
    value: function solveNarrow(wide) {
      var A = wide.loss;
      var A1 = A + 1;
      return this.spsa(A, [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1], 2, wide.values, 500);
    }
  }, {
    key: "spsa",
    value: function spsa(A, a, c, values, iters) {
      var best = null;
      var bestLoss = Infinity;
      var deltas = new Array(6);
      var highArgs = new Array(6);
      var lowArgs = new Array(6);

      for (var k = 0; k < iters; k++) {
        var ck = c / Math.pow(k + 1, 0.16666666666666666);

        for (var i = 0; i < 6; i++) {
          deltas[i] = Math.random() > 0.5 ? 1 : -1;
          highArgs[i] = values[i] + ck * deltas[i];
          lowArgs[i] = values[i] - ck * deltas[i];
        }

        var lossDiff = this.loss(highArgs) - this.loss(lowArgs);

        for (var _i2 = 0; _i2 < 6; _i2++) {
          var g = lossDiff / (2 * ck) * deltas[_i2];
          var ak = a[_i2] / Math.pow(A + k + 1, 1);
          values[_i2] = fix(values[_i2] - ak * g, _i2);
        }

        var loss = this.loss(values);

        if (loss < bestLoss) {
          best = values.slice(0);
          bestLoss = loss;
        }
      }

      return {
        values: best,
        loss: bestLoss
      };

      function fix(value, idx) {
        var max = 100;

        if (idx === 2
        /* saturate */
        ) {
          max = 7500;
        } else if (idx === 4
        /* brightness */
        || idx === 5
        /* contrast */
        ) {
          max = 200;
        }

        if (idx === 3
        /* hue-rotate */
        ) {
          if (value > max) {
            value %= max;
          } else if (value < 0) {
            value = max + value % max;
          }
        } else if (value < 0) {
          value = 0;
        } else if (value > max) {
          value = max;
        }

        return value;
      }
    }
  }, {
    key: "loss",
    value: function loss(filters) {
      // Argument is array of percentages.
      var color = this.reusedColor;
      color.set(0, 0, 0);
      color.invert(filters[0] / 100);
      color.sepia(filters[1] / 100);
      color.saturate(filters[2] / 100);
      color.hueRotate(filters[3] * 3.6);
      color.brightness(filters[4] / 100);
      color.contrast(filters[5] / 100);
      var colorHSL = color.hsl();
      return Math.abs(color.r - this.target.r) + Math.abs(color.g - this.target.g) + Math.abs(color.b - this.target.b) + Math.abs(colorHSL.h - this.targetHSL.h) + Math.abs(colorHSL.s - this.targetHSL.s) + Math.abs(colorHSL.l - this.targetHSL.l);
    }
  }, {
    key: "css",
    value: function css(filters) {
      function fmt(idx) {
        var multiplier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        return Math.round(filters[idx] * multiplier);
      }

      return "invert(".concat(fmt(0), "%) sepia(").concat(fmt(1), "%) saturate(").concat(fmt(2), "%) hue-rotate(").concat(fmt(3, 3.6), "deg) brightness(").concat(fmt(4), "%) contrast(").concat(fmt(5), "%)");
    }
  }]);

  return Solver;
}();

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}