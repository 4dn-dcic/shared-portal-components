"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadersRow = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactDraggable = _interopRequireDefault(require("react-draggable"));

var _ColumnCombiner = require("./ColumnCombiner");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Assumes that is rendered by SearchResultTable and that a SortController instance
 * is above it in the component tree hierarchy (provide sortColumn, sortBy, sortReverse).
 *
 * Can exclude props passed by those two and HeadersRow features/UI will degrade gracefully.
 */
var HeadersRow =
/*#__PURE__*/
function (_React$Component) {
  _inherits(HeadersRow, _React$Component);

  function HeadersRow(props) {
    var _this;

    _classCallCheck(this, HeadersRow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeadersRow).call(this, props));
    _this.setColumnWidthsFromState = _this.setColumnWidthsFromState.bind(_assertThisInitialized(_this));
    _this.getWidthFor = _this.getWidthFor.bind(_assertThisInitialized(_this));
    _this.onAdjusterDrag = _this.onAdjusterDrag.bind(_assertThisInitialized(_this));
    _this.state = {
      'widths': {}
    };
    return _this;
  }

  _createClass(HeadersRow, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var columnWidths = this.props.columnWidths;

      if (pastProps.columnWidths !== columnWidths) {
        this.setState({
          'widths': {}
        });
      }
    }
    /** Updates CustomColumnController.state.columnWidths from HeadersRow.state.widths */

  }, {
    key: "setColumnWidthsFromState",
    value: function setColumnWidthsFromState() {
      var _this$props = this.props,
          setColumnWidths = _this$props.setColumnWidths,
          columnWidths = _this$props.columnWidths;
      var widths = this.state.widths;

      if (typeof setColumnWidths !== 'function') {
        throw new Error('props.setHeaderWidths not a function');
      }

      setTimeout(function () {
        setColumnWidths(_objectSpread({}, columnWidths, {}, widths));
      }, 0);
    }
  }, {
    key: "getWidthFor",
    value: function getWidthFor(columnDefinition) {
      var field = columnDefinition.field;
      var _this$props2 = this.props,
          columnWidths = _this$props2.columnWidths,
          mounted = _this$props2.mounted,
          windowWidth = _this$props2.windowWidth;
      var widths = this.state.widths;
      return widths && widths[field] || columnWidths && columnWidths[field] || (0, _ColumnCombiner.getColumnWidthFromDefinition)(columnDefinition, mounted, windowWidth);
    }
  }, {
    key: "onAdjusterDrag",
    value: function onAdjusterDrag(columnDefinition, evt, r) {
      var field = columnDefinition.field;
      this.setState(function (_ref, _ref2) {
        var widths = _ref.widths;
        var defaultMinColumnWidth = _ref2.defaultMinColumnWidth;

        var nextWidths = _underscore["default"].clone(widths);

        nextWidths[field] = Math.max(columnDefinition.minColumnWidth || defaultMinColumnWidth || 55, r.x);
        return {
          'widths': nextWidths
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          columnDefinitions = _this$props3.columnDefinitions,
          renderDetailPane = _this$props3.renderDetailPane,
          columnWidths = _this$props3.columnWidths,
          setColumnWidths = _this$props3.setColumnWidths,
          width = _this$props3.width,
          tableContainerScrollLeft = _this$props3.tableContainerScrollLeft;
      var outerClassName = "search-headers-row" + (!!(typeof setColumnWidths === "function" && columnWidths) ? '' : ' non-adjustable') + (typeof renderDetailPane !== 'function' ? ' no-detail-pane' : '');
      return _react["default"].createElement("div", {
        className: outerClassName,
        style: {
          'width': width || null // Only passed in from ItemPage

        }
      }, _react["default"].createElement("div", {
        className: "columns clearfix",
        style: {
          left: 0 - tableContainerScrollLeft //transform: "translate3d(" + leftOffset + "px, 0px, 0px)"

        }
      }, _underscore["default"].map(columnDefinitions, function (colDef, i) {
        return _react["default"].createElement(HeadersRowColumn, _extends({}, _underscore["default"].pick(_this2.props, 'sortColumn', 'sortReverse', 'sortBy', 'columnWidths'), {
          colDef: colDef,
          index: i,
          onAdjusterDrag: _this2.onAdjusterDrag,
          setHeaderWidths: _this2.setColumnWidthsFromState,
          width: _this2.getWidthFor(colDef, i),
          key: colDef.field
        }));
      })));
    }
  }]);

  return HeadersRow;
}(_react["default"].Component);

exports.HeadersRow = HeadersRow;

_defineProperty(HeadersRow, "propTypes", {
  'columnDefinitions': _propTypes["default"].array.isRequired,
  //ResultRow.propTypes.columnDefinitions,
  'mounted': _propTypes["default"].bool.isRequired,
  'renderDetailPane': _propTypes["default"].func,
  'columnWidths': _propTypes["default"].objectOf(_propTypes["default"].number),
  'setColumnWidths': _propTypes["default"].func,
  'width': _propTypes["default"].number,
  'defaultMinColumnWidth': _propTypes["default"].number,
  'tableContainerScrollLeft': _propTypes["default"].number
});

_defineProperty(HeadersRow, "defaultProps", {
  'defaultMinColumnWidth': 55,
  'tableContainerScrollLeft': 0
});

