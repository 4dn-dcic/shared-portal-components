'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderWithLink = exports.MarkdownHeading = exports.NextPreviousPageSection = exports.TableOfContents = void 0;

var _react = _interopRequireDefault(require("react"));

var d3 = _interopRequireWildcard(require("d3"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _Collapse = _interopRequireDefault(require("react-bootstrap/esm/Collapse"));

var _layout = require("./../util/layout");

var _navigate = require("./../util/navigate");

var _misc = require("./../util/misc");

var _object = require("./../util/object");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    _this.handleClick = _underscore["default"].throttle(_this.handleClick.bind(_assertThisInitialized(_this)), 300);
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
      TableOfContents.scrollToLink(this.props.link, this.props.offsetBeforeTarget, this.props.navigate, this.getTargetElement());
    }
  }, {
    key: "determineIfActive",
    value: function determineIfActive() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      if (!props.mounted) return false;
      var scrollingOuterElement = (0, _layout.getScrollingOuterElement)(),
          targetElem,
          elemTop;

      if (props.depth === 0 && props.mounted) {
        elemTop = 0;
      } else {
        targetElem = this.getTargetElement(props.link);
        elemTop = (0, _layout.getElementTop)(targetElem);

        if (props.mounted && scrollingOuterElement && scrollingOuterElement.scrollHeight && window && window.innerHeight) {
          // Try to prevent from trying to scroll past max scrollable height.
          elemTop = Math.min(scrollingOuterElement.scrollHeight - window.innerHeight, elemTop);
        }
      }

      if (typeof elemTop !== 'number') return null;

      if (props.nextHeader) {
        var nextHeaderTop = null;

        if (typeof props.nextHeader === 'number') {
          nextHeaderTop = props.nextHeader;
        } else {
          var nextHeaderElement = this.getNextHeaderElement(props);
          if (nextHeaderElement) nextHeaderTop = (0, _layout.getElementTop)(nextHeaderElement);
        }

        if (nextHeaderTop && props.pageScrollTop >= Math.max(props.depth > 0 ? 40 : 0, elemTop - props.offsetBeforeTarget - 120) && props.pageScrollTop < nextHeaderTop - props.offsetBeforeTarget - 120) return true;else return false;
      } else if (targetElem && targetElem.className.split(' ').indexOf('static-section-entry') > -1) {
        var elemStyle = targetElem.computedStyle || window.getComputedStyle(targetElem);
        if (props.pageScrollTop >= elemTop - props.offsetBeforeTarget - 120 && props.pageScrollTop < elemTop + parseInt(elemStyle.marginTop) + targetElem.offsetHeight - props.offsetBeforeTarget - 120) return true;else return false;
      } else if (props.depth === 0) {
        if (props.mounted && props.pageScrollTop >= 0 && props.pageScrollTop < 40) return true;
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

      var _this$props = this.props,
          recurDepth = _this$props.recurDepth,
          link = _this$props.link,
          content = _this$props.content,
          maxHeaderDepth = _this$props.maxHeaderDepth,
          depth = _this$props.depth,
          collapsible = _this$props.collapsible,
          mounted = _this$props.mounted,
          listStyleTypes = _this$props.listStyleTypes,
          pageScrollTop = _this$props.pageScrollTop,
          nextHeader = _this$props.nextHeader,
          children = _this$props.children,
          skipDepth = _this$props.skipDepth,
          className = _this$props.className,
          propNavigate = _this$props.navigate;
      var title = this.props.title;

      var _ref2 = this.state || {},
          open = _ref2.open;

      var active = this.determineIfActive();
      var childHeaders = TableEntry.getChildHeaders(content, maxHeaderDepth, depth);
      var collapsibleButton;

      if (collapsible && childHeaders.length > 0) {
        collapsibleButton = /*#__PURE__*/_react["default"].createElement("i", {
          className: "d-inline-block icon icon-fw fas icon-" + (open ? 'minus' : 'plus'),
          onClick: this.toggleOpen
        });
      }

      if (typeof link === 'string' && link.length > 0) {
        title = /*#__PURE__*/_react["default"].createElement("div", {
          className: "title-link-wrapper"
        }, collapsibleButton, /*#__PURE__*/_react["default"].createElement("a", {
          className: depth === 0 ? 'text-500' : 'text-400',
          href: (link.charAt(0) === '/' ? '' : '#') + link,
          onClick: function onClick(e) {
            e.preventDefault();

            _this2.handleClick();
          }
        }, title));
      }

      if (depth === 0) {
        title = /*#__PURE__*/_react["default"].createElement("span", {
          title: "Up to page listing",
          className: "top-of-page visible-lg-block visible-lg"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon fas icon-angle-up"
        }), title);
      }

      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "table-content-entry" + (className ? ' ' + className : '') + (depth === 0 ? ' top' : '') + (active ? ' active' : ''),
        "data-depth": depth,
        "data-recursion-depth": recurDepth
      }, title, /*#__PURE__*/_react["default"].createElement(_Collapse["default"], {
        "in": !this.state || open && mounted
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(TableEntryChildren, _extends({
        navigate: propNavigate,
        parentClosed: this.state && !open
      }, {
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
      })))));
    }
  }]);

  return TableEntry;
}(_react["default"].Component);

