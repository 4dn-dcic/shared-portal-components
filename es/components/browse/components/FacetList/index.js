'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateNextHref = generateNextHref;
exports.FacetList = void 0;

var _react = _interopRequireDefault(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _url = _interopRequireDefault(require("url"));

var _queryString = _interopRequireDefault(require("query-string"));

var _underscore = _interopRequireDefault(require("underscore"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _Overlay = _interopRequireDefault(require("react-bootstrap/esm/Overlay"));

var _patchedConsole = require("./../../../util/patched-console");

var _searchFilters = require("./../../../util/search-filters");

var _navigate = require("./../../../util/navigate");

var analytics = _interopRequireWildcard(require("./../../../util/analytics"));

var _layout = require("./../../../util/layout");

var _TermsFacet = require("./TermsFacet");

var _RangeFacet = require("./RangeFacet");

var _FacetTermsList = require("./FacetTermsList");

var _FacetOfFacets = require("./FacetOfFacets");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Component to render out the FacetList for the Browse and ExperimentSet views.
 * It can work with AJAX-ed in back-end data, as is used for the Browse page, or
 * with client-side data from back-end-provided Experiments, as is used for the ExperimentSet view.
 *
 * Some of this code is not super clean and eventually could use some refactoring.
 *
 * @module {Component} facetlist
 */

/**
 * Returns a new href based on current href, current filters, a facet, and term to toggle.
 * @todo Refactor maybe later. I dont remember what the sub-functions do too well. Could be made more clear.
 *
 * @param {string} currentHref - Current search URL.
 * @param {{ field: string, term: string, remove: string }[]} contextFilters - List of currently-applied filters from context.
 * @param {{ field: string, aggregation_type: string }} facet - Facet definition for field for which a term was clicked on.
 * @param {{ key: string }} term - Term clicked on.
 */
function generateNextHref(currentHref, contextFilters, facet, term) {
  var targetSearchHref = null;
  var field = facet.field,
      _facet$aggregation_ty = facet.aggregation_type,
      aggregation_type = _facet$aggregation_ty === void 0 ? "terms" : _facet$aggregation_ty;

  var _getStatusAndUnselect = (0, _searchFilters.getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters)(term, facet, contextFilters),
      termStatus = _getStatusAndUnselect.status,
      unselectHref = _getStatusAndUnselect.href; // If present in context.filters, means is selected OR omitted. We want to make sure is _neither_ of those here.
  // Omitted and selected filters are both treated the same (as "active" filters, even if are exclusionary).


  var willUnselect = !!unselectHref;

  if (willUnselect) {
    targetSearchHref = unselectHref;
  } else {
    if (aggregation_type === "stats") {
      // Keep only 1, delete previous occurences
      // This is only for "range" facets (aggregation_type=stats) where want to ensure that have multiple "date_created.to" values in URL for example.
      var parts = _url["default"].parse(currentHref, true);

      delete parts.query[field];

      var queryStr = _queryString["default"].stringify(parts.query);

      parts.search = queryStr && queryStr.length > 0 ? '?' + queryStr : '';

      var correctedHref = _url["default"].format(parts);

      if (term.key === null) {
        targetSearchHref = correctedHref; // Keep current, stripped down v.
      } else {
        targetSearchHref = (0, _searchFilters.buildSearchHref)(field, term.key, correctedHref);
      }
    } else {
      targetSearchHref = (0, _searchFilters.buildSearchHref)(field, term.key, currentHref);
    }
  } // If we have a '#' in URL, add to target URL as well.


  var hashFragmentIdx = currentHref.indexOf('#');

  if (hashFragmentIdx > -1 && targetSearchHref.indexOf('#') === -1) {
    targetSearchHref += currentHref.slice(hashFragmentIdx);
  } // Ensure only 1 `type` filter is selected at once.
  // Unselect any other type= filters if setting new one.


  if (field === 'type' && !willUnselect) {
    var _parts = _url["default"].parse(targetSearchHref, true);

    if (Array.isArray(_parts.query.type)) {
      var types = _parts.query.type;

      if (types.length > 1) {
        var queryParts = _underscore["default"].clone(_parts.query);

        delete queryParts[""]; // Safety

        queryParts.type = encodeURIComponent(term.key); // Only 1 Item type selected at once.

        var searchString = _queryString["default"].stringify(queryParts);

        _parts.search = searchString && searchString.length > 0 ? '?' + searchString : '';
        targetSearchHref = _url["default"].format(_parts);
      }
    }
  }

  return targetSearchHref;
}

var FacetList = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FacetList, _React$PureComponent);

  var _super = _createSuper(FacetList);

  _createClass(FacetList, null, [{
    key: "sortedFinalFacetObjects",

    /** Remove any duplicates, merge in filters without selections as terms */
    value: function sortedFinalFacetObjects(facets, filters) {
      return _underscore["default"].sortBy(_underscore["default"].map(_underscore["default"].uniq(facets, false, function (f) {
        return f.field;
      }), // Ensure facets are unique, field-wise.
      function (f) {
        var newFacet = _objectSpread(_objectSpread({}, f), {}, {
          order: f.order || 0
        });

        if (f.aggregation_type === "terms") {
          // Add in any terms specified in `filters` but not in `facet.terms` - in case someone hand-put that into URL or something.
          newFacet.terms = (0, _FacetTermsList.mergeTerms)(f, filters);
        }

        return newFacet;
      }), 'order');
    }
  }, {
    key: "getInitialOpenFacetsAfterMount",
    value: function getInitialOpenFacetsAfterMount(facetComponents, persistentCount, windowHeight) {
      var filteredFlattenedComponents = facetComponents.reduce(function (m, v) {
        if (v.props.facet) {
          // Actual facet, include.
          m.push(v);
        } else {
          // A group; flatten its children upward
          m = m.concat(v.props.children);
        }

        return m;
      }, []);
      var facetLen = filteredFlattenedComponents.length; // We try to initially open some Facets depending on available screen size or props.
      // We might get rid of this feature at some point as the amount of Facets are likely to increase.
      // Or we could just set defaultFacetOpen = false if # facets > 10 or something.
      // Basically seems like should adjust `maxTermsToShow` based on total # of facets...

      var maxTermsToShow = (typeof windowHeight === 'number' && !isNaN(windowHeight) ? Math.floor(windowHeight / 60) : 15) - Math.floor(facetLen / 4);
      var facetIndexWherePastXTerms;
      var currTermCount = 0;

      for (facetIndexWherePastXTerms = 0; facetIndexWherePastXTerms < facetLen; facetIndexWherePastXTerms++) {
        if (filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.aggregation_type === "stats") {
          // Range Facet (shows 2 'terms' or fields)
          currTermCount += 2;
        } else {
          // Terms; Take into account 'view more' button
          // Slightly deprecated as doesn;t take into account 'mergeTerms'.
          // Maybe could move mergeTerms stuff up into here.
          currTermCount += Math.min(filteredFlattenedComponents[facetIndexWherePastXTerms].props.facet.terms.length, persistentCount);
        }

        if (currTermCount > maxTermsToShow) {
          break;
        }
      }

      var openFacets = {};

      for (var i = 0; i < facetIndexWherePastXTerms; i++) {
        //console.log("XX", facetIndexWherePastXTerms, filteredFlattenedComponents[i], filteredFlattenedComponents, filteredFlattenedComponents[i].props.facet.grouping)
        openFacets[filteredFlattenedComponents[i].props.facet.field] = true;

        if (filteredFlattenedComponents[i].props.facet.grouping) {
          // Set group to be open as well
          openFacets["group:" + filteredFlattenedComponents[i].props.facet.grouping] = true;
        }
      }

      return openFacets;
    }
    /**
     * We use a function instead of functional/memoized components because we want literal list of JSX components.
     * First param (props) is memoized by its keys' values.
     * These JSX components might later be segmented or something.
     *
     * @param {{ href: string, schemas: Object<string, Object>, itemTypeForSchemas: string, termTransformFxn: function, onFilter: function, getTermStatus: function }} props - Passed to all facet components.
     */

  }, {
    key: "createFacetComponents",
    value: function createFacetComponents(props, useFacets, activeTermCountByField, rangeValuesByField) {
      // The logic within `Facet` `render`, `componentDidMount`, etc. isn't executed
      // until is rendered by some other component's render method.
      // We can sort/manipulate/transform these still according to their `props.` values and such.
      var renderedFacets = useFacets.map(function (facet) {
        var _facet$grouping = facet.grouping,
            grouping = _facet$grouping === void 0 ? null : _facet$grouping,
            facetField = facet.field,
            _facet$aggregation_ty2 = facet.aggregation_type,
            aggregation_type = _facet$aggregation_ty2 === void 0 ? "terms" : _facet$aggregation_ty2;

        if (aggregation_type === "stats") {
          var _ref = rangeValuesByField[facetField] || {},
              _ref$fromVal = _ref.fromVal,
              fromVal = _ref$fromVal === void 0 ? null : _ref$fromVal,
              _ref$toVal = _ref.toVal,
              toVal = _ref$toVal === void 0 ? null : _ref$toVal;

          var isStatic = facet.min === facet.max;
          return /*#__PURE__*/_react["default"].createElement(_RangeFacet.RangeFacet, _extends({}, props, {
            facet: facet,
            key: facetField,
            anyTermsSelected: fromVal !== null || toVal !== null
          }, {
            isStatic: isStatic,
            grouping: grouping,
            fromVal: fromVal,
            toVal: toVal
          }));
        }

        if (aggregation_type === "terms") {
          var termsSelectedCount = activeTermCountByField[facetField] || 0; // countTermsSelected(facet.terms, facet, filters);

          var _anySelected = termsSelectedCount !== 0;

          var _isStatic = !_anySelected && facet.terms.length === 1;

          return /*#__PURE__*/_react["default"].createElement(_TermsFacet.TermsFacet, _extends({}, props, {
            terms: facet.terms,
            facet: facet,
            key: facetField,
            anyTermsSelected: _anySelected
          }, {
            isStatic: _isStatic,
            grouping: grouping,
            termsSelectedCount: termsSelectedCount
          }));
        }

        throw new Error("Unknown aggregation_type");
      });
      var componentsToReturn = []; // first populated with ungrouped facets, then facet groups are spliced in

      var groups = new Map(); // { groupTitle: { index: 0, facets: [facet1, facet2, facet3, ...] } }; Map() to preserve order.
      // Separate out facets with .grouping into groups.

      renderedFacets.forEach(function (renderedFacet) {
        var grouping = renderedFacet.props.grouping;

        if (!grouping) {
          // add ungrouped facets straight to componentsToReturn
          componentsToReturn.push(renderedFacet);
          return;
        } // Get existing or create new.


        var existingGroup = groups.get(grouping) || {
          index: componentsToReturn.length,
          children: [],
          facetOpen: false
        };
        existingGroup.children.push(renderedFacet);
        groups.set(grouping, existingGroup);
      });

      var groupsArr = _toConsumableArray(groups); // Check, render, and add groups into `componentsToReturn`


      groupsArr.forEach(function (_ref2, groupIndex) {
        var _ref3 = _slicedToArray(_ref2, 2),
            groupTitle = _ref3[0],
            facetGroup = _ref3[1];

        var facetsInGroup = facetGroup.children,
            index = facetGroup.index;

        if (facetsInGroup.length === 1) {
          // Doesn't need to be in group, put back into `componentsToReturn`
          componentsToReturn.splice(index, 0, facetsInGroup[0]);
        } else {
          componentsToReturn.splice(index, 0,
          /*#__PURE__*/
          // `facetGroup` contains `defaultGroupOpen`, `index`, `facets`.
          _react["default"].createElement(_FacetOfFacets.FacetOfFacets, _extends({}, props, facetGroup, {
            title: groupTitle,
            key: groupTitle
          })));
        } // Increment remaining group indices to match new length of `componentsToReturn`.
        // We're not modifying the actual `groupsArr` list itself ever (e.g. removing/adding)
        // so `fromIdx` / `groupIndex` should always stay stable.
        // We increment facetGroup.index which is the index in `componentsToReturn`.


        groupsArr.slice(groupIndex).forEach(function (_ref4) {
          var _ref5 = _slicedToArray(_ref4, 2),
              subsequentFacetGroup = _ref5[1];

          subsequentFacetGroup.index++;
        });
      });
      return componentsToReturn;
    }
  }, {
    key: "segmentOutCommonProperties",
    value: function segmentOutCommonProperties(facetComponents, separateSingleTermFacets) {
      var staticFacetElements = [];
      var selectableFacetElements = [];

      if (separateSingleTermFacets) {
        facetComponents.forEach(function (renderedFacet) {
          if (renderedFacet.props.isStatic) {
            staticFacetElements.push(renderedFacet);
          } else {
            selectableFacetElements.push(renderedFacet);
          }
        });
      } else {
        selectableFacetElements = facetComponents;
      }

      return {
        selectableFacetElements: selectableFacetElements,
        staticFacetElements: staticFacetElements
      };
    }
  }, {
    key: "extendComponentsWithFacetOpen",
    value: function extendComponentsWithFacetOpen(facetComponents, openFacets) {
      return facetComponents.map(function (facetElem) {
        // Finally, add in `facetOpen` state.
        // Avoid doing this in `createFacetComponents` since is memoized and does other more expensive ops.
        var _facetElem$props = facetElem.props,
            _facetElem$props$face = _facetElem$props.facet;
        _facetElem$props$face = _facetElem$props$face === void 0 ? {} : _facetElem$props$face;
        var _facetElem$props$face2 = _facetElem$props$face.field,
            field = _facetElem$props$face2 === void 0 ? null : _facetElem$props$face2,
            _facetElem$props$titl = _facetElem$props.title,
            groupTitle = _facetElem$props$titl === void 0 ? null : _facetElem$props$titl;
        var facetOpen = false;

        if (typeof field === "string") {
          // Facet Elem
          facetOpen = openFacets[field];

          if (facetOpen) {
            // Don't clone if don't need to; don't pass openFacets to avoid extraneous re-renders.
            return /*#__PURE__*/_react["default"].cloneElement(facetElem, {
              facetOpen: facetOpen
            });
          }

          return facetElem;
        } else if (typeof groupTitle === "string") {
          // Group Elem; pass in openFacets always as well to add facetOpen to group children
          facetOpen = openFacets["group:" + groupTitle];
          return /*#__PURE__*/_react["default"].cloneElement(facetElem, {
            facetOpen: facetOpen,
            openFacets: openFacets
          });
        } else {
          throw new Error("Unexpected Facet Component");
        }
      });
    }
  }]);

  function FacetList(props) {
    var _this;

    _classCallCheck(this, FacetList);

    _this = _super.call(this, props);
    _this.onFilterExtended = _this.onFilterExtended.bind(_assertThisInitialized(_this));
    _this.getTermStatus = _this.getTermStatus.bind(_assertThisInitialized(_this));
    _this.handleToggleFacetOpen = _this.handleToggleFacetOpen.bind(_assertThisInitialized(_this));
    _this.handleCollapseAllFacets = _this.handleCollapseAllFacets.bind(_assertThisInitialized(_this));
    _this.setOpenPopover = _this.setOpenPopover.bind(_assertThisInitialized(_this));
    _this.renderFacetComponents = _this.renderFacetComponents.bind(_assertThisInitialized(_this));
    _this.memoized = {
      countActiveTermsByField: (0, _memoizeOne["default"])(_FacetTermsList.countActiveTermsByField),
      getRangeValuesFromFiltersByField: (0, _memoizeOne["default"])(_RangeFacet.getRangeValuesFromFiltersByField),
      sortedFinalFacetObjects: (0, _memoizeOne["default"])(FacetList.sortedFinalFacetObjects),
      segmentOutCommonProperties: (0, _memoizeOne["default"])(FacetList.segmentOutCommonProperties),
      createFacetComponents: (0, _memoizeOne["default"])(FacetList.createFacetComponents, function (paramSetA, paramSetB) {
        var _paramSetA = _toArray(paramSetA),
            propsA = _paramSetA[0],
            argsA = _paramSetA.slice(1);

        var _paramSetB = _toArray(paramSetB),
            propsB = _paramSetB[0],
            argsB = _paramSetB.slice(1);

        var i;

        for (i = 0; i < argsA.length; i++) {
          if (argsA[i] !== argsB[i]) {
            return false;
          }
        }

        var keys = Object.keys(propsA);
        var keysLen = keys.length;

        for (i = 0; i < keysLen; i++) {
          if (propsA[keys[i]] !== propsB[keys[i]]) {
            return false;
          }
        }

        return true;
      }),
      extendComponentsWithFacetOpen: (0, _memoizeOne["default"])(FacetList.extendComponentsWithFacetOpen),
      getInitialOpenFacetsAfterMount: (0, _memoizeOne["default"])(FacetList.getInitialOpenFacetsAfterMount)
    };
    _this.state = {
      openFacets: {},
      // will be keyed by facet.field, value will be bool
      openPopover: null // will contain `{ ref: React Ref, popover: JSX element/component }`. We might want to move this functionality up into like App.js.

    };
    return _this;
  }

  _createClass(FacetList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          windowHeight = _this$props.windowHeight,
          windowWidth = _this$props.windowWidth,
          facets = _this$props.facets,
          filters = _this$props.filters,
          _this$props$persisten = _this$props.persistentCount,
          persistentCount = _this$props$persisten === void 0 ? 10 : _this$props$persisten;
      var rgs = (0, _layout.responsiveGridState)(windowWidth || null);

      var _this$renderFacetComp = this.renderFacetComponents(),
          selectableFacetElements = _this$renderFacetComp.selectableFacetElements; // Internally memoized - should be performant.


      if (rgs === "xs") {
        _reactTooltip["default"].rebuild();

        return;
      } // Skip if we have many facets. We're simply reusing persistentCount variable here
      // but could really be any number/value (8 ? windowHeight // 100 ?)


      if (selectableFacetElements.length >= persistentCount) {
        _reactTooltip["default"].rebuild();

        return;
      }

      this.setState({
        openFacets: this.memoized.getInitialOpenFacetsAfterMount(selectableFacetElements, persistentCount, windowHeight)
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var prevFilters = prevProps.filters;
      var prevOpenFacets = prevState.openFacets,
          prevOpenPopover = prevState.openPopover;
      var _this$state = this.state,
          openFacets = _this$state.openFacets,
          openPopover = _this$state.openPopover;
      var _this$props2 = this.props,
          filters = _this$props2.filters,
          addToBodyClassList = _this$props2.addToBodyClassList,
          removeFromBodyClassList = _this$props2.removeFromBodyClassList;

      if (openFacets !== prevOpenFacets) {
        _reactTooltip["default"].rebuild();
      }

      if (openPopover !== prevOpenPopover && typeof addToBodyClassList === "function" && typeof removeFromBodyClassList === "function") {
        if (!openPopover) {
          removeFromBodyClassList("overflow-hidden");
        } else if (openPopover && !prevOpenPopover) {
          addToBodyClassList("overflow-hidden");
        }
      }

      if (filters !== prevFilters) {
        // If new filterset causes a facet to drop into common properties section, clean up openFacets state accordingly.
        var _this$renderFacetComp2 = this.renderFacetComponents(),
            staticFacetElements = _this$renderFacetComp2.staticFacetElements; // Should be performant re: memoization


        var nextOpenFacets = _underscore["default"].clone(openFacets);

        var changed = false;
        staticFacetElements.forEach(function (facetComponent) {
          if (nextOpenFacets[facetComponent.props.facet.field]) {
            delete nextOpenFacets[facetComponent.props.facet.field];
            changed = true;
          }
        });

        if (changed) {
          this.setState({
            openFacets: nextOpenFacets
          });
        }
      }
    }
    /**
     * Calls props.onFilter after sending analytics.
     * N.B. When rangeFacet calls onFilter, it creates a `term` with `key` property
     * as no 'terms' exist when aggregation_type === stats.
     */

  }, {
    key: "onFilterExtended",
    value: function onFilterExtended(facet, term) {
      var _this$props3 = this.props,
          onFilter = _this$props3.onFilter,
          contextFilters = _this$props3.filters;
      var field = facet.field;
      var termKey = term.key;
      var statusAndHref = (0, _searchFilters.getStatusAndUnselectHrefIfSelectedOrOmittedFromResponseFilters)(term, facet, contextFilters);
      var isUnselecting = !!statusAndHref.href;
      analytics.event('FacetList', isUnselecting ? 'Unset Filter' : 'Set Filter', {
        field: field,
        'term': termKey,
        'eventLabel': analytics.eventLabelFromChartNode({
          field: field,
          'term': termKey
        }),
        'currentFilters': analytics.getStringifiedCurrentFilters((0, _searchFilters.contextFiltersToExpSetFilters)(contextFilters || null)) // 'Existing' filters, or filters at time of action, go here.

      });
      return onFilter.apply(void 0, arguments);
    }
  }, {
    key: "getTermStatus",
    value: function getTermStatus(term, facet) {
      var contextFilters = this.props.filters;
      return (0, _searchFilters.getTermFacetStatus)(term, facet, contextFilters);
    }
  }, {
    key: "handleToggleFacetOpen",
    value: function handleToggleFacetOpen(facetField) {
      var nextOpen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState(function (_ref6) {
        var prevOpenFacets = _ref6.openFacets;

        var openFacets = _underscore["default"].clone(prevOpenFacets);

        if (typeof nextOpen !== "boolean") {
          nextOpen = openFacets[facetField];
        }

        if (!nextOpen) {
          delete openFacets[facetField];
        } else {
          openFacets[facetField] = true;
        }

        return {
          openFacets: openFacets
        };
      });
    }
  }, {
    key: "setOpenPopover",
    value: function setOpenPopover() {
      var nextPopover = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState(function (_ref7) {
        var _ref7$openPopover = _ref7.openPopover,
            openPopover = _ref7$openPopover === void 0 ? null : _ref7$openPopover;

        if (!openPopover) {
          if (!nextPopover) return null;
          return {
            openPopover: nextPopover
          };
        } else {
          if (!nextPopover) {
            return {
              openPopover: null
            };
          }

          var prevRef = openPopover.ref,
              prevPopover = openPopover.popover;
          var ref = nextPopover.ref,
              popover = nextPopover.popover;

          if (ref === prevRef && popover === prevPopover) {
            return null;
          }

          return {
            openPopover: nextPopover
          };
        }
      }, cb);
    }
  }, {
    key: "handleCollapseAllFacets",
    value: function handleCollapseAllFacets() {
      this.setState({
        openFacets: {}
      });
    }
    /** We want an actual array(s) of JSX components to potentially shift, assess, transform etc. rather than Functional Component that renders list, for example. */

  }, {
    key: "renderFacetComponents",
    value: function renderFacetComponents() {
      var _this$props4 = this.props,
          _this$props4$facets = _this$props4.facets,
          facets = _this$props4$facets === void 0 ? null : _this$props4$facets,
          _this$props4$separate = _this$props4.separateSingleTermFacets,
          separateSingleTermFacets = _this$props4$separate === void 0 ? false : _this$props4$separate,
          href = _this$props4.href,
          schemas = _this$props4.schemas,
          filters = _this$props4.filters,
          itemTypeForSchemas = _this$props4.itemTypeForSchemas,
          termTransformFxn = _this$props4.termTransformFxn,
          persistentCount = _this$props4.persistentCount;
      var _this$state2 = this.state,
          openFacets = _this$state2.openFacets,
          openPopover = _this$state2.openPopover;
      var facetComponentProps = {
        href: href,
        schemas: schemas,
        filters: filters,
        itemTypeForSchemas: itemTypeForSchemas,
        termTransformFxn: termTransformFxn,
        persistentCount: persistentCount,
        separateSingleTermFacets: separateSingleTermFacets,
        openPopover: openPopover,
        onFilter: this.onFilterExtended,
        getTermStatus: this.getTermStatus,
        onToggleOpen: this.handleToggleFacetOpen,
        setOpenPopover: this.setOpenPopover
      };

      var _this$memoized$segmen = this.memoized.segmentOutCommonProperties(this.memoized.createFacetComponents(facetComponentProps, this.memoized.sortedFinalFacetObjects(facets, filters), this.memoized.countActiveTermsByField(filters), this.memoized.getRangeValuesFromFiltersByField(facets, filters)), separateSingleTermFacets),
          staticFacetElements = _this$memoized$segmen.staticFacetElements,
          rawerSelectableFacetElems = _this$memoized$segmen.selectableFacetElements; // We can skip extending static facet elements with facetOpen


      var selectableFacetElements = this.memoized.extendComponentsWithFacetOpen(rawerSelectableFacetElems, openFacets);
      return {
        selectableFacetElements: selectableFacetElements,
        staticFacetElements: staticFacetElements
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          _this$props5$facets = _this$props5.facets,
          facets = _this$props5$facets === void 0 ? null : _this$props5$facets,
          className = _this$props5.className,
          _this$props5$title = _this$props5.title,
          title = _this$props5$title === void 0 ? "Properties" : _this$props5$title,
          _this$props5$onClearF = _this$props5.onClearFilters,
          onClearFilters = _this$props5$onClearF === void 0 ? null : _this$props5$onClearF,
          _this$props5$showClea = _this$props5.showClearFiltersButton,
          showClearFiltersButton = _this$props5$showClea === void 0 ? false : _this$props5$showClea,
          _this$props5$maxBodyH = _this$props5.maxBodyHeight,
          maxHeight = _this$props5$maxBodyH === void 0 ? null : _this$props5$maxBodyH;
      var _this$state3 = this.state,
          openFacets = _this$state3.openFacets,
          openPopover = _this$state3.openPopover;

      var _ref8 = openPopover || {},
          popoverJSX = _ref8.popover,
          popoverTargetRef = _ref8.ref;

      if (!facets || !Array.isArray(facets) || facets.length === 0) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "pt-2 pb-2",
          style: {
            color: "#aaa"
          }
        }, "No facets available");
      }

      var bodyProps = {
        className: "facets-body" + (typeof maxHeight === "number" ? " has-max-height" : ""),
        style: typeof maxHeight === "number" ? {
          maxHeight: maxHeight
        } : null
      };

      var _this$renderFacetComp3 = this.renderFacetComponents(),
          staticFacetElements = _this$renderFacetComp3.staticFacetElements,
          selectableFacetElements = _this$renderFacetComp3.selectableFacetElements;

      var anyFacetsOpen = _underscore["default"].keys(openFacets).length !== 0;
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "facets-container facets" + (className ? ' ' + className : '')
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row facets-header"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col facets-title-column text-truncate"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-filter fas"
      }), "\xA0", /*#__PURE__*/_react["default"].createElement("h4", {
        className: "facets-title"
      }, title)), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-auto"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "btn-group btn-group-sm properties-controls",
        role: "group",
        "aria-label": "Properties Controls"
      }, anyFacetsOpen ? /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        className: "btn btn-outline-light",
        onClick: this.handleCollapseAllFacets,
        "data-tip": "Collapse all facets below"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-minus fas"
      })) : null, showClearFiltersButton && typeof onClearFilters === "function" ? /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        className: "btn btn-outline-light",
        onClick: onClearFilters,
        "data-tip": "Clear all filters"
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-times fas"
      })) : null))), /*#__PURE__*/_react["default"].createElement("div", bodyProps, selectableFacetElements, staticFacetElements.length > 0 ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "row facet-list-separator"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-12"
      }, staticFacetElements.length, " Common Properties")) : null, staticFacetElements)), popoverJSX && popoverTargetRef ?
      /*#__PURE__*/

      /* `rootClose rootCloseEvent="click"` didn't work as props here */
      _react["default"].createElement(_Overlay["default"], {
        show: true,
        target: popoverTargetRef,
        flip: true,
        placement: "auto",
        rootClose: true,
        rootCloseDisabled: false
      }, popoverJSX) : null);
    }
  }]);

  return FacetList;
}(_react["default"].PureComponent); // TODO: Pull out the split terms into own component
// 2: get ourselves the fieldSchema and pass it down in here.
// function


