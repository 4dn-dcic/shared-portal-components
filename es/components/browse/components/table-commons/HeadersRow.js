import _extends from "@babel/runtime/helpers/extends";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
  function HeadersRow(props) {
    var _this2;
    _classCallCheck(this, HeadersRow);
    _this2 = _callSuper(this, HeadersRow, [props]);
    _this2.onWindowClick = _this2.onWindowClick.bind(_this2);
    _this2.setShowingSortFieldsFor = _this2.setShowingSortFieldsFor.bind(_this2);
    _this2.sortByField = _this2.sortByField.bind(_this2);
    _this2.setColumnWidthsFromState = _this2.setColumnWidthsFromState.bind(_this2);
    _this2.onAdjusterDrag = _this2.onAdjusterDrag.bind(_this2);
    _this2.state = {
      'widths': {},
      // Store for temporary column widths used while a header's 'width' edge/grabber is being dragged.
      'showingSortFieldsForColumn': null,
      // Key/field of column for which sort fields/options are being shown.
      'loadingField': null // Current key/field of column for which sorted results are being loaded.
    };

    _this2.memoized = {
      alignedWidths: memoize(HeadersRow.alignedWidths),
      getSortColumnMap: memoize(HeadersRow.getSortColumnMap),
      getRootLoadingField: memoize(HeadersRow.getRootLoadingField),
      flattenColumnsDefinitionsSortFields: memoize(flattenColumnsDefinitionsSortFields),
      getTrimmedColumn: memoize(HeadersRow.getTrimmedColumn)
    };
    return _this2;
  }
  _inherits(HeadersRow, _React$PureComponent);
  return _createClass(HeadersRow, [{
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
      }

      // Unset loading icon
      var _ref2 = _slicedToArray(sortColumns || [], 1),
        _ref2$ = _ref2[0],
        _ref2$2 = _ref2$ === void 0 ? {} : _ref2$,
        _ref2$2$column = _ref2$2.column,
        sortColumn = _ref2$2$column === void 0 ? null : _ref2$2$column,
        _ref2$2$direction = _ref2$2.direction,
        direction = _ref2$2$direction === void 0 ? null : _ref2$2$direction;
      var _ref4 = _slicedToArray(pastSortColumns || [], 1),
        _ref4$ = _ref4[0],
        _ref4$2 = _ref4$ === void 0 ? {} : _ref4$,
        _ref4$2$column = _ref4$2.column,
        pastSortColumn = _ref4$2$column === void 0 ? null : _ref4$2$column,
        _ref4$2$direction = _ref4$2.direction,
        pastDirection = _ref4$2$direction === void 0 ? null : _ref4$2$direction;
      if (loadingField !== null && (sortColumn !== pastSortColumn || direction !== pastDirection)) {
        if (sortColumn === loadingField || this.memoized.getTrimmedColumn(sortColumn) === loadingField) {
          nextState.loadingField = null;
        }
      }

      // Unset dropdown menu if start scrolling horizontally
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
      var _this3 = this;
      setTimeout(function () {
        var showingSortFieldsForColumn = _this3.state.showingSortFieldsForColumn;
        var clickedElement = evt.target;
        var clickedChildOfDropdownMenu = !!findParentElement(clickedElement, function (el) {
          return el.getAttribute("data-showing-sort-fields-for") === showingSortFieldsForColumn;
        });
        if (!clickedChildOfDropdownMenu) {
          _this3.setShowingSortFieldsFor(null);
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
        _ref6$ = _ref6[0],
        _ref6$2 = _ref6$ === void 0 ? {} : _ref6$,
        _ref6$2$column = _ref6$2.column,
        column = _ref6$2$column === void 0 ? null : _ref6$2$column,
        _ref6$2$direction = _ref6$2.direction,
        direction = _ref6$2$direction === void 0 ? "desc" : _ref6$2$direction;
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
      var _this4 = this;
      raf(function () {
        var _this4$props = _this4.props,
          setColumnWidths = _this4$props.setColumnWidths,
          columnWidths = _this4$props.columnWidths;
        var widths = _this4.state.widths;
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
        stickyFirstColumn = _this$props3$stickyFi === void 0 ? false : _this$props3$stickyFi,
        context = _this$props3.context;
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
          left: leftOffset
          //transform: "translate3d(" + leftOffset + "px, 0px, 0px)"
        }
      }, columnDefinitions.map(function (columnDefinition, index) {
        var field = columnDefinition.field;
        var width = alignedWidths[index];
        var headerColumn =
        /*#__PURE__*/
        // `props.active` may be undefined, object with more fields, or array where first item is `descending` flag (bool).
        React.createElement(HeadersRowColumn, _extends({}, commonProps, {
          context: context,
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
          return /*#__PURE__*/React.createElement(React.Fragment, {
            key: field
          }, /*#__PURE__*/React.createElement("div", {
            className: "placeholder-column d-none d-lg-block",
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
  'context': PropTypes.object,
  // Can be page context or virtual
  // Passed down from CustomColumnController (if used)
  'columnWidths': PropTypes.objectOf(PropTypes.number),
  'setColumnWidths': PropTypes.func,
  // Passed down from SortController (if used)
  'sortColumns': PropTypes.arrayOf(PropTypes.shape({
    'column': PropTypes.string,
    'direction': PropTypes.string
  })),
  'sortBy': PropTypes.func
});
_defineProperty(HeadersRow, "defaultProps", {
  'defaultMinColumnWidth': 55,
  'tableContainerScrollLeft': 0
});
var HeadersRowColumn = /*#__PURE__*/function (_React$PureComponent2) {
  function HeadersRowColumn(props) {
    var _this5;
    _classCallCheck(this, HeadersRowColumn);
    _this5 = _callSuper(this, HeadersRowColumn, [props]);
    _this5.onDrag = _this5.onDrag.bind(_this5);
    _this5.onStop = _this5.onStop.bind(_this5);
    _this5.memoized = {
      showTooltip: memoize(function (colWidth, titleStr) {
        return (colWidth - 40) / 7 < (titleStr || "").length;
      })
    };
    _this5.widthAdjustNodeRef = /*#__PURE__*/React.createRef();
    return _this5;
  }

  /** Updates HeadersRow.state.widths {Object<string,numer>} */
  _inherits(HeadersRowColumn, _React$PureComponent2);
  return _createClass(HeadersRowColumn, [{
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
        index = _this$props5.index,
        context = _this$props5.context;
      var noSort = columnDefinition.noSort,
        colTitle = columnDefinition.colTitle,
        title = columnDefinition.title,
        field = columnDefinition.field,
        _columnDefinition$des = columnDefinition.description,
        description = _columnDefinition$des === void 0 ? null : _columnDefinition$des,
        hideTooltip = columnDefinition.hideTooltip;

      // Wanted more flexibility here, so am injecting some props into the title if it is a React component
      // TODO: May make sense to eventually have a proper titleRender function like for column rendering in future if
      // more parentProps are needed...
      var showTitle;

      // Check if colTitle is a React component (function or class)
      var isComponent = typeof (colTitle === null || colTitle === void 0 ? void 0 : colTitle.type) === 'function';
      // Double check we're not overwriting context passed in elsewhere
      if (isComponent && !('context' in colTitle.props)) {
        // Clone and pass along values from parent that might be useful if not present
        showTitle = /*#__PURE__*/React.cloneElement(colTitle, {
          context: context
        });
      } else {
        // Could be a DOM element or a string, return as-is
        showTitle = colTitle || title;
      }
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
        "data-tip": hideTooltip ? null : tooltip,
        "data-html": true
      }, showTitle)), sorterIcon), typeof onAdjusterDrag === "function" ? /*#__PURE__*/React.createElement(Draggable, {
        position: {
          x: width,
          y: 0
        },
        axis: "x",
        nodeRef: this.widthAdjustNodeRef,
        onDrag: this.onDrag,
        onStop: this.onStop
      }, /*#__PURE__*/React.createElement("div", {
        className: "width-adjuster",
        ref: this.widthAdjustNodeRef
      })) : null);
    }
  }]);
}(React.PureComponent);
var ColumnSorterIcon = /*#__PURE__*/function (_React$PureComponent3) {
  function ColumnSorterIcon(props) {
    var _this6;
    _classCallCheck(this, ColumnSorterIcon);
    _this6 = _callSuper(this, ColumnSorterIcon, [props]);
    _this6.onIconClick = _this6.onIconClick.bind(_this6);
    _this6.memoized = {
      isActive: memoize(ColumnSorterIcon.isActive)
    };
    return _this6;
  }

  /**
   * Sorts column or opens/closes multisort menu
   * if multiple options.
   *
   * @param {React.SyntheticEvent} e - Click event object.
   */
  _inherits(ColumnSorterIcon, _React$PureComponent3);
  return _createClass(ColumnSorterIcon, [{
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
        _sort_fields$ = _sort_fields[0],
        _sort_fields$2 = _sort_fields$ === void 0 ? {} : _sort_fields$,
        _sort_fields$2$field = _sort_fields$2.field,
        firstSortField = _sort_fields$2$field === void 0 ? null : _sort_fields$2$field;

      // If not multiple options, just sort on the only sort field available.
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
  }, [columnDefinitions, showingSortFieldsForColumn]);

  // Position it under col for which open for in headers row.
  var widthUntilActiveColumnEnd = useMemo(function () {
    var sumWidths = 0;
    for (var i = 0; i <= activeColumnDefinitionIndex; i++) {
      sumWidths += alignedWidths[i];
    }
    return sumWidths;
  }, [alignedWidths, activeColumnDefinitionIndex]);
  var activeColumnDefinition = columnDefinitions[activeColumnDefinitionIndex];
  var sort_fields = activeColumnDefinition.sort_fields;
  // Account for scrollLeft of searchresults/header; 200 is min width for menu
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
      className: "small icon fas ms-12 icon-arrow-".concat(descend ? "down" : "up")
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