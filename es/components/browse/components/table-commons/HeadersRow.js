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

var _WindowClickEventDelegator = require("./../../../util/WindowClickEventDelegator");

var _layout = require("./../../../util/layout");

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
function (_React$PureComponent) {
  _inherits(HeadersRow, _React$PureComponent);

  function HeadersRow(props) {
    var _this;

    _classCallCheck(this, HeadersRow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeadersRow).call(this, props));
    _this.onWindowClick = _this.onWindowClick.bind(_assertThisInitialized(_this));
    _this.setShowingSortFieldsFor = _this.setShowingSortFieldsFor.bind(_assertThisInitialized(_this));
    _this.setColumnWidthsFromState = _this.setColumnWidthsFromState.bind(_assertThisInitialized(_this));
    _this.getWidthFor = _this.getWidthFor.bind(_assertThisInitialized(_this));
    _this.onAdjusterDrag = _this.onAdjusterDrag.bind(_assertThisInitialized(_this));
    _this.state = {
      'widths': {},
      // Store for temporary column widths used while a header's 'width' edge/grabber is being dragged.
      'showingSortFieldsForColumn': null // Key/field of column for which sort fields/options are being shown.

    };
    return _this;
  }

  _createClass(HeadersRow, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var columnWidths = this.props.columnWidths;
      var showingSortFieldsForColumn = this.state.showingSortFieldsForColumn;

      if (pastProps.columnWidths !== columnWidths) {
        this.setState({
          'widths': {}
        });
      }

      if (showingSortFieldsForColumn && !pastState.showingSortFieldsForColumn) {
        _WindowClickEventDelegator.WindowClickEventDelegator.addHandler("click", this.onWindowClick, {
          passive: true
        });
      } else if (!showingSortFieldsForColumn && pastState.showingSortFieldsForColumn) {
        _WindowClickEventDelegator.WindowClickEventDelegator.removeHandler("click", this.onWindowClick);
      }
    }
    /** Close dropdown on window click unless click within menu. */

  }, {
    key: "onWindowClick",
    value: function onWindowClick(evt) {
      var _this2 = this;

      setTimeout(function () {
        var showingSortFieldsForColumn = _this2.state.showingSortFieldsForColumn;
        var clickedElement = evt.target;
        var clickedChildOfDropdownMenu = !!(0, _layout.findParentElement)(clickedElement, function (el) {
          return el.getAttribute("data-column-key") === showingSortFieldsForColumn;
        });

        if (!clickedChildOfDropdownMenu) {
          _this2.setShowingSortFieldsFor(null);
        }
      }, 0);
    }
  }, {
    key: "setShowingSortFieldsFor",
    value: function setShowingSortFieldsFor(showingSortFieldsForColumn) {
      this.setState({
        showingSortFieldsForColumn: showingSortFieldsForColumn
      });
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
      var _this3 = this;

      var _this$props3 = this.props,
          columnDefinitions = _this$props3.columnDefinitions,
          renderDetailPane = _this$props3.renderDetailPane,
          _this$props3$sortColu = _this$props3.sortColumn,
          sortColumn = _this$props3$sortColu === void 0 ? null : _this$props3$sortColu,
          _this$props3$sortReve = _this$props3.sortReverse,
          sortReverse = _this$props3$sortReve === void 0 ? false : _this$props3$sortReve,
          sortBy = _this$props3.sortBy,
          columnWidths = _this$props3.columnWidths,
          setColumnWidths = _this$props3.setColumnWidths,
          width = _this$props3.width,
          tableContainerScrollLeft = _this$props3.tableContainerScrollLeft;
      var showingSortFieldsForColumn = this.state.showingSortFieldsForColumn;
      var outerClassName = "search-headers-row" + (!!(typeof setColumnWidths === "function" && columnWidths) ? '' : ' non-adjustable') + (typeof renderDetailPane !== 'function' ? ' no-detail-pane' : '');
      var commonProps = {
        sortColumn: sortColumn,
        sortReverse: sortReverse,
        sortBy: sortBy,
        columnWidths: columnWidths,
        showingSortFieldsForColumn: showingSortFieldsForColumn,
        setHeaderWidths: this.setColumnWidthsFromState,
        onAdjusterDrag: this.onAdjusterDrag,
        setShowingSortFieldsFor: this.setShowingSortFieldsFor
      };
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
      }, columnDefinitions.map(function (columnDefinition, index) {
        return _react["default"].createElement(HeadersRowColumn, _extends({}, commonProps, {
          columnDefinition: columnDefinition,
          index: index
        }, {
          width: _this3.getWidthFor(columnDefinition, index),
          key: columnDefinition.field
        }));
      })));
    }
  }]);

  return HeadersRow;
}(_react["default"].PureComponent);

