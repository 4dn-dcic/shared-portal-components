function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { BasicStaticSectionBody } from './../../static-pages/BasicStaticSectionBody';
export var AboveSearchTablePanel = /*#__PURE__*/React.memo(function (_ref) {
  var context = _ref.context,
      placeholderReplacementFxn = _ref.placeholderReplacementFxn;
  var search_header = context.search_header;
  if (!search_header) return null; // TODO: Add in custom front-end controls if/when applicable.
  // If we migrate 'full screen', 'select x for download' etc buttons/controls here (desireable) we need to make sure it communicates with external state container for the SearchResultTable.
  // SearchResultTable would likely need to expose some functions which would be accessible via instance reference to SearchResultTable and passed up as callback props into this one.

  return /*#__PURE__*/React.createElement("div", {
    className: "above-table-panel"
  }, /*#__PURE__*/React.createElement(SearchHeaderSection, _extends({}, search_header, {
    placeholderReplacementFxn: placeholderReplacementFxn
  })));
});
AboveSearchTablePanel.propTypes = {
  'href': PropTypes.string.isRequired,
  'context': PropTypes.object.isRequired,
  'placeholderReplacementFxn': PropTypes.func
};

function SearchHeaderSection(_ref2) {
  var propTitle = _ref2.title,
      propContent = _ref2.content,
      filetype = _ref2.filetype,
      placeholderReplacementFxn = _ref2.placeholderReplacementFxn;
  var title = propTitle ? /*#__PURE__*/React.createElement("h4", {
    className: "text-300"
  }, propTitle) : null;
  var content = propContent ? /*#__PURE__*/React.createElement(BasicStaticSectionBody, {
    content: propContent,
    placeholderReplacementFxn: placeholderReplacementFxn,
    filetype: filetype || 'txt'
  }) : null;
  return content ? /*#__PURE__*/React.createElement("div", {
    className: "row mt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-9 pull-right"
  }, title, content)) : null;
}