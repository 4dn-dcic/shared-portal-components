'use strict';

import React from 'react';
import _ from 'underscore';
import url from 'url';
import queryString from 'query-string';
import { Modal } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';

import { ajax, console, JWT, object, layout, schemaTransforms, memoizedUrlParse } from './../util';
import { DropdownButton, DropdownItem } from './components/DropdownButton';
import { Collapse } from './../ui/Collapse';
import { Alerts } from './../ui/Alerts';

// We will cull util/file to only have some/minor fxns, and leave rest in 4DN repo.
import { getLargeMD5 } from '../util/file';
import { Detail } from './../ui/ItemDetailList';
import { buildContext, findFieldFromContext, gatherLinkToTitlesFromContextEmbedded, modifyContextInPlace,
    findParentFromHierarchy, flattenHierarchy, modifyHierarchy, searchHierarchy, trimHierarchy, replaceInHierarchy,
    removeNulls, sortPropFields
} from '../util/submission-view';

import { SubmissionTree, fieldSchemaLinkToType } from './components/SubmissionTree';
import { BuildField, AliasInputField, isValueNull } from './components/submission-fields';

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
export default class SubmissionView extends React.PureComponent{

    /**
     * Function to look at a specific object (reference by key) and
     * use searchHierarchy() to see if the children of the given key
     * contain any un-submitted custom objects. If they do, return
     * 1 (ready to validate). Otherwise return 0 (not ready to validate)
     *
     * @todo maybe memoize this and replace usage of state.keyValid w/ it.
     */
    static findValidationState(keyIdx, prevKeyHierarchy, keyContext, keyComplete){
        const hierarchy = object.deepClone(prevKeyHierarchy);
        const keyHierarchy = searchHierarchy(hierarchy, keyIdx);
        if (keyHierarchy === null) return 0;
        var validationReturn = 1;
        _.keys(keyHierarchy).forEach(function(key, index){
            if(!isNaN(key)){
                if (!keyComplete[key] && keyContext[key]){
                    validationReturn = 0;
                }
            }
        });
        return validationReturn;
    }

    static principalTitle(context, edit, create, itemType=null){
        let principalDisplay; // Name of our current Item being created.
        if (create === true && !edit){
            principalDisplay = 'New ' + itemType;
        } else if (edit === true && !create){
            if (context && typeof context.accession === 'string'){
                principalDisplay = context.accession;
            } else {
                principalDisplay = itemType;
            }
        }
        return principalDisplay;
    }

    constructor(props){
        super(props);

        _.bindAll(this, 'modifyKeyContext', 'initializePrincipal', 'initCreateObj',
            'initCreateAlias', 'submitAmbiguousType', 'buildAmbiguousEnumEntry', 'handleTypeSelection',
            'handleAliasChange', 'handleAliasLabChange', 'submitAlias', 'modifyAlias', 'createObj', 'removeObj',
            'initExistingObj', 'addExistingObj', 'setSubmissionState', 'updateUpload',
            'testPostNewContext', 'realPostNewContext', 'removeNullsFromContext', 'checkRoundTwo',
            'buildDeleteFields', 'modifyMD5Progess', 'submitObject', 'finishRoundTwo', 'cancelCreateNewObject', 'cancelCreatePrimaryObject'
        );

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
        this.state = {
            'keyContext'            : null,
            'keyValid'              : null,
            'keyTypes'              : null,
            'keyDisplay'            : null,     // serves to hold navigation-formatted names for objs
            'keyComplete'           : {},       // init to empty dict b/c objs cannot be complete on initialization
            'keyIter'               : 0,        // serves as key versions for child objects. 0 is reserved for principal
            'currKey'               : null,     // start with viewing principle object (key = 0),
            'keyHierarchy'          : { 0: {} },   // initalize with principal item at top
            'keyLinkBookmarks'      : {},       // hold bookmarks LinkTos for each obj key
            'keyLinks'              : {},       // associates each non-primary key with a field
            'processingFetch'       : false,
            'errorCount'            : 0,
            'ambiguousIdx'          : null,
            'ambiguousType'         : null,
            'ambiguousSelected'     : null,
            'creatingIdx'           : null,
            'creatingType'          : null,
            'creatingLink'          : null,
            'creatingAlias'         : '',
            'creatingAliasMessage'  : null,
            'creatingLinkForField'  : null,
            'fullScreen'            : false,
            'md5Progress'           : null,
            'roundTwo'              : false,
            'roundTwoKeys'          : [],
            'file'                  : null,
            'upload'                : null,
            'uploadStatus'          : null,
            'currentSubmittingUser' : null,
            'edit'                  : props.currentAction === 'edit',
            'create'                : (props.currentAction === 'create' || props.currentAction === 'add'),
            'callbackHref'          : null   // Where we navigate to after submission
        };
    }

    /**
     * Call initializePrincipal to get state set up, but only if schemas are
     * available.
     */
    componentDidMount(){
        const { schemas } = this.props;
        if (schemas && _.keys(schemas).length > 0){
            this.initializePrincipal();
        }
    }

    /**
     * If schemas in props change (this should not happen often), re-initialize.
     * The main functionality of this is to wait for schemas if they're not
     * available on componentDidMount.
     */
    componentDidUpdate(pastProps, pastState){
        const { schemas, currentAction } = this.props;
        if (schemas && schemas !== pastProps.schemas){
            if (pastState.currKey === null){
                this.initializePrincipal();
            }
        }
        if (currentAction !== pastProps.currentAction){
            var edit = ncurrentAction === 'edit';
            var create = (currentAction === 'create' || currentAction === 'add');
            this.setState({ edit, create });
        }
    }

