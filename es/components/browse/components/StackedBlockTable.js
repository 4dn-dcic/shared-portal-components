'use strict';

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

import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import _ from 'underscore';
import Collapse from 'react-bootstrap/esm/Collapse';
import { object, typedefs } from './../../util'; // eslint-disable-next-line no-unused-vars

var Item = typedefs.Item;
/**
 * @todo:
 * - improve/cleanup code
 * - remove references to selectedFiles & similar props but ensure still works from 4DN/file-tables
 *   - maybe pass in selectedFiles props directly to FileEntryBlock (& similar)
 *   - or pass them thru props here
 */

export function StackedBlockNameLabel(props) {
  var title = props.title,
      subtitle = props.subtitle,
      accession = props.accession,
      className = props.className,
      subtitleVisible = props.subtitleVisible;
  var cls = "label-ext-info" + (className ? ' ' + className : '') + (subtitle || accession ? ' has-subtitle' : '') + (subtitleVisible ? ' subtitle-visible' : '');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    key: "label"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label-title"
  }, title), subtitle || accession ? /*#__PURE__*/React.createElement("div", {
    className: "ext" + (accession ? ' is-accession' : '')
  }, accession ? /*#__PURE__*/React.createElement(object.CopyWrapper, {
    value: accession,
    key: "copy-accession"
  }, accession || subtitle) : subtitle) : null);
}
StackedBlockNameLabel.propTypes = {
  /** Subtitle/label will appear more opaque when not hovered over */
  'subtitleVisible': PropTypes.bool,
  'className': PropTypes.string,
  'title': PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  'subtitle': PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  // Pass in place of or in addition to subtitle (takes precedence).
  'accession': PropTypes.string
};
/** Name element to be put inside of StackedBlocks as the first child. */

export var StackedBlockName = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(StackedBlockName, _React$PureComponent);

  var _super = _createSuper(StackedBlockName);

  function StackedBlockName() {
    _classCallCheck(this, StackedBlockName);

    return _super.apply(this, arguments);
  }

  _createClass(StackedBlockName, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          style = _this$props.style,
          relativePosition = _this$props.relativePosition,
          colWidthStyles = _this$props.colWidthStyles,
          columnClass = _this$props.columnClass,
          label = _this$props.label,
          className = _this$props.className;
      var useStyle = {};
      var colWidthStyle = colWidthStyles[columnClass];
      if (style) _.extend(useStyle, style);
      if (colWidthStyle) _.extend(useStyle, colWidthStyle);
      if (relativePosition) useStyle.position = 'relative';
      return /*#__PURE__*/React.createElement("div", {
        className: "name col-" + columnClass + (className ? " " + className : ""),
        style: useStyle
      }, label, children);
    }
  }]);

  return StackedBlockName;
}(React.PureComponent);
/**
 * Button to toggle collapse/visible of longer StacedkBlockLists. Used in StackedBlockLists.
 */

_defineProperty(StackedBlockName, "Label", StackedBlockNameLabel);

export var StackedBlockListViewMoreButton = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(StackedBlockListViewMoreButton, _React$PureComponent2);

  var _super2 = _createSuper(StackedBlockListViewMoreButton);

  function StackedBlockListViewMoreButton() {
    _classCallCheck(this, StackedBlockListViewMoreButton);

    return _super2.apply(this, arguments);
  }

  _createClass(StackedBlockListViewMoreButton, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          collapsibleChildren = _this$props2.collapsibleChildren,
          collapsed = _this$props2.collapsed,
          title = _this$props2.title,
          showMoreExtTitle = _this$props2.showMoreExtTitle,
          handleCollapseToggle = _this$props2.handleCollapseToggle,
          _this$props2$preventE = _this$props2.preventExpand,
          preventExpand = _this$props2$preventE === void 0 ? false : _this$props2$preventE;
      var collapsibleChildrenLen = collapsibleChildren.length;
      if (collapsibleChildrenLen === 0) return null;

      if (preventExpand) {
        // Show information label instead of button.
        return /*#__PURE__*/React.createElement("div", {
          className: "view-more-button"
        }, /*#__PURE__*/React.createElement("i", {
          className: "icon fas icon-plus mr-1 ml-02 small"
        }), collapsibleChildrenLen + " More" + (title ? ' ' + title : ''), showMoreExtTitle ? /*#__PURE__*/React.createElement("span", {
          className: "ext text-400"
        }, " ", showMoreExtTitle) : null);
      }

      var titleStr = (collapsed ? preventExpand ? collapsibleChildrenLen + " More" : "Show ".concat(collapsibleChildrenLen, " More") : "Show Fewer") + (title ? ' ' + title : '');
      var cls = "view-more-button" + (preventExpand ? "" : " clickable");
      return /*#__PURE__*/React.createElement("div", {
        className: cls,
        onClick: preventExpand ? null : handleCollapseToggle
      }, /*#__PURE__*/React.createElement("i", {
        className: "mr-1 icon fas icon-" + (collapsed ? 'plus' : 'minus')
      }), titleStr, showMoreExtTitle ? /*#__PURE__*/React.createElement("span", {
        className: "ext text-400"
      }, " ", showMoreExtTitle) : null);
    }
  }]);

  return StackedBlockListViewMoreButton;
}(React.PureComponent);
/**
 * List which can be put inside a StackedBlock, after a StackedBlockName, and which holds other StackedBlocks.
 */

