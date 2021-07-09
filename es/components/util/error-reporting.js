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
    environment: 'prod',
    maxBreadcrumbs: 100,
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

export function captureException(message) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Sentry.Severity.Warning;
  arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!shouldTrack()) return false;
  Sentry.withScope(function (scope) {
    scope.setLevel(level);
    Sentry.captureException(message);
  }); //Sentry.captureException(message);

  return true;
}
/*********************
 * Private Functions *
 *********************/

function shouldTrack() {
  console.error("Sentry Reporting is not initialized. Fine if this appears in a test.");
  return false;
}

export var levels = {
  /** JSDoc */
  Fatal: "fatal",

  /** JSDoc */
  Error: "error",

  /** JSDoc */
  Warning: "warning",

  /** JSDoc */
  Log: "log",

  /** JSDoc */
  Info: "info",

  /** JSDoc */
  Debug: "debug",

  /** JSDoc */
  Critical: "critical"
};