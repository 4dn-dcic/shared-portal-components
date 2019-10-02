'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldSet = exports.EditableField = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _util = require("./../../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** TODO 1 of refactor out / get rid of / fix */

/**
 * Display a field which may be edited & saved to server.
 * Currently can only be used on pages/views which have a context, i.e. JSON graph/output
 * from server, and only edit fields in that context.
 *
 * @todo: Refactor, a lot. Pass in editing boolean prop instead of reading from parent state.
 *
 * @see EditableField.propTypes for more info of props to provide.
 */
var EditableField =
/*#__PURE__*/
function (_React$Component) {
  _inherits(EditableField, _React$Component);

  function EditableField(props) {
    var _this;

    _classCallCheck(this, EditableField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EditableField).call(this, props));
    _this.onResizeStateChange = _this.onResizeStateChange.bind(_assertThisInitialized(_this));
    _this.objectType = _this.objectType.bind(_assertThisInitialized(_this));
    _this.isSet = _this.isSet.bind(_assertThisInitialized(_this));
    _this.isRequired = _this.isRequired.bind(_assertThisInitialized(_this));
    _this.isValid = _this.isValid.bind(_assertThisInitialized(_this));
    _this.fieldSchema = _this.fieldSchema.bind(_assertThisInitialized(_this));
    _this.validationPattern = _this.validationPattern.bind(_assertThisInitialized(_this));
    _this.validationFeedbackMessage = _this.validationFeedbackMessage.bind(_assertThisInitialized(_this));
    _this.save = _this.save.bind(_assertThisInitialized(_this));
    _this.enterEditState = _this.enterEditState.bind(_assertThisInitialized(_this));
    _this.cancelEditState = _this.cancelEditState.bind(_assertThisInitialized(_this));
    _this.saveEditState = _this.saveEditState.bind(_assertThisInitialized(_this));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.renderActionIcon = _this.renderActionIcon.bind(_assertThisInitialized(_this));
    _this.renderSavedValue = _this.renderSavedValue.bind(_assertThisInitialized(_this));
    _this.renderSaved = _this.renderSaved.bind(_assertThisInitialized(_this));
    _this.inputField = _this.inputField.bind(_assertThisInitialized(_this));
    _this.renderEditing = _this.renderEditing.bind(_assertThisInitialized(_this));
    var initialValue = null;

    try {
      initialValue = _util.object.getNestedProperty(props.context, props.labelID); // Returns undefined if doesn't exist in context
    } catch (e) {
      _util.console.error(e);
    }

    _this.state = {
      'value': initialValue || null,
      // Changes on input field change
      'savedValue': initialValue || null,
      // Changes only on sync w/ server.
      'valueExistsOnObj': typeof initialValue !== 'undefined',
      // If undefined then field doesn't exist on props.context
      'validationPattern': props.pattern || _this.validationPattern(),
      'required': props.required || _this.isRequired(),
      'valid': null,
      // Must distinguish between true, false, and null.
      'serverErrors': [],
      // Validation state sent from server.
      'serverErrorsMessage': null,
      'loading': false,
      // True if in middle of save or fetch request.
      'dispatching': false,
      // True if dispatching to Redux store.
      'leanTo': null,
      // Re: inline style
      'leanOffset': 0 // Re: inline style

    };
    _this.fieldRef = _react["default"].createRef(); // Field container element

    _this.inputElementRef = _react["default"].createRef(); // Input element

    return _this;
  }

  _createClass(EditableField, [{
    key: "onResizeStateChange",
    value: function onResizeStateChange() {
      var fieldElem = this.fieldRef.current;

      if (!fieldElem || !fieldElem.offsetParent) {
        return;
      }

      this.setState(function (currState) {
        var parentWidth = fieldElem.offsetParent.offsetWidth,
            selfWidth = fieldElem.offsetWidth,
            offsetLeft = fieldElem.offsetLeft,
            offsetRight = parentWidth - offsetLeft - selfWidth,
            leanTo = offsetLeft > offsetRight ? 'left' : 'right',
            leanOffset = 280 - (parentWidth - Math.min(offsetLeft, offsetRight));

        if (currState.leanTo === leanTo && currState.leanOffset === leanOffset) {
          return null;
        }

        return {
          leanTo: leanTo,
          leanOffset: leanOffset
        };
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      var newState = {},
          stateChangeCallback = null; // Reset value/savedValue if props.context or props.labelID changes for some reason.

      if (!this.state.dispatching && (this.props.context !== newProps.context || this.props.labelID !== newProps.labelID)) {
        var newVal = _util.object.getNestedProperty(newProps.context, this.props.labelID, true);

        newState.savedValue = newState.value = newVal || null;
        newState.valueExistsOnObj = typeof newVal !== 'undefined';
      } // Update state.validationPattern && state.isRequired if this.props.schemas becomes available
      // (loaded via ajax by app.js) or from props if is provided.


      if (newProps.schemas !== this.props.schemas || newProps.pattern !== this.props.pattern || newProps.required !== this.props.required) {
        newState.validationPattern = newProps.pattern || this.validationPattern(newProps.schemas);
        newState.required = newProps.required || this.isRequired(newProps.schemas); // Also, update state.valid if in editing mode

        if (this.props.parent.state && this.props.parent.state.currentlyEditing && this.inputElementRef.current) {
          stateChangeCallback = this.handleChange;
        }
      } // Apply state edits, if any


      if (_underscore["default"].keys(newState).length > 0) this.setState(newState, stateChangeCallback);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(oldProps, oldState) {
      // If state change but not onChange event -- e.g. change to/from editing state
      if (oldState.value === this.state.value && oldState.loading === this.state.loading && oldState.dispatching === this.state.dispatching && oldState.savedValue === this.state.savedValue) {
        if (this.justUpdatedLayout) {
          this.justUpdatedLayout = false;
          return false;
        }

        if (this.props.parent.state && this.props.parent.state.currentlyEditing === this.props.labelID) {
          this.onResizeStateChange();
        } else {
          this.setState({
            'leanTo': null
          });
        }

        this.justUpdatedLayout = true;
      }
    }
  }, {
    key: "objectType",
    value: function objectType() {
      if (this.props.objectType) return this.props.objectType;

      if (this.props.context && this.props.context['@type'] && this.props.context['@type'].length > 0) {
        return this.props.context['@type'][0];
      }

      return null;
    }
  }, {
    key: "isSet",
    value: function isSet() {
      var context = this.props.context,
          savedValue = this.state.savedValue;
      return _typeof(context) === 'object' && !_underscore["default"].isEmpty(context) && typeof savedValue !== 'undefined' && savedValue !== null && savedValue !== '';
    }
    /** Check if field is required based on schemas. */

  }, {
    key: "isRequired",
    value: function isRequired() {
      var schemas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.schemas;
      if (!schemas) return false;
      var objectType = this.objectType();
      if (!objectType) return false;
      var objectSchema = schemas[objectType];
      if (objectSchema && typeof objectSchema.required !== 'undefined' && Array.isArray(objectSchema.required) && objectSchema.required.indexOf(this.props.labelID) > -1) return true;
      return false;
    }
  }, {
    key: "isValid",
    value: function isValid() {
      var checkServer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (typeof this.state.valid === 'boolean' && this.state.valid === false) {
        return false;
      }

      if (checkServer && this.state.serverErrors && this.state.serverErrors.length > 0) {
        return false;
      }

      return true;
    }
    /** Return the schema for the provided props.labelID and (props.objectType or props.context['@type'][0]) */

  }, {
    key: "fieldSchema",
    value: function fieldSchema() {
      var schemas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.schemas;
      // We do not handle nested, linked or embedded properties for now.
      if (!this.props.labelID || this.props.labelID.indexOf('.') > -1) return null;
      if (schemas === null) return null; // We don't know what type of schema to get w/o objecttype.

      var objectType = this.objectType();
      if (!objectType) return null;
      return _util.object.getNestedProperty(schemas, [objectType, 'properties', this.props.labelID], true) || null;
    }
    /**
     * Get a validation pattern to check input against for text(-like) fields.
     * Try to get from this.props.schemas based on object type (User, ExperimentHIC, etc.) and props.labelID.
     * Defaults to generic per-fieldType validation pattern if available and pattern not set schemas, or null if not applicable.
     *
     * @todo Maybe move part of this to util/Schemas.js
     * @return {RegExp|null} Pattern to input validate against.
     */

  }, {
    key: "validationPattern",
    value: function validationPattern() {
      var _this2 = this;

      var schemas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.schemas;
      var _this$props = this.props,
          labelID = _this$props.labelID,
          fieldType = _this$props.fieldType,
          debug = _this$props.debug;

      var schemaDerivedPattern = function getPatternFromSchema() {
        // TODO: Maybe move to util/Schemas.js
        // We do not handle nested, linked or embedded properties for now.
        if (!schemas || !labelID || labelID.indexOf('.') > -1) return null;

        var fieldSchema = _this2.fieldSchema(schemas);

        if (!fieldSchema || typeof fieldSchema.pattern === 'undefined') return null; // No pattern set.

        if (debug) _util.console.info('Obtained EditableField validationPattern from schema (' + [_this2.objectType(), 'properties', labelID].join('.') + ')');
        return fieldSchema.pattern;
      }();

      if (schemaDerivedPattern) return schemaDerivedPattern; // Fallback to generic pattern, if applicable for props.fieldType.

      if (fieldType === 'phone') return _util.object.itemUtil.User.localRegexValidation.phone;else if (fieldType === 'email') return _util.object.itemUtil.User.localRegexValidation.email;else return null;
    }
  }, {
    key: "validationFeedbackMessage",
    value: function validationFeedbackMessage() {
      var fieldType = this.props.fieldType,
          _this$state = this.state,
          required = _this$state.required,
          valid = _this$state.valid,
          validationMessage = _this$state.validationMessage,
          serverErrors = _this$state.serverErrors,
          serverErrorsMessage = _this$state.serverErrorsMessage; //if (this.isValid(true)) return null;
      // ^ Hide via CSS instead.

      if (required && valid === false && validationMessage) {
        // Some validationMessages provided by browser don't give much info, so use it selectively (if at all).
        return _react["default"].createElement("div", {
          className: "invalid-feedback"
        }, validationMessage);
      }

      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        return _react["default"].createElement("div", {
          className: "invalid-feedback"
        }, serverErrorsMessage ? _react["default"].createElement("b", null, serverErrorsMessage) : null, _underscore["default"].map(serverErrors, function (err, i) {
          return _react["default"].createElement("div", {
            key: 'error-' + i
          }, (serverErrors.length === 1 ? '' : i + 1 + '. ') + err.description);
        }));
      }

      switch (fieldType) {
        case 'phone':
          return _react["default"].createElement("div", {
            className: "invalid-feedback"
          }, "Only use digits \u2014 no dashes, spaces, or parantheses. Optionally may include leading '+' or extension.", _react["default"].createElement("br", null), _react["default"].createElement("b", null, "e.g.:"), " ", _react["default"].createElement("code", null, "+######### x###"));

        case 'email':
          return _react["default"].createElement("div", {
            className: "invalid-feedback"
          }, "Please enter a valid email address.");

        case 'username':
        case 'text':
        default:
          return null;
      }
    }
  }, {
    key: "save",
    value: function save() {
      var _this3 = this;

      var successCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var errorCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var _this$props2 = this.props,
          labelID = _this$props2.labelID,
          endpoint = _this$props2.endpoint,
          context = _this$props2.context,
          parent = _this$props2.parent,
          onSave = _this$props2.onSave;

      _util.console.log("TTT", onSave);

      var errorFallback = function (res) {
        // ToDo display (bigger?) errors
        _util.console.error("Error: ", res);

        _this3.setState({
          'serverErrors': res.errors,
          'serverErrorsMessage': res.description,
          'loading': false
        }, errorCallback);
      };

      this.setState({
        'loading': true
      }, function () {
        var value = _this3.state.value;
        var timestamp = Math.floor(Date.now ? Date.now() / 1000 : new Date().getTime() / 1000);
        var ajaxEndpoint = (endpoint || _util.object.itemUtil.atId(context)) + '?ts=' + timestamp;
        var patchData = null;

        if (value === '') {
          // Send delete fields request instd of normal patch
          ajaxEndpoint += '&delete_fields=' + labelID;
          patchData = _util.object.generateSparseNestedProperty(labelID, undefined);
        } else {
          patchData = _util.object.generateSparseNestedProperty(labelID, value);
        }

        _util.ajax.load(ajaxEndpoint, function (r) {
          _util.console.info('EditableField Save Result:', r);

          if (r.status !== 'success') return errorFallback(r);

          var nextContext = _underscore["default"].clone(context);

          var extendSuccess = _util.object.deepExtend(nextContext, patchData);

          _util.console.log('TTT2', extendSuccess, nextContext);

          if (extendSuccess) {
            _this3.setState({
              'savedValue': value,
              'value': value,
              'dispatching': true
            }, function () {
              setTimeout(function () {
                parent.setState({
                  'currentlyEditing': null
                }, function () {
                  _this3.setState({
                    'loading': false,
                    'dispatching': false
                  });

                  if (typeof successCallback === 'function') successCallback(r);
                });
              }, 0);

              if (typeof onSave === 'function') {
                _util.console.log('TTT3');

                onSave(nextContext);
              }
            });
          } else {
            // Couldn't insert into current context, refetch from server :s.
            _util.console.warn("Couldn't update current context, fetching from server.");

            (0, _util.navigate)('', {
              'inPlace': true
            });
          }
        }, 'PATCH', errorFallback, JSON.stringify(patchData));
      });
    }
  }, {
    key: "enterEditState",
    value: function enterEditState(e) {
      e.preventDefault();
      if (this.props.parent.state && this.props.parent.state.currentlyEditing) return null;
      this.props.parent.setState({
        currentlyEditing: this.props.labelID
      });
    }
  }, {
    key: "cancelEditState",
    value: function cancelEditState(e) {
      var parent = this.props.parent;
      e.preventDefault();

      if (!parent.state || !parent.state.currentlyEditing) {
        throw new Error('No state was set on parent.');
      }

      this.setState(function (_ref) {
        var savedValue = _ref.savedValue;
        return {
          'value': savedValue,
          'valid': null,
          'validationMessage': null
        };
      });
      parent.setState({
        'currentlyEditing': null
      });
    }
  }, {
    key: "saveEditState",
    value: function saveEditState(e) {
      var _this4 = this;

      e.preventDefault();

      if (!this.isValid()) {
        // ToDo : Bigger notification to end user that something is wrong.
        _util.console.error("Cannot save " + this.props.labelID + "; value is not valid:", this.state.value);

        return;
      } else if (this.state.value === this.state.savedValue) {
        return this.cancelEditState(e);
      }

      this.save(function () {
        // Success callback
        _util.console.info("Saved " + _this4.props.labelID + " : " + _this4.state.savedValue);
      });
    }
    /** Update state.value on each keystroke/input and check validity. */

  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var inputElement = e && e.target ? e.target : this.inputElementRef.current;
      var state = {
        'value': inputElement.value // ToDo: change to (inputElement.value === '' ? null : inputElement.value)  and enable to process it on backend.

      };

      if (inputElement.validity) {
        if (typeof inputElement.validity.valid == 'boolean') {
          state.valid = inputElement.validity.valid;
        }
      }

      if (inputElement.validationMessage) {
        state.validationMessage = inputElement.validationMessage;
      } // Reset serverErrors if any


      if (this.state.serverErrors && this.state.serverErrors.length > 0) {
        state.serverErrors = [];
        state.serverErrorsMessage = null;
      } // ToDo : cross-browser validation check + set error state then use for styling, etc.


      this.setState(state);
    }
  }, {
    key: "renderActionIcon",
    value: function renderActionIcon() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'edit';
      var extClass = "right";
      if (this.props.style === 'inline') extClass = "inline";

      if (this.state.loading) {
        switch (type) {
          case 'save':
            return null;

          case 'cancel':
            return _react["default"].createElement("span", {
              className: extClass + " field-loading-icon"
            }, _react["default"].createElement("i", {
              className: "icon icon-spin icon-circle-notch icon-fw fas"
            }));
        }
      }

      switch (type) {
        case 'edit':
          if (this.props.disabled) {
            if (!this.props.info) return null; // ToDo info popup or tooltip

            return _react["default"].createElement("span", {
              className: extClass + " edit-button info disabled"
            }, _react["default"].createElement("i", {
              className: "icon icon-info-circle icon-fw fas"
            }));
          }

          return _react["default"].createElement("a", {
            href: "#edit-" + this.props.labelID,
            className: extClass + " edit-button",
            onClick: this.enterEditState,
            title: "Edit"
          }, _react["default"].createElement("i", {
            className: "icon icon-pencil icon-fw fas"
          }));

        case 'save':
          if (!this.isValid(false)) return null;
          return _react["default"].createElement("a", {
            href: "#save-" + this.props.labelID,
            className: extClass + " save-button",
            onClick: this.saveEditState,
            title: "Save"
          }, _react["default"].createElement("i", {
            className: "icon icon-check fas icon-fw"
          }));

        case 'cancel':
          return _react["default"].createElement("a", {
            href: "#",
            className: extClass + " cancel-button",
            onClick: this.cancelEditState,
            title: "Cancel"
          }, _react["default"].createElement("i", {
            className: "icon icon-times-circle far icon-fw"
          }));
      }
    }
  }, {
    key: "renderSavedValue",
    value: function renderSavedValue() {
      var renderedValue = this.props.children || this.state.savedValue,
          classes = ['value', 'saved'];

      switch (this.props.style) {
        case 'row':
        case 'minimal':
          if (this.props.style === 'row') classes.push('col-md-9');
          return _react["default"].createElement("div", {
            className: classes.join(' ')
          }, this.renderActionIcon('edit'), this.isSet() ? _react["default"].createElement("span", {
            id: this.props.labelID,
            className: "set"
          }, renderedValue) : _react["default"].createElement("span", {
            className: "not-set"
          }, this.props.fallbackText || 'No ' + this.props.labelID));

        case 'inline':
          return _react["default"].createElement("span", {
            className: classes.join(' ')
          }, this.isSet() ? _react["default"].createElement("span", {
            id: this.props.labelID,
            className: "set"
          }, renderedValue) : _react["default"].createElement("span", {
            className: "not-set"
          }, this.props.fallbackText || 'No ' + this.props.labelID), this.renderActionIcon('edit'));
      }

      return null;
    }
  }, {
    key: "renderSaved",
    value: function renderSaved() {
      if (this.props.style === 'row') {
        return _react["default"].createElement("div", {
          className: "row editable-field-entry " + this.props.labelID
        }, _react["default"].createElement("div", {
          className: "col col-md-3 text-right text-left-xs"
        }, _react["default"].createElement("label", {
          htmlFor: this.props.labelID
        }, this.props.label)), this.renderSavedValue());
      }

      if (this.props.style === 'minimal') {
        return _react["default"].createElement("div", {
          className: "editable-field-entry " + this.props.labelID
        }, this.renderSavedValue());
      }

      if (this.props.style === 'inline') {
        return _react["default"].createElement("span", {
          className: "editable-field-entry inline " + this.props.labelID
        }, this.renderSavedValue());
      }
    }
    /** Render an input field; for usage in this.renderEditing() */

  }, {
    key: "inputField",
    value: function inputField() {
      // ToDo : Select boxes, radios, checkboxes, etc.
      var commonProps = {
        'id': this.props.labelID,
        'required': this.state.required,
        'disabled': this.props.disabled || false,
        'ref': this.inputElementRef
      };

      var commonPropsTextInput = _underscore["default"].extend({
        'className': 'form-control input-' + this.props.inputSize,
        'value': this.state.value || '',
        'onChange': this.handleChange,
        'name': this.props.labelID,
        'autoFocus': true,
        'placeholder': this.props.placeholder,
        'pattern': this.state.validationPattern
      }, commonProps);

      switch (this.props.fieldType) {
        case 'phone':
          return _react["default"].createElement("span", {
            className: "input-wrapper"
          }, _react["default"].createElement("input", _extends({
            type: "text",
            inputMode: "tel",
            autoComplete: "tel"
          }, commonPropsTextInput)), this.validationFeedbackMessage());

        case 'email':
          return _react["default"].createElement("span", {
            className: "input-wrapper"
          }, _react["default"].createElement("input", _extends({
            type: "email",
            autoComplete: "email"
          }, commonPropsTextInput)), this.validationFeedbackMessage());

        case 'username':
          return _react["default"].createElement("span", {
            className: "input-wrapper"
          }, _react["default"].createElement("input", _extends({
            type: "text",
            inputMode: "latin-name",
            autoComplete: "username"
          }, commonPropsTextInput)), this.validationFeedbackMessage());

        case 'text':
          return _react["default"].createElement("span", {
            className: "input-wrapper"
          }, _react["default"].createElement("input", _extends({
            type: "text",
            inputMode: "latin"
          }, commonPropsTextInput)), this.validationFeedbackMessage());
      } // Fallback (?)


      return _react["default"].createElement("span", null, "No edit field created yet.");
    }
    /** Render 'in edit state' view */

  }, {
    key: "renderEditing",
    value: function renderEditing() {
      var _this$props3 = this.props,
          inputSize = _this$props3.inputSize,
          style = _this$props3.style,
          labelID = _this$props3.labelID,
          label = _this$props3.label,
          absoluteBox = _this$props3.absoluteBox,
          _this$state2 = this.state,
          leanTo = _this$state2.leanTo,
          leanOffset = _this$state2.leanOffset,
          outerBaseClass = "editable-field-entry editing has-feedback was-validated" + (!this.isValid(true) ? ' has-error ' : ' has-success ') + ('input-size-' + inputSize + ' ');

      if (style == 'row') {
        return _react["default"].createElement("div", {
          className: outerBaseClass + labelID + ' row'
        }, _react["default"].createElement("div", {
          className: "col col-md-3 text-right text-left-xs"
        }, _react["default"].createElement("label", {
          htmlFor: labelID
        }, label)), _react["default"].createElement("div", {
          className: "col col-md-9 value editing"
        }, this.renderActionIcon('cancel'), this.renderActionIcon('save'), this.inputField()));
      }

      if (style == 'minimal') {
        return _react["default"].createElement("div", {
          className: outerBaseClass + labelID
        }, _react["default"].createElement("div", {
          className: "value editing"
        }, this.renderActionIcon('cancel'), this.renderActionIcon('save'), this.inputField()));
      }

      if (style == 'inline') {
        var valStyle = {};

        if (absoluteBox) {
          if (leanTo === null) {
            valStyle.display = 'none';
          } else {
            valStyle[leanTo === 'left' ? 'right' : 'left'] = (leanOffset > 0 ? 0 - leanOffset : 0) + 'px';
          }
        }

        return _react["default"].createElement("span", {
          ref: absoluteBox ? this.fieldRef : null,
          className: outerBaseClass + labelID + ' inline' + (absoluteBox ? ' block-style' : '')
        }, absoluteBox ? this.renderSavedValue() : null, _react["default"].createElement("span", {
          className: "value editing clearfix",
          style: valStyle
        }, this.inputField(), this.renderActionIcon('cancel'), this.renderActionIcon('save')));
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.disabled && !this.state.valueExistsOnObj && !this.props.forceVisible) {
        // Field is empty (not returned in object) & not allowed to be edited, so assume end-user doesn't have permission to view.
        return null;
      }

      if (this.props.parent && this.props.parent.state && this.props.parent.state.currentlyEditing === this.props.labelID) {
        return this.renderEditing();
      } else {
        return this.renderSaved();
      }
    }
  }]);

  return EditableField;
}(_react["default"].Component);
/**
 * FieldSet allows to group EditableFields together.
 * Will apply pass props to all child EditableFields which it wraps, including
 * context (JSON graph/output from server) and parent, if any.
 * Can also act as host of state.currentlyEditing (== props.labelID of
 * current EditableField being edited, if any) if props.parent is not supplied.
 *
 * @todo is not reactful, maybe refactor
 *
 * @see EditableField
 */


