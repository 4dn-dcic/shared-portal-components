'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ColumnCombiner", {
  enumerable: true,
  get: function get() {
    return _tableCommons.ColumnCombiner;
  }
});
Object.defineProperty(exports, "CustomColumnController", {
  enumerable: true,
  get: function get() {
    return _CustomColumnController.CustomColumnController;
  }
});
Object.defineProperty(exports, "SortController", {
  enumerable: true,
  get: function get() {
    return _SortController.SortController;
  }
});
Object.defineProperty(exports, "SelectedItemsController", {
  enumerable: true,
  get: function get() {
    return _SelectedItemsController.SelectedItemsController;
  }
});
exports.SearchView = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _Alerts = require("./../ui/Alerts");

var _navigate = require("./../util/navigate");

var _misc = require("./../util/misc");

var _schemaTransforms = require("./../util/schema-transforms");

var _patchedConsole = require("./../util/patched-console");

var _tableCommons = require("./components/table-commons");

var _AboveSearchTablePanel = require("./components/AboveSearchTablePanel");

var _AboveSearchViewTableControls = require("./components/above-table-controls/AboveSearchViewTableControls");

var _CustomColumnController = require("./components/CustomColumnController");

var _SearchResultTable = require("./components/SearchResultTable");

var _FacetList = require("./components/FacetList");

var _SearchResultDetailPane = require("./components/SearchResultDetailPane");

var _SortController = require("./components/SortController");

var _SelectedItemsController = require("./components/SelectedItemsController");

var _WindowNavigationController = require("./components/WindowNavigationController");

