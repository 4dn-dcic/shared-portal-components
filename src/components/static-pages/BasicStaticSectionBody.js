import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { htmlToJSX } from './../util/object';
import { patchedConsoleInstance as console } from './../util/patched-console';
import { compiler } from 'markdown-to-jsx';


export const BasicStaticSectionBody = React.memo(function BasicStaticSectionBody(props){
    const {
        content,
        content_as_html,
        children,
        filetype = "md",
        element = "div",
        markdownCompilerOptions,
        // To be implemented by parent app.
        placeholderReplacementFxn = function (placeholderString, props) { return placeholderString; },
        ...passProps
    } = props;
    //In some cases, markdown to html conversion is handled by backend by assigning the content_as_html. For the rest, use markdown-to-jsx compiler.
    if (filetype === 'md' && typeof content === 'string' && !content_as_html){
        return React.createElement(element, null, compiler(content, markdownCompilerOptions || undefined) );
    } else if ((filetype === 'html' || filetype === 'rst' || filetype === 'md') && (typeof content_as_html === 'string' || typeof content === 'string')){
        return React.createElement(element, null, htmlToJSX(content_as_html || content));
    } else if (filetype === 'jsx' && typeof content === 'string'){
        return placeholderReplacementFxn(content.trim(), passProps);
    } else if (filetype === 'txt' && typeof content === 'string' && content.slice(0,12) === 'placeholder:'){
        // Deprecated older method - to be removed once data.4dn uses filetype=jsx everywhere w/ placeholder
        return placeholderReplacementFxn(content.slice(12).trim());
    } else {
        return React.createElement(element, passProps, content);
    }
});
BasicStaticSectionBody.propTypes = {
    "content" : PropTypes.string.isRequired,
    "content_as_html" : PropTypes.string,
    "filetype" : PropTypes.string,
    "element" : PropTypes.string,
    "markdownCompilerOptions" : PropTypes.any,
    "placeholderReplacementFxn" : PropTypes.func
};
