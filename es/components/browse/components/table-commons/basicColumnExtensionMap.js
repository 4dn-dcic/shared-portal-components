function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { useMemo } from 'react';
import url from 'url';
import queryString from 'querystring';
import { navigate as globalPageNavigate } from './../../../util/navigate';
import { getItemType, getTitleForType } from './../../../util/schema-transforms';
import { getNestedProperty, itemUtil } from './../../../util/object';
import { productClick as trackProductClick, hrefToListName } from './../../../util/analytics';
import { LocalizedTime } from './../../../ui/LocalizedTime';
import { elementIsChildOfLink } from '../../../../../es/components/util/layout';
export var DEFAULT_WIDTH_MAP = {
  'lg': 200,
  'md': 180,
  'sm': 120,
  'xs': 120
};
export var basicColumnExtensionMap = {
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
        renderElem = /*#__PURE__*/React.createElement(DisplayTitleColumnUser, {
          result: result
        });
      } else {
        renderElem = /*#__PURE__*/React.createElement(DisplayTitleColumnDefault, {
          result: result
        });
      }

      return /*#__PURE__*/React.createElement(DisplayTitleColumnWrapper, {
        result: result,
        href: href,
        context: context,
        rowNumber: rowNumber,
        detailOpen: detailOpen,
        toggleDetailOpen: toggleDetailOpen
      }, renderElem);
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
      var leafItemType = getItemType(result);
      var itemTypeTitle = getTitleForType(leafItemType, schemas);
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "icon-container"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw fas icon-filter clickable mr-08",
        onClick: function onClick(e) {
          // Preserve search query, if any, but remove filters (which are usually per-type).
          if (!href || href.indexOf('/search/') === -1) return;
          e.preventDefault();
          e.stopPropagation();
          var urlParts = url.parse(href, true);

          var query = _objectSpread(_objectSpread({}, urlParts.query), {}, {
            'type': leafItemType
          });

          if (urlParts.query.q) query.q = urlParts.query.q;
          var nextHref = '/search/?' + queryString.stringify(query); // We use props.navigate here first which may refer to VirtualHrefController.virtualNavigate
          // since we're navigating to a search href here.

          (propNavigate || globalPageNavigate)(nextHref);
        },
        "data-tip": "Filter down to only " + itemTypeTitle
      })), /*#__PURE__*/React.createElement("span", {
        className: "item-type-title value"
      }, itemTypeTitle));
    }
  },
  'date_created': {
    'title': 'Date Created',
    'colTitle': 'Date Created',
    'widthMap': {
      'lg': 140,
      'md': 120,
      'sm': 120
    },
    'render': function (result) {
      var date_created = result.date_created;
      if (!date_created) return null;
      return /*#__PURE__*/React.createElement("span", {
        className: "value text-right"
      }, /*#__PURE__*/React.createElement(LocalizedTime, {
        timestamp: result.date_created,
        formatType: "date-sm"
      }));
    },
    'order': 510
  },
  'last_modified.date_modified': {
    'title': 'Date Modified',
    'colTitle': 'Date Modified',
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
      return /*#__PURE__*/React.createElement("span", {
        className: "value text-right"
      }, /*#__PURE__*/React.createElement(LocalizedTime, {
        timestamp: date_modified,
        formatType: "date-sm"
      }));
    },
    'order': 515
  }
};
export var DisplayTitleColumnUser = /*#__PURE__*/React.memo(function (_ref) {
  var result = _ref.result,
      link = _ref.link,
      onClick = _ref.onClick;
  var _result$email = result.email,
      email = _result$email === void 0 ? null : _result$email; // `href` and `context` reliably refer to search href and context here, i.e. will be passed in from VirtualHrefController.

  var title = itemUtil.getTitleStringFromContext(result); // Gets display_title || title || accession || ...

  var tooltip = typeof title === "string" && title.length > 20 && title || null;
  var hasPhoto = false;

  if (link) {
    // This should be the case always
    title = /*#__PURE__*/React.createElement("a", {
      key: "title",
      href: link || '#',
      onClick: onClick
    }, title);

    if (typeof email === 'string' && email.indexOf('@') > -1) {
      // Specific case for User items. May be removed or more cases added, if needed.
      hasPhoto = true;
      title = /*#__PURE__*/React.createElement(React.Fragment, null, itemUtil.User.gravatar(email, 32, {
        'className': 'in-search-table-title-image',
        'data-tip': email
      }, 'mm'), title);
    }
  }

  var cls = "title-block" + (hasPhoto ? " has-photo d-flex align-items-center" : " text-truncate");
  return /*#__PURE__*/React.createElement("div", {
    key: "title-container",
    className: cls,
    "data-tip": tooltip,
    "data-delay-show": 750
  }, title);
});
/**
 * @todo
 * Think about how to more easily customize this for different Item types.
 * Likely make reusable component containing handleClick and most of its UI...
 * which this and portals can use for "display_title" column, and then have per-type
 * overrides/extensions.
 */

