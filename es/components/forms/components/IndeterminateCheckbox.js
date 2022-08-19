import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["indeterminate"];
import React from 'react';
export function IndeterminateCheckbox(props) {
  var _props$indeterminate = props.indeterminate,
      indeterminate = _props$indeterminate === void 0 ? false : _props$indeterminate,
      passProps = _objectWithoutProperties(props, _excluded); // See https://reactjs.org/docs/refs-and-the-dom.html#callback-refs


  return /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox"
  }, passProps, {
    ref: function callbackRef(el) {
      if (indeterminate && el) el.indeterminate = indeterminate;
    }
  }));
}