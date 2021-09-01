'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { isServerSide } from './../util/misc';
import { patchedConsoleInstance as console } from './../util/patched-console';
import { gridContainerWidth, textContentWidth } from './../util/layout';
import { requestAnimationFrame as raf } from './../viz/utilities';
import { EditableField, FieldSet } from '../forms/components/EditableField';
export var FlexibleCharacterCountBox = /*#__PURE__*/function (_React$Component) {
  _inherits(FlexibleCharacterCountBox, _React$Component);

  var _super = _createSuper(FlexibleCharacterCountBox);

  function FlexibleCharacterCountBox(props) {
    var _this;

    _classCallCheck(this, FlexibleCharacterCountBox);

    _this = _super.call(this, props);
    _this.render = _this.render.bind(_assertThisInitialized(_this));
    _this.onClick = _.debounce(_this.onClick.bind(_assertThisInitialized(_this)), 300, true);
    _this.state = {
      'expanded': props.defaultExpanded || false
    };
    return _this;
  }

  _createClass(FlexibleCharacterCountBox, [{
    key: "onClick",
    value: function onClick() {
      this.setState(function (_ref) {
        var expanded = _ref.expanded;
        return {
          "expanded": !expanded
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          string = _this$props.string,
          characters = _this$props.characters,
          expandCharacters = _this$props.expandCharacters,
          icon = _this$props.icon;
      var expanded = this.state.expanded;
      var expandable = string.length > (characters || expandCharacters);

      if (!expandable) {
        return /*#__PURE__*/React.createElement("span", null, string);
      }

      var visibleIcon = icon && /*#__PURE__*/React.cloneElement(icon, {
        'onClick': this.onClick,
        'expanded': expanded,
        'data-expanded': expanded
      }) || /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-" + (expanded ? 'minus' : 'plus'),
        onClick: this.onClick
      });
      return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(FlexibleCharacterCountString, {
        string: string,
        expanded: expanded,
        expandCharacters: characters || expandCharacters
      }), " \xA0 ", visibleIcon);
    }
  }]);

  return FlexibleCharacterCountBox;
}(React.Component);

_defineProperty(FlexibleCharacterCountBox, "propTypes", {
  'characters': PropTypes.number.isRequired,
  'string': PropTypes.string.isRequired,
  'icon': PropTypes.element
});

var FlexibleCharacterCountString = /*#__PURE__*/function (_React$Component2) {
  _inherits(FlexibleCharacterCountString, _React$Component2);

  var _super2 = _createSuper(FlexibleCharacterCountString);

  function FlexibleCharacterCountString() {
    _classCallCheck(this, FlexibleCharacterCountString);

    return _super2.apply(this, arguments);
  }

  _createClass(FlexibleCharacterCountString, [{
    key: "isExpanded",
    value: function isExpanded() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      if (typeof props.expanded === 'boolean') return props.expanded;
      if (typeof props.expanded === 'function') return props.expanded(props);
    }
  }, {
    key: "render",
    value: function render() {
      var expanded = this.isExpanded(this.props);
      if (expanded) return this.props.string;else {
        if (typeof this.props.expandCharacters === 'number' && typeof this.props.string === 'string') {
          return this.props.string.slice(0, this.props.expandCharacters);
        } else {
          throw new Error('props.string must be a string and props.expandCharacters must be a number.');
        }
      }
    }
  }]);

  return FlexibleCharacterCountString;
}(React.Component);
/**
 * Works by calculating height of text content using a temporary off-screen container element.
 * Not related to FlexibleCharacterCount.. classes above.
 */


_defineProperty(FlexibleCharacterCountString, "propTypes", {
  'string': PropTypes.string,
  'expanded': PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  'expandCharacters': PropTypes.oneOfType([PropTypes.number, PropTypes.func])
});

_defineProperty(FlexibleCharacterCountString, "defaultProps", {
  'expanded': false
});

