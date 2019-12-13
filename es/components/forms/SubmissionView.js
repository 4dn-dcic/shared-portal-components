'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildContext = buildContext;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _underscore = _interopRequireDefault(require("underscore"));

var _url = _interopRequireDefault(require("url"));

var _queryString = _interopRequireDefault(require("query-string"));

var _reactBootstrap = require("react-bootstrap");

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var _util = require("./../util");

var _DropdownButton = require("./components/DropdownButton");

var _Collapse = require("./../ui/Collapse");

var _Alerts = require("./../ui/Alerts");

var _file = require("../util/file");

var _ItemDetailList = require("./../ui/ItemDetailList");

var _SubmissionTree = require("./components/SubmissionTree");

var _submissionFields = require("./components/submission-fields");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Key container component for Submission components.
 *
 * Holds object values for all downstream components and owns the methods
 * for submitting data. Passes the appropriate data downwards to the individual
 * object views.
 *
 * The general function of Submission view is a container that holds the state
 * off all objects being created, as well as state required to change view between
 * object, coordinate uploads, and the alias naming process.
 *
 * The functions modifyKeyContext and setSubmissionState are used to change object
 * creation views and modify the each object's content. Other functions, like
 * updateUpload and addExistingObj are used to interface with lower level
 * components for specific state changes.
 *
 * This component also holds submission logic and a few functions for generating
 * JSX to be rendered depending on state.
 *
 * @class SubmissionView
 * @prop {string} href      Current browser URL/href. If a search href, should have a 'type=' query component to infer type of Item to create.
 * @prop {Object} [context] Current resource (Item) at our current href path. Used to get '@type' from, if not a search page.
 * @prop {Object} schemas   Schemas as returned from back-end via /profiles/ endpoint. Required.
 * @prop {boolean} create   Is this a new Item being created?
 * @prop {boolean} edit     Is this an Item being edited?
 */
