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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Item = _util.typedefs.Item;

function StackedBlockNameLabel(props) {
  var title = props.title,
      subtitle = props.subtitle,
      accession = props.accession,
      className = props.className,
      subtitleVisible = props.subtitleVisible;
  var cls = "label-ext-info" + (className ? ' ' + className : '') + (subtitle || accession ? ' has-subtitle' : '') + (subtitleVisible ? ' subtitle-visible' : '');
  return _react.default.createElement("div", {
    className: cls,
    key: "label"
  }, _react.default.createElement("div", {
    className: "label-title"
  }, title), subtitle || accession ? _react.default.createElement("div", {
    className: "ext" + (accession ? ' is-accession' : '')
  }, accession ? _react.default.createElement(_util.object.CopyWrapper, {
    value: accession,
    key: "copy-accession"
  }, accession || subtitle) : subtitle) : null);
}

StackedBlockNameLabel.propTypes = {
  'subtitleVisible': _propTypes.default.bool,
  'className': _propTypes.default.string,
  'title': _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.node]),
  'subtitle': _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.node]),
  'accession': _propTypes.default.string
};

var StackedBlockName = function (_React$PureComponent) {
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
      if (style) _underscore.default.extend(useStyle, style);
      if (colWidthStyle) _underscore.default.extend(useStyle, colWidthStyle);
      if (relativePosition) useStyle.position = 'relative';
      return _react.default.createElement("div", {
        className: "name col-" + columnClass + (className ? " " + className : ""),
        style: useStyle
      }, label, children);
    }
  }]);

  return StackedBlockName;
}(_react.default.PureComponent);

exports.StackedBlockName = StackedBlockName;

_defineProperty(StackedBlockName, "Label", StackedBlockNameLabel);

var StackedBlockListViewMoreButton = function (_React$PureComponent2) {
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
          handleCollapseToggle = _this$props2.handleCollapseToggle;
      var collapsibleChildrenLen = collapsibleChildren.length;
      if (collapsibleChildrenLen === 0) return null;
      var titleStr = (collapsed ? "Show " + collapsibleChildrenLen + " More" : "Show Fewer") + (title ? ' ' + title : '');
      return _react.default.createElement("div", {
        className: "view-more-button",
        onClick: handleCollapseToggle
      }, _react.default.createElement("i", {
        className: "icon fas icon-" + (collapsed ? 'plus' : 'minus')
      }), titleStr, showMoreExtTitle ? _react.default.createElement("span", {
        className: "ext text-400"
      }, " ", showMoreExtTitle) : null);
    }
  }]);

  return StackedBlockListViewMoreButton;
}(_react.default.PureComponent);

exports.StackedBlockListViewMoreButton = StackedBlockListViewMoreButton;

_defineProperty(StackedBlockListViewMoreButton, "propTypes", {
  'collapsibleChildren': _propTypes.default.array,
  'collapsed': _propTypes.default.bool,
  'handleCollapseToggle': _propTypes.default.func
});

