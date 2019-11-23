'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeOutputValue = sanitizeOutputValue;
exports.haveContextColumnsChanged = haveContextColumnsChanged;
exports.getColumnWidthFromDefinition = getColumnWidthFromDefinition;
exports.HeadersRow = exports.ColumnSorterIcon = exports.ResultRowColumnBlockValue = exports.columnDefinitionsToScaledColumnDefinitions = exports.defaultHiddenColumnMapFromColumns = exports.columnsToColumnDefinitions = exports.TableRowToggleOpenButton = exports.basicColumnExtensionMap = exports.DEFAULT_WIDTH_MAP = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _querystring = _interopRequireDefault(require("querystring"));

var _reactDraggable = _interopRequireDefault(require("react-draggable"));

var _LocalizedTime = require("./../../ui/LocalizedTime");

var _navigate = require("./../../util/navigate");

var _schemaTransforms = require("./../../util/schema-transforms");

var _object = require("./../../util/object");

var _layout = require("./../../util/layout");

var _misc = require("./../../util/misc");

var _analytics = require("./../../util/analytics");

var _typedefs = require("./../../util/typedefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var DEFAULT_WIDTH_MAP = {
  'lg': 200,
  'md': 180,
  'sm': 120,
  'xs': 120
};
exports.DEFAULT_WIDTH_MAP = DEFAULT_WIDTH_MAP;
var basicColumnExtensionMap = {
  'display_title': {
    'title': "Title",
    'widthMap': {
      'lg': 280,
      'md': 250,
      'sm': 200
    },
    'minColumnWidth': 90,
    'order': -100,
    'render': function (result, columnDefinition, props, termTransformFxn, width) {
      var href = props.href,
          rowNumber = props.rowNumber,
          currentAction = props.currentAction,
          propNavigate = props.navigate,
          detailOpen = props.detailOpen,
          toggleDetailOpen = props.toggleDetailOpen;

      var title = _object.itemUtil.getTitleStringFromContext(result);

      var link = _object.itemUtil.atId(result);

      var tooltip;
      var hasPhoto = false;
      /** Registers a list click event for Google Analytics then performs navigation. */

      function handleClick(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        (0, _analytics.productClick)(result, {
          'list': (0, _analytics.hrefToListName)(href),
          'position': rowNumber + 1
        }, function () {
          (propNavigate || _navigate.navigate)(link);
        });
        return false;
      }

      if (title && (title.length > 20 || width < 100)) tooltip = title;

      if (link) {
        // This should be the case always
        title = _react["default"].createElement("a", {
          key: "title",
          href: link || '#',
          onClick: handleClick
        }, title);

        if (typeof result.email === 'string' && result.email.indexOf('@') > -1) {
          // Specific case for User items. May be removed or more cases added, if needed.
          hasPhoto = true;
          title = _react["default"].createElement("span", {
            key: "title"
          }, _object.itemUtil.User.gravatar(result.email, 32, {
            'className': 'in-search-table-title-image',
            'data-tip': result.email
          }, 'mm'), title);
        }
      }

      return _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement(TableRowToggleOpenButton, {
        open: detailOpen,
        onClick: toggleDetailOpen
      }), _react["default"].createElement("div", {
        key: "title-container",
        className: "title-block" + (hasPhoto ? ' has-photo' : " text-ellipsis-container"),
        "data-tip": tooltip
      }, title));
    }
  },
  '@type': {
    'noSort': true,
    'order': -80,
    'render': function render(result, columnDefinition, props) {
      if (!Array.isArray(result['@type'])) return null;
      var leafItemType = (0, _schemaTransforms.getItemType)(result);
      var itemTypeTitle = (0, _schemaTransforms.getTitleForType)(leafItemType, props.schemas || null);
      return _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("div", {
        className: "icon-container"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas icon-filter clickable mr-05",
        onClick: function onClick(e) {
          // Preserve search query, if any, but remove filters (which are usually per-type).
          if (!props.href || props.href.indexOf('/search/') === -1) return;
          e.preventDefault();
          e.stopPropagation();

          var urlParts = _url["default"].parse(props.href, true),
              query = {
            'type': leafItemType
          };

          if (urlParts.query.q) query.q = urlParts.query.q;

          var nextHref = '/search/?' + _querystring["default"].stringify(query);

          (props.navigate || _navigate.navigate)(nextHref);
        },
        "data-tip": "Filter down to only " + itemTypeTitle
      })), _react["default"].createElement("span", {
        className: "item-type-title value"
      }, itemTypeTitle));
    }
  },
  'date_created': {
    'title': 'Date Created',
    'colTitle': 'Created',
    'widthMap': {
      'lg': 140,
      'md': 120,
      'sm': 120
    },
    'render': function (result) {
      if (!result.date_created) return null;
      return _react["default"].createElement("span", {
        className: "value"
      }, _react["default"].createElement(_LocalizedTime.LocalizedTime, {
        timestamp: result.date_created,
        formatType: "date-sm"
      }));
    },
    'order': 510
  },
  'last_modified.date_modified': {
    'title': 'Date Modified',
    'widthMap': {
      'lg': 140,
      'md': 120,
      'sm': 120
    },
    'render': function (result) {
      if (!result.last_modified) return null;
      if (!result.last_modified.date_modified) return null;
      return _react["default"].createElement("span", {
        className: "value"
      }, _react["default"].createElement(_LocalizedTime.LocalizedTime, {
        timestamp: result.last_modified.date_modified,
        formatType: "date-sm"
      }));
    },
    'order': 515
  }
};
/**
 * Ensure we have a valid React element to render.
 * If not, try to detect if Item object, and generate link.
 * Else, let exception bubble up.
 *
 * @static
 * @param {any} value - Value to sanitize.
 */