_defineProperty(StackedBlockListViewMoreButton, "propTypes", {
  'collapsibleChildren': PropTypes.array,
  'collapsed': PropTypes.bool,
  'handleCollapseToggle': PropTypes.func,
  'preventExpand': PropTypes.bool,
  'showMoreExtTitle': PropTypes.oneOfType([PropTypes.string, PropTypes.element]) // + those from parent .List

});

export var StackedBlockList = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(StackedBlockList, _React$PureComponent3);

  var _super3 = _createSuper(StackedBlockList);

  function StackedBlockList(props) {
    var _this;

    _classCallCheck(this, StackedBlockList);

    _this = _super3.call(this, props);
    _this.adjustedChildren = _this.adjustedChildren.bind(_assertThisInitialized(_this));
    _this.handleCollapseToggle = _this.handleCollapseToggle.bind(_assertThisInitialized(_this));
    _this.handleCollapseMoreThanClick = _this.handleCollapseMoreThanClick.bind(_assertThisInitialized(_this));
    _this.handleCollapseMoreLessClick = _this.handleCollapseMoreLessClick.bind(_assertThisInitialized(_this));
    _this.state = {
      'collapsed': props.defaultCollapsed,
      'collapsibleCounter': 0
    };
    return _this;
  }

  _createClass(StackedBlockList, [{
    key: "adjustedChildren",
    value: function adjustedChildren() {
      var _this2 = this;

      var _this$props3 = this.props,
          children = _this$props3.children,
          stackDepth = _this$props3.stackDepth,
          colWidthStyles = _this$props3.colWidthStyles,
          columnHeaders = _this$props3.columnHeaders,
          columnClass = _this$props3.columnClass;
      return React.Children.map(children, function (c) {
        //if (c.type.displayName !== 'StackedBlock') return c; // Only add props to StackedBlocks
        // TODO: TEST MIGRATION FROM _.PICK
        var childProps = {
          colWidthStyles: colWidthStyles,
          columnHeaders: columnHeaders,
          stackDepth: stackDepth + 1
        }; //const childProps = _.pick(this.props, 'colWidthStyles', 'selectedFiles', 'columnHeaders', 'handleFileCheckboxChange');

        _.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed', 'collapseShowMoreLimit'], function (prop) {
          if (typeof c.props[prop] === 'undefined') {
            childProps[prop] = _this2.props[prop] || null;
          }
        });

        _.forEach(_.keys(_this2.props), function (prop) {
          if (typeof c.props[prop] === 'undefined' && typeof childProps[prop] === 'undefined' && !StackedBlock.excludedPassedProps.has(prop)) {
            childProps[prop] = _this2.props[prop];
          }
        });

        return /*#__PURE__*/React.cloneElement(c, childProps, c.props.children);
      });
    }
  }, {
    key: "handleCollapseToggle",
    value: function handleCollapseToggle() {
      this.setState(function (_ref) {
        var collapsed = _ref.collapsed;
        return {
          'collapsed': !collapsed
        };
      });
    }
  }, {
    key: "handleCollapseMoreThanClick",
    value: function handleCollapseMoreThanClick(count) {
      this.setState({
        'collapsibleCounter': count + 100
      });
    }
  }, {
    key: "handleCollapseMoreLessClick",
    value: function handleCollapseMoreLessClick(count) {
      this.setState({
        'collapsibleCounter': count
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props4 = this.props,
          collapseLongLists = _this$props4.collapseLongLists,
          stackDepth = _this$props4.stackDepth,
          collapseLimit = _this$props4.collapseLimit,
          collapseShow = _this$props4.collapseShow,
          className = _this$props4.className,
          colWidthStyles = _this$props4.colWidthStyles,
          columnClass = _this$props4.columnClass,
          collapseShowMoreLimit = _this$props4.collapseShowMoreLimit;
      var _this$state = this.state,
          collapsed = _this$state.collapsed,
          collapsibleCounter = _this$state.collapsibleCounter;
      var children = this.adjustedChildren();
      var useStyle = colWidthStyles["list:" + columnClass]; // columnClass here is of parent StackedBlock, not of its children.

      var cls = "s-block-list " + (className || '') + (' stack-depth-' + stackDepth);

      if (collapseLongLists === false || !Array.isArray(children) || children.length <= collapseLimit) {
        // Don't have enough items for collapsible element, return plain list.
        return /*#__PURE__*/React.createElement("div", {
          className: cls,
          style: useStyle
        }, children);
      }

      var collapsibleChildren; //More than collapse calculate

      if (children.length > collapseShowMoreLimit) {
        collapsibleChildren = children.slice(0, collapsibleCounter + collapseShow);
      } else {
        collapsibleChildren = children.slice(collapseShow);
      }

      var collapsibleChildrenLen = collapsibleChildren.length;
      var collapsibleChildrenElemsList;

      if (collapsibleChildrenLen > Math.min(collapseShow, 10)) {
        // Don't transition
        if (collapsibleCounter > 0) {
          collapsibleChildrenElemsList = /*#__PURE__*/React.createElement("div", {
            className: "collapsible-s-block-ext"
          }, children.slice(0, collapsibleCounter));
        } else {
          collapsibleChildrenElemsList = collapsed ? null : /*#__PURE__*/React.createElement("div", {
            className: "collapsible-s-block-ext"
          }, collapsibleChildren);
        }
      } else {
        collapsibleChildrenElemsList = /*#__PURE__*/React.createElement(Collapse, {
          "in": !collapsed
        }, /*#__PURE__*/React.createElement("div", {
          className: "collapsible-s-block-ext"
        }, collapsibleChildren));
      }

      var calculateCollapseCounter = children.length - collapsibleChildren <= 100 ? children.length : collapsibleCounter;
      var collapseType = null;
      var title;

      if (children.length - collapsibleChildren.length <= 100) {
        title = "Show ".concat(children.length - collapsibleChildren.length, " More Files");
      } else {
        title = "Show 100 More Files (Total ".concat(children.length - collapsibleChildren.length, " Files to Show)");
      }

      if (children.length > collapseShowMoreLimit) {
        collapseType = children.length > collapseShowMoreLimit && children.length - collapsibleCounter > 0 ? /*#__PURE__*/React.createElement("div", {
          className: "view-more-button",
          onClick: function onClick() {
            _this3.handleCollapseMoreThanClick(calculateCollapseCounter);
          }
        }, /*#__PURE__*/React.createElement("i", {
          className: "mr-1 icon fas icon-plus"
        }), /*#__PURE__*/React.createElement("span", null, " ", title, " ")) : null;
      } else {
        collapseType = /*#__PURE__*/React.createElement(StackedBlockListViewMoreButton, _extends({}, this.props, {
          collapsibleChildren: collapsibleChildren,
          collapsed: collapsed,
          handleCollapseToggle: this.handleCollapseToggle
        }));
      }

      return /*#__PURE__*/React.createElement("div", {
        className: cls,
        "data-count-collapsed": collapsibleChildren.length,
        style: useStyle
      }, collapsibleCounter > collapseShow ? /*#__PURE__*/React.createElement("div", {
        className: "view-more-button",
        onClick: function onClick() {
          _this3.handleCollapseMoreLessClick(calculateCollapseCounter - 100);
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-minus mr-1 ml-02 small"
      }), /*#__PURE__*/React.createElement("span", null, " ", 'Show Fewer Files ')) : null, children.slice(0, collapseShow), collapsibleChildrenElemsList, collapseType);
    }
  }]);

  return StackedBlockList;
}(React.PureComponent);

