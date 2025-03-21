import _extends from "@babel/runtime/helpers/extends";
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
import memoize from 'memoize-one';
import _ from 'underscore';
import Collapse from 'react-bootstrap/esm/Collapse';
import ReactTooltip from 'react-tooltip';
import { object, typedefs } from './../../util';

// eslint-disable-next-line no-unused-vars
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
    key: "copy-accession",
    analyticsOnCopy: true,
    maskAnalyticsValue: false
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
  function StackedBlockName() {
    _classCallCheck(this, StackedBlockName);
    return _callSuper(this, StackedBlockName, arguments);
  }
  _inherits(StackedBlockName, _React$PureComponent);
  return _createClass(StackedBlockName, [{
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
}(React.PureComponent);

/**
 * Button to toggle collapse/visible of longer StacedkBlockLists. Used in StackedBlockLists.
 */
_defineProperty(StackedBlockName, "Label", StackedBlockNameLabel);
export var StackedBlockListViewMoreButton = /*#__PURE__*/function (_React$PureComponent2) {
  function StackedBlockListViewMoreButton() {
    _classCallCheck(this, StackedBlockListViewMoreButton);
    return _callSuper(this, StackedBlockListViewMoreButton, arguments);
  }
  _inherits(StackedBlockListViewMoreButton, _React$PureComponent2);
  return _createClass(StackedBlockListViewMoreButton, [{
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
          className: "icon fas icon-plus me-1 ms-02 small"
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
        className: "me-1 icon fas icon-" + (collapsed ? 'plus' : 'minus')
      }), titleStr, showMoreExtTitle ? /*#__PURE__*/React.createElement("span", {
        className: "ext text-400"
      }, " ", showMoreExtTitle) : null);
    }
  }]);
}(React.PureComponent);

/**
 * List which can be put inside a StackedBlock, after a StackedBlockName, and which holds other StackedBlocks.
 */
_defineProperty(StackedBlockListViewMoreButton, "propTypes", {
  'collapsibleChildren': PropTypes.array,
  'collapsed': PropTypes.bool,
  'handleCollapseToggle': PropTypes.func,
  'preventExpand': PropTypes.bool,
  'showMoreExtTitle': PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  // + those from parent .List
});

