'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anyTermsSelected = anyTermsSelected;
exports.countTermsSelected = countTermsSelected;
exports.mergeTerms = mergeTerms;
exports.CountIndicator = exports.FacetTermsList = exports.Term = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _utilities = require("./../../../viz/utilities");

var _Collapse = require("./../../../ui/Collapse");

var _Fade = require("./../../../ui/Fade");

var _PartialList = require("./../../../ui/PartialList");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
 * Used in FacetList
 * @deprecated
 */
function anyTermsSelected() {
  var terms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var facet = arguments.length > 1 ? arguments[1] : undefined;
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var activeTermsForField = {};
  filters.forEach(function (f) {
    if (f.field !== facet.field) return;
    activeTermsForField[f.term] = true;
  });

  for (var i = 0; i < terms.length; i++) {
    if (activeTermsForField[terms[i].key]) {
      return true;
    }
  }

  return false;
}
/**
 * Used in FacetList
 */


function countTermsSelected() {
  var terms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var facet = arguments.length > 1 ? arguments[1] : undefined;
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var activeTermsForField = {};
  var count = 0;
  filters.forEach(function (f) {
    if (f.field !== facet.field) return;
    activeTermsForField[f.term] = true;
  });

  for (var i = 0; i < terms.length; i++) {
    if (activeTermsForField[terms[i].key]) {
      count++;
    }
  }

  return count;
}
/**
 * Used in FacetList
 */


function mergeTerms(facet, filters) {
  var activeTermsForField = {};
  filters.forEach(function (f) {
    if (f.field !== facet.field) return;
    activeTermsForField[f.term] = true;
  }); // Filter out terms w/ 0 counts (in case).

  var terms = facet.terms.filter(function (term) {
    if (term.doc_count > 0) return true;
    if (activeTermsForField[term.key]) return true;
    return false;
  });
  terms.forEach(function (_ref) {
    var key = _ref.key;
    delete activeTermsForField[key];
  }); // Filter out type=Item for now (hardcode)

  if (facet.field === "type") {
    terms = terms.filter(function (t) {
      return t !== 'Item' && t && t.key !== 'Item';
    });
  } // These are terms which might have been manually defined in URL but are not present in data at all.
  // Include them so we can unselect them.


  var unseenTerms = _underscore["default"].keys(activeTermsForField).map(function (term) {
    return {
      key: term,
      doc_count: 0
    };
  });

  return terms.concat(unseenTerms);
}

