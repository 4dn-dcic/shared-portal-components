'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StickyFooter = StickyFooter;
exports.SearchView = exports.SearchControllersContainer = void 0;

var _react = _interopRequireDefault(require("react"));

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

var _Checkbox = require("../forms/components/Checkbox");

var _typedefs = require("./../util/typedefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SearchControllersContainer = function (_React$PureComponent) {
  _inherits(SearchControllersContainer, _React$PureComponent);

  function SearchControllersContainer(props) {
    var _this;

    _classCallCheck(this, SearchControllersContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchControllersContainer).call(this, props));
    _this.onFilter = _this.onFilter.bind(_assertThisInitialized(_this));
    _this.isTermSelected = _this.isTermSelected.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SearchControllersContainer, [{
    key: "onFilter",
    value: function onFilter(facet, term, callback) {
      var skipNavigation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var currentHref = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      (0, _FacetList.performFilteringQuery)(this.props, facet, term, callback, skipNavigation, currentHref);
    }
  }, {
    key: "isTermSelected",
    value: function isTermSelected(term, facet) {
      return (0, _searchFilters.determineIfTermFacetSelected)(term, facet, this.props);
    }
  }, {
    key: "render",
    value: function render() {
      var context = this.props.context;
      var defaultHiddenColumns = (0, _tableCommons.defaultHiddenColumnMapFromColumns)(context.columns);
      return _react["default"].createElement(_CustomColumnController.CustomColumnController, {
        defaultHiddenColumns: defaultHiddenColumns
      }, _react["default"].createElement(_SortController.SortController, _underscore["default"].pick(this.props, 'href', 'context', 'navigate'), _react["default"].createElement(ControlsAndResults, _extends({}, this.props, {
        isTermSelected: this.isTermSelected,
        onFilter: this.onFilter
      }))));
    }
  }]);

  return SearchControllersContainer;
}(_react["default"].PureComponent);

exports.SearchControllersContainer = SearchControllersContainer;

_defineProperty(SearchControllersContainer, "defaultProps", {
  'navigate': _navigate.navigate
});

