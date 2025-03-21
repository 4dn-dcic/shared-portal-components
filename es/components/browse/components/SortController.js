import _extends from "@babel/runtime/helpers/extends";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["query"],
  _excluded2 = ["children", "context"];
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
import React, { useCallback } from 'react';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'querystring';
import memoize from 'memoize-one';
import _ from 'underscore';
import { navigate as _navigate } from './../../util/navigate';
import { flattenColumnsDefinitionsSortFields, HeadersRow } from './table-commons';
export var SortController = /*#__PURE__*/function (_React$PureComponent) {
  function SortController(props) {
    var _this2;
    _classCallCheck(this, SortController);
    _this2 = _callSuper(this, SortController, [props]);
    _this2.sortBy = _this2.sortBy.bind(_this2);
    _this2.state = {
      'changingPage': false
    }; // 'changingPage' = historical name, analogous of 'loading'

    _this2.memoized = {
      getSortColumnAndOrderPairs: memoize(MultiColumnSortSelector.getSortColumnAndOrderPairs)
    };
    return _this2;
  }

  /**
   * Handles both `href` and `requestedCompoundFilterSet`, will prioritize
   * operating with just `href` if present and allowing VirtualHrefController
   * to make into POST request if needed. Else will operate w. `requestedCompoundFilterSet`
   * for compound filter-blocks requests.
   */
  _inherits(SortController, _React$PureComponent);
  return _createClass(SortController, [{
    key: "sortBy",
    value: function sortBy(sortingPairs, callback) {
      var _this3 = this;
      var _this$props = this.props,
        propNavigate = _this$props.navigate,
        _this$props$href = _this$props.href,
        currSearchHref = _this$props$href === void 0 ? null : _this$props$href,
        _this$props$requested = _this$props.requestedCompoundFilterSet,
        requestedCompoundFilterSet = _this$props$requested === void 0 ? null : _this$props$requested;
      var hrefSourceWithSort = null;
      if (currSearchHref) {
        hrefSourceWithSort = currSearchHref;
      } else if (requestedCompoundFilterSet) {
        // For compound filter sets, we keep `sort` URL param in `global_flags` at moment.
        hrefSourceWithSort = "?" + requestedCompoundFilterSet.global_flags || "";
      } else {
        throw new Error("SortController doesn't have `props.href` nor `requestedCompoundFilterSet`.");
      }
      this.setState({
        'changingPage': true
      }, function () {
        var _url$parse = url.parse(hrefSourceWithSort, true),
          query = _url$parse.query,
          urlParts = _objectWithoutProperties(_url$parse, _excluded);
        var useSortPairs = sortingPairs.slice();
        var sortingPairsLen = sortingPairs.length;
        // Exclude last empty column (null column)
        if (sortingPairsLen > 0 && sortingPairs[sortingPairsLen - 1].column === null) {
          useSortPairs.pop();
        }
        query.sort = useSortPairs.map(function (_ref) {
          var column = _ref.column,
            direction = _ref.direction;
          return (direction === 'desc' ? '-' : '') + column;
        });
        var stringifiedNextQuery = queryString.stringify(query);
        var navTarget = null;
        if (currSearchHref) {
          // Using search href
          urlParts.search = '?' + stringifiedNextQuery;
          navTarget = url.format(urlParts);
        } else if (requestedCompoundFilterSet) {
          // Using /compound_search POST requests
          navTarget = _objectSpread(_objectSpread({}, requestedCompoundFilterSet), {}, {
            "global_flags": stringifiedNextQuery
          });
        } else {
          throw new Error("SortController doesn't have `props.href` nor `requestedCompoundFilterSet`.");
        }
        propNavigate(navTarget, {
          'replace': true
        }, function () {
          _this3.setState({
            'changingPage': false
          }, callback);
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        children = _this$props2.children,
        context = _this$props2.context,
        passProps = _objectWithoutProperties(_this$props2, _excluded2);
      var _ref2$sort = (context || {}).sort,
        sort = _ref2$sort === void 0 ? {} : _ref2$sort;
      var sortColumns = this.memoized.getSortColumnAndOrderPairs(sort);
      var childProps = _objectSpread(_objectSpread({}, passProps), {}, {
        context: context,
        sortColumns: sortColumns,
        sortBy: this.sortBy
      });
      return React.Children.map(children, function (c) {
        if (! /*#__PURE__*/React.isValidElement(c) || typeof c.type === "string") return c;
        return /*#__PURE__*/React.cloneElement(c, childProps);
      });
    }
  }]);
}(React.PureComponent);
_defineProperty(SortController, "propTypes", {
  /** One of 'href' or 'requestedCompoundFilterSet' is required */
  'href': PropTypes.string,
  'requestedCompoundFilterSet': PropTypes.object,
  'context': PropTypes.object,
  'navigate': PropTypes.func,
  'children': PropTypes.node.isRequired
});
_defineProperty(SortController, "defaultProps", {
  'navigate': function navigate(href, options, callback) {
    console.info('Called SortController.props.navigate with:', href, options, callback);
    if (typeof _navigate === 'function') return _navigate.apply(_navigate, arguments);
  }
});
export var MultiColumnSortSelector = /*#__PURE__*/function (_React$PureComponent2) {
  function MultiColumnSortSelector(props) {
    var _this4;
    _classCallCheck(this, MultiColumnSortSelector);
    _this4 = _callSuper(this, MultiColumnSortSelector, [props]);
    _this4.handleSortColumnSelection = _this4.handleSortColumnSelection.bind(_this4);
    _this4.handleSortOrderSelection = _this4.handleSortOrderSelection.bind(_this4);
    _this4.handleSortRowDelete = _this4.handleSortRowDelete.bind(_this4);
    _this4.handleSettingsApply = _this4.handleSettingsApply.bind(_this4);
    _this4.memoized = {
      flattenColumnsDefinitionsSortFields: memoize(flattenColumnsDefinitionsSortFields)
    };
    var _props$sortColumns = props.sortColumns,
      sortColumns = _props$sortColumns === void 0 ? [] : _props$sortColumns;
    _this4.state = {
      /** @type {{ column: string, direction: "asc"|"desc" }[]} */
      'sortingPairs': [].concat(_toConsumableArray(sortColumns), [{
        'column': null,
        'direction': 'asc'
      }])
    };
    return _this4;
  }
  _inherits(MultiColumnSortSelector, _React$PureComponent2);
  return _createClass(MultiColumnSortSelector, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var _pastProps$sortColumn = pastProps.sortColumns,
        pastSortColumns = _pastProps$sortColumn === void 0 ? [] : _pastProps$sortColumn;
      var _this$props$sortColum = this.props.sortColumns,
        sortColumns = _this$props$sortColum === void 0 ? [] : _this$props$sortColum;
      if (sortColumns !== pastSortColumns) {
        this.setState({
          'sortingPairs': [].concat(_toConsumableArray(sortColumns), [{
            'column': null,
            'direction': 'asc'
          }])
        });
      }
    }
  }, {
    key: "handleSortColumnSelection",
    value: function handleSortColumnSelection(eventKey) {
      this.setState(function (_ref3) {
        var existingPairs = _ref3.sortingPairs;
        var sortingPairs = existingPairs.slice(0);
        var _eventKey$split = eventKey.split('|'),
          _eventKey$split2 = _slicedToArray(_eventKey$split, 2),
          sIndex = _eventKey$split2[0],
          column = _eventKey$split2[1];
        var index = parseInt(sIndex);
        sortingPairs[index].column = column;

        // add new empty row if last is selected
        if (index === sortingPairs.length - 1) {
          sortingPairs.push({
            'column': null,
            'direction': 'asc'
          });
        }
        return {
          sortingPairs: sortingPairs
        };
      });
    }
  }, {
    key: "handleSortOrderSelection",
    value: function handleSortOrderSelection(eventKey) {
      this.setState(function (_ref4) {
        var existingPairs = _ref4.sortingPairs;
        var sortingPairs = existingPairs.slice(0);
        var _eventKey$split3 = eventKey.split('|'),
          _eventKey$split4 = _slicedToArray(_eventKey$split3, 2),
          sIndex = _eventKey$split4[0],
          direction = _eventKey$split4[1];
        var index = parseInt(sIndex);
        sortingPairs[index].direction = direction;
        return {
          sortingPairs: sortingPairs
        };
      });
    }
  }, {
    key: "handleSortRowDelete",
    value: function handleSortRowDelete(indexToDelete) {
      this.setState(function (_ref5) {
        var existingPairs = _ref5.sortingPairs;
        var sortingPairs = existingPairs.slice(0);
        sortingPairs.splice(indexToDelete, 1);
        return {
          sortingPairs: sortingPairs
        };
      });
    }
  }, {
    key: "handleSettingsApply",
    value: function handleSettingsApply() {
      var _this$props3 = this.props,
        sortBy = _this$props3.sortBy,
        onClose = _this$props3.onClose;
      var sortingPairs = this.state.sortingPairs;
      sortBy(sortingPairs, function () {
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
        columnDefinitions = _this$props4.columnDefinitions,
        size = _this$props4.size,
        variant = _this$props4.variant;
      var sortingPairs = this.state.sortingPairs;

      // columnDefinitions are passed as empty arrays when table displays "No Results", so we hide dropdowns
      if (!Array.isArray(columnDefinitions) || !columnDefinitions.length) {
        return null;
      }
      var _this$memoized$flatte = this.memoized.flattenColumnsDefinitionsSortFields(columnDefinitions),
        allSortFields = _this$memoized$flatte.allSortFields,
        allSortFieldsMap = _this$memoized$flatte.allSortFieldsMap;
      var commonProps = {
        allSortFields: allSortFields,
        allSortFieldsMap: allSortFieldsMap,
        size: size,
        variant: variant,
        "rowCount": sortingPairs.length,
        "handleSortColumnSelection": this.handleSortColumnSelection,
        "handleSortOrderSelection": this.handleSortOrderSelection,
        "handleSortRowDelete": this.handleSortRowDelete,
        "handleSettingsApply": this.handleSettingsApply
      };
      return /*#__PURE__*/React.createElement("div", {
        className: "mb-1"
      }, sortingPairs.map(function (pair, index) {
        return /*#__PURE__*/React.createElement(MultiColumnSortOption, _extends({}, commonProps, pair, {
          index: index,
          key: index
        }));
      }));
    }
  }], [{
    key: "getSortColumnAndOrderPairs",
    value:
    /**
     * @param {Object.<string, { order: string }>} sortColumns The "sort" property of search response or `context`, keyed by field.
     * @returns {[ string, "desc" | "asc"][]} Array of [field_name, direction ("asc"/"desc")] tuples
     */
    function getSortColumnAndOrderPairs(sortColumns) {
      var colNames = Object.keys(sortColumns).filter(function (sortKey) {
        return sortKey !== 'label' && sortKey !== '_score';
      });
      var columns = colNames.map(function (colName) {
        // N.B.: "order" is returned from context / search response; we rename it to "direction" here
        return {
          'column': colName,
          'direction': sortColumns[colName].order || "desc"
        };
      });
      return columns;
    }
  }]);
}(React.PureComponent);
MultiColumnSortSelector.propTypes = {
  'columnDefinitions': PropTypes.arrayOf(PropTypes.object).isRequired,
  'sortColumns': PropTypes.array.isRequired,
  'onClose': PropTypes.func,
  'sortBy': PropTypes.func.isRequired,
  'size': PropTypes.string,
  'variant': PropTypes.string
};
var MultiColumnSortOption = /*#__PURE__*/React.memo(function (props) {
  var allSortFields = props.allSortFields,
    allSortFieldsMap = props.allSortFieldsMap,
    rowCount = props.rowCount,
    column = props.column,
    direction = props.direction,
    index = props.index,
    handleSortColumnSelection = props.handleSortColumnSelection,
    handleSortOrderSelection = props.handleSortOrderSelection,
    handleSortRowDelete = props.handleSortRowDelete,
    handleSettingsApply = props.handleSettingsApply,
    _props$variant = props.variant,
    variant = _props$variant === void 0 ? "outline-secondary" : _props$variant,
    _props$size = props.size,
    size = _props$size === void 0 ? "sm" : _props$size;
  var title = null;
  if (column === null) {
    title = "Select a column to sort";
  } else {
    var useCol = HeadersRow.getTrimmedColumn(column);
    var foundSortDefinition = allSortFieldsMap[useCol];
    if (foundSortDefinition) {
      // eslint-disable-next-line prefer-destructuring
      title = foundSortDefinition.title;
    } else {
      title = /*#__PURE__*/React.createElement("span", {
        className: "font-monospace small"
      }, useCol);
    }
  }
  var sortOrderTitle = direction !== 'desc' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "d-lg-none"
  }, "ASC"), /*#__PURE__*/React.createElement("span", {
    className: "d-none d-lg-inline"
  }, "Ascending")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "d-lg-none"
  }, "DESC"), /*#__PURE__*/React.createElement("span", {
    className: "d-none d-lg-inline"
  }, "Descending"));
  var onRemoveClick = useCallback(function (e) {
    e.preventDefault();
    e.stopPropagation();
    handleSortRowDelete(index);
  }, [index, handleSortRowDelete]);
  return /*#__PURE__*/React.createElement("div", {
    className: "row mt-1 multi-column-sort"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-8 col-7"
  }, /*#__PURE__*/React.createElement(DropdownButton, {
    title: title,
    size: size,
    variant: (variant ? variant + " " : "") + "w-100 text-start",
    onSelect: handleSortColumnSelection
  }, allSortFields.map(function (col, idx) {
    var field = col.field,
      title = col.title,
      hasSubFields = col.hasSubFields,
      noSort = col.noSort;
    return !hasSubFields ? /*#__PURE__*/React.createElement(DropdownItem, {
      key: "sort-column-" + idx,
      eventKey: index + '|' + field,
      active: field === column,
      disabled: !!noSort
    }, title) : null;
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-3 ps-0"
  }, /*#__PURE__*/React.createElement(DropdownButton, {
    title: sortOrderTitle,
    variant: (variant ? variant + " " : "") + "w-100 text-start",
    size: size,
    onSelect: handleSortOrderSelection
  }, /*#__PURE__*/React.createElement(DropdownItem, {
    key: "sort-direction-asc",
    eventKey: index + "|asc"
  }, "Ascending"), /*#__PURE__*/React.createElement(DropdownItem, {
    key: "sort-direction-desc",
    eventKey: index + "|desc"
  }, "Descending"))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-1 col-2 ps-0"
  }, !(rowCount - 1 === index) ? /*#__PURE__*/React.createElement("div", {
    className: "d-grid gap-1"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-".concat(variant, " btn-").concat(size),
    onClick: onRemoveClick,
    "data-tip": "Remove sort column"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-minus w-100"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "d-grid gap-1"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary btn-".concat(size),
    onClick: handleSettingsApply,
    "data-tip": "Re-sort columns"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-check w-100"
  })))));
});