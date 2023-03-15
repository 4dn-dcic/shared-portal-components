import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'underscore';
import jwt from 'jsonwebtoken';

import { Alerts } from '../../ui/Alerts';
import * as JWT from '../../util/json-web-token';
import { navigate } from '../../util/navigate';
import { load, fetch, promise as ajaxPromise } from '../../util/ajax';
import { event as trackEvent, setUserID } from '../../util/analytics';
import * as logger from '../../util/logger';
import { LoginController } from './LoginController';


let Auth0Lock = null;


/** New Login model, extended LoginController with slightly different interaction */
export class RedisLoginController extends LoginController {

    constructor(props) {
        super(props);
    }

    // override componentDidMount to pass differring options to Auth0Lock
    componentDidMount() {
        const { auth0Options: auth0OptionsFallback } = this.props;
        const { isAuth0LibraryLoaded } = this.state;
        ajaxPromise("/auth0_config").then(({ auth0Client, auth0Domain, auth0Options }) => {
            console.log("calling componentDidMount");
            if (!auth0Client || !auth0Domain) {
                // This will never happen unless network is down or issue with the orchestration... might be worth throwing an error (?)
                return; // Skip setting "isAuth0LibraryLoaded": true, idk.
            }

            const options = { ...auth0OptionsFallback, ...auth0Options };
            const createLock = () => {
                this.lock = new Auth0Lock(auth0Client, auth0Domain, options);
                this.lock.on("authenticated", this.validateCookieAndObtainAdditionalUserInfo);
                setTimeout(()=>{
                    this.setState({ "isAuth0LibraryLoaded": true });
                }, 200);
            };

            if (!isAuth0LibraryLoaded) {
                // prefetch & preload enabled here since is likely that user might want to click Login very quickly after loading webpage.
                import(
                    /* webpackChunkName: "auth0-lock-bundle" */
                    /* webpackMode: "lazy" */
                    /* webpackPrefetch: true */
                    /* webpackPreload: true */
                    "auth0-lock"
                ).then(({ default: Auth0LockImport })=>{
                    Auth0Lock = Auth0LockImport;
                    // As of 9.11.0, auth0-js (dependency of Auth0Lock) cannot work outside of browser context.
                    // We import it here in separate bundle instead to avoid issues during server-side render.
                    createLock();
                    setTimeout(()=>{
                        this.setState({ "isAuth0LibraryLoaded": true });
                    }, 200);
                });
            } else {
                createLock();
            }
        });

    }

    // Slightly modified - send code returned from Auth0 to /callback to get a session token
    validateCookieAndObtainAdditionalUserInfo(token, successCallback = null, errorCallback = null){
        const { updateAppSessionState, onLogin = null } = this.props;
        console.log('calling validateCookieAndObtainAdditionalUserInfo')
        this.setState({ "isLoading" : true }, ()=>{

            this.lock.hide();

            // Second stage: get this valid OAuth account (Google or w/e) auth'd from our end.
            // We probably can get rid of this Promise.race wrapper, since request/server will likely time out in 30s, idk..
            Promise.race([
                // Server will save as httpOnly cookie.
                fetch('/callback', { method: "GET", body: JSON.stringify({ "code": token }) }),
                new Promise(function(resolve, reject){
                    setTimeout(function(){ reject({ 'description' : 'timed out', 'type' : 'timed-out' }); }, 90000); /* 90 seconds */
                })
            ])
                .then(({ saved_cookie = false }) => {
                    if (!saved_cookie) {
                        throw new Error("Couldn't set session in /callback");
                    }
                    // This should return a 401 error if user not found, to caught and handled as 'unregistered user'
                    return fetch("/session-properties");
                })
                .then((response) => {
                    // Add'l Error Check (will throw to be caught by errorCallback)
                    // (HTTPExceptions from Pyramid generally have a code and status in response body)
                    if (response.code || response.status) throw response;
                    return response;
                })
                .then((userInfoResponse) => {
                    console.info('Received info from server about user via /session-properties endpoint', userInfoResponse);
                    const {
                        details: {
                            email: userEmail = null
                        } = {},
                        user_actions = []
                    } = userInfoResponse;

                    if (!userEmail) {
                        throw new Error("Did not receive user details from /session-properties, login failed.");
                    }


                    // Fetch user profile and (outdated/to-revisit-later) use their primary lab as the eventLabel.
                    const profileURL = (_.findWhere(user_actions, { 'id' : 'profile' }) || {}).href;

                    if (profileURL){
                        this.setState({ "isLoading" : false });

                        JWT.saveUserInfoLocalStorage(userInfoResponse);
                        updateAppSessionState(); // <- this function (in App.js) is now expected to call `Alerts.deQueue(Alerts.LoggedOut);`
                        console.info('Login completed');

                        // Register an analytics event for UI login.
                        // This is used to segment public vs internal audience in Analytics dashboards.
                        load(profileURL, (profile)=>{
                            if (typeof successCallback === 'function'){
                                successCallback(profile);
                            }
                            if (typeof onLogin === 'function'){
                                onLogin(profile);
                            }

                            const { uuid: userId, groups = null } = profile;

                            setUserID(userId);

                            trackEvent('Authentication', 'UILogin', {
                                eventLabel : "Authenticated ClientSide",
                                name: userId,
                                userId,
                                userGroups: groups && (JSON.stringify(groups.sort()))
                            });

                            // Refresh the content/context of our page now that we have a JWT stored as a cookie!
                            // It will return same page but with any auth'd page actions.

                            // Attempt to preserve hash, if any, but don't scroll to it.
                            const windowHash = (window && window.location && window.location.hash) || '';
                            navigate(windowHash, { "inPlace" : true, "dontScrollToTop" : !!(windowHash) });
                        }, 'GET', ()=>{
                            throw new Error('Request to profile URL failed.');
                        });
                    } else {
                        throw new Error('No profile URL found in user_actions.');
                    }
                }).catch((error)=>{
                    // Handle Errors
                    logger.error("Error during login: ", error.description);
                    console.log(error);

                    this.setState({ "isLoading" : false });
                    // Alerts.deQueue(Alerts.LoggedOut);
                    setUserID(null);

                    if (typeof errorCallback === "function") {
                        errorCallback(error);
                    }
                });

        });
    }
};
