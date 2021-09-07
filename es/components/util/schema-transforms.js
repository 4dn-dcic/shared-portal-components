function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import _ from 'underscore';
import memoize from 'memoize-one';
import { patchedConsoleInstance as console } from './patched-console';
export function getSchemaProperty(field, schemas) {
  var startAt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ExperimentSet';
  var baseSchemaProperties = schemas && schemas[startAt] && schemas[startAt].properties || null;
  var itemTypeHierarchy = schemasToItemTypeHierarchy(schemas);
  if (!baseSchemaProperties) return null;
  var fieldParts = field.split('.');

  function getNextSchemaProperties(linkToName) {
    function combineSchemaPropertiesFor(relatedLinkToNames) {
      return _.reduce(_.keys(relatedLinkToNames), function (schemaProperties, schemaName) {
        if (schemas[schemaName]) {
          return _.extend(schemaProperties, schemas[schemaName].properties);
        } else return schemaProperties;
      }, {});
    }

    if (typeof itemTypeHierarchy[linkToName] !== 'undefined') {
      return combineSchemaPropertiesFor(itemTypeHierarchy[linkToName]);
    } else {
      return schemas[linkToName].properties;
    }
  }

  function getProperty(propertiesObj, fieldPartIndex) {
    var property = propertiesObj[fieldParts[fieldPartIndex]];

    if (!property) {
      // If property(-chain) doesn't exist in schemas, cancel out.
      console.warn("Field \"".concat(field, "\" does not exist in \"").concat(startAt, "\"."));
      return null;
    }

    if (fieldPartIndex >= fieldParts.length - 1) {
      // if (property && property.type === "array" && property.items) {
      //     return property.items;
      // }
      return property;
    }

    var nextSchemaProperties = null;

    if (property.type === 'array' && property.items && property.items.linkTo) {
      nextSchemaProperties = getNextSchemaProperties(property.items.linkTo);
    } else if (property.type === 'array' && property.items && property.items.linkFrom) {
      nextSchemaProperties = getNextSchemaProperties(property.items.linkFrom);
    } else if (property.linkTo) {
      nextSchemaProperties = getNextSchemaProperties(property.linkTo);
    } else if (property.linkFrom) {
      nextSchemaProperties = getNextSchemaProperties(property.linkFrom);
    } else if (property.type === 'object') {
      // Embedded Object
      nextSchemaProperties = property.properties;
    } else if (property.type === 'array') {
      // Embedded Array
      nextSchemaProperties = property.items.properties;
    }

    if (nextSchemaProperties) return getProperty(nextSchemaProperties, fieldPartIndex + 1);
  }

  return getProperty(baseSchemaProperties, 0);
}
/** TODO: consider memoizing multiple via _.memoize() */

export function lookupFieldTitle(field, schemas) {
  var itemType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ExperimentSet';
  var itemTypeHierarchy = schemasToItemTypeHierarchy(schemas);
  var schemaProperty = getSchemaProperty(field, schemas, itemTypeHierarchy, itemType);

  if (schemaProperty && schemaProperty.title) {
    return schemaProperty.title;
  } else {
    return null;
  }
}
/**
 * Helper function which gets the most relevant `@type` for search page context from the
 * current search filters. If none specified or is set to "Item", then null is returned.
 *
 * @param {Item} context - Current Item or backend response JSON representation.
 * @returns {string|null} Type most relevant for current search, or `null`.
 */

export function getSchemaTypeFromSearchContext(context) {
  return getAllSchemaTypesFromSearchContext(context)[0] || null;
}
export function getAllSchemaTypesFromSearchContext(context) {
  var thisTypeFilters = _.filter(context.filters || [], function (_ref) {
    var field = _ref.field,
        term = _ref.term;
    if (field === 'type' && term !== 'Item') return true;
    return false;
  }) || null;

  if (!Array.isArray(thisTypeFilters) || thisTypeFilters.length === 0) {
    return [];
  }

  return thisTypeFilters.map(function (typeFilter) {
    return typeFilter.term;
  });
}
/**
 * Converts a nested object from this form: "key" : { ..., "items" : { ..., "properties" : { "property" : { ...details... } } } }
 * To this form: "key" : { ... }, "key.property" : { ...details... }, ...
 *
 * @param {Object} tips - Schema property object with a potentially nested 'items'->'properties' value(s).
 * @param {number} [depth=0] - Current recursive depth.
 * @returns {Object} Object with period-delimited keys instead of nested value to represent nested schema structure.
 */

