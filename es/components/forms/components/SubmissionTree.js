'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldSchemaLinkToType = fieldSchemaLinkToType;
exports.fieldSchemaLinkToPath = fieldSchemaLinkToPath;
exports.SubmissionTree = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _Collapse = _interopRequireDefault(require("react-bootstrap/esm/Collapse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

// Create a custom tree to represent object hierarchy in front end submission.
// Each leaf is clickable and will bring you to a view of the new object
var SubmissionTree =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SubmissionTree, _React$PureComponent);

  var _super = _createSuper(SubmissionTree);

  function SubmissionTree() {
    _classCallCheck(this, SubmissionTree);

    return _super.apply(this, arguments);
  }

  _createClass(SubmissionTree, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _reactTooltip["default"].rebuild();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          keyIdx = _this$props.keyIdx,
          others = _objectWithoutProperties(_this$props, ["keyIdx"]);

      return (
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "submission-view-navigation-tree"
        },
        /*#__PURE__*/
        _react["default"].createElement("h4", {
          className: "form-section-heading mb-08"
        }, "Navigation ",
        /*#__PURE__*/
        _react["default"].createElement(InfoIcon, null, '<h5>This panel is for navigating between objects in the creation process</h5> Click on Item/dependency titles to navigate around and edit each individually. Dependencies must be submitted before their parent can be.')),
        /*#__PURE__*/
        _react["default"].createElement(SubmissionLeaf, _extends({}, others, {
          keyIdx: 0,
          open: true
        })))
      );
    }
  }]);

  return SubmissionTree;
}(_react["default"].PureComponent);
/*
Generate an entry in SubmissionTree that corresponds to an object. When clicked
on, either change the currKey to that object's key if a custom object, or
open that object's page in a new tab if a pre-existing or submitted object.
*/


exports.SubmissionTree = SubmissionTree;

_defineProperty(SubmissionTree, "propTypes", {
  'hierarchy': _propTypes["default"].object.isRequired,
  'keyValid': _propTypes["default"].object.isRequired,
  'keyTypes': _propTypes["default"].object.isRequired,
  'keyDisplay': _propTypes["default"].object.isRequired,
  'keyComplete': _propTypes["default"].object.isRequired,
  'currKey': _propTypes["default"].number.isRequired,
  'keyLinkBookmarks': _propTypes["default"].object.isRequired,
  'keyLinks': _propTypes["default"].object.isRequired,
  'setSubmissionState': _propTypes["default"].func.isRequired,
  'schemas': _propTypes["default"].object
});

