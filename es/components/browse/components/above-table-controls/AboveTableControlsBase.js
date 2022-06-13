import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import memoize from 'memoize-one';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import Collapse from 'react-bootstrap/esm/Collapse';
import { AboveTablePanelWrapper } from './AboveTablePanelWrapper';
import { RightButtonsSection } from './RightButtonsSection';
import { CustomColumnSelector } from './../CustomColumnController';
import { MultiColumnSortSelector } from './../SortController';
/**
 * This component must be fed props from CustomColumnController (for columns UI), SelectedFilesController (for selected files read-out).
 * Some may need to be transformed to exclude certain non-user-controlled columns (e.g. @type) and such.
 */

export var AboveTableControlsBase = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(AboveTableControlsBase, _React$PureComponent);

  var _super = _createSuper(AboveTableControlsBase);

  function AboveTableControlsBase(props) {
    var _this;

    _classCallCheck(this, AboveTableControlsBase);

    _this = _super.call(this, props);
    _this.handleOpenToggle = _.throttle(_this.handleOpenToggle.bind(_assertThisInitialized(_this)), 350);
    _this.handleClose = _this.handleOpenToggle.bind(_assertThisInitialized(_this), false);
    _this.handleOpenColumnsSelectionPanel = _this.handleOpenToggle.bind(_assertThisInitialized(_this), 'customColumns');
    _this.panelToggleFxns = {};
    Object.keys(props.panelMap).forEach(function (key) {
      _this.panelToggleFxns[key] = _this.handleOpenToggle.bind(_assertThisInitialized(_this), key);
    });
    /**
     * @property {boolean} state.open - Whether panel is open.
     * @property {boolean} state.reallyOpen - Extra check for if open, will remain true until 'closing' transition is complete.
     * @property {string[]} state.fileTypeFilters - List of file_type_detailed strings that we filter selected files down to.
     */

    _this.state = {
      'open': false,
      'reallyOpen': false
    };
    return _this;
  }

  _createClass(AboveTableControlsBase, [{
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
      var _this2 = this;

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
        var _this2$state = _this2.state,
            open = _this2$state.open,
            reallyOpen = _this2$state.reallyOpen;
        setTimeout(ReactTooltip.rebuild, 100);

        if (!open && reallyOpen) {
          _this2.timeout = setTimeout(function () {
            _this2.setState({
              'reallyOpen': false
            });
          }, 400);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          children = _this$props.children,
          _this$props$panelMap = _this$props.panelMap,
          panelMap = _this$props$panelMap === void 0 ? {} : _this$props$panelMap;
      var _this$state = this.state,
          open = _this$state.open,
          reallyOpen = _this$state.reallyOpen;
      var extendedChildren = React.Children.map(children, function (child) {
        if ( /*#__PURE__*/React.isValidElement(child)) {
          if (typeof child.type !== "string") {
            return /*#__PURE__*/React.cloneElement(child, {
              "panelToggleFxns": _this3.panelToggleFxns,
              "onClosePanel": _this3.handleClose,
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

      return /*#__PURE__*/React.createElement("div", {
        className: "above-results-table-row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "row align-items-center"
      }, extendedChildren, /*#__PURE__*/React.createElement(RightButtonsSection, _extends({}, _.pick(this.props, 'isFullscreen', 'windowWidth', 'toggleFullScreen', 'showMultiColumnSort'), {
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
    value: // TODO: Refactor out this panelMap stuff, leave as just hardcoded col selection maybe.
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

  return AboveTableControlsBase;
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
  }
};