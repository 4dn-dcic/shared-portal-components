function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import Draggable from 'react-draggable';
import { getColumnWidthFromDefinition } from './ColumnCombiner';
import { WindowEventDelegator } from './../../../util/WindowEventDelegator';
import { findParentElement } from './../../../util/layout';
import { requestAnimationFrame as raf } from './../../../viz/utilities';
/**
 * Assumes that is rendered by SearchResultTable and that a SortController instance
 * is above it in the component tree hierarchy (provide sortColumn, sortBy, sortReverse).
 *
 * Can exclude props passed by those two and HeadersRow features/UI will degrade gracefully.
 */

export var HeadersRow = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(HeadersRow, _React$PureComponent);

  var _super = _createSuper(HeadersRow);

  function HeadersRow(props) {
    var _this;

    _classCallCheck(this, HeadersRow);

    _this = _super.call(this, props);
    _this.onWindowClick = _this.onWindowClick.bind(_assertThisInitialized(_this));
    _this.setShowingSortFieldsFor = _this.setShowingSortFieldsFor.bind(_assertThisInitialized(_this));
    _this.sortByField = _this.sortByField.bind(_assertThisInitialized(_this));
    _this.setColumnWidthsFromState = _this.setColumnWidthsFromState.bind(_assertThisInitialized(_this));
    _this.onAdjusterDrag = _this.onAdjusterDrag.bind(_assertThisInitialized(_this));
    _this.state = {
      'widths': {},
      // Store for temporary column widths used while a header's 'width' edge/grabber is being dragged.
      'showingSortFieldsForColumn': null,
      // Key/field of column for which sort fields/options are being shown.
      'loadingField': null // Current key/field of column for which sorted results are being loaded.

    };
    _this.memoized = {
      alignedWidths: memoize(HeadersRow.alignedWidths),
      getSortColumnMap: memoize(HeadersRow.getSortColumnMap),
      getRootLoadingField: memoize(HeadersRow.getRootLoadingField),
      flattenColumnsDefinitionsSortFields: memoize(flattenColumnsDefinitionsSortFields),
      getTrimmedColumn: memoize(HeadersRow.getTrimmedColumn)
    };
    return _this;
  }

  _createClass(HeadersRow, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var _this$props = this.props,
          columnWidths = _this$props.columnWidths,
          sortColumns = _this$props.sortColumns,
          tableContainerScrollLeft = _this$props.tableContainerScrollLeft;
      var _this$state = this.state,
          showingSortFieldsForColumn = _this$state.showingSortFieldsForColumn,
          loadingField = _this$state.loadingField;
      var pastSortColumns = pastProps.sortColumns,
          pastScrollLeft = pastProps.tableContainerScrollLeft;

      if (showingSortFieldsForColumn && !pastState.showingSortFieldsForColumn) {
        WindowEventDelegator.addHandler("click", this.onWindowClick);
      } else if (!showingSortFieldsForColumn && pastState.showingSortFieldsForColumn) {
        WindowEventDelegator.removeHandler("click", this.onWindowClick);
      }

      var nextState = {};

      if (pastProps.columnWidths !== columnWidths) {
        nextState.widths = {};
      } // Unset loading icon


      var _ref2 = _slicedToArray(sortColumns || [], 1),
          _ref2$ = _ref2[0];

      _ref2$ = _ref2$ === void 0 ? {} : _ref2$;
      var _ref2$$column = _ref2$.column,
          sortColumn = _ref2$$column === void 0 ? null : _ref2$$column,
          _ref2$$direction = _ref2$.direction,
          direction = _ref2$$direction === void 0 ? null : _ref2$$direction;

      var _ref4 = _slicedToArray(pastSortColumns || [], 1),
          _ref4$ = _ref4[0];

      _ref4$ = _ref4$ === void 0 ? {} : _ref4$;
      var _ref4$$column = _ref4$.column,
          pastSortColumn = _ref4$$column === void 0 ? null : _ref4$$column,
          _ref4$$direction = _ref4$.direction,
          pastDirection = _ref4$$direction === void 0 ? null : _ref4$$direction;

      if (loadingField !== null && (sortColumn !== pastSortColumn || direction !== pastDirection)) {
        if (sortColumn === loadingField || this.memoized.getTrimmedColumn(sortColumn) === loadingField) {
          nextState.loadingField = null;
        }
      } // Unset dropdown menu if start scrolling horizontally


      if (tableContainerScrollLeft !== pastScrollLeft) {
        nextState.showingSortFieldsForColumn = null;
      }

      if (Object.keys(nextState).length > 0) {
        this.setState(nextState);
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
        var clickedChildOfDropdownMenu = !!findParentElement(clickedElement, function (el) {
          return el.getAttribute("data-showing-sort-fields-for") === showingSortFieldsForColumn;
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
    /**
     * Determines direction of next sort (descending vs ascending) and sets
     * `state.isLoading` to true (to be unset by `componentDidUpdate`)
     * before calling `props.sortByFxn`.
     */

  }, {
    key: "sortByField",
    value: function sortByField(field) {
      var _this$props2 = this.props,
          sortColumns = _this$props2.sortColumns,
          sortBy = _this$props2.sortBy,
          columnDefinitions = _this$props2.columnDefinitions;

      var _ref6 = _slicedToArray(sortColumns || [], 1),
          _ref6$ = _ref6[0];

      _ref6$ = _ref6$ === void 0 ? {} : _ref6$;
      var _ref6$$column = _ref6$.column,
          column = _ref6$$column === void 0 ? null : _ref6$$column,
          _ref6$$direction = _ref6$.direction,
          direction = _ref6$$direction === void 0 ? "desc" : _ref6$$direction;
      var trimmedColumn = HeadersRow.getTrimmedColumn(column);
      var isActive = column === field || trimmedColumn && trimmedColumn === field;
      var initialSort = null;

      if (columnDefinitions) {
        var _this$memoized$flatte = this.memoized.flattenColumnsDefinitionsSortFields(columnDefinitions),
            allSortFields = _this$memoized$flatte.allSortFields,
            allSortFieldsMap = _this$memoized$flatte.allSortFieldsMap;

        var def = (allSortFieldsMap || {})[field];

        if (def) {
          initialSort = def.initial_sort || HeadersRow.getSortDirectionBySchemaFieldType(def.type) || null;
        }
      }

      var sortDirection;

      if (!isActive && initialSort) {
        sortDirection = initialSort;
      } else {
        sortDirection = !isActive || isActive && direction !== "desc" ? "desc" : "asc";
      }

      this.setState({
        "loadingField": field,
        "showingSortFieldsForColumn": null
      }, function () {
        sortBy([{
          column: field,
          direction: sortDirection
        }]);
      });
    }
    /** Updates CustomColumnController.state.columnWidths from HeadersRow.state.widths */

  }, {
    key: "setColumnWidthsFromState",
    value: function setColumnWidthsFromState() {
      var _this3 = this;

      raf(function () {
        var _this3$props = _this3.props,
            setColumnWidths = _this3$props.setColumnWidths,
            columnWidths = _this3$props.columnWidths;
        var widths = _this3.state.widths;

        if (typeof setColumnWidths !== 'function') {
          throw new Error('props.setHeaderWidths not a function');
        }

        setColumnWidths(_objectSpread(_objectSpread({}, columnWidths), widths));
      });
    }
  }, {
    key: "onAdjusterDrag",
    value: function onAdjusterDrag(columnDefinition, evt, r) {
      var field = columnDefinition.field;
      this.setState(function (_ref8, _ref9) {
        var widths = _ref8.widths;
        var defaultMinColumnWidth = _ref9.defaultMinColumnWidth;
        return {
          'widths': _objectSpread(_objectSpread({}, widths), {}, _defineProperty({}, field, Math.max(columnDefinition.minColumnWidth || defaultMinColumnWidth || 55, r.x)))
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          columnDefinitions = _this$props3.columnDefinitions,
          renderDetailPane = _this$props3.renderDetailPane,
          detailPane = _this$props3.detailPane,
          _this$props3$sortColu = _this$props3.sortColumns,
          sortColumns = _this$props3$sortColu === void 0 ? [] : _this$props3$sortColu,
          sortBy = _this$props3.sortBy,
          columnWidths = _this$props3.columnWidths,
          setColumnWidths = _this$props3.setColumnWidths,
          width = _this$props3.width,
          tableContainerScrollLeft = _this$props3.tableContainerScrollLeft,
          windowWidth = _this$props3.windowWidth,
          _this$props3$stickyFi = _this$props3.stickyFirstColumn,
          stickyFirstColumn = _this$props3$stickyFi === void 0 ? false : _this$props3$stickyFi;
      var _this$state2 = this.state,
          showingSortFieldsForColumn = _this$state2.showingSortFieldsForColumn,
          widths = _this$state2.widths,
          loadingField = _this$state2.loadingField;
      var sortColumnMap = this.memoized.getSortColumnMap(columnDefinitions, sortColumns);
      var leftOffset = 0 - tableContainerScrollLeft;
      var isSortable = typeof sortBy === "function";
      var isAdjustable = !!(typeof setColumnWidths === "function" && columnWidths);
      var outerClassName = "search-headers-row" + (isAdjustable ? '' : ' non-adjustable') + (typeof renderDetailPane !== 'function' && !detailPane ? ' no-detail-pane' : '');
      var commonProps = {
        sortByField: isSortable ? this.sortByField : null,
        // Disable sorting if no sortBy func.
        setHeaderWidths: isAdjustable ? this.setColumnWidthsFromState : null,
        // Disable resizing cols if no setColumnWidths func.
        onAdjusterDrag: isAdjustable ? this.onAdjusterDrag : null,
        // Disable resizing cols if no setColumnWidths func.
        setShowingSortFieldsFor: isSortable ? this.setShowingSortFieldsFor : null // Disable sorting if no sortBy func.

      };
      var alignedWidths = this.memoized.alignedWidths(columnDefinitions, columnWidths, widths, windowWidth);
      var rootLoadingField = this.memoized.getRootLoadingField(columnDefinitions, loadingField);
      var sortColumn = null,
          sortReverse = null;

      if (showingSortFieldsForColumn) {
        var col = sortColumnMap[showingSortFieldsForColumn];

        if (col) {
          sortColumn = col.field || showingSortFieldsForColumn;
          sortReverse = col.direction === 'desc';
        }
      }

      return /*#__PURE__*/React.createElement("div", {
        className: outerClassName,
        style: {
          'width': width || null // Only passed in from ItemPage

        },
        "data-showing-sort-fields-for": showingSortFieldsForColumn
      }, /*#__PURE__*/React.createElement("div", {
        className: "headers-columns-overflow-container"
      }, /*#__PURE__*/React.createElement("div", {
        className: "columns clearfix",
        style: {
          left: leftOffset //transform: "translate3d(" + leftOffset + "px, 0px, 0px)"

        }
      }, columnDefinitions.map(function (columnDefinition, index) {
        var field = columnDefinition.field;
        var width = alignedWidths[index];
        var headerColumn =
        /*#__PURE__*/
        // `props.active` may be undefined, object with more fields, or array where first item is `descending` flag (bool).
        React.createElement(HeadersRowColumn, _extends({}, commonProps, {
          columnDefinition: columnDefinition,
          index: index,
          showingSortOptionsMenu: showingSortFieldsForColumn && showingSortFieldsForColumn === field,
          isLoading: rootLoadingField && rootLoadingField === field,
          width: width,
          key: field,
          sortMap: sortColumnMap[field]
        }));

        if (index === 0 && stickyFirstColumn) {
          // First column in header will have position:fixed,
          // so add an offeset equal to its width.
          return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
            className: "placeholder-column",
            style: {
              width: width
            }
          }), headerColumn);
        }

        return headerColumn;
      }))), showingSortFieldsForColumn !== null ? /*#__PURE__*/React.createElement(SortOptionsMenuContainer, {
        showingSortFieldsForColumn: showingSortFieldsForColumn,
        columnDefinitions: columnDefinitions,
        sortColumn: sortColumn,
        sortReverse: sortReverse,
        alignedWidths: alignedWidths,
        leftOffset: leftOffset,
        sortByField: this.sortByField
      }) : null);
    }
  }], [{
    key: "alignedWidths",
    value: function alignedWidths(columnDefinitions, columnWidths, tempWidths, windowWidth) {
      return columnDefinitions.map(function (columnDefinition) {
        var field = columnDefinition.field;
        return tempWidths && tempWidths[field] || columnWidths && columnWidths[field] || getColumnWidthFromDefinition(columnDefinition, typeof windowWidth === "number", windowWidth);
      });
    }
  }, {
    key: "getSortColumnMap",
    value: function getSortColumnMap(columnDefinitions, sortColumns) {
      var retObj = {};
      columnDefinitions.forEach(function (_ref10) {
        var field = _ref10.field,
            _ref10$sort_fields = _ref10.sort_fields,
            sort_fields = _ref10$sort_fields === void 0 ? [] : _ref10$sort_fields;

        if (sort_fields.length < 2) {
          var useField = sort_fields[0] && sort_fields[0].field || field;
          var total = sortColumns.length;
          sortColumns.forEach(function (_ref11, index) {
            var column = _ref11.column,
                direction = _ref11.direction;
            var trimmedColumn = HeadersRow.getTrimmedColumn(column);

            if (useField === column || trimmedColumn && useField === trimmedColumn) {
              retObj[field] = _objectSpread({}, {
                index: index,
                direction: direction,
                total: total
              });
            }
          });
        } else {
          /** @todo optimize the loops */
          sortColumns.forEach(function (_ref12, index) {
            var column = _ref12.column,
                direction = _ref12.direction;
            var total = sortColumns.length;
            sort_fields.forEach(function (_ref13) {
              var sField = _ref13.field;

              if (column === sField) {
                retObj[field] = _objectSpread({}, {
                  index: index,
                  direction: direction,
                  total: total,
                  field: sField,
                  parent: field
                });
              }
            });
          });
        }
      });
      return retObj;
    }
  }, {
    key: "getRootLoadingField",
    value: function getRootLoadingField(columnDefinitions, loadingField) {
      if (!loadingField) return null;
      var colDefLen = columnDefinitions.length;

      for (var colIdx = 0; colIdx < colDefLen; colIdx++) {
        var _columnDefinitions$co = columnDefinitions[colIdx],
            rootField = _columnDefinitions$co.field,
            _columnDefinitions$co2 = _columnDefinitions$co.sort_fields,
            sort_fields = _columnDefinitions$co2 === void 0 ? [] : _columnDefinitions$co2;

        if (rootField === loadingField) {
          return rootField;
        }

        for (var sIdx = 0; sIdx < sort_fields.length; sIdx++) {
          var sField = sort_fields[sIdx].field;

          if (sField === loadingField) {
            return rootField;
          }
        }
      }

      return null;
    }
    /**
     * linkTo fields are appended by .display_title by backend so we trim it to find a match
     */

  }, {
    key: "getTrimmedColumn",
    value: function getTrimmedColumn(column) {
      if (!column || typeof column !== 'string' || column.length <= 14 || !column.endsWith('.display_title')) {
        return column;
      }

      return column.substring(0, column.length - 14);
    }
  }, {
    key: "getSortDirectionBySchemaFieldType",
    value: function getSortDirectionBySchemaFieldType(fieldType) {
      return {
        "string": "asc",
        "integer": "asc",
        "number": "desc",
        "date": "desc"
      }[fieldType] || null;
    }
  }]);

  return HeadersRow;
}(React.PureComponent);

