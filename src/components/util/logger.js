'use strict';

import _ from 'underscore';
import { isServerSide } from './misc';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";


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
export function initializeLogger(dsn = null, appOptions = {}){

    if (dsn === null || typeof dsn !== 'string'){
        throw new Error("No dsn provided");
    }

    if (isServerSide()) return false;

    Sentry.init({
        dsn: dsn,
        integrations: [new Integrations.BrowserTracing()],
        environment:'production',
        maxBreadcrumbs:100,
        //Monitor the health of releases by observing user adoption, usage of the application, percentage of crashes, and session data.
        autoSessionTracking: true,

        //Determine issues and regressions introduced in a new release
        //Predict which commit caused an issue and who is likely responsible
        //Resolve issues by including the issue number in your commit message
        //Receive email notifications when your code gets deployed
        release:'',

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });

    if (!isInitialized()){
        console.error("EXITING LOGGER INITIALIZATION.");
        return false;
    }
    console.info("Logger: Initialized");

    return true;
}

function log(message, level, ...arg){
    if (message && typeof message === 'string'){
        Sentry.withScope(function (scope) {
            scope.setLevel(level);
            scope.setTag("ExampleTag", "Example");
            scope.setExtra("someVariable", "some data");

            Sentry.captureException(message);
        });
    }

    return true;
}

export function error(message, ...arg) {
    if (message && typeof message === 'string') {
        console.error(message, arg);
        log(message, Sentry.Severity.Error, ...arg);
    }
}

export function warning(message, ...arg) {
    if (message && typeof message === 'string') {
        console.warn(message, arg);
        log(message, Sentry.Severity.Warning, ...arg);
    }
}

export function info(message, ...arg) {
    if (message && typeof message === 'string') {
        console.info(message, arg);
        log(message, Sentry.Severity.Info, ...arg);
    }
}

export function breadCrumbs(user) {
    Sentry.addBreadcrumb({
        category: "auth",
        message: "Authenticated user " + user.email,
        level: Sentry.Severity.Info,
    });
}


/*********************
 * Private Functions *
 *********************/

function isInitialized(){

    if (!state) {
        console.error("Logger is not initialized. Fine if this appears in a test.");
        return false;
    }

    if (!state.enabled) {
        console.warn("Logger is not enabled. Fine if expected, else check config.");
        return false;
    }

    if (isServerSide()){
        console.warn("Logger will not be sent events while serverside. Fine if this appears in a test.");
        return false;
    }

    // if (typeof window.Sentry === 'undefined') {
    //     console.error("Logger library is not loaded/available. Fine if disabled via AdBlocker, else check `logger.js` loading.");
    //     return false;
    // }

    return true;
}



