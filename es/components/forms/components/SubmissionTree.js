import _typeof from "@babel/runtime/helpers/typeof";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["keyIdx"];
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import Collapse from 'react-bootstrap/esm/Collapse';

// Create a custom tree to represent object hierarchy in front end submission.
// Each leaf is clickable and will bring you to a view of the new object
export var SubmissionTree = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SubmissionTree, _React$PureComponent);
  var _super = _createSuper(SubmissionTree);
  function SubmissionTree() {
    _classCallCheck(this, SubmissionTree);
    return _super.apply(this, arguments);
  }
  _createClass(SubmissionTree, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      ReactTooltip.rebuild();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        keyIdx = _this$props.keyIdx,
        others = _objectWithoutProperties(_this$props, _excluded);
      return /*#__PURE__*/React.createElement("div", {
        className: "submission-view-navigation-tree"
      }, /*#__PURE__*/React.createElement("h4", {
        className: "form-section-heading mb-08"
      }, "Navigation ", /*#__PURE__*/React.createElement(InfoIcon, null, '<h5>This panel is for navigating between objects in the creation process</h5> Click on Item/dependency titles to navigate around and edit each individually. Dependencies must be submitted before their parent can be.')), /*#__PURE__*/React.createElement(SubmissionLeaf, _extends({}, others, {
        keyIdx: 0,
        open: true
      })));
    }
  }]);
  return SubmissionTree;
}(React.PureComponent);

