'use strict';
/* @flow */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchResultTable = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _underscore = _interopRequireDefault(require("underscore"));

var _querystring = _interopRequireDefault(require("querystring"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _reactInfinite = _interopRequireDefault(require("react-infinite"));

var _ItemDetailList = require("./../../ui/ItemDetailList");

var analytics = _interopRequireWildcard(require("./../../util/analytics"));

var _patchedConsole = require("./../../util/patched-console");

var _misc = require("./../../util/misc");

var _navigate = require("./../../util/navigate");

var _object = require("./../../util/object");

var _ajax = require("./../../util/ajax");

var _layout = require("./../../util/layout");

var _schemaTransforms = require("./../../util/schema-transforms");

var _utilities = require("./../../viz/utilities");

var _Alerts = require("./../../ui/Alerts");

var _CustomColumnController = require("./CustomColumnController");

var _ResultRowColumnBlockValue = require("./table-commons/ResultRowColumnBlockValue");

var _ColumnCombiner = require("./table-commons/ColumnCombiner");

var _HeadersRow = require("./table-commons/HeadersRow");

var _basicColumnExtensionMap = require("./table-commons/basicColumnExtensionMap");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ResultRowColumnBlock = /*#__PURE__*/_react["default"].memo(function (props) {
  var columnDefinition = props.columnDefinition,
      columnNumber = props.columnNumber,
      mounted = props.mounted,
      columnWidths = props.columnWidths,
      schemas = props.schemas,
      windowWidth = props.windowWidth;
  var field = columnDefinition.field;
  var blockWidth;

  if (mounted) {
    blockWidth = columnWidths[field] || (0, _ColumnCombiner.getColumnWidthFromDefinition)(columnDefinition, mounted, windowWidth);
  } else {
    blockWidth = (0, _ColumnCombiner.getColumnWidthFromDefinition)(columnDefinition, mounted, windowWidth);
  }

  return (
    /*#__PURE__*/
    // props includes result
    _react["default"].createElement("div", {
      className: "search-result-column-block",
      style: {
        "width": blockWidth
      },
      "data-field": field,
      "data-first-visible-column": columnNumber === 0 ? true : undefined,
      "data-column-even": columnNumber % 2 === 0
    }, /*#__PURE__*/_react["default"].createElement(_ResultRowColumnBlockValue.ResultRowColumnBlockValue, _extends({}, props, {
      width: blockWidth,
      schemas: schemas
    })))
  );
});
/** Not used anywhere (?) */


var DefaultDetailPane = /*#__PURE__*/_react["default"].memo(function (_ref) {
  var result = _ref.result;
  return /*#__PURE__*/_react["default"].createElement("div", null, result.description ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "flexible-description-box result-table-result-heading"
  }, result.description) : null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "item-page-detail"
  }, /*#__PURE__*/_react["default"].createElement("h4", {
    className: "text-300"
  }, "Details"), /*#__PURE__*/_react["default"].createElement(_ItemDetailList.Detail, {
    context: result,
    open: false
  })));
});

var ResultDetail = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ResultDetail, _React$PureComponent);

  var _super = _createSuper(ResultDetail);

  function ResultDetail(props) {
    var _this;

    _classCallCheck(this, ResultDetail);

    _this = _super.call(this, props);
    _this.setDetailHeightFromPane = _this.setDetailHeightFromPane.bind(_assertThisInitialized(_this));
    _this.state = {
      'closing': false
    };
    _this.detailRef = /*#__PURE__*/_react["default"].createRef(); // Unsure if worth keeping/using still?
    // Is potentially relevant but not ideally-implemented for BrowseView
    // which has DetailPane which itself has collapsible areas and the height
    // can thus vary outside of the open/closed toggle state in this table.
    // Ideally, those things could hook into `setDetailHeight` maybe...

    _this.lastFoundHeight = null;
    return _this;
  }
  /**
   * @todo Call this function in ExperimentSetDetailPane to keep heights up-to-date
   * when Processed Files or Raw Files sections are expanded/collapsed as well as just row itself.
   */


  _createClass(ResultDetail, [{
    key: "setDetailHeightFromPane",
    value: function setDetailHeightFromPane() {
      var height = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var setDetailHeight = this.props.setDetailHeight;
      var domElem = null;

      if (typeof height !== 'number') {
        domElem = this.detailRef && this.detailRef.current;
        height = domElem && parseInt(domElem.offsetHeight);

        if (typeof height === 'number' && !isNaN(height)) {
          height += 2; // Account for border top & bottom of outer container

          this.lastFoundHeight = height;
        }
      }

      if (isNaN(height) || typeof height !== 'number') {
        height = this.lastFoundHeight || null;
      }

      setDetailHeight(height);
      return height;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var _this$props = this.props,
          open = _this$props.open,
          setDetailHeight = _this$props.setDetailHeight,
          result = _this$props.result,
          context = _this$props.context,
          rowNumber = _this$props.rowNumber,
          href = _this$props.href,
          isOwnPage = _this$props.isOwnPage;
      var pastOpen = pastProps.open;

      if (pastOpen !== open) {
        if (open && typeof setDetailHeight === 'function') {
          this.setDetailHeightFromPane();
          var display_title = result.display_title;
          analytics.productAddDetailViewed(result, context, {
            "position": rowNumber,
            "list": isOwnPage ? "Embedded Search View" : analytics.hrefToListName(href)
          });
          analytics.event("SearchResult DetailPane", "Opened", {
            eventLabel: display_title
          });
        } else if (!open && typeof setDetailHeight === 'function') {
          setDetailHeight(null); // Unset back to default (rowHeight)
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          open = _this$props2.open,
          rowNumber = _this$props2.rowNumber,
          result = _this$props2.result,
          _this$props2$isOwnPag = _this$props2.isOwnPage,
          isOwnPage = _this$props2$isOwnPag === void 0 ? true : _this$props2$isOwnPag,
          tableContainerWidth = _this$props2.tableContainerWidth,
          tableContainerScrollLeft = _this$props2.tableContainerScrollLeft,
          propDetailPane = _this$props2.detailPane,
          renderDetailPane = _this$props2.renderDetailPane,
          toggleDetailOpen = _this$props2.toggleDetailOpen,
          setDetailHeight = _this$props2.setDetailHeight,
          detailPaneHeight = _this$props2.detailPaneHeight;
      var closing = this.state.closing; // Account for vertical scrollbar decreasing width of container.

      var containerWidth = isOwnPage ? tableContainerWidth : tableContainerWidth - 30;
      var propsFromTable = {
        open: open,
        toggleDetailOpen: toggleDetailOpen,
        tableContainerScrollLeft: tableContainerScrollLeft,
        setDetailHeight: setDetailHeight,
        detailPaneHeight: detailPaneHeight,
        setDetailHeightFromPane: this.setDetailHeightFromPane
      };
      var detailPane = /*#__PURE__*/_react["default"].isValidElement(propDetailPane) ? /*#__PURE__*/_react["default"].cloneElement(propDetailPane, {
        result: result,
        rowNumber: rowNumber,
        containerWidth: containerWidth,
        propsFromTable: propsFromTable
      }) : typeof renderDetailPane === "function" ? renderDetailPane(result, rowNumber, containerWidth, propsFromTable) : null;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "result-table-detail-container detail-" + (open || closing ? 'open' : 'closed'),
        style: {
          minHeight: detailPaneHeight
        }
      }, open ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "result-table-detail",
        ref: this.detailRef,
        style: {
          width: containerWidth,
          transform: _utilities.style.translate3d(tableContainerScrollLeft)
        }
      }, detailPane, /*#__PURE__*/_react["default"].createElement("div", {
        className: "close-button-container text-center",
        onClick: toggleDetailOpen,
        "data-tip": "Collapse Details"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-angle-up fas"
      }))) : /*#__PURE__*/_react["default"].createElement("div", null));
    }
  }]);

  return ResultDetail;
}(_react["default"].PureComponent);