exports.basicColumnExtensionMap = basicColumnExtensionMap;

function sanitizeOutputValue(value) {
  if (typeof value !== 'string' && !_react["default"].isValidElement(value)) {
    if (value && _typeof(value) === 'object') {
      if (typeof value.display_title !== 'undefined') {
        var atId = _object.itemUtil.atId(value);

        if (atId) {
          return _react["default"].createElement("a", {
            href: atId
          }, value.display_title);
        } else {
          return value.display_title;
        }
      }
    } else if (!value) value = null;
  }

  if (value === "None") value = null;
  return value;
}

var TableRowToggleOpenButton = _react["default"].memo(function (_ref) {
  var onClick = _ref.onClick,
      toggleDetailOpen = _ref.toggleDetailOpen,
      open = _ref.open;
  return _react["default"].createElement("div", {
    className: "inline-block toggle-detail-button-container"
  }, _react["default"].createElement("button", {
    type: "button",
    className: "toggle-detail-button",
    onClick: onClick || toggleDetailOpen
  }, _react["default"].createElement("div", {
    className: "icon-container"
  }, _react["default"].createElement("i", {
    className: "icon icon-fw fas icon-" + (open ? 'minus' : 'plus')
  }))));
});
/**
 * Should handle and fail cases where context and columns object reference values
 * have changed, but not contents. User-selected columns should be preserved upon faceting
 * or similar filtering, but be updated when search type changes.
 *
 * Used as equality checker for `columnsToColumnDefinitions` `columns` param memoization as well.
 *
 * @param {Object.<Object>} cols1 Previous object of columns, to be passed in from a lifecycle method.
 * @param {Object.<Object>} cols2 Next object of columns, to be passed in from a lifecycle method.
 *
 * @returns {boolean} If context columns have changed, which should be about same as if type has changed.
 */


exports.TableRowToggleOpenButton = TableRowToggleOpenButton;