exports.HeadersRow = HeadersRow;

_defineProperty(HeadersRow, "propTypes", {
  'columnDefinitions': _propTypes["default"].arrayOf(_propTypes["default"].shape({
    'field': _propTypes["default"].string.isRequired,
    'title': _propTypes["default"].string,
    'sort_fields': _propTypes["default"].arrayOf(_propTypes["default"].shape({
      'field': _propTypes["default"].string.isRequired,
      'title': _propTypes["default"].string
    })),
    'render': _propTypes["default"].func,
    'widthMap': _propTypes["default"].shape({
      'lg': _propTypes["default"].number.isRequired,
      'md': _propTypes["default"].number.isRequired,
      'sm': _propTypes["default"].number.isRequired
    })
  })).isRequired,
  'mounted': _propTypes["default"].bool.isRequired,
  'renderDetailPane': _propTypes["default"].func,
  'width': _propTypes["default"].number,
  'defaultMinColumnWidth': _propTypes["default"].number,
  'tableContainerScrollLeft': _propTypes["default"].number,
  // Passed down from CustomColumnController (if used)
  'columnWidths': _propTypes["default"].objectOf(_propTypes["default"].number),
  'setColumnWidths': _propTypes["default"].func,
  // Passed down from SortController (if used)
  'sortColumn': _propTypes["default"].string,
  'sortReverse': _propTypes["default"].bool,
  'sortByFxn': _propTypes["default"].func
});

_defineProperty(HeadersRow, "defaultProps", {
  'defaultMinColumnWidth': 55,
  'tableContainerScrollLeft': 0
});