exports.EditableField = EditableField;

_defineProperty(EditableField, "displayName", 'EditableField');

_defineProperty(EditableField, "propTypes", {
  label: _propTypes["default"].string,
  labelID: _propTypes["default"].string,
  // Property in context to be edited. Allows dot notation for nested values.
  parent: _propTypes["default"].any,
  // Holds 'currentlyEditing' state (== labelID of field being edited.)
  fallbackText: _propTypes["default"].string,
  // Fallback text to display when no value is set/available.
  context: _propTypes["default"].object,
  // ToDo : validate context obj has property labelID.
  endpoint: _propTypes["default"].string,
  // Endpoint to PATCH update to. Defaults to props.context['@id'] if not set.
  fieldType: _propTypes["default"].string,
  // Type of field, used for rendering of input element & validation.
  style: _propTypes["default"].string,
  // Markup style, e.g. render row with label (default), minimal (just input field w/ buttons).
  inputSize: _propTypes["default"].oneOf(['sm', 'md', 'lg']),
  // Size of Bootstrap input field to use. Defaults to sm.
  children: _propTypes["default"].any,
  // Rendered value of field, use custom formatting on a per-field basis. ToDo : create fallback.
  placeholder: _propTypes["default"].string,
  objectType: _propTypes["default"].string,
  // Class name of object being edited, e.g. User, Biosource, AccessKey, etc. for schema-based validation.
  pattern: _propTypes["default"].any,
  // Optional pattern to use in lieu of one derived from schema or default field pattern.
  // If set to false, will skip (default or schema-based) validation.
  required: _propTypes["default"].bool,
  // Optionally set if field is required, overriding setting derived from schema (if any). Defaults to false.
  schemas: _propTypes["default"].object.isRequired,
  debug: _propTypes["default"].bool // Verbose lifecycle log messages.

});

