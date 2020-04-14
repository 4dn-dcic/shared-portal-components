'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeOutputValue = sanitizeOutputValue;
exports.ResultRowColumnBlockValue = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _object = require("./../../../util/object");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Implements own `shouldComponentUpdate`.
 * Sometimes, columns other than first column may want to update -- in which case,
 * a `props.shouldComponentUpdateExt` is available but perhaps not fully implemented.
 */
var ResultRowColumnBlockValue =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ResultRowColumnBlockValue, _React$Component);

  _createClass(ResultRowColumnBlockValue, null, [{
    key: "transformIfNeeded",

    /**
     * Default value rendering function. Fallback when no `render` func defined in columnDefinition.
     * Uses columnDefinition field (column key) to get nested property value from result and display it.
     *
     * @param {Item} result - JSON object representing row data.
     * @param {ColumnDefinition} columnDefinition - Object with column definition data - field, title, widthMap, render function (self)
     * @param {Object} props - Props passed down from SearchResultTable/ResultRowColumnBlock instance.
     * @param {number} width - Unused. Todo - remove?
     * @returns {string|null} String value or null. Your function may return a React element, as well.
     */
    value: function transformIfNeeded(result, columnDefinition, props, termTransformFxn) {
      function filterAndUniq(vals) {
        return _underscore["default"].uniq(_underscore["default"].filter(vals, function (v) {
          return v !== null && typeof v !== 'undefined';
        }));
      }

      var value = (0, _object.getNestedProperty)(result, columnDefinition.field, true);
      if (typeof value === "undefined") value = null;

      if (Array.isArray(value)) {
        // getNestedProperty may return a multidimensional array, # of dimennsions depending on how many child arrays were encountered in original result obj.
        value = filterAndUniq(value.map(function (v) {
          if (Array.isArray(v)) {
            v = filterAndUniq(v);
            if (v.length === 1) v = v[0];
            if (v.length === 0) v = null;
          }

          if (typeof termTransformFxn === 'function') {
            return termTransformFxn(columnDefinition.field, v, false);
          }

          console.warn("No termTransformFxn supplied.");
          return v;
        })).map(function (v) {
          if (typeof termTransformFxn === 'function') {
            return termTransformFxn(columnDefinition.field, v, false);
          }

          return v;
        }).join(', ');
      } else if (typeof termTransformFxn === 'function') {
        value = termTransformFxn(columnDefinition.field, value, true);
      }

      return value;
    }
  }]);

  function ResultRowColumnBlockValue(props) {
    var _this;

    _classCallCheck(this, ResultRowColumnBlockValue);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResultRowColumnBlockValue).call(this, props));
    _this.memoized = {
      transformIfNeeded: (0, _memoizeOne["default"])(ResultRowColumnBlockValue.transformIfNeeded)
    };
    return _this;
  }

  _createClass(ResultRowColumnBlockValue, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _this$props = this.props,
          columnDefinition = _this$props.columnDefinition,
          schemas = _this$props.schemas,
          result = _this$props.result,
          className = _this$props.className;

      if (nextProps.columnNumber === 0 || // Update title column more frequently.
      nextProps.columnDefinition.field !== columnDefinition.field || nextProps.schemas !== schemas || _object.itemUtil.atId(nextProps.result) !== _object.itemUtil.atId(result) || nextProps.className !== className || typeof nextProps.shouldComponentUpdateExt === 'function' && nextProps.shouldComponentUpdateExt(nextProps, nextState, this.props, this.state)) {
        return true;
      }

      return false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          result = _this$props2.result,
          columnDefinition = _this$props2.columnDefinition,
          propTooltip = _this$props2.tooltip,
          className = _this$props2.className,
          termTransformFxn = _this$props2.termTransformFxn;
      var renderFxn = columnDefinition.render || this.memoized.transformIfNeeded;
      var value = sanitizeOutputValue(renderFxn(result, columnDefinition, _underscore["default"].omit(this.props, 'columnDefinition', 'result'), termTransformFxn));
      var tooltip;

      if (typeof value === 'number') {
        value = _react["default"].createElement("span", {
          className: "value"
        }, value);
      } else if (typeof value === 'string') {
        if (propTooltip === true && value.length > 25) tooltip = value;
        value = _react["default"].createElement("span", {
          className: "value"
        }, value);
      } else if (value === null) {
        value = _react["default"].createElement("small", {
          className: "value"
        }, "-");
      } else if (_react["default"].isValidElement(value) && value.type === "a") {
        // We let other columnRender funcs define their `value` container (if any)
        // But if is link, e.g. from termTransformFxn, then wrap it to center it.
        value = _react["default"].createElement("span", {
          className: "value"
        }, value);
      }

      var cls = "inner";

      if (typeof className === 'string') {
        cls += ' ' + className;
      }

      return _react["default"].createElement("div", {
        className: cls,
        "data-tip": tooltip
      }, value);
    }
  }]);

  return ResultRowColumnBlockValue;
}(_react["default"].Component);
/**
 * Ensure we have a valid React element to render.
 * If not, try to detect if Item object, and generate link.
 * Else, let exception bubble up.
 *
 * Used as fallback for most columns.
 *
 * @static
 * @param {any} value - Value to sanitize.
 */


exports.ResultRowColumnBlockValue = ResultRowColumnBlockValue;

_defineProperty(ResultRowColumnBlockValue, "defaultProps", {
  'mounted': false,
  'toggleDetailOpen': function toggleDetailOpen() {
    console.warn('Triggered props.toggleDetailOpen() but no toggleDetailOpen prop passed to ResultRowColumnValue Component.');
  },
  'shouldComponentUpdateExt': null
});

function sanitizeOutputValue(value) {
  if (typeof value !== 'string' && typeof value !== 'number' && !_react["default"].isValidElement(value)) {
    if (value && _typeof(value) === 'object') {
      if (typeof value.display_title !== 'undefined') {
        var atId = _object.itemUtil.atId(value);

        if (atId) {
          return _react["default"].createElement("a", {
            href: atId
          }, value.display_title);
        } else {
          return value.display_title;
        }
      }
    } else if (!value) {
      value = null;
    }
  }

  if (value === "None") value = null;
  return value;
}