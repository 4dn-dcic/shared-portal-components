'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboveTableControlsBase = void 0;

var _react = _interopRequireDefault(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _underscore = _interopRequireDefault(require("underscore"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _Collapse = require("./../../../ui/Collapse");

var _AboveTablePanelWrapper = require("./AboveTablePanelWrapper");

var _RightButtonsSection = require("./RightButtonsSection");

var _CustomColumnController = require("./../CustomColumnController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AboveTableControlsBase = function (_React$PureComponent) {
  _inherits(AboveTableControlsBase, _React$PureComponent);

  _createClass(AboveTableControlsBase, null, [{
    key: "getCustomColumnSelectorPanelMapDefinition",
    value: function getCustomColumnSelectorPanelMapDefinition(props) {
      return {
        "customColumns": {
          "title": _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("i", {
            className: "icon icon-fw icon-gear fas"
          }), _react["default"].createElement("span", {
            className: "title-contents"
          }, "Configure Visible Columns")),
          "body": _react["default"].createElement(_CustomColumnController.CustomColumnSelector, _underscore["default"].pick(props, 'hiddenColumns', 'addHiddenColumn', 'removeHiddenColumn', 'columnDefinitions')),
          "className": "visible-columns-selector-panel"
        }
      };
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (state.open && typeof state.open === 'string') {
        var currPanelDefinition = props.panelMap[state.open];

        if (currPanelDefinition && currPanelDefinition.close) {
          return {
            "open": false,
            "reallyOpen": false
          };
        }
      }

      return null;
    }
  }]);

  function AboveTableControlsBase(props) {
    var _this;

    _classCallCheck(this, AboveTableControlsBase);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AboveTableControlsBase).call(this, props));
    _this.handleOpenToggle = _underscore["default"].throttle(_this.handleOpenToggle.bind(_assertThisInitialized(_this)), 350);
    _this.handleClose = _this.handleOpenToggle.bind(_assertThisInitialized(_this), false);
    _this.handleOpenColumnsSelectionPanel = _this.handleOpenToggle.bind(_assertThisInitialized(_this), 'customColumns');
    _this.panelToggleFxns = {};

    _underscore["default"].forEach(_underscore["default"].keys(props.panelMap), function (key) {
      _this.panelToggleFxns[key] = _this.handleOpenToggle.bind(_assertThisInitialized(_this), key);
    });

    _this.state = {
      'open': false,
      'reallyOpen': false
    };
    return _this;
  }

  _createClass(AboveTableControlsBase, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props = this.props,
          isFullscreen = _this$props.isFullscreen,
          parentForceUpdate = _this$props.parentForceUpdate;
      var open = this.state.open;

      if (open && prevState.open !== open) {
        _reactTooltip["default"].rebuild();
      }

      if (prevProps.isFullscreen !== isFullscreen && typeof parentForceUpdate === 'function') {
        setTimeout(parentForceUpdate, 100);
      }
    }
  }, {
    key: "handleOpenToggle",
    value: function handleOpenToggle(value) {
      var _this2 = this;

      if (this.timeout) {
        clearTimeout(this.timeout);
        delete this.timeout;
      }

      this.setState(function (_ref) {
        var open = _ref.open;
        var nextState = {};

        if (typeof value === 'string' && open === value) {
          nextState.open = false;
        } else {
          nextState.open = value;
        }

        if (nextState.open) {
          nextState.reallyOpen = nextState.open;
        }

        return nextState;
      }, function () {
        var _this2$state = _this2.state,
            open = _this2$state.open,
            reallyOpen = _this2$state.reallyOpen;
        setTimeout(_reactTooltip["default"].rebuild, 100);

        if (!open && reallyOpen) {
          _this2.timeout = setTimeout(function () {
            _this2.setState({
              'reallyOpen': false
            });
          }, 400);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          children = _this$props2.children,
          _this$props2$panelMap = _this$props2.panelMap,
          panelMap = _this$props2$panelMap === void 0 ? {} : _this$props2$panelMap;
      var _this$state = this.state,
          open = _this$state.open,
          reallyOpen = _this$state.reallyOpen;

      var extendedChildren = _react["default"].Children.map(children, function (child) {
        return _react["default"].cloneElement(child, {
          "panelToggleFxns": _this3.panelToggleFxns,
          "onClosePanel": _this3.handleClose,
          "currentOpenPanel": open || reallyOpen
        });
      });

      var panelDefinition = panelMap[open] || panelMap[reallyOpen] || null;

      var _ref2 = panelDefinition || {},
          panelTitle = _ref2.title,
          panelBody = _ref2.body,
          panelCls = _ref2.className;

      return _react["default"].createElement("div", {
        className: "above-results-table-row"
      }, _react["default"].createElement("div", {
        className: "row"
      }, extendedChildren, _react["default"].createElement(_RightButtonsSection.RightButtonsSection, _extends({}, _underscore["default"].pick(this.props, 'isFullscreen', 'windowWidth', 'toggleFullScreen'), {
        currentOpenPanel: open || reallyOpen,
        onColumnsBtnClick: this.panelToggleFxns.customColumns
      }))), panelDefinition ? _react["default"].createElement(_Collapse.Collapse, {
        "in": !!open,
        appear: true
      }, _react["default"].createElement(_AboveTablePanelWrapper.AboveTablePanelWrapper, {
        className: panelCls,
        onClose: this.handleClose,
        title: panelTitle
      }, panelBody)) : null);
    }
  }]);

  return AboveTableControlsBase;
}(_react["default"].PureComponent);

exports.AboveTableControlsBase = AboveTableControlsBase;
AboveTableControlsBase.defaultProps = {
  "panelMap": {
    "customColumns": {
      "title": _react["default"].createElement("span", null, _react["default"].createElement("i", {
        className: "icon icon-fw icon-gear fas"
      }), " hello world"),
      "body": "Hello World",
      "className": "visible-columns-selector-panel"
    }
  }
};