var SubmissionView =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(SubmissionView, _React$PureComponent);

  _createClass(SubmissionView, null, [{
    key: "findValidationState",

    /**
     * Function to look at a specific object (reference by key) and
     * use searchHierarchy() to see if the children of the given key
     * contain any un-submitted custom objects. If they do, return
     * 1 (ready to validate). Otherwise return 0 (not ready to validate)
     *
     * @todo maybe memoize this and replace usage of state.keyValid w/ it.
     */
    value: function findValidationState(keyIdx, prevKeyHierarchy, keyContext, keyComplete) {
      var hierarchy = _util.object.deepClone(prevKeyHierarchy);

      var keyHierarchy = searchHierarchy(hierarchy, keyIdx);
      if (keyHierarchy === null) return 0;
      var validationReturn = 1;

      _underscore["default"].keys(keyHierarchy).forEach(function (key) {
        if (!isNaN(key)) {
          if (!keyComplete[key] && keyContext[key]) {
            validationReturn = 0;
          }
        }
      });

      return validationReturn;
    }
  }, {
    key: "principalTitle",
    value: function principalTitle(context, edit, create) {
      var itemType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var principalDisplay; // Name of our current Item being created.

      if (create === true && !edit) {
        principalDisplay = 'New ' + itemType;
      } else if (edit === true && !create) {
        if (context && typeof context.accession === 'string') {
          principalDisplay = context.accession;
        } else {
          principalDisplay = itemType;
        }
      }

      return principalDisplay;
    }
  }]);

  function SubmissionView(props) {
    var _this;

    _classCallCheck(this, SubmissionView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SubmissionView).call(this, props));

    _underscore["default"].bindAll(_assertThisInitialized(_this), 'modifyKeyContext', 'initializePrincipal', 'initCreateObj', 'initCreateAlias', 'submitAmbiguousType', 'buildAmbiguousEnumEntry', 'handleTypeSelection', 'handleAliasChange', 'handleAliasLabChange', 'submitAlias', 'modifyAlias', 'createObj', 'removeObj', 'initExistingObj', 'addExistingObj', 'setSubmissionState', 'updateUpload', 'testPostNewContext', 'realPostNewContext', 'removeNullsFromContext', 'checkRoundTwo', 'buildDeleteFields', 'modifyMD5Progess', 'submitObject', 'finishRoundTwo', 'cancelCreateNewObject', 'cancelCreatePrimaryObject');
    /**
     * *** DETAIL ON THIS.STATE ***
     * There are a lot of individual states to keep track of, but most workflow-runs
     * the same way: they are objects where the key is this.state.currKey and the
     * content is some information about the object created.
     *
     * @prop {!number} currKey                  Is an int that is used to index the objects you are creating and acts as a switch for the states.
     * @prop {{ number : Object }} keyContext   (idx: currKey) stores the context for each new object
     * @prop {{ number : number }} keyValid     (idx: currKey) stores the validation status for each new object; 0 is cannot yet validate (incomplete children), 1 is ready to validate, 2 is validation error, 3 is successfully validated, 4 is submitted.
     * @prop {{ number : string }} keyDisplay   (idx: currKey) stores the formatted titles for each object
     * @prop {{ number : string }} keyComplete  (idx: currKey) stores completed custom object's @id path by key.
     * @prop {number} keyIter                   (int) is a reference to the current maximum currKey. Is used to iterate to add more keys.
     * @prop {!number} currKey                  (int) controls which object we're manipulating.
     * @prop {{ number : Object }} keyHierarchy Nested form of object relationships, where values are currKey idxs for created objects and @id paths for existing objects.
     * @prop {{ number : Array.<string> }} keyLinkBookmarks - (idx: currKey) all possible child object types for a given currKey. Stored as schema title, or schema LinkTo if not present.
     * @prop {{ number : string }} keyLinks     (idx: currKey) holds the corresponding keyLinkBookmarks field for each key.
     * @prop {boolean} processingFetch          keeps track of whether top level is processing a request
     * @prop {number} errorCount                (int) keeps track of how many validation errors currently exist
     * @prop {!number} ambiguousIdx             (int) has to do with linkTo selection when multiple object types are associated with a single linkTo (example: File -> FileProcessed, FileFastq...)
     * @prop {!string} ambiguousType            Originally selected ambiguous linkTo type
     * @prop {!string} ambiguousSelected        Selected type to resolve ambiguity
     * @prop {!number} creatingIdx              (int) Has to do with alias creation. Value is equal to a currKey index when currently creating an alias, null otherwise.
     * @prop {!string} creatingType             Similar to creatingIdx, but string object type.
     * @prop {!string} creatingLink             Similar to creatingIdx, but string link type.
     * @prop {!string} creatingAlias            Stores input when creating an alias
     * @prop {!string} creatingAliasMessage     Stores any error messages to display while alias creation is occuring.
     * @prop {!string} creatingLinkForField     Stores temporarily the name of the field on the parent item for which a new object/item is being created.
     * @prop {boolean} fullScreen               If true, the whole component rendered is the Search page for pre-existing object selection.
     * @prop {number} md5Progress               (int) md5 percentage complete for uploading files. Equals null if no current md5 calcuation.
     * @prop {boolean} roundTwo                 Begins false, true only when first round submissions is done AND there are second round submission fields.
     * @prop {number[]} roundTwoKeys      List of key idxs that need round two submission
     * @prop {!Object} file                     Holds currently uploading file info (round two)
     * @prop {!Object} upload                   Holds upload info to be passed to children
     * @prop {!string} uploadStatus             Holds message relevant to file BuildField. Reset to null when currKey changes.
     * @prop {!Object} currentSubmittingUser    Holds current/submitting User Item; used primarily for submission permission(s) and autosuggesting an alias.
     */


    _this.state = {
      'keyContext': null,
      'keyValid': null,
      'keyTypes': null,
      'keyDisplay': null,
      // serves to hold navigation-formatted names for objs
      'keyComplete': {},
      // init to empty dict b/c objs cannot be complete on initialization
      'keyIter': 0,
      // serves as key versions for child objects. 0 is reserved for principal
      'currKey': null,
      // start with viewing principle object (key = 0),
      'keyHierarchy': {
        0: {}
      },
      // initalize with principal item at top
      'keyLinkBookmarks': {},
      // hold bookmarks LinkTos for each obj key
      'keyLinks': {},
      // associates each non-primary key with a field
      'processingFetch': false,
      'errorCount': 0,
      'ambiguousIdx': null,
      'ambiguousType': null,
      'ambiguousSelected': null,
      'creatingIdx': null,
      'creatingType': null,
      'creatingLink': null,
      'creatingAlias': '',
      'creatingAliasMessage': null,
      'creatingLinkForField': null,
      'fullScreen': false,
      'md5Progress': null,
      'roundTwo': false,
      'roundTwoKeys': [],
      'file': null,
      'upload': null,
      'uploadStatus': null,
      'currentSubmittingUser': null,
      'edit': props.currentAction === 'edit',
      'create': props.currentAction === 'create' || props.currentAction === 'add',
      'callbackHref': null // Where we navigate to after submission

    };
    return _this;
  }
  /**
   * Call initializePrincipal to get state set up, but only if schemas are
   * available.
   */


  _createClass(SubmissionView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var schemas = this.props.schemas;

      if (schemas && _underscore["default"].keys(schemas).length > 0) {
        this.initializePrincipal();
      }
    }
    /**
     * If schemas in props change (this should not happen often), re-initialize.
     * The main functionality of this is to wait for schemas if they're not
     * available on componentDidMount.
     */

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(pastProps, pastState) {
      var _this$props = this.props,
          schemas = _this$props.schemas,
          currentAction = _this$props.currentAction;

      if (schemas && schemas !== pastProps.schemas) {
        if (pastState.currKey === null) {
          this.initializePrincipal();
        }
      }

      if (currentAction !== pastProps.currentAction) {
        var edit = ncurrentAction === 'edit';
        this.setState({
          edit: edit,
          create: currentAction === 'create' || currentAction === 'add'
        });
      }
    }
    /**
     * Function that modifies new context and sets validation state whenever
     * a modification occurs
     *
     * @param {number} objKey - Key of Item being modified.
     * @param {Object} newContext - New Context/representation for this Item to be saved.
     */

  }, {
    key: "modifyKeyContext",
    value: function modifyKeyContext(objKey, newContext) {
      this.setState(function (_ref) {
        var keyContext = _ref.keyContext,
            keyValid = _ref.keyValid,
            prevKeyHierarchy = _ref.keyHierarchy,
            keyComplete = _ref.keyComplete;

        var contextCopy = _util.object.deepClone(keyContext);

        var validCopy = _util.object.deepClone(keyValid);

        contextCopy[objKey] = newContext; // TODO maybe get rid of this state.keyValid and just use memoized static function.

        validCopy[objKey] = SubmissionView.findValidationState(objKey, prevKeyHierarchy, keyContext, keyComplete);
        return {
          'keyContext': contextCopy,
          'keyValid': validCopy
        };
      }, _reactTooltip["default"].rebuild);
    }
    /**
     * Initialize state for the principal object (i.e. the primary object we
     * are creating/editing/cloning). It has the index of 0.
     * Editing/cloning, fetch the frame=object context and use it initialize
     * the values of the fields.
     * initObjs is used to hold the linked objects for edited/cloned objects.
     * These are later used with initCreateObj to put those objects' information
     * in state.
     */

  }, {
    key: "initializePrincipal",
    value: function initializePrincipal() {
      var _this2 = this;

      var _this$props2 = this.props,
          context = _this$props2.context,
          schemas = _this$props2.schemas,
          href = _this$props2.href,
          setIsSubmitting = _this$props2.setIsSubmitting;
      var _this$state = this.state,
          edit = _this$state.edit,
          create = _this$state.create;
      var keyContext = {};
      var contextID = _util.object.itemUtil.atId(context) || null;
      var parsedHref = (0, _util.memoizedUrlParse)(href);

      var _context$Type = _slicedToArray(context['@type'], 1),
          principalType = _context$Type[0];

      var searchViewTypeMatch = principalType.match(/^(\w+)(SearchResults)$/); // Returns null or [ "ItemTypeSearchResults", "ItemType", "SearchResults" ]

      if (Array.isArray(searchViewTypeMatch) && searchViewTypeMatch.length === 3) {
        // We're on a search results page. Parse out the proper 'type'.
        var _searchViewTypeMatch = _slicedToArray(searchViewTypeMatch, 2);

        principalType = _searchViewTypeMatch[1];
      } // Where we navigate to after submission.


      var callbackHref = create ? null : parsedHref.query && typeof parsedHref.query.callbackHref === 'string' && parsedHref.query.callbackHref || contextID;
      var keyTypes = {
        "0": principalType
      };
      var keyValid = {
        "0": 1
      };

      var keyDisplay = _objectSpread({}, gatherLinkToTitlesFromContextEmbedded(context), {
        "0": SubmissionView.principalTitle(context, edit, create, principalType)
      });

      var keyLinkBookmarks = {};
      var bookmarksList = [];
      var schema = schemas[principalType];
      var existingAlias = false; // Step A : Get labs from User, in order to autogenerate alias.

      var userInfo = _util.JWT.getUserInfo(); // Should always succeed, else no edit permission..


      var userHref = null;

      if (userInfo && Array.isArray(userInfo.user_actions)) {
        userHref = _underscore["default"].findWhere(userInfo.user_actions, {
          'id': 'profile'
        }).href;
      } else {
        userHref = '/me';
      } // Step B : Callback for after grabbing user w/ submits_for


      var continueInitProcess = function () {
        // if @id cannot be found or we are creating from scratch, start with empty fields
        if (!contextID || create) {
          // We may not have schema (if Abstract type). If so, leave empty and allow initCreateObj ... -> createObj() to create it.
          if (schema) keyContext["0"] = buildContext({}, schema, bookmarksList, edit, create);
          keyLinkBookmarks["0"] = bookmarksList;

          _this2.setState({
            keyContext: keyContext,
            keyValid: keyValid,
            keyTypes: keyTypes,
            // Gets updated in submitAmbiguousType
            keyDisplay: keyDisplay,
            keyLinkBookmarks: keyLinkBookmarks,
            currKey: 0,
            callbackHref: callbackHref
          }, function () {
            _this2.initCreateObj(principalType, 0, 'Primary Object');
          });
        } else {
          // get the DB result to avoid any possible indexing hang-ups
          _util.ajax.promise(contextID + '?frame=object&datastore=database').then(function (response) {
            var reponseAtID = _util.object.itemUtil.atId(response);

            var initObjs = []; // Gets modified/added-to in-place by buildContext.

            if (reponseAtID && reponseAtID === contextID) {
              keyContext["0"] = buildContext(response, schema, bookmarksList, edit, create, initObjs);
              keyLinkBookmarks["0"] = bookmarksList;

              if (edit && response.aliases && response.aliases.length > 0) {
                // we already have an alias for editing, so use it for title
                // setting creatingIdx and creatingType to null prevents alias creation
                keyDisplay["0"] = response.aliases[0];
                existingAlias = true;
              }
            } else {
              // something went wrong with fetching context. Just use an empty object
              keyContext["0"] = buildContext({}, schema, bookmarksList, edit, create);
              keyLinkBookmarks["0"] = bookmarksList;
            }

            _this2.setState({
              keyContext: keyContext,
              keyValid: keyValid,
              keyTypes: keyTypes,
              keyDisplay: keyDisplay,
              keyLinkBookmarks: keyLinkBookmarks,
              currKey: 0,
              callbackHref: callbackHref
            }, function () {
              _underscore["default"].forEach(initObjs, function (initObj) {
                // We get 'path' as display in buildContext->delveExistingObj.. so override here.
                initObj.display = keyDisplay[initObj.path] || initObj.display;

                _this2.initExistingObj(initObj);
              }); // if we are cloning and there is not an existing alias
              // never prompt alias creation on edit
              // do not initiate ambiguous type lookup on edit or create


              if (!edit && !existingAlias) {
                _this2.initCreateObj(principalType, 0, 'Primary Object', true);
              }
            });
          });
        } // set state in app to prevent accidental mid-submission navigation


        setIsSubmitting(true);
      }; // Grab current user via AJAX and store to state. To use for alias auto-generation using current user's top submits_for lab name.


      _util.ajax.load(userHref + '?frame=embedded', function (r) {
        _this2.setState({
          'currentSubmittingUser': r
        }, continueInitProcess);
      }, 'GET', continueInitProcess);
    }
    /**
     * Takes in an object type, the newIdx to create it under, the newLink linkTo
     * fieldname for it. If there are multiple available schemas for the linkTo,
     * set up the 'ambiguous lookup' process, which uses a modal to prompt the user
     * to select a type. If not an ambiguous linkTo type, move directly to alias
     * creation (initCreateAlias). If init (bool) is true, skip ambiguous type
     * lookup even if applicable and move right to alias selection.
     */

  }, {
    key: "initCreateObj",
    value: function initCreateObj(ambiguousType, ambiguousIdx, creatingLink) {
      var init = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var parentField = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var schemas = this.props.schemas;

      var itemTypeHierarchy = _util.schemaTransforms.schemasToItemTypeHierarchy(schemas); // check to see if we have an ambiguous linkTo type.
      // this means there could be multiple types of linked objects for a
      // given type. let the user choose one.


      if (itemTypeHierarchy[ambiguousType] && !init) {
        // ambiguous linkTo type found
        this.setState({
          ambiguousType: ambiguousType,
          ambiguousIdx: ambiguousIdx,
          creatingLink: creatingLink,
          ambiguousSelected: null
        });
      } else {
        this.initCreateAlias(ambiguousType, ambiguousIdx, creatingLink, parentField);
      }
    }
    /**
     * Takes a type, newIdx, linkTo type (newLink). Clears the state of the ambiguous object
     * type information and initializes state for the alias creation process.
     * If the current object's schemas does not support aliases, finish out the
     * creation process with createObj using a boilerplate placeholer obj name.
     */

  }, {
    key: "initCreateAlias",
    value: function initCreateAlias(type, newIdx, newLink) {
      var parentField = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var extraState = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var schemas = this.props.schemas;
      var currentSubmittingUser = this.state.currentSubmittingUser;
      var schema = schemas && schemas[type] || null;
      var autoSuggestedAlias = '';

      if (currentSubmittingUser && Array.isArray(currentSubmittingUser.submits_for) && currentSubmittingUser.submits_for[0] && typeof currentSubmittingUser.submits_for[0].name === 'string') {
        autoSuggestedAlias = _submissionFields.AliasInputField.getInitialSubmitsForFirstPart(currentSubmittingUser) + ':';
      }

      if (schema && schema.properties.aliases) {
        this.setState(_underscore["default"].extend({
          'creatingAlias': autoSuggestedAlias,
          'creatingIdx': newIdx,
          'creatingType': type,
          'creatingLink': newLink,
          'creatingLinkForField': parentField
        }, extraState));
      } else {
        // schema doesn't support aliases
        this.createObj(type, newIdx, newLink, 'My ' + type + ' ' + newIdx, extraState);
      }
    }
    /**
     * Callback function used with the ambiguous input element. Called when a type
     * is selected from the enum ambiguousType list.
     * Move to initCreateAlias afterwards.
     */

  }, {
    key: "submitAmbiguousType",
    value: function submitAmbiguousType(e) {
      e.preventDefault();
      var schemas = this.props.schemas;
      var _this$state2 = this.state,
          type = _this$state2.ambiguousSelected,
          newIdx = _this$state2.ambiguousIdx,
          newLink = _this$state2.creatingLink;
      var schema = schemas[type];
      var stateChange = {
        'ambiguousIdx': null,
        'ambiguousType': null,
        'ambiguousSelected': null
      }; // safety check to ensure schema exists for selected type

      if (schema && type) {
        this.initCreateAlias(type, newIdx, newLink, null, stateChange);
      } else {
        this.setState(stateChange); // abort
      }
    }
    /** Simple function to generate enum entries for ambiguous types */

  }, {
    key: "buildAmbiguousEnumEntry",
    value: function buildAmbiguousEnumEntry(val) {
      return _react["default"].createElement(_DropdownButton.DropdownItem, {
        key: val,
        title: val || '',
        eventKey: val,
        onSelect: this.handleTypeSelection
      }, val || '');
    }
    /**
     * Enum callback to change state in ambiguous type selection
     */

  }, {
    key: "handleTypeSelection",
    value: function handleTypeSelection(e) {
      this.setState({
        'ambiguousSelected': e
      });
    }
    /**
     * Callback function used to change state in response to user input in the
     * alias creation process
     */

  }, {
    key: "handleAliasChange",
    value: function handleAliasChange(value) {
      this.setState({
        'creatingAlias': value
      });
    }
    /**
     * Callback function used to change state in response to user input in the
     * alias creation process
     */

  }, {
    key: "handleAliasLabChange",
    value: function handleAliasLabChange(e) {
      var inputElement = e.target;
      var currValue = inputElement.value;
      this.setState({
        'creatingAlias': currValue
      });
    }
    /**
     * Callback function used when alias creation process is complete.
     * Evaluates the input alias (this.state.creatingAlias) and checks it using
     * a regex and makes sure it is not redundant with any aliases already used
     * in this object creation session or elsewhere on fourfront. If there is
     * an error in the alias given, display a helpful message (kept in
     * this.state.creatingAliasMessage). If alias is valid, finalize the object
     * create process with createObj.
     */

  }, {
    key: "submitAlias",
    value: function submitAlias(e) {
      var _this3 = this;

      e.preventDefault();
      e.stopPropagation();
      var schemas = this.props.schemas;
      var _this$state3 = this.state,
          type = _this$state3.creatingType,
          newIdx = _this$state3.creatingIdx,
          newLink = _this$state3.creatingLink,
          alias = _this$state3.creatingAlias,
          keyDisplay = _this$state3.keyDisplay;
      var schema = schemas[type];

      if (type === null || newIdx === null || newLink === null) {
        return false;
      } // check if created object supports aliases


      var hasAlias = schema && schema.properties && schema.properties.aliases;

      if (alias.length > 0 && hasAlias) {
        var patt = new RegExp('\\S+:\\S+');
        var regexRes = patt.test(alias);

        if (!regexRes) {
          this.setState({
            'creatingAliasMessage': 'ERROR. Aliases must be formatted as: <text>:<text> (e.g. dcic-lab:42).'
          });
          return false;
        }

        for (var key in keyDisplay) {
          if (keyDisplay[key] === alias) {
            this.setState({
              'creatingAliasMessage': 'You have already used this alias.'
            });
            return false;
          }
        } // see if the input alias is already being used


        _util.ajax.promise('/' + alias).then(function (data) {
          if (data && data.title && data.title === "Not Found") {
            _this3.createObj(type, newIdx, newLink, alias, {
              'creatingIdx': null,
              'creatingType': null,
              'creatingLink': null,
              'creatingAlias': '',
              'creatingAliasMessage': null,
              'creatingLinkForField': null
            });
          } else {
            _this3.setState({
              'creatingAliasMessage': 'ERROR. That alias is already taken.'
            });

            return false;
          }
        });
      }

      return false;
    }
    /**
     * Function passed down in props to modify the display title used for custom
     * objects upon a change of the alias field in the main creation process.
     * If all aliases are manually removed, use a placeholder object name. Otherwise,
     * use the lasst alias in the aliases field (an array).
     */

  }, {
    key: "modifyAlias",
    value: function modifyAlias() {
      this.setState(function (_ref2) {
        var keyDisplay = _ref2.keyDisplay,
            keyTypes = _ref2.keyTypes,
            currKey = _ref2.currKey,
            keyContext = _ref2.keyContext,
            edit = _ref2.edit,
            create = _ref2.create;
        var currAlias = keyDisplay[currKey];
        var aliases = keyContext[currKey].aliases || null; // Try to get 'alias' > 'name' > 'title' > then fallback to 'My ItemType currKey'

        var name = Array.isArray(aliases) && aliases.length > 1 && aliases[aliases.length - 2] || keyContext[currKey].name || keyContext[currKey].title || null;

        var nextKeyDisplay = _underscore["default"].clone(keyDisplay);

        if (name) {
          nextKeyDisplay[currKey] = name;
        } else if (currKey === 0) {
          nextKeyDisplay[currKey] = SubmissionView.principalTitle(null, edit, create, keyTypes[currKey]);
        } else {
          nextKeyDisplay[currKey] = 'My ' + keyTypes[currKey] + ' ' + currKey;
        }

        if (nextKeyDisplay[currKey] === currAlias) return null;
        return {
          'keyDisplay': nextKeyDisplay
        };
      });
    }
    /**
     * Takes in the type, newIdx, linkTo type (newLink), and the alias for a new
     * custom object. Used to generate an entry in all relevant key-indexed states
     * in SubmissionView. These are: keyContext, keyValid, keyTypes, keyHierarchy,
     * keyDisplay, keyLinkBookmarks, and keyLinks. Also resets state related to
     * the ambiguous type selection and alias creation processes (these should be
     * complete at this point).
      * Iterates keyIter, which is used as the master placeholder for the index of
     * the next created object. Sets currKey to the idx of the newly created object
     * so the view changes to it.
     */

  }, {
    key: "createObj",
    value: function createObj(type, newIdx, newLink, alias) {
      var extraState = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var errorCount = this.state.errorCount; // get rid of any hanging errors

      for (var i = 0; i < errorCount; i++) {
        _Alerts.Alerts.deQueue({
          'title': "Validation error " + parseInt(i + 1)
        });
      }

      this.setState(function (currState, currProps) {
        var schemas = currProps.schemas;
        var keyTypes = currState.keyTypes,
            currKey = currState.currKey,
            keyHierarchy = currState.keyHierarchy,
            keyIter = currState.keyIter,
            keyContext = currState.keyContext,
            keyValid = currState.keyValid,
            keyLinkBookmarks = currState.keyLinkBookmarks,
            keyLinks = currState.keyLinks,
            prevKeyDisplay = currState.keyDisplay;

        var contextCopy = _underscore["default"].clone(keyContext);

        var validCopy = _underscore["default"].clone(keyValid);

        var typesCopy = _underscore["default"].clone(keyTypes);

        var parentKeyIdx = currKey;

        var bookmarksCopy = _underscore["default"].clone(keyLinkBookmarks);

        var linksCopy = _util.object.deepClone(keyLinks);

        var keyDisplay = _underscore["default"].clone(prevKeyDisplay);

        var bookmarksList = [];
        var keyIdx;
        var newHierarchy;

        if (newIdx === 0) {
          // initial object creation
          keyIdx = 0;
          newHierarchy = _underscore["default"].clone(keyHierarchy);
        } else {
          keyIdx = keyIter + 1; // increase key iter by 1 for a new unique key

          if (newIdx !== keyIdx) {
            _util.console.error('ERROR: KEY INDEX INCONSISTENCY!');

            return;
          }

          newHierarchy = modifyHierarchy(_underscore["default"].clone(keyHierarchy), keyIdx, parentKeyIdx);
          validCopy[keyIdx] = 1; // new object has no incomplete children yet

          validCopy[parentKeyIdx] = 0; // parent is now not ready for validation
        }

        typesCopy[keyIdx] = type;
        var contextWithAlias = contextCopy && contextCopy[keyIdx] ? contextCopy[keyIdx] : {};

        if (Array.isArray(contextWithAlias.aliases)) {
          contextWithAlias.aliases = _underscore["default"].uniq(_underscore["default"].filter(contextWithAlias.aliases.slice(0)).concat([alias]));
        } else {
          contextWithAlias.aliases = [alias];
        }

        contextCopy[keyIdx] = buildContext(contextWithAlias, schemas[type], bookmarksList, true, false);
        bookmarksCopy[keyIdx] = bookmarksList;
        linksCopy[keyIdx] = newLink;
        keyDisplay[keyIdx] = alias;
        return _underscore["default"].extend({
          'keyContext': contextCopy,
          'keyValid': validCopy,
          'keyTypes': typesCopy,
          'keyDisplay': keyDisplay,
          'currKey': keyIdx,
          'keyIter': keyIdx,
          'keyHierarchy': newHierarchy,
          'keyLinkBookmarks': bookmarksCopy,
          'keyLinks': linksCopy,
          'processingFetch': false,
          'errorCount': 0
        }, extraState);
      });
    }
    /**
     * Takes in a key for an object to removed from the state. Effectively deletes
     * an object by removing its idx from keyContext and other key-indexed state.
     * Used for the both pre-existing, where key is their string path, and custom
     * objects that have index keys.
     * If deleting a pre-existing object, dont modify the key-indexed states for
     * it since other occurences of that object may be used in the creation
     * process and those should not be affected. Effectively, removing a pre-
     * existing object amounts to removing it from keyHierarchy.
     *
     * @param {number} key - Key of item to remove.
     */

  }, {
    key: "removeObj",
    value: function removeObj(key) {
      this.setState(function (_ref3) {
        var keyContext = _ref3.keyContext,
            keyValid = _ref3.keyValid,
            keyTypes = _ref3.keyTypes,
            keyComplete = _ref3.keyComplete,
            keyLinkBookmarks = _ref3.keyLinkBookmarks,
            keyLinks = _ref3.keyLinks,
            roundTwoKeys = _ref3.roundTwoKeys,
            keyHierarchy = _ref3.keyHierarchy;

        var contextCopy = _util.object.deepClone(keyContext);

        var validCopy = _util.object.deepClone(keyValid);

        var typesCopy = _util.object.deepClone(keyTypes);

        var keyCompleteCopy = _util.object.deepClone(keyComplete);

        var bookmarksCopy = _underscore["default"].clone(keyLinkBookmarks);

        var linksCopy = _underscore["default"].clone(keyLinks);

        var roundTwoCopy = roundTwoKeys.slice();

        var hierarchy = _underscore["default"].clone(keyHierarchy);

        var dummyHierarchy = _util.object.deepClone(hierarchy);

        var hierKey = key; // the key may be a @id string and not keyIdx if already submitted

        _underscore["default"].keys(keyCompleteCopy).forEach(function (compKey) {
          if (keyCompleteCopy[compKey] === key) {
            hierKey = compKey;
          }
        }); // find hierachy below the object being deleted


        dummyHierarchy = searchHierarchy(dummyHierarchy, hierKey);

        if (dummyHierarchy === null) {
          // occurs when keys cannot be found to delete
          return null;
        } // get a list of all keys to remove


        var toDelete = flattenHierarchy(dummyHierarchy);
        toDelete.push(key); // add this key
        // trimming the hierarchy effectively removes objects from creation process

        var newHierarchy = trimHierarchy(hierarchy, hierKey); // for housekeeping, remove the keys from keyLinkBookmarks, keyLinks, and keyCompleteCopy

        _underscore["default"].forEach(toDelete, function (keyToDelete) {
          if (isNaN(keyToDelete)) return; // only remove creation data for non-sumbitted, non-preexisiting objs
          // remove key from roundTwoKeys if necessary
          // NOTE: submitted custom objects will NOT be removed from this
          // after deletion. Still give user opportunity for second round edits

          if (_underscore["default"].contains(roundTwoCopy, keyToDelete)) {
            var rmIdx = roundTwoCopy.indexOf(keyToDelete);

            if (rmIdx > -1) {
              roundTwoCopy.splice(rmIdx, 1);
            }
          }

          delete typesCopy[keyToDelete];
          delete validCopy[keyToDelete];
          delete contextCopy[keyToDelete];
          delete linksCopy[keyToDelete];
          delete bookmarksCopy[keyToDelete];
          delete keyCompleteCopy[keyToDelete];
        });

        return {
          'keyHierarchy': newHierarchy,
          'keyContext': contextCopy,
          'keyValid': validCopy,
          'keyTypes': typesCopy,
          'keyLinks': linksCopy,
          'keyLinkBookmarks': bookmarksCopy,
          'roundTwoKeys': roundTwoCopy,
          'keyComplete': keyCompleteCopy
        };
      });
    }
    /**
     * Uses an object holding specific data needed to initializing pre-existing
     * objects in the principal object initializing process when cloning/editing.
     * Exclusively called from initializePrincipal. Calls addExistingObj
     */

  }, {
    key: "initExistingObj",
    value: function initExistingObj(_ref4) {
      var path = _ref4.path,
          display = _ref4.display,
          type = _ref4.type,
          field = _ref4.field;
      this.addExistingObj(path, display, type, field, true);
    }
    /**
     * Takes in the @id path of an exisiting object, a display name for it, the
     * object type, the linkTo field type (newLink), and whether or not it's
     * being added during the initializePrincipal process (bool init). Sets up
     * state to contain the newly introduced pre-existing object and adds it into
     * keyHierarchy. The key for pre-existing objects are their @id path. Thus,
     * isNan() for the key of a pre-existing object will return true.
     */

  }, {
    key: "addExistingObj",
    value: function addExistingObj(path, display, type, field) {
      var init = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      this.setState(function (_ref5) {
        var currKey = _ref5.currKey,
            prevKeyHierarchy = _ref5.keyHierarchy,
            prevKeyDisplay = _ref5.keyDisplay,
            prevKeyTypes = _ref5.keyTypes,
            prevKeyLinks = _ref5.keyLinks;
        var parentKeyIdx = init ? 0 : currKey;

        var keyDisplay = _underscore["default"].clone(prevKeyDisplay);

        var keyTypes = _underscore["default"].clone(prevKeyTypes);

        var keyLinks = _underscore["default"].clone(prevKeyLinks);

        var keyHierarchy = modifyHierarchy(_underscore["default"].clone(prevKeyHierarchy), path, parentKeyIdx);
        keyDisplay[path] = display;
        keyTypes[path] = type;
        keyLinks[path] = field;
        return {
          keyHierarchy: keyHierarchy,
          keyDisplay: keyDisplay,
          keyTypes: keyTypes,
          keyLinks: keyLinks
        };
      });
    }
    /**
     * Takes a key and value and sets the corresponding state in this component to the value.
     *
     * Primarily used as a callback to change currKey, in which case we
     * ensure that there are no current uploads of md5 calculations running. If
     * allowed to change keys, attempt to automatically validate the key we are
     * leaving if its validation state == 1 (has no incomplete children). Also
     * remove any hanging Alert error messages from validation.
     */

  }, {
    key: "setSubmissionState",
    value: function setSubmissionState(key, value) {
      var _this$state4 = this.state,
          currKey = _this$state4.currKey,
          upload = _this$state4.upload,
          md5Progress = _this$state4.md5Progress,
          keyValid = _this$state4.keyValid,
          errorCount = _this$state4.errorCount,
          roundTwo = _this$state4.roundTwo,
          keyHierarchy = _this$state4.keyHierarchy,
          keyContext = _this$state4.keyContext,
          keyComplete = _this$state4.keyComplete;
      var stateToSet = {};

      if (typeof this.state[key] !== 'undefined') {
        // this means we're navigating to a new object if true
        if (key === 'currKey' && value !== currKey) {
          // don't allow navigation when we have an uploading file
          // or calculating md5
          if (upload !== null || md5Progress !== null) {
            alert('Please wait for your upload to finish.');
            return;
          } // get rid of any hanging errors


          for (var i = 0; i < errorCount; i++) {
            _Alerts.Alerts.deQueue({
              'title': "Validation error " + parseInt(i + 1)
            });

            stateToSet.errorCount = 0;
          } // skip validation stuff if in roundTwo


          if (!roundTwo) {
            // if current key is ready for validation, first try that
            // but suppress warning messages
            if (keyValid[currKey] === 1) {
              this.submitObject(currKey, true, true);
            } // see if newly-navigated obj is ready for validation


            if (keyValid[value] === 0) {
              var validState = SubmissionView.findValidationState(value, keyHierarchy, keyContext, keyComplete);

              if (validState === 1) {
                var nextKeyValid = _underscore["default"].clone(keyValid);

                nextKeyValid[value] = 1;
                stateToSet['keyValid'] = nextKeyValid;
              }
            }
          } // reset some state


          stateToSet.processingFetch = false;
          stateToSet.uploadStatus = null;
        }

        stateToSet[key] = value;
        this.setState(stateToSet);
      }
    }
    /**
     * Function used to initialize uploads, complete them, and end them on failure.
     *
     * Sets the upload status, upload (which holds the s3 upload manager), and
     * also communicates to app.js that there is an upload occuring.
     * When upload is initialized, calculate the md5sum of the file before uploading.
     * In app, state is changed so users are prompted before navigating away from a running
     * upload. When upload is complete, call finishRoundTwo to finish the object
     * creation process for the file object with the upload.
     */

  }, {
    key: "updateUpload",
    value: function updateUpload(uploadInfo) {
      var _this4 = this;

      var completed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var failed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var stateToSet = {};

      if (completed) {
        stateToSet.uploadStatus = 'Upload complete';
        stateToSet.upload = null;
        stateToSet.file = null;
        this.finishRoundTwo();
        this.setState(stateToSet);
      } else if (failed) {
        var destination = this.state.keyComplete[this.state.currKey];
        var payload = JSON.stringify({
          'status': 'upload failed'
        }); // set status to upload failed for the file

        _util.ajax.promise(destination, 'PATCH', {}, payload).then(function () {
          // doesn't really matter what response is
          stateToSet.uploadStatus = 'Upload failed';
          stateToSet.upload = null;

          _this4.setState(stateToSet);
        });
      } else {
        // must be the initial run
        // Calculate the md5sum for the file held in state and save it to the md5
        // field of the current key's context (this can only be a file due to the
        // submission process). Resets file and md5Progess in state after running.
        var file = this.state.file; // md5 calculation should ONLY occur when current type is file

        if (file === null) return;
        (0, _file.getLargeMD5)(file, this.modifyMD5Progess).then(function (hash) {
          // perform async patch to set md5sum field of the file
          var destination = _this4.state.keyComplete[_this4.state.currKey];
          var payload = JSON.stringify({
            'md5sum': hash
          });

          _util.ajax.promise(destination, 'PATCH', {}, payload).then(function (data) {
            if (data.status && data.status == 'success') {
              _util.console.info('HASH SET TO:', hash, 'FOR', destination);

              stateToSet.upload = uploadInfo;
              stateToSet.md5Progress = null;
              stateToSet.uploadStatus = null;

              _this4.setState(stateToSet);
            } else if (data.status && data.title && data.status == 'error' && data.title == 'Conflict') {
              // md5 key conflict
              stateToSet.uploadStatus = 'MD5 conflicts with another file';
              stateToSet.md5Progress = null;

              _this4.setState(stateToSet);
            } else {
              // error setting md5
              stateToSet.uploadStatus = 'MD5 calculation error';
              stateToSet.md5Progress = null;

              _this4.setState(stateToSet);
            }
          });
        })["catch"](function () {
          stateToSet.uploadStatus = 'MD5 calculation error';
          stateToSet.file = null;
          stateToSet.md5Progress = null;

          _this4.setState(stateToSet);
        });
      }
    }
  }, {
    key: "testPostNewContext",
    value: function testPostNewContext(e) {
      e.preventDefault();
      this.submitObject(this.state.currKey, true);
    }
  }, {
    key: "realPostNewContext",
    value: function realPostNewContext(e) {
      e.preventDefault();
      this.submitObject(this.state.currKey);
    }
    /**
     * Takes the context held in keyContext for a given key idx and returns a
     * copy that has been passed through removeNulls to delete any key-value pair
     * with a null value.
     */

  }, {
    key: "removeNullsFromContext",
    value: function removeNullsFromContext(inKey) {
      var keyContext = this.state.keyContext;
      return removeNulls(_util.object.deepClone(keyContext[inKey]));
    }
    /**
     * Returns true if the given schema has a round two flag within it
     * Used within the submission process to see if items will need second round submission.
     */

  }, {
    key: "checkRoundTwo",
    value: function checkRoundTwo(schema) {
      var fields = schema.properties ? _underscore["default"].keys(schema.properties) : [];

      for (var i = 0; i < fields.length; i++) {
        if (schema.properties[fields[i]]) {
          var fieldSchema = _util.object.getNestedProperty(schema, ['properties', fields[i]], true);

          if (!fieldSchema) {
            continue;
          }

          if (fieldSchema.ff_flag && fieldSchema.ff_flag == 'second round') {
            // this object needs second round submission
            return true;
          }
        }
      }

      return false;
    }
    /**
     * Used to generate a list of fields that have been removed in the submission
     * process. This list will in turn be used to make a deleteFields string
     * that is passed to the server with the PATCH request for editing or
     * second round submission. Takes the patchContext, which is the submission
     * content after removeNulls and submitObject processing, and compares it
     * to the original content (which is passed through removeNulls). If the
     * roundTwo flag is set to true, only operate on roundTwo submission fields.
     * Otherwise, do not operate on roundTwo fields.
     *
     * Returns a list of stirng fieldnames to delete.
     */

  }, {
    key: "buildDeleteFields",
    value: function buildDeleteFields(patchContext, origContext, schema) {
      var _this5 = this;

      var deleteFields = []; // must remove nulls from the orig copy to sync with patchContext

      var origCopy = _util.object.deepClone(origContext);

      origCopy = removeNulls(origCopy);

      var userGroups = _util.JWT.getUserGroups();

      _underscore["default"].keys(origCopy).forEach(function (field) {
        // if patchContext already has a value (such as admin edited
        // import_items fields), don't overwrite
        if (!(0, _submissionFields.isValueNull)(patchContext[field])) {
          return;
        }

        if (schema.properties[field]) {
          var fieldSchema = _util.object.getNestedProperty(schema, ['properties', field], true);

          if (!fieldSchema) {
            return;
          } // skip calculated properties and exclude_from fields


          if (fieldSchema.calculatedProperty && fieldSchema.calculatedProperty === true) {
            return;
          }

          if (fieldSchema.exclude_from && (_underscore["default"].contains(fieldSchema.exclude_from, 'FFedit-create') || fieldSchema.exclude_from == 'FFedit-create')) {
            return;
          } // if the user is admin, they already have these fields available;
          // only register as removed if admin did it intentionally


          if (fieldSchema.permission && fieldSchema.permission == "import_items") {
            if (_underscore["default"].contains(userGroups, 'admin')) deleteFields.push(field);
            return;
          } // check round two fields if the parameter roundTwo is set


          if (fieldSchema.ff_flag && fieldSchema.ff_flag == 'second round') {
            if (_this5.state.roundTwo) deleteFields.push(field);
            return;
          } // if we're here, the submission field was legitimately deleted


          if (!_this5.state.roundTwo) deleteFields.push(field);
        }
      });

      return deleteFields;
    }
    /** Set md5Progress in state to val. Passed as callback to getLargeMD5 */

  }, {
    key: "modifyMD5Progess",
    value: function modifyMD5Progess(val) {
      this.setState({
        'md5Progress': val
      });
    }
    /**
     * Master object submission function. Takes a key index and uses ajax to
     * POST/PATCH the json to the object collection (a new object) or to the
     * specific object path (a pre-existing/roundTwo object). If test=true,
     * the POST is made to the check_only=true endpoint for validation without
     * actual submission.
     *
     * Upon successful submission, reponse data for the newly instantiated object
     * is stored in state (with key equal to the new object's path). On the
     * principal object submission if there are object that require roundTwo
     * submission, this function initializes the roundTwo process by setting
     * this.state.roundTwo to true and the currKey to the first index in the process.
     * If there are no roundTwo objects, completes submission process.
     *
     * Handles roundTwo submission slightly differently. Uses PATCH and kicks off
     * uploads using updateUpload if there is a file given. Completes submission
     * process once all roundTwo objects have been skipped or submitted.
     */

  }, {
    key: "submitObject",
    value: function submitObject(inKey) {
      var _this6 = this;

      var test = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var suppressWarnings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // function to test a POST of the data or actually POST it.
      // validates if test=true, POSTs if test=false.
      var _this$props3 = this.props,
          context = _this$props3.context,
          schemas = _this$props3.schemas,
          setIsSubmitting = _this$props3.setIsSubmitting,
          propNavigate = _this$props3.navigate;
      var _this$state5 = this.state,
          keyValid = _this$state5.keyValid,
          keyTypes = _this$state5.keyTypes,
          errorCount = _this$state5.errorCount,
          currentSubmittingUser = _this$state5.currentSubmittingUser,
          edit = _this$state5.edit,
          roundTwo = _this$state5.roundTwo,
          keyComplete = _this$state5.keyComplete,
          keyContext = _this$state5.keyContext,
          keyDisplay = _this$state5.keyDisplay,
          file = _this$state5.file,
          keyHierarchy = _this$state5.keyHierarchy,
          keyLinks = _this$state5.keyLinks,
          roundTwoKeys = _this$state5.roundTwoKeys,
          callbackHref = _this$state5.callbackHref;
      var stateToSet = {}; // hold next state

      var currType = keyTypes[inKey];
      var currSchema = schemas[currType]; // this will always be reset when stateToSet is implemented

      stateToSet.processingFetch = false;
      stateToSet.keyValid = _underscore["default"].clone(keyValid);
      var finalizedContext = this.removeNullsFromContext(inKey);
      var i; // get rid of any hanging errors

      for (i = 0; i < errorCount; i++) {
        _Alerts.Alerts.deQueue({
          'title': "Validation error " + parseInt(i + 1)
        });

        stateToSet.errorCount = 0;
      }

      this.setState({
        'processingFetch': true
      });

      if (!currentSubmittingUser) {
        _util.console.error('No user account info.');

        stateToSet.keyValid[inKey] = 2;
        this.setState(stateToSet);
        return;
      }

      var submitProcessContd = function () {
        var userLab = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var userAward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        // if editing, use pre-existing award, lab, and submitted_by
        // this should only be done on the primary object
        if (edit && inKey === 0 && context.award && context.lab) {
          if (currSchema.properties.award && !('award' in finalizedContext)) {
            finalizedContext.award = _util.object.itemUtil.atId(context.award);
          }

          if (currSchema.properties.lab && !('lab' in finalizedContext)) {
            finalizedContext.lab = _util.object.itemUtil.atId(context.lab);
          } // an admin is editing. Use the pre-existing submitted_by
          // otherwise, permissions won't let us change this field


          if (currentSubmittingUser.groups && _underscore["default"].contains(currentSubmittingUser.groups, 'admin')) {
            if (context.submitted_by) {
              finalizedContext.submitted_by = _util.object.itemUtil.atId(context.submitted_by);
            } else {
              // use current user
              finalizedContext.submitted_by = _util.object.itemUtil.atId(currentSubmittingUser);
            }
          }
        } else if (userLab && userAward && currType !== 'User') {
          // Otherwise, use lab/award of user submitting unless values present
          // Skip this is we are working on a User object
          if (currSchema.properties.award && !('award' in finalizedContext)) {
            finalizedContext.award = _util.object.itemUtil.atId(userAward);
          }

          if (currSchema.properties.lab && !('lab' in finalizedContext)) {
            finalizedContext.lab = _util.object.itemUtil.atId(userLab);
          }
        }

        var destination;
        var actionMethod;
        var deleteFields; // used to keep track of fields to delete with PATCH for edit/round two; will become comma-separated string

        if (roundTwo) {
          // change actionMethod and destination based on edit/round two
          destination = keyComplete[inKey];
          actionMethod = 'PATCH';
          var alreadySubmittedContext = keyContext[destination]; // roundTwo flag set to true for second round

          deleteFields = _this6.buildDeleteFields(finalizedContext, alreadySubmittedContext, currSchema);
        } else if (edit && inKey === 0) {
          destination = _util.object.itemUtil.atId(context);
          actionMethod = 'PATCH';
          deleteFields = _this6.buildDeleteFields(finalizedContext, context, currSchema);
        } else {
          destination = '/' + currType + '/';
          actionMethod = 'POST';
        }

        if (test) {
          // if testing validation, use check_only=true (see /types/base.py)'
          destination += '?check_only=true';
        } else {
          _util.console.log('FINALIZED PAYLOAD:', finalizedContext);

          _util.console.log('DELETE FIELDS:', deleteFields);
        }

        var payload = JSON.stringify(finalizedContext); // add delete_fields parameter to request if necessary

        if (deleteFields && Array.isArray(deleteFields) && deleteFields.length > 0) {
          var deleteString = deleteFields.join(',');
          destination = destination + (test ? '&' : '?') + 'delete_fields=' + deleteString;

          _util.console.log('DESTINATION:', destination);
        } // Perform request


        _util.ajax.promise(destination, actionMethod, {}, payload).then(function (response) {
          if (response.status && response.status !== 'success') {
            // error
            stateToSet.keyValid[inKey] = 2;

            if (!suppressWarnings) {
              var errorList = response.errors || [response.detail] || []; // make an alert for each error description

              stateToSet.errorCount = errorList.length;

              for (i = 0; i < errorList.length; i++) {
                var detail = errorList[i].description || errorList[i] || "Unidentified error";

                if (errorList[i].name) {
                  detail += '. ' + errorList[i].name + ' in ' + keyDisplay[inKey];
                } else {
                  detail += '. See ' + keyDisplay[inKey];
                }

                _Alerts.Alerts.queue({
                  'title': "Validation error " + parseInt(i + 1),
                  'message': detail,
                  'style': 'danger'
                });
              }

              setTimeout(_util.layout.animateScrollTo(0), 100);
            }

            _this6.setState(stateToSet);
          } else {
            var responseData;
            var submitted_at_id;

            if (test) {
              stateToSet.keyValid[inKey] = 3;

              _this6.setState(stateToSet);

              return;
            } else {
              var _response$Graph = _slicedToArray(response['@graph'], 1);

              responseData = _response$Graph[0];
              submitted_at_id = _util.object.itemUtil.atId(responseData);
            } // handle submission for round two


            if (roundTwo) {
              // there is a file
              if (file && responseData.upload_credentials) {
                // add important info to result from finalizedContext
                // that is not added from /types/file.py get_upload
                var creds = responseData.upload_credentials;

                require.ensure(['../util/aws'], function (require) {
                  var awsUtil = require('../util/aws'),
                      upload_manager = awsUtil.s3UploadFile(file, creds);

                  if (upload_manager === null) {
                    // bad upload manager. Cause an alert
                    alert("Something went wrong initializing the upload. Please contact the 4DN-DCIC team.");
                  } else {
                    // this will set off a chain of aync events.
                    // first, md5 will be calculated and then the
                    // file will be uploaded to s3. If all of this
                    // is succesful, call finishRoundTwo.
                    stateToSet.uploadStatus = null;

                    _this6.setState(stateToSet);

                    _this6.updateUpload(upload_manager);
                  }
                }, "aws-utils-bundle");
              } else {
                // state cleanup for this key
                _this6.finishRoundTwo();

                _this6.setState(stateToSet);
              }
            } else {
              stateToSet.keyValid[inKey] = 4; // Perform final steps when object is submitted
              // *** SHOULD THIS STUFF BE BROKEN OUT INTO ANOTHER FXN?
              // find key of parent object, starting from top of hierarchy

              var parentKey = parseInt(findParentFromHierarchy(keyHierarchy, inKey)); // navigate to parent obj if it was found. Else, go to top level

              stateToSet.currKey = parentKey !== null && !isNaN(parentKey) ? parentKey : 0;

              var typesCopy = _underscore["default"].clone(keyTypes);

              var keyCompleteCopy = _underscore["default"].clone(keyComplete);

              var linksCopy = _underscore["default"].clone(keyLinks);

              var displayCopy = _underscore["default"].clone(keyDisplay); // set contextCopy to returned data from POST


              var contextCopy = _underscore["default"].clone(keyContext);

              var roundTwoCopy = roundTwoKeys.slice(); // update the state storing completed objects.

              keyCompleteCopy[inKey] = submitted_at_id; // represent the submitted object with its new path
              // rather than old keyIdx.

              linksCopy[submitted_at_id] = linksCopy[inKey];
              typesCopy[submitted_at_id] = currType;
              displayCopy[submitted_at_id] = displayCopy[inKey];
              contextCopy[submitted_at_id] = responseData;
              contextCopy[inKey] = buildContext(responseData, currSchema, null, true, false);
              stateToSet.keyLinks = linksCopy;
              stateToSet.keyTypes = typesCopy;
              stateToSet.keyComplete = keyCompleteCopy;
              stateToSet.keyDisplay = displayCopy;
              stateToSet.keyContext = contextCopy; // update roundTwoKeys if necessary

              var needsRoundTwo = _this6.checkRoundTwo(currSchema);

              if (needsRoundTwo && !_underscore["default"].contains(roundTwoCopy, inKey)) {
                // was getting an error where this could be str
                roundTwoCopy.push(parseInt(inKey));
                stateToSet.roundTwoKeys = roundTwoCopy;
              } // inKey is 0 for the primary object


              if (inKey === 0) {
                // see if we need to go into round two submission
                if (roundTwoCopy.length === 0) {
                  // we're done!
                  setIsSubmitting(false, function () {
                    propNavigate(callbackHref || submitted_at_id);
                  });
                } else {
                  // break this out into another fxn?
                  // roundTwo initiation
                  stateToSet.roundTwo = true;
                  stateToSet.currKey = roundTwoCopy[0]; // reset validation state for all round two keys

                  for (i = 0; i < roundTwoCopy.length; i++) {
                    stateToSet.keyValid[roundTwoCopy[i]] = 0;
                  }

                  alert('Success! All objects were submitted. However, one or more have additional fields that can be only filled in second round submission. You will now be guided through this process for each object.');

                  _this6.setState(stateToSet);
                }
              } else {
                alert(keyDisplay[inKey] + ' was successfully submitted.');

                _this6.setState(stateToSet);
              }
            }

            _reactTooltip["default"].rebuild();
          }
        });
      };

      if (currentSubmittingUser && Array.isArray(currentSubmittingUser.submits_for) && currentSubmittingUser.submits_for.length > 0) {
        // use first lab for now
        _util.ajax.promise(_util.object.itemUtil.atId(currentSubmittingUser.submits_for[0])).then(function (myLab) {
          // use first award for now
          var myAward = myLab && Array.isArray(myLab.awards) && myLab.awards.length > 0 && myLab.awards[0] || null;
          submitProcessContd(myLab, myAward);
        });
      } else {
        submitProcessContd();
      }
    }
    /**
     * Finish the roundTwo process for the current key. Removes the currKey from
     * this.state.roundTwoKeys and modifies state to finish out for that object.
     * If there are no keys left in roundTwoKeys, navigate to the path of the
     * principal object we created.
     */

  }, {
    key: "finishRoundTwo",
    value: function finishRoundTwo() {
      var _this7 = this;

      this.setState(function (_ref6) {
        var currKey = _ref6.currKey,
            keyValid = _ref6.keyValid,
            _ref6$roundTwoKeys = _ref6.roundTwoKeys,
            roundTwoKeys = _ref6$roundTwoKeys === void 0 ? [] : _ref6$roundTwoKeys;

        var validationCopy = _underscore["default"].clone(keyValid);

        var roundTwoCopy = roundTwoKeys.slice();
        validationCopy[currKey] = 4;

        if (_underscore["default"].contains(roundTwoCopy, currKey)) {
          var rmIdx = roundTwoCopy.indexOf(currKey);

          if (rmIdx > -1) {
            roundTwoCopy.splice(rmIdx, 1);
          }
        }

        return {
          // navigate to next key in roundTwoKeys
          currKey: roundTwoCopy.length > 0 ? roundTwoCopy[0] : currKey,
          uploadStatus: null,
          keyValid: validationCopy,
          roundTwoKeys: roundTwoCopy
        };
      }, function () {
        var _this7$props = _this7.props,
            setIsSubmitting = _this7$props.setIsSubmitting,
            propNavigate = _this7$props.navigate;
        var _this7$state = _this7.state,
            keyComplete = _this7$state.keyComplete,
            _this7$state$roundTwo = _this7$state.roundTwoKeys,
            roundTwoKeys = _this7$state$roundTwo === void 0 ? [] : _this7$state$roundTwo,
            callbackHref = _this7$state.callbackHref;

        if (roundTwoKeys.length === 0) {
          // we're done!
          setIsSubmitting(false, function () {
            propNavigate(callbackHref || keyComplete[0]);
          });
        }
      });
    }
  }, {
    key: "cancelCreateNewObject",
    value: function cancelCreateNewObject() {
      this.setState(function (_ref7) {
        var creatingIdx = _ref7.creatingIdx,
            keyContext = _ref7.keyContext,
            currKey = _ref7.currKey,
            creatingLinkForField = _ref7.creatingLinkForField;
        if (!creatingIdx) return null;

        var nextKeyContext = _underscore["default"].clone(keyContext);

        var currentContextPointer = nextKeyContext[currKey];

        _underscore["default"].pairs(currentContextPointer).forEach(function (_ref8) {
          var _ref9 = _slicedToArray(_ref8, 2),
              field = _ref9[0],
              idx = _ref9[1];

          if (field === (typeof creatingLinkForField === 'string' && creatingLinkForField)) {
            // Unset value to null
            if (idx === creatingIdx) {
              currentContextPointer[field] = null;
            } // Remove value from array.


            if (Array.isArray(idx)) {
              var idxInArray = idx.indexOf(creatingIdx);

              if (idxInArray > -1) {
                currentContextPointer[field].splice(idxInArray, 1);
              }
            }
          }
        });

        return {
          'ambiguousIdx': null,
          'ambiguousType': null,
          'ambiguousSelected': null,
          'creatingAlias': '',
          'creatingIdx': null,
          'creatingType': null,
          'creatingLink': null,
          'keyContext': nextKeyContext,
          'creatingLinkForField': null
        };
      });
    }
    /** Navigate to version of same page we're on, minus the `currentAction` URI parameter. */

  }, {
    key: "cancelCreatePrimaryObject",
    value: function cancelCreatePrimaryObject() {
      var skipAskToLeave = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var callbackHref = this.state.callbackHref;
      var _this$props4 = this.props,
          href = _this$props4.href,
          navigate = _this$props4.navigate,
          setIsSubmitting = _this$props4.setIsSubmitting;

      var leaveFunc = function () {
        // Navigate out.
        var nextURI;
        var navOpts = {};

        if (callbackHref) {
          nextURI = callbackHref;
        } else {
          var parts = _underscore["default"].clone((0, _util.memoizedUrlParse)(href));

          var modifiedQuery = _underscore["default"].omit(parts.query, 'currentAction');

          var modifiedSearch = _queryString["default"].stringify(modifiedQuery);

          parts.query = modifiedQuery;
          parts.search = (modifiedSearch.length > 0 ? '?' : '') + modifiedSearch;
          nextURI = _url["default"].format(parts);
          navOpts.skipRequest = true;
        }

        navigate(nextURI, navOpts);
      };

      if (skipAskToLeave === true) {
        return setIsSubmitting(false, leaveFunc);
      } else {
        return leaveFunc();
      }
    }
    /**
     * Render the navigable SubmissionTree and IndividualObjectView for the
     * current key. Also render modals for ambiguous type selection or alias
     * creation if necessary.
     */

  }, {
    key: "render",
    value: function render() {
      _util.console.log('TOP LEVEL STATE:', this.state);

      var schemas = this.props.schemas;
      var _this$state6 = this.state,
          currKey = _this$state6.currKey,
          keyContext = _this$state6.keyContext,
          ambiguousIdx = _this$state6.ambiguousIdx,
          ambiguousType = _this$state6.ambiguousType,
          creatingType = _this$state6.creatingType,
          creatingIdx = _this$state6.creatingIdx,
          keyTypes = _this$state6.keyTypes,
          fullScreen = _this$state6.fullScreen,
          keyDisplay = _this$state6.keyDisplay,
          keyHierarchy = _this$state6.keyHierarchy; // see if initialized

      if (!keyContext || currKey === null) {
        return null;
      }

      var showAmbiguousModal = ambiguousIdx !== null && ambiguousType !== null;
      var currType = keyTypes[currKey];
      var currContext = keyContext[currKey];
      var navCol = "mb-4 " + (fullScreen ? 'submission-hidden-nav' : 'col-12 col-md-3');
      var bodyCol = fullScreen ? 'col-12' : 'col-12 col-md-9'; // remove context and navigate from this.props

      var _this$props5 = this.props,
          context = _this$props5.context,
          navigate = _this$props5.navigate,
          propsToPass = _objectWithoutProperties(_this$props5, ["context", "navigate"]);

      keyDisplay[currKey] || currType;
      return _react["default"].createElement("div", {
        className: "submission-view-page-container container",
        id: "content"
      }, _react["default"].createElement(TypeSelectModal, _extends({
        show: showAmbiguousModal
      }, _underscore["default"].pick(this.state, 'ambiguousIdx', 'ambiguousType', 'ambiguousSelected', 'currKey', 'creatingIdx'), _underscore["default"].pick(this, 'buildAmbiguousEnumEntry', 'submitAmbiguousType', 'cancelCreateNewObject', 'cancelCreatePrimaryObject'), {
        schemas: schemas
      })), _react["default"].createElement(AliasSelectModal, _extends({
        show: !showAmbiguousModal && creatingIdx !== null && creatingType !== null
      }, _underscore["default"].pick(this.state, 'creatingAlias', 'creatingType', 'creatingAliasMessage', 'currKey', 'creatingIdx', 'currentSubmittingUser'), {
        handleAliasChange: this.handleAliasChange,
        submitAlias: this.submitAlias,
        cancelCreateNewObject: this.cancelCreateNewObject,
        cancelCreatePrimaryObject: this.cancelCreatePrimaryObject
      })), _react["default"].createElement(WarningBanner, {
        cancelCreatePrimaryObject: this.cancelCreatePrimaryObject
      }, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-danger",
        onClick: this.cancelCreatePrimaryObject
      }, "Cancel / Exit"), _react["default"].createElement(ValidationButton, _extends({}, _underscore["default"].pick(this.state, 'currKey', 'keyValid', 'md5Progress', 'upload', 'roundTwo', 'processingFetch'), {
        testPostNewContext: this.testPostNewContext,
        finishRoundTwo: this.finishRoundTwo
      })), _react["default"].createElement(SubmitButton, _extends({}, _underscore["default"].pick(this.state, 'keyValid', 'currKey', 'roundTwo', 'upload', 'processingFetch', 'md5Progress'), {
        realPostNewContext: this.realPostNewContext
      }))), _react["default"].createElement(DetailTitleBanner, _extends({
        hierarchy: keyHierarchy,
        setSubmissionState: this.setSubmissionState,
        schemas: schemas
      }, _underscore["default"].pick(this.state, 'keyContext', 'keyTypes', 'keyDisplay', 'currKey', 'fullScreen'))), _react["default"].createElement("div", {
        className: "clearfix row"
      }, _react["default"].createElement("div", {
        className: navCol
      }, _react["default"].createElement(_SubmissionTree.SubmissionTree, _extends({
        setSubmissionState: this.setSubmissionState,
        hierarchy: keyHierarchy,
        schemas: schemas
      }, _underscore["default"].pick(this.state, 'keyValid', 'keyTypes', 'keyDisplay', 'keyComplete', 'currKey', 'keyLinkBookmarks', 'keyLinks', 'keyHierarchy')))), _react["default"].createElement("div", {
        className: bodyCol
      }, _react["default"].createElement(IndividualObjectView, _extends({}, propsToPass, {
        schemas: schemas,
        currType: currType,
        currContext: currContext,
        modifyKeyContext: this.modifyKeyContext,
        initCreateObj: this.initCreateObj,
        removeObj: this.removeObj,
        addExistingObj: this.addExistingObj,
        setSubmissionState: this.setSubmissionState,
        modifyAlias: this.modifyAlias,
        updateUpload: this.updateUpload,
        hierarchy: keyHierarchy
      }, _underscore["default"].pick(this.state, 'keyDisplay', 'keyComplete', 'keyIter', 'currKey', 'keyContext', 'upload', 'uploadStatus', 'md5Progress', 'roundTwo', 'currentSubmittingUser'))))));
    }
  }]);

  return SubmissionView;
}(_react["default"].PureComponent);
/**
 * Generate JSX for a validation button. Disabled unless validation state == 1
 * (when all children are complete and no errors/unsubmitted) or == 2
 * (submitted by validation errors). If the submission is processing, render
 * a spinner icon.
 * When roundTwo, validation becomes Skip, which allows you to skip roundTwo
 * submissions for an object. Disable when the is an initialized upload or the
 * md5 is calculating.
 */


