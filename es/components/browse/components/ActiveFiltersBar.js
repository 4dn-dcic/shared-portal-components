'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActiveFiltersBar = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var vizUtil = _interopRequireWildcard(require("./../../viz/utilities"));

var _util = require("./../../util");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ActiveFiltersBar =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ActiveFiltersBar, _React$PureComponent);

  var _super = _createSuper(ActiveFiltersBar);

  function ActiveFiltersBar(props) {
    var _this;

    _classCallCheck(this, ActiveFiltersBar);

    _this = _super.call(this, props);
    _this.updateHoverNodes = _underscore["default"].throttle(_this.updateHoverNodes.bind(_assertThisInitialized(_this)), 200);
    _this.renderCrumbs = _this.renderCrumbs.bind(_assertThisInitialized(_this));
    _this.memoized = {
      getSearchItemType: (0, _memoizeOne["default"])(_util.searchFilters.getSearchItemType)
    };
    return _this;
  }

  _createClass(ActiveFiltersBar, [{
    key: "updateHoverNodes",
    value: function updateHoverNodes() {
      var _this2 = this;

      var sequence = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      vizUtil.requestAnimationFrame(function () {
        _this2.setState({
          'highlighted': sequence
        });
      });
    }
  }, {
    key: "renderCrumbs",
    value: function renderCrumbs() {
      var _this$props = this.props,
          invisible = _this$props.invisible,
          onTermClick = _this$props.onTermClick,
          filters = _this$props.filters,
          context = _this$props.context,
          orderedFieldNames = _this$props.orderedFieldNames,
          schemas = _this$props.schemas,
          termTransformFxn = _this$props.termTransformFxn,
          fieldTransformFxn = _this$props.fieldTransformFxn,
          termClassName = _this$props.termClassName,
          fieldGroupClassName = _this$props.fieldGroupClassName;
      if (invisible) return null;
      if (!Array.isArray(filters) || filters.length === 0) return null;
      var filtersByField = new Map();
      filters.forEach(function (_ref) {
        var field = _ref.field,
            term = _ref.term;

        if (!filtersByField.has(field)) {
          filtersByField.set(field, new Set());
        }

        filtersByField.get(field).add(term);
      });
      var renderedFieldFilterGroups = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = filtersByField[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              field = _step$value[0],
              termSet = _step$value[1];

          // Try to get more accurate title from context.facets list, if available.
          var relatedFacet = Array.isArray(context.facets) && _underscore["default"].findWhere(context.facets, {
            field: field
          });

          var fieldTitle = relatedFacet && relatedFacet.title || fieldTransformFxn(field, schemas, this.memoized.getSearchItemType(context)) || 'N/A';
          var renderedNodes = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = termSet[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var term = _step2.value;
              renderedNodes.push(
              /*#__PURE__*/
              _react["default"].createElement(RegularCrumb, _extends({
                filters: filters,
                field: field,
                term: term,
                termTransformFxn: termTransformFxn
              }, {
                key: term,
                onClick: onTermClick,
                className: termClassName
              })));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          renderedFieldFilterGroups.push(
          /*#__PURE__*/
          _react["default"].createElement("div", {
            className: fieldGroupClassName,
            key: field,
            "data-field": field
          }, renderedNodes,
          /*#__PURE__*/
          _react["default"].createElement("div", {
            className: "field-label"
          }, fieldTitle)));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return renderedFieldFilterGroups;
    }
  }, {
    key: "render",
    value: function render() {
      var parentId = this.props.parentId;
      return (
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "active-filters-bar",
          id: parentId + '-crumbs'
        }, this.renderCrumbs())
      );
    }
  }]);

  return ActiveFiltersBar;
}(_react["default"].PureComponent);

exports.ActiveFiltersBar = ActiveFiltersBar;

_defineProperty(ActiveFiltersBar, "defaultProps", {
  'schemas': null,
  'parentId': 'main',
  'filters': null,
  'invisible': false,
  'termTransformFxn': function termTransformFxn(field, term) {
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return term;
  },
  'fieldTransformFxn': function fieldTransformFxn(field, term) {
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    return term;
  },
  'onTermClick': function onTermClick(field, term) {
    _util.console.log("Clicked", field, term);
  },
  'fieldGroupClassName': "field-group mb-32",
  'termClassName': "chart-crumb"
});

function Container(_ref2) {
  var sequential = _ref2.sequential,
      children = _ref2.children;
  var title = sequential ? "Examining" : "Currently-selected Filters";
  return (
    /*#__PURE__*/
    _react["default"].createElement("div", {
      className: "active-filters-bar-container"
    },
    /*#__PURE__*/
    _react["default"].createElement("h5", {
      className: "crumbs-title"
    }, title), children)
  );
}

var RegularCrumb =
/*#__PURE__*/
_react["default"].memo(function (props) {
  var field = props.field,
      term = props.term,
      _props$color = props.color,
      color = _props$color === void 0 ? null : _props$color,
      termTransformFxn = props.termTransformFxn,
      _onClick = props.onClick,
      className = props.className;
  return (
    /*#__PURE__*/
    _react["default"].createElement("span", {
      className: className,
      "data-term": term,
      style: {
        backgroundColor: color
      }
    }, termTransformFxn(field, term, true),
    /*#__PURE__*/
    _react["default"].createElement("span", {
      className: "icon-container",
      onClick: function onClick(evt) {
        _onClick(evt, field, term);
      }
    },
    /*#__PURE__*/
    _react["default"].createElement("i", {
      className: "icon icon-times fas"
    })))
  );
});