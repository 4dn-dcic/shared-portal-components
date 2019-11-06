'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FacetOfFacets = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Collapse = require("./../../../ui/Collapse");

var _Fade = require("./../../../ui/Fade");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Used to render individual facet fields and their available terms in FacetList.
 *
 * @memberof module:facetlist
 * @class Facet
 * @type {Component}
 */
var FacetOfFacets =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(FacetOfFacets, _React$PureComponent);

  function FacetOfFacets(props) {
    var _this;

    _classCallCheck(this, FacetOfFacets);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FacetOfFacets).call(this, props));
    _this.handleOpenToggleClick = _this.handleOpenToggleClick.bind(_assertThisInitialized(_this));
    _this.handleExpandListToggleClick = _this.handleExpandListToggleClick.bind(_assertThisInitialized(_this));
    _this.state = {
      'facetOpen': typeof props.defaultFacetOpen === 'boolean' ? props.defaultFacetOpen : true,
      'facetClosing': false,
      'expanded': false
    };
    return _this;
  }

  _createClass(FacetOfFacets, [{
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      var _this2 = this;

      e.preventDefault();
      this.setState(function (_ref) {
        var facetOpen = _ref.facetOpen;

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
          _this2.setState(function (_ref2) {
            var facetOpen = _ref2.facetOpen,
                facetClosing = _ref2.facetClosing;

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
      this.setState(function (_ref3) {
        var expanded = _ref3.expanded;
        return {
          'expanded': !expanded
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          facetList = _this$props.facets,
          tooltip = _this$props.tooltip;
      var _this$state = this.state,
          facetOpen = _this$state.facetOpen,
          facetClosing = _this$state.facetClosing;
      return _react["default"].createElement("div", {
        className: "facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : ''),
        "data-field": title
      }, _react["default"].createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, _react["default"].createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")
      })), _react["default"].createElement("span", {
        className: "inline-block col px-0",
        "data-tip": tooltip,
        "data-place": "right"
      }, title), _react["default"].createElement(_Fade.Fade, {
        "in": facetClosing || !facetOpen
      }, _react["default"].createElement("span", {
        className: "closed-terms-count col-auto px-0",
        "data-tip": "Nested filters (".concat(facetList.length, ")")
      }, _react["default"].createElement("i", {
        className: "icon fas icon-layer-group",
        style: {
          opacity: 0.25
        }
      })))), _react["default"].createElement(_Collapse.Collapse, {
        "in": facetOpen && !facetClosing
      }, _react["default"].createElement("div", {
        className: "ml-2"
      }, facetList)));
    }
  }]);

  return FacetOfFacets;
}(_react["default"].PureComponent); // FacetOfFacets.propTypes = {
//     'facet'                 : PropTypes.shape({
//         'field'                 : PropTypes.string.isRequired,    // Name of nested field property in experiment objects, using dot-notation.
//         'title'                 : PropTypes.string,               // Human-readable Facet Term
//         'total'                 : PropTypes.number,               // Total experiments (or terms??) w/ field
//         'terms'                 : PropTypes.array.isRequired,     // Possible terms,
//         'description'           : PropTypes.string,
//         'aggregation_type'      : PropTypes.oneOf(["stats", "terms"])
//     }),
//     'defaultFacetOpen'      : PropTypes.bool,
//     'onFilter'              : PropTypes.func,           // Executed on term click
//     'extraClassname'        : PropTypes.string,
//     'schemas'               : PropTypes.object,
//     'getTermStatus'         : PropTypes.func.isRequired,
//     'href'                  : PropTypes.string.isRequired,
//     'filters'               : PropTypes.arrayOf(PropTypes.object).isRequired,
//     'mounted'               : PropTypes.bool
// };


exports.FacetOfFacets = FacetOfFacets;