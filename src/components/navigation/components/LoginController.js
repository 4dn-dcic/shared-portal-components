'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'underscore';
import jwt from 'jsonwebtoken';

import { Alerts } from './../../ui/Alerts';
import * as JWT from './../../util/json-web-token';
import { navigate } from './../../util/navigate';
import { load, fetch } from './../../util/ajax';
import { event as trackEvent, setUserID } from './../../util/analytics';

/** Imported in componentDidMount. */
let Auth0Lock = null;

/** Controls Login process, also shows Registration Modal */
export class LoginController extends React.PureComponent {

    static propTypes = {
        'updateUserInfo'      : PropTypes.func.isRequired,
        'id'                  : PropTypes.string,
        'auth0ClientID'       : PropTypes.string.isRequired,
        'auth0Domain'         : PropTypes.string.isRequired,
        'auth0Options'        : PropTypes.object,
        'children'            : PropTypes.node.isRequired
    };

    static defaultProps = {
        // Login / logout actions must be deferred until Auth0 is ready.
        // TODO: these (maybe) should be read in from base and production.ini
        'auth0ClientID' : 'DPxEwsZRnKDpk0VfVAxrStRKukN14ILB',
        'auth0Domain' : 'hms-dbmi.auth0.com',
        'auth0Options' : {
            auth: {
                sso: false,
                redirect: false,
                responseType: 'token',
                params: {
                    scope: 'openid email',
                    prompt: 'select_account'
                }
            },
            socialButtonStyle: 'big',
            theme: {
                logo: '/static/img/4dn_logo.svg',
                icon: '/static/img/4dn_logo.svg',
                primaryColor: '#009aad'
            },
            allowedConnections: ['github', 'google-oauth2', 'partners'],
            languageDictionary: {
                title: 'Log In',
                emailInputPlaceholder: 'email@partners.org',
                databaseEnterpriseAlternativeLoginInstructions: 'or login via Partners'
            }
        },
        'onLogin' : function(profile){
            console.log("Logged in", profile);
        }
    };

    constructor(props){
        super(props);
        this.showLock = _.throttle(this.showLock.bind(this), 1000, { trailing: false });
        this.validateCookieAndObtainAdditionalUserInfo = this.validateCookieAndObtainAdditionalUserInfo.bind(this);
        this.auth0LoginCallback = this.auth0LoginCallback.bind(this);
        this.onRegistrationComplete = this.onRegistrationComplete.bind(this);
        this.onRegistrationCancel = this.onRegistrationCancel.bind(this);
        this.state = {
            // Contains email of Auth0-authenticated user but not in-system user
            "unverifiedUserEmail" : false,
            // Whether the JS lib for Auth0 has loaded yet.
            // If not, can be used to make Login/Register Button appear somewhat disabled temporarily.
            "isAuth0LibraryLoaded": false,
            // Whether are currently performing login/registration request.
            "isLoading" : false,
            // Held in here temporarily for user registration purposes.
            // Should be deleted by time user can authenticate
            "jwtToken": null
        };
    }

