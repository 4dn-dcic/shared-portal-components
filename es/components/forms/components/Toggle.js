import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["className", "id", "disabled", "name", "onChange", "checked"];
import React from 'react';
import _ from 'underscore';
import { randomId } from './../../util/object';
import { patchedConsoleInstance as console } from './../../util/patched-console';

/**
 * Wraps a checkbox input to turn it into a toggle switch using CSS.
 * Use just like a checkbox input element.
 *
 * @prop {string} id - A unique id. If not supplied, one is autogenerated.
 * @prop {function} onChange - Change event handler.
 * @prop {boolean} checked - Whether is checked or not.
 */
export var Toggle = /*#__PURE__*/React.memo(function (_ref) {
  var _ref$className = _ref.className,
    className = _ref$className === void 0 ? "" : _ref$className,
    _ref$id = _ref.id,
    id = _ref$id === void 0 ? null : _ref$id,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    _ref$name = _ref.name,
    name = _ref$name === void 0 ? "onoffswitch" : _ref$name,
    _ref$onChange = _ref.onChange,
    onChange = _ref$onChange === void 0 ? function (e) {
      console.log("Toggled ", e.target);
    } : _ref$onChange,
    _ref$checked = _ref.checked,
    checked = _ref$checked === void 0 ? false : _ref$checked,
    remainingProps = _objectWithoutProperties(_ref, _excluded);
  var useID = id || randomId();
  return /*#__PURE__*/React.createElement("div", {
    className: "onoffswitch " + className + (disabled ? ' disabled' : '')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    id: useID,
    name: name,
    onChange: onChange,
    checked: checked,
    className: "onoffswitch-checkbox",
    disabled: disabled
  }, remainingProps)), /*#__PURE__*/React.createElement("label", {
    className: "onoffswitch-label",
    htmlFor: id
  }, /*#__PURE__*/React.createElement("span", {
    className: "onoffswitch-inner"
  }), /*#__PURE__*/React.createElement("span", {
    className: "onoffswitch-switch"
  })));
});

/** Pulled out into own component so can style/adjust-if-needed together w. Case Review Tab */
export var IconToggle = function (props) {
  var _props$activeIdx = props.activeIdx,
    activeIdx = _props$activeIdx === void 0 ? 0 : _props$activeIdx,
    _props$options = props.options,
    options = _props$options === void 0 ? [] : _props$options,
    _props$divCls = props.divCls,
    divCls = _props$divCls === void 0 ? "" : _props$divCls;
  var renderedOptions = options.map(function (opt, optIdx) {
    var title = opt.title,
      disabled = opt.disabled,
      onClick = opt.onClick,
      dataTip = opt.dataTip,
      _opt$btnCls = opt.btnCls,
      btnCls = _opt$btnCls === void 0 ? "btn-sm" : _opt$btnCls;
    return /*#__PURE__*/React.createElement("div", {
      className: "flex-grow-1",
      "data-tip": dataTip,
      key: optIdx
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClick,
      disabled: disabled,
      "aria-pressed": activeIdx === optIdx,
      className: "btn btn-" + (activeIdx === optIdx ? "primary-dark active pe-none" : "link") + " " + btnCls
    }, title));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "icon-toggle " + divCls
  }, renderedOptions);
};