_defineProperty(StackedBlockList, "ViewMoreButton", StackedBlockListViewMoreButton);

_defineProperty(StackedBlockList, "propTypes", {
  'showMoreExtTitle': PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  'collapseLimit': PropTypes.number,
  'collapseShow': PropTypes.number,
  'collapseLongLists': PropTypes.bool,
  'defaultCollapsed': PropTypes.bool,
  'children': PropTypes.arrayOf(PropTypes.node),
  'stackDepth': PropTypes.number,
  'collapseShowMoreLimit': PropTypes.number
});

export var StackedBlock = /*#__PURE__*/function (_React$PureComponent4) {
  _inherits(StackedBlock, _React$PureComponent4);

  var _super4 = _createSuper(StackedBlock);

  /** TODO MAYBE USE HERE & ON LIST */
  function StackedBlock(props) {
    var _this4;

    _classCallCheck(this, StackedBlock);

    _this4 = _super4.call(this, props);
    _this4.adjustedChildren = _this4.adjustedChildren.bind(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(StackedBlock, [{
    key: "adjustedChildren",
    value: function adjustedChildren() {
      var _this5 = this;

      var _this$props5 = this.props,
          children = _this$props5.children,
          columnClass = _this$props5.columnClass,
          columnHeaders = _this$props5.columnHeaders,
          label = _this$props5.label,
          stackDepth = _this$props5.stackDepth,
          colWidthStyles = _this$props5.colWidthStyles;
      return React.Children.map(children, function (c) {
        if (c === null) return null;
        var childProps = {
          columnClass: columnClass,
          columnHeaders: columnHeaders,
          label: label,
          stackDepth: stackDepth,
          colWidthStyles: colWidthStyles
        };
        /*
        const childProps = _.pick(this.props,
            'columnClass', 'colWidthStyles', 'label', 'stackDepth',
            'selectedFiles', 'columnHeaders', 'handleFileCheckboxChange'
        );
        */

        _.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed', 'preventExpand', 'collapseShowMoreLimit'], function (prop) {
          if (typeof c.props[prop] === 'undefined') {
            childProps[prop] = _this5.props[prop];
          }
        });

        _.forEach(_.keys(_this5.props), function (prop) {
          if (typeof c.props[prop] === 'undefined' && typeof childProps[prop] === 'undefined' && !StackedBlock.excludedPassedProps.has(prop)) {
            childProps[prop] = _this5.props[prop];
          }
        });

        if (_.keys(childProps).length > 0) {
          return /*#__PURE__*/React.cloneElement(c, childProps, c.props.children);
        } else return c;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          columnClass = _this$props6.columnClass,
          className = _this$props6.className,
          stackDepth = _this$props6.stackDepth,
          stripe = _this$props6.stripe,
          hideNameOnHover = _this$props6.hideNameOnHover,
          keepLabelOnHover = _this$props6.keepLabelOnHover;
      var classNames = ["s-block", "stack-depth-" + stackDepth, columnClass || null, hideNameOnHover ? ' hide-name-on-block-hover' : null, keepLabelOnHover ? ' keep-label-on-name-hover' : null, className || null, typeof stripe !== 'undefined' && stripe !== null ? stripe === true || stripe === "even" ? "even" : "odd" : null];
      return /*#__PURE__*/React.createElement("div", {
        className: _.filter(classNames).join(' ')
      }, this.adjustedChildren());
    }
  }]);

  return StackedBlock;
}(React.PureComponent);
/**
 * To be used within Experiments Set View/Page, or
 * within a collapsible row on the browse page.
 *
 * Shows experiments only, not experiment sets.
 *
 * Allows either table component itself to control state of "selectedFiles"
 * or for a parentController (passed in as a prop) to take over management
 * of "selectedFiles" Set and "checked", for integration with other pages/UI.
 */

_defineProperty(StackedBlock, "Name", StackedBlockName);

_defineProperty(StackedBlock, "List", StackedBlockList);

_defineProperty(StackedBlock, "excludedPassedProps", new Set(['stripe', 'hideNameOnHover', 'keepLabelOnHover', 'className', 'children', 'showMoreExtTitle']));

export var StackedBlockTable = /*#__PURE__*/function (_React$PureComponent5) {
  _inherits(StackedBlockTable, _React$PureComponent5);

  var _super5 = _createSuper(StackedBlockTable);

  _createClass(StackedBlockTable, null, [{
    key: "getOriginalColumnWidthArray",
    value: function getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth) {
      return _.map(columnHeaders, function (c) {
        return c.initialWidth || defaultInitialColumnWidth;
      });
    }
  }, {
    key: "totalColumnsMinWidth",
    value: function totalColumnsMinWidth(columnHeaders, defaultInitialColumnWidth) {
      return StackedBlockTable.getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth).reduce(function (m, v) {
        return m + v;
      }, 0);
    }
  }, {
    key: "colWidthStyles",
    value: function colWidthStyles(columnHeaders, defaultInitialColumnWidth) {
      // { 'experiment' : { width } , 'biosample' : { width }, ... }
      var orderedMapList = columnHeaders.map(function (col) {
        var field = col.field,
            title = col.title,
            columnClass = col.columnClass,
            initialWidth = col.initialWidth;
        var width = initialWidth || defaultInitialColumnWidth;
        var key;

        if (columnClass === 'file-detail') {
          key = field || title || 'file-detail';
        } else {
          key = columnClass;
        }

        return [key, {
          flex: "1 0 " + width + "px",
          minWidth: width
        }];
      });

      var retObj = _.object(orderedMapList);

      columnHeaders.slice().reverse().reduce(function (m, col, idx) {
        var columnClass = col.columnClass,
            initialWidth = col.initialWidth;

        if (columnClass !== 'file-detail' && columnClass !== 'file') {
          retObj["list:" + columnClass] = {
            flex: "".concat(idx, " 0 ").concat(m, "px"),
            minWidth: m
          };
        }

        m += initialWidth || defaultInitialColumnWidth;
        return m;
      }, 0);
      return retObj;
    }
  }]);

  function StackedBlockTable(props) {
    var _this6;

    _classCallCheck(this, StackedBlockTable);

    _this6 = _super5.call(this, props);
    _this6.adjustedChildren = _this6.adjustedChildren.bind(_assertThisInitialized(_this6));
    _this6.setCollapsingState = _.throttle(_this6.setCollapsingState.bind(_assertThisInitialized(_this6)));
    _this6.memoized = {
      totalColumnsMinWidth: memoize(StackedBlockTable.totalColumnsMinWidth),
      colWidthStyles: memoize(StackedBlockTable.colWidthStyles)
    };
    _this6.state = {
      'mounted': false
    };
    return _this6;
  }

  _createClass(StackedBlockTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        'mounted': true
      });
    }
  }, {
    key: "setCollapsingState",
    value: function setCollapsingState(collapsing) {
      this.setState({
        collapsing: collapsing
      });
    }
  }, {
    key: "adjustedChildren",
    value: function adjustedChildren() {
      var _this7 = this;

      var _this$props7 = this.props,
          children = _this$props7.children,
          columnHeaders = _this$props7.columnHeaders,
          defaultInitialColumnWidth = _this$props7.defaultInitialColumnWidth;
      var colWidthStyles = this.memoized.colWidthStyles(columnHeaders, defaultInitialColumnWidth);
      return React.Children.map(children, function (c) {
        // Includes handleFileCheckboxChange, selectedFiles, etc. if present
        var addedProps = _.omit(_this7.props, 'columnHeaders', 'stackDepth', 'colWidthStyles', 'width'); // REQUIRED & PASSED DOWN TO STACKEDBLOCKLIST


        addedProps.colWidthStyles = colWidthStyles;
        addedProps.stackDepth = 0;
        addedProps.columnHeaders = columnHeaders;
        return /*#__PURE__*/React.cloneElement(c, addedProps, c.props.children);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          _this$props8$width = _this$props8.width,
          width = _this$props8$width === void 0 ? 0 : _this$props8$width,
          fadeIn = _this$props8.fadeIn,
          columnHeaders = _this$props8.columnHeaders,
          className = _this$props8.className,
          children = _this$props8.children,
          defaultInitialColumnWidth = _this$props8.defaultInitialColumnWidth;
      var mounted = this.state.mounted;

      if (!children) {
        return /*#__PURE__*/React.createElement("h6", {
          className: "text-center text-400"
        }, /*#__PURE__*/React.createElement("em", null, "No Results"));
      }

      var totalColsWidth = this.memoized.totalColumnsMinWidth(columnHeaders, defaultInitialColumnWidth);
      var minTotalWidth = Math.max(width, totalColsWidth); // Includes width, columnHeaders, defaultColumnWidth, [handleFileCheckboxChange, allFiles, selectedFiles, etc.] if present

      var tableHeaderProps = _.omit(this.props, 'fadeIn', 'className', 'children', 'stackDepth', 'colWidthStyles', 'width');

      return /*#__PURE__*/React.createElement("div", {
        style: {
          'width': minTotalWidth
        },
        className: "stacked-block-table" + (mounted ? ' mounted' : '') + (fadeIn ? ' fade-in' : '') + (typeof className === 'string' ? ' ' + className : '')
      }, /*#__PURE__*/React.createElement(TableHeaders, tableHeaderProps), /*#__PURE__*/React.createElement("div", {
        className: "body clearfix"
      }, this.adjustedChildren()));
    }
  }]);

  return StackedBlockTable;
}(React.PureComponent);

