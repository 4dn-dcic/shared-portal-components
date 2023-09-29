import _typeof from "@babel/runtime/helpers/typeof";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _class2;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import React from 'react';
import * as d3 from 'd3';
import _ from 'underscore';
import memoize from 'memoize-one';
import Collapse from 'react-bootstrap/esm/Collapse';
import { getElementTop, animateScrollTo, getScrollingOuterElement, getPageVerticalScrollPosition } from './../util/layout';
import { navigate } from './../util/navigate';
import { isServerSide } from './../util/misc';
import { CopyWrapper, itemUtil } from './../util/object';
var TableEntry = /*#__PURE__*/function (_React$Component) {
  _inherits(TableEntry, _React$Component);
  var _super = _createSuper(TableEntry);
  function TableEntry(props) {
    var _this;
    _classCallCheck(this, TableEntry);
    _this = _super.call(this, props);
    _this.shouldComponentUpdate = _this.shouldComponentUpdate.bind(_assertThisInitialized(_this));
    _this.getTargetElement = _this.getTargetElement.bind(_assertThisInitialized(_this));
    _this.getNextHeaderElement = _this.getNextHeaderElement.bind(_assertThisInitialized(_this));
    _this.handleClick = _.throttle(_this.handleClick.bind(_assertThisInitialized(_this)), 300);
    _this.determineIfActive = _this.determineIfActive.bind(_assertThisInitialized(_this));
    _this.toggleOpen = _this.toggleOpen.bind(_assertThisInitialized(_this));
    _this.targetElement = null; // Header element we scroll to is cached here. Not in state as does not change.
    if (props.collapsible) {
      _this.state = {
        'open': false
      };
    }
    return _this;
  }
  _createClass(TableEntry, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (nextProps.mounted !== this.props.mounted || nextProps.pageScrollTop !== this.props.pageScrollTop || this && this.state && nextState && nextState.open !== this.state.open) {
        return true;
      }
      return false;
    }
  }, {
    key: "getTargetElement",
    value: function getTargetElement() {
      var link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.link;
      if (typeof document === 'undefined' || !document || !window) return null; // Not clientside.
      if (!this.targetElement) {
        // Cache it for performance. Doesn't needa be in state as won't change.
        this.targetElement = d3.select('[id="' + link + '"]').node();
      }
      return this.targetElement;
    }
  }, {
    key: "getNextHeaderElement",
    value: function getNextHeaderElement() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      if (!props.nextHeader || typeof document === 'undefined' || !document || !window) return null; // Not clientside or no header.
      var id = null;
      if (props.nextHeader === 'bottom') {
        id = 'page-footer';
      } else if (typeof props.nextHeader === 'string') {
        id = props.nextHeader;
      } else if (TableOfContents.isContentJSX(props.nextHeader)) {
        id = props.nextHeader.type.prototype.getID.call(props.nextHeader);
      }
      if (!id) return null;
      return d3.select('[id="' + id + '"]').node() || null;
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      var _this$props = this.props,
        link = _this$props.link,
        offsetBeforeTarget = _this$props.offsetBeforeTarget,
        propNavigate = _this$props.navigate;
      TableOfContents.scrollToLink(link, offsetBeforeTarget, propNavigate, this.getTargetElement());
    }
  }, {
    key: "determineIfActive",
    value: function determineIfActive() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var mounted = props.mounted,
        depth = props.depth,
        link = props.link,
        nextHeader = props.nextHeader,
        pageScrollTop = props.pageScrollTop,
        offsetBeforeTarget = props.offsetBeforeTarget;
      if (!mounted) return false;
      var scrollingOuterElement = getScrollingOuterElement();
      var targetElem;
      var elemTop;
      if (depth === 0 && mounted) {
        elemTop = 0;
      } else {
        targetElem = this.getTargetElement(link);
        elemTop = getElementTop(targetElem);
        if (mounted && scrollingOuterElement && scrollingOuterElement.scrollHeight && window && window.innerHeight) {
          // Try to prevent from trying to scroll past max scrollable height.
          elemTop = Math.min(scrollingOuterElement.scrollHeight - window.innerHeight, elemTop);
        }
      }
      if (typeof elemTop !== 'number') return null;
      if (nextHeader) {
        var nextHeaderTop = null;
        if (typeof nextHeader === 'number') {
          nextHeaderTop = nextHeader;
        } else {
          var nextHeaderElement = this.getNextHeaderElement(props);
          if (nextHeaderElement) {
            nextHeaderTop = getElementTop(nextHeaderElement);
          }
        }
        if (nextHeaderTop && pageScrollTop >= Math.max(depth > 0 ? 40 : 0, elemTop - offsetBeforeTarget - 120) && pageScrollTop < nextHeaderTop - offsetBeforeTarget - 120) return true;else return false;
      } else if (targetElem && targetElem.className.split(' ').indexOf('static-section-entry') > -1) {
        var elemStyle = targetElem.computedStyle || window.getComputedStyle(targetElem);
        if (pageScrollTop >= elemTop - offsetBeforeTarget - 120 && pageScrollTop < elemTop + parseInt(elemStyle.marginTop) + targetElem.offsetHeight - offsetBeforeTarget - 120) return true;else return false;
      } else if (depth === 0) {
        if (mounted && pageScrollTop >= 0 && pageScrollTop < 40) return true;
      }
      return false;
    }
  }, {
    key: "toggleOpen",
    value: function toggleOpen() {
      this.setState(function (_ref) {
        var open = _ref.open;
        return {
          'open': !open
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props2 = this.props,
        recurDepth = _this$props2.recurDepth,
        link = _this$props2.link,
        content = _this$props2.content,
        maxHeaderDepth = _this$props2.maxHeaderDepth,
        depth = _this$props2.depth,
        collapsible = _this$props2.collapsible,
        mounted = _this$props2.mounted,
        listStyleTypes = _this$props2.listStyleTypes,
        pageScrollTop = _this$props2.pageScrollTop,
        nextHeader = _this$props2.nextHeader,
        children = _this$props2.children,
        skipDepth = _this$props2.skipDepth,
        className = _this$props2.className,
        propNavigate = _this$props2.navigate;
      var title = this.props.title;
      var _ref2 = this.state || {},
        open = _ref2.open;
      var active = this.determineIfActive();
      var childHeaders = TableEntry.getChildHeaders(content, maxHeaderDepth, depth);
      var collapsibleButton;
      if (collapsible && childHeaders.length > 0) {
        collapsibleButton = /*#__PURE__*/React.createElement("i", {
          className: "d-inline-block icon icon-fw fas icon-" + (open ? 'minus' : 'plus'),
          onClick: this.toggleOpen
        });
      }
      if (typeof link === 'string' && link.length > 0) {
        title = /*#__PURE__*/React.createElement("div", {
          className: "title-link-wrapper"
        }, collapsibleButton, /*#__PURE__*/React.createElement("a", {
          className: depth === 0 ? 'text-500' : 'text-400',
          href: (link.charAt(0) === '/' ? '' : '#') + link,
          onClick: function onClick(e) {
            e.preventDefault();
            _this2.handleClick();
          }
        }, title));
      }
      if (depth === 0) {
        title = /*#__PURE__*/React.createElement("span", {
          title: "Up to page listing",
          className: "top-of-page visible-lg-block visible-lg"
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon fas icon-angle-up"
        }), title);
      }
      return /*#__PURE__*/React.createElement("li", {
        className: "table-content-entry" + (className ? ' ' + className : '') + (depth === 0 ? ' top' : '') + (active ? ' active' : ''),
        "data-depth": depth,
        "data-recursion-depth": recurDepth
      }, title, /*#__PURE__*/React.createElement(Collapse, {
        "in": !this.state || open && mounted
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TableEntryChildren, {
        navigate: propNavigate,
        parentClosed: this.state && !open,
        active: active,
        content: content,
        childHeaders: childHeaders,
        depth: depth,
        mounted: mounted,
        listStyleTypes: listStyleTypes,
        pageScrollTop: pageScrollTop,
        nextHeader: nextHeader,
        children: children,
        link: link,
        maxHeaderDepth: maxHeaderDepth,
        skipDepth: skipDepth,
        recurDepth: recurDepth
      }))));
    }
  }]);
  return TableEntry;
}(React.Component);
_defineProperty(TableEntry, "getChildHeaders", memoize(function (content, maxHeaderDepth, currentDepth) {
  if (!TableOfContents.isContentJSX(content) || !content.props || !content.props.children) return [];
  return content.props.children.filter(function (child) {
    return TableOfContents.isHeaderComponent(child, maxHeaderDepth || 6) && child.props.type === 'h' + (currentDepth + 1);
  });
}));
_defineProperty(TableEntry, "defaultProps", {
  'title': 'Table of Content Entry',
  'link': 'sample-link',
  'style': 'normal',
  'className': null,
  'offsetBeforeTarget': 72,
  'pageScrollTop': 0,
  'depth': null,
  'listStyleTypes': null,
  'mounted': null,
  'content': null,
  'nextHeader': null,
  'recurDepth': 1
});
var TableEntryChildren = /*#__PURE__*/function (_React$Component2) {
  _inherits(TableEntryChildren, _React$Component2);
  var _super2 = _createSuper(TableEntryChildren);
  function TableEntryChildren(props) {
    var _this3;
    _classCallCheck(this, TableEntryChildren);
    _this3 = _super2.call(this, props);
    _this3.shouldComponentUpdate = _this3.shouldComponentUpdate.bind(_assertThisInitialized(_this3));
    _this3.getHeadersFromContent = _this3.getHeadersFromContent.bind(_assertThisInitialized(_this3));
    _this3.children = _this3.children.bind(_assertThisInitialized(_this3));
    _this3.render = _this3.render.bind(_assertThisInitialized(_this3));
    return _this3;
  }
  _createClass(TableEntryChildren, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (nextProps.active) return true;
      if (nextProps.depth === 0) return true;
      if (nextProps.mounted !== this.props.mounted) return true;
      if (nextProps.active !== this.props.active) return true;
      if (nextProps.parentClosed !== this.props.parentClosed) return true;
      return false;
    }
  }, {
    key: "getHeadersFromContent",
    value: function getHeadersFromContent() {
      return TableEntryChildren.getHeadersFromContent(this.props.content, this.props.maxHeaderDepth, this.props.depth);
    }
  }, {
    key: "children",
    value: function children() {
      var _this$props3 = this.props,
        content = _this$props3.content,
        depth = _this$props3.depth,
        propChildren = _this$props3.children;
      var _this$getHeadersFromC = this.getHeadersFromContent(),
        childHeaders = _this$getHeadersFromC.childHeaders,
        childDepth = _this$getHeadersFromC.childDepth;
      if (childHeaders && childHeaders.length) {
        var opts = _.pick(this.props, 'maxHeaderDepth', 'pageScrollTop', 'listStyleTypes', 'skipDepth', 'nextHeader', 'mounted', 'recurDepth');
        return TableEntryChildren.renderChildrenElements(childHeaders, childDepth, content, opts);
      } else {
        return propChildren;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
        listStyleTypes = _this$props4.listStyleTypes,
        _this$props4$depth = _this$props4.depth,
        depth = _this$props4$depth === void 0 ? 0 : _this$props4$depth;
      // Removed: 'collapse' children if not over them (re: negative feedback)
      //if (this.props.depth >= 3 && !this.props.active) return null;
      var renderedChildren = this.children();
      if (!renderedChildren) return null;
      return /*#__PURE__*/React.createElement("ol", {
        className: "inner",
        style: {
          'listStyleType': listStyleTypes[depth + 1]
        }
      }, renderedChildren);
    }
  }], [{
    key: "renderChildrenElements",
    value: function renderChildrenElements(childHeaders, currentDepth, jsxContent) {
      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        'skipDepth': 0,
        'nextHeader': null
      };
      var skipDepth = opts.skipDepth,
        maxHeaderDepth = opts.maxHeaderDepth,
        listStyleTypes = opts.listStyleTypes,
        pageScrollTop = opts.pageScrollTop,
        mounted = opts.mounted,
        nextHeader = opts.nextHeader,
        recurDepth = opts.recurDepth;
      if (Array.isArray(childHeaders) && childHeaders.length > 0) {
        return childHeaders.map(function (h) {
          var childContent = TableEntryChildren.getSubsequentChildHeaders(h, jsxContent, maxHeaderDepth, currentDepth);
          if (skipDepth > currentDepth) {
            return TableEntryChildren.renderChildrenElements(childHeaders, currentDepth + 1, childContent.content, _.extend({}, opts, {
              'nextHeader': childContent.nextMajorHeader || nextHeader || null
            }));
          }
          var hAttributes = MarkdownHeading.getAttributes(h.props.children);
          var linkTitle = TableOfContents.textFromReactChildren(h.props.children);

          // We must have this to be equal to the ID of the element we're navigating to.
          // A custom ID might be set in Markdown 'attributes' which we prefer over the one passed to explicitly via props.
          var link = hAttributes && hAttributes.id || h.props.id || null;
          if (hAttributes && hAttributes.matchedString) {
            linkTitle = linkTitle.replace(hAttributes.matchedString, '').trim();
          }

          /** @deprecated */
          if (!link) link = TableOfContents.slugify(linkTitle); // Fallback -- attempt to not use -- may fail.

          return /*#__PURE__*/React.createElement(TableEntry, {
            link: link,
            title: linkTitle,
            key: link,
            depth: (currentDepth || 0) + 1,
            listStyleTypes: listStyleTypes,
            pageScrollTop: pageScrollTop,
            mounted: mounted,
            content: childContent.content,
            nextHeader: childContent.nextMajorHeader || nextHeader || null,
            navigate: navigate,
            maxHeaderDepth: maxHeaderDepth,
            collapsible: currentDepth >= 1 + skipDepth,
            skipDepth: skipDepth,
            recurDepth: (recurDepth || 0) + 1
          });
        });
      }
      return null;
    }
  }]);
  return TableEntryChildren;
}(React.Component);
_class2 = TableEntryChildren;
_defineProperty(TableEntryChildren, "getHeadersFromContent", memoize(function (jsxContent, maxHeaderDepth, currentDepth) {
  if (Array.isArray(jsxContent)) {
    // As of html-react-parser v1.2.8, we may get back array of content, including "\n" or similar.
    return jsxContent.reduce(function (m, c) {
      var res = _class2.getHeadersFromContent(c, maxHeaderDepth, currentDepth);
      m.childDepth = Math.max(res.childDepth, m.childDepth);
      m.childrenForDepth = m.childrenForDepth.concat(res.childrenForDepth);
      return m;
    }, {
      childDepth: currentDepth,
      childrenForDepth: []
    });
  }
  if (!TableOfContents.isContentJSX(jsxContent)) return [];
  var depthToFind = currentDepth;
  var childrenForDepth = [];
  while (depthToFind <= Math.min(maxHeaderDepth, 5) && childrenForDepth.length === 0) {
    childrenForDepth = _.filter(jsxContent.props.children, function (child) {
      return TableOfContents.isHeaderComponent(child, maxHeaderDepth || 6) && child.props.type === 'h' + (depthToFind + 1);
    });
    if (childrenForDepth.length === 0) {
      depthToFind++;
    }
  }
  return {
    'childDepth': depthToFind,
    'childHeaders': childrenForDepth
  };
}));
_defineProperty(TableEntryChildren, "getSubsequentChildHeaders", memoize(function (header, jsxContent, maxHeaderDepth, currentDepth) {
  if (!TableOfContents.isContentJSX(jsxContent)) return null;
  var getNext = null;
  var nextMajorHeader = null;
  var nextHeaderComponents = jsxContent.props.children.reduce(function (m, child) {
    if (getNext === null && child === header) {
      getNext = true;
      return m;
    }
    if (getNext && TableOfContents.isHeaderComponent(child, maxHeaderDepth || 6)) {
      if (child.props.type === 'h' + Math.max(currentDepth + 1, 1) || child.props.type === 'h' + Math.max(currentDepth, 1) || child.props.type === 'h' + Math.max(currentDepth - 1, 1) || child.props.type === 'h' + Math.max(currentDepth - 2, 1)) {
        nextMajorHeader = child;
        getNext = false;
      } else {
        m.push(child);
      }
    }
    return m;
  }, /* m = */[]);
  return {
    'content': /*#__PURE__*/React.cloneElement(jsxContent, {}, nextHeaderComponents),
    'nextMajorHeader': nextMajorHeader
  };
}));
export var TableOfContents = /*#__PURE__*/function (_React$Component3) {
  _inherits(TableOfContents, _React$Component3);
  var _super3 = _createSuper(TableOfContents);
  function TableOfContents(props) {
    var _this4;
    _classCallCheck(this, TableOfContents);
    _this4 = _super3.call(this, props);
    _this4.onPageScroll = _this4.onPageScroll.bind(_assertThisInitialized(_this4));
    _this4.onToggleWidthBound = _this4.onToggleWidthBound.bind(_assertThisInitialized(_this4));
    _this4.state = {
      'scrollTop': 0,
      'mounted': false,
      'widthBound': true
    };
    return _this4;
  }
  _createClass(TableOfContents, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (window && !isServerSide()) {
        this.setState({
          'mounted': true,
          'scrollTop': parseInt(getPageVerticalScrollPosition())
        });
        this.unsubFromScrollEventsFxn = this.props.registerWindowOnScrollHandler(this.onPageScroll);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.updateQueued) {
        this.updateQueued = false;
        return true;
      }
      if (nextProps.windowWidth !== this.props.windowWidth) return true;
      if (nextState.mounted !== this.state.mounted) return true;
      if (nextState.scrollTop !== this.state.scrollTop) return true;
      if (nextState.widthBound !== this.state.widthBound) return true;
      return false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var _this5 = this;
      if (pastProps.windowWidth !== this.props.windowWidth) {
        // Recalculate new position on page etc.
        this.updateQueued = true;
        setTimeout(function () {
          _this5.setState({
            'scrollTop': parseInt(getPageVerticalScrollPosition())
          });
        }, 0);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (typeof this.unsubFromScrollEventsFxn === 'function') {
        this.unsubFromScrollEventsFxn();
      }
    }
  }, {
    key: "onPageScroll",
    value: function onPageScroll(scrollTop) {
      this.setState({
        scrollTop: scrollTop
      });
    }
  }, {
    key: "onToggleWidthBound",
    value: function onToggleWidthBound() {
      this.setState(function (_ref3) {
        var widthBound = _ref3.widthBound;
        return {
          'widthBound': !widthBound
        };
      });
    }
  }, {
    key: "parentLink",
    value: function parentLink(windowInnerWidth) {
      var context = this.props.context;
      var widthBound = this.state.widthBound;
      var cols = [];
      cols.push( /*#__PURE__*/React.createElement("div", {
        key: "parent-link",
        className: "col col-xs-" + (windowInnerWidth && windowInnerWidth >= 1600 ? '9' : '12')
      }, /*#__PURE__*/React.createElement("a", {
        className: "text-500",
        href: context.parent['@id']
      }, context.parent['display_title'])));
      if (windowInnerWidth && windowInnerWidth >= 1600) {
        cols.push( /*#__PURE__*/React.createElement("div", {
          key: "expand-btn",
          className: "col col-xs-3 text-right expand-button-container"
        }, /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "btn btn-xs btn-outline-dark",
          onClick: this.onToggleWidthBound
        }, widthBound ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw fas icon-angle-left"
        })) : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw fas icon-angle-right"
        })))));
      }
      return /*#__PURE__*/React.createElement("li", {
        className: "table-content-entry parent-entry",
        "data-depth": "0",
        key: "parent-link"
      }, /*#__PURE__*/React.createElement("span", {
        title: "Up to page listing",
        className: "top-of-page with-border-bottom visible-lg-block visible-lg"
      }, /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, cols)));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
        context = _this$props5.context,
        maxHeaderDepth = _this$props5.maxHeaderDepth,
        includeTop = _this$props5.includeTop,
        fixedGridWidth = _this$props5.fixedGridWidth,
        includeNextPreviousPages = _this$props5.includeNextPreviousPages,
        listStyleTypes = _this$props5.listStyleTypes,
        windowWidth = _this$props5.windowWidth,
        windowHeight = _this$props5.windowHeight,
        maxHeight = _this$props5.maxHeight,
        propNavigate = _this$props5.navigate,
        _this$props5$fixedPos = _this$props5.fixedPositionBreakpoint,
        fixedPositionBreakpoint = _this$props5$fixedPos === void 0 ? 1200 : _this$props5$fixedPos;
      var _this$state = this.state,
        mounted = _this$state.mounted,
        scrollTop = _this$state.scrollTop,
        widthBound = _this$state.widthBound;
      var contents = [];
      var skipDepth = 0;
      var previousEncounteredSection = null;
      // Don't make top-level section entries if not all sections have a section title.
      var excludeSectionsFromTOC = context.content.filter(function (section) {
        return section.title || section['toc-title'];
      }).length < 2;
      var renderedSections = _.sortBy(context.content, function (s) {
        return s.order || 99;
      }).map(function (section, i, all) {
        var name = section.name;
        var link = TableOfContents.elementIDFromSectionName(name);
        if (previousEncounteredSection) {
          previousEncounteredSection.nextHeader = link;
        }
        previousEncounteredSection = section;
        var sectionCopy = _objectSpread(_objectSpread({}, section), {}, {
          link: link
        });
        if (all.length - 1 === i) {
          sectionCopy.nextHeader = 'bottom';
        }
        return sectionCopy;
      }).map(function (section) {
        var content = section.content,
          link = section.link,
          nextHeader = section.nextHeader,
          tocTitle = section['toc-title'],
          title = section.title;
        if (excludeSectionsFromTOC) {
          skipDepth = 1;
          var _TableEntryChildren$g = TableEntryChildren.getHeadersFromContent(content, maxHeaderDepth, 1),
            childHeaders = _TableEntryChildren$g.childHeaders,
            childDepth = _TableEntryChildren$g.childDepth;
          var opts = _.extend({
            childHeaders: childHeaders,
            maxHeaderDepth: maxHeaderDepth,
            listStyleTypes: listStyleTypes,
            skipDepth: skipDepth
          }, {
            mounted: mounted,
            nextHeader: nextHeader,
            'pageScrollTop': scrollTop
          });
          return TableEntryChildren.renderChildrenElements(childHeaders, childDepth, content, opts);
        }
        return /*#__PURE__*/React.createElement(TableEntry, {
          link: link,
          content: content,
          listStyleTypes: listStyleTypes,
          mounted: mounted,
          nextHeader: nextHeader,
          skipDepth: skipDepth,
          maxHeaderDepth: maxHeaderDepth,
          title: tocTitle || title || _.map(link.split('-'), function (w) {
            return w.charAt(0).toUpperCase() + w.slice(1);
          }).join(' '),
          key: link,
          depth: 1,
          pageScrollTop: scrollTop,
          navigate: propNavigate
        });
      });

      // Might have `null` or 2 in there from `renderChildrenElements`.
      var renderedSectionsFlattened = _.flatten(renderedSections).filter(function (rs) {
        return !!rs;
      });
      if (context && context.parent && context.parent['@id']) {
        contents.push(this.parentLink(windowWidth));
      }
      var _renderedSectionsFlat = _slicedToArray(renderedSectionsFlattened, 1),
        _renderedSectionsFlat2 = _renderedSectionsFlat[0],
        _renderedSectionsFlat3 = _renderedSectionsFlat2 === void 0 ? {} : _renderedSectionsFlat2,
        _renderedSectionsFlat4 = _renderedSectionsFlat3.props,
        _renderedSectionsFlat5 = _renderedSectionsFlat4 === void 0 ? {} : _renderedSectionsFlat4,
        _renderedSectionsFlat6 = _renderedSectionsFlat5.link,
        firstSectionLink = _renderedSectionsFlat6 === void 0 ? null : _renderedSectionsFlat6;
      contents.push( /*#__PURE__*/React.createElement(TableEntry, {
        link: "top",
        title: context.display_title || 'Top of Page' || null,
        key: "top",
        depth: 0,
        listStyleTypes: listStyleTypes,
        pageScrollTop: scrollTop,
        mounted: mounted,
        navigate: propNavigate,
        nextHeader: firstSectionLink || null,
        maxHeaderDepth: maxHeaderDepth,
        skipDepth: skipDepth || 0
      }, renderedSectionsFlattened));
      var marginTop = 0; // Account for test warning
      if (windowWidth) {
        if (typeof scrollTop === 'number' && scrollTop < 80 && windowWidth >= 1200) {
          var testWarningElem = document.getElementsByClassName('navbar-container test-warning-visible');
          marginTop = testWarningElem[0] && testWarningElem[0].offsetHeight || marginTop;
        } else if (windowWidth < 1200) {
          marginTop = -12; // Account for spacing between title and first section
        }
      }

      var isEmpty = Array.isArray(contents) && !_.filter(contents).length || !contents;
      return /*#__PURE__*/React.createElement("div", {
        key: "toc",
        className: "table-of-contents" + (widthBound ? ' width-bounded' : ''),
        style: {
          'width': windowWidth ? windowWidth >= fixedPositionBreakpoint ? function () {
            var containerWidth = fixedPositionBreakpoint - 60;
            return containerWidth * (fixedGridWidth / 12) + (windowWidth - containerWidth) / 2 - 10;
          }() || 'inherit' : 'inherit' : 285,
          'height': windowWidth && windowHeight ? windowWidth >= fixedPositionBreakpoint ? maxHeight || scrollTop >= 40 ? windowHeight - 42 : windowHeight - 82 : null : 1000,
          marginTop: marginTop
        }
      }, !isEmpty ? /*#__PURE__*/React.createElement("ol", {
        className: "inner",
        style: {
          'listStyleType': listStyleTypes[0],
          'paddingLeft': 0
        }
      }, contents) : null, includeNextPreviousPages && (context.next || context.previous) ? /*#__PURE__*/React.createElement(NextPreviousPageSection, {
        context: context,
        windowInnerWidth: windowWidth
      }) : /*#__PURE__*/React.createElement("br", null));
    }
  }], [{
    key: "slugify",
    value: /** Taken from https://gist.github.com/mathewbyrne/1280286 */
    /** @deprecated */
    function slugify(text) {
      return text.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
    }

    /** @deprecated */
  }, {
    key: "slugifyReactChildren",
    value: function slugifyReactChildren(children) {
      return TableOfContents.slugify(TableOfContents.textFromReactChildren(children));
    }
  }, {
    key: "textFromReactChildren",
    value: function textFromReactChildren(children) {
      if (typeof children === 'string') return children;
      if (children && _typeof(children) === 'object' && children.props && children.props.children) return TableOfContents.textFromReactChildren(children.props.children);
      if (Array.isArray(children) && children.length > 0) {
        var childrenWithChildren = _.filter(children, function (c) {
          return typeof c === 'string' || c && c.props && c.props.children;
        });
        var childPrimaryElemIfAny = _.find(childrenWithChildren, function (c) {
          return c && _typeof(c) === 'object' && c.props && (c.type === 'code' || c.type === 'strong' || c.type === 'b');
        });
        if (childPrimaryElemIfAny) {
          return TableOfContents.textFromReactChildren(childPrimaryElemIfAny);
        } else {
          return _.map(children, TableOfContents.textFromReactChildren).join('');
        }
      }
      return '';
    }
  }, {
    key: "isHeaderComponent",
    value: function isHeaderComponent(c) {
      var maxHeaderDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
      return c && c.props && typeof c.props.type === 'string' && c.props.type.charAt(0).toLowerCase() === 'h' && _.range(1, maxHeaderDepth + 1).indexOf(parseInt(c.props.type.charAt(1))) > -1;
    }
  }, {
    key: "isContentJSX",
    value: function isContentJSX(content) {
      if (!content || _typeof(content) !== 'object') return false;
      return /*#__PURE__*/React.isValidElement(content);
      // const proto = Object.getPrototypeOf(content);
      // return proto && proto.isPrototypeOf(React.Component.prototype);
    }
  }, {
    key: "elementIDFromSectionName",
    value: function elementIDFromSectionName(sectionName) {
      var sectionParts;
      var idToUse = sectionName;
      if (sectionName.indexOf('#') > -1) {
        sectionParts = sectionName.split('#');
        idToUse = sectionParts[sectionParts.length - 1];
      } else if (sectionName.indexOf('.') > -1) {
        sectionParts = sectionName.split('.');
        idToUse = sectionParts[sectionParts.length - 1];
      }
      return idToUse;
    }
  }, {
    key: "scrollToLink",
    value: function scrollToLink(link) {
      var offsetBeforeTarget = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 72;
      var navigateFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : navigate;
      var targetElement = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var elementTop;
      if (link === "top") {
        elementTop = 0;
      } else if (typeof link === 'string' && link) {
        if (link.charAt(0) === '/') {
          navigateFunc(link);
          return;
        } else {
          elementTop = getElementTop(targetElement || document.getElementById(link));
        }
      } else {
        return null;
      }
      var pageScrollTop = getPageVerticalScrollPosition();
      animateScrollTo(elementTop, 750, offsetBeforeTarget, function () {
        if (typeof navigateFunc === 'function') {
          setTimeout(function () {
            if (link === 'top' || link === 'bottom') link = '';
            navigateFunc('#' + link, {
              'replace': true,
              'skipRequest': true
            });
          }, link === 'top' || typeof pageScrollTop === 'number' && pageScrollTop <= 40 ? 800 : 0);
        }
      });
    }
  }]);
  return TableOfContents;
}(React.Component);
_defineProperty(TableOfContents, "defaultProps", {
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
  'populateAnchors': true,
  'title': "Contents",
  'pageTitle': 'Introduction',
  'includeTop': true,
  'includeNextPreviousPages': true,
  'listStyleTypes': ['none', 'decimal', 'lower-alpha', 'lower-roman'],
  'maxHeaderDepth': 3
});
export var NextPreviousPageSection = /*#__PURE__*/React.memo(function (props) {
  var context = props.context,
    className = props.className,
    previousTitle = props.previousTitle,
    nextTitle = props.nextTitle;
  var next = context.next,
    previous = context.previous;
  if (!next && !previous) return null;
  var colSize = previous && next ? 6 : 12;
  return /*#__PURE__*/React.createElement("div", {
    className: "next-previous-pages-section" + (className && ' ' + className || '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, previous ? /*#__PURE__*/React.createElement("div", {
    className: "previous-section text-right col-" + colSize
  }, /*#__PURE__*/React.createElement("h6", {
    className: "text-400 mb-02 mt-12"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-angle-left"
  }), " ", previousTitle), /*#__PURE__*/React.createElement("h6", {
    className: "text-500 mt-0"
  }, /*#__PURE__*/React.createElement("a", {
    href: previous['@id'] || '/' + previous.name
  }, previous.display_title))) : null, next ? /*#__PURE__*/React.createElement("div", {
    className: "next-section col-" + colSize
  }, /*#__PURE__*/React.createElement("h6", {
    className: "text-400 mb-02 mt-12"
  }, nextTitle, " ", /*#__PURE__*/React.createElement("i", {
    className: "icon fas icon-fw icon-angle-right"
  })), /*#__PURE__*/React.createElement("h6", {
    className: "text-500 mt-0"
  }, /*#__PURE__*/React.createElement("a", {
    href: next['@id'] || '/' + next.name
  }, next.display_title))) : null));
});
NextPreviousPageSection.defaultProps = {
  'previousTitle': 'Previous',
  'nextTitle': 'Next'
};

