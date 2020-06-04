"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableRowToggleOpenButton = exports.DisplayTitleColumnWrapper = exports.DisplayTitleColumnDefault = exports.DisplayTitleColumnUser = exports.basicColumnExtensionMap = exports.DEFAULT_WIDTH_MAP = void 0;

var _react = _interopRequireWildcard(require("react"));

var _url = _interopRequireDefault(require("url"));

var _querystring = _interopRequireDefault(require("querystring"));

var _navigate = require("./../../../util/navigate");

var _schemaTransforms = require("./../../../util/schema-transforms");

var _object = require("./../../../util/object");

var _analytics = require("./../../../util/analytics");

var _LocalizedTime = require("./../../../ui/LocalizedTime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_WIDTH_MAP = {
  'lg': 200,
  'md': 180,
  'sm': 120,
  'xs': 120
};
exports.DEFAULT_WIDTH_MAP = DEFAULT_WIDTH_MAP;
var basicColumnExtensionMap = {
  'display_title': {
    'title': "Title",
    'widthMap': {
      'lg': 280,
      'md': 250,
      'sm': 200
    },
    'minColumnWidth': 90,
    'order': -100,
    'render': function (result, parentProps) {
      var href = parentProps.href,
          context = parentProps.context,
          rowNumber = parentProps.rowNumber,
          detailOpen = parentProps.detailOpen,
          toggleDetailOpen = parentProps.toggleDetailOpen;
      var _result$Type = result['@type'],
          itemTypeList = _result$Type === void 0 ? ["Item"] : _result$Type;
      var renderElem;

      if (itemTypeList[0] === "User") {
        renderElem =
        /*#__PURE__*/
        _react["default"].createElement(DisplayTitleColumnUser, {
          result: result
        });
      } else {
        renderElem =
        /*#__PURE__*/
        _react["default"].createElement(DisplayTitleColumnDefault, {
          result: result
        });
      }

      return (
        /*#__PURE__*/
        _react["default"].createElement(DisplayTitleColumnWrapper, {
          result: result,
          href: href,
          context: context,
          rowNumber: rowNumber,
          detailOpen: detailOpen,
          toggleDetailOpen: toggleDetailOpen
        }, renderElem)
      );
    }
  },
  '@type': {
    'noSort': true,
    'order': -80,
    'render': function render(result, props) {
      if (!Array.isArray(result['@type'])) return null;
      var _props$schemas = props.schemas,
          schemas = _props$schemas === void 0 ? null : _props$schemas,
          _props$href = props.href,
          href = _props$href === void 0 ? null : _props$href,
          _props$navigate = props.navigate,
          propNavigate = _props$navigate === void 0 ? null : _props$navigate;
      var leafItemType = (0, _schemaTransforms.getItemType)(result);
      var itemTypeTitle = (0, _schemaTransforms.getTitleForType)(leafItemType, schemas);
      return (
        /*#__PURE__*/
        _react["default"].createElement(_react["default"].Fragment, null,
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "icon-container"
        },
        /*#__PURE__*/
        _react["default"].createElement("i", {
          className: "icon icon-fw fas icon-filter clickable mr-08",
          onClick: function onClick(e) {
            // Preserve search query, if any, but remove filters (which are usually per-type).
            if (!href || href.indexOf('/search/') === -1) return;
            e.preventDefault();
            e.stopPropagation();

            var urlParts = _url["default"].parse(href, true);

            var query = _objectSpread(_objectSpread({}, urlParts.query), {}, {
              'type': leafItemType
            });

            if (urlParts.query.q) query.q = urlParts.query.q;

            var nextHref = '/search/?' + _querystring["default"].stringify(query); // We use props.navigate here first which may refer to VirtualHrefController.virtualNavigate
            // since we're navigating to a search href here.


            (propNavigate || _navigate.navigate)(nextHref);
          },
          "data-tip": "Filter down to only " + itemTypeTitle
        })),
        /*#__PURE__*/
        _react["default"].createElement("span", {
          className: "item-type-title value"
        }, itemTypeTitle))
      );
    }
  },
  'date_created': {
    'title': 'Date Created',
    'colTitle': 'Created',
    'widthMap': {
      'lg': 140,
      'md': 120,
      'sm': 120
    },
    'render': function (result) {
      if (!result.date_created) return null;
      return (
        /*#__PURE__*/
        _react["default"].createElement("span", {
          className: "value"
        },
        /*#__PURE__*/
        _react["default"].createElement(_LocalizedTime.LocalizedTime, {
          timestamp: result.date_created,
          formatType: "date-sm"
        }))
      );
    },
    'order': 510
  },
  'last_modified.date_modified': {
    'title': 'Date Modified',
    'widthMap': {
      'lg': 140,
      'md': 120,
      'sm': 120
    },
    'render': function (result) {
      var _result$last_modified = result.last_modified;
      _result$last_modified = _result$last_modified === void 0 ? {} : _result$last_modified;
      var _result$last_modified2 = _result$last_modified.date_modified,
          date_modified = _result$last_modified2 === void 0 ? null : _result$last_modified2;
      if (!date_modified) return null;
      return (
        /*#__PURE__*/
        _react["default"].createElement("span", {
          className: "value"
        },
        /*#__PURE__*/
        _react["default"].createElement(_LocalizedTime.LocalizedTime, {
          timestamp: date_modified,
          formatType: "date-sm"
        }))
      );
    },
    'order': 515
  }
};
exports.basicColumnExtensionMap = basicColumnExtensionMap;

