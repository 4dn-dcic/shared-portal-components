
import React, { useState, useEffect } from 'react';
import { Alerts } from './../ui/Alerts';
import _ from 'underscore';
import * as JWT from './json-web-token';
import { patchedConsoleInstance as console } from './patched-console';
import { exception as analyticsException } from './analytics';



export const AJAXSettings = Object.freeze((function(){
    // Returned from anonymous function since server-side rendering can re-use global state.
    // Also a singleton class b.c. might as well.

    const defaultHeaders = Object.freeze({
        "Content-Type"      : "application/json; charset=UTF-8",
        "Accept"            : "application/json",
        "X-Requested-With"  : "XMLHttpRequest" // Allows some server-side libs (incl. pyramid) to identify using `request.is_xhr`.
    });

    const onSessionExpiredCallbacks = new Set();
    // const onLoadCallbacks = new Set();

    function didSessionExpire(xhr){
        // Derived from https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders#example
        const headersArr = xhr.getAllResponseHeaders().trim().split(/[\r\n]+/);
        const headersLen = headersArr.length;
        for (var i = 0; i < headersLen; i++) {
            const [ header, value ] = headersArr[i].split(': ');
            if (header.toLowerCase() === "www-authenticate"){
                if (value.indexOf('title="Session Expired"') > -1) {
                    return true;
                }
            }
        }
        return false;
    }

    /** Called by all app AJAX requests */
    function onLoad(xhr){
        const sessionExpired = (xhr.status === 401 && didSessionExpire(xhr));
        if (sessionExpired) {
            // Remove existing localStorage userInfo
            JWT.remove();
            console.warn("User session has expired or been unset", xhr);
            onSessionExpiredCallbacks.forEach(function(callback){
                // One of these should be App's `this.updateAppSessionState`
                callback(xhr);
            });
        }
    }

    return {
        onLoad,
        defaultHeaders,
        addSessionExpiredCallback: function(callback){
            onSessionExpiredCallbacks.add(callback);
        },
        removeSessionExpiredCallback: function(callback){
            onSessionExpiredCallbacks.delete(callback);
        },
        // Disabled for now until/unless need for this in future.
        // addOnLoadCallback(callback){
        //     onLoadCallbacks.add(callback);
        // },
        // removeOnLoadCallback(callback){
        //     onLoadCallbacks.delete(callback);
        // }
    };
})());

/**
 * @private
 * @function
 * @param {XMLHttpRequest} xhr - XHR object.
 * @param {Object} [headers={}] - Headers object.
 * @param {string[]} [deleteHeaders=[]] - List of header key names to exclude, e.g. from extra or default headers object.
 * @returns {XMLHttpRequest} XHR object with set headers.
 */
function setHeaders(xhr, headers = {}, deleteHeaders = []) {
    headers = { ...AJAXSettings.defaultHeaders, ...headers };
    var i;
    for (i = 0; i < deleteHeaders.length; i++){
        delete headers[deleteHeaders[i]];
    }

    // Put everything in the header
    const headerKeys = Object.keys(headers);
    for (i = 0; i < headerKeys.length; i++){
        xhr.setRequestHeader(headerKeys[i], headers[headerKeys[i]]);
    }

    return xhr;
}


export function load(url, callback, method = 'GET', fallback = null, data = null, headers = {}, deleteHeaders = []){
    if (typeof window === 'undefined') return null;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            AJAXSettings.onLoad(xhr);
            if ([200,201,202,203].indexOf(xhr.status) > -1) {
                if (typeof callback === 'function'){
                    callback(JSON.parse(xhr.responseText), xhr);
                }
            } else {
                var response;
                try {
                    response = JSON.parse(xhr.responseText);
                    console.error('ajax.load error: ', response);
                    if (typeof fallback === 'function') fallback(response, xhr);
                } catch (error) {
                    console.error('Non-JSON error response:', xhr.responseText);
                    if (typeof fallback === 'function') fallback({}, xhr);
                }
            }
        }
    };

    xhr.open(method, url, true);
    xhr = setHeaders(xhr, headers, deleteHeaders || []);

    if (data){
        xhr.send(data);
    } else {
        xhr.send();
    }
    return xhr;
}

