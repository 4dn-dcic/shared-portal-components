function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { Detail } from './../../ui/ItemDetailList';
import { FlexibleDescriptionBox } from './../../ui/FlexibleDescriptionBox';
export var SearchResultDetailPane = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SearchResultDetailPane, _React$PureComponent);

  var _super = _createSuper(SearchResultDetailPane);

  function SearchResultDetailPane() {
    _classCallCheck(this, SearchResultDetailPane);

    return _super.apply(this, arguments);
  }

  _createClass(SearchResultDetailPane, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      ReactTooltip.rebuild();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      if (this.props.open && !pastProps.open) ReactTooltip.rebuild();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          result = _this$props.result,
          popLink = _this$props.popLink,
          schemas = _this$props.schemas;
      return /*#__PURE__*/React.createElement("div", null, !result.description ? null : /*#__PURE__*/React.createElement("div", {
        className: "flex-description-container"
      }, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-align-left fas"
      }), "\xA0 Description"), /*#__PURE__*/React.createElement(FlexibleDescriptionBox //windowWidth={this.props.windowWidth}
      , {
        description: result.description,
        fitTo: "self",
        textClassName: "text-normal",
        collapsedHeight: "auto",
        linesOfText: 2
      }), /*#__PURE__*/React.createElement("hr", {
        className: "desc-separator"
      })), /*#__PURE__*/React.createElement("div", {
        className: "item-page-detail"
      }, /*#__PURE__*/React.createElement("h5", {
        className: "text-500"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-list fas"
      }), "\xA0 Details"), /*#__PURE__*/React.createElement(Detail, {
        context: result,
        open: false,
        popLink: popLink,
        schemas: schemas
      })));
    }
  }]);

  return SearchResultDetailPane;
}(React.PureComponent);

_defineProperty(SearchResultDetailPane, "propTypes", {
  'result': PropTypes.shape({
    '@id': PropTypes.string,
    'display_title': PropTypes.string,
    'description': PropTypes.string
  }),
  'popLink': PropTypes.bool,
  'schemas': PropTypes.object //'windowWidth' : PropTypes.number.isRequired

});