var StackedBlockList = function (_React$PureComponent3) {
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
      return _react.default.Children.map(children, function (c) {
        var childProps = {
          colWidthStyles: colWidthStyles,
          columnHeaders: columnHeaders,
          stackDepth: stackDepth + 1
        };

        _underscore.default.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed'], function (prop) {
          if (typeof c.props[prop] === 'undefined') {
            childProps[prop] = _this2.props[prop] || null;
          }
        });

        _underscore.default.forEach(_underscore.default.keys(_this2.props), function (prop) {
          if (typeof c.props[prop] === 'undefined' && typeof childProps[prop] === 'undefined' && !StackedBlock.excludedPassedProps.has(prop)) {
            childProps[prop] = _this2.props[prop];
          }
        });

        return _react.default.cloneElement(c, childProps, c.props.children);
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
          className = _this$props4.className;
      var children = this.adjustedChildren();
      var cls = "s-block-list " + (className || '') + (' stack-depth-' + stackDepth);

      if (collapseLongLists === false || !Array.isArray(children) || children.length <= collapseLimit) {
        return _react.default.createElement("div", {
          className: cls
        }, children);
      }

      var collapsibleChildren = children.slice(collapseShow);
      var collapsibleChildrenLen = collapsibleChildren.length;
      var collapsibleChildrenElemsList;

      if (collapsibleChildrenLen > Math.min(collapseShow, 10)) {
        collapsibleChildrenElemsList = this.state.collapsed ? null : _react.default.createElement("div", {
          className: "collapsible-s-block-ext"
        }, collapsibleChildren);
      } else {
        collapsibleChildrenElemsList = _react.default.createElement(_Collapse.Collapse, {
          in: !this.state.collapsed
        }, _react.default.createElement("div", {
          className: "collapsible-s-block-ext"
        }, collapsibleChildren));
      }

      return _react.default.createElement("div", {
        className: cls,
        "data-count-collapsed": collapsibleChildren.length
      }, children.slice(0, collapseShow), collapsibleChildrenElemsList, _react.default.createElement(StackedBlockListViewMoreButton, _extends({}, this.props, {
        collapsibleChildren: collapsibleChildren,
        collapsed: this.state.collapsed,
        handleCollapseToggle: this.handleCollapseToggle
      })));
    }
  }]);

  return StackedBlockList;
}(_react.default.PureComponent);

exports.StackedBlockList = StackedBlockList;

_defineProperty(StackedBlockList, "ViewMoreButton", StackedBlockListViewMoreButton);

_defineProperty(StackedBlockList, "propTypes", {
  'showMoreExtTitle': _propTypes.default.string,
  'collapseLimit': _propTypes.default.number,
  'collapseShow': _propTypes.default.number,
  'collapseLongLists': _propTypes.default.bool,
  'defaultCollapsed': _propTypes.default.bool,
  'children': _propTypes.default.arrayOf(_propTypes.default.node),
  'stackDepth': _propTypes.default.number
});

var StackedBlock = function (_React$PureComponent4) {
  _inherits(StackedBlock, _React$PureComponent4);

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
      return _react.default.Children.map(children, function (c) {
        if (c === null) return null;
        var childProps = {
          columnClass: columnClass,
          columnHeaders: columnHeaders,
          label: label,
          stackDepth: stackDepth,
          colWidthStyles: colWidthStyles
        };

        _underscore.default.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed'], function (prop) {
          if (typeof c.props[prop] === 'undefined') {
            childProps[prop] = _this4.props[prop];
          }
        });

        _underscore.default.forEach(_underscore.default.keys(_this4.props), function (prop) {
          if (typeof c.props[prop] === 'undefined' && typeof childProps[prop] === 'undefined' && !StackedBlock.excludedPassedProps.has(prop)) {
            childProps[prop] = _this4.props[prop];
          }
        });

        if (_underscore.default.keys(childProps).length > 0) {
          return _react.default.cloneElement(c, childProps, c.props.children);
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
      return _react.default.createElement("div", {
        className: _underscore.default.filter(classNames).join(' ')
      }, this.adjustedChildren());
    }
  }]);

  return StackedBlock;
}(_react.default.PureComponent);

exports.StackedBlock = StackedBlock;

_defineProperty(StackedBlock, "Name", StackedBlockName);

_defineProperty(StackedBlock, "List", StackedBlockList);

_defineProperty(StackedBlock, "excludedPassedProps", new Set(['stripe', 'hideNameOnHover', 'keepLabelOnHover', 'className', 'children', 'showMoreExtTitle']));