_defineProperty(ResultDetail, "propTypes", {
  'result': _propTypes["default"].object.isRequired,
  'open': _propTypes["default"].bool.isRequired,
  'renderDetailPane': _propTypes["default"].func.isRequired,
  'rowNumber': _propTypes["default"].number,
  'toggleDetailOpen': _propTypes["default"].func.isRequired,
  'setDetailHeight': _propTypes["default"].func.isRequired,
  'tableContainerWidth': _propTypes["default"].number,
  'tableContainerScrollLeft': _propTypes["default"].number,
  'id': _propTypes["default"].string,
  'detailPaneHeight': _propTypes["default"].number
});

var ResultRow = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(ResultRow, _React$PureComponent2);

  var _super2 = _createSuper(ResultRow);

  _createClass(ResultRow, null, [{
    key: "areWidthsEqual",
    value: function areWidthsEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;

      for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }

      return true;
    }
  }, {
    key: "getStyles",
    value: function getStyles(rowWidth) {
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 47;
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      return {
        /* inner: { minHeight: rowHeight - rowBottomPadding }, */
        outer: {
          minWidth: rowWidth
        }
      };
    }
  }]);

  function ResultRow(props) {
    var _this2;

    _classCallCheck(this, ResultRow);

    _this2 = _super2.call(this, props);
    _this2.toggleDetailOpen = _underscore["default"].throttle(_this2.toggleDetailOpen.bind(_assertThisInitialized(_this2)), 250);
    _this2.setDetailHeight = _this2.setDetailHeight.bind(_assertThisInitialized(_this2));
    _this2.handleDragStart = _this2.handleDragStart.bind(_assertThisInitialized(_this2));
    _this2.memoized = {
      getStyles: (0, _memoizeOne["default"])(ResultRow.getStyles)
    };
    return _this2;
  } // componentDidUpdate(pastProps){
  //     _.keys(this.props).forEach((k)=>{
  //         if (pastProps[k] !== this.props[k]){
  //             console.log(k, this.props[k], pastProps[k]);
  //         }
  //     });
  // }


  _createClass(ResultRow, [{
    key: "setDetailHeight",
    value: function setDetailHeight() {
      var _this$props3 = this.props,
          id = _this$props3.id,
          parentSetDetailHeight = _this$props3.setDetailHeight;
      parentSetDetailHeight.apply(void 0, [id].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "toggleDetailOpen",
    value: function toggleDetailOpen() {
      var _this$props4 = this.props,
          id = _this$props4.id,
          toggleDetailPaneOpen = _this$props4.toggleDetailPaneOpen;
      toggleDetailPaneOpen(id);
    }
    /** Add some JSON data about the result item upon initiating dragstart. */

  }, {
    key: "handleDragStart",
    value: function handleDragStart(evt) {
      if (!evt || !evt.dataTransfer) return;
      var _this$props5 = this.props,
          result = _this$props5.result,
          href = _this$props5.href,
          schemas = _this$props5.schemas; // TODO: handle lack of href and grab from window.location instead.
      // Result JSON itself.

      evt.dataTransfer.setData('text/4dn-item-json', JSON.stringify(result)); // Result URL and @id.

      var hrefParts = typeof href === "string" ? _url["default"].parse(href) : window.location;

      var atId = _object.itemUtil.atId(result);

      var formedURL = (hrefParts.protocol || '') + (hrefParts.hostname ? '//' + hrefParts.hostname + (hrefParts.port ? ':' + hrefParts.port : '') : '') + atId;
      evt.dataTransfer.setData('text/plain', formedURL);
      evt.dataTransfer.setData('text/uri-list', formedURL);
      evt.dataTransfer.setData('text/4dn-item-id', atId); // Add cool drag image (generate HTML element showing display_title and item type)

      if (!document || !document.createElement) return;
      var element = document.createElement('div');
      element.className = "draggable-item-cursor";
      var innerText = result.display_title; // document.createTextNode('')

      var innerBoldElem = document.createElement('strong');
      innerBoldElem.appendChild(document.createTextNode(innerText));
      element.appendChild(innerBoldElem);
      element.appendChild(document.createElement('br'));
      innerText = (0, _schemaTransforms.getItemTypeTitle)(result, schemas); // document.createTextNode('')

      element.appendChild(document.createTextNode(innerText));
      document.body.appendChild(element);
      evt.dataTransfer.setDragImage(element, 150, 30);
      setTimeout(function () {
        document.body.removeChild(element);
      }, 10);
    }
  }, {
    key: "renderColumns",
    value: function renderColumns() {
      var _this3 = this;

      // TODO (?) prop func to do this to control which columns get which props.
      var columnDefinitions = this.props.columnDefinitions; // Contains required 'result', 'rowNumber', 'href', 'columnWidths', 'mounted', 'windowWidth', 'schemas', 'currentAction', 'detailOpen'

      var commonProps = _underscore["default"].omit(this.props, 'tableContainerWidth', 'tableContainerScrollLeft', 'renderDetailPane', 'detailPane', 'id', 'toggleDetailPaneOpen');

      return columnDefinitions.map(function (columnDefinition, columnNumber) {
        // todo: rename columnNumber to columnIndex
        var field = columnDefinition.field;

        var passedProps = _objectSpread(_objectSpread({}, commonProps), {}, {
          columnDefinition: columnDefinition,
          columnNumber: columnNumber,
          // Only needed on first column (contains title, checkbox)
          'toggleDetailOpen': columnNumber === 0 ? _this3.toggleDetailOpen : null
        });

        return /*#__PURE__*/_react["default"].createElement(ResultRowColumnBlock, _extends({}, passedProps, {
          key: field
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          rowNumber = _this$props6.rowNumber,
          currentAction = _this$props6.currentAction,
          rowHeight = _this$props6.rowHeight,
          rowWidth = _this$props6.rowWidth,
          detailOpen = _this$props6.detailOpen;
      var isDraggable = (0, _misc.isSelectAction)(currentAction);
      var styles = this.memoized.getStyles(rowWidth, rowHeight);
      /**
       * Props passed to ResultDetail include:
       * `result`, `renderDetailPane`, `rowNumber`, `tableContainerWidth`, `tableContainerScrollLeft`.
       */

      var detailProps = _underscore["default"].omit(this.props, 'mounted', 'columnDefinitions', 'detailOpen', 'setDetailHeight', 'columnWidths', 'setColumnWidths');

      var cls = "search-result-row" + " detail-" + (detailOpen ? 'open' : 'closed') + (isDraggable ? ' is-draggable' : '');
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: cls,
        "data-row-number": rowNumber,
        style: styles.outer
        /* ref={(r)=>{
        // TODO POTENTIALLY: Use to set height on open/close icon & sticky title column.
        var height = (r && r.offsetHeight) || null;
        if (height && height !== this.rowFullHeight){
        this.rowFullHeight = height;
        }
        }}*/

      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "columns clearfix result-table-row",
        draggable: isDraggable,
        style: styles.inner // Account for 1px border bottom on parent div
        ,
        onDragStart: isDraggable ? this.handleDragStart : null
      }, this.renderColumns()), /*#__PURE__*/_react["default"].createElement(ResultDetail, _extends({}, detailProps, {
        open: !!detailOpen,
        detailPaneHeight: typeof detailOpen === "number" ? detailOpen : undefined,
        toggleDetailOpen: this.toggleDetailOpen,
        setDetailHeight: this.setDetailHeight
      })));
    }
  }]);

  return ResultRow;
}(_react["default"].PureComponent);

_defineProperty(ResultRow, "propTypes", {
  'result': _propTypes["default"].shape({
    '@type': _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
    '@id': _propTypes["default"].string,
    'lab': _propTypes["default"].object,
    'display_title': _propTypes["default"].string.isRequired,
    'status': _propTypes["default"].string,
    'date_created': _propTypes["default"].string.isRequired
  }).isRequired,
  'rowNumber': _propTypes["default"].number.isRequired,
  'rowHeight': _propTypes["default"].number,
  'mounted': _propTypes["default"].bool.isRequired,
  'columnDefinitions': _HeadersRow.HeadersRow.propTypes.columnDefinitions,
  'columnWidths': _propTypes["default"].objectOf(_propTypes["default"].number),
  'renderDetailPane': _propTypes["default"].func.isRequired,
  'detailPane': _propTypes["default"].element,
  'detailOpen': _propTypes["default"].bool.isRequired,
  'setDetailHeight': _propTypes["default"].func.isRequired,
  'id': _propTypes["default"].string.isRequired,
  'context': _propTypes["default"].object.isRequired
});

var LoadMoreAsYouScroll = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(LoadMoreAsYouScroll, _React$PureComponent3);

  var _super3 = _createSuper(LoadMoreAsYouScroll);

  _createClass(LoadMoreAsYouScroll, null, [{
    key: "canLoadMore",
    value: function canLoadMore(totalExpected, results) {
      return totalExpected > results.length;
    }
    /**
     * Used for memoization of styles that dont frequently change (prevent needless PureComponent updates).
     * `scrollableStyle` is applied to Infinite's outermost div element/container.
     */

  }, {
    key: "getStyles",
    value: function getStyles(maxHeight) {
      var styles = {};
      styles.scrollableStyle = {
        maxHeight: maxHeight,
        height: null,
        // Unset, let maxHeight take over.
        overflow: "auto" // Override "hidden scroll" default.

      };
      return styles;
    }
  }]);

  function LoadMoreAsYouScroll(props) {
    var _this4;

    _classCallCheck(this, LoadMoreAsYouScroll);

    _this4 = _super3.call(this, props);
    _this4.handleLoad = _underscore["default"].throttle(_this4.handleLoad.bind(_assertThisInitialized(_this4)), 3000); //this.handleScrollingStateChange = this.handleScrollingStateChange.bind(this);
    //this.handleScrollExt = this.handleScrollExt.bind(this);

    _this4.state = {
      'isLoading': false
    };

    if (typeof props.mounted === 'undefined') {
      _this4.state.mounted = false;
    }

    _this4.memoized = {
      getStyles: (0, _memoizeOne["default"])(LoadMoreAsYouScroll.getStyles)
    };
    _this4.lastIsScrolling = false;
    _this4.infiniteComponentRef = /*#__PURE__*/_react["default"].createRef();
    _this4.currRequest = null;
    return _this4;
  }

  _createClass(LoadMoreAsYouScroll, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (typeof this.state.mounted === 'boolean') {
        this.setState({
          'mounted': true
        });
      }
    }
  }, {
    key: "handleLoad",
    value: function handleLoad() {
      var _this5 = this;

      var _this$props7 = this.props,
          origHref = _this$props7.href,
          origCompoundFilterSet = _this$props7.requestedCompoundFilterSet,
          _this$props7$results = _this$props7.results,
          existingResults = _this$props7$results === void 0 ? [] : _this$props7$results,
          _this$props7$isOwnPag = _this$props7.isOwnPage,
          isOwnPage = _this$props7$isOwnPag === void 0 ? true : _this$props7$isOwnPag,
          onDuplicateResultsFoundCallback = _this$props7.onDuplicateResultsFoundCallback,
          setResults = _this$props7.setResults,
          _this$props7$navigate = _this$props7.navigate,
          navigate = _this$props7$navigate === void 0 ? _navigate.navigate : _this$props7$navigate;
      var nextFromValue = existingResults.length;
      var nextHref = null;
      var nextCompoundFilterSetRequest = null;

      if (typeof origHref === "string") {
        var parts = _url["default"].parse(origHref, true); // memoizedUrlParse not used in case is EmbeddedSearchView.


        var query = parts.query;
        query.from = nextFromValue;
        parts.search = '?' + _querystring["default"].stringify(query);
        nextHref = _url["default"].format(parts);
      } else {
        nextCompoundFilterSetRequest = _objectSpread(_objectSpread({}, origCompoundFilterSet), {}, {
          "from": nextFromValue
        });
      }

      var requestInThisScope = null;

      if (this.currRequest) {
        this.currRequest.abort();
      }

      var loadCallback = function (resp) {
        if (requestInThisScope !== _this5.currRequest) {
          // Shouldn't occur - extra redundancy
          _patchedConsole.patchedConsoleInstance.warn("Throwing out outdated load-more-as-you-scroll request.");

          return false;
        }

        var _ref2$Graph = (resp || {})['@graph'],
            nextResults = _ref2$Graph === void 0 ? [] : _ref2$Graph;
        var nextResultsLen = nextResults.length;

        if (nextResultsLen > 0) {
          // Check if have same result, if so, refresh all results (something has changed on back-end)
          var oldKeys = _underscore["default"].map(existingResults, _object.itemUtil.atId);

          var newKeys = _underscore["default"].map(nextResults, _object.itemUtil.atId);

          var keyIntersection = _underscore["default"].intersection(oldKeys.sort(), newKeys.sort());

          if (keyIntersection.length > 0) {
            _patchedConsole.patchedConsoleInstance.error('FOUND ALREADY-PRESENT RESULT IN NEW RESULTS', keyIntersection, newKeys);

            _this5.setState({
              'isLoading': false
            }, function () {
              navigate('', {
                'inPlace': true
              }, onDuplicateResultsFoundCallback);
            });
          } else {
            _this5.setState({
              'isLoading': false
            }, function () {
              analytics.impressionListOfItems(nextResults, nextHref || window.location.href, isOwnPage ? analytics.hrefToListName(nextHref) : "Embedded Search View");
              analytics.event('SearchResultTable', "Loaded More Results", {
                eventValue: nextFromValue
              });
              setResults(existingResults.slice(0).concat(nextResults));
            });
          }
        } else {
          _this5.setState({
            'isLoading': false
          });
        }

        _this5.currRequest = null;
      };

      this.setState({
        'isLoading': true
      }, function () {
        _this5.currRequest = requestInThisScope = (0, _ajax.load)(nextCompoundFilterSetRequest ? "/compound_search" : nextHref, loadCallback, nextCompoundFilterSetRequest ? "POST" : "GET", loadCallback, nextCompoundFilterSetRequest ? JSON.stringify(nextCompoundFilterSetRequest) : null);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          children = _this$props8.children,
          rowHeight = _this$props8.rowHeight,
          openDetailPanes = _this$props8.openDetailPanes,
          openRowHeight = _this$props8.openRowHeight,
          tableContainerWidth = _this$props8.tableContainerWidth,
          tableContainerScrollLeft = _this$props8.tableContainerScrollLeft,
          propMounted = _this$props8.mounted,
          isOwnPage = _this$props8.isOwnPage,
          maxHeight = _this$props8.maxHeight,
          canLoadMore = _this$props8.canLoadMore;
      var _this$state = this.state,
          stateMounted = _this$state.mounted,
          isLoading = _this$state.isLoading;

      if (!(propMounted || stateMounted)) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "react-infinite-container"
        }, /*#__PURE__*/_react["default"].createElement("div", null, children));
      }

      var elementHeight = _underscore["default"].keys(openDetailPanes).length === 0 ? rowHeight : _react["default"].Children.map(children, function (c) {
        // openRowHeight + openDetailPane height
        var savedHeight = openDetailPanes[c.props.id];

        if (savedHeight && typeof savedHeight === 'number') {
          return openDetailPanes[c.props.id] + openRowHeight;
        }

        return rowHeight;
      });
      return /*#__PURE__*/_react["default"].createElement(_reactInfinite["default"], {
        className: "react-infinite-container",
        ref: this.infiniteComponentRef,
        elementHeight: elementHeight,
        containerHeight: !isOwnPage && maxHeight || undefined,
        useWindowAsScrollContainer: isOwnPage,
        onInfiniteLoad: this.handleLoad,
        isInfiniteLoading: isLoading,
        timeScrollStateLastsForAfterUserScrolls: 250 //onChangeScrollState={this.handleScrollingStateChange}
        ,
        loadingSpinnerDelegate: /*#__PURE__*/_react["default"].createElement(LoadingSpinner, {
          width: tableContainerWidth,
          scrollLeft: tableContainerScrollLeft
        }),
        infiniteLoadBeginEdgeOffset: canLoadMore ? 200 : undefined,
        preloadAdditionalHeight: _reactInfinite["default"].containerHeightScaleFactor(1.5),
        preloadBatchSize: _reactInfinite["default"].containerHeightScaleFactor(1.5),
        styles: isOwnPage ? null : this.memoized.getStyles(maxHeight)
      }, children);
    }
  }]);

  return LoadMoreAsYouScroll;
}(_react["default"].PureComponent);

