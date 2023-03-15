
import _ from 'underscore';
import memoize from 'memoize-one';
import { isServerSide, storeExists } from './misc';
import { patchedConsoleInstance as console } from './patched-console';
import { getNestedProperty } from './object';
import { fetch, load } from './ajax';


/** Used for serverside */
const dummyStorage = {};


/**
 * Checks to see if a JWT token is in proper
 * format. Does not validate it.
 *
 * @public
 * @returns {boolean} True if looks well-formated.
 */
export function maybeValid(jwtToken){
    return (
        typeof jwtToken === 'string' && jwtToken.length > 0 &&
        jwtToken !== "null" &&
        jwtToken !== "expired"
    ) ? true : false;
}


/**
 * Return an array of user groups the current user belongs to
 * from localStorage.
 *
 * @public
 * @returns {string[]} List of group names.
 */
export function getUserGroups(){
    const userInfo = getUserInfo();
    let userGroups = [];
    if (userInfo){
        const currGroups = getNestedProperty(userInfo, ['details', 'groups'], true);
        if (currGroups && Array.isArray(currGroups)){
            userGroups = currGroups;
        }
    }
    return userGroups;
}

/**
 * Gets complete User Info - including token, details, and groups -
 * from localStorage.
 *
 * @public
 * @returns {Object|null} Object containing user info, or null.
 */
export function getUserInfo(){
    try {
        if (storeExists()){
            let result = JSON.parse(localStorage.getItem('user_info'));
            if (result === null) {
                let xhr = load('/session-properties', (response)=>{
                    return response;
                }, 'GET', () => {
                    return null;
                }, null, {}, [], true);
                if (xhr.status === 401) {
                    return null;
                }
                else {
                    let parsedUserInfo = JSON.parse(xhr.response);
                    saveUserInfoLocalStorage(parsedUserInfo);
                    return parsedUserInfo;
                }
            }
            return result;
        } else {
            return JSON.parse(dummyStorage.user_info);
        }
    } catch (e) {
        return null;
    }
}

/**
 * Gets some details about current logged-in user from localStorage,
 * such as their name.
 *
 * @public
 * @returns {Object|null} Object containing user details, or null.
 */
export function getUserDetails(){
    const userInfo = getUserInfo();
    let userDetails = (userInfo && userInfo.details) || null;
    if (userDetails === 'null') userDetails = null;
    return userDetails;
}



/**
 * Saves supplementary user info to localStorage so it might be available
 * for more fine-grained permissions checks. Also some details about User, such
 * as their name, is stored here as well for decoration of User menu title in NavBar
 * and similar use cases.
 *
 * @public
 * @param {Object} user_info - User info object as might be received from the /session-properties or /login endpoint.
 * @returns {boolean} True if success.
 */
export function saveUserInfoLocalStorage(user_info){
    if (storeExists()){
        localStorage.setItem("user_info", JSON.stringify(user_info));
    } else {
        dummyStorage.user_info = JSON.stringify(user_info);
    }
    return true;
}

/**
 * Removes ~~JWT token from cookies and~~ user info from localStorage.
 * May be called as part of logout.
 *
 * @public
 * @todo Rename to 'removeUserInfo' to match updated functionality.
 */
export function remove(){

    if (!isServerSide()) console.warn("Removing UserInfo from localStorage");

    if (!storeExists()) {
        delete dummyStorage.user_info;
    } else if (localStorage.user_info){
        localStorage.removeItem("user_info");
    }

    if (!isServerSide()) console.info("Removed UserInfo");
    return true;
}


/**
 * Helper function to determine if current user is an admin according
 * to the user info in localStorage.
 *
 * Does not provide any real security but can be helpful for showing/hiding certain
 * actions or buttons which would otherwise not be permitted by back-end.
 *
 * @public
 * @returns {boolean} True if admin.
 */
export function isLoggedInAsAdmin(){
    var details = getUserDetails();
    if (details && Array.isArray(details.groups) && details.groups.indexOf('admin') > -1){
        return true;
    }
    return false;
}

