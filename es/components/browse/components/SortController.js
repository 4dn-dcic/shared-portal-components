'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import PropTypes from 'prop-types';
import url from 'url';
import queryString from 'querystring';
import memoize from 'memoize-one';
import _ from 'underscore';
import { navigate as _navigate } from './../../util/navigate';
export var SortController = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SortController, _React$PureComponent);

  var _super = _createSuper(SortController);

  _createClass(SortController, null, [{
    key: "getSortColumnAndReverseFromContext",
    value: function getSortColumnAndReverseFromContext(context) {
      var defaults = {
        'sortColumn': null,
        'sortReverse': false
      };
      if (!context || !context.sort) return defaults;
      var sortKey = Object.keys(context.sort);

      if (sortKey.length > 0) {
        // Use first if multiple.
        // eslint-disable-next-line prefer-destructuring
        sortKey = sortKey[0];
      } else {
        return defaults;
      }

      var reverse = context.sort[sortKey].order === 'desc';
      return {
        'sortColumn': sortKey,
        'sortReverse': reverse
      };
    }
  }]);

  function SortController(props) {
    var _this;

    _classCallCheck(this, SortController);

    _this = _super.call(this, props);
    _this.sortBy = _this.sortBy.bind(_assertThisInitialized(_this));
    _this.state = {
      'changingPage': false
    }; // 'changingPage' = historical name, analogous of 'loading'

    _this.memoized = {
      getSortColumnAndReverseFromContext: memoize(SortController.getSortColumnAndReverseFromContext)
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
    value: function sortBy(key, reverse) {
      var _this2 = this;

      var _this$props = this.props,
          propNavigate = _this$props.navigate,
          _this$props$href = _this$props.href,
          currSearchHref = _this$props$href === void 0 ? null : _this$props$href,
          _this$props$requested = _this$props.requestedCompoundFilterSet,
          requestedCompoundFilterSet = _this$props$requested === void 0 ? null : _this$props$requested;
      var href = null;

      if (currSearchHref) {
        href = currSearchHref;
      } else if (requestedCompoundFilterSet) {
        href = "?" + requestedCompoundFilterSet.global_flags || "";
      } else {
        throw new Error("SortController doesn't have `props.href` nor `requestedCompoundFilterSet`.");
      }

      if (typeof propNavigate !== 'function') throw new Error("No navigate function.");
      if (typeof href !== 'string') throw new Error("Browse doesn't have props.href.");
      this.setState({
        'changingPage': true
      }, function () {
        var _url$parse = url.parse(href, true),
            query = _url$parse.query,
            urlParts = _objectWithoutProperties(_url$parse, ["query"]);

        if (key) {
          query.sort = (reverse ? '-' : '') + key;
        } else {
          delete query.sort;
        }

        var stringifiedNextQuery = queryString.stringify(query);
        var navTarget = null;

        if (currSearchHref) {
          urlParts.search = '?' + queryString.stringify(query);
          navTarget = url.format(urlParts);
        } else if (requestedCompoundFilterSet) {
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
          });
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          context = _this$props2.context,
          passProps = _objectWithoutProperties(_this$props2, ["children", "context"]);

      var _this$memoized$getSor = this.memoized.getSortColumnAndReverseFromContext(context),
          sortColumn = _this$memoized$getSor.sortColumn,
          sortReverse = _this$memoized$getSor.sortReverse;

      var childProps = _objectSpread(_objectSpread({}, passProps), {}, {
        context: context,
        sortColumn: sortColumn,
        sortReverse: sortReverse,
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

export var MultisortColumnSelector = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(MultisortColumnSelector, _React$PureComponent2);

  var _super2 = _createSuper(MultisortColumnSelector);

  function MultisortColumnSelector(props) {
    var _this3;

    _classCallCheck(this, MultisortColumnSelector);

    _this3 = _super2.call(this, props);
    _this3.handleSortColumnSelection = _this3.handleSortColumnSelection.bind(_assertThisInitialized(_this3));
    _this3.handleSortOrderSelection = _this3.handleSortOrderSelection.bind(_assertThisInitialized(_this3));
    _this3.handleSortRowDelete = _this3.handleSortRowDelete.bind(_assertThisInitialized(_this3));
    _this3.handleSettingsApply = _this3.handleSettingsApply.bind(_assertThisInitialized(_this3));
    var _props$sortColumns = props.sortColumns,
        sortColumns = _props$sortColumns === void 0 ? {} : _props$sortColumns;

    var colNames = _.filter(_.keys(sortColumns), function (sortKey) {
      return sortKey != 'label';
    });

    var columns = colNames.map(function (colName) {
      var order = sortColumns[colName].order === 'asc' ? 'asc' : 'desc';
      return {
        'name': colName,
        'order': order
      };
    });
    columns.push({
      'name': null,
      order: 'asc'
    });
    _this3.state = {
      'sortColumns': columns
    };
    return _this3;
  }

  _createClass(MultisortColumnSelector, [{
    key: "handleSortColumnSelection",
    value: function handleSortColumnSelection(evt) {
      var sortColumns = this.state.sortColumns;
      var newSortColumns = sortColumns.slice(0);

      var _evt$split = evt.split('|'),
          _evt$split2 = _slicedToArray(_evt$split, 2),
          sIndex = _evt$split2[0],
          name = _evt$split2[1];

      var index = parseInt(sIndex);
      newSortColumns[index].name = name; //add new empty row if last is selected

      if (index === sortColumns.length - 1) {
        newSortColumns.push({
          'name': null,
          'order': 'asc'
        });
      }

      this.setState({
        'sortColumns': newSortColumns
      });
    }
  }, {
    key: "handleSortOrderSelection",
    value: function handleSortOrderSelection(evt) {
      var sortColumns = this.state.sortColumns;
      var newSortColumns = sortColumns.slice(0);

      var _evt$split3 = evt.split('|'),
          _evt$split4 = _slicedToArray(_evt$split3, 2),
          sIndex = _evt$split4[0],
          order = _evt$split4[1];

      var index = parseInt(sIndex);
      newSortColumns[index].order = order;
      this.setState({
        'sortColumns': newSortColumns
      });
    }
  }, {
    key: "handleSortRowDelete",
    value: function handleSortRowDelete(index) {
      var sortColumns = this.state.sortColumns;
      var newSortColumns = sortColumns.slice(0);
      newSortColumns.splice(index, 1);
      this.setState({
        'sortColumns': newSortColumns
      });
    }
  }, {
    key: "handleSettingsApply",
    value: function handleSettingsApply() {
      var _this$props3 = this.props,
          propNavigate = _this$props3.navigate,
          currSearchHref = _this$props3.href,
          onClose = _this$props3.onClose;
      var sortColumns = this.state.sortColumns;
      if (typeof propNavigate !== 'function') throw new Error("No navigate function.");
      if (typeof currSearchHref !== 'string') throw new Error("Browse/Search doesn't have props.href.");

      var _url$parse2 = url.parse(currSearchHref, true),
          query = _url$parse2.query,
          urlParts = _objectWithoutProperties(_url$parse2, ["query"]);

      query.sort = _.filter(sortColumns, function (col) {
        return col.name;
      }).map(function (col) {
        return (col.order === 'desc' ? '-' : '') + col.name;
      });
      urlParts.search = '?' + queryString.stringify(query);
      var navTarget = url.format(urlParts);
      propNavigate(navTarget, {
        'replace': true
      }, function () {
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var columnDefinitions = this.props.columnDefinitions;
      var sortColumns = this.state.sortColumns;
      return /*#__PURE__*/React.createElement("div", {
        className: "row clearfix"
      }, sortColumns.map(function (col, idx, all) {
        return /*#__PURE__*/React.createElement(MultisortOption, _extends({}, col, {
          key: col.name || idx,
          allColumns: columnDefinitions,
          allSortColumns: all,
          index: idx,
          handleOptionVisibilityChange: _this4.handleOptionVisibilityChange,
          handleSortColumnSelection: _this4.handleSortColumnSelection,
          handleSortOrderSelection: _this4.handleSortOrderSelection,
          handleSortRowDelete: _this4.handleSortRowDelete,
          handleSettingsApply: _this4.handleSettingsApply
        }));
      }));
    }
  }]);

  return MultisortColumnSelector;
}(React.PureComponent);
MultisortColumnSelector.propTypes = {
  'columnDefinitions': PropTypes.object.isRequired,
  'sortColumns': PropTypes.object
};
var MultisortOption = /*#__PURE__*/React.memo(function (props) {
  var allColumns = props.allColumns,
      allSortColumns = props.allSortColumns,
      name = props.name,
      order = props.order,
      index = props.index,
      handleSortColumnSelection = props.handleSortColumnSelection,
      handleSortOrderSelection = props.handleSortOrderSelection,
      handleSortRowDelete = props.handleSortRowDelete,
      handleSettingsApply = props.handleSettingsApply;

  var found = _.find(allColumns, function (item) {
    return item.field === name;
  });

  var isLastRow = allSortColumns.length - 1 === index;
  return /*#__PURE__*/React.createElement("div", {
    className: "row col-12 mt-1 multisort-column clearfix",
    key: name,
    "data-tip": "",
    "data-html": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-8"
  }, /*#__PURE__*/React.createElement(DropdownButton, {
    className: "btn-block",
    title: found ? found.title : "Select a column to sort",
    variant: "outline-secondary",
    size: "sm",
    onSelect: handleSortColumnSelection
  }, allColumns.map(function (col, idx) {
    return /*#__PURE__*/React.createElement(DropdownItem, {
      key: "sort-column-" + idx,
      eventKey: index + '|' + col.field,
      active: col.field === name
    }, col.title);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement(DropdownButton, {
    className: "btn-block",
    title: order !== 'desc' ? 'Ascending' : 'Descending',
    variant: "outline-secondary",
    size: "sm",
    onSelect: handleSortOrderSelection
  }, /*#__PURE__*/React.createElement(DropdownItem, {
    key: "sort-order-asc",
    eventKey: index + "|asc"
  }, "Ascending"), /*#__PURE__*/React.createElement(DropdownItem, {
    key: "sort-order-desc",
    eventKey: index + "|desc"
  }, "Descending"))), /*#__PURE__*/React.createElement("div", {
    className: "col-2"
  }, !isLastRow ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-secondary btn-sm",
    onClick: function onClick() {
      return handleSortRowDelete(index);
    },
    "data-tip": "Remove sort column"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-minus"
  })) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary btn-sm",
    onClick: handleSettingsApply,
    "data-tip": "Save sorting settings"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-fw fas icon-check"
  }))));
});