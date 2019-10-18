'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FacetTermsList = exports.Term = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _Collapse = require("./../../../ui/Collapse");

var _Fade = require("./../../../ui/Fade");

var _PartialList = require("./../../../ui/PartialList");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Used to render individual terms in FacetList.
 */
var Term =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Term, _React$PureComponent);

  function Term(props) {
    var _this;

    _classCallCheck(this, Term);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Term).call(this, props));
    _this.handleClick = _underscore["default"].debounce(_this.handleClick.bind(_assertThisInitialized(_this)), 500, true);
    _this.state = {
      'filtering': false
    };
    return _this;
  }

  _createClass(Term, [{
    key: "handleClick",
    value: function handleClick(e) {
      var _this2 = this;

      var _this$props = this.props,
          facet = _this$props.facet,
          term = _this$props.term,
          onClick = _this$props.onClick;
      e.preventDefault();
      this.setState({
        'filtering': true
      }, function () {
        onClick(facet, term, e, function () {
          return _this2.setState({
            'filtering': false
          });
        });
      });
    }
    /**
     * INCOMPLETE -
     *   For future, in addition to making a nice date range title, we should
     *   also ensure that can send a date range as a filter and be able to parse it on
     *   back-end.
     * Handle date fields, etc.
     */

    /*
    customTitleRender(){
        const { facet, term, termTransformFxn } = this.props;
         if (facet.aggregation_type === 'range'){
            return (
                (typeof term.from !== 'undefined' ? termTransformFxn(facet.field, term.from, true) : '< ') +
                (typeof term.from !== 'undefined' && typeof term.to !== 'undefined' ? ' - ' : '') +
                (typeof term.to !== 'undefined' ? termTransformFxn(facet.field, term.to, true) : ' >')
            );
        }
         if (facet.aggregation_type === 'date_histogram'){
            var interval = Filters.getDateHistogramIntervalFromFacet(facet);
            if (interval === 'month'){
                return <DateUtility.LocalizedTime timestamp={term.key} formatType="date-month" localize={false} />;
            }
        }
         return null;
    }
    */

  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          term = _this$props2.term,
          facet = _this$props2.facet,
          getTermStatus = _this$props2.getTermStatus,
          termTransformFxn = _this$props2.termTransformFxn;
      var filtering = this.state.filtering;
      var status = getTermStatus(term, facet);
      var count = term && term.doc_count || 0;
      var title = termTransformFxn(facet.field, term.key) || term.key;
      var icon = null;

      if (filtering) {
        icon = _react["default"].createElement("i", {
          className: "icon fas icon-circle-notch icon-spin icon-fw"
        });
      } else if (status === 'selected') {
        icon = _react["default"].createElement("i", {
          className: "icon icon-times-circle icon-fw fas"
        });
      } else if (status === 'omitted') {
        icon = _react["default"].createElement("i", {
          className: "icon icon-minus-circle icon-fw fas"
        });
      } else {
        icon = _react["default"].createElement("i", {
          className: "icon icon-circle icon-fw unselected far"
        });
      }

      if (!title || title === 'null' || title === 'undefined') {
        title = 'None';
      }

      var statusClassName = status !== 'none' ? status === 'selected' ? " selected" : " omitted" : '';
      return _react["default"].createElement("li", {
        className: "facet-list-element " + statusClassName,
        key: term.key,
        "data-key": term.key
      }, _react["default"].createElement("a", {
        className: "term",
        "data-selected": status !== 'none',
        href: "#",
        onClick: this.handleClick,
        "data-term": term.key
      }, _react["default"].createElement("span", {
        className: "facet-selector"
      }, icon), _react["default"].createElement("span", {
        className: "facet-item",
        "data-tip": title.length > 30 ? title : null
      }, title), _react["default"].createElement("span", {
        className: "facet-count"
      }, count)));
    }
  }]);

  return Term;
}(_react["default"].PureComponent);

exports.Term = Term;
Term.propTypes = {
  'facet': _propTypes["default"].shape({
    'field': _propTypes["default"].string.isRequired
  }).isRequired,
  'term': _propTypes["default"].shape({
    'key': _propTypes["default"].string.isRequired,
    'doc_count': _propTypes["default"].number
  }).isRequired,
  'getTermStatus': _propTypes["default"].func.isRequired,
  'onClick': _propTypes["default"].func.isRequired
};