    /**
     * Function that modifies new context and sets validation state whenever
     * a modification occurs
     *
     * @param {number} objKey - Key of Object being modified. Used as a key in state objects (keyDisplay, keyContext, etc.)
     *                          to retrieve data about object being edited.
     * @param {Object} newContext - New Context/representation for this Item to be saved.
     * @param {string} keyTitle - Display title of item being modified
     */
    modifyKeyContext(objKey, newContext, keyTitle){
        // console.log(`log1: calling modifyKeyContext(objKey=${objKey}, newContext=${newContext}, keyTitle=${keyTitle} `);
        this.setState(function({ keyContext, keyValid, keyHierarchy : prevKeyHierarchy, keyComplete, keyDisplay }){
            const contextCopy = object.deepClone(keyContext);
            const validCopy   = object.deepClone(keyValid);
            contextCopy[objKey] = newContext;

            // TODO maybe get rid of this state.keyValid and just use memoized static function.

            // ensure new object is valid
            validCopy[objKey] = SubmissionView.findValidationState(objKey, prevKeyHierarchy, keyContext, keyComplete);
            // make sure there's something to replace keydisplay with
            if (keyTitle) {
                return {
                    'keyContext': contextCopy,
                    'keyValid': validCopy,
                    'keyDisplay' : { ...keyDisplay, [objKey] : keyTitle }
                };
            } else {
                return {
                    'keyContext': contextCopy,
                    'keyValid': validCopy,
                };
            }
        }, ReactTooltip.rebuild);
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
    initializePrincipal(){
        const { context, schemas, href, setIsSubmitting } = this.props;
        const { edit, create } = this.state;

        const keyContext = {};
        const contextID = object.itemUtil.atId(context) || null;
        const parsedHref = memoizedUrlParse(href);
        let [ principalType ] = context['@type'];

        const searchViewTypeMatch = principalType.match(/^(\w+)(SearchResults)$/); // Returns null or [ "ItemTypeSearchResults", "ItemType", "SearchResults" ]
        if (Array.isArray(searchViewTypeMatch) && searchViewTypeMatch.length === 3){
            // We're on a search results page. Parse out the proper 'type'.
            [ , principalType ] = searchViewTypeMatch; // e.g. [ "PublicationSearchResults", >> "Publication" <<, "SearchResults" ]
        }

        // Where we navigate to after submission.
        const callbackHref = create ? null : (
            parsedHref.query &&
            typeof parsedHref.query.callbackHref === 'string' &&
            parsedHref.query.callbackHref
        ) || contextID;

        const keyTypes = { "0" : principalType };
        const keyValid = { "0" : 1 };
        const keyDisplay = {
            ...gatherLinkToTitlesFromContextEmbedded(context),
            "0" : SubmissionView.principalTitle(context, edit, create, principalType),
        };

        console.log('PTYPE', principalType, keyDisplay);
        const keyLinkBookmarks = {};
        const bookmarksList = [];
        const schema = schemas[principalType];
        let existingAlias = false;

        // Step A : Get labs from User, in order to autogenerate alias.
        const userInfo = JWT.getUserInfo(); // Should always succeed, else no edit permission..
        let userHref = null;
        if (userInfo && Array.isArray(userInfo.user_actions)){
            userHref = _.findWhere(userInfo.user_actions, { 'id' : 'profile' }).href;
        } else {
            userHref = '/me';
        }

        // Step B : Callback for after grabbing user w/ submits_for
        const continueInitProcess = () => {
            // if @id cannot be found or we are creating from scratch, start with empty fields
            if (!contextID || create){
                // We may not have schema (if Abstract type). If so, leave empty and allow initCreateObj ... -> createObj() to create it.
                if (schema) keyContext["0"] = buildContext({}, schema, bookmarksList, edit, create);
                keyLinkBookmarks["0"] = bookmarksList;
                this.setState({
                    keyContext, keyValid, keyTypes, // Gets updated in submitAmbiguousType
                    keyDisplay, keyLinkBookmarks, currKey: 0,
                    callbackHref
                }, () => {
                    this.initCreateObj(principalType, 0, 'Primary Object');
                });
            } else {
                // get the DB result to avoid any possible indexing hang-ups
                ajax.promise(contextID + '?frame=object&datastore=database').then((response) => {
                    const reponseAtID = object.itemUtil.atId(response);
                    const initObjs = []; // Gets modified/added-to in-place by buildContext.

                    if (reponseAtID && reponseAtID === contextID){
                        keyContext["0"] = buildContext(response, schema, bookmarksList, edit, create, initObjs);
                        keyLinkBookmarks["0"] = bookmarksList;
                        if (edit && response.aliases && response.aliases.length > 0){
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

                    this.setState({
                        keyContext, keyValid, keyTypes,
                        keyDisplay, keyLinkBookmarks, currKey: 0,
                        callbackHref
                    }, () => {
                        _.forEach(initObjs, (initObj, idx) => {
                            // We get 'path' as display in buildContext->delveExistingObj.. so override here.
                            initObj.display = keyDisplay[initObj.path] || initObj.display;
                            this.initExistingObj(initObj);
                        });
                        // if we are cloning and there is not an existing alias
                        // never prompt alias creation on edit
                        // do not initiate ambiguous type lookup on edit or create
                        if (!edit && !existingAlias){
                            this.initCreateObj(principalType, 0, 'Primary Object', true);
                        }
                    });
                });
            }
            // set state in app to prevent accidental mid-submission navigation
            setIsSubmitting(true);
        };

        // Grab current user via AJAX and store to state. To use for alias auto-generation using current user's top submits_for lab name.
        ajax.load(userHref + '?frame=embedded', (r)=>{
            this.setState({ 'currentSubmittingUser' : r }, continueInitProcess);
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
    initCreateObj(ambiguousType, ambiguousIdx, creatingLink, init=false, parentField=null){
        console.log("calling initCreateObj with:", ...arguments);
        const { schemas } = this.props;
        const itemTypeHierarchy = schemaTransforms.schemasToItemTypeHierarchy(schemas);
        // check to see if we have an ambiguous linkTo type.
        // this means there could be multiple types of linked objects for a
        // given type. let the user choose one.
        if ((ambiguousType === "Item" || itemTypeHierarchy[ambiguousType]) && !init){
            // ambiguous linkTo type found
            this.setState({
                ambiguousType,
                ambiguousIdx,
                creatingLink,
                ambiguousSelected : null
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
    initCreateAlias(type, newIdx, newLink, parentField=null, extraState={}){
        // console.log("calling initCreateAlias with:", ...arguments);
        const { schemas } = this.props;
        const { currentSubmittingUser } = this.state;
        const schema = (schemas && schemas[type]) || null;
        var autoSuggestedAlias = '';
        if (currentSubmittingUser && Array.isArray(currentSubmittingUser.submits_for) && currentSubmittingUser.submits_for[0] && typeof currentSubmittingUser.submits_for[0].name === 'string'){
            autoSuggestedAlias = AliasInputField.getInitialSubmitsForFirstPart(currentSubmittingUser) + ':';
        }
        if (schema && schema.properties.aliases){
            this.setState(_.extend({
                'creatingAlias'         : autoSuggestedAlias,
                'creatingIdx'           : newIdx,
                'creatingType'          : type,
                'creatingLink'          : newLink,
                'creatingLinkForField'  : parentField
            }, extraState));
        } else { // schema doesn't support aliases
            let fallbackAlias = "New " + type;
            if (newIdx && newIdx > 0){
                fallbackAlias += " (" + (newIdx + 1) + ")";
            }
            this.createObj(type, newIdx, newLink, fallbackAlias, extraState);
        }
    }

    /**
     * Callback function used with the ambiguous input element. Called when a type
     * is selected from the enum ambiguousType list.
     * Move to initCreateAlias afterwards.
     */
    submitAmbiguousType(e){
        e.preventDefault();
        const { schemas } = this.props;
        const { ambiguousSelected : type, ambiguousIdx : newIdx, creatingLink : newLink } = this.state;
        const schema = schemas[type];
        const stateChange = {
            'ambiguousIdx'      : null,
            'ambiguousType'     : null,
            'ambiguousSelected' : null
        };
        // safety check to ensure schema exists for selected type
        if (schema && type){
            this.initCreateAlias(type, newIdx, newLink, null, stateChange);
        } else {
            this.setState(stateChange); // abort
        }
    }

    /** Simple function to generate enum entries for ambiguous types */
    buildAmbiguousEnumEntry(val, idx, all){
        return(
            <DropdownItem key={val} title={val || ''} eventKey={val} onSelect={this.handleTypeSelection}>
                {val || ''}
            </DropdownItem>
        );
    }

    /**
     * Enum callback to change state in ambiguous type selection
     */
    handleTypeSelection(e){
        this.setState({ 'ambiguousSelected': e });
    }

    /**
     * Callback function used to change state in response to user input in the
     * alias creation process
     */
    handleAliasChange(value){
        this.setState({ 'creatingAlias': value });
    }

    /**
     * Callback function used to change state in response to user input in the
     * alias creation process
     */
    handleAliasLabChange(e){
        var inputElement = e.target;
        var currValue = inputElement.value;
        this.setState({ 'creatingAlias': currValue });
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
    submitAlias(e){
        e.preventDefault();
        e.stopPropagation();

        const { schemas } = this.props;
        const { creatingType : type, creatingIdx : newIdx, creatingLink : newLink, creatingAlias : alias, keyDisplay } = this.state;
        const schema = schemas[type];

        if (type === null || newIdx === null || newLink === null){
            return false;
        }

        // check if created object supports aliases
        const hasAlias = schema && schema.properties && schema.properties.aliases;
        if (alias.length > 0 && hasAlias){
            var patt = new RegExp('\\S+:\\S+');
            var regexRes = patt.test(alias);
            if(!regexRes){
                this.setState({ 'creatingAliasMessage': 'ERROR. Aliases must be formatted as: <text>:<text> (e.g. dcic-lab:42).' });
                return false;
            }
            for(var key in keyDisplay){
                if (keyDisplay[key] === alias){
                    this.setState({ 'creatingAliasMessage': 'You have already used this alias.' });
                    return false;
                }
            }
            // see if the input alias is already being used
            ajax.promise('/' + alias).then((data) => {
                if (data && data.title && data.title === "Not Found"){
                    this.createObj(type, newIdx, newLink, alias, {
                        'creatingIdx'           : null,
                        'creatingType'          : null,
                        'creatingLink'          : null,
                        'creatingAlias'         : '',
                        'creatingAliasMessage'  : null,
                        'creatingLinkForField'  : null
                    });
                } else {
                    this.setState({ 'creatingAliasMessage': 'ERROR. That alias is already taken.' });
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
    modifyAlias(){
        this.setState(function({ keyDisplay, keyTypes, currKey, keyContext, edit, create }, { context: propContext }){
            const currAlias = keyDisplay[currKey];
            const aliases = keyContext[currKey].aliases || null;
            // Try to get 'alias' > 'name' > 'title' > then fallback to 'My ItemType currKey'
            const name = (( Array.isArray(aliases) && aliases.length > 1 && aliases[aliases.length - 2] ) || keyContext[currKey].name || keyContext[currKey].title || null);
            const nextKeyDisplay = _.clone(keyDisplay);
            if (name) {
                nextKeyDisplay[currKey] = name;
            } else if (currKey === 0) {
                nextKeyDisplay[currKey] = SubmissionView.principalTitle(propContext, edit, create, keyTypes[currKey]);
            } else {
                nextKeyDisplay[currKey] = 'My ' + keyTypes[currKey] + ' ' + currKey;
            }
            if (nextKeyDisplay[currKey] === currAlias) return null;
            return { 'keyDisplay': nextKeyDisplay };
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
     *
     * @param {string} type - Item Type, e.g. "Experiment"
     * @param {number} newIdx - Index/identifier of new unsubmitted Item
     * @param {string} alias - Alias of this item.
     * @param {Object} extraState - Additional state to set upon completion.
     */
    createObj(type, newIdx, newLink, alias, extraState={}){
        console.log("CREATEOBJ", ...arguments);
        const { errorCount } = this.state;

        // get rid of any hanging errors
        for (var i=0; i < errorCount; i++){
            Alerts.deQueue({ 'title' : "Validation error " + parseInt(i + 1) });
        }

        this.setState(function(currState, currProps){
            const { schemas } = currProps;
            const { keyTypes, currKey, keyHierarchy, keyIter, keyContext, keyValid, keyLinkBookmarks, keyLinks, keyDisplay : prevKeyDisplay } = currState;

            const contextCopy     = _.clone(keyContext);
            const validCopy       = _.clone(keyValid);
            const typesCopy       = _.clone(keyTypes);
            const parentKeyIdx    = currKey;
            const bookmarksCopy   = _.clone(keyLinkBookmarks);
            const linksCopy       = object.deepClone(keyLinks);
            const keyDisplay      = _.clone(prevKeyDisplay);
            const bookmarksList   = [];
            let keyIdx;
            let newHierarchy;

            if (newIdx === 0){ // initial object creation
                keyIdx = 0;
                newHierarchy = _.clone(keyHierarchy);
            } else {
                keyIdx = keyIter + 1; // increase key iter by 1 for a new unique key
                if (newIdx !== keyIdx) {
                    console.error('ERROR: KEY INDEX INCONSISTENCY!');
                    return;
                }
                newHierarchy = modifyHierarchy(_.clone(keyHierarchy), keyIdx, parentKeyIdx);
                validCopy[keyIdx] = 1; // new object has no incomplete children yet
                validCopy[parentKeyIdx] = 0; // parent is now not ready for validation
            }

            typesCopy[keyIdx] = type;
            const contextWithAlias = (contextCopy && contextCopy[keyIdx]) ? contextCopy[keyIdx] : {};
            if (Array.isArray(contextWithAlias.aliases)) {
                contextWithAlias.aliases = _.uniq(_.filter(contextWithAlias.aliases.slice(0)).concat([ alias ]));
            } else {
                contextWithAlias.aliases = [ alias ];
            }

            contextCopy[keyIdx] = buildContext(contextWithAlias, schemas[type], bookmarksList, true, false);
            bookmarksCopy[keyIdx] = bookmarksList;
            linksCopy[keyIdx] = newLink;
            keyDisplay[keyIdx] = alias;

            return _.extend({
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
     * Effectively deletes an object by removing its idx from keyContext and other key-indexed state.
     *
     * @param {number} keyToRemove - Key (either idx or atID) of object to remove.
     *
     * Used for both pre-existing/recently submitted objects, where keyToRemove is their atID, and
     * in-progress custom objects that have index keys instead.
     *
     * If deleting a pre-existing/recently submitted object, dont modify the key-indexed states for
     * it since other occurences of that object may be used in the creation
     * process and those should not be affected. Effectively, removing a pre-
     * existing object amounts to removing it from keyHierarchy.
     */
    removeObj(keyToRemove){
        console.log("calling removeObj with keyToRemove=", keyToRemove);
        this.setState(function({ keyContext, keyValid, keyTypes, keyComplete, keyLinkBookmarks, keyLinks, roundTwoKeys, keyHierarchy }){
            const contextCopy = object.deepClone(keyContext);
            const validCopy = object.deepClone(keyValid);
            const typesCopy = object.deepClone(keyTypes);
            const keyCompleteCopy = object.deepClone(keyComplete);
            const bookmarksCopy = _.clone(keyLinkBookmarks);
            const linksCopy = _.clone(keyLinks);
            const roundTwoCopy = roundTwoKeys.slice();
            const hierarchy = _.clone(keyHierarchy);
            const dummyHierarchy = object.deepClone(hierarchy);

            let keyToRemoveIdx = !isNaN(keyToRemove) ? keyToRemove : null;
            const keyToRemoveAtId = isNaN(keyToRemove) ? keyToRemove : null;

            // @id is now used as ONLY key in heirarchy, keyLinks
            // @id is stored alongside index in keyContext, keyTypes
            // index is used as ONLY key in keyLinkBookmarks

            // If the object was newly created, keyToRemove might be an @id string (not a keyIdx)
            _.keys(keyCompleteCopy).forEach(function(key) {
                // check keyComplete for a key that maps to the appropriate @id
                if (keyCompleteCopy[key] === keyToRemove) { // found a recently submitted object to remove
                    keyToRemoveIdx = key;
                }
            });

            // Search the hierarchy tree for the objects nested within/underneath the object being deleted
            let foundHierarchy = searchHierarchy(dummyHierarchy, keyToRemoveAtId);
            // Note: keyHierarchy stores keys both as indices (e.g. principal object) AND atIDs (e.g. new linked objects);
            // So need to search Hierarchy for both, but most cases will be atIDs.
            if (foundHierarchy === null){
                // make sure the key wasn't stashed under the keyIdx (in cases of passed in @id)
                foundHierarchy = searchHierarchy(dummyHierarchy, keyToRemoveIdx);
                // occurs when keys cannot be found to delete
                if (foundHierarchy === null) { return null; }
            }

            // get a list of all keys to remove
            const toDelete = flattenHierarchy(foundHierarchy);
            toDelete.push(keyToRemoveIdx); // add this key
            if (keyToRemoveAtId) { toDelete.push(keyToRemoveAtId); } // also remove any references to the atId

            // trimming the hierarchy effectively removes objects from creation process
            const newHierarchy = trimHierarchy(hierarchy, keyToRemoveAtId ? keyToRemoveAtId : keyToRemoveIdx);

            // for housekeeping, remove the keys from keyLinkBookmarks, keyLinks, and keyCompleteCopy
            _.forEach(toDelete, function(keyToDelete){
                // don't remove all state data for created/pre-existing objs in case there are other occurances of said object
                if (isNaN(keyToDelete)) { return { keyHierarchy: newHierarchy }; } // only remove from hierarchy

                // remove key from roundTwoKeys if necessary
                // NOTE: submitted custom objects will NOT be removed from this
                // after deletion. Still give user opportunity for second round edits
                if(_.contains(roundTwoCopy, keyToDelete)){
                    var rmIdx = roundTwoCopy.indexOf(keyToDelete);
                    if(rmIdx > -1){
                        roundTwoCopy.splice(rmIdx,1);
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
                'keyComplete' : keyCompleteCopy
            };
        });
    }

    /**
     * Uses an object holding specific data needed to initializing pre-existing
     * objects in the principal object initializing process when cloning/editing.
     * Exclusively called from initializePrincipal. Calls addExistingObj
     */
    initExistingObj({ path, display, type, field }){
        this.addExistingObj(path, display, type, field, true);
    }

    /**
     * Sets up state to contain the newly introduced pre-existing object and adds it into
     * keyHierarchy.
     *
     * @param {string}  itemAtID        ID path of an existing object
     * @param {string}  displayTitle    Display title of the object itemAtID refers to
     * @param {string}  type            Object type
     * @param {string}  field           The linkTo field type (newLink)
     * @param {boolean} init            Is the item being added during the initializePrincipal process?
     *
     * The key for pre-existing objects are their @id path. Thus,
     * isNan() for the key of a pre-existing object will return true.
     */
    addExistingObj(itemAtID, display, type, field, init=false){
        /*
        console.log(`calling addExistingObj(
            itemAtID=${itemAtID},
            display=${display},
            type=${type},
            field=${field},
            init=${init}`);
        */
        this.setState(function({
            currKey,
            keyHierarchy : prevKeyHierarchy,
            keyDisplay : prevKeyDisplay,
            keyTypes : prevKeyTypes,
            keyLinks : prevKeyLinks
        }){
            const parentKeyIdx = init ? 0 : currKey;
            const keyDisplay = _.clone(prevKeyDisplay);
            const keyTypes = _.clone(prevKeyTypes);
            const keyLinks = _.clone(prevKeyLinks);
            const keyHierarchy = modifyHierarchy(_.clone(prevKeyHierarchy), itemAtID, parentKeyIdx);

            keyDisplay[itemAtID] = display;
            keyTypes[itemAtID] = type;
            keyLinks[itemAtID] = field;

            return { keyHierarchy, keyDisplay, keyTypes, keyLinks };
        });
    }

    /**
     * Takes a key and value and sets the corresponding state in this component to the value.
     *
     * @param {string}  key     This.state[key]
     * @param {any}     value   Value to change this.state[key] to
     *
     * Primarily used as a callback to change currKey, in which case we
     * ensure that there are no current uploads of md5 calculations running. If
     * allowed to change keys, attempt to automatically validate the key we are
     * leaving if its validation state == 1 (has no incomplete children). Also
     * remove any hanging Alert error messages from validation.
     */
    setSubmissionState(key, value){
        // console.log(`calling setSubmissionState(key = ${key}, value = ${value}`);
        const { currKey, upload, md5Progress, keyValid, errorCount, roundTwo, keyHierarchy, keyContext, keyComplete } = this.state;
        var stateToSet = {};
        if (typeof this.state[key] !== 'undefined'){
            // this means we're navigating to a new object if true
            if (key === 'currKey' && value !== currKey){
                // don't allow navigation when we have an uploading file
                // or calculating md5
                if (upload !== null || md5Progress !== null){
                    alert('Please wait for your upload to finish.');
                    return;
                }
                // get rid of any hanging errors
                for(var i=0; i < errorCount; i++){
                    Alerts.deQueue({ 'title' : "Validation error " + parseInt(i + 1) });
                    stateToSet.errorCount = 0;
                }
                // skip validation stuff if in roundTwo
                if(!roundTwo){
                    // if current key is ready for validation, first try that
                    // but suppress warning messages
                    if (keyValid[currKey] === 1) {
                        this.submitObject(currKey, true, true);
                    }
                    // see if newly-navigated obj is ready for validation
                    if(keyValid[value] === 0){
                        const validState = SubmissionView.findValidationState(value, keyHierarchy, keyContext, keyComplete);
                        if (validState === 1){
                            const nextKeyValid = _.clone(keyValid);
                            nextKeyValid[value] = 1;
                            stateToSet['keyValid'] = nextKeyValid;
                        }
                    }
                }
                // reset some state
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
    updateUpload(uploadInfo, completed=false, failed=false){
        var stateToSet = {};
        if (completed){
            stateToSet.uploadStatus = 'Upload complete';
            stateToSet.upload = null;
            stateToSet.file = null;
            this.finishRoundTwo();
            this.setState(stateToSet);
        }else if(failed){
            var destination = this.state.keyComplete[this.state.currKey];
            var payload = JSON.stringify({ 'status':'upload failed' });
            // set status to upload failed for the file
            ajax.promise(destination, 'PATCH', {}, payload).then((data) => {
                // doesn't really matter what response is
                stateToSet.uploadStatus = 'Upload failed';
                stateToSet.upload = null;
                this.setState(stateToSet);
            });
        }else{ // must be the initial run
            // Calculate the md5sum for the file held in state and save it to the md5
            // field of the current key's context (this can only be a file due to the
            // submission process). Resets file and md5Progess in state after running.
            var file = this.state.file;
            // md5 calculation should ONLY occur when current type is file
            if(file === null) return;
            getLargeMD5(file, this.modifyMD5Progess).then((hash) => {
                // perform async patch to set md5sum field of the file
                var destination = this.state.keyComplete[this.state.currKey];
                var payload = JSON.stringify({ 'md5sum': hash });
                ajax.promise(destination, 'PATCH', {}, payload).then((data) => {
                    if(data.status && data.status == 'success'){
                        console.info('HASH SET TO:', hash, 'FOR', destination);
                        stateToSet.upload = uploadInfo;
                        stateToSet.md5Progress = null;
                        stateToSet.uploadStatus = null;
                        this.setState(stateToSet);
                    }else if(data.status && data.title && data.status == 'error' && data.title == 'Conflict'){
                        // md5 key conflict
                        stateToSet.uploadStatus = 'MD5 conflicts with another file';
                        stateToSet.md5Progress = null;
                        this.setState(stateToSet);
                    }else{
                        // error setting md5
                        stateToSet.uploadStatus = 'MD5 calculation error';
                        stateToSet.md5Progress = null;
                        this.setState(stateToSet);
                    }
                });

            }).catch((error) => {
                stateToSet.uploadStatus = 'MD5 calculation error';
                stateToSet.file = null;
                stateToSet.md5Progress = null;
                this.setState(stateToSet);
            });
        }
    }

    testPostNewContext(e){
        e.preventDefault();
        this.submitObject(this.state.currKey, true);
    }

    realPostNewContext(e){
        console.log("real posting new context");
        console.log("submitting object with currkey: ", this.state.currKey);
        e.preventDefault();
        this.submitObject(this.state.currKey);
    }

    /**
     * Takes the context held in keyContext for a given key idx and returns a
     * copy that has been passed through removeNulls to delete any key-value pair
     * with a null value.
     */
    removeNullsFromContext(inKey){
        const { keyContext } = this.state;
        return removeNulls(object.deepClone(keyContext[inKey]));
    }

    /**
     * Returns true if the given schema has a round two flag within it
     * Used within the submission process to see if items will need second round submission.
     */
    checkRoundTwo(schema){
        var fields = schema.properties ? _.keys(schema.properties) : [];
        for (var i=0; i<fields.length; i++){
            if(schema.properties[fields[i]]){
                var fieldSchema = object.getNestedProperty(schema, ['properties', fields[i]], true);
                if (!fieldSchema){
                    continue;
                }
                if(fieldSchema.ff_flag && fieldSchema.ff_flag == 'second round'){
                    // this object needs second round submission
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Used to generate a list of fields that have been removed in the submission
     * process.
     *
     * @param {*} patchContext
     * @param {*} origContext
     * @param {*} schema
     *
     * This list will in turn be used to make a deleteFields string
     * that is passed to the server with the PATCH request for editing or
     * second round submission. Takes the patchContext, which is the submission
     * content after removeNulls and submitObject processing, and compares it
     * to the original content (which is passed through removeNulls). If the
     * roundTwo flag is set to true, only operate on roundTwo submission fields.
     * Otherwise, do not operate on roundTwo fields.
     *
     * @returns {[string <field>]} An array of stirng fieldnames to delete.
     */
    buildDeleteFields(patchContext, origContext, schema){
        var deleteFields = [];
        // must remove nulls from the orig copy to sync with patchContext
        var origCopy = object.deepClone(origContext);
        origCopy = removeNulls(origCopy);
        var userGroups = JWT.getUserGroups();
        _.keys(origCopy).forEach((field, index) => {
            // if patchContext already has a value (such as admin edited
            // import_items fields), don't overwrite
            if(!isValueNull(patchContext[field])){
                return;
            }
            if(schema.properties[field]){
                var fieldSchema = object.getNestedProperty(schema, ['properties', field], true);
                if (!fieldSchema){
                    return;
                }
                // skip calculated properties and exclude_from fields
                if (fieldSchema.calculatedProperty && fieldSchema.calculatedProperty === true){
                    return;
                }
                if (fieldSchema.exclude_from && (_.contains(fieldSchema.exclude_from,'FFedit-create') || fieldSchema.exclude_from == 'FFedit-create')){
                    return;
                }
                // if the user is admin, they already have these fields available;
                // only register as removed if admin did it intentionally
                if (fieldSchema.permission && fieldSchema.permission == "import_items"){
                    if(_.contains(userGroups, 'admin')) deleteFields.push(field);
                    return;
                }
                // check round two fields if the parameter roundTwo is set
                if(fieldSchema.ff_flag && fieldSchema.ff_flag == 'second round'){
                    if(this.state.roundTwo) deleteFields.push(field);
                    return;
                }
                // if we're here, the submission field was legitimately deleted
                if(!this.state.roundTwo) deleteFields.push(field);
            }
        });
        return deleteFields;
    }

    /** Set md5Progress in state to val. Passed as callback to getLargeMD5 */
    modifyMD5Progess(val){
        this.setState({ 'md5Progress': val });
    }

    /**
     * Master object submission function.
     *
     * @param {number} inKey             The temporary key (index) of unsubmitted item OR key of submitted item (requiring round-two
     *                                   submission); key used in state (keyDisplay, keyContext) to refer to unsubmitted object
     * @param {boolean} test             If 'true', test/validate object without submitting.
     * @param {boolean} suppressWarnings Hide HTTP related warnings and errors from console
     *
     * Uses ajax to POST/PATCH the json to the object collection (a new object) or to the
     * specific object path (a pre-existing/roundTwo object). If test=true,
     * the POST is made to the check_only=true endpoint for validation without
     * actual submission.
     *
     * Upon successful submission, response data for the newly instantiated object
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
    submitObject(inKey, test=false, suppressWarnings=false){
        console.log("SUBMITOBJ", ...arguments);
        // function to test a POST of the data or actually POST it.
        // validates if test=true, POSTs if test=false.
        const { context, schemas, setIsSubmitting, navigate: propNavigate } = this.props;
        const { keyValid, keyTypes, errorCount, currentSubmittingUser, edit, roundTwo, keyComplete,
            keyContext, keyDisplay, file, keyHierarchy, keyLinks, roundTwoKeys, callbackHref } = this.state;
        const stateToSet = {}; // hold next state
        const currType = keyTypes[inKey];
        const currSchema = schemas[currType];

        // this will always be reset when stateToSet is implemented
        stateToSet.processingFetch = false;
        stateToSet.keyValid = _.clone(keyValid);

        const finalizedContext = this.removeNullsFromContext(inKey);

        var i;
        // get rid of any hanging errors
        for (i=0; i < errorCount; i++){
            Alerts.deQueue({ 'title' : "Validation error " + parseInt(i + 1) });
            stateToSet.errorCount = 0;
        }

        this.setState({ 'processingFetch': true });

        if (!currentSubmittingUser){
            console.error('No user account info.');
            stateToSet.keyValid[inKey] = 2;
            this.setState(stateToSet);
            return;
        }

        const submitProcessContd = (userLab = null, userAward = null) => {
            // Todo: this code is 4dn specific; get rid of it and move it to fourfront (eventually)
            // if editing, use pre-existing award, lab, and submitted_by
            // this should only be done on the primary object
            if (edit && inKey === 0 && context.award && context.lab){

                if (currSchema.properties.award && !('award' in finalizedContext)){
                    finalizedContext.award = object.itemUtil.atId(context.award);
                }

                if (currSchema.properties.lab && !('lab' in finalizedContext)){
                    finalizedContext.lab = object.itemUtil.atId(context.lab);
                }

                // an admin is editing. Use the pre-existing submitted_by
                // otherwise, permissions won't let us change this field
                if (currentSubmittingUser.groups && _.contains(currentSubmittingUser.groups, 'admin')){
                    if (context.submitted_by){
                        finalizedContext.submitted_by = object.itemUtil.atId(context.submitted_by);
                    } else {
                        // use current user
                        finalizedContext.submitted_by = object.itemUtil.atId(currentSubmittingUser);
                    }
                }

            } else if (userLab && userAward && currType !== 'User') {
                // Otherwise, use lab/award of user submitting unless values present
                // Skip this is we are working on a User object
                if (currSchema.properties.award && !('award' in finalizedContext)){
                    finalizedContext.award = object.itemUtil.atId(userAward);
                }
                if (currSchema.properties.lab && !('lab' in finalizedContext)){
                    finalizedContext.lab = object.itemUtil.atId(userLab);
                }
            }

            let destination;
            let actionMethod;
            let deleteFields;   // used to keep track of fields to delete with PATCH for edit/round two; will become comma-separated string
            if (roundTwo){      // change actionMethod and destination based on edit/round two
                destination = keyComplete[inKey];
                actionMethod = 'PATCH';
                const alreadySubmittedContext = keyContext[destination];
                // roundTwo flag set to true for second round
                deleteFields = this.buildDeleteFields(finalizedContext, alreadySubmittedContext, currSchema);
            } else if (edit && inKey === 0){ // submitting the principal object
                destination = object.itemUtil.atId(context);
                actionMethod = 'PATCH';
                deleteFields = this.buildDeleteFields(finalizedContext, context, currSchema);
            } else { // submitting a new object
                destination = '/' + currType + '/';
                actionMethod = 'POST';
            }

            if (test){
                // if testing validation, use check_only=true (see /types/base.py)'
                destination += '?check_only=true';
            } else {
                console.log('FINALIZED PAYLOAD:', finalizedContext);
                console.log('DELETE FIELDS:', deleteFields);
            }

            const payload = JSON.stringify(finalizedContext);

            // add delete_fields parameter to request if necessary
            if (deleteFields && Array.isArray(deleteFields) && deleteFields.length > 0){
                var deleteString = deleteFields.map(encodeURIComponent).join(',');
                destination = destination + (test ? '&' : '?') + 'delete_fields=' + deleteString;
                console.log('DESTINATION:', destination);
            }

            // Perform request
            ajax.promise(destination, actionMethod, {}, payload).then((response) => {
                if (response.status && response.status !== 'success'){ // error
                    stateToSet.keyValid[inKey] = 2;
                    if(!suppressWarnings){
                        var errorList = response.errors || [response.detail] || [];
                        // make an alert for each error description
                        stateToSet.errorCount = errorList.length;
                        for(i = 0; i<errorList.length; i++){
                            var detail = errorList[i].description || errorList[i] || "Unidentified error";
                            if (errorList[i].name){
                                detail += ('. ' + errorList[i].name + ' in ' + keyDisplay[inKey]);
                            } else {
                                detail += ('. See ' + keyDisplay[inKey]);
                            }
                            Alerts.queue({
                                'title' : "Validation error " + parseInt(i + 1),
                                'message': detail,
                                'style': 'danger'
                            });
                        }
                        setTimeout(layout.animateScrollTo(0), 100); // scroll to top
                    }
                    this.setState(stateToSet);
                } else { // response successful
                    let responseData;
                    let submitted_at_id;
                    if (test){
                        stateToSet.keyValid[inKey] = 3;
                        this.setState(stateToSet);
                        return;
                    } else {
                        [ responseData ] = response['@graph'];
                        submitted_at_id = object.itemUtil.atId(responseData);
                        console.log("submittedAtid=",submitted_at_id);
                    }
                    // handle submission for round two
                    if (roundTwo){
                        // there is a file
                        if (file && responseData.upload_credentials){

                            // add important info to result from finalizedContext
                            // that is not added from /types/file.py get_upload
                            const creds = responseData.upload_credentials;

                            import(
                                /* webpackChunkName: "aws-utils" */
                                /* webpackMode: "lazy" */
                                '../util/aws'
                            ).then(({ s3UploadFile })=>{
                                //const awsUtil = require('../util/aws');
                                const upload_manager = s3UploadFile(file, creds);

                                if (upload_manager === null){
                                    // bad upload manager. Cause an alert
                                    alert("Something went wrong initializing the upload. Please contact the 4DN-DCIC team.");
                                } else {
                                    // this will set off a chain of aync events.
                                    // first, md5 will be calculated and then the
                                    // file will be uploaded to s3. If all of this
                                    // is succesful, call finishRoundTwo.
                                    stateToSet.uploadStatus = null;
                                    this.setState(stateToSet);
                                    this.updateUpload(upload_manager);
                                }
                            });

                        } else {
                            // state cleanup for this key
                            this.finishRoundTwo();
                            this.setState(stateToSet);
                        }
                    } else { // posted new object; need to re-key this item
                        stateToSet.keyValid[inKey] = 4;
                        // Perform final steps when object is submitted
                        // *** SHOULD THIS STUFF BE BROKEN OUT INTO ANOTHER FXN?
                        // find key of parent object, starting from top of hierarchy
                        var parentKey = parseInt(findParentFromHierarchy(keyHierarchy, inKey));
                        // navigate to parent obj if it was found. Else, go to top level
                        stateToSet.currKey = (parentKey !== null && !isNaN(parentKey) ? parentKey : 0);

                        // make copies of various pieces of state for editing & update
                        var typesCopy = _.clone(keyTypes);
                        var keyCompleteCopy = _.clone(keyComplete);
                        var linksCopy = _.clone(keyLinks);
                        var displayCopy = _.clone(keyDisplay);
                        var hierCopy = _.clone(keyHierarchy);
                        var contextCopy = _.clone(keyContext); // set contextCopy to returned data from POST
                        var roundTwoCopy = roundTwoKeys.slice();

                        // add keys using the submitted object's new @id instead of the old keyIdx
                        keyCompleteCopy[inKey] = submitted_at_id;
                        linksCopy[submitted_at_id] = linksCopy[inKey];
                        typesCopy[submitted_at_id] = currType;
                        displayCopy[submitted_at_id] = displayCopy[inKey];
                        contextCopy[submitted_at_id] = responseData;
                        contextCopy[inKey] = buildContext(responseData, currSchema, null, true, false);

                        // update the state object with these new copies
                        stateToSet.keyLinks = linksCopy;
                        stateToSet.keyTypes = typesCopy;
                        stateToSet.keyComplete = keyCompleteCopy;
                        stateToSet.keyDisplay = displayCopy;
                        stateToSet.keyContext = contextCopy;

                        // if not submitting the principal object, update context and hierarchy
                        if (inKey !== 0) {
                            const { splitField, arrayIdx } = findFieldFromContext(contextCopy[parentKey], typesCopy[parentKey], schemas, inKey, responseData['@type']);
                            console.log('Results from findFieldFromContext', splitField, arrayIdx);

                            modifyContextInPlace(splitField, contextCopy[parentKey], arrayIdx, "linked object", submitted_at_id);
                            replaceInHierarchy(hierCopy, inKey, submitted_at_id); // Modifies hierCopy in place.

                            delete stateToSet.keyDisplay[inKey];
                        }

                        stateToSet.keyHierarchy = hierCopy; // update keyHierarchy after update by replaceInHierarchy

                        // clean up no longer necessary state
                        delete stateToSet.keyLinks[inKey];
                        delete stateToSet.keyValid[inKey];
                        //delete stateToSet.keyContext[inKey];
                        //delete stateToSet.keyDisplay[inKey];

                        // reflect that submitting object was successful
                        stateToSet.keyValid[submitted_at_id] = 4;

                        // update roundTwoKeys if necessary
                        const needsRoundTwo = this.checkRoundTwo(currSchema);
                        if (needsRoundTwo && !_.contains(roundTwoCopy, inKey)){
                            // was getting an error where this could be str
                            roundTwoCopy.push(parseInt(inKey));
                            stateToSet.roundTwoKeys = roundTwoCopy;
                        }

                        // if submitting the primary object, check if round two submission needs to occur...
                        if (inKey === 0){
                            if (roundTwoCopy.length === 0){
                                // we're done!
                                setIsSubmitting(false, () => {
                                    propNavigate(callbackHref || submitted_at_id);
                                });
                            } else {
                                // break this out into another fxn?
                                // roundTwo initiation
                                stateToSet.roundTwo = true;
                                stateToSet.currKey = roundTwoCopy[0];
                                // reset validation state for all round two keys
                                for (i = 0; i < roundTwoCopy.length; i++){
                                    stateToSet.keyValid[roundTwoCopy[i]] = 0;
                                }
                                alert('Success! All objects were submitted. However, one or more have additional fields that can be only filled in second round submission. You will now be guided through this process for each object.');
                                this.setState(stateToSet);
                            }
                        } else {
                            console.log("updating state with stateToSet: ", stateToSet);
                            console.log("keyDisplay, ", keyDisplay);
                            console.log("inKey: , ", inKey);

                            alert(keyDisplay[inKey] + ' was successfully submitted.');

                            this.setState(stateToSet);
                        }
                    }
                    ReactTooltip.rebuild();
                }
            });
        };

        if (currentSubmittingUser && Array.isArray(currentSubmittingUser.submits_for) && currentSubmittingUser.submits_for.length > 0){
            // use first lab for now
            ajax.promise(object.itemUtil.atId(currentSubmittingUser.submits_for[0])).then((myLab) => {
                // use first award for now
                var myAward = (myLab && Array.isArray(myLab.awards) && myLab.awards.length > 0 && myLab.awards[0]) || null;
                submitProcessContd(myLab, myAward);
            });
        } else {
            console.log("submitting process continued");
            submitProcessContd();
        }
    }

    /**
     * Finish the roundTwo process for the current key.
     *
     * Removes the currKey from
     * this.state.roundTwoKeys and modifies state to finish out for that object.
     * If there are no keys left in roundTwoKeys, navigate to the path of the
     * principal object we created.
     */
    finishRoundTwo(){
        this.setState(function({ currKey, keyValid, roundTwoKeys = [] }){
            const validationCopy = _.clone(keyValid);
            const roundTwoCopy = roundTwoKeys.slice();
            validationCopy[currKey] = 4;
            if ( _.contains(roundTwoCopy, currKey)){
                const rmIdx = roundTwoCopy.indexOf(currKey);
                if (rmIdx > -1){
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
        }, ()=>{
            const { setIsSubmitting, navigate: propNavigate } = this.props;
            const { keyComplete, roundTwoKeys = [], callbackHref } = this.state;
            if (roundTwoKeys.length === 0){
                // we're done!
                setIsSubmitting(false, ()=>{
                    propNavigate(callbackHref || keyComplete[0]);
                });
            }
        });
    }

    cancelCreateNewObject(){
        this.setState(function({ creatingIdx, keyContext, currKey, creatingLinkForField }){
            if (!creatingIdx) return null;
            const nextKeyContext = _.clone(keyContext);
            const currentContextPointer = nextKeyContext[currKey];
            const parentFieldToClear = typeof creatingLinkForField === 'string' && creatingLinkForField;
            _.pairs(currentContextPointer).forEach(function([field, idx]){
                if (field === parentFieldToClear){
                    // Unset value to null
                    if (idx === creatingIdx){
                        currentContextPointer[field] = null;
                    }
                    // Remove value from array.
                    if (Array.isArray(idx)){
                        const idxInArray = idx.indexOf(creatingIdx);
                        if (idxInArray > -1){
                            currentContextPointer[field].splice(idxInArray, 1);
                        }
                    }
                }
            });
            return {
                'ambiguousIdx': null,
                'ambiguousType': null,
                'ambiguousSelected': null,
                'creatingAlias' : '',
                'creatingIdx': null,
                'creatingType': null,
                'creatingLink': null,
                'keyContext' : nextKeyContext,
                'creatingLinkForField' : null
            };
        });
    }

    /** Navigate to version of same page we're on, minus the `currentAction` URI parameter. */
    cancelCreatePrimaryObject(skipAskToLeave = false){
        const { callbackHref } = this.state;
        const { href, navigate, setIsSubmitting } = this.props;
        const leaveFunc = () => { // Navigate out.
            let nextURI;
            const navOpts = {};
            if (callbackHref) {
                nextURI = callbackHref;
            } else {
                const parts = _.clone(memoizedUrlParse(href));
                const modifiedQuery = _.omit(parts.query, 'currentAction');
                const modifiedSearch = queryString.stringify(modifiedQuery);

                parts.query = modifiedQuery;
                parts.search = (modifiedSearch.length > 0 ? '?' : '') + modifiedSearch;
                nextURI = url.format(parts);
                navOpts.skipRequest = true;
            }

            navigate(nextURI, navOpts);
        };

        if (skipAskToLeave === true){
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
    render(){
        console.log('TOP LEVEL STATE:', this.state);
        const { schemas } = this.props;
        const { currKey, keyContext, ambiguousIdx, ambiguousType, creatingType, creatingIdx, keyTypes, fullScreen, keyDisplay, keyHierarchy } = this.state;

        // see if initialized
        if (!keyContext || currKey === null){
            return null;
        }
        const showAmbiguousModal = ambiguousIdx !== null && ambiguousType !== null;
        const showAliasModal = !showAmbiguousModal && creatingIdx !== null && creatingType !== null;
        const currType = keyTypes[currKey];
        const currContext = keyContext[currKey];
        const navCol = "mb-4 " + (fullScreen ? 'submission-hidden-nav' : 'col-12 col-md-3');
        const bodyCol = fullScreen ? 'col-12' : 'col-12 col-md-9';

        // remove context and navigate from this.props
        const { context, navigate, ...propsToPass } = this.props;
        const currObjDisplay = keyDisplay[currKey] || currType;
        return (
            <div className="submission-view-page-container container" id="content">
                <TypeSelectModal show={showAmbiguousModal} {..._.pick(this.state, 'ambiguousIdx', 'ambiguousType', 'ambiguousSelected', 'currKey', 'creatingIdx')}
                    {..._.pick(this, 'buildAmbiguousEnumEntry', 'submitAmbiguousType', 'cancelCreateNewObject', 'cancelCreatePrimaryObject')} schemas={schemas}
                />
                <AliasSelectModal
                    show={showAliasModal} {..._.pick(this.state, 'creatingAlias', 'creatingType', 'creatingAliasMessage', 'currKey', 'creatingIdx', 'currentSubmittingUser')}
                    handleAliasChange={this.handleAliasChange} submitAlias={this.submitAlias} cancelCreateNewObject={this.cancelCreateNewObject} cancelCreatePrimaryObject={this.cancelCreatePrimaryObject}
                />
                <WarningBanner cancelCreatePrimaryObject={this.cancelCreatePrimaryObject}>
                    <button type="button" className="btn btn-danger" onClick={this.cancelCreatePrimaryObject}>Cancel / Exit</button>
                    <ValidationButton {..._.pick(this.state, 'currKey', 'keyValid', 'md5Progress', 'upload', 'roundTwo', 'processingFetch')}
                        testPostNewContext={this.testPostNewContext} finishRoundTwo={this.finishRoundTwo}  />
                    <SubmitButton {..._.pick(this.state, 'keyValid', 'currKey', 'roundTwo', 'upload', 'processingFetch', 'md5Progress')}
                        realPostNewContext={this.realPostNewContext} />
                </WarningBanner>
                <DetailTitleBanner hierarchy={keyHierarchy} setSubmissionState={this.setSubmissionState} schemas={schemas}
                    {..._.pick(this.state, 'keyContext', 'keyTypes', 'keyDisplay', 'currKey', 'fullScreen')} />
                <div className="clearfix row">
                    <div className={navCol}>
                        <SubmissionTree setSubmissionState={this.setSubmissionState}
                            hierarchy={keyHierarchy} schemas={schemas}
                            {..._.pick(this.state, 'keyValid', 'keyTypes', 'keyDisplay', 'keyComplete', 'currKey', 'keyLinkBookmarks', 'keyLinks', 'keyHierarchy')}
                        />
                    </div>
                    <div className={bodyCol}>
                        <IndividualObjectView
                            {...propsToPass}
                            schemas={schemas}
                            currType={currType}
                            currContext={currContext}
                            modifyKeyContext={this.modifyKeyContext}
                            initCreateObj={this.initCreateObj}
                            removeObj={this.removeObj}
                            addExistingObj={this.addExistingObj}
                            setSubmissionState={this.setSubmissionState}
                            modifyAlias={this.modifyAlias}
                            updateUpload={this.updateUpload}
                            hierarchy={keyHierarchy}
                            {..._.pick(this.state, 'keyDisplay', 'keyComplete', 'keyIter', 'currKey', 'keyContext', 'upload', 'uploadStatus', 'md5Progress', 'roundTwo', 'currentSubmittingUser')}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


/**
 * Generate JSX for a validation button. Disabled unless validation state == 1
 * (when all children are complete and no errors/unsubmitted) or == 2
 * (submitted by validation errors). If the submission is processing, render
 * a spinner icon.
 * When roundTwo, validation becomes Skip, which allows you to skip roundTwo
 * submissions for an object. Disable when the is an initialized upload or the
 * md5 is calculating.
 */
const ValidationButton = React.memo(function ValidationButton(props){
    const { currKey, keyValid, md5Progress, upload, roundTwo, processingFetch, finishRoundTwo, testPostNewContext } = props;
    const validity = keyValid[currKey];
    // when roundTwo, replace the validation button with a Skip
    // button that completes the submission process for currKey
    if (roundTwo){
        if (upload === null && md5Progress === null){
            return (
                <button type="button" className="btn btn-warning" onClick={finishRoundTwo}>
                    Skip
                </button>
            );
        } else {
            return <button type="button" className="btn btn-warning" disabled>Skip</button>;
        }
    } else if (validity === 3 || validity === 4){
        return <button type="button" className="btn btn-info" disabled>Validated</button>;
    } else if (validity === 2){
        if (processingFetch) {
            return (
                <button type="button" className="btn btn-danger" disabled>
                    <i className="icon icon-spin icon-circle-notch fas"/>
                </button>
            );
        } else {
            return <button type="button" className="btn btn-danger" onClick={testPostNewContext}>Validate</button>;
        }
    } else if (validity === 1){
        if (processingFetch) {
            return (
                <button type="button" className="btn btn-info" disabled>
                    <i className="icon icon-spin icon-circle-notch fas"/>
                </button>
            );
        } else {
            return <button type="button" className="btn btn-info" onClick={testPostNewContext}>Validate</button>;
        }
    } else {
        return <button type="button" className="btn btn-info" disabled>Validate</button>;
    }
});


/**
 * Generate JSX for the the button that allows users to submit their custom
 * objects. Only active when validation state == 3 (validation successful).
 *
 * In roundTwo, there is no validation step, so only inactive when there is
 * an active upload of md5 calculation.
 */
const SubmitButton = React.memo(function(props){
    const { keyValid, currKey, roundTwo, upload, processingFetch, md5Progress, realPostNewContext } = props;
    const validity = keyValid[currKey];
    if (roundTwo) {
        if (upload !== null || processingFetch || md5Progress !== null) {
            return (
                <button type="button" disabled className="btn btn-success">
                    <i className="icon icon-spin icon-circle-notch fas"/>
                </button>
            );
        } else {
            return <button type="button" className="btn btn-success" onClick={realPostNewContext}>Submit</button>;
        }
    } else if (validity == 3) {
        if (processingFetch){
            return (
                <button type="button" disabled className="btn btn-success">
                    <i className="icon icon-spin icon-circle-notch fas"/>
                </button>
            );
        } else {
            return <button type="button" className="btn btn-success" onClick={realPostNewContext}>Submit</button>;
        }
    } else if (validity == 4) {
        return <button type="button" className="btn btn-success" disabled>Submitted</button>;
    } else {
        return <button type="button" className="btn btn-success" disabled>Submit</button>;
    }
});


const WarningBanner = React.memo(function WarningBanner(props){
    const { children } = props;
    return(
        <div className="mb-2 mt-1 text-400 warning-banner">
            <div className="row">
                <div className="col">
                    Please note: your work will be lost if you navigate away from, refresh or close this page while submitting. The submission process is under active development and features may change.
                </div>
                <div className="col-md-auto">
                    <div className="action-buttons-container text-right">{ children }</div>
                </div>
            </div>
        </div>
    );
});


class DetailTitleBanner extends React.PureComponent {

    /**
     * Traverse keyHierarchy option to get a list of hierarchical keys, e.g. 0,1,4 if are on currKey 4 that is a child of currKey 1 that is a child of currKey 0.
     *
     * @param {Object} hierachy - Hierarchy as defined on state of SubmissionView components.
     * @param {number} currKey - Current key of Object/Item we're editing.
     * @returns {number[]} List of keys leading from 0 to currKey.
     */
    static getListOfKeysInPath(hierachy, currKey){
        function findNestedKey(obj){
            if (typeof obj[currKey] !== 'undefined'){
                return [currKey];
            } else {
                var nestedFound = _.find(
                    _.map(
                        _.pairs(obj), // p[0] = key, p[1] = child obj with keys
                        function(p){ return [ p[0], findNestedKey(p[1]) ]; }
                    ),
                    function(p){
                        return (typeof p[1] !== 'undefined' && p[1] !== null);
                    }
                );
                if (nestedFound){
                    return [parseInt(nestedFound[0])].concat(nestedFound[1]);
                }

            }
        }
        return findNestedKey(hierachy);
    }

    static getContextPropertyNameOfNextKey(context, nextKey, getArrayIndex = false){
        var foundPropertyName = null;
        var arrayIdx = null;
        _.pairs(context).forEach(function(p){
            if (foundPropertyName) return;
            if (p[1] === nextKey){
                foundPropertyName = p[0];
            }
            // Remove value from array.
            if (Array.isArray(p[1])){
                arrayIdx = p[1].indexOf(nextKey);
                if (typeof arrayIdx === 'number' && arrayIdx > -1){
                    foundPropertyName = p[0];
                } else {
                    arrayIdx = null;
                }
            }
        });
        if (getArrayIndex){
            return [foundPropertyName, arrayIdx];
        }
        return foundPropertyName;
    }

    constructor(props){
        super(props);
        this.generateCrumbTitle = this.generateCrumbTitle.bind(this);
        this.toggleOpen = _.throttle(this.toggleOpen.bind(this), 500);
        this.generateHierarchicalTitles = this.generateHierarchicalTitles.bind(this);
        this.state = { 'open' : true };
    }

    handleClick(keyIdx, e){
        e.preventDefault();
        this.props.setSubmissionState('currKey', keyIdx);
    }

    toggleOpen(e){
        e.preventDefault();
        this.setState(function({ open }){
            return { 'open' : !open };
        });
    }

    generateCrumbTitle(numKey, i = 0, hierarchyKeyList = null){
        const { keyTypes, keyDisplay, hierarchy, schemas, fullScreen, actionButtons, keyContext } = this.props;
        if (hierarchyKeyList === null){
            hierarchyKeyList = [numKey];
        }
        var icon = i === 0 ? null : <i className="icon icon-fw">&crarr;</i>;
        var isLast = i + 1 === hierarchyKeyList.length;
        var parentPropertyName = null;
        if (i !== 0){
            try {
                var [ parentPropertyNameUnsanitized, parentPropertyValueIndex ] = DetailTitleBanner.getContextPropertyNameOfNextKey(  keyContext[hierarchyKeyList[i - 1]]  ,  hierarchyKeyList[i]  ,  true  );
                parentPropertyName = schemaTransforms.lookupFieldTitle(
                    parentPropertyNameUnsanitized, schemas, keyTypes[hierarchyKeyList[i - 1]]
                );
                if (parentPropertyValueIndex !== null){
                    parentPropertyName += ' (Item #' + (parentPropertyValueIndex + 1) + ')';
                }
            } catch (e){ console.warn('Couldnt get property name for', keyContext[hierarchyKeyList[i - 1]], hierarchyKeyList[i]); }
        }
        return (
            <Collapse in appear={(hierarchyKeyList.length !== 1)} key={i}>
                <div className={"title-crumb depth-level-" + i + (isLast ? ' last-title' : ' mid-title')}>
                    <div className="submission-working-title">
                        <span onClick={this.handleClick.bind(this, numKey)}>
                            { icon }
                            { parentPropertyName ? <span className="next-property-name">{ parentPropertyName }: </span> : null }
                            <span className="working-subtitle">{ schemaTransforms.getTitleForType(keyTypes[numKey], schemas) }</span> <span>{ keyDisplay[numKey] }</span>
                        </span>
                    </div>
                </div>
            </Collapse>
        );
    }

    generateHierarchicalTitles(){
        var { hierarchy, currKey } = this.props;
        return _.map(DetailTitleBanner.getListOfKeysInPath(hierarchy, currKey), this.generateCrumbTitle);
    }

    render(){
        const { fullScreen, currKey } = this.props;
        const { open } = this.state;
        if (fullScreen) return null;
        return (
            <h3 className="crumbs-title mb-2">
                <div className="subtitle-heading form-section-heading mb-08">
                    <span className="inline-block clickable" onClick={this.toggleOpen}>
                        Currently Editing { currKey > 0 ? <i className={"icon icon-fw fas icon-caret-" + (open ? 'down' : 'right')} /> : null }
                    </span>
                </div>
                { open ? this.generateHierarchicalTitles() : this.generateCrumbTitle(currKey) }
            </h3>
        );
    }
}


/** TODO: DropdownButton to be v4 bootstrap compliant */
class TypeSelectModal extends React.Component {

    constructor(props){
        super(props);
        this.onHide = this.onHide.bind(this);
        this.onContainerKeyDown = this.onContainerKeyDown.bind(this);
    }

    onHide(){
        const { ambiguousIdx, cancelCreatePrimaryObject, cancelCreateNewObject } = this.props;
        if (ambiguousIdx === null || ambiguousIdx === 0){
            // If just starting (creating first item / idx), navigate to non-edit version of page we are currently on.
            cancelCreatePrimaryObject(true);
        } else if (ambiguousIdx > 0){
            // Else cancel creating new object by unsetting temporary state & values.
            cancelCreateNewObject();
        }
    }

    onContainerKeyDown(enterKeyCallback, event){
        if (event.which === 13 || event.keyCode === 13) {
            enterKeyCallback(event);
            return false;
        }
        return true;
    }

    render(){
        const { show, ambiguousType, ambiguousSelected, buildAmbiguousEnumEntry, submitAmbiguousType, schemas } = this.props;
        if (!show) return null;

        const itemTypeHierarchy = schemaTransforms.schemasToItemTypeHierarchy(schemas);

        let specificItemTypeOptions = null;

        if (ambiguousType === "Item"){
            specificItemTypeOptions = _.keys(schemas).filter(function(itemType){
                return !(schemas[itemType].isAbstract);
            });
        } else if (ambiguousType !== null) {
            specificItemTypeOptions = _.keys(itemTypeHierarchy[ambiguousType]);
        }

        let ambiguousDescrip = null;
        if (ambiguousSelected !== null && schemas[ambiguousSelected].description){
            ambiguousDescrip = schemas[ambiguousSelected].description;
        }
        return (
            <Modal show onHide={this.onHide} className="submission-view-modal">
                <Modal.Header>
                    <Modal.Title className="text-500">
                        Multiple instantiable types found for your new <strong>{ ambiguousType }</strong>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div onKeyDown={this.onContainerKeyDown.bind(this, submitAmbiguousType)}>
                        <p>Please select a specific Item type from the menu below.</p>
                        <div className="input-wrapper mb-15">
                            <DropdownButton id="dropdown-type-select" title={ambiguousSelected || "No value"}>
                                { specificItemTypeOptions.map(buildAmbiguousEnumEntry) }
                            </DropdownButton>
                        </div>
                        { ambiguousDescrip ?
                            <div className="mb-15 mt-15">
                                <h5 className="text-500 mb-02">Description</h5>
                                { ambiguousDescrip }
                            </div>
                            : null}
                        <button type="button" className="btn btn-primary" disabled={ambiguousSelected === null} onClick={submitAmbiguousType}>
                            Submit
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

/** Ordinary React Component which just inherits TypeSelectModal.onHide() */
class AliasSelectModal extends TypeSelectModal {

    render(){
        const { show, creatingType, creatingAlias, handleAliasChange, creatingAliasMessage, submitAlias, currentSubmittingUser } = this.props;
        if (!show) return null;

        const disabledBtn = creatingAlias.indexOf(':') < 0 || (creatingAlias.indexOf(':') + 1 === creatingAlias.length);

        return (
            <Modal show onHide={this.onHide} className="submission-view-modal">
                <Modal.Header>
                    <Modal.Title>Give your new { creatingType } an alias</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div onKeyDown={this.onContainerKeyDown.bind(this, submitAlias)}>
                        <p className="mt-0 mb-1">Aliases are lab specific identifiers to reference an object. The format is <code>{'<lab-name>:<identifier>'}</code> - a lab name and an identifier separated by a colon, e.g. <code>dcic-lab:42</code>.</p>
                        <p className="mt-0 mb-1">Please create your own alias to help you to refer to this Item later.</p>
                        <div className="input-wrapper mt-2 mb-2">
                            <AliasInputField value={creatingAlias} errorMessage={creatingAliasMessage} onAliasChange={handleAliasChange} currentSubmittingUser={currentSubmittingUser} withinModal />
                        </div>
                        { creatingAliasMessage ?
                            <div style={{ 'marginBottom':'15px', 'color':'#7e4544','fontSize':'1.2em' }}>
                                { creatingAliasMessage }
                            </div>
                            : null }
                        <div className="text-right">
                            {/*
                            <Button type="button" bsStyle="danger" onClick={this.onHide}>Cancel / Exit</Button>
                            {' '}
                            */}
                            <button type="button" className="btn btn-primary" disabled={disabledBtn} onClick={submitAlias}>Submit</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}


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
class IndividualObjectView extends React.Component {

    constructor(props){
        super(props);
        _.bindAll(this, 'modifyNewContext', 'fetchAndValidateItem',
            'selectObj', 'selectComplete', 'selectCancel', 'initiateField'
        );

        /**
         * State in this component mostly has to do with selection of existing objs
         *
         * @prop {!string} selectType           Type of existing object being selected (i.e. ExperimentHiC).
         * @prop {!string} selectField          Actual fieldname that we're selecting the existing obj for. May be nested in the case of subobjects, e.g. experiments_in_set.experiment
         * @prop {!number[]} selectArrayIdx     List of int numbers keeping track of list positions of the object we're selecting for. Since you can have arrays within arrays, one int won't do. Example: [1,2] would mean the current field is the second item within the first item of the array given by the top level field. When null, no arrays involved.
         */
        this.state = {
            'selectType'    : null,
            'selectField'   : null,
            'selectArrayIdx': null
        };
    }

    // componentDidUpdate(pastProps, pastState) {
    //     console.log("previous state = ", pastState);
    //     console.log("new state = ", this.state);
    // }

    /**
     * Takes a field and value and modifies the keyContext held in parent.
     *
     * @param {string}  field       Name of field on parent Item for which a value is being changed.
     * @param {any}     value       New value we are setting for this field.
     * @param {string}  fieldType   Internal descriptor for field type we're editing.
     * @param {string}  newLink     Schema-formatted property name for linked Item property, e.g. 'Biosources', 'Treatments', 'Cell Culture Information' when editing a parent "Biosample" Item.
     * @param {!number} arrayIdx    Index in array of value when entire value for property is an array.
     * @param {!string} type        Type of Item we're linking to, if creating new Item/object only, if property is a linkTo. E.g. 'ExperimentSetReplicate', 'BiosampleCellCulture', etc.
     * @param {boolean} valueTitle  Display title of object being changed
     *
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
     * TODO: Examine why newLink isn't being used anywhere; what was it for, why did it disappear? Should it be in use?
     */
    modifyNewContext(field, value, fieldType, newLink, arrayIdx=null, type=null, valueTitle=null){
        // console.log("calling modifyNewContext with: ", ...arguments);
        const { currContext, currKey, initCreateObj, modifyKeyContext, modifyAlias, removeObj, keyComplete } = this.props;

        if (fieldType === 'new linked object'){
            value = this.props.keyIter + 1;
            if(this.props.roundTwo){
                alert('Objects cannot be created in this stage of submission. Please select an existing one.');
                return;
            }
        }

        if (!field || typeof field !== 'string'){
            // Throw error instead?
            console.error('No field supplied', ...arguments);
        }

        const splitField = field.split('.');
        // todo: re-implement modifyContextInPlace... somehow the f(x) has the exact same logic but causes a
        // "_modifyContextInPlace is undefined" TypeError when used in certain cases (creating CaptureC experiment sets, Static Sections, etc)
        // const { currContext, prevValue } = modifyContextInPlace(splitField, propCurrContext, arrayIdx, fieldType, value);

        /* modifyContextInPlace can replace everything below this point, until indicated */
        const splitFieldLeaf = splitField[splitField.length-1];
        let arrayIdxPointer = 0;
        const contextCopy = currContext; //object.deepClone(currContext);
        let pointer = contextCopy;
        let prevValue = null;
        for (let i=0; i < splitField.length - 1; i++){
            if(pointer[splitField[i]]){
                pointer = pointer[splitField[i]];
            }else{
                console.error('PROBLEM CREATING NEW CONTEXT WITH: ', splitField, value);
                return;
            }
            if(Array.isArray(pointer)){
                pointer = pointer[arrayIdx[arrayIdxPointer]];
                arrayIdxPointer += 1;
            }
        }
        if (Array.isArray(pointer[splitFieldLeaf]) && fieldType !== 'array'){
            // move pointer into array
            pointer = pointer[splitFieldLeaf];
            prevValue = pointer[arrayIdx[arrayIdxPointer]];
            if (value === null){ // delete this array itemfieldType
                pointer.splice(arrayIdx[arrayIdxPointer], 1);
            } else {
                pointer[arrayIdx[arrayIdxPointer]] = value;
            }
        } else { // value we're trying to set is not inside an array at this point
            prevValue = pointer[splitFieldLeaf];
            pointer[splitFieldLeaf] = value;
        }
        /* modifyContextInPlace can replace everything up until this point... need to update var names, though */

        console.log("modifyNewContext II", value, currContext);
        if ((value === null || prevValue !== null) && (fieldType === 'linked object' || fieldType === "existing linked object" || fieldType === 'new linked object')){
            console.log("removing obj ", prevValue);
            removeObj(prevValue);
        }

        if (fieldType === 'new linked object'){
            // value is new key index in this case
            initCreateObj(type, value, field, false, field);
        } else {
            // actually change value
            modifyKeyContext(currKey, currContext, valueTitle);
        }

        if (splitFieldLeaf === 'aliases' || splitFieldLeaf === 'name' || splitFieldLeaf === 'title'){
            modifyAlias();
        }

    }

    /**
     * Use ajax to get the display_title for an existing object. Use that to kicks
     * of the addExistingObj process; if a title can't be found, use the object
     * @id as a fallback.
     *
     * @param {string} itemAtID    The @id or unique key of the Item for which we want to validate and get title for.
     * @param {string} field       
     * @param {string} type        The Item type of value.
     * @param {number} arrayIdx    
     * @param {any}    newLink     Schema-formatted property name for linked Item property, e.g. 'Biosources', 'Treatments', 'Cell Culture Information' when editing a parent "Biosample" Item.
     */
    fetchAndValidateItem(itemAtID, field, type, arrayIdx, newLink = null){
        // console.log(`calling fetchAndValidateItem(
        //     field=${field},
        //     type=${type},
        //     arrayIdx=${arrayIdx},
        //     newLink=${newLink}`);
        const { addExistingObj } = this.props;

        let hrefToFetch = itemAtID;
        const failureAlertTitle = "Validation error for field '" + field + "'" + (typeof arrayIdx === 'number' ? ' [' + arrayIdx + ']' : '');
        const failureCallback = () => {
            Alerts.queue({
                "title"     : failureAlertTitle,
                "message"   : "Could not find valid" + (type ? " '" + type + "'" : '') + " Item in database for value '" + itemAtID + "'.",
                "style"     : "danger"
            });
            layout.animateScrollTo(0); // Scroll to top of page so alert is visible to end-user.
            this.modifyNewContext(field, null, 'existing linked object', null, arrayIdx);
        };

        const successCallback = (result)=>{
            // console.log("fetchAndValidateItem successfully found: ", result);
            Alerts.deQueue({ 'title' : failureAlertTitle });
            this.modifyNewContext(field, result['@id'], 'existing linked object', result['@type'][1], arrayIdx, result.display_title);
            addExistingObj(itemAtID, result.display_title, type, field, false);
        };

        if (typeof hrefToFetch !== 'string') {
            failureCallback();  // TODO: Might be nice to update with more specific messages in this case.
            return;
        }

        if (hrefToFetch.charAt(0) !== '/'){ // Pre-pend slash so will request hostname + '/' + itemAtID.
            hrefToFetch = '/' + hrefToFetch;
        }

        ajax.load(hrefToFetch, (result)=>{
            if (result && result.display_title && Array.isArray(result['@type']) ){
                if (type) { // Check for matching Type validity.
                    if (result['@type'].indexOf(type) > -1) {
                        successCallback(result);
                        return;
                    }
                } else { // Any Item type == valid, is assumed (e.g. linkTo type Item)
                    successCallback(result);
                    return;
                }
            }
            failureCallback();
        }, 'GET', failureCallback);
    }

    /**
     * Initializes the first search (with just type=<type>) and sets state
     * accordingly. Set the fullScreen state in SubmissionView to alter its render
     * and hide the object navigation tree.
     *
     * @param {object} collection
     * @param {string} field
     * @param {number} arrayIdx
     */
    selectObj(collection, field, arrayIdx=null){
        // console.log(`calling selectObj(
        //     collection=${collection},
        //     field=${field},
        //     arrayIdx=${arrayIdx})`);
        this.setState({ 'selectField' : field, 'selectArrayIdx': arrayIdx, 'selectType' : collection });
    }

    /**
     * Callback passed to Search to select a pre-existing object. Cleans up
     * object selection state, modifies context, and initializes the fetchAndValidateItem
     * process.
     *
     * @param {array | string} atIds        Either an @id string or an array of @id strings to be selected
     * @param {string} customSelectField    @todo but what actually is it? collection or something else?
     * @param {string} customSelectType
     * @param {number} customArrayIdx
     */
    selectComplete(atIds, customSelectField = null, customSelectType = null, customArrayIdx = null) {
        // console.log(`calling selectComplete(
        //     atIds=${atIds},
        //     customSelectField=${customSelectField},
        //     customSelectType=${customSelectType},
        //     customArrayIdx=${customArrayIdx},
        //     valueToReplace=${valueToReplace}`);
        const { currContext } = this.props;
        const {
            selectField: stateSelectField,
            selectArrayIdx: stateSelectArrayIdx,
            selectType: stateSelectType
        } = this.state;

        const selectField = customSelectField || stateSelectField;
        const selectArrayIdx = customArrayIdx || stateSelectArrayIdx;
        const selectType = customSelectType || stateSelectType;

        const isInArray = selectArrayIdx && Array.isArray(selectArrayIdx);
        const nextArrayIndices = isInArray ? [...selectArrayIdx] : null;
        const isMultiSelect = Array.isArray(atIds) && atIds.length > 1;

        // LinkedObj will always call with array, while Search-As-You-Type will call with single value.
        // Can be adjusted in either direction (either have LinkedObj call with 1 item if only 1; or have Search-As-You-Type
        // pass in array as well).
        if (!Array.isArray(atIds) && typeof atIds === "string"){
            atIds = [ atIds ];
        }

        if (!selectField){
            throw new Error('No field being selected for');
        }


        atIds.forEach((atId)=>{
            const currentlySelectedIds = selectField && currContext[selectField];
            const isRepeat = (Array.isArray(currentlySelectedIds) && _.contains(currentlySelectedIds, atId));
            // console.log("current: ", selectField);
            // console.log("currentlySelectedIds", currentlySelectedIds);
            // console.log("currContext: ", currContext);
            // console.log("currContext[selectField]: ", currContext[selectField]);
            // console.log("isInArray: ", isInArray);
            if (!isRepeat) {
                this.fetchAndValidateItem(atId, selectField, selectType, isInArray ? nextArrayIndices.slice() : null, null);
                if (isMultiSelect) { // Sets up nextArrayIndices for next Item being added in multiselect
                    nextArrayIndices[nextArrayIndices.length - 1]++;
                }
            } else {
                if (!isInArray) { // if the only value, just "replace" the value so it doesn't get deleted from state
                    // this can also serve to update the display title if, say, a recently created item is indexed and then
                    // reselected from dropdown
                    this.modifyNewContext(selectField, atId, 'existing linked object', null, selectArrayIdx);
                } else {
                    // check if the repeat is the current field; if it is, "replace" it.
                    if (currentlySelectedIds[selectArrayIdx] === atId) {
                        this.modifyNewContext(selectField, atId, 'existing linked object', null, selectArrayIdx);
                    } else { // don't allow a "replacement"; cancel
                        this.modifyNewContext(selectField, null, 'existing linked object', null, selectArrayIdx);
                    }
                }
            }
        });

        this.setState({ 'selectField': null, 'selectArrayIdx': null, 'selectType': null });
    }

    /** Exit out of the selection process and clean up state */
    selectCancel(e){
        var { selectField, selectArrayIdx } = this.state;
        this.modifyNewContext(selectField, null, 'existing linked object', null, selectArrayIdx);
        this.setState({ 'selectType': null, 'selectField': null, 'selectArrayIdx': null });
    }

    /**
     * Given a field, use the schema to generate the sufficient information to
     * make a BuildField component for that field. Different fields are returned
     * for roundOne and roundTwo.
     */
    initiateField(field) {
        const { schemas, currType, currKey, roundTwo, currContext, keyComplete, keyContext, edit } = this.props;
        const currSchema  = schemas[currType];

        // console.log("RENDER INDV OBJ VIEW", currSchema, field);
        const fieldSchema = object.getNestedProperty(currSchema, ['properties', field], true);

        if (!fieldSchema) return null;

        const secondRoundField    = fieldSchema.ff_flag && fieldSchema.ff_flag == 'second round';
        const fieldTitle          = fieldSchema.title || field;

        if(roundTwo && !secondRoundField){
            return null;
        } else if (!roundTwo && secondRoundField){
            // return a placeholder informing user that this field is for roundTwo
            return(
                <div key={fieldTitle} className="row field-row" required={false} title={fieldTitle} style={{ 'overflow':'visible' }}>
                    <div className="col-12 col-md-4">
                        <h5 className="facet-title submission-field-title">{ fieldTitle }</h5>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="field-container">
                            <div className="notice-message">This field is available after finishing initial submission.</div>
                        </div>
                    </div>
                </div>
            );
        }

        let fieldTip = fieldSchema.description ? fieldSchema.description : null;
        if(fieldSchema.comment){
            fieldTip = fieldTip ? fieldTip + ' ' + fieldSchema.comment : fieldSchema.comment;
        }

        const fieldValue = currContext[field] !== null ? currContext[field] : null;
        let fieldType = BuildField.fieldTypeFromFieldSchema(fieldSchema);
        let enumValues = [];
        let isLinked = false;
        let linked = fieldSchemaLinkToType(fieldSchema);

        // check if this is an enum
        if (fieldType === 'enum'){
            enumValues = fieldSchema.enum || [];
        } else if (fieldType === "suggested_enum") {
            enumValues = fieldSchema.suggested_enum || [];
        }

        // check for linkTo if further down in object or array
        if (linked !== null){
            linked = fieldSchema.title ? fieldSchema.title : linked;
            isLinked = true;
        }

        if (roundTwo) {
            var path            = keyComplete[currKey],
                completeContext = keyContext[path],
                statusCheck     = completeContext.status && (completeContext.status == 'uploading' || completeContext.status == 'upload failed');
        }

        // handle a linkTo object on the the top level
        // check if any schema-specific adjustments need to made:
        if (fieldSchema.s3Upload && fieldSchema.s3Upload === true){
            // only render file upload input if status is 'uploading' or 'upload_failed'
            // when editing a File principal object.
            var path            = keyComplete[currKey],
                completeContext = keyContext[path],
                statusCheck     = completeContext.status && (completeContext.status == 'uploading' || completeContext.status == 'upload failed');

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
        return (
            <BuildField
                {...{ field, fieldType, fieldTip, enumValues, isLinked, currType, currContext }}
                {..._.pick(this.props, 'md5Progress', 'edit', 'create', 'keyDisplay', 'keyComplete', 'setSubmissionState', 'upload', 'uploadStatus', 'updateUpload', 'currentSubmittingUser', 'roundTwo')}
                value={fieldValue} key={field} schema={fieldSchema} nestedField={field} title={fieldTitle} modifyFile={null} linkType={linked} disabled={false}
                arrayIdx={null} required={_.contains(currSchema.required, field)}
                modifyNewContext={this.modifyNewContext} selectObj={this.selectObj} selectComplete={this.selectComplete} selectCancel={this.selectCancel}
                fieldBeingSelected={this.state.selectField} fieldBeingSelectedArrayIdx={this.state.selectArrayIdx} />
        );
    }

    /**
     * Render the fieldPanels which contain the BuildFields for regular field and
     * linked object fields, respectively.
     *
     * On round two, combine all types of BuildFields and also render a
     * RoundTwoDetailPanel, which shows the attributes for the already submitted
     * object.
     */
    render(){
        const { currContext, keyComplete, keyContext, currKey, schemas, roundTwo } = this.props;
        const fields = currContext ? _.keys(currContext) : [];
        const fieldJSXComponents = sortPropFields(_.filter( // Sort fields first by requirement and secondly alphabetically. These are JSX BuildField components.
            _.map(fields, this.initiateField),
            function(f){ return !!f; } // Removes falsy (e.g. null) items.
        ));
        const roundTwoDetailContext = roundTwo && keyComplete[currKey] && keyContext[keyComplete[currKey]];
        return(
            <div>
                <FormFieldsContainer currKey={currKey}>{ fieldJSXComponents }</FormFieldsContainer>
                { roundTwo ? <RoundTwoDetailPanel schemas={schemas} context={roundTwoDetailContext} open={true} /> : null }
            </div>
        );
    }
}


const FormFieldsContainer = React.memo(function FormFieldsContainer(props){
    const { children, title } = props;
    if (React.Children.count(children) === 0) return null;
    return (
        <div className="form-fields-container">
            <h4 className="clearfix page-subtitle form-section-heading submission-field-header">{ title }</h4>
            <div className="form-section-body">{ children }</div>
        </div>
    );
});
FormFieldsContainer.defaultProps = {
    'title' : 'Fields & Dependencies',
    'currKey' : 0
};

/**
 * Simple Component that opens/closes and renders a Detail panel using the context
 * and schemas passed to it.
 */
class RoundTwoDetailPanel extends React.PureComponent {
    constructor(props){
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
        this.state = {
            'open': props.open || false
        };
    }

    handleToggle(e){
        e.preventDefault();
        this.setState(function({ open }){
            return { 'open' : !open };
        });
    }

    render(){
        const { context, schemas } = this.props;
        const { open } = this.state;
        return(
            <div className="current-item-properties round-two-panel">
                <h4 className="clearfix page-subtitle submission-field-header">
                    <button type="button" className="btn btn-xs icon-container pull-left" onClick={this.handleToggle}>
                        <i className={"icon fas " + (open ? "icon-minus" : "icon-plus")}></i>
                    </button>
                    <span>Object Attributes</span>
                </h4>
                <Collapse in={open}>
                    <div className="item-page-detail">
                        <Detail excludedKeys={Detail.defaultProps.excludedKeys.concat('upload_credentials')} context={context} schemas={schemas} open={false} popLink={true}/>
                    </div>
                </Collapse>
            </div>

        );
    }
}