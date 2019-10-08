'use strict'; // @flow

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomColumnSelector = exports.CustomColumnController = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _Checkbox = require("./../../forms/components/Checkbox");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * This component stores an object of `hiddenColumns` in state which contains field names as keys and booleans as values.
 * This, along with functions `addHiddenColumn(field: string)` and `removeHiddenColumn(field: string)`, are passed down to
 * this component instance's child component instances.
 *
 * @prop {Object.<boolean>} [defaultHiddenColumns] - Initial hidden columns state object, if any.
 */
var CustomColumnController =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CustomColumnController, _React$Component);

  function CustomColumnController(props) {
    var _this;

    _classCallCheck(this, CustomColumnController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomColumnController).call(this, props));
    _this.getAllHiddenColumns = _this.getAllHiddenColumns.bind(_assertThisInitialized(_this));
    _this.addHiddenColumn = _this.addHiddenColumn.bind(_assertThisInitialized(_this));
    _this.removeHiddenColumn = _this.removeHiddenColumn.bind(_assertThisInitialized(_this));
    _this.state = {
      'hiddenColumns': _underscore["default"].clone(props.defaultHiddenColumns || {})
    };
    return _this;
  }

  _createClass(CustomColumnController, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var defaultHiddenColumns = this.props.defaultHiddenColumns;

      if (pastProps.defaultHiddenColumns !== defaultHiddenColumns) {
        this.setState({
          'hiddenColumns': _underscore["default"].clone(defaultHiddenColumns || {})
        });
      }
    }
    /**
     * @param {{ hiddenColumns?: string[], defaultHiddenColumns }} props - Component props.
     * @returns {Object.<boolean>} Map of field names to boolean representing hidden or not.
     */

  }, {
    key: "getAllHiddenColumns",
    value: function getAllHiddenColumns() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      if (Array.isArray(props.hiddenColumns)) {
        return _underscore["default"].extend(_underscore["default"].object(_underscore["default"].map(props.hiddenColumns, function (field) {
          return [field, true];
        })), this.state.hiddenColumns);
      } else return this.state.hiddenColumns;
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
      if (!_react["default"].isValidElement(this.props.children)) throw new Error('CustomColumnController expects props.children to be a valid React component instance.');

      var propsToPass = _underscore["default"].extend(_underscore["default"].omit(this.props, 'children'), {
        'hiddenColumns': this.getAllHiddenColumns(),
        'addHiddenColumn': this.addHiddenColumn,
        'removeHiddenColumn': this.removeHiddenColumn
      });

      return _react["default"].cloneElement(this.props.children, propsToPass);
    }
  }]);

  return CustomColumnController;
}(_react["default"].Component);

exports.CustomColumnController = CustomColumnController;

var CustomColumnSelector =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(CustomColumnSelector, _React$PureComponent);

  function CustomColumnSelector(props) {
    var _this2;

    _classCallCheck(this, CustomColumnSelector);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(CustomColumnSelector).call(this, props));
    _this2.columnDefinitionsWithHiddenState = _this2.columnDefinitionsWithHiddenState.bind(_assertThisInitialized(_this2));
    _this2.handleOptionVisibilityChange = _underscore["default"].throttle(_this2.handleOptionVisibilityChange.bind(_assertThisInitialized(_this2)), 300);
    return _this2;
  }
  /**
   * Extends `props.columnDefinitions` (Object[]) with property `hiddenState` (boolean)
   * according to internal state of `hiddenColumns` (Object.<boolean>).
   *
   * Sorts columns according to order and remove the display_title option, as well.
   *
   * @returns {Object[]} Copy of columnDefintions with `hiddenState` added.
   */


  _createClass(CustomColumnSelector, [{
    key: "columnDefinitionsWithHiddenState",
    value: function columnDefinitionsWithHiddenState() {
      var _this$props = this.props,
          columnDefinitions = _this$props.columnDefinitions,
          hiddenColumns = _this$props.hiddenColumns;
      return _underscore["default"].map(_underscore["default"].sortBy(_underscore["default"].filter(columnDefinitions, function (c) {
        return c.field !== 'display_title';
      }), 'order'), function (colDef) {
        return _underscore["default"].extend({}, colDef, {
          'hiddenState': hiddenColumns[colDef.field] === true
        });
      });
    }
  }, {
    key: "handleOptionVisibilityChange",
    value: function handleOptionVisibilityChange(field) {
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
      var _this3 = this;

      return _react["default"].createElement("div", {
        className: "row clearfix"
      }, _underscore["default"].map(this.columnDefinitionsWithHiddenState(), function (colDef, idx, all) {
        return _react["default"].createElement(ColumnOption, _extends({}, colDef, {
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

var ColumnOption = _react["default"].memo(function (props) {
  var hiddenState = props.hiddenState,
      allColumns = props.allColumns,
      field = props.field,
      title = props.title,
      description = props.description,
      index = props.index,
      handleOptionVisibilityChange = props.handleOptionVisibilityChange;
  var isChecked = !hiddenState;

  var sameTitleColExists = _underscore["default"].any(allColumns.slice(0, index).concat(allColumns.slice(index + 1)), {
    title: title
  });

  var cls = "clickable" + (isChecked ? ' is-active' : '');
  var showDescription = description;

  if (sameTitleColExists) {
    if (!description) {
      showDescription = '<i class="icon icon-fw fas icon-code">&nbsp;</i><em class="text-300">' + field + '</em>';
    } else {
      showDescription += '<br/><i class="icon icon-fw fas icon-code">&nbsp;</i><em class="text-300">' + field + '</em>';
    }
  }

  return _react["default"].createElement("div", {
    className: "col-12 col-sm-6 col-lg-3 column-option",
    key: field,
    "data-tip": showDescription,
    "data-html": true
  }, _react["default"].createElement(_Checkbox.Checkbox, {
    checked: isChecked,
    onChange: function onChange(e) {
      return handleOptionVisibilityChange(field, e);
    },
    value: field,
    className: cls
  }, title));
});