export var FlexibleDescriptionBox = /*#__PURE__*/function (_React$Component3) {
  _inherits(FlexibleDescriptionBox, _React$Component3);

  var _super3 = _createSuper(FlexibleDescriptionBox);

  function FlexibleDescriptionBox(props) {
    var _this2;

    _classCallCheck(this, FlexibleDescriptionBox);

    _this2 = _super3.call(this, props);
    _this2.dimensions = _this2.dimensions.bind(_assertThisInitialized(_this2));
    _this2.checkWillDescriptionFitOneLineAndUpdateHeight = _this2.checkWillDescriptionFitOneLineAndUpdateHeight.bind(_assertThisInitialized(_this2));
    _this2.toggleDescriptionExpand = _this2.toggleDescriptionExpand.bind(_assertThisInitialized(_this2));
    _this2.makeShortContent = _this2.makeShortContent.bind(_assertThisInitialized(_this2));
    _this2.havePermissionToEdit = _this2.havePermissionToEdit.bind(_assertThisInitialized(_this2));
    _this2.descriptionHeight = null;
    _this2.state = {
      'descriptionExpanded': props.defaultExpanded,
      'descriptionWillFitOneLine': true,
      'descriptionWhiteSpace': _this2.props.linesOfText > 1 ? 'normal' : 'nowrap',
      'shortContent': null,
      'mounted': false
    };
    return _this2;
  }

  _createClass(FlexibleDescriptionBox, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var _this3 = this;

      // Handle window resize
      if (pastProps.windowWidth !== this.props.windowWidth) {
        // Recalculate some layouting stuff
        raf(function () {
          _this3.setState(function () {
            _this3.descriptionHeight;

            var willDescriptionFitAtNewWindowSize = _this3.checkWillDescriptionFitOneLineAndUpdateHeight();

            return {
              'descriptionWillFitOneLine': willDescriptionFitAtNewWindowSize,
              'shortContent': _this3.props.linesOfText > 1 ? _this3.makeShortContent() : null
            };
          });
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      if (this.props.debug) console.info("Mounted FlexibleDescriptionBox");

      if (!isServerSide()) {
        // Create throttled version of toggleDescriptionExpand for button.
        this.throttledToggleDescriptionExpand = _.throttle(this.toggleDescriptionExpand, 350);
        window.addEventListener('resize', function () {
          return _this4.checkWillDescriptionFitOneLineAndUpdateHeight();
        });
        setTimeout(function () {
          var willDescriptionFitAtCurrentSize = _this4.checkWillDescriptionFitOneLineAndUpdateHeight();

          _this4.setState({
            'descriptionWillFitOneLine': willDescriptionFitAtCurrentSize,
            'mounted': true,
            'shortContent': _this4.props.linesOfText > 1 ? _this4.makeShortContent() : null
          });
        }, 50);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (typeof window != 'undefined') {
        delete this.throttledToggleDescriptionExpand;
      }
    }
  }, {
    key: "makeShortContent",
    value: function makeShortContent() {
      var charsToKeep = 0.133 * (this.props.linesOfText * (this.descriptionWidth || 20));
      return this.props.description.slice(0, charsToKeep) + (!this.props.description.charAt(charsToKeep) ? '' : '...');
    }
  }, {
    key: "dimensions",
    value: function dimensions() {
      if (this.props.dimensions) return _.extend({}, FlexibleDescriptionBox.defaultDimensions, this.props.dimensions);else return _.clone(FlexibleDescriptionBox.defaultDimensions);
    }
  }, {
    key: "checkWillDescriptionFitOneLineAndUpdateHeight",
    value: function checkWillDescriptionFitOneLineAndUpdateHeight() {
      var _this$props2 = this.props,
          description = _this$props2.description,
          textElement = _this$props2.textElement,
          textClassName = _this$props2.textClassName,
          textStyle = _this$props2.textStyle,
          windowWidth = _this$props2.windowWidth,
          linesOfText = _this$props2.linesOfText,
          lineHeight = _this$props2.lineHeight,
          fitTo = _this$props2.fitTo;
      if (isServerSide()) return true;
      var boxRef = this.boxRef && this.boxRef.current || null;

      if (!boxRef) {
        console.error("boxRef not available");
      }

      var dims = this.dimensions();
      var containerWidth;

      if (fitTo === 'grid') {
        containerWidth = gridContainerWidth(windowWidth || null);
      } else if (fitTo === 'parent') {
        containerWidth = boxRef && boxRef.parentElement && boxRef.parentElement.offsetWidth || gridContainerWidth(windowWidth || null);
      } else if (fitTo === 'self') {
        containerWidth = boxRef && boxRef.offsetWidth || gridContainerWidth(windowWidth || null);
      }

      containerWidth -= dims.paddingWidth; // Account for inner padding & border.

      var tcw = textContentWidth(description, textElement, textClassName, containerWidth - dims.buttonWidth, // Account for expand button.
      textStyle);
      if (!tcw) return true;
      this.descriptionHeight = tcw.containerHeight + dims.paddingHeight; // Account for padding, border.

      this.descriptionWidth = containerWidth; // If we want more than 1 line, calculate if descriptionheight / lineheight > linesWanted.

      if (typeof linesOfText === 'number' && linesOfText > 1 && typeof lineHeight === 'number') {
        var divRes = Math.ceil(this.descriptionHeight / lineHeight);

        if (divRes > linesOfText) {
          return false;
        }

        return true;
      }

      if (tcw.textWidth < containerWidth) {
        this.descriptionHeight = lineHeight + dims.paddingHeight; // unset if calcd higher val above

        return true;
      }

      return false;
    }
  }, {
    key: "toggleDescriptionExpand",
    value: function toggleDescriptionExpand() {
      var _this5 = this;

      this.setState(function (_ref2) {
        var descriptionExpanded = _ref2.descriptionExpanded;
        return {
          "descriptionWhiteSpace": "normal",
          "descriptionExpanded": !descriptionExpanded
        };
      }, function () {
        var linesOfText = _this5.props.linesOfText;
        var descriptionExpanded = _this5.state.descriptionExpanded;

        if (!descriptionExpanded && linesOfText === 1) {
          // Delay whiteSpace style since can't transition it w/ CSS3
          setTimeout(function () {
            _this5.setState({
              "descriptionWhiteSpace": 'nowrap'
            });
          }, 350);
        } else if (!descriptionExpanded) {// Nada
        }
      });
    }
  }, {
    key: "havePermissionToEdit",
    value: function havePermissionToEdit() {
      var _this$props$context$a = this.props.context.actions,
          actions = _this$props$context$a === void 0 ? [] : _this$props$context$a;
      return !!_.findWhere(actions, {
        'name': 'edit'
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          debug = _this$props3.debug,
          propExpanded = _this$props3.expanded,
          showOnMount = _this$props3.showOnMount,
          lineHeight = _this$props3.lineHeight,
          linesOfText = _this$props3.linesOfText,
          collapsedHeight = _this$props3.collapsedHeight,
          className = _this$props3.className,
          textElement = _this$props3.textElement,
          textClassName = _this$props3.textClassName,
          textStyle = _this$props3.textStyle,
          description = _this$props3.description,
          fitTo = _this$props3.fitTo;
      var _this$state = this.state,
          descriptionWillFitOneLine = _this$state.descriptionWillFitOneLine,
          descriptionExpanded = _this$state.descriptionExpanded,
          mounted = _this$state.mounted,
          shortContent = _this$state.shortContent,
          descriptionWhiteSpace = _this$state.descriptionWhiteSpace;
      if (debug) console.log('render FlexibleDescriptionBox');
      var expandButton;
      var expanded = descriptionExpanded || propExpanded;

      if (!descriptionWillFitOneLine && typeof propExpanded !== 'boolean') {
        expandButton = /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "description-expand-button right",
          onClick: this.throttledToggleDescriptionExpand
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon fas icon-" + (expanded ? 'minus' : 'plus')
        }));
      }

      var containerHeightSet = expanded ? this.descriptionHeight : !mounted && showOnMount ? 0 : collapsedHeight || Math.min(Math.max(this.dimensions().initialHeight, lineHeight * (linesOfText || 1)), mounted && this.descriptionHeight || 1000); // Add boxRef to our instance only if we need to.
      // Moved from componentWillReceiveProps as this lifecycle method is being deprecated.

      if (!this.boxRef && (fitTo === 'self' || fitTo === 'parent')) {
        this.boxRef = /*#__PURE__*/React.createRef();
      }

      var _this$props4 = this.props,
          children = _this$props4.children,
          subtitle = _this$props4.subtitle,
          windowWidth = _this$props4.windowWidth,
          title = _this$props4.title,
          schemas = _this$props4.schemas,
          href = _this$props4.href,
          subTitleClassName = _this$props4.subTitleClassName,
          context = _this$props4.context,
          isInlineEditable = _this$props4.isInlineEditable;

      if (isInlineEditable && this.havePermissionToEdit()) {
        return /*#__PURE__*/React.createElement("div", {
          ref: this.boxRef,
          className: "flexible-description-box " + (className ? className : '') + (expandButton ? expanded ? ' expanded' : ' collapsed' : ' not-expandable'),
          style: {
            'height': containerHeightSet,
            'whiteSpace': expanded ? 'normal' : descriptionWhiteSpace,
            'visibility': !mounted && showOnMount ? 'hidden' : null
          }
        }, expandButton, /*#__PURE__*/React.createElement(FieldSet, {
          context: context,
          className: textClassName,
          style: textStyle,
          schemas: schemas,
          href: href
        }, /*#__PURE__*/React.createElement(EditableField, {
          className: textClassName,
          labelID: "description",
          style: "row-without-label",
          placeholder: "description",
          fallbackText: "click to add new description",
          fieldType: "text",
          buttonAlwaysVisible: true
        })));
      }

      return /*#__PURE__*/React.createElement("div", {
        ref: this.boxRef,
        className: "flexible-description-box " + (className ? className : '') + (expandButton ? expanded ? ' expanded' : ' collapsed' : ' not-expandable'),
        style: {
          'height': containerHeightSet,
          'whiteSpace': expanded ? 'normal' : descriptionWhiteSpace,
          'visibility': !mounted && showOnMount ? 'hidden' : null
        }
      }, expandButton, /*#__PURE__*/React.createElement(textElement, {
        'className': textClassName,
        'style': textStyle
      }, expanded ? description : shortContent || description));
    }
  }]);

  return FlexibleDescriptionBox;
}(React.Component);

