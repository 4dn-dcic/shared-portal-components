'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StackedBlockNameLabel = StackedBlockNameLabel;
exports.StackedBlockTable = exports.StackedBlock = exports.StackedBlockList = exports.StackedBlockListViewMoreButton = exports.StackedBlockName = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _underscore = _interopRequireDefault(require("underscore"));

var _Collapse = require("./../../ui/Collapse");

var _util = require("./../../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line no-unused-vars
var Item = _util.typedefs.Item;
/**
 * @todo:
 * - improve/cleanup code
 * - remove references to selectedFiles & similar props but ensure still works from 4DN/file-tables
 *   - maybe pass in selectedFiles props directly to FileEntryBlock (& similar)
 *   - or pass them thru props here
 */

function StackedBlockNameLabel(props) {
  var title = props.title,
      subtitle = props.subtitle,
      accession = props.accession,
      className = props.className,
      subtitleVisible = props.subtitleVisible;
  var cls = "label-ext-info" + (className ? ' ' + className : '') + (subtitle || accession ? ' has-subtitle' : '') + (subtitleVisible ? ' subtitle-visible' : '');
  return _react["default"].createElement("div", {
    className: cls,
    key: "label"
  }, _react["default"].createElement("div", {
    className: "label-title"
  }, title), subtitle || accession ? _react["default"].createElement("div", {
    className: "ext" + (accession ? ' is-accession' : '')
  }, accession ? _react["default"].createElement(_util.object.CopyWrapper, {
    value: accession,
    key: "copy-accession"
  }, accession || subtitle) : subtitle) : null);
}

StackedBlockNameLabel.propTypes = {
  /** Subtitle/label will appear more opaque when not hovered over */
  'subtitleVisible': _propTypes["default"].bool,
  'className': _propTypes["default"].string,
  'title': _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].node]),
  'subtitle': _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].node]),
  // Pass in place of or in addition to subtitle (takes precedence).
  'accession': _propTypes["default"].string
};
/** Name element to be put inside of StackedBlocks as the first child. */

var StackedBlockName =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(StackedBlockName, _React$PureComponent);

  function StackedBlockName() {
    _classCallCheck(this, StackedBlockName);

    return _possibleConstructorReturn(this, _getPrototypeOf(StackedBlockName).apply(this, arguments));
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
      if (style) _underscore["default"].extend(useStyle, style);
      if (colWidthStyle) _underscore["default"].extend(useStyle, colWidthStyle);
      if (relativePosition) useStyle.position = 'relative';
      return _react["default"].createElement("div", {
        className: "name col-" + columnClass + (className ? " " + className : ""),
        style: useStyle
      }, label, children);
    }
  }]);

  return StackedBlockName;
}(_react["default"].PureComponent);
/**
 * Button to toggle collapse/visible of longer StacedkBlockLists. Used in StackedBlockLists.
 */


exports.StackedBlockName = StackedBlockName;

_defineProperty(StackedBlockName, "Label", StackedBlockNameLabel);

var StackedBlockListViewMoreButton =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(StackedBlockListViewMoreButton, _React$PureComponent2);

  function StackedBlockListViewMoreButton() {
    _classCallCheck(this, StackedBlockListViewMoreButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(StackedBlockListViewMoreButton).apply(this, arguments));
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
        return _react["default"].createElement("div", {
          className: "view-more-button"
        }, _react["default"].createElement("i", {
          className: "icon fas icon-plus mr-1 ml-02 small"
        }), collapsibleChildrenLen + " More" + (title ? ' ' + title : ''), showMoreExtTitle ? _react["default"].createElement("span", {
          className: "ext text-400"
        }, " ", showMoreExtTitle) : null);
      }

      var titleStr = (collapsed ? preventExpand ? collapsibleChildrenLen + " More" : "Show ".concat(collapsibleChildrenLen, " More") : "Show Fewer") + (title ? ' ' + title : '');
      var cls = "view-more-button" + (preventExpand ? "" : " clickable");
      return _react["default"].createElement("div", {
        className: cls,
        onClick: preventExpand ? null : handleCollapseToggle
      }, _react["default"].createElement("i", {
        className: "mr-1 icon fas icon-" + (collapsed ? 'plus' : 'minus')
      }), titleStr, showMoreExtTitle ? _react["default"].createElement("span", {
        className: "ext text-400"
      }, " ", showMoreExtTitle) : null);
    }
  }]);

  return StackedBlockListViewMoreButton;
}(_react["default"].PureComponent);
/**
 * List which can be put inside a StackedBlock, after a StackedBlockName, and which holds other StackedBlocks.
 */