/**
 * Own implementation of an AJAX Promise.
 * Similar to the modern `window.fetch` that most modern browsers support (excl. IE),
 * but adds support for `abort` and all other nice features of the XMLHttpRequest
 * interface.
 */
export function promise(url, method = 'GET', headers = {}, data = null, cache = true, deleteHeaders = [], debugResponse = false){
    let xhr;
    const promiseInstance = new Promise(function(resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.onload = function() {
            AJAXSettings.onLoad(xhr);
            var response = null;
            // response SHOULD be json
            try {
                response = JSON.parse(xhr.responseText);
                if (debugResponse) console.info('Received data from ' + method + ' ' + url + ':', response);
            } catch (e) {
                console.log(xhr);
                console.error("Non-JSON error response:", xhr.responseText);
                reject(xhr);
                return;
            }
            resolve(response);
        };
        xhr.onerror = reject;
        if (cache === false){
            url += '&ts=' + parseInt(Date.now());
        }
        xhr.open(method, url, true);
        xhr = setHeaders(xhr, headers, deleteHeaders || []);

        if (data) {
            xhr.send(data);
        } else {
            xhr.send();
        }
        return xhr;
    });

    // This abort below doesn't work consistently. Don't depend on it. Even plain `XHR.abort` isn't reliable.
    // Rely instead on keeping a scoped reference to the initial request,
    // and then check in request callback if this request is still more recent or not,
    // and throw out if has been superseded.
    promiseInstance.xhr = xhr;
    promiseInstance.abort = function(){
        if (promiseInstance.xhr.readyState !== 4) promiseInstance.xhr.abort();
    };
    return promiseInstance;
}

/**
 * Wrapper around function promise() which is slightly more relevant for navigation.
 * Strips hash from URL, sets same origin policy.
 *
 * @param {string} url
 * @param {{}} options
 */
export function fetch(targetURL, options = {}){
    options = { 'credentials' : 'same-origin', ...options };
    const {
        method = "GET",
        headers: origHeaders = {},
        body: data = null,
        cache = true
    } = options;
    const headers = { ...origHeaders };

    // Strip url fragment.
    const hashIndex = targetURL.indexOf('#');
    if (hashIndex > -1) {
        targetURL = targetURL.slice(0, hashIndex);
    }
    const request = promise(targetURL, method, headers, data, cache);
    request.targetURL = targetURL;
    request.xhr_begin = 1 * new Date();
    request.then((response) => {
        request.xhr_end = 1 * new Date();
    });
    return request;
}

/** Calls ajax.fetch() internally, but adds 'json' function to return self. */
export function fetchPolyfill(url, options){
    var req = fetch(url, options);
    req.then((resp) => {
        resp.json = function(){ return resp; };
    });
    return req;
}

/**
 * A class utility for executing promise-chains in a sequential manner. Includes some
 * scaffolding for aborting promises; needs more work in future.
 *
 * In drag-and-drop upload, this class ensures that each Item is uploaded and linked
 * before starting the upload of the next item, so that the new atIds can be collected
 * and patched to the parent together.
 */
export class PromiseQueue {
    constructor() {
        this.queue = [];
        this.pendingPromise = false;
        this.stop = false;
    }

    enqueue(promise) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }

    dequeue() {
        if (this.pendingPromise) {
            return false;
        }
        if (this.stop) {
            this.queue = [];
            this.stop = false;
            return;
        }
        const item = this.queue.shift();
        if (!item) {
            return false;
        }
        try {
            this.pendingPromise = true;
            item.promise()
                .then((value) => {
                    this.pendingPromise = false;
                    item.resolve(value);
                    this.dequeue();
                })
                .catch((err) => {
                    this.pendingPromise = false;
                    item.reject(err);
                    this.dequeue();
                });
        } catch (err) {
            this.pendingPromise = false;
            item.reject(err);
            this.dequeue();
        }
        return true;
    }
}


