import _extends from "@babel/runtime/helpers/extends";
import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
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
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import { ajax, console, object, navigate, logger } from './../../util';

/** TODO 1 of refactor out / get rid of / fix */

/**
 * Display a field which may be edited & saved to server.
 * Currently can only be used on pages/views which have a context, i.e. JSON graph/output
 * from server, and only edit fields in that context.
 *
 * NOTES:
 * USE WITH CAUTION. ONLY ON SIMPLE DIRECT FIELDS (NOT-EMBEDDED, NOT ARRAYS, NOT WITHIN TYPE:OBJECT).
 * OLD/PROBABLY-DEPRECATED CODE, LIKELY DOESN'T FOLLOW BEST PRACTICES/PATTERNS.
 *
 * @todo: Refactor, a lot. Pass in editing boolean 'editing' prop instead of reading it from unsafe parent state -- which is a bad anti-pattern as parent state
 * can change at any time without us knowing about it (normally React re-renders components when props change). These EditableFields are not really performant as
 * we cannot introduce memoization into them through making it React.PureComponent (though could make memoized functions potentially).
 *
 * @see EditableField.propTypes for more info of props to provide.
 */
export var EditableField = /*#__PURE__*/function (_React$Component) {
  function EditableField(props) {
    var _this2;
    _classCallCheck(this, EditableField);
    _this2 = _callSuper(this, EditableField, [props]);
    _this2.onResizeStateChange = _this2.onResizeStateChange.bind(_this2);
    _this2.objectType = _this2.objectType.bind(_this2);
    _this2.isSet = _this2.isSet.bind(_this2);
    _this2.isRequired = _this2.isRequired.bind(_this2);
    _this2.isValid = _this2.isValid.bind(_this2);
    _this2.fieldSchema = _this2.fieldSchema.bind(_this2);
    _this2.validationPattern = _this2.validationPattern.bind(_this2);
    _this2.validationFeedbackMessage = _this2.validationFeedbackMessage.bind(_this2);
    _this2.save = _this2.save.bind(_this2);
    _this2.enterEditState = _this2.enterEditState.bind(_this2);
    _this2.cancelEditState = _this2.cancelEditState.bind(_this2);
    _this2.saveEditState = _this2.saveEditState.bind(_this2);
    _this2.handleChange = _this2.handleChange.bind(_this2);
    _this2.handleKeyDown = _this2.handleKeyDown.bind(_this2);
    _this2.renderActionIcon = _this2.renderActionIcon.bind(_this2);
    _this2.renderSavedValue = _this2.renderSavedValue.bind(_this2);
    _this2.renderSaved = _this2.renderSaved.bind(_this2);
    _this2.inputField = _this2.inputField.bind(_this2);
    _this2.renderEditing = _this2.renderEditing.bind(_this2);
    var initialValue = null;
    try {
      initialValue = object.getNestedProperty(props.context, props.labelID); // Returns undefined if doesn't exist in context
    } catch (e) {
      logger.error(e);
    }
    _this2.state = {
      'value': initialValue || null,
      // Changes on input field change
      'savedValue': initialValue || null,
      // Changes only on sync w/ server.
      'valueExistsOnObj': typeof initialValue !== 'undefined',
      // If undefined then field doesn't exist on props.context
      'validationPattern': props.pattern || _this2.validationPattern(),
      'required': props.required || _this2.isRequired(),
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
      'leanOffset': 0,
      // Re: inline style
      'selectAllDone': false
    };
    _this2.fieldRef = /*#__PURE__*/React.createRef(); // Field container element
    _this2.inputElementRef = /*#__PURE__*/React.createRef(); // Input element
    return _this2;
  }
  _inherits(EditableField, _React$Component);
  return _createClass(EditableField, [{
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
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var newState = {};
      var stateChangeCallback = null;

      // Handle prop changes
      if (!this.state.dispatching && (prevProps.context !== this.props.context || prevProps.labelID !== this.props.labelID)) {
        var newVal = object.getNestedProperty(this.props.context, this.props.labelID, true);
        newState.savedValue = newState.value = newVal || null;
        newState.valueExistsOnObj = typeof newVal !== 'undefined';
      }

      // Update state.validationPattern && state.isRequired if this.props.schemas becomes available
      // (loaded via ajax by app.js) or from props if is provided.
      if (this.props.schemas !== prevProps.schemas || this.props.pattern !== prevProps.pattern || this.props.required !== prevProps.required) {
        newState.validationPattern = this.props.pattern || this.validationPattern(this.props.schemas);
        newState.required = this.props.required || this.isRequired(this.props.schemas);
        // Also, update state.valid if in editing mode
        if (this.props.parent.state && this.props.parent.state.currentlyEditing && this.inputElementRef.current) {
          stateChangeCallback = this.handleChange;
        }
      }

      // Apply state edits, if any
      if (_.keys(newState).length > 0) {
        this.setState(newState, stateChangeCallback);
      }

      // Handle state changes
      if (prevState.value === this.state.value && prevState.loading === this.state.loading && prevState.dispatching === this.state.dispatching && prevState.savedValue === this.state.savedValue) {
        if (this.justUpdatedLayout) {
          this.justUpdatedLayout = false;
          return false;
        }
        if (this.props.parent.state && this.props.parent.state.currentlyEditing === this.props.labelID) {
          this.onResizeStateChange();
          if (!this.state.selectAllDone && this.inputElementRef && this.inputElementRef.current) {
            this.inputElementRef.current.select();
            this.setState({
              'selectAllDone': true
            });
          }
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
      return _typeof(context) === 'object' && !_.isEmpty(context) && typeof savedValue !== 'undefined' && savedValue !== null && savedValue !== '';
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
      if (schemas === null) return null;

      // We don't know what type of schema to get w/o objecttype.
      var objectType = this.objectType();
      if (!objectType) return null;
      return object.getNestedProperty(schemas, [objectType, 'properties', this.props.labelID], true) || null;
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
      var _this3 = this;
      var schemas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.schemas;
      var _this$props = this.props,
        labelID = _this$props.labelID,
        fieldType = _this$props.fieldType,
        debug = _this$props.debug;
      var schemaDerivedPattern = function getPatternFromSchema() {
        // TODO: Maybe move to util/Schemas.js
        // We do not handle nested, linked or embedded properties for now.
        if (!schemas || !labelID || labelID.indexOf('.') > -1) return null;
        var fieldSchema = _this3.fieldSchema(schemas);
        if (!fieldSchema || typeof fieldSchema.pattern === 'undefined') return null; // No pattern set.
        if (debug) console.info('Obtained EditableField validationPattern from schema (' + [_this3.objectType(), 'properties', labelID].join('.') + ')');
        return fieldSchema.pattern;
      }();
      if (schemaDerivedPattern) return schemaDerivedPattern;

      // Fallback to generic pattern, if applicable for props.fieldType.
      if (fieldType === 'phone') return object.itemUtil.User.localRegexValidation.phone;else if (fieldType === 'email') return object.itemUtil.User.localRegexValidation.email;else if (fieldType === 'numeric') return object.itemUtil.User.localRegexValidation.numeric;else return null;
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
        serverErrorsMessage = _this$state.serverErrorsMessage;

      //if (this.isValid(true)) return null;
      // ^ Hide via CSS instead.

      if (required && valid === false && validationMessage) {
        // Some validationMessages provided by browser don't give much info, so use it selectively (if at all).
        return /*#__PURE__*/React.createElement("div", {
          className: "invalid-feedback"
        }, validationMessage);
      }
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        return /*#__PURE__*/React.createElement("div", {
          className: "invalid-feedback"
        }, serverErrorsMessage ? /*#__PURE__*/React.createElement("b", null, serverErrorsMessage) : null, _.map(serverErrors, function (err, i) {
          return /*#__PURE__*/React.createElement("div", {
            key: 'error-' + i
          }, (serverErrors.length === 1 ? '' : i + 1 + '. ') + err.description);
        }));
      }
      switch (fieldType) {
        case 'phone':
          return /*#__PURE__*/React.createElement("div", {
            className: "invalid-feedback"
          }, "Only use digits \u2014 no dashes, spaces, or parantheses. Optionally may include leading '+' or extension.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "e.g.:"), " ", /*#__PURE__*/React.createElement("code", null, "+######### x###"));
        case 'email':
          return /*#__PURE__*/React.createElement("div", {
            className: "invalid-feedback"
          }, "Please enter a valid email address.");
        case 'numeric':
          return /*#__PURE__*/React.createElement("div", {
            className: "invalid-feedback"
          }, "Please enter a valid number.");
        case 'username':
        case 'text':
        default:
          return null;
      }
    }
  }, {
    key: "save",
    value: function save() {
      var _this4 = this;
      var successCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var errorCallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var _this$props2 = this.props,
        labelID = _this$props2.labelID,
        endpoint = _this$props2.endpoint,
        context = _this$props2.context,
        parent = _this$props2.parent,
        onSave = _this$props2.onSave,
        dataType = _this$props2.dataType;
      var errorFallback = function (res) {
        // ToDo display (bigger?) errors
        logger.error("Error: ", res);
        _this4.setState({
          'serverErrors': res.errors,
          'serverErrorsMessage': res.description,
          'loading': false
        }, errorCallback);
      };
      this.setState({
        'loading': true
      }, function () {
        var value = _this4.state.value;
        if (dataType === 'int') {
          value = parseInt(value);
        }
        var timestamp = Math.floor(Date.now ? Date.now() / 1000 : new Date().getTime() / 1000);
        var ajaxEndpoint = (endpoint || object.itemUtil.atId(context)) + '?ts=' + timestamp;
        var patchData = null;
        if (value === '') {
          // Send delete fields request instd of normal patch
          ajaxEndpoint += '&delete_fields=' + labelID;
          patchData = object.generateSparseNestedProperty(labelID, undefined);
        } else {
          patchData = object.generateSparseNestedProperty(labelID, value);
        }
        ajax.load(ajaxEndpoint, function (r) {
          console.info('EditableField Save Result:', r);
          if (r.status !== 'success') return errorFallback(r);
          var nextContext = _.clone(context);
          var extendSuccess = object.deepExtend(nextContext, patchData);
          console.info('EditableField Extended Context', extendSuccess, nextContext);
          if (extendSuccess) {
            _this4.setState({
              'savedValue': value,
              'value': value,
              'dispatching': true
            }, function () {
              setTimeout(function () {
                parent.setState({
                  'currentlyEditing': null
                }, function () {
                  _this4.setState({
                    'loading': false,
                    'dispatching': false
                  });
                  if (typeof successCallback === 'function') successCallback(r);
                });
              }, 0);
              if (typeof onSave === 'function') {
                onSave(nextContext);
              }
            });
          } else {
            // Couldn't insert into current context, refetch from server :s.
            // NOT GUARANTEED TO WORK AT ALL DUE TO INDEXING DELAYS
            console.warn("Couldn't update current context, fetching from server.");
            navigate('', {
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
        'currentlyEditing': this.props.labelID
      });
      this.setState({
        'selectAllDone': false
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
      var _this5 = this;
      e.preventDefault();
      var _this$props3 = this.props,
        labelID = _this$props3.labelID,
        handleCustomSave = _this$props3.handleCustomSave,
        context = _this$props3.context,
        parent = _this$props3.parent,
        dataType = _this$props3.dataType;
      if (!this.isValid()) {
        // ToDo : Bigger notification to end user that something is wrong.
        logger.error("Cannot save " + this.props.labelID + "; value is not valid:", this.state.value);
        return;
      } else if (this.state.value === this.state.savedValue) {
        return this.cancelEditState(e);
      }
      /* custom save instead of default context patch */
      if (typeof handleCustomSave === 'function') {
        var value = this.state.value;
        if (dataType === 'int') {
          value = parseInt(value);
        }
        var patchData = object.generateSparseNestedProperty(labelID, value);
        var success = handleCustomSave(patchData, context);
        if (success) {
          this.setState({
            'savedValue': value,
            'value': value,
            'dispatching': true
          }, function () {
            setTimeout(function () {
              parent.setState({
                'currentlyEditing': null
              }, function () {
                _this5.setState({
                  'loading': false,
                  'dispatching': false
                });
              });
            }, 0);
          });
        }
      } else {
        this.save(function () {
          // Success callback
          console.info("Saved " + _this5.props.labelID + " : " + _this5.state.savedValue);
        });
      }
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
      }

      // Reset serverErrors if any
      if (this.state.serverErrors && this.state.serverErrors.length > 0) {
        state.serverErrors = [];
        state.serverErrorsMessage = null;
      }

      // ToDo : cross-browser validation check + set error state then use for styling, etc.
      this.setState(state);
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.saveEditState(e);
      } else if (e.keyCode === 27) {
        this.cancelEditState(e);
      }
    }
  }, {
    key: "renderActionIcon",
    value: function renderActionIcon() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'edit';
      var _this$props4 = this.props,
        style = _this$props4.style,
        info = _this$props4.info,
        disabled = _this$props4.disabled,
        labelID = _this$props4.labelID,
        buttonAlwaysVisible = _this$props4.buttonAlwaysVisible;
      var loading = this.state.loading;
      var extClass = "";
      if (style === 'inline') extClass = "show-absolute ";
      if (buttonAlwaysVisible) extClass += "always-visible ";
      if (loading) {
        switch (type) {
          case 'save':
            return null;
          case 'cancel':
            return /*#__PURE__*/React.createElement("span", {
              className: extClass + "field-loading-icon"
            }, /*#__PURE__*/React.createElement("i", {
              className: "icon icon-spin icon-circle-notch icon-fw fas"
            }));
        }
      }
      switch (type) {
        case 'edit':
          if (disabled) {
            if (!info) return null;
            // ToDo info popup or tooltip
            return /*#__PURE__*/React.createElement("span", {
              className: extClass + "edit-button info disabled"
            }, /*#__PURE__*/React.createElement("i", {
              className: "icon icon-info-circle icon-fw fas"
            }));
          }
          return /*#__PURE__*/React.createElement("a", {
            href: "#edit-" + labelID,
            className: extClass + "edit-button",
            onClick: this.enterEditState,
            title: "Edit"
          }, /*#__PURE__*/React.createElement("i", {
            className: "icon icon-pencil-alt icon-fw fas"
          }));
        case 'save':
          if (!this.isValid(false)) return null;
          return /*#__PURE__*/React.createElement("a", {
            href: "#save-" + labelID,
            className: extClass + "save-button",
            onClick: this.saveEditState,
            title: "Save"
          }, /*#__PURE__*/React.createElement("i", {
            className: "icon icon-check fas icon-fw"
          }));
        case 'cancel':
          return /*#__PURE__*/React.createElement("a", {
            href: "#",
            className: extClass + "cancel-button",
            onClick: this.cancelEditState,
            title: "Cancel"
          }, /*#__PURE__*/React.createElement("i", {
            className: "icon icon-times-circle far icon-fw"
          }));
      }
    }
  }, {
    key: "renderSavedValue",
    value: function renderSavedValue() {
      var _this$props5 = this.props,
        style = _this$props5.style,
        labelID = _this$props5.labelID,
        children = _this$props5.children,
        fallbackText = _this$props5.fallbackText;
      var savedValue = this.state.savedValue;
      var renderedValue = children || savedValue;
      var classes = ['value', 'saved'];
      switch (style) {
        case 'row':
        case 'row-without-label':
        case 'minimal-row':
        case 'minimal':
          classes.push("d-flex");
          if (style === 'row' || style === 'row-without-label') {
            classes.push(style === 'row-without-label' ? 'col-md-12' : 'col-md-9');
          } else if (style === 'minimal-row') {
            classes.push('col-md-2');
          }
          return /*#__PURE__*/React.createElement("div", {
            className: classes.join(' ')
          }, this.isSet() ? /*#__PURE__*/React.createElement("span", {
            id: labelID,
            className: "set"
          }, renderedValue) : /*#__PURE__*/React.createElement("span", {
            className: "not-set"
          }, fallbackText || 'No ' + labelID), this.renderActionIcon('edit'));
        case 'inline':
          return /*#__PURE__*/React.createElement("span", {
            className: classes.join(' ')
          }, this.isSet() ? /*#__PURE__*/React.createElement("span", {
            id: labelID,
            className: "set"
          }, renderedValue) : /*#__PURE__*/React.createElement("span", {
            className: "not-set"
          }, fallbackText || 'No ' + labelID), this.renderActionIcon('edit'));
      }
      return null;
    }
  }, {
    key: "renderSaved",
    value: function renderSaved() {
      var _this$props6 = this.props,
        style = _this$props6.style,
        info = _this$props6.info,
        disabled = _this$props6.disabled,
        labelID = _this$props6.labelID,
        label = _this$props6.label;
      this.state.loading;
      if (style === 'row') {
        return /*#__PURE__*/React.createElement("div", {
          className: "row editable-field-entry " + labelID
        }, /*#__PURE__*/React.createElement("div", {
          className: "col col-md-3 text-start text-md-end"
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: labelID
        }, label)), this.renderSavedValue());
      } else if (style === 'row-without-label') {
        return /*#__PURE__*/React.createElement("div", {
          className: "row editable-field-entry " + labelID
        }, this.renderSavedValue());
      } else if (style === 'minimal') {
        return /*#__PURE__*/React.createElement("div", {
          className: "editable-field-entry " + labelID
        }, this.renderSavedValue());
      } else if (style === 'inline') {
        return /*#__PURE__*/React.createElement("span", {
          className: "editable-field-entry inline " + labelID
        }, this.renderSavedValue());
      } else if (style === 'minimal-row') {
        return /*#__PURE__*/React.createElement("div", {
          className: "row editable-field-entry " + labelID
        }, /*#__PURE__*/React.createElement("div", {
          className: "col col-md-2 text-start text-md-end"
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: labelID
        }, label)), this.renderSavedValue());
      }
    }

    /** Render an input field; for usage in this.renderEditing() */
  }, {
    key: "inputField",
    value: function inputField() {
      var _this$props7 = this.props,
        fieldType = _this$props7.fieldType,
        labelID = _this$props7.labelID,
        placeholder = _this$props7.placeholder,
        inputSize = _this$props7.inputSize,
        disabled = _this$props7.disabled;
      var _this$state2 = this.state,
        value = _this$state2.value,
        required = _this$state2.required,
        validationPattern = _this$state2.validationPattern;
      // ToDo : Select boxes, radios, checkboxes, etc.
      var commonProps = {
        'id': labelID,
        'required': required,
        'disabled': disabled || false,
        'ref': this.inputElementRef
      };
      var commonPropsTextInput = _.extend({
        'className': 'form-control input-' + inputSize,
        'value': value || '',
        'onChange': this.handleChange,
        'onKeyDown': this.handleKeyDown,
        'name': labelID,
        'autoFocus': true,
        placeholder: placeholder,
        'pattern': validationPattern
      }, commonProps);
      switch (fieldType) {
        case 'phone':
          return /*#__PURE__*/React.createElement("span", {
            className: "input-wrapper"
          }, /*#__PURE__*/React.createElement("input", _extends({
            type: "text",
            inputMode: "tel",
            autoComplete: "tel"
          }, commonPropsTextInput)), this.validationFeedbackMessage());
        case 'email':
          return /*#__PURE__*/React.createElement("span", {
            className: "input-wrapper"
          }, /*#__PURE__*/React.createElement("input", _extends({
            type: "email",
            autoComplete: "email"
          }, commonPropsTextInput)), this.validationFeedbackMessage());
        case 'username':
          return /*#__PURE__*/React.createElement("span", {
            className: "input-wrapper"
          }, /*#__PURE__*/React.createElement("input", _extends({
            type: "text",
            inputMode: "latin-name",
            autoComplete: "username"
          }, commonPropsTextInput)), this.validationFeedbackMessage());
        case 'text':
          return /*#__PURE__*/React.createElement("span", {
            className: "input-wrapper input-text"
          }, /*#__PURE__*/React.createElement("input", _extends({
            type: "text",
            inputMode: "latin"
          }, commonPropsTextInput)), this.validationFeedbackMessage());
        case 'numeric':
          return /*#__PURE__*/React.createElement("span", {
            className: "input-wrapper"
          }, /*#__PURE__*/React.createElement("input", _extends({
            type: "number",
            inputMode: "numeric"
          }, commonPropsTextInput)), this.validationFeedbackMessage());
      }
      // Fallback (?)
      return /*#__PURE__*/React.createElement("span", null, "No edit field created yet.");
    }

    /** Render 'in edit state' view */
  }, {
    key: "renderEditing",
    value: function renderEditing() {
      var _this$props8 = this.props,
        inputSize = _this$props8.inputSize,
        style = _this$props8.style,
        fieldType = _this$props8.fieldType,
        labelID = _this$props8.labelID,
        label = _this$props8.label,
        outerClassName = _this$props8.outerClassName,
        absoluteBox = _this$props8.absoluteBox;
      var _this$state3 = this.state,
        leanTo = _this$state3.leanTo,
        leanOffset = _this$state3.leanOffset;
      var outerBaseClass = "editable-field-entry editing has-feedback was-validated" + (!this.isValid(true) ? ' has-error ' : ' has-success ') + ('input-size-' + inputSize + ' ') + (outerClassName ? outerClassName + ' ' : '');
      if (style == 'row') {
        return /*#__PURE__*/React.createElement("div", {
          className: outerBaseClass + labelID + ' row'
        }, /*#__PURE__*/React.createElement("div", {
          className: "col col-md-3 text-start text-md-end"
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: labelID
        }, label)), /*#__PURE__*/React.createElement("div", {
          className: "col col-md-9 value editing d-flex"
        }, this.inputField(), this.renderActionIcon('save'), this.renderActionIcon('cancel')));
      }
      if (style == 'row-without-label') {
        return /*#__PURE__*/React.createElement("div", {
          className: outerBaseClass + labelID + ' row'
        }, /*#__PURE__*/React.createElement("div", {
          className: "col col-md-12 value editing d-flex"
        }, this.inputField(), this.renderActionIcon('save'), this.renderActionIcon('cancel')));
      }
      if (style == 'minimal') {
        return /*#__PURE__*/React.createElement("div", {
          className: outerBaseClass + labelID
        }, /*#__PURE__*/React.createElement("div", {
          className: "value editing d-flex"
        }, this.inputField(), this.renderActionIcon('save'), this.renderActionIcon('cancel')));
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
        return /*#__PURE__*/React.createElement("span", {
          ref: absoluteBox ? this.fieldRef : null,
          className: outerBaseClass + labelID + ' inline' + (absoluteBox ? ' block-style' : '')
        }, absoluteBox ? this.renderSavedValue() : null, /*#__PURE__*/React.createElement("span", {
          className: "value editing clearfix",
          style: valStyle
        }, this.inputField(), this.renderActionIcon('save'), this.renderActionIcon('cancel')));
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
}(React.Component);

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
_defineProperty(EditableField, "displayName", 'EditableField');
_defineProperty(EditableField, "propTypes", {
  label: PropTypes.string,
  labelID: PropTypes.string,
  // Property in context to be edited. Allows dot notation for nested values.
  parent: PropTypes.any,
  // Holds 'currentlyEditing' state (== labelID of field being edited.)
  fallbackText: PropTypes.string,
  // Fallback text to display when no value is set/available.
  context: PropTypes.object,
  // ToDo : validate context obj has property labelID.
  endpoint: PropTypes.string,
  // Endpoint to PATCH update to. Defaults to props.context['@id'] if not set.
  fieldType: PropTypes.string,
  // Type of field, used for rendering of input element & validation.
  style: PropTypes.oneOf(['row', 'minimal-row', 'minimal', 'inline', 'row-without-label']),
  // Markup style, e.g. render row with label (default), minimal (just input field w/ buttons).
  inputSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  // Size of Bootstrap input field to use. Defaults to sm.
  children: PropTypes.any,
  // Rendered value of field, use custom formatting on a per-field basis. ToDo : create fallback.
  placeholder: PropTypes.string,
  objectType: PropTypes.string,
  // Class name of object being edited, e.g. User, Biosource, AccessKey, etc. for schema-based validation.
  pattern: PropTypes.any,
  // Optional pattern to use in lieu of one derived from schema or default field pattern. If set to false, will skip (default or schema-based) validation.
  required: PropTypes.bool,
  // Optionally set if field is required, overriding setting derived from schema (if any). Defaults to false.
  schemas: PropTypes.object,
  debug: PropTypes.bool,
  // Verbose lifecycle log messages.
  handleCustomSave: PropTypes.func,
  // instead of built-in save function, pass custom save
  dataType: PropTypes.oneOf(['string', 'int']),
  //return value is converted one of these types
  buttonAlwaysVisible: PropTypes.bool,
  //edit button always visible or not
  outerClassName: PropTypes.string
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
  'dataType': 'string',
  'onSave': function onSave(nextContext) {
    console.log('Saved successfully', nextContext);
  },
  'buttonAlwaysVisible': false
});
export var FieldSet = /*#__PURE__*/function (_React$PureComponent) {
  function FieldSet(props) {
    var _this6;
    _classCallCheck(this, FieldSet);
    _this6 = _callSuper(this, FieldSet, [props]);
    _this6.adjustedChildren = _this6.adjustedChildren.bind(_this6);
    _this6.fullClassName = _this6.fullClassName.bind(_this6);
    return _this6;
  }
  _inherits(FieldSet, _React$PureComponent);
  return _createClass(FieldSet, [{
    key: "adjustedChildren",
    value: function adjustedChildren() {
      var _this7 = this;
      var _this$props9 = this.props,
        children = _this$props9.children,
        endpoint = _this$props9.endpoint,
        href = _this$props9.href,
        objectType = _this$props9.objectType,
        schemas = _this$props9.schemas,
        disabled = _this$props9.disabled,
        inputSize = _this$props9.inputSize,
        style = _this$props9.style,
        absoluteBox = _this$props9.absoluteBox,
        context = _this$props9.context,
        parent = _this$props9.parent,
        windowWidth = _this$props9.windowWidth,
        onSave = _this$props9.onSave;
      // Add shared props to children EditableField elements.
      return React.Children.map(children, function (child) {
        if (child.type && child.type.displayName === 'EditableField') {
          var newProps = {};
          if (!child.props.context || _.isEmpty(child.props.context)) newProps.context = context;
          if (!child.props.parent) newProps.parent = parent || _this7;
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
          return /*#__PURE__*/React.cloneElement(child, newProps);
        }
        return child;
      });
    }
  }, {
    key: "fullClassName",
    value: function fullClassName() {
      var _this$props10 = this.props,
        className = _this$props10.className,
        style = _this$props10.style,
        inputSize = _this$props10.inputSize,
        parent = _this$props10.parent,
        children = _this$props10.children,
        stateHolder = parent || this,
        childIDs = FieldSet.extractChildrenIds(children); // Fallback to using self as state holder.

      return (className ? className + ' ' : '') + "editable-fields fieldset" + (style ? ' ' + style : '') + (inputSize ? ' size-' + inputSize : '') + (stateHolder.state && stateHolder.state.currentlyEditing && childIDs.indexOf(stateHolder.state.currentlyEditing) > -1 ? ' editing' : '');
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.style === 'inline') {
        return /*#__PURE__*/React.createElement("span", {
          className: this.fullClassName()
        }, this.adjustedChildren());
      }
      return /*#__PURE__*/React.createElement("div", {
        className: this.fullClassName()
      }, this.adjustedChildren());
    }
  }]);
}(React.PureComponent);
_defineProperty(FieldSet, "propTypes", {
  children: PropTypes.node,
  // Inner fieldset content, should have at least 1 EditableField, probably more.
  context: PropTypes.object,
  // JSON graph/output from server representing page data. Passed to child EditableFields.
  endpoint: PropTypes.string,
  // Override context['@id'] (if doesn't exist, dif endpoint, etc.)
  inputSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  style: PropTypes.oneOf(['row', 'row-without-label', 'minimal-row', 'minimal', 'inline']),
  /**
   * Pass a parent React component, i.e. supply 'this' from a parent's render method,
   * to have it act as host of state.currentlyEditing. Use when there are other EditableFields
   * available on view/page which act on same props.context but not all within this FieldSet.
   */
  parent: PropTypes.any,
  className: PropTypes.string,
  // Additional className to prepend.
  schemas: PropTypes.object,
  // Schemas to use for validation. If not provided, EditableField attempts to get from context
  onSave: PropTypes.func
});
_defineProperty(FieldSet, "defaultProps", {
  'parent': null,
  // if null, use own state
  'context': {},
  'className': null,
  'endpoint': null,
  'onSave': EditableField.defaultProps.onSave
});
_defineProperty(FieldSet, "extractChildrenIds", memoize(function (children) {
  var childIDs = [];
  React.Children.map(children, function (child) {
    if (child.props && child.props.labelID) {
      childIDs.push(child.props.labelID);
    }
  });
  return childIDs;
}));