'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValueNull = isValueNull;
exports.AliasInputFieldValidated = exports.AliasInputField = exports.BuildField = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _reactBootstrap = require("react-bootstrap");

var _Fade = _interopRequireDefault(require("react-bootstrap/esm/Fade"));

var _Checkbox = require("./Checkbox");

var _util = require("./../../util");

var _BasicStaticSectionBody = require("./../../static-pages/BasicStaticSectionBody");

var _rcProgress = require("rc-progress");

var _SearchAsYouTypeLocal = require("./SearchAsYouTypeLocal");

var _SearchAsYouTypeAjax = require("./SearchAsYouTypeAjax");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

/**
 * Individual component for each type of field. Contains the appropriate input
 * if it is a simple number/text/enum, or generates a child component for
 * attachment, linked object, array, object, and file fields. Contains delete
 * logic for the field as well (deleting is done by setting value to null).
 *
 * @todo Possibly rename both this class and the containing file to be `SubmissionViewField` or `SubmissionField`.
 */
var BuildField = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(BuildField, _React$PureComponent);

  var _super = _createSuper(BuildField);

  _createClass(BuildField, null, [{
    key: "fieldTypeFromFieldSchema",

    /**
     * Gets the (interal) field type from a schema for a field.
     * Possible return values include 'attachment', 'linked object', 'enum', 'text', 'html', 'code', 'boolean', 'number', 'integer', etc.
     *
     * @todo Handle date formats, other things, etc.
     *
     * @param {{ 'type' : string }} fieldSchema - Schema definition for this property. Should be same as `app.state.schemas[CurrentItemType].properties[currentField]`.
     * @returns {string} Type of field that will be created, according to schema.
     */
    value: function fieldTypeFromFieldSchema(fieldSchema) {
      var fieldType = fieldSchema.type ? fieldSchema.type : "text"; // transform some types...

      if (fieldType === 'string') {
        fieldType = 'text';

        if (typeof fieldSchema.formInput === 'string') {
          if (['textarea', 'html', 'code'].indexOf(fieldSchema.formInput) > -1) {
            return fieldSchema.formInput;
          }
        }
      } // check if this is an enum


      if (Array.isArray(fieldSchema["enum"])) {
        // not sure why this is here if suggested_enum doesn't even appear when is a field with that type
        fieldType = 'enum';
      }

      if (Array.isArray(fieldSchema.suggested_enum)) {
        fieldType = "suggested_enum";
      } // handle a linkTo object on the the top level


      if (fieldSchema.linkTo) {
        fieldType = 'linked object';
      } else if (fieldSchema.attachment && fieldSchema.attachment === true) {
        fieldType = 'attachment';
      }

      return fieldType;
    }
  }]);

  function BuildField(props) {
    var _this;

    _classCallCheck(this, BuildField);

    _this = _super.call(this, props);

    _underscore["default"].bindAll(_assertThisInitialized(_this), 'displayField', 'handleDropdownButtonToggle', 'handleAliasChange', 'handleEnumChange', 'buildSuggestedEnumEntry', 'submitSuggestedEnumVal', 'handleChange', 'handleAliasChange', 'deleteField', 'pushArrayValue', 'commonRowProps', 'labelTypeDescriptor', 'wrapWithLabel', 'wrapWithNoLabel');

    _this.state = {
      'dropdownOpen': false
    };
    _this.inputElementRef = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }

  _createClass(BuildField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _reactTooltip["default"].rebuild();
    }
  }, {
    key: "handleDropdownButtonToggle",
    value: function handleDropdownButtonToggle(isOpen) {
      this.setState(function (_ref) {
        var dropdownOpen = _ref.dropdownOpen;
        if (isOpen === dropdownOpen) return null;
        return {
          'dropdownOpen': isOpen
        };
      });
    }
    /**
     * Renders out an input field (or more fields of itself via more advanced input field component, e.g. for arrays).
     *
     * @param {string} [fieldType=this.props.fieldType] Type of input field to render, if different from `props.fieldType`.
     * @returns {JSX.Element} A JSX `<input>` element, a Bootstrap input element component, or custom React component which will render input fields.
     */

  }, {
    key: "displayField",
    value: function displayField(fieldType) {
      var _this$props = this.props,
          field = _this$props.field,
          value = _this$props.value,
          disabled = _this$props.disabled,
          enumValues = _this$props.enumValues,
          currentSubmittingUser = _this$props.currentSubmittingUser,
          roundTwo = _this$props.roundTwo,
          currType = _this$props.currType,
          currContext = _this$props.currContext,
          keyDisplay = _this$props.keyDisplay,
          selectComplete = _this$props.selectComplete,
          propFieldType = _this$props.fieldType;
      fieldType = fieldType || propFieldType;
      var inputProps = {
        'key': field,
        'id': 'field_for_' + field,
        'disabled': disabled || false,
        'ref': this.inputElementRef,
        'value': typeof value === 'number' ? value || 0 : value || '',
        'onChange': this.handleChange,
        'name': field,
        'placeholder': "No value",
        'data-field-type': fieldType
      }; // Unique per-type overrides

      if (currType === 'StaticSection' && field === 'body') {
        // Static section preview
        var filetype = currContext && currContext.options && currContext.options.filetype;

        if (filetype === 'md' || filetype === 'html') {
          return /*#__PURE__*/_react["default"].createElement(PreviewField, _extends({}, this.props, {
            filetype: filetype,
            fieldType: fieldType
          }, {
            onChange: this.handleChange
          }));
        }
      } // Common field types


      switch (fieldType) {
        case 'text':
          if (field === 'aliases') {
            return /*#__PURE__*/_react["default"].createElement("div", {
              className: "input-wrapper"
            }, /*#__PURE__*/_react["default"].createElement(AliasInputField, _extends({}, inputProps, {
              onAliasChange: this.handleAliasChange,
              currentSubmittingUser: currentSubmittingUser
            })));
          }

          return /*#__PURE__*/_react["default"].createElement("input", _extends({}, inputProps, {
            type: "text",
            className: "form-control",
            inputMode: "latin"
          }));

        case 'textarea':
          return /*#__PURE__*/_react["default"].createElement("textarea", _extends({}, inputProps, {
            type: "text",
            inputMode: "latin",
            rows: 4,
            className: "form-control mb-08 mt-08"
          }));

        case 'html':
        case 'code':
          return /*#__PURE__*/_react["default"].createElement("textarea", _extends({}, inputProps, {
            type: "text",
            inputMode: "latin",
            rows: 8,
            wrap: "off",
            className: "form-control text-small mb-08 mt-08",
            style: {
              'fontFamily': "Source Code Pro, monospace",
              'fontSize': 'small'
            }
          }));

        case 'integer':
          return /*#__PURE__*/_react["default"].createElement(_reactBootstrap.FormControl, _extends({
            type: "number"
          }, inputProps, {
            step: 1
          }));

        case 'number':
          return /*#__PURE__*/_react["default"].createElement(_reactBootstrap.FormControl, _extends({
            type: "number"
          }, inputProps));

        case 'boolean':
          return /*#__PURE__*/_react["default"].createElement(_Checkbox.Checkbox, _extends({}, _underscore["default"].omit(inputProps, 'value', 'placeholder'), {
            checked: !!value
          }), /*#__PURE__*/_react["default"].createElement("span", {
            style: {
              'verticalAlign': 'middle',
              'textTransform': 'capitalize'
            }
          }, typeof value === 'boolean' ? value + '' : null));

        case 'enum':
          return /*#__PURE__*/_react["default"].createElement("span", {
            className: "input-wrapper"
          }, /*#__PURE__*/_react["default"].createElement(_SearchAsYouTypeLocal.SearchAsYouTypeLocal, {
            searchList: enumValues,
            value: value,
            allowCustomValue: false,
            filterMethod: "includes",
            onChange: this.handleEnumChange,
            maxResults: 3
          }));

        case 'suggested_enum':
          return /*#__PURE__*/_react["default"].createElement("span", {
            className: "input-wrapper"
          }, /*#__PURE__*/_react["default"].createElement(_SearchAsYouTypeLocal.SearchAsYouTypeLocal, {
            searchList: enumValues,
            value: value,
            allowCustomValue: true,
            filterMethod: "includes",
            onChange: this.handleEnumChange,
            maxResults: 3
          }));

        case 'linked object':
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "input-wrapper"
          }, /*#__PURE__*/_react["default"].createElement(_SearchAsYouTypeAjax.SubmissionViewSearchAsYouTypeAjax, _extends({
            value: value,
            allowCustomValue: false
          }, this.props, {
            idToTitleMap: keyDisplay
          })));

        case 'array':
          return /*#__PURE__*/_react["default"].createElement(ArrayField, _extends({}, this.props, {
            pushArrayValue: this.pushArrayValue,
            value: value || null,
            roundTwo: roundTwo
          }));

        case 'object':
          return /*#__PURE__*/_react["default"].createElement(ObjectField, this.props);

        case 'attachment':
          return /*#__PURE__*/_react["default"].createElement("div", {
            style: {
              'display': 'inline'
            }
          }, /*#__PURE__*/_react["default"].createElement(AttachmentInput, this.props));

        case 'file upload':
          return /*#__PURE__*/_react["default"].createElement(S3FileInput, this.props);
      } // Fallback


      return /*#__PURE__*/_react["default"].createElement("div", null, "No field for this case yet.");
    }
  }, {
    key: "buildSuggestedEnumEntry",
    value: function buildSuggestedEnumEntry(val) {
      return /*#__PURE__*/_react["default"].createElement(_reactBootstrap.DropdownItem, {
        key: val,
        title: val || '',
        eventKey: val,
        onSelect: this.submitSuggestedEnumVal
      }, val || '');
    }
  }, {
    key: "submitSuggestedEnumVal",
    value: function submitSuggestedEnumVal(eventKey) {
      var _this$props2 = this.props,
          modifyNewContext = _this$props2.modifyNewContext,
          nestedField = _this$props2.nestedField,
          fieldType = _this$props2.fieldType,
          linkType = _this$props2.linkType,
          arrayIdx = _this$props2.arrayIdx,
          schema = _this$props2.schema; //eventKey's type is always string, convert it to the proper type defined in schema

      var value = eventKey;

      if (schema && schema.type && typeof schema.type === 'string') {
        if (schema.type === 'integer') {
          value = parseInt(eventKey);
        } else if (schema.type === 'float') {
          value = parseFloat(eventKey);
        } else if (schema.type === 'number') {
          value = Number(eventKey);
        } else if (schema.type === 'boolean') {
          value = eventKey === 'true';
        }
      }

      modifyNewContext(nestedField, value, fieldType, linkType, arrayIdx);
    }
  }, {
    key: "handleDropdownLinkToChange",
    value: function handleDropdownLinkToChange(resultItem) {
      modifyNewContext(nestedField, resultItem['@id'], fieldType, linkType, arrayIdx, null, resultItem.display_title);
    }
  }, {
    key: "handleEnumChange",
    value: function handleEnumChange(eventKey) {
      var _this$props3 = this.props,
          modifyNewContext = _this$props3.modifyNewContext,
          nestedField = _this$props3.nestedField,
          fieldType = _this$props3.fieldType,
          linkType = _this$props3.linkType,
          arrayIdx = _this$props3.arrayIdx,
          schema = _this$props3.schema; //eventKey's type is always string, convert it to the proper type defined in schema

      var value = eventKey;

      if (schema && schema.type && typeof schema.type === 'string') {
        if (schema.type === 'integer') {
          value = parseInt(eventKey);
        } else if (schema.type === 'float') {
          value = parseFloat(eventKey);
        } else if (schema.type === 'number') {
          value = Number(eventKey);
        } else if (schema.type === 'boolean') {
          value = eventKey === 'true';
        }
      }

      modifyNewContext(nestedField, value, fieldType, linkType, arrayIdx);
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var _this$props4 = this.props,
          fieldType = _this$props4.fieldType,
          modifyNewContext = _this$props4.modifyNewContext,
          nestedField = _this$props4.nestedField,
          linkType = _this$props4.linkType,
          arrayIdx = _this$props4.arrayIdx;
      var inputElement = e && e.target ? e.target : this.inputElementRef.current;
      var currValue = inputElement.value;

      if (fieldType === 'boolean') {
        currValue = inputElement.checked;
      } else if (fieldType === 'integer') {
        currValue = parseInt(currValue);

        if (isNaN(currValue)) {
          currValue = null;
        }
      } else if (fieldType === 'number') {
        currValue = parseFloat(currValue);

        if (isNaN(currValue)) {
          currValue = null;
        }
      } //console.log('VAL', this.props.nestedField, currValue, this.props.fieldType, this.props.value, this.props.arrayIdx);


      modifyNewContext(nestedField, currValue, fieldType, linkType, arrayIdx);
    }
  }, {
    key: "handleAliasChange",
    value: function handleAliasChange(currValue) {
      var _this$props5 = this.props,
          fieldType = _this$props5.fieldType,
          modifyNewContext = _this$props5.modifyNewContext,
          nestedField = _this$props5.nestedField,
          linkType = _this$props5.linkType,
          arrayIdx = _this$props5.arrayIdx;
      modifyNewContext(nestedField, currValue, fieldType, linkType, arrayIdx);
    } // call modifyNewContext from parent to delete the value in the field

  }, {
    key: "deleteField",
    value: function deleteField(e) {
      var _this$props6 = this.props,
          fieldType = _this$props6.fieldType,
          modifyNewContext = _this$props6.modifyNewContext,
          nestedField = _this$props6.nestedField,
          linkType = _this$props6.linkType,
          arrayIdx = _this$props6.arrayIdx;
      e.preventDefault();
      modifyNewContext(nestedField, null, fieldType, linkType, arrayIdx);
    } // this needs to live in BuildField for styling purposes

  }, {
    key: "pushArrayValue",
    value: function pushArrayValue(e) {
      var _this$props7 = this.props,
          fieldType = _this$props7.fieldType,
          value = _this$props7.value,
          schema = _this$props7.schema,
          modifyNewContext = _this$props7.modifyNewContext,
          nestedField = _this$props7.nestedField,
          linkType = _this$props7.linkType,
          arrayIdx = _this$props7.arrayIdx;
      e && e.preventDefault();

      if (fieldType !== 'array') {
        return;
      }

      var valueCopy = value ? value.slice() : [];

      if (schema.items && schema.items.type === 'object') {
        // initialize with empty obj in only this case
        valueCopy.push({});
      } else {
        valueCopy.push(null);
      }

      modifyNewContext(nestedField, valueCopy, fieldType, linkType, arrayIdx);
    }
    /**
     * Returns an object representing `props` which would be common to any type of input field
     * element which this component renders.
     *
     * @returns {{ 'className': string, 'data-field-type': string, 'data-field-name': string, 'style': Object.<string|number> }} Object of props and values.
     */

  }, {
    key: "commonRowProps",
    value: function commonRowProps() {
      var _this$props8 = this.props,
          isArray = _this$props8.isArray,
          fieldType = _this$props8.fieldType,
          field = _this$props8.field;
      var dropdownOpen = this.state.dropdownOpen;
      return {
        'className': "field-row" + (dropdownOpen ? ' active-submission-row' : '') + (isArray ? ' in-array-field clearfix row' : ''),
        'data-field-type': fieldType,
        'data-field-name': field,
        'style': {
          'overflow': 'visible'
        }
      };
    }
    /**
     * Returns a `<div>` JSX element with 'Required' label/text, if `props.required` is true or truthy.
     */

  }, {
    key: "labelTypeDescriptor",
    value: function labelTypeDescriptor() {
      var required = this.props.required;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "field-descriptor"
      }, required ? /*#__PURE__*/_react["default"].createElement("span", {
        style: {
          'color': '#a94442'
        }
      }, " Required") : null);
    }
    /** @ignore */

  }, {
    key: "wrapWithLabel",
    value: function wrapWithLabel() {
      var _this$props9 = this.props,
          fieldTip = _this$props9.fieldTip,
          title = _this$props9.title,
          fieldType = _this$props9.fieldType,
          schema = _this$props9.schema;
      return /*#__PURE__*/_react["default"].createElement("div", this.commonRowProps(), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-12 col-md-4"
      }, /*#__PURE__*/_react["default"].createElement("h5", {
        className: "submission-field-title text-truncate"
      }, this.labelTypeDescriptor(), fieldTip ? /*#__PURE__*/_react["default"].createElement(InfoIcon, {
        className: "mr-07",
        title: title,
        fieldType: fieldType,
        schema: schema
      }, fieldTip) : null, /*#__PURE__*/_react["default"].createElement("span", null, title))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-12 col-md-8"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row field-container"
      }, Array.prototype.slice.call(arguments)))));
    }
    /** @ignore */

  }, {
    key: "wrapWithNoLabel",
    value: function wrapWithNoLabel() {
      return /*#__PURE__*/_react["default"].createElement("div", this.commonRowProps(), Array.prototype.slice.call(arguments));
    }
    /**
     * Renders out input for this field. Performs this recursively (through adding own component down in render tree)
     * if necessary re: data structure.
     *
     * @todo Come up with a schema based solution for code below?
     * @private
     * @returns {JSX.Element} Appropriate element/markup for this field.
     */

  }, {
    key: "render",
    value: function render() {
      var _this$props10 = this.props,
          value = _this$props10.value,
          isArray = _this$props10.isArray,
          field = _this$props10.field,
          fieldType = _this$props10.fieldType,
          arrayIdx = _this$props10.arrayIdx,
          isLastItemInArray = _this$props10.isLastItemInArray,
          fieldBeingSelected = _this$props10.fieldBeingSelected,
          nestedField = _this$props10.nestedField,
          fieldBeingSelectedArrayIdx = _this$props10.fieldBeingSelectedArrayIdx;
      // hardcoded fields you can't delete
      var showDelete = false;
      var disableDelete = false;
      var extClass = ''; // Don't show delete button unless:
      // not in hardcoded cannot delete list AND is not an object or
      // non-empty array element (individual values get deleted)

      if (!_underscore["default"].contains(['filename'], field) && fieldType !== 'array') {
        showDelete = true;
      } // if there is no value in the field and non-array, hide delete button


      if (isValueNull(value) && !isArray) {
        showDelete = false;
      }

      var wrapFunc = this.wrapWithLabel;
      // In case we render our own w/ dif functionality lower down.
      var fieldToDisplay = this.displayField(fieldType); // The rendered field.

      if (isArray) {
        // array items don't need fieldnames/tooltips
        wrapFunc = this.wrapWithNoLabel;

        if (isLastItemInArray && isValueNull(value)) {
          showDelete = false;

          if (Array.isArray(arrayIdx) && arrayIdx[0] !== 0) {
            extClass += " last-item-empty";
          }
        } else if (fieldType === 'object') {
          // if we've got an object that's inside inside an array, only allow
          // the array to be deleted if ALL individual fields are null
          if (!isValueNull(value)) {
            disableDelete = true;
          } //var valueCopy = this.props.value ? JSON.parse(JSON.stringify(this.props.value)) : {};
          //var nullItems = _.filter( _.keys(valueCopy), isValueNull);
          //if( _.keys(valueCopy).length !== nullItems.length){
          //    showDelete = false;
          //}

        }
      } else if (fieldType === 'object') {
        showDelete = false;
      }

      if (fieldType === 'linked object' && _SearchAsYouTypeAjax.LinkedObj.isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx)) {
        extClass += ' in-selection-field';
      }

      return wrapFunc( /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: 'field-column col' + extClass
      }, fieldToDisplay), fieldType === 'array' || fieldType === 'file upload' ? null : /*#__PURE__*/_react["default"].createElement(_SearchAsYouTypeAjax.SquareButton, {
        show: showDelete,
        disabled: disableDelete,
        tip: isArray ? 'Remove Item' : 'Clear Value',
        onClick: this.deleteField
      })));
    }
  }]);

  return BuildField;
}(_react["default"].PureComponent); //var linkedObjChildWindow = null; // Global var