function haveContextColumnsChanged(cols1, cols2) {
  if (cols1 === cols2) return false;
  if (cols1 && !cols2) return true;
  if (!cols1 && cols2) return true;

  var pKeys = _underscore["default"].keys(cols1),
      pKeysLen = pKeys.length,
      nKeys = _underscore["default"].keys(cols2),
      i;

  if (pKeysLen !== nKeys.length) return true;

  for (i = 0; i < pKeysLen; i++) {
    if (pKeys[i] !== nKeys[i]) return true;
  }

  return false;
}
/**
 * Convert a map of field:title to list of column definitions, setting defaults.
 *
 * @param {Object.<string>} columns         Map of field names to field/column titles, as returned from back-end.
 * @param {Object} columnDefinitionMap      Map of field names to extra column properties such 'render', 'title', 'widthMap', etc.
 * @param {Object[]} constantDefinitions    Preset list of column definitions, each containing at least 'field' and 'title'.
 * @param {Object} defaultWidthMap          Map of responsive grid states (lg, md, sm) to pixel number sizes.
 * @returns {Object[]}                      List of objects containing keys 'title', 'field', 'widthMap', and 'render'.
 */


var columnsToColumnDefinitions = (0, _memoizeOne["default"])(function (columns, columnDefinitionMap) {
  var defaultWidthMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_WIDTH_MAP;

  var uninishedColumnDefinitions = _underscore["default"].pairs(columns).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        field = _ref3[0],
        columnProperties = _ref3[1];

    return _underscore["default"].extend({
      field: field
    }, columnProperties);
  });

  var columnDefinitions = _underscore["default"].map(uninishedColumnDefinitions, function (colDef, i) {
    var colDefOverride = columnDefinitionMap && columnDefinitionMap[colDef.field];

    if (colDefOverride) {
      var colDef2 = _underscore["default"].extend({}, colDefOverride, colDef);

      colDef = colDef2;
    } // Add defaults for any required-for-view but not-present properties.


    if (colDef.widthMap && colDef.widthMap.sm && typeof colDef.widthMap.xs !== 'number') {
      colDef.widthMap.xs = colDef.widthMap.sm;
    }

    colDef.widthMap = colDef.widthMap || defaultWidthMap;
    colDef.render = colDef.render || null;
    colDef.order = typeof colDef.order === 'number' ? colDef.order : i;
    return colDef;
  });

  return _underscore["default"].sortBy(columnDefinitions, 'order');
});
exports.columnsToColumnDefinitions = columnsToColumnDefinitions;
var defaultHiddenColumnMapFromColumns = (0, _memoizeOne["default"])(function (columns) {
  var hiddenColMap = {};

  _underscore["default"].forEach(_underscore["default"].pairs(columns), function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        field = _ref5[0],
        columnDefinition = _ref5[1];

    if (columnDefinition.default_hidden) {
      hiddenColMap[field] = true;
    } else {
      hiddenColMap[field] = false;
    }
  });

  return hiddenColMap;
}, function (newArgs, lastArgs) {
  // We allow different object references to be considered equal as long as their values are equal.
  return !haveContextColumnsChanged(lastArgs[0], newArgs[0]);
});
/**
 * Adds a `baseWidth` property to each columnDefinition based off widthMap or default value (100).
 * Used in 4DN ItemPageTable, otherwise is deprecated?
 */

exports.defaultHiddenColumnMapFromColumns = defaultHiddenColumnMapFromColumns;
var columnDefinitionsToScaledColumnDefinitions = (0, _memoizeOne["default"])(function (columnDefinitions) {
  return columnDefinitions.map(function (colDef) {
    var colDef2 = _underscore["default"].clone(colDef);

    colDef2.baseWidth = colDef.widthMap.sm || colDef.widthMap.md || colDef.widthMap.lg || 100;

    if (typeof colDef.render !== 'function') {
      colDef2.render = null;
    }

    return colDef2;
  });
});
/**
 * Determine the typical column width, given current browser width. Defaults to large width if server-side.
 *
 * @param {ColumnDefinition} columnDefinition - JSON of column definition, should have widthMap or width or baseWidth.
 * @param {Object} columnDefinition.widthMap - Map of integer sizes to use at 'lg', 'md', or 'sm' sizes.
 * @param {boolean} [mounted=true]  - Whether component calling this function is mounted. If false, uses 'lg' to align with server-side render.
 * @param {number} [windowWidth=null] - Current window width.
 * @returns {string|number} Width for div column block to be used at current screen/browser size.
 */

