function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
/** Compatibility layer until we create & fully test & export our own component */
// eslint-disable-next-line prefer-destructuring

var DropdownButtonImported = require('react-bootstrap').DropdownButton; // eslint-disable-next-line prefer-destructuring


export var Dropdown = require('react-bootstrap').Dropdown; // Non-ideal import of unknowns

var MenuItemV3 = require('react-bootstrap').MenuItem; // React-Bootstrap v0.32.4 (Bootstrap v3)


var MenuItemV4 = require('react-bootstrap').DropdownItem; // React-Bootstrap v1.0.0 (Bootstrap v4)


export var DropdownItem = MenuItemV4 || MenuItemV3;
export function DropdownButton(props) {
  var variant = props.variant || props.bsStyle;
  return /*#__PURE__*/React.createElement(DropdownButtonImported, _extends({}, props, {
    variant: variant
  }));
}