'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchControllersContainer = SearchControllersContainer;
exports.SearchView = exports.WindowNavigationController = void 0;

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

var _searchFilters = require("./../util/search-filters");

var _object = require("./../util/object");

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

var _typedefs = require("./../util/typedefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Provides callbacks for FacetList to filter on term click and check if a term is selected by interfacing with the
 * `href` prop and the `navigate` callback prop or fxn (usually utils/navigate.js).
 *
 * Manages and updates `state.defaultHiddenColumns`, which in turn resets CustomColumnController state with new columns,
 * if search type has changed.
 *
 * Passes other props down to ControlsAndResults.
 */
function SearchControllersContainer(props) {
  // `props.context.columns` is used in place of `props.columns` if `props.columns` is falsy.
  // Or, `props.columns` provides opportunity to override `props.context.columns`. Depends how look at it.
  var context = props.context,
      href = props.href,
      _props$columns = props.columns,
      columns = _props$columns === void 0 ? null : _props$columns,
      columnExtensionMap = props.columnExtensionMap,
      currentAction = props.currentAction,
      _props$navigate = props.navigate,
      propNavigate = _props$navigate === void 0 ? _navigate.navigate : _props$navigate; // All these controllers pass props down to their children.
  // So we don't need to be repetitive here; i.e. may assume 'context' is available
  // in each controller that's child of <ColumnCombiner {...{ context, columns, columnExtensionMap }}>.

  var controllersAndView = _react["default"].createElement(WindowNavigationController, _extends({
    href: href,
    context: context
  }, {
    navigate: propNavigate
  }), _react["default"].createElement(_tableCommons.ColumnCombiner, {
    columns: columns,
    columnExtensionMap: columnExtensionMap
  }, _react["default"].createElement(_CustomColumnController.CustomColumnController, null, _react["default"].createElement(_SortController.SortController, null, _react["default"].createElement(ControlsAndResults, props)))));

  if ((0, _misc.isSelectAction)(currentAction)) {
    controllersAndView = _react["default"].createElement(_SelectedItemsController.SelectedItemsController, null, controllersAndView);
  }

  return controllersAndView;
}

SearchControllersContainer.defaultProps = {
  'navigate': _navigate.navigate,
  'columns': null
}; // TODO: FINISH

var WindowNavigationController =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(WindowNavigationController, _React$PureComponent);

  function WindowNavigationController(props) {
    var _this;

    _classCallCheck(this, WindowNavigationController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WindowNavigationController).call(this, props));
    _this.onFilter = _this.onFilter.bind(_assertThisInitialized(_this));
    _this.onClearFilters = _this.onClearFilters.bind(_assertThisInitialized(_this));
    _this.getTermStatus = _this.getTermStatus.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(WindowNavigationController, [{
    key: "onFilter",
    value: function onFilter(facet, term, callback) {
      var _this$props = this.props,
          href = _this$props.href,
          _this$props$navigate = _this$props.navigate,
          propNavigate = _this$props$navigate === void 0 ? _navigate.navigate : _this$props$navigate,
          contextFilters = _this$props.context.filters;
      return propNavigate((0, _FacetList.generateNextHref)(href, contextFilters, facet, term), {
        'dontScrollToTop': true
      }, typeof callback === "function" ? callback : null);
    }
  }, {
    key: "onClearFilters",
    value: function onClearFilters() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var _this$props2 = this.props,
          href = _this$props2.href,
          _this$props2$navigate = _this$props2.navigate,
          propNavigate = _this$props2$navigate === void 0 ? _navigate.navigate : _this$props2$navigate,
          _this$props2$context$ = _this$props2.context.clear_filters,
          clearFiltersURLOriginal = _this$props2$context$ === void 0 ? null : _this$props2$context$;
      var clearFiltersURL = clearFiltersURLOriginal;

      if (!clearFiltersURL) {
        _patchedConsole.patchedConsoleInstance.error("No Clear Filters URL");

        return;
      } // If we have a '#' in URL, add to target URL as well.


      var hashFragmentIdx = href.indexOf('#');

      if (hashFragmentIdx > -1 && clearFiltersURL.indexOf('#') === -1) {
        clearFiltersURL += href.slice(hashFragmentIdx);
      }

      propNavigate(clearFiltersURL, {}, typeof callback === 'function' ? callback : null);
    }
  }, {
    key: "getTermStatus",
    value: function getTermStatus(term, facet) {
      var filters = this.props.context.filters;
      return (0, _searchFilters.getTermFacetStatus)(term, facet, filters);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          children = _this$props3.children,
          passProps = _objectWithoutProperties(_this$props3, ["children"]);

      _patchedConsole.patchedConsoleInstance.log("PROPS", passProps);

      var propsToPass = _objectSpread({}, passProps, {
        onFilter: this.onFilter,
        onClearFilters: this.onClearFilters,
        getTermStatus: this.getTermStatus
      });

      return _react["default"].Children.map(children, function (child) {
        return _react["default"].cloneElement(child, propsToPass);
      });
    }
  }]);

  return WindowNavigationController;
}(_react["default"].PureComponent);