_defineProperty(EditableField, "defaultProps", {
  'fieldType': 'text',
  'context': {},
  'fallbackText': 'Not set',
  'style': 'row',
  'inputSize': 'sm',
  'parent': null,
  'pattern': null,
  'required': false,
  'schemas': null,
  'debug': true,
  'onSave': function onSave(nextContext) {
    _util.console.log('Saved successfully', nextContext);
  }
});

var FieldSet =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(FieldSet, _React$PureComponent);

  function FieldSet(props) {
    var _this5;

    _classCallCheck(this, FieldSet);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(FieldSet).call(this, props));
    _this5.adjustedChildren = _this5.adjustedChildren.bind(_assertThisInitialized(_this5));
    _this5.fullClassName = _this5.fullClassName.bind(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(FieldSet, [{
    key: "adjustedChildren",
    value: function adjustedChildren() {
      var _this6 = this;

      var _this$props4 = this.props,
          children = _this$props4.children,
          endpoint = _this$props4.endpoint,
          href = _this$props4.href,
          objectType = _this$props4.objectType,
          schemas = _this$props4.schemas,
          disabled = _this$props4.disabled,
          inputSize = _this$props4.inputSize,
          style = _this$props4.style,
          absoluteBox = _this$props4.absoluteBox,
          context = _this$props4.context,
          parent = _this$props4.parent,
          windowWidth = _this$props4.windowWidth,
          onSave = _this$props4.onSave; // Add shared props to children EditableField elements.

      return _react["default"].Children.map(children, function (child) {
        if (child.type && child.type.displayName === 'EditableField') {
          var newProps = {};
          if (!child.props.context || _underscore["default"].isEmpty(child.props.context)) newProps.context = context;
          if (!child.props.parent) newProps.parent = parent || _this6;
          if (!child.props.endpoint && endpoint) newProps.endpoint = endpoint;
          if (!child.props.href && href) newProps.href = href;
          if (!child.props.objectType && objectType) newProps.objectType = objectType;
          if (!child.props.schemas && schemas) newProps.schemas = schemas;
          if (onSave) newProps.onSave = onSave;
          if (typeof child.props.disabled === 'undefined' && typeof disabled === 'boolean') newProps.disabled = disabled;
          if (inputSize) newProps.inputSize = inputSize; // Overwrite, since EditableField has default props.

          if (style) newProps.style = style;
          if (absoluteBox) newProps.absoluteBox = absoluteBox;
          if (windowWidth) newProps.windowWidth = windowWidth;
          return _react["default"].cloneElement(child, newProps);
        }

        return child;
      });
    }
  }, {
    key: "fullClassName",
    value: function fullClassName() {
      var _this$props5 = this.props,
          className = _this$props5.className,
          style = _this$props5.style,
          inputSize = _this$props5.inputSize,
          parent = _this$props5.parent,
          children = _this$props5.children,
          stateHolder = parent || this,
          childIDs = FieldSet.extractChildrenIds(children); // Fallback to using self as state holder.

      return (className ? className + ' ' : '') + "editable-fields fieldset" + (style ? ' ' + style : '') + (inputSize ? ' size-' + inputSize : '') + (stateHolder.state && stateHolder.state.currentlyEditing && childIDs.indexOf(stateHolder.state.currentlyEditing) > -1 ? ' editing' : '');
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.style === 'inline') {
        return _react["default"].createElement("span", {
          className: this.fullClassName()
        }, this.adjustedChildren());
      }

      return _react["default"].createElement("div", {
        className: this.fullClassName()
      }, this.adjustedChildren());
    }
  }]);

  return FieldSet;
}(_react["default"].PureComponent);

