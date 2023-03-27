import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _typeof from "@babel/runtime/helpers/typeof";
/*
This file contains utilities specific to the SubmissionView component. Many of these are helpers for
managing the top level state of that component/its children. They are organized within their categories
(context, hierarchy, miscellanous) alphabetically.
*/

import _ from 'underscore';
import { console, JWT, object } from './';
import * as logger from '../util/logger';
import { isValueNull } from '../forms/components/submission-fields';
import { fieldSchemaLinkToType, fieldSchemaLinkToPath } from '../forms/components/SubmissionTree';

/* CONTEXT HELPERS (for managing SubmissionView.state.keyContext) */

/**
 * Build context based off an object's and populate values from pre-existing context.
 *
 * @param {Object} context      (idx/@id : currKey) stores the context for each object; from state.keyContext
 * @param {Object} itemSchema   Schema for the type of object to build as returned from back-end
 * @param {array} objList       Array containing field names. Nested fields demarcated with "." as in
 *                              "static_content.content"
 * @param {boolean} edit        Should edit objects when adding them to context?
 * @param {boolean} create      Should clone objects when adding them to context?
 * @param {*} initObjs          An array containing pre-existing context objects to add
 *
 * Empty fields are given null value.
 * All linkTo fields are added to objList.
 * If initObjs provided (edit or clone functionality), pre-existing objs will be added.
 * Also checks user info to see if user is admin, which affects which fields are displayed.
 *
 * @returns {Object} A new object representing context.
 */
