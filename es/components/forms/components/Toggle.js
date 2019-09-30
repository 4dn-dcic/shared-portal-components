'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toggle = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

var _object = require("./../../util/object");

var _patchedConsole = require("./../../util/patched-console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Toggle = _react["default"].memo(function (_ref) {
  var className = _ref.className,
      id = _ref.id,
      disabled = _ref.disabled,
      remainingProps = _objectWithoutProperties(_ref, ["className", "id", "disabled"]);

  var useID = id || (0, _object.randomId)();
  return _react["default"].createElement("div", {
    className: "onoffswitch " + className + (disabled ? ' disabled' : '')
  }, _react["default"].createElement("input", _extends({
    type: "checkbox",
    id: useID
  }, remainingProps, {
    className: "onoffswitch-checkbox",
    disabled: disabled
  })), _react["default"].createElement("label", {
    className: "onoffswitch-label",
    htmlFor: id
  }, _react["default"].createElement("span", {
    className: "onoffswitch-inner"
  }), _react["default"].createElement("span", {
    className: "onoffswitch-switch"
  })));
});

exports.Toggle = Toggle;
Toggle.defaultProps = {
  'name': 'onoffswitch',
  'onChange': function onChange() {
    _patchedConsole.patchedConsoleInstance.log("Toggled ", this);
  },
  'id': null,
  'checked': false,
  'className': ''
};