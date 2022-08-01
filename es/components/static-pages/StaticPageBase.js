function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import Collapse from 'react-bootstrap/esm/Collapse';
import { TableOfContents, HeaderWithLink, NextPreviousPageSection } from './TableOfContents';
import { layout, console } from './../util';
/**
 * Converts links to other files into links to sections from a React element and its children (recursively).
 *
 * @param {*} elem                                      A high-level React element representation of some content which might have relative links.
 * @param {{ content: { name: string }}} context        Backend-provided data.
 * @param {number} [depth=0]                            Current depth.
 * @returns {JSX.Element} Copy of original 'elem' param with corrected links.
 */

export function correctRelativeLinks(elem, context) {
  var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (_typeof(elem) !== 'object' || !elem) return elem; // Could be a string, or null.

  if (elem.type === 'a') {
    var href = elem.props.href;

    if (typeof href === 'string' && href.charAt(0) !== '#' && href.charAt(0) !== '/' && href.slice(0, 4) !== 'http' && href.slice(0, 7) !== 'mailto:') {
      // We have a relative href link.
      if (href.indexOf('#') > -1) {
        // It references a title on some other page or section. Likely, this is section is on same page, so we can just use that.
        var parts = href.split('#');

        if (parts.length > 1) {
          href = '#' + parts[1];
        }
      } else {
        // Check if is name of a section, and if so, correct.
        var filenameWithoutExtension = href.split('.').slice(0, -1).join('.');

        if (typeof _.find(context.content, {
          'name': filenameWithoutExtension
        }) !== 'undefined') {
          href = '#' + filenameWithoutExtension;
        }
      }
    }

    if (href !== elem.props.href || href.charAt(0) === '#') {
      return /*#__PURE__*/React.cloneElement(elem, _.extend(_.omit(elem.props, 'children'), {
        'href': href,
        'onClick': href.charAt(0) !== '#' ? null : function (e) {
          e.preventDefault();
          layout.animateScrollTo(href.slice(1));
        }
      }), elem.props.children || null);
    } else return elem;
  } else if (elem.props.children && typeof elem.type === 'string') {
    return /*#__PURE__*/React.cloneElement(elem, _.omit(elem.props, 'children'), React.Children.map(elem.props.children, function (child) {
      return correctRelativeLinks(child, context, depth + 1);
    }));
  } else return elem;
}
var Wrapper = /*#__PURE__*/React.memo(function (props) {
  var children = props.children,
      tableOfContents = props.tableOfContents,
      title = props.title,
      context = props.context,
      windowWidth = props.windowWidth;
  var toc = context && context['table-of-contents'] || (tableOfContents && _typeof(tableOfContents) === 'object' ? tableOfContents : null);
  var pageTitle = title || context && context.title || null;
  var tocExists = toc && toc.enabled !== false;
  return /*#__PURE__*/React.createElement("div", {
    className: "container",
    id: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "static-page row",
    key: "wrapper"
  }, tocExists ? /*#__PURE__*/React.createElement("div", {
    key: "toc-wrapper",
    className: "col-12 col-xl-3 order-1 order-xl-3"
  }, /*#__PURE__*/React.createElement(TableOfContents, _extends({
    pageTitle: pageTitle,
    fixedGridWidth: 3,
    maxHeaderDepth: toc['header-depth'] || 6
  }, _.pick(props, 'navigate', 'windowWidth', 'windowHeight', 'context', 'href', 'registerWindowOnScrollHandler', 'fixedPositionBreakpoint')))) : null, /*#__PURE__*/React.createElement("div", {
    key: "main-column",
    className: "order-2 col-12 col-xl-" + (tocExists ? '9' : '12')
  }, children), tocExists ? /*#__PURE__*/React.createElement("div", {
    key: "footer-next-prev",
    className: "col-12 d-lg-none order-last"
  }, /*#__PURE__*/React.createElement(NextPreviousPageSection, {
    context: context,
    windowInnerWidth: windowWidth
  })) : null));
});
Wrapper.defaultProps = {
  //'contentColSize' : 12,
  'tableOfContents': false,
  'tocListStyles': ['decimal', 'lower-alpha', 'lower-roman']
};
export var StaticEntry = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(StaticEntry, _React$PureComponent);

  var _super = _createSuper(StaticEntry);

  function StaticEntry(props) {
    var _this;

    _classCallCheck(this, StaticEntry);

    _this = _super.call(this, props);
    _this.toggleOpen = _.throttle(_this.toggleOpen.bind(_assertThisInitialized(_this)), 1000);
    var options = props.section && props.section.options || {};
    _this.state = {
      'open': options.default_open,
      'closing': false
    };
    return _this;
  }

  _createClass(StaticEntry, [{
    key: "toggleOpen",
    value: function toggleOpen(open) {
      var _this2 = this;

      this.setState(function (currState) {
        if (typeof open !== 'boolean') {
          open = !currState.open;
        }

        var closing = !open && currState.open;
        return {
          open: open,
          closing: closing
        };
      }, function () {
        setTimeout(function () {
          _this2.setState(function (currState) {
            if (!currState.open && currState.closing) {
              return {
                'closing': false
              };
            }

            return null;
          });
        }, 500);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          section = _this$props.section,
          entryType = _this$props.entryType,
          sectionName = _this$props.sectionName,
          className = _this$props.className,
          context = _this$props.context,
          childComponent = _this$props.childComponent;
      var _this$state = this.state,
          open = _this$state.open,
          closing = _this$state.closing;
      var id = TableOfContents.elementIDFromSectionName(sectionName);
      var options = section && section.options || {};
      var outerClassName = entryType + "-entry static-section-entry";
      var renderedChildComponent = /*#__PURE__*/React.createElement(childComponent, this.props);

      if (options.collapsible) {
        outerClassName += ' can-collapse ' + (open ? 'open' : 'closed');
        return /*#__PURE__*/React.createElement("div", {
          className: outerClassName,
          id: id
        }, section && section.title ? /*#__PURE__*/React.createElement(HeaderWithLink, {
          className: "section-title can-collapse " + (open ? 'open' : 'closed'),
          link: id,
          context: context,
          onClick: this.toggleOpen
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw fas icon-" + (open ? 'minus' : 'plus')
        }), "\xA0\xA0", section.title) : null, /*#__PURE__*/React.createElement(Collapse, {
          "in": open
        }, /*#__PURE__*/React.createElement("div", {
          className: "inner"
        }, open || closing ? renderedChildComponent : null)));
      }

      return /*#__PURE__*/React.createElement("div", {
        className: outerClassName,
        id: id
      }, section && section.title ? /*#__PURE__*/React.createElement(HeaderWithLink, {
        className: "section-title",
        link: id,
        context: context
      }, section.title) : null, renderedChildComponent);
    }
  }]);

  return StaticEntry;
}(React.PureComponent);
/**
 * This component shows an alert on mount if have been redirected from a different page, and
 * then renders out a list of StaticEntry components within a Wrapper in its render() method.
 * May be used by extending and then overriding the render() method.
 */