exports.FacetList = FacetList;

_defineProperty(FacetList, "propTypes", {
  'facets': _propTypes["default"].arrayOf(_propTypes["default"].shape({
    'field': _propTypes["default"].string,
    // Nested field in experiment(_set), using dot-notation.
    'terms': _propTypes["default"].arrayOf(_propTypes["default"].shape({
      'doc_count': _propTypes["default"].number,
      // Exp(set)s matching term
      'key': _propTypes["default"].string // Unique key/title of term.

    })),
    'title': _propTypes["default"].string,
    // Title of facet
    'total': _propTypes["default"].number // # of experiment(_set)s

  })),
  'filters': _propTypes["default"].arrayOf(_propTypes["default"].object).isRequired,
  // context.filters
  'itemTypeForSchemas': _propTypes["default"].string.isRequired,
  // For tooltips
  'showClearFiltersButton': _propTypes["default"].bool.isRequired,
  'onClearFilters': _propTypes["default"].func.isRequired,

  /**
   * In lieu of facets, which are only generated by search.py, can
   * use and format schemas, which are available to experiment-set-view.js through item.js.
   */
  'schemas': _propTypes["default"].object,
  // { '<schemaKey : string > (active facet categories)' : Set (active filters within category) }
  'title': _propTypes["default"].string,
  // Title to put atop FacetList
  'className': _propTypes["default"].string,
  // Extra class
  'href': _propTypes["default"].string,
  'onFilter': _propTypes["default"].func,
  // What happens when Term is clicked.
  'separateSingleTermFacets': _propTypes["default"].bool,
  'maxBodyHeight': _propTypes["default"].number
});