_defineProperty(FlexibleDescriptionBox, "defaultDimensions", {
  'paddingWidth': 0,
  'paddingHeight': 0,
  'buttonWidth': 30,
  'initialHeight': 19
});

_defineProperty(FlexibleDescriptionBox, "propTypes", {
  'description': PropTypes.any.isRequired,
  'dimensions': PropTypes.shape({
    'paddingWidth': PropTypes.number,
    'paddingHeight': PropTypes.number,
    'buttonWidth': PropTypes.number,
    'initialHeight': PropTypes.number
  }),
  'fitTo': PropTypes.oneOf(['grid', 'parent', 'self']),
  'includeButton': PropTypes.bool,
  // If false, must use refs and call this.toggleDescriptionExpand manually
  'className': PropTypes.string,
  'textClassName': PropTypes.string,
  'textElement': PropTypes.oneOf(['p', 'span', 'div', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  'textStyle': PropTypes.object,
  'expanded': PropTypes.bool,
  'windowWidth': PropTypes.number.isRequired,
  'context': PropTypes.object
});

_defineProperty(FlexibleDescriptionBox, "defaultProps", {
  'dimensions': null,
  'fitTo': 'self',
  'includeButton': true,
  'className': null,
  'textClassName': null,
  'textElement': 'p',
  'textStyle': null,
  'debug': false,
  'linesOfText': 1,
  'lineHeight': 19,
  'defaultExpanded': false,
  'collapsedHeight': null
});