var _typedefs = require("./../util/typedefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ControlsAndResults =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ControlsAndResults, _React$PureComponent);

  _createClass(ControlsAndResults, null, [{
    key: "isClearFiltersBtnVisible",
    value: function isClearFiltersBtnVisible(href, context) {
      var urlPartsQuery = _url["default"].parse(href, true).query || {};
      var clearFiltersURL = typeof context.clear_filters === 'string' && context.clear_filters || null;

      var clearFiltersURLQuery = clearFiltersURL && _url["default"].parse(clearFiltersURL, true).query;

      return !!(clearFiltersURLQuery && !_underscore["default"].isEqual(clearFiltersURLQuery, urlPartsQuery));
    }
  }]);

  function ControlsAndResults(props) {
    var _this;

    _classCallCheck(this, ControlsAndResults);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ControlsAndResults).call(this, props));
    _this.forceUpdateOnSelf = _this.forceUpdateOnSelf.bind(_assertThisInitialized(_this));
    _this.onClearFiltersClick = _this.onClearFiltersClick.bind(_assertThisInitialized(_this));
    _this.renderSearchDetailPane = _this.renderSearchDetailPane.bind(_assertThisInitialized(_this));
    _this.memoized = {
      getSchemaTypeFromSearchContext: (0, _memoizeOne["default"])(_schemaTransforms.getSchemaTypeFromSearchContext),
      getAbstractTypeForType: (0, _memoizeOne["default"])(_schemaTransforms.getAbstractTypeForType),
      isClearFiltersBtnVisible: (0, _memoizeOne["default"])(ControlsAndResults.isClearFiltersBtnVisible)
    };
    _this.searchResultTableRef = _react["default"].createRef();
    return _this;
  }

  _createClass(ControlsAndResults, [{
    key: "forceUpdateOnSelf",
    value: function forceUpdateOnSelf() {
      var searchResultTable = this.searchResultTableRef.current;
      var dimContainer = searchResultTable && searchResultTable.getDimensionContainer();
      return dimContainer && dimContainer.resetWidths();
    }
  }, {
    key: "onClearFiltersClick",
    value: function onClearFiltersClick(evt) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var onClearFilters = this.props.onClearFilters;
      evt.preventDefault();
      evt.stopPropagation();
      onClearFilters(callback);
    }
  }, {
    key: "renderSearchDetailPane",
    value: function renderSearchDetailPane(result, rowNumber, containerWidth, propsFromTable) {
      var _this$props = this.props,
          renderDetailPane = _this$props.renderDetailPane,
          windowWidth = _this$props.windowWidth,
          schemas = _this$props.schemas;

      if (typeof renderDetailPane === "function") {
        return renderDetailPane(result, rowNumber, containerWidth, _objectSpread({}, propsFromTable, {
          schemas: schemas,
          windowWidth: windowWidth
        }));
      }

      return _react["default"].createElement(_SearchResultDetailPane.SearchResultDetailPane, {
        result: result,
        rowNumber: rowNumber,
        containerWidth: containerWidth,
        schemas: schemas,
        windowWidth: windowWidth
      });
    }
    /**
     * Expands `this.props` and feeds them into appropriate places in view.
     * Derives some info using memoized fxns.
     */

  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          context = _this$props2.context,
          schemas = _this$props2.schemas,
          currentAction = _this$props2.currentAction,
          windowWidth = _this$props2.windowWidth,
          windowHeight = _this$props2.windowHeight,
          registerWindowOnScrollHandler = _this$props2.registerWindowOnScrollHandler,
          session = _this$props2.session,
          isFullscreen = _this$props2.isFullscreen,
          toggleFullScreen = _this$props2.toggleFullScreen,
          facets = _this$props2.facets,
          facetColumnClassName = _this$props2.facetColumnClassName,
          tableColumnClassName = _this$props2.tableColumnClassName,
          termTransformFxn = _this$props2.termTransformFxn,
          rowHeight = _this$props2.rowHeight,
          separateSingleTermFacets = _this$props2.separateSingleTermFacets,
          topLeftChildren = _this$props2.topLeftChildren,
          href = _this$props2.href,
          onFilter = _this$props2.onFilter,
          hiddenColumns = _this$props2.hiddenColumns,
          addHiddenColumn = _this$props2.addHiddenColumn,
          removeHiddenColumn = _this$props2.removeHiddenColumn,
          columnDefinitions = _this$props2.columnDefinitions,
          _this$props2$selected = _this$props2.selectedItems,
          selectedItems = _this$props2$selected === void 0 ? null : _this$props2$selected,
          onCompleteSelection = _this$props2.onCompleteSelection,
          onCancelSelection = _this$props2.onCancelSelection,
          sortBy = _this$props2.sortBy,
          sortColumn = _this$props2.sortColumn,
          sortReverse = _this$props2.sortReverse; // Initial results. Will get cloned to SearchResultTable state and added onto during load-as-you-scroll.

      var results = context["@graph"],
          filters = context.filters,
          _context$total = context.total,
          showTotalResults = _context$total === void 0 ? 0 : _context$total;
      var searchItemType = this.memoized.getSchemaTypeFromSearchContext(context);
      var searchAbstractItemType = this.memoized.getAbstractTypeForType(searchItemType, schemas); // Facets are transformed by the SearchView component to make adjustments to the @type facet re: currentAction.

      var showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href, context);
      return _react["default"].createElement("div", {
        className: "row search-view-controls-and-results",
        "data-search-item-type": searchItemType,
        "data-search-abstract-type": searchAbstractItemType
      }, facets.length ? _react["default"].createElement("div", {
        className: facetColumnClassName
      }, _react["default"].createElement("div", {
        className: "above-results-table-row"
      }), _react["default"].createElement(_FacetList.FacetList, _extends({}, {
        facets: facets,
        filters: filters,
        schemas: schemas,
        currentAction: currentAction,
        showClearFiltersButton: showClearFiltersButton,
        session: session,
        onFilter: onFilter,
        windowWidth: windowWidth,
        windowHeight: windowHeight,
        termTransformFxn: termTransformFxn,
        separateSingleTermFacets: separateSingleTermFacets,
        itemTypeForSchemas: searchItemType
      }, {
        className: "with-header-bg",
        onClearFilters: this.onClearFiltersClick
      }))) : null, _react["default"].createElement("div", {
        className: tableColumnClassName
      }, _react["default"].createElement(_AboveSearchViewTableControls.AboveSearchViewTableControls, _extends({}, {
        // 'isFullscreen' & 'toggleFullScreen' are specific to 4DN's App.js, we could ideally refactor this out eventually.
        // Perhaps in same way as 'topLeftChildren' is setup... food 4 thought.
        context: context,
        showTotalResults: showTotalResults,
        hiddenColumns: hiddenColumns,
        columnDefinitions: columnDefinitions,
        addHiddenColumn: addHiddenColumn,
        removeHiddenColumn: removeHiddenColumn,
        isFullscreen: isFullscreen,
        toggleFullScreen: toggleFullScreen,
        currentAction: currentAction,
        windowWidth: windowWidth,
        windowHeight: windowHeight,
        topLeftChildren: topLeftChildren
      }, {
        parentForceUpdate: this.forceUpdateOnSelf
      })), _react["default"].createElement(_SearchResultTable.SearchResultTable, _extends({}, {
        context: context,
        href: href,
        currentAction: currentAction,
        schemas: schemas,
        hiddenColumns: hiddenColumns,
        results: results,
        columnDefinitions: columnDefinitions,
        sortBy: sortBy,
        sortColumn: sortColumn,
        sortReverse: sortReverse,
        termTransformFxn: termTransformFxn,
        windowWidth: windowWidth,
        registerWindowOnScrollHandler: registerWindowOnScrollHandler,
        rowHeight: rowHeight
      }, {
        ref: this.searchResultTableRef,
        renderDetailPane: this.renderSearchDetailPane
      })), (0, _misc.isSelectAction)(currentAction) && selectedItems !== null ? _react["default"].createElement(_SelectedItemsController.SelectStickyFooter, _extends({
        context: context,
        schemas: schemas,
        selectedItems: selectedItems,
        currentAction: currentAction
      }, {
        onComplete: onCompleteSelection,
        onCancel: onCancelSelection
      })) : null));
    }
  }]);

  return ControlsAndResults;
}(_react["default"].PureComponent);

