
import { isServerSide } from './misc';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

let isInitialized = false;

/**
 * Initialize Sentry Reporting. Call this from app.js on initial mount perhaps.
 *
 * @export
 * @param {string} [dsn] - Sentry dsn.
 * @param {number} [sampleRate] - trace sample rate - 1.0 to capture 100% of transactions for performance monitoring.
 * @returns {boolean} true if initialized.
 */
export function initializeLogger(dsn = null, sampleRate = 0.1){

    if (dsn === null || typeof dsn !== 'string'){
        console.error("EXITING LOGGER INITIALIZATION - Logger has not dsn. Fine if expected, else check config.");
        return false;
    }

    if (sampleRate === null || typeof sampleRate !== 'number' || sampleRate < 0 || sampleRate > 1){
        console.error("EXITING LOGGER INITIALIZATION - Logger has not valid sampleRate. Fine if expected, else check config.");
        return false;
    }

    if (isServerSide()){
        console.error("EXITING LOGGER INITIALIZATION - Logger will not be sent events while serverside. Fine if this appears in a test.");
        return false;
    }

    Sentry.init({
        dsn: dsn,
        integrations   : [new BrowserTracing()],
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
        tracesSampleRate: sampleRate,
    });

    isInitialized = true;
    console.info("Logger: Initialized");

    return true;
}

export function error(message, ...arg) {
    console.error(message, arg);
    log(message, "error", ...arg);
}

export function warning(message, ...arg) {
    console.warn(message, arg);
    log(message, "warning", ...arg);
}

export function info(message, ...arg) {
    console.info(message, arg);
    log(message, "info", ...arg);
}

/**
 * generic function to log into sentry
 */
function log(message, level, ...arg) {
    if (!isInitialized) { return; }

    Sentry.withScope(function (scope) {
        scope.setLevel(level);
        //scope.setTag("ExampleTag", "Example");
        scope.setExtra("ExtraArgument", arg);

        Sentry.captureException(message);
    });
}