exports.StackedBlockListViewMoreButton = StackedBlockListViewMoreButton;

_defineProperty(StackedBlockListViewMoreButton, "propTypes", {
  'collapsibleChildren': _propTypes["default"].array,
  'collapsed': _propTypes["default"].bool,
  'handleCollapseToggle': _propTypes["default"].func,
  'preventExpand': _propTypes["default"].bool,
  'showMoreExtTitle': _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].element]) // + those from parent .List

});

var StackedBlockList =
/*#__PURE__*/
function (_React$PureComponent3) {
  _inherits(StackedBlockList, _React$PureComponent3);

  function StackedBlockList(props) {
    var _this;

    _classCallCheck(this, StackedBlockList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StackedBlockList).call(this, props));
    _this.adjustedChildren = _this.adjustedChildren.bind(_assertThisInitialized(_this));
    _this.handleCollapseToggle = _this.handleCollapseToggle.bind(_assertThisInitialized(_this));
    _this.state = {
      'collapsed': props.defaultCollapsed
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
      return _react["default"].Children.map(children, function (c) {
        //if (c.type.displayName !== 'StackedBlock') return c; // Only add props to StackedBlocks
        // TODO: TEST MIGRATION FROM _.PICK
        var childProps = {
          colWidthStyles: colWidthStyles,
          columnHeaders: columnHeaders,
          stackDepth: stackDepth + 1
        }; //const childProps = _.pick(this.props, 'colWidthStyles', 'selectedFiles', 'columnHeaders', 'handleFileCheckboxChange');

        _underscore["default"].forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed'], function (prop) {
          if (typeof c.props[prop] === 'undefined') {
            childProps[prop] = _this2.props[prop] || null;
          }
        });

        _underscore["default"].forEach(_underscore["default"].keys(_this2.props), function (prop) {
          if (typeof c.props[prop] === 'undefined' && typeof childProps[prop] === 'undefined' && !StackedBlock.excludedPassedProps.has(prop)) {
            childProps[prop] = _this2.props[prop];
          }
        });

        return _react["default"].cloneElement(c, childProps, c.props.children);
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
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          collapseLongLists = _this$props4.collapseLongLists,
          stackDepth = _this$props4.stackDepth,
          collapseLimit = _this$props4.collapseLimit,
          collapseShow = _this$props4.collapseShow,
          className = _this$props4.className,
          colWidthStyles = _this$props4.colWidthStyles,
          columnClass = _this$props4.columnClass;
      var collapsed = this.state.collapsed;
      var children = this.adjustedChildren();
      var useStyle = colWidthStyles["list:" + columnClass]; // columnClass here is of parent StackedBlock, not of its children.

      var cls = "s-block-list " + (className || '') + (' stack-depth-' + stackDepth);

      if (collapseLongLists === false || !Array.isArray(children) || children.length <= collapseLimit) {
        // Don't have enough items for collapsible element, return plain list.
        return _react["default"].createElement("div", {
          className: cls,
          style: useStyle
        }, children);
      }

      var collapsibleChildren = children.slice(collapseShow);
      var collapsibleChildrenLen = collapsibleChildren.length;
      var collapsibleChildrenElemsList;

      if (collapsibleChildrenLen > Math.min(collapseShow, 10)) {
        // Don't transition
        collapsibleChildrenElemsList = collapsed ? null : _react["default"].createElement("div", {
          className: "collapsible-s-block-ext"
        }, collapsibleChildren);
      } else {
        collapsibleChildrenElemsList = _react["default"].createElement(_Collapse.Collapse, {
          "in": !collapsed
        }, _react["default"].createElement("div", {
          className: "collapsible-s-block-ext"
        }, collapsibleChildren));
      }

      return _react["default"].createElement("div", {
        className: cls,
        "data-count-collapsed": collapsibleChildren.length,
        style: useStyle
      }, children.slice(0, collapseShow), collapsibleChildrenElemsList, _react["default"].createElement(StackedBlockListViewMoreButton, _extends({}, this.props, {
        collapsibleChildren: collapsibleChildren,
        collapsed: collapsed,
        handleCollapseToggle: this.handleCollapseToggle
      })));
    }
  }]);

  return StackedBlockList;
}(_react["default"].PureComponent);