var SearchView =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(SearchView, _React$PureComponent2);

  function SearchView() {
    _classCallCheck(this, SearchView);

    return _possibleConstructorReturn(this, _getPrototypeOf(SearchView).apply(this, arguments));
  }

  _createClass(SearchView, [{
    key: "componentDidMount",

    /**
     * @property {string} href - Current URI.
     * @property {!string} [currentAction=null] - Current action, if any.
     * @property {Object.<ColumnDefinition>} columnExtensionMap - Object keyed by field name with overrides for column definition.
     * @property {boolean} separateSingleTermFacets - If true, will push facets w/ only 1 term available to bottom of FacetList.
     */
    value: function componentDidMount() {
      _reactTooltip["default"].rebuild();
    }
    /**
     * TODO once we have @type : [..more stuff..], change to use instead of `getSchemaTypeFromSearchContext`.
     * For custom styling from CSS stylesheet (e.g. to sync override of rowHeight in both CSS and in props here)
     */

  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          href = _this$props3.href,
          context = _this$props3.context,
          _this$props3$schemas = _this$props3.schemas,
          schemas = _this$props3$schemas === void 0 ? null : _this$props3$schemas,
          _this$props3$currentA = _this$props3.currentAction,
          currentAction = _this$props3$currentA === void 0 ? null : _this$props3$currentA,
          propFacets = _this$props3.facets,
          _this$props3$navigate = _this$props3.navigate,
          propNavigate = _this$props3$navigate === void 0 ? _navigate.navigate : _this$props3$navigate,
          _this$props3$columns = _this$props3.columns,
          columns = _this$props3$columns === void 0 ? null : _this$props3$columns,
          _this$props3$columnEx = _this$props3.columnExtensionMap,
          columnExtensionMap = _this$props3$columnEx === void 0 ? _tableCommons.basicColumnExtensionMap : _this$props3$columnEx,
          _this$props3$isOwnPag = _this$props3.isOwnPage,
          isOwnPage = _this$props3$isOwnPag === void 0 ? true : _this$props3$isOwnPag,
          passProps = _objectWithoutProperties(_this$props3, ["href", "context", "schemas", "currentAction", "facets", "navigate", "columns", "columnExtensionMap", "isOwnPage"]);

      var contextFacets = context.facets; // All these controllers pass props down to their children.
      // So we don't need to be repetitive here; i.e. may assume 'context' is available
      // in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.
      // As well as in ControlsAndResults.

      var childViewProps = _objectSpread({}, passProps, {
        currentAction: currentAction,
        schemas: schemas,
        isOwnPage: isOwnPage,
        facets: propFacets || contextFacets
      });

      var controllersAndView = _react["default"].createElement(_tableCommons.ColumnCombiner, {
        columns: columns,
        columnExtensionMap: columnExtensionMap
      }, _react["default"].createElement(_CustomColumnController.CustomColumnController, null, _react["default"].createElement(_SortController.SortController, null, _react["default"].createElement(ControlsAndResults, childViewProps))));

      if (isOwnPage) {
        // Default case
        if ((0, _misc.isSelectAction)(currentAction)) {
          // We don't allow "SelectionMode" unless is own page.
          // Could consider changing later once use case exists.
          controllersAndView = // SelectedItemsController must be above ColumnCombiner because it adjusts
          // columnExtensionMap, rather than columnDefinitions. This can be easily changed
          // though if desired.
          _react["default"].createElement(_SelectedItemsController.SelectedItemsController, {
            columnExtensionMap: columnExtensionMap,
            currentAction: currentAction
          }, controllersAndView);
        }

        controllersAndView = _react["default"].createElement(_WindowNavigationController.WindowNavigationController, _extends({
          href: href,
          context: context
        }, {
          navigate: propNavigate
        }), controllersAndView);
      }

      return _react["default"].createElement("div", {
        className: "search-page-container"
      }, _react["default"].createElement(_AboveSearchTablePanel.AboveSearchTablePanel, {
        href: href,
        context: context,
        schemas: schemas
      }), controllersAndView);
    }
  }]);

  return SearchView;
}(_react["default"].PureComponent);

exports.SearchView = SearchView;

_defineProperty(SearchView, "propTypes", {
  'context': _propTypes["default"].object.isRequired,
  'columns': _propTypes["default"].object,
  'columnExtensionMap': _propTypes["default"].object,
  'currentAction': _propTypes["default"].string,
  'href': _propTypes["default"].string.isRequired,
  'session': _propTypes["default"].bool.isRequired,
  'navigate': _propTypes["default"].func,
  'schemas': _propTypes["default"].object,
  'facets': _propTypes["default"].array,
  'isFullscreen': _propTypes["default"].bool.isRequired,
  'toggleFullScreen': _propTypes["default"].func.isRequired,
  'separateSingleTermFacets': _propTypes["default"].bool.isRequired,
  'renderDetailPane': _propTypes["default"].func,
  'isOwnPage': _propTypes["default"].bool
});

_defineProperty(SearchView, "defaultProps", {
  'href': null,
  // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
  // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
  'columns': null,
  'navigate': _navigate.navigate,
  'currentAction': null,
  'columnExtensionMap': _tableCommons.basicColumnExtensionMap,
  'separateSingleTermFacets': true,
  'isOwnPage': true
});