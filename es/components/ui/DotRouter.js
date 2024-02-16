'use strict';

import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["tabTitle", "dotPath", "disabled", "active", "prependDotPath", "children", "className"];
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react';
import _ from 'underscore';
import memoize from 'memoize-one';
import url from 'url';
import { navigate } from '../util';
export var TabPaneErrorBoundary = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(TabPaneErrorBoundary, _React$PureComponent);
  var _super = _createSuper(TabPaneErrorBoundary);
  function TabPaneErrorBoundary(props) {
    var _this;
    _classCallCheck(this, TabPaneErrorBoundary);
    _this = _super.call(this, props);
    _this.state = {
      hasError: false
    };
    return _this;
  }
  _createClass(TabPaneErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      analytics.exception("TabPaneErrorBoundary: " + info.componentStack);
      console.error("Caught error", error, info);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        children = _this$props.children,
        fallbackView = _this$props.fallbackView;
      var hasError = this.state.hasError;
      if (hasError) return fallbackView;
      return children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError() {
      // Update state so the next render will show the fallback UI.
      return {
        hasError: true
      };
    }
  }]);
  return TabPaneErrorBoundary;
}(React.PureComponent);

/**
 * Allows for the creation of tabbed views within Item pages that can be accessed by using
 * a "dot path". Ex. (/case/<id>/#overview.bioinformatics will route users to the bioinformatics
 * tab on case load while /case/<id>/#overview will route users to the accessioning tab or other default view).
 *
 * Used in CaseView and AnalysisView.
 */