exports.FieldSet = FieldSet;

_defineProperty(FieldSet, "propTypes", {
  children: _propTypes["default"].node,
  // Inner fieldset content, should have at least 1 EditableField, probably more.
  context: _propTypes["default"].object,
  // JSON graph/output from server representing page data. Passed to child EditableFields.
  endpoint: _propTypes["default"].string,
  // Override context['@id'] (if doesn't exist, dif endpoint, etc.)
  inputSize: _propTypes["default"].oneOf(['sm', 'md', 'lg']),
  style: _propTypes["default"].oneOf(['row', 'minimal', 'inline']),

  /**
   * Pass a parent React component, i.e. supply 'this' from a parent's render method,
   * to have it act as host of state.currentlyEditing. Use when there are other EditableFields
   * available on view/page which act on same props.context but not all within this FieldSet.
   */
  parent: _propTypes["default"].any,
  className: _propTypes["default"].string,
  // Additional className to prepend.
  schemas: _propTypes["default"].object,
  // Schemas to use for validation. If not provided, EditableField attempts to get from context
  onSave: _propTypes["default"].func
});

_defineProperty(FieldSet, "defaultProps", {
  'parent': null,
  // if null, use own state
  'context': {},
  'className': null,
  'endpoint': null,
  'onSave': EditableField.defaultProps.onSave
});

_defineProperty(FieldSet, "extractChildrenIds", (0, _memoizeOne["default"])(function (children) {
  var childIDs = [];

  _react["default"].Children.map(children, function (child) {
    if (child.props && child.props.labelID) {
      childIDs.push(child.props.labelID);
    }
  });

  return childIDs;
}));