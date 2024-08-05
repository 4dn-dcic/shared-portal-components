import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
function _callSuper(_this, derived, args) {
  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, function () {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { isServerSide } from './../util/misc';
import { patchedConsoleInstance as console } from './../util/patched-console';
import { gridContainerWidth, textContentWidth } from './../util/layout';
import { requestAnimationFrame as raf } from './../viz/utilities';
import { EditableField, FieldSet } from '../forms/components/EditableField';
export var FlexibleCharacterCountBox = /*#__PURE__*/function (_React$Component) {
  function FlexibleCharacterCountBox(props) {
    var _this2;
    _classCallCheck(this, FlexibleCharacterCountBox);
    _this2 = _callSuper(this, FlexibleCharacterCountBox, [props]);
    _this2.render = _this2.render.bind(_this2);
    _this2.onClick = _.debounce(_this2.onClick.bind(_this2), 300, true);
    _this2.state = {
      'expanded': props.defaultExpanded || false
    };
    return _this2;
  }
  _inherits(FlexibleCharacterCountBox, _React$Component);
  return _createClass(FlexibleCharacterCountBox, [{
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
}(React.Component);
_defineProperty(FlexibleCharacterCountBox, "propTypes", {
  'characters': PropTypes.number.isRequired,
  'string': PropTypes.string.isRequired,
  'icon': PropTypes.element
});
var FlexibleCharacterCountString = /*#__PURE__*/function (_React$Component2) {
  function FlexibleCharacterCountString() {
    _classCallCheck(this, FlexibleCharacterCountString);
    return _callSuper(this, FlexibleCharacterCountString, arguments);
  }
  _inherits(FlexibleCharacterCountString, _React$Component2);
  return _createClass(FlexibleCharacterCountString, [{
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
  function FlexibleDescriptionBox(props) {
    var _this3;
    _classCallCheck(this, FlexibleDescriptionBox);
    _this3 = _callSuper(this, FlexibleDescriptionBox, [props]);
    _this3.dimensions = _this3.dimensions.bind(_this3);
    _this3.checkWillDescriptionFitOneLineAndUpdateHeight = _this3.checkWillDescriptionFitOneLineAndUpdateHeight.bind(_this3);
    _this3.toggleDescriptionExpand = _this3.toggleDescriptionExpand.bind(_this3);
    _this3.makeShortContent = _this3.makeShortContent.bind(_this3);
    _this3.havePermissionToEdit = _this3.havePermissionToEdit.bind(_this3);
    _this3.descriptionHeight = null;
    _this3.state = {
      'descriptionExpanded': props.defaultExpanded,
      'descriptionWillFitOneLine': true,
      'descriptionWhiteSpace': _this3.props.linesOfText > 1 ? 'normal' : 'nowrap',
      'shortContent': null,
      'mounted': false
    };
    return _this3;
  }
  _inherits(FlexibleDescriptionBox, _React$Component3);
  return _createClass(FlexibleDescriptionBox, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var _this4 = this;
      // Handle window resize
      if (pastProps.windowWidth !== this.props.windowWidth) {
        // Recalculate some layouting stuff

        raf(function () {
          _this4.setState(function () {
            _this4.descriptionHeight;
            var willDescriptionFitAtNewWindowSize = _this4.checkWillDescriptionFitOneLineAndUpdateHeight();
            return {
              'descriptionWillFitOneLine': willDescriptionFitAtNewWindowSize,
              'shortContent': _this4.props.linesOfText > 1 ? _this4.makeShortContent() : null
            };
          });
        });
      }
    }
  }, {
    key: "updateDescriptionHeight",
    value: function updateDescriptionHeight() {
      var willDescriptionFitAtCurrentSize = this.checkWillDescriptionFitOneLineAndUpdateHeight();
      this.setState({
        'descriptionWillFitOneLine': willDescriptionFitAtCurrentSize,
        'mounted': true,
        'shortContent': this.props.linesOfText > 1 ? this.makeShortContent() : null
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this5 = this;
      if (this.props.debug) console.info("Mounted FlexibleDescriptionBox");
      if (!isServerSide()) {
        // Create throttled version of toggleDescriptionExpand for button.
        this.throttledToggleDescriptionExpand = _.throttle(this.toggleDescriptionExpand, 350);
        window.addEventListener('resize', function () {
          return _this5.updateDescriptionHeight();
        });
        setTimeout(function () {
          _this5.updateDescriptionHeight();
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

      var tcw = textContentWidth(description, textElement, textClassName, containerWidth - dims.buttonWidth,
      // Account for expand button.
      textStyle);
      if (!tcw) return true;
      this.descriptionHeight = tcw.containerHeight + dims.paddingHeight; // Account for padding, border.
      this.descriptionWidth = containerWidth;

      // If we want more than 1 line, calculate if descriptionheight / lineheight > linesWanted.
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
      var _this6 = this;
      this.setState(function (_ref2) {
        var descriptionExpanded = _ref2.descriptionExpanded;
        return {
          "descriptionWhiteSpace": "normal",
          "descriptionExpanded": !descriptionExpanded
        };
      }, function () {
        var linesOfText = _this6.props.linesOfText;
        var descriptionExpanded = _this6.state.descriptionExpanded;
        if (!descriptionExpanded && linesOfText === 1) {
          // Delay whiteSpace style since can't transition it w/ CSS3
          setTimeout(function () {
            _this6.setState({
              "descriptionWhiteSpace": 'nowrap'
            });
          }, 350);
        } else if (!descriptionExpanded) {
          // Nada
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
      var containerHeightSet = expanded ? this.descriptionHeight : !mounted && showOnMount ? 0 : collapsedHeight || Math.min(Math.max(this.dimensions().initialHeight, lineHeight * (linesOfText || 1)), mounted && this.descriptionHeight || 1000);

      // Add boxRef to our instance only if we need to.
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