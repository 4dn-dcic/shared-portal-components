"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerticalScrollContainer = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = require("underscore");

var _utilities = require("./../../viz/utilities");

var _Fade = require("./../../ui/Fade");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
Button scrolling code adapted from:
https://tj.ie/scrollable-container-controls-with-react/

This component is used by:
    - SearchSelectionMenu.js
*/
var VerticalScrollContainer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(VerticalScrollContainer, _React$PureComponent);

  var _super = _createSuper(VerticalScrollContainer);

  function VerticalScrollContainer(props) {
    var _this;

    _classCallCheck(this, VerticalScrollContainer);

    _this = _super.call(this, props);
    _this.state = {
      hasOverflow: false,
      canScrollUp: false,
      canScrollDown: false,
      scrollingDirection: null
    };
    _this.scrollContainer = _react["default"].createRef();
    _this.onMouseDownJumpToTop = _this.onMouseDownJumpToTop.bind(_assertThisInitialized(_this));
    _this.onMouseDownJumpToBottom = _this.onMouseDownJumpToBottom.bind(_assertThisInitialized(_this));
    _this.onMouseOverScrollDown = _this.onMouseOverScrollDown.bind(_assertThisInitialized(_this));
    _this.onMouseOverScrollUp = _this.onMouseOverScrollUp.bind(_assertThisInitialized(_this));
    _this.onMouseUp = _this.onMouseUp.bind(_assertThisInitialized(_this));
    _this.performScrollAction = _this.performScrollAction.bind(_assertThisInitialized(_this));
    _this.performJumpToAction = _this.performJumpToAction.bind(_assertThisInitialized(_this));
    _this.checkForOverflow = _this.checkForOverflow.bind(_assertThisInitialized(_this));
    _this.checkForScrollPosition = _this.checkForScrollPosition.bind(_assertThisInitialized(_this));
    _this.checkArrowKeyScrollPosition = _this.checkArrowKeyScrollPosition.bind(_assertThisInitialized(_this));
    _this.debounceCheckforOverflow = (0, _underscore.debounce)(_this.checkForOverflow, 500, true);
    _this.debounceCheckForScrollPosition = (0, _underscore.debounce)(_this.checkForScrollPosition, 100, false);
    _this.debounceCheckForScrollPositionImmediate = (0, _underscore.debounce)(_this.checkForScrollPosition, 100, true);
    return _this;
  }

  _createClass(VerticalScrollContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.checkForOverflow();
      this.checkForScrollPosition(); // handle both arrow key and touch screen scroll

      this.scrollContainer.current.addEventListener('scroll', this.debounceCheckForScrollPosition);
      this.scrollContainer.current.addEventListener('keyup', this.checkArrowKeyScrollPosition);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props$items = this.props.items,
          items = _this$props$items === void 0 ? [] : _this$props$items;
      var _this$state = this.state,
          canScrollUp = _this$state.canScrollUp,
          canScrollDown = _this$state.canScrollDown,
          scrollingDirection = _this$state.scrollingDirection;
      var _prevProps$items = prevProps.items,
          prevItems = _prevProps$items === void 0 ? [] : _prevProps$items;
      var couldScrollUp = prevState.canScrollUp,
          couldScrollDown = prevState.canScrollDown;

      if (prevItems.length !== items.length) {
        this.checkForOverflow();
        this.checkForScrollPosition();
      } else if ( // fix for this bug: https://gyazo.com/a0bc3353ddcb6066c5d494e5a7e6d837 that occurs when a button component
      // unmounts as a result of reaching top/bottom of scroll container without calling onMouseUp (mouse is on button until unmounted)
      (couldScrollUp && !canScrollUp || couldScrollDown && !canScrollDown) && scrollingDirection !== null) {
        this.setState({
          scrollingDirection: null
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.scrollContainer.current.removeEventListener('scroll', this.debounceCheckForScrollPosition);
      this.scrollContainer.current.removeEventListener('keyup', this.checkArrowKeyScrollPosition);
      this.debounceCheckforOverflow.cancel();
    }
  }, {
    key: "checkArrowKeyScrollPosition",
    value: function checkArrowKeyScrollPosition(e) {
      // for lists scrollable via arrowkey, update button state after keypress ends
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        this.debounceCheckForScrollPosition();
      }
    }
  }, {
    key: "checkForScrollPosition",
    value: function checkForScrollPosition() {
      // updates state when clientHeight touches the top or bottom bounds of scrollHeight
      var _this$scrollContainer = this.scrollContainer.current,
          scrollTop = _this$scrollContainer.scrollTop,
          scrollHeight = _this$scrollContainer.scrollHeight,
          clientHeight = _this$scrollContainer.clientHeight;
      this.setState({
        canScrollUp: scrollTop >= 5,
        canScrollDown: scrollTop !== scrollHeight - clientHeight
      });
    }
  }, {
    key: "checkForOverflow",
    value: function checkForOverflow() {
      // compare height of all items (scrollHeight) to height of containing div (clientHeight)
      var _this$scrollContainer2 = this.scrollContainer.current,
          scrollHeight = _this$scrollContainer2.scrollHeight,
          clientHeight = _this$scrollContainer2.clientHeight;
      this.setState({
        hasOverflow: scrollHeight > clientHeight
      });
    }
  }, {
    key: "onMouseOverScrollUp",
    value: function onMouseOverScrollUp() {
      var _this2 = this;

      this.setState({
        scrollingDirection: -1
      }, function () {
        (0, _utilities.requestAnimationFrame)(_this2.performScrollAction);
      });
    }
  }, {
    key: "onMouseDownJumpToTop",
    value: function onMouseDownJumpToTop() {
      var _this3 = this;

      this.setState({
        scrollingDirection: -1
      }, function () {
        (0, _utilities.requestAnimationFrame)(_this3.performJumpToAction);
      });
    }
  }, {
    key: "onMouseOverScrollDown",
    value: function onMouseOverScrollDown() {
      var _this4 = this;

      this.setState({
        scrollingDirection: 1
      }, function () {
        (0, _utilities.requestAnimationFrame)(_this4.performScrollAction);
      });
    }
  }, {
    key: "onMouseDownJumpToBottom",
    value: function onMouseDownJumpToBottom() {
      var _this5 = this;

      this.setState({
        scrollingDirection: 1
      }, function () {
        (0, _utilities.requestAnimationFrame)(_this5.performJumpToAction);
      });
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.setState({
        scrollingDirection: null
      });
      this.checkForScrollPosition();
    }
  }, {
    key: "performJumpToAction",
    value: function performJumpToAction() {
      var _this$state$scrolling = this.state.scrollingDirection,
          scrollingDirection = _this$state$scrolling === void 0 ? null : _this$state$scrolling;
      var scrollableHeight = this.scrollContainer.current.scrollHeight;
      if (scrollingDirection === null) return false;
      this.scrollContainer.current.scrollBy({
        behavior: 'smooth',
        top: scrollableHeight * scrollingDirection
      });
      this.setState({
        scrollingDirection: null
      });
      this.checkForScrollPosition();
    }
  }, {
    key: "performScrollAction",
    value: function performScrollAction() {
      var scrollRate = this.props.scrollRate;
      var _this$state$scrolling2 = this.state.scrollingDirection,
          scrollingDirection = _this$state$scrolling2 === void 0 ? null : _this$state$scrolling2;
      if (scrollingDirection === null) return false;
      this.scrollContainer.current.scrollBy({
        behavior: 'smooth',
        top: scrollRate * scrollingDirection
      });
      (0, _utilities.requestAnimationFrame)(this.performScrollAction);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$items2 = _this$props.items,
          items = _this$props$items2 === void 0 ? [] : _this$props$items2,
          header = _this$props.header,
          footer = _this$props.footer;
      var _this$state2 = this.state,
          hasOverflow = _this$state2.hasOverflow,
          canScrollUp = _this$state2.canScrollUp,
          canScrollDown = _this$state2.canScrollDown;
      return (
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "vertical-scroll-container"
        },
        /*#__PURE__*/
        _react["default"].createElement(_Fade.Fade, {
          "in": hasOverflow && canScrollUp,
          timeout: "500",
          mountOnEnter: true,
          unmountOnExit: true
        },
        /*#__PURE__*/
        _react["default"].createElement("button", {
          type: "button",
          className: "button-scroll arrow-up d-block text-center w-100",
          onClick: this.onMouseDownJumpToTop,
          disabled: !canScrollUp,
          onMouseOver: this.onMouseOverScrollUp,
          onMouseOut: this.onMouseUp
        },
        /*#__PURE__*/
        _react["default"].createElement("i", {
          className: "icon fas icon-angle-up"
        }))),
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "scrollable-list-container",
          ref: this.scrollContainer
        },
        /*#__PURE__*/
        _react["default"].createElement("ul", {
          className: "scroll-items list-unstyled my-0"
        }, header, items, footer)),
        /*#__PURE__*/
        _react["default"].createElement(_Fade.Fade, {
          "in": hasOverflow && canScrollDown,
          timeout: "500",
          mountOnEnter: true,
          unmountOnExit: true
        },
        /*#__PURE__*/
        _react["default"].createElement("button", {
          type: "button",
          className: "button-scroll arrow-down d-block text-center w-100",
          onClick: this.onMouseDownJumpToBottom,
          disabled: !canScrollDown,
          onMouseOver: this.onMouseOverScrollDown,
          onMouseOut: this.onMouseUp
        },
        /*#__PURE__*/
        _react["default"].createElement("i", {
          className: "icon fas icon-angle-down"
        }))))
      );
    }
  }]);

  return VerticalScrollContainer;
}(_react["default"].PureComponent);

exports.VerticalScrollContainer = VerticalScrollContainer;

_defineProperty(VerticalScrollContainer, "defaultProps", {
  'scrollRate': 40
});

VerticalScrollContainer.propTypes = {
  scrollRate: _propTypes["default"].number,
  items: _propTypes["default"].arrayOf(_propTypes["default"].any),
  header: _propTypes["default"].any,
  footer: _propTypes["default"].any
};