var HeadersRowColumn =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(HeadersRowColumn, _React$PureComponent2);

  function HeadersRowColumn(props) {
    var _this4;

    _classCallCheck(this, HeadersRowColumn);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(HeadersRowColumn).call(this, props));
    _this4.onDrag = _this4.onDrag.bind(_assertThisInitialized(_this4));
    _this4.onStop = _this4.onStop.bind(_assertThisInitialized(_this4));
    _this4.memoized = {
      showTooltip: (0, _memoizeOne["default"])(function (colWidth, titleStr) {
        return (colWidth - 40) / 7 < (titleStr || "").length;
      })
    };
    return _this4;
  }
  /** Updates HeadersRow.state.widths {Object<string,numer>} */


  _createClass(HeadersRowColumn, [{
    key: "onDrag",
    value: function onDrag(event, res) {
      var _this$props4 = this.props,
          columnDefinition = _this$props4.columnDefinition,
          onAdjusterDrag = _this$props4.onAdjusterDrag;
      onAdjusterDrag(columnDefinition, event, res);
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
          currentSortColumn = _this$props5.sortColumn,
          sortByFxn = _this$props5.sortBy,
          descend = _this$props5.sortReverse,
          width = _this$props5.width,
          columnDefinition = _this$props5.columnDefinition,
          columnWidths = _this$props5.columnWidths,
          onAdjusterDrag = _this$props5.onAdjusterDrag,
          showingSortFieldsForColumn = _this$props5.showingSortFieldsForColumn,
          setShowingSortFieldsFor = _this$props5.setShowingSortFieldsFor;
      var noSort = columnDefinition.noSort,
          colTitle = columnDefinition.colTitle,
          title = columnDefinition.title,
          field = columnDefinition.field;
      var tooltip = this.memoized.showTooltip(width, typeof colTitle === "string" ? colTitle : title) ? title : null;
      var sorterIcon;

      if (!noSort && typeof sortByFxn === 'function' && width >= 50) {
        sorterIcon = _react["default"].createElement(ColumnSorterIcon, {
          columnDefinition: columnDefinition,
          sortByFxn: sortByFxn,
          currentSortColumn: currentSortColumn,
          descend: descend,
          showingSortFieldsForColumn: showingSortFieldsForColumn,
          setShowingSortFieldsFor: setShowingSortFieldsFor
        });
      }

      return _react["default"].createElement("div", {
        "data-field": field,
        "data-column-key": field,
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
function (_React$PureComponent3) {
  _inherits(ColumnSorterIcon, _React$PureComponent3);

  _createClass(ColumnSorterIcon, null, [{
    key: "isActive",
    value: function isActive(columnDefinition, currentSortColumn) {
      var field = columnDefinition.field,
          _columnDefinition$sor = columnDefinition.sort_fields,
          sort_fields = _columnDefinition$sor === void 0 ? null : _columnDefinition$sor;

      if (!Array.isArray(sort_fields)) {
        return field === currentSortColumn;
      }

      for (var i = 0; i < sort_fields.length; i++) {
        if (sort_fields[i].field === currentSortColumn) {
          return true;
        }
      }

      return false;
    }
  }]);

  function ColumnSorterIcon(props) {
    var _this5;

    _classCallCheck(this, ColumnSorterIcon);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(ColumnSorterIcon).call(this, props));
    _this5.onIconClick = _this5.onIconClick.bind(_assertThisInitialized(_this5));
    _this5.memoized = {
      isActive: (0, _memoizeOne["default"])(ColumnSorterIcon.isActive)
    };
    return _this5;
  }

  _createClass(ColumnSorterIcon, [{
    key: "onIconClick",
    value: function onIconClick(e) {
      e.preventDefault();
      var _this$props6 = this.props,
          _this$props6$columnDe = _this$props6.columnDefinition,
          field = _this$props6$columnDe.field,
          _this$props6$columnDe2 = _this$props6$columnDe.sort_fields,
          sort_fields = _this$props6$columnDe2 === void 0 ? [] : _this$props6$columnDe2,
          _this$props6$descend = _this$props6.descend,
          descend = _this$props6$descend === void 0 ? false : _this$props6$descend,
          _this$props6$currentS = _this$props6.currentSortColumn,
          currentSortColumn = _this$props6$currentS === void 0 ? null : _this$props6$currentS,
          sortByFxn = _this$props6.sortByFxn,
          _this$props6$showingS = _this$props6.showingSortFieldsForColumn,
          showingSortFieldsForColumn = _this$props6$showingS === void 0 ? null : _this$props6$showingS,
          setShowingSortFieldsFor = _this$props6.setShowingSortFieldsFor;

      if (showingSortFieldsForColumn === field) {
        // We're currently showing options for this col/icon; unset.
        setShowingSortFieldsFor(null);
        return;
      }

      if (sort_fields.length >= 2) {
        // Show options in UI
        setShowingSortFieldsFor(field);
        return;
      } // If not multiple options, just sort on the only sort field available.
      // Whether is a single item in sort_fields list or the field/key of column (if no sort_fields).


      var useField = sort_fields[0] || field;
      sortByFxn(useField, currentSortColumn !== useField || !descend && currentSortColumn === useField);

      if (showingSortFieldsForColumn !== null) {
        setShowingSortFieldsFor(null);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          columnDefinition = _this$props7.columnDefinition,
          descend = _this$props7.descend,
          currentSortColumn = _this$props7.currentSortColumn,
          sortByFxn = _this$props7.sortByFxn,
          _this$props7$showingS = _this$props7.showingSortFieldsForColumn,
          showingSortFieldsForColumn = _this$props7$showingS === void 0 ? null : _this$props7$showingS;
      var field = columnDefinition.field,
          _columnDefinition$sor2 = columnDefinition.sort_fields,
          sort_fields = _columnDefinition$sor2 === void 0 ? [] : _columnDefinition$sor2;

      if (typeof field !== 'string' || field.length === 0) {
        return null;
      }

      var isActive = this.memoized.isActive(columnDefinition, currentSortColumn);
      var isShowingSortFields = showingSortFieldsForColumn === field;
      var cls = (isActive ? 'active ' : '') + (sort_fields.length >= 2 ? 'multiple-sort-options ' : '') + 'column-sort-icon';

      var icon = _react["default"].createElement("span", {
        className: cls,
        onClick: this.onIconClick
      }, _react["default"].createElement(ColumnSorterIconElement, {
        descend: !isActive || descend,
        isShowingSortFields: isShowingSortFields
      }));

      if (!isShowingSortFields) {
        return icon;
      }

      return _react["default"].createElement(_react["default"].Fragment, null, icon, _react["default"].createElement(SortOptionsMenu, {
        currentSortColumn: currentSortColumn,
        sort_fields: sort_fields,
        sortByFxn: sortByFxn,
        descend: descend
      }));
    }
  }]);

  return ColumnSorterIcon;
}(_react["default"].PureComponent);

_defineProperty(ColumnSorterIcon, "propTypes", {
  'currentSortColumn': _propTypes["default"].string,
  'descend': _propTypes["default"].bool,
  'columnDefinition': HeadersRow.propTypes.columnDefinitions,
  'sortByFxn': _propTypes["default"].func.isRequired,
  'showingSortFieldsForColumn': _propTypes["default"].string,
  'setShowingSortFieldsFor': _propTypes["default"].func
});

_defineProperty(ColumnSorterIcon, "defaultProps", {
  'descend': false
});

var SortOptionsMenu = _react["default"].memo(function (_ref3) {
  var currentSortColumn = _ref3.currentSortColumn,
      sort_fields = _ref3.sort_fields,
      sortByFxn = _ref3.sortByFxn,
      _ref3$descend = _ref3.descend,
      descend = _ref3$descend === void 0 ? false : _ref3$descend;
  var options = sort_fields.map(function (_ref4) {
    var field = _ref4.field,
        _ref4$title = _ref4.title,
        title = _ref4$title === void 0 ? null : _ref4$title;
    // TODO grab title from schemas if not provided.
    var isActive = currentSortColumn === field;
    var cls = "dropdown-item" + (isActive ? " active" : "");
    return _react["default"].createElement("a", {
      className: cls,
      href: "#",
      key: field,
      onClick: function onMenuItemClick(evt) {
        evt.preventDefault();
        sortByFxn(field, !isActive || !descend && isActive);
      }
    }, title || field);
  });
  return _react["default"].createElement("div", {
    className: "dropdown-menu dropdown-menu-right show"
  }, options);
});

var ColumnSorterIconElement = _react["default"].memo(function (_ref5) {
  var descend = _ref5.descend,
      isShowingSortFields = _ref5.isShowingSortFields;

  if (isShowingSortFields) {
    return _react["default"].createElement("i", {
      className: "icon icon-fw icon-times-circle far"
    });
  }

  if (descend) {
    return _react["default"].createElement("i", {
      className: "sort-icon icon icon-fw icon-angle-down fas"
    });
  } else {
    return _react["default"].createElement("i", {
      className: "sort-icon icon icon-fw icon-angle-up fas"
    });
  }
});