"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableRowToggleOpenButton = exports.basicColumnExtensionMap = exports.DEFAULT_WIDTH_MAP = void 0;

var _react = _interopRequireDefault(require("react"));

var _url = _interopRequireDefault(require("url"));

var _querystring = _interopRequireDefault(require("querystring"));

var _navigate = require("./../../../util/navigate");

var _schemaTransforms = require("./../../../util/schema-transforms");

var _object = require("./../../../util/object");

var _analytics = require("./../../../util/analytics");

var _LocalizedTime = require("./../../../ui/LocalizedTime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    'render': function (result, columnDefinition, props, termTransformFxn, width) {
      var href = props.href,
          context = props.context,
          rowNumber = props.rowNumber,
          detailOpen = props.detailOpen,
          toggleDetailOpen = props.toggleDetailOpen; // `href` and `context` reliably refer to search href and context here, i.e. will be passed in from VirtualHrefController.

      var title = _object.itemUtil.getTitleStringFromContext(result);

      var link = _object.itemUtil.atId(result);

      var tooltip;
      var hasPhoto = false;
      /** Registers a list click event for Google Analytics then performs navigation. */

      function handleClick(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        (0, _analytics.productClick)(result, {
          list: (0, _analytics.hrefToListName)(href),
          position: rowNumber + 1
        }, function () {
          // We explicitly use globalPageNavigate here and not props.navigate, as props.navigate might refer
          // to VirtualHrefController.virtualNavigate and would not bring you to new page.
          (0, _navigate.navigate)(link);
        }, context);
        return false;
      }

      if (title && (title.length > 20 || width < 100)) tooltip = title;

      if (link) {
        // This should be the case always
        title = _react["default"].createElement("a", {
          key: "title",
          href: link || '#',
          onClick: handleClick
        }, title);

        if (typeof result.email === 'string' && result.email.indexOf('@') > -1) {
          // Specific case for User items. May be removed or more cases added, if needed.
          hasPhoto = true;
          title = _react["default"].createElement("span", {
            key: "title"
          }, _object.itemUtil.User.gravatar(result.email, 32, {
            'className': 'in-search-table-title-image',
            'data-tip': result.email
          }, 'mm'), title);
        }
      }

      return _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement(TableRowToggleOpenButton, {
        open: detailOpen,
        onClick: toggleDetailOpen
      }), _react["default"].createElement("div", {
        key: "title-container",
        className: "title-block" + (hasPhoto ? ' has-photo' : " text-ellipsis-container"),
        "data-tip": tooltip
      }, title));
    }
  },
  '@type': {
    'noSort': true,
    'order': -80,
    'render': function render(result, columnDefinition, props) {
      if (!Array.isArray(result['@type'])) return null;
      var leafItemType = (0, _schemaTransforms.getItemType)(result);
      var itemTypeTitle = (0, _schemaTransforms.getTitleForType)(leafItemType, props.schemas || null);
      return _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("div", {
        className: "icon-container"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas icon-filter clickable mr-05",
        onClick: function onClick(e) {
          // Preserve search query, if any, but remove filters (which are usually per-type).
          if (!props.href || props.href.indexOf('/search/') === -1) return;
          e.preventDefault();
          e.stopPropagation();

          var urlParts = _url["default"].parse(props.href, true);

          var query = _objectSpread({}, urlParts.query, {
            'type': leafItemType
          });

          if (urlParts.query.q) query.q = urlParts.query.q;

          var nextHref = '/search/?' + _querystring["default"].stringify(query); // We use props.navigate here first which may refer to VirtualHrefController.virtualNavigate
          // since we're navigating to a search href here.


          (props.navigate || _navigate.navigate)(nextHref);
        },
        "data-tip": "Filter down to only " + itemTypeTitle
      })), _react["default"].createElement("span", {
        className: "item-type-title value"
      }, itemTypeTitle));
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
      return _react["default"].createElement("span", {
        className: "value"
      }, _react["default"].createElement(_LocalizedTime.LocalizedTime, {
        timestamp: result.date_created,
        formatType: "date-sm"
      }));
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
      if (!result.last_modified) return null;
      if (!result.last_modified.date_modified) return null;
      return _react["default"].createElement("span", {
        className: "value"
      }, _react["default"].createElement(_LocalizedTime.LocalizedTime, {
        timestamp: result.last_modified.date_modified,
        formatType: "date-sm"
      }));
    },
    'order': 515
  }
};
/** Button shown in first column (display_title) to open/close detail pane. */

exports.basicColumnExtensionMap = basicColumnExtensionMap;

var TableRowToggleOpenButton = _react["default"].memo(function (_ref) {
  var onClick = _ref.onClick,
      toggleDetailOpen = _ref.toggleDetailOpen,
      open = _ref.open;
  return _react["default"].createElement("div", {
    className: "inline-block toggle-detail-button-container"
  }, _react["default"].createElement("button", {
    type: "button",
    className: "toggle-detail-button",
    onClick: onClick || toggleDetailOpen
  }, _react["default"].createElement("div", {
    className: "icon-container"
  }, _react["default"].createElement("i", {
    className: "icon icon-fw fas icon-" + (open ? 'minus' : 'plus')
  }))));
});

exports.TableRowToggleOpenButton = TableRowToggleOpenButton;