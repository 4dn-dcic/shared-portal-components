"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerticalScrollContainer = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = require("underscore");

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var VerticalScrollContainer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(VerticalScrollContainer, _React$PureComponent);

  function VerticalScrollContainer(props) {
    var _this;

    _classCallCheck(this, VerticalScrollContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VerticalScrollContainer).call(this, props));
    _this.state = {
      hasOverflow: false,
      canScrollUp: false,
      canScrollDown: false
    };
    _this.scrollContainer = _react["default"].createRef();
    _this.handleScrollDown = _this.handleScrollDown.bind(_assertThisInitialized(_this));
    _this.handleScrollUp = _this.handleScrollUp.bind(_assertThisInitialized(_this));
    _this.performScrollAction = _this.performScrollAction.bind(_assertThisInitialized(_this));
    _this.checkForOverflow = _this.checkForOverflow.bind(_assertThisInitialized(_this));
    _this.checkForScrollPosition = _this.checkForScrollPosition.bind(_assertThisInitialized(_this));
    _this.debounceCheckforOverflow = (0, _underscore.debounce)(_this.checkForOverflow, 500, true);
    _this.debounceCheckForScrollPosition = (0, _underscore.debounce)(_this.checkForScrollPosition, 50, false);
    return _this;
  }

  _createClass(VerticalScrollContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.checkForOverflow();
      this.checkForScrollPosition();
      this.scrollContainer.current.addEventListener('scroll', this.debounceCheckForScrollPosition);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props$items = this.props.items,
          items = _this$props$items === void 0 ? [] : _this$props$items;
      var _prevProps$items = prevProps.items,
          prevItems = _prevProps$items === void 0 ? [] : _prevProps$items;

      if (prevItems.length !== items.length) {
        this.checkForOverflow();
        this.checkForScrollPosition();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.scrollContainer.current.removeEventListener('scroll', this.debounceCheckForScrollPosition);
      this.debounceCheckforOverflow.cancel();
    }
  }, {
    key: "checkForScrollPosition",
    value: function checkForScrollPosition() {
      // console.log("checking for scroll position");
      var _this$scrollContainer = this.scrollContainer.current,
          scrollTop = _this$scrollContainer.scrollTop,
          scrollHeight = _this$scrollContainer.scrollHeight,
          clientHeight = _this$scrollContainer.clientHeight; // console.log(this.scrollContainer.current);
      // console.log("scrollHeight: ", scrollHeight);
      // console.log("clientHeight: ", clientHeight);
      // console.log("scrollTop", scrollTop);

      this.setState({
        canScrollUp: scrollTop >= 5,
        canScrollDown: scrollTop !== scrollHeight - clientHeight
      });
    }
  }, {
    key: "checkForOverflow",
    value: function checkForOverflow() {
      // take into account individual item heights
      // and see how many will fill the container
      var _this$scrollContainer2 = this.scrollContainer.current,
          scrollHeight = _this$scrollContainer2.scrollHeight,
          clientHeight = _this$scrollContainer2.clientHeight;
      this.setState({
        hasOverflow: scrollHeight > clientHeight
      });
    }
  }, {
    key: "handleScrollUp",
    value: function handleScrollUp() {
      var scrollRate = this.props.scrollRate;
      this.performScrollAction(scrollRate);
      this.checkForScrollPosition();
    }
  }, {
    key: "handleScrollDown",
    value: function handleScrollDown() {
      var scrollRate = this.props.scrollRate;
      this.performScrollAction(0 - scrollRate);
      this.checkForScrollPosition();
    }
  }, {
    key: "performScrollAction",
    value: function performScrollAction(scrollNum) {
      this.scrollContainer.current.scrollBy(0, {
        behavior: 'smooth',
        top: scrollNum
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$items2 = _this$props.items,
          items = _this$props$items2 === void 0 ? [] : _this$props$items2,
          header = _this$props.header,
          footer = _this$props.footer;
      var _this$state = this.state,
          hasOverflow = _this$state.hasOverflow,
          canScrollUp = _this$state.canScrollUp,
          canScrollDown = _this$state.canScrollDown;
      return _react["default"].createElement("div", {
        className: "arrow-scroll-container"
      }, hasOverflow && canScrollUp ? _react["default"].createElement("button", {
        className: "button-scroll arrow-up d-block text-center w-100",
        style: {
          boxShadow: "0 10px 10px 3px rgba(200,200,200,0.2)",
          color: "#cccccc",
          border: "unset",
          borderBottom: "#eeeeee solid 1px",
          backgroundColor: "#f8f8f8"
        },
        onClick: this.handleScrollUp,
        type: "button"
      }, _react["default"].createElement("i", {
        className: "icon fas icon-angle-up"
      })) : null, _react["default"].createElement("div", {
        className: "scrollable-list-container",
        ref: this.scrollContainer
      }, _react["default"].createElement("ul", {
        className: "scroll-items list-unstyled mb-0 py-2"
      }, header, items, footer)), hasOverflow && canScrollDown ? _react["default"].createElement("button", {
        className: "button-scroll arrow-down d-block text-center w-100",
        style: {
          boxShadow: "0 -10px 10px 30px rgba(200,200,200,0.2)",
          color: "#cccccc",
          border: "unset",
          borderTop: "#eeeeee solid 1px",
          backgroundColor: "#f8f8f8"
        },
        onClick: this.handleScrollDown,
        type: "button"
      }, _react["default"].createElement("i", {
        className: "icon fas icon-angle-down"
      })) : null);
    }
  }]);

  return VerticalScrollContainer;
}(_react["default"].PureComponent);

exports.VerticalScrollContainer = VerticalScrollContainer;

_defineProperty(VerticalScrollContainer, "defaultProps", {
  'scrollRate': 100
});

VerticalScrollContainer.propTypes = {
  scrollRate: _propTypes["default"].number,
  items: _propTypes["default"].arrayOf(_propTypes["default"].any),
  header: _propTypes["default"].any,
  footer: _propTypes["default"].any
};