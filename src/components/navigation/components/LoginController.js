import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'underscore';
import jwt from 'jsonwebtoken';

import { Alerts } from './../../ui/Alerts';
import * as JWT from './../../util/json-web-token';
import { navigate } from './../../util/navigate';
import { load, fetch, promise as ajaxPromise } from './../../util/ajax';
import { event as trackEvent, setUserID } from './../../util/analytics';
import * as logger from '../../util/logger';



/** Imported in componentDidMount. */
let Auth0Lock = null;


/** Controls Login process, also shows Registration Modal */
export class LoginController extends React.PureComponent {

    static propTypes = {
        'updateAppSessionState' : PropTypes.func.isRequired,
        'id'                  : PropTypes.string,
        'auth0Options'        : PropTypes.object,
        'children'            : PropTypes.node.isRequired
    };

    static defaultProps = {
        // Login / logout actions must be deferred until Auth0 is ready.
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
            "unverifiedUserEmail" : null,
            // Whether the code-split JS library for Auth0 has loaded yet.
            // If false, is used to make Login/Register Button disabled temporarily.
            "isAuth0LibraryLoaded": !!Auth0Lock,
            // Whether are currently performing login/registration request.
            "isLoading" : false,
            // Held in here temporarily for user registration purposes.
            // Should be deleted by time user can authenticate
            "jwtToken": null
        };
    }

    componentDidMount() {
        const { auth0Options: auth0OptionsFallback } = this.props;
        const { isAuth0LibraryLoaded } = this.state;
        ajaxPromise("/auth0_config").then(({ auth0Client, auth0Domain, auth0Options }) => {

            if (!auth0Client || !auth0Domain) {
                // This will never happen unless network is down or issue with the orchestration... might be worth throwing an error (?)
                return; // Skip setting "isAuth0LibraryLoaded": true, idk.
            }

            // Overwrite the fallback options with auth0Options, but also keep anything that was passed in
            // and not replaced by a value from /auth0_config (mostly a temp fix until endpoint updated,
            // but will remain necessary for container specification on CGAP to keep login modal from
            // appearing on page load)
            const options = { ...auth0OptionsFallback, ...auth0Options };

            const createLock = () => {
                this.lock = new Auth0Lock(auth0Client, auth0Domain, options);
                this.lock.on("authenticated", this.auth0LoginCallback);
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

    showLock(){
        if (!this.lock || !this.lock.show) return; // Not yet mounted
        this.lock.show();
    }

    validateCookieAndObtainAdditionalUserInfo(token, successCallback = null, errorCallback = null){
        const { updateAppSessionState, onLogin = null } = this.props;

        this.setState({ "isLoading" : true }, ()=>{

            this.lock.hide();

            // Second stage: get this valid OAuth account (Google or w/e) auth'd from our end.
            // We probably can get rid of this Promise.race wrapper, since request/server will likely time out in 30s, idk..
            Promise.race([
                // Server will save as httpOnly cookie.
                fetch('/login', { method: "POST", body: JSON.stringify({ "id_token": token }) }),
                new Promise(function(resolve, reject){
                    setTimeout(function(){ reject({ 'description' : 'timed out', 'type' : 'timed-out' }); }, 90000); /* 90 seconds */
                })
            ])
                .then(({ saved_cookie = false }) => {
                    if (!saved_cookie) {
                        throw new Error("Couldn't set session in /login");
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

                            trackEvent('login', 'UILogin', 'Authenticated ClientSide', null, {
                                user_uuid: userId,
                                user_groups: groups && (JSON.stringify(groups.sort()))
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

    auth0LoginCallback(authResult){
        // First stage: we just have gotten JWT from the Auth0 widget but have not auth'd it against it our own system
        // to see if this is a valid user account or some random person who just logged into their Google account.
        const { idToken } = authResult;

        // Server will ensure that we have a validly signed JWT token/cookie and that the user account exists in system.
        this.validateCookieAndObtainAdditionalUserInfo(
            idToken,
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
                    if (unverifiedUserEmail) {
                        // Somewhat weird/hacky approach to mask the idToken in private func enclosure
                        // and not leave potentially-more-exposed in state
                        this.onRegistrationCompleteBoundWithToken = this.onRegistrationComplete.bind(this, idToken);
                        this.setState({ unverifiedUserEmail });
                    } else {
                        throw new Error("Expected to receive unverified user email.");
                    }
                } else {
                    Alerts.queue(Alerts.LoginFailed);
                }
            }
        );
    }

    /** This function must be bound to an idToken before it can be used. */
    onRegistrationComplete(idToken){
        const { unverifiedUserEmail } = this.state;

        if (!idToken) {
            throw Error("Expected an idToken");
        }

        // Delete bound version of self
        delete this.onRegistrationCompleteBoundWithToken;

        this.validateCookieAndObtainAdditionalUserInfo(
            idToken,
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

                // Cleanup any remaining JWT (deprecated re: httpOnly cookie)
                JWT.remove();
                setUserID(null);
                Alerts.queue(Alerts.LoginFailed);
            }
        );
    }

    onRegistrationCancel(){
        delete this.onRegistrationCompleteBoundWithToken;

        // Cleanup any remaining JWT (deprecated re: httpOnly cookie)
        JWT.remove();
        this.setState({ "unverifiedUserEmail": null });
    }

    render(){
        const { children, ...passProps } = this.props;
        const { isLoading, isAuth0LibraryLoaded, unverifiedUserEmail } = this.state;

        const childProps = {
            ...passProps,
            isLoading, unverifiedUserEmail, isAuth0LibraryLoaded,
            "showLock": this.showLock
        };

        if (unverifiedUserEmail) {
            // aka in registration mode.
            childProps.onRegistrationComplete = this.onRegistrationCompleteBoundWithToken;
            childProps.onRegistrationCancel = this.onRegistrationCancel;
        }

        return React.Children.map(children, function(child){
            if (!React.isValidElement(child) || typeof child.type === "string") {
                return child;
            }
            return React.cloneElement(child, childProps);
        });
    }

}

/**
 * Deletes cookies from our app server and Auth0
 * @todo Grab hms-dbmi.auth0.com from somewhere in ini files or similar.
 *
 * @returns a Promise that can keep attaching callbacks to.
 */
export function performLogout(){
    // Grab here, gets deleted at end of response.
    const { uuid } = JWT.getUserDetails() || {};

    return fetch("/logout").then(function(response){
        const { deleted_cookie = false } = response;
        if (!deleted_cookie) {
            throw new Error("Couldn't delete cookie, check network");
        }

        // Removes userInfo (localStorage)
        JWT.remove();

        // Maybe todo, if can this window to autoclose in some amount of time..
        // AJAX doesn't work for that Auth0 endpoint.
        // See https://auth0.com/docs/api/authentication#logout

        // window.open(`https://${auth0Domain}/v2/logout?client_id=${auth0ClientID}`);
        return response;
    }).then(function(auth0LogoutResponse){
        console.log("Logged out", auth0LogoutResponse);
        trackEvent('logout', 'UILogout', 'Logged Out ClientSide', null, { user_uuid: uuid });
    });
}


export class LogoutController extends React.PureComponent {

    constructor(props){
        super(props);
        this.performLogoutUI = this.performLogoutUI.bind(this);
        this.state = { "isLoading": false };
    }

    /**
     * Removes JWT from cookies, as well as userInfo from localStorage
     * and then refreshes current view/href via navigate fxn.
     *
     * @param {Event} [evt] - Not needed. Will prevent default / stopPropagation if present.
     */
    performLogoutUI(evt = null){

        if (evt && evt.preventDefault){
            evt.preventDefault();
            evt.stopPropagation();
        }

        this.setState({ "isLoading": true }, ()=>{
            performLogout().then(()=>{

                this.setState({ "isLoading" : false });

                // Remove from analytics session
                setUserID(null);

                // Attempt to preserve hash, if any, but don't scroll to it.
                const windowHash = (window && window.location && window.location.hash) || '';
                console.info("Logged out; re-loading context");
                navigate(windowHash, { "inPlace" : true, "dontScrollToTop" : !!(windowHash) });

                if (typeof document !== 'undefined'){
                    // Dummy click event to close dropdown menu, bypasses document.body.onClick handler (app.js -> App.prototype.handeClick)
                    document.dispatchEvent(new MouseEvent('click'));
                }

            });
        });

    }

    render(){
        const { children, ...passProps } = this.props;
        const { isLoading } = this.state;
        return React.cloneElement(
            children,
            {
                ...passProps,
                isLoading,
                performLogout: this.performLogoutUI
            }
        );
    }

}
