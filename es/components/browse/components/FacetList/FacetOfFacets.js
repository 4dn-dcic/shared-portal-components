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
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import Collapse from 'react-bootstrap/esm/Collapse';
import Fade from 'react-bootstrap/esm/Fade';

/**
 * Used to render individual facet fields and their available terms in FacetList.
 */
export var FacetOfFacets = /*#__PURE__*/function (_React$PureComponent) {
  function FacetOfFacets(props) {
    var _this2;
    _classCallCheck(this, FacetOfFacets);
    _this2 = _callSuper(this, FacetOfFacets, [props]);
    _this2.handleOpenToggleClick = _this2.handleOpenToggleClick.bind(_this2);
    _this2.memoized = {
      anyFacetsHaveSelection: memoize(FacetOfFacets.anyFacetsHaveSelection)
    };
    return _this2;
  }
  _inherits(FacetOfFacets, _React$PureComponent);
  return _createClass(FacetOfFacets, [{
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      e.preventDefault();
      var _this$props = this.props,
        onToggleOpen = _this$props.onToggleOpen,
        groupTitle = _this$props.title,
        _this$props$facetOpen = _this$props.facetOpen,
        facetOpen = _this$props$facetOpen === void 0 ? false : _this$props$facetOpen;
      onToggleOpen("group:" + groupTitle, !facetOpen);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        title = _this$props2.title,
        renderedFacets = _this$props2.children,
        propTip = _this$props2.tooltip,
        facetOpen = _this$props2.facetOpen,
        _this$props2$openFace = _this$props2.openFacets,
        openFacets = _this$props2$openFace === void 0 ? {} : _this$props2$openFace;
      var anySelections = this.memoized.anyFacetsHaveSelection(renderedFacets);
      var tooltip = propTip || "Group of facets containing "; // We'll append to this in .map loop below if !propTip.

      // Ensure all facets within group are not "static single terms".
      // Pass in facetOpen prop.
      var extendedFacets = React.Children.map(renderedFacets, function (renderedFacet, i) {
        var _renderedFacet$props$ = renderedFacet.props.facet,
          field = _renderedFacet$props$.field,
          childTitle = _renderedFacet$props$.title;
        if (!propTip) {
          tooltip += (i === 0 ? "" : ", ") + childTitle;
        }
        return /*#__PURE__*/React.cloneElement(renderedFacet, {
          isStatic: false,
          facetOpen: openFacets[field]
        });
      });
      return /*#__PURE__*/React.createElement("div", {
        className: "facet" + (facetOpen || anySelections ? ' open' : ' closed'),
        "data-group": title
      }, /*#__PURE__*/React.createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, /*#__PURE__*/React.createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-" + (anySelections ? "dot-circle far" : facetOpen ? "minus fas" : "plus fas")
      })), /*#__PURE__*/React.createElement("div", {
        className: "col px-0 line-height-1"
      }, /*#__PURE__*/React.createElement("span", {
        "data-tip": tooltip,
        "data-place": "right"
      }, title)), /*#__PURE__*/React.createElement(Fade, {
        "in": !facetOpen && !anySelections
      }, /*#__PURE__*/React.createElement("span", {
        className: "closed-terms-count col-auto px-0" + (anySelections ? " some-selected" : ""),
        "data-place": "right",
        "data-tip": "Group of ".concat(extendedFacets.length, " facets ").concat(anySelections ? " with at least 1 having a selection." : "")
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-layer-group"
      })))), /*#__PURE__*/React.createElement(Collapse, {
        "in": facetOpen || anySelections
      }, /*#__PURE__*/React.createElement("div", {
        className: "facet-group-list-container"
      }, extendedFacets)));
    }
  }], [{
    key: "anyFacetsHaveSelection",
    value: function anyFacetsHaveSelection(renderedFacets) {
      for (var facetIdx = 0; facetIdx < renderedFacets.length; facetIdx++) {
        var renderedFacet = renderedFacets[facetIdx]; // We have rendered facets as `props.facets`
        var anySelected = renderedFacet.props.anyTermsSelected;
        if (anySelected) {
          return true;
        }
      }
      return false;
    }
  }]);
}(React.PureComponent);
FacetOfFacets.propTypes = {
  'defaultGroupOpen': PropTypes.bool,
  'facets': PropTypes.arrayOf(PropTypes.element),
  'isStatic': PropTypes.bool,
  'itemTypeForSchemas': PropTypes.string,
  'mounted': PropTypes.bool,
  'onFilter': PropTypes.func,
  // Executed on term click
  'schemas': PropTypes.object,
  'separateSingleTermFacets': PropTypes.bool,
  'termTransformFxn': PropTypes.func,
  'title': PropTypes.string,
  'extraClassname': PropTypes.string,
  'tooltip': PropTypes.string
};