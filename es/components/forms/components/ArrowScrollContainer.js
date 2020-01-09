"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerticalScrollContainer = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var VerticalScrollContainer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(VerticalScrollContainer, _React$PureComponent);

  function VerticalScrollContainer() {
    _classCallCheck(this, VerticalScrollContainer);

    return _possibleConstructorReturn(this, _getPrototypeOf(VerticalScrollContainer).apply(this, arguments));
  }

  _createClass(VerticalScrollContainer, [{
    key: "render",
    // static defaultProps = {
    //     'scrollRate' : 10
    // }
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         scrollPosition: 0,
    //     };
    //     this.scrolling = false;
    // }
    // handleScrollUpHoverStart(e) {
    //     this.scrolling = true;
    //     this.performScrollAction("up");
    // }
    // handleScrollDownHoverStart(e) {
    //     this.scrolling = true;
    //     this.performScrollAction("down");
    // }
    // handleScrollDownHoverEnd(e) {
    //     this.scrolling = false;
    // }
    // performScrollAction(direction) {
    //     // todo: handle scroll
    // }
    value: function render() {
      var _this$props = this.props,
          _this$props$items = _this$props.items,
          items = _this$props$items === void 0 ? [] : _this$props$items,
          header = _this$props.header,
          footer = _this$props.footer; // const { scrollPosition } = this.state;

      console.log(items);
      var enoughItems = items.length > 5; // todo: update to take into account individual item heights
      // and see how many will fill the container

      // todo: add some logic
      return _react["default"].createElement("div", {
        className: "arrow-scroll-container"
      }, null, _react["default"].createElement("div", {
        className: "scrollable-list-container"
      }, _react["default"].createElement("ul", {
        className: "scroll-items list-unstyled mb-0 py-2"
      }, header, items, footer)), enoughItems && true ? _react["default"].createElement("a", {
        className: "button-scroll arrow-down d-block text-center",
        style: {
          boxShadow: "0 -10px 10px 30px rgba(200,200,200,0.2)",
          color: "#cccccc"
        }
      }, _react["default"].createElement("i", {
        className: "icon fas icon-angle-down"
      })) : null);
    }
  }]);

  return VerticalScrollContainer;
}(_react["default"].PureComponent);

exports.VerticalScrollContainer = VerticalScrollContainer;
VerticalScrollContainer.propTypes = {
  items: _propTypes["default"].arrayOf(_propTypes["default"].any),
  header: _propTypes["default"].any,
  footer: _propTypes["default"].any
};