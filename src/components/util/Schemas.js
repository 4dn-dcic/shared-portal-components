'use strict';

import _ from 'underscore';
import React from 'react';
import { linkFromItem } from './object';
import { LocalizedTime, format as dateFormat } from './date-utility';
import { itemTypeHierarchy } from './itemTypeHierarchy';

let cachedSchemas = null;

/**
 * Should be set by app.js to return app.state.schemas
 *
 * @type {function}
 */
export function get(){
    return cachedSchemas;
}

export function set(schemas){
    cachedSchemas = schemas;
    return true;
}


export const Term = {

    toName : function(field, term, allowJSXOutput = false, addDescriptionTipForLinkTos = true){

        if (allowJSXOutput && typeof term !== 'string' && term && typeof term === 'object'){
            // Object, probably an item.
            return linkFromItem(term, addDescriptionTipForLinkTos);
        }

        var name = null;

        switch (field) {
            case 'experimentset_type':
                name = Term.capitalizeSentence(term);
                break;
            case 'type':
                name = getTitleForType(term);
                break;
            case 'status':
                name = Term.capitalizeSentence(term);
                break;
            case 'date_created':
            case 'public_release':
            case 'project_release':
                if (allowJSXOutput) name = <LocalizedTime timestamp={term} />;
                else name = dateFormat(term);
                break;
            default:
                name = null;
                break;
        }

        if (typeof name === 'string') return name;

        // Remove 'experiments_in_set' and test as if an experiment field. So can work for both ?type=Experiment, ?type=ExperimentSet.
        field = field.replace('experiments_in_set.', '');

        switch (field) {
            case 'biosource_type':
            case 'organism.name':
            case 'individual.organism.name':
            case 'biosource.individual.organism.name':
            case 'biosample.biosource.individual.organism.name':
                name = Term.capitalize(term);
                break;
            case 'file_type':
            case 'file_classification':
            case 'file_type_detailed':
            case 'files.file_type':
            case 'files.file_classification':
            case 'files.file_type_detailed':
                name = Term.capitalizeSentence(term);
                break;
            case 'file_size':
                if (typeof term === 'number'){
                    name = term;
                } else if (!isNaN(parseInt(term))) {
                    name = parseInt(term);
                }
                if (typeof name === 'number' && !isNaN(name)){
                    name = Term.bytesToLargerUnit(name);
                } else {
                    name = null;
                }
                break;
            case '@id':
                name = term;
                break;
            default:
                name = null;
                break;
        }

        // Custom stuff
        if (field.indexOf('quality_metric.') > -1){
            if (field.slice(-11) === 'Total reads')     return Term.roundLargeNumber(term);
            if (field.slice(-15) === 'Total Sequences') return Term.roundLargeNumber(term);
            if (field.slice(-14) === 'Sequence length') return Term.roundLargeNumber(term);
            if (field.slice(-15) === 'Cis/Trans ratio') return Term.roundDecimal(term) + '%';
            if (field.slice(-35) === '% Long-range intrachromosomal reads') return Term.roundDecimal(term) + '%';
            if (field.slice(-4) === '.url' && term.indexOf('http') > -1) {
                var linkTitle = Term.hrefToFilename(term); // Filename most likely for quality_metric.url case(s).
                if (allowJSXOutput){
                    return <a href={term} target="_blank" rel="noopener noreferrer">{ linkTitle }</a>;
                } else {
                    return linkTitle;
                }
            }
        }

        // Fallback
        if (typeof name !== 'string') name = term;

        return name;
    },

    capitalize : function(word)        {
        if (typeof word !== 'string') return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    },
    capitalizeSentence : function(sen) {
        if (typeof sen !== 'string') return sen;
        return sen.split(' ').map(Term.capitalize).join(' ');
    },

    byteLevels : ['Bytes', 'kB', 'MB', 'GB', 'TB', 'Petabytes', 'Exabytes'],

    numberLevels : ['', 'k', 'm', ' billion', ' trillion', ' quadrillion', ' quintillion'],

    bytesToLargerUnit : function(bytes, level = 0){
        if (bytes > 1024 && level < Term.byteLevels.length) {
            return Term.bytesToLargerUnit(bytes / 1024, level + 1);
        } else {
            return (Math.round(bytes * 100) / 100) + ' ' + Term.byteLevels[level];
        }
    },

    roundLargeNumber : function(num, decimalPlaces = 2, level = 0){
        if (num > 1000 && level < Term.numberLevels.length) {
            return Term.roundLargeNumber(num / 1000, decimalPlaces, level + 1);
        } else {
            const multiplier = Math.pow(10, decimalPlaces);
            return (Math.round(num * multiplier) / multiplier) + Term.numberLevels[level];
        }
    },

    roundDecimal : function(num, decimalsVisible = 2){
        if (isNaN(parseInt(num))) throw Error('Not a Number - ', num);
        const multiplier = Math.pow(10, decimalsVisible);
        return Math.round(num * multiplier) / multiplier;
    },

    decorateNumberWithCommas : function(num){
        if (!num || typeof num !== 'number' || num < 1000) return num;
        // Put full number into tooltip w. commas.
        const chunked =  _.chunk((num + '').split('').reverse(), 3);
        return _.map(chunked, function(c){
            return c.reverse().join('');
        }).reverse().join(',');
    },

    /** Only use where filename is expected. */
    hrefToFilename : function(href){
        var linkTitle = href.split('/');
        return linkTitle = linkTitle.pop();
    }

};


export const Field = {

    nameMap : {
        'experiments_in_set.biosample.biosource.individual.organism.name' : 'Organism',
        'accession' : 'Experiment Set',
        'experiments_in_set.digestion_enzyme.name' : 'Enzyme',
        'experiments_in_set.biosample.biosource_summary' : 'Biosource',
        'experiments_in_set.lab.title' : 'Lab',
        'experiments_in_set.experiment_type' : 'Experiment Type',
        'experiments_in_set.experiment_type.display_title' : 'Experiment Type',
        'experimentset_type' : 'Set Type',
        '@id' : "Link",
        'display_title' : "Title"
    },

    toName : function(field, schemas, schemaOnly = false, itemType = 'ExperimentSet'){
        if (!schemaOnly && Field.nameMap[field]){
            return Field.nameMap[field];
        } else {
            var schemaProperty = Field.getSchemaProperty(field, schemas, itemType);
            if (schemaProperty && schemaProperty.title){
                Field.nameMap[field] = schemaProperty.title; // Cache in nameMap for faster lookups.
                return schemaProperty.title;
            } else if (!schemaOnly) {
                return field;
            } else {
                return null;
            }
        }
    },

    getSchemaProperty : function(field, schemas = null, startAt = 'ExperimentSet', skipExpFilters=false){
        if (!schemas && !skipExpFilters) schemas = get && get();
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

};





