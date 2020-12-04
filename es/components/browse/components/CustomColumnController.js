'use strict'; // @flow

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomColumnSelector = exports.CustomColumnController = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _underscore = _interopRequireDefault(require("underscore"));

var _Checkbox = require("./../../forms/components/Checkbox");

var _object = require("./../../util/object");

var _ColumnCombiner = require("./table-commons/ColumnCombiner");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

/**
 * This component stores an object of `hiddenColumns` in state which contains field names as keys and booleans as values.
 * This, along with functions `addHiddenColumn(field: string)` and `removeHiddenColumn(field: string)`, are passed down to
 * this component instance's child component instances.
 *
 * @todo Rename to something better maybe.
 *
 * @prop {Object.<boolean>} [defaultHiddenColumns] - Initial hidden columns state object, if any.
 */
var CustomColumnController = /*#__PURE__*/function (_React$Component) {
  _inherits(CustomColumnController, _React$Component);

  var _super = _createSuper(CustomColumnController);

  _createClass(CustomColumnController, null, [{
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

  function CustomColumnController(props) {
    var _this;

    _classCallCheck(this, CustomColumnController);

    _this = _super.call(this, props); //this.getResetWidths = this.getResetWidths.bind(this);

    _this.setColumnWidths = _this.setColumnWidths.bind(_assertThisInitialized(_this));
    _this.addHiddenColumn = _this.addHiddenColumn.bind(_assertThisInitialized(_this));
    _this.removeHiddenColumn = _this.removeHiddenColumn.bind(_assertThisInitialized(_this));
    _this.memoized = {
      hiddenColsListToObj: (0, _memoizeOne["default"])(_object.listToObj),
      filterOutStateHiddenCols: (0, _memoizeOne["default"])(CustomColumnController.filterOutHiddenCols),
      filterOutPropHiddenCols: (0, _memoizeOne["default"])(CustomColumnController.filterOutHiddenCols)
    };
    _this.state = {
      'hiddenColumns': props.defaultHiddenColumns ? _objectSpread({}, props.defaultHiddenColumns) : {},
      'columnWidths': {}
    };
    return _this;
  }

  _createClass(CustomColumnController, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var defaultHiddenColumns = this.props.defaultHiddenColumns;

      if (pastProps.defaultHiddenColumns !== defaultHiddenColumns) {
        this.setState({
          "hiddenColumns": _underscore["default"].clone(defaultHiddenColumns || {})
        }); // Reset state.hiddenColumns.
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
      this.setState(function (currState) {
        if (currState.hiddenColumns[field] === true) {
          return null;
        }

        var hiddenColumns = _underscore["default"].clone(currState.hiddenColumns);

        hiddenColumns[field] = true;
        return {
          hiddenColumns: hiddenColumns
        };
      });
    }
  }, {
    key: "removeHiddenColumn",
    value: function removeHiddenColumn(field) {
      this.setState(function (currState) {
        if (currState.hiddenColumns[field] === false) {
          return null;
        }

        var hiddenColumns = _underscore["default"].clone(currState.hiddenColumns);

        hiddenColumns[field] = false;
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
          remainingProps = _objectWithoutProperties(_this$props, ["children", "hiddenColumns", "columnDefinitions", "filterColumnFxn"]);

      var _this$state = this.state,
          hiddenColumns = _this$state.hiddenColumns,
          columnWidths = _this$state.columnWidths;

      if (! /*#__PURE__*/_react["default"].isValidElement(children)) {
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

      return _react["default"].Children.map(children, function (child) {
        return /*#__PURE__*/_react["default"].cloneElement(child, propsToPass);
      });
    }
  }]);

  return CustomColumnController;
}(_react["default"].Component);

exports.CustomColumnController = CustomColumnController;

_defineProperty(CustomColumnController, "propTypes", {
  'children': _propTypes["default"].instanceOf(_react["default"].Component),
  'columnDefinitions': _propTypes["default"].arrayOf(_propTypes["default"].shape({
    'field': _propTypes["default"].string
  })),
  'hiddenColumns': _propTypes["default"].array
});

var CustomColumnSelector = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(CustomColumnSelector, _React$PureComponent);

  var _super2 = _createSuper(CustomColumnSelector);

  _createClass(CustomColumnSelector, null, [{
    key: "columnDefinitionsWithHiddenState",

    /**
     * Extends `props.columnDefinitions` (Object[]) with property `hiddenState` (boolean)
     * according to internal state of `hiddenColumns` (Object.<boolean>).
     *
     * Sorts columns according to order and remove the display_title option, as well.
     *
     * @returns {Object[]} Copy of columnDefintions with `hiddenState` added.
     */
    value: function columnDefinitionsWithHiddenState(columnDefinitions, hiddenColumns) {
      return _underscore["default"].sortBy(columnDefinitions.filter(function (c) {
        return c.field !== 'display_title'; // Should always remain visible.
      }), 'order').map(function (colDef) {
        return _objectSpread(_objectSpread({}, colDef), {}, {
          'hiddenState': hiddenColumns[colDef.field] === true
        });
      });
    }
  }]);

  function CustomColumnSelector(props) {
    var _this2;

    _classCallCheck(this, CustomColumnSelector);

    _this2 = _super2.call(this, props);
    _this2.handleOptionVisibilityChange = _underscore["default"].throttle(_this2.handleOptionVisibilityChange.bind(_assertThisInitialized(_this2)), 300);
    _this2.memoized = {
      columnDefinitionsWithHiddenState: (0, _memoizeOne["default"])(CustomColumnSelector.columnDefinitionsWithHiddenState)
    };
    return _this2;
  }

  _createClass(CustomColumnSelector, [{
    key: "handleOptionVisibilityChange",
    value: function handleOptionVisibilityChange(evt) {
      evt.stopPropagation();
      var field = evt.target.value;
      var _this$props2 = this.props,
          hiddenColumns = _this$props2.hiddenColumns,
          removeHiddenColumn = _this$props2.removeHiddenColumn,
          addHiddenColumn = _this$props2.addHiddenColumn;
      setTimeout(function () {
        if (hiddenColumns[field] === true) {
          removeHiddenColumn(field);
        } else {
          addHiddenColumn(field);
        }
      }, 0);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props3 = this.props,
          columnDefinitions = _this$props3.columnDefinitions,
          hiddenColumns = _this$props3.hiddenColumns;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row clearfix"
      }, this.memoized.columnDefinitionsWithHiddenState(columnDefinitions, hiddenColumns).map(function (colDef, idx, all) {
        return /*#__PURE__*/_react["default"].createElement(ColumnOption, _extends({}, colDef, {
          key: colDef.field || idx,
          allColumns: all,
          index: idx,
          handleOptionVisibilityChange: _this3.handleOptionVisibilityChange
        }));
      }));
    }
  }]);

  return CustomColumnSelector;
}(_react["default"].PureComponent);

exports.CustomColumnSelector = CustomColumnSelector;
CustomColumnSelector.propTypes = {
  'hiddenColumns': _propTypes["default"].object.isRequired,
  'addHiddenColumn': _propTypes["default"].func.isRequired,
  'removeHiddenColumn': _propTypes["default"].func.isRequired
};

var ColumnOption = /*#__PURE__*/_react["default"].memo(function (props) {
  var hiddenState = props.hiddenState,
      allColumns = props.allColumns,
      field = props.field,
      title = props.title,
      description = props.description,
      index = props.index,
      handleOptionVisibilityChange = props.handleOptionVisibilityChange;
  var checked = !hiddenState;

  var sameTitleColExists = _underscore["default"].any(allColumns.slice(0, index).concat(allColumns.slice(index + 1)), {
    title: title
  });

  var className = "clickable" + (checked ? ' is-active' : '');
  var showDescription = description;

  if (sameTitleColExists) {
    if (!description) {
      showDescription = '<i class="icon icon-fw fas icon-code">&nbsp;</i><em class="text-300">' + field + '</em>';
    } else {
      showDescription += '<br/><i class="icon icon-fw fas icon-code">&nbsp;</i><em class="text-300">' + field + '</em>';
    }
  }

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "col-12 col-sm-6 col-lg-3 column-option",
    key: field,
    "data-tip": showDescription,
    "data-html": true
  }, /*#__PURE__*/_react["default"].createElement(_Checkbox.Checkbox, _extends({
    className: className,
    checked: checked
  }, {
    value: field,
    onChange: handleOptionVisibilityChange
  }), title));
});