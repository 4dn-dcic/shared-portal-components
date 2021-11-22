'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _excluded = ["count", "countActive", "height", "width", "ltr", "className"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import Fade from 'react-bootstrap/esm/Fade';
import { stackDotsInContainer } from './../../../viz/utilities';
import { PartialList } from './../../../ui/PartialList';
import { ExtendedDescriptionPopoverIcon } from './ExtendedDescriptionPopoverIcon';
import { SearchAsYouTypeAjax } from '../../../forms/components/SearchAsYouTypeAjax';
/**
 * Used in FacetList
 * @deprecated
 */

export function anyTermsSelected() {
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
 * Used in FacetList for TermsFacet/FacetTermsList only.
 *
 * @param {*} facets - Must be in final extended form (containing full 'terms' incl selected ones w/ 0 counts)
 * @param {*} filters - List of active filters.
 * @returns {Object<string, number>} Counts of selected terms per facet.field.
 */

export function countActiveTermsByField(filters) {
  var activeTermsByField = {};
  filters.forEach(function (_ref) {
    var rawField = _ref.field,
        term = _ref.term;
    var lastCharIdx = rawField.length - 1;
    var field = rawField.charAt(lastCharIdx) === "!" ? rawField.slice(0, lastCharIdx) : rawField;
    activeTermsByField[field] = activeTermsByField[field] || new Set();
    activeTermsByField[field].add(term);
  });
  var countTermsByField = {};

  _.keys(activeTermsByField).forEach(function (field) {
    countTermsByField[field] = activeTermsByField[field].size;
  });

  return countTermsByField;
}
/**
 * Used in FacetList
 */

export function mergeTerms(facet, filters) {
  var activeTermsForField = {};
  filters.forEach(function (f) {
    if (f.field !== facet.field) return;
    activeTermsForField[f.term] = true;
  });
  var terms = facet.terms.slice(); // Leave in terms which aren't present in facet.terms but are in filters.
  // This might happen because of limit=~100 of terms returned from backend aggs.

  terms.forEach(function (_ref2) {
    var key = _ref2.key;
    delete activeTermsForField[key];
  }); // Filter out type=Item for now (hardcode)

  if (facet.field === "type") {
    terms = terms.filter(function (t) {
      return t !== 'Item' && t && t.key !== 'Item';
    });
  } // These are terms which might have been manually defined in URL but are not present in data at all.
  // Include them so we can unselect them.


  var unseenTerms = _.keys(activeTermsForField).map(function (term) {
    return {
      key: term,
      doc_count: 0
    };
  });

  return terms.concat(unseenTerms);
}
/* Used in ListOfTerms and ListOfRanges (RangeFacet) */

export function segmentComponentsByStatus(termComponents) {
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

export var Term = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(Term, _React$PureComponent);

  var _super = _createSuper(Term);

  function Term(props) {
    var _this;

    _classCallCheck(this, Term);

    _this = _super.call(this, props);
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Term, [{
    key: "handleClick",
    value: function handleClick(e) {
      var _this$props = this.props,
          facet = _this$props.facet,
          term = _this$props.term,
          onClick = _this$props.onClick;
      e.preventDefault();
      onClick(facet, term, e);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          term = _this$props2.term,
          facet = _this$props2.facet,
          status = _this$props2.status,
          termTransformFxn = _this$props2.termTransformFxn,
          isFiltering = _this$props2.isFiltering;
      var count = term && term.doc_count || 0;
      var title = termTransformFxn(facet.field, term.key) || term.key;
      var icon = null;

      if (isFiltering) {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon fas icon-circle-notch icon-spin icon-fw"
        });
      } else if (status === 'selected' || status === 'omitted') {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon icon-check-square icon-fw fas"
        });
      } else {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon icon-square icon-fw unselected far"
        });
      }

      if (!title || title === 'null' || title === 'undefined') {
        title = 'None';
      }

      var statusClassName = status !== 'none' ? status === 'selected' ? " selected" : " omitted" : '';
      return /*#__PURE__*/React.createElement("li", {
        className: "facet-list-element " + statusClassName,
        key: term.key,
        "data-key": term.key
      }, /*#__PURE__*/React.createElement("a", {
        className: "term",
        "data-selected": status !== 'none',
        href: "#",
        onClick: this.handleClick,
        "data-term": term.key
      }, /*#__PURE__*/React.createElement("span", {
        className: "facet-selector"
      }, icon), /*#__PURE__*/React.createElement("span", {
        className: "facet-item",
        "data-tip": title.length > 30 ? title : null
      }, title), /*#__PURE__*/React.createElement("span", {
        className: "facet-count"
      }, count)));
    }
  }]);

  return Term;
}(React.PureComponent);
Term.propTypes = {
  'facet': PropTypes.shape({
    'field': PropTypes.string.isRequired
  }).isRequired,
  'term': PropTypes.shape({
    'key': PropTypes.string.isRequired,
    'doc_count': PropTypes.number
  }).isRequired,
  'isFiltering': PropTypes.bool,
  'filteringFieldTerm': PropTypes.shape({
    field: PropTypes.string,
    term: PropTypes.string
  }),
  'getTermStatus': PropTypes.func.isRequired,
  'onClick': PropTypes.func.isRequired,
  'status': PropTypes.oneOf(["none", "selected", "omitted"]),
  'termTransformFxn': PropTypes.func
};
/**
 * @param {*} facetTerms : facet's terms array
 * @param {*} searchText : search text from basic search input
 */

