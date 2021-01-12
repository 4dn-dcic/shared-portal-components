'use strict';

import React, { useState, useEffect } from 'react';
import { Alerts } from './../ui/Alerts';
import _ from 'underscore';
import * as JWT from './json-web-token';
import { patchedConsoleInstance as console } from './patched-console';

/**
 * @private
 */
const defaultHeaders = {
    "Content-Type"      : "application/json; charset=UTF-8",
    "Accept"            : "application/json",
    "X-Requested-With"  : "XMLHttpRequest" // Allows some server-side libs (incl. pyramid) to identify using `request.is_xhr`.
};

/**
 * @private
 * @function
 * @param {XMLHttpRequest} xhr - XHR object.
 * @param {Object} [headers={}] - Headers object.
 * @param {string[]} [deleteHeaders=[]] - List of header key names to exclude, e.g. from extra or default headers object.
 * @returns {XMLHttpRequest} XHR object with set headers.
 */
function setHeaders(xhr, headers = {}, deleteHeaders = []) {
    headers = JWT.addToHeaders(_.extend({}, defaultHeaders, headers)); // Set defaults, add JWT if set

    // Put everything in the header
    var headerKeys = _.keys(headers);
    for (var i=0; i < headerKeys.length; i++){
        if (deleteHeaders.indexOf(headerKeys[i]) > -1){
            continue;
        }
        xhr.setRequestHeader(headerKeys[i], headers[headerKeys[i]]);
    }

    return xhr;
}


export function load(url, callback, method = 'GET', fallback = null, data = null, headers = {}, deleteHeaders = []){
    if (typeof window === 'undefined') return null;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
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
export function promise(url, method = 'GET', headers = {}, data = null, cache = true, debugResponse = false){
    var xhr;
    var promiseInstance = new Promise(function(resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.onload = function() {
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
        if (cache === false && url.indexOf('format=json') > -1){
            url += '&ts=' + parseInt(Date.now());
        }
        xhr.open(method, url, true);
        xhr = setHeaders(xhr, headers);

        if (data) {
            xhr.send(data);
        } else {
            xhr.send();
        }
        return xhr;
    });
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
 * @export
 * @param {any} url
 * @param {any} options
 */
export function fetch(targetURL, options){
    options = _.extend({ 'credentials' : 'same-origin' }, options);
    const http_method = options.method || 'GET';
    const headers = options.headers = _.extend({}, options.headers || {});

    // Strip url fragment.
    const hashIndex = targetURL.indexOf('#');
    if (hashIndex > -1) {
        targetURL = targetURL.slice(0, hashIndex);
    }
    const data = options.body ? options.body : null;
    const request = promise(targetURL, http_method, headers, data, options.cache === false ? false : true);
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
        "isFetchingItemPropName": "isFetchingItem"
    };

    constructor(props){
        super(props);
        this.fetchItem = this.fetchItem.bind(this);
        this.state = {
            "fetchedItem": null,
            "isFetchingItem": !!(props.atId)
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
        const onSuccess = (res) => {
            this.setState({
                "fetchedItem" : res,
                "isFetchingItem" : false
            });
        };

        const onFail = (res) => {
            console.log("CONNECTION ERROR", res);
            Alerts.queue(Alerts.ConnectionError);
            onSuccess(null);
        };

        this.setState({ isFetchingItem: true }, () => {
            const { atId } = this.props;
            load(atId, onSuccess, "GET", onFail);
        });
    }

    render(){
        const { children, fetchedItemPropName, isFetchingItemPropName, ...remainingProps } = this.props;
        const { fetchedItem, isFetchingItem } = this.state;
        const passProps = {
            ...remainingProps,
            [fetchedItemPropName]: fetchedItem,
            [isFetchingItemPropName]: isFetchingItem
        };
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
