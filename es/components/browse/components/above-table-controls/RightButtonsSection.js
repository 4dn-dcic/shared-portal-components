import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
function _callSuper(_this, derived, args) {
  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, function () {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
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
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? "btn btn-outline-primary" : _ref$className;
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
    className: "icon icon-fw icon-angle-down ms-03 fas"
  }));
});
export var MultiColumnSortButton = /*#__PURE__*/React.memo(function (_ref2) {
  var open = _ref2.open,
    onClick = _ref2.onClick,
    _ref2$className = _ref2.className,
    className = _ref2$className === void 0 ? "btn btn-outline-primary" : _ref2$className;
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
    className: "icon icon-fw icon-angle-down ms-03 fas"
  }));
});

/** Toggles between regular & full screen views */
export var ToggleLayoutButton = /*#__PURE__*/function (_React$PureComponent) {
  function ToggleLayoutButton(props) {
    var _this2;
    _classCallCheck(this, ToggleLayoutButton);
    _this2 = _callSuper(this, ToggleLayoutButton, [props]);
    _this2.handleLayoutToggle = _.throttle(_this2.handleLayoutToggle.bind(_this2), 350);
    return _this2;
  }
  _inherits(ToggleLayoutButton, _React$PureComponent);
  return _createClass(ToggleLayoutButton, [{
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
        className: "ms-05 d-none d-xl-inline"
      }, !isFullscreen ? "Full Screen" : "Collapse Table Width"));
    }
  }]);
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