var StackedBlockTable = function (_React$PureComponent5) {
  _inherits(StackedBlockTable, _React$PureComponent5);

  _createClass(StackedBlockTable, null, [{
    key: "getOriginalColumnWidthArray",
    value: function getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth) {
      return _underscore.default.map(columnHeaders, function (c) {
        return c.initialWidth || defaultInitialColumnWidth;
      });
    }
  }, {
    key: "totalColumnsWidth",
    value: function totalColumnsWidth(columnHeaders, defaultInitialColumnWidth) {
      var origColumnWidths = StackedBlockTable.getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth);
      return _underscore.default.reduce(origColumnWidths, function (m, v) {
        return m + v;
      }, 0);
    }
  }, {
    key: "scaledColumnWidths",
    value: function scaledColumnWidths(width, columnHeaders, defaultInitialColumnWidth) {
      if (!width) {
        width = 960;
      }

      var origColumnWidths = StackedBlockTable.getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth);
      var totalOrigColsWidth = StackedBlockTable.totalColumnsWidth(columnHeaders, defaultInitialColumnWidth);

      if (totalOrigColsWidth > width) {
        return origColumnWidths;
      }

      var scale = width / totalOrigColsWidth || 1;

      var newColWidths = _underscore.default.map(origColumnWidths, function (c) {
        return Math.floor(c * scale);
      });

      var totalNewColsWidth = _underscore.default.reduce(newColWidths, function (m, v) {
        return m + v;
      }, 0);

      var remainder = width - totalNewColsWidth;
      newColWidths[0] += Math.floor(remainder - 0.5);
      return newColWidths;
    }
  }, {
    key: "colWidthStyles",
    value: function colWidthStyles(columnWidths, columnHeaders) {
      return _underscore.default.object(_underscore.default.map(columnHeaders, function (col, index) {
        var key;

        if (col.columnClass === 'file-detail') {
          key = col.field || col.title || 'file-detail';
        } else {
          key = col.columnClass;
        }

        return [key, {
          'width': columnWidths[index]
        }];
      }));
    }
  }]);

  function StackedBlockTable(props) {
    var _this5;

    _classCallCheck(this, StackedBlockTable);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(StackedBlockTable).call(this, props));
    _this5.totalColumnsWidthMemoized = (0, _memoizeOne.default)(StackedBlockTable.totalColumnsWidth);
    _this5.scaledColumnWidthsMemoized = (0, _memoizeOne.default)(StackedBlockTable.scaledColumnWidths);
    _this5.colWidthStylesMemoized = (0, _memoizeOne.default)(StackedBlockTable.colWidthStyles);
    _this5.adjustedChildren = _this5.adjustedChildren.bind(_assertThisInitialized(_this5));
    _this5.colWidthStyles = _this5.colWidthStyles.bind(_assertThisInitialized(_this5));
    _this5.setCollapsingState = _underscore.default.throttle(_this5.setCollapsingState.bind(_assertThisInitialized(_this5)));
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
    key: "colWidthStyles",
    value: function colWidthStyles() {
      var _this$props7 = this.props,
          width = _this$props7.width,
          columnHeaders = _this$props7.columnHeaders,
          defaultInitialColumnWidth = _this$props7.defaultInitialColumnWidth;
      var columnWidths = this.scaledColumnWidthsMemoized(width, columnHeaders, defaultInitialColumnWidth);
      return this.colWidthStylesMemoized(columnWidths, columnHeaders);
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

      var _this$props8 = this.props,
          children = _this$props8.children,
          columnHeaders = _this$props8.columnHeaders;
      var colWidthStyles = this.colWidthStyles();
      return _react.default.Children.map(children, function (c) {
        var addedProps = _underscore.default.omit(_this6.props, 'columnHeaders', 'stackDepth', 'colWidthStyles');

        addedProps.colWidthStyles = colWidthStyles;
        addedProps.stackDepth = 0;
        addedProps.columnHeaders = columnHeaders;
        return _react.default.cloneElement(c, addedProps, c.props.children);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
          width = _this$props9.width,
          fadeIn = _this$props9.fadeIn,
          columnHeaders = _this$props9.columnHeaders,
          className = _this$props9.className,
          children = _this$props9.children,
          defaultInitialColumnWidth = _this$props9.defaultInitialColumnWidth;
      var mounted = this.state.mounted;

      if (!children) {
        return _react.default.createElement("h6", {
          className: "text-center text-400"
        }, _react.default.createElement("em", null, "No Results"));
      }

      var totalColsWidth = this.totalColumnsWidthMemoized(columnHeaders, defaultInitialColumnWidth);
      var minTotalWidth = Math.max(width || 0, totalColsWidth);

      var tableHeaderProps = _underscore.default.omit(this.props, 'fadeIn', 'className', 'children', 'stackDepth', 'colWidthStyles');

      return _react.default.createElement("div", {
        style: {
          'width': minTotalWidth
        },
        className: "stacked-block-table" + (mounted ? ' mounted' : '') + (fadeIn ? ' fade-in' : '') + (typeof className === 'string' ? ' ' + className : '')
      }, _react.default.createElement(TableHeaders, tableHeaderProps), _react.default.createElement("div", {
        className: "body clearfix"
      }, this.adjustedChildren()));
    }
  }]);

  return StackedBlockTable;
}(_react.default.PureComponent);