function segmentTermComponentsByStatus(termComponents) {
  var groups = {};
  termComponents.forEach(function (t) {
    var status = t.props.status;

    if (!Array.isArray(groups[status])) {
      groups[status] = [];
    }

    groups[status].push(t);
  });
  return groups;
}
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
          status = _this$props2.status,
          termTransformFxn = _this$props2.termTransformFxn;
      var filtering = this.state.filtering;
      var count = term && term.doc_count || 0;
      var title = termTransformFxn(facet.field, term.key) || term.key;
      var icon = null;

      if (filtering) {
        icon = _react["default"].createElement("i", {
          className: "icon fas icon-circle-notch icon-spin icon-fw"
        });
      } else if (status === 'selected' || status === 'omitted') {
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

  function FacetTermsList(props) {
    var _this3;

    _classCallCheck(this, FacetTermsList);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(FacetTermsList).call(this, props));
    _this3.handleOpenToggleClick = _this3.handleOpenToggleClick.bind(_assertThisInitialized(_this3));
    _this3.handleExpandListToggleClick = _this3.handleExpandListToggleClick.bind(_assertThisInitialized(_this3));
    _this3.state = {
      'facetOpen': typeof props.defaultFacetOpen === 'boolean' ? props.defaultFacetOpen : true,
      'expanded': false
    };
    return _this3;
  }

  _createClass(FacetTermsList, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var _this4 = this;

      var _this$props3 = this.props,
          anySelected = _this$props3.anyTermsSelected,
          mounted = _this$props3.mounted,
          defaultFacetOpen = _this$props3.defaultFacetOpen,
          isStatic = _this$props3.isStatic,
          windowWidth = _this$props3.windowWidth;
      var pastMounted = pastProps.mounted,
          pastDefaultOpen = pastProps.defaultFacetOpen,
          pastStatic = pastProps.isStatic,
          pastWidth = pastProps.windowWidth;
      this.setState(function (_ref2) {
        var currFacetOpen = _ref2.facetOpen;

        if (pastWidth === null && typeof windowWidth === "number" && typeof defaultFacetOpen === 'boolean' && defaultFacetOpen !== pastDefaultOpen) {
          return {
            'facetOpen': true
          };
        }

        if (defaultFacetOpen === true && !pastDefaultOpen && !currFacetOpen) {
          return {
            'facetOpen': true
          };
        }

        if (currFacetOpen && isStatic && !pastStatic && !anySelected) {
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
      e.preventDefault();
      this.setState(function (_ref3) {
        var facetOpen = _ref3.facetOpen;
        return {
          'facetOpen': !facetOpen
        };
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
      var _this$props4 = this.props,
          facet = _this$props4.facet,
          terms = _this$props4.terms,
          tooltip = _this$props4.tooltip,
          title = _this$props4.title,
          isStatic = _this$props4.isStatic,
          anySelected = _this$props4.anyTermsSelected,
          termsSelectedCount = _this$props4.termsSelectedCount,
          persistentCount = _this$props4.persistentCount,
          onTermClick = _this$props4.onTermClick,
          getTermStatus = _this$props4.getTermStatus,
          termTransformFxn = _this$props4.termTransformFxn;
      var _this$state = this.state,
          facetOpen = _this$state.facetOpen,
          expanded = _this$state.expanded;
      var termsLen = terms.length;
      var allTermsSelected = termsSelectedCount === termsLen;
      var indicator; // @todo: much of this code (including mergeTerms and anyTermsSelected above) were moved to index; consider moving these too

      if (isStatic || termsLen === 1) {
        indicator = // Small indicator to help represent how many terms there are available for this Facet.
        _react["default"].createElement(_Fade.Fade, {
          "in": !facetOpen
        }, _react["default"].createElement("span", {
          className: "closed-terms-count col-auto px-0" + (anySelected ? " some-selected" : ""),
          "data-tip": "No useful options (1 total)" + (anySelected ? "; is selected" : ""),
          "data-place": "right",
          "data-any-selected": anySelected
        }, _react["default"].createElement(CountIndicator, {
          count: termsLen,
          countActive: termsSelectedCount
        })));
      } else {
        indicator = // Small indicator to help represent how many terms there are available for this Facet.
        _react["default"].createElement(_Fade.Fade, {
          "in": !facetOpen
        }, _react["default"].createElement("span", {
          className: "closed-terms-count col-auto px-0" + (anySelected ? " some-selected" : ""),
          "data-tip": "".concat(termsLen, " options with ").concat(termsSelectedCount, " selected"),
          "data-place": "right",
          "data-any-selected": anySelected
        }, _react["default"].createElement(CountIndicator, {
          count: termsLen,
          countActive: termsSelectedCount
        })));
      } // List of terms


      return _react["default"].createElement("div", {
        className: "facet" + (facetOpen || allTermsSelected ? ' open' : ' closed'),
        "data-field": facet.field
      }, _react["default"].createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, _react["default"].createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-" + (allTermsSelected ? "dot-circle far" : (facetOpen ? "minus" : "plus") + " fas")
      })), _react["default"].createElement("div", {
        className: "col px-0 line-height-1"
      }, _react["default"].createElement("span", {
        "data-tip": tooltip,
        "data-place": "right"
      }, title)), indicator), _react["default"].createElement(ListOfTerms, _extends({
        facet: facet,
        facetOpen: facetOpen,
        terms: terms,
        persistentCount: persistentCount,
        onTermClick: onTermClick,
        expanded: expanded,
        getTermStatus: getTermStatus,
        termTransformFxn: termTransformFxn
      }, {
        onToggleExpanded: this.handleExpandListToggleClick
      })));
    }
  }]);

  return FacetTermsList;
}(_react["default"].PureComponent);

