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

var _analytics = require("./../util/analytics");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
      size = props.size,
      onClick = props.onClick;
  var cls = "btn download-button" + (disabled ? ' disabled' : '') + (size ? ' btn-' + size : '') + (className ? " " + className : '');
  return (
    /*#__PURE__*/
    _react["default"].createElement("a", _extends({
      href: href,
      onClick: onClick
    }, {
      className: cls,
      download: true,
      "data-tip": filename || null
    }),
    /*#__PURE__*/
    _react["default"].createElement("i", {
      className: "icon icon-fw icon-cloud-download-alt fas"
    }), title ?
    /*#__PURE__*/
    _react["default"].createElement("span", null, "\xA0 ", title) : null)
  );
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

var FileDownloadButtonAuto =
/*#__PURE__*/
_react["default"].memo(function (props) {
  var file = props.result,
      canDownloadStatuses = props.canDownloadStatuses,
      _props$onClick = props.onClick,
      onClick = _props$onClick === void 0 ? null : _props$onClick;
  var href = file.href,
      filename = file.filename;
  var isDisabled = !canDownloadFile(file, canDownloadStatuses);
  var passProps = {
    onClick: onClick,
    href: href,
    filename: filename,
    'disabled': isDisabled,
    'title': isDisabled ? 'Not ready to download' : FileDownloadButton.defaultProps.title
  };
  return (
    /*#__PURE__*/
    _react["default"].createElement(FileDownloadButton, _extends({}, props, passProps))
  );
});

exports.FileDownloadButtonAuto = FileDownloadButtonAuto;
FileDownloadButtonAuto.propTypes = {
  'result': _propTypes["default"].shape({
    'href': _propTypes["default"].string.isRequired,
    'filename': _propTypes["default"].string.isRequired
  }).isRequired,
  'canDownloadStatuses': _propTypes["default"].arrayOf(_propTypes["default"].string),
  'onClick': _propTypes["default"].func
};
FileDownloadButtonAuto.defaultProps = {
  'canDownloadStatuses': ['uploaded', 'released', 'replaced', 'submission in progress', 'released to project', 'archived']
};

var ViewFileButton =
/*#__PURE__*/
_react["default"].memo(function (props) {
  var filename = props.filename,
      href = props.href,
      target = props.target,
      title = props.title,
      mimeType = props.mimeType,
      size = props.size,
      className = props.className,
      bsStyle = props.bsStyle,
      variant = props.variant,
      propClick = props.onClick,
      passProps = _objectWithoutProperties(props, ["filename", "href", "target", "title", "mimeType", "size", "className", "bsStyle", "variant", "onClick"]);

  var action = 'View';
  var extLink = null; // Unsure if really used. Maybe should test href for presence of http[s]:// instd of target="_blank"?

  var preLink = null;
  preLink =
  /*#__PURE__*/
  _react["default"].createElement("i", {
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
    preLink =
    /*#__PURE__*/
    _react["default"].createElement("i", {
      className: "icon icon-fw icon-image far"
    });
  } else if (fileNameLowerEnds['4'] === '.pdf') {
    action = 'View';

    if (target === '_blank') {
      extLink =
      /*#__PURE__*/
      _react["default"].createElement("i", {
        className: "icon icon-fw icon-external-link fas"
      });
    }

    preLink =
    /*#__PURE__*/
    _react["default"].createElement("i", {
      className: "icon icon-fw icon-file-pdf far"
    });
  } else if (fileNameLowerEnds['3'] === '.gz' || fileNameLowerEnds['4'] === '.zip' || fileNameLowerEnds['4'] === '.tgx') {
    action = 'Download';
  }

  var cls = "btn" + (size ? " btn-" + size : "") + (className ? " " + className : "") + (" btn-" + (bsStyle || variant || "primary"));

  var btnProps = _objectSpread(_objectSpread({}, passProps), {}, {
    onClick: function () {
      event("ViewFileButton", "Clicked", {
        eventLabel: filename
      });

      if (typeof propClick === "function") {
        propClick();
      }
    },
    href: href,
    mimeType: mimeType,
    target: target
  });

  return (
    /*#__PURE__*/
    _react["default"].createElement("a", _extends({}, btnProps, {
      className: cls,
      download: action === 'Download' ? filename || true : null,
      title: filename,
      "data-tip": mimeType
    }), preLink, " ", action, " ", title || filename &&
    /*#__PURE__*/
    _react["default"].createElement("span", {
      className: "text-600"
    }, filename) || 'File', " ", extLink)
  );
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