exports.BuildField = BuildField;

var PreviewField = /*#__PURE__*/_react["default"].memo(function (props) {
  var value = props.value,
      filetype = props.filetype,
      field = props.field,
      onChange = props.onChange;

  var preview = value && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("h6", {
    className: "mt-1 text-600"
  }, "Preview:"), /*#__PURE__*/_react["default"].createElement("hr", {
    className: "mb-1 mt-05"
  }), /*#__PURE__*/_react["default"].createElement(_BasicStaticSectionBody.BasicStaticSectionBody, {
    content: value || '',
    filetype: filetype
  }));

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "preview-field-container mt-08 mb-08"
  }, /*#__PURE__*/_react["default"].createElement(_reactBootstrap.FormControl, {
    onChange: onChange,
    id: "field_for_" + field,
    name: field,
    value: value,
    type: "text",
    inputMode: "latin",
    as: "textarea",
    rows: 8,
    wrap: "off",
    style: {
      'fontFamily': "Source Code Pro, monospace",
      'fontSize': 'small'
    }
  }), preview);
});
/**
 * Display fields that are arrays. To do this, make a BuildField for each
 * object in the value and use a custom render method. initiateArrayField is
 * unique to ArrayField, since it needs to update the arrayIdx
 */


var ArrayField = /*#__PURE__*/function (_React$Component) {
  _inherits(ArrayField, _React$Component);

  var _super2 = _createSuper(ArrayField);

  _createClass(ArrayField, null, [{
    key: "typeOfItems",
    value: function typeOfItems(itemSchema) {
      var fieldType = itemSchema.type ? itemSchema.type : "text"; // transform some types...

      if (fieldType === 'string') {
        fieldType = 'text';
      } // check if this is an enum


      if (itemSchema["enum"]) {
        fieldType = 'enum';
      }

      if (itemSchema.suggested_enum) {
        fieldType = 'suggested_enum';
      } // handle a linkTo object on the the top level


      if (itemSchema.linkTo) {
        fieldType = 'linked object';
      }

      return fieldType;
    }
  }, {
    key: "shouldPushArrayValue",
    value: function shouldPushArrayValue(currentArr) {
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!currentArr || Array.isArray(currentArr) && (currentArr.length === 0 || !isValueNull(currentArr[currentArr.length - 1]))) {
        return true;
      }

      return false;
    }
  }]);

  function ArrayField(props) {
    var _this2;

    _classCallCheck(this, ArrayField);

    _this2 = _super2.call(this, props);

    _underscore["default"].bindAll(_assertThisInitialized(_this2), 'initiateArrayField', 'generateAddButton');

    return _this2;
  }
  /**
   * If empty array, add initial 'null' element. On Mount & Update.
   */


  _createClass(ArrayField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props11 = this.props,
          value = _this$props11.value,
          field = _this$props11.field,
          pushArrayValue = _this$props11.pushArrayValue;

      if (ArrayField.shouldPushArrayValue(value, field)) {
        pushArrayValue();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // We can't do a comparison of props.value here because parent property mutates yet stays part of same obj.
      var _this$props12 = this.props,
          value = _this$props12.value,
          field = _this$props12.field,
          pushArrayValue = _this$props12.pushArrayValue,
          modifyNewContext = _this$props12.modifyNewContext,
          nestedField = _this$props12.nestedField,
          schema = _this$props12.schema,
          linkType = _this$props12.linkType;

      if (ArrayField.shouldPushArrayValue(value, field)) {
        pushArrayValue();
      } else {
        if (Array.isArray(value) && value.length >= 2) {
          if (isValueNull(value[value.length - 1]) && isValueNull(value[value.length - 2])) {
            modifyNewContext(nestedField, null, ArrayField.typeOfItems(schema.items || {}), linkType, [value.length - 2]);
          }
        }
      }
    }
  }, {
    key: "initiateArrayField",
    value: function initiateArrayField(arrayInfo, index, allItems) {
      var _this$props13 = this.props,
          propArrayIdx = _this$props13.arrayIdx,
          schema = _this$props13.schema; // use arrayIdx as stand-in value for field

      var _arrayInfo = _slicedToArray(arrayInfo, 3),
          inArrValue = _arrayInfo[0],
          fieldSchema = _arrayInfo[1],
          arrayIdx = _arrayInfo[2];

      var fieldTip = fieldSchema.description || null;

      if (fieldSchema.comment) {
        fieldTip = fieldTip ? fieldTip + ' ' + fieldSchema.comment : fieldSchema.comment;
      }

      var title = fieldSchema.title || 'Item';
      var fieldType = ArrayField.typeOfItems(fieldSchema);
      var enumValues = fieldSchema["enum"] || fieldSchema.suggested_enum || []; // check if this is an enum

      var arrayIdxList;

      if (propArrayIdx) {
        arrayIdxList = propArrayIdx.slice();
      } else {
        arrayIdxList = [];
      }

      arrayIdxList.push(arrayIdx);

      var childFieldSchema = _underscore["default"].extend({}, fieldSchema, {
        'parentSchema': schema
      });

      return /*#__PURE__*/_react["default"].createElement("div", {
        key: arrayIdx,
        className: "array-field-container " + (arrayIdx % 2 === 0 ? 'even' : 'odd'),
        "data-field-type": fieldType
      }, /*#__PURE__*/_react["default"].createElement(BuildField, _extends({
        value: inArrValue || null,
        fieldTip: fieldTip,
        fieldType: fieldType,
        title: title,
        enumValues: enumValues
      }, _underscore["default"].pick(this.props, 'field', 'modifyNewContext', 'linkType', 'selectObj', 'selectComplete', 'selectCancel', 'nestedField', 'keyDisplay', 'keyComplete', 'setSubmissionState', 'fieldBeingSelected', 'fieldBeingSelectedArrayIdx', 'updateUpload', 'upload', 'uploadStatus', 'md5Progress', 'currentSubmittingUser', 'roundTwo', 'currType'), {
        isArray: true,
        isLastItemInArray: allItems.length - 1 === index,
        arrayIdx: arrayIdxList,
        schema: childFieldSchema,
        disabled: false,
        required: false,
        key: arrayIdx,
        isMultiSelect: true
      })));
    }
  }, {
    key: "generateAddButton",
    value: function generateAddButton() {
      var _this$props14 = this.props,
          _this$props14$value = _this$props14.value,
          values = _this$props14$value === void 0 ? [] : _this$props14$value,
          pushArrayValue = _this$props14.pushArrayValue;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "add-array-item-button-container"
      }, /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        className: "btn btn-outline-dark btn-" + (values.length > 0 ? "sm" : "md"),
        onClick: pushArrayValue
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw fas icon-plus"
      }), " Add"));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props15 = this.props,
          propSchema = _this$props15.schema,
          propValue = _this$props15.value;
      var schema = propSchema.items || {};
      var values = propValue || [];

      var valuesToRender = _underscore["default"].map(values.length === 0 ? [null] : values, function (v, i) {
        return [v, schema, i];
      });

      var showAddButton = !isValueNull(values[valuesToRender.length - 1]);
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "list-of-array-items"
      }, valuesToRender.map(this.initiateArrayField), showAddButton ? this.generateAddButton() : null);
    }
  }]);

  return ArrayField;
}(_react["default"].Component);
/**
 * Builds a field that represents a sub-object. Essentially serves to hold
 * and coordinate BuildFields that correspond to the fields within the subfield.
 */