export function flattenSchemaPropertyToColumnDefinition(tips) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var schemas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var flattened = _.pairs(tips).filter(function (p) {
    if (p[1] && (p[1].items && p[1].items.properties || p[1].properties)) return true;
    return false;
  }).reduce(function (m, p) {
    _.keys((p[1].items || p[1]).properties).forEach(function (childProperty) {
      if (typeof m[p[0] + '.' + childProperty] === 'undefined') {
        m[p[0] + '.' + childProperty] = (p[1].items || p[1]).properties[childProperty];
        m[p[0]] = _.omit(m[p[0]], 'items', 'properties');
      }

      if (!m[p[0] + '.' + childProperty].title && m[p[0] + '.' + childProperty].linkTo) {
        // If no Title, but yes linkTo, set Title to be Title of linkTo's Schema.
        m[p[0] + '.' + childProperty].title = getTitleForType(m[p[0] + '.' + childProperty].linkTo, schemas);
      } //if ( m[p[0] + '.' + childProperty].items && m[p[0] + '.' + childProperty].items.properties )

    });

    return m;
  }, _.clone(tips)); // Recurse the result.


  if ( // Any more nested levels?
  depth < 4 && _.find(_.pairs(flattened), function (p) {
    if (p[1] && (p[1].items && p[1].items.properties || p[1].properties)) return true;
    return false;
  })) flattened = flattenSchemaPropertyToColumnDefinition(flattened, depth + 1, schemas);
  return flattened;
}
export function getAbstractTypeForType(type, schemas) {
  var returnSelfIfAbstract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var itemTypeHierarchy = schemasToItemTypeHierarchy(schemas);
  var i;
  var foundObj;

  if (returnSelfIfAbstract) {
    foundObj = itemTypeHierarchy[type];

    if (foundObj) {
      return type;
    }
  }

  var possibleParentTypes = _.keys(itemTypeHierarchy);

  for (i = 0; i < possibleParentTypes.length; i++) {
    foundObj = itemTypeHierarchy[possibleParentTypes[i]][type];

    if (foundObj) {
      return possibleParentTypes[i];
    }
  }

  return null;
}
/**
 * Returns the leaf type from the Item's '@type' array.
 *
 * @throws {Error} Throws error if no types array ('@type') or it is empty.
 * @param {Object} context - JSON representation of current Item.
 * @returns {string} Most specific type's name.
 */

export function getItemType(context) {
  if (!Array.isArray(context['@type']) || context['@type'].length < 1) {
    return null; //throw new Error("No @type on Item object (context).");
  }

  return context['@type'][0];
}
/**
 * Returns base Item type from Item's '@type' array. This is the type right before 'Item'.

 * @param {Object} context - JSON representation of current Item.
 * @param {string[]} context['@type] - List of types for the Item.
 * @returns {string} Base Ttem type.
 */

export function getBaseItemType(context) {
  var types = context['@type'];
  if (!Array.isArray(types) || types.length === 0) return null;
  var i = 0;

  while (i < types.length) {
    if (types[i + 1] === 'Item') {
      return types[i]; // Last type before 'Item'.
    }

    i++;
  }

  return types[i - 1]; // Fallback.
}
/**
 * Lookup the title for an Item type, given the entire schemas object.
 *
 * @param {string} atType - Item type.
 * @param {Object} [schemas=null] - Entire schemas object, e.g. as stored in App state.
 * @returns {string} Human-readable title.
 */

export function getTitleForType(atType, schemas) {
  if (!atType) return null;

  if (schemas && schemas[atType] && schemas[atType].title) {
    return schemas[atType].title;
  } // Correct baseType to title if not in schemas.
  // This is case for Abstract Types currently.
  // TODO EXPORT OUT


  switch (atType) {
    case 'ExperimentSet':
      return 'Experiment Set';

    case 'UserContent':
      return "User Content";

    default:
      return atType;
  }
}
/**
 * Returns schema for the specific type of Item we're on.
 *
 * @param {string} itemType - The type for which to get schema.
 * @param {Object} [schemas] - Mapping of schemas, by type.
 * @returns {Object} Schema for itemType.
 */