exports["default"] = SubmissionView;

var ValidationButton = _react["default"].memo(function (props) {
  var currKey = props.currKey,
      keyValid = props.keyValid,
      md5Progress = props.md5Progress,
      upload = props.upload,
      roundTwo = props.roundTwo,
      processingFetch = props.processingFetch,
      finishRoundTwo = props.finishRoundTwo,
      testPostNewContext = props.testPostNewContext;
  var validity = keyValid[currKey]; // when roundTwo, replace the validation button with a Skip
  // button that completes the submission process for currKey

  if (roundTwo) {
    if (upload === null && md5Progress === null) {
      return _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-warning",
        onClick: finishRoundTwo
      }, "Skip");
    } else {
      return _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-warning",
        disabled: true
      }, "Skip");
    }
  } else if (validity === 3 || validity === 4) {
    return _react["default"].createElement("button", {
      type: "button",
      className: "btn btn-info",
      disabled: true
    }, "Validated");
  } else if (validity === 2) {
    if (processingFetch) {
      return _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-danger",
        disabled: true
      }, _react["default"].createElement("i", {
        className: "icon icon-spin icon-circle-notch fas"
      }));
    } else {
      return _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-danger",
        onClick: testPostNewContext
      }, "Validate");
    }
  } else if (validity === 1) {
    if (processingFetch) {
      return _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-info",
        disabled: true
      }, _react["default"].createElement("i", {
        className: "icon icon-spin icon-circle-notch fas"
      }));
    } else {
      return _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-info",
        onClick: testPostNewContext
      }, "Validate");
    }
  } else {
    return _react["default"].createElement("button", {
      type: "button",
      className: "btn btn-info",
      disabled: true
    }, "Validate");
  }
});
/**
 * Generate JSX for the the button that allows users to submit their custom
 * objects. Only active when validation state == 3 (validation successful).
 *
 * In roundTwo, there is no validation step, so only inactive when there is
 * an active upload of md5 calculation.
 */


