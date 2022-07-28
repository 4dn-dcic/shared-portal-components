import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React, { useMemo, useState, useRef } from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Fade from 'react-bootstrap/esm/Fade';
import Popover from 'react-bootstrap/esm/Popover';
export function FacetListPopoverController(props) {
  var children = props.children; // In this state we will store the entirety of the Popover JSX to display
  // to allow flexibility in what to display in Popover contents
  // in case we add more types of Popovers later.

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      openPopoverID = _useState2[0],
      setOpenPopoverID = _useState2[1];

  var adjustedChildren = React.Children.map(children, function (child) {
    return /*#__PURE__*/React.cloneElement(child, {
      openPopoverID: openPopoverID,
      setOpenPopoverID: setOpenPopoverID
    });
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, adjustedChildren);
}
/**
 * @todo Potentially refactor to use ReactDOM.createPortal along w. semi-opaque dark background that will close this onClick.
 * @todo Alternatively if we don't want the background, could attach event listener to window maybe..
 */

export var ExtendedDescriptionPopoverIcon = /*#__PURE__*/React.memo(function (props) {
  var facet = props.facet,
      _props$fieldSchema = props.fieldSchema,
      fieldSchema = _props$fieldSchema === void 0 ? null : _props$fieldSchema,
      openPopover = props.openPopover,
      setOpenPopover = props.setOpenPopover;
  var facetTitle = facet.title,
      field = facet.field,
      _facet$extended_descr = facet.extended_description,
      facetExtendedDescription = _facet$extended_descr === void 0 ? null : _facet$extended_descr;

  var _ref = fieldSchema || {},
      fieldTitle = _ref.title,
      _ref$extended_descrip = _ref.extended_description,
      fieldExtendedDescription = _ref$extended_descrip === void 0 ? null : _ref$extended_descrip; // May be null for 'calculated' or 'fake' fields.


  var target = useRef(null);
  var extendedDescription = facetExtendedDescription || fieldExtendedDescription;
  var idToUse = "extended_description_for_field_" + field;

  var _ref2 = openPopover || {},
      _ref2$id = _ref2.id,
      openPopoverID = _ref2$id === void 0 ? null : _ref2$id,
      openPoverTarget = _ref2.target;

  var isOpen = openPopover && (openPoverTarget === target || openPopoverID === idToUse);

  if (!extendedDescription) {
    return null;
  } // WARNING: extended_description is not sanitized, we control it, but todo: maybe run it through BasicStaticSectionBody or something.


  return /*#__PURE__*/React.createElement("div", {
    className: "d-inline-block px-1",
    "data-tip": isOpen ? "Click to close" : "Click for more information",
    ref: target,
    onClick: function onIconClick(e) {
      e.stopPropagation();

      function dismissPopover() {
        setOpenPopover(null);
      }

      if (!!isOpen) {
        dismissPopover();
      } else {
        setOpenPopover({
          id: idToUse,
          ref: target,
          // By time icon is clicked, this will be mounted.
          popover: /*#__PURE__*/React.createElement(Popover, null, /*#__PURE__*/React.createElement(Popover.Title, {
            as: "div"
          }, /*#__PURE__*/React.createElement("div", {
            className: "row align-items-center"
          }, /*#__PURE__*/React.createElement("div", {
            className: "col"
          }, /*#__PURE__*/React.createElement("h5", {
            className: "text-600 my-0"
          }, facetTitle || fieldTitle || field)), /*#__PURE__*/React.createElement("div", {
            className: "col-auto clickable",
            onClick: dismissPopover
          }, /*#__PURE__*/React.createElement("i", {
            className: "icon icon-times fas"
          })))), /*#__PURE__*/React.createElement(Popover.Content, null, /*#__PURE__*/React.createElement("div", {
            className: "popover-content-inner",
            dangerouslySetInnerHTML: {
              __html: extendedDescription
            }
          })))
        });
      }
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-info-circle fas" + (isOpen ? " text-primary" : " text-secondary")
  }));
});