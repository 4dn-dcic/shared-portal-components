'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FacetOfFacets = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _Collapse = require("./../../../ui/Collapse");

var _Fade = require("./../../../ui/Fade");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Used to render individual facet fields and their available terms in FacetList.
 */
var FacetOfFacets =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(FacetOfFacets, _React$PureComponent);

  _createClass(FacetOfFacets, null, [{
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

  function FacetOfFacets(props) {
    var _this;

    _classCallCheck(this, FacetOfFacets);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FacetOfFacets).call(this, props));
    _this.handleOpenToggleClick = _this.handleOpenToggleClick.bind(_assertThisInitialized(_this));
    _this.handleExpandListToggleClick = _this.handleExpandListToggleClick.bind(_assertThisInitialized(_this));
    _this.memoized = {
      anyFacetsHaveSelection: (0, _memoizeOne["default"])(FacetOfFacets.anyFacetsHaveSelection)
    }; // Most of this logic (facetOpen/facetClosing at least) is same between this and FacetTermsList.
    // Maybe we could pull it out into reusable controller component. Maybe. Very low priority.

    _this.state = {
      'facetOpen': typeof props.defaultGroupOpen === 'boolean' ? props.defaultGroupOpen : true,
      'facetClosing': false,
      'expanded': false
    };
    return _this;
  }

  _createClass(FacetOfFacets, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var _this2 = this;

      var _this$props = this.props,
          renderedFacets = _this$props.facets,
          mounted = _this$props.mounted,
          defaultGroupOpen = _this$props.defaultGroupOpen,
          isStatic = _this$props.isStatic;
      var pastMounted = pastProps.mounted,
          pastDefaultOpen = pastProps.defaultGroupOpen,
          pastStatic = pastProps.isStatic;
      this.setState(function (_ref) {
        var currFacetOpen = _ref.facetOpen;

        if (!pastMounted && mounted && typeof defaultGroupOpen === 'boolean' && defaultGroupOpen !== pastDefaultOpen) {
          return {
            'facetOpen': true
          };
        }

        if (defaultGroupOpen === true && !pastDefaultOpen && !currFacetOpen) {
          return {
            'facetOpen': true
          };
        }

        if (currFacetOpen && isStatic && !pastStatic && !_this2.memoized.anyFacetsHaveSelection(renderedFacets)) {
          return {
            'facetOpen': false
          };
        }

        return null;
      }, function () {
        var facetOpen = _this2.state.facetOpen;

        if (pastState.facetOpen !== facetOpen) {
          _reactTooltip["default"].rebuild();
        }
      });
    }
  }, {
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      var _this3 = this;

      e.preventDefault();
      this.setState(function (_ref2) {
        var facetOpen = _ref2.facetOpen;

        if (!facetOpen) {
          return {
            'facetOpen': true
          };
        } else {
          return {
            'facetClosing': true
          };
        }
      }, function () {
        setTimeout(function () {
          _this3.setState(function (_ref3) {
            var facetOpen = _ref3.facetOpen,
                facetClosing = _ref3.facetClosing;

            if (facetClosing) {
              return {
                'facetOpen': false,
                'facetClosing': false
              };
            }

            return null;
          });
        }, 350);
      });
    }
  }, {
    key: "handleExpandListToggleClick",
    value: function handleExpandListToggleClick(e) {
      e.preventDefault();
      this.setState(function (_ref4) {
        var expanded = _ref4.expanded;
        return {
          'expanded': !expanded
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          title = _this$props2.title,
          renderedFacets = _this$props2.facets,
          tooltip = _this$props2.tooltip;
      var _this$state = this.state,
          facetOpen = _this$state.facetOpen,
          facetClosing = _this$state.facetClosing;
      var anySelections = this.memoized.anyFacetsHaveSelection(renderedFacets); // Ensure all facets within group are not "static single terms".

      var extendedFacets = _react["default"].Children.map(renderedFacets, function (renderedFacet) {
        return _react["default"].cloneElement(renderedFacet, {
          isStatic: false
        });
      });

      return _react["default"].createElement("div", {
        className: "facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : ''),
        "data-group": title
      }, _react["default"].createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, _react["default"].createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")
      })), _react["default"].createElement("div", {
        className: "col px-0 line-height-1"
      }, _react["default"].createElement("span", {
        "data-tip": tooltip,
        "data-place": "right"
      }, title)), _react["default"].createElement(_Fade.Fade, {
        "in": facetClosing || !facetOpen
      }, _react["default"].createElement("span", {
        className: "closed-terms-count col-auto px-0" + (anySelections ? " some-selected" : ""),
        "data-place": "right",
        "data-tip": "Group of ".concat(extendedFacets.length, " facets ").concat(anySelections ? " with at least 1 having a selection." : "")
      }, _react["default"].createElement("i", {
        className: "icon fas icon-layer-group"
      })))), _react["default"].createElement(_Collapse.Collapse, {
        "in": facetOpen && !facetClosing
      }, _react["default"].createElement("div", {
        className: "facet-group-list-container"
      }, extendedFacets)));
    }
  }]);

  return FacetOfFacets;
}(_react["default"].PureComponent);

exports.FacetOfFacets = FacetOfFacets;
FacetOfFacets.propTypes = {
  'defaultGroupOpen': _propTypes["default"].bool,
  'facets': _propTypes["default"].arrayOf(_propTypes["default"].element),
  'filters': _propTypes["default"].arrayOf(_propTypes["default"].object).isRequired,
  'isStatic': _propTypes["default"].bool,
  'itemTypeForSchemas': _propTypes["default"].string,
  'mounted': _propTypes["default"].bool,
  'onFilter': _propTypes["default"].func,
  // Executed on term click
  'schemas': _propTypes["default"].object,
  'separateSingleTermFacets': _propTypes["default"].bool,
  'termTransformFxn': _propTypes["default"].func,
  'title': _propTypes["default"].string,
  'extraClassname': _propTypes["default"].string
};