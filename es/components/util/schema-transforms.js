"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSchemaProperty = getSchemaProperty;
exports.lookupFieldTitle = lookupFieldTitle;
exports.getSchemaTypeFromSearchContext = getSchemaTypeFromSearchContext;
exports.flattenSchemaPropertyToColumnDefinition = flattenSchemaPropertyToColumnDefinition;
exports.getAbstractTypeForType = getAbstractTypeForType;
exports.getItemType = getItemType;
exports.getBaseItemType = getBaseItemType;
exports.getTitleForType = getTitleForType;
exports.getSchemaForItemType = getSchemaForItemType;
exports.getItemTypeTitle = getItemTypeTitle;
exports.getBaseItemTypeTitle = getBaseItemTypeTitle;
exports.schemasToItemTypeHierarchy = void 0;

var _underscore = _interopRequireDefault(require("underscore"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function getSchemaProperty(field, schemas) {
  var startAt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ExperimentSet';
  var baseSchemaProperties = schemas && schemas[startAt] && schemas[startAt].properties || null;
  var itemTypeHierarchy = schemasToItemTypeHierarchy(schemas);
  if (!baseSchemaProperties) return null;
  var fieldParts = field.split('.');

  function getNextSchemaProperties(linkToName) {
    function combineSchemaPropertiesFor(relatedLinkToNames) {
      return _underscore["default"].reduce(_underscore["default"].keys(relatedLinkToNames), function (schemaProperties, schemaName) {
        if (schemas[schemaName]) {
          return _underscore["default"].extend(schemaProperties, schemas[schemaName].properties);
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
    if (fieldPartIndex >= fieldParts.length - 1) return property;
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
      nextSchemaProperties = property.properties;
    }

    if (nextSchemaProperties) return getProperty(nextSchemaProperties, fieldPartIndex + 1);
  }

  return getProperty(baseSchemaProperties, 0);
}

function lookupFieldTitle(field, schemas) {
  var itemType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ExperimentSet';
  var itemTypeHierarchy = schemasToItemTypeHierarchy(schemas);
  var schemaProperty = getSchemaProperty(field, schemas, itemTypeHierarchy, itemType);

  if (schemaProperty && schemaProperty.title) {
    return schemaProperty.title;
  } else {
    return null;
  }
}

function getSchemaTypeFromSearchContext(context, schemas) {
  var thisTypeFilter = _underscore["default"].find(context.filters || [], function (_ref) {
    var field = _ref.field,
        term = _ref.term;
    if (field === 'type' && term !== 'Item') return true;
    return false;
  }) || null;
  var thisType = (thisTypeFilter || {}).term;

  if (thisType) {
    return getTitleForType(thisType, schemas);
  }

  return null;
}

function flattenSchemaPropertyToColumnDefinition(tips) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var schemas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var flattened = _underscore["default"].pairs(tips).filter(function (p) {
    if (p[1] && (p[1].items && p[1].items.properties || p[1].properties)) return true;
    return false;
  }).reduce(function (m, p) {
    _underscore["default"].keys((p[1].items || p[1]).properties).forEach(function (childProperty) {
      if (typeof m[p[0] + '.' + childProperty] === 'undefined') {
        m[p[0] + '.' + childProperty] = (p[1].items || p[1]).properties[childProperty];
        m[p[0]] = _underscore["default"].omit(m[p[0]], 'items', 'properties');
      }

      if (!m[p[0] + '.' + childProperty].title && m[p[0] + '.' + childProperty].linkTo) {
        m[p[0] + '.' + childProperty].title = getTitleForType(m[p[0] + '.' + childProperty].linkTo, schemas);
      }
    });

    return m;
  }, _underscore["default"].clone(tips));

  if (depth < 4 && _underscore["default"].find(_underscore["default"].pairs(flattened), function (p) {
    if (p[1] && (p[1].items && p[1].items.properties || p[1].properties)) return true;
    return false;
  })) flattened = flattenSchemaPropertyToColumnDefinition(flattened, depth + 1, schemas);
  return flattened;
}

function getAbstractTypeForType(type, schemas) {
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

  var possibleParentTypes = _underscore["default"].keys(itemTypeHierarchy);

  for (i = 0; i < possibleParentTypes.length; i++) {
    foundObj = itemTypeHierarchy[possibleParentTypes[i]][type];

    if (foundObj) {
      return possibleParentTypes[i];
    }
  }

  return null;
}

function getItemType(context) {
  if (!Array.isArray(context['@type']) || context['@type'].length < 1) {
    return null;
  }

  return context['@type'][0];
}

function getBaseItemType(context) {
  var types = context['@type'];
  if (!Array.isArray(types) || types.length === 0) return null;
  var i = 0;

  while (i < types.length) {
    if (types[i + 1] === 'Item') {
      return types[i];
    }

    i++;
  }

  return types[i - 1];
}

function getTitleForType(atType, schemas) {
  if (!atType) return null;

  if (schemas && schemas[atType] && schemas[atType].title) {
    return schemas[atType].title;
  }

  switch (atType) {
    case 'ExperimentSet':
      return 'Experiment Set';

    case 'UserContent':
      return "User Content";

    default:
      return atType;
  }
}

function getSchemaForItemType(itemType, schemas) {
  if (typeof itemType !== 'string') return null;
  if (!schemas) return null;
  return schemas[itemType] || null;
}

function getItemTypeTitle(context, schemas) {
  return getTitleForType(getItemType(context), schemas);
}

function getBaseItemTypeTitle(context, schemas) {
  return getTitleForType(getBaseItemType(context), schemas);
}

function stripTypeFromProfilesHref(profilesHref) {
  return profilesHref.slice(10, -5);
}

var schemasToItemTypeHierarchy = (0, _memoizeOne["default"])(function (schemas) {
  var allTypesArray = _underscore["default"].keys(schemas);

  var resHierarchy = {};

  var _$partition = _underscore["default"].partition(allTypesArray, function (typeName) {
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
    _underscore["default"].forEach(parentTypeSchema.children || [], function (childTypeURI) {
      var childTypeName = stripTypeFromProfilesHref(childTypeURI);
      parentHier[childTypeName] = {};
      var childTypeSchema = schemas[childTypeName];

      if (Array.isArray(childTypeSchema.children) && childTypeSchema.children.length > 0) {
        addChildrenRecursively(parentHier[childTypeName], childTypeSchema);
      }
    });
  }

  _underscore["default"].forEach(rootTypeNames, function (rootTypeName) {
    resHierarchy[rootTypeName] = {};
    var rootTypeSchema = schemas[rootTypeName];
    var rootTypeHasChildren = Array.isArray(rootTypeSchema.children) && rootTypeSchema.children.length > 0;

    if (rootTypeHasChildren) {
      addChildrenRecursively(resHierarchy[rootTypeName], rootTypeSchema);
    } else {
      delete resHierarchy[rootTypeName];
    }
  });

  return resHierarchy;
});
exports.schemasToItemTypeHierarchy = schemasToItemTypeHierarchy;