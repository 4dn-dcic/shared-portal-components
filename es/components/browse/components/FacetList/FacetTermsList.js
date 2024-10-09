import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["count", "countActive", "height", "width", "ltr", "className"];
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
  var terms = facet.terms.slice();

  // Leave in terms which aren't present in facet.terms but are in filters.
  // This might happen because of limit=~100 of terms returned from backend aggs.
  terms.forEach(function (_ref2) {
    var key = _ref2.key;
    delete activeTermsForField[key];
  });

  // Filter out type=Item for now (hardcode)
  if (facet.field === "type") {
    terms = terms.filter(function (t) {
      return t !== 'Item' && t && t.key !== 'Item';
    });
  }

  // These are terms which might have been manually defined in URL but are not present in data at all.
  // Include them so we can unselect them.
  var unseenTerms = [];
  if (!facet.has_group_by) {
    unseenTerms = _.keys(activeTermsForField).map(function (term) {
      return {
        key: term,
        doc_count: 0
      };
    });
  }
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
  function Term(props) {
    var _this2;
    _classCallCheck(this, Term);
    _this2 = _callSuper(this, Term, [props]);
    _this2.handleClick = _this2.handleClick.bind(_this2);
    return _this2;
  }
  _inherits(Term, _React$PureComponent);
  return _createClass(Term, [{
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
        getTermStatus = _this$props2.getTermStatus,
        termTransformFxn = _this$props2.termTransformFxn,
        isFiltering = _this$props2.isFiltering,
        onClick = _this$props2.onClick,
        _this$props2$useRadio = _this$props2.useRadioIcon,
        useRadioIcon = _this$props2$useRadio === void 0 ? false : _this$props2$useRadio,
        groupingTermKey = _this$props2.groupingTermKey,
        tooltip = _this$props2.tooltip,
        _this$props2$hideActi = _this$props2.hideActiveSubTerms,
        hideActiveSubTerms = _this$props2$hideActi === void 0 ? false : _this$props2$hideActi,
        _this$props2$hideUnse = _this$props2.hideUnselectedSubTerms,
        hideUnselectedSubTerms = _this$props2$hideUnse === void 0 ? false : _this$props2$hideUnse;
      var _this$props3 = this.props,
        _this$props3$facetSea = _this$props3.facetSearchActive,
        facetSearchActive = _this$props3$facetSea === void 0 ? false : _this$props3$facetSea,
        textFilteredTerms = _this$props3.textFilteredTerms,
        textFilteredSubTerms = _this$props3.textFilteredSubTerms;
      var selected = status !== 'none' && status !== 'partial';
      //override
      if (selected) {
        facetSearchActive = false;
        textFilteredTerms = {};
        textFilteredSubTerms = null;
      }
      var count = term && term.doc_count || (facet.field === 'type' && status === 'omitted' ? null : 0);
      var title = termTransformFxn(facet.field, term.key) || term.key;
      var icon = null;
      if (isFiltering) {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon fas icon-circle-notch icon-spin icon-fw"
        });
      } else if (status === "omitted") {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw fas " + (!useRadioIcon ? "icon-minus-square" : "icon-dot-circle")
        });
      } else if (status === "selected") {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw fas " + (!useRadioIcon ? "icon-check-square" : "icon-dot-circle")
        });
      } else {
        icon = /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw unselected far " + (!useRadioIcon ? "icon-square" : "icon-circle")
        });
      }
      if (!title || title === 'null' || title === 'undefined') {
        title = 'None';
      }
      var statusClassName = status === 'selected' ? " selected" : status === 'omitted' ? " omitted" : '';
      var isGroupingTerm = term.terms && Array.isArray(term.terms);
      // if the term is a grouping term, then create sub term components
      var subTermComponents = null;
      if (isGroupingTerm && term.terms.length > 0) {
        var childProps = {
          facet: facet,
          getTermStatus: getTermStatus,
          termTransformFxn: termTransformFxn,
          isFiltering: isFiltering,
          onClick: onClick,
          useRadioIcon: useRadioIcon,
          groupingTermKey: term.key,
          facetSearchActive: facetSearchActive
        };
        var filteredTerms = term.terms;
        //filter out the terms not matching
        if (textFilteredSubTerms) {
          filteredTerms = _.filter(filteredTerms, function (t) {
            return textFilteredSubTerms[t.key];
          });
        }
        subTermComponents = filteredTerms.map(function (t) {
          return /*#__PURE__*/React.createElement(Term, _extends({
            key: t.key,
            term: t
          }, childProps, {
            status: status === 'selected' ? 'selected' : getTermStatus(t, facet)
          }));
        });
        //filter out selected/omitted sub term components
        if (hideActiveSubTerms) {
          subTermComponents = _.filter(subTermComponents, function (t) {
            return t.props.status === 'none';
          });
        }
        //filter out unselected sub term components
        if (hideUnselectedSubTerms) {
          subTermComponents = _.filter(subTermComponents, function (t) {
            return t.props.status !== 'none';
          });
        }
      }
      if (isGroupingTerm && textFilteredTerms && textFilteredTerms[term.key] === 'hidden') {
        return subTermComponents;
      }
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", {
        className: "facet-list-element" + statusClassName + (groupingTermKey && !facetSearchActive ? " ps-3" : ""),
        key: term.key,
        "data-key": term.key,
        "data-is-grouping": isGroupingTerm,
        "data-grouping-key": groupingTermKey
      }, /*#__PURE__*/React.createElement("a", {
        className: "term",
        "data-selected": selected,
        href: "#",
        onClick: this.handleClick,
        "data-term": term.key
      }, /*#__PURE__*/React.createElement("span", {
        className: "facet-selector",
        "data-tip": tooltip,
        "data-multiline": true
      }, icon), /*#__PURE__*/React.createElement("span", {
        className: "facet-item" + (isGroupingTerm ? " facet-item-group-header" : ""),
        "data-tip": title.length > 30 ? title : null
      }, title), isGroupingTerm && subTermComponents ? null : /*#__PURE__*/React.createElement("span", {
        className: "facet-count"
      }, count))), subTermComponents);
    }
  }]);
}(React.PureComponent);