exports.WindowNavigationController = WindowNavigationController;

var ControlsAndResults =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(ControlsAndResults, _React$PureComponent2);

  _createClass(ControlsAndResults, null, [{
    key: "searchItemTypesFromHref",

    /**
     * Parses out the specific item type from `props.href` and finds the abstract item type, if any.
     *
     * @param {Object} props Component props.
     * @returns {{ specificType: string, abstractType: string }} The leaf specific Item type and parent abstract type (before 'Item' in `@type` array) as strings in an object.
     * Ex: `{ abstractType: null, specificType: "Item" }`, `{ abstractType: "Experiment", specificType: "ExperimentHiC" }`
     */
    value: function searchItemTypesFromHref(href, schemas) {
      var specificType = 'Item'; // Default

      var abstractType = null; // Will be equal to specificType if no parent type.
      // May or may not be props.href passed down from Redux (e.g. not if is EmbeddedSearchView)

      var urlParts = _url["default"].parse(href, true); // Non-zero chance of having array here - though shouldn't occur unless URL entered into browser manually
      // If we do get multiple Item types defined, we treat as if searching `type=Item` (== show `type` facet + column).


      if (typeof urlParts.query.type === 'string') {
        if (urlParts.query.type !== 'Item') {
          specificType = urlParts.query.type;
        }
      }

      abstractType = (0, _schemaTransforms.getAbstractTypeForType)(specificType, schemas) || null;
      return {
        specificType: specificType,
        abstractType: abstractType
      };
    }
  }, {
    key: "isClearFiltersBtnVisible",
    value: function isClearFiltersBtnVisible(href, context) {
      var urlPartsQuery = _url["default"].parse(href, true).query || {};
      var clearFiltersURL = typeof context.clear_filters === 'string' && context.clear_filters || null;

      var clearFiltersURLQuery = clearFiltersURL && _url["default"].parse(clearFiltersURL, true).query;

      return !!(clearFiltersURLQuery && !_underscore["default"].isEqual(clearFiltersURLQuery, urlPartsQuery));
    }
  }]);

  function ControlsAndResults(props) {
    var _this2;

    _classCallCheck(this, ControlsAndResults);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ControlsAndResults).call(this, props));
    _this2.forceUpdateOnSelf = _this2.forceUpdateOnSelf.bind(_assertThisInitialized(_this2));
    _this2.onClearFiltersClick = _this2.onClearFiltersClick.bind(_assertThisInitialized(_this2));
    _this2.columnExtensionMapWithSelectButton = _this2.columnExtensionMapWithSelectButton.bind(_assertThisInitialized(_this2));
    _this2.renderSearchDetailPane = _this2.renderSearchDetailPane.bind(_assertThisInitialized(_this2));
    _this2.memoized = {
      searchItemTypesFromHref: (0, _memoizeOne["default"])(ControlsAndResults.searchItemTypesFromHref),
      isClearFiltersBtnVisible: (0, _memoizeOne["default"])(ControlsAndResults.isClearFiltersBtnVisible)
    };
    _this2.searchResultTableRef = _react["default"].createRef();
    return _this2;
  }

  _createClass(ControlsAndResults, [{
    key: "columnExtensionMapWithSelectButton",
    value: function columnExtensionMapWithSelectButton(columnExtensionMap, currentAction, specificType, abstractType) {
      var _this3 = this;

      var inSelectionMode = (0, _misc.isSelectAction)(currentAction);

      if (!inSelectionMode && (!abstractType || abstractType !== specificType)) {
        return columnExtensionMap;
      }

      columnExtensionMap = _underscore["default"].clone(columnExtensionMap); // Avoid modifying in place

      var origDisplayTitleRenderFxn = columnExtensionMap.display_title && columnExtensionMap.display_title.render || _tableCommons.basicColumnExtensionMap.display_title.render; // Kept for reference in case we want to re-introduce constrain that for 'select' button(s) to be visible in search result rows, there must be parent window.
      //var isThereParentWindow = inSelectionMode && typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window;

      if (inSelectionMode) {
        // Render out button and add to title render output for "Select" if we have a 'selection' currentAction.
        // Also add the popLink/target=_blank functionality to links
        // Remove lab.display_title and type columns on selection
        columnExtensionMap.display_title = _underscore["default"].extend({}, columnExtensionMap.display_title, {
          'minColumnWidth': 120,
          'render': function render(result, columnDefinition, props, width) {
            //set select click handler according to currentAction type (selection or multiselect)
            var selectedItems = _this3.state.selectedItems;
            var isChecked = selectedItems.has(_object.itemUtil.atId(result));

            var checkBoxControl = _react["default"].createElement("input", {
              type: "checkbox",
              checked: isChecked,
              onChange: _this3.handleSelectItemClick.bind(_this3, result, currentAction === 'multiselect'),
              className: "mr-2"
            });

            var currentTitleBlock = origDisplayTitleRenderFxn(result, columnDefinition, _underscore["default"].extend({}, props, {
              currentAction: currentAction
            }), width, true);
            var newChildren = currentTitleBlock.props.children.slice(0);
            newChildren.unshift(checkBoxControl);
            return _react["default"].cloneElement(currentTitleBlock, {
              'children': newChildren
            });
          }
        });
      }

      return columnExtensionMap;
    }
  }, {
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
      var _this$props4 = this.props,
          renderDetailPane = _this$props4.renderDetailPane,
          windowWidth = _this$props4.windowWidth,
          schemas = _this$props4.schemas;

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
      var _this$props5 = this.props,
          context = _this$props5.context,
          schemas = _this$props5.schemas,
          currentAction = _this$props5.currentAction,
          windowWidth = _this$props5.windowWidth,
          windowHeight = _this$props5.windowHeight,
          registerWindowOnScrollHandler = _this$props5.registerWindowOnScrollHandler,
          session = _this$props5.session,
          isFullscreen = _this$props5.isFullscreen,
          toggleFullScreen = _this$props5.toggleFullScreen,
          facets = _this$props5.facets,
          facetColumnClassName = _this$props5.facetColumnClassName,
          tableColumnClassName = _this$props5.tableColumnClassName,
          termTransformFxn = _this$props5.termTransformFxn,
          rowHeight = _this$props5.rowHeight,
          separateSingleTermFacets = _this$props5.separateSingleTermFacets,
          topLeftChildren = _this$props5.topLeftChildren,
          href = _this$props5.href,
          onFilter = _this$props5.onFilter,
          hiddenColumns = _this$props5.hiddenColumns,
          addHiddenColumn = _this$props5.addHiddenColumn,
          removeHiddenColumn = _this$props5.removeHiddenColumn,
          columnDefinitions = _this$props5.columnDefinitions,
          _this$props5$selected = _this$props5.selectedItems,
          selectedItems = _this$props5$selected === void 0 ? null : _this$props5$selected,
          onCompleteSelection = _this$props5.onCompleteSelection,
          onCancelSelection = _this$props5.onCancelSelection,
          sortBy = _this$props5.sortBy,
          sortColumn = _this$props5.sortColumn,
          sortReverse = _this$props5.sortReverse; // Initial results. Will get cloned to SearchResultTable state and added onto during load-as-you-scroll.

      var results = context["@graph"],
          filters = context.filters,
          _context$total = context.total,
          showTotalResults = _context$total === void 0 ? 0 : _context$total; // Facets are transformed by the SearchView component to make adjustments to the @type facet re: currentAction.

      var _this$memoized$search = this.memoized.searchItemTypesFromHref(href, schemas),
          itemTypeForSchemas = _this$memoized$search.specificType,
          abstractType = _this$memoized$search.abstractType;

      var showClearFiltersButton = this.memoized.isClearFiltersBtnVisible(href, context);
      return _react["default"].createElement("div", {
        className: "row"
      }, facets.length ? _react["default"].createElement("div", {
        className: facetColumnClassName
      }, _react["default"].createElement("div", {
        className: "above-results-table-row"
      }), _react["default"].createElement(_FacetList.FacetList, _extends({}, {
        facets: facets,
        filters: filters,
        itemTypeForSchemas: itemTypeForSchemas,
        schemas: schemas,
        currentAction: currentAction,
        showClearFiltersButton: showClearFiltersButton,
        session: session,
        onFilter: onFilter,
        windowWidth: windowWidth,
        windowHeight: windowHeight,
        termTransformFxn: termTransformFxn,
        separateSingleTermFacets: separateSingleTermFacets
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
function (_React$PureComponent3) {
  _inherits(SearchView, _React$PureComponent3);

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
      var _this$props6 = this.props,
          propFacets = _this$props6.facets,
          _this$props6$navigate = _this$props6.navigate,
          propNavigate = _this$props6$navigate === void 0 ? _navigate.navigate : _this$props6$navigate,
          href = _this$props6.href,
          context = _this$props6.context,
          schemas = _this$props6.schemas;
      var contextFacets = context.facets;
      var searchItemType = (0, _schemaTransforms.getSchemaTypeFromSearchContext)(context); // TODO: Attempt to pass in ControlsAndResults as props.children.

      return _react["default"].createElement("div", {
        className: "search-page-container",
        "data-search-item-type": searchItemType
      }, _react["default"].createElement(_AboveSearchTablePanel.AboveSearchTablePanel, {
        href: href,
        context: context,
        schemas: schemas
      }), _react["default"].createElement(SearchControllersContainer, _extends({}, this.props, {
        facets: propFacets || contextFacets,
        navigate: propNavigate
      })));
    }
  }]);

  return SearchView;
}(_react["default"].PureComponent);

exports.SearchView = SearchView;

_defineProperty(SearchView, "propTypes", {
  'context': _propTypes["default"].object.isRequired,
  'currentAction': _propTypes["default"].string,
  'href': _propTypes["default"].string.isRequired,
  'session': _propTypes["default"].bool.isRequired,
  'navigate': _propTypes["default"].func,
  'facets': _propTypes["default"].array,
  'isFullscreen': _propTypes["default"].bool.isRequired,
  'toggleFullScreen': _propTypes["default"].func.isRequired,
  'separateSingleTermFacets': _propTypes["default"].bool.isRequired,
  'renderDetailPane': _propTypes["default"].func
});

_defineProperty(SearchView, "defaultProps", {
  'href': null,
  'currentAction': null,
  'columnExtensionMap': _tableCommons.basicColumnExtensionMap,
  'separateSingleTermFacets': true
});