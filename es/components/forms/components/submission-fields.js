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

var _Fade = require("./../../ui/Fade");

var _Checkbox = require("./Checkbox");

var _DropdownButton = require("./DropdownButton");

var _util = require("./../../util");

var _Alerts = require("./../../ui/Alerts");

var _BasicStaticSectionBody = require("./../../static-pages/BasicStaticSectionBody");

var _rcProgress = require("rc-progress");

var _LinkToSelector = require("./LinkToSelector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BuildField = function (_React$PureComponent) {
  _inherits(BuildField, _React$PureComponent);

  _createClass(BuildField, null, [{
    key: "fieldTypeFromFieldSchema",
    value: function fieldTypeFromFieldSchema(fieldSchema) {
      var fieldType = fieldSchema.type ? fieldSchema.type : "text";

      if (fieldType === 'string') {
        fieldType = 'text';

        if (typeof fieldSchema.formInput === 'string') {
          if (['textarea', 'html', 'code'].indexOf(fieldSchema.formInput) > -1) return fieldSchema.formInput;
        }
      }

      if (fieldSchema["enum"] || fieldSchema.suggested_enum) {
        fieldType = 'enum';
      }

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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BuildField).call(this, props));

    _underscore["default"].bindAll(_assertThisInitialized(_this), 'displayField', 'handleDropdownButtonToggle', 'handleAliasChange', 'buildEnumEntry', 'submitEnumVal', 'handleChange', 'handleAliasChange', 'deleteField', 'pushArrayValue', 'commonRowProps', 'labelTypeDescriptor', 'wrapWithLabel', 'wrapWithNoLabel');

    _this.state = {
      'dropdownOpen': false
    };
    _this.inputElementRef = _react["default"].createRef();
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
  }, {
    key: "displayField",
    value: function displayField(fieldType) {
      var _this2 = this;

      var _this$props = this.props,
          field = _this$props.field,
          value = _this$props.value,
          disabled = _this$props.disabled,
          enumValues = _this$props.enumValues,
          currentSubmittingUser = _this$props.currentSubmittingUser,
          roundTwo = _this$props.roundTwo,
          currType = _this$props.currType,
          currContext = _this$props.currContext,
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
      };

      if (currType === 'StaticSection' && field === 'body') {
        var filetype = currContext && currContext.options && currContext.options.filetype;

        if (filetype === 'md' || filetype === 'html') {
          return _react["default"].createElement(PreviewField, _extends({}, this.props, {
            filetype: filetype,
            onChange: this.handleChange
          }));
        }
      }

      switch (fieldType) {
        case 'text':
          if (field === 'aliases') {
            return _react["default"].createElement("div", {
              className: "input-wrapper"
            }, _react["default"].createElement(AliasInputField, _extends({}, inputProps, {
              onAliasChange: this.handleAliasChange,
              currentSubmittingUser: currentSubmittingUser
            })));
          }

          return _react["default"].createElement("input", _extends({}, inputProps, {
            type: "text",
            className: "form-control",
            inputMode: "latin"
          }));

        case 'textarea':
          return _react["default"].createElement("textarea", _extends({}, inputProps, {
            type: "text",
            inputMode: "latin",
            rows: 4,
            className: "form-control mb-08 mt-08"
          }));

        case 'html':
        case 'code':
          return _react["default"].createElement("textarea", _extends({}, inputProps, {
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
          return _react["default"].createElement(_reactBootstrap.FormControl, _extends({
            type: "number"
          }, inputProps, {
            step: 1
          }));

        case 'number':
          return _react["default"].createElement(_reactBootstrap.FormControl, _extends({
            type: "number"
          }, inputProps));

        case 'boolean':
          return _react["default"].createElement(_Checkbox.Checkbox, _extends({}, _underscore["default"].omit(inputProps, 'value', 'placeholder'), {
            checked: !!value
          }), _react["default"].createElement("span", {
            style: {
              'verticalAlign': 'middle',
              'textTransform': 'capitalize'
            }
          }, typeof value === 'boolean' ? value + '' : null));

        case 'enum':
          return _react["default"].createElement("span", {
            className: "input-wrapper"
          }, _react["default"].createElement(_DropdownButton.DropdownButton, {
            title: value || _react["default"].createElement("span", {
              className: "text-300"
            }, "No value"),
            onToggle: this.handleDropdownButtonToggle,
            variant: "outline-dark"
          }, _underscore["default"].map(enumValues, function (val) {
            return _this2.buildEnumEntry(val);
          })));

        case 'linked object':
          return _react["default"].createElement(LinkedObj, _extends({
            key: "linked-item"
          }, this.props));

        case 'array':
          return _react["default"].createElement(ArrayField, _extends({}, this.props, {
            pushArrayValue: this.pushArrayValue,
            value: value || null,
            roundTwo: roundTwo
          }));

        case 'object':
          return _react["default"].createElement(ObjectField, this.props);

        case 'attachment':
          return _react["default"].createElement("div", {
            style: {
              'display': 'inline'
            }
          }, _react["default"].createElement(AttachmentInput, this.props));

        case 'file upload':
          return _react["default"].createElement(S3FileInput, this.props);
      }

      return _react["default"].createElement("div", null, "No field for this case yet.");
    }
  }, {
    key: "buildEnumEntry",
    value: function buildEnumEntry(val) {
      return _react["default"].createElement(_DropdownButton.DropdownItem, {
        key: val,
        title: val || '',
        eventKey: val,
        onSelect: this.submitEnumVal
      }, val || '');
    }
  }, {
    key: "submitEnumVal",
    value: function submitEnumVal(eventKey) {
      var _this$props2 = this.props,
          modifyNewContext = _this$props2.modifyNewContext,
          nestedField = _this$props2.nestedField,
          fieldType = _this$props2.fieldType,
          linkType = _this$props2.linkType,
          arrayIdx = _this$props2.arrayIdx;
      modifyNewContext(nestedField, eventKey, fieldType, linkType, arrayIdx);
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var _this$props3 = this.props,
          fieldType = _this$props3.fieldType,
          modifyNewContext = _this$props3.modifyNewContext,
          nestedField = _this$props3.nestedField,
          linkType = _this$props3.linkType,
          arrayIdx = _this$props3.arrayIdx;
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
      }

      modifyNewContext(nestedField, currValue, fieldType, linkType, arrayIdx);
    }
  }, {
    key: "handleAliasChange",
    value: function handleAliasChange(currValue) {
      var _this$props4 = this.props,
          fieldType = _this$props4.fieldType,
          modifyNewContext = _this$props4.modifyNewContext,
          nestedField = _this$props4.nestedField,
          linkType = _this$props4.linkType,
          arrayIdx = _this$props4.arrayIdx;
      modifyNewContext(nestedField, currValue, fieldType, linkType, arrayIdx);
    }
  }, {
    key: "deleteField",
    value: function deleteField(e) {
      var _this$props5 = this.props,
          fieldType = _this$props5.fieldType,
          modifyNewContext = _this$props5.modifyNewContext,
          nestedField = _this$props5.nestedField,
          linkType = _this$props5.linkType,
          arrayIdx = _this$props5.arrayIdx;
      e.preventDefault();
      modifyNewContext(nestedField, null, fieldType, linkType, arrayIdx);
    }
  }, {
    key: "pushArrayValue",
    value: function pushArrayValue(e) {
      var _this$props6 = this.props,
          fieldType = _this$props6.fieldType,
          value = _this$props6.value,
          schema = _this$props6.schema,
          modifyNewContext = _this$props6.modifyNewContext,
          nestedField = _this$props6.nestedField,
          linkType = _this$props6.linkType,
          arrayIdx = _this$props6.arrayIdx;
      e && e.preventDefault();

      if (fieldType !== 'array') {
        return;
      }

      var valueCopy = value ? value.slice() : [];

      if (schema.items && schema.items.type === 'object') {
        valueCopy.push({});
      } else {
        valueCopy.push(null);
      }

      modifyNewContext(nestedField, valueCopy, fieldType, linkType, arrayIdx);
    }
  }, {
    key: "commonRowProps",
    value: function commonRowProps() {
      var _this$props7 = this.props,
          isArray = _this$props7.isArray,
          fieldType = _this$props7.fieldType,
          field = _this$props7.field;
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
  }, {
    key: "labelTypeDescriptor",
    value: function labelTypeDescriptor() {
      var required = this.props.required;
      return _react["default"].createElement("div", {
        className: "field-descriptor"
      }, required ? _react["default"].createElement("span", {
        style: {
          'color': '#a94442'
        }
      }, " Required") : null);
    }
  }, {
    key: "wrapWithLabel",
    value: function wrapWithLabel() {
      var _this$props8 = this.props,
          fieldTip = _this$props8.fieldTip,
          title = _this$props8.title,
          fieldType = _this$props8.fieldType,
          schema = _this$props8.schema;
      return _react["default"].createElement("div", this.commonRowProps(), _react["default"].createElement("div", {
        className: "row"
      }, _react["default"].createElement("div", {
        className: "col-12 col-md-4"
      }, _react["default"].createElement("h5", {
        className: "submission-field-title text-ellipsis-container"
      }, this.labelTypeDescriptor(), fieldTip ? _react["default"].createElement(InfoIcon, {
        className: "mr-07",
        title: title,
        fieldType: fieldType,
        schema: schema
      }, fieldTip) : null, _react["default"].createElement("span", null, title))), _react["default"].createElement("div", {
        className: "col-12 col-md-8"
      }, _react["default"].createElement("div", {
        className: "row field-container"
      }, Array.prototype.slice.call(arguments)))));
    }
  }, {
    key: "wrapWithNoLabel",
    value: function wrapWithNoLabel() {
      return _react["default"].createElement("div", this.commonRowProps(), Array.prototype.slice.call(arguments));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
          value = _this$props9.value,
          isArray = _this$props9.isArray,
          field = _this$props9.field,
          fieldType = _this$props9.fieldType,
          arrayIdx = _this$props9.arrayIdx,
          isLastItemInArray = _this$props9.isLastItemInArray,
          fieldBeingSelected = _this$props9.fieldBeingSelected,
          nestedField = _this$props9.nestedField,
          fieldBeingSelectedArrayIdx = _this$props9.fieldBeingSelectedArrayIdx;
      var showDelete = false;
      var disableDelete = false;
      var extClass = '';

      if (!_underscore["default"].contains(['filename'], field) && fieldType !== 'array') {
        showDelete = true;
      }

      if (isValueNull(value) && !isArray) {
        showDelete = false;
      }

      var wrapFunc = this.wrapWithLabel;
      var fieldToDisplay = this.displayField(fieldType);

      if (isArray) {
        wrapFunc = this.wrapWithNoLabel;

        if (isLastItemInArray && isValueNull(value)) {
          showDelete = false;

          if (Array.isArray(arrayIdx) && arrayIdx[0] !== 0) {
            extClass += " last-item-empty";
          }
        } else if (fieldType === 'object') {
          if (!isValueNull(value)) {
            disableDelete = true;
          }
        }
      } else if (fieldType === 'object') {
        showDelete = false;
      }

      if (fieldType === 'linked object' && LinkedObj.isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx)) {
        extClass += ' in-selection-field';
      }

      return wrapFunc(_react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("div", {
        className: 'field-column col' + extClass
      }, fieldToDisplay), fieldType === 'array' || fieldType === 'file upload' ? null : _react["default"].createElement(SquareButton, {
        show: showDelete,
        disabled: disableDelete,
        tip: isArray ? 'Remove Item' : 'Clear Value',
        onClick: this.deleteField
      })));
    }
  }]);

  return BuildField;
}(_react["default"].PureComponent);

