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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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

  var _super = _createSuper(ResultRowColumnBlockValue);

  _createClass(ResultRowColumnBlockValue, null, [{
    key: "transformIfNeeded",

    /**
     * Default value rendering function. Fallback when no `render` func defined in columnDefinition.
     * Uses columnDefinition field (column key) to get nested property value from result and display it.
     *
     * @todo Maybe use Sets if more performant.
     * @param {Item} result - JSON object representing row data.
     * @param {string} field - Field for which this value is for.
     * @param {function} termTransformFxn - Transform value(s)
     * @returns {string|null} String value or null. Your function may return a React element, as well.
     */
    value: function transformIfNeeded(result, field, termTransformFxn) {
      function flattenSet(valArr) {
        var uniqSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        uniqSet = uniqSet || new Set();

        if (Array.isArray(valArr)) {
          for (var i = 0; i < valArr.length; i++) {
            flattenSet(valArr[i], uniqSet);
          }

          return uniqSet;
        } // Else is single value (not array) -


        if (valArr !== null && typeof valArr !== 'undefined') {
          uniqSet.add(valArr);
        }

        return uniqSet;
      }

      var uniquedValues = _toConsumableArray(flattenSet((0, _object.getNestedProperty)(result, field, true)));

      var uniquedValuesLen = uniquedValues.length; // No value found - let it default to 'null' and be handled as such

      if (uniquedValuesLen === 0) {
        // All null or undefined.
        return null;
      }

      if (_typeof(uniquedValues[0]) === "object" && uniquedValues[0]["@id"] && typeof termTransformFxn === "function") {
        // If LinkTo Item(s), return array of JSX elements (spans) which wrap links (assuming is output from termTransformFxn).
        var uniquedLinkToItems = _underscore["default"].uniq(uniquedValues, false, "@id");

        return uniquedLinkToItems.map(function (v, i) {
          var transformedValue = termTransformFxn(field, v, true); // `allowJSXOutput=true` == likely a link element.

          if (i === 0 && uniquedLinkToItems.length === 1) {
            return transformedValue; // Only 1 value, no need to wrap in <span>, {value}</span> to provide comma(s).
          }

          return (
            /*#__PURE__*/
            _react["default"].createElement("span", {
              key: i,
              className: "link-wrapper"
            }, i > 0 ? ", " : null, transformedValue)
          );
        });
      } else if (typeof termTransformFxn === "function") {
        return uniquedValues.map(function (v) {
          return termTransformFxn(field, v, false); // `allowJSXOutput=false` == don't allow JSX element/component(s) because joining w. ", ".
        }).join(', '); // Most often will be just 1 value in set/array.
      } else {
        console.warn("No termTransformFxn supplied.");
        return uniquedValues.join(', ');
      }
    }
  }]);

  function ResultRowColumnBlockValue(props) {
    var _this;

    _classCallCheck(this, ResultRowColumnBlockValue);

    _this = _super.call(this, props);
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
      var field = columnDefinition.field,
          _columnDefinition$ren = columnDefinition.render,
          renderFxn = _columnDefinition$ren === void 0 ? null : _columnDefinition$ren;
      var value = renderFxn ? renderFxn(result, _underscore["default"].omit(this.props, 'result')) : this.memoized.transformIfNeeded(result, field, termTransformFxn); // Simple fallback transformation to unique arrays
      // Wrap `value` in a span (provides ellipsis, etc) if is primitive (not custom render fxn output)
      // Could prly make this less verbose later.. we _do_ want to wrap primitive values output from custom render fxn.

      var tooltip;

      if (typeof value === 'number') {
        value =
        /*#__PURE__*/
        _react["default"].createElement("span", {
          className: "value"
        }, value);
      } else if (typeof value === 'string') {
        if (propTooltip === true && value.length > 25) tooltip = value;
        value =
        /*#__PURE__*/
        _react["default"].createElement("span", {
          className: "value text-center"
        }, value);
      } else if (value === null) {
        value =
        /*#__PURE__*/
        _react["default"].createElement("small", {
          className: "value text-center"
        }, "-");
      } else if (_react["default"].isValidElement(value) && value.type === "a" || Array.isArray(value) && _react["default"].isValidElement(value[0]) && (value[0].type === "a" || value[0].props.className === "link-wrapper")) {
        // We let other columnRender funcs define their `value` container (if any)
        // But if is link, e.g. from termTransformFxn, then wrap it to center it.
        value =
        /*#__PURE__*/
        _react["default"].createElement("span", {
          className: "value text-center"
        }, value);
      } else if (typeof value === "boolean") {
        value =
        /*#__PURE__*/
        _react["default"].createElement("span", {
          className: "value text-center"
        }, value);
      } else if (!renderFxn) {
        value =
        /*#__PURE__*/
        _react["default"].createElement("span", {
          className: "value"
        }, value); // JSX from termTransformFxn - assume doesn't take table cell layouting into account.
      } // else is likely JSX from custom render function -- leave as-is


      var cls = "inner";

      if (typeof className === 'string') {
        cls += ' ' + className;
      }

      return (
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: cls,
          "data-tip": tooltip
        }, value)
      );
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
          return (
            /*#__PURE__*/
            _react["default"].createElement("a", {
              href: atId
            }, value.display_title)
          );
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