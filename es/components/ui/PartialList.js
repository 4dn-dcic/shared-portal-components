'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PartialList = void 0;

var _react = _interopRequireDefault(require("react"));

var _Collapse = require("./Collapse");

var _util = require("./../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Bootstrap 'Row' component which may be used in PartialList's props.collapsible or props.persistent.
 * Renders two row columns: one for props.label and one for props.value or props.children.
 *
 * @memberof module:item-pages/components.PartialList
 * @namespace
 * @type {Component}
 * @prop {Component|Element|string} label - Label to use in left column.
 * @prop {Component|Element|string} value - Value to use in right column.
 * @prop {string} className - Classname to add to '.row.list-item'.
 * @prop {number} colSm - Grid size (1-12) of label column at *small* screen sizes.
 * @prop {number} colMd - Grid size (1-12) of label column at *medium* screen sizes.
 * @prop {number} colLg - Grid size (1-12) of label column at *large* screen sizes.
 * @prop {Component|Element|string} title - Alias for props.label.
 * @prop {Component|Element|string} children - Alias for props.value.
 */
var Row = _react["default"].memo(function (props) {
  var colSm = props.colSm,
      colMd = props.colMd,
      colLg = props.colLg,
      className = props.className,
      label = props.label,
      title = props.title,
      value = props.value,
      val = props.val,
      children = props.children;
  var valSm = 12 - colSm;
  var valMd = 12 - colMd;
  var valLg = 12 - colLg;
  if (valSm < 3) valSm = 12;
  if (valMd < 3) valMd = 12;
  if (valLg < 3) valLg = 12;
  return _react["default"].createElement("div", {
    className: "row list-item " + className
  }, _react["default"].createElement("div", {
    className: "item-label col-sm-" + colSm + " col-md-" + colMd + " col-lg-" + colLg
  }, _react["default"].createElement("div", {
    className: "inner"
  }, label || title || "Label")), _react["default"].createElement("div", {
    className: "item-value col-sm-" + valSm + " col-md-" + valMd + " col-lg-" + valLg
  }, _react["default"].createElement("div", {
    className: "inner"
  }, value || val || children || "Value")));
});

Row.defaultProps = {
  'colSm': 12,
  'colMd': 4,
  'colLg': 4,
  'className': ''
};
/**
 * Renders a list using elements along the Bootstrap grid.
 * Takes two lists as props: 'persistent' and 'collapsible'.
 * Persistent items are always visible, while collapsible are only shown if props.open is true.
 *
 * @type {Component}
 * @prop {Component[]|Element[]|string[]} persistent    - React elements or components to always render.
 * @prop {Component[]|Element[]|string[]} collapsible   - React elements or components to render conditionally.
 * @prop {boolean} open          - Show collapsed items or not.
 * @prop {string}  className     - Class name for outermost element.
 * @prop {string}  containerType - Type of element to use as container for the two lists. Defaults to 'div'.
 */

var PartialList =
/*#__PURE__*/
function (_React$Component) {
  _inherits(PartialList, _React$Component);

  _createClass(PartialList, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props) {
      if (typeof props.open === 'boolean') {
        return {
          "open": props.open
        };
      }

      return null;
    }
  }]);

  function PartialList(props) {
    var _this;

    _classCallCheck(this, PartialList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PartialList).call(this, props));
    _this.state = {
      'open': false
    };
    return _this;
  }
  /** TODO implement handleToggle fxn and pass to child */


  _createClass(PartialList, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          containerClassName = _this$props.containerClassName,
          containerType = _this$props.containerType,
          collapsible = _this$props.collapsible,
          persistent = _this$props.persistent,
          children = _this$props.children;
      var open = this.state.open;
      return _react["default"].createElement("div", {
        className: "expandable-list " + (className || '')
      }, _react["default"].createElement(containerType, {
        'className': containerClassName
      }, persistent || children), collapsible.length > 0 ? _react["default"].createElement(_Collapse.Collapse, {
        "in": open
      }, _react["default"].createElement("div", null, _react["default"].createElement(containerType, {
        'className': containerClassName
      }, collapsible))) : null);
    }
  }]);

  return PartialList;
}(_react["default"].Component);

exports.PartialList = PartialList;

_defineProperty(PartialList, "Row", Row);

PartialList.defaultProps = {
  'className': null,
  'containerClassName': null,
  'containerType': 'div',
  'persistent': [],
  'collapsible': [],
  'open': null
};