export var StackedBlockList = /*#__PURE__*/function (_React$PureComponent3) {
  function StackedBlockList(props) {
    var _this2;
    _classCallCheck(this, StackedBlockList);
    _this2 = _callSuper(this, StackedBlockList, [props]);
    _this2.adjustedChildren = _this2.adjustedChildren.bind(_this2);
    _this2.handleCollapseToggle = _this2.handleCollapseToggle.bind(_this2);
    _this2.state = {
      'collapsed': props.defaultCollapsed,
      'incrementalExpandVisibleCount': props.collapseShow
    };
    return _this2;
  }
  _inherits(StackedBlockList, _React$PureComponent3);
  return _createClass(StackedBlockList, [{
    key: "adjustedChildren",
    value: function adjustedChildren() {
      var _this3 = this;
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
        };
        //const childProps = _.pick(this.props, 'colWidthStyles', 'selectedFiles', 'columnHeaders', 'handleFileCheckboxChange');

        _.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed', 'incrementalExpandLimit'], function (prop) {
          if (typeof c.props[prop] === 'undefined') {
            childProps[prop] = _this3.props[prop] || null;
          }
        });
        _.forEach(_.keys(_this3.props), function (prop) {
          if (typeof c.props[prop] === 'undefined' && typeof childProps[prop] === 'undefined' && !StackedBlock.excludedPassedProps.has(prop)) {
            childProps[prop] = _this3.props[prop];
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
    key: "handleIncrementalExpandClick",
    value: function handleIncrementalExpandClick(count) {
      this.setState(function () {
        return {
          'incrementalExpandVisibleCount': count
        };
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      if (this.state.collapsed === false && pastState.collapsed === true) {
        ReactTooltip.rebuild();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
        collapseLongLists = _this$props4.collapseLongLists,
        stackDepth = _this$props4.stackDepth,
        collapseLimit = _this$props4.collapseLimit,
        collapseShow = _this$props4.collapseShow,
        _this$props4$title = _this$props4.title,
        title = _this$props4$title === void 0 ? 'Items' : _this$props4$title,
        className = _this$props4.className,
        colWidthStyles = _this$props4.colWidthStyles,
        columnClass = _this$props4.columnClass,
        preventExpand = _this$props4.preventExpand,
        incrementalExpandLimit = _this$props4.incrementalExpandLimit,
        incrementalExpandStep = _this$props4.incrementalExpandStep;
      var _this$state = this.state,
        collapsed = _this$state.collapsed,
        incrementalExpandVisibleCount = _this$state.incrementalExpandVisibleCount;
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
      var isIncrementalExpand = children.length > incrementalExpandLimit && !preventExpand;
      var collapsibleChildren = !isIncrementalExpand ? children.slice(collapseShow) : children.slice(collapseShow, incrementalExpandVisibleCount);
      var collapsibleChildrenLen = collapsibleChildren.length;
      var collapsibleChildrenElemsList;
      if (collapsibleChildrenLen > Math.min(collapseShow, 10) || isIncrementalExpand) {
        // Don't transition
        collapsibleChildrenElemsList = !collapsed || isIncrementalExpand && collapsibleChildrenLen > 0 ? /*#__PURE__*/React.createElement("div", {
          className: "collapsible-s-block-ext"
        }, collapsibleChildren) : null;
      } else {
        collapsibleChildrenElemsList = /*#__PURE__*/React.createElement(Collapse, {
          "in": !collapsed
        }, /*#__PURE__*/React.createElement("div", {
          className: "collapsible-s-block-ext"
        }, collapsibleChildren));
      }
      var viewMoreButton = null;
      if (isIncrementalExpand) {
        var titleStr, nextCount;
        if (collapsibleChildrenLen + collapseShow >= children.length) {
          titleStr = "Show Fewer ".concat(title);
          nextCount = collapseShow;
        } else if (incrementalExpandVisibleCount + incrementalExpandStep > children.length) {
          titleStr = "Show ".concat(children.length - collapsibleChildren.length - collapseShow, " More ").concat(title);
          nextCount = children.length;
        } else {
          titleStr = "Show ".concat(incrementalExpandStep, " More ").concat(title, " (Total ").concat(children.length - collapsibleChildren.length - collapseShow, " ").concat(title, " to Show)");
          nextCount = incrementalExpandVisibleCount + incrementalExpandStep;
        }
        viewMoreButton = /*#__PURE__*/React.createElement("div", {
          className: "view-more-button clickable",
          onClick: this.handleIncrementalExpandClick.bind(this, nextCount)
        }, /*#__PURE__*/React.createElement("i", {
          className: "me-1 icon fas icon-" + (nextCount >= incrementalExpandVisibleCount ? "plus" : "minus")
        }), /*#__PURE__*/React.createElement("span", null, " ", titleStr, " "));
      } else {
        viewMoreButton = /*#__PURE__*/React.createElement(StackedBlockListViewMoreButton, _extends({}, this.props, {
          collapsibleChildren: collapsibleChildren,
          collapsed: collapsed,
          handleCollapseToggle: this.handleCollapseToggle
        }));
      }
      return /*#__PURE__*/React.createElement("div", {
        className: cls,
        "data-count-collapsed": collapsibleChildren.length,
        style: useStyle
      }, children.slice(0, collapseShow), collapsibleChildrenElemsList, viewMoreButton);
    }
  }]);
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
  'preventExpand': PropTypes.bool,
  'incrementalExpandLimit': PropTypes.number,
  'incrementalExpandStep': PropTypes.number
});
export var StackedBlock = /*#__PURE__*/function (_React$PureComponent4) {
  function StackedBlock(props) {
    var _this4;
    _classCallCheck(this, StackedBlock);
    _this4 = _callSuper(this, StackedBlock, [props]);
    _this4.adjustedChildren = _this4.adjustedChildren.bind(_this4);
    return _this4;
  }
  _inherits(StackedBlock, _React$PureComponent4);
  return _createClass(StackedBlock, [{
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

        _.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed', 'preventExpand', 'incrementalExpandLimit'], function (prop) {
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
/** TODO MAYBE USE HERE & ON LIST */
_defineProperty(StackedBlock, "excludedPassedProps", new Set(['stripe', 'hideNameOnHover', 'keepLabelOnHover', 'className', 'children', 'showMoreExtTitle']));
export var StackedBlockTable = /*#__PURE__*/function (_React$PureComponent5) {
  function StackedBlockTable(props) {
    var _this6;
    _classCallCheck(this, StackedBlockTable);
    _this6 = _callSuper(this, StackedBlockTable, [props]);
    _this6.adjustedChildren = _this6.adjustedChildren.bind(_this6);
    _this6.setCollapsingState = _.throttle(_this6.setCollapsingState.bind(_this6));
    _this6.memoized = {
      totalColumnsMinWidth: memoize(StackedBlockTable.totalColumnsMinWidth),
      colWidthStyles: memoize(StackedBlockTable.colWidthStyles)
    };
    _this6.state = {
      'mounted': false
    };
    return _this6;
  }
  _inherits(StackedBlockTable, _React$PureComponent5);
  return _createClass(StackedBlockTable, [{
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
        var addedProps = _.omit(_this7.props, 'columnHeaders', 'stackDepth', 'colWidthStyles', 'width');

        // REQUIRED & PASSED DOWN TO STACKEDBLOCKLIST
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
      var minTotalWidth = Math.max(width, totalColsWidth);

      // Includes width, columnHeaders, defaultColumnWidth, [handleFileCheckboxChange, allFiles, selectedFiles, etc.] if present
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
  }], [{
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
    className: 'text-start',
    title: 'Biosample',
    initialWidth: 115
  }, {
    columnClass: 'experiment',
    className: 'text-start',
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
  'incrementalExpandLimit': 100,
  'incrementalExpandStep': 100,
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
  'handleFileCheckboxChange': PropTypes.func
};