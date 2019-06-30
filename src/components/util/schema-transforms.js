import _ from 'underscore';


export function getSchemaProperty(field, schemas, itemTypeHierarchy = {}, startAt = 'ExperimentSet'){
    var baseSchemaProperties = (schemas && schemas[startAt] && schemas[startAt].properties) || null;
    if (!baseSchemaProperties) return null;
    var fieldParts = field.split('.');

    function getNextSchemaProperties(linkToName){

        function combineSchemaPropertiesFor(relatedLinkToNames){
            return _.reduce(relatedLinkToNames, function(schemaProperties, schemaName){
                if (schemas[schemaName]){
                    return _.extend(schemaProperties, schemas[schemaName].properties);
                }
                else return schemaProperties;
            }, {});
        }

        if (typeof itemTypeHierarchy[linkToName] !== 'undefined') {
            return combineSchemaPropertiesFor(itemTypeHierarchy[linkToName]);
        } else {
            return schemas[linkToName].properties;
        }
    }


    function getProperty(propertiesObj, fieldPartIndex){
        var property = propertiesObj[fieldParts[fieldPartIndex]];
        if (fieldPartIndex >= fieldParts.length - 1) return property;
        var nextSchemaProperties = null;
        if (property.type === 'array' && property.items && property.items.linkTo){
            nextSchemaProperties = getNextSchemaProperties(property.items.linkTo);
        } else if (property.type === 'array' && property.items && property.items.linkFrom){
            nextSchemaProperties = getNextSchemaProperties(property.items.linkFrom);
        } else if (property.linkTo) {
            nextSchemaProperties = getNextSchemaProperties(property.linkTo);
        } else if (property.linkFrom) {
            nextSchemaProperties = getNextSchemaProperties(property.linkFrom);
        } else if (property.type === 'object'){ // Embedded
            nextSchemaProperties = property.properties;
        }

        if (nextSchemaProperties) return getProperty(nextSchemaProperties, fieldPartIndex + 1);
    }

    return getProperty(baseSchemaProperties, 0);
}

/** TODO: consider memoizing multiple via _.memoize() */
export function lookupFieldTitle(field, schemas, itemType = 'ExperimentSet', itemTypeHierarchy={}){
    const schemaProperty = getSchemaProperty(field, schemas, itemTypeHierarchy, itemType);
    if (schemaProperty && schemaProperty.title){
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
export function getSchemaTypeFromSearchContext(context, schemas){
    var thisType = _.pluck(_.filter(context.filters || [], function(o){
        if (o.field === 'type' && o.term !== 'Item') return true;
        return false;
    }), 'term')[0] || null;
    if (thisType){
        return getTitleForType(thisType, schemas);
    }
    return null;
}

/**
 * Converts a nested object from this form: "key" : { ..., "items" : { ..., "properties" : { "property" : { ...details... } } } }
 * To this form: "key" : { ... }, "key.property" : { ...details... }, ...
 *
 * @param {Object} tips - Schema property object with a potentially nested 'items'->'properties' value(s).
 * @param {number} [depth=0] - Current recursive depth.
 * @returns {Object} Object with period-delimited keys instead of nested value to represent nested schema structure.
 */
export function flattenSchemaPropertyToColumnDefinition(tips, depth = 0, schemas=null){
    var flattened = (
        _.pairs(tips).filter(function(p){
            if (p[1] && ((p[1].items && p[1].items.properties) || (p[1].properties))) return true;
            return false;
        }).reduce(function(m, p){
            _.keys((p[1].items || p[1]).properties).forEach(function(childProperty){
                if (typeof m[p[0] + '.' + childProperty] === 'undefined') {
                    m[p[0] + '.' + childProperty] = (p[1].items || p[1]).properties[childProperty];
                    m[p[0]] = _.omit(m[p[0]], 'items', 'properties');
                }
                if (!m[p[0] + '.' + childProperty].title && m[p[0] + '.' + childProperty].linkTo){ // If no Title, but yes linkTo, set Title to be Title of linkTo's Schema.
                    m[p[0] + '.' + childProperty].title = getTitleForType(m[p[0] + '.' + childProperty].linkTo, schemas);
                }
                //if ( m[p[0] + '.' + childProperty].items && m[p[0] + '.' + childProperty].items.properties )
            });
            return m;
        }, _.clone(tips))
    );

    // Recurse the result.
    if ( // Any more nested levels?
        depth < 4 &&
        _.find(_.pairs(flattened), function(p){
            if (p[1] && ((p[1].items && p[1].items.properties) || (p[1].properties))) return true;
            return false;
        })
    ) flattened = flattenSchemaPropertyToColumnDefinition(flattened, depth + 1, schemas);

    return flattened;
}


export function getAbstractTypeForType(type, itemTypeHierarchy = {}, returnSelfIfAbstract = true){
    var possibleParentTypes = _.keys(itemTypeHierarchy);
    var i;
    var foundIndex;
    if (returnSelfIfAbstract){
        foundIndex = possibleParentTypes.indexOf(type);
        if ( foundIndex > -1 ){
            return possibleParentTypes[foundIndex];
        }
    }
    for (i = 0; i < possibleParentTypes.length; i++){
        foundIndex = itemTypeHierarchy[possibleParentTypes[i]].indexOf(type);
        if ( foundIndex > -1 ){
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
export function getItemType(context){
    if (!Array.isArray(context['@type']) || context['@type'].length < 1){
        return null;
        //throw new Error("No @type on Item object (context).");
    }
    return context['@type'][0];
}

/**
 * Returns base Item type from Item's '@type' array. This is the type right before 'Item'.

 * @param {Object} context - JSON representation of current Item.
 * @param {string[]} context['@type] - List of types for the Item.
 * @returns {string} Base Ttem type.
 */
export function getBaseItemType(context){
    var types = context['@type'];
    if (!Array.isArray(types) || types.length === 0) return null;
    var i = 0;
    while (i < types.length){
        if (types[i + 1] === 'Item'){
            return types[i]; // Last type before 'Item'.
        }
        i++;
    }
    return types[i-1]; // Fallback.
}

/**
 * Lookup the title for an Item type, given the entire schemas object.
 *
 * @param {string} atType - Item type.
 * @param {Object} [schemas=null] - Entire schemas object, e.g. as stored in App state.
 * @returns {string} Human-readable title.
 */
export function getTitleForType(atType, schemas){
    if (!atType) return null;

    if (schemas && schemas[atType] && schemas[atType].title){
        return schemas[atType].title;
    }

    // Correct baseType to title if not in schemas.
    // This is case for Abstract Types currently.
    // TODO EXPORT OUT
    switch (atType){
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
export function getSchemaForItemType(itemType, schemas){
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
export function getItemTypeTitle(context, schemas){
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
export function getBaseItemTypeTitle(context, schemas){
    return getTitleForType(getBaseItemType(context), schemas);
}