exports.BuildField = BuildField;

var SquareButton = _react["default"].memo(function (props) {
  var show = props.show,
      disabled = props.disabled,
      onClick = props.onClick,
      tip = props.tip,
      bsStyle = props.bsStyle,
      className = props.className,
      buttonContainerClassName = props.buttonContainerClassName,
      icon = props.icon,
      style = props.style;
  var outerCls = "remove-button-container" + (buttonContainerClassName ? ' ' + buttonContainerClassName : '');
  var btnCls = "btn" + (className ? " " + className : "");

  if (bsStyle) {
    btnCls += " btn-" + bsStyle;
  }

  return _react["default"].createElement("div", {
    className: "remove-button-column" + (!show ? ' hidden' : ''),
    style: style
  }, _react["default"].createElement(_Fade.Fade, {
    "in": show
  }, _react["default"].createElement("div", {
    className: outerCls
  }, _react["default"].createElement("button", {
    type: "button",
    disabled: disabled || !show,
    onClick: onClick,
    "data-tip": tip,
    tabIndex: 2,
    className: btnCls
  }, _react["default"].createElement("i", {
    className: "icon icon-fw icon-" + icon
  })))));
});

SquareButton.defaultProps = {
  'bsStyle': 'danger',
  'icon': 'times fas',
  'style': null
};