exports.StackedBlockTable = StackedBlockTable;

_defineProperty(StackedBlockTable, "StackedBlock", StackedBlock);

_defineProperty(StackedBlockTable, "propTypes", {
  'columnHeaders': _propTypes.default.arrayOf(_propTypes.default.shape({
    'columnClass': _propTypes.default.string.isRequired,
    'className': _propTypes.default.string,
    'title': _propTypes.default.string.isRequired,
    'visibleTitle': _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.element, _propTypes.default.func]),
    'initialWidth': _propTypes.default.number
  })).isRequired,
  'width': _propTypes.default.number.isRequired
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
    visibleTitle: _react.default.createElement("i", {
      className: "icon fas icon-download"
    })
  }, {
    columnClass: 'file',
    title: 'File',
    initialWidth: 125
  }],
  'width': null,
  'defaultInitialColumnWidth': 120,
  'collapseLimit': 4,
  'collapseShow': 3,
  'collapseLongLists': true,
  'defaultCollapsed': true
});

function TableHeaders(props) {
  var columnHeaders = props.columnHeaders,
      width = props.width,
      defaultInitialColumnWidth = props.defaultInitialColumnWidth;
  var columnWidths = StackedBlockTable.scaledColumnWidths(width, columnHeaders, defaultInitialColumnWidth);

  var headers = _underscore.default.map(columnHeaders, function (colHeader, index) {
    var field = colHeader.field,
        title = colHeader.title,
        vTitle = colHeader.visibleTitle,
        initialWidth = colHeader.initialWidth,
        columnClass = colHeader.columnClass,
        className = colHeader.className;
    var visibleTitle = vTitle || title;
    if (typeof visibleTitle === 'function') visibleTitle = visibleTitle(props);
    var colWidth = columnWidths[index] || initialWidth || defaultInitialColumnWidth;
    var cls = "heading-block col-" + columnClass + (className ? ' ' + className : '');
    var tooltip = typeof visibleTitle === 'string' ? visibleTitle : typeof title === 'string' ? title : null;

    if (tooltip && tooltip.length < 6) {
      tooltip = null;
    }

    return _react.default.createElement("div", {
      className: cls,
      key: field || index,
      style: {
        'width': colWidth
      },
      "data-column-class": columnClass,
      "data-tip": tooltip
    }, visibleTitle);
  });

  return _react.default.createElement("div", {
    className: "headers stacked-block-table-headers"
  }, headers);
}

TableHeaders.propTypes = {
  'columnHeaders': _propTypes.default.array.isRequired,
  'width': _propTypes.default.number.isRequired,
  'defaultInitialColumnWidth': _propTypes.default.number,
  'allFiles': _propTypes.default.arrayOf(_propTypes.default.object),
  'selectedFiles': _propTypes.default.arrayOf(_propTypes.default.object),
  'handleFileCheckboxChange': _propTypes.default.func.isRequired
};