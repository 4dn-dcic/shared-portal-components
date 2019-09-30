'use strict';

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

var _reactSticky = require("react-sticky");

var _ItemDetailList = require("./../../ui/ItemDetailList");

var _patchedConsole = require("./../../util/patched-console");

var _misc = require("./../../util/misc");

var _navigate = require("./../../util/navigate");

var _object = require("./../../util/object");

var _ajax = require("./../../util/ajax");

var _layout = require("./../../util/layout");

var _schemaTransforms = require("./../../util/schema-transforms");

var _utilities = require("./../../viz/utilities");

var _Alerts = require("./../../ui/Alerts");

var _tableCommons = require("./table-commons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ResultRowColumnBlock = _react.default.memo(function (props) {
  var columnDefinition = props.columnDefinition,
      columnNumber = props.columnNumber,
      mounted = props.mounted,
      headerColumnWidths = props.headerColumnWidths,
      schemas = props.schemas,
      windowWidth = props.windowWidth;
  var blockWidth;

  if (mounted) {
    blockWidth = headerColumnWidths[columnNumber] || (0, _tableCommons.getColumnWidthFromDefinition)(columnDefinition, mounted, windowWidth);
  } else {
    blockWidth = (0, _tableCommons.getColumnWidthFromDefinition)(columnDefinition, mounted, windowWidth);
  }

  return _react.default.createElement("div", {
    className: "search-result-column-block",
    style: {
      "width": blockWidth
    },
    "data-field": columnDefinition.field
  }, _react.default.createElement(_tableCommons.ResultRowColumnBlockValue, _extends({}, props, {
    width: blockWidth,
    schemas: schemas
  })));
});

var DefaultDetailPane = _react.default.memo(function (_ref) {
  var result = _ref.result;
  return _react.default.createElement("div", null, result.description ? _react.default.createElement("div", {
    className: "flexible-description-box result-table-result-heading"
  }, result.description) : null, _react.default.createElement("div", {
    className: "item-page-detail"
  }, _react.default.createElement("h4", {
    className: "text-300"
  }, "Details"), _react.default.createElement(_ItemDetailList.Detail, {
    context: result,
    open: false
  })));
});