var LinkedObj = function (_React$PureComponent2) {
  _inherits(LinkedObj, _React$PureComponent2);

  _createClass(LinkedObj, null, [{
    key: "isInSelectionField",
    value: function isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx) {
      if (!fieldBeingSelected || fieldBeingSelected !== nestedField) {
        return false;
      }

      if (arrayIdx === null && fieldBeingSelectedArrayIdx === null) {
        return true;
      }

      if (Array.isArray(arrayIdx) && Array.isArray(fieldBeingSelectedArrayIdx)) {
        return _underscore["default"].every(arrayIdx, function (arrIdx, arrIdxIdx) {
          return arrIdx === fieldBeingSelectedArrayIdx[arrIdxIdx];
        });
      }

      return false;
    }
  }]);

  function LinkedObj(props) {
    var _this3;

    _classCallCheck(this, LinkedObj);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(LinkedObj).call(this, props));
    _this3.updateContext = _this3.updateContext.bind(_assertThisInitialized(_this3));
    _this3.setSubmissionStateToLinkedToItem = _this3.setSubmissionStateToLinkedToItem.bind(_assertThisInitialized(_this3));
    _this3.handleStartSelectItem = _this3.handleStartSelectItem.bind(_assertThisInitialized(_this3));
    _this3.handleFinishSelectItem = _this3.handleFinishSelectItem.bind(_assertThisInitialized(_this3));
    _this3.handleCreateNewItemClick = _this3.handleCreateNewItemClick.bind(_assertThisInitialized(_this3));
    _this3.handleTextInputChange = _this3.handleTextInputChange.bind(_assertThisInitialized(_this3));
    _this3.handleAcceptTypedID = _this3.handleAcceptTypedID.bind(_assertThisInitialized(_this3));
    _this3.childWindowAlert = _this3.childWindowAlert.bind(_assertThisInitialized(_this3));
    _this3.state = {
      'textInputValue': typeof props.value === 'string' && props.value || ''
    };
    return _this3;
  }

  _createClass(LinkedObj, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateContext();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.updateContext();

      _reactTooltip["default"].rebuild();
    }
  }, {
    key: "updateContext",
    value: function updateContext() {
      var _this$props10 = this.props,
          keyComplete = _this$props10.keyComplete,
          value = _this$props10.value,
          linkType = _this$props10.linkType,
          arrayIdx = _this$props10.arrayIdx,
          nestedField = _this$props10.nestedField,
          modifyNewContext = _this$props10.modifyNewContext;

      if (keyComplete[value] && !isNaN(value)) {
        modifyNewContext(nestedField, keyComplete[value], 'finished linked object', linkType, arrayIdx);

        _reactTooltip["default"].rebuild();
      }
    }
  }, {
    key: "setSubmissionStateToLinkedToItem",
    value: function setSubmissionStateToLinkedToItem(e) {
      e.preventDefault();
      e.stopPropagation();
      var intKey = parseInt(this.props.value);
      if (isNaN(intKey)) throw new Error('Expected an integer for props.value, received', this.props.value);
      this.props.setSubmissionState('currKey', intKey);
    }
  }, {
    key: "handleStartSelectItem",
    value: function handleStartSelectItem(e) {
      e.preventDefault();
      if (!window) return;
      var _this$props11 = this.props,
          schema = _this$props11.schema,
          nestedField = _this$props11.nestedField,
          currType = _this$props11.currType,
          linkType = _this$props11.linkType,
          arrayIdx = _this$props11.arrayIdx,
          selectObj = _this$props11.selectObj,
          selectCancel = _this$props11.selectCancel;
      var itemType = schema.linkTo;
      selectObj(itemType, nestedField, arrayIdx);
    }
  }, {
    key: "handleFinishSelectItem",
    value: function handleFinishSelectItem(items) {
      var selectComplete = this.props.selectComplete;

      if (!items || !Array.isArray(items) || items.length === 0 || !_underscore["default"].every(items, function (item) {
        return item.id && typeof item.id === 'string' && item.json;
      })) {
        return;
      }

      var _items = _slicedToArray(items, 1),
          _items$ = _items[0],
          atId = _items$.id,
          itemContext = _items$.json;

      if (items.length > 1) {
        _util.console.warn('Multiple documents selected but we only get a single item, since handler\'s multiple version not implemented yet!');
      }

      var isValidAtId = _util.object.isValidAtIDFormat(atId);

      var invalidTitle = "Invalid Item Selected";

      if (!atId || !isValidAtId) {
        _Alerts.Alerts.queue({
          'title': invalidTitle,
          'message': "You have dragged & dropped an item or link which doesn't have a valid 4DN ID or URL associated with it. Please try again.",
          'style': 'danger'
        });

        throw new Error('No valid @id available.');
      } else {
        _Alerts.Alerts.deQueue({
          'title': invalidTitle
        });
      }

      selectComplete(atId);
    }
  }, {
    key: "handleCreateNewItemClick",
    value: function handleCreateNewItemClick(e) {
      e.preventDefault();
      var _this$props12 = this.props,
          fieldBeingSelected = _this$props12.fieldBeingSelected,
          selectCancel = _this$props12.selectCancel,
          modifyNewContext = _this$props12.modifyNewContext,
          nestedField = _this$props12.nestedField,
          linkType = _this$props12.linkType,
          arrayIdx = _this$props12.arrayIdx,
          schema = _this$props12.schema;
      if (fieldBeingSelected !== null) selectCancel();
      modifyNewContext(nestedField, null, 'new linked object', linkType, arrayIdx, schema.linkTo);
    }
  }, {
    key: "handleAcceptTypedID",
    value: function handleAcceptTypedID(evt) {
      _util.console.log(evt);

      if (!this || !this.state || !this.state.textInputValue) {
        throw new Error('Invalid @id format.');
      }

      this.props.selectComplete(this.state.textInputValue);
    }
  }, {
    key: "handleTextInputChange",
    value: function handleTextInputChange(evt) {
      this.setState({
        'textInputValue': evt.target.value
      });
    }
  }, {
    key: "childWindowAlert",
    value: function childWindowAlert() {
      var _this$props13 = this.props,
          schema = _this$props13.schema,
          nestedField = _this$props13.nestedField;
      var itemType = schema && schema.linkTo;
      var prettyTitle = schema && (schema.parentSchema && schema.parentSchema.title || schema.title);
      return {
        'title': 'Selecting ' + itemType + ' for field ' + (prettyTitle ? prettyTitle + ' ("' + nestedField + '")' : '"' + nestedField + '"'),
        'message': _react["default"].createElement("div", null, _react["default"].createElement("p", {
          className: "mb-0"
        }, "Please either ", _react["default"].createElement("b", null, "drag and drop"), " an Item (row) from this window into the submissions window or click its corresponding select (checkbox) button."), _react["default"].createElement("p", {
          className: "mb-0"
        }, "You may also browse around and drag & drop a link into the submissions window as well.")),
        'style': 'info'
      };
    }
  }, {
    key: "renderSelectInputField",
    value: function renderSelectInputField() {
      var _this$props14 = this.props,
          value = _this$props14.value,
          selectCancel = _this$props14.selectCancel,
          selectComplete = _this$props14.selectComplete,
          schema = _this$props14.schema,
          currType = _this$props14.currType,
          nestedField = _this$props14.nestedField;
      var textInputValue = this.state.textInputValue;
      var canShowAcceptTypedInput = typeof textInputValue === 'string' && textInputValue.length > 3;
      var extClass = !canShowAcceptTypedInput && textInputValue ? ' has-error' : '';
      var itemType = schema.linkTo;
      var prettyTitle = schema && (schema.parentSchema && schema.parentSchema.title || schema.title);
      var searchURL = '/search/?currentAction=selection&type=' + itemType;

      if (schema.ff_flag && schema.ff_flag.startsWith('filter:')) {
        if (schema.ff_flag == "filter:valid_item_types") {
          searchURL += '&valid_item_types=' + currType;
        }
      }

      return _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("div", {
        className: "linked-object-text-input-container row flexrow"
      }, _react["default"].createElement("div", {
        className: "field-column col"
      }, _react["default"].createElement("input", {
        onChange: this.handleTextInputChange,
        className: "form-control" + extClass,
        inputMode: "latin",
        type: "text",
        placeholder: "Drag & drop Item from the search view or type in a valid @ID.",
        value: this.state.textInputValue,
        onDrop: this.handleDrop
      })), canShowAcceptTypedInput ? _react["default"].createElement(SquareButton, {
        show: true,
        onClick: this.handleAcceptTypedID,
        icon: "check fas",
        bsStyle: "success",
        tip: "Accept typed identifier and look it up in database."
      }) : null, _react["default"].createElement(SquareButton, {
        show: true,
        onClick: selectCancel,
        tip: "Cancel selection",
        style: {
          'marginRight': 9
        }
      })), _react["default"].createElement(_LinkToSelector.LinkToSelector, {
        isSelecting: true,
        onSelect: this.handleFinishSelectItem,
        onCloseChildWindow: selectCancel,
        childWindowAlert: this.childWindowAlert,
        dropMessage: "Drop " + (itemType || "Item") + " for field '" + (prettyTitle || nestedField) + "'",
        searchURL: searchURL
      }));
    }
  }, {
    key: "renderEmptyField",
    value: function renderEmptyField() {
      return _react["default"].createElement("div", {
        className: "linked-object-buttons-container"
      }, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-outline-dark select-create-linked-item-button",
        onClick: this.handleStartSelectItem
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-search fas"
      }), " Select existing"), _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-outline-dark select-create-linked-item-button",
        onClick: this.handleCreateNewItemClick
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-file far"
      }), " Create new"));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props15 = this.props,
          value = _this$props15.value,
          keyDisplay = _this$props15.keyDisplay,
          keyComplete = _this$props15.keyComplete,
          fieldBeingSelected = _this$props15.fieldBeingSelected,
          nestedField = _this$props15.nestedField,
          arrayIdx = _this$props15.arrayIdx,
          fieldBeingSelectedArrayIdx = _this$props15.fieldBeingSelectedArrayIdx;
      var isSelecting = LinkedObj.isInSelectionField(fieldBeingSelected, nestedField, arrayIdx, fieldBeingSelectedArrayIdx);

      if (isSelecting) {
        return this.renderSelectInputField();
      }

      if (value) {
        var thisDisplay = keyDisplay[value] ? keyDisplay[value] + " (<code>" + value + "</code>)" : "<code>" + value + "</code>";

        if (isNaN(value)) {
          return _react["default"].createElement("div", {
            className: "submitted-linked-object-display-container text-ellipsis-container"
          }, _react["default"].createElement("i", {
            className: "icon icon-fw icon-hdd far mr-05"
          }), _react["default"].createElement("a", {
            href: value,
            target: "_blank",
            rel: "noopener noreferrer",
            "data-tip": thisDisplay + " is already in the database",
            "data-html": true
          }, keyDisplay[value] || value), _react["default"].createElement("i", {
            className: "icon icon-fw icon-external-link-alt ml-05 fas"
          }));
        } else {
          var intKey = parseInt(value);

          if (keyComplete[intKey]) {
            return _react["default"].createElement("div", null, _react["default"].createElement("a", {
              href: keyComplete[intKey],
              target: "_blank",
              rel: "noopener noreferrer"
            }, thisDisplay), _react["default"].createElement("i", {
              className: "icon icon-fw icon-external-link-alt ml-05 fas"
            }));
          } else {
            return _react["default"].createElement("div", {
              className: "incomplete-linked-object-display-container text-ellipsis-container"
            }, _react["default"].createElement("i", {
              className: "icon icon-fw icon-sticky-note far"
            }), "\xA0\xA0", _react["default"].createElement("a", {
              href: "#",
              onClick: this.setSubmissionStateToLinkedToItem,
              "data-tip": "Continue editing/submitting"
            }, thisDisplay), "\xA0", _react["default"].createElement("i", {
              style: {
                'fontSize': '0.85rem'
              },
              className: "icon icon-fw icon-pencil ml-05 fas"
            }));
          }
        }
      } else {
        return this.renderEmptyField();
      }
    }
  }]);

  return LinkedObj;
}(_react["default"].PureComponent);

