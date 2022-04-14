import _typeof from "@babel/runtime/helpers/typeof";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import _ from 'underscore';
import memoize from 'memoize-one';
import { getNestedProperty, itemUtil } from './../../../util/object';
/**
 * Implements own `shouldComponentUpdate`.
 * Sometimes, columns other than first column may want to update -- in which case,
 * a `props.shouldComponentUpdateExt` is available but perhaps not fully implemented.
 */

export var ResultRowColumnBlockValue = /*#__PURE__*/function (_React$Component) {
  _inherits(ResultRowColumnBlockValue, _React$Component);

  var _super = _createSuper(ResultRowColumnBlockValue);

  function ResultRowColumnBlockValue(props) {
    var _this;

    _classCallCheck(this, ResultRowColumnBlockValue);

    _this = _super.call(this, props);
    _this.memoized = {
      transformIfNeeded: memoize(ResultRowColumnBlockValue.transformIfNeeded)
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

      if (nextProps.columnNumber === 0 || // Update title column more frequently as it has expansion controls, checkboxes, etc.
      nextProps.columnDefinition.field !== columnDefinition.field || nextProps.schemas !== schemas || nextProps.result !== result && itemUtil.atId(nextProps.result) !== itemUtil.atId(result) || nextProps.className !== className || typeof nextProps.shouldComponentUpdateExt === 'function' && nextProps.shouldComponentUpdateExt(nextProps, nextState, this.props, this.state)) {
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
          renderFxn = _columnDefinition$ren === void 0 ? null : _columnDefinition$ren,
          colDefTooltip = columnDefinition.tooltip;
      var value = renderFxn ? renderFxn(result, _.omit(this.props, 'result')) : this.memoized.transformIfNeeded(result, field, termTransformFxn); // Simple fallback transformation to unique arrays
      // Wrap `value` in a span (provides ellipsis, etc) if is primitive (not custom render fxn output)
      // Could prly make this less verbose later.. we _do_ want to wrap primitive values output from custom render fxn.

      var tooltip;

      if (typeof value === 'number') {
        value = /*#__PURE__*/React.createElement("span", {
          className: "value"
        }, value);
      } else if (typeof value === 'string') {
        if ((propTooltip === true || colDefTooltip === true) && value.length > 25) tooltip = value;
        value = /*#__PURE__*/React.createElement("span", {
          className: "value text-center"
        }, value);
      } else if (value === null) {
        value = /*#__PURE__*/React.createElement("small", {
          className: "value text-center"
        }, "-");
      } else if ( /*#__PURE__*/React.isValidElement(value) && value.type === "a" || Array.isArray(value) && /*#__PURE__*/React.isValidElement(value[0]) && (value[0].type === "a" || value[0].props.className === "link-wrapper")) {
        // We let other columnRender funcs define their `value` container (if any)
        // But if is link, e.g. from termTransformFxn, then wrap it to center it.
        value = /*#__PURE__*/React.createElement("span", {
          className: "value text-center"
        }, value);
      } else if (typeof value === "boolean") {
        value = /*#__PURE__*/React.createElement("span", {
          className: "value text-center"
        }, value);
      } else if (!renderFxn) {
        value = /*#__PURE__*/React.createElement("span", {
          className: "value"
        }, value); // JSX from termTransformFxn - assume doesn't take table cell layouting into account.
      } // else is likely JSX from custom render function -- leave as-is


      var cls = "inner";

      if (typeof className === 'string') {
        cls += ' ' + className;
      }

      return /*#__PURE__*/React.createElement("div", {
        className: cls,
        "data-tip": tooltip
      }, value);
    }
  }], [{
    key: "transformIfNeeded",
    value:
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
    function transformIfNeeded(result, field, termTransformFxn) {
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

      var uniquedValues = _toConsumableArray(flattenSet(getNestedProperty(result, field, true)));

      var uniquedValuesLen = uniquedValues.length; // No value found - let it default to 'null' and be handled as such

      if (uniquedValuesLen === 0) {
        // All null or undefined.
        return null;
      }

      if (_typeof(uniquedValues[0]) === "object" && uniquedValues[0]["@id"] && typeof termTransformFxn === "function") {
        // If LinkTo Item(s), return array of JSX elements (spans) which wrap links (assuming is output from termTransformFxn).
        var uniquedLinkToItems = _.uniq(uniquedValues, false, "@id");

        return uniquedLinkToItems.map(function (v, i) {
          var transformedValue = termTransformFxn(field, v, true); // `allowJSXOutput=true` == likely a link element.

          if (i === 0 && uniquedLinkToItems.length === 1) {
            return transformedValue; // Only 1 value, no need to wrap in <span>, {value}</span> to provide comma(s).
          }

          return /*#__PURE__*/React.createElement("span", {
            key: i,
            className: "link-wrapper"
          }, i > 0 ? ", " : null, transformedValue);
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

  return ResultRowColumnBlockValue;
}(React.Component);
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

_defineProperty(ResultRowColumnBlockValue, "defaultProps", {
  'mounted': false,
  'toggleDetailOpen': function toggleDetailOpen() {
    console.warn('Triggered props.toggleDetailOpen() but no toggleDetailOpen prop passed to ResultRowColumnValue Component.');
  },
  'shouldComponentUpdateExt': null
});

export function sanitizeOutputValue(value) {
  if (typeof value !== 'string' && typeof value !== 'number' && ! /*#__PURE__*/React.isValidElement(value)) {
    if (value && _typeof(value) === 'object') {
      if (typeof value.display_title !== 'undefined') {
        var atId = itemUtil.atId(value);

        if (atId) {
          return /*#__PURE__*/React.createElement("a", {
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