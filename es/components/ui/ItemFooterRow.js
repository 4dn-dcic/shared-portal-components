'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExternalReferenceLink = ExternalReferenceLink;
exports.ItemFooterRow = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

var _util = require("./../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Reusable Component for showing Aliases, External References, etc.
 * Shown at bottom of Item pages.
 *
 * @class ItemFooterRow
 * @type {Component}
 * @prop {Object} context - JSON representation of current Item object. Should be available through Redux store's context.
 * @prop {Object} schemas - JSON representation of sitewide schemas.
 */
var ItemFooterRow = _react["default"].memo(function (_ref) {
  var context = _ref.context,
      schemas = _ref.schemas;

  var _ref2 = context || {},
      _ref2$aliases = _ref2.aliases,
      aliases = _ref2$aliases === void 0 ? [] : _ref2$aliases,
      _ref2$actions = _ref2.actions,
      actions = _ref2$actions === void 0 ? [] : _ref2$actions,
      _ref2$external_refere = _ref2.external_references,
      external_references = _ref2$external_refere === void 0 ? [] : _ref2$external_refere,
      _ref2$alternate_acces = _ref2.alternate_accessions,
      alternate_accessions = _ref2$alternate_acces === void 0 ? [] : _ref2$alternate_acces;

  if (external_references.length === 0 && alternate_accessions.length === 0) {
    return null;
  }

  return (
    /*#__PURE__*/
    _react["default"].createElement(_react["default"].Fragment, null,
    /*#__PURE__*/
    _react["default"].createElement("hr", {
      className: "mb-08 mt-1"
    }),
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "row"
    },
    /*#__PURE__*/
    _react["default"].createElement(ExternalReferencesSection, {
      context: context,
      externalReferences: external_references
    }),
    /*#__PURE__*/
    _react["default"].createElement(AlternateAccessionSection, {
      context: context,
      alternateAccessions: alternate_accessions
    })))
  );
});

exports.ItemFooterRow = ItemFooterRow;

function ExternalReferencesSection(_ref3) {
  var externalReferences = _ref3.externalReferences;

  if (externalReferences.length === 0) {
    return null;
  }

  return (
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "col col-12 col-md-6"
    },
    /*#__PURE__*/
    _react["default"].createElement("h4", {
      className: "text-300"
    }, "External References"),
    /*#__PURE__*/
    _react["default"].createElement("div", null,
    /*#__PURE__*/
    _react["default"].createElement("ul", null, _underscore["default"].map(externalReferences, function (extRef, i) {
      return (
        /*#__PURE__*/
        _react["default"].createElement("li", {
          key: i
        }, typeof extRef.ref === 'string' ?
        /*#__PURE__*/
        _react["default"].createElement(ExternalReferenceLink, {
          uri: extRef.uri || null
        }, extRef.ref) : extRef)
      );
    }))))
  );
}

function AlternateAccessionSection(_ref4) {
  var alternateAccessions = _ref4.alternateAccessions;

  if (alternateAccessions.length === 0) {
    return null;
  }

  return (
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "col col-12 col-md-6"
    },
    /*#__PURE__*/
    _react["default"].createElement("h4", {
      className: "text-300"
    }, "Alternate Accessions"),
    /*#__PURE__*/
    _react["default"].createElement("div", null,
    /*#__PURE__*/
    _react["default"].createElement("ul", null, _underscore["default"].map(alternateAccessions, function (altAccession, i) {
      return (
        /*#__PURE__*/
        _react["default"].createElement("li", {
          key: i
        }, altAccession)
      );
    }))))
  );
}

function AliasesSection(_ref5) {
  var aliases = _ref5.aliases,
      actions = _ref5.actions;
  if (aliases.length === 0) return null;
  if (!_underscore["default"].find(actions, {
    'name': 'edit'
  })) return null; // No 'Edit' action for this Item.

  return (
    /*#__PURE__*/
    _react["default"].createElement("div", null,
    /*#__PURE__*/
    _react["default"].createElement("h4", {
      className: "text-500"
    }, "Aliases"),
    /*#__PURE__*/
    _react["default"].createElement("div", null,
    /*#__PURE__*/
    _react["default"].createElement("ul", null, _underscore["default"].map(aliases, function (alias, i) {
      return (
        /*#__PURE__*/
        _react["default"].createElement("li", {
          key: i
        }, alias)
      );
    }))))
  );
}
/**
 * Used to display an external reference link.
 *
 * @prop {Component[]|Element[]|string[]} children - Inner contents or title of link.
 * @prop {string} uri - The href for the link.
 */


function ExternalReferenceLink(_ref6) {
  var uri = _ref6.uri,
      children = _ref6.children;

  if (!uri || typeof uri === 'string' && uri.length < 8) {
    // < 8 because that's minimum we need for a URL (e.g. 'http://' is first 7 chars)
    return (
      /*#__PURE__*/
      _react["default"].createElement("span", {
        className: "external-reference"
      }, children)
    );
  }

  return (
    /*#__PURE__*/
    _react["default"].createElement("a", {
      href: uri,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "external-reference"
    }, children)
  );
}