var SubmissionLeaf =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(SubmissionLeaf, _React$PureComponent2);

  var _super2 = _createSuper(SubmissionLeaf);

  function SubmissionLeaf(props) {
    var _this;

    _classCallCheck(this, SubmissionLeaf);

    _this = _super2.call(this, props);
    _this.handleClick = _underscore["default"].throttle(_this.handleClick.bind(_assertThisInitialized(_this)), 500, {
      'trailing': false
    });
    _this.generateAllPlaceholders = _this.generateAllPlaceholders.bind(_assertThisInitialized(_this));
    _this.placeholderSortFxn = _this.placeholderSortFxn.bind(_assertThisInitialized(_this));
    _this.generateChild = _this.generateChild.bind(_assertThisInitialized(_this));
    _this.state = {
      'open': typeof props.open === 'boolean' ? props.open : true
    };
    return _this;
  }

  _createClass(SubmissionLeaf, [{
    key: "generateChild",
    value: function generateChild(childKey) {
      if (!isNaN(childKey)) childKey = parseInt(childKey);
      var _this$props2 = this.props,
          hierarchy = _this$props2.hierarchy,
          keyIdx = _this$props2.keyIdx,
          depth = _this$props2.depth; // replace key and hierarchy in props

      return (
        /*#__PURE__*/
        _react["default"].createElement(SubmissionLeaf, _extends({}, this.props, {
          key: childKey,
          keyIdx: childKey,
          hierarchy: hierarchy[keyIdx],
          open: true,
          depth: depth + 1
        }))
      );
    }
  }, {
    key: "placeholderSortFxn",
    value: function placeholderSortFxn(fieldA, fieldB) {
      var _this$props3 = this.props,
          schemas = _this$props3.schemas,
          keyTypes = _this$props3.keyTypes,
          keyIdx = _this$props3.keyIdx;
      var itemSchema = schemas[keyTypes[keyIdx]];
      if (!itemSchema) return 0;

      var _fieldA$split = fieldA.split('.'),
          _fieldA$split2 = _slicedToArray(_fieldA$split, 1),
          fieldABase = _fieldA$split2[0];

      var _fieldB$split = fieldB.split('.'),
          _fieldB$split2 = _slicedToArray(_fieldB$split, 1),
          fieldBBase = _fieldB$split2[0];

      if (Array.isArray(itemSchema.required)) {
        if (_underscore["default"].contains(itemSchema.required, fieldA)) return -1;
        if (_underscore["default"].contains(itemSchema.required, fieldB)) return 1;
        if (_underscore["default"].contains(itemSchema.required, fieldABase)) return -1;
        if (_underscore["default"].contains(itemSchema.required, fieldBBase)) return -1;
      }

      var fieldASchema = itemSchema.properties[fieldABase];
      var fieldBSchema = itemSchema.properties[fieldBBase];
      if ((fieldASchema.lookup || 750) > (fieldBSchema.lookup || 750)) return -1;
      if ((fieldASchema.lookup || 750) < (fieldBSchema.lookup || 750)) return 1;
      return 0;
    }
    /**
     * Generate placeholders in the SubmissionTree for every linkTo name and
     * create a SubmissionLeaf for each child object under its corresponding
     * placholder.
     *
     * @returns {JSX.Element} Visible leaf/branch-representing element.
     */

  }, {
    key: "generateAllPlaceholders",
    value: function generateAllPlaceholders() {
      var _this2 = this;

      var _this$props4 = this.props,
          keyIdx = _this$props4.keyIdx,
          keyLinkBookmarks = _this$props4.keyLinkBookmarks;
      var fieldsWithLinkTosToShow = keyLinkBookmarks[keyIdx].sort(this.placeholderSortFxn);
      return _underscore["default"].map(fieldsWithLinkTosToShow, function (field) {
        return (
          /*#__PURE__*/
          _react["default"].createElement(SubmissionProperty, _extends({}, _this2.props, {
            field: field,
            key: field
          }))
        );
      });
    }
    /** Open a new tab on click or change the currKey of submissionView to that of props.keyIdx */

  }, {
    key: "handleClick",
    value: function handleClick(e) {
      var _this$props5 = this.props,
          setSubmissionState = _this$props5.setSubmissionState,
          keyIdx = _this$props5.keyIdx,
          keyValid = _this$props5.keyValid,
          keyComplete = _this$props5.keyComplete;
      e.preventDefault(); // if key is not a number (i.e. path), the object is not a custom one.
      // format the leaf as the following if pre-existing obj or submitted
      // custom object.

      if (isNaN(keyIdx) || keyValid[keyIdx] === 4 && keyComplete[keyIdx]) {
        var win = window.open(isNaN(keyIdx) ? keyIdx : keyComplete[keyIdx], '_blank');

        if (win) {
          win.focus();
        } else {
          alert('Object page popup blocked!');
        }

        return;
      }

      setSubmissionState('currKey', keyIdx);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          keyValid = _this$props6.keyValid,
          keyIdx = _this$props6.keyIdx,
          keyDisplay = _this$props6.keyDisplay,
          keyComplete = _this$props6.keyComplete,
          hierarchy = _this$props6.hierarchy,
          currKey = _this$props6.currKey,
          depth = _this$props6.depth;
      var placeholders;

      if (!isNaN(keyIdx)
      /* || typeof _.invert(keyComplete)[keyIdx] !== 'undefined' */
      ) {
          placeholders = this.generateAllPlaceholders();
        } else if (typeof _underscore["default"].invert(keyComplete)[keyIdx] !== 'undefined') {
        placeholders = [];
      } else {
        // must be a submitted object - plot directly
        placeholders = _underscore["default"].keys(hierarchy[keyIdx]).map(this.generateChild);
      }

      var titleText = keyDisplay[keyIdx] || keyIdx;
      var iconClass;
      var extIcon;
      var statusClass = null;
      var isCurrentlySelected = false;
      var tip = null; // if key is not a number (i.e. path), the object is not a custom one.
      // format the leaf as the following if pre-existing obj or submitted
      // custom object.

      if (isNaN(keyIdx) || keyValid[keyIdx] === 4 && keyComplete[keyIdx]) {
        statusClass = 'existing-item';
        iconClass = "icon-hdd far";
        tip = "Successfully submitted or pre-existing item; already exists in the database.<br>Click to view this item/dependency in new tab/window.";
        extIcon =
        /*#__PURE__*/
        _react["default"].createElement("i", {
          className: "icon icon-external-link-alt fas"
        });
      } else {
        switch (keyValid[keyIdx]) {
          case 0:
            statusClass = 'not-complete';
            iconClass = "icon-stop-circle far";
            tip = "Has incomplete children, cannot yet be validated.";
            break;

          case 1:
            statusClass = 'complete-not-validated';
            iconClass = "icon-circle far";
            tip = "All children are complete, can be validated.";
            break;

          case 2:
            statusClass = 'failed-validation';
            iconClass = "icon-times fas";
            tip = "Validation failed. Fix fields and try again.";
            break;

          case 3:
            statusClass = 'validated';
            iconClass = "icon-check fas";
            tip = "Validation passed, ready for submission.";
            break;

          default:
            statusClass = 'status-not-determined';
            break;
        }
      }

      var icon =
      /*#__PURE__*/
      _react["default"].createElement("i", {
        className: "icon indicator-icon " + iconClass
      });

      if (keyIdx === currKey) {
        // We're currently on this Item
        isCurrentlySelected = true;
        extIcon =
        /*#__PURE__*/
        _react["default"].createElement("i", {
          className: "icon icon-pencil pull-right fas",
          "data-tip": "Item which you are currently editing."
        });
      }

      return (
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "submission-nav-leaf linked-item-title leaf-depth-" + depth + (isCurrentlySelected ? ' active' : '')
        },
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "clearfix inner-title " + statusClass,
          onClick: this.handleClick,
          "data-tip": tip,
          "data-html": true
        }, icon,
        /*#__PURE__*/
        _react["default"].createElement("span", {
          className: "title-text"
        }, titleText), extIcon), placeholders && placeholders.length > 0 ?
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "list-of-properties"
        }, placeholders) : null)
      );
    }
  }]);

  return SubmissionLeaf;
}(_react["default"].PureComponent);