_defineProperty(HeadersRow, "propTypes", {
  'columnDefinitions': PropTypes.arrayOf(PropTypes.shape({
    'field': PropTypes.string.isRequired,
    'title': PropTypes.string,
    'sort_fields': PropTypes.arrayOf(PropTypes.shape({
      'field': PropTypes.string.isRequired,
      'title': PropTypes.string
    })),
    'render': PropTypes.func,
    'widthMap': PropTypes.shape({
      'lg': PropTypes.number.isRequired,
      'md': PropTypes.number.isRequired,
      'sm': PropTypes.number.isRequired
    })
  })).isRequired,
  'mounted': PropTypes.bool.isRequired,
  'detailPane': PropTypes.element,
  'renderDetailPane': PropTypes.func,
  'width': PropTypes.number,
  'defaultMinColumnWidth': PropTypes.number,
  'tableContainerScrollLeft': PropTypes.number,
  'windowWidth': PropTypes.number,
  'stickyFirstColumn': PropTypes.bool,
  // Passed down from CustomColumnController (if used)
  'columnWidths': PropTypes.objectOf(PropTypes.number),
  'setColumnWidths': PropTypes.func,
  // Passed down from SortController (if used)
  'sortColumns': PropTypes.object,
  'sortBy': PropTypes.func
});