exports.StackedBlockList = StackedBlockList;

_defineProperty(StackedBlockList, "ViewMoreButton", StackedBlockListViewMoreButton);

_defineProperty(StackedBlockList, "propTypes", {
  'showMoreExtTitle': _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].element]),
  'collapseLimit': _propTypes["default"].number,
  'collapseShow': _propTypes["default"].number,
  'collapseLongLists': _propTypes["default"].bool,
  'defaultCollapsed': _propTypes["default"].bool,
  'children': _propTypes["default"].arrayOf(_propTypes["default"].node),
  'stackDepth': _propTypes["default"].number
});

var StackedBlock =
/*#__PURE__*/
function (_React$PureComponent4) {
  _inherits(StackedBlock, _React$PureComponent4);

  /** TODO MAYBE USE HERE & ON LIST */
  function StackedBlock(props) {
    var _this3;

    _classCallCheck(this, StackedBlock);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(StackedBlock).call(this, props));
    _this3.adjustedChildren = _this3.adjustedChildren.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(StackedBlock, [{
    key: "adjustedChildren",
    value: function adjustedChildren() {
      var _this4 = this;

      var _this$props5 = this.props,
          children = _this$props5.children,
          columnClass = _this$props5.columnClass,
          columnHeaders = _this$props5.columnHeaders,
          label = _this$props5.label,
          stackDepth = _this$props5.stackDepth,
          colWidthStyles = _this$props5.colWidthStyles;
      return _react["default"].Children.map(children, function (c) {
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

        _underscore["default"].forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed', 'preventExpand'], function (prop) {
          if (typeof c.props[prop] === 'undefined') {
            childProps[prop] = _this4.props[prop];
          }
        });

        _underscore["default"].forEach(_underscore["default"].keys(_this4.props), function (prop) {
          if (typeof c.props[prop] === 'undefined' && typeof childProps[prop] === 'undefined' && !StackedBlock.excludedPassedProps.has(prop)) {
            childProps[prop] = _this4.props[prop];
          }
        });

        if (_underscore["default"].keys(childProps).length > 0) {
          return _react["default"].cloneElement(c, childProps, c.props.children);
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
      return _react["default"].createElement("div", {
        className: _underscore["default"].filter(classNames).join(' ')
      }, this.adjustedChildren());
    }
  }]);

  return StackedBlock;
}(_react["default"].PureComponent);
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


exports.StackedBlock = StackedBlock;

_defineProperty(StackedBlock, "Name", StackedBlockName);

_defineProperty(StackedBlock, "List", StackedBlockList);

_defineProperty(StackedBlock, "excludedPassedProps", new Set(['stripe', 'hideNameOnHover', 'keepLabelOnHover', 'className', 'children', 'showMoreExtTitle']));

var StackedBlockTable =
/*#__PURE__*/
function (_React$PureComponent5) {
  _inherits(StackedBlockTable, _React$PureComponent5);

  _createClass(StackedBlockTable, null, [{
    key: "getOriginalColumnWidthArray",
    value: function getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth) {
      return _underscore["default"].map(columnHeaders, function (c) {
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

      var retObj = _underscore["default"].object(orderedMapList);

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
    var _this5;

    _classCallCheck(this, StackedBlockTable);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(StackedBlockTable).call(this, props));
    _this5.adjustedChildren = _this5.adjustedChildren.bind(_assertThisInitialized(_this5));
    _this5.setCollapsingState = _underscore["default"].throttle(_this5.setCollapsingState.bind(_assertThisInitialized(_this5)));
    _this5.memoized = {
      totalColumnsMinWidth: (0, _memoizeOne["default"])(StackedBlockTable.totalColumnsMinWidth),
      colWidthStyles: (0, _memoizeOne["default"])(StackedBlockTable.colWidthStyles)
    };
    _this5.state = {
      'mounted': false
    };
    return _this5;
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
      var _this6 = this;

      var _this$props7 = this.props,
          children = _this$props7.children,
          columnHeaders = _this$props7.columnHeaders,
          defaultInitialColumnWidth = _this$props7.defaultInitialColumnWidth;
      var colWidthStyles = this.memoized.colWidthStyles(columnHeaders, defaultInitialColumnWidth);
      return _react["default"].Children.map(children, function (c) {
        // Includes handleFileCheckboxChange, selectedFiles, etc. if present
        var addedProps = _underscore["default"].omit(_this6.props, 'columnHeaders', 'stackDepth', 'colWidthStyles', 'width'); // REQUIRED & PASSED DOWN TO STACKEDBLOCKLIST


        addedProps.colWidthStyles = colWidthStyles;
        addedProps.stackDepth = 0;
        addedProps.columnHeaders = columnHeaders;
        return _react["default"].cloneElement(c, addedProps, c.props.children);
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
        return _react["default"].createElement("h6", {
          className: "text-center text-400"
        }, _react["default"].createElement("em", null, "No Results"));
      }

      var totalColsWidth = this.memoized.totalColumnsMinWidth(columnHeaders, defaultInitialColumnWidth);
      var minTotalWidth = Math.max(width, totalColsWidth); // Includes width, columnHeaders, defaultColumnWidth, [handleFileCheckboxChange, allFiles, selectedFiles, etc.] if present

      var tableHeaderProps = _underscore["default"].omit(this.props, 'fadeIn', 'className', 'children', 'stackDepth', 'colWidthStyles', 'width');

      return _react["default"].createElement("div", {
        style: {
          'width': minTotalWidth
        },
        className: "stacked-block-table" + (mounted ? ' mounted' : '') + (fadeIn ? ' fade-in' : '') + (typeof className === 'string' ? ' ' + className : '')
      }, _react["default"].createElement(TableHeaders, tableHeaderProps), _react["default"].createElement("div", {
        className: "body clearfix"
      }, this.adjustedChildren()));
    }
  }]);

  return StackedBlockTable;
}(_react["default"].PureComponent);

exports.StackedBlockTable = StackedBlockTable;

_defineProperty(StackedBlockTable, "StackedBlock", StackedBlock);

_defineProperty(StackedBlockTable, "propTypes", {
  'columnHeaders': _propTypes["default"].arrayOf(_propTypes["default"].shape({
    'columnClass': _propTypes["default"].string.isRequired,
    'className': _propTypes["default"].string,
    'title': _propTypes["default"].string.isRequired,
    'visibleTitle': _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].element, _propTypes["default"].func]),
    'initialWidth': _propTypes["default"].number
  })).isRequired,
  'preventExpand': _propTypes["default"].bool
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
    visibleTitle: _react["default"].createElement("i", {
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
  'defaultCollapsed': true
});

function TableHeaders(props) {
  var columnHeaders = props.columnHeaders,
      defaultInitialColumnWidth = props.defaultInitialColumnWidth;

  var headers = _underscore["default"].map(columnHeaders, function (colHeader, index) {
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

    return _react["default"].createElement("div", {
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

  return _react["default"].createElement("div", {
    className: "headers stacked-block-table-headers"
  }, headers);
}

TableHeaders.propTypes = {
  /** Basic props */
  'columnHeaders': _propTypes["default"].array.isRequired,
  'defaultInitialColumnWidth': _propTypes["default"].number,

  /** Below needed to feed into visibleTitle func for e.g. checkbox in column title. */
  'allFiles': _propTypes["default"].arrayOf(_propTypes["default"].object),
  'selectedFiles': _propTypes["default"].objectOf(_propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].bool])),
  'handleFileCheckboxChange': _propTypes["default"].func.isRequired
};