var ResultDetail = function (_React$PureComponent) {
  _inherits(ResultDetail, _React$PureComponent);

  function ResultDetail(props) {
    var _this;

    _classCallCheck(this, ResultDetail);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResultDetail).call(this, props));
    _this.setDetailHeightFromPane = _this.setDetailHeightFromPane.bind(_assertThisInitialized(_this));
    _this.state = {
      'closing': false
    };
    _this.detailRef = _react.default.createRef();
    _this.firstFoundHeight = null;
    return _this;
  }

  _createClass(ResultDetail, [{
    key: "setDetailHeightFromPane",
    value: function setDetailHeightFromPane() {
      var height = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var setDetailHeight = this.props.setDetailHeight;

      if (typeof height !== 'number') {
        var domElem = this.detailRef && this.detailRef.current;
        height = domElem && parseInt(domElem.offsetHeight);

        if (!this.firstFoundHeight && height && !isNaN(height)) {
          this.firstFoundHeight = height;
        }
      }

      if (isNaN(height) || typeof height !== 'number') {
        height = this.firstFoundHeight || 1;
      }

      setDetailHeight(height);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var _this$props = this.props,
          open = _this$props.open,
          setDetailHeight = _this$props.setDetailHeight;

      if (pastProps.open !== open) {
        if (open && typeof setDetailHeight === 'function') {
          setTimeout(this.setDetailHeightFromPane, 100);
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
          tableContainerWidth = _this$props2.tableContainerWidth,
          tableContainerScrollLeft = _this$props2.tableContainerScrollLeft,
          renderDetailPane = _this$props2.renderDetailPane,
          toggleDetailOpen = _this$props2.toggleDetailOpen;
      var closing = this.state.closing;
      return _react.default.createElement("div", {
        className: "result-table-detail-container detail-" + (open || closing ? 'open' : 'closed')
      }, open ? _react.default.createElement("div", {
        className: "result-table-detail",
        ref: this.detailRef,
        style: {
          'width': tableContainerWidth,
          'transform': _utilities.style.translate3d(tableContainerScrollLeft)
        }
      }, renderDetailPane(result, rowNumber, tableContainerWidth, this.setDetailHeightFromPane), _react.default.createElement("div", {
        className: "close-button-container text-center",
        onClick: toggleDetailOpen,
        "data-tip": "Collapse Details"
      }, _react.default.createElement("i", {
        className: "icon icon-angle-up fas"
      }))) : _react.default.createElement("div", null));
    }
  }]);

  return ResultDetail;
}(_react.default.PureComponent);

_defineProperty(ResultDetail, "propTypes", {
  'result': _propTypes.default.object.isRequired,
  'open': _propTypes.default.bool.isRequired,
  'renderDetailPane': _propTypes.default.func.isRequired,
  'rowNumber': _propTypes.default.number,
  'toggleDetailOpen': _propTypes.default.func.isRequired
});

var ResultRow = function (_React$PureComponent2) {
  _inherits(ResultRow, _React$PureComponent2);

  _createClass(ResultRow, null, [{
    key: "areWidthsEqual",
    value: function areWidthsEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;

      for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }

      return true;
    }
  }]);

  function ResultRow(props) {
    var _this2;

    _classCallCheck(this, ResultRow);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ResultRow).call(this, props));
    _this2.toggleDetailOpen = _underscore.default.throttle(_this2.toggleDetailOpen.bind(_assertThisInitialized(_this2)), 250);
    _this2.isOpen = _this2.isOpen.bind(_assertThisInitialized(_this2));
    _this2.setDetailHeight = _this2.setDetailHeight.bind(_assertThisInitialized(_this2));
    _this2.handleDragStart = _this2.handleDragStart.bind(_assertThisInitialized(_this2));
    return _this2;
  }

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
  }, {
    key: "isOpen",
    value: function isOpen() {
      var _this$props5 = this.props,
          openDetailPanes = _this$props5.openDetailPanes,
          id = _this$props5.id;
      return openDetailPanes[id] || false;
    }
  }, {
    key: "handleDragStart",
    value: function handleDragStart(evt) {
      if (!evt || !evt.dataTransfer) return;
      var _this$props6 = this.props,
          result = _this$props6.result,
          href = _this$props6.href,
          schemas = _this$props6.schemas;
      evt.dataTransfer.setData('text/4dn-item-json', JSON.stringify(result));

      var hrefParts = _url.default.parse(href);

      var atId = _object.itemUtil.atId(result);

      var formedURL = (hrefParts.protocol || '') + (hrefParts.hostname ? '//' + hrefParts.hostname + (hrefParts.port ? ':' + hrefParts.port : '') : '') + atId;
      evt.dataTransfer.setData('text/plain', formedURL);
      evt.dataTransfer.setData('text/uri-list', formedURL);
      evt.dataTransfer.setData('text/4dn-item-id', atId);
      if (!document || !document.createElement) return;
      var element = document.createElement('div');
      element.className = "draggable-item-cursor";
      var innerText = result.display_title;
      var innerBoldElem = document.createElement('strong');
      innerBoldElem.appendChild(document.createTextNode(innerText));
      element.appendChild(innerBoldElem);
      element.appendChild(document.createElement('br'));
      innerText = (0, _schemaTransforms.getItemTypeTitle)(result, schemas);
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

      var _this$props7 = this.props,
          columnDefinitions = _this$props7.columnDefinitions,
          selectedFiles = _this$props7.selectedFiles;
      var detailOpen = this.isOpen();
      return _underscore.default.map(columnDefinitions, function (columnDefinition, columnNumber) {
        var passedProps = _underscore.default.extend(_underscore.default.omit(_this3.props, 'tableContainerWidth', 'tableContainerScrollLeft', 'renderDetailPane', 'id'), {
          columnDefinition: columnDefinition,
          columnNumber: columnNumber,
          detailOpen: detailOpen,
          'key': columnDefinition.field,
          'toggleDetailOpen': _this3.toggleDetailOpen,
          'selectedFiles': columnNumber === 0 ? selectedFiles : null
        });

        return _react.default.createElement(ResultRowColumnBlock, passedProps);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          rowNumber = _this$props8.rowNumber,
          currentAction = _this$props8.currentAction;
      var detailOpen = this.isOpen();
      var isDraggable = (0, _misc.isSelectAction)(currentAction);

      var detailProps = _underscore.default.omit(this.props, 'openDetailPanes', 'mounted', 'headerColumnWidths', 'columnDefinitions', 'id', 'detailOpen', 'setDetailHeight');

      return _react.default.createElement("div", {
        className: "search-result-row detail-" + (detailOpen ? 'open' : 'closed') + (isDraggable ? ' is-draggable' : ''),
        "data-row-number": rowNumber
      }, _react.default.createElement("div", {
        className: "columns clearfix result-table-row",
        draggable: isDraggable,
        onDragStart: isDraggable ? this.handleDragStart : null
      }, this.renderColumns()), _react.default.createElement(ResultDetail, _extends({}, detailProps, {
        open: !!detailOpen,
        toggleDetailOpen: this.toggleDetailOpen,
        setDetailHeight: this.setDetailHeight
      })));
    }
  }]);

  return ResultRow;
}(_react.default.PureComponent);

_defineProperty(ResultRow, "propTypes", {
  'result': _propTypes.default.shape({
    '@type': _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
    '@id': _propTypes.default.string,
    'lab': _propTypes.default.object,
    'display_title': _propTypes.default.string.isRequired,
    'status': _propTypes.default.string,
    'date_created': _propTypes.default.string.isRequired
  }).isRequired,
  'rowNumber': _propTypes.default.number.isRequired,
  'mounted': _propTypes.default.bool.isRequired,
  'columnDefinitions': _propTypes.default.arrayOf(_propTypes.default.shape({
    'title': _propTypes.default.string.isRequired,
    'field': _propTypes.default.string.isRequired,
    'render': _propTypes.default.func,
    'widthMap': _propTypes.default.shape({
      'lg': _propTypes.default.number.isRequired,
      'md': _propTypes.default.number.isRequired,
      'sm': _propTypes.default.number.isRequired
    })
  })).isRequired,
  'headerColumnWidths': _propTypes.default.array,
  'renderDetailPane': _propTypes.default.func.isRequired,
  'openDetailPanes': _propTypes.default.object.isRequired,
  'setDetailHeight': _propTypes.default.func.isRequired,
  'id': _propTypes.default.string.isRequired
});