exports.columnDefinitionsToScaledColumnDefinitions = columnDefinitionsToScaledColumnDefinitions;

function getColumnWidthFromDefinition(columnDefinition) {
  var mounted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var windowWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var w = columnDefinition.width || columnDefinition.baseWidth || null;

  if (typeof w === 'number') {
    return w;
  }

  var widthMap = columnDefinition.widthMap || null;

  if (!widthMap) {
    return 250; // Fallback
  }

  var responsiveGridSize;
  if (!mounted || (0, _misc.isServerSide)()) responsiveGridSize = 'lg';else responsiveGridSize = (0, _layout.responsiveGridState)(windowWidth);
  if (responsiveGridSize === 'xs') responsiveGridSize = 'sm';
  if (responsiveGridSize === 'xl') responsiveGridSize = 'lg';
  return widthMap[responsiveGridSize || 'lg'];
}

var ResultRowColumnBlockValue =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ResultRowColumnBlockValue, _React$Component);

  _createClass(ResultRowColumnBlockValue, null, [{
    key: "transformIfNeeded",

    /**
     * Default value rendering function.
     * Uses columnDefinition field (column key) to get nested property value from result and display it.
     *
     * @param {Item} result - JSON object representing row data.
     * @param {ColumnDefinition} columnDefinition - Object with column definition data - field, title, widthMap, render function (self)
     * @param {Object} props - Props passed down from SearchResultTable/ResultRowColumnBlock instance.
     * @param {number} width - Unused. Todo - remove?
     * @returns {string|null} String value or null. Your function may return a React element, as well.
     */
    value: function transformIfNeeded(result, columnDefinition, props, termTransformFxn) {
      function filterAndUniq(vals) {
        return _underscore["default"].uniq(_underscore["default"].filter(vals, function (v) {
          return v !== null && typeof v !== 'undefined';
        }));
      }

      var value = (0, _object.getNestedProperty)(result, columnDefinition.field, true);
      if (!value) value = null;

      if (Array.isArray(value)) {
        // getNestedProperty may return a multidimensional array, # of dimennsions depending on how many child arrays were encountered in original result obj.
        value = filterAndUniq(value.map(function (v) {
          if (Array.isArray(v)) {
            v = filterAndUniq(v);
            if (v.length === 1) v = v[0];
            if (v.length === 0) v = null;
          }

          if (typeof termTransformFxn === 'function') {
            return termTransformFxn(columnDefinition.field, v, false);
          }

          console.warn("No termTransformFxn supplied.");
          return v;
        })).map(function (v) {
          if (typeof termTransformFxn === 'function') {
            return termTransformFxn(columnDefinition.field, v, false);
          }

          return v;
        }).join(', ');
      } else if (typeof termTransformFxn === 'function') {
        value = termTransformFxn(columnDefinition.field, value, true);
      }

      return value;
    }
  }]);

  function ResultRowColumnBlockValue(props) {
    var _this;

    _classCallCheck(this, ResultRowColumnBlockValue);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResultRowColumnBlockValue).call(this, props));
    _this.memoized = {
      transformIfNeeded: (0, _memoizeOne["default"])(ResultRowColumnBlockValue.transformIfNeeded)
    };
    return _this;
  }

  _createClass(ResultRowColumnBlockValue, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _this$props = this.props,
          columnDefinition = _this$props.columnDefinition,
          schemas = _this$props.schemas,
          result = _this$props.result,
          className = _this$props.className;

      if (nextProps.columnNumber === 0 || nextProps.columnDefinition.field !== columnDefinition.field || nextProps.schemas !== schemas || _object.itemUtil.atId(nextProps.result) !== _object.itemUtil.atId(result) || nextProps.className !== className || typeof nextProps.shouldComponentUpdateExt === 'function' && nextProps.shouldComponentUpdateExt(nextProps, nextState, this.props, this.state)) {
        return true;
      }

      return false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          result = _this$props2.result,
          columnDefinition = _this$props2.columnDefinition,
          propTooltip = _this$props2.tooltip,
          className = _this$props2.className,
          termTransformFxn = _this$props2.termTransformFxn;
      var renderFxn = columnDefinition.render || this.memoized.transformIfNeeded;
      var value = sanitizeOutputValue(renderFxn(result, columnDefinition, _underscore["default"].omit(this.props, 'columnDefinition', 'result'), termTransformFxn));
      var tooltip;

      if (typeof value === 'number') {
        value = _react["default"].createElement("span", {
          className: "value"
        }, value);
      } else if (typeof value === 'string') {
        if (propTooltip === true && value.length > 25) tooltip = value;
        value = _react["default"].createElement("span", {
          className: "value"
        }, value);
      } else if (value === null) {
        value = _react["default"].createElement("small", {
          className: "value"
        }, "-");
      } else if (_react["default"].isValidElement(value) && value.type === "a") {
        // We let other columnRender funcs define their `value` container (if any)
        // But if is link, e.g. from termTransformFxn, then wrap it to center it.
        value = _react["default"].createElement("span", {
          className: "value"
        }, value);
      }

      var cls = "inner";

      if (typeof className === 'string') {
        cls += ' ' + className;
      }

      return _react["default"].createElement("div", {
        className: cls,
        "data-tip": tooltip
      }, value);
    }
  }]);

  return ResultRowColumnBlockValue;
}(_react["default"].Component);