_defineProperty(LoadMoreAsYouScroll, "propTypes", {
  'href': _propTypes["default"].string.isRequired,
  'results': _propTypes["default"].array.isRequired,
  // From parent
  'rowHeight': _propTypes["default"].number.isRequired,
  'isOwnPage': _propTypes["default"].bool.isRequired,
  'maxHeight': _propTypes["default"].number,
  'tableContainerScrollLeft': _propTypes["default"].number.isRequired,
  // From parent
  'tableContainerWidth': _propTypes["default"].number.isRequired,
  // From parent
  'setResults': _propTypes["default"].func.isRequired,
  // From parent
  'openDetailPanes': _propTypes["default"].objectOf(_propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].bool])).isRequired,
  // From parent
  'canLoadMore': _propTypes["default"].bool.isRequired,
  // From parent
  'children': _propTypes["default"].arrayOf(_propTypes["default"].element).isRequired,
  // From parent
  'mounted': _propTypes["default"].bool,
  'onDuplicateResultsFoundCallback': _propTypes["default"].func,
  'navigate': _propTypes["default"].func,
  'openRowHeight': _propTypes["default"].number.isRequired
});

_defineProperty(LoadMoreAsYouScroll, "defaultProps", {
  'debouncePointerEvents': 150,
  'onDuplicateResultsFoundCallback': function onDuplicateResultsFoundCallback() {
    _Alerts.Alerts.queue({
      'title': 'Results Refreshed',
      'message': 'Results have changed while loading and have been refreshed.',
      'navigateDisappearThreshold': 1
    });
  },
  'isOwnPage': true
});