var FacetTermsList =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(FacetTermsList, _React$PureComponent2);

  _createClass(FacetTermsList, null, [{
    key: "anyTermsSelected",
    value: function anyTermsSelected() {
      var terms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var facet = arguments.length > 1 ? arguments[1] : undefined;
      var getStatus = arguments.length > 2 ? arguments[2] : undefined;

      for (var i = 0; i < terms.length; i++) {
        var term = terms[i];
        var status = getStatus(term, facet);

        if (status === "selected" || status === "omitted") {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "filterTerms",
    value: function filterTerms(facet, filters) {
      var activeTermsForField = {};
      filters.forEach(function (f) {
        if (f.field !== facet.field) return;
        activeTermsForField[f.term] = true;
      }); // Filter out terms w/ 0 counts (in case).

      var terms = facet.terms.filter(function (term) {
        if (term.doc_count > 0) return true;
        if (term.key === "No value") return false;
        if (activeTermsForField[term.key]) return true;
        return false;
      }); // Filter out type=Item for now (hardcode)

      if (facet.field === "type") {
        terms = terms.filter(function (t) {
          return t !== 'Item' && t && t.key !== 'Item';
        });
      }

      return terms;
    }
  }]);

  function FacetTermsList(props) {
    var _this3;

    _classCallCheck(this, FacetTermsList);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(FacetTermsList).call(this, props));
    _this3.handleOpenToggleClick = _this3.handleOpenToggleClick.bind(_assertThisInitialized(_this3));
    _this3.handleExpandListToggleClick = _this3.handleExpandListToggleClick.bind(_assertThisInitialized(_this3));
    _this3.renderTerms = _this3.renderTerms.bind(_assertThisInitialized(_this3));
    _this3.state = {
      'facetOpen': typeof props.defaultFacetOpen === 'boolean' ? props.defaultFacetOpen : true,
      'facetClosing': false,
      'expanded': false
    };
    _this3.memoized = {
      anyTermsSelected: (0, _memoizeOne["default"])(FacetTermsList.anyTermsSelected),
      filterTerms: (0, _memoizeOne["default"])(FacetTermsList.filterTerms)
    };
    return _this3;
  }

  _createClass(FacetTermsList, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var _this4 = this;

      var _this$props3 = this.props,
          mounted = _this$props3.mounted,
          defaultFacetOpen = _this$props3.defaultFacetOpen,
          isStatic = _this$props3.isStatic,
          getTermStatus = _this$props3.getTermStatus,
          facet = _this$props3.facet;
      this.setState(function (_ref) {
        var currFacetOpen = _ref.facetOpen;

        if (!pastProps.mounted && mounted && typeof defaultFacetOpen === 'boolean' && defaultFacetOpen !== pastProps.defaultFacetOpen) {
          return {
            'facetOpen': true
          };
        }

        if (defaultFacetOpen === true && !pastProps.defaultFacetOpen && !currFacetOpen) {
          return {
            'facetOpen': true
          };
        }

        if (currFacetOpen && isStatic && !pastProps.isStatic && !_this4.memoized.anyTermsSelected(_this4.memoized.filterTerms(facet), facet, getTermStatus)) {
          return {
            'facetOpen': false
          };
        }

        return null;
      }, function () {
        var facetOpen = _this4.state.facetOpen;

        if (pastState.facetOpen !== facetOpen) {
          _reactTooltip["default"].rebuild();
        }
      });
    }
  }, {
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      var _this5 = this;

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
          _this5.setState(function (_ref3) {
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
    key: "renderTerms",
    value: function renderTerms(terms) {
      var _this6 = this;

      var _this$props4 = this.props,
          facet = _this$props4.facet,
          persistentCount = _this$props4.persistentCount,
          onTermClick = _this$props4.onTermClick;
      var expanded = this.state.expanded;

      var makeTermComponent = function (term) {
        return _react["default"].createElement(Term, _extends({}, _this6.props, {
          onClick: onTermClick,
          key: term.key,
          term: term,
          total: facet.total
        }));
      };

      if (terms.length > persistentCount) {
        var persistentTerms = terms.slice(0, persistentCount);
        var collapsibleTerms = terms.slice(persistentCount);
        var remainingTermsCount = !expanded ? _underscore["default"].reduce(collapsibleTerms, function (m, term) {
          return m + (term.doc_count || 0);
        }, 0) : null;
        var expandButtonTitle;

        if (expanded) {
          expandButtonTitle = _react["default"].createElement("span", null, _react["default"].createElement("i", {
            className: "icon icon-fw icon-minus fas"
          }), " Collapse");
        } else {
          expandButtonTitle = _react["default"].createElement("span", null, _react["default"].createElement("i", {
            className: "icon icon-fw icon-plus fas"
          }), " View ", terms.length - persistentCount, " More", _react["default"].createElement("span", {
            className: "pull-right"
          }, remainingTermsCount));
        }

        return _react["default"].createElement("div", {
          className: "facet-list"
        }, _react["default"].createElement(_PartialList.PartialList, {
          open: expanded,
          persistent: _underscore["default"].map(persistentTerms, makeTermComponent),
          collapsible: _underscore["default"].map(collapsibleTerms, makeTermComponent)
        }), _react["default"].createElement("div", {
          className: "view-more-button",
          onClick: this.handleExpandListToggleClick
        }, expandButtonTitle));
      } else {
        return _react["default"].createElement("div", {
          className: "facet-list"
        }, _underscore["default"].map(terms, makeTermComponent));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          facet = _this$props5.facet,
          filters = _this$props5.filters,
          tooltip = _this$props5.tooltip,
          title = _this$props5.title,
          isStatic = _this$props5.isStatic,
          getTermStatus = _this$props5.getTermStatus;
      var _this$state = this.state,
          facetOpen = _this$state.facetOpen,
          facetClosing = _this$state.facetClosing;
      var terms = this.memoized.filterTerms(facet, filters);
      var anyTermsSelected = this.memoized.anyTermsSelected(terms, facet, getTermStatus);
      var termsLen = terms.length;
      var indicator;

      if (isStatic || termsLen === 1) {
        indicator = // Small indicator to help represent how many terms there are available for this Facet.
        _react["default"].createElement(_Fade.Fade, {
          "in": facetClosing || !facetOpen
        }, _react["default"].createElement("span", {
          className: "closed-terms-count col-auto px-0" + (anyTermsSelected ? " text-primary" : ""),
          "data-tip": "No useful options (1 total)" + (anyTermsSelected ? "; is selected" : ""),
          "data-any-selected": anyTermsSelected
        }, _react["default"].createElement("i", {
          className: "icon fas icon-" + (anyTermsSelected ? "circle" : "minus-circle"),
          style: {
            opacity: anyTermsSelected ? 0.75 : 0.25
          }
        })));
      } else {
        indicator = // Small indicator to help represent how many terms there are available for this Facet.
        _react["default"].createElement(_Fade.Fade, {
          "in": facetClosing || !facetOpen
        }, _react["default"].createElement("span", {
          className: "closed-terms-count col-auto px-0" + (anyTermsSelected ? " text-primary" : ""),
          "data-tip": termsLen + " options" + (anyTermsSelected ? " with at least one selected" : ""),
          "data-any-selected": anyTermsSelected
        }, _underscore["default"].range(0, Math.min(Math.ceil(termsLen / 3), 8)).map(function (c) {
          return _react["default"].createElement("i", {
            className: "icon icon-ellipsis-v fas",
            key: c,
            style: {
              opacity: (c + 1) / 5 * 0.67 + 0.33
            }
          });
        })));
      } // List of terms


      return _react["default"].createElement("div", {
        className: "facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : ''),
        "data-field": facet.field
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
      }, title), indicator), _react["default"].createElement(_Collapse.Collapse, {
        "in": facetOpen && !facetClosing
      }, this.renderTerms(terms)));
    }
  }]);

  return FacetTermsList;
}(_react["default"].PureComponent);

exports.FacetTermsList = FacetTermsList;
FacetTermsList.defaultProps = {
  'persistentCount': 10
};