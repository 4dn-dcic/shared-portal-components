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
 *
 * @todo
 * Implement/use ExtendedDescriptionPopoverIcon (mostly layouting task here), @see FacetTermsList' layout.
 * Deferred until we actually have any extended_descriptions in 4DN, which is only place where StaticSingleTerm
 * is used.
 */
var StaticSingleTerm = /*#__PURE__*/_react["default"].memo(function (props) {
  var fieldSchema = props.fieldSchema,
      term = props.term,
      facet = props.facet,
      filtering = props.filtering,
      onClick = props.onClick,
      getTermStatus = props.getTermStatus,
      extraClassname = props.extraClassname,
      termTransformFxn = props.termTransformFxn;
  var facetTitle = facet.title,
      _facet$description = facet.description,
      facetSchemaDescription = _facet$description === void 0 ? null : _facet$description,
      field = facet.field;
  var status = getTermStatus(term, facet);
  var selectedOrOmitted = status !== 'none';
  var statusClassName = selectedOrOmitted ? status === 'selected' ? 'selected' : 'omitted' : '';
  var termName = termTransformFxn(field, term.key);

  var _ref = fieldSchema || {},
      fieldTitle = _ref.title,
      fieldSchemaDescription = _ref.description; // fieldSchema not present if no schemas loaded yet or if fake/calculated 'field'/column.


  var title = facetTitle || fieldTitle || field;
  var cls = "facet static " + statusClassName + (filtering ? ' filtering' : '') + (extraClassname ? ' ' + extraClassname : '');
  var iconCls = "icon icon-fw " + (filtering ? 'icon-spin icon-circle-notch' : selectedOrOmitted ? status === 'selected' ? 'icon-times-circle fas' : 'icon-minus-circle fas' : 'icon-circle fas');

  if (!termName || termName === 'null' || termName === 'undefined') {
    termName = 'None';
  }

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: cls,
    "data-field": field
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "facet-static-row clearfix"
  }, /*#__PURE__*/_react["default"].createElement("h5", {
    className: "facet-title"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-inline-block",
    "data-tip": facetSchemaDescription || fieldSchemaDescription,
    "data-place": "right"
  }, "\xA0", title)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "facet-item term " + statusClassName + (filtering ? ' filtering' : '')
  }, /*#__PURE__*/_react["default"].createElement("span", {
    onClick: onClick,
    title: 'All results ' + (status !== 'omitted' ? 'have ' : 'omitted ') + term.key + (status !== 'omitted' ? ' as their ' : ' from their ') + title.toLowerCase() + '; ' + (selectedOrOmitted ? 'currently active as portal-wide filter.' : 'not currently active as portal-wide filter.')
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: iconCls
  }), termName))));
});

exports.StaticSingleTerm = StaticSingleTerm;