_defineProperty(TabPaneErrorBoundary, "defaultProps", {
  "fallbackView": /*#__PURE__*/React.createElement("div", {
    className: "error-boundary-container container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "error-msg-container mt-3 mb-3 row"
  }, /*#__PURE__*/React.createElement("i", {
    className: "icon icon-times fas col-auto"
  }), /*#__PURE__*/React.createElement("div", {
    className: "title-wrapper col"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-400 mb-0 mt-0"
  }, "A client-side error has occured, please go back or try again later."))))
});
export var DotRouter = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(DotRouter, _React$PureComponent2);
  var _super2 = _createSuper(DotRouter);
  function DotRouter(props) {
    var _this2;
    _classCallCheck(this, DotRouter);
    _this2 = _super2.call(this, props);
    _this2.getCurrentTab = _this2.getCurrentTab.bind(_assertThisInitialized(_this2));
    _this2.memoized = {
      getDefaultTab: memoize(DotRouter.getDefaultTab),
      getDotPath: memoize(DotRouter.getDotPath)
    };
    return _this2;
  }

  /**
   * Method is not explicitly memoized b.c. this component only has 2 props & is a PureComponent itself
   */
  _createClass(DotRouter, [{
    key: "getCurrentTab",
    value: function getCurrentTab() {
      var _this$props2 = this.props,
        children = _this$props2.children,
        href = _this$props2.href;
      var dotPath = this.memoized.getDotPath(href);
      if (dotPath) {
        for (var i = 0; i < children.length; i++) {
          var currChild = children[i];
          if (currChild.props.dotPath === dotPath && !currChild.props.disabled) {
            // Maybe consider removing `&& !currChild.props.disabled` check from if condition
            // for UX-URL consistency (show case review tab if go there, even if nothing to show).
            return currChild;
          }
        }
      }
      return this.memoized.getDefaultTab(children);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
        children = _this$props3.children,
        className = _this$props3.className,
        prependDotPath = _this$props3.prependDotPath,
        navClassName = _this$props3.navClassName,
        contentsClassName = _this$props3.contentsClassName,
        elementID = _this$props3.elementID,
        _this$props3$isActive = _this$props3.isActive,
        isActive = _this$props3$isActive === void 0 ? true : _this$props3$isActive;
      var currentTab = this.getCurrentTab();
      var currTabDotPath = currentTab.props.dotPath; // Falls back to default tab if not in hash.
      // const contentClassName = "tab-router-contents" + (contentsClassName ? " " + contentsClassName : "");
      var allTabContents = [];
      var adjustedChildren = React.Children.map(children, function (childTab, index) {
        var _childTab$props = childTab.props,
          dotPath = _childTab$props.dotPath,
          tabChildren = _childTab$props.children,
          _childTab$props$cache = _childTab$props.cache,
          cache = _childTab$props$cache === void 0 ? false : _childTab$props$cache,
          overridingContentsClassName = _childTab$props.contentsClassName;
        var active = isActive && currTabDotPath === dotPath;
        if (active || cache) {
          // If we cache tab contents, then pass down `props.isActiveDotRouterTab` so select downstream components
          // can hide or unmount themselves when not needed for performance.
          var transformedChildren = !cache ? tabChildren : React.Children.map(tabChildren, function (child) {
            if (! /*#__PURE__*/React.isValidElement(child)) {
              // String or something
              return child;
            }
            if (typeof child.type === "string") {
              // Normal element (a, div, etc)
              return child;
            } // Else is React component
            return /*#__PURE__*/React.cloneElement(child, {
              "isActiveDotRouterTab": active
            });
          });
          var clsSuffix = overridingContentsClassName || contentsClassName || null;
          var cls = "tab-router-contents" + (clsSuffix ? " " + clsSuffix : "") + (!active ? " d-none" : "");
          allTabContents.push( /*#__PURE__*/React.createElement("div", {
            className: cls,
            id: (prependDotPath || "") + dotPath,
            "data-tab-index": index,
            key: dotPath
          }, /*#__PURE__*/React.createElement(TabPaneErrorBoundary, null, transformedChildren)));
        }
        return /*#__PURE__*/React.cloneElement(childTab, {
          "key": dotPath,
          active: active,
          prependDotPath: prependDotPath,
          index: index
        });
      });
      return /*#__PURE__*/React.createElement("div", {
        className: "tab-router" + (className ? " " + className : ""),
        id: elementID
      }, /*#__PURE__*/React.createElement("nav", {
        className: "dot-tab-nav" + (navClassName ? " " + navClassName : "")
      }, /*#__PURE__*/React.createElement("div", {
        className: "dot-tab-nav-list"
      }, adjustedChildren)), allTabContents);
    }
  }], [{
    key: "getDotPath",
    value: function getDotPath(href) {
      // Path must contain both tab (hashroute) and dotpath to navigate properly
      var hashString = (url.parse(href, false).hash || "#").slice(1) || null;

      // Handle the case where there's no dot path
      if (!hashString || hashString.indexOf(".") < 0) return null;
      var dotPathSplit = hashString.split(".");
      return "." + dotPathSplit[dotPathSplit.length - 1];
    }
  }, {
    key: "getDefaultTab",
    value: function getDefaultTab(children) {
      var childrenLen = children.length;
      if (childrenLen === 0) {
        throw new Error("Must provide children and ideally default tab to DotRouter via props.");
      }
      var defaultChildTab = null;
      for (var i = 0; i < childrenLen; i++) {
        var currChild = children[i];
        if (currChild.props.disabled) {
          continue;
        }
        defaultChildTab = currChild;
        if (currChild.props["default"] === true) {
          break;
        }
      }

      // If no default found, use last non-disabled tab.
      return defaultChildTab;
    }
  }]);
  return DotRouter;
}(React.PureComponent);
_defineProperty(DotRouter, "defaultProps", {
  "className": null,
  "navClassName": "container-wide",
  "contentsClassName": "container-wide",
  "elementID": "dot-router"
});
export var DotRouterTab = /*#__PURE__*/React.memo(function (props) {
  var tabTitle = props.tabTitle,
    dotPath = props.dotPath,
    _props$disabled = props.disabled,
    disabled = _props$disabled === void 0 ? false : _props$disabled,
    active = props.active,
    prependDotPath = props.prependDotPath,
    children = props.children,
    _props$className = props.className,
    className = _props$className === void 0 ? "" : _props$className,
    passProps = _objectWithoutProperties(props, _excluded);
  var onClick = useCallback(function () {
    navigate("#" + (prependDotPath + dotPath), {
      "skipRequest": true,
      "replace": true,
      "dontScrollToTop": true
    }, function () {
      // Maybe uncomment - this could be annoying if someone is also trying to keep Status Overview visible or something.
      // layout.animateScrollTo(targetDotPath);
    });
  }, []); // Previously was: [ prependDotPath, dotPath ] -- removed for now since these are hardcoded and don't change. IMPORTANT: REVERT IF THESE BECOME DYNAMIC.

  if (! /*#__PURE__*/React.isValidElement(children)) {
    throw new Error("Expected children to be present and valid JSX");
  }
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: disabled ? null : onClick,
    disabled: disabled,
    className: "arrow-tab" + (disabled ? " disabled " : "") + (active ? " active" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "btn-prepend d-xs-none"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1.5875 4.2333333",
    width: 6,
    height: 16
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0,4.2333333 1.5875,2.1166667 v 2.1166666 z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 0,3.3e-6 1.5875,0 v 2.1166667 z"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "btn-title"
  }, tabTitle), /*#__PURE__*/React.createElement("div", {
    className: "btn-append d-xs-none"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1.5875 4.2333333",
    width: 6,
    height: 16
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0,3.3e-6 1.5875,2.1166733 0,4.2333333 Z"
  }))));
}, function (prevProps, nextProps) {
  // Custom equality comparison func.
  // Skip comparing the hardcoded `prependDotPath` & `dotPath` -- revert if those props become dynamic.
  // Also skip checking for props.children, since that is rendered by `DotRouter` and not this `DotRouterTab`.

  var anyChanged = _.any(["disabled", "active", "tabTitle"], function (k) {
    return prevProps[k] !== nextProps[k];
  });
  return !anyChanged;
});