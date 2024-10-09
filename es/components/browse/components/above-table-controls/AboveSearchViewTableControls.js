import React from 'react';
import _ from 'underscore';
import { AboveTableControlsBase } from './AboveTableControlsBase';

/** This left section for Search should be made prettier, either kept in 4DN or re-used. */
export var AboveSearchViewTableControls = /*#__PURE__*/React.memo(function (props) {
  var context = props.context,
    currentAction = props.currentAction,
    topLeftChildren = props.topLeftChildren,
    isFullscreen = props.isFullscreen,
    windowWidth = props.windowWidth,
    toggleFullScreen = props.toggleFullScreen,
    sortBy = props.sortBy;
  var _ref$total = (context || {}).total,
    showTotalResults = _ref$total === void 0 ? 0 : _ref$total;

  // Case if on SearchView
  var total = null;
  if (typeof showTotalResults === 'number') {
    total = /*#__PURE__*/React.createElement("div", {
      className: "d-inline-block"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-500",
      id: "results-count"
    }, showTotalResults), " Results");
  }

  // FOR NOW, we'll stick 'add' button here. -- IF NO SELECTED FILES CONTROLS
  var addButton = null;
  // don't show during submission search "selecting existing"
  if (context && Array.isArray(context.actions) && !currentAction) {
    var addAction = _.findWhere(context.actions, {
      'name': 'add'
    });
    if (addAction && typeof addAction.href === 'string') {
      addButton = /*#__PURE__*/React.createElement("a", {
        className: "btn btn-primary btn-xs" + (total ? " ms-1" : ""),
        href: addAction.href,
        "data-skiprequest": "true"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-plus fas me-03 fas"
      }), "Create New \xA0");
    }
  }
  return (
    /*#__PURE__*/
    // TODO refactor out panelMap stuff.
    React.createElement(AboveTableControlsBase, {
      isFullscreen: isFullscreen,
      windowWidth: windowWidth,
      toggleFullScreen: toggleFullScreen,
      sortBy: sortBy,
      panelMap: AboveTableControlsBase.getCustomColumnSelectorPanelMapDefinition(props)
    }, /*#__PURE__*/React.createElement(LeftSectionControls, {
      total: total,
      addButton: addButton,
      topLeftChildren: topLeftChildren
    }))
  );
});
function LeftSectionControls(_ref2) {
  var total = _ref2.total,
    addButton = _ref2.addButton,
    topLeftChildren = _ref2.topLeftChildren,
    panelToggleFxns = _ref2.panelToggleFxns,
    onClosePanel = _ref2.onClosePanel,
    currentOpenPanel = _ref2.currentOpenPanel;
  if (!total && !addButton && !topLeftChildren) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "col box results-count flex-grow-1 d-flex align-items-end"
  }, total, topLeftChildren || addButton);
}