'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleLayoutButton = exports.ConfigureVisibleColumnsButton = exports.RightButtonsSection = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _SearchResultTable = require("./../SearchResultTable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RightButtonsSection = _react["default"].memo(function (props) {
  var currentOpenPanel = props.currentOpenPanel,
      onColumnsBtnClick = props.onColumnsBtnClick,
      windowWidth = props.windowWidth,
      isFullscreen = props.isFullscreen,
      toggleFullScreen = props.toggleFullScreen;
  return _react["default"].createElement("div", {
    className: "right-buttons"
  }, _react["default"].createElement(ConfigureVisibleColumnsButton, {
    onClick: onColumnsBtnClick,
    open: currentOpenPanel === "customColumns"
  }), typeof windowWidth === 'number' && typeof isFullscreen === 'boolean' && typeof toggleFullScreen === 'function' ? _react["default"].createElement(ToggleLayoutButton, {
    windowWidth: windowWidth,
    isFullscreen: isFullscreen,
    toggleFullScreen: toggleFullScreen
  }) : null);
});

exports.RightButtonsSection = RightButtonsSection;

var ConfigureVisibleColumnsButton = _react["default"].memo(function (_ref) {
  var open = _ref.open,
      onClick = _ref.onClick,
      className = _ref.className;
  return _react["default"].createElement("button", {
    type: "button",
    key: "toggle-visible-columns",
    "data-tip": "Configure visible columns",
    "data-event-off": "click",
    active: open.toString(),
    onClick: onClick,
    className: (className || "") + (open ? " active" : "")
  }, _react["default"].createElement("i", {
    className: "icon icon-fw icon-table fas"
  }), _react["default"].createElement("i", {
    className: "icon icon-fw icon-angle-down ml-03 fas"
  }));
});

exports.ConfigureVisibleColumnsButton = ConfigureVisibleColumnsButton;
ConfigureVisibleColumnsButton.defaultProps = {
  "className": "btn btn-outline-primary"
};

var ToggleLayoutButton = function (_React$PureComponent) {
  _inherits(ToggleLayoutButton, _React$PureComponent);

  function ToggleLayoutButton(props) {
    var _this;

    _classCallCheck(this, ToggleLayoutButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ToggleLayoutButton).call(this, props));
    _this.handleLayoutToggle = _underscore["default"].throttle(_this.handleLayoutToggle.bind(_assertThisInitialized(_this)), 350);
    return _this;
  }

  _createClass(ToggleLayoutButton, [{
    key: "handleLayoutToggle",
    value: function handleLayoutToggle() {
      var _this$props = this.props,
          windowWidth = _this$props.windowWidth,
          isFullscreen = _this$props.isFullscreen,
          toggleFullScreen = _this$props.toggleFullScreen;
      if (!_SearchResultTable.SearchResultTable.isDesktopClientside(windowWidth)) return null;

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
      return _react["default"].createElement("button", {
        type: "button",
        className: cls,
        onClick: this.handleLayoutToggle,
        "data-tip": (!isFullscreen ? 'Expand' : 'Collapse') + " table width"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas icon-" + (!isFullscreen ? 'arrows-alt-h icon-expand' : 'compress')
      }));
    }
  }]);

  return ToggleLayoutButton;
}(_react["default"].PureComponent);

exports.ToggleLayoutButton = ToggleLayoutButton;
ToggleLayoutButton.propTypes = {
  'windowWidth': _propTypes["default"].number.isRequired,
  'isFullscreen': _propTypes["default"].bool.isRequired,
  'toggleFullScreen': _propTypes["default"].func.isRequired,
  'className': _propTypes["default"].string
};
ToggleLayoutButton.defaultProps = {
  'className': "btn btn-outline-primary"
};