_defineProperty(HeadersRow, "defaultProps", {
  'defaultMinColumnWidth': 55,
  'tableContainerScrollLeft': 0
});

var HeadersRowColumn = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(HeadersRowColumn, _React$PureComponent2);

  var _super2 = _createSuper(HeadersRowColumn);

  function HeadersRowColumn(props) {
    var _this4;

    _classCallCheck(this, HeadersRowColumn);

    _this4 = _super2.call(this, props);
    _this4.onDrag = _this4.onDrag.bind(_assertThisInitialized(_this4));
    _this4.onStop = _this4.onStop.bind(_assertThisInitialized(_this4));
    _this4.memoized = {
      showTooltip: memoize(function (colWidth, titleStr) {
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
          sortByField = _this$props5.sortByField,
          width = _this$props5.width,
          columnDefinition = _this$props5.columnDefinition,
          onAdjusterDrag = _this$props5.onAdjusterDrag,
          showingSortOptionsMenu = _this$props5.showingSortOptionsMenu,
          setShowingSortFieldsFor = _this$props5.setShowingSortFieldsFor,
          sortMap = _this$props5.sortMap,
          _this$props5$isLoadin = _this$props5.isLoading,
          isLoading = _this$props5$isLoadin === void 0 ? false : _this$props5$isLoadin,
          index = _this$props5.index;
      var noSort = columnDefinition.noSort,
          colTitle = columnDefinition.colTitle,
          title = columnDefinition.title,
          field = columnDefinition.field,
          _columnDefinition$des = columnDefinition.description,
          description = _columnDefinition$des === void 0 ? null : _columnDefinition$des;
      var titleTooltip = this.memoized.showTooltip(width, typeof colTitle === "string" ? colTitle : title) ? title : null;
      var tooltip = description ? titleTooltip ? "<h5 class=\"mb-03\">".concat(titleTooltip, "</h5>") + description : description : titleTooltip ? titleTooltip : null;
      var sorterIcon;

      if (!noSort && typeof sortByField === 'function' && width >= 50) {
        sorterIcon = /*#__PURE__*/React.createElement(ColumnSorterIcon, {
          columnDefinition: columnDefinition,
          sortByField: sortByField,
          showingSortOptionsMenu: showingSortOptionsMenu,
          setShowingSortFieldsFor: setShowingSortFieldsFor,
          sortMap: sortMap,
          isLoading: isLoading
        });
      }

      var cls = "search-headers-column-block" + (noSort ? " no-sort" : '') + (showingSortOptionsMenu ? " showing-sort-field-options" : "");
      return /*#__PURE__*/React.createElement("div", {
        "data-field": field,
        "data-column-key": field,
        key: field,
        className: cls,
        style: {
          width: width
        },
        "data-first-visible-column": index === 0 ? true : undefined
      }, /*#__PURE__*/React.createElement("div", {
        className: "inner"
      }, /*#__PURE__*/React.createElement("div", {
        className: "column-title"
      }, /*#__PURE__*/React.createElement("span", {
        "data-tip": tooltip,
        "data-html": true
      }, colTitle || title)), sorterIcon), typeof onAdjusterDrag === "function" ? /*#__PURE__*/React.createElement(Draggable, {
        position: {
          x: width,
          y: 0
        },
        axis: "x",
        onDrag: this.onDrag,
        onStop: this.onStop
      }, /*#__PURE__*/React.createElement("div", {
        className: "width-adjuster"
      })) : null);
    }
  }]);

  return HeadersRowColumn;
}(React.PureComponent);