var SubmitButton = _react["default"].memo(function (props) {
  var keyValid = props.keyValid,
      currKey = props.currKey,
      roundTwo = props.roundTwo,
      upload = props.upload,
      processingFetch = props.processingFetch,
      md5Progress = props.md5Progress,
      realPostNewContext = props.realPostNewContext;
  var validity = keyValid[currKey];

  if (roundTwo) {
    if (upload !== null || processingFetch || md5Progress !== null) {
      return _react["default"].createElement("button", {
        type: "button",
        disabled: true,
        className: "btn btn-success"
      }, _react["default"].createElement("i", {
        className: "icon icon-spin icon-circle-notch fas"
      }));
    } else {
      return _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-success",
        onClick: realPostNewContext
      }, "Submit");
    }
  } else if (validity == 3) {
    if (processingFetch) {
      return _react["default"].createElement("button", {
        type: "button",
        disabled: true,
        className: "btn btn-success"
      }, _react["default"].createElement("i", {
        className: "icon icon-spin icon-circle-notch fas"
      }));
    } else {
      return _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-success",
        onClick: realPostNewContext
      }, "Submit");
    }
  } else if (validity == 4) {
    return _react["default"].createElement("button", {
      type: "button",
      className: "btn btn-success",
      disabled: true
    }, "Submitted");
  } else {
    return _react["default"].createElement("button", {
      type: "button",
      className: "btn btn-success",
      disabled: true
    }, "Submit");
  }
});

