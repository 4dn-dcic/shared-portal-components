'use strict';

import url from 'url';
import queryString from 'query-string';
import _ from 'underscore';
import { NavigateOpts } from './typedefs';

let cachedNavFunction = null;
let callbackFunctions = [];


/**
 * Navigation function, defined globally to act as alias of App.navigate.
 * Is set in App constructor via navigate.setNavigateFunction.
 *
 * Singleton function, defined the old fashioned way (pre ES6).
 * Uses the same parameters as app.prototype.navigate(..).
 *
 * Use by importing and calling in the same way app.navigate might be used.
 *
 * @param {string}       href                        Where to navigate to.
 * @param {NavigateOpts} [options={}]                Additional options, examine App.navigate for details.
 * @param {function}     [callback]                  Optional callback, accepts the response object.
 * @param {function}     [fallbackCallback]          Optional callback called if any error with response, including 404 error. Accepts response object -or- error object, if AJAX request failed.
 * @param {Object}       [includeReduxDispatch={}]   Optional state to save to Redux store, in addition to the 'href' and 'context' set by navigate function.
 *
 * @example
 * var { navigate } = require('./util');
 * navigate('/a/different/page', options);
 */
var navigate = function(href, options = {}, callback = null, fallbackCallback = null, includeReduxDispatch = {}){
    if (typeof cachedNavFunction !== 'function') throw new Error('No navigate function cached.');
    var callbackFxn = function(jsonResponse){
        if (callbackFunctions.length > 0) _.forEach(callbackFunctions, function(cb){ cb(jsonResponse); }); // Any registered callbacks.
        if (typeof callback === 'function') callback(jsonResponse); // Original callback
    };
    return cachedNavFunction.call(cachedNavFunction, href, options, callbackFxn, fallbackCallback, includeReduxDispatch);
};

/******* PUBLIC STATIC FUNCTIONS *******/

/**
 * This is called in app initialization to alias app.navigate into this global module/function.
 *
 * @param {function} navFxn - The `navigate` function bound to `App` component to be aliased.
 * @returns {void}
 */
navigate.setNavigateFunction = function(navFxn){
    if (typeof navFxn !== 'function') throw new Error("Not a function.");
    cachedNavFunction = navFxn;
};


navigate.determineSeparatorChar = function(href){
    return (
        ['?','&'].indexOf(href.charAt(href.length - 1)) > -1 ? // Is last character a '&' or '?' ?
            '' : (
                href.match(/\?./) ? '&' : '?'
            )
    );
};


/** Utility function to check if we are on a search page. */
navigate.isSearchHref = function(href){
    if (typeof href === 'string') href = url.parse(href);
    if (href.pathname.slice(0,8) === '/search/') return true;
    return false;
};


/** Register a function to be called on each navigate response. */
navigate.registerCallbackFunction = function(fxn){
    callbackFunctions.push(fxn);
};


navigate.deregisterCallbackFunction = function(fxn){
    callbackFunctions = _.without(callbackFunctions, fxn);
};

/** Useful for param lists */
navigate.mergeObjectsOfLists = function(){
    if (arguments.length < 2) throw Error('Expecting multiple objects as params');
    const targetObj = arguments[0];
    const sourceObjs = Array.prototype.slice.call(arguments, 1);
    _.forEach(sourceObjs, function(o){
        _.forEach(_.keys(o), function(oKey){
            if (typeof targetObj[oKey] === 'undefined') targetObj[oKey] = [];
            if (typeof targetObj[oKey] === 'string')    targetObj[oKey] = [ targetObj[oKey] ];
            if ( Array.isArray(o[oKey]) ){
                if (!_.every(o[oKey], function(v){ return typeof v === 'string'; } )) throw new Error('Must have list of strings as object vals.');
                targetObj[oKey] = targetObj[oKey].concat(o[oKey]);
            } else if (typeof o[oKey] === 'string'){
                targetObj[oKey].push(o[oKey]);
            } else {
                throw new Error('Must have strings or list of strings as object vals.');
            }
        });
    });
    _.forEach(_.keys(targetObj), function(tKey){
        if (typeof targetObj[tKey] === 'string') targetObj[tKey] = [ targetObj[tKey] ]; // Keys which perhaps don't exist on sourceObjs
        targetObj[tKey] = _.uniq(_.filter(targetObj[tKey]));
        if (targetObj[tKey].length === 0) delete targetObj[tKey];
    });
    return targetObj;
};

/** Test if same origin on 2 hrefs. Ported from ENCODE/libs/origin. */
navigate.sameOrigin = function(from, to){
    if (typeof to === 'undefined') {
        to = from;
        from = document.location.href;
    }
    if (typeof from === 'string') from = url.parse(from);
    if (typeof to === 'string') to = url.parse(url.resolve(from.href, to));

    if (to.protocol === 'data:' || to.protocol === 'javascript:') return true;
    if (from.protocol !== to.protocol) return false;
    if (from.protocol === 'file:') return from.pathname === to.pathname;
    return from.host === to.host;
};


export { navigate };