var ColumnSorterIcon = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(ColumnSorterIcon, _React$PureComponent3);

  var _super3 = _createSuper(ColumnSorterIcon);

  function ColumnSorterIcon(props) {
    var _this5;

    _classCallCheck(this, ColumnSorterIcon);

    _this5 = _super3.call(this, props);
    _this5.onIconClick = _this5.onIconClick.bind(_assertThisInitialized(_this5));
    _this5.memoized = {
      isActive: memoize(ColumnSorterIcon.isActive)
    };
    return _this5;
  }
  /**
   * Sorts column or opens/closes multisort menu
   * if multiple options.
   *
   * @param {React.SyntheticEvent} e - Click event object.
   */


  _createClass(ColumnSorterIcon, [{
    key: "onIconClick",
    value: function onIconClick(e) {
      e.preventDefault();
      var _this$props6 = this.props,
          _this$props6$columnDe = _this$props6.columnDefinition,
          field = _this$props6$columnDe.field,
          _this$props6$columnDe2 = _this$props6$columnDe.sort_fields,
          sort_fields = _this$props6$columnDe2 === void 0 ? [] : _this$props6$columnDe2,
          _this$props6$showingS = _this$props6.showingSortOptionsMenu,
          showingSortOptionsMenu = _this$props6$showingS === void 0 ? false : _this$props6$showingS,
          setShowingSortFieldsFor = _this$props6.setShowingSortFieldsFor,
          sortByField = _this$props6.sortByField;

      if (showingSortOptionsMenu) {
        // We're currently showing options for this col/icon; unset.
        setShowingSortFieldsFor(null);
        return;
      }

      if (sort_fields.length >= 2) {
        // Show options in UI
        setShowingSortFieldsFor(field);
        return;
      }

      var _sort_fields = _slicedToArray(sort_fields, 1),
          _sort_fields$ = _sort_fields[0];

      _sort_fields$ = _sort_fields$ === void 0 ? {} : _sort_fields$;
      var _sort_fields$$field = _sort_fields$.field,
          firstSortField = _sort_fields$$field === void 0 ? null : _sort_fields$$field; // If not multiple options, just sort on the only sort field available.
      // Whether is a single item in sort_fields list or the field/key of column (if no sort_fields).

      sortByField(firstSortField || field);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          columnDefinition = _this$props7.columnDefinition,
          _this$props7$active = _this$props7.active,
          active = _this$props7$active === void 0 ? null : _this$props7$active,
          _this$props7$sortMap = _this$props7.sortMap,
          sortMap = _this$props7$sortMap === void 0 ? null : _this$props7$sortMap,
          _this$props7$showingS = _this$props7.showingSortOptionsMenu,
          showingSortOptionsMenu = _this$props7$showingS === void 0 ? false : _this$props7$showingS,
          _this$props7$isLoadin = _this$props7.isLoading,
          isLoading = _this$props7$isLoadin === void 0 ? false : _this$props7$isLoadin;
      var field = columnDefinition.field,
          _columnDefinition$sor = columnDefinition.sort_fields,
          sort_fields = _columnDefinition$sor === void 0 ? [] : _columnDefinition$sor;

      if (typeof field !== 'string' || field.length === 0) {
        return null;
      }

      var hasMultipleSortOptions = sort_fields.length >= 2;

      var _ref14 = sortMap || {},
          _ref14$direction = _ref14.direction,
          sortDirection = _ref14$direction === void 0 ? 'asc' : _ref14$direction,
          _ref14$index = _ref14.index,
          sortIndex = _ref14$index === void 0 ? 0 : _ref14$index,
          _ref14$total = _ref14.total,
          sortTotal = _ref14$total === void 0 ? 1 : _ref14$total;

      var sequence = sortMap && sortTotal > 1 ? sortIndex + 1 : null;
      var cls = (sortMap ? 'active ' : '') + (hasMultipleSortOptions ? 'multiple-sort-options ' : '') + 'column-sort-icon';
      var tooltip = null;

      if (showingSortOptionsMenu) {
        tooltip = "Close sort options";
      } else if (hasMultipleSortOptions && sortMap) {
        var found = sort_fields.find(function (_ref15) {
          var field = _ref15.field;
          return field === sortMap.field;
        });
        tooltip = found ? "Sorted by <span class=\"text-600\">".concat(found.title || found.field, "</span>") : null;
      } else if (hasMultipleSortOptions) {
        tooltip = "" + sort_fields.length + " sort options";
      }

      return /*#__PURE__*/React.createElement("span", {
        className: cls,
        onClick: this.onIconClick,
        "data-tip": tooltip,
        "data-html": true
      }, /*#__PURE__*/React.createElement(ColumnSorterIconElement, {
        showingSortOptionsMenu: showingSortOptionsMenu,
        hasMultipleSortOptions: hasMultipleSortOptions,
        isLoading: isLoading,
        sequence: sequence,
        descend: !sortMap || sortMap && sortDirection === 'desc' || false
      }));
    }
  }], [{
    key: "getDescend",
    value: function getDescend(active) {
      if (Array.isArray(active)) {
        return active[0];
      }

      var keys = Object.keys(active);
      return active[keys[0]][0];
    }
  }]);

  return ColumnSorterIcon;
}(React.PureComponent);

