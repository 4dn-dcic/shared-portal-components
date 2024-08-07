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
import ReactTooltip from 'react-tooltip';
import { Detail } from './../../ui/ItemDetailList';
import { FlexibleDescriptionBox } from './../../ui/FlexibleDescriptionBox';
export var SearchResultDetailPane = /*#__PURE__*/function (_React$PureComponent) {
  function SearchResultDetailPane() {
    _classCallCheck(this, SearchResultDetailPane);
    return _callSuper(this, SearchResultDetailPane, arguments);
  }
  _inherits(SearchResultDetailPane, _React$PureComponent);
  return _createClass(SearchResultDetailPane, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      ReactTooltip.rebuild();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var open = this.props.open;
      var pastOpen = pastProps.open;
      if (open && !pastOpen) {
        ReactTooltip.rebuild();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        result = _this$props.result,
        popLink = _this$props.popLink,
        schemas = _this$props.schemas;
      return /*#__PURE__*/React.createElement("div", {
        className: "w-100"
      }, !result.description ? null : /*#__PURE__*/React.createElement("div", {
        className: "flex-description-container"
      }, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-align-left fas"
      }), "\xA0 Description"), /*#__PURE__*/React.createElement(FlexibleDescriptionBox
      //windowWidth={this.props.windowWidth}
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
}(React.PureComponent);
_defineProperty(SearchResultDetailPane, "propTypes", {
  'result': PropTypes.shape({
    '@id': PropTypes.string,
    'display_title': PropTypes.string,
    'description': PropTypes.string
  }),
  'popLink': PropTypes.bool,
  'schemas': PropTypes.object,
  'open': PropTypes.bool
  //'windowWidth' : PropTypes.number.isRequired
});