var LoadMoreAsYouScroll = function (_React$PureComponent3) {
  _inherits(LoadMoreAsYouScroll, _React$PureComponent3);

  _createClass(LoadMoreAsYouScroll, null, [{
    key: "canLoadMore",
    value: function canLoadMore(totalExpected, results) {
      return totalExpected > results.length;
    }
  }]);

  function LoadMoreAsYouScroll(props) {
    var _this4;

    _classCallCheck(this, LoadMoreAsYouScroll);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(LoadMoreAsYouScroll).call(this, props));
    _this4.getInitialFrom = _this4.getInitialFrom.bind(_assertThisInitialized(_this4));
    _this4.rebuiltHref = _this4.rebuiltHref.bind(_assertThisInitialized(_this4));
    _this4.handleLoad = _underscore.default.throttle(_this4.handleLoad.bind(_assertThisInitialized(_this4)), 3000);
    var state = {
      'isLoading': false,
      'canLoad': true
    };
    _this4.lastIsScrolling = false;

    if (typeof props.mounted === 'undefined') {
      state.mounted = false;
    }

    _this4.state = state;
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
    key: "getInitialFrom",
    value: function getInitialFrom() {
      var href = this.props.href;

      if (typeof href === 'string') {
        var parts = _url.default.parse(href, true);

        if (parts.query.limit && !isNaN(parts.query.from)) return parseInt(parts.query.from);
      }

      return 0;
    }
  }, {
    key: "rebuiltHref",
    value: function rebuiltHref() {
      var _this$props9 = this.props,
          href = _this$props9.href,
          results = _this$props9.results;

      var parts = _url.default.parse(href, true);

      var q = parts.query;
      var initialFrom = this.getInitialFrom();
      q.from = initialFrom + results.length;
      parts.search = '?' + _querystring.default.stringify(q);
      return _url.default.format(parts);
    }
  }, {
    key: "handleLoad",
    value: function handleLoad() {
      var _this5 = this;

      var nextHref = this.rebuiltHref();

      var loadCallback = function (resp) {
        if (resp && resp['@graph'] && resp['@graph'].length > 0) {
          var _this5$props = _this5.props,
              onDuplicateResultsFoundCallback = _this5$props.onDuplicateResultsFoundCallback,
              results = _this5$props.results,
              setResults = _this5$props.setResults;

          var oldKeys = _underscore.default.map(results, _object.itemUtil.atId);

          var newKeys = _underscore.default.map(resp['@graph'], _object.itemUtil.atId);

          var keyIntersection = _underscore.default.intersection(oldKeys.sort(), newKeys.sort());

          if (keyIntersection.length > 0) {
            _patchedConsole.patchedConsoleInstance.error('FOUND ALREADY-PRESENT RESULT IN NEW RESULTS', keyIntersection, newKeys);

            _this5.setState({
              'isLoading': false
            }, function () {
              (0, _navigate.navigate)('', {
                'inPlace': true
              }, onDuplicateResultsFoundCallback);
            });
          } else {
            _this5.setState({
              'isLoading': false
            }, function () {
              setResults(results.slice(0).concat(resp['@graph']));
            });
          }
        } else {
          _this5.setState({
            'isLoading': false
          });
        }
      };

      this.setState({
        'isLoading': true
      }, function () {
        (0, _ajax.load)(nextHref, loadCallback, 'GET', loadCallback);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props10 = this.props,
          children = _this$props10.children,
          rowHeight = _this$props10.rowHeight,
          openDetailPanes = _this$props10.openDetailPanes,
          openRowHeight = _this$props10.openRowHeight,
          tableContainerWidth = _this$props10.tableContainerWidth,
          tableContainerScrollLeft = _this$props10.tableContainerScrollLeft,
          totalExpected = _this$props10.totalExpected,
          results = _this$props10.results,
          propMounted = _this$props10.mounted;
      var _this$state = this.state,
          stateMounted = _this$state.mounted,
          isLoading = _this$state.isLoading;

      if (!(propMounted || stateMounted)) {
        return _react.default.createElement("div", null, children);
      }

      var elementHeight = _underscore.default.keys(openDetailPanes).length === 0 ? rowHeight : _react.default.Children.map(children, function (c) {
        if (typeof openDetailPanes[c.props.id] === 'number') {
          return openDetailPanes[c.props.id] + openRowHeight + 2;
        }

        return rowHeight;
      });
      var canLoad = LoadMoreAsYouScroll.canLoadMore(totalExpected, results);
      return _react.default.createElement(_reactInfinite.default, {
        elementHeight: elementHeight,
        useWindowAsScrollContainer: true,
        onInfiniteLoad: this.handleLoad,
        isInfiniteLoading: isLoading,
        timeScrollStateLastsForAfterUserScrolls: 250,
        loadingSpinnerDelegate: _react.default.createElement("div", {
          className: "search-result-row loading text-center",
          style: {
            'maxWidth': tableContainerWidth,
            'transform': _utilities.style.translate3d(tableContainerScrollLeft)
          }
        }, _react.default.createElement("i", {
          className: "icon icon-circle-notch icon-spin fas"
        }), "\xA0 Loading..."),
        infiniteLoadBeginEdgeOffset: canLoad ? 200 : undefined,
        preloadAdditionalHeight: _reactInfinite.default.containerHeightScaleFactor(1.5),
        preloadBatchSize: _reactInfinite.default.containerHeightScaleFactor(1.5)
      }, children);
    }
  }]);

  return LoadMoreAsYouScroll;
}(_react.default.PureComponent);

_defineProperty(LoadMoreAsYouScroll, "propTypes", {
  'href': _propTypes.default.string.isRequired,
  'limit': _propTypes.default.number,
  'rowHeight': _propTypes.default.number.isRequired
});

_defineProperty(LoadMoreAsYouScroll, "defaultProps", {
  'limit': 25,
  'debouncePointerEvents': 150,
  'openRowHeight': 56,
  'onDuplicateResultsFoundCallback': function onDuplicateResultsFoundCallback() {
    _Alerts.Alerts.queue({
      'title': 'Results Refreshed',
      'message': 'Results have changed while loading and have been refreshed.',
      'navigateDisappearThreshold': 1
    });
  }
});

