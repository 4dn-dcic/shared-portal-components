function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import React from 'react';
import { IndeterminateCheckbox } from './IndeterminateCheckbox';
/** Emulates React-Bootstrap 0.32.4 Checkbox for backwards compatibility */

export var Checkbox = /*#__PURE__*/React.memo(function (props) {
  var className = props.className,
      children = props.children,
      _props$labelClassName = props.labelClassName,
      labelClassName = _props$labelClassName === void 0 ? "mb-0" : _props$labelClassName,
      title = props.title,
      _props$inputClassName = props.inputClassName,
      inputClassName = _props$inputClassName === void 0 ? "mr-08 align-middle" : _props$inputClassName,
      _props$indeterminate = props.indeterminate,
      indeterminate = _props$indeterminate === void 0 ? false : _props$indeterminate,
      passProps = _objectWithoutProperties(props, ["className", "children", "labelClassName", "title", "inputClassName", "indeterminate"]);

  var disabled = passProps.disabled;
  var cls = "checkbox checkbox-with-label" + (disabled ? " disabled" : "") + (className ? " " + className : "");
  var checkboxElement = indeterminate ?
  /*#__PURE__*/
  // We assume that we can never receive a props.indeterminate here unless also providing
  // a boolean `props.checked` for fully controlled input element. Hence uncontrolled
  // <input> shouldn't ever lose its uncontrolled state by changing to IndeterminateCheckbox.
  React.createElement(IndeterminateCheckbox, _extends({
    className: inputClassName
  }, passProps, {
    indeterminate: true
  })) : /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    className: inputClassName
  }, passProps));
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, /*#__PURE__*/React.createElement("label", {
    title: title,
    className: labelClassName
  }, checkboxElement, children));
});