var ObjectField = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(ObjectField, _React$PureComponent2);

  var _super3 = _createSuper(ObjectField);

  function ObjectField() {
    var _this3;

    _classCallCheck(this, ObjectField);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this3 = _super3.call.apply(_super3, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this3), "includeField", function (schema, field) {
      if (!schema) return null;

      var schemaVal = _util.object.getNestedProperty(schema, ['properties', field], true);

      if (!schemaVal) return null; // check to see if this field should be excluded based on exclude_from status

      if (schemaVal.exclude_from && (_underscore["default"].contains(schemaVal.exclude_from, 'FFedit-create') || schemaVal.exclude_from == 'FFedit-create')) {
        return null;
      }

      if (schemaVal.exclude_from && (_underscore["default"].contains(schemaVal.exclude_from, 'FF-calculate') || schemaVal.exclude_from == 'FF-calculate')) {
        return null;
      } // check to see if this field is a calculated val


      if (schemaVal.calculatedProperty && schemaVal.calculatedProperty === true) {
        return null;
      } // check to see if permission == import items


      if (schemaVal.permission && schemaVal.permission == "import_items") {
        return null;
      }

      return schemaVal;
    });

    return _this3;
  }

  _createClass(ObjectField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props16 = this.props,
          value = _this$props16.value,
          modifyNewContext = _this$props16.modifyNewContext,
          nestedField = _this$props16.nestedField,
          linkType = _this$props16.linkType,
          arrayIdx = _this$props16.arrayIdx; // initialize with empty dictionary

      modifyNewContext(nestedField, value || {}, 'object', linkType, arrayIdx);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var parentObject = this.props.value;

      if (pastProps.value !== parentObject) {
        _util.console.log('CHANGED', pastProps.value, parentObject);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props17 = this.props,
          objectSchema = _this$props17.schema,
          parentObject = _this$props17.value,
          propNestedField = _this$props17.nestedField,
          isMultiSelect = _this$props17.isMultiSelect;
      var allFieldsInSchema = objectSchema['properties'] ? _underscore["default"].keys(objectSchema['properties']) : [];

      var fieldsToBuild = _underscore["default"].filter(_underscore["default"].map(allFieldsInSchema, function (f) {
        // List of [field, fieldSchema] pairs.
        var fieldSchemaToUseOrNull = _this4.includeField(objectSchema, f);

        return fieldSchemaToUseOrNull && [f, fieldSchemaToUseOrNull] || null;
      }));

      var passProps = _underscore["default"].pick(this.props, 'modifyNewContext', 'linkType', 'setSubmissionState', 'selectObj', 'selectComplete', 'selectCancel', 'arrayIdx', 'keyDisplay', 'keyComplete', 'currType', 'updateUpload', 'upload', 'uploadStatus', 'md5Progress', 'fieldBeingSelected', 'fieldBeingSelectedArrayIdx');

      var builtFields = fieldsToBuild.map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            field = _ref3[0],
            fieldSchema = _ref3[1];

        var fieldTip = fieldSchema.description ? fieldSchema.description : null;

        if (fieldSchema.comment) {
          fieldTip = fieldTip ? fieldTip + ' ' + fieldSchema.comment : fieldSchema.comment;
        }

        var fieldType = BuildField.fieldTypeFromFieldSchema(fieldSchema);
        var title = fieldSchema.title || field;
        var fieldValue;

        if (parentObject) {
          fieldValue = parentObject[field];
        } else {
          fieldValue = null;
        }

        var enumValues = []; // check if this is an enum

        if (fieldType === 'enum') {
          enumValues = fieldSchema["enum"] || [];
        } else if (fieldType === "suggested_enum") {
          enumValues = fieldSchema.suggested_enum || [];
        } // format field as <this_field>.<next_field> so top level modification
        // happens correctly


        return /*#__PURE__*/_react["default"].createElement(BuildField, _extends({}, passProps, {
          field: field,
          fieldType: fieldType,
          fieldTip: fieldTip,
          enumValues: enumValues,
          nestedField: propNestedField + '.' + field,
          title: title
        }, {
          value: fieldValue,
          key: field,
          schema: fieldSchema,
          disabled: false,
          required: false,
          isArray: false,
          isMultiSelect: isMultiSelect || false
        }));
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "object-field-container"
      }, builtFields);
    }
  }]);

  return ObjectField;
}(_react["default"].PureComponent);
/**
 * For version 1. A simple local file upload that gets the name, type,
 * size, and b64 encoded stream in the form of a data url. Upon successful
 * upload, adds this information to NewContext
 */


