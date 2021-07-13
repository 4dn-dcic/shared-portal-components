'use strict';

import _ from 'underscore';
import { isServerSide } from './misc';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";


/**
 * Initialize Sentry Reporting. Call this from app.js on initial mount perhaps.
 *
 * @export
 * @param {string} [dsn] - Sentry dsn.
 * @returns {boolean} true if initialized.
 */
export function initializeLogger(dsn = null){

    if (dsn === null || typeof dsn !== 'string'){
        throw new Error("No dsn provided");
    }

    if (isServerSide()) return false;

    Sentry.init({
        dsn: dsn,
        integrations   : [new Integrations.BrowserTracing()],
        maxBreadcrumbs : 100,
        //Monitor the health of releases by observing user adoption, usage of the application, percentage of crashes, and session data.
        autoSessionTracking : true,

        //Determine issues and regressions introduced in a new release
        //Predict which commit caused an issue and who is likely responsible
        //Resolve issues by including the issue number in your commit message
        //Receive email notifications when your code gets deployed
        release : '',

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });

    if (!isInitialized(dsn)){
        console.error("EXITING LOGGER INITIALIZATION.");
        return false;
    }
    console.info("Logger: Initialized");

    return true;
}

export function error(message, ...arg) {
    console.error(message, arg);
    log(message, Sentry.Severity.Error, ...arg);
}

export function warning(message, ...arg) {
    console.warn(message, arg);
    log(message, Sentry.Severity.Warning, ...arg);
}

export function info(message, ...arg) {
    console.info(message, arg);
    log(message, Sentry.Severity.Info, ...arg);
}

/**
 * generic function to log into sentry
 */
function log(message, level, ...arg) {
    Sentry.withScope(function (scope) {
        scope.setLevel(level);
        //scope.setTag("ExampleTag", "Example");
        scope.setExtra("ExtraArgument", arg);

        Sentry.captureException(message);
    });
}

/*********************
 * Private Functions *
 *********************/

function isInitialized(dsn){

    if (!dsn) {
        console.warn("Logger is not dsn. Fine if expected, else check config.");
        return false;
    }

    if (isServerSide()){
        console.warn("Logger will not be sent events while serverside. Fine if this appears in a test.");
        return false;
    }

    return true;
}