var HeadersRowColumn =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(HeadersRowColumn, _React$PureComponent);

  function HeadersRowColumn(props) {
    var _this3;

    _classCallCheck(this, HeadersRowColumn);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(HeadersRowColumn).call(this, props));
    _this3.onDrag = _this3.onDrag.bind(_assertThisInitialized(_this3));
    _this3.onStop = _this3.onStop.bind(_assertThisInitialized(_this3));
    _this3.memoized = {
      showTooltip: (0, _memoizeOne["default"])(function (colWidth, titleStr) {
        return (colWidth - 40) / 7 < (titleStr || "").length;
      })
    };
    return _this3;
  }
  /** Updates HeadersRow.state.widths {Object<string,numer>} */


  _createClass(HeadersRowColumn, [{
    key: "onDrag",
    value: function onDrag(event, res) {
      var _this$props4 = this.props,
          colDef = _this$props4.colDef,
          onAdjusterDrag = _this$props4.onAdjusterDrag;
      onAdjusterDrag(colDef, event, res);
    }
    /** Updates CustomColumnController.state.columnWidths from HeadersRow.state.widths */

  }, {
    key: "onStop",
    value: function onStop() {
      var setHeaderWidths = this.props.setHeaderWidths;
      setHeaderWidths();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          sortColumn = _this$props5.sortColumn,
          sortBy = _this$props5.sortBy,
          sortReverse = _this$props5.sortReverse,
          width = _this$props5.width,
          colDef = _this$props5.colDef,
          columnWidths = _this$props5.columnWidths,
          onAdjusterDrag = _this$props5.onAdjusterDrag;
      var noSort = colDef.noSort,
          colTitle = colDef.colTitle,
          title = colDef.title,
          field = colDef.field;
      var tooltip = this.memoized.showTooltip(width, typeof colTitle === "string" ? colTitle : title) ? title : null;
      var sorterIcon;

      if (!colDef.noSort && typeof sortBy === 'function' && width >= 50) {
        sorterIcon = _react["default"].createElement(ColumnSorterIcon, {
          sortByFxn: sortBy,
          currentSortColumn: sortColumn,
          descend: sortReverse,
          value: colDef.field
        });
      }

      return _react["default"].createElement("div", {
        "data-field": field,
        key: field,
        "data-tip": tooltip,
        className: "search-headers-column-block" + (noSort ? " no-sort" : ''),
        style: {
          width: width
        }
      }, _react["default"].createElement("div", {
        className: "inner"
      }, _react["default"].createElement("span", {
        className: "column-title"
      }, colTitle || title), sorterIcon), columnWidths && typeof onAdjusterDrag === "function" ? _react["default"].createElement(_reactDraggable["default"], {
        position: {
          x: width,
          y: 0
        },
        axis: "x",
        onDrag: this.onDrag,
        onStop: this.onStop
      }, _react["default"].createElement("div", {
        className: "width-adjuster"
      })) : null);
    }
  }]);

  return HeadersRowColumn;
}(_react["default"].PureComponent);

var ColumnSorterIcon =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(ColumnSorterIcon, _React$PureComponent2);

  function ColumnSorterIcon(props) {
    var _this4;

    _classCallCheck(this, ColumnSorterIcon);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(ColumnSorterIcon).call(this, props));
    _this4.sortClickFxn = _this4.sortClickFxn.bind(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(ColumnSorterIcon, [{
    key: "sortClickFxn",
    value: function sortClickFxn(e) {
      var _this$props6 = this.props,
          value = _this$props6.value,
          descend = _this$props6.descend,
          currentSortColumn = _this$props6.currentSortColumn,
          sortByFxn = _this$props6.sortByFxn;
      e.preventDefault();
      sortByFxn(value, currentSortColumn === value && !descend);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          value = _this$props7.value,
          descend = _this$props7.descend,
          currentSortColumn = _this$props7.currentSortColumn;

      if (typeof value !== 'string' || value.length === 0) {
        return null;
      }

      var style = !descend && currentSortColumn === value ? 'ascend' : 'descend';
      var linkClass = (currentSortColumn === value ? 'active ' : '') + 'column-sort-icon';
      return _react["default"].createElement("span", {
        className: linkClass,
        onClick: this.sortClickFxn
      }, _react["default"].createElement(ColumnSorterIconElement, {
        style: style
      }));
    }
  }]);

  return ColumnSorterIcon;
}(_react["default"].PureComponent);

_defineProperty(ColumnSorterIcon, "propTypes", {
  'currentSortColumn': _propTypes["default"].string,
  'descend': _propTypes["default"].bool,
  'value': _propTypes["default"].string.isRequired,
  'sortByFxn': _propTypes["default"].func.isRequired
});

_defineProperty(ColumnSorterIcon, "defaultProps", {
  'descend': false
});

var ColumnSorterIconElement = _react["default"].memo(function (_ref3) {
  var style = _ref3.style;

  if (style === 'descend') {
    return _react["default"].createElement("i", {
      className: "icon icon-sort-down fas align-text-top"
    });
  }

  if (style === 'ascend') {
    return _react["default"].createElement("i", {
      className: "icon icon-sort-up fas align-bottom"
    });
  }

  throw new Error("Unsupported - " + style);
});