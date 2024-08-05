import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
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
import { debounce } from 'underscore';
import Fade from 'react-bootstrap/esm/Fade';
import { requestAnimationFrame as raf } from './../../viz/utilities';

/*
Button scrolling code adapted from:
https://tj.ie/scrollable-container-controls-with-react/

This component is used by:
    - SearchSelectionMenu.js
*/
export var VerticalScrollContainer = /*#__PURE__*/function (_React$PureComponent) {
  function VerticalScrollContainer(props) {
    var _this2;
    _classCallCheck(this, VerticalScrollContainer);
    _this2 = _callSuper(this, VerticalScrollContainer, [props]);
    _this2.state = {
      hasOverflow: false,
      canScrollUp: false,
      canScrollDown: false,
      scrollingDirection: null
    };
    _this2.scrollContainer = /*#__PURE__*/React.createRef();
    _this2.onMouseDownJumpToTop = _this2.onMouseDownJumpToTop.bind(_this2);
    _this2.onMouseDownJumpToBottom = _this2.onMouseDownJumpToBottom.bind(_this2);
    _this2.onMouseOverScrollDown = _this2.onMouseOverScrollDown.bind(_this2);
    _this2.onMouseOverScrollUp = _this2.onMouseOverScrollUp.bind(_this2);
    _this2.onMouseUp = _this2.onMouseUp.bind(_this2);
    _this2.performScrollAction = _this2.performScrollAction.bind(_this2);
    _this2.performJumpToAction = _this2.performJumpToAction.bind(_this2);
    _this2.checkForOverflow = _this2.checkForOverflow.bind(_this2);
    _this2.checkForScrollPosition = _this2.checkForScrollPosition.bind(_this2);
    _this2.checkArrowKeyScrollPosition = _this2.checkArrowKeyScrollPosition.bind(_this2);
    _this2.debounceCheckforOverflow = debounce(_this2.checkForOverflow, 500, true);
    _this2.debounceCheckForScrollPosition = debounce(_this2.checkForScrollPosition, 100, false);
    _this2.debounceCheckForScrollPositionImmediate = debounce(_this2.checkForScrollPosition, 100, true);
    return _this2;
  }
  _inherits(VerticalScrollContainer, _React$PureComponent);
  return _createClass(VerticalScrollContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.checkForOverflow();
      this.checkForScrollPosition();

      // handle both arrow key and touch screen scroll
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
      } else if (
      // fix for this bug: https://gyazo.com/a0bc3353ddcb6066c5d494e5a7e6d837 that occurs when a button component
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
      var _this3 = this;
      this.setState({
        scrollingDirection: -1
      }, function () {
        raf(_this3.performScrollAction);
      });
    }
  }, {
    key: "onMouseDownJumpToTop",
    value: function onMouseDownJumpToTop() {
      var _this4 = this;
      this.setState({
        scrollingDirection: -1
      }, function () {
        raf(_this4.performJumpToAction);
      });
    }
  }, {
    key: "onMouseOverScrollDown",
    value: function onMouseOverScrollDown() {
      var _this5 = this;
      this.setState({
        scrollingDirection: 1
      }, function () {
        raf(_this5.performScrollAction);
      });
    }
  }, {
    key: "onMouseDownJumpToBottom",
    value: function onMouseDownJumpToBottom() {
      var _this6 = this;
      this.setState({
        scrollingDirection: 1
      }, function () {
        raf(_this6.performJumpToAction);
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
      raf(this.performScrollAction);
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
      return /*#__PURE__*/React.createElement("div", {
        className: "vertical-scroll-container"
      }, /*#__PURE__*/React.createElement(Fade, {
        "in": hasOverflow && canScrollUp,
        timeout: 500,
        mountOnEnter: true,
        unmountOnExit: true
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "button-scroll arrow-up d-block text-center w-100",
        onClick: this.onMouseDownJumpToTop,
        disabled: !canScrollUp,
        onMouseOver: this.onMouseOverScrollUp,
        onMouseOut: this.onMouseUp
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-angle-up"
      }))), /*#__PURE__*/React.createElement("div", {
        className: "scrollable-list-container",
        ref: this.scrollContainer
      }, /*#__PURE__*/React.createElement("ul", {
        className: "scroll-items list-unstyled my-0"
      }, header, items, footer)), /*#__PURE__*/React.createElement(Fade, {
        "in": hasOverflow && canScrollDown,
        timeout: 500,
        mountOnEnter: true,
        unmountOnExit: true
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "button-scroll arrow-down d-block text-center w-100",
        onClick: this.onMouseDownJumpToBottom,
        disabled: !canScrollDown,
        onMouseOver: this.onMouseOverScrollDown,
        onMouseOut: this.onMouseUp
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-angle-down"
      }))));
    }
  }]);
}(React.PureComponent);
_defineProperty(VerticalScrollContainer, "defaultProps", {
  'scrollRate': 40
});
VerticalScrollContainer.propTypes = {
  scrollRate: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.any),
  header: PropTypes.any,
  footer: PropTypes.any
};