var AttachmentInput = /*#__PURE__*/function (_React$Component2) {
  _inherits(AttachmentInput, _React$Component2);

  var _super4 = _createSuper(AttachmentInput);

  function AttachmentInput(props) {
    var _this5;

    _classCallCheck(this, AttachmentInput);

    _this5 = _super4.call(this, props);
    _this5.handleChange = _this5.handleChange.bind(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(AttachmentInput, [{
    key: "acceptedTypes",
    value: function acceptedTypes() {
      var schema = this.props.schema; // hardcoded back-up

      var types = _util.object.getNestedProperty(schema, ['properties', 'type', 'enum'], true);

      if (!types) {
        // generic backup types
        types = ["application/pdf", "application/zip", "application/msword", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "text/tab-separated-values", "image/jpeg", "image/tiff", "image/gif", "text/html", "image/png", "image/svs", "text/autosql"];
      }

      return types.toString();
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var attachment_props = {};
      var file = e.target.files[0];

      if (!file) {
        this.props.modifyNewContext(this.props.nestedField, null, 'attachment', this.props.linkType, this.props.arrayIdx);
        return;
      }

      attachment_props.type = file.type;

      if (file.size) {
        attachment_props.size = file.size;
      }

      if (file.name) {
        attachment_props.download = file.name;
      }

      var fileReader = new window.FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onloadend = function (e) {
        if (e.target.result) {
          attachment_props.href = e.target.result;
        } else {
          alert('There was a problem reading the given file.');
        }
      }.bind(this);

      this.props.modifyNewContext(this.props.nestedField, attachment_props, 'attachment', this.props.linkType, this.props.arrayIdx);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props18 = this.props,
          value = _this$props18.value,
          field = _this$props18.field;
      var attach_title;

      if (value && value.download) {
        attach_title = value.download;
      } else {
        attach_title = "No file chosen";
      }

      // Is type=submit below correct?
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          'display': 'inherit'
        }
      }, /*#__PURE__*/_react["default"].createElement("input", {
        id: "field_for_" + field,
        type: "file",
        onChange: this.handleChange,
        style: {
          'display': 'none'
        },
        accept: this.acceptedTypes()
      }), /*#__PURE__*/_react["default"].createElement("button", {
        type: "submit",
        className: "btn btn-outline-dark"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "text-400 mb-0",
        htmlFor: "field_for_" + field,
        style: {
          'paddingRight': '5px',
          'paddingLeft': '5px'
        }
      }, attach_title)));
    }
  }]);

  return AttachmentInput;
}(_react["default"].Component);
/**
 * Input for an s3 file upload. Context value set is local value of the filename.
 * Also updates this.state.file for the overall component. Runs file uploads
 * async using the upload_manager passed down in props.
 */