var PreviewField = _react["default"].memo(function (props) {
  var value = props.value,
      filetype = props.filetype,
      field = props.field,
      onChange = props.onChange;

  var preview = value && _react["default"].createElement(_react["default"].Fragment, null, _react["default"].createElement("h6", {
    className: "mt-1 text-600"
  }, "Preview:"), _react["default"].createElement("hr", {
    className: "mb-1 mt-05"
  }), _react["default"].createElement(_BasicStaticSectionBody.BasicStaticSectionBody, {
    content: value || '',
    filetype: filetype
  }));

  return _react["default"].createElement("div", {
    className: "preview-field-container"
  }, _react["default"].createElement(_reactBootstrap.FormControl, {
    onChange: onChange,
    id: "field_for_" + field,
    name: field,
    value: value,
    type: "text",
    inputMode: "latin",
    componentClass: "textarea",
    rows: 8,
    wrap: "off",
    style: {
      'fontFamily': "Source Code Pro, monospace",
      'fontSize': 'small'
    }
  }), preview);
});

var ArrayField = function (_React$Component) {
  _inherits(ArrayField, _React$Component);

  _createClass(ArrayField, null, [{
    key: "typeOfItems",
    value: function typeOfItems(itemSchema) {
      var fieldType = itemSchema.type ? itemSchema.type : "text";

      if (fieldType === 'string') {
        fieldType = 'text';
      }

      if (itemSchema["enum"]) {
        fieldType = 'enum';
      }

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
    var _this4;

    _classCallCheck(this, ArrayField);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(ArrayField).call(this, props));

    _underscore["default"].bindAll(_assertThisInitialized(_this4), 'initiateArrayField', 'generateAddButton');

    return _this4;
  }

  _createClass(ArrayField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props16 = this.props,
          value = _this$props16.value,
          field = _this$props16.field,
          pushArrayValue = _this$props16.pushArrayValue;

      if (ArrayField.shouldPushArrayValue(value, field)) {
        pushArrayValue();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$props17 = this.props,
          value = _this$props17.value,
          field = _this$props17.field,
          pushArrayValue = _this$props17.pushArrayValue,
          modifyNewContext = _this$props17.modifyNewContext,
          nestedField = _this$props17.nestedField,
          schema = _this$props17.schema,
          linkType = _this$props17.linkType;

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
      var _this$props18 = this.props,
          propArrayIdx = _this$props18.arrayIdx,
          schema = _this$props18.schema;

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
      var enumValues = fieldSchema["enum"] ? fieldSchema["enum"] || [] : [];
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

      return _react["default"].createElement("div", {
        key: arrayIdx,
        className: "array-field-container " + (arrayIdx % 2 === 0 ? 'even' : 'odd'),
        "data-field-type": fieldType
      }, _react["default"].createElement(BuildField, _extends({
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
        key: arrayIdx
      })));
    }
  }, {
    key: "generateAddButton",
    value: function generateAddButton() {
      var _this$props19 = this.props,
          _this$props19$value = _this$props19.value,
          values = _this$props19$value === void 0 ? [] : _this$props19$value,
          pushArrayValue = _this$props19.pushArrayValue;
      return _react["default"].createElement("div", {
        className: "add-array-item-button-container"
      }, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-outline-dark btn-" + (values.length > 0 ? "sm" : "md"),
        onClick: pushArrayValue
      }, _react["default"].createElement("i", {
        className: "icon icon-fw fas icon-plus"
      }), " Add"));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props20 = this.props,
          propSchema = _this$props20.schema,
          propValue = _this$props20.value;
      var schema = propSchema.items || {};
      var values = propValue || [];

      var valuesToRender = _underscore["default"].map(values.length === 0 ? [null] : values, function (v, i) {
        return [v, schema, i];
      });

      var showAddButton = !isValueNull(values[valuesToRender.length - 1]);
      return _react["default"].createElement("div", {
        className: "list-of-array-items"
      }, valuesToRender.map(this.initiateArrayField), showAddButton ? this.generateAddButton() : null);
    }
  }]);

  return ArrayField;
}(_react["default"].Component);