/**
 * @todo need to rename it as StaticContentHeading (here and in 4DN-CGAP-SMaHT) since we started to use it for not only MD but all types of content
 */
export var MarkdownHeading = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(MarkdownHeading, _React$PureComponent);
  var _super4 = _createSuper(MarkdownHeading);
  function MarkdownHeading(props) {
    var _this6;
    _classCallCheck(this, MarkdownHeading);
    _this6 = _super4.call(this, props);
    _this6.getID = _this6.getID.bind(_assertThisInitialized(_this6));
    return _this6;
  }
  _createClass(MarkdownHeading, [{
    key: "getID",
    value: function getID() {
      var set = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (typeof this.id === 'string') return this.id;
      /** slugifyReactChildren is deprecated and should never be called now as we always get props.id passed in (?) */
      var idToSet = id || this.props && this.props.id || TableOfContents.slugifyReactChildren(this.props.children);
      if (set) {
        this.id = idToSet;
      }
      return idToSet;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      delete this.id;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
        type = _this$props6.type,
        propChildren = _this$props6.children;
      var children = Array.isArray(propChildren) ? propChildren : [propChildren];
      var propsToPass = {
        'children': children,
        'id': null,
        'type': type
      };
      var attributes = MarkdownHeading.getAttributes(children);
      if (attributes && attributes.matchedString) {
        propsToPass.children = _.map(children, function (c) {
          if (typeof c === 'string') return c.replace(attributes.matchedString, '');
          return c;
        });
        if (attributes.id) {
          propsToPass.id = this.getID(true, attributes.id);
        }
        if (attributes.className) {
          propsToPass.className = attributes.className;
        }
      }
      if (!propsToPass.id) propsToPass.id = this.getID(true);
      return /*#__PURE__*/React.createElement(HeaderWithLink, propsToPass);
      //return React.createElement(type, propsToPass);
    }
  }], [{
    key: "getAttributes",
    value: function getAttributes(childrenParam) {
      var children = Array.isArray(childrenParam) ? childrenParam : [childrenParam];
      var attr = {
        'id': null,
        'className': null,
        'matchedString': null
      };
      var childrenOuterText = _.filter(children, function (c) {
        return typeof c === 'string';
      }).join(' ');
      var attrMatch = childrenOuterText.match(/({:[.-\w#]+})/g);
      if (attrMatch && attrMatch.length) {
        attr.matchedString = attrMatch[0];
        attrMatch = attrMatch[0].replace('{:', '').replace('}', '');
        var idMatch = attrMatch.match(/(#[-\w]+)/g);
        if (idMatch && idMatch.length) {
          idMatch = idMatch[0].replace('#', '');
          attr.id = idMatch;
          attrMatch = attrMatch.replace('#' + idMatch, '');
        }
        attr.className = attrMatch.split('.').join(' ').trim();
      }
      return attr;
    }
  }]);
  return MarkdownHeading;
}(React.PureComponent);
_defineProperty(MarkdownHeading, "defaultProps", {
  'type': 'h1',
  'id': null
});
export var HeaderWithLink = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(HeaderWithLink, _React$PureComponent2);
  var _super5 = _createSuper(HeaderWithLink);
  function HeaderWithLink(props) {
    var _this7;
    _classCallCheck(this, HeaderWithLink);
    _this7 = _super5.call(this, props);
    _this7.handleLinkClick = _this7.handleLinkClick.bind(_assertThisInitialized(_this7));
    return _this7;
  }
  _createClass(HeaderWithLink, [{
    key: "handleLinkClick",
    value: function handleLinkClick() {
      var _this$props7 = this.props,
        link = _this$props7.link,
        propID = _this$props7.id,
        context = _this$props7.context;
      if (!(!isServerSide() && typeof window !== 'undefined' && document)) return null;
      var id = link || propID;
      var itemAtID;
      if (context) itemAtID = itemUtil.atId(context);else itemAtID = window.location.pathname;
      if (itemAtID) {
        var linkToCopy = window.location.protocol + '//' + window.location.host + itemAtID + '#' + id;
        CopyWrapper.copyToClipboard(linkToCopy);
        TableOfContents.scrollToLink(id);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
        link = _this$props8.link,
        propID = _this$props8.id,
        type = _this$props8.type,
        children = _this$props8.children;
      if (!propID && !link) {
        throw new Error('HeaderWithLink needs a link or ID attribute/prop.');
      }
      return /*#__PURE__*/React.createElement(type || 'h2', _.omit(this.props, 'type', 'children', 'link', 'context'), [children, /*#__PURE__*/React.createElement("i", {
        key: "icon-link",
        className: "icon icon-fw icon-link fas",
        onClick: this.handleLinkClick,
        title: "Copy link to clipboard"
      })]);
    }
  }]);
  return HeaderWithLink;
}(React.PureComponent);