var S3FileInput = /*#__PURE__*/function (_React$Component3) {
  _inherits(S3FileInput, _React$Component3);

  var _super5 = _createSuper(S3FileInput);

  function S3FileInput(props) {
    var _this6;

    _classCallCheck(this, S3FileInput);

    _this6 = _super5.call(this, props);

    _underscore["default"].bindAll(_assertThisInitialized(_this6), 'modifyFile', 'handleChange', 'handleAsyncUpload', 'modifyRunningUploads', 'cancelUpload', 'deleteField');

    _this6.state = {
      'percentDone': null,
      'sizeUploaded': null,
      'newFile': false,
      'status': null
    };
    return _this6;
  }

  _createClass(S3FileInput, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var _this$props19 = this.props,
          upload = _this$props19.upload,
          uploadStatus = _this$props19.uploadStatus; // todo: rename upload to uploadManager?

      var pastUpload = pastProps.upload,
          pastUploadStatus = pastProps.uploadStatus;

      if (upload !== null && pastUpload === null) {
        this.handleAsyncUpload(upload);
      }

      if (uploadStatus !== pastUploadStatus) {
        this.setState({
          'status': uploadStatus
        });
      }
    }
  }, {
    key: "modifyFile",
    value: function modifyFile(val) {
      this.props.setSubmissionState('file', val);

      if (val !== null) {
        this.setState({
          'newFile': true,
          'status': null
        });
      } else {
        this.setState({
          'newFile': false,
          'status': null
        });
      }
    }
    /**
     * Handle file selection. Store the file in SubmissionView state and change
     * the filename context using modifyNewContext
     */

  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var _this7 = this;

      var _this$props20 = this.props,
          modifyNewContext = _this$props20.modifyNewContext,
          nestedField = _this$props20.nestedField,
          linkType = _this$props20.linkType,
          arrayIdx = _this$props20.arrayIdx,
          currContext = _this$props20.currContext;
      var file = e.target.files[0];
      if (!file) return; // No file was chosen.

      var filename = file.name ? file.name : "unknown"; // check Extensions

      var fileFormat = currContext.file_format;

      if (!fileFormat.startsWith('/')) {
        fileFormat = '/' + fileFormat;
      }

      var extensions = [];

      _util.ajax.promise(fileFormat + '?frame=object').then(function (response) {
        if (response['file_format'] && response['@id']) {
          extensions = response.standard_file_extension ? [response.standard_file_extension] : [];

          if (response.other_allowed_extensions) {
            extensions = extensions.concat(response.other_allowed_extensions);
          } // Fail if "other" extension is not used and a valid extension is not provided


          if (extensions.indexOf("other") === -1 && !_underscore["default"].any(extensions, function (ext) {
            return filename.endsWith(ext);
          })) {
            alert('File extension error! Please enter a file with one of the following extensions: ' + extensions.join(', '));
            return;
          }

          modifyNewContext(nestedField, filename, 'file upload', linkType, arrayIdx); // calling modifyFile changes the 'file' state of top level component

          _this7.modifyFile(file);
        } else {
          alert('Internal file extension conflict.');
        }
      });
    }
    /**
     * Handle the async file upload which is coordinated by the file_manager held
     * in this.props.upload. Call this.props.updateUpload on failure or completion.
     */

  }, {
    key: "handleAsyncUpload",
    value: function handleAsyncUpload(upload_manager) {
      var _this8 = this;

      if (upload_manager === null) {
        return;
      }

      upload_manager.on('httpUploadProgress', function (evt) {
        var percentage = Math.round(evt.loaded * 100 / evt.total);

        _this8.modifyRunningUploads(percentage, evt.total);
      }).send(function (err) {
        if (err) {
          _this8.modifyRunningUploads(null, null);

          _this8.props.updateUpload(null, false, true);

          alert("File upload failed!");
        } else {
          _this8.modifyRunningUploads(null, null); // this will finish roundTwo for the file


          _this8.props.updateUpload(null, true);
        }
      });
    }
    /*
    Set state to reflect new upload percentage and size complete for the given upload
    */

  }, {
    key: "modifyRunningUploads",
    value: function modifyRunningUploads(percentage, size) {
      this.setState({
        'percentDone': percentage,
        'sizeUploaded': size
      });
    }
  }, {
    key: "cancelUpload",
    value: function cancelUpload(e) {
      e.preventDefault();

      if (this.state.percentDone === null || this.props.upload === null) {
        return;
      }

      this.props.upload.abort();
    }
  }, {
    key: "deleteField",
    value: function deleteField(e) {
      e.preventDefault();
      this.props.modifyNewContext(this.props.nestedField, null, 'file upload', this.props.linkType, this.props.arrayIdx);
      this.modifyFile(null);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props21 = this.props,
          value = _this$props21.value,
          md5Progress = _this$props21.md5Progress,
          upload = _this$props21.upload,
          field = _this$props21.field;
      var _this$state = this.state,
          newFile = _this$state.newFile,
          percentDone = _this$state.percentDone,
          sizeUploaded = _this$state.sizeUploaded,
          status = _this$state.status;
      var statusTip = status;
      var showDelete = false;
      var filename_text = "No file chosen";

      if (value) {
        if (newFile) {
          if (md5Progress === null && upload === null) {
            showDelete = true;
          }

          filename_text = value;
        } else {
          statusTip = 'Previous file: ' + value;
        }
      }

      var disableFile = md5Progress !== null || upload !== null;
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", {
        id: "field_for_" + field,
        type: "file",
        onChange: this.handleChange,
        disabled: disableFile,
        style: {
          'display': 'none'
        }
      }), /*#__PURE__*/_react["default"].createElement("button", {
        type: "submit",
        disabled: disableFile,
        style: {
          'padding': '0px'
        },
        className: "btn btn-outline-dark"
      }, /*#__PURE__*/_react["default"].createElement("label", {
        className: "text-400",
        htmlFor: "field_for_" + field,
        style: {
          'paddingRight': '12px',
          'paddingTop': '6px',
          'paddingBottom': '6px',
          'paddingLeft': '12px',
          'marginBottom': '0px'
        }
      }, filename_text)), /*#__PURE__*/_react["default"].createElement(_Fade["default"], {
        "in": showDelete
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "pull-right"
      }, /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        className: "btn btn-danger",
        disabled: !showDelete,
        onClick: this.deleteField,
        tabIndex: 2
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-fw icon-times fas"
      }))))), statusTip ? /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          'color': '#a94442',
          'paddingTop': '10px'
        }
      }, statusTip) : null, md5Progress ? /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          'paddingTop': '10px'
        }
      }, /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-spin icon-circle-notch",
        style: {
          'opacity': '0.5'
        }
      }), /*#__PURE__*/_react["default"].createElement("span", {
        style: {
          'paddingLeft': '10px'
        }
      }, 'Calculating MD5... ' + md5Progress + '%')) : null, percentDone !== null ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "row",
        style: {
          'paddingTop': '10px'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-3 col-sm-3 pull-left"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: "",
        style: {
          'color': '#a94442',
          'paddingLeft': '10px'
        },
        onClick: this.cancelUpload,
        title: "Cancel"
      }, 'Cancel upload')), /*#__PURE__*/_react["default"].createElement("div", {
        className: "col-9 col-sm-9 pull-right"
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "pull-left"
      }, percentDone + "% complete"), /*#__PURE__*/_react["default"].createElement("div", {
        className: "pull-right"
      }, "Total size: " + sizeUploaded)), /*#__PURE__*/_react["default"].createElement(_rcProgress.Line, {
        percent: percentDone,
        strokeWidth: "1",
        strokeColor: "#388a92"
      }))) : null);
    }
  }]);

  return S3FileInput;
}(_react["default"].Component);
/**
 * Accepts a 'value' prop (which should contain a colon, at minimum) and present two fields for modifying its two parts.
 *
 * First part is name of a "submits_for" lab, second part is any custom string identifier.
 * Present a drop-down for submit_for lab selection, and text input box for identifier.
 * On change of either inputs, calls 'onAliasChange' function callback, passing the new modified value (including colon) as parameter.
 */


