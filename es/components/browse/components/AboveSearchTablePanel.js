'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboveSearchTablePanel = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _patchedConsole = require("./../../util/patched-console");

var _BasicStaticSectionBody = require("./../../static-pages/BasicStaticSectionBody");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var AboveSearchTablePanel = _react["default"].memo(function (_ref) {
  var context = _ref.context,
      placeholderReplacementFxn = _ref.placeholderReplacementFxn;
  var search_header = context.search_header;
  if (!search_header) return null; // TODO: Add in custom front-end controls if/when applicable.
  // If we migrate 'full screen', 'select x for download' etc buttons/controls here (desireable) we need to make sure it communicates with external state container for the SearchResultTable.
  // SearchResultTable would likely need to expose some functions which would be accessible via instance reference to SearchResultTable and passed up as callback props into this one.

  return _react["default"].createElement("div", {
    className: "above-table-panel"
  }, _react["default"].createElement(SearchHeaderSection, _extends({}, search_header, {
    placeholderReplacementFxn: placeholderReplacementFxn
  })));
});

exports.AboveSearchTablePanel = AboveSearchTablePanel;
AboveSearchTablePanel.propTypes = {
  'href': _propTypes["default"].string.isRequired,
  'context': _propTypes["default"].object.isRequired,
  'placeholderReplacementFxn': _propTypes["default"].func
};

function SearchHeaderSection(_ref2) {
  var propTitle = _ref2.title,
      propContent = _ref2.content,
      filetype = _ref2.filetype,
      placeholderReplacementFxn = _ref2.placeholderReplacementFxn;
  var title = propTitle ? _react["default"].createElement("h4", {
    className: "text-300"
  }, propTitle) : null;
  var content = propContent ? _react["default"].createElement(_BasicStaticSectionBody.BasicStaticSectionBody, _extends({
    content: propContent,
    placeholderReplacementFxn: placeholderReplacementFxn
  }, {
    filetype: filetype || 'txt'
  })) : null;
  return content ? _react["default"].createElement("div", {
    className: "row mt-1"
  }, _react["default"].createElement("div", {
    className: "col-12 col-lg-9 pull-right"
  }, title, content)) : null;
}