_defineProperty(ColumnSorterIcon, "propTypes", {
  'active': PropTypes.any,
  'sortMap': PropTypes.object,
  'columnDefinition': PropTypes.object,
  // See HeadersRow.proptypes.columnDefinitions
  'sortByField': PropTypes.func.isRequired,
  'showingSortOptionsMenu': PropTypes.bool,
  'setShowingSortFieldsFor': PropTypes.func,
  'isLoading': PropTypes.bool
});

_defineProperty(ColumnSorterIcon, "defaultProps", {
  'descend': false
});

function SortOptionsMenuContainer(props) {
  var showingSortFieldsForColumn = props.showingSortFieldsForColumn,
      columnDefinitions = props.columnDefinitions,
      currentSortColumn = props.sortColumn,
      descend = props.sortReverse,
      sortByField = props.sortByField,
      alignedWidths = props.alignedWidths,
      _props$leftOffset = props.leftOffset,
      leftOffset = _props$leftOffset === void 0 ? 0 : _props$leftOffset;

  if (!showingSortFieldsForColumn) {
    return null;
  }

  var activeColumnDefinitionIndex = useMemo(function () {
    var colDefLen = columnDefinitions.length;

    for (var i = 0; i < colDefLen; i++) {
      if (columnDefinitions[i].field === showingSortFieldsForColumn) {
        return i;
      }
    }

    return -1;
  }, [columnDefinitions, showingSortFieldsForColumn]); // Position it under col for which open for in headers row.

  var widthUntilActiveColumnEnd = useMemo(function () {
    var sumWidths = 0;

    for (var i = 0; i <= activeColumnDefinitionIndex; i++) {
      sumWidths += alignedWidths[i];
    }

    return sumWidths;
  }, [alignedWidths, activeColumnDefinitionIndex]);
  var activeColumnDefinition = columnDefinitions[activeColumnDefinitionIndex];
  var sort_fields = activeColumnDefinition.sort_fields; // Account for scrollLeft of searchresults/header; 200 is min width for menu

  var style = {
    left: Math.max(200, widthUntilActiveColumnEnd + leftOffset)
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "headers-columns-dropdown-menu-container"
  }, /*#__PURE__*/React.createElement(SortOptionsMenu, {
    currentSortColumn: currentSortColumn,
    descend: descend,
    sort_fields: sort_fields,
    sortByField: sortByField,
    style: style
  }));
}

