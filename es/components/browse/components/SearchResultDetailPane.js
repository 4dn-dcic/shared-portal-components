'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchResultDetailPane = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _ItemDetailList = require("./../../ui/ItemDetailList");

var _FlexibleDescriptionBox = require("./../../ui/FlexibleDescriptionBox");

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SearchResultDetailPane = function (_React$PureComponent) {
  _inherits(SearchResultDetailPane, _React$PureComponent);

  function SearchResultDetailPane() {
    _classCallCheck(this, SearchResultDetailPane);

    return _possibleConstructorReturn(this, _getPrototypeOf(SearchResultDetailPane).apply(this, arguments));
  }

  _createClass(SearchResultDetailPane, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _reactTooltip["default"].rebuild();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      if (this.props.open && !pastProps.open) _reactTooltip["default"].rebuild();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          result = _this$props.result,
          popLink = _this$props.popLink,
          schemas = _this$props.schemas;
      return _react["default"].createElement("div", null, !result.description ? null : _react["default"].createElement("div", {
        className: "flex-description-container"
      }, _react["default"].createElement("h5", null, _react["default"].createElement("i", {
        className: "icon icon-fw icon-align-left fas"
      }), "\xA0 Description"), _react["default"].createElement(_FlexibleDescriptionBox.FlexibleDescriptionBox, {
        description: result.description,
        fitTo: "self",
        textClassName: "text-normal",
        collapsedHeight: "auto",
        linesOfText: 2
      }), _react["default"].createElement("hr", {
        className: "desc-separator"
      })), _react["default"].createElement("div", {
        className: "item-page-detail"
      }, _react["default"].createElement("h5", {
        className: "text-500"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-list fas"
      }), "\xA0 Details"), _react["default"].createElement(_ItemDetailList.Detail, {
        context: result,
        open: false,
        popLink: popLink,
        schemas: schemas
      })));
    }
  }]);

  return SearchResultDetailPane;
}(_react["default"].PureComponent);

exports.SearchResultDetailPane = SearchResultDetailPane;

_defineProperty(SearchResultDetailPane, "propTypes", {
  'result': _propTypes["default"].shape({
    '@id': _propTypes["default"].string,
    'display_title': _propTypes["default"].string,
    'description': _propTypes["default"].string
  }),
  'popLink': _propTypes["default"].bool,
  'schemas': _propTypes["default"].object
});