function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
import React from 'react';
import memoize from 'memoize-one';
import { isSelectAction } from './../../util/misc';
import { getAbstractTypeForType, getSchemaTypeFromSearchContext } from './../../util/schema-transforms';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { AboveSearchViewTableControls } from './above-table-controls/AboveSearchViewTableControls';
import { SearchResultTable } from './SearchResultTable';
import { FacetList, FacetListHeader } from './FacetList';
import { SearchResultDetailPane } from './SearchResultDetailPane';
import { SelectStickyFooter } from './SelectedItemsController';
export var ControlsAndResults = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ControlsAndResults, _React$PureComponent);
  var _super = _createSuper(ControlsAndResults);
  function ControlsAndResults(props) {
    var _this;
    _classCallCheck(this, ControlsAndResults);
    _this = _super.call(this, props);
    _this.onClearFiltersClick = _this.onClearFiltersClick.bind(_assertThisInitialized(_this));
    _this.renderSearchDetailPane = _this.renderSearchDetailPane.bind(_assertThisInitialized(_this));
    _this.memoized = {
      getSchemaTypeFromSearchContext: memoize(getSchemaTypeFromSearchContext),
      getAbstractTypeForType: memoize(getAbstractTypeForType)
    };
    _this.searchResultTableRef = /*#__PURE__*/React.createRef();
    return _this;
  }
  _createClass(ControlsAndResults, [{
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
        return renderDetailPane(result, rowNumber, containerWidth, _objectSpread(_objectSpread({}, propsFromTable), {}, {
          schemas: schemas,
          windowWidth: windowWidth
        }));
      }
      return /*#__PURE__*/React.createElement(SearchResultDetailPane, {
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
        schemas = _this$props2.schemas,
        currentAction = _this$props2.currentAction,
        windowWidth = _this$props2.windowWidth,
        windowHeight = _this$props2.windowHeight,
        registerWindowOnScrollHandler = _this$props2.registerWindowOnScrollHandler,
        session = _this$props2.session,
        addToBodyClassList = _this$props2.addToBodyClassList,
        removeFromBodyClassList = _this$props2.removeFromBodyClassList,
        facets = _this$props2.facets,
        termTransformFxn = _this$props2.termTransformFxn,
        rowHeight = _this$props2.rowHeight,
        separateSingleTermFacets = _this$props2.separateSingleTermFacets,
        navigate = _this$props2.navigate,
        _this$props2$facetCol = _this$props2.facetColumnClassName,
        facetColumnClassName = _this$props2$facetCol === void 0 ? "col-12 col-md-5 col-lg-4 col-xl-3" : _this$props2$facetCol,
        _this$props2$tableCol = _this$props2.tableColumnClassName,
        tableColumnClassName = _this$props2$tableCol === void 0 ? "col-12 col-md-7 col-lg-8 col-xl-9" : _this$props2$tableCol,
        targetTabKey = _this$props2.targetTabKey,
        defaultColAlignment = _this$props2.defaultColAlignment,
        _this$props2$aboveTab = _this$props2.aboveTableComponent,
        aboveTableComponent = _this$props2$aboveTab === void 0 ? /*#__PURE__*/React.createElement(AboveSearchViewTableControls, null) : _this$props2$aboveTab,
        _this$props2$aboveFac = _this$props2.aboveFacetListComponent,
        aboveFacetListComponent = _this$props2$aboveFac === void 0 ? /*#__PURE__*/React.createElement("div", {
          className: "above-results-table-row"
        }) : _this$props2$aboveFac,
        _this$props2$facetLis = _this$props2.facetListComponent,
        facetListComponent = _this$props2$facetLis === void 0 ? /*#__PURE__*/React.createElement(DefaultFacetListComponent, null) : _this$props2$facetLis,
        _this$props2$defaultO = _this$props2.defaultOpenIndices,
        defaultOpenIndices = _this$props2$defaultO === void 0 ? null : _this$props2$defaultO,
        _this$props2$detailPa = _this$props2.detailPane,
        detailPane = _this$props2$detailPa === void 0 ? null : _this$props2$detailPa,
        _this$props2$stickyFi = _this$props2.stickyFirstColumn,
        stickyFirstColumn = _this$props2$stickyFi === void 0 ? false : _this$props2$stickyFi,
        context = _this$props2.context,
        href = _this$props2.href,
        requestedCompoundFilterSet = _this$props2.requestedCompoundFilterSet,
        onFilter = _this$props2.onFilter,
        onFilterMultiple = _this$props2.onFilterMultiple,
        _this$props2$showClea = _this$props2.showClearFiltersButton,
        showClearFiltersButton = _this$props2$showClea === void 0 ? false : _this$props2$showClea,
        _this$props2$isOwnPag = _this$props2.isOwnPage,
        isOwnPage = _this$props2$isOwnPag === void 0 ? true : _this$props2$isOwnPag,
        _this$props2$isContex = _this$props2.isContextLoading,
        isContextLoading = _this$props2$isContex === void 0 ? false : _this$props2$isContex,
        maxHeight = _this$props2.maxHeight,
        _this$props2$maxFacet = _this$props2.maxFacetsBodyHeight,
        maxFacetsBodyHeight = _this$props2$maxFacet === void 0 ? SearchResultTable.defaultProps.maxResultsBodyHeight : _this$props2$maxFacet,
        _this$props2$maxResul = _this$props2.maxResultsBodyHeight,
        maxResultsBodyHeight = _this$props2$maxResul === void 0 ? SearchResultTable.defaultProps.maxResultsBodyHeight : _this$props2$maxResul,
        hiddenColumns = _this$props2.hiddenColumns,
        addHiddenColumn = _this$props2.addHiddenColumn,
        removeHiddenColumn = _this$props2.removeHiddenColumn,
        visibleColumnDefinitions = _this$props2.visibleColumnDefinitions,
        setColumnWidths = _this$props2.setColumnWidths,
        columnWidths = _this$props2.columnWidths,
        columnDefinitions = _this$props2.columnDefinitions,
        _this$props2$selected = _this$props2.selectedItems,
        selectedItems = _this$props2$selected === void 0 ? null : _this$props2$selected,
        sortBy = _this$props2.sortBy,
        sortColumns = _this$props2.sortColumns;

      // Initial results. Will get cloned to SearchResultTable state and added onto during load-as-you-scroll.
      var _ref = context || {},
        results = _ref["@graph"],
        filters = _ref.filters;
      var searchItemType = this.memoized.getSchemaTypeFromSearchContext(context || {});
      var searchAbstractItemType = this.memoized.getAbstractTypeForType(searchItemType, schemas);
      /**
       * To Consider:
       * We could have 1 collection/object of props that is combination of
       * `aboveTableControlsProps` + `facetListProps` and gets passed down
       * to all children. This would allow more flexibility to put elements
       * or controls in various places around table, such as FacetList in
       * table header.
       */

      var commonChildProps = {
        // Props which don't change too frequently and/or are useful to many components -
        context: context,
        navigate: navigate,
        // <- search response context, prop navigate (could be virtual or global)
        schemas: schemas,
        session: session,
        href: href,
        columnDefinitions: columnDefinitions,
        facets: facets,
        hiddenColumns: hiddenColumns,
        addHiddenColumn: addHiddenColumn,
        removeHiddenColumn: removeHiddenColumn,
        currentAction: currentAction,
        windowWidth: windowWidth,
        windowHeight: windowHeight,
        isContextLoading: isContextLoading,
        onFilter: onFilter,
        onFilterMultiple: onFilterMultiple,
        onClearFilters: this.onClearFiltersClick,
        sortBy: sortBy,
        sortColumns: sortColumns,
        termTransformFxn: termTransformFxn,
        itemTypeForSchemas: searchItemType,
        addToBodyClassList: addToBodyClassList,
        removeFromBodyClassList: removeFromBodyClassList
      };
      var extendedAboveTableComponent;
      var extendedAboveFacetListComponent;
      var extendedFacetListComponent;
      var extendChild = function (propsToPass, child) {
        if (! /*#__PURE__*/React.isValidElement(child) || typeof child.type === "string") {
          return child;
        }
        return /*#__PURE__*/React.cloneElement(child, propsToPass);
      };
      if (aboveTableComponent) {
        extendedAboveTableComponent = React.Children.map(aboveTableComponent, extendChild.bind(null, commonChildProps));
      }
      if (aboveFacetListComponent) {
        extendedAboveFacetListComponent = React.Children.map(aboveFacetListComponent, extendChild.bind(null, commonChildProps));
      }
      if (facets !== null && facetListComponent) {
        var facetListProps = _objectSpread(_objectSpread({}, commonChildProps), {}, {
          showClearFiltersButton: showClearFiltersButton,
          separateSingleTermFacets: separateSingleTermFacets,
          requestedCompoundFilterSet: requestedCompoundFilterSet,
          // Default to maxHeight when provided
          maxFacetsBodyHeight: !isOwnPage && (maxHeight !== null && maxHeight !== void 0 ? maxHeight : maxFacetsBodyHeight) || null
        });
        extendedFacetListComponent = React.Children.map(facetListComponent, extendChild.bind(null, facetListProps));
      }
      return /*#__PURE__*/React.createElement("div", {
        className: "row search-view-controls-and-results",
        "data-search-item-type": searchItemType,
        "data-search-abstract-type": searchAbstractItemType
      }, facets === null ? null : /*#__PURE__*/React.createElement("div", {
        className: facetColumnClassName
      }, extendedAboveFacetListComponent, extendedFacetListComponent), /*#__PURE__*/React.createElement("div", {
        className: tableColumnClassName
      }, extendedAboveTableComponent, /*#__PURE__*/React.createElement(SearchResultTable, _extends({}, {
        context: context,
        href: href,
        requestedCompoundFilterSet: requestedCompoundFilterSet,
        navigate: navigate,
        currentAction: currentAction,
        schemas: schemas,
        results: results,
        columnDefinitions: columnDefinitions,
        visibleColumnDefinitions: visibleColumnDefinitions,
        defaultColAlignment: defaultColAlignment,
        setColumnWidths: setColumnWidths,
        columnWidths: columnWidths,
        detailPane: detailPane,
        stickyFirstColumn: stickyFirstColumn,
        isOwnPage: isOwnPage,
        sortBy: sortBy,
        sortColumns: sortColumns,
        termTransformFxn: termTransformFxn,
        windowWidth: windowWidth,
        registerWindowOnScrollHandler: registerWindowOnScrollHandler,
        rowHeight: rowHeight,
        defaultOpenIndices: defaultOpenIndices,
        maxHeight: maxHeight,
        maxResultsBodyHeight: maxResultsBodyHeight,
        targetTabKey: targetTabKey,
        isContextLoading: isContextLoading // <- Only applicable for EmbeddedSearchView, else is false always
      }, {
        ref: this.searchResultTableRef,
        renderDetailPane: this.renderSearchDetailPane
      })), isSelectAction(currentAction) && selectedItems !== null ? /*#__PURE__*/React.createElement(SelectStickyFooter, {
        context: context,
        schemas: schemas,
        selectedItems: selectedItems,
        currentAction: currentAction
      }) : null));
    }
  }]);
  return ControlsAndResults;
}(React.PureComponent);