_defineProperty(StackedBlockTable, "StackedBlock", StackedBlock);

_defineProperty(StackedBlockTable, "propTypes", {
  'columnHeaders': PropTypes.arrayOf(PropTypes.shape({
    'columnClass': PropTypes.string.isRequired,
    'className': PropTypes.string,
    'title': PropTypes.string.isRequired,
    'visibleTitle': PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
    'initialWidth': PropTypes.number
  })).isRequired,
  'preventExpand': PropTypes.bool
});

_defineProperty(StackedBlockTable, "defaultProps", {
  'columnHeaders': [{
    columnClass: 'biosample',
    className: 'text-left',
    title: 'Biosample',
    initialWidth: 115
  }, {
    columnClass: 'experiment',
    className: 'text-left',
    title: 'Experiment',
    initialWidth: 145
  }, {
    columnClass: 'file-group',
    title: 'File Group',
    initialWidth: 40,
    visibleTitle: /*#__PURE__*/React.createElement("i", {
      className: "icon fas icon-download"
    })
  }, {
    columnClass: 'file',
    title: 'File',
    initialWidth: 125
  }],
  'defaultInitialColumnWidth': 120,
  'collapseLimit': 4,
  'collapseShow': 3,
  'preventExpand': false,
  'collapseLongLists': true,
  'collapseShowMoreLimit': 100,
  'defaultCollapsed': true
});