exports.FacetTermsList = FacetTermsList;
FacetTermsList.defaultProps = {
  'persistentCount': 10
};

var ListOfTerms = _react["default"].memo(function (props) {
  var facet = props.facet,
      facetOpen = props.facetOpen,
      facetClosing = props.facetClosing,
      terms = props.terms,
      persistentCount = props.persistentCount,
      onTermClick = props.onTermClick,
      expanded = props.expanded,
      onToggleExpanded = props.onToggleExpanded,
      getTermStatus = props.getTermStatus,
      termTransformFxn = props.termTransformFxn;
  /** Create term components and sort by status (selected->omitted->unselected) */

  var _useMemo = (0, _react.useMemo)(function () {
    var _segmentTermComponent = segmentTermComponentsByStatus(terms.map(function (term) {
      return _react["default"].createElement(Term, _extends({
        facet: facet,
        term: term,
        termTransformFxn: termTransformFxn
      }, {
        onClick: onTermClick,
        key: term.key,
        status: getTermStatus(term, facet)
      }));
    })),
        _segmentTermComponent2 = _segmentTermComponent.selected,
        selectedTermComponents = _segmentTermComponent2 === void 0 ? [] : _segmentTermComponent2,
        _segmentTermComponent3 = _segmentTermComponent.omitted,
        omittedTermComponents = _segmentTermComponent3 === void 0 ? [] : _segmentTermComponent3,
        _segmentTermComponent4 = _segmentTermComponent.none,
        unselectedTermComponents = _segmentTermComponent4 === void 0 ? [] : _segmentTermComponent4;

    var selectedLen = selectedTermComponents.length;
    var omittedLen = omittedTermComponents.length;
    var unselectedLen = unselectedTermComponents.length;
    var totalLen = selectedLen + omittedLen + unselectedLen;
    var termComponents = selectedTermComponents.concat(omittedTermComponents).concat(unselectedTermComponents);
    var activeTermComponents = termComponents.slice(0, selectedLen + omittedLen);
    var retObj = {
      termComponents: termComponents,
      activeTermComponents: activeTermComponents,
      unselectedTermComponents: unselectedTermComponents,
      selectedLen: selectedLen,
      omittedLen: omittedLen,
      unselectedLen: unselectedLen,
      totalLen: totalLen
    };

    if (totalLen <= Math.max(persistentCount, selectedLen + omittedLen)) {
      return retObj;
    }

    retObj.persistentTerms = []; //termComponents.slice(0, unselectedStartIdx);

    var i;

    for (i = selectedLen + omittedLen; i < persistentCount; i++) {
      retObj.persistentTerms.push(termComponents[i]);
    }

    retObj.collapsibleTerms = termComponents.slice(i);
    retObj.collapsibleTermsCount = totalLen - i;
    retObj.collapsibleTermsItemCount = retObj.collapsibleTerms.reduce(function (m, termComponent) {
      return m + (termComponent.props.term.doc_count || 0);
    }, 0);
    return retObj;
  }, [terms, persistentCount]),
      termComponents = _useMemo.termComponents,
      activeTermComponents = _useMemo.activeTermComponents,
      unselectedTermComponents = _useMemo.unselectedTermComponents,
      totalLen = _useMemo.totalLen,
      selectedLen = _useMemo.selectedLen,
      omittedLen = _useMemo.omittedLen,
      unselectedLen = _useMemo.unselectedLen,
      _useMemo$persistentTe = _useMemo.persistentTerms,
      persistentTerms = _useMemo$persistentTe === void 0 ? null : _useMemo$persistentTe,
      _useMemo$collapsibleT = _useMemo.collapsibleTerms,
      collapsibleTerms = _useMemo$collapsibleT === void 0 ? null : _useMemo$collapsibleT,
      _useMemo$collapsibleT2 = _useMemo.collapsibleTermsCount,
      collapsibleTermsCount = _useMemo$collapsibleT2 === void 0 ? 0 : _useMemo$collapsibleT2,
      _useMemo$collapsibleT3 = _useMemo.collapsibleTermsItemCount,
      collapsibleTermsItemCount = _useMemo$collapsibleT3 === void 0 ? 0 : _useMemo$collapsibleT3;

  if (Array.isArray(collapsibleTerms)) {
    var expandButtonTitle;

    if (expanded) {
      expandButtonTitle = _react["default"].createElement("span", null, _react["default"].createElement("i", {
        className: "icon icon-fw icon-minus fas"
      }), " Collapse");
    } else {
      expandButtonTitle = _react["default"].createElement("span", null, _react["default"].createElement("i", {
        className: "icon icon-fw icon-plus fas"
      }), " View ", collapsibleTermsCount, " More", _react["default"].createElement("span", {
        className: "pull-right"
      }, collapsibleTermsItemCount));
    }

    return _react["default"].createElement("div", {
      className: "facet-list",
      key: "fl",
      "data-any-active": !!(selectedLen || omittedLen),
      "data-open": facetOpen
    }, _react["default"].createElement(_PartialList.PartialList, {
      className: "mb-0 active-terms-pl",
      open: facetOpen,
      persistent: activeTermComponents,
      collapsible: _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement(_PartialList.PartialList, {
        className: "mb-0",
        open: expanded,
        persistent: persistentTerms,
        collapsible: collapsibleTerms
      }), _react["default"].createElement("div", {
        className: "pt-08 pb-0"
      }, _react["default"].createElement("div", {
        className: "view-more-button",
        onClick: onToggleExpanded
      }, expandButtonTitle)))
    }));
  } else {
    return _react["default"].createElement("div", {
      className: "facet-list",
      key: "fl",
      "data-any-active": !!(selectedLen || omittedLen),
      "data-open": facetOpen
    }, _react["default"].createElement(_PartialList.PartialList, {
      className: "mb-0 active-terms-pl",
      open: facetOpen,
      persistent: activeTermComponents,
      collapsible: unselectedTermComponents
    }));
  }
});