/*
Generate an entry in SubmissionTree that corresponds to an object. When clicked
on, either change the currKey to that object's key if a custom object, or
open that object's page in a new tab if a pre-existing or submitted object.
*/
_defineProperty(SubmissionTree, "propTypes", {
  'hierarchy': PropTypes.object.isRequired,
  'keyValid': PropTypes.object.isRequired,
  'keyTypes': PropTypes.object.isRequired,
  'keyDisplay': PropTypes.object.isRequired,
  'keyComplete': PropTypes.object.isRequired,
  'currKey': PropTypes.number.isRequired,
  'keyLinkBookmarks': PropTypes.object.isRequired,
  'keyLinks': PropTypes.object.isRequired,
  'setSubmissionState': PropTypes.func.isRequired,
  'schemas': PropTypes.object
});
var SubmissionLeaf = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(SubmissionLeaf, _React$PureComponent2);
  var _super2 = _createSuper(SubmissionLeaf);
  function SubmissionLeaf(props) {
    var _this;
    _classCallCheck(this, SubmissionLeaf);
    _this = _super2.call(this, props);
    _this.handleClick = _.throttle(_this.handleClick.bind(_assertThisInitialized(_this)), 500, {
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
        depth = _this$props2.depth;

      // replace key and hierarchy in props
      return /*#__PURE__*/React.createElement(SubmissionLeaf, _extends({}, this.props, {
        key: childKey,
        keyIdx: childKey,
        hierarchy: hierarchy[keyIdx],
        open: true,
        depth: depth + 1
      }));
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
        if (_.contains(itemSchema.required, fieldA)) return -1;
        if (_.contains(itemSchema.required, fieldB)) return 1;
        if (_.contains(itemSchema.required, fieldABase)) return -1;
        if (_.contains(itemSchema.required, fieldBBase)) return -1;
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
      return _.map(fieldsWithLinkTosToShow, function (field) {
        return /*#__PURE__*/React.createElement(SubmissionProperty, _extends({}, _this2.props, {
          field: field,
          key: field
        }));
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
      e.preventDefault();

      // if key is not a number (i.e. path), the object is not a custom one.
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
      if (!isNaN(keyIdx) /* || typeof _.invert(keyComplete)[keyIdx] !== 'undefined' */) {
        placeholders = this.generateAllPlaceholders();
      } else if (typeof _.invert(keyComplete)[keyIdx] !== 'undefined') {
        placeholders = [];
      } else {
        // must be a submitted object - plot directly
        placeholders = _.keys(hierarchy[keyIdx]).map(this.generateChild);
      }
      var titleText = keyDisplay[keyIdx] || keyIdx;
      var iconClass;
      var extIcon;
      var statusClass = null;
      var isCurrentlySelected = false;
      var tip = null;

      // if key is not a number (i.e. path), the object is not a custom one.
      // format the leaf as the following if pre-existing obj or submitted
      // custom object.
      if (isNaN(keyIdx) || keyValid[keyIdx] === 4 && keyComplete[keyIdx]) {
        statusClass = 'existing-item';
        iconClass = "icon-hdd far";
        tip = "Successfully submitted or pre-existing item; already exists in the database.<br>Click to view this item/dependency in new tab/window.";
        extIcon = /*#__PURE__*/React.createElement("i", {
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
      var icon = /*#__PURE__*/React.createElement("i", {
        className: "icon indicator-icon " + iconClass
      });
      if (keyIdx === currKey) {
        // We're currently on this Item
        isCurrentlySelected = true;
        extIcon = /*#__PURE__*/React.createElement("i", {
          className: "icon icon-pencil pull-right fas",
          "data-tip": "Item which you are currently editing."
        });
      }
      return /*#__PURE__*/React.createElement("div", {
        className: "submission-nav-leaf linked-item-title leaf-depth-" + depth + (isCurrentlySelected ? ' active' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "clearfix inner-title " + statusClass,
        onClick: this.handleClick,
        "data-tip": tip,
        "data-html": true
      }, icon, /*#__PURE__*/React.createElement("span", {
        className: "title-text"
      }, titleText), extIcon), placeholders && placeholders.length > 0 ? /*#__PURE__*/React.createElement("div", {
        className: "list-of-properties"
      }, placeholders) : null);
    }
  }]);
  return SubmissionLeaf;
}(React.PureComponent);
_defineProperty(SubmissionLeaf, "defaultProps", {
  'depth': 0
});
var SubmissionProperty = /*#__PURE__*/function (_React$Component) {
  _inherits(SubmissionProperty, _React$Component);
  var _super3 = _createSuper(SubmissionProperty);
  function SubmissionProperty(props) {
    var _this3;
    _classCallCheck(this, SubmissionProperty);
    _this3 = _super3.call(this, props);
    _this3.handleToggle = _.throttle(_this3.handleToggle.bind(_assertThisInitialized(_this3)), 500, {
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
      if (!isNaN(childKey)) childKey = parseInt(childKey);

      // replace key and hierarchy in props
      return /*#__PURE__*/React.createElement(SubmissionLeaf, _extends({}, this.props, {
        key: childKey,
        keyIdx: childKey,
        hierarchy: hierarchy[keyIdx],
        open: true,
        depth: depth + 1
      }));
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
      var open = this.state.open;

      // Item currently being edited
      var itemSchema = schemas[keyTypes[keyIdx]];
      if (!itemSchema) return null;
      var isRequired = Array.isArray(itemSchema.required) && _.contains(itemSchema.required, field);
      var _field$split = field.split('.'),
        _field$split2 = _slicedToArray(_field$split, 1),
        fieldBase = _field$split2[0];
      var fieldSchema = itemSchema.properties[fieldBase];
      var bookmark = fieldSchema && fieldSchema.title || fieldSchemaLinkToType(fieldSchema);
      var children = _.map(_.filter(_.keys(hierarchy[keyIdx]), function (childKey) {
        return keyLinks[childKey] === field;
      }), this.generateChild);
      var noChildren = children.length === 0;
      return /*#__PURE__*/React.createElement("div", {
        key: bookmark,
        className: "submission-nav-leaf linked-item-type-name leaf-depth-" + depth + (isRequired ? ' is-required' : '') + (!noChildren ? ' has-children' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "clearfix inner-title" + (!noChildren ? ' clickable' : ''),
        onClick: !noChildren ? this.handleToggle : undefined
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon property-expand-icon fas icon-" + (open ? 'minus' : 'plus')
      }), /*#__PURE__*/React.createElement("span", null, children.length, " ", bookmark || field)), !noChildren ? /*#__PURE__*/React.createElement(Collapse, {
        "in": open
      }, /*#__PURE__*/React.createElement("div", {
        className: "children-container"
      }, children)) : null);
    }
  }]);
  return SubmissionProperty;
}(React.Component);
function InfoIcon(_ref2) {
  var children = _ref2.children,
    className = _ref2.className;
  if (!children) return null;
  return /*#__PURE__*/React.createElement("i", {
    style: {
      "marginLeft": "6px",
      'fontSize': '0.8em'
    },
    className: "icon fas icon-info-circle" + (className ? ' ' + className : ''),
    "data-place": "right",
    "data-html": true,
    "data-tip": children
  });
}

/**
 * Function to recursively find whether a schema for a field contains a linkTo to
 * another Item within its nested structure.
 *
 * @param {{ title: string, type: string, linkTo: string }} json - A schema for a field.
 * @param {boolean} [getProperty=false] - Unused? What is this supposed to do?
 * @returns {string|null} The `@type` of the linkTo Item referenced in the field schema, if any, else null.
 */
export function fieldSchemaLinkToType(json) {
  arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var currKeys = _.keys(json),
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
export function fieldSchemaLinkToPath(json) {
  var jsonKeys = _.keys(json),
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