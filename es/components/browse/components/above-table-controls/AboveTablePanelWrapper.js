'use strict';

import React from 'react';
export var AboveTablePanelWrapper = /*#__PURE__*/React.memo(function (props) {
  var children = props.children,
      title = props.title,
      className = props.className,
      onClose = props.onClose;
  var closeButton = null;

  if (typeof onClose === 'function') {
    closeButton = /*#__PURE__*/React.createElement("a", {
      className: "close-button",
      onClick: onClose
    }, /*#__PURE__*/React.createElement("i", {
      className: "icon icon-fw icon-angle-up fas"
    }));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "search-result-config-panel" + (className ? ' ' + className : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "inner"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "panel-title"
  }, title, closeButton), children));
});