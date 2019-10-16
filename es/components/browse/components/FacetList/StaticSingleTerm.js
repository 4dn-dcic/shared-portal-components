'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaticSingleTerm = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Renders out a single "facet - term" box for when only 1 term
 * is available (not filterable) at bottom of FacetList.
 */
var StaticSingleTerm = _react["default"].memo(function (_ref) {
  var term = _ref.term,
      facet = _ref.facet,
      showTitle = _ref.showTitle,
      filtering = _ref.filtering,
      onClick = _ref.onClick,
      getTermStatus = _ref.getTermStatus,
      extraClassname = _ref.extraClassname,
      termTransformFxn = _ref.termTransformFxn;
  var _facet$description = facet.description,
      description = _facet$description === void 0 ? null : _facet$description,
      field = facet.field;
  var status = getTermStatus(term, facet);
  var selectedOrOmitted = status !== 'none';
  var statusClassName = selectedOrOmitted ? status === 'selected' ? 'selected' : 'omitted' : '';
  var termName = termTransformFxn(field, term.key);

  if (!termName || termName === 'null' || termName === 'undefined') {
    termName = 'None';
  }

  return _react["default"].createElement("div", {
    className: "facet static " + statusClassName + (filtering ? ' filtering' : '') + (extraClassname ? ' ' + extraClassname : ''),
    "data-field": field
  }, _react["default"].createElement("div", {
    className: "facet-static-row clearfix"
  }, _react["default"].createElement("h5", {
    className: "facet-title"
  }, _react["default"].createElement("span", {
    className: "inline-block",
    "data-tip": description,
    "data-place": "right"
  }, "\xA0", showTitle)), _react["default"].createElement("div", {
    className: "facet-item term " + statusClassName + (filtering ? ' filtering' : '')
  }, _react["default"].createElement("span", {
    onClick: onClick,
    title: 'All results ' + (status !== 'omitted' ? 'have ' : 'omitted ') + term.key + (status !== 'omitted' ? ' as their ' : ' from their ') + showTitle.toLowerCase() + '; ' + (selectedOrOmitted ? 'currently active as portal-wide filter.' : 'not currently active as portal-wide filter.')
  }, _react["default"].createElement("i", {
    className: "icon icon-fw " + (filtering ? 'icon-spin icon-circle-notch' : selectedOrOmitted ? status === 'selected' ? 'icon-times-circle fas' : 'icon-minus-circle fas' : 'icon-circle fas')
  }), termName))));
});

exports.StaticSingleTerm = StaticSingleTerm;