_defineProperty(SubmissionLeaf, "defaultProps", {
  'depth': 0
});

var SubmissionProperty =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SubmissionProperty, _React$Component);

  var _super3 = _createSuper(SubmissionProperty);

  function SubmissionProperty(props) {
    var _this3;

    _classCallCheck(this, SubmissionProperty);

    _this3 = _super3.call(this, props);
    _this3.handleToggle = _underscore["default"].throttle(_this3.handleToggle.bind(_assertThisInitialized(_this3)), 500, {
      'trailing': false
    });
    _this3.generateChild = _this3.generateChild.bind(_assertThisInitialized(_this3));
    _this3.state = {
      'open': typeof props.open === 'boolean' ? props.open : true
    };
    return _this3;
  }

  _createClass(SubmissionProperty, [{
    key: "handleToggle",
    value: function handleToggle(e) {
      e.preventDefault();
      e.stopPropagation();
      this.setState(function (_ref) {
        var open = _ref.open;
        return {
          "open": !open
        };
      });
    }
  }, {
    key: "generateChild",
    value: function generateChild(childKey) {
      var _this$props7 = this.props,
          keyIdx = _this$props7.keyIdx,
          depth = _this$props7.depth,
          hierarchy = _this$props7.hierarchy;
      if (!isNaN(childKey)) childKey = parseInt(childKey); // replace key and hierarchy in props

      return (
        /*#__PURE__*/
        _react["default"].createElement(SubmissionLeaf, _extends({}, this.props, {
          key: childKey,
          keyIdx: childKey,
          hierarchy: hierarchy[keyIdx],
          open: true,
          depth: depth + 1
        }))
      );
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          field = _this$props8.field,
          schemas = _this$props8.schemas,
          keyTypes = _this$props8.keyTypes,
          keyIdx = _this$props8.keyIdx,
          hierarchy = _this$props8.hierarchy,
          keyLinks = _this$props8.keyLinks,
          depth = _this$props8.depth;
      var open = this.state.open; // Item currently being edited

      var itemSchema = schemas[keyTypes[keyIdx]];
      if (!itemSchema) return null;

      var isRequired = Array.isArray(itemSchema.required) && _underscore["default"].contains(itemSchema.required, field);

      var _field$split = field.split('.'),
          _field$split2 = _slicedToArray(_field$split, 1),
          fieldBase = _field$split2[0];

      var fieldSchema = itemSchema.properties[fieldBase];
      var bookmark = fieldSchema && fieldSchema.title || fieldSchemaLinkToType(fieldSchema);

      var children = _underscore["default"].map(_underscore["default"].filter(_underscore["default"].keys(hierarchy[keyIdx]), function (childKey) {
        return keyLinks[childKey] === field;
      }), this.generateChild);

      var noChildren = children.length === 0;
      return (
        /*#__PURE__*/
        _react["default"].createElement("div", {
          key: bookmark,
          className: "submission-nav-leaf linked-item-type-name leaf-depth-" + depth + (isRequired ? ' is-required' : '') + (!noChildren ? ' has-children' : '')
        },
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "clearfix inner-title" + (!noChildren ? ' clickable' : ''),
          onClick: !noChildren ? this.handleToggle : undefined
        },
        /*#__PURE__*/
        _react["default"].createElement("i", {
          className: "icon property-expand-icon fas icon-" + (open ? 'minus' : 'plus')
        }),
        /*#__PURE__*/
        _react["default"].createElement("span", null, children.length, " ", bookmark || field)), !noChildren ?
        /*#__PURE__*/
        _react["default"].createElement(_Collapse["default"], {
          "in": open
        },
        /*#__PURE__*/
        _react["default"].createElement("div", {
          className: "children-container"
        }, children)) : null)
      );
    }
  }]);

  return SubmissionProperty;
}(_react["default"].Component);