var LoadingSpinner = /*#__PURE__*/_react["default"].memo(function (_ref3) {
  var maxWidth = _ref3.width,
      _ref3$scrollLeft = _ref3.scrollLeft,
      scrollLeft = _ref3$scrollLeft === void 0 ? 0 : _ref3$scrollLeft;
  var style = {
    maxWidth: maxWidth,
    'transform': _utilities.style.translate3d(scrollLeft)
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "search-result-row loading text-center d-flex align-items-center justify-content-center",
    style: style
  }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("i", {
    className: "icon icon-circle-notch icon-spin fas"
  }), "\xA0 Loading..."));
});

var ShadowBorderLayer = /*#__PURE__*/function (_React$Component) {
  _inherits(ShadowBorderLayer, _React$Component);

  var _super4 = _createSuper(ShadowBorderLayer);

  _createClass(ShadowBorderLayer, null, [{
    key: "shadowStateClass",
    value: function shadowStateClass() {
      var hiddenLeftEdgeContentWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var hiddenRightEdgeContentWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var shadowBorderClassName = "";
      if (hiddenLeftEdgeContentWidth > 0) shadowBorderClassName += ' shadow-left';
      if (hiddenRightEdgeContentWidth > 0) shadowBorderClassName += ' shadow-right';
      return shadowBorderClassName;
    }
  }, {
    key: "edgeHiddenContentWidths",
    value: function edgeHiddenContentWidths(fullRowWidth, tableContainerScrollLeft, tableContainerWidth) {
      var edges = {
        'left': 0,
        'right': 0
      };

      if (fullRowWidth > tableContainerWidth) {
        if (tableContainerScrollLeft > 5) {
          edges.left = tableContainerScrollLeft;
        }

        if (tableContainerScrollLeft + tableContainerWidth <= fullRowWidth - 5) {
          edges.right = fullRowWidth - tableContainerWidth - tableContainerScrollLeft;
        }
      }

      return edges;
    }
  }]);

  function ShadowBorderLayer(props) {
    var _this6;

    _classCallCheck(this, ShadowBorderLayer);

    _this6 = _super4.call(this, props);
    _this6.scrolling = false;
    _this6.performScrollAction = _this6.performScrollAction.bind(_assertThisInitialized(_this6));
    _this6.handleLeftScrollButtonMouseDown = _this6.handleScrollButtonMouseDown.bind(_assertThisInitialized(_this6), 'left');
    _this6.handleRightScrollButtonMouseDown = _this6.handleScrollButtonMouseDown.bind(_assertThisInitialized(_this6), 'right');
    _this6.handleScrollButtonUp = _this6.handleScrollButtonUp.bind(_assertThisInitialized(_this6));
    _this6.memoized = {
      edgeHiddenContentWidths: (0, _memoizeOne["default"])(ShadowBorderLayer.edgeHiddenContentWidths)
    };
    return _this6;
  }

  _createClass(ShadowBorderLayer, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _this$props9 = this.props,
          fullRowWidth = _this$props9.fullRowWidth,
          tableContainerScrollLeft = _this$props9.tableContainerScrollLeft,
          tableContainerWidth = _this$props9.tableContainerWidth;
      var nxtRowWidth = nextProps.fullRowWidth,
          nxtLeft = nextProps.tableContainerScrollLeft,
          nxtTableWidth = nextProps.tableContainerWidth;
      if (typeof nextProps.tableContainerWidth !== "number") return false;
      var pastEdges = this.memoized.edgeHiddenContentWidths(fullRowWidth, tableContainerScrollLeft, tableContainerWidth);
      var newEdges = ShadowBorderLayer.edgeHiddenContentWidths(nxtRowWidth, nxtLeft, nxtTableWidth);
      if (newEdges.left !== pastEdges.left || newEdges.right !== pastEdges.right) return true;
      return false;
    }
  }, {
    key: "handleScrollButtonMouseDown",
    value: function handleScrollButtonMouseDown() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "right";
      var evt = arguments.length > 1 ? arguments[1] : undefined;

      if (evt.button === 0) {
        // Left click
        this.scrolling = true;
        this.performScrollAction(direction);
      }
    }
  }, {
    key: "performScrollAction",
    value: function performScrollAction() {
      var _this7 = this;

      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "right";
      var _this$props10 = this.props,
          horizontalScrollRateOnEdgeButton = _this$props10.horizontalScrollRateOnEdgeButton,
          tableContainerWidth = _this$props10.tableContainerWidth,
          fullRowWidth = _this$props10.fullRowWidth,
          tableContainerScrollLeft = _this$props10.tableContainerScrollLeft,
          getScrollContainer = _this$props10.getScrollContainer,
          setContainerScrollLeft = _this$props10.setContainerScrollLeft;

      var scrollAction = function (depth) {
        var scrollContainer = getScrollContainer();
        if (!scrollContainer) return;
        var change = (direction === 'right' ? 1 : -1) * horizontalScrollRateOnEdgeButton;
        var leftOffset = Math.max(0, Math.min(fullRowWidth - tableContainerWidth, scrollContainer.scrollLeft + change));
        scrollContainer.scrollLeft = leftOffset;
        setContainerScrollLeft(leftOffset);

        if (depth >= 10000) {
          _patchedConsole.patchedConsoleInstance.error("Reached depth 10k on a recursive function 'performScrollAction.'");

          return;
        }

        if (_this7.scrolling) {
          (0, _utilities.requestAnimationFrame)(function () {
            scrollAction(depth + 1);
          });
        }
      };

      scrollAction(0);
    }
  }, {
    key: "handleScrollButtonUp",
    value: function handleScrollButtonUp() {
      this.scrolling = false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props11 = this.props,
          tableContainerWidth = _this$props11.tableContainerWidth,
          fullRowWidth = _this$props11.fullRowWidth,
          tableContainerScrollLeft = _this$props11.tableContainerScrollLeft,
          _this$props11$fixedPo = _this$props11.fixedPositionArrows,
          fixedPositionArrows = _this$props11$fixedPo === void 0 ? true : _this$props11$fixedPo;
      if (!tableContainerWidth) return null;
      if (fullRowWidth <= tableContainerWidth) return null;
      var edges = this.memoized.edgeHiddenContentWidths(fullRowWidth, tableContainerScrollLeft, tableContainerWidth);
      var cls = "shadow-border-layer hidden-xs" + ShadowBorderLayer.shadowStateClass(edges.left, edges.right) + (fixedPositionArrows ? ' fixed-position-arrows' : '');
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: cls
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "edge-scroll-button left-edge" + (typeof edges.left !== 'number' || edges.left === 0 ? " faded-out" : ""),
        onMouseDown: this.handleLeftScrollButtonMouseDown,
        onMouseUp: this.handleScrollButtonUp,
        onMouseOut: this.handleScrollButtonUp
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-caret-left fas"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "edge-scroll-button right-edge" + (typeof edges.right !== 'number' || edges.right === 0 ? " faded-out" : ""),
        onMouseDown: this.handleRightScrollButtonMouseDown,
        onMouseUp: this.handleScrollButtonUp,
        onMouseOut: this.handleScrollButtonUp
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-caret-right fas"
      })));
    }
  }]);

  return ShadowBorderLayer;
}(_react["default"].Component);

