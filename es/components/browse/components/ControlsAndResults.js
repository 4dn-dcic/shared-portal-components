'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControlsAndResults = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _misc = require("./../../util/misc");

var _schemaTransforms = require("./../../util/schema-transforms");

var _patchedConsole = require("./../../util/patched-console");

var _AboveSearchViewTableControls = require("./above-table-controls/AboveSearchViewTableControls");

var _SearchResultTable = require("./SearchResultTable");

var _FacetList = require("./FacetList");

var _SearchResultDetailPane = require("./SearchResultDetailPane");

var _SelectedItemsController = require("./SelectedItemsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
          termTransformFxn = _this$props2.termTransformFxn,
          rowHeight = _this$props2.rowHeight,
          separateSingleTermFacets = _this$props2.separateSingleTermFacets,
          topLeftChildren = _this$props2.topLeftChildren,
          navigate = _this$props2.navigate,
          _this$props2$facetCol = _this$props2.facetColumnClassName,
          facetColumnClassName = _this$props2$facetCol === void 0 ? "col-12 col-sm-5 col-lg-4 col-xl-3" : _this$props2$facetCol,
          _this$props2$tableCol = _this$props2.tableColumnClassName,
          tableColumnClassName = _this$props2$tableCol === void 0 ? "col-12 col-sm-7 col-lg-8 col-xl-9" : _this$props2$tableCol,
          _this$props2$showAbov = _this$props2.showAboveTableControls,
          showAboveTableControls = _this$props2$showAbov === void 0 ? true : _this$props2$showAbov,
          _this$props2$defaultO = _this$props2.defaultOpenIndices,
          defaultOpenIndices = _this$props2$defaultO === void 0 ? null : _this$props2$defaultO,
          href = _this$props2.href,
          onFilter = _this$props2.onFilter,
          _this$props2$isOwnPag = _this$props2.isOwnPage,
          isOwnPage = _this$props2$isOwnPag === void 0 ? true : _this$props2$isOwnPag,
          _this$props2$isInitia = _this$props2.isInitialContextLoading,
          isInitialContextLoading = _this$props2$isInitia === void 0 ? false : _this$props2$isInitia,
          _this$props2$maxHeigh = _this$props2.maxHeight,
          maxHeight = _this$props2$maxHeigh === void 0 ? _SearchResultTable.SearchResultTable.defaultProps.maxHeight : _this$props2$maxHeigh,
          hiddenColumns = _this$props2.hiddenColumns,
          addHiddenColumn = _this$props2.addHiddenColumn,
          removeHiddenColumn = _this$props2.removeHiddenColumn,
          columnDefinitions = _this$props2.columnDefinitions,
          onCompleteSelection = _this$props2.onCompleteSelection,
          onCancelSelection = _this$props2.onCancelSelection,
          _this$props2$selected = _this$props2.selectedItems,
          selectedItems = _this$props2$selected === void 0 ? null : _this$props2$selected,
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
      var facetListProps = {
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
        itemTypeForSchemas: searchItemType,
        className: "with-header-bg",
        maxBodyHeight: !isOwnPage && maxHeight || null,
        onClearFilters: this.onClearFiltersClick
      };
      return _react["default"].createElement("div", {
        className: "row search-view-controls-and-results",
        "data-search-item-type": searchItemType,
        "data-search-abstract-type": searchAbstractItemType
      }, Array.isArray(facets) && facets.length ? _react["default"].createElement("div", {
        className: facetColumnClassName
      }, showAboveTableControls ? // temporary-ish
      _react["default"].createElement("div", {
        className: "above-results-table-row"
      }) : null, _react["default"].createElement(_FacetList.FacetList, facetListProps)) : null, _react["default"].createElement("div", {
        className: tableColumnClassName
      }, showAboveTableControls ? _react["default"].createElement(_AboveSearchViewTableControls.AboveSearchViewTableControls, _extends({}, {
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
      })) : null, _react["default"].createElement(_SearchResultTable.SearchResultTable, _extends({}, {
        context: context,
        href: href,
        navigate: navigate,
        currentAction: currentAction,
        schemas: schemas,
        hiddenColumns: hiddenColumns,
        results: results,
        columnDefinitions: columnDefinitions,
        isOwnPage: isOwnPage,
        sortBy: sortBy,
        sortColumn: sortColumn,
        sortReverse: sortReverse,
        termTransformFxn: termTransformFxn,
        windowWidth: windowWidth,
        registerWindowOnScrollHandler: registerWindowOnScrollHandler,
        rowHeight: rowHeight,
        defaultOpenIndices: defaultOpenIndices,
        maxHeight: maxHeight,
        isInitialContextLoading: isInitialContextLoading // <- Only applicable for EmbeddedSearchView, else is false always

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

exports.ControlsAndResults = ControlsAndResults;