exports.ResultRowColumnBlockValue = ResultRowColumnBlockValue;

_defineProperty(ResultRowColumnBlockValue, "defaultProps", {
  'mounted': false,
  'toggleDetailOpen': function toggleDetailOpen() {
    console.warn('Triggered props.toggleDetailOpen() but no toggleDetailOpen prop passed to ResultRowColumnValue Component.');
  },
  'shouldComponentUpdateExt': null
});

var ColumnSorterIcon =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ColumnSorterIcon, _React$PureComponent);

  _createClass(ColumnSorterIcon, null, [{
    key: "icon",
    value: function icon() {
      var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "descend";
      if (style === 'descend') return _react["default"].createElement("i", {
        className: "icon icon-sort-down fas align-text-top"
      });else if (style === 'ascend') return _react["default"].createElement("i", {
        className: "icon icon-sort-up fas align-bottom"
      });
    }
  }]);

  function ColumnSorterIcon(props) {
    var _this2;

    _classCallCheck(this, ColumnSorterIcon);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ColumnSorterIcon).call(this, props));
    _this2.sortClickFxn = _this2.sortClickFxn.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(ColumnSorterIcon, [{
    key: "sortClickFxn",
    value: function sortClickFxn(e) {
      var _this$props3 = this.props,
          value = _this$props3.value,
          descend = _this$props3.descend,
          currentSortColumn = _this$props3.currentSortColumn,
          sortByFxn = _this$props3.sortByFxn;
      e.preventDefault();
      sortByFxn(value, currentSortColumn === value && !descend);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          value = _this$props4.value,
          descend = _this$props4.descend,
          currentSortColumn = _this$props4.currentSortColumn;

      if (typeof value !== 'string' || value.length === 0) {
        return null;
      }

      var style = !descend && currentSortColumn === value ? 'ascend' : 'descend';
      var linkClass = (currentSortColumn === value ? 'active ' : '') + 'column-sort-icon';
      return _react["default"].createElement("span", {
        className: linkClass,
        onClick: this.sortClickFxn
      }, ColumnSorterIcon.icon(style));
    }
  }]);

  return ColumnSorterIcon;
}(_react["default"].PureComponent);

exports.ColumnSorterIcon = ColumnSorterIcon;

_defineProperty(ColumnSorterIcon, "propTypes", {
  'currentSortColumn': _propTypes["default"].string,
  'descend': _propTypes["default"].bool,
  'value': _propTypes["default"].string.isRequired,
  'sortByFxn': _propTypes["default"].func.isRequired
});