var ObjectField = function (_React$PureComponent3) {
  _inherits(ObjectField, _React$PureComponent3);

  function ObjectField() {
    var _getPrototypeOf2;

    var _this5;

    _classCallCheck(this, ObjectField);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this5 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ObjectField)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this5), "includeField", function (schema, field) {
      if (!schema) return null;

      var schemaVal = _util.object.getNestedProperty(schema, ['properties', field], true);

      if (!schemaVal) return null;

      if (schemaVal.exclude_from && (_underscore["default"].contains(schemaVal.exclude_from, 'FFedit-create') || schemaVal.exclude_from == 'FFedit-create')) {
        return null;
      }

      if (schemaVal.exclude_from && (_underscore["default"].contains(schemaVal.exclude_from, 'FF-calculate') || schemaVal.exclude_from == 'FF-calculate')) {
        return null;
      }

      if (schemaVal.calculatedProperty && schemaVal.calculatedProperty === true) {
        return null;
      }

      if (schemaVal.permission && schemaVal.permission == "import_items") {
        return null;
      }

      return schemaVal;
    });

    return _this5;
  }

  _createClass(ObjectField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props21 = this.props,
          value = _this$props21.value,
          modifyNewContext = _this$props21.modifyNewContext,
          nestedField = _this$props21.nestedField,
          linkType = _this$props21.linkType,
          arrayIdx = _this$props21.arrayIdx;
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
      var _this6 = this;

      var _this$props22 = this.props,
          objectSchema = _this$props22.schema,
          parentObject = _this$props22.value,
          propNestedField = _this$props22.nestedField;
      var allFieldsInSchema = objectSchema['properties'] ? _underscore["default"].keys(objectSchema['properties']) : [];

      var fieldsToBuild = _underscore["default"].filter(_underscore["default"].map(allFieldsInSchema, function (f) {
        var fieldSchemaToUseOrNull = _this6.includeField(objectSchema, f);

        return fieldSchemaToUseOrNull && [f, fieldSchemaToUseOrNull] || null;
      }));

      var passProps = _underscore["default"].pick(this.props, 'modifyNewContext', 'linkType', 'setSubmissionState', 'selectObj', 'selectComplete', 'selectCancel', 'arrayIdx', 'keyDisplay', 'keyComplete', 'currType', 'updateUpload', 'upload', 'uploadStatus', 'md5Progress', 'fieldBeingSelected', 'fieldBeingSelectedArrayIdx');

      var builtFields = _underscore["default"].map(fieldsToBuild, function (_ref2) {
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

        var enumValues = [];

        if (fieldType === 'enum') {
          enumValues = fieldSchema["enum"] || fieldSchema.suggested_enum || [];
        }

        return _react["default"].createElement(BuildField, _extends({}, passProps, {
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
          isArray: false
        }));
      });

      return _react["default"].createElement("div", {
        className: "object-field-container"
      }, builtFields);
    }
  }]);

  return ObjectField;
}(_react["default"].PureComponent);