var ShadowBorderLayer = function (_React$Component) {
  _inherits(ShadowBorderLayer, _React$Component);

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
    key: "isWindowPastTableTop",
    value: function isWindowPastTableTop(tableContainerElement) {
      var windowHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var scrollTop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var tableTopOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      if ((0, _misc.isServerSide)()) return false;
      if (!windowHeight) windowHeight = window.innerHeight;
      if (!scrollTop) scrollTop = (0, _layout.getPageVerticalScrollPosition)();
      if (!tableTopOffset) tableTopOffset = (0, _layout.getElementOffset)(tableContainerElement).top;

      if (windowHeight / 2 + scrollTop > tableTopOffset) {
        return true;
      }

      return false;
    }
  }]);

  function ShadowBorderLayer(props) {
    var _this6;

    _classCallCheck(this, ShadowBorderLayer);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(ShadowBorderLayer).call(this, props));
    _this6.scrolling = false;
    _this6.performScrollAction = _this6.performScrollAction.bind(_assertThisInitialized(_this6));
    _this6.handleLeftScrollButtonMouseDown = _this6.handleScrollButtonMouseDown.bind(_assertThisInitialized(_this6), 'left');
    _this6.handleRightScrollButtonMouseDown = _this6.handleScrollButtonMouseDown.bind(_assertThisInitialized(_this6), 'right');
    _this6.handleScrollButtonUp = _this6.handleScrollButtonUp.bind(_assertThisInitialized(_this6));
    _this6.lastDimClassName = null;
    return _this6;
  }

  _createClass(ShadowBorderLayer, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (this.props.isWindowPastTableTop !== nextProps.isWindowPastTableTop) return true;
      var pastEdges = this.edgeHiddenContentWidths(this.props);
      var newEdges = this.edgeHiddenContentWidths(nextProps);
      if (newEdges.left !== pastEdges.left || newEdges.right !== pastEdges.right) return true;
      var dimClassName = this.tallDimensionClass(nextProps);

      if (this.lastDimClassName !== dimClassName) {
        this.lastDimClassName = dimClassName;
        return true;
      }

      return false;
    }
  }, {
    key: "edgeHiddenContentWidths",
    value: function edgeHiddenContentWidths() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var edges = {
        'left': 0,
        'right': 0
      };
      var fullRowWidth = props.fullRowWidth,
          tableContainerScrollLeft = props.tableContainerScrollLeft,
          tableContainerWidth = props.tableContainerWidth;

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
  }, {
    key: "shadowStateClass",
    value: function shadowStateClass(edges) {
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props;
      if (!edges) edges = this.edgeHiddenContentWidths();
      return ShadowBorderLayer.shadowStateClass(edges.left, edges.right);
    }
  }, {
    key: "tallDimensionClass",
    value: function tallDimensionClass() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var cls;
      var tableHeight = props.innerContainerElem && props.innerContainerElem.offsetHeight || 0;

      if (tableHeight > 800) {
        cls = ' tall';
      } else {
        cls = ' short';
      }

      return cls;
    }
  }, {
    key: "handleScrollButtonMouseDown",
    value: function handleScrollButtonMouseDown() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "right";
      var evt = arguments.length > 1 ? arguments[1] : undefined;

      if (evt.button === 0) {
        this.scrolling = true;
        this.performScrollAction(direction);
      }
    }
  }, {
    key: "edgeScrollButtonLeft",
    value: function edgeScrollButtonLeft(leftEdgeContentWidth) {
      if (!this.props.innerContainerElem) return null;
      var className = "edge-scroll-button left-edge";

      if (typeof leftEdgeContentWidth !== 'number' || leftEdgeContentWidth === 0) {
        className += ' faded-out';
      }

      return _react.default.createElement("div", {
        className: className,
        onMouseDown: this.handleLeftScrollButtonMouseDown,
        onMouseUp: this.handleScrollButtonUp,
        onMouseOut: this.handleScrollButtonUp
      }, _react.default.createElement("i", {
        className: "icon icon-caret-left fas"
      }));
    }
  }, {
    key: "edgeScrollButtonRight",
    value: function edgeScrollButtonRight(rightEdgeContentWidth) {
      if (!this.props.innerContainerElem) return null;
      var className = "edge-scroll-button right-edge";

      if (typeof rightEdgeContentWidth !== 'number' || rightEdgeContentWidth === 0) {
        className += ' faded-out';
      }

      return _react.default.createElement("div", {
        className: className,
        onMouseDown: this.handleRightScrollButtonMouseDown,
        onMouseUp: this.handleScrollButtonUp,
        onMouseOut: this.handleScrollButtonUp
      }, _react.default.createElement("i", {
        className: "icon icon-caret-right fas"
      }));
    }
  }, {
    key: "performScrollAction",
    value: function performScrollAction() {
      var _this7 = this;

      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "right";
      var _this$props11 = this.props,
          horizontalScrollRateOnEdgeButton = _this$props11.horizontalScrollRateOnEdgeButton,
          tableContainerWidth = _this$props11.tableContainerWidth,
          fullRowWidth = _this$props11.fullRowWidth,
          innerContainerElem = _this$props11.innerContainerElem,
          setContainerScrollLeft = _this$props11.setContainerScrollLeft;

      var scrollAction = function (depth) {
        var change = (direction === 'right' ? 1 : -1) * horizontalScrollRateOnEdgeButton;
        var leftOffset = Math.max(0, Math.min(fullRowWidth - tableContainerWidth, innerContainerElem.scrollLeft + change));
        innerContainerElem.scrollLeft = leftOffset;
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
      if (this.props.fullRowWidth <= this.props.tableContainerWidth) return null;
      var edges = this.edgeHiddenContentWidths();
      return _react.default.createElement("div", {
        className: "shadow-border-layer hidden-xs" + this.shadowStateClass(edges) + this.tallDimensionClass() + (this.props.isWindowPastTableTop ? ' fixed-position-arrows' : '')
      }, this.edgeScrollButtonLeft(edges.left), this.edgeScrollButtonRight(edges.right));
    }
  }]);

  return ShadowBorderLayer;
}(_react.default.Component);