export function getFilteredTerms(facetTerms, searchText) {
  var retDict = {};

  if (!facetTerms || !Array.isArray(facetTerms)) {
    return retDict;
  }

  var lcSearchText = searchText && typeof searchText === 'string' && searchText.length > 0 ? searchText.toLocaleLowerCase() : '';

  _.forEach(facetTerms, function (term) {
    var _ref3$key = (term || {}).key,
        key = _ref3$key === void 0 ? '' : _ref3$key;

    if (typeof key === 'string' && key.length > 0) {
      var isFiltered = lcSearchText.length > 0 ? key.toLocaleLowerCase().includes(lcSearchText) : true;

      if (isFiltered) {
        retDict[key] = true;
      }
    }
  });

  return retDict;
}
export var FacetTermsList = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(FacetTermsList, _React$PureComponent2);

  var _super2 = _createSuper(FacetTermsList);

  function FacetTermsList(props) {
    var _this2;

    _classCallCheck(this, FacetTermsList);

    _this2 = _super2.call(this, props);
    _this2.handleOpenToggleClick = _this2.handleOpenToggleClick.bind(_assertThisInitialized(_this2));
    _this2.handleExpandListToggleClick = _this2.handleExpandListToggleClick.bind(_assertThisInitialized(_this2));
    _this2.handleBasicTermSearch = _this2.handleBasicTermSearch.bind(_assertThisInitialized(_this2));
    _this2.handleSaytTermSearch = _this2.handleSaytTermSearch.bind(_assertThisInitialized(_this2));
    _this2.state = {
      'expanded': false,
      'searchText': ''
    };
    return _this2;
  }

  _createClass(FacetTermsList, [{
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      e.preventDefault();
      var _this$props3 = this.props,
          onToggleOpen = _this$props3.onToggleOpen,
          field = _this$props3.facet.field,
          _this$props3$facetOpe = _this$props3.facetOpen,
          facetOpen = _this$props3$facetOpe === void 0 ? false : _this$props3$facetOpe;
      onToggleOpen(field, !facetOpen);
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
    key: "handleBasicTermSearch",
    value: function handleBasicTermSearch(e) {
      e.preventDefault();
      var newValue = e.target.value;
      this.setState({
        'searchText': newValue
      });
    }
  }, {
    key: "handleSaytTermSearch",
    value: function handleSaytTermSearch(e) {
      var _this$props4 = this.props,
          facet = _this$props4.facet,
          onTermClick = _this$props4.onTermClick;
      var key = {
        'key': e.display_title
      };
      onTermClick(facet, key);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          facet = _this$props5.facet,
          fieldSchema = _this$props5.fieldSchema,
          isStatic = _this$props5.isStatic,
          anySelected = _this$props5.anyTermsSelected,
          termsSelectedCount = _this$props5.termsSelectedCount,
          persistentCount = _this$props5.persistentCount,
          defaultBasicSearchAutoDisplayThreshold = _this$props5.defaultBasicSearchAutoDisplayThreshold,
          onTermClick = _this$props5.onTermClick,
          getTermStatus = _this$props5.getTermStatus,
          termTransformFxn = _this$props5.termTransformFxn,
          facetOpen = _this$props5.facetOpen,
          openPopover = _this$props5.openPopover,
          filteringFieldTerm = _this$props5.filteringFieldTerm,
          setOpenPopover = _this$props5.setOpenPopover,
          context = _this$props5.context,
          schemas = _this$props5.schemas;
      var _facet$description = facet.description,
          facetSchemaDescription = _facet$description === void 0 ? null : _facet$description,
          field = facet.field,
          facetTitle = facet.title,
          _facet$terms = facet.terms,
          terms = _facet$terms === void 0 ? [] : _facet$terms;
      var _this$state = this.state,
          expanded = _this$state.expanded,
          searchText = _this$state.searchText;
      var termsLen = terms.length;
      var allTermsSelected = termsSelectedCount === termsLen;

      var _ref5 = fieldSchema || {},
          fieldTitle = _ref5.title,
          fieldSchemaDescription = _ref5.description; // fieldSchema not present if no schemas loaded yet or if fake/calculated 'field'/column.


      var indicator; // @todo: much of this code (including mergeTerms and anyTermsSelected above) were moved to index; consider moving these too

      if (isStatic || termsLen === 1) {
        indicator =
        /*#__PURE__*/
        // Small indicator to help represent how many terms there are available for this Facet.
        React.createElement(Fade, {
          "in": !facetOpen
        }, /*#__PURE__*/React.createElement("span", {
          className: "closed-terms-count col-auto px-0" + (anySelected ? " some-selected" : ""),
          "data-tip": "No useful options (1 total)" + (anySelected ? "; is selected" : ""),
          "data-place": "right",
          "data-any-selected": anySelected
        }, /*#__PURE__*/React.createElement(CountIndicator, {
          count: termsLen,
          countActive: termsSelectedCount
        })));
      } else {
        indicator =
        /*#__PURE__*/
        // Small indicator to help represent how many terms there are available for this Facet.
        React.createElement(Fade, {
          "in": !facetOpen
        }, /*#__PURE__*/React.createElement("span", {
          className: "closed-terms-count col-auto px-0" + (anySelected ? " some-selected" : ""),
          "data-tip": "".concat(termsLen, " options with ").concat(termsSelectedCount, " selected"),
          "data-place": "right",
          "data-any-selected": anySelected
        }, /*#__PURE__*/React.createElement(CountIndicator, {
          count: termsLen,
          countActive: termsSelectedCount
        })));
      } // List of terms


      return /*#__PURE__*/React.createElement("div", {
        className: "facet" + (facetOpen || allTermsSelected ? ' open' : ' closed'),
        "data-field": facet.field
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn facet-title",
        onClick: this.handleOpenToggleClick
      }, /*#__PURE__*/React.createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-" + (allTermsSelected ? "dot-circle far" : (facetOpen ? "minus" : "plus") + " fas")
      })), /*#__PURE__*/React.createElement("div", {
        className: "col px-0 text-left"
      }, /*#__PURE__*/React.createElement("span", {
        "data-tip": facetSchemaDescription || fieldSchemaDescription,
        "data-html": true,
        "data-place": "right"
      }, facetTitle || fieldTitle || field), /*#__PURE__*/React.createElement(ExtendedDescriptionPopoverIcon, {
        fieldSchema: fieldSchema,
        facet: facet,
        openPopover: openPopover,
        setOpenPopover: setOpenPopover
      })), indicator), /*#__PURE__*/React.createElement(ListOfTerms, {
        facet: facet,
        facetOpen: facetOpen,
        terms: terms,
        onTermClick: onTermClick,
        expanded: expanded,
        getTermStatus: getTermStatus,
        termTransformFxn: termTransformFxn,
        searchText: searchText,
        schemas: schemas,
        persistentCount: persistentCount,
        defaultBasicSearchAutoDisplayThreshold: defaultBasicSearchAutoDisplayThreshold,
        filteringFieldTerm: filteringFieldTerm,
        onSaytTermSearch: this.handleSaytTermSearch,
        onBasicTermSearch: this.handleBasicTermSearch,
        onToggleExpanded: this.handleExpandListToggleClick
      }));
    }
  }]);

  return FacetTermsList;
}(React.PureComponent);
FacetTermsList.defaultProps = {
  'persistentCount': 10,
  'defaultBasicSearchAutoDisplayThreshold': 15
};
var ListOfTerms = /*#__PURE__*/React.memo(function (props) {
  var facet = props.facet,
      facetOpen = props.facetOpen,
      terms = props.terms,
      onTermClick = props.onTermClick,
      filteringFieldTerm = props.filteringFieldTerm,
      expanded = props.expanded,
      onToggleExpanded = props.onToggleExpanded,
      persistentCount = props.persistentCount,
      getTermStatus = props.getTermStatus,
      termTransformFxn = props.termTransformFxn,
      searchText = props.searchText,
      onBasicTermSearch = props.onBasicTermSearch,
      onSaytTermSearch = props.onSaytTermSearch,
      defaultBasicSearchAutoDisplayThreshold = props.defaultBasicSearchAutoDisplayThreshold;
  var _facet$search_type = facet.search_type,
      searchType = _facet$search_type === void 0 ? 'none' : _facet$search_type;
  /**
   * even if search type is not defined, display basic search option when terms count
   * is greater than defaultBasicSearchAutoDisplayThreshold
   */

  if (searchType === 'none' && terms.length >= defaultBasicSearchAutoDisplayThreshold) {
    searchType = 'basic';
  }
  /** Create term components and sort by status (selected->omitted->unselected) */


  var _useMemo = useMemo(function () {
    var field = facet.field;
    var segments = segmentComponentsByStatus(terms.map(function (term) {
      var _ref6 = filteringFieldTerm || {},
          currFilteringField = _ref6.field,
          currFilteringTerm = _ref6.term;

      var isFiltering = field === currFilteringField && term.key === currFilteringTerm;
      return /*#__PURE__*/React.createElement(Term, {
        facet: facet,
        term: term,
        termTransformFxn: termTransformFxn,
        isFiltering: isFiltering,
        onClick: onTermClick,
        key: term.key,
        status: getTermStatus(term, facet)
      });
    }));
    var _segments$selected = segments.selected,
        selectedTermComponents = _segments$selected === void 0 ? [] : _segments$selected,
        _segments$omitted = segments.omitted,
        omittedTermComponents = _segments$omitted === void 0 ? [] : _segments$omitted;
    var _segments$none = segments.none,
        unselectedTermComponents = _segments$none === void 0 ? [] : _segments$none; //filter unselected terms

    //filter unselected terms
    if (searchType === 'basic' && searchText && typeof searchText === 'string' && searchText.length > 0) {
      var dict = getFilteredTerms(terms, searchText);
      unselectedTermComponents = _.filter(unselectedTermComponents, function (term) {
        return dict[term.key];
      });
    } else if (searchType === 'sayt_without_terms') {
      unselectedTermComponents = [];
    }

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

    //termComponents.slice(0, unselectedStartIdx);
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
  }, [facet, terms, persistentCount, searchText, filteringFieldTerm]),
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

  var commonProps = {
    "data-any-active": !!(selectedLen || omittedLen),
    "data-all-active": totalLen === selectedLen + omittedLen,
    "data-open": facetOpen,
    "className": "facet-list",
    "key": "facetlist"
  }; // show simple text input for basic search (search within returned values)
  // or show SAYT control if item search is available

  var facetSearch = null;

  if (searchType === 'basic') {
    facetSearch = /*#__PURE__*/React.createElement("div", {
      className: "text-small p-2"
    }, /*#__PURE__*/React.createElement("input", {
      className: "form-control",
      autoComplete: "off",
      type: "search",
      placeholder: "Search",
      name: "q",
      onChange: onBasicTermSearch,
      key: "facet-search-input"
    }));
  } else if (searchType === 'sayt' || searchType === 'sayt_without_terms') {
    var _ref7$sayt_item_type = (facet || {}).sayt_item_type,
        itemType = _ref7$sayt_item_type === void 0 ? '' : _ref7$sayt_item_type;
    itemType = typeof itemType === 'string' && itemType.length > 0 ? itemType : 'Item';
    var baseHref = "/search/?type=" + itemType;
    facetSearch = /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-wrap text-small p-2"
    }, /*#__PURE__*/React.createElement(SearchAsYouTypeAjax, {
      baseHref: baseHref,
      showTips: true,
      onChange: onSaytTermSearch,
      key: itemType
    }));
  }

  if (Array.isArray(collapsibleTerms)) {
    return /*#__PURE__*/React.createElement("div", commonProps, /*#__PURE__*/React.createElement(PartialList, {
      className: "mb-0 active-terms-pl",
      open: facetOpen,
      persistent: activeTermComponents,
      collapsible: /*#__PURE__*/React.createElement(React.Fragment, null, facetSearch, /*#__PURE__*/React.createElement(PartialList, {
        className: "mb-0",
        open: expanded,
        persistent: persistentTerms,
        collapsible: collapsibleTerms
      }), /*#__PURE__*/React.createElement("div", {
        className: "pt-08 pb-0"
      }, /*#__PURE__*/React.createElement(ViewMoreExpandButton, {
        expanded: expanded,
        collapsibleTermsCount: collapsibleTermsCount,
        collapsibleTermsItemCount: collapsibleTermsItemCount,
        onToggle: onToggleExpanded
      })))
    }));
  } else {
    return /*#__PURE__*/React.createElement("div", commonProps, /*#__PURE__*/React.createElement(PartialList, {
      className: "mb-0 active-terms-pl",
      open: facetOpen,
      persistent: activeTermComponents,
      collapsible: /*#__PURE__*/React.createElement(React.Fragment, null, facetSearch, unselectedTermComponents)
    }));
  }
});
export function ViewMoreExpandButton(props) {
  var _props$expanded = props.expanded,
      expanded = _props$expanded === void 0 ? false : _props$expanded,
      onToggle = props.onToggle,
      collapsibleTermsCount = props.collapsibleTermsCount,
      collapsibleTermsItemCount = props.collapsibleTermsItemCount;
  var expandButtonTitle;

  if (expanded) {
    expandButtonTitle = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "icon icon-fw icon-minus fas mr-06"
    }), /*#__PURE__*/React.createElement("span", {
      className: "flex-grow-1 text-left"
    }, "Collapse"));
  } else {
    expandButtonTitle = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "icon icon-fw icon-plus fas mr-06"
    }), /*#__PURE__*/React.createElement("span", {
      className: "flex-grow-1 text-left"
    }, "View ", collapsibleTermsCount, " More"), /*#__PURE__*/React.createElement("span", {
      className: "pull-right"
    }, collapsibleTermsItemCount));
  }

  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn view-more-button d-flex align-items-center",
    onClick: onToggle
  }, expandButtonTitle);
}
export var CountIndicator = /*#__PURE__*/React.memo(function (props) {
  var _props$count = props.count,
      count = _props$count === void 0 ? 1 : _props$count,
      _props$countActive = props.countActive,
      countActive = _props$countActive === void 0 ? 0 : _props$countActive,
      _props$height = props.height,
      height = _props$height === void 0 ? 16 : _props$height,
      _props$width = props.width,
      width = _props$width === void 0 ? 40 : _props$width,
      _props$ltr = props.ltr,
      ltr = _props$ltr === void 0 ? false : _props$ltr,
      _props$className = props.className,
      className = _props$className === void 0 ? null : _props$className,
      passProps = _objectWithoutProperties(props, _excluded);

  var dotCountToShow = Math.min(count, 21);
  var dotCoords = stackDotsInContainer(dotCountToShow, height, 4, 2, false);
  var currColCounter = new Set();
  var dots = dotCoords.map(function (_ref8, idx) {
    var _ref9 = _slicedToArray(_ref8, 2),
        x = _ref9[0],
        y = _ref9[1];

    currColCounter.add(x);
    var colIdx = currColCounter.size - 1; // Flip both axes so going bottom right to top left.

    var cx = ltr ? x + 1 : width - x + 1;
    var cy = ltr ? y + 1 : height - y + 1;
    return /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: 2,
      key: idx,
      "data-original-index": idx,
      style: {
        opacity: 1 - colIdx * .125
      },
      className: dotCountToShow - idx <= countActive ? "active" : null
    });
  });
  var cls = "svg-count-indicator" + (className ? " " + className : "");
  return /*#__PURE__*/React.createElement("svg", _extends({}, passProps, {
    className: cls,
    viewBox: "0 0 ".concat(width + 2, " ").concat(height + 2),
    width: width + 2,
    height: height + 2
  }), dots);
});