var SortOptionsMenu = /*#__PURE__*/React.memo(function (_ref16) {
  var _ref16$header = _ref16.header,
      header = _ref16$header === void 0 ? /*#__PURE__*/React.createElement("h5", {
    className: "dropdown-header mt-0 px-3 pt-03 text-600"
  }, "Sort by") : _ref16$header,
      currentSortColumn = _ref16.currentSortColumn,
      sort_fields = _ref16.sort_fields,
      sortByField = _ref16.sortByField,
      _ref16$descend = _ref16.descend,
      descend = _ref16$descend === void 0 ? false : _ref16$descend,
      _ref16$style = _ref16.style,
      style = _ref16$style === void 0 ? null : _ref16$style;
  var options = sort_fields.map(function (_ref17) {
    var field = _ref17.field,
        _ref17$title = _ref17.title,
        title = _ref17$title === void 0 ? null : _ref17$title;
    // TODO grab title from schemas if not provided.
    var isActive = currentSortColumn === field;
    var cls = "dropdown-item" + " clickable no-highlight no-user-select" + " d-flex align-items-center justify-content-between" + (isActive ? " active" : "");
    var onClick = sortByField.bind(sortByField, field);
    return /*#__PURE__*/React.createElement("div", {
      className: cls,
      key: field,
      onClick: onClick
    }, title || field, !isActive ? null : /*#__PURE__*/React.createElement("i", {
      className: "small icon fas ml-12 icon-arrow-".concat(descend ? "down" : "up")
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "dropdown-menu show",
    style: style
  }, header, options);
});
var ColumnSorterIconElement = /*#__PURE__*/React.memo(function (_ref18) {
  var descend = _ref18.descend,
      showingSortOptionsMenu = _ref18.showingSortOptionsMenu,
      _ref18$isLoading = _ref18.isLoading,
      isLoading = _ref18$isLoading === void 0 ? false : _ref18$isLoading,
      propSequence = _ref18.sequence;

  if (isLoading) {
    return /*#__PURE__*/React.createElement("i", {
      className: "icon icon-fw icon-circle-notch icon-spin fas"
    });
  }

  if (showingSortOptionsMenu) {
    return /*#__PURE__*/React.createElement("i", {
      className: "icon icon-fw icon-times fas"
    });
  }

  var sequence = null;

  if (propSequence && typeof propSequence === 'number') {
    sequence = /*#__PURE__*/React.createElement("sup", null, propSequence);
  }

  if (descend) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "sort-icon icon icon-fw icon-sort-down fas align-top"
    }), sequence);
  } else {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "sort-icon icon icon-fw icon-sort-up fas align-bottom"
    }), sequence);
  }
});
export function flattenColumnsDefinitionsSortFields(columnDefinitions) {
  var allSortFieldsMap = {};

  var allSortFields = _.reduce(columnDefinitions, function (m, colDef) {
    var sort_fields = colDef.sort_fields,
        title = colDef.title,
        field = colDef.field,
        noSort = colDef.noSort,
        initial_sort = colDef.initial_sort,
        type = colDef.type;
    var hasSubFields = sort_fields && Array.isArray(sort_fields) && sort_fields.length > 0;

    if (hasSubFields) {
      sort_fields.forEach(function (_ref19, idx) {
        var subFieldTitle = _ref19.title,
            subField = _ref19.field,
            subInitialSort = _ref19.initial_sort,
            subType = _ref19.type;
        m.push({
          'title': /*#__PURE__*/React.createElement(React.Fragment, null, title, " \xA0/\xA0 ", subFieldTitle),
          'field': subField,
          'parentField': field,
          'hasSubFields': false,
          'noSort': noSort,
          'initial_sort': subInitialSort,
          'type': subType,
          'last': sort_fields.length - 1 === idx
        });
      });
    } else {
      // Exclude field itself if sub-fields are present, assumed that field itself will be a sub-field option
      m.push({
        title: title,
        field: field,
        'parentField': field,
        hasSubFields: hasSubFields,
        noSort: noSort,
        initial_sort: initial_sort,
        type: type
      });
    }

    return m;
  }, []);

  allSortFields.forEach(function (sortField) {
    allSortFieldsMap[sortField.field] = sortField;
  });
  return {
    allSortFields: allSortFields,
    allSortFieldsMap: allSortFieldsMap
  };
}