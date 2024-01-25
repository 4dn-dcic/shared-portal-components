import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a FontAwesomeV6 SVG icon given an identifier string [iconName] 
 * and applies additional classes [cls]
 * 
 * Disclaimer for all SVG icons:
 * Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - 
 * https://fontawesome.com/license (Commercial License) Copyright 2023 
 * Fonticons, Inc.
 * 
 * Notes:
 *  - Returns null if no icon name is provided
 *  - These are inline SVG elements styled in facet-list.scss facet-list.scss
 *    and can be overwritten in parent repositories
 *  - Switch statement is used over conditional render assuming there will be
 *    additional icons, should revert if fewer than 3
 */
const FontAwesomeV6Icons = React.memo(({ iconName="", cls="" }) => {
    switch (iconName) {
        case "filter-solid":
            return <svg className={`fa-icon ${iconName} ${cls}`} alt={`${iconName} icon`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg>
        case "filter-circle-xmark-solid":
            return <svg className={`fa-icon ${iconName} ${cls}`} alt={`${iconName} icon`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm59.3-180.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"/></svg>;
        default:
            return null
    }
});

FontAwesomeV6Icons.propTypes = {
    "iconName": PropTypes.string,
    "cls": PropTypes.string
};

export default FontAwesomeV6Icons;