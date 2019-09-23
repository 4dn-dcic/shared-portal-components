'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicStaticSectionBody = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _object = require("./../util/object");

var _markdownToJsx = require("markdown-to-jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var BasicStaticSectionBody = _react["default"].memo(function (props) {
  var content = props.content,
      children = props.children,
      filetype = props.filetype,
      element = props.element,
      markdownCompilerOptions = props.markdownCompilerOptions,
      placeholderReplacementFxn = props.placeholderReplacementFxn,
      passProps = _objectWithoutProperties(props, ["content", "children", "filetype", "element", "markdownCompilerOptions", "placeholderReplacementFxn"]);

  if (filetype === 'md' && typeof content === 'string') {
    return _react["default"].createElement(element, passProps, (0, _markdownToJsx.compiler)(content, markdownCompilerOptions || undefined));
  } else if (filetype === 'html' && typeof content === 'string') {
    return _react["default"].createElement(element, passProps, (0, _object.htmlToJSX)(content));
  } else if (filetype === 'jsx' && typeof content === 'string') {
    return placeholderReplacementFxn(content.trim());
  } else if (filetype === 'txt' && typeof content === 'string' && content.slice(0, 12) === 'placeholder:') {
    return placeholderReplacementFxn(content.slice(12).trim());
  } else {
    return _react["default"].createElement(element, passProps, content);
  }
});

exports.BasicStaticSectionBody = BasicStaticSectionBody;
BasicStaticSectionBody.propTypes = {
  "content": _propTypes["default"].string.isRequired,
  "filetype": _propTypes["default"].string,
  "element": _propTypes["default"].string.isRequired,
  "markdownCompilerOptions": _propTypes["default"].any,
  "placeholderReplacementFxn": _propTypes["default"].func.isRequired
};
BasicStaticSectionBody.defaultProps = {
  "filetype": "md",
  "element": "div",
  "placeholderReplacementFxn": function placeholderReplacementFxn(placeholderString) {
    return placeholderString;
  }
};