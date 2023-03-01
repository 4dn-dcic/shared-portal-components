var _excluded = ["content", "content_as_html", "children", "filetype", "element", "markdownCompilerOptions", "placeholderReplacementFxn"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { htmlToJSX } from './../util/object';
import { compiler } from 'markdown-to-jsx';
export var BasicStaticSectionBody = /*#__PURE__*/React.memo(function (props) {
  var content = props.content,
    content_as_html = props.content_as_html,
    children = props.children,
    filetype = props.filetype,
    element = props.element,
    markdownCompilerOptions = props.markdownCompilerOptions,
    placeholderReplacementFxn = props.placeholderReplacementFxn,
    passProps = _objectWithoutProperties(props, _excluded);
  if (filetype === 'md' && typeof content === 'string') {
    return /*#__PURE__*/React.createElement(element, passProps, compiler(content, markdownCompilerOptions || undefined));
  } else if ((filetype === 'html' || filetype === 'rst') && (typeof content_as_html === 'string' || typeof content === 'string')) {
    return /*#__PURE__*/React.createElement(element, passProps, htmlToJSX(content_as_html || content));
  } else if (filetype === 'jsx' && typeof content === 'string') {
    return placeholderReplacementFxn(content.trim(), passProps);
  } else if (filetype === 'txt' && typeof content === 'string' && content.slice(0, 12) === 'placeholder:') {
    // Deprecated older method - to be removed once data.4dn uses filetype=jsx everywhere w/ placeholder
    return placeholderReplacementFxn(content.slice(12).trim());
  } else {
    return /*#__PURE__*/React.createElement(element, passProps, content);
  }
});
BasicStaticSectionBody.propTypes = {
  "content": PropTypes.string.isRequired,
  "content_as_html": PropTypes.string,
  "filetype": PropTypes.string,
  "element": PropTypes.string.isRequired,
  "markdownCompilerOptions": PropTypes.any,
  "placeholderReplacementFxn": PropTypes.func.isRequired
};
BasicStaticSectionBody.defaultProps = {
  "filetype": "md",
  "element": "div",
  "placeholderReplacementFxn": function placeholderReplacementFxn(placeholderString) {
    // To be implemented by parent app.
    return placeholderString;
  }
};