_defineProperty(TableEntry, "getChildHeaders", (0, _memoizeOne["default"])(function (content, maxHeaderDepth, currentDepth) {
  if (!TableOfContents.isContentJSX(content) || !content.props || !content.props.children) return [];
  return _underscore["default"].filter(content.props.children, function (child) {
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

  _createClass(TableEntryChildren, null, [{
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
        return _underscore["default"].map(childHeaders, function (h) {
          var childContent = TableEntryChildren.getSubsequentChildHeaders(h, jsxContent, maxHeaderDepth, currentDepth);

          if (skipDepth > currentDepth) {
            return TableEntryChildren.renderChildrenElements(childHeaders, currentDepth + 1, childContent.content, _underscore["default"].extend({}, opts, {
              'nextHeader': childContent.nextMajorHeader || nextHeader || null
            }));
          }

          var hAttributes = MarkdownHeading.getAttributes(h.props.children);
          var linkTitle = TableOfContents.textFromReactChildren(h.props.children); // We must have this to be equal to the ID of the element we're navigating to.
          // A custom ID might be set in Markdown 'attributes' which we prefer over the one passed to explicitly via props.

          var link = hAttributes && hAttributes.id || h.props.id || null;

          if (hAttributes && hAttributes.matchedString) {
            linkTitle = linkTitle.replace(hAttributes.matchedString, '').trim();
          }
          /** @deprecated */


          if (!link) link = TableOfContents.slugify(linkTitle); // Fallback -- attempt to not use -- may fail.

          return /*#__PURE__*/_react["default"].createElement(TableEntry, {
            link: link,
            title: linkTitle,
            key: link,
            depth: (currentDepth || 0) + 1,
            listStyleTypes: listStyleTypes,
            pageScrollTop: pageScrollTop,
            mounted: mounted,
            content: childContent.content,
            nextHeader: childContent.nextMajorHeader || nextHeader || null,
            navigate: _navigate.navigate,
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
      var _this$getHeadersFromC = this.getHeadersFromContent(),
          childHeaders = _this$getHeadersFromC.childHeaders,
          childDepth = _this$getHeadersFromC.childDepth;

      if (childHeaders && childHeaders.length) {
        var opts = _underscore["default"].pick(this.props, 'maxHeaderDepth', 'pageScrollTop', 'listStyleTypes', 'skipDepth', 'nextHeader', 'mounted', 'recurDepth');

        var _this$props2 = this.props,
            content = _this$props2.content,
            depth = _this$props2.depth;
        return TableEntryChildren.renderChildrenElements(childHeaders, childDepth, content, opts);
      } else {
        return this.props.children;
      }
    }
  }, {
    key: "render",
    value: function render() {
      // Removed: 'collapse' children if not over them (re: negative feedback)
      //if (this.props.depth >= 3 && !this.props.active) return null;
      var children = this.children();
      if (!children) return null;
      return /*#__PURE__*/_react["default"].createElement("ol", {
        className: "inner",
        style: {
          'listStyleType': this.props.listStyleTypes[(this.props.depth || 0) + 1]
        },
        children: children
      });
    }
  }]);

  return TableEntryChildren;
}(_react["default"].Component);

_defineProperty(TableEntryChildren, "getHeadersFromContent", (0, _memoizeOne["default"])(function (jsxContent, maxHeaderDepth, currentDepth) {
  if (!TableOfContents.isContentJSX(jsxContent)) return [];
  var depthToFind = currentDepth;
  var childrenForDepth = [];

  while (depthToFind <= Math.min(maxHeaderDepth, 5) && childrenForDepth.length === 0) {
    childrenForDepth = _underscore["default"].filter(jsxContent.props.children, function (child) {
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

_defineProperty(TableEntryChildren, "getSubsequentChildHeaders", (0, _memoizeOne["default"])(function (header, jsxContent, maxHeaderDepth, currentDepth) {
  if (!TableOfContents.isContentJSX(jsxContent)) return null;
  var getNext = null;
  var nextMajorHeader = null;

  var nextHeaderComponents = _underscore["default"].reduce(jsxContent.props.children, function (m, child) {
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
  },
  /* m = */
  []);

  return {
    'content': /*#__PURE__*/_react["default"].cloneElement(jsxContent, {}, nextHeaderComponents),
    'nextMajorHeader': nextMajorHeader
  };
}));

var TableOfContents = /*#__PURE__*/function (_React$Component3) {
  _inherits(TableOfContents, _React$Component3);

  var _super3 = _createSuper(TableOfContents);

  _createClass(TableOfContents, null, [{
    key: "slugify",

    /** Taken from https://gist.github.com/mathewbyrne/1280286 */

    /** @deprecated */
    value: function slugify(text) {
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
        var childrenWithChildren = _underscore["default"].filter(children, function (c) {
          return typeof c === 'string' || c && c.props && c.props.children;
        });

        var childPrimaryElemIfAny = _underscore["default"].find(childrenWithChildren, function (c) {
          return c && _typeof(c) === 'object' && c.props && (c.type === 'code' || c.type === 'strong' || c.type === 'b');
        });

        if (childPrimaryElemIfAny) {
          return TableOfContents.textFromReactChildren(childPrimaryElemIfAny);
        } else {
          return _underscore["default"].map(children, TableOfContents.textFromReactChildren).join('');
        }
      }

      return '';
    }
  }, {
    key: "isHeaderComponent",
    value: function isHeaderComponent(c) {
      var maxHeaderDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
      return c && c.props && typeof c.props.type === 'string' && c.props.type.charAt(0).toLowerCase() === 'h' && _underscore["default"].range(1, maxHeaderDepth + 1).indexOf(parseInt(c.props.type.charAt(1))) > -1;
    }
  }, {
    key: "isContentJSX",
    value: function isContentJSX(content) {
      if (!content || _typeof(content) !== 'object') return false;
      var proto = Object.getPrototypeOf(content);
      return proto && proto.isPrototypeOf(_react["default"].Component.prototype);
    }
  }, {
    key: "elementIDFromSectionName",
    value: function elementIDFromSectionName(sectionName) {
      var sectionParts;

      if (sectionName.indexOf('#') > -1) {
        sectionParts = sectionName.split('#');
        sectionName = sectionParts[sectionParts.length - 1];
      } else if (sectionName.indexOf('.') > -1) {
        sectionParts = sectionName.split('.');
        sectionName = sectionParts[sectionParts.length - 1];
      }

      return sectionName;
    }
  }, {
    key: "scrollToLink",
    value: function scrollToLink(link) {
      var offsetBeforeTarget = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 72;
      var navigateFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _navigate.navigate;
      var targetElement = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var pageScrollTop, elementTop;

      if (link === "top") {
        elementTop = 0;
      } else if (typeof link === 'string' && link) {
        if (link.charAt(0) === '/') {
          navigateFunc(link);
          return;
        } else {
          elementTop = (0, _layout.getElementTop)(targetElement || document.getElementById(link));
        }
      } else {
        return null;
      }

      pageScrollTop = (0, _layout.getPageVerticalScrollPosition)();
      (0, _layout.animateScrollTo)(elementTop, 750, offsetBeforeTarget, function () {
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
      if (window && !(0, _misc.isServerSide)()) {
        this.setState({
          'mounted': true,
          'scrollTop': parseInt((0, _layout.getPageVerticalScrollPosition)())
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
            'scrollTop': parseInt((0, _layout.getPageVerticalScrollPosition)())
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
      cols.push( /*#__PURE__*/_react["default"].createElement("div", {
        key: "parent-link",
        className: "col col-xs-" + (windowInnerWidth && windowInnerWidth >= 1600 ? '9' : '12')
      }, /*#__PURE__*/_react["default"].createElement("a", {
        className: "text-500",
        href: context.parent['@id']
      }, context.parent['display_title'])));

      if (windowInnerWidth && windowInnerWidth >= 1600) {
        cols.push( /*#__PURE__*/_react["default"].createElement("div", {
          key: "expand-btn",
          className: "col col-xs-3 text-right expand-button-container"
        }, /*#__PURE__*/_react["default"].createElement("button", {
          type: "button",
          className: "btn btn-xs btn-outline-dark",
          onClick: this.onToggleWidthBound
        }, widthBound ? /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw fas icon-angle-left"
        })) : /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw fas icon-angle-right"
        })))));
      }

      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "table-content-entry parent-entry",
        "data-depth": "0",
        key: "parent-link"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        title: "Up to page listing",
        className: "top-of-page with-border-bottom visible-lg-block visible-lg"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, cols)));
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var _this$props3 = this.props,
          context = _this$props3.context,
          maxHeaderDepth = _this$props3.maxHeaderDepth,
          includeTop = _this$props3.includeTop,
          fixedGridWidth = _this$props3.fixedGridWidth,
          includeNextPreviousPages = _this$props3.includeNextPreviousPages,
          listStyleTypes = _this$props3.listStyleTypes,
          windowWidth = _this$props3.windowWidth,
          windowHeight = _this$props3.windowHeight,
          maxHeight = _this$props3.maxHeight;
      var _this$state = this.state,
          mounted = _this$state.mounted,
          scrollTop = _this$state.scrollTop,
          widthBound = _this$state.widthBound;
      var contents = [];
      var skipDepth = 0;

      var sectionEntries = function () {
        var lastSection = null;
        var excludeSectionsFromTOC = _underscore["default"].filter(context.content, function (section) {
          return section.title || section['toc-title'];
        }).length < 2;
        return (0, _underscore["default"])(context.content).chain().sortBy(function (s) {
          return s.order || 99;
        }).map(function (s, i, all) {
          s.link = TableOfContents.elementIDFromSectionName(s.name);
          if (lastSection) lastSection.nextHeader = s.link;
          lastSection = s;
          if (all.length - 1 === i) s.nextHeader = 'bottom';
          return s;
        }).map(function (s) {
          if (excludeSectionsFromTOC) {
            skipDepth = 1;

            var _TableEntryChildren$g = TableEntryChildren.getHeadersFromContent(s.content, maxHeaderDepth, 1),
                childHeaders = _TableEntryChildren$g.childHeaders,
                childDepth = _TableEntryChildren$g.childDepth;

            var opts = _underscore["default"].extend({
              childHeaders: childHeaders,
              maxHeaderDepth: maxHeaderDepth,
              listStyleTypes: listStyleTypes,
              skipDepth: skipDepth
            }, {
              'mounted': mounted,
              'pageScrollTop': scrollTop,
              'nextHeader': s.nextHeader
            });

            return TableEntryChildren.renderChildrenElements(childHeaders, childDepth, s.content, opts);
          }

          return /*#__PURE__*/_react["default"].createElement(TableEntry, {
            link: s.link,
            title: s['toc-title'] || s.title || _underscore["default"].map(s.link.split('-'), function (w) {
              return w.charAt(0).toUpperCase() + w.slice(1);
            }).join(' '),
            key: s.link,
            depth: 1,
            content: s.content,
            listStyleTypes: listStyleTypes,
            pageScrollTop: scrollTop,
            mounted: mounted,
            nextHeader: s.nextHeader,
            navigate: _this6.props.navigate,
            maxHeaderDepth: maxHeaderDepth,
            skipDepth: skipDepth
          });
        }).flatten(false).value();
      };

      if (context && context.parent && context.parent['@id']) {
        contents.push(this.parentLink(windowWidth));
      }

      var renderedSections = sectionEntries();
      contents.push( /*#__PURE__*/_react["default"].createElement(TableEntry, {
        link: "top",
        title: context['display_title'] || 'Top of Page' || null,
        key: "top",
        depth: 0,
        listStyleTypes: listStyleTypes,
        pageScrollTop: scrollTop,
        mounted: mounted,
        navigate: this.props.navigate,
        nextHeader: renderedSections[0] && renderedSections[0].props && renderedSections[0].props.link || null,
        maxHeaderDepth: maxHeaderDepth,
        skipDepth: skipDepth || 0
      }, sectionEntries()));
      var marginTop = 0; // Account for test warning

      if (windowWidth) {
        if (typeof scrollTop === 'number' && scrollTop < 80 && windowWidth >= 1200) {
          var testWarningElem = document.getElementsByClassName('navbar-container test-warning-visible');
          marginTop = testWarningElem[0] && testWarningElem[0].offsetHeight || marginTop;
        } else if (windowWidth < 1200) {
          marginTop = -12; // Account for spacing between title and first section
        }
      }

      var isEmpty = Array.isArray(contents) && !_underscore["default"].filter(contents).length || !contents;
      return /*#__PURE__*/_react["default"].createElement("div", {
        key: "toc",
        className: "table-of-contents" + (widthBound ? ' width-bounded' : ''),
        style: {
          'width': windowWidth ? windowWidth >= 1200 ? function () {
            return 1140 * (fixedGridWidth / 12) + (windowWidth - 1140) / 2 - 10;
          }() || 'inherit' : 'inherit' : 285,
          'height': windowWidth && windowHeight ? windowWidth >= 1200 ? maxHeight || scrollTop >= 40 ? windowHeight - 42 : windowHeight - 82 : null : 1000,
          marginTop: marginTop
        }
      }, !isEmpty ? /*#__PURE__*/_react["default"].createElement("ol", {
        className: "inner",
        style: {
          'listStyleType': listStyleTypes[0],
          'paddingLeft': 0
        }
      }, contents) : null, includeNextPreviousPages ? /*#__PURE__*/_react["default"].createElement(NextPreviousPageSection, {
        context: context,
        windowInnerWidth: windowWidth
      }) : null);
    }
  }]);

  return TableOfContents;
}(_react["default"].Component);

exports.TableOfContents = TableOfContents;

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

var NextPreviousPageSection = /*#__PURE__*/_react["default"].memo(function (props) {
  var context = props.context,
      className = props.className,
      previousTitle = props.previousTitle,
      nextTitle = props.nextTitle;
  var next = context.next,
      previous = context.previous;
  if (!next && !previous) return null;
  var colSize = previous && next ? 6 : 12;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "next-previous-pages-section" + (className && ' ' + className || '')
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "row"
  }, previous ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "previous-section text-right col-" + colSize
  }, /*#__PURE__*/_react["default"].createElement("h6", {
    className: "text-400 mb-02 mt-12"
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "icon icon-fw fas icon-angle-left"
  }), " ", previousTitle), /*#__PURE__*/_react["default"].createElement("h6", {
    className: "text-500 mt-0"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: previous['@id'] || '/' + previous.name
  }, previous.display_title))) : null, next ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "next-section col-" + colSize
  }, /*#__PURE__*/_react["default"].createElement("h6", {
    className: "text-400 mb-02 mt-12"
  }, nextTitle, " ", /*#__PURE__*/_react["default"].createElement("i", {
    className: "icon fas icon-fw icon-angle-right"
  })), /*#__PURE__*/_react["default"].createElement("h6", {
    className: "text-500 mt-0"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: next['@id'] || '/' + next.name
  }, next.display_title))) : null));
});