var AliasInputField = /*#__PURE__*/function (_React$Component4) {
  _inherits(AliasInputField, _React$Component4);

  var _super6 = _createSuper(AliasInputField);

  _createClass(AliasInputField, null, [{
    key: "emailToString",
    value: function emailToString(email) {
      return email.replace('@', "_at_");
    }
  }, {
    key: "getInitialSubmitsForFirstPart",
    value: function getInitialSubmitsForFirstPart(submitter) {
      var submits_for_list = submitter && Array.isArray(submitter.submits_for) && submitter.submits_for.length > 0 && submitter.submits_for || null;
      var primaryLab = submitter && submitter.lab || null;

      var primaryLabID = primaryLab && _util.object.itemUtil.atId(primaryLab);

      if (!submits_for_list) {
        // Fallback to using submitter ID.
        return AliasInputField.emailToString(submitter.email);
      }

      if (primaryLabID && primaryLab.name && _underscore["default"].map(submits_for_list, _util.object.itemUtil.atId).indexOf(primaryLabID) > -1) {
        return primaryLab.name;
      } else {
        return submits_for_list[0].name;
      }
    }
  }, {
    key: "splitInTwo",
    value: function splitInTwo(str) {
      var parts = (str || ':').split(':');

      if (parts.length > 2) {
        return [parts[0], parts.slice(1).join(':')];
      }

      return parts;
    }
  }]);

  function AliasInputField(props) {
    var _this9;

    _classCallCheck(this, AliasInputField);

    _this9 = _super6.call(this, props);

    _underscore["default"].bindAll(_assertThisInitialized(_this9), 'onAliasSecondPartChange', 'onAliasFirstPartChange', 'onAliasFirstPartChangeTyped', 'getInitialSubmitsForPart', 'finalizeAliasPartsChange');

    return _this9;
  }

  _createClass(AliasInputField, [{
    key: "getInitialSubmitsForPart",
    value: function getInitialSubmitsForPart() {
      var currentSubmittingUser = this.props.currentSubmittingUser;
      return AliasInputField.getInitialSubmitsForFirstPart(currentSubmittingUser);
    }
  }, {
    key: "finalizeAliasPartsChange",
    value: function finalizeAliasPartsChange(aliasParts) {
      var onAliasChange = this.props.onAliasChange; // Also check to see if need to add first or second part, e.g. if original value passed in was '' or null.

      if (!aliasParts[0] || aliasParts[0] === '') {
        aliasParts[0] = this.getInitialSubmitsForPart();
      }

      if (aliasParts.length === 1) {
        aliasParts[1] = '';
      }

      onAliasChange(aliasParts.join(':'));
    }
  }, {
    key: "onAliasFirstPartChangeTyped",
    value: function onAliasFirstPartChangeTyped(evt) {
      var newValue = evt.target.value || '';
      return this.onAliasFirstPartChange(newValue, evt);
    }
  }, {
    key: "onAliasFirstPartChange",
    value: function onAliasFirstPartChange(evtKey, e) {
      var value = this.props.value;
      e.preventDefault();
      var aliasParts = AliasInputField.splitInTwo(value);
      aliasParts[0] = evtKey;
      this.finalizeAliasPartsChange(aliasParts);
    }
  }, {
    key: "onAliasSecondPartChange",
    value: function onAliasSecondPartChange(e) {
      var value = this.props.value;
      e.preventDefault();
      var secondPartOfAlias = e.target.value;
      var aliasParts = AliasInputField.splitInTwo(value);
      aliasParts[1] = secondPartOfAlias;
      this.finalizeAliasPartsChange(aliasParts);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props22 = this.props,
          currentSubmittingUser = _this$props22.currentSubmittingUser,
          errorMessage = _this$props22.errorMessage,
          withinModal = _this$props22.withinModal,
          value = _this$props22.value,
          isValid = _this$props22.isValid,
          showErrorMsg = _this$props22.showErrorMsg;
      var parts = AliasInputField.splitInTwo(value);
      var submits_for_list = currentSubmittingUser && Array.isArray(currentSubmittingUser.submits_for) && currentSubmittingUser.submits_for.length > 0 && currentSubmittingUser.submits_for || null;
      var initialDefaultFirstPartValue = this.getInitialSubmitsForPart();
      var currFirstPartValue = parts.length > 1 && parts[0] || initialDefaultFirstPartValue; // const userEmailAsPrefix = AliasInputField.emailToString(currentSubmittingUser.email); // TODO - maybe have as dropdown option

      var firstPartSelect;

      if (currentSubmittingUser && Array.isArray(currentSubmittingUser.groups) && currentSubmittingUser.groups.indexOf('admin') > -1) {
        // Render an ordinary input box for admins (can specify any lab).
        firstPartSelect = /*#__PURE__*/_react["default"].createElement("input", {
          type: "text",
          inputMode: "latin",
          id: "firstPartSelect",
          value: currFirstPartValue || '',
          placeholder: "Lab (default: " + initialDefaultFirstPartValue + ")",
          onChange: this.onAliasFirstPartChangeTyped,
          style: {
            'paddingRight': 8,
            'borderRight': 'none'
          },
          className: "form-control" + (errorMessage ? " is-invalid" : isValid ? " is-valid" : "")
        });
      } else if (submits_for_list && submits_for_list.length > 1) {
        firstPartSelect = /*#__PURE__*/_react["default"].createElement(_reactBootstrap.DropdownButton, {
          className: "alias-lab-select form-control alias-first-part-input" + (errorMessage ? " is-invalid" : ""),
          id: "firstPartSelect",
          variant: "light",
          onSelect: this.onAliasFirstPartChange,
          as: _reactBootstrap.InputGroup.Prepend,
          title: parts.length > 1 && /*#__PURE__*/_react["default"].createElement("span", {
            className: "text-400 d-flex justify-content-between align-items-center"
          }, /*#__PURE__*/_react["default"].createElement("small", null, "Lab:\xA0"), /*#__PURE__*/_react["default"].createElement("span", {
            className: "text-truncate",
            style: {
              maxWidth: '80%'
            }
          }, parts[0] !== '' && parts[0] || this.getInitialSubmitsForPart())) || 'Select a Lab'
        }, _underscore["default"].map(submits_for_list, function (lab) {
          return /*#__PURE__*/_react["default"].createElement(_reactBootstrap.DropdownItem, {
            key: lab.name,
            eventKey: lab.name
          }, /*#__PURE__*/_react["default"].createElement("span", {
            className: "text-500"
          }, lab.name), " (", lab.display_title, ")");
        }));
      } else {
        // Only 1 submits_for lab or 0 submits_for -- fallback to staticy thingy
        firstPartSelect = /*#__PURE__*/_react["default"].createElement(_reactBootstrap.InputGroup.Prepend, {
          className: "alias-lab-single-option"
        }, /*#__PURE__*/_react["default"].createElement("span", {
          className: "input-group-text"
        }, currFirstPartValue));
      }

      var outerClassName = "mb-0 alias-input-field form-group has-feedback" + (errorMessage ? " is-invalid has-error" : isValid ? " is-valid" : "");
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: outerClassName
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "input-group"
      }, firstPartSelect, /*#__PURE__*/_react["default"].createElement("div", {
        className: "input-group-prepend input-group-append input-group-addon colon-separator"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "input-group-text"
      }, ":")), /*#__PURE__*/_react["default"].createElement("input", {
        type: "text",
        id: "aliasInput",
        inputMode: "latin",
        value: parts[1] || '',
        autoFocus: withinModal && !parts[1] ? true : false,
        placeholder: "Type in a new identifier",
        onChange: this.onAliasSecondPartChange,
        className: "form-control" + (errorMessage ? " is-invalid" : isValid ? " is-valid" : "")
      })), showErrorMsg && errorMessage ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "invalid-feedback d-block text-right"
      }, errorMessage) : null);
    }
  }]);

  return AliasInputField;
}(_react["default"].Component);