var WarningBanner = _react["default"].memo(function (props) {
  var children = props.children;
  return _react["default"].createElement("div", {
    className: "mb-2 mt-1 text-400 warning-banner"
  }, _react["default"].createElement("div", {
    className: "row"
  }, _react["default"].createElement("div", {
    className: "col"
  }, "Please note: your work will be lost if you navigate away from, refresh or close this page while submitting. The submission process is under active development and features may change."), _react["default"].createElement("div", {
    className: "col-md-auto"
  }, _react["default"].createElement("div", {
    className: "action-buttons-container text-right"
  }, children))));
});

var DetailTitleBanner =
/*#__PURE__*/
function (_React$PureComponent2) {
  _inherits(DetailTitleBanner, _React$PureComponent2);

  _createClass(DetailTitleBanner, null, [{
    key: "getListOfKeysInPath",

    /**
     * Traverse keyHierarchy option to get a list of hierarchical keys, e.g. 0,1,4 if are on currKey 4 that is a child of currKey 1 that is a child of currKey 0.
     *
     * @param {Object} hierachy - Hierarchy as defined on state of SubmissionView components.
     * @param {number} currKey - Current key of Object/Item we're editing.
     * @returns {number[]} List of keys leading from 0 to currKey.
     */
    value: function getListOfKeysInPath(hierachy, currKey) {
      function findNestedKey(obj) {
        if (typeof obj[currKey] !== 'undefined') {
          return [currKey];
        } else {
          var nestedFound = _underscore["default"].find(_underscore["default"].map(_underscore["default"].pairs(obj), // p[0] = key, p[1] = child obj with keys
          function (p) {
            return [p[0], findNestedKey(p[1])];
          }), function (p) {
            return typeof p[1] !== 'undefined' && p[1] !== null;
          });

          if (nestedFound) {
            return [parseInt(nestedFound[0])].concat(nestedFound[1]);
          }
        }
      }

      return findNestedKey(hierachy);
    }
  }, {
    key: "getContextPropertyNameOfNextKey",
    value: function getContextPropertyNameOfNextKey(context, nextKey) {
      var getArrayIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var foundPropertyName = null;
      var arrayIdx = null;

      _underscore["default"].pairs(context).forEach(function (p) {
        if (foundPropertyName) return;

        if (p[1] === nextKey) {
          foundPropertyName = p[0];
        } // Remove value from array.


        if (Array.isArray(p[1])) {
          arrayIdx = p[1].indexOf(nextKey);

          if (typeof arrayIdx === 'number' && arrayIdx > -1) {
            foundPropertyName = p[0];
          } else {
            arrayIdx = null;
          }
        }
      });

      if (getArrayIndex) {
        return [foundPropertyName, arrayIdx];
      }

      return foundPropertyName;
    }
  }]);

  function DetailTitleBanner(props) {
    var _this8;

    _classCallCheck(this, DetailTitleBanner);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(DetailTitleBanner).call(this, props));
    _this8.generateCrumbTitle = _this8.generateCrumbTitle.bind(_assertThisInitialized(_this8));
    _this8.toggleOpen = _underscore["default"].throttle(_this8.toggleOpen.bind(_assertThisInitialized(_this8)), 500);
    _this8.generateHierarchicalTitles = _this8.generateHierarchicalTitles.bind(_assertThisInitialized(_this8));
    _this8.state = {
      'open': true
    };
    return _this8;
  }

  _createClass(DetailTitleBanner, [{
    key: "handleClick",
    value: function handleClick(keyIdx, e) {
      e.preventDefault();
      this.props.setSubmissionState('currKey', keyIdx);
    }
  }, {
    key: "toggleOpen",
    value: function toggleOpen(e) {
      e.preventDefault();
      this.setState(function (_ref10) {
        var open = _ref10.open;
        return {
          'open': !open
        };
      });
    }
  }, {
    key: "generateCrumbTitle",
    value: function generateCrumbTitle(numKey) {
      var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var hierarchyKeyList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var _this$props6 = this.props,
          keyTypes = _this$props6.keyTypes,
          keyDisplay = _this$props6.keyDisplay,
          hierarchy = _this$props6.hierarchy,
          schemas = _this$props6.schemas,
          fullScreen = _this$props6.fullScreen,
          actionButtons = _this$props6.actionButtons,
          keyContext = _this$props6.keyContext;

      if (hierarchyKeyList === null) {
        hierarchyKeyList = [numKey];
      }

      var icon = i === 0 ? null : _react["default"].createElement("i", {
        className: "icon icon-fw"
      }, "\u21B5");
      var isLast = i + 1 === hierarchyKeyList.length;
      var parentPropertyName = null;

      if (i !== 0) {
        try {
          var _DetailTitleBanner$ge = DetailTitleBanner.getContextPropertyNameOfNextKey(keyContext[hierarchyKeyList[i - 1]], hierarchyKeyList[i], true),
              _DetailTitleBanner$ge2 = _slicedToArray(_DetailTitleBanner$ge, 2),
              parentPropertyNameUnsanitized = _DetailTitleBanner$ge2[0],
              parentPropertyValueIndex = _DetailTitleBanner$ge2[1];

          parentPropertyName = _util.schemaTransforms.lookupFieldTitle(parentPropertyNameUnsanitized, schemas, keyTypes[hierarchyKeyList[i - 1]]);

          if (parentPropertyValueIndex !== null) {
            parentPropertyName += ' (Item #' + (parentPropertyValueIndex + 1) + ')';
          }
        } catch (e) {
          _util.console.warn('Couldnt get property name for', keyContext[hierarchyKeyList[i - 1]], hierarchyKeyList[i]);
        }
      }

      return _react["default"].createElement(_Collapse.Collapse, {
        "in": true,
        appear: hierarchyKeyList.length !== 1,
        key: i
      }, _react["default"].createElement("div", {
        className: "title-crumb depth-level-" + i + (isLast ? ' last-title' : ' mid-title')
      }, _react["default"].createElement("div", {
        className: "submission-working-title"
      }, _react["default"].createElement("span", {
        onClick: this.handleClick.bind(this, numKey)
      }, icon, parentPropertyName ? _react["default"].createElement("span", {
        className: "next-property-name"
      }, parentPropertyName, ": ") : null, _react["default"].createElement("span", {
        className: "working-subtitle"
      }, _util.schemaTransforms.getTitleForType(keyTypes[numKey], schemas)), " ", _react["default"].createElement("span", null, keyDisplay[numKey])))));
    }
  }, {
    key: "generateHierarchicalTitles",
    value: function generateHierarchicalTitles() {
      var _this$props7 = this.props,
          hierarchy = _this$props7.hierarchy,
          currKey = _this$props7.currKey;
      return _underscore["default"].map(DetailTitleBanner.getListOfKeysInPath(hierarchy, currKey), this.generateCrumbTitle);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          fullScreen = _this$props8.fullScreen,
          currKey = _this$props8.currKey;
      var open = this.state.open;
      if (fullScreen) return null;
      return _react["default"].createElement("h3", {
        className: "crumbs-title mb-2"
      }, _react["default"].createElement("div", {
        className: "subtitle-heading form-section-heading mb-08"
      }, _react["default"].createElement("span", {
        className: "inline-block clickable",
        onClick: this.toggleOpen
      }, "Currently Editing ", currKey > 0 ? _react["default"].createElement("i", {
        className: "icon icon-fw fas icon-caret-" + (open ? 'down' : 'right')
      }) : null)), open ? this.generateHierarchicalTitles() : this.generateCrumbTitle(currKey));
    }
  }]);

  return DetailTitleBanner;
}(_react["default"].PureComponent);
/** TODO: DropdownButton to be v4 bootstrap compliant */


