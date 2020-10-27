'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboveSearchViewTableControls = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

var _AboveTableControlsBase = require("./AboveTableControlsBase");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/** This left section for Search should be made prettier, either kept in 4DN or re-used. */
var AboveSearchViewTableControls = /*#__PURE__*/_react["default"].memo(function (props) {
  var context = props.context,
      currentAction = props.currentAction,
      topLeftChildren = props.topLeftChildren;
  var _ref$total = (context || {}).total,
      showTotalResults = _ref$total === void 0 ? 0 : _ref$total; // Case if on SearchView

  var total = null;

  if (typeof showTotalResults === 'number') {
    total = /*#__PURE__*/_react["default"].createElement("div", {
      className: "d-inline-block"
    }, /*#__PURE__*/_react["default"].createElement("span", {
      className: "text-500",
      id: "results-count"
    }, showTotalResults), " Results");
  } // FOR NOW, we'll stick 'add' button here. -- IF NO SELECTED FILES CONTROLS


  var addButton = null; // don't show during submission search "selecting existing"

  if (context && Array.isArray(context.actions) && !currentAction) {
    var addAction = _underscore["default"].findWhere(context.actions, {
      'name': 'add'
    });

    if (addAction && typeof addAction.href === 'string') {
      addButton = /*#__PURE__*/_react["default"].createElement("a", {
        className: "btn btn-primary btn-xs" + (total ? " ml-1" : ""),
        href: addAction.href,
        "data-skiprequest": "true"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-plus fas mr-03 fas"
      }), "Create New \xA0");
    }
  }

  return (
    /*#__PURE__*/
    // TODO refactor out panelMap stuff.
    _react["default"].createElement(_AboveTableControlsBase.AboveTableControlsBase, _extends({
      panelMap: _AboveTableControlsBase.AboveTableControlsBase.getCustomColumnSelectorPanelMapDefinition(props)
    }, _underscore["default"].pick(props, 'isFullscreen', 'windowWidth', 'toggleFullScreen')), /*#__PURE__*/_react["default"].createElement(LeftSectionControls, {
      total: total,
      addButton: addButton,
      topLeftChildren: topLeftChildren
    }))
  );
});

exports.AboveSearchViewTableControls = AboveSearchViewTableControls;

function LeftSectionControls(_ref2) {
  var total = _ref2.total,
      addButton = _ref2.addButton,
      topLeftChildren = _ref2.topLeftChildren,
      panelToggleFxns = _ref2.panelToggleFxns,
      onClosePanel = _ref2.onClosePanel,
      currentOpenPanel = _ref2.currentOpenPanel;
  if (!total && !addButton && !topLeftChildren) return null;
  return /*#__PURE__*/_react["default"].createElement("div", {
    key: "total-count",
    className: "col pt-11 box results-count"
  }, total, topLeftChildren || addButton);
}