var AttachmentInput = function (_React$Component2) {
  _inherits(AttachmentInput, _React$Component2);

  function AttachmentInput(props) {
    var _this7;

    _classCallCheck(this, AttachmentInput);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(AttachmentInput).call(this, props));
    _this7.handleChange = _this7.handleChange.bind(_assertThisInitialized(_this7));
    return _this7;
  }

  _createClass(AttachmentInput, [{
    key: "acceptedTypes",
    value: function acceptedTypes() {
      var schema = this.props.schema;

      var types = _util.object.getNestedProperty(schema, ['properties', 'type', 'enum'], true);

      if (!types) {
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
      var _this$props23 = this.props,
          value = _this$props23.value,
          field = _this$props23.field;
      var attach_title;

      if (value && value.download) {
        attach_title = value.download;
      } else {
        attach_title = "No file chosen";
      }

      return _react["default"].createElement("div", {
        style: {
          'display': 'inherit'
        }
      }, _react["default"].createElement("input", {
        id: "field_for_" + field,
        type: "file",
        onChange: this.handleChange,
        style: {
          'display': 'none'
        },
        accept: this.acceptedTypes()
      }), _react["default"].createElement("button", {
        type: "submit",
        className: "btn btn-outline-dark"
      }, _react["default"].createElement("label", {
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

var S3FileInput = function (_React$Component3) {
  _inherits(S3FileInput, _React$Component3);

  function S3FileInput(props) {
    var _this8;

    _classCallCheck(this, S3FileInput);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(S3FileInput).call(this, props));

    _underscore["default"].bindAll(_assertThisInitialized(_this8), 'modifyFile', 'handleChange', 'handleAsyncUpload', 'modifyRunningUploads', 'cancelUpload', 'deleteField');

    _this8.state = {
      'percentDone': null,
      'sizeUploaded': null,
      'newFile': false,
      'status': null
    };
    return _this8;
  }

  _createClass(S3FileInput, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps) {
      var _this$props24 = this.props,
          upload = _this$props24.upload,
          uploadStatus = _this$props24.uploadStatus;
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
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var _this9 = this;

      var _this$props25 = this.props,
          modifyNewContext = _this$props25.modifyNewContext,
          nestedField = _this$props25.nestedField,
          linkType = _this$props25.linkType,
          arrayIdx = _this$props25.arrayIdx,
          currContext = _this$props25.currContext;
      var file = e.target.files[0];
      if (!file) return;
      var filename = file.name ? file.name : "unknown";
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
          }

          if (extensions.indexOf("other") === -1 && !_underscore["default"].any(extensions, function (ext) {
            return filename.endsWith(ext);
          })) {
            alert('File extension error! Please enter a file with one of the following extensions: ' + extensions.join(', '));
            return;
          }

          modifyNewContext(nestedField, filename, 'file upload', linkType, arrayIdx);

          _this9.modifyFile(file);
        } else {
          alert('Internal file extension conflict.');
        }
      });
    }
  }, {
    key: "handleAsyncUpload",
    value: function handleAsyncUpload(upload_manager) {
      var _this10 = this;

      if (upload_manager === null) {
        return;
      }

      upload_manager.on('httpUploadProgress', function (evt) {
        var percentage = Math.round(evt.loaded * 100 / evt.total);

        _this10.modifyRunningUploads(percentage, evt.total);
      }).send(function (err) {
        if (err) {
          _this10.modifyRunningUploads(null, null);

          _this10.props.updateUpload(null, false, true);

          alert("File upload failed!");
        } else {
          _this10.modifyRunningUploads(null, null);

          _this10.props.updateUpload(null, true);
        }
      });
    }
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
      var _this$props26 = this.props,
          value = _this$props26.value,
          md5Progress = _this$props26.md5Progress,
          upload = _this$props26.upload,
          field = _this$props26.field;
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
      return _react["default"].createElement("div", null, _react["default"].createElement("div", null, _react["default"].createElement("input", {
        id: "field_for_" + field,
        type: "file",
        onChange: this.handleChange,
        disabled: disableFile,
        style: {
          'display': 'none'
        }
      }), _react["default"].createElement("button", {
        type: "submit",
        disabled: disableFile,
        style: {
          'padding': '0px'
        },
        className: "btn btn-outline-dark"
      }, _react["default"].createElement("label", {
        className: "text-400",
        htmlFor: "field_for_" + field,
        style: {
          'paddingRight': '12px',
          'paddingTop': '6px',
          'paddingBottom': '6px',
          'paddingLeft': '12px',
          'marginBottom': '0px'
        }
      }, filename_text)), _react["default"].createElement(_Fade.Fade, {
        "in": showDelete
      }, _react["default"].createElement("div", {
        className: "pull-right"
      }, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-danger",
        disabled: !showDelete,
        onClick: this.deleteField,
        tabIndex: 2
      }, _react["default"].createElement("i", {
        className: "icon icon-fw icon-times fas"
      }))))), statusTip ? _react["default"].createElement("div", {
        style: {
          'color': '#a94442',
          'paddingTop': '10px'
        }
      }, statusTip) : null, md5Progress ? _react["default"].createElement("div", {
        style: {
          'paddingTop': '10px'
        }
      }, _react["default"].createElement("i", {
        className: "icon icon-spin icon-circle-o-notch",
        style: {
          'opacity': '0.5'
        }
      }), _react["default"].createElement("span", {
        style: {
          'paddingLeft': '10px'
        }
      }, 'Calculating MD5... ' + md5Progress + '%')) : null, percentDone !== null ? _react["default"].createElement("div", {
        className: "row",
        style: {
          'paddingTop': '10px'
        }
      }, _react["default"].createElement("div", {
        className: "col-3 col-sm-3 pull-left"
      }, _react["default"].createElement("a", {
        href: "",
        style: {
          'color': '#a94442',
          'paddingLeft': '10px'
        },
        onClick: this.cancelUpload,
        title: "Cancel"
      }, 'Cancel upload')), _react["default"].createElement("div", {
        className: "col-9 col-sm-9 pull-right"
      }, _react["default"].createElement("div", null, _react["default"].createElement("div", {
        className: "pull-left"
      }, percentDone + "% complete"), _react["default"].createElement("div", {
        className: "pull-right"
      }, "Total size: " + sizeUploaded)), _react["default"].createElement(_rcProgress.Line, {
        percent: percentDone,
        strokeWidth: "1",
        strokeColor: "#388a92"
      }))) : null);
    }
  }]);

  return S3FileInput;
}(_react["default"].Component);