    componentDidMount () {
        const { auth0ClientID, auth0Domain, auth0Options } = this.props;
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
            this.lock = new Auth0Lock(auth0ClientID, auth0Domain, auth0Options);
            this.lock.on("authenticated", this.auth0LoginCallback);
            this.setState({ "isAuth0LibraryLoaded": true });
        });
    }

    showLock(){
        if (!this.lock || !this.lock.show) return; // Not yet mounted
        this.lock.show();
    }

    validateCookieAndObtainAdditionalUserInfo(successCallback = null, errorCallback = null){
        const { updateUserInfo, onLogin = null } = this.props;

        this.setState({ "isLoading" : true }, ()=>{

            this.lock.hide();

            // Second stage: get this valid OAuth account (Google or w/e) auth'd from our end.
            // We probably can get rid of this Promise.race wrapper, since request/server will likely time out in 30s, idk..
            Promise.race([
                fetch('/login', { method: 'POST', body: "{}" }),
                new Promise(function(resolve, reject){
                    setTimeout(function(){ reject({ 'description' : 'timed out', 'type' : 'timed-out' }); }, 90000); /* 90 seconds */
                })
            ])
                .then((response) => {
                    // Add'l Error Check (will throw to be caught)
                    if (response.code || response.status) throw response;
                    return response;
                })
                .then((userInfoResponse) => {
                    console.info('Received info from server about user via /login endpoint', userInfoResponse);

                    JWT.saveUserInfoLocalStorage(userInfoResponse);
                    updateUserInfo(); // <- this function (in App.js) is now expected to call `Alerts.deQueue(Alerts.LoggedOut);`
                    console.info('Login completed');

                    const { user_actions } = userInfoResponse;

                    // Fetch user profile and (outdated/to-revisit-later) use their primary lab as the eventLabel.
                    const profileURL = (_.findWhere(user_actions || [], { 'id' : 'profile' }) || {}).href;

                    if (profileURL){
                        this.setState({ "isLoading" : false });

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
                    console.error("Error during login: ", error.description);
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

    auth0LoginCallback(authResult){
        // First stage: we just have gotten JWT from the Auth0 widget but have not auth'd it against it our own system
        // to see if this is a valid user account or some random person who just logged into their Google account.
        const { idToken } = authResult;

        // We just got token from Auth0 so probably isn't outdated.
        JWT.save(idToken);

        // Server will ensure that we have a validly signed JWT token/cookie and that the user account exists in system.
        this.validateCookieAndObtainAdditionalUserInfo(
            null,
            (error) => {
                console.error(error);
                if (!error.code && error.type === 'timed-out'){
                    // Server or network error of some sort most likely.
                    Alerts.queue(Alerts.LoginFailed);
                } else if (error.code === 401) {
                    // User account not in system -- present a registration form
                    const decodedToken = jwt.decode(idToken);
                    const { email: unverifiedUserEmail } = decodedToken || {};
                    this.setState({ unverifiedUserEmail });
                } else {
                    Alerts.queue(Alerts.LoginFailed);
                }
            }
        );
    }

    onRegistrationComplete(){
        const { unverifiedUserEmail } = this.state;

        this.validateCookieAndObtainAdditionalUserInfo(
            // Success callback -- shows "Success" Alert msg.
            (userProfile) => {
                const userDetails = JWT.getUserDetails(); // We should have this after /login
                const { uuid: userUUID, first_name, last_name } = userDetails;
                const userFullName = (
                    first_name && last_name ? first_name + " " + last_name
                        : (first_name || last_name || null)
                );

                const msg = (
                    <ul className="mb-0">
                        <li>You are now logged in as <span className="text-500">{ userFullName }{ userFullName ? ' (' + unverifiedUserEmail + ')' : unverifiedUserEmail }</span>.</li>
                        <li>Please visit <b><a href={`/users/${userUUID}/`}>your profile</a></b> to edit your account settings or information.</li>
                    </ul>
                );

                // Moved out of setState callback because no guarantee that setState callback is fired
                // if component becomes unmounted (which occurs after login).
                Alerts.queue({
                    "title"     : "Registered & Logged In",
                    "message"   : msg,
                    "style"     : 'success',
                    'navigateDisappearThreshold' : 2
                });

                this.setState({ "unverifiedUserEmail": null });
            },
            (err) => {
                this.setState({ "unverifiedUserEmail": null });
                // Cleanup any remaining JWT
                JWT.remove();
                setUserID(null);
                Alerts.queue(Alerts.LoginFailed);
            }
        );
    }

    onRegistrationCancel(){
        // Cleanup any remaining JWT
        JWT.remove();
        this.setState({ "unverifiedUserEmail": null });
    }

    render(){
        const { children, ...passProps } = this.props;
        const { isLoading, isAuth0LibraryLoaded, unverifiedUserEmail } = this.state;

        const childProps = {
            ...passProps,
            isLoading, unverifiedUserEmail, isAuth0LibraryLoaded,
            "showLock": this.showLock,
            "onRegistrationCancel": this.onRegistrationCancel,
            "onRegistrationComplete": this.onRegistrationComplete
        };

        return React.Children.map(children, function(child){
            if (!React.isValidElement(child) || typeof child.type === "string") {
                return child;
            }
            return React.cloneElement(child, childProps);
        });
    }

}


export class LogoutController extends React.PureComponent {

    constructor(props){
        super(props);
        this.performLogout = this.performLogout.bind(this);
    }

    /**
     * Removes JWT from cookies, as well as userInfo from localStorage
     * and then refreshes current view/href via navigate fxn.
     *
     * @param {Event} [evt] - Not needed. Will prevent default / stopPropagation if present.
     */
    performLogout(evt = null){
        const { updateUserInfo } = this.props;
        const { uuid } = JWT.getUserDetails() || {};

        if (evt && evt.preventDefault){
            evt.preventDefault();
            evt.stopPropagation();
        }

        // Removes both idToken (cookie) and userInfo (localStorage)
        JWT.remove();

        // Remove from analytics session
        setUserID(null);

        // Refetch page context without our old JWT to hide any forbidden content.
        updateUserInfo();

        // Attempt to preserve hash, if any, but don't scroll to it.
        const windowHash = (window && window.location && window.location.hash) || '';
        navigate(windowHash, { "inPlace" : true, "dontScrollToTop" : !!(windowHash) });

        if (typeof document !== 'undefined'){
            // Dummy click event to close dropdown menu, bypasses document.body.onClick handler (app.js -> App.prototype.handeClick)
            document.dispatchEvent(new MouseEvent('click'));
        }

        trackEvent('Authentication', 'UILogout', {
            eventLabel : "Logged Out ClientSide",
            userId: uuid
        });
    }

    render(){
        const { children, ...passProps } = this.props;
        return React.cloneElement(children, { performLogout : this.performLogout, ...passProps });
    }

}