exports.NextPreviousPageSection = NextPreviousPageSection;
NextPreviousPageSection.defaultProps = {
  'previousTitle': 'Previous',
  'nextTitle': 'Next'
};

var MarkdownHeading = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(MarkdownHeading, _React$PureComponent);

  var _super4 = _createSuper(MarkdownHeading);

  _createClass(MarkdownHeading, null, [{
    key: "getAttributes",
    value: function getAttributes(children) {
      children = Array.isArray(children) ? children : [children];
      var attr = {
        'id': null,
        'className': null,
        'matchedString': null
      };

      var childrenOuterText = _underscore["default"].filter(children, function (c) {
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

  function MarkdownHeading(props) {
    var _this7;

    _classCallCheck(this, MarkdownHeading);

    _this7 = _super4.call(this, props);
    _this7.getID = _this7.getID.bind(_assertThisInitialized(_this7));
    return _this7;
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
      var _this$props4 = this.props,
          type = _this$props4.type,
          children = _this$props4.children;
      children = Array.isArray(children) ? children : [children];
      var propsToPass = {
        'children': children,
        'id': null,
        'type': type
      };
      var attributes = MarkdownHeading.getAttributes(children);

      if (attributes && attributes.matchedString) {
        propsToPass.children = _underscore["default"].map(children, function (c) {
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
      return /*#__PURE__*/_react["default"].createElement(HeaderWithLink, propsToPass); //return React.createElement(type, propsToPass);
    }
  }]);

  return MarkdownHeading;
}(_react["default"].PureComponent);

exports.MarkdownHeading = MarkdownHeading;

_defineProperty(MarkdownHeading, "defaultProps", {
  'type': 'h1',
  'id': null
});

var HeaderWithLink = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(HeaderWithLink, _React$PureComponent2);

  var _super5 = _createSuper(HeaderWithLink);

  function HeaderWithLink(props) {
    var _this8;

    _classCallCheck(this, HeaderWithLink);

    _this8 = _super5.call(this, props);
    _this8.handleLinkClick = _this8.handleLinkClick.bind(_assertThisInitialized(_this8));
    return _this8;
  }

  _createClass(HeaderWithLink, [{
    key: "handleLinkClick",
    value: function handleLinkClick() {
      if (!(!(0, _misc.isServerSide)() && typeof window !== 'undefined' && document)) return null;
      var id = this.props.link || this.props.id,
          itemAtID;
      if (this.props.context) itemAtID = _object.itemUtil.atId(this.props.context);else itemAtID = window.location.pathname;

      if (itemAtID) {
        var linkToCopy = itemAtID + '#' + id;
        linkToCopy = window.location.protocol + '//' + window.location.host + linkToCopy;

        _object.CopyWrapper.copyToClipboard(linkToCopy);

        TableOfContents.scrollToLink(id);
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.id && !this.props.link) throw new Error('HeaderWithLink needs a link or ID attribute/prop.');
      return /*#__PURE__*/_react["default"].createElement(this.props.type || 'h2', _underscore["default"].omit(this.props, 'type', 'children', 'link', 'context'), [this.props.children, /*#__PURE__*/_react["default"].createElement("i", {
        key: "icon-link",
        className: "icon icon-fw icon-link fas",
        onClick: this.handleLinkClick,
        title: "Copy link to clipboard"
      })]);
    }
  }]);

  return HeaderWithLink;
}(_react["default"].PureComponent);

exports.HeaderWithLink = HeaderWithLink;