import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["children", "hiddenColumns", "columnDefinitions", "filterColumnFxn"];
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
import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import { Checkbox } from './../../forms/components/Checkbox';
import { listToObj } from './../../util/object';

/**
 * This component stores an object of `hiddenColumns` in state which contains field names as keys and booleans as values.
 * This, along with functions `addHiddenColumn(field: string)` and `removeHiddenColumn(field: string)`, are passed down to
 * this component instance's child component instances.
 *
 * @todo Rename to something better maybe.
 *
 * @prop {Object.<boolean>} [defaultHiddenColumns] - Initial hidden columns state object, if any.
 */
export var CustomColumnController = /*#__PURE__*/function (_React$Component) {
  function CustomColumnController(props) {
    var _this2;
    _classCallCheck(this, CustomColumnController);
    _this2 = _callSuper(this, CustomColumnController, [props]);
    //this.getResetWidths = this.getResetWidths.bind(this);
    _this2.setColumnWidths = _this2.setColumnWidths.bind(_this2);
    _this2.addHiddenColumn = _this2.addHiddenColumn.bind(_this2);
    _this2.removeHiddenColumn = _this2.removeHiddenColumn.bind(_this2);
    _this2.memoized = {
      hiddenColsListToObj: memoize(listToObj),
      filterOutStateHiddenCols: memoize(CustomColumnController.filterOutHiddenCols),
      filterOutPropHiddenCols: memoize(CustomColumnController.filterOutHiddenCols)
    };
    _this2.state = {
      'hiddenColumns': props.defaultHiddenColumns ? _objectSpread({}, props.defaultHiddenColumns) : {},
      'columnWidths': {}
    };
    return _this2;
  }
  _inherits(CustomColumnController, _React$Component);
  return _createClass(CustomColumnController, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var defaultHiddenColumns = this.props.defaultHiddenColumns;
      var hiddenColumns = this.state.hiddenColumns;
      if (pastProps.defaultHiddenColumns !== defaultHiddenColumns) {
        this.setState({
          "hiddenColumns": _.clone(defaultHiddenColumns || {})
        }); // Reset state.hiddenColumns.
        return;
      }
      if (hiddenColumns !== pastState.hiddenColumns) {
        setTimeout(ReactTooltip.rebuild, 0);
      }
    }
  }, {
    key: "setColumnWidths",
    value: function setColumnWidths(columnWidths) {
      this.setState({
        columnWidths: columnWidths
      });
    }
  }, {
    key: "addHiddenColumn",
    value: function addHiddenColumn(field) {
      this.setState(function (_ref) {
        var currHiddenColumns = _ref.hiddenColumns;
        if (currHiddenColumns[field] === true) {
          return null;
        }
        return {
          hiddenColumns: _objectSpread(_objectSpread({}, currHiddenColumns), {}, _defineProperty({}, field, true))
        };
      });
    }
  }, {
    key: "removeHiddenColumn",
    value: function removeHiddenColumn(field) {
      this.setState(function (_ref2) {
        var currHiddenColumns = _ref2.hiddenColumns;
        if (currHiddenColumns[field] === false) {
          return null;
        }
        var hiddenColumns = _objectSpread({}, currHiddenColumns);
        delete hiddenColumns[field];
        return {
          hiddenColumns: hiddenColumns
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        children = _this$props.children,
        _this$props$hiddenCol = _this$props.hiddenColumns,
        alwaysHiddenColsList = _this$props$hiddenCol === void 0 ? [] : _this$props$hiddenCol,
        allColumnDefinitions = _this$props.columnDefinitions,
        filterColumnFxn = _this$props.filterColumnFxn,
        remainingProps = _objectWithoutProperties(_this$props, _excluded);
      var _this$state = this.state,
        hiddenColumns = _this$state.hiddenColumns,
        columnWidths = _this$state.columnWidths;
      if (! /*#__PURE__*/React.isValidElement(children)) {
        throw new Error('CustomColumnController expects props.children to be a valid React component instance.');
      }
      var alwaysHiddenCols = Array.isArray(alwaysHiddenColsList) ? this.memoized.hiddenColsListToObj(alwaysHiddenColsList) : null;
      var columnDefinitions = this.memoized.filterOutPropHiddenCols(allColumnDefinitions, alwaysHiddenCols, filterColumnFxn);
      var visibleColumnDefinitions = this.memoized.filterOutStateHiddenCols(columnDefinitions, hiddenColumns);
      var propsToPass = _objectSpread(_objectSpread({}, remainingProps), {}, {
        hiddenColumns: hiddenColumns,
        columnDefinitions: columnDefinitions,
        visibleColumnDefinitions: visibleColumnDefinitions,
        columnWidths: columnWidths,
        'setColumnWidths': this.setColumnWidths,
        'addHiddenColumn': this.addHiddenColumn,
        'removeHiddenColumn': this.removeHiddenColumn
      });
      return React.Children.map(children, function (child) {
        return /*#__PURE__*/React.cloneElement(child, propsToPass);
      });
    }
  }], [{
    key: "filterOutHiddenCols",
    value: function filterOutHiddenCols(columnDefinitions) {
      var hiddenColumns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var filterColumnFxn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (hiddenColumns || typeof filterColumnFxn === "function") {
        return columnDefinitions.filter(function (colDef, i, a) {
          if (hiddenColumns && hiddenColumns[colDef.field] === true) {
            return false;
          }
          if (typeof filterColumnFxn === "function") {
            return filterColumnFxn(colDef, i, a);
          }
          return true;
        });
      }
      return columnDefinitions;
    }
  }]);
}(React.Component);
_defineProperty(CustomColumnController, "propTypes", {
  "children": PropTypes.element,
  "columnDefinitions": PropTypes.arrayOf(PropTypes.shape({
    'field': PropTypes.string
  })),
  "defaultHiddenColumns": PropTypes.object
});
export var CustomColumnSelector = /*#__PURE__*/function (_React$PureComponent) {
  function CustomColumnSelector(props) {
    var _this3;
    _classCallCheck(this, CustomColumnSelector);
    _this3 = _callSuper(this, CustomColumnSelector, [props]);
    _this3.handleOptionVisibilityChange = _.throttle(_this3.handleOptionVisibilityChange.bind(_this3), 300);
    _this3.memoized = {
      columnDefinitionsWithHiddenState: memoize(CustomColumnSelector.columnDefinitionsWithHiddenState)
    };
    return _this3;
  }
  _inherits(CustomColumnSelector, _React$PureComponent);
  return _createClass(CustomColumnSelector, [{
    key: "handleOptionVisibilityChange",
    value: function handleOptionVisibilityChange(evt) {
      evt.stopPropagation();
      var field = evt.target.value;
      var _this$props2 = this.props,
        hiddenColumns = _this$props2.hiddenColumns,
        removeHiddenColumn = _this$props2.removeHiddenColumn,
        addHiddenColumn = _this$props2.addHiddenColumn;
      if (hiddenColumns[field] === true) {
        removeHiddenColumn(field);
      } else {
        addHiddenColumn(field);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var _this$props3 = this.props,
        columnDefinitions = _this$props3.columnDefinitions,
        hiddenColumns = _this$props3.hiddenColumns;
      return /*#__PURE__*/React.createElement("div", {
        className: "row clearfix"
      }, this.memoized.columnDefinitionsWithHiddenState(columnDefinitions, hiddenColumns).map(function (colDef, idx, all) {
        return /*#__PURE__*/React.createElement(ColumnOption, _extends({}, colDef, {
          key: colDef.field || idx,
          allColumns: all,
          index: idx,
          handleOptionVisibilityChange: _this4.handleOptionVisibilityChange
        }));
      }));
    }
  }], [{
    key: "columnDefinitionsWithHiddenState",
    value:
    /**
     * Extends `props.columnDefinitions` (Object[]) with property `hiddenState` (boolean)
     * according to internal state of `hiddenColumns` (Object.<boolean>).
     *
     * Sorts columns according to order and remove the display_title option, as well.
     *
     * @returns {Object[]} Copy of columnDefintions with `hiddenState` added.
     */
    function columnDefinitionsWithHiddenState(columnDefinitions, hiddenColumns) {
      return _.sortBy(columnDefinitions.filter(function (c) {
        return c.field !== 'display_title'; // Should always remain visible.
      }), 'order').map(function (colDef) {
        return _objectSpread(_objectSpread({}, colDef), {}, {
          'hiddenState': hiddenColumns[colDef.field] === true
        });
      });
    }
  }]);
}(React.PureComponent);
CustomColumnSelector.propTypes = {
  'hiddenColumns': PropTypes.object.isRequired,
  'addHiddenColumn': PropTypes.func.isRequired,
  'removeHiddenColumn': PropTypes.func.isRequired
};
var ColumnOption = /*#__PURE__*/React.memo(function (props) {
  var hiddenState = props.hiddenState,
    allColumns = props.allColumns,
    field = props.field,
    title = props.title,
    description = props.description,
    index = props.index,
    handleOptionVisibilityChange = props.handleOptionVisibilityChange;
  var checked = !hiddenState;
  var sameTitleColExists = _.any(allColumns.slice(0, index).concat(allColumns.slice(index + 1)), {
    title: title
  });
  var className = "clickable" + (checked ? ' is-active' : '');
  var showDescription = description;
  if (sameTitleColExists) {
    if (!description) {
      showDescription = '<i class="icon icon-fw fas icon-code me-07"></i><span class="text-300 font-monospace">' + field + '</span>';
    } else {
      showDescription += '<br/><i class="icon icon-fw fas icon-code me-07"></i><span class="text-300 font-monospace">' + field + '</span>';
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-sm-6 col-lg-3 column-option",
    key: field,
    "data-tip": showDescription,
    "data-html": true
  }, /*#__PURE__*/React.createElement(Checkbox, {
    className: className,
    checked: checked,
    value: field,
    onChange: handleOptionVisibilityChange
  }, title));
});