export function buildContext(context, itemSchema) {
  var objList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var edit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var create = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var initObjs = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  // console.log("calling buildContext with", ...arguments);
  var built = {};
  var userGroups = JWT.getUserGroups();
  var fields = itemSchema.properties ? _.keys(itemSchema.properties) : [];
  _.forEach(fields, function (field) {
    // console.log('building field:', field);
    var fieldSchema = object.getNestedProperty(itemSchema, ['properties', field], true);
    if (!fieldSchema) {
      return;
    }
    if (fieldSchema.exclude_from && (Array.isArray(fieldSchema.exclude_from) && _.contains(fieldSchema.exclude_from, 'FFedit-create') || fieldSchema.exclude_from === 'FFedit-create')) {
      return;
    }

    // check to see if this field is a calculated prop
    if (fieldSchema.calculatedProperty && fieldSchema.calculatedProperty === true) {
      return;
    }

    // check to see if permission == import items; if admin, allow import_items fields
    if (fieldSchema.permission && fieldSchema.permission == "import_items") {
      if (!_.contains(userGroups, 'admin')) {
        return;
      }
    }

    // set value to context value if editing/cloning.
    // if creating or value not present, set to null
    var value = context[field];
    if (edit) {
      if (value === null || fieldSchema.ff_flag && fieldSchema.ff_flag === "clear edit") {
        built[field] = null;
      } else {
        built[field] = typeof value === "number" ? value || 0 : value || null;
      }
    } else if (!create) {
      //clone
      if (value === null || fieldSchema.ff_flag && fieldSchema.ff_flag === "clear clone") {
        built[field] = null;
      } else {
        built[field] = typeof value === "number" ? value || 0 : value || null;
      }
    } else {
      built[field] = null;
    }
    if (objList !== null) {
      var linkedProperty = fieldSchemaLinkToPath(fieldSchema); // Is it a linkTo (recursively or not)?
      var roundTwoExclude = fieldSchema.ff_flag && fieldSchema.ff_flag == 'second round';
      if (linkedProperty !== null && typeof linkedProperty !== 'undefined' && !roundTwoExclude) {
        // If linkTo, add to our list, selecting a nice name for it first.

        //var listTerm = fieldSchema.title ? fieldSchema.title : linked;
        var fieldToStore = field;
        linkedProperty = _.reject(linkedProperty, function (p) {
          return p === 'items' || p === 'properties';
        });
        if (linkedProperty.length > 0) {
          fieldToStore += '.' + linkedProperty.join('.');
        }
        if (!_.contains(objList, fieldToStore)) {
          objList.push(fieldToStore);
        }

        // add pre-existing linkTo objects
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
 * Traverses context to find the field name of the object at a specific keyIndex in context.
 *
 * @param {Object} contextToSearch   Top level keyContext to search through
 * @param {string} rootType          The schema-formatted type of Item at the root of this context; generally
 *                                   principal object's type (E.g. "Experiment" or "Cohort")
 * @param {string} schemas           An object containing all schemas
 * @param {number} keyIndexToFind    The key index of the item to find
 * @param {array}  keyLinkToFind     An array representing the path to the item being searched for
 *
 * This might work if you pass in a subContext and make sure the rootType refers to the correct subContext's
 * type, but not tested so can't be sure.
 *
 * @returns {Object} { splitField: string[], arrayIdx: number[] }
 *          splitField represents the field name,
 *          arrayIdx contains the indices of any arrays searched in order to find the object during traversal.
 */
export function findFieldFromContext(contextToSearch, rootType, schemas) {
  var keyIndexToFind = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var keyLinkToFind = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  // console.log("calling findFieldFromContext with: ", ...arguments);
  // Issue: no way to figure out if new-linkto being created or not.

  var splitField = null;
  var arrayIdx = [];

  /*
  const keyHierarchy = {
      0 : {}
  };
  */

  // function isLinkTo(valString){
  //     if (typeof valString !== "string") return false;
  //     const matched = valString.match(/\/(.*?)\/(.*?)\//);
  //     if (!matched) return false;
  //     const [ , itemType, itemIdentifier ] = matched;
  //     if (itemType && itemIdentifier) {
  //         return itemType;
  //     }
  //     return false;
  // }

  /**
   * Recursive function used to scrape through the context.
   *
   * @param {Object} context          (idx/@id : currKey) stores the context for each object; from state.keyContext (or nested cxt obj)
   * @param {number} contextKey       The key in keyContext (or current nested context object) being searched
   * @param {Object} contextSchema    The schema for the type of object that is being searched
   * @param {array}  currFieldParts   An array containing the previous contextKeys searched to get to this context
   * @param {array}  arrIdx           Contains the indices of any arrays that were searched previously to get to this context,
   *                                  in order from most to least recent
   *
   * When it finds an array or an object, it recursively searches for the field present until it finds it OR searches everything.
   * Once the item being searched for (keyIndexToFind above) is found, updates findFieldFromContext's splitField and arrayIdx.
   */
  function scrapeFromContext(context, contextKey, contextSchema) {
    var currFieldParts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var arrIdx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    // console.log("calling scrapeFromcontext with", context, contextKey, contextSchema, currFieldParts, arrIdx);
    splitField ? console.log("splitField is ", splitField) : null;
    if (splitField) return; // recurses until it finds the field being sought

    // Searches through the context passed in...
    _.keys(context).forEach(function (propKey) {
      // Store the schema and value of the current nested context object being scraped
      var propVal = context[propKey];
      var propSchema = contextSchema[propKey];
      if (Array.isArray(propVal)) {
        // If current item is an array of other items
        propSchema = propSchema.items; // Make sure schema is synced as appropriate

        // Traverse through each item in the array to see if field is present
        propVal.forEach(function (propValItem, idxInArray) {
          // If the items in this array are other linked objects, recurse and search them, too.
          if (propValItem !== null && _typeof(propValItem) === "object") {
            // console.log(`Found a new object. Scraping... ${contextKey}.${propKey}`);
            // NOTE: This breaks down when encountering nested arrays (more than 1 array deep).
            // But this occurs already other places so w.e. TODO: Fix this, if necessary
            scrapeFromContext(propValItem, propKey, propSchema.properties, [].concat(_toConsumableArray(currFieldParts), [propKey]), [].concat(_toConsumableArray(arrIdx), [idxInArray]));
            return;
          }

          // If the field is matching the item that is currently being sought, update splitField and arrayIdx
          if (keyIndexToFind === propValItem) {
            var isCorrectLinkTo = keyLinkToFind.indexOf(propSchema.linkTo) > -1;
            if (isCorrectLinkTo) {
              splitField = [].concat(_toConsumableArray(currFieldParts), [propKey]);
              arrayIdx = [].concat(_toConsumableArray(arrIdx), [idxInArray]);
              //keyHierarchy[contextKey] = keyHierarchy[contextKey] || {};
              //keyHierarchy[contextKey][propValItem] = itemType;
              //keyTypes[contextKey] = keyTypes[contextKey] || {};
              //keyTypes[]
            }
          }
        });
      } else if (propVal !== null && _typeof(propVal) === "object") {
        // Sub-embedded object. Recurse and search keys
        scrapeFromContext(propVal, propKey, propSchema.properties, [].concat(_toConsumableArray(currFieldParts), [propKey]), arrIdx);
      } else {
        // Assmuming this is a field; check to see if it matches
        if (keyIndexToFind === propVal) {
          var isCorrectLinkTo = keyLinkToFind.indexOf(propSchema.linkTo) > -1;
          if (isCorrectLinkTo) {
            splitField = [].concat(_toConsumableArray(currFieldParts), [propKey]);
            arrayIdx = arrIdx;
            // keyHierarchy[contextKey] = keyHierarchy[contextKey] || {};
            // keyHierarchy[contextKey][propVal] = itemType;
          }
        }
      }
    });
  }

  // _.keys(contextToSearch).forEach(function(propKey){
  // Bleh need to traverse every sub object and array here
  scrapeFromContext(contextToSearch, null, schemas[rootType].properties, []);
  // });

  // console.log("returning splitfield: ", splitField);
  // console.log("returning arrayIdx: ", arrayIdx);
  return {
    splitField: splitField,
    arrayIdx: arrayIdx
  };
}

/**
 * Generates an atID/keyIndex (in the case of unsubmitted, WIP objects) mapping based on passed-in context.
 *
 * @param {Object} context       A copy of SubmissionView.state.keyContext; safe to use directly on state, though
 * @param {Object} idsToTitles   Collection of all previously mapped so far
 *
 * Recursively searches through the context.
 *
 * @returns {Object} An object mapping atID/keyIndex to display_title; like SubmissionView.state.keyDisplay
 */
export function gatherLinkToTitlesFromContextEmbedded(context) {
  var idsToTitles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (context['@id'] && context.display_title) {
    if (typeof idsToTitles[context['@id']] !== 'undefined') {
      // Seen already
      return;
    }
    idsToTitles[context['@id']] = context.display_title;
  }
  _.values(context).forEach(function (value) {
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
 * Takes in a deep COPY of keyContext and returns an edited version of that copy with the item in splitField
 * at the arrayIdx changed to value.
 *
 * @param {string[]]} splitField    An array containing the results of .split('.') on a field (E.g.
 *                                  experiment_sets.experiment => ["experiment_sets","experiment"])
 * @param {Object} currContext      A DEEP COPY of keyContext
 * @param {array} arrayIdx          An array containing the indices of the item to be modified and any other arrays
 *                                  that were navigated through to get to the final object in order of traversal
 *                                  (last is always object index)
 * @param {string} fieldType        An array containing the type of object to be modified (E.g., "linked object",
 *                                  "existing object", etc.)
 * @param {string} value            A string containing the @id path of the item to be updated to
 *
 * Per the name, this function modifies IN PLACE and will cause super duper side effects if used on state.
 * Always pass in an object.deepClone'd COPY of the context you'd like to modify.
 *
 * This function is currently used in submitObj in cases where non-principal objects are submitted, to generate
 * a new context where the temporary ID (keyIndex) is swapped out with the new object's atID.
 *
 * This will also eventually be used in modifyNewContext, but isn't currently due to a bug that breaks
 * creation of new items of certain types (CaptureC, StaticSection)... more info in the comments of that f(x).
 */
export function modifyContextInPlace(splitField, currContext, arrayIdx, fieldType, value) {
  // console.log(`calling modifyContextInPlace with`, splitField, currContext, arrayIdx, fieldType, value);
  var splitFieldLeaf = splitField[splitField.length - 1];
  var arrayIdxPointer = 0;
  var pointer = currContext;
  var prevValue = null;
  for (var i = 0; i < splitField.length - 1; i++) {
    // console.log(splitField[i]);
    // console.log("pointer at start of loop", pointer);
    if (pointer[splitField[i]]) {
      pointer = pointer[splitField[i]];
    } else {
      // console.log(pointer[splitField[i]]);
      // console.log(pointer);
      logger.error('PROBLEM CREATING NEW CONTEXT WITH: ', fieldType, value);
      return;
    }
    // console.log("pointer after updating with", splitField[i], " :", pointer);
    if (Array.isArray(pointer)) {
      // console.log("pointer is array");
      // console.log("before switch", pointer);
      pointer = pointer[arrayIdx[arrayIdxPointer]];
      // console.log("arrayIdx[arrayIdxPointer]", arrayIdx[arrayIdxPointer]);
      // console.log(pointer);
      arrayIdxPointer += 1;
    }
  }
  // console.log("after for loop", pointer);
  if (Array.isArray(pointer[splitFieldLeaf]) && fieldType !== 'array') {
    // console.log("value we're trying to set is inside of an array");
    // move pointer into array
    pointer = pointer[splitFieldLeaf];
    prevValue = pointer[arrayIdx[arrayIdxPointer]];
    if (value === null) {
      // delete this array itemfieldType
      pointer.splice(arrayIdx[arrayIdxPointer], 1);
    } else {
      pointer[arrayIdx[arrayIdxPointer]] = value;
    }
  } else {
    // value we're trying to set is not inside an array at this point
    // console.log("value we're trying to set is NOT inside of an array");
    prevValue = pointer[splitFieldLeaf];
    pointer[splitFieldLeaf] = value;
  }
  return {
    currContext: currContext,
    prevValue: prevValue
  };
}

/* HIERARCHY HELPERS (for managing SubmissionView.state.keyHierarchy) */

/**
 * Finds the key of direct parent for a given key in a hierarchy
 * @param {object} hierarchy    Object structured as SubmissionView.state.keyHierarchy
 * @param {number} keyIdx       The keyIndex of the child item you're searching for the parent of
 * @returns {number} key index of parent or null, if none found
 */
export var findParentFromHierarchy = function myself(hierarchy, keyIdx) {
  if (isNaN(keyIdx) || !hierarchy) return null;
  var found_parent = null;
  _.keys(hierarchy).forEach(function (key, index) {
    if (keyIdx in hierarchy[key]) {
      found_parent = key;
    } else {
      var test = myself(hierarchy[key], keyIdx);
      if (test !== null) found_parent = test;
    }
  });
  return found_parent;
};

/**
 * Return a list of all keys contained within a given hierarchy
 * @param {Object} hierarchy    Object structured as SubmissionView.state.keyHierarchy
 * @returns {array}
 */
export var flattenHierarchy = function myself(hierarchy) {
  var found_keys = [];
  _.keys(hierarchy).forEach(function (key, index) {
    if (!isNaN(key)) key = parseInt(key);
    var sub_keys = myself(hierarchy[key]);
    found_keys = _.union(found_keys, sub_keys, [key]);
  });
  return found_keys;
};

/**
 * Given the parent object key and a new object key, return a version
 * of this.state.keyHierarchy that includes the new parent-child relation.
 * Recursive function
 */
export var modifyHierarchy = function myself(hierarchy, keyIdx, parentKeyIdx) {
  _.keys(hierarchy).forEach(function (key, index) {
    if (key == parentKeyIdx) {
      hierarchy[parentKeyIdx][keyIdx] = {};
    } else {
      hierarchy[key] = myself(hierarchy[key], keyIdx, parentKeyIdx);
    }
  });
  return hierarchy;
};

/**
 * Replace a key with a different key in the hierarchy
 */
export var replaceInHierarchy = function myself(hierarchy, existingValueToFind, newValue) {
  if (typeof existingValueToFind === 'number') existingValueToFind = existingValueToFind + '';
  _.keys(hierarchy).forEach(function (key, index) {
    if (key === existingValueToFind) {
      var downstream = hierarchy[key];
      hierarchy[newValue] = downstream;
      delete hierarchy[key];
    } else {
      hierarchy[key] = myself(hierarchy[key], existingValueToFind, newValue);
    }
  });
  return hierarchy;
};

/**
 * Returns the entire hierarchy below for the given keyIdx. keyIdx must be a
 * number (custom object). Recursive function.
 * @param {*} hierarchy     keyHierarchy state to search (or a copy/similarly structured obj)
 * @param {*} keyIdx        Key to find (either @id or keyIndex)
 * @return a hierarchy object containing everything below the found index
 */
export var searchHierarchy = function myself(hierarchy, keyIdx) {
  if (!hierarchy) return null;
  var found_hierarchy = null;
  _.keys(hierarchy).forEach(function (key) {
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

/** Remove given key from provided hierarchy. Works IN PLACE. Recursive function.
 * @param {*} hierarchy A deep COPY of the keyHierarchy state to remove key from.
 * @param {*} keyIdx    Key used to store
 * @return hierarchy, with the passed in key removed
 */
export var trimHierarchy = function myself(hierarchy, keyIdx) {
  if (hierarchy[keyIdx]) {
    delete hierarchy[keyIdx];
  } else {
    _.keys(hierarchy).forEach(function (key) {
      hierarchy[key] = myself(hierarchy[key], keyIdx);
    });
  }
  return hierarchy;
};

/*
    MISCELLANEOUS HELPERS - these are helper functions either used in the above functions or elsewhere in SubmissionView
*/

/**
 * Takes an initObjs array that it will fill with data for each existing
 * object in an edit/clone situation. json is json content for the field,
 * schema is the individual fields schema. Recursively handles objects and arrays.
 *
 * @param {*} initObjs      TODO
 * @param {Object} json     TODO
 * @param {*} fieldSchema   TODO
 * @param {*} listTerm      TODO
 *
 */
export function delvePreExistingObjects(initObjs, json, fieldSchema, listTerm) {
  if (Array.isArray(json)) {
    for (var j = 0; j < json.length; j++) {
      if (fieldSchema.items) {
        delvePreExistingObjects(initObjs, json[j], fieldSchema.items, listTerm);
      }
    }
  } else if (json instanceof Object && json) {
    if (fieldSchema.properties) {
      _.keys(json).forEach(function (key, idx) {
        if (fieldSchema.properties[key]) {
          delvePreExistingObjects(initObjs, json[key], fieldSchema.properties[key], listTerm);
        }
      });
    }
  } else if (_.contains(_.keys(fieldSchema), 'linkTo')) {
    // non-array, non-object field. check schema to ensure there's a linkTo
    initObjs.push({
      'path': json,
      'display': json,
      'field': listTerm,
      'type': fieldSchemaLinkToType(fieldSchema)
    });
  }
}

/**
 * Remove any field with a null value from given json context.
 * also remove empty arrays and objects
 *
 * @param {Object} context - Object representing an Item, with properties & values.
 * @returns {Object} The same context which was passed in, minus null-y values.
 */
export function removeNulls(context) {
  _.keys(context).forEach(function (key, index) {
    if (isValueNull(context[key])) {
      delete context[key];
    } else if (Array.isArray(context[key])) {
      context[key] = _.filter(context[key], function (v) {
        return !isValueNull(v);
      });
      // Recurse for any objects
      context[key] = _.map(context[key], function (v) {
        return v && _typeof(v) === 'object' ? removeNulls(v) : v;
      });
    } else if (context[key] instanceof Object) {
      context[key] = removeNulls(context[key]);
    }
  });
  return context;
}

/**
 * Sort a list of BuildFields first by required status, then by schema lookup order, then by title
 */
export function sortPropFields(fields) {
  // console.log('calling sortPropFields with: ', fields);
  var reqFields = [];
  var optFields = [];

  /** Compare by schema property 'lookup' meta-property, if available. */
  function sortSchemaLookupFunc(a, b) {
    var aLookup = a.props.schema && a.props.schema.lookup || 750,
      bLookup = b.props.schema && b.props.schema.lookup || 750;
    var res;
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
  _.forEach(fields, function (field) {
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