var TypeSelectModal =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TypeSelectModal, _React$Component);

  function TypeSelectModal(props) {
    var _this9;

    _classCallCheck(this, TypeSelectModal);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(TypeSelectModal).call(this, props));
    _this9.onHide = _this9.onHide.bind(_assertThisInitialized(_this9));
    _this9.onContainerKeyDown = _this9.onContainerKeyDown.bind(_assertThisInitialized(_this9));
    return _this9;
  }

  _createClass(TypeSelectModal, [{
    key: "onHide",
    value: function onHide() {
      var _this$props9 = this.props,
          ambiguousIdx = _this$props9.ambiguousIdx,
          cancelCreatePrimaryObject = _this$props9.cancelCreatePrimaryObject,
          cancelCreateNewObject = _this$props9.cancelCreateNewObject;

      if (ambiguousIdx === null || ambiguousIdx === 0) {
        // If just starting (creating first item / idx), navigate to non-edit version of page we are currently on.
        cancelCreatePrimaryObject(true);
      } else if (ambiguousIdx > 0) {
        // Else cancel creating new object by unsetting temporary state & values.
        cancelCreateNewObject();
      }
    }
  }, {
    key: "onContainerKeyDown",
    value: function onContainerKeyDown(enterKeyCallback, event) {
      if (event.which === 13 || event.keyCode === 13) {
        enterKeyCallback(event);
        return false;
      }

      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props10 = this.props,
          show = _this$props10.show,
          ambiguousType = _this$props10.ambiguousType,
          ambiguousSelected = _this$props10.ambiguousSelected,
          buildAmbiguousEnumEntry = _this$props10.buildAmbiguousEnumEntry,
          submitAmbiguousType = _this$props10.submitAmbiguousType,
          schemas = _this$props10.schemas;
      if (!show) return null;

      var itemTypeHierarchy = _util.schemaTransforms.schemasToItemTypeHierarchy(schemas);

      var ambiguousDescrip = null;

      if (ambiguousSelected !== null && schemas[ambiguousSelected].description) {
        ambiguousDescrip = schemas[ambiguousSelected].description;
      }

      return _react["default"].createElement(_reactBootstrap.Modal, {
        show: true,
        onHide: this.onHide,
        className: "submission-view-modal"
      }, _react["default"].createElement(_reactBootstrap.Modal.Header, null, _react["default"].createElement(_reactBootstrap.Modal.Title, null, 'Multiple object types found for your new ' + ambiguousType)), _react["default"].createElement(_reactBootstrap.Modal.Body, null, _react["default"].createElement("div", {
        onKeyDown: this.onContainerKeyDown.bind(this, submitAmbiguousType)
      }, _react["default"].createElement("p", null, "Please select a specific object type from the menu below."), _react["default"].createElement("div", {
        className: "input-wrapper mb-15"
      }, _react["default"].createElement(_DropdownButton.DropdownButton, {
        id: "dropdown-type-select",
        title: ambiguousSelected || "No value"
      }, ambiguousType !== null ? _underscore["default"].map(_underscore["default"].keys(itemTypeHierarchy[ambiguousType]), function (val) {
        return buildAmbiguousEnumEntry(val);
      }) : null)), ambiguousDescrip ? _react["default"].createElement("div", {
        className: "mb-15 mt-15"
      }, _react["default"].createElement("h5", {
        className: "text-500 mb-02"
      }, "Description"), ambiguousDescrip) : null, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-primary",
        disabled: ambiguousSelected === null,
        onClick: submitAmbiguousType
      }, "Submit"))));
    }
  }]);

  return TypeSelectModal;
}(_react["default"].Component);
/** Ordinary React Component which just inherits TypeSelectModal.onHide() */


var AliasSelectModal =
/*#__PURE__*/
function (_TypeSelectModal) {
  _inherits(AliasSelectModal, _TypeSelectModal);

  function AliasSelectModal() {
    _classCallCheck(this, AliasSelectModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(AliasSelectModal).apply(this, arguments));
  }

  _createClass(AliasSelectModal, [{
    key: "render",
    value: function render() {
      var _this$props11 = this.props,
          show = _this$props11.show,
          creatingType = _this$props11.creatingType,
          creatingAlias = _this$props11.creatingAlias,
          handleAliasChange = _this$props11.handleAliasChange,
          creatingAliasMessage = _this$props11.creatingAliasMessage,
          submitAlias = _this$props11.submitAlias,
          currentSubmittingUser = _this$props11.currentSubmittingUser;
      if (!show) return null;
      var disabledBtn = creatingAlias.indexOf(':') < 0 || creatingAlias.indexOf(':') + 1 === creatingAlias.length;
      return _react["default"].createElement(_reactBootstrap.Modal, {
        show: true,
        onHide: this.onHide,
        className: "submission-view-modal"
      }, _react["default"].createElement(_reactBootstrap.Modal.Header, null, _react["default"].createElement(_reactBootstrap.Modal.Title, null, "Give your new ", creatingType, " an alias")), _react["default"].createElement(_reactBootstrap.Modal.Body, null, _react["default"].createElement("div", {
        onKeyDown: this.onContainerKeyDown.bind(this, submitAlias)
      }, _react["default"].createElement("p", {
        className: "mt-0 mb-1"
      }, "Aliases are lab specific identifiers to reference an object. The format is ", _react["default"].createElement("code", null, '<lab-name>:<identifier>'), " - a lab name and an identifier separated by a colon, e.g. ", _react["default"].createElement("code", null, "dcic-lab:42"), "."), _react["default"].createElement("p", {
        className: "mt-0 mb-1"
      }, "Please create your own alias to help you to refer to this Item later."), _react["default"].createElement("div", {
        className: "input-wrapper mt-2 mb-2"
      }, _react["default"].createElement(_submissionFields.AliasInputField, {
        value: creatingAlias,
        errorMessage: creatingAliasMessage,
        onAliasChange: handleAliasChange,
        currentSubmittingUser: currentSubmittingUser,
        withinModal: true
      })), creatingAliasMessage ? _react["default"].createElement("div", {
        style: {
          'marginBottom': '15px',
          'color': '#7e4544',
          'fontSize': '1.2em'
        }
      }, creatingAliasMessage) : null, _react["default"].createElement("div", {
        className: "text-right"
      }, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-primary",
        disabled: disabledBtn,
        onClick: submitAlias
      }, "Submit")))));
    }
  }]);

  return AliasSelectModal;
}(TypeSelectModal);
/**
 * Main view for editing a specific object. This includes all non-same level
 * linkTo object relationships and non-file upload fields.
 * Essentially, this takes data held by the container component and passes it down
 * to the correct BuildFields. Also interfaces with SubmissionView to change
 * the context for this specific object and create custom and/or pre-existing
 * objects. Render changes slightly for RoundTwo.
 *
 * @see SubmissionView
 * @prop {number} currKey - Current key being edited.
 *
 * @todo
 * Use _.bindAll, make sure setState is using functional updater anywhere state update may derive from other state.
 */


