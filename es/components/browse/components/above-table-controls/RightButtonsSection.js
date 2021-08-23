'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { SearchResultTable } from './../SearchResultTable';
export var RightButtonsSection = /*#__PURE__*/React.memo(function (props) {
  var currentOpenPanel = props.currentOpenPanel,
      onColumnsBtnClick = props.onColumnsBtnClick,
      onMultiColumnSortBtnClick = props.onMultiColumnSortBtnClick,
      windowWidth = props.windowWidth,
      isFullscreen = props.isFullscreen,
      toggleFullScreen = props.toggleFullScreen,
      _props$showMultiColum = props.showMultiColumnSort,
      showMultiColumnSort = _props$showMultiColum === void 0 ? true : _props$showMultiColum;
  return /*#__PURE__*/React.createElement("div", {
    className: "right-buttons col-auto"
  }, /*#__PURE__*/React.createElement(ConfigureVisibleColumnsButton, {
    onClick: onColumnsBtnClick,
    open: currentOpenPanel === "customColumns"
  }), showMultiColumnSort ? /*#__PURE__*/React.createElement(MultiColumnSortButton, {
    onClick: onMultiColumnSortBtnClick,
    open: currentOpenPanel === "multiColumnSort"
  }) : null, typeof windowWidth === 'number' && typeof isFullscreen === 'boolean' && typeof toggleFullScreen === 'function' ? /*#__PURE__*/React.createElement(ToggleLayoutButton, {
    windowWidth: windowWidth,
    isFullscreen: isFullscreen,
    toggleFullScreen: toggleFullScreen
  }) : null);
});
export var ConfigureVisibleColumnsButton = /*#__PURE__*/React.memo(function (_ref) {
  var open = _ref.open,
      onClick = _ref.onClick,
      className = _ref.className;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: "toggle-visible-columns",
    "data-tip": "Configure visible columns",
    "data-event-off": "click",
    active: open.toString(),
    onClick: onClick,
    className: (className || "") + (open ? " active" : "")
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-table fas"
  }), /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-angle-down ml-03 fas"
  }));
});
ConfigureVisibleColumnsButton.defaultProps = {
  "className": "btn btn-outline-primary"
};
export var MultiColumnSortButton = /*#__PURE__*/React.memo(function (_ref2) {
  var open = _ref2.open,
      onClick = _ref2.onClick,
      className = _ref2.className;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: "toggle-visible-columns",
    "data-tip": "Sort multiple columns",
    "data-event-off": "click",
    active: open.toString(),
    onClick: onClick,
    className: (className || "") + (open ? " active" : "")
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-sort fas"
  }), /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-angle-down ml-03 fas"
  }));
});
MultiColumnSortButton.defaultProps = {
  "className": "btn btn-outline-primary"
};
/** Toggles between regular & full screen views */

export var ToggleLayoutButton = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ToggleLayoutButton, _React$PureComponent);

  var _super = _createSuper(ToggleLayoutButton);

  function ToggleLayoutButton(props) {
    var _this;

    _classCallCheck(this, ToggleLayoutButton);

    _this = _super.call(this, props);
    _this.handleLayoutToggle = _.throttle(_this.handleLayoutToggle.bind(_assertThisInitialized(_this)), 350);
    return _this;
  }

  _createClass(ToggleLayoutButton, [{
    key: "handleLayoutToggle",
    value: function handleLayoutToggle() {
      var _this$props = this.props,
          windowWidth = _this$props.windowWidth,
          isFullscreen = _this$props.isFullscreen,
          toggleFullScreen = _this$props.toggleFullScreen;
      if (!SearchResultTable.isDesktopClientside(windowWidth)) return null;

      if (typeof toggleFullScreen !== 'function') {
        console.error('No toggleFullscreen function passed in.');
        return null;
      }

      setTimeout(toggleFullScreen, 0, !isFullscreen);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          isFullscreen = _this$props2.isFullscreen,
          className = _this$props2.className;
      var cls = className + " expand-layout-button" + (!isFullscreen ? '' : ' expanded');
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: cls,
        onClick: this.handleLayoutToggle,
        "data-tip": (!isFullscreen ? 'Expand' : 'Collapse') + " table width"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw fas icon-" + (!isFullscreen ? 'arrows-alt-h icon-expand' : 'compress')
      }), /*#__PURE__*/React.createElement("span", {
        className: "ml-05 d-none d-xl-inline"
      }, !isFullscreen ? "Full Screen" : "Collapse Table Width"));
    }
  }]);

  return ToggleLayoutButton;
}(React.PureComponent);
ToggleLayoutButton.propTypes = {
  'windowWidth': PropTypes.number.isRequired,
  'isFullscreen': PropTypes.bool.isRequired,
  'toggleFullScreen': PropTypes.func.isRequired,
  'className': PropTypes.string
};
ToggleLayoutButton.defaultProps = {
  'className': "btn btn-outline-primary"
};