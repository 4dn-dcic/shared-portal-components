var _excluded = ["filename", "href", "target", "title", "mimeType", "size", "className", "bsStyle", "variant", "onClick"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import { isFilenameAnImage } from './../util/file';
import { event as trackEvent } from './../util/analytics';
/*****************************
 ** Common React Components **
 *****************************/

/** @todo (?) Move to ui folder */

export function FileDownloadButton(props) {
  var href = props.href,
      className = props.className,
      disabled = props.disabled,
      title = props.title,
      filename = props.filename,
      size = props.size,
      tooltip = props.tooltip,
      onClick = props.onClick;
  var cls = "btn download-button" + (disabled ? ' disabled' : '') + (size ? ' btn-' + size : '') + (className ? " " + className : '');
  var button = /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    className: cls,
    download: true,
    "data-tip": tooltip || filename || null
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-cloud-download-alt fas"
  }), title ? /*#__PURE__*/React.createElement("span", null, "\xA0 ", title) : null);
  return disabled && tooltip ? /*#__PURE__*/React.createElement("span", {
    "data-tip": tooltip,
    className: "w-100"
  }, button) : button;
}
FileDownloadButton.defaultProps = {
  'className': "btn-block btn-primary",
  'title': 'Download',
  'disabled': false,
  'size': null
};
var canDownloadFile = memoize(function (file, validStatuses) {
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
export var FileDownloadButtonAuto = /*#__PURE__*/React.memo(function (props) {
  var file = props.result,
      canDownloadStatuses = props.canDownloadStatuses,
      _props$onClick = props.onClick,
      onClick = _props$onClick === void 0 ? null : _props$onClick,
      _props$disabled = props.disabled,
      propDisabled = _props$disabled === void 0 ? false : _props$disabled;
  var href = file.href,
      filename = file.filename;
  var isDownloadable = canDownloadFile(file, canDownloadStatuses);
  var passProps = {
    onClick: onClick,
    href: href,
    filename: filename,
    'disabled': !!propDisabled || !isDownloadable,
    'title': !isDownloadable ? 'Not ready to download' : FileDownloadButton.defaultProps.title
  };
  return /*#__PURE__*/React.createElement(FileDownloadButton, _extends({}, _.omit(props, 'disabled'), passProps));
});
FileDownloadButtonAuto.propTypes = {
  'result': PropTypes.shape({
    'href': PropTypes.string.isRequired,
    'filename': PropTypes.string.isRequired
  }).isRequired,
  'canDownloadStatuses': PropTypes.arrayOf(PropTypes.string),
  'onClick': PropTypes.func,
  'disabled': PropTypes.bool,
  'tooltip': PropTypes.string
};
FileDownloadButtonAuto.defaultProps = {
  'canDownloadStatuses': ['uploaded', 'released', 'replaced', 'submission in progress', 'released to project', 'archived']
};
export var ViewFileButton = /*#__PURE__*/React.memo(function (props) {
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
      passProps = _objectWithoutProperties(props, _excluded);

  var action = 'View';
  var extLink = null; // Unsure if really used. Maybe should test href for presence of http[s]:// instd of target="_blank"?

  var preLink = null;
  preLink = /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw icon-cloud-download-alt fas"
  });
  var fileNameLower = filename && filename.length > 0 && filename.toLowerCase() || '';
  var fileNameLowerEnds = {
    '3': fileNameLower.slice(-3),
    '4': fileNameLower.slice(-4),
    '5': fileNameLower.slice(-5)
  };

  if (isFilenameAnImage(fileNameLowerEnds)) {
    action = 'View';
    preLink = /*#__PURE__*/React.createElement("i", {
      className: "icon icon-fw icon-image far"
    });
  } else if (fileNameLowerEnds['4'] === '.pdf') {
    action = 'View';

    if (target === '_blank') {
      extLink = /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-external-link fas"
      });
    }

    preLink = /*#__PURE__*/React.createElement("i", {
      className: "icon icon-fw icon-file-pdf far"
    });
  } else if (fileNameLowerEnds['3'] === '.gz' || fileNameLowerEnds['4'] === '.zip' || fileNameLowerEnds['4'] === '.tgx' || fileNameLowerEnds['4'] === '.xls' || fileNameLowerEnds['5'] === '.xlsx') {
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

  return /*#__PURE__*/React.createElement("a", _extends({}, btnProps, {
    className: cls,
    download: action === 'Download' ? filename || true : null,
    title: filename,
    "data-tip": mimeType
  }), preLink, " ", action, " ", title || filename && /*#__PURE__*/React.createElement("span", {
    className: "text-600"
  }, filename) || 'File', " ", extLink);
});
ViewFileButton.defaultProps = {
  'className': "text-truncate mb-1",
  'target': "_blank",
  'href': null,
  'disabled': false,
  'title': null,
  'mimeType': null,
  'size': null,
  'variant': 'primary'
};