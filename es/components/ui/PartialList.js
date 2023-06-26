function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
import React from 'react';
import Collapse from 'react-bootstrap/esm/Collapse';
import { console } from './../util';

/**
 * Bootstrap 'Row' component which may be used in PartialList's props.collapsible or props.persistent.
 * Renders two row columns: one for props.label and one for props.value or props.children.
 *
 * @prop {Component|Element|string} label - Label to use in left column.
 * @prop {Component|Element|string} value - Value to use in right column.
 * @prop {string} className - Classname to add to '.row.list-item'.
 * @prop {number} colSm - Grid size (1-12) of label column at *small* screen sizes.
 * @prop {number} colMd - Grid size (1-12) of label column at *medium* screen sizes.
 * @prop {number} colLg - Grid size (1-12) of label column at *large* screen sizes.
 * @prop {Component|Element|string} title - Alias for props.label.
 * @prop {Component|Element|string} children - Alias for props.value.
 */
var Row = /*#__PURE__*/React.memo(function (props) {
  var colSm = props.colSm,
    colMd = props.colMd,
    colLg = props.colLg,
    field = props.field,
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
  var actualValue = value || val || children;
  var actualLabel = label || title;

  /**
   * If this is a row that contains a "subItemTable", add styling in order
   * to have it take up the full width of the row. In other words, stack 
   * this value under the key instead of to its right.
   */
  if (actualValue.type.name === "SubItemTable") {
    return /*#__PURE__*/React.createElement("div", {
      className: "row list-item flex-column" + className,
      "data-for-field": field
    }, /*#__PURE__*/React.createElement("div", {
      className: "item-label col-sm-" + colSm + " col-md-" + colMd + " col-lg-" + colLg
    }, /*#__PURE__*/React.createElement("div", {
      className: "inner border-0"
    }, actualLabel || "Label")), /*#__PURE__*/React.createElement("div", {
      className: "item-value col-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "inner"
    }, /*#__PURE__*/React.createElement("div", null, title), actualValue || "Value")));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: "row list-item " + className,
      "data-for-field": field
    }, /*#__PURE__*/React.createElement("div", {
      className: "item-label col-sm-" + colSm + " col-md-" + colMd + " col-lg-" + colLg
    }, /*#__PURE__*/React.createElement("div", {
      className: "inner"
    }, actualLabel || "Label")), /*#__PURE__*/React.createElement("div", {
      className: "item-value col-sm-" + valSm + " col-md-" + valMd + " col-lg-" + valLg
    }, /*#__PURE__*/React.createElement("div", {
      className: "inner"
    }, /*#__PURE__*/React.createElement("div", null, title), actualValue || "Value")));
  }
});
Row.defaultProps = {
  'colSm': 12,
  'colMd': 3,
  'colLg': 3,
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

export var PartialList = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(PartialList, _React$PureComponent);
  var _super = _createSuper(PartialList);
  function PartialList(props) {
    var _this;
    _classCallCheck(this, PartialList);
    _this = _super.call(this, props);
    _this.state = {
      closing: false,
      lastOpen: props.open
    };
    _this.timeout = null;
    return _this;
  }
  _createClass(PartialList, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var _this2 = this;
      var _this$props = this.props,
        open = _this$props.open,
        _this$props$timeout = _this$props.timeout,
        timeout = _this$props$timeout === void 0 ? 400 : _this$props$timeout;
      var pastOpen = pastProps.open;
      if (!open && pastOpen) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
          _this2.setState({
            closing: false
          });
        }, timeout);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        _this$props2$classNam = _this$props2.className,
        className = _this$props2$classNam === void 0 ? null : _this$props2$classNam,
        _this$props2$containe = _this$props2.containerClassName,
        containerClassName = _this$props2$containe === void 0 ? "" : _this$props2$containe,
        _this$props2$containe2 = _this$props2.containerPersistentClassName,
        containerPersistentClassName = _this$props2$containe2 === void 0 ? "" : _this$props2$containe2,
        _this$props2$containe3 = _this$props2.containerCollapseClassName,
        containerCollapseClassName = _this$props2$containe3 === void 0 ? "" : _this$props2$containe3,
        _this$props2$containe4 = _this$props2.containerType,
        containerType = _this$props2$containe4 === void 0 ? "div" : _this$props2$containe4,
        collapsible = _this$props2.collapsible,
        _this$props2$persiste = _this$props2.persistent,
        persistent = _this$props2$persiste === void 0 ? [] : _this$props2$persiste,
        children = _this$props2.children,
        _this$props2$open = _this$props2.open,
        open = _this$props2$open === void 0 ? false : _this$props2$open;
      var _this$state$closing = this.state.closing,
        closing = _this$state$closing === void 0 ? false : _this$state$closing;
      return /*#__PURE__*/React.createElement("div", {
        className: "expandable-list " + (open ? "open" : "closed") + (className ? " " + className : "")
      }, persistent || children ? /*#__PURE__*/React.createElement(containerType, {
        'className': "persistent " + (containerPersistentClassName || containerClassName)
      }, persistent || children) : null, collapsible ? /*#__PURE__*/React.createElement(Collapse, {
        "in": open
      }, /*#__PURE__*/React.createElement(containerType, {
        'className': containerCollapseClassName || containerClassName,
        'key': "c"
      }, open || closing ? collapsible : null)) : null);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var lastOpen = props.open;
      if (lastOpen) {
        return {
          closing: false,
          lastOpen: lastOpen
        };
      }
      if (!lastOpen && state.lastOpen) {
        return {
          closing: true,
          lastOpen: lastOpen
        };
      }
      return {
        lastOpen: lastOpen
      };
    }
  }]);
  return PartialList;
}(React.PureComponent);
PartialList.Row = Row;