_defineProperty(ShadowBorderLayer, "defaultProps", {
  'horizontalScrollRateOnEdgeButton': 10
});

var DimensioningContainer = /*#__PURE__*/function (_React$PureComponent4) {
  _inherits(DimensioningContainer, _React$PureComponent4);

  var _super5 = _createSuper(DimensioningContainer);

  _createClass(DimensioningContainer, null, [{
    key: "setDetailPanesLeftOffset",
    value: function setDetailPanesLeftOffset(detailPanes) {
      var leftOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (detailPanes && detailPanes.length > 0) {
        var transformStyle = _utilities.style.translate3d(leftOffset);

        _underscore["default"].forEach(detailPanes, function (d) {
          d.style.transform = transformStyle;
        });
      }

      if (typeof cb === 'function') cb();
    }
  }, {
    key: "findDetailPaneElements",
    value: function findDetailPaneElements() {
      if (document && document.querySelectorAll) {
        return Array.from(document.querySelectorAll('.result-table-detail'));
      }

      return null;
    }
  }, {
    key: "fullRowWidth",
    value: function fullRowWidth(visibleColumnDefinitions) {
      var mounted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var dynamicWidths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var windowWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      return _underscore["default"].reduce(visibleColumnDefinitions, function (fw, colDef) {
        var w;

        if (dynamicWidths && typeof dynamicWidths[colDef.field] === "number") {
          w = dynamicWidths[colDef.field];
        } else {
          w = (0, _ColumnCombiner.getColumnWidthFromDefinition)(colDef, mounted, windowWidth);
        }

        if (isNaN(w)) {
          throw new Error("Could not get row/col width");
        }

        return fw + w;
      }, 0);
    }
  }, {
    key: "getTableDims",
    value: function getTableDims(scrollContainer, windowWidth) {
      if (!SearchResultTable.isDesktopClientside(windowWidth)) {
        return {
          'tableContainerWidth': scrollContainer && scrollContainer.offsetWidth || null,
          'tableContainerScrollLeft': null
        };
      }

      return {
        'tableContainerWidth': scrollContainer && scrollContainer.offsetWidth || null,
        'tableContainerScrollLeft': scrollContainer && typeof scrollContainer.scrollLeft === 'number' ? scrollContainer.scrollLeft : null
      };
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(_ref4, _ref5) {
      var ctxResults = _ref4.results;
      var originalResults = _ref5.originalResults;

      if (ctxResults !== originalResults) {
        // `context` has changed upstream, reset results and detail panes.
        return {
          'results': ctxResults.slice(0),
          'openDetailPanes': {},
          'originalResults': ctxResults
        };
      }

      return null;
    }
  }]);

  function DimensioningContainer(props) {
    var _this8;

    _classCallCheck(this, DimensioningContainer);

    _this8 = _super5.call(this, props);
    _this8.getScrollContainer = _this8.getScrollContainer.bind(_assertThisInitialized(_this8));
    _this8.getScrollableElement = _this8.getScrollableElement.bind(_assertThisInitialized(_this8));
    _this8.throttledUpdate = _underscore["default"].debounce(_this8.forceUpdate.bind(_assertThisInitialized(_this8)), 500);
    _this8.toggleDetailPaneOpen = _underscore["default"].throttle(_this8.toggleDetailPaneOpen.bind(_assertThisInitialized(_this8)), 500);
    _this8.setDetailHeight = _this8.setDetailHeight.bind(_assertThisInitialized(_this8)); //this.setContainerScrollLeft = this.setContainerScrollLeft.bind(this);

    _this8.setContainerScrollLeft = _underscore["default"].throttle(_this8.setContainerScrollLeft.bind(_assertThisInitialized(_this8)), 250);
    _this8.onHorizontalScroll = _this8.onHorizontalScroll.bind(_assertThisInitialized(_this8));
    _this8.setResults = _this8.setResults.bind(_assertThisInitialized(_this8));
    _this8.canLoadMore = _this8.canLoadMore.bind(_assertThisInitialized(_this8));
    _this8.state = {
      'mounted': false,
      'results': props.results.slice(0),
      // { row key : detail pane height } used for determining if detail pane is open + height for Infinite listview
      'openDetailPanes': {},
      'tableContainerScrollLeft': 0,
      'tableContainerWidth': 0,
      'originalResults': props.results // Reference to original results in order to utilize getDerivedStateFromProps.

    };

    if (_this8.state.results.length > 0 && Array.isArray(props.defaultOpenIndices) && props.defaultOpenIndices.length > 0) {
      _this8.state.openDetailPanes[_object.itemUtil.atId(_this8.state.results[0])] = true;
    }

    _this8.outerRef = /*#__PURE__*/_react["default"].createRef();
    _this8.outerContainerSizeInterval = null;
    _this8.scrollHandlerUnsubscribeFxn = null;
    _this8.memoized = {
      fullRowWidth: (0, _memoizeOne["default"])(DimensioningContainer.fullRowWidth)
    };
    return _this8;
  }

  _createClass(DimensioningContainer, [{
    key: "getScrollContainer",
    value: function getScrollContainer() {
      var outerContainerElem = this.outerRef.current; // THIS IS SUBJECT TO CHANGE RE: REACT-INFINITE LIBRARY. ACCESSING IN SUCH WAY IS ANTI-PATTERN TO BEGIN WITH...
      // React-infinite hasn't been updated as of mid-2018 (as of January 2020) so certain newer patterns aren't being utilized,
      // such as forwardRef. Theoretically it might be worth considering making PRs to the library if can be more certain they'd be
      // reviewed and merged..
      //const scrollContainer = infiniteComponent && infiniteComponent.scrollable;

      var scrollContainer = outerContainerElem.querySelector(".react-infinite-container");

      if (!scrollContainer) {
        throw new Error("Could not get scroll container from React-Infinite. Check to see if library has been updated");
      }

      return scrollContainer;
    }
  }, {
    key: "getScrollableElement",
    value: function getScrollableElement() {
      return this.getScrollContainer().children[0];
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this9 = this;

      // Maybe todo: play with 'experimental technology' for controlling columing widths (& compare performance),
      // see https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/styleSheets
      // and https://developer.mozilla.org/en-US/docs/Web/API/CSSStylesheet.
      // Probably do in separate component since seems like hefty-enough logic to separate/modularize.
      // this.isDynamicStylesheetSupported = typeof document.styleSheets !== "undefined";
      // if (this.isDynamicStylesheetSupported) {
      //    insert new <style> element somewhere (new stylesheet?), save reference (prly doesnt do ton.. w/e)
      //    check that new sheet exists in document.styleSheets, start setting widths per column via CSS rules
      //    deleting and inserting upon any changes, accordingly. Use componentDidUpdate or useEffect for this,
      //    re: props.widths (this table's state.widths) changes.
      //    (This all within new component if supported, else pass widths down to cols as fallback (?) from this component)
      // }
      // Detect if table width changes (and update dims if true) every 5sec
      // No way to attach resize event listener to an element (only to window)
      // and element might change width independent of window (e.g. open/hide
      // facetlist in future, expand table to fullscreen, etc.)
      this.outerContainerSizeInterval = setInterval(function () {
        _this9.setState(function (_ref6, _ref7) {
          var pastWidth = _ref6.tableContainerWidth;
          var windowWidth = _ref7.windowWidth;
          var currDims = DimensioningContainer.getTableDims(_this9.getScrollContainer(), windowWidth);

          if (pastWidth !== currDims.tableContainerWidth) {
            return currDims;
          }

          return null;
        });
      }, 5000);
      this.setState({
        'mounted': true
      }, _reactTooltip["default"].rebuild);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.scrollHandlerUnsubscribeFxn) {
        this.scrollHandlerUnsubscribeFxn();
        delete this.scrollHandlerUnsubscribeFxn;
      }

      if (this.outerContainerSizeInterval) {
        clearInterval(this.outerContainerSizeInterval);
        this.outerContainerSizeInterval = null;
      }

      var scrollContainer = this.getScrollContainer();
      scrollContainer && scrollContainer.removeEventListener('scroll', this.onHorizontalScroll);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var _this$state2 = this.state,
          loadedResults = _this$state2.results,
          mounted = _this$state2.mounted;
      var pastLoadedResults = pastState.results,
          pastMounted = pastState.mounted;
      var windowWidth = this.props.windowWidth;
      var pastWindowWidth = pastProps.windowWidth;

      if (pastLoadedResults !== loadedResults) {
        _reactTooltip["default"].rebuild();
      }

      var didMount = !pastMounted && mounted;

      if (didMount || pastWindowWidth !== windowWidth) {
        // This used to be in componentDidMount, however X-axis scroll container is now react-infinite elem
        // which doesn't appear until after mount
        var scrollContainer = this.getScrollContainer();
        var nextState = DimensioningContainer.getTableDims(scrollContainer, windowWidth);
        this.setState(nextState, didMount ? _reactTooltip["default"].rebuild : null);

        if (didMount && scrollContainer) {
          scrollContainer.addEventListener('scroll', this.onHorizontalScroll);
        }
      }
    }
  }, {
    key: "toggleDetailPaneOpen",
    value: function toggleDetailPaneOpen(rowKey) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState(function (_ref8) {
        var openDetailPanes = _ref8.openDetailPanes;
        openDetailPanes = _underscore["default"].clone(openDetailPanes);

        if (openDetailPanes[rowKey]) {
          delete openDetailPanes[rowKey];
        } else {
          openDetailPanes[rowKey] = true;
        }

        return {
          openDetailPanes: openDetailPanes
        };
      }, cb);
    }
  }, {
    key: "setDetailHeight",
    value: function setDetailHeight(rowKey, height, cb) {
      this.setState(function (_ref9) {
        var openDetailPanes = _ref9.openDetailPanes;
        openDetailPanes = _underscore["default"].clone(openDetailPanes);

        if (typeof openDetailPanes[rowKey] === 'undefined') {
          return null;
        }

        openDetailPanes[rowKey] = typeof height === "number" && !isNaN(height) ? height : true;
        return {
          openDetailPanes: openDetailPanes
        };
      }, cb);
    }
  }, {
    key: "setContainerScrollLeft",
    value: function setContainerScrollLeft(tableContainerScrollLeft) {
      this.setState({
        tableContainerScrollLeft: tableContainerScrollLeft
      });
    }
  }, {
    key: "onHorizontalScroll",
    value: function onHorizontalScroll(e) {
      var _this10 = this;

      var innerElem = e.target; // ( Shouldn't need to do commented out stuff if layout is within width )
      // Bound it, test again
      // const { columnDefinitions, windowWidth } = this.props;
      // const fullRowWidth = this.memoized.fullRowWidth(columnDefinitions, mounted, widths, windowWidth);
      // nextScrollLeft = Math.min(
      //     nextScrollLeft,
      //     (fullRowWidth - tableContainerWidth)
      // );

      if (this.horizScrollRAF) {
        (0, _utilities.cancelAnimationFrame)(this.horizScrollRAF);
      }

      this.horizScrollRAF = (0, _utilities.requestAnimationFrame)(function () {
        var tableContainerScrollLeft = _this10.state.tableContainerScrollLeft;
        var nextScrollLeft = innerElem.scrollLeft;

        if (nextScrollLeft < 0) {
          nextScrollLeft = 0; // Might occur right after changing column widths or something.
        }

        var columnsWrapperElement = innerElem.parentElement.childNodes[0].childNodes[0].childNodes[0];
        columnsWrapperElement.style.left = "-".concat(nextScrollLeft, "px");

        if (nextScrollLeft !== tableContainerScrollLeft) {
          // Shouldn't occur or matter but presence of this seems to improve smoothness (?)
          _this10.setContainerScrollLeft(nextScrollLeft);
        }

        delete _this10.horizScrollRAF;
      });
      return false;
    }
  }, {
    key: "setResults",
    value: function setResults(results, cb) {
      this.setState({
        'results': _underscore["default"].uniq(results, false, _object.itemUtil.atId)
      }, cb);
    }
  }, {
    key: "canLoadMore",
    value: function canLoadMore() {
      var _this$props12 = this.props,
          _this$props12$context = _this$props12.context;
      _this$props12$context = _this$props12$context === void 0 ? {} : _this$props12$context;
      var _this$props12$context2 = _this$props12$context.total,
          total = _this$props12$context2 === void 0 ? 0 : _this$props12$context2,
          _this$props12$isConte = _this$props12.isContextLoading,
          isContextLoading = _this$props12$isConte === void 0 ? false : _this$props12$isConte;
      var _this$state$results = this.state.results,
          results = _this$state$results === void 0 ? [] : _this$state$results;
      return !isContextLoading && LoadMoreAsYouScroll.canLoadMore(total, results);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props13 = this.props,
          columnDefinitions = _this$props13.columnDefinitions,
          windowWidth = _this$props13.windowWidth,
          context = _this$props13.context,
          _this$props13$isOwnPa = _this$props13.isOwnPage,
          isOwnPage = _this$props13$isOwnPa === void 0 ? true : _this$props13$isOwnPa,
          navigate = _this$props13.navigate,
          _this$props13$rowHeig = _this$props13.rowHeight,
          rowHeight = _this$props13$rowHeig === void 0 ? 47 : _this$props13$rowHeig,
          _this$props13$openRow = _this$props13.openRowHeight,
          openRowHeight = _this$props13$openRow === void 0 ? 57 : _this$props13$openRow,
          _this$props13$maxHeig = _this$props13.maxHeight,
          maxHeight = _this$props13$maxHeig === void 0 ? 500 : _this$props13$maxHeig,
          _this$props13$isConte = _this$props13.isContextLoading,
          isContextLoading = _this$props13$isConte === void 0 ? false : _this$props13$isConte,
          setColumnWidths = _this$props13.setColumnWidths,
          columnWidths = _this$props13.columnWidths;
      var _this$state3 = this.state,
          results = _this$state3.results,
          tableContainerWidth = _this$state3.tableContainerWidth,
          tableContainerScrollLeft = _this$state3.tableContainerScrollLeft,
          mounted = _this$state3.mounted,
          openDetailPanes = _this$state3.openDetailPanes;
      var fullRowWidth = this.memoized.fullRowWidth(columnDefinitions, mounted, columnWidths, windowWidth);
      var canLoadMore = this.canLoadMore();
      var anyResults = results.length > 0;

      var headerRowCommonProps = _objectSpread(_objectSpread({}, _underscore["default"].pick(this.props, 'columnDefinitions', 'sortBy', 'sortColumn', 'sortReverse', 'defaultMinColumnWidth', 'renderDetailPane', 'detailPane', 'windowWidth')), {}, {
        mounted: mounted,
        results: results,
        rowHeight: rowHeight,
        setColumnWidths: setColumnWidths,
        columnWidths: columnWidths,
        tableContainerScrollLeft: tableContainerScrollLeft
      });

      var resultRowCommonProps = _underscore["default"].extend(_underscore["default"].pick(this.props, 'renderDetailPane', 'detailPane', 'href', 'currentAction', 'schemas', 'termTransformFxn'), {
        context: context,
        rowHeight: rowHeight,
        navigate: navigate,
        isOwnPage: isOwnPage,
        columnWidths: columnWidths,
        columnDefinitions: columnDefinitions,
        tableContainerWidth: tableContainerWidth,
        tableContainerScrollLeft: tableContainerScrollLeft,
        windowWidth: windowWidth,
        'mounted': mounted || false,
        'rowWidth': fullRowWidth,
        'toggleDetailPaneOpen': this.toggleDetailPaneOpen,
        'setDetailHeight': this.setDetailHeight
      });

      var loadMoreAsYouScrollProps = _objectSpread(_objectSpread({}, _underscore["default"].pick(this.props, 'href', 'onDuplicateResultsFoundCallback', 'schemas', 'navigate')), {}, {
        context: context,
        rowHeight: rowHeight,
        openRowHeight: openRowHeight,
        results: results,
        openDetailPanes: openDetailPanes,
        maxHeight: maxHeight,
        isOwnPage: isOwnPage,
        fullRowWidth: fullRowWidth,
        canLoadMore: canLoadMore,
        anyResults: anyResults,
        tableContainerWidth: tableContainerWidth,
        tableContainerScrollLeft: tableContainerScrollLeft,
        windowWidth: windowWidth,
        mounted: mounted,
        setResults: this.setResults
      });

      var headersRow = null;
      var shadowBorderLayer = null;

      if (anyResults) {
        headersRow = /*#__PURE__*/_react["default"].createElement(_HeadersRow.HeadersRow, headerRowCommonProps);
        shadowBorderLayer = /*#__PURE__*/_react["default"].createElement(ShadowBorderLayer, _extends({
          tableContainerScrollLeft: tableContainerScrollLeft,
          tableContainerWidth: tableContainerWidth,
          fullRowWidth: fullRowWidth
        }, {
          setContainerScrollLeft: this.setContainerScrollLeft,
          fixedPositionArrows: isOwnPage,
          getScrollContainer: this.getScrollContainer
        }));
      }

      var renderChildren = !anyResults ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "text-center py-5"
      }, /*#__PURE__*/_react["default"].createElement("h3", {
        className: "text-300"
      }, "No Results")) : results.map(function (result, idx) {
        var id = _object.itemUtil.atId(result);

        var detailOpen = openDetailPanes[id] || false; // We can skip passing tableContainerScrollLeft unless detail pane open to improve performance
        // else all rows get re-rendered (in virtual DOM atleast) on horizontal scroll due to prop value
        // changing. Alternatively could've made a shouldComponentUpdate in ResultRow (but need to keep track of more).

        return /*#__PURE__*/_react["default"].createElement(ResultRow, _extends({}, resultRowCommonProps, {
          result: result,
          id: id,
          detailOpen: detailOpen
        }, {
          rowNumber: idx,
          key: id,
          tableContainerScrollLeft: detailOpen ? tableContainerScrollLeft : 0
        }));
      });

      if (anyResults && !canLoadMore) {
        renderChildren.push( /*#__PURE__*/_react["default"].createElement("div", {
          className: "fin search-result-row",
          key: "fin-last-item",
          style: {
            // Account for vertical scrollbar decreasing width of container.
            width: tableContainerWidth - (isOwnPage ? 0 : 30),
            transform: _utilities.style.translate3d(tableContainerScrollLeft)
          }
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "inner"
        }, "- ", /*#__PURE__*/_react["default"].createElement("span", null, "fin"), " -")));
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "search-results-outer-container" + (isOwnPage ? " is-own-page" : " is-within-page"),
        ref: this.outerRef,
        "data-context-loading": isContextLoading
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "search-results-container" + (canLoadMore === false ? ' fully-loaded' : '')
      }, headersRow, /*#__PURE__*/_react["default"].createElement(LoadMoreAsYouScroll, loadMoreAsYouScrollProps, renderChildren), shadowBorderLayer));
    }
  }]);

  return DimensioningContainer;
}(_react["default"].PureComponent);
/**
 * Reusable table for displaying search results according to column definitions.
 *
 * @todo Maybe make into functional component w/ useMemo-ized `filterOutHiddenCols` dep. on syntactic preference.
 *
 * @class SearchResultTable
 * @prop {Object[]}         results             Results as returned from back-end, e.g. props.context['@graph'].
 * @prop {Object[]}         columns             List of column definitions.
 * @prop {Object}           [defaultWidthMap]   Default column widths per responsive grid state. Applied to all non-constant columns.
 * @prop {string[]}         [hiddenColumns]     Keys of columns to remove from final columnDefinitions before rendering.
 * @prop {function}         [renderDetailPane]  An instance of a React component which will receive prop 'result'.
 * @prop {string}           sortColumn          Current sort column, as fed by SortController.
 * @prop {boolean}          sortReverse         Whether current sort column is reversed, as fed by SortController.
 * @prop {function}         sortBy              Callback function for performing a sort, acceping 'sortColumn' and 'sortReverse' as params. As fed by SortController.
 * @prop {function}         termTransformFxn    Function passed from parent portal to transform system values into human readable values. Is portal-specific; not used if `render` for field in columnExtensionMap/columnDefinition exists/used.
 */