_defineProperty(ShadowBorderLayer, "defaultProps", {
  'horizontalScrollRateOnEdgeButton': 10
});

var DimensioningContainer = function (_React$PureComponent4) {
  _inherits(DimensioningContainer, _React$PureComponent4);

  _createClass(DimensioningContainer, null, [{
    key: "resetHeaderColumnWidths",
    value: function resetHeaderColumnWidths(columnDefinitions) {
      var mounted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var windowWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return _underscore.default.map(columnDefinitions, function (colDef) {
        return (0, _tableCommons.getColumnWidthFromDefinition)(colDef, mounted, windowWidth);
      });
    }
  }, {
    key: "findLargestBlockWidth",
    value: function findLargestBlockWidth(columnField) {
      if ((0, _misc.isServerSide)() || !document.querySelectorAll) return null;
      var elementsFound = document.querySelectorAll('div.search-result-column-block[data-field="' + columnField + '"] .value');

      if (elementsFound) {
        elementsFound = _toConsumableArray(elementsFound);
      }

      var maxColWidth = null;

      if (elementsFound && elementsFound.length > 0) {
        var headerElement = document.querySelector('div.search-headers-column-block[data-field="' + columnField + '"] .column-title');
        maxColWidth = Math.max(_underscore.default.reduce(elementsFound, function (m, elem) {
          return Math.max(m, elem.offsetWidth);
        }, 0), headerElement && headerElement.offsetWidth + 12 || 0);
      }

      return maxColWidth;
    }
  }, {
    key: "findAndDecreaseColumnWidths",
    value: function findAndDecreaseColumnWidths(columnDefinitions) {
      var padding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
      var windowWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return columnDefinitions.map(function (colDef) {
        var w = DimensioningContainer.findLargestBlockWidth(colDef.field);
        if (typeof w === 'number' && w < colDef.widthMap.lg) return w + padding;
        return (0, _tableCommons.getColumnWidthFromDefinition)(colDef, true, windowWidth);
      });
    }
  }, {
    key: "setDetailPanesLeftOffset",
    value: function setDetailPanesLeftOffset(detailPanes) {
      var leftOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (detailPanes && detailPanes.length > 0) {
        var transformStyle = _utilities.style.translate3d(leftOffset);

        _underscore.default.forEach(detailPanes, function (d) {
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
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (state.originalResults !== props.results) {
        _patchedConsole.patchedConsoleInstance.warn('props.results have changed, resetting some state -- ');

        return {
          'results': props.results.slice(0),
          'openDetailPanes': {},
          'originalResults': props.results
        };
      }

      return null;
    }
  }]);

  function DimensioningContainer(props) {
    var _this8;

    _classCallCheck(this, DimensioningContainer);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(DimensioningContainer).call(this, props));
    _this8.throttledUpdate = _underscore.default.debounce(_this8.forceUpdate.bind(_assertThisInitialized(_this8)), 500);
    _this8.toggleDetailPaneOpen = _underscore.default.throttle(_this8.toggleDetailPaneOpen.bind(_assertThisInitialized(_this8)), 500);
    _this8.setDetailHeight = _this8.setDetailHeight.bind(_assertThisInitialized(_this8));
    _this8.setContainerScrollLeft = _this8.setContainerScrollLeft.bind(_assertThisInitialized(_this8));
    _this8.onHorizontalScroll = _this8.onHorizontalScroll.bind(_assertThisInitialized(_this8));
    _this8.onVerticalScroll = _underscore.default.throttle(_this8.onVerticalScroll.bind(_assertThisInitialized(_this8)), 200);
    _this8.setHeaderWidths = _underscore.default.throttle(_this8.setHeaderWidths.bind(_assertThisInitialized(_this8)), 300);
    _this8.getTableDims = _this8.getTableDims.bind(_assertThisInitialized(_this8));
    _this8.resetWidths = _this8.resetWidths.bind(_assertThisInitialized(_this8));
    _this8.setResults = _this8.setResults.bind(_assertThisInitialized(_this8));
    _this8.canLoadMore = _this8.canLoadMore.bind(_assertThisInitialized(_this8));
    _this8.stickyHeaderTopOffset = _this8.stickyHeaderTopOffset.bind(_assertThisInitialized(_this8));
    _this8.renderHeadersRow = _this8.renderHeadersRow.bind(_assertThisInitialized(_this8));
    _this8.state = {
      'mounted': false,
      'widths': DimensioningContainer.resetHeaderColumnWidths(props.columnDefinitions, false, props.windowWidth),
      'originalResults': props.results,
      'results': props.results.slice(0),
      'isWindowPastTableTop': false,
      'openDetailPanes': {}
    };
    _this8.innerContainerRef = _react.default.createRef();
    _this8.loadMoreAsYouScrollRef = _react.default.createRef();
    return _this8;
  }

  _createClass(DimensioningContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props12 = this.props,
          columnDefinitions = _this$props12.columnDefinitions,
          windowWidth = _this$props12.windowWidth,
          registerWindowOnScrollHandler = _this$props12.registerWindowOnScrollHandler,
          nextState = _underscore.default.extend(this.getTableDims(), {
        'mounted': true
      }),
          innerContainerElem = this.innerContainerRef.current;

      if (innerContainerElem) {
        var fullRowWidth = _tableCommons.HeadersRow.fullRowWidth(columnDefinitions, this.state.mounted, [], windowWidth);

        if (innerContainerElem.offsetWidth < fullRowWidth) {
          nextState.widths = DimensioningContainer.findAndDecreaseColumnWidths(columnDefinitions, 30, windowWidth);
          nextState.isWindowPastTableTop = ShadowBorderLayer.isWindowPastTableTop(innerContainerElem);
        }

        innerContainerElem.addEventListener('scroll', this.onHorizontalScroll);
      } else {
        nextState.widths = DimensioningContainer.findAndDecreaseColumnWidths(columnDefinitions, 30, windowWidth);
      }

      this.scrollHandlerUnsubscribeFxn = registerWindowOnScrollHandler(this.onVerticalScroll);
      this.setState(nextState);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.scrollHandlerUnsubscribeFxn) {
        this.scrollHandlerUnsubscribeFxn();
        delete this.scrollHandlerUnsubscribeFxn;
      }

      var innerContainerElem = this.innerContainerRef.current;
      innerContainerElem && innerContainerElem.removeEventListener('scroll', this.onHorizontalScroll);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      if (pastState.results !== this.state.results) {
        _reactTooltip.default.rebuild();
      }

      if (pastProps.columnDefinitions.length !== this.props.columnDefinitions.length) {
          this.resetWidths();
        } else if (pastProps.windowWidth !== this.props.windowWidth) {
        this.setState(this.getTableDims());
      }
    }
  }, {
    key: "toggleDetailPaneOpen",
    value: function toggleDetailPaneOpen(rowKey) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState(function (_ref2) {
        var openDetailPanes = _ref2.openDetailPanes;
        openDetailPanes = _underscore.default.clone(openDetailPanes);

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
      this.setState(function (_ref3) {
        var openDetailPanes = _ref3.openDetailPanes;
        openDetailPanes = _underscore.default.clone(openDetailPanes);

        if (typeof openDetailPanes[rowKey] === 'undefined') {
          return null;
        }

        openDetailPanes[rowKey] = height;
        return {
          openDetailPanes: openDetailPanes
        };
      }, cb);
    }
  }, {
    key: "setContainerScrollLeft",
    value: function setContainerScrollLeft(nextScrollLeft) {
      this.setState(function (_ref4) {
        var tableContainerScrollLeft = _ref4.tableContainerScrollLeft;

        if (tableContainerScrollLeft === nextScrollLeft) {
          return null;
        }

        return {
          'tableContainerScrollLeft': nextScrollLeft
        };
      });
    }
  }, {
    key: "onHorizontalScroll",
    value: function onHorizontalScroll(e) {
      e && e.stopPropagation();
      this.setContainerScrollLeft(e.target.scrollLeft || 0);
      return false;
    }
  }, {
    key: "onVerticalScroll",
    value: function onVerticalScroll() {
      var _this9 = this;

      setTimeout(function () {
        var innerContainerElem = _this9.innerContainerRef.current;
        if (!innerContainerElem) return null;
        var _this9$props = _this9.props,
            windowHeight = _this9$props.windowHeight,
            windowWidth = _this9$props.windowWidth;
        var scrollTop = (0, _layout.getPageVerticalScrollPosition)();
        var tableTopOffset = (0, _layout.getElementOffset)(innerContainerElem).top;
        var isWindowPastTableTop = ShadowBorderLayer.isWindowPastTableTop(innerContainerElem, windowHeight, scrollTop, tableTopOffset);

        if (isWindowPastTableTop !== _this9.state.isWindowPastTableTop) {
          _this9.setState({
            'isWindowPastTableTop': isWindowPastTableTop
          });
        }
      }, 0);
    }
  }, {
    key: "getTableLeftOffset",
    value: function getTableLeftOffset() {
      var innerContainerElem = this.innerContainerRef.current;
      return innerContainerElem && (0, _layout.getElementOffset)(innerContainerElem).left || null;
    }
  }, {
    key: "getTableContainerWidth",
    value: function getTableContainerWidth() {
      var innerContainerElem = this.innerContainerRef.current;
      return innerContainerElem && innerContainerElem.offsetWidth || null;
    }
  }, {
    key: "getTableScrollLeft",
    value: function getTableScrollLeft() {
      var innerContainerElem = this.innerContainerRef.current;
      return innerContainerElem && typeof innerContainerElem.scrollLeft === 'number' ? innerContainerElem.scrollLeft : null;
    }
  }, {
    key: "getTableDims",
    value: function getTableDims() {
      if (!SearchResultTable.isDesktopClientside(this.props.windowWidth)) {
        return {
          'tableContainerWidth': this.getTableContainerWidth(),
          'tableContainerScrollLeft': null,
          'tableLeftOffset': null
        };
      }

      return {
        'tableContainerWidth': this.getTableContainerWidth(),
        'tableContainerScrollLeft': this.getTableScrollLeft(),
        'tableLeftOffset': this.getTableLeftOffset()
      };
    }
  }, {
    key: "resetWidths",
    value: function resetWidths() {
      var _this10 = this;

      this.setState(function resetWidthStateChangeFxn(_ref5, _ref6) {
        var mounted = _ref5.mounted;
        var columnDefinitions = _ref6.columnDefinitions,
            windowWidth = _ref6.windowWidth;
        return {
          "widths": DimensioningContainer.resetHeaderColumnWidths(columnDefinitions, mounted, windowWidth)
        };
      }, function resetWidthStateChangeFxnCallback() {
        (0, _utilities.requestAnimationFrame)(function () {
          var _this10$props = _this10.props,
              columnDefinitions = _this10$props.columnDefinitions,
              windowWidth = _this10$props.windowWidth;

          _this10.setState(_underscore.default.extend(_this10.getTableDims(), {
            'widths': DimensioningContainer.findAndDecreaseColumnWidths(columnDefinitions, 30, windowWidth)
          }));
        });
      });
    }
  }, {
    key: "setHeaderWidths",
    value: function setHeaderWidths(widths) {
      if (!Array.isArray(widths)) throw new Error('widths is not an array');
      this.setState({
        'widths': widths
      });
    }
  }, {
    key: "setResults",
    value: function setResults(results, cb) {
      this.setState({
        'results': _underscore.default.uniq(results, false, _object.itemUtil.atId)
      }, cb);
    }
  }, {
    key: "canLoadMore",
    value: function canLoadMore() {
      return LoadMoreAsYouScroll.canLoadMore(this.props.totalExpected, this.state.results);
    }
  }, {
    key: "stickyHeaderTopOffset",
    value: function () {
      var _this$props13 = this.props,
          windowWidth = _this$props13.windowWidth,
          stickyHeaderTopOffset = _this$props13.stickyHeaderTopOffset,
          currentAction = _this$props13.currentAction,
          href = _this$props13.href;
      var displayNavBar = !(href && typeof href === 'string' && href.indexOf('/search/') >= 0 && (0, _misc.isSelectAction)(currentAction));
      var rgs = (0, _layout.responsiveGridState)(windowWidth);

      switch (rgs) {
        case 'xs':
        case 'sm':
          return 0;

        case 'md':
        case 'lg':
        case 'xl':
          return displayNavBar ? stickyHeaderTopOffset || 0 : 0;
      }
    }
  }, {
    key: "renderHeadersRow",
    value: function renderHeadersRow(_ref7) {
      var style = _ref7.style,
          isSticky = _ref7.isSticky,
          wasSticky = _ref7.wasSticky,
          distanceFromTop = _ref7.distanceFromTop,
          distanceFromBottom = _ref7.distanceFromBottom,
          calculatedHeight = _ref7.calculatedHeight;
      var _this$state2 = this.state,
          tableContainerWidth = _this$state2.tableContainerWidth,
          tableLeftOffset = _this$state2.tableLeftOffset,
          widths = _this$state2.widths;
      return _react.default.createElement(_tableCommons.HeadersRow, _extends({}, _underscore.default.pick(this.props, 'columnDefinitions', 'sortBy', 'sortColumn', 'sortReverse', 'defaultMinColumnWidth', 'rowHeight', 'renderDetailPane', 'windowWidth'), _underscore.default.pick(this.state, 'mounted', 'results'), {
        stickyHeaderTopOffset: this.stickyHeaderTopOffset(),
        headerColumnWidths: widths,
        setHeaderWidths: this.setHeaderWidths,
        tableLeftOffset: tableLeftOffset,
        tableContainerWidth: tableContainerWidth,
        stickyStyle: style,
        isSticky: isSticky
      }));
    }
  }, {
    key: "renderResults",
    value: function renderResults() {
      var _this$props14 = this.props,
          columnDefinitions = _this$props14.columnDefinitions,
          windowWidth = _this$props14.windowWidth;
      var _this$state3 = this.state,
          results = _this$state3.results,
          tableContainerWidth = _this$state3.tableContainerWidth,
          tableContainerScrollLeft = _this$state3.tableContainerScrollLeft,
          mounted = _this$state3.mounted,
          widths = _this$state3.widths,
          openDetailPanes = _this$state3.openDetailPanes;

      var fullRowWidth = _tableCommons.HeadersRow.fullRowWidth(columnDefinitions, mounted, widths, windowWidth);

      var commonPropsToPass = _underscore.default.extend(_underscore.default.pick(this.props, 'columnDefinitions', 'renderDetailPane', 'href', 'currentAction', 'selectedFiles', 'windowWidth', 'schemas'), {
        openDetailPanes: openDetailPanes,
        tableContainerWidth: tableContainerWidth,
        tableContainerScrollLeft: tableContainerScrollLeft,
        'mounted': mounted || false,
        'headerColumnWidths': widths,
        'rowWidth': fullRowWidth,
        'toggleDetailPaneOpen': this.toggleDetailPaneOpen,
        'setDetailHeight': this.setDetailHeight
      });

      return _underscore.default.map(results, function (r, idx) {
        var id = _object.itemUtil.atId(r);

        return _react.default.createElement(ResultRow, _extends({}, commonPropsToPass, {
          result: r,
          rowNumber: idx,
          id: id,
          key: id
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props15 = this.props,
          columnDefinitions = _this$props15.columnDefinitions,
          windowWidth = _this$props15.windowWidth;
      var _this$state4 = this.state,
          tableContainerWidth = _this$state4.tableContainerWidth,
          tableContainerScrollLeft = _this$state4.tableContainerScrollLeft,
          mounted = _this$state4.mounted,
          widths = _this$state4.widths,
          isWindowPastTableTop = _this$state4.isWindowPastTableTop;

      var fullRowWidth = _tableCommons.HeadersRow.fullRowWidth(columnDefinitions, mounted, widths, windowWidth);

      var canLoadMore = this.canLoadMore();
      var innerContainerElem = this.innerContainerRef.current;
      return _react.default.createElement("div", {
        className: "search-results-outer-container"
      }, _react.default.createElement(_reactSticky.StickyContainer, null, _react.default.createElement("div", {
        className: "search-results-container" + (canLoadMore === false ? ' fully-loaded' : '')
      }, _react.default.createElement("div", {
        className: "inner-container",
        ref: this.innerContainerRef
      }, _react.default.createElement("div", {
        className: "scrollable-container",
        style: {
          minWidth: fullRowWidth + 6
        }
      }, _react.default.createElement(_reactSticky.Sticky, {
        windowWidth: windowWidth,
        topOffset: this.stickyHeaderTopOffset()
      }, this.renderHeadersRow), _react.default.createElement(LoadMoreAsYouScroll, _extends({}, _underscore.default.pick(this.props, 'href', 'limit', 'rowHeight', 'totalExpected', 'onDuplicateResultsFoundCallback', 'windowWidth', 'schemas'), _underscore.default.pick(this.state, 'results', 'mounted', 'openDetailPanes'), {
        tableContainerWidth: tableContainerWidth,
        tableContainerScrollLeft: tableContainerScrollLeft,
        innerContainerElem: innerContainerElem
      }, {
        setResults: this.setResults,
        ref: this.loadMoreAsYouScrollRef
      }), this.renderResults()))), _react.default.createElement(ShadowBorderLayer, _extends({
        tableContainerScrollLeft: tableContainerScrollLeft,
        tableContainerWidth: tableContainerWidth,
        fullRowWidth: fullRowWidth,
        isWindowPastTableTop: isWindowPastTableTop,
        innerContainerElem: innerContainerElem
      }, {
        setContainerScrollLeft: this.setContainerScrollLeft
      })))), canLoadMore === false ? _react.default.createElement("div", {
        key: "can-load-more",
        className: "fin search-result-row"
      }, _react.default.createElement("div", {
        className: "inner"
      }, "- ", _react.default.createElement("span", null, "fin"), " -")) : _react.default.createElement("div", {
        key: "can-load-more",
        className: "search-result-row empty-block"
      }));
    }
  }]);

  return DimensioningContainer;
}(_react.default.PureComponent);

var SearchResultTable = function (_React$PureComponent5) {
  _inherits(SearchResultTable, _React$PureComponent5);

  _createClass(SearchResultTable, null, [{
    key: "isDesktopClientside",
    value: function isDesktopClientside(windowWidth) {
      return !(0, _misc.isServerSide)() && (0, _layout.responsiveGridState)(windowWidth) !== 'xs';
    }
  }]);

  function SearchResultTable(props) {
    var _this11;

    _classCallCheck(this, SearchResultTable);

    _this11 = _possibleConstructorReturn(this, _getPrototypeOf(SearchResultTable).call(this, props));
    _this11.getDimensionContainer = _this11.getDimensionContainer.bind(_assertThisInitialized(_this11));
    _this11.dimensionContainerRef = _react.default.createRef();
    return _this11;
  }

  _createClass(SearchResultTable, [{
    key: "getDimensionContainer",
    value: function getDimensionContainer() {
      return this.dimensionContainerRef.current;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props16 = this.props,
          hiddenColumns = _this$props16.hiddenColumns,
          columnExtensionMap = _this$props16.columnExtensionMap,
          columnDefinitions = _this$props16.columnDefinitions;
      var colDefs = columnDefinitions || (0, _tableCommons.columnsToColumnDefinitions)({
        'display_title': {
          'title': 'Title'
        }
      }, columnExtensionMap);
      return _react.default.createElement(DimensioningContainer, _extends({}, _underscore.default.omit(this.props, 'hiddenColumns', 'columnDefinitionOverrideMap', 'defaultWidthMap'), {
        columnDefinitions: SearchResultTable.filterOutHiddenCols(colDefs, hiddenColumns),
        ref: this.dimensionContainerRef
      }));
    }
  }]);

  return SearchResultTable;
}(_react.default.PureComponent);

exports.SearchResultTable = SearchResultTable;

_defineProperty(SearchResultTable, "filterOutHiddenCols", (0, _memoizeOne.default)(function (columnDefinitions, hiddenColumns) {
  if (hiddenColumns) {
    return _underscore.default.filter(columnDefinitions, function (colDef) {
      if (hiddenColumns[colDef.field] === true) return false;
      return true;
    });
  }

  return columnDefinitions;
}));

_defineProperty(SearchResultTable, "propTypes", {
  'results': _propTypes.default.arrayOf(ResultRow.propTypes.result).isRequired,
  'href': _propTypes.default.string.isRequired,
  'limit': _propTypes.default.number,
  'columnDefinitions': _propTypes.default.arrayOf(_propTypes.default.object),
  'defaultWidthMap': _propTypes.default.shape({
    'lg': _propTypes.default.number.isRequired,
    'md': _propTypes.default.number.isRequired,
    'sm': _propTypes.default.number.isRequired
  }).isRequired,
  'hiddenColumns': _propTypes.default.objectOf(_propTypes.default.bool),
  'renderDetailPane': _propTypes.default.func,
  'totalExpected': _propTypes.default.number.isRequired,
  'windowWidth': _propTypes.default.number.isRequired,
  'registerWindowOnScrollHandler': _propTypes.default.func.isRequired,
  'columnExtensionMap': _propTypes.default.objectOf(_propTypes.default.shape({
    "title": _propTypes.default.string.isRequired,
    "widthMap": _propTypes.default.shape({
      'lg': _propTypes.default.number,
      'md': _propTypes.default.number,
      'sm': _propTypes.default.number
    }),
    "minColumnWidth": _propTypes.default.number,
    "order": _propTypes.default.number,
    "render": _propTypes.default.func,
    "noSort": _propTypes.default.bool
  }))
});

_defineProperty(SearchResultTable, "defaultProps", {
  'columnExtensionMap': {},
  'renderDetailPane': function renderDetailPane(result, rowNumber, width) {
    return _react.default.createElement(DefaultDetailPane, {
      result: result,
      rowNumber: rowNumber,
      width: width
    });
  },
  'defaultWidthMap': _tableCommons.DEFAULT_WIDTH_MAP,
  'defaultMinColumnWidth': 55,
  'hiddenColumns': null,
  'limit': 25,
  'rowHeight': 47,
  'stickyHeaderTopOffset': -40,
  'fullWidthInitOffset': 60,
  'fullWidthContainerSelectorString': '.browse-page-container',
  'currentAction': null
});