'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import React, { useMemo } from 'react';
/**
 * Supplies a plain JS object `detailPaneStateCache` and method for updating it
 * `updateDetailPaneStateCache` as props. `detailPaneStateCache` is to be read
 * by certain detail pane components upon being constructed and set as their initial
 * state. Used in LoadAsYouScroll, since those list items get deleted and their state
 * lost.
*/

export function DetailPaneStateCache(_ref) {
  var children = _ref.children,
      passProps = _objectWithoutProperties(_ref, ["children"]);

  /**
   * Plain object used for caching to helps to preserve open states of e.g. Processed & Raw files' sections to iron out jumping as that state is lost that would
   * otherwise be encountered during scrolling due to dismounting/destruction of ResultRow components. `detailPaneFileSectionStateCache` is read in constructor
   * or upon mount by these ResultRows.
   *
   * Runs/memoized only once on mount so that same instance of the `detailPaneFileSectionStateCache` object persists throughout lifeycle of
   * `BrowseTableWithSelectedFilesCheckboxes` component.
   */
  var ownProps = useMemo(function () {
    var detailPaneStateCache = {};
    return {
      detailPaneStateCache: detailPaneStateCache,
      updateDetailPaneStateCache: function (resultID, resultPaneState) {
        // Purposely avoid changing reference to avoid re-renders/updates (except when new components initialize)
        if (resultPaneState === null) {
          delete detailPaneStateCache[resultID];
        } else {
          detailPaneStateCache[resultID] = resultPaneState;
        }
      }
    };
  }, []);

  var childProps = _objectSpread(_objectSpread({}, passProps), ownProps);

  return React.Children.map(children, function (c) {
    if (! /*#__PURE__*/React.isValidElement(c) || typeof c.type === "string") return c;
    return /*#__PURE__*/React.cloneElement(c, childProps);
  });
}