/**
 * Should handle most if not all cases.
 * Paramaterized into own component to allow to swap in different `props.facetListComponent`.
 */
function DefaultFacetListComponent(props) {
  var facets = props.facets,
    isContextLoading = props.isContextLoading,
    requestedCompoundFilterSet = props.requestedCompoundFilterSet,
    context = props.context;
  var _ref2$Id = (context || {})["@id"],
    ctxHref = _ref2$Id === void 0 ? null : _ref2$Id;
  // If we have an explicit "@id" (ctxHref) then we had a single filter block requested.
  if (Array.isArray(facets) && facets.length > 0) {
    return /*#__PURE__*/React.createElement(FacetList, props);
  }
  if (requestedCompoundFilterSet && !ctxHref) {
    // 'real' (multiple filter blocks) compound search used, FacetList UI cannot be used -
    return /*#__PURE__*/React.createElement("div", {
      className: "facets-container with-header-bg"
    }, /*#__PURE__*/React.createElement(FacetListHeader, {
      hideToggle: true
    }), /*#__PURE__*/React.createElement("div", {
      className: "p-4"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "text-400"
    }, "Compound Filter"), /*#__PURE__*/React.createElement("p", null, "Select a single filter block to edit its properties")));
  }
  if (isContextLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "facets-container with-header-bg"
    }, /*#__PURE__*/React.createElement(FacetListHeader, null), /*#__PURE__*/React.createElement("div", {
      className: "text-center py-4 text-secondary"
    }, /*#__PURE__*/React.createElement("i", {
      className: "icon icon-spin icon-circle-notch fas icon-2x"
    })));
  }
  return null;
}