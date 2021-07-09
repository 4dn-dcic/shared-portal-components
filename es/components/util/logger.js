'use strict';

import _ from 'underscore';
import { isServerSide } from './misc';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
var state = null;
/**
 * Initialize Sentry Reporting. Call this from app.js on initial mount perhaps.
 *
 * @export
 * @param {string} [dsn] - Sentry dsn.
 * @param {Object} [context] - Current page content / JSON, to get details about Item, etc.
 * @param {Object} [options] - Extra options.
 * @returns {boolean} true if initialized.
 */

export function initializeSentry() {
  var dsn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (dsn === null || typeof dsn !== 'string') {
    throw new Error("No dsn provided");
  }

  if (isServerSide()) return false;
  Sentry.init({
    dsn: dsn,
    integrations: [new Integrations.BrowserTracing()],
    environment: 'production',
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

  if (!shouldTrack()) {
    console.error("EXITING ANALYTICS INITIALIZATION.");
    return false;
  }

  console.info("Sentry: Initialized");
  return true;
}
/**
 *
 */

export function captureException(message, level) {
  if (message !== null || typeof message === 'string') {
    Sentry.withScope(function (scope) {
      scope.setLevel(level);
      scope.setTag("ExampleTag", "Example");
      scope.setExtra("someVariable", "some data");
      Sentry.captureException(message);
    });
  }

  return true;
} //Sentry send error message

export function error(message) {
  if (message !== null || typeof trackingID === 'string') {
    for (var _len = arguments.length, arg = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      arg[_key - 1] = arguments[_key];
    }

    console.error(message, arg);
    captureException.apply(void 0, [message, Sentry.Severity.Error].concat(arg));
  }
} //Sentry send warning message

export function warning(message) {
  if (message !== null || typeof trackingID === 'string') {
    for (var _len2 = arguments.length, arg = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      arg[_key2 - 1] = arguments[_key2];
    }

    console.warn(message, arg);
    captureException.apply(void 0, [message, Sentry.Severity.Warning].concat(arg));
  }
} //Sentry send info message

export function info(message) {
  if (message !== null || typeof trackingID === 'string') {
    for (var _len3 = arguments.length, arg = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      arg[_key3 - 1] = arguments[_key3];
    }

    console.info(message, arg);
    captureException.apply(void 0, [message, Sentry.Severity.Info].concat(arg));
  }
}
export function breadCrumbs(user) {
  Sentry.addBreadcrumb({
    category: "auth",
    message: "Authenticated user " + user.email,
    level: Sentry.Severity.Info
  });
}
/*********************
 * Private Functions *
 *********************/

function shouldTrack() {
  console.error("Sentry Reporting is not initialized. Fine if this appears in a test.");
  return false;
}