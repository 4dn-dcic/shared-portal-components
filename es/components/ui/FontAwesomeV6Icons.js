import React from 'react';
import PropTypes from 'prop-types';

/**
 * Since v6 of Font Awesome will require a pretty big upgrade w/some breaking changes,
 * and we have urgent need for one or two of the icons from that subset, this file will temporarily
 * house an icon component that can be used to load these icons as SVGs across CGAP & 4DN. This is a
 * SHORT TERM FIX for cases where there are no alternative options than to use an icon from v6.
 *
 * (Please don't start using this everywhere; it's for iconography-related emergencies ONLY.)
 *
 * This also will become deprecated when v6 upgrade is complete; delete after that point, and
 * update references.
 *
 * VERY IMPORTANT NOTE: The SVG file must be accessible on the PARENT REPO (CGAP/4DN) at
 * /static/img/fontawesomev6/<icon> in order to be used here. It must have the same name across both repos,
 * so best to just keep the name of the SVG file as downloaded from Fontawesome's site.
 */

var FontAwesomeV6Icons = /*#__PURE__*/React.memo(function (_ref) {
  var _ref$filename = _ref.filename,
    filename = _ref$filename === void 0 ? "filter-circle-xmark-solid.svg" : _ref$filename,
    _ref$hexColor = _ref.hexColor,
    hexColor = _ref$hexColor === void 0 ? "#ffffff" : _ref$hexColor,
    _ref$width = _ref.width,
    width = _ref$width === void 0 ? "16px" : _ref$width,
    _ref$height = _ref.height,
    height = _ref$height === void 0 ? "16px" : _ref$height,
    _ref$alt = _ref.alt,
    alt = _ref$alt === void 0 ? "An icon" : _ref$alt,
    _ref$cls = _ref.cls,
    cls = _ref$cls === void 0 ? "" : _ref$cls;
  // Since fill/bg-color/color attributes don't work on SVGs imported via image tags, need to
  // convert to "filter" string
  var filter = hexToFilterMap[hexColor];
  return /*#__PURE__*/React.createElement("img", {
    className: cls,
    style: {
      width: width,
      height: height,
      filter: filter
    },
    alt: alt,
    src: "/static/img/fontawesomev6/" + filename
  });
});
FontAwesomeV6Icons.propTypes = {
  "filename": function filename(props, propName, componentName) {
    if (!props[propName].endsWith(".svg")) {
      return new Error("Invalid prop '".concat(propName, "' supplied to <").concat(componentName, ">. Validation failed."));
    }
  },
  "hexColor": PropTypes.oneOf(Object.keys(hexToFilterMap)),
  "width": PropTypes.string,
  "height": PropTypes.string,
  "alt": PropTypes.string,
  "cls": PropTypes.string
};
export default FontAwesomeV6Icons;

// Use this resource to generate filter string from hexcode: https://codepen.io/sosuke/pen/Pjoqqp
// I had included some of this code in the original version of this file, but decided it added too much
// unnecessary complexity (especially since this component will be used sparingly). 
var hexToFilterMap = {
  "#ffffff": "invert(99%) sepia(1%) saturate(2%) hue-rotate(286deg) brightness(118%) contrast(100%)",
  "#000000": "invert(0%) sepia(0%) saturate(0%) hue-rotate(324deg) brightness(96%) contrast(104%)"
  // Add any additional ones here, if necessary
};