/**
 * @param {*} facetTerms        : facet's terms array
 * @param {*} searchText        : search text from basic search input
 * @param {*} includeSubTerms   : include sub terms
 * @returns {Object}            : returns { filteredTerms, filteredSubTerms }
 */
_defineProperty(Term, "propTypes", {
  'facet': PropTypes.shape({
    'field': PropTypes.string.isRequired
  }).isRequired,
  'term': PropTypes.shape({
    'key': PropTypes.string.isRequired,
    'doc_count': PropTypes.number,
    'terms': PropTypes.arrayOf(PropTypes.shape({
      'key': PropTypes.string.isRequired,
      'doc_count': PropTypes.number
    }))
  }).isRequired,
  'isFiltering': PropTypes.bool,
  'filteringFieldTerm': PropTypes.shape({
    field: PropTypes.string,
    term: PropTypes.string
  }),
  'onClick': PropTypes.func.isRequired,
  'status': PropTypes.oneOf(["none", "selected", "omitted", "partial"]),
  'getTermStatus': PropTypes.func.isRequired,
  'termTransformFxn': PropTypes.func,
  'useRadioIcon': PropTypes.bool.isRequired,
  'groupingTermKey': PropTypes.string,
  'facetSearchActive': PropTypes.bool,
  'textFilteredTerms': PropTypes.object,
  'textFilteredSubTerms': PropTypes.object,
  'tooltip': PropTypes.string,
  'hideActiveSubTerms': PropTypes.bool,
  'hideUnselectedSubTerms': PropTypes.bool
});
_defineProperty(Term, "defaultProps", {
  'useRadioIcon': false
});
export function getFilteredTerms(facetTerms, searchText, includeSubTerms) {
  var filteredTerms = {};
  var filteredSubTerms = {};
  if (!facetTerms || !Array.isArray(facetTerms)) {
    return filteredTerms;
  }
  var lcSearchText = searchText && typeof searchText === 'string' && searchText.length > 0 ? searchText.toLocaleLowerCase() : '';
  _.forEach(facetTerms, function (term) {
    var _ref3$key = (term || {}).key,
      key = _ref3$key === void 0 ? '' : _ref3$key;
    if (typeof key === 'string' && key.length > 0) {
      var isFiltered = lcSearchText.length > 0 ? key.toLocaleLowerCase().includes(lcSearchText) : true;
      //search sub terms
      var tmpFilteredSubTerms = {};
      if (includeSubTerms) {
        _.forEach(term.terms || [], function (sub) {
          var _ref4$key = (sub || {}).key,
            subKey = _ref4$key === void 0 ? '' : _ref4$key;
          if (typeof subKey === 'string' && subKey.length > 0) {
            var isSubFiltered = lcSearchText.length > 0 ? subKey.toLocaleLowerCase().includes(lcSearchText) : true;
            if (isSubFiltered) {
              tmpFilteredSubTerms[subKey] = true;
            }
          }
        });
      }
      if (isFiltered) {
        filteredTerms[key] = true;
      } else if (includeSubTerms && _.keys(tmpFilteredSubTerms).length > 0) {
        filteredTerms[key] = 'hidden';
      }
      _.extend(filteredSubTerms, tmpFilteredSubTerms);
    }
  });
  return {
    filteredTerms: filteredTerms,
    filteredSubTerms: filteredSubTerms
  };
}
export var FacetTermsList = /*#__PURE__*/function (_React$PureComponent2) {
  function FacetTermsList(props) {
    var _this3;
    _classCallCheck(this, FacetTermsList);
    _this3 = _callSuper(this, FacetTermsList, [props]);
    _this3.handleOpenToggleClick = _this3.handleOpenToggleClick.bind(_this3);
    _this3.handleExpandListToggleClick = _this3.handleExpandListToggleClick.bind(_this3);
    _this3.handleSaytTermSearch = _this3.handleSaytTermSearch.bind(_this3);
    _this3.state = {
      'expanded': false
    };
    return _this3;
  }
  _inherits(FacetTermsList, _React$PureComponent2);
  return _createClass(FacetTermsList, [{
    key: "handleOpenToggleClick",
    value: function handleOpenToggleClick(e) {
      e.preventDefault();
      var _this$props4 = this.props,
        onToggleOpen = _this$props4.onToggleOpen,
        field = _this$props4.facet.field,
        _this$props4$facetOpe = _this$props4.facetOpen,
        facetOpen = _this$props4$facetOpe === void 0 ? false : _this$props4$facetOpe;
      onToggleOpen(field, !facetOpen);
    }
  }, {
    key: "handleExpandListToggleClick",
    value: function handleExpandListToggleClick(e) {
      e.preventDefault();
      this.setState(function (_ref5) {
        var expanded = _ref5.expanded;
        return {
          'expanded': !expanded
        };
      });
    }
  }, {
    key: "handleSaytTermSearch",
    value: function handleSaytTermSearch(e) {
      var _this$props5 = this.props,
        facet = _this$props5.facet,
        onTermClick = _this$props5.onTermClick;
      var key = {
        'key': e.display_title
      };
      onTermClick(facet, key);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
        facet = _this$props6.facet,
        fieldSchema = _this$props6.fieldSchema,
        isStatic = _this$props6.isStatic,
        anySelected = _this$props6.anyTermsSelected,
        termsSelectedCount = _this$props6.termsSelectedCount,
        persistentCount = _this$props6.persistentCount,
        basicSearchAutoDisplayLimit = _this$props6.basicSearchAutoDisplayLimit,
        onTermClick = _this$props6.onTermClick,
        getTermStatus = _this$props6.getTermStatus,
        termTransformFxn = _this$props6.termTransformFxn,
        facetOpen = _this$props6.facetOpen,
        openPopover = _this$props6.openPopover,
        filteringFieldTerm = _this$props6.filteringFieldTerm,
        setOpenPopover = _this$props6.setOpenPopover,
        useRadioIcon = _this$props6.useRadioIcon,
        propPersistSelectedTerms = _this$props6.persistSelectedTerms,
        context = _this$props6.context,
        schemas = _this$props6.schemas,
        searchText = _this$props6.searchText,
        handleBasicTermSearch = _this$props6.handleBasicTermSearch;
      var _facet$description = facet.description,
        facetSchemaDescription = _facet$description === void 0 ? null : _facet$description,
        field = facet.field,
        facetTitle = facet.title,
        _facet$terms = facet.terms,
        terms = _facet$terms === void 0 ? [] : _facet$terms,
        facetPersistSelectedTerms = facet.persist_selected_terms;
      // if it's defined within facet, override global persis selected terms
      var persistSelectedTerms = typeof facetPersistSelectedTerms === 'boolean' ? facetPersistSelectedTerms : propPersistSelectedTerms;
      var expanded = this.state.expanded;
      var termsLen = terms.length;
      var allTermsSelected = termsSelectedCount === termsLen;
      var _ref6 = fieldSchema || {},
        fieldTitle = _ref6.title,
        fieldSchemaDescription = _ref6.description; // fieldSchema not present if no schemas loaded yet or if fake/calculated 'field'/column.

      var indicator;
      // @todo: much of this code (including mergeTerms and anyTermsSelected above) were moved to index; consider moving these too
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
      }

      // List of terms
      return /*#__PURE__*/React.createElement("div", {
        className: "facet" + (facetOpen || allTermsSelected ? ' open' : ' closed'),
        "data-field": facet.field
      }, /*#__PURE__*/React.createElement("h5", {
        className: "facet-title",
        onClick: this.handleOpenToggleClick
      }, /*#__PURE__*/React.createElement("span", {
        className: "expand-toggle col-auto px-0"
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-fw icon-" + (allTermsSelected && useRadioIcon === false ? "dot-circle far" : (facetOpen ? "minus" : "plus") + " fas")
      })), /*#__PURE__*/React.createElement("div", {
        className: "col px-0 line-height-1"
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
        basicSearchAutoDisplayLimit: basicSearchAutoDisplayLimit,
        useRadioIcon: useRadioIcon,
        persistSelectedTerms: persistSelectedTerms,
        filteringFieldTerm: filteringFieldTerm,
        onSaytTermSearch: this.handleSaytTermSearch,
        onBasicTermSearch: handleBasicTermSearch,
        onToggleExpanded: this.handleExpandListToggleClick
      }));
    }
  }]);
}(React.PureComponent);
FacetTermsList.defaultProps = {
  'persistentCount': 10,
  'basicSearchAutoDisplayLimit': 15
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
    basicSearchAutoDisplayLimit = props.basicSearchAutoDisplayLimit,
    useRadioIcon = props.useRadioIcon,
    _props$persistSelecte = props.persistSelectedTerms,
    propPersistSelectedTerms = _props$persistSelecte === void 0 ? true : _props$persistSelecte;
  var _facet$search_type = facet.search_type,
    searchType = _facet$search_type === void 0 ? 'none' : _facet$search_type;
  var facetPersistSelectedTerms = facet.persist_selected_terms,
    _facet$has_group_by = facet.has_group_by,
    facetHasGroupBy = _facet$has_group_by === void 0 ? false : _facet$has_group_by;

  // if it's defined within facet, override global persis selected terms
  var persistSelectedTerms = typeof facetPersistSelectedTerms === 'boolean' ? facetPersistSelectedTerms : propPersistSelectedTerms;
  /**
   * even if search type is not defined, display basic search option when terms count
   * is greater than basicSearchAutoDisplayLimit (for persistSelectedTerms is true)
   */
  if (!persistSelectedTerms) {
    searchType = 'none'; //override
  } else if (searchType === 'none') {
    var termsLength = !facetHasGroupBy ? terms.length : _.reduce(terms, function (memo, term) {
      return memo + 1 + (term.terms || []).length;
    }, 0);
    if (termsLength >= basicSearchAutoDisplayLimit) {
      searchType = 'basic';
    }
  }
  /** Create term components and sort by status (selected->omitted->unselected) */
  var _useMemo = useMemo(function () {
      var field = facet.field;
      var facetSearchActive = searchType === 'basic' && typeof searchText === 'string' && searchText.length > 0;
      var _ref7 = facetSearchActive ? getFilteredTerms(terms, searchText, facetHasGroupBy) : {},
        _ref7$filteredTerms = _ref7.filteredTerms,
        textFilteredTerms = _ref7$filteredTerms === void 0 ? {} : _ref7$filteredTerms,
        _ref7$filteredSubTerm = _ref7.filteredSubTerms,
        textFilteredSubTerms = _ref7$filteredSubTerm === void 0 ? null : _ref7$filteredSubTerm;
      var allTermComponents = _.flatten(terms.map(function (term) {
        var _ref8 = filteringFieldTerm || {},
          currFilteringField = _ref8.field,
          currFilteringTerm = _ref8.term;
        var isFiltering = field === currFilteringField && term.key === currFilteringTerm;
        var status = getTermStatus(term, facet);
        var active = status === 'omitted' || status === 'selected';
        // build tooltip
        var tooltip = null;
        if (facetSearchActive && !active && textFilteredTerms[term.key] === true && term.terms && textFilteredSubTerms) {
          var termName = facet.tooltip_term_substitue || 'term';
          var filteredTerms = _.filter(term.terms, function (t) {
            return textFilteredSubTerms[t.key];
          });
          var diff = term.terms.length - filteredTerms.length;
          tooltip = "Warning: ".concat(term.terms.length, " ").concat(termName).concat(term.terms.length > 1 ? 's' : '', " ").concat(!active ? 'will be' : 'are', " selected");
          if (diff > 0) {
            if (active) {
              tooltip += " (".concat(diff, " currently selected ").concat(termName).concat(diff > 1 ? 's are' : ' is', " hidden)");
            }
            tooltip += "<br />To see all ".concat(facet.tooltip_term_substitue || 'term', "s in this group clear the search filter");
          }
        }
        if (status !== 'partial') {
          return /*#__PURE__*/React.createElement(Term, {
            facet: facet,
            term: term,
            termTransformFxn: termTransformFxn,
            isFiltering: isFiltering,
            useRadioIcon: useRadioIcon,
            getTermStatus: getTermStatus,
            textFilteredTerms: textFilteredTerms,
            textFilteredSubTerms: textFilteredSubTerms,
            facetSearchActive: facetSearchActive,
            tooltip: tooltip,
            status: status,
            onClick: onTermClick,
            key: term.key
          });
        } else {
          var _commonProps = {
            facet: facet,
            term: term,
            termTransformFxn: termTransformFxn,
            isFiltering: isFiltering,
            useRadioIcon: useRadioIcon,
            getTermStatus: getTermStatus,
            onClick: onTermClick
          };
          //duplicate terms to show parent-children tree in active and unselected sections
          return [/*#__PURE__*/React.createElement(Term, _extends({}, _commonProps, {
            textFilteredTerms: {},
            status: status,
            key: term.key,
            hideUnselectedSubTerms: true
          })), /*#__PURE__*/React.createElement(Term, _extends({}, _commonProps, {
            textFilteredTerms: textFilteredTerms,
            textFilteredSubTerms: textFilteredSubTerms,
            facetSearchActive: facetSearchActive,
            tooltip: tooltip,
            status: 'none',
            key: term.key,
            hideActiveSubTerms: true
          }))];
        }
      }));
      var segments = segmentComponentsByStatus(allTermComponents);
      var _segments$selected = segments.selected,
        selectedTermComponents = _segments$selected === void 0 ? [] : _segments$selected,
        _segments$omitted = segments.omitted,
        omittedTermComponents = _segments$omitted === void 0 ? [] : _segments$omitted,
        _segments$partial = segments['partial'],
        partialSelectedTermComponents = _segments$partial === void 0 ? [] : _segments$partial;
      var _segments$none = segments.none,
        unselectedTermComponents = _segments$none === void 0 ? [] : _segments$none;

      //filter unselected terms
      if (facetSearchActive) {
        unselectedTermComponents = _.filter(unselectedTermComponents, function (term) {
          return textFilteredTerms[term.key] === true || textFilteredTerms[term.key] === 'hidden';
        });
      } else if (searchType === 'sayt_without_terms') {
        unselectedTermComponents = [];
      }
      var selectedLen = selectedTermComponents.length;
      var omittedLen = omittedTermComponents.length;
      var unselectedLen = unselectedTermComponents.length;
      var totalLen = selectedLen + omittedLen + unselectedLen;

      // shortcut for some specific cases
      if (!persistSelectedTerms) {
        return {
          termComponents: allTermComponents,
          selectedLen: selectedLen,
          omittedLen: omittedLen,
          unselectedLen: unselectedLen,
          totalLen: totalLen
        };
      }
      var termComponents = selectedTermComponents.concat(omittedTermComponents).concat(unselectedTermComponents);
      var activeTermComponents = !facetHasGroupBy ? termComponents.slice(0, selectedLen + omittedLen) : selectedTermComponents.concat(omittedTermComponents).concat(partialSelectedTermComponents);
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
    }, [facet, terms, persistentCount, searchText, filteringFieldTerm, persistSelectedTerms]),
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
    "data-persist-terms": persistSelectedTerms,
    "data-open": facetOpen,
    "className": "facet-list",
    "key": "facetlist"
  };
  if (!persistSelectedTerms) {
    return /*#__PURE__*/React.createElement("div", commonProps, /*#__PURE__*/React.createElement(PartialList, {
      className: "mb-0 active-terms-pl",
      open: facetOpen,
      persistent: null,
      collapsible: /*#__PURE__*/React.createElement(React.Fragment, null, termComponents)
    }));
  } else {
    // show simple text input for basic search (search within returned values)
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
        value: searchText,
        key: "facet-search-input"
      }));
    } else if (searchType === 'sayt' || searchType === 'sayt_without_terms') {
      var _ref9$sayt_item_type = (facet || {}).sayt_item_type,
        itemType = _ref9$sayt_item_type === void 0 ? '' : _ref9$sayt_item_type;
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
      var expandButtonTitle;
      if (expanded) {
        expandButtonTitle = /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw icon-minus fas"
        }), " Collapse");
      } else {
        expandButtonTitle = /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
          className: "icon icon-fw icon-plus fas"
        }), " View ", collapsibleTermsCount, " More", /*#__PURE__*/React.createElement("span", {
          className: "pull-right"
        }, collapsibleTermsItemCount));
      }
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
        }, /*#__PURE__*/React.createElement("div", {
          className: "view-more-button",
          onClick: onToggleExpanded
        }, expandButtonTitle)))
      }));
    } else {
      return /*#__PURE__*/React.createElement("div", commonProps, /*#__PURE__*/React.createElement(PartialList, {
        className: "mb-0 active-terms-pl",
        open: facetOpen,
        persistent: activeTermComponents,
        collapsible: /*#__PURE__*/React.createElement(React.Fragment, null, facetSearch, unselectedTermComponents)
      }));
    }
  }
});
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
  var dots = dotCoords.map(function (_ref10, idx) {
    var _ref11 = _slicedToArray(_ref10, 2),
      x = _ref11[0],
      y = _ref11[1];
    currColCounter.add(x);
    var colIdx = currColCounter.size - 1;
    // Flip both axes so going bottom right to top left.
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