var IndividualObjectView =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(IndividualObjectView, _React$Component2);

  function IndividualObjectView(props) {
    var _this10;

    _classCallCheck(this, IndividualObjectView);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(IndividualObjectView).call(this, props));

    _underscore["default"].bindAll(_assertThisInitialized(_this10), 'modifyNewContext', 'fetchAndValidateItem', 'checkObjectRemoval', 'selectObj', 'selectComplete', 'selectCancel', 'initiateField');
    /**
     * State in this component mostly has to do with selection of existing objs
     *
     * @prop {!string} selectType           Type of existing object being selected (i.e. ExperimentHiC).
     * @prop {!string} selectField          Actual fieldname that we're selecting the existing obj for. May be nested in the case of subobjects, e.g. experiments_in_set.experiment
     * @prop {!number[]} selectArrayIdx     List of int numbers keeping track of list positions of the object we're selecting for. Since you can have arrays within arrays, one int won't do. Example: [1,2] would mean the current field is the second item within the first item of the array given by the top level field. When null, no arrays involved.
     */


    _this10.state = {
      'selectType': null,
      'selectField': null,
      'selectArrayIdx': null
    };
    return _this10;
  }
  /**
   * Takes a field and value and modifies the keyContext held in parent.
   * Also uses the fieldType, which is unique among BuildField children,
   * to direct any special functionality (such as running initCreateObj for
   * new linked objects). Also takes the linkTo field of the new context,
   * arrayIdxs used, and object type if applicable. If field == 'aliases',
   * change keyDisplay to reflect the new alias name.
   *
   * The format of field is nested to allow for subobjects. For example, for the
   * Related experiments flag, the actual linkTo experiment is stored using the
   * following field: experiment_relation.experiment. ArrayIdx is an array of
   * array indeces used to reference the specific value of the field. For example,
   * if a value is submitted for the 3rd array element inside the 2nd array element
   * of a larger field, arrayIdx would be [1,2].
   *
   * @param {string} field        Name of field on parent Item for which a value is being changed.
   * @param {any} value           New value we are setting for this field.
   * @param {string} fieldType    Internal descriptor for field type we're editing.
   * @param {string} newLink      Schema-formatted property name for linked Item property, e.g. 'Biosources', 'Treatments', 'Cell Culture Information' when editing a parent "Biosample" Item.
   * @param {!number} arrayIdx    Index in array of value when entire value for property is an array.
   * @param {!string} type        Type of Item we're linking to, if creating new Item/object only, if property is a linkTo. E.g. 'ExperimentSetReplicate', 'BiosampleCellCulture', etc.
   */


  _createClass(IndividualObjectView, [{
    key: "modifyNewContext",
    value: function modifyNewContext(field, value, fieldType) {
      var arrayIdx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var type = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

      if (fieldType === 'new linked object') {
        value = this.props.keyIter + 1;

        if (this.props.roundTwo) {
          alert('Objects cannot be created in this stage of submission. Please select an existing one.');
          return;
        }
      }

      if (!field || typeof field !== 'string') {
        // Throw error instead?
        _util.console.error.apply(_util.console, ['No field supplied'].concat(Array.prototype.slice.call(arguments)));
      }

      var splitField = field.split('.');
      var splitFieldLeaf = splitField[splitField.length - 1];
      var arrayIdxPointer = 0;
      var contextCopy = this.props.currContext;
      var pointer = contextCopy;
      var prevValue = null;

      for (var i = 0; i < splitField.length - 1; i++) {
        if (pointer[splitField[i]]) {
          pointer = pointer[splitField[i]];
        } else {
          _util.console.error('PROBLEM CREATING NEW CONTEXT WITH: ', field, value);

          return;
        }

        if (Array.isArray(pointer)) {
          pointer = pointer[arrayIdx[arrayIdxPointer]];
          arrayIdxPointer += 1;
        }
      }

      if (Array.isArray(pointer[splitFieldLeaf]) && fieldType !== 'array') {
        // move pointer into array
        pointer = pointer[splitFieldLeaf];
        prevValue = pointer[arrayIdx[arrayIdxPointer]];

        if (value === null) {
          // delete this array item
          pointer.splice(arrayIdx[arrayIdxPointer], 1);
        } else {
          pointer[arrayIdx[arrayIdxPointer]] = value;
        }
      } else {
        // value we're trying to set is not inside an array at this point
        prevValue = pointer[splitFieldLeaf];
        pointer[splitFieldLeaf] = value;
      }

      if (fieldType === 'linked object') {
        this.checkObjectRemoval(value, prevValue);
      }

      if (fieldType === 'new linked object') {
        // value is new key index in this case
        this.props.initCreateObj(type, value, field, false, field);
      } else {
        // actually change value
        this.props.modifyKeyContext(this.props.currKey, contextCopy);
      }

      if (splitFieldLeaf === 'aliases' || splitFieldLeaf === 'name' || splitFieldLeaf === 'title') {
        this.props.modifyAlias();
      }
    }
    /**
     * Use ajax to get the display_title for an existing object. Use that to kicks
     * of the addExistingObj process; if a title can't be found, use the object
     * path as a fallback.
     *
     * @param {string} value    The @ID or unique key of the Item for which we want to validate and get title for.
     * @param {string} type     The Item type of value.
     * @param {any} newLink     No idea what this is.
     */

  }, {
    key: "fetchAndValidateItem",
    value: function fetchAndValidateItem(itemAtID, field, type, arrayIdx) {
      var _this11 = this;

      arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var addExistingObj = this.props.addExistingObj;
      var hrefToFetch = itemAtID;
      var failureAlertTitle = "Validation error for field '" + field + "'" + (typeof arrayIdx === 'number' ? ' [' + arrayIdx + ']' : '');

      var failureCallback = function () {
        _Alerts.Alerts.queue({
          "title": failureAlertTitle,
          "message": "Could not find valid" + (type ? " '" + type + "'" : '') + " Item in database for value '" + itemAtID + "'.",
          "style": "danger"
        });

        _util.layout.animateScrollTo(0); // Scroll to top of page so alert b visible to end-user.


        _this11.modifyNewContext(field, null, 'existing linked object', null, arrayIdx);
      };

      var successCallback = function (result) {
        _Alerts.Alerts.deQueue({
          'title': failureAlertTitle
        });

        _this11.modifyNewContext(field, itemAtID, 'existing linked object', null, arrayIdx);

        addExistingObj(itemAtID, result.display_title, type, field);
      };

      if (typeof hrefToFetch !== 'string') {
        failureCallback();
        return;
      }

      if (hrefToFetch.charAt(0) !== '/') {
        // Pre-pend slash so will request hostname + '/' + itemAtID.
        hrefToFetch = '/' + hrefToFetch;
      }

      _util.ajax.load(hrefToFetch, function (result) {
        if (result && result.display_title && Array.isArray(result['@type'])) {
          if (type) {
            // Check for matching Type validity.
            if (result['@type'].indexOf(type) > -1) {
              successCallback(result);
              return;
            }
          } else {
            // Any Item type == valid, is assumed (e.g. linkTo type Item)
            successCallback(result);
            return;
          }
        }

        failureCallback();
      }, 'GET', failureCallback);
    }
    /**
     * If a itemAtID is null that was previously non-null, remove the linked object
     * from the current context and change state in SubmissionView accordingly.
     */

  }, {
    key: "checkObjectRemoval",
    value: function checkObjectRemoval(value, prevValue) {
      var removeObj = this.props.removeObj;

      if (value === null) {
        removeObj(prevValue);
      }
    }
    /**
     * Initializes the first search (with just type=<type>) and sets state
     * accordingly. Set the fullScreen state in SubmissionView to alter its render
     * and hide the object navigation tree.
     */

  }, {
    key: "selectObj",
    value: function selectObj(collection, field) {
      var arrayIdx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.setState({
        'selectField': field,
        'selectArrayIdx': arrayIdx,
        'selectType': collection
      });
    }
    /**
     * Callback passed to Search to select a pre-existing object. Cleans up
     * object selection state, modifies context, and initializes the fetchAndValidateItem
     * process.
     */

  }, {
    key: "selectComplete",
    value: function selectComplete(atIds) {
      var currContext = this.props.currContext;
      var _this$state7 = this.state,
          selectField = _this$state7.selectField,
          selectArrayIdx = _this$state7.selectArrayIdx,
          selectType = _this$state7.selectType;
      if (!selectField) throw new Error('No field being selected for');
      var isMultiSelect = selectArrayIdx && Array.isArray(selectArrayIdx);
      var cloneSelectArrayIdx = isMultiSelect ? _toConsumableArray(selectArrayIdx) : null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = atIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var atId = _step.value;
          var current = selectField && currContext[selectField];

          var isRepeat = Array.isArray(current) && _underscore["default"].contains(current, atId);

          if (!isRepeat) {
            //this.modifyNewContext(selectField, value, 'existing linked object', null, selectArrayIdx);
            this.fetchAndValidateItem(atId, selectField, selectType, isMultiSelect ? _toConsumableArray(cloneSelectArrayIdx) : null, null);

            if (isMultiSelect) {
              cloneSelectArrayIdx[cloneSelectArrayIdx.length - 1]++;
            }
          } else {
            this.modifyNewContext(selectField, null, 'existing linked object', null, cloneSelectArrayIdx);
          }
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

      this.setState({
        'selectField': null,
        'selectArrayIdx': null,
        'selectType': null
      });
    }
    /** Exit out of the selection process and clean up state */

  }, {
    key: "selectCancel",
    value: function selectCancel() {
      var _this$state8 = this.state,
          selectField = _this$state8.selectField,
          selectArrayIdx = _this$state8.selectArrayIdx;
      this.modifyNewContext(selectField, null, 'existing linked object', null, selectArrayIdx);
      this.setState({
        'selectType': null,
        'selectField': null,
        'selectArrayIdx': null
      });
    }
    /**
     * Given a field, use the schema to generate the sufficient information to
     * make a BuildField component for that field. Different fields are returned
     * for roundOne and roundTwo.
     */

  }, {
    key: "initiateField",
    value: function initiateField(field) {
      var _this$props12 = this.props,
          schemas = _this$props12.schemas,
          currType = _this$props12.currType,
          currKey = _this$props12.currKey,
          roundTwo = _this$props12.roundTwo,
          currContext = _this$props12.currContext,
          keyComplete = _this$props12.keyComplete,
          keyContext = _this$props12.keyContext,
          edit = _this$props12.edit;
      var currSchema = schemas[currType];

      var fieldSchema = _util.object.getNestedProperty(currSchema, ['properties', field], true);

      if (!fieldSchema) return null;
      var secondRoundField = fieldSchema.ff_flag && fieldSchema.ff_flag == 'second round';
      var fieldTitle = fieldSchema.title || field;

      if (roundTwo && !secondRoundField) {
        return null;
      } else if (!roundTwo && secondRoundField) {
        // return a placeholder informing user that this field is for roundTwo
        return _react["default"].createElement("div", {
          key: fieldTitle,
          className: "row field-row",
          required: false,
          title: fieldTitle,
          style: {
            'overflow': 'visible'
          }
        }, _react["default"].createElement("div", {
          className: "col-12 col-md-4"
        }, _react["default"].createElement("h5", {
          className: "facet-title submission-field-title"
        }, fieldTitle)), _react["default"].createElement("div", {
          className: "col-12 col-md-8"
        }, _react["default"].createElement("div", {
          className: "field-container"
        }, _react["default"].createElement("div", {
          className: "notice-message"
        }, "This field is available after finishing initial submission."))));
      }

      var fieldTip = fieldSchema.description ? fieldSchema.description : null;

      if (fieldSchema.comment) {
        fieldTip = fieldTip ? fieldTip + ' ' + fieldSchema.comment : fieldSchema.comment;
      }

      var fieldValue = currContext[field] !== null ? currContext[field] : null;

      var fieldType = _submissionFields.BuildField.fieldTypeFromFieldSchema(fieldSchema);

      var enumValues = [];
      var isLinked = false;
      var linked = (0, _SubmissionTree.fieldSchemaLinkToType)(fieldSchema); // check if this is an enum

      if (fieldType === 'enum') {
        enumValues = fieldSchema["enum"] || [];
      } else if (fieldType === "suggested_enum") {
        enumValues = fieldSchema.suggested_enum || [];
      } // check for linkTo if further down in object or array


      if (linked !== null) {
        linked = fieldSchema.title ? fieldSchema.title : linked;
        isLinked = true;
      } // handle a linkTo object on the the top level
      // check if any schema-specific adjustments need to made:


      if (fieldSchema.s3Upload && fieldSchema.s3Upload === true) {
        // only render file upload input if status is 'uploading' or 'upload_failed'
        // when editing a File principal object.
        var path = keyComplete[currKey],
            completeContext = keyContext[path],
            statusCheck = completeContext.status && (completeContext.status == 'uploading' || completeContext.status == 'upload failed');

        if (edit) {
          if (statusCheck) {
            fieldType = 'file upload';
          } else {
            return null;
          }
        } else {
          fieldType = 'file upload';
        }
      }

      return _react["default"].createElement(_submissionFields.BuildField, _extends({
        field: field,
        fieldType: fieldType,
        fieldTip: fieldTip,
        enumValues: enumValues,
        isLinked: isLinked,
        currType: currType,
        currContext: currContext
      }, _underscore["default"].pick(this.props, 'md5Progress', 'edit', 'create', 'keyDisplay', 'keyComplete', 'setSubmissionState', 'upload', 'uploadStatus', 'updateUpload', 'currentSubmittingUser', 'roundTwo'), {
        value: fieldValue,
        key: field,
        schema: fieldSchema,
        nestedField: field,
        title: fieldTitle,
        modifyFile: null,
        linkType: linked,
        disabled: false,
        arrayIdx: null,
        required: _underscore["default"].contains(currSchema.required, field),
        modifyNewContext: this.modifyNewContext,
        selectObj: this.selectObj,
        selectComplete: this.selectComplete,
        selectCancel: this.selectCancel,
        fieldBeingSelected: this.state.selectField,
        fieldBeingSelectedArrayIdx: this.state.selectArrayIdx
      }));
    }
    /**
     * Render the fieldPanels which contain the BuildFields for regular field and
     * linked object fields, respectively.
     *
     * On round two, combine all types of BuildFields and also render a
     * RoundTwoDetailPanel, which shows the attributes for the already submitted
     * object.
     */

  }, {
    key: "render",
    value: function render() {
      var _this$props13 = this.props,
          currContext = _this$props13.currContext,
          keyComplete = _this$props13.keyComplete,
          keyContext = _this$props13.keyContext,
          currKey = _this$props13.currKey,
          schemas = _this$props13.schemas,
          roundTwo = _this$props13.roundTwo;
      var fields = currContext ? _underscore["default"].keys(currContext) : [];
      var fieldJSXComponents = sortPropFields(_underscore["default"].filter( // Sort fields first by requirement and secondly alphabetically. These are JSX BuildField components.
      _underscore["default"].map(fields, this.initiateField), function (f) {
        return !!f;
      } // Removes falsy (e.g. null) items.
      ));
      var roundTwoDetailContext = roundTwo && keyComplete[currKey] && keyContext[keyComplete[currKey]];
      return _react["default"].createElement("div", null, _react["default"].createElement(FormFieldsContainer, {
        currKey: currKey
      }, fieldJSXComponents), roundTwo ? _react["default"].createElement(RoundTwoDetailPanel, {
        schemas: schemas,
        context: roundTwoDetailContext,
        open: true
      }) : null);
    }
  }]);

  return IndividualObjectView;
}(_react["default"].Component);