exports.AliasInputField = AliasInputField;

_defineProperty(AliasInputField, "propTypes", {
  'value': _propTypes["default"].string.isRequired,
  'onAliasChange': _propTypes["default"].func.isRequired,
  'currentSubmittingUser': _propTypes["default"].shape({
    'submits_for': _propTypes["default"].arrayOf(_propTypes["default"].shape({
      'name': _propTypes["default"].string,
      'display_title': _propTypes["default"].string
    }))
  }).isRequired,
  'errorMessage': _propTypes["default"].string,
  // String or null
  'isValid': _propTypes["default"].bool
});

_defineProperty(AliasInputField, "defaultProps", {
  'value': ':'
});

var AliasInputFieldValidated = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(AliasInputFieldValidated, _React$PureComponent3);

  var _super7 = _createSuper(AliasInputFieldValidated);

  function AliasInputFieldValidated(props) {
    var _this10;

    _classCallCheck(this, AliasInputFieldValidated);

    _this10 = _super7.call(this, props);
    _this10.doValidateAlias = _this10.doValidateAlias.bind(_assertThisInitialized(_this10));
    _this10.onAliasChange = _this10.onAliasChange.bind(_assertThisInitialized(_this10));
    _this10.request = null;
    _this10.state = {
      value: props.value || AliasInputField.defaultProps.value,
      isValid: null,
      errorMessage: null
    };
    return _this10;
  }

  _createClass(AliasInputFieldValidated, [{
    key: "doValidateAlias",
    value: function doValidateAlias(alias) {
      var _this11 = this;

      var _this$props23 = this.props,
          onAliasChange = _this$props23.onAliasChange,
          errorValue = _this$props23.errorValue;

      if (this.request) {
        this.request.abort();
        this.request = null;
      }

      var currReq = null;

      var cb = function (res) {
        if (!_this11.request || _this11.request && _this11.request !== currReq) {
          // A newer request has been launched, cancel this
          // to prevent accidental overwrites or something.
          return;
        }

        _this11.request = null;

        if (res.code !== 404) {
          // Not valid - something exists already.
          onAliasChange(errorValue);

          _this11.setState({
            errorMessage: "Alias " + alias + " already exists",
            isValid: false
          });

          return;
        }

        onAliasChange(alias);

        _this11.setState({
          isValid: true,
          errorMessage: null
        });
      };

      currReq = this.request = _util.ajax.load("/" + alias, cb, 'GET', cb);
    }
  }, {
    key: "onAliasChange",
    value: function (nextAlias) {
      var _this12 = this;

      var _this$props24 = this.props,
          onAliasChange = _this$props24.onAliasChange,
          errorValue = _this$props24.errorValue,
          _this$props24$skipVal = _this$props24.skipValidateAliases,
          skipValidateAliases = _this$props24$skipVal === void 0 ? [] : _this$props24$skipVal,
          _this$props24$rejectA = _this$props24.rejectAliases,
          rejectAliases = _this$props24$rejectA === void 0 ? [] : _this$props24$rejectA;
      this.request && this.request.abort();
      this.request = null;
      this.setState({
        value: nextAlias
      }, function () {
        var value = _this12.state.value;

        var _value$split = value.split(':'),
            _value$split2 = _slicedToArray(_value$split, 2),
            firstPart = _value$split2[0],
            secondPart = _value$split2[1];

        if (!firstPart || !secondPart) {
          onAliasChange(null);

          _this12.setState({
            errorMessage: "Part of alias is blank. Will be excluded."
          });

          return;
        }

        var passedRegex = new RegExp('^\\S+:\\S+$').test(value);

        if (!passedRegex) {
          onAliasChange(errorValue);

          _this12.setState({
            errorMessage: "Aliases must be formatted as: <text>:<text> (e.g. dcic-lab:42)."
          });

          return;
        }

        if (rejectAliases.length > 0 && rejectAliases.indexOf(nextAlias) > -1) {
          // Presume is saved in database as this, skip validation.
          onAliasChange("ERROR");

          _this12.setState({
            errorMessage: "Alias rejected, make sure is not used already."
          });

          return;
        }

        if (skipValidateAliases.length > 0 && skipValidateAliases.indexOf(nextAlias) > -1) {
          // Presume is saved in database as this, skip validation.
          onAliasChange(nextAlias);

          _this12.setState({
            errorMessage: null
          });

          return;
        }

        _this12.doValidateAlias(value);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(AliasInputField, _extends({}, this.props, this.state, {
        onAliasChange: this.onAliasChange
      }));
    }
  }]);

  return AliasInputFieldValidated;
}(_react["default"].PureComponent);

exports.AliasInputFieldValidated = AliasInputFieldValidated;

_defineProperty(AliasInputFieldValidated, "defaultProps", {
  errorValue: "ERROR",
  skipValidateAliases: [],
  rejectAliases: []
});

var InfoIcon = /*#__PURE__*/function (_React$PureComponent4) {
  _inherits(InfoIcon, _React$PureComponent4);

  var _super8 = _createSuper(InfoIcon);

  function InfoIcon() {
    _classCallCheck(this, InfoIcon);

    return _super8.apply(this, arguments);
  }

  _createClass(InfoIcon, [{
    key: "fieldTypeDescriptor",
    value: function fieldTypeDescriptor() {
      var _this$props25 = this.props,
          fieldType = _this$props25.fieldType,
          schema = _this$props25.schema;
      if (typeof fieldType !== 'string' || fieldType.length === 0) return null;

      var type = _util.valueTransforms.capitalizeSentence(fieldType === 'array' ? ArrayField.typeOfItems(schema.items) : fieldType);

      if (fieldType === 'array') {
        type = type + ' <span class="array-indicator">[]</span>';
      }

      return type;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props26 = this.props,
          children = _this$props26.children,
          title = _this$props26.title,
          fieldType = _this$props26.fieldType,
          className = _this$props26.className;
      if (!children || typeof children !== 'string') return null;
      var tip = children;

      if (typeof title === 'string' && title.length > 0) {
        tip = '<h5 class="mt-03 mb-05 text-600">' + title + '</h5>' + tip;
      }

      if (typeof fieldType === 'string' && fieldType.length > 0) {
        tip += '<h6 class="mt-07 text-300">Field Type: <span class="text-400">' + this.fieldTypeDescriptor() + '</span></h6>';
      }

      return /*#__PURE__*/_react["default"].createElement("i", {
        className: "icon icon-info-circle fas" + (className ? ' ' + className : ''),
        "data-tip": tip,
        "data-html": true
      });
    }
  }]);

  return InfoIcon;
}(_react["default"].PureComponent);

function isValueNull(value) {
  if (value === null) return true;
  if (typeof value === 'undefined') return true;
  if (typeof value === 'number') return false;
  if (value === '') return true;

  if (Array.isArray(value)) {
    if (value.length === 0) return true;else if (_underscore["default"].every(value, isValueNull)) {
      return true;
    } else return false;
  }

  if (_typeof(value) === 'object') {
    var keys = _underscore["default"].keys(value);

    if (keys.length === 0) return true;else if (_underscore["default"].every(keys, function (k) {
      return isValueNull(value[k]);
    })) return true;
  }

  return false;
}