var SearchResultTable = /*#__PURE__*/function (_React$Component2) {
  _inherits(SearchResultTable, _React$Component2);

  var _super6 = _createSuper(SearchResultTable);

  _createClass(SearchResultTable, null, [{
    key: "isDesktopClientside",
    value: function isDesktopClientside(windowWidth) {
      return !(0, _misc.isServerSide)() && (0, _layout.responsiveGridState)(windowWidth) !== 'xs';
    }
  }]);

  function SearchResultTable(props) {
    var _this11;

    _classCallCheck(this, SearchResultTable);

    _this11 = _super6.call(this, props);
    _this11.memoized = {
      filterOutHiddenCols: (0, _memoizeOne["default"])(_CustomColumnController.filterOutHiddenCols)
    };
    return _this11;
  }

  _createClass(SearchResultTable, [{
    key: "render",
    value: function render() {
      var _this$props14 = this.props,
          context = _this$props14.context,
          visibleColumnDefinitions = _this$props14.visibleColumnDefinitions,
          columnDefinitions = _this$props14.columnDefinitions,
          _this$props14$isConte = _this$props14.isContextLoading,
          isContextLoading = _this$props14$isConte === void 0 ? false : _this$props14$isConte,
          isOwnPage = _this$props14.isOwnPage;

      if (isContextLoading && !context) {
        // Initial context (pre-sort, filter, etc) loading.
        // Only applicable for EmbeddedSearchView
        // Maybe move up to ControlsAndResults?
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "search-results-outer-container text-center" + (isOwnPage ? " is-own-page" : " is-within-page")
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "search-results-container text-center text-secondary py-5"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "icon icon-fw icon-spin icon-circle-notch fas icon-2x"
        })));
      } // We filter down the columnDefinitions here (rather than in CustomColumnController)
      // because they are still necessary for UI for selection of visible/invisible columns
      // in SearchView/ControlsAndResults/AboveSearchViewTableControls/....


      return /*#__PURE__*/_react["default"].createElement(DimensioningContainer, _extends({}, _underscore["default"].omit(this.props, 'hiddenColumns', 'columnDefinitionOverrideMap', 'defaultWidthMap'), {
        columnDefinitions: visibleColumnDefinitions || columnDefinitions
      }));
    }
  }]);

  return SearchResultTable;
}(_react["default"].Component);