function TableHeaders(props) {
  var columnHeaders = props.columnHeaders,
      defaultInitialColumnWidth = props.defaultInitialColumnWidth;

  var headers = _.map(columnHeaders, function (colHeader, index) {
    var field = colHeader.field,
        title = colHeader.title,
        vTitle = colHeader.visibleTitle,
        title_tooltip = colHeader.title_tooltip,
        initialWidth = colHeader.initialWidth,
        columnClass = colHeader.columnClass,
        className = colHeader.className;
    var visibleTitle = vTitle || title;
    if (typeof visibleTitle === 'function') visibleTitle = visibleTitle(props);
    var colWidth = initialWidth || defaultInitialColumnWidth;
    var cls = "heading-block col-" + columnClass + (className ? ' ' + className : '');
    var tooltip;

    if (title_tooltip && typeof title_tooltip === 'string' && title_tooltip.length > 0) {
      tooltip = title_tooltip;
    } else {
      tooltip = typeof visibleTitle === 'string' ? visibleTitle : typeof title === 'string' ? title : null;
    }

    if (tooltip && tooltip.length < 6) {
      tooltip = null;
    }

    return /*#__PURE__*/React.createElement("div", {
      className: cls,
      key: field || index,
      style: {
        flex: "1 0 " + colWidth + "px",
        minWidth: colWidth
      },
      "data-column-class": columnClass,
      "data-tip": tooltip
    }, visibleTitle);
  });

  return /*#__PURE__*/React.createElement("div", {
    className: "headers stacked-block-table-headers"
  }, headers);
}

TableHeaders.propTypes = {
  /** Basic props */
  'columnHeaders': PropTypes.array.isRequired,
  'defaultInitialColumnWidth': PropTypes.number,

  /** Below needed to feed into visibleTitle func for e.g. checkbox in column title. */
  'allFiles': PropTypes.arrayOf(PropTypes.object),
  'selectedFiles': PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.bool])),
  'handleFileCheckboxChange': PropTypes.func.isRequired
};