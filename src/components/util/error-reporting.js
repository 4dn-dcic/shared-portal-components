'use strict';

import _ from 'underscore';
import url from 'url';
import queryString from 'query-string';
import { isServerSide } from './misc';
import { patchedConsoleInstance as console } from './patched-console';
import { contextFiltersToExpSetFilters, expSetFiltersToJSON } from './search-filters';
import * as object from './object';
import * as JWT from './json-web-token';

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";


const defaultOptions = {
    "enabled"                 : true,
    "isAnalyticsScriptOnPage" : true,
    "enhancedEcommercePlugin" : true,
    "itemToProductTransform"  : function(item){
        // 4DN-specific, override from own data model.
        const {
            "@id": itemID,
            uuid: itemUUID, // Deprecated, should always get @id now.
            "@type" : itemType,
            display_title, title,
            // Not always present, esp. if not signed in.
            lab: { display_title: ownLabTitle } = {},
            // Only for files (we dont increment file_size unless part of download)
            file_type_detailed = null,
            track_and_facet_info: { experiment_type: tfi_expType } = {},
            // For exps or expsets, try to grab experiment_type
            experiment_type: { display_title: exp_expType } = {},
            experiments_in_set: [ { experiment_type: { display_title: set_expType } = {} } = {} ] = [{}],
            from_experiment = null,
            from_experiment_set = null
        } = item;
        const labTitle = ownLabTitle || (
            from_experiment && from_experiment.from_experiment_set && from_experiment.from_experiment_set.lab &&
            from_experiment.from_experiment_set.lab.display_title
        ) || (
            from_experiment_set && from_experiment_set.lab && from_experiment_set.lab.display_title
        ) || null;
        const prodItem = {
            'id'            : itemID || itemUUID,
            'name'          : display_title || title || null,
            'category'      : Array.isArray(itemType) ? itemType.slice().reverse().slice(1).join('/') : "Unknown",
            'brand'         : labTitle,
            ["dimension" + state.dimensionNameMap.name] : display_title || title || null
        };
        if (typeof file_type_detailed === "string"){ // We set file format as "variant"
            const [ , fileTypeMatch, fileFormatMatch ] = file_type_detailed.match(/(.*?)\s(\(.*?\))/);
            if (fileFormatMatch){
                prodItem.variant = fileTypeMatch;
            }
        }
        if (tfi_expType) {
            prodItem["dimension" + state.dimensionNameMap.experimentType] = tfi_expType;
        } else if (from_experiment && from_experiment.experiment_type && from_experiment.experiment_type.display_title){
            prodItem["dimension" + state.dimensionNameMap.experimentType] = from_experiment.experiment_type.display_title;
        } else if (exp_expType || set_expType){
            prodItem["dimension" + state.dimensionNameMap.experimentType] = exp_expType || set_expType;
        }
        return prodItem;
    },
    // Google Analytics allows custom dimensions to be sent along w/ events, however they are named incrementally w/o customization.
    // Here we track own keywords/keys and transform to Google-Analytics incremented keys.
    "dimensionNameMap" : {
        "currentFilters"    : 1,
        "name"              : 2,
        "field"             : 3,
        "term"              : 4,
        "experimentType"    : 5,
        "userGroups"        : 6
    },
    "metricNameMap" : {
        "filesize"          : 1,
        "downloads"         : 2
    },
    "anonymizeTypes"     : ["User"],
    "excludeAdminTrackingOnHostnames" : ["data.4dnucleome.org"],
    "reduxStore" : null
};

const state = null;

/**
 * Initialize Sentry Reporting. Call this from app.js on initial mount perhaps.
 *
 * @export
 * @param {string} [dsn] - Sentry dsn.
 * @param {Object} [context] - Current page content / JSON, to get details about Item, etc.
 * @param {Object} [options] - Extra options.
 * @returns {boolean} true if initialized.
 */
export function initializeSentry(dsn = null, appOptions = {}){

    if (dsn === null || typeof dsn !== 'string'){
        throw new Error("No dsn provided");
    }

    if (isServerSide()) return false;

    const {
        initialContext = null,
        initialHref = null,
        ...appOpts
    } = appOptions;
    const options = { ...defaultOptions, ...appOpts };

    Sentry.init({
        dsn: dsn,
        integrations: [new Integrations.BrowserTracing()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });

    if (!shouldTrack()){
        console.error("EXITING ANALYTICS INITIALIZATION.");
        return false;
    }
    console.info("Sentry: Initialized");

    return true;
}

/**
 *
 */
export function captureException(message, level = Sentry.Severity.Warning, fatal = false){

    if (!shouldTrack()) return false;

    const excObj = {
        'hitType'       : 'exception',
        'exDescription' : message,
        'exFatal'       : fatal
    };
    Sentry.withScope(function(scope) {
        scope.setLevel(level);
        Sentry.captureException(message);
    });
    //Sentry.captureException(message);
    return true;
}

/*********************
 * Private Functions *
 *********************/

function shouldTrack(){

    if (!state) {
        console.error("Sentry Reporting is not initialized. Fine if this appears in a test.");
        return false;
    }

    if (!state.enabled) {
        console.warn("Sentry Reporting is not enabled. Fine if expected, else check config.");
        return false;
    }

    if (isServerSide()){
        console.warn("Sentry Reporting will not be sent events while serverside. Fine if this appears in a test.");
        return false;
    }

    if (typeof window.Sentry === 'undefined') {
        console.error("Sentry Reporting library is not loaded/available. Fine if disabled via AdBlocker, else check `reporting.js` loading.");
        return false;
    }

    return true;
}