var DisplayTitleColumnUser = _react["default"].memo(function (_ref) {
  var result = _ref.result,
      link = _ref.link,
      onClick = _ref.onClick;
  var _result$email = result.email,
      email = _result$email === void 0 ? null : _result$email; // `href` and `context` reliably refer to search href and context here, i.e. will be passed in from VirtualHrefController.

  var title = _object.itemUtil.getTitleStringFromContext(result); // Gets display_title || title || accession || ...


  var tooltip = typeof title === "string" && title.length > 20 && title || null;
  var hasPhoto = false;

  if (link) {
    // This should be the case always
    title =
    /*#__PURE__*/
    _react["default"].createElement("a", {
      key: "title",
      href: link || '#',
      onClick: onClick
    }, title);

    if (typeof email === 'string' && email.indexOf('@') > -1) {
      // Specific case for User items. May be removed or more cases added, if needed.
      hasPhoto = true;
      title =
      /*#__PURE__*/
      _react["default"].createElement(_react["default"].Fragment, null, _object.itemUtil.User.gravatar(email, 32, {
        'className': 'in-search-table-title-image',
        'data-tip': email
      }, 'mm'), title);
    }
  }

  var cls = "title-block" + (hasPhoto ? " has-photo d-flex align-items-center" : " text-ellipsis-container");
  return (
    /*#__PURE__*/
    _react["default"].createElement("div", {
      key: "title-container",
      className: cls,
      "data-tip": tooltip,
      "data-delay-show": 750
    }, title)
  );
});
/**
 * @todo
 * Think about how to more easily customize this for different Item types.
 * Likely make reusable component containing handleClick and most of its UI...
 * which this and portals can use for "display_title" column, and then have per-type
 * overrides/extensions.
 */


exports.DisplayTitleColumnUser = DisplayTitleColumnUser;

var DisplayTitleColumnDefault = _react["default"].memo(function (props) {
  var result = props.result,
      link = props.link,
      onClick = props.onClick,
      _props$className = props.className,
      className = _props$className === void 0 ? null : _props$className;

  var title = _object.itemUtil.getTitleStringFromContext(result); // Gets display_title || title || accession || ...
  // Monospace accessions, file formats


  var shouldMonospace = _object.itemUtil.isDisplayTitleAccession(result, title) || result.file_format && result.file_format === title;
  var tooltip = typeof title === "string" && title.length > 20 && title || null;

  if (link) {
    // This should be the case always
    title =
    /*#__PURE__*/
    _react["default"].createElement("a", {
      key: "title",
      href: link || '#',
      onClick: onClick
    }, title);
  }

  var cls = "title-block text-ellipsis-container" + (shouldMonospace ? " text-monospace text-small" : "") + (className ? " " + className : "");
  return (
    /*#__PURE__*/
    _react["default"].createElement("div", {
      key: "title-container",
      className: cls,
      "data-tip": tooltip,
      "data-delay-show": 750
    }, title)
  );
});

exports.DisplayTitleColumnDefault = DisplayTitleColumnDefault;

var DisplayTitleColumnWrapper = _react["default"].memo(function (props) {
  var result = props.result,
      children = props.children,
      _props$href2 = props.href,
      href = _props$href2 === void 0 ? null : _props$href2,
      context = props.context,
      rowNumber = props.rowNumber,
      detailOpen = props.detailOpen,
      toggleDetailOpen = props.toggleDetailOpen;

  var link = _object.itemUtil.atId(result);
  /** Registers a list click event for Google Analytics then performs navigation. */


  var onClick = (0, _react.useMemo)(function () {
    return function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      var useHref = href || window && window.location.href || null;
      (0, _analytics.productClick)(result, {
        list: (0, _analytics.hrefToListName)(useHref),
        position: rowNumber + 1
      }, function () {
        // We explicitly use globalPageNavigate here and not props.navigate, as props.navigate might refer
        // to VirtualHrefController.virtualNavigate and would not bring you to new page.
        (0, _navigate.navigate)(link);
      }, context);
      return false;
    };
  }, [link, rowNumber]);

  var renderChildren = _react["default"].Children.map(children, function (child) {
    return _react["default"].cloneElement(child, {
      link: link,
      onClick: onClick,
      result: result
    });
  });

  return (
    /*#__PURE__*/
    _react["default"].createElement(_react["default"].Fragment, null,
    /*#__PURE__*/
    _react["default"].createElement(TableRowToggleOpenButton, {
      open: detailOpen,
      onClick: toggleDetailOpen
    }), renderChildren)
  );
});
/** Button shown in first column (display_title) to open/close detail pane. */


exports.DisplayTitleColumnWrapper = DisplayTitleColumnWrapper;

var TableRowToggleOpenButton = _react["default"].memo(function (_ref2) {
  var onClick = _ref2.onClick,
      toggleDetailOpen = _ref2.toggleDetailOpen,
      open = _ref2.open;
  return (
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "toggle-detail-button-container"
    },
    /*#__PURE__*/
    _react["default"].createElement("button", {
      type: "button",
      className: "toggle-detail-button",
      onClick: onClick || toggleDetailOpen
    },
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "icon-container"
    },
    /*#__PURE__*/
    _react["default"].createElement("i", {
      className: "icon icon-fw fas icon-" + (open ? 'minus' : 'plus')
    }))))
  );
});

exports.TableRowToggleOpenButton = TableRowToggleOpenButton;