var FormFieldsContainer = _react["default"].memo(function (props) {
  var children = props.children,
      title = props.title;
  if (_react["default"].Children.count(children) === 0) return null;
  return _react["default"].createElement("div", {
    className: "form-fields-container"
  }, _react["default"].createElement("h4", {
    className: "clearfix page-subtitle form-section-heading submission-field-header"
  }, title), _react["default"].createElement("div", {
    className: "form-section-body"
  }, children));
});

FormFieldsContainer.defaultProps = {
  'title': 'Fields & Dependencies',
  'currKey': 0
};
/**
 * Simple Component that opens/closes and renders a Detail panel using the context
 * and schemas passed to it.
 */

var RoundTwoDetailPanel =
/*#__PURE__*/
function (_React$PureComponent3) {
  _inherits(RoundTwoDetailPanel, _React$PureComponent3);

  function RoundTwoDetailPanel(props) {
    var _this12;

    _classCallCheck(this, RoundTwoDetailPanel);

    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(RoundTwoDetailPanel).call(this, props));
    _this12.handleToggle = _this12.handleToggle.bind(_assertThisInitialized(_this12));
    _this12.state = {
      'open': props.open || false
    };
    return _this12;
  }

  _createClass(RoundTwoDetailPanel, [{
    key: "handleToggle",
    value: function handleToggle(e) {
      e.preventDefault();
      this.setState(function (_ref11) {
        var open = _ref11.open;
        return {
          'open': !open
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props14 = this.props,
          context = _this$props14.context,
          schemas = _this$props14.schemas;
      var open = this.state.open;
      return _react["default"].createElement("div", {
        className: "current-item-properties round-two-panel"
      }, _react["default"].createElement("h4", {
        className: "clearfix page-subtitle submission-field-header"
      }, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-xs icon-container pull-left",
        onClick: this.handleToggle
      }, _react["default"].createElement("i", {
        className: "icon fas " + (open ? "icon-minus" : "icon-plus")
      })), _react["default"].createElement("span", null, "Object Attributes")), _react["default"].createElement(_Collapse.Collapse, {
        "in": open
      }, _react["default"].createElement("div", {
        className: "item-page-detail"
      }, _react["default"].createElement(_ItemDetailList.Detail, {
        excludedKeys: _ItemDetailList.Detail.defaultProps.excludedKeys.concat('upload_credentials'),
        context: context,
        schemas: schemas,
        open: false,
        popLink: true
      }))));
    }
  }]);

  return RoundTwoDetailPanel;
}(_react["default"].PureComponent);
/***** MISC. FUNCIONS *****/

/**
 * Build context based off an object's and populate values from
 * pre-existing context. Empty fields are given null value.
 * All linkTo fields are added to objList.
 * If initObjs provided (edit or clone functionality), pre-existing objs will be added.
 * Also checks user info to see if user is admin, which affects which fields are displayed.
 *
 * @returns {Object} A new object represent context.
 */


function buildContext(context, itemSchema) {
  var objList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var edit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var create = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var initObjs = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var built = {};

  var userGroups = _util.JWT.getUserGroups();

  var fields = itemSchema.properties ? _underscore["default"].keys(itemSchema.properties) : [];

  _underscore["default"].forEach(fields, function (field) {
    var fieldSchema = _util.object.getNestedProperty(itemSchema, ['properties', field], true);

    if (!fieldSchema) {
      return;
    }

    if (fieldSchema.exclude_from && (Array.isArray(fieldSchema.exclude_from) && _underscore["default"].contains(fieldSchema.exclude_from, 'FFedit-create') || fieldSchema.exclude_from === 'FFedit-create')) {
      return;
    } // check to see if this field is a calculated prop


    if (fieldSchema.calculatedProperty && fieldSchema.calculatedProperty === true) {
      return;
    } // check to see if permission == import items; if admin, allow import_items fields


    if (fieldSchema.permission && fieldSchema.permission == "import_items") {
      if (!_underscore["default"].contains(userGroups, 'admin')) {
        return;
      }
    } // set value to context value if editing/cloning.
    // if creating or value not present, set to null


    if (edit) {
      if (context[field] === null || fieldSchema.ff_flag && fieldSchema.ff_flag === "clear edit") {
        built[field] = null;
      } else {
        built[field] = context[field] || null;
      }
    } else if (!create) {
      //clone
      if (context[field] === null || fieldSchema.ff_flag && fieldSchema.ff_flag === "clear clone") {
        built[field] = null;
      } else {
        built[field] = context[field] || null;
      }
    } else {
      built[field] = null;
    }

    if (objList !== null) {
      var linkedProperty = (0, _SubmissionTree.fieldSchemaLinkToPath)(fieldSchema); // Is it a linkTo (recursively or not)?

      var roundTwoExclude = fieldSchema.ff_flag && fieldSchema.ff_flag == 'second round';

      if (linkedProperty !== null && typeof linkedProperty !== 'undefined' && !roundTwoExclude) {
        // If linkTo, add to our list, selecting a nice name for it first.
        //var listTerm = fieldSchema.title ? fieldSchema.title : linked;
        var fieldToStore = field;
        linkedProperty = _underscore["default"].reject(linkedProperty, function (p) {
          return p === 'items' || p === 'properties';
        });

        if (linkedProperty.length > 0) {
          fieldToStore += '.' + linkedProperty.join('.');
        }

        if (!_underscore["default"].contains(objList, fieldToStore)) {
          objList.push(fieldToStore);
        } // add pre-existing linkTo objects


        if (initObjs !== null && built[field] !== null) {
          delvePreExistingObjects(initObjs, built[field], fieldSchema, fieldToStore);
        }
      }

      objList.sort();
    }
  });

  return built;
}
/**
 * Takes an initObjs array that it will fill with data for each existing
 * object in an edit/clone situation. json is json content for the field,
 * schema is the individual fields schema. Recursively handles objects and arrays
 */


function delvePreExistingObjects(initObjs, json, fieldSchema, listTerm) {
  if (Array.isArray(json)) {
    for (var j = 0; j < json.length; j++) {
      if (fieldSchema.items) {
        delvePreExistingObjects(initObjs, json[j], fieldSchema.items, listTerm);
      }
    }
  } else if (json instanceof Object && json) {
    if (fieldSchema.properties) {
      _underscore["default"].keys(json).forEach(function (key) {
        if (fieldSchema.properties[key]) {
          delvePreExistingObjects(initObjs, json[key], fieldSchema.properties[key], listTerm);
        }
      });
    }
  } else if (_underscore["default"].contains(_underscore["default"].keys(fieldSchema), 'linkTo')) {
    // non-array, non-object field. check schema to ensure there's a linkTo
    initObjs.push({
      'path': json,
      'display': json,
      'field': listTerm,
      'type': (0, _SubmissionTree.fieldSchemaLinkToType)(fieldSchema)
    });
  }
}
/** Sort a list of BuildFields first by required status, then by schema lookup order, then by title */


function sortPropFields(fields) {
  var reqFields = [];
  var optFields = [];
  /** Compare by schema property 'lookup' meta-property, if available. */

  function sortSchemaLookupFunc(a, b) {
    var aLookup = a.props.schema && a.props.schema.lookup || 750,
        bLookup = b.props.schema && b.props.schema.lookup || 750,
        res;

    if (typeof aLookup === 'number' && typeof bLookup === 'number') {
      //if (a.props.field === 'ch02_power_output' || b.props.field === 'ch02_power_output') console.log('X', aLookup - bLookup, a.props.field, b.props.field);
      res = aLookup - bLookup;
    }

    if (res !== 0) return res;else {
      return sortTitle(a, b);
    }
  }
  /** Compare by property title, alphabetically. */


  function sortTitle(a, b) {
    if (typeof a.props.field === 'string' && typeof b.props.field === 'string') {
      if (a.props.field.toLowerCase() < b.props.field.toLowerCase()) return -1;
      if (a.props.field.toLowerCase() > b.props.field.toLowerCase()) return 1;
    }

    return 0;
  }

  _underscore["default"].forEach(fields, function (field) {
    if (!field) return;

    if (field.props.required) {
      reqFields.push(field);
    } else {
      optFields.push(field);
    }
  });

  reqFields.sort(sortSchemaLookupFunc);
  optFields.sort(sortSchemaLookupFunc);
  return reqFields.concat(optFields);
}

function gatherLinkToTitlesFromContextEmbedded(context) {
  var idsToTitles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (context['@id'] && context.display_title) {
    if (typeof idsToTitles[context['@id']] !== 'undefined') {
      // Seen already
      return;
    }

    idsToTitles[context['@id']] = context.display_title;
  }

  _underscore["default"].values(context).forEach(function (value) {
    if (Array.isArray(value)) {
      value.forEach(function (arrItem) {
        if (!Array.isArray(arrItem) && arrItem && _typeof(arrItem) === 'object') {
          gatherLinkToTitlesFromContextEmbedded(arrItem, idsToTitles);
        }
      });
    } else if (value && _typeof(value) === 'object') {
      gatherLinkToTitlesFromContextEmbedded(value, idsToTitles);
    }
  });

  return idsToTitles;
}
/**
 * Given the parent object key and a new object key, return a version
 * of this.state.keyHierarchy that includes the new parent-child relation.
 * Recursive function
 */


var modifyHierarchy = function myself(hierarchy, keyIdx, parentKeyIdx) {
  _underscore["default"].keys(hierarchy).forEach(function (key) {
    if (key == parentKeyIdx) {
      hierarchy[parentKeyIdx][keyIdx] = {};
    } else {
      hierarchy[key] = myself(hierarchy[key], keyIdx, parentKeyIdx);
    }
  });

  return hierarchy;
};
/** Remove given key from hierarchy. Recursive function. */


var trimHierarchy = function myself(hierarchy, keyIdx) {
  if (hierarchy[keyIdx]) {
    delete hierarchy[keyIdx];
  } else {
    _underscore["default"].keys(hierarchy).forEach(function (key) {
      hierarchy[key] = myself(hierarchy[key], keyIdx);
    });
  }

  return hierarchy;
};
/**
 * Returns the entire hierarchy below for the given keyIdx. keyIdx must be a
 * number (custom object). Recursive function.
 */


var searchHierarchy = function myself(hierarchy, keyIdx) {
  if (!hierarchy) return null;
  var found_hierarchy = null;

  _underscore["default"].keys(hierarchy).forEach(function (key) {
    if (key == keyIdx) {
      found_hierarchy = hierarchy[key];
    } else {
      var test = myself(hierarchy[key], keyIdx);

      if (test !== null) {
        found_hierarchy = test;
      }
    }
  });

  return found_hierarchy;
};
/** Finds the key of direct parent for a given key in a hierarchy */


var findParentFromHierarchy = function myself(hierarchy, keyIdx) {
  if (isNaN(keyIdx) || !hierarchy) return null;
  var found_parent = null;

  _underscore["default"].keys(hierarchy).forEach(function (key) {
    if (keyIdx in hierarchy[key]) {
      found_parent = key;
    } else {
      var test = myself(hierarchy[key], keyIdx);
      if (test !== null) found_parent = test;
    }
  });

  return found_parent;
};
/** Replace a key with a different key in the hierarchy */


var replaceInHierarchy = function myself(hierarchy, current, toReplace) {
  if (typeof current === 'number') current = current + '';

  _underscore["default"].keys(hierarchy).forEach(function (key) {
    if (key === current) {
      var downstream = hierarchy[key];
      hierarchy[toReplace] = downstream;
      delete hierarchy[key];
    } else {
      hierarchy[key] = myself(hierarchy[key], current, toReplace);
    }
  });

  return hierarchy;
};
/** Return a list of all keys contained within a given hierarchy */


var flattenHierarchy = function myself(hierarchy) {
  var found_keys = [];

  _underscore["default"].keys(hierarchy).forEach(function (key) {
    if (!isNaN(key)) key = parseInt(key);
    var sub_keys = myself(hierarchy[key]);
    found_keys = _underscore["default"].union(found_keys, sub_keys, [key]);
  });

  return found_keys;
};
/**
 * Remove any field with a null value from given json context.
 * also remove empty arrays and objects
 *
 * @param {Object} context - Object representing an Item, with properties & values.
 * @returns {Object} The same context which was passed in, minus null-y values.
 */


function removeNulls(context) {
  _underscore["default"].keys(context).forEach(function (key) {
    if ((0, _submissionFields.isValueNull)(context[key])) {
      delete context[key];
    } else if (Array.isArray(context[key])) {
      context[key] = _underscore["default"].filter(context[key], function (v) {
        return !(0, _submissionFields.isValueNull)(v);
      }); // Recurse for any objects

      context[key] = _underscore["default"].map(context[key], function (v) {
        return v && _typeof(v) === 'object' ? removeNulls(v) : v;
      });
    } else if (context[key] instanceof Object) {
      context[key] = removeNulls(context[key]);
    }
  });

  return context;
}