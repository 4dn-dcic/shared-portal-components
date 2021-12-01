'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _excluded = ["query"],
    _excluded2 = ["children", "context"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
  _inherits(SortController, _React$PureComponent);

  var _super = _createSuper(SortController);

  function SortController(props) {
    var _this;

    _classCallCheck(this, SortController);

    _this = _super.call(this, props);
    _this.sortBy = _this.sortBy.bind(_assertThisInitialized(_this));
    _this.state = {
      'changingPage': false
    }; // 'changingPage' = historical name, analogous of 'loading'

    _this.memoized = {
      getSortColumnAndOrderPairs: memoize(MultiColumnSortSelector.getSortColumnAndOrderPairs)
    };
    return _this;
  }
  /**
   * Handles both `href` and `requestedCompoundFilterSet`, will prioritize
   * operating with just `href` if present and allowing VirtualHrefController
   * to make into POST request if needed. Else will operate w. `requestedCompoundFilterSet`
   * for compound filter-blocks requests.
   */


  _createClass(SortController, [{
    key: "sortBy",
    value: function sortBy(sortingPairs, callback) {
      var _this2 = this;

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
        var sortingPairsLen = sortingPairs.length; // Exclude last empty column (null column)

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
          _this2.setState({
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

  return SortController;
}(React.PureComponent);

_defineProperty(SortController, "propTypes", {
  'href': PropTypes.string.isRequired,
  'context': PropTypes.object.isRequired,
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
  _inherits(MultiColumnSortSelector, _React$PureComponent2);

  var _super2 = _createSuper(MultiColumnSortSelector);

  function MultiColumnSortSelector(props) {
    var _this3;

    _classCallCheck(this, MultiColumnSortSelector);

    _this3 = _super2.call(this, props);
    _this3.handleSortColumnSelection = _this3.handleSortColumnSelection.bind(_assertThisInitialized(_this3));
    _this3.handleSortOrderSelection = _this3.handleSortOrderSelection.bind(_assertThisInitialized(_this3));
    _this3.handleSortRowDelete = _this3.handleSortRowDelete.bind(_assertThisInitialized(_this3));
    _this3.handleSettingsApply = _this3.handleSettingsApply.bind(_assertThisInitialized(_this3));
    _this3.memoized = {
      flattenColumnsDefinitionsSortFields: memoize(flattenColumnsDefinitionsSortFields)
    };
    var _props$sortColumns = props.sortColumns,
        sortColumns = _props$sortColumns === void 0 ? [] : _props$sortColumns;
    _this3.state = {
      /** @type {{ column: string, direction: "asc"|"desc" }[]} */
      'sortingPairs': [].concat(_toConsumableArray(sortColumns), [{
        'column': null,
        'direction': 'asc'
      }])
    };
    return _this3;
  }

  _createClass(MultiColumnSortSelector, [{
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
        sortingPairs[index].column = column; // add new empty row if last is selected

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
      var sortingPairs = this.state.sortingPairs; // columnDefinitions are passed as empty arrays when table displays "No Results", so we hide dropdowns

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

  return MultiColumnSortSelector;
}(React.PureComponent);
MultiColumnSortSelector.propTypes = {
  'columnDefinitions': PropTypes.arrayOf(PropTypes.object).isRequired,
  'sortColumns': PropTypes.object.isRequired,
  'onClose': PropTypes.func.isRequired,
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
        className: "text-monospace small"
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
    className: "col-8"
  }, /*#__PURE__*/React.createElement(DropdownButton, _extends({
    title: title,
    size: size
  }, {
    variant: (variant ? variant + " " : "") + "btn-block text-left",
    onSelect: handleSortColumnSelection
  }), allSortFields.map(function (col, idx) {
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
    className: "col-3 pl-0"
  }, /*#__PURE__*/React.createElement(DropdownButton, {
    title: sortOrderTitle,
    variant: (variant ? variant + " " : "") + "btn-block text-left",
    size: size,
    onSelect: handleSortOrderSelection
  }, /*#__PURE__*/React.createElement(DropdownItem, {
    key: "sort-direction-asc",
    eventKey: index + "|asc"
  }, "Ascending"), /*#__PURE__*/React.createElement(DropdownItem, {
    key: "sort-direction-desc",
    eventKey: index + "|desc"
  }, "Descending"))), /*#__PURE__*/React.createElement("div", {
    className: "col-1 pl-0"
  }, !(rowCount - 1 === index) ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-".concat(variant, " btn-").concat(size, " btn-block"),
    onClick: onRemoveClick,
    "data-tip": "Remove sort column"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-minus w-100"
  })) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary btn-".concat(size, " btn-block"),
    onClick: handleSettingsApply,
    "data-tip": "Re-sort columns"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-check w-100"
  }))));
});