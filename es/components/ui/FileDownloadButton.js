"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileDownloadButton = FileDownloadButton;
exports.ViewFileButton = exports.FileDownloadButtonAuto = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _file = require("./../util/file");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*****************************
 ** Common React Components **
 *****************************/

/** @todo (?) Move to ui folder */
function FileDownloadButton(props) {
  var href = props.href,
      className = props.className,
      disabled = props.disabled,
      title = props.title,
      filename = props.filename,
      size = props.size;
  var cls = "btn download-button" + (disabled ? ' disabled' : '') + (size ? ' btn-' + size : '') + (className ? " " + className : '');
  return _react["default"].createElement("a", {
    href: href,
    className: cls,
    download: true,
    "data-tip": filename || null
  }, _react["default"].createElement("i", {
    className: "icon icon-fw icon-cloud-download-alt fas"
  }), title ? _react["default"].createElement("span", null, "\xA0 ", title) : null);
}

FileDownloadButton.defaultProps = {
  'className': "btn-block btn-primary",
  'title': 'Download',
  'disabled': false,
  'size': null
};
var canDownloadFile = (0, _memoizeOne["default"])(function (file, validStatuses) {
  if (!file || _typeof(file) !== 'object') {
    console.error("Incorrect data type");
    return false;
  }

  if (typeof file.status !== 'string') {
    console.error("No 'status' property on file:", file);
    return false;
  }

  if (validStatuses.indexOf(file.status) > -1) {
    return true;
  }

  return false;
});

var FileDownloadButtonAuto = _react["default"].memo(function (props) {
  var file = props.result,
      canDownloadStatuses = props.canDownloadStatuses;
  var isDisabled = !canDownloadFile(file, canDownloadStatuses);
  var passProps = {
    'href': file.href,
    'filename': file.filename,
    'disabled': isDisabled,
    'title': isDisabled ? 'Not ready to download' : FileDownloadButton.defaultProps.title
  };
  return _react["default"].createElement(FileDownloadButton, _extends({}, props, passProps));
});

exports.FileDownloadButtonAuto = FileDownloadButtonAuto;
FileDownloadButtonAuto.propTypes = {
  'result': _propTypes["default"].shape({
    'href': _propTypes["default"].string.isRequired,
    'filename': _propTypes["default"].string.isRequired
  }).isRequired,
  'canDownloadStatuses': _propTypes["default"].arrayOf(_propTypes["default"].string)
};
FileDownloadButtonAuto.defaultProps = {
  'canDownloadStatuses': ['uploaded', 'released', 'replaced', 'submission in progress', 'released to project', 'archived']
};

var ViewFileButton = _react["default"].memo(function (props) {
  var filename = props.filename,
      href = props.href,
      target = props.target,
      title = props.title,
      mimeType = props.mimeType,
      size = props.size,
      className = props.className,
      bsStyle = props.bsStyle,
      variant = props.variant;
  var action = 'View';
  var extLink = null; // Unsure if really used. Maybe should test href for presence of http[s]:// instd of target="_blank"?

  var preLink = null;
  preLink = _react["default"].createElement("i", {
    className: "icon icon-fw icon-cloud-download-alt fas"
  });
  var fileNameLower = filename && filename.length > 0 && filename.toLowerCase() || '';
  var fileNameLowerEnds = {
    '3': fileNameLower.slice(-3),
    '4': fileNameLower.slice(-4),
    '5': fileNameLower.slice(-5)
  };

  if ((0, _file.isFilenameAnImage)(fileNameLowerEnds)) {
    action = 'View';
    preLink = _react["default"].createElement("i", {
      className: "icon icon-fw icon-image far"
    });
  } else if (fileNameLowerEnds['4'] === '.pdf') {
    action = 'View';

    if (target === '_blank') {
      extLink = _react["default"].createElement("i", {
        className: "icon icon-fw icon-external-link fas"
      });
    }

    preLink = _react["default"].createElement("i", {
      className: "icon icon-fw icon-file-pdf far"
    });
  } else if (fileNameLowerEnds['3'] === '.gz' || fileNameLowerEnds['4'] === '.zip' || fileNameLowerEnds['4'] === '.tgx') {
    action = 'Download';
  }

  var cls = "btn" + (size ? " btn-" + size : "") + (className ? " " + className : "") + (" btn-" + (bsStyle || variant || "primary"));

  var passProps = _underscore["default"].omit(props, 'bsStyle', 'variant', 'filename', 'title', 'className', 'data-tip', 'size');

  return _react["default"].createElement("a", _extends({}, passProps, {
    className: cls,
    download: action === 'Download' ? true : null,
    title: filename,
    "data-tip": mimeType
  }), preLink, " ", action, " ", title || filename && _react["default"].createElement("span", {
    className: "text-600"
  }, filename) || 'File', " ", extLink);
});

exports.ViewFileButton = ViewFileButton;
ViewFileButton.defaultProps = {
  'className': "text-ellipsis-container mb-1",
  'target': "_blank",
  'href': null,
  'disabled': false,
  'title': null,
  'mimeType': null,
  'size': null,
  'variant': 'primary'
};