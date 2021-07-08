'use strict';
/**
 * @TODO
 * Export more / all things _if_ we're going to put this up on NPM or similar.
 * Or if we want to pre-compile a (non-minified) dist/shared-portal-components.js
 * to be imported by individual projects though will probably avoid doing for this
 * particular repo but maybe do for future ones like "visualization" if split them
 * out.
 */

import * as importedUtils from './components/util';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
Sentry.init({
  dsn: "https://4edcd7f740ea423e9b1042a15fd95bd9@o913210.ingest.sentry.io/5851251",
  integrations: [new Integrations.BrowserTracing()],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
});
export var util = importedUtils;