exports.SearchResultTable = SearchResultTable;

_defineProperty(SearchResultTable, "propTypes", {
  'results': _propTypes["default"].arrayOf(ResultRow.propTypes.result).isRequired,
  // Either href or requestedCompoundFilterSet should be present:
  'href': _propTypes["default"].string,
  'requestedCompoundFilterSet': _propTypes["default"].object,
  'columnDefinitions': _propTypes["default"].arrayOf(_propTypes["default"].object),
  'defaultWidthMap': _propTypes["default"].shape({
    'lg': _propTypes["default"].number.isRequired,
    'md': _propTypes["default"].number.isRequired,
    'sm': _propTypes["default"].number.isRequired
  }).isRequired,
  'hiddenColumns': _propTypes["default"].objectOf(_propTypes["default"].bool),
  // One of the following 2 is recommended for custom detail panes:
  'renderDetailPane': _propTypes["default"].func,
  'detailPane': _propTypes["default"].element,
  'context': _propTypes["default"].shape({
    'total': _propTypes["default"].number.isRequired
  }).isRequired,
  'windowWidth': _propTypes["default"].number.isRequired,
  'registerWindowOnScrollHandler': _propTypes["default"].func.isRequired,
  'columnExtensionMap': _propTypes["default"].objectOf(_propTypes["default"].shape({
    "title": _propTypes["default"].string.isRequired,
    "widthMap": _propTypes["default"].shape({
      'lg': _propTypes["default"].number,
      'md': _propTypes["default"].number,
      'sm': _propTypes["default"].number
    }),
    "minColumnWidth": _propTypes["default"].number,
    "order": _propTypes["default"].number,
    "render": _propTypes["default"].func,
    "noSort": _propTypes["default"].bool
  })),
  'termTransformFxn': _propTypes["default"].func.isRequired,
  'isOwnPage': _propTypes["default"].bool,
  'maxHeight': _propTypes["default"].number,
  //PropTypes.oneOfType([PropTypes.number, PropTypes.string]) // Used only if isOwnPage is false
  'isContextLoading': _propTypes["default"].bool
});

