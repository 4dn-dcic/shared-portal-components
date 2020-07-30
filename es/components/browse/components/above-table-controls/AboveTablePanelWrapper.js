'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboveTablePanelWrapper = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var AboveTablePanelWrapper = /*#__PURE__*/_react["default"].memo(function (props) {
  var children = props.children,
      title = props.title,
      className = props.className,
      onClose = props.onClose;
  var closeButton = null;

  if (typeof onClose === 'function') {
    closeButton = /*#__PURE__*/_react["default"].createElement("a", {
      className: "close-button",
      onClick: onClose
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "icon icon-fw icon-angle-up fas"
    }));
  }

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "search-result-config-panel" + (className ? ' ' + className : '')
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "inner"
  }, /*#__PURE__*/_react["default"].createElement("h5", {
    className: "panel-title"
  }, title, closeButton), children));
});

exports.AboveTablePanelWrapper = AboveTablePanelWrapper;