export function getSchemaForItemType(itemType, schemas) {
  if (typeof itemType !== 'string') return null;
  if (!schemas) return null;
  return schemas[itemType] || null;
}
/**
 * Get title for leaf Item type from Item's context + schemas.
 *
 * @export
 * @param {Object} context - JSON representation of Item.
 * @param {Object} [schemas=null] - Schemas object passed down from App.
 * @returns {string} Human-readable Item detailed type title.
 */

export function getItemTypeTitle(context, schemas) {
  return getTitleForType(getItemType(context), schemas);
}
/**
 * Get title for base Item type from Item's context + schemas.
 *
 * @export
 * @param {Object} context - JSON representation of Item.
 * @param {Object} [schemas=null] - Schemas object passed down from App.
 * @returns {string} Human-readable Item base type title.
 */

export function getBaseItemTypeTitle(context, schemas) {
  return getTitleForType(getBaseItemType(context), schemas);
}
/** Converts e.g. "/profiles/File.json" to "File" */

function stripTypeFromProfilesHref(profilesHref) {
  return profilesHref.slice(10, -5);
}
/**
 * Convert object of schemas (result of /profiles/ endpoint) to hierarchy object.
 * Assumes all schemas have a single "rdfs:subClassOf" property value (or null/undefined).
 *
 * Only keeps *root* types which contain children.
 */


export var schemasToItemTypeHierarchy = memoize(function (schemas) {
  var allTypesArray = _.keys(schemas);

  var resHierarchy = {}; // We don't get "Item" delivered from backend else would look for where
  // lack of "rdfs:subClassOf" property value to find Item and make that root.
  // Instead we look for where "Item" is parent to gather root schemas.

  var _$partition = _.partition(allTypesArray, function (typeName) {
    var typeSchema = schemas[typeName];

    if (typeSchema["rdfs:subClassOf"] === "/profiles/Item.json") {
      return true;
    }

    return false;
  }),
      _$partition2 = _slicedToArray(_$partition, 2),
      rootTypeNames = _$partition2[0],
      remainingTypeNames = _$partition2[1];

  function addChildrenRecursively(parentHier, parentTypeSchema) {
    _.forEach(parentTypeSchema.children || [], function (childTypeURI) {
      var childTypeName = stripTypeFromProfilesHref(childTypeURI);
      parentHier[childTypeName] = {};
      var childTypeSchema = schemas[childTypeName];

      if (Array.isArray(childTypeSchema.children) && childTypeSchema.children.length > 0) {
        addChildrenRecursively(parentHier[childTypeName], childTypeSchema);
      }
    });
  }

  _.forEach(rootTypeNames, function (rootTypeName) {
    resHierarchy[rootTypeName] = {}; // We have 'children' property in schemas, so we just use these
    // for a performance improvement. See below incomplete fxn for alternative
    // implementation relying purely on rds:subClassOf.

    var rootTypeSchema = schemas[rootTypeName];
    var rootTypeHasChildren = Array.isArray(rootTypeSchema.children) && rootTypeSchema.children.length > 0;

    if (rootTypeHasChildren) {
      addChildrenRecursively(resHierarchy[rootTypeName], rootTypeSchema);
    } else {
      // Cull top-level types to only contain types with children.
      delete resHierarchy[rootTypeName];
    }
  });
  /*
  function findParentHierarchyObj(hier, typeName){ // Basic DFS
      const hierKeys = _.keys(hier);
      const hierKeyLen = hierKeys.length;
      var i, currType, found;
      for (i = 0; i < hierKeyLen; i++){
          currType = hierKeys[i];
          if (currType === typeName){
              return hier[currType];
          }
          found = findParentHierarchyObj(hier[currType], typeName);
          if (found){
              return found;
          }
      }
      return false; // Could also throw Err
  }
  */

  /* rds:subClassOf implementation (incomplete)
     TODO: handle parentHier not being found because parent not yet added (ordering)
     Could do by making remainingTypeNames into priority queue of some sort or w. multiple iterations of this for-loop.
  _.forEach(remainingTypeNames, function(typeName){
      const typeSchema = schemas[typeName];
      const parentTypeName = stripTypeFromProfilesHref(typeSchema["rdfs:subClassOf"]);
      const parentHier = findParentHierarchyObj(resHierarchy, parentTypeName);
      parentHier[typeName] = {};
  });
  */


  return resHierarchy;
});