_defineProperty(StaticEntry, "defaultProps", {
  'section': null,
  'content': null,
  'entryType': 'help',
  'className': null
});

_defineProperty(StaticEntry, "propTypes", {
  'childComponent': PropTypes.elementType
});

export var StaticPageBase = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(StaticPageBase, _React$PureComponent2);

  var _super2 = _createSuper(StaticPageBase);

  function StaticPageBase() {
    _classCallCheck(this, StaticPageBase);

    return _super2.apply(this, arguments);
  }

  _createClass(StaticPageBase, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          context = _this$props2.context,
          entryRenderFxn = _this$props2.entryRenderFxn,
          contentParseFxn = _this$props2.contentParseFxn;
      var parsedContent = null;

      try {
        parsedContent = contentParseFxn(context);
      } catch (e) {
        console.dir(e);
        parsedContent = _objectSpread(_objectSpread({}, context), {}, {
          "content": [{
            "content": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", {
              className: "mb-02"
            }, "Error"), /*#__PURE__*/React.createElement("p", {
              className: "my-0"
            }, e.message), /*#__PURE__*/React.createElement("p", null, "Check Page content/sections.")),
            "name": 'error'
          }]
        });
      }

      var tableOfContents = parsedContent && parsedContent['table-of-contents'] && parsedContent['table-of-contents'].enabled ? parsedContent['table-of-contents'] : false;
      return /*#__PURE__*/React.createElement(Wrapper, _extends({}, _.pick(this.props, 'navigate', 'windowWidth', 'windowHeight', 'registerWindowOnScrollHandler', 'href', 'fixedPositionBreakpoint'), {
        key: "page-wrapper",
        title: parsedContent.title,
        tableOfContents: tableOfContents,
        context: parsedContent
      }), StaticPageBase.renderSections(entryRenderFxn, parsedContent, this.props));
    }
  }], [{
    key: "renderSections",
    value: function renderSections(renderMethod, parsedContent, props) {
      if (!parsedContent || !parsedContent.content || !Array.isArray(parsedContent.content)) {
        console.error('No content defined for page', parsedContent);
        return null;
      }

      return _.map(parsedContent.content, function (section) {
        return renderMethod(section.id || section.name, section, props);
      });
    }
  }]);

  return StaticPageBase;
}(React.PureComponent);

_defineProperty(StaticPageBase, "Wrapper", Wrapper);

_defineProperty(StaticPageBase, "defaultProps", {
  "context": {
    "title": "Page Title",
    "content": {
      "sectionNameID1": {
        "order": 0,
        "title": "Section Title 1",
        "content": "<h2>Hello</h2>",
        "filetype": "html"
      },
      "sectionNameID2": {
        "order": 1,
        "title": "Section Title 2",
        "content": "<h2>World</h2>",
        "filetype": "html"
      }
    }
  },

  /**
   * Default function for rendering out parsed section(s) content.
   *
   * @param {string} sectionName - Unique identifier of the section. Use to navigate to via '#<sectionName>' in URL.
   * @param {{ content : string|JSX.Element }} section - Object with parsed content, title, etc.
   * @param {Object} props - Collection of props passed down from BodyElement.
   */
  'entryRenderFxn': memoize(function (sectionName, section, props) {
    return /*#__PURE__*/React.createElement(StaticEntry, _extends({}, props, {
      key: sectionName,
      sectionName: sectionName,
      section: section
    }));
  })
});

_defineProperty(StaticPageBase, "propTypes", {
  'context': PropTypes.shape({
    "title": PropTypes.string,
    "content": PropTypes.any.isRequired,
    "table-of-contents": PropTypes.object
  }).isRequired,
  'entryRenderFxn': PropTypes.func.isRequired,
  'contentParseFxn': PropTypes.func.isRequired,
  'href': PropTypes.string
});