var CountIndicator = _react["default"].memo(function (_ref5) {
  var _ref5$count = _ref5.count,
      count = _ref5$count === void 0 ? 1 : _ref5$count,
      _ref5$countActive = _ref5.countActive,
      countActive = _ref5$countActive === void 0 ? 0 : _ref5$countActive,
      _ref5$height = _ref5.height,
      height = _ref5$height === void 0 ? 16 : _ref5$height,
      _ref5$width = _ref5.width,
      width = _ref5$width === void 0 ? 40 : _ref5$width;
  var dotCountToShow = Math.min(count, 21);
  var dotCoords = (0, _utilities.stackDotsInContainer)(dotCountToShow, height, 4, 2, false);
  var dots = dotCoords.map(function (_ref6, idx) {
    var _ref7 = _slicedToArray(_ref6, 2),
        x = _ref7[0],
        y = _ref7[1];

    var colIdx = Math.floor(idx / 3); // Flip both axes so going bottom right to top left.

    return _react["default"].createElement("circle", {
      cx: width - x + 1,
      cy: height - y + 1,
      r: 2,
      key: idx,
      "data-original-index": idx,
      style: {
        opacity: 1 - colIdx * .125
      },
      className: dotCountToShow - idx <= countActive ? "active" : null
    });
  });
  return _react["default"].createElement("svg", {
    className: "svg-count-indicator",
    viewBox: "0 0 ".concat(width + 2, " ").concat(height + 2),
    width: width + 2,
    height: height + 2
  }, dots);
});

exports.CountIndicator = CountIndicator;