_defineProperty(ColumnSorterIcon, "defaultProps", {
  'descend': false
});

var HeadersRowColumn =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(HeadersRowColumn, _React$PureComponent2);

  function HeadersRowColumn(props) {
    var _this3;

    _classCallCheck(this, HeadersRowColumn);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(HeadersRowColumn).call(this, props));

    _underscore["default"].bindAll(_assertThisInitialized(_this3), 'onDrag', 'onStop');

    _this3.memoized = {
      showTooltip: (0, _memoizeOne["default"])(function (colWidth, titleStr) {
        return (colWidth - 40) / 7 < (titleStr || "").length;
      })
    };
    return _this3;
  }

  _createClass(HeadersRowColumn, [{
    key: "onDrag",
    value: function onDrag(event, res) {
      var _this$props5 = this.props,
          index = _this$props5.index,
          onAdjusterDrag = _this$props5.onAdjusterDrag;
      onAdjusterDrag(index, event, res);
    }
  }, {
    key: "onStop",
    value: function onStop(event, res) {
      var _this$props6 = this.props,
          index = _this$props6.index,
          setHeaderWidths = _this$props6.setHeaderWidths;
      setHeaderWidths(index, event, res);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          sortColumn = _this$props7.sortColumn,
          sortBy = _this$props7.sortBy,
          sortReverse = _this$props7.sortReverse,
          width = _this$props7.width,
          colDef = _this$props7.colDef,
          headerColumnWidths = _this$props7.headerColumnWidths;
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
      }, colTitle || title), sorterIcon), Array.isArray(headerColumnWidths) ? _react["default"].createElement(_reactDraggable["default"], {
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

var HeadersRow =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(HeadersRow, _React$Component2);

  function HeadersRow(props) {
    var _this4;

    _classCallCheck(this, HeadersRow);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(HeadersRow).call(this, props));
    _this4.throttledSetHeaderWidths = _underscore["default"].debounce(_underscore["default"].throttle(_this4.setHeaderWidths.bind(_assertThisInitialized(_this4)), 1000), 350);
    _this4.setHeaderWidths = _this4.setHeaderWidths.bind(_assertThisInitialized(_this4));
    _this4.onAdjusterDrag = _this4.onAdjusterDrag.bind(_assertThisInitialized(_this4));
    _this4.state = {
      'widths': props.headerColumnWidths && props.headerColumnWidths.slice(0) || null
    };
    return _this4;
  }

  _createClass(HeadersRow, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var headerColumnWidths = this.props.headerColumnWidths;

      if (pastProps.headerColumnWidths !== headerColumnWidths) {
        this.setState({
          'widths': headerColumnWidths.slice(0)
        });
      }
    }
  }, {
    key: "setHeaderWidths",
    value: function () {
      var setHeaderWidths = this.props.setHeaderWidths;
      var widths = this.state.widths;

      if (typeof setHeaderWidths !== 'function') {
        throw new Error('props.setHeaderWidths not a function');
      }

      setTimeout(function () {
        return setHeaderWidths(widths.slice(0));
      }, 0);
    }
  }, {
    key: "getWidthFor",
    value: function getWidthFor(idx) {
      var _this$props8 = this.props,
          headerColumnWidths = _this$props8.headerColumnWidths,
          mounted = _this$props8.mounted,
          columnDefinitions = _this$props8.columnDefinitions,
          windowWidth = _this$props8.windowWidth;
      var widths = this.state.widths;
      return Array.isArray(widths) && widths[idx] || Array.isArray(headerColumnWidths) && headerColumnWidths[idx] || getColumnWidthFromDefinition(columnDefinitions[idx], mounted, windowWidth);
    }
  }, {
    key: "onAdjusterDrag",
    value: function onAdjusterDrag(idx, evt, r) {
      this.setState(function (_ref6, _ref7) {
        var widths = _ref6.widths;
        var columnDefinitions = _ref7.columnDefinitions,
            defaultMinColumnWidth = _ref7.defaultMinColumnWidth;
        var nextWidths = widths.slice(0);
        nextWidths[idx] = Math.max(columnDefinitions[idx].minColumnWidth || defaultMinColumnWidth || 55, r.x);
        return {
          'widths': nextWidths
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var _this$props9 = this.props,
          tableLeftOffset = _this$props9.tableLeftOffset,
          tableContainerWidth = _this$props9.tableContainerWidth,
          columnDefinitions = _this$props9.columnDefinitions,
          stickyHeaderTopOffset = _this$props9.stickyHeaderTopOffset,
          renderDetailPane = _this$props9.renderDetailPane,
          headerColumnWidths = _this$props9.headerColumnWidths,
          width = _this$props9.width,
          tableContainerScrollLeft = _this$props9.tableContainerScrollLeft;
      var widths = this.state.widths;
      var outerClassName = "search-headers-row" + (headerColumnWidths && widths ? '' : ' non-adjustable') + (typeof renderDetailPane !== 'function' ? ' no-detail-pane' : '');
      return _react["default"].createElement("div", {
        className: outerClassName,
        style: {
          'width': width || null // Only passed in from ItemPage

        }
      }, _react["default"].createElement("div", {
        className: "columns clearfix",
        style: {
          left: 0 - tableContainerScrollLeft - (tableLeftOffset || 0) //transform: "translate3d(" + leftOffset + "px, 0px, 0px)"

        }
      }, _underscore["default"].map(columnDefinitions, function (colDef, i) {
        return _react["default"].createElement(HeadersRowColumn, _extends({}, _underscore["default"].pick(_this5.props, 'sortColumn', 'sortReverse', 'sortBy', 'headerColumnWidths'), {
          colDef: colDef,
          index: i,
          onAdjusterDrag: _this5.onAdjusterDrag,
          setHeaderWidths: _this5.setHeaderWidths,
          width: _this5.getWidthFor(i),
          key: colDef.field
        }));
      })));
    }
  }]);

  return HeadersRow;
}(_react["default"].Component);

exports.HeadersRow = HeadersRow;

_defineProperty(HeadersRow, "fullRowWidth", (0, _memoizeOne["default"])(function (columnDefinitions) {
  var mounted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var dynamicWidths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var windowWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return _underscore["default"].reduce(columnDefinitions, function (fw, colDef, i) {
    var w;
    if (typeof colDef === 'number') w = colDef;else {
      if (Array.isArray(dynamicWidths) && dynamicWidths[i]) w = dynamicWidths[i];else w = getColumnWidthFromDefinition(colDef, mounted, windowWidth);
    }
    if (typeof w !== 'number') w = 0;
    return fw + w;
  }, 0);
}));

_defineProperty(HeadersRow, "propTypes", {
  'columnDefinitions': _propTypes["default"].array.isRequired,
  //ResultRow.propTypes.columnDefinitions,
  'mounted': _propTypes["default"].bool.isRequired,

  /** @deprecated */
  'isSticky': _propTypes["default"].bool,

  /** @deprecated */
  'stickyStyle': _propTypes["default"].object,

  /** @deprecated ?? */
  'tableLeftOffset': _propTypes["default"].number,

  /** @deprecated ?? */
  'tableContainerWidth': _propTypes["default"].number,

  /** @deprecated */
  'stickyHeaderTopOffset': _propTypes["default"].number,
  'renderDetailPane': _propTypes["default"].func,
  'headerColumnWidths': _propTypes["default"].arrayOf(_propTypes["default"].number),
  'setHeaderWidths': _propTypes["default"].func,
  'width': _propTypes["default"].number,
  'defaultMinColumnWidth': _propTypes["default"].number,
  'tableContainerScrollLeft': _propTypes["default"].number
});

_defineProperty(HeadersRow, "defaultProps", {
  'isSticky': false,
  'tableLeftOffset': 0,
  'defaultMinColumnWidth': 55,
  'tableContainerScrollLeft': 0
});