var AliasInputField = function (_React$Component4) {
  _inherits(AliasInputField, _React$Component4);

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
    var _this11;

    _classCallCheck(this, AliasInputField);

    _this11 = _possibleConstructorReturn(this, _getPrototypeOf(AliasInputField).call(this, props));

    _underscore["default"].bindAll(_assertThisInitialized(_this11), 'onAliasSecondPartChange', 'onAliasFirstPartChange', 'onAliasFirstPartChangeTyped', 'getInitialSubmitsForPart', 'finalizeAliasPartsChange');

    return _this11;
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
      var onAliasChange = this.props.onAliasChange;

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
      var _this$props27 = this.props,
          currentSubmittingUser = _this$props27.currentSubmittingUser,
          errorMessage = _this$props27.errorMessage,
          withinModal = _this$props27.withinModal,
          value = _this$props27.value,
          isValid = _this$props27.isValid,
          showErrorMsg = _this$props27.showErrorMsg;
      var parts = AliasInputField.splitInTwo(value);
      var submits_for_list = currentSubmittingUser && Array.isArray(currentSubmittingUser.submits_for) && currentSubmittingUser.submits_for.length > 0 && currentSubmittingUser.submits_for || null;
      var initialDefaultFirstPartValue = this.getInitialSubmitsForPart();
      var currFirstPartValue = parts.length > 1 && parts[0] || initialDefaultFirstPartValue;
      var firstPartSelect;

      if (currentSubmittingUser && Array.isArray(currentSubmittingUser.groups) && currentSubmittingUser.groups.indexOf('admin') > -1) {
        firstPartSelect = _react["default"].createElement("input", {
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
        firstPartSelect = _react["default"].createElement(_DropdownButton.DropdownButton, {
          className: "alias-lab-select form-control alias-first-part-input" + (errorMessage ? " is-invalid" : ""),
          id: "firstPartSelect",
          onSelect: this.onAliasFirstPartChange,
          componentClass: _reactBootstrap.InputGroup.Button,
          title: parts.length > 1 && _react["default"].createElement("span", {
            className: "text-400"
          }, _react["default"].createElement("small", {
            className: "pull-left"
          }, "Lab: "), _react["default"].createElement("span", {
            className: "pull-right text-ellipsis-container",
            style: {
              maxWidth: '80%'
            }
          }, parts[0] !== '' && parts[0] || this.getInitialSubmitsForPart())) || 'Select a Lab'
        }, _underscore["default"].map(submits_for_list, function (lab) {
          return _react["default"].createElement(_DropdownButton.DropdownItem, {
            key: lab.name,
            eventKey: lab.name
          }, _react["default"].createElement("span", {
            className: "text-500"
          }, lab.name), " (", lab.display_title, ")");
        }));
      } else {
        firstPartSelect = _react["default"].createElement(_reactBootstrap.InputGroup.Addon, {
          className: "alias-lab-single-option"
        }, currFirstPartValue);
      }

      var outerClassName = "mb-0 alias-input-field form-group has-feedback" + (errorMessage ? " is-invalid has-error" : isValid ? " is-valid" : "");
      return _react["default"].createElement("div", {
        className: outerClassName
      }, _react["default"].createElement("div", {
        className: "input-group"
      }, firstPartSelect, _react["default"].createElement("div", {
        className: "input-group-prepend input-group-append input-group-addon colon-separator"
      }, _react["default"].createElement("span", {
        className: "input-group-text"
      }, ":")), _react["default"].createElement("input", {
        type: "text",
        id: "aliasInput",
        inputMode: "latin",
        value: parts[1] || '',
        autoFocus: withinModal && !parts[1] ? true : false,
        placeholder: "Type in a new identifier",
        onChange: this.onAliasSecondPartChange,
        className: "form-control" + (errorMessage ? " is-invalid" : isValid ? " is-valid" : "")
      })), showErrorMsg && errorMessage ? _react["default"].createElement("div", {
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
  'isValid': _propTypes["default"].bool
});

_defineProperty(AliasInputField, "defaultProps", {
  'value': ':'
});

var AliasInputFieldValidated = function (_React$PureComponent4) {
  _inherits(AliasInputFieldValidated, _React$PureComponent4);

  function AliasInputFieldValidated(props) {
    var _this12;

    _classCallCheck(this, AliasInputFieldValidated);

    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(AliasInputFieldValidated).call(this, props));
    _this12.doValidateAlias = _underscore["default"].debounce(_this12.doValidateAlias.bind(_assertThisInitialized(_this12)), 1000);
    _this12.onAliasChange = _this12.onAliasChange.bind(_assertThisInitialized(_this12));
    _this12.request = null;
    _this12.state = {
      value: props.value || AliasInputField.defaultProps.value,
      isValid: null,
      errorMessage: null
    };
    return _this12;
  }

  _createClass(AliasInputFieldValidated, [{
    key: "doValidateAlias",
    value: function doValidateAlias(alias) {
      var _this13 = this;

      var onAliasChange = this.props.onAliasChange;
      var currReq = null;

      var cb = function (res) {
        if (_this13.request !== currReq) {
          return;
        }

        _this13.request = null;

        if (res.code !== 404) {
          _this13.setState({
            errorMessage: "Alias " + alias + " already exists",
            isValid: false
          });

          return;
        }

        _this13.setState({
          isValid: true,
          errorMessage: null
        }, function () {
          onAliasChange(alias);
        });
      };

      if (this.request && this.request.abort) {
        this.request.abort();
      }

      currReq = this.request = _util.ajax.load("/" + alias, cb, 'GET', cb);
    }
  }, {
    key: "onAliasChange",
    value: function (nextAlias) {
      var _this14 = this;

      var onAliasChange = this.props.onAliasChange;
      this.request && this.request.abort();
      this.request = null;
      this.setState({
        value: nextAlias
      }, function () {
        var value = _this14.state.value;

        var _value$split = value.split(':'),
            _value$split2 = _slicedToArray(_value$split, 2),
            firstPart = _value$split2[0],
            secondPart = _value$split2[1];

        if (!firstPart || !secondPart) {
          _this14.setState({
            errorMessage: "Part of alias is blank"
          }, function () {
            onAliasChange(null);
          });

          return;
        }

        var passedRegex = new RegExp('^\\S+:\\S+$').test(value);

        if (!passedRegex) {
          _this14.setState({
            errorMessage: "Aliases must be formatted as: <text>:<text> (e.g. dcic-lab:42)."
          });

          return;
        }

        _this14.doValidateAlias(value);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react["default"].createElement(AliasInputField, _extends({}, this.props, this.state, {
        onAliasChange: this.onAliasChange
      }));
    }
  }]);

  return AliasInputFieldValidated;
}(_react["default"].PureComponent);

exports.AliasInputFieldValidated = AliasInputFieldValidated;

var InfoIcon = function (_React$PureComponent5) {
  _inherits(InfoIcon, _React$PureComponent5);

  function InfoIcon() {
    _classCallCheck(this, InfoIcon);

    return _possibleConstructorReturn(this, _getPrototypeOf(InfoIcon).apply(this, arguments));
  }

  _createClass(InfoIcon, [{
    key: "fieldTypeDescriptor",
    value: function fieldTypeDescriptor() {
      var _this$props28 = this.props,
          fieldType = _this$props28.fieldType,
          schema = _this$props28.schema;
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
      var _this$props29 = this.props,
          children = _this$props29.children,
          title = _this$props29.title,
          fieldType = _this$props29.fieldType,
          className = _this$props29.className;
      if (!children || typeof children !== 'string') return null;
      var tip = children;

      if (typeof title === 'string' && title.length > 0) {
        tip = '<h5 class="mt-03 mb-05 text-600">' + title + '</h5>' + tip;
      }

      if (typeof fieldType === 'string' && fieldType.length > 0) {
        tip += '<h6 class="mt-07 text-300">Field Type: <span class="text-400">' + this.fieldTypeDescriptor() + '</span></h6>';
      }

      return _react["default"].createElement("i", {
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