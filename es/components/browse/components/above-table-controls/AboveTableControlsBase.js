import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
function _callSuper(_this, derived, args) {
  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, function () {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
import React from 'react';
import memoize from 'memoize-one';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import Collapse from 'react-bootstrap/esm/Collapse';
import { AboveTablePanelWrapper } from './AboveTablePanelWrapper';
import { ColumnCustomizationButtons } from './ColumnCustomizationButtons';
import { CustomColumnSelector } from './../CustomColumnController';
import { MultiColumnSortSelector } from './../SortController';

/**
 * This component must be fed props from CustomColumnController (for columns UI), SelectedFilesController (for selected files read-out).
 * Some may need to be transformed to exclude certain non-user-controlled columns (e.g. @type) and such.
 */
export var AboveTableControlsBase = /*#__PURE__*/function (_React$PureComponent) {
  function AboveTableControlsBase(props) {
    var _this2;
    _classCallCheck(this, AboveTableControlsBase);
    _this2 = _callSuper(this, AboveTableControlsBase, [props]);
    _this2.handleOpenToggle = _.throttle(_this2.handleOpenToggle.bind(_this2), 350);
    _this2.handleClose = _this2.handleOpenToggle.bind(_this2, false);
    _this2.handleOpenColumnsSelectionPanel = _this2.handleOpenToggle.bind(_this2, 'customColumns');
    _this2.panelToggleFxns = {};
    Object.keys(props.panelMap).forEach(function (key) {
      _this2.panelToggleFxns[key] = _this2.handleOpenToggle.bind(_this2, key);
    });

    /**
     * @property {boolean} state.open - Whether panel is open.
     * @property {boolean} state.reallyOpen - Extra check for if open, will remain true until 'closing' transition is complete.
     * @property {string[]} state.fileTypeFilters - List of file_type_detailed strings that we filter selected files down to.
     */
    _this2.state = {
      'open': false,
      'reallyOpen': false
    };
    return _this2;
  }
  _inherits(AboveTableControlsBase, _React$PureComponent);
  return _createClass(AboveTableControlsBase, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var open = this.state.open;
      if (open && prevState.open !== open) {
        ReactTooltip.rebuild();
      }
    }
  }, {
    key: "handleOpenToggle",
    value: function handleOpenToggle(value) {
      var _this3 = this;
      if (this.timeout) {
        clearTimeout(this.timeout);
        delete this.timeout;
      }
      this.setState(function (_ref) {
        var open = _ref.open;
        var nextState = {};
        if (typeof value === 'string' && open === value) {
          nextState.open = false;
        } else {
          nextState.open = value;
        }
        if (nextState.open) {
          nextState.reallyOpen = nextState.open;
        }
        return nextState;
      }, function () {
        var _this3$state = _this3.state,
          open = _this3$state.open,
          reallyOpen = _this3$state.reallyOpen;
        setTimeout(ReactTooltip.rebuild, 100);
        if (!open && reallyOpen) {
          _this3.timeout = setTimeout(function () {
            _this3.setState({
              'reallyOpen': false
            });
          }, 400);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;
      var _this$props = this.props,
        children = _this$props.children,
        _this$props$panelMap = _this$props.panelMap,
        panelMap = _this$props$panelMap === void 0 ? {} : _this$props$panelMap,
        topLeftChildren = _this$props.topLeftChildren,
        useSmahtLayout = _this$props.useSmahtLayout,
        customizationButtonClassName = _this$props.customizationButtonClassName;
      var _this$state = this.state,
        open = _this$state.open,
        reallyOpen = _this$state.reallyOpen;
      var extendedChildren = React.Children.map(children, function (child) {
        if ( /*#__PURE__*/React.isValidElement(child)) {
          if (typeof child.type !== "string") {
            return /*#__PURE__*/React.cloneElement(child, {
              "panelToggleFxns": _this4.panelToggleFxns,
              "onClosePanel": _this4.handleClose,
              "currentOpenPanel": open || reallyOpen
            });
          }
        }
        return child;
      });
      var panelDefinition = panelMap[open] || panelMap[reallyOpen] || null;
      var _ref2 = panelDefinition || {},
        panelTitle = _ref2.title,
        panelBody = _ref2.body;

      // Slightly different layout for SMaHT Browse View
      if (useSmahtLayout) {
        return /*#__PURE__*/React.createElement("div", {
          className: "above-results-table-row"
        }, /*#__PURE__*/React.createElement("div", {
          className: "row align-items-center"
        }, /*#__PURE__*/React.createElement("div", {
          className: "col box results-count flex-grow-1 d-flex align-items-end"
        }, topLeftChildren, /*#__PURE__*/React.createElement(ColumnCustomizationButtons, _extends({
          noWrapper: true,
          btnClassName: customizationButtonClassName
        }, _.pick(this.props, 'isFullscreen', 'windowWidth', 'toggleFullScreen', 'showMultiColumnSort'), {
          currentOpenPanel: open || reallyOpen,
          onColumnsBtnClick: this.panelToggleFxns.customColumns,
          onMultiColumnSortBtnClick: this.panelToggleFxns.multiColumnSort
        }))), /*#__PURE__*/React.createElement("div", {
          className: "right-buttons col-auto"
        }, extendedChildren)), panelDefinition ? /*#__PURE__*/React.createElement(Collapse, {
          "in": !!open,
          appear: true
        }, /*#__PURE__*/React.createElement(AboveTablePanelWrapper, {
          onClose: this.handleClose,
          title: panelTitle
        }, panelBody)) : null);
      }
      return /*#__PURE__*/React.createElement("div", {
        className: "above-results-table-row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "row align-items-center"
      }, extendedChildren, /*#__PURE__*/React.createElement(ColumnCustomizationButtons, _extends({
        btnClassName: customizationButtonClassName
      }, _.pick(this.props, 'isFullscreen', 'windowWidth', 'toggleFullScreen', 'showMultiColumnSort'), {
        currentOpenPanel: open || reallyOpen,
        onColumnsBtnClick: this.panelToggleFxns.customColumns,
        onMultiColumnSortBtnClick: this.panelToggleFxns.multiColumnSort
      }))), panelDefinition ? /*#__PURE__*/React.createElement(Collapse, {
        "in": !!open,
        appear: true
      }, /*#__PURE__*/React.createElement(AboveTablePanelWrapper, {
        onClose: this.handleClose,
        title: panelTitle
      }, panelBody)) : null);
    }
  }], [{
    key: "getCustomColumnSelectorPanelMapDefinition",
    value:
    // TODO: Refactor out this panelMap stuff, leave as just hardcoded col selection maybe.
    function getCustomColumnSelectorPanelMapDefinition(props) {
      var hiddenColumns = props.hiddenColumns,
        addHiddenColumn = props.addHiddenColumn,
        removeHiddenColumn = props.removeHiddenColumn,
        columnDefinitions = props.columnDefinitions,
        navigate = props.navigate,
        sortBy = props.sortBy,
        sortColumns = props.sortColumns;
      return {
        "customColumns": {
          "title": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
            className: "icon icon-fw icon-cog fas"
          }), /*#__PURE__*/React.createElement("span", {
            className: "title-contents"
          }, "Configure Visible Columns")),
          "body": /*#__PURE__*/React.createElement(CustomColumnSelector, {
            hiddenColumns: hiddenColumns,
            addHiddenColumn: addHiddenColumn,
            removeHiddenColumn: removeHiddenColumn,
            columnDefinitions: columnDefinitions
          })
        },
        "multiColumnSort": {
          "title": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
            className: "icon icon-fw icon-cog fas"
          }), /*#__PURE__*/React.createElement("span", {
            className: "title-contents"
          }, "Sort Multiple Columns")),
          "body": /*#__PURE__*/React.createElement(MultiColumnSortSelector, {
            navigate: navigate,
            columnDefinitions: columnDefinitions,
            sortBy: sortBy,
            sortColumns: sortColumns
          })
        }
      };
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      // Close panel if needed (as told by panelMap 'close' bool field)
      if (state.open && typeof state.open === 'string') {
        var currPanelDefinition = props.panelMap[state.open];
        if (currPanelDefinition && currPanelDefinition.close) {
          return {
            "open": false,
            "reallyOpen": false
          };
        }
      }
      return null;
    }
  }]);
}(React.PureComponent);
AboveTableControlsBase.defaultProps = {
  "panelMap": {
    // Fake -- form correct component and pass down from `getCustomColumnSelectorPanelMapDefinition`
    "customColumns": {
      "title": /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-cog fas"
      }), " hello world"),
      "body": "Hello World",
      "className": "visible-columns-selector-panel"
    }
  },
  "customizationButtonClassName": "btn btn-outline-primary"
};