function InfoIcon(_ref2) {
  var children = _ref2.children,
      className = _ref2.className;
  if (!children) return null;
  return (
    /*#__PURE__*/
    _react["default"].createElement("i", {
      style: {
        "marginLeft": "6px",
        'fontSize': '0.8em'
      },
      className: "icon fas icon-info-circle" + (className ? ' ' + className : ''),
      "data-place": "right",
      "data-html": true,
      "data-tip": children
    })
  );
}
/**
 * Function to recursively find whether a schema for a field contains a linkTo to
 * another Item within its nested structure.
 *
 * @param {{ title: string, type: string, linkTo: string }} json - A schema for a field.
 * @param {boolean} [getProperty=false] - Unused? What is this supposed to do?
 * @returns {string|null} The `@type` of the linkTo Item referenced in the field schema, if any, else null.
 */


function fieldSchemaLinkToType(json) {
  arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var currKeys = _underscore["default"].keys(json),
      key,
      value;

  for (var i = 0; i < currKeys.length; i++) {
    key = currKeys[i];
    value = json[key];

    if (key === 'linkTo') {
      return value;
    } else if (value !== null && _typeof(value) === 'object') {
      var test = fieldSchemaLinkToType(value);

      if (test !== null) {
        return test;
      }
    }
  }
}
/**
 * Returns list of recursed/nested keys from fieldSchema which contains linkTo, or true if direct linkTo on fieldSchema itself.
 *
 * @param {{ 'title':string, 'type':string, 'linkTo':string }} json - Schema for a field.
 * @returns {string[]|boolean} True if current field is linkTo, else field keys which contain nested linkTos.
 */


function fieldSchemaLinkToPath(json) {
  var jsonKeys = _underscore["default"].keys(json),
      key;

  for (var i = 0; i < jsonKeys.length; i++) {
    key = jsonKeys[i];

    if (key === 'linkTo') {
      return true;
    } else if (json[key] !== null && _typeof(json[key]) === 'object') {
      var test = fieldSchemaLinkToPath(json[key]);

      if (test === true) {
        return [key];
      } else if (Array.isArray(test)) {
        return [key].concat(test);
      } else {
        continue;
      }
    }
  }
}