_defineProperty(SearchResultTable, "defaultProps", {
  //'columnExtensionMap' : basicColumnExtensionMap,
  'columnDefinitions': (0, _ColumnCombiner.columnsToColumnDefinitions)({
    'display_title': {
      'title': 'Title'
    }
  }, _basicColumnExtensionMap.basicColumnExtensionMap),
  // Fallback - just title column.
  'renderDetailPane': function renderDetailPane(result, rowNumber, width, props) {
    return /*#__PURE__*/_react["default"].createElement(DefaultDetailPane, _extends({}, props, {
      result: result,
      rowNumber: rowNumber,
      width: width
    }));
  },
  'detailPane': null,
  'defaultMinColumnWidth': 55,
  'hiddenColumns': null,
  // This value (the default or if passed in) should be aligned to value in CSS.
  // Must account for any border or padding at bottom/top of row, as well.
  'rowHeight': 47,
  'openRowHeight': 57,
  'fullWidthInitOffset': 60,
  'fullWidthContainerSelectorString': '.browse-page-container',
  'currentAction': null,
  'isOwnPage': true,
  'maxHeight': 400,
  // Used only if isOwnPage is false; todo: maybe move this defaultProp definition higher up into EmbeddedSearchView and leave null here.
  'isContextLoading': false // Used only if isOwnPage is false

});