export var DisplayTitleColumnDefault = /*#__PURE__*/React.memo(function (props) {
  var result = props.result,
      link = props.link,
      onClick = props.onClick,
      _props$className = props.className,
      className = _props$className === void 0 ? null : _props$className;
  var title = itemUtil.getTitleStringFromContext(result); // Gets display_title || title || accession || ...
  // Monospace accessions, file formats

  var shouldMonospace = itemUtil.isDisplayTitleAccession(result, title) || result.file_format && result.file_format === title;
  var tooltip = typeof title === "string" && title.length > 20 && title || null;

  if (link) {
    // This should be the case always
    title = /*#__PURE__*/React.createElement("a", {
      key: "title",
      href: link || '#',
      onClick: onClick
    }, title);
  }

  var cls = "title-block text-truncate" + (shouldMonospace ? " text-monospace text-small" : "") + (className ? " " + className : "");
  return /*#__PURE__*/React.createElement("div", {
    key: "title-container",
    className: cls,
    "data-tip": tooltip,
    "data-delay-show": 750
  }, title);
});
export var DisplayTitleColumnWrapper = /*#__PURE__*/React.memo(function (props) {
  var result = props.result,
      children = props.children,
      _props$href2 = props.href,
      href = _props$href2 === void 0 ? null : _props$href2,
      context = props.context,
      rowNumber = props.rowNumber,
      detailOpen = props.detailOpen,
      toggleDetailOpen = props.toggleDetailOpen;
  var link = itemUtil.atId(result);
  /** Registers a list click event for Google Analytics then performs navigation. */

  var onClick = useMemo(function () {
    return function (evt) {
      var _ref2$target = (evt || {}).target,
          target = _ref2$target === void 0 ? null : _ref2$target;
      var targetUrl;

      if (target && target.href) {
        targetUrl = target.href;
      } else if (target && !target.href) {
        // Check parent for hrefs if none found on current evt.target
        var linkElement = elementIsChildOfLink(target);

        var _ref3 = linkElement || {},
            _ref3$href = _ref3.href,
            _href = _ref3$href === void 0 ? null : _ref3$href;

        if (_href) {
          targetUrl = _href;
        }
      }

      var navTarget = targetUrl || link; // Fallback to atId if no href found

      evt.preventDefault();
      evt.stopPropagation();
      var useHref = href || window && window.location.href || null;
      trackProductClick(result, {
        list: hrefToListName(useHref),
        position: rowNumber + 1
      }, function () {
        // We explicitly use globalPageNavigate here and not props.navigate, as props.navigate might refer
        // to VirtualHrefController.virtualNavigate and would not bring you to new page.
        globalPageNavigate(navTarget);
      }, context);
      return false;
    };
  }, [link, rowNumber]);
  var renderChildren = React.Children.map(children, function (child) {
    if (! /*#__PURE__*/React.isValidElement(child) || typeof child.type === "string") {
      return child;
    }

    return /*#__PURE__*/React.cloneElement(child, {
      link: link,
      onClick: onClick,
      result: result
    });
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableRowToggleOpenButton, {
    open: detailOpen,
    onClick: toggleDetailOpen
  }), renderChildren);
});
/** Button shown in first column (display_title) to open/close detail pane. */

export var TableRowToggleOpenButton = /*#__PURE__*/React.memo(function (_ref4) {
  var onClick = _ref4.onClick,
      toggleDetailOpen = _ref4.toggleDetailOpen,
      open = _ref4.open;
  return /*#__PURE__*/React.createElement("div", {
    className: "toggle-detail-button-container"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "toggle-detail-button",
    onClick: onClick || toggleDetailOpen
  }, /*#__PURE__*/React.createElement("div", {
    className: "icon-container"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-" + (open ? 'minus' : 'plus')
  }))));
});