var ControlsAndResults = function (_React$PureComponent2) {
  _inherits(ControlsAndResults, _React$PureComponent2);

  function ControlsAndResults(props) {
    var _this2;

    _classCallCheck(this, ControlsAndResults);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ControlsAndResults).call(this, props));
    _this2.forceUpdateOnSelf = _this2.forceUpdateOnSelf.bind(_assertThisInitialized(_this2));
    _this2.handleClearFilters = _this2.handleClearFilters.bind(_assertThisInitialized(_this2));
    _this2.columnExtensionMapWithSelectButton = _this2.columnExtensionMapWithSelectButton.bind(_assertThisInitialized(_this2));
    _this2.renderSearchDetailPane = _this2.renderSearchDetailPane.bind(_assertThisInitialized(_this2));
    _this2.handleMultiSelectItemCompleteClick = _this2.handleMultiSelectItemCompleteClick.bind(_assertThisInitialized(_this2));
    _this2.handleSelectCancelClick = _this2.handleSelectCancelClick.bind(_assertThisInitialized(_this2));
    _this2.state = {
      selectedItems: new Map()
    };
    _this2.searchResultTableRef = _react["default"].createRef();
    return _this2;
  }

  _createClass(ControlsAndResults, [{
    key: "handleSingleSelectItemClick",
    value: function handleSingleSelectItemClick(result) {
      this.sendDataToParentWindow([{
        'id': _object.itemUtil.atId(result),
        'json': result
      }]);
    }
  }, {
    key: "handleMultiSelectItemClick",
    value: function handleMultiSelectItemClick(result) {
      this.setState(function (_ref) {
        var prevItems = _ref.selectedItems;
        var nextItems = new Map(prevItems);

        var resultID = _object.itemUtil.atId(result);

        if (nextItems.has(resultID)) {
          nextItems["delete"](resultID);
        } else {
          nextItems.set(resultID, result);
        }

        return {
          selectedItems: nextItems
        };
      });
    }
  }, {
    key: "handleMultiSelectItemCompleteClick",
    value: function handleMultiSelectItemCompleteClick() {
      var selectedItems = this.state.selectedItems;
      var itemsWrappedWithID = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = selectedItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          itemsWrappedWithID.push({
            id: key,
            json: value
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.sendDataToParentWindow(itemsWrappedWithID);
    }
  }, {
    key: "handleSelectCancelClick",
    value: function handleSelectCancelClick() {
      var selectedItems = this.state.selectedItems;

      if (selectedItems.size > 0) {
        if (!window.confirm('Leaving will cause all selected item(s) to be lost. Are you sure you want to proceed?')) {
          return;
        }
      }

      window.dispatchEvent(new Event('fourfrontcancelclick'));
      if (window.opener) window.opener.postMessage({
        'eventType': 'fourfrontcancelclick'
      }, '*');
    }
  }, {
    key: "sendDataToParentWindow",
    value: function sendDataToParentWindow(itemsListWrappedWithID) {
      if (!itemsListWrappedWithID || itemsListWrappedWithID.length === 0) {
        return;
      }

      var eventJSON = {
        'items': itemsListWrappedWithID,
        'eventType': 'fourfrontselectionclick'
      };

      try {
        window.opener.postMessage(eventJSON, '*');
      } catch (err) {
        if (!(typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window)) {
          _Alerts.Alerts.queue({
            'title': 'Failed to send data to parent window.',
            'message': 'Please ensure there is a parent window to which this selection is being sent to. Alternatively, try to drag & drop the Item over instead.'
          });
        } else {
          _patchedConsole.patchedConsoleInstance.err('Unexpecter error -- browser may not support postMessage', err);
        }
      }

      window.dispatchEvent(new CustomEvent('fourfrontselectionclick', {
        'detail': eventJSON
      }));
    }
  }, {
    key: "columnExtensionMapWithSelectButton",
    value: function columnExtensionMapWithSelectButton(columnExtensionMap, currentAction, specificType, abstractType) {
      var _this3 = this;

      var inSelectionMode = (0, _misc.isSelectAction)(currentAction);

      if (!inSelectionMode && (!abstractType || abstractType !== specificType)) {
        return columnExtensionMap;
      }

      columnExtensionMap = _underscore["default"].clone(columnExtensionMap);
      var origDisplayTitleRenderFxn = columnExtensionMap.display_title && columnExtensionMap.display_title.render || _tableCommons.basicColumnExtensionMap.display_title.render;

      if (inSelectionMode) {
        columnExtensionMap.display_title = _underscore["default"].extend({}, columnExtensionMap.display_title, {
          'minColumnWidth': 120,
          'render': function render(result, columnDefinition, props, width) {
            var checkBoxControl;

            if (currentAction === 'multiselect') {
              var selectedItems = _this3.state.selectedItems;
              var isChecked = selectedItems.has(_object.itemUtil.atId(result));
              checkBoxControl = _react["default"].createElement("input", {
                type: "checkbox",
                checked: isChecked,
                onChange: _this3.handleMultiSelectItemClick.bind(_this3, result),
                className: "mr-2"
              });
            } else {
              checkBoxControl = _react["default"].createElement("div", {
                className: "select-button-container"
              }, _react["default"].createElement("button", {
                type: "button",
                className: "select-button",
                onClick: _this3.handleSingleSelectItemClick.bind(_this3, result)
              }, _react["default"].createElement("i", {
                className: "icon icon-fw icon-check fas"
              })));
            }

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
    key: "handleClearFilters",
    value: function handleClearFilters(evt) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      evt.preventDefault();
      evt.stopPropagation();
      var _this$props = this.props,
          href = _this$props.href,
          context = _this$props.context,
          propNavigate = _this$props.navigate;
      var clearFiltersURL = typeof context.clear_filters === 'string' && context.clear_filters || null;

      if (!clearFiltersURL) {
        _patchedConsole.patchedConsoleInstance.error("No Clear Filters URL");

        return;
      }

      var hashFragmentIdx = href.indexOf('#');

      if (hashFragmentIdx > -1 && clearFiltersURL.indexOf('#') === -1) {
        clearFiltersURL += href.slice(hashFragmentIdx);
      }

      propNavigate(clearFiltersURL, {}, typeof callback === 'function' ? callback : null);
    }
  }, {
    key: "isClearFiltersBtnVisible",
    value: function isClearFiltersBtnVisible() {
      var _this$props2 = this.props,
          href = _this$props2.href,
          context = _this$props2.context;

      var urlPartsQuery = _url["default"].parse(href, true).query;

      var clearFiltersURL = typeof context.clear_filters === 'string' && context.clear_filters || null;

      var clearFiltersURLQuery = clearFiltersURL && _url["default"].parse(clearFiltersURL, true).query;

      return !!(clearFiltersURLQuery && !_underscore["default"].isEqual(clearFiltersURLQuery, urlPartsQuery));
    }
  }, {
    key: "renderSearchDetailPane",
    value: function renderSearchDetailPane(result, rowNumber, containerWidth) {
      var _this$props3 = this.props,
          windowWidth = _this$props3.windowWidth,
          schemas = _this$props3.schemas;
      return _react["default"].createElement(_SearchResultDetailPane.SearchResultDetailPane, {
        result: result,
        rowNumber: rowNumber,
        containerWidth: containerWidth,
        schemas: schemas,
        windowWidth: windowWidth
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          context = _this$props4.context,
          schemas = _this$props4.schemas,
          hiddenColumns = _this$props4.hiddenColumns,
          columnExtensionMap = _this$props4.columnExtensionMap,
          currentAction = _this$props4.currentAction,
          href = _this$props4.href,
          propFacets = _this$props4.facets,
          tableColumnClassName = _this$props4.tableColumnClassName,
          facetColumnClassName = _this$props4.facetColumnClassName;
      var selectedItems = this.state.selectedItems;
      var results = context['@graph'];
      var facets = propFacets || context.facets;

      var _ControlsAndResults$s = ControlsAndResults.searchItemTypesFromHref(href, schemas),
          specificType = _ControlsAndResults$s.specificType,
          abstractType = _ControlsAndResults$s.abstractType;

      var selfExtendedColumnExtensionMap = this.columnExtensionMapWithSelectButton(columnExtensionMap, currentAction, specificType, abstractType);
      var columnDefinitions = (0, _tableCommons.columnsToColumnDefinitions)(context.columns || {}, selfExtendedColumnExtensionMap);
      return _react["default"].createElement("div", {
        className: "row"
      }, facets.length ? _react["default"].createElement("div", {
        className: facetColumnClassName
      }, _react["default"].createElement("div", {
        className: "above-results-table-row"
      }), _react["default"].createElement(_FacetList.FacetList, _extends({
        className: "with-header-bg",
        facets: facets,
        filters: context.filters,
        onClearFilters: this.handleClearFilters,
        itemTypeForSchemas: specificType,
        showClearFiltersButton: this.isClearFiltersBtnVisible()
      }, _underscore["default"].pick(this.props, 'isTermSelected', 'schemas', 'session', 'onFilter', 'currentAction', 'windowWidth', 'windowHeight', 'termTransformFxn', 'separateSingleTermFacets')))) : null, _react["default"].createElement("div", {
        className: tableColumnClassName
      }, _react["default"].createElement(_AboveSearchViewTableControls.AboveSearchViewTableControls, _extends({
        showTotalResults: context.total,
        parentForceUpdate: this.forceUpdateOnSelf
      }, _underscore["default"].pick(this.props, 'addHiddenColumn', 'removeHiddenColumn', 'isFullscreen', 'context', 'columns', 'currentAction', 'windowWidth', 'windowHeight', 'toggleFullScreen'), {
        hiddenColumns: hiddenColumns,
        columnDefinitions: columnDefinitions
      })), _react["default"].createElement(_SearchResultTable.SearchResultTable, _extends({
        ref: this.searchResultTableRef,
        renderDetailPane: this.renderSearchDetailPane,
        totalExpected: context.total
      }, _underscore["default"].pick(this.props, 'href', 'sortBy', 'sortColumn', 'sortReverse', 'currentAction', 'windowWidth', 'registerWindowOnScrollHandler', 'schemas'), {
        hiddenColumns: hiddenColumns,
        results: results,
        columnDefinitions: columnDefinitions
      })), currentAction === 'multiselect' ? _react["default"].createElement(MultiSelectStickyFooter, _extends({
        context: context,
        schemas: schemas,
        selectedItems: selectedItems
      }, {
        onComplete: this.handleMultiSelectItemCompleteClick,
        onCancel: this.handleSelectCancelClick
      })) : null));
    }
  }]);

  return ControlsAndResults;
}(_react["default"].PureComponent);

_defineProperty(ControlsAndResults, "searchItemTypesFromHref", (0, _memoizeOne["default"])(function (href, schemas) {
  var specificType = 'Item';
  var abstractType = null;

  var urlParts = _url["default"].parse(href, true);

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
}));

var SearchView = function (_React$PureComponent3) {
  _inherits(SearchView, _React$PureComponent3);

  function SearchView() {
    _classCallCheck(this, SearchView);

    return _possibleConstructorReturn(this, _getPrototypeOf(SearchView).apply(this, arguments));
  }

  _createClass(SearchView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _reactTooltip["default"].rebuild();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          propFacets = _this$props5.facets,
          propNavigate = _this$props5.navigate,
          context = _this$props5.context;
      return _react["default"].createElement("div", {
        className: "search-page-container"
      }, _react["default"].createElement(_AboveSearchTablePanel.AboveSearchTablePanel, _underscore["default"].pick(this.props, 'href', 'context', 'schemas')), _react["default"].createElement(SearchControllersContainer, _extends({}, this.props, {
        facets: propFacets || context.facets,
        navigate: propNavigate || _navigate.navigate
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
  'separateSingleTermFacets': _propTypes["default"].bool.isRequired
});

_defineProperty(SearchView, "defaultProps", {
  'href': null,
  'currentAction': null,
  'columnExtensionMap': _tableCommons.basicColumnExtensionMap,
  'separateSingleTermFacets': true
});

var MultiSelectStickyFooter = _react["default"].memo(function (props) {
  var context = props.context,
      schemas = props.schemas,
      selectedItems = props.selectedItems,
      onComplete = props.onComplete,
      onCancel = props.onCancel;
  var itemTypeFriendlyName = (0, _schemaTransforms.getSchemaTypeFromSearchContext)(context, schemas);
  return _react["default"].createElement(StickyFooter, null, _react["default"].createElement("div", {
    className: "row"
  }, _react["default"].createElement("div", {
    className: "col-12 col-md-6 text-md-left col-sm-center"
  }, _react["default"].createElement("h3", {
    className: "mt-03 mb-0"
  }, selectedItems.size, _react["default"].createElement("small", {
    className: "text-muted ml-08"
  }, itemTypeFriendlyName + (selectedItems.size === 1 ? '' : 's'), " selected"))), _react["default"].createElement("div", {
    className: "col-12 col-md-6 text-md-right col-sm-center"
  }, _react["default"].createElement("button", {
    type: "button",
    className: "btn btn-success",
    onClick: onComplete,
    disabled: selectedItems.size === 0,
    "data-tip": "Select checked items and close window"
  }, _react["default"].createElement("i", {
    className: "icon icon-fw fas icon-check"
  }), "\xA0 Apply"), _react["default"].createElement("button", {
    type: "button",
    className: "btn btn-outline-warning ml-1",
    onClick: onCancel,
    "data-tip": "Cancel selection and close window"
  }, _react["default"].createElement("i", {
    className: "icon icon-fw fas icon-times"
  }), "\xA0 Cancel"))));
});

function StickyFooter(props) {
  var children = props.children,
      passProps = _objectWithoutProperties(props, ["children"]);

  return _react["default"].createElement("div", _extends({
    className: "sticky-page-footer"
  }, passProps), _react["default"].createElement("div", {
    className: "container"
  }, children));
}