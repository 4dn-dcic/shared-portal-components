'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { htmlToJSX } from './../util/object';
import { compiler } from 'markdown-to-jsx';


export const BasicStaticSectionBody = React.memo(function BasicStaticSectionBody(props){
    const { content, filetype, element, markdownCompilerOptions, placeholderReplacementFxn } = props;
    const passedProps = _.omit(props, 'content', 'filetype', 'children', 'element', 'markdownCompilerOptions');

    if (filetype === 'md' && typeof content === 'string'){
        return React.createElement(element, passedProps, compiler(content, markdownCompilerOptions || undefined) );
    } else if (filetype === 'html' && typeof content === 'string'){
        return React.createElement(element, passedProps, htmlToJSX(content));
    } else if (filetype === 'jsx' && typeof content === 'string'){
        return placeholderReplacementFxn(content.trim());
    } else if (filetype === 'txt' && typeof content === 'string' && content.slice(0,12) === 'placeholder:'){
        // Deprecated older method - to be removed once data.4dn uses filetype=jsx everywhere w/ placeholder
        return placeholderReplacementFxn(content.slice(12).trim());
    } else {
        return React.createElement(element, passedProps, content);
    }
});
BasicStaticSectionBody.propTypes = {
    "content" : PropTypes.string.isRequired,
    "filetype" : PropTypes.string,
    "element" : PropTypes.string.isRequired,
    "markdownCompilerOptions" : PropTypes.any,
    "placeholderReplacementFxn" : PropTypes.func.isRequired
};
BasicStaticSectionBody.defaultProps = {
    "filetype" : "md",
    "element" : "div",
    "placeholderReplacementFxn" : function(placeholderString, props){
        // To be implemented by parent app.
        return placeholderString;
    }
};