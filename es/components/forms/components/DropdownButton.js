"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownButton = DropdownButton;
exports.DropdownItem = exports.Dropdown = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DropdownButtonImported = require('react-bootstrap').DropdownButton;

var Dropdown = require('react-bootstrap').Dropdown;

exports.Dropdown = Dropdown;

var MenuItemV3 = require('react-bootstrap').MenuItem;

var MenuItemV4 = require('react-bootstrap').DropdownItem;

var DropdownItem = MenuItemV4 || MenuItemV3;
exports.DropdownItem = DropdownItem;

function DropdownButton(props) {
  var variant = props.variant || props.bsStyle;
  return _react.default.createElement(DropdownButtonImported, _extends({}, props, {
    variant: variant
  }));
}