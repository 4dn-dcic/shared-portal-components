import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["content", "content_as_html", "children", "filetype", "element", "markdownCompilerOptions", "placeholderReplacementFxn"];
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
  //In some cases, markdown to html conversion is handled by backend by assigning the content_as_html. For the rest, use markdown-to-jsx compiler.
  if (filetype === 'md' && typeof content === 'string' && !content_as_html) {
    return /*#__PURE__*/React.createElement(element, passProps, compiler(content, markdownCompilerOptions || undefined));
  } else if ((filetype === 'html' || filetype === 'rst' || filetype === 'md') && (typeof content_as_html === 'string' || typeof content === 'string')) {
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