/**
 * Helper component which will simply AJAX an Item in and pass it down as `props.fetchedItem`
 * (or other prop name, which may be set via `fetchedItemPropName`).
 *
 * Meant to make changing between using Items' embedded_list & AJAXing linkTos simple.
 * Idea roughly taken from existing 'Fetched' from ENCODE (https://github.com/ENCODE-DCC/encoded/blob/d78448b0a332ec4f056df65f6dee9cf8bacb1ab3/src/encoded/static/components/fetched.js),
 * albeit quite a bit simpler hopefully.
 */
export class FetchedItem extends React.Component {

    static defaultProps = {
        "fetchedItemPropName": "fetchedItem",
        "isFetchingItemPropName": "isFetchingItem",
        "onFail": function (err) {
            Alerts.queue(Alerts.ConnectionError);
        }
    };

    constructor(props){
        super(props);
        this.fetchItem = this.fetchItem.bind(this);
        this.state = {
            "fetchedItem": null,
            "isFetchingItem": !!(props.atId),
            "fetchedItemError": null
        };
    }

    componentDidMount(){
        this.fetchItem();
    }

    componentDidUpdate({ atId: pastAtId }){
        const { atId } = this.props;
        if (atId !== pastAtId) {
            this.fetchItem();
        }
    }

    fetchItem(){
        const { onFail: propOnFail } = this.props;

        const onSuccess = (res) => {
            this.setState({
                "fetchedItem": res,
                "isFetchingItem": false
            });
        };

        const onFail = (res) => {
            if (typeof propOnFail === "function") {
                propOnFail(res);
            }
            console.error("FetchedItem - CONNECTION ERROR", res);
            analyticsException("ajax.FetchedItem - failed; " + (res && res.code || "unknown"));
            this.setState({
                "fetchedItem": null,
                "isFetchingItem": false,
                "error": res
            });
        };

        this.setState({ "isFetchingItem": true }, () => {
            const { atId } = this.props;
            load(atId, onSuccess, "GET", onFail);
        });
    }

    render(){
        const { children, fetchedItemPropName, isFetchingItemPropName, ...remainingProps } = this.props;
        const { fetchedItem, isFetchingItem, fetchedItemError } = this.state;
        const passProps = {
            ...remainingProps,
            [fetchedItemPropName]: fetchedItem,
            [isFetchingItemPropName]: isFetchingItem
        };
        if (fetchedItemError) {
            delete passProps[isFetchingItemPropName];
            passProps[isFetchingItemPropName + "Error"] = fetchedItemError;
        }
        return React.Children.map(children, function(child){
            if (!React.isValidElement(child)) {
                return child;
            }
            if (typeof child.type === "string") {
                return child;
            }
            return React.cloneElement(child, passProps);
        });
    }

}

/**
 * Method for submitting multipart/form-data without dealing with bugs caused by explicitly set headers in Ajax.promise
 * @param {string} postURL              Endpoint to post data to (e.g. /ingestion-submissions/<uuid>/submit_for_ingestion)
 * @param {FormData object} formData    An instance of FormData with data .append()ed
 * @param {function} onErrorCallback    Function to call when request fails (should accept xhr.response as first argument)
 * @param {function} onSuccessCallback  Function to call when request succeeds (should accept xhr.response as first argument)
 * May at some point integrate with ajax.promise (workaround)
 */
export function postMultipartFormData(postURL = null, formData = null, onErrorCallback = null, onSuccessCallback = null) {
    console.log(`Attempting multipart/form-data Ingestion. \n\nPosting to: ${postURL}`);

    if (!postURL || !formData || !onErrorCallback || !onSuccessCallback) { throw new Error ("All arguments required. See SPC util/ajax.js for spec."); }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", postURL, true);

    xhr.onreadystatechange = function() { // Called when the state changes.
        AJAXSettings.onLoad(xhr);
        if (xhr.readyState !== 4) return;
        if (xhr.readyState === xhr.DONE && xhr.status === 200) { // Request finished successfully
            onSuccessCallback(xhr.response);
        } else {
            onErrorCallback(xhr.response);
        }
    };

    xhr.send(formData);
}