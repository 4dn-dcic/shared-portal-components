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

export function initializeLogger() {
  var dsn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (dsn === null || typeof dsn !== 'string') {
    throw new Error("No dsn provided");
  }

  if (isServerSide()) return false;
  Sentry.init({
    dsn: dsn,
    integrations: [new Integrations.BrowserTracing()],
    maxBreadcrumbs: 100,
    //Monitor the health of releases by observing user adoption, usage of the application, percentage of crashes, and session data.
    autoSessionTracking: true,
    //Determine issues and regressions introduced in a new release
    //Predict which commit caused an issue and who is likely responsible
    //Resolve issues by including the issue number in your commit message
    //Receive email notifications when your code gets deployed
    release: '',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  });

  if (!isInitialized(dsn)) {
    console.error("EXITING LOGGER INITIALIZATION.");
    return false;
  }

  console.info("Logger: Initialized");
  return true;
}
export function error(message) {
  for (var _len = arguments.length, arg = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    arg[_key - 1] = arguments[_key];
  }

  console.error(message, arg);
  log.apply(void 0, [message, Sentry.Severity.Error].concat(arg));
}
export function warning(message) {
  for (var _len2 = arguments.length, arg = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    arg[_key2 - 1] = arguments[_key2];
  }

  console.warn(message, arg);
  log.apply(void 0, [message, Sentry.Severity.Warning].concat(arg));
}
export function info(message) {
  for (var _len3 = arguments.length, arg = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    arg[_key3 - 1] = arguments[_key3];
  }

  console.info(message, arg);
  log.apply(void 0, [message, Sentry.Severity.Info].concat(arg));
}
/**
 * generic function to log into sentry
 */

function log(message, level) {
  for (var _len4 = arguments.length, arg = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    arg[_key4 - 2] = arguments[_key4];
  }

  Sentry.withScope(function (scope) {
    scope.setLevel(level); //scope.setTag("ExampleTag", "Example");

    scope.setExtra("ExtraArgument", arg);
    Sentry.captureException(message);
  });
}
/*********************
 * Private Functions *
 *********************/


function isInitialized(dsn) {
  if (!dsn) {
    console.warn("Logger is not dsn. Fine if expected, else check config.");
    return false;
  }

  if (isServerSide()) {
    console.warn("Logger will not be sent events while serverside. Fine if this appears in a test.");
    return false;
  }

  return true;
}