_defineProperty(FacetList, "defaultProps", {
  /**
   * These 'default' functions don't do anything except show parameters passed.
   * Callback must be called because it changes Term's 'loading' state back to false.
   */
  'onFilter': function onFilter(facet, term, callback) {
    // Set redux filter accordingly, or update search query/href.
    _patchedConsole.patchedConsoleInstance.log('FacetList: props.onFilter(' + facet.field + ', ' + term.key + ', callback)');

    _patchedConsole.patchedConsoleInstance.log(facet, term);

    if (typeof callback === 'function') {
      setTimeout(callback, 1000);
    }
  },
  'onClearFilters': function onClearFilters(e, callback) {
    // Clear Redux filters, or go base search url.
    e.preventDefault();

    _patchedConsole.patchedConsoleInstance.log('FacetList: props.onClearFilters(e, callback)');

    if (typeof callback === 'function') {
      setTimeout(callback, 1000);
    }
  },
  'getTermStatus': function getTermStatus() {
    // Check against responseContext.filters, or expSetFilters in Redux store.
    return {
      'status': 'none',
      'href': null
    };
  },
  // 'itemTypeForSchemas': 'ExperimentSetReplicate', - let PropType check catch lack of presence of this
  'termTransformFxn': function termTransformFxn(field, term) {
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    return term;
  }
});