'use strict';

import _ from 'underscore';
import url from 'url';
import queryString from 'query-string';
import { isServerSide } from './misc';
import { patchedConsoleInstance as console } from './patched-console';
import { contextFiltersToExpSetFilters, expSetFiltersToJSON } from './search-filters';
import * as object from './object';
import * as JWT from './json-web-token';



const defaultOptions = {
    "enabled"                 : true,
    "isAnalyticsScriptOnPage" : true,
    "enhancedEcommercePlugin" : true,
    "itemToProductTransform"  : function(item){
        // 4DN-specific, override from own data model.
        const {
            "@id": itemID,
            uuid: itemUUID, // Deprecated, should always get @id now.
            "@type" : itemType,
            display_title, title,
            // Not always present, esp. if not signed in.
            lab: { display_title: ownLabTitle } = {},
            // Only for files (we dont increment file_size unless part of download)
            file_type_detailed = null,
            track_and_facet_info: { experiment_type: tfi_expType } = {},
            // For exps or expsets, try to grab experiment_type
            experiment_type: { display_title: exp_expType } = {},
            experiments_in_set: [ { experiment_type: { display_title: set_expType } = {} } = {} ] = [{}],
            from_experiment = null,
            from_experiment_set = null
        } = item;
        const labTitle = ownLabTitle || (
            from_experiment && from_experiment.from_experiment_set && from_experiment.from_experiment_set.lab &&
            from_experiment.from_experiment_set.lab.display_title
        ) || (
            from_experiment_set && from_experiment_set.lab && from_experiment_set.lab.display_title
        ) || null;
        const prodItem = {
            'id'            : itemID || itemUUID,
            'name'          : display_title || title || null,
            'category'      : Array.isArray(itemType) ? itemType.slice().reverse().slice(1).join('/') : "Unknown",
            'brand'         : labTitle,
            ["dimension" + state.dimensionNameMap.name] : display_title || title || null
        };
        if (typeof file_type_detailed === "string"){ // We set file format as "variant"
            const [ , fileTypeMatch, fileFormatMatch ] = file_type_detailed.match(/(.*?)\s(\(.*?\))/);
            if (fileFormatMatch){
                prodItem.variant = fileTypeMatch;
            }
        }
        if (tfi_expType) {
            prodItem["dimension" + state.dimensionNameMap.experimentType] = tfi_expType;
        } else if (from_experiment && from_experiment.experiment_type && from_experiment.experiment_type.display_title){
            prodItem["dimension" + state.dimensionNameMap.experimentType] = from_experiment.experiment_type.display_title;
        } else if (exp_expType || set_expType){
            prodItem["dimension" + state.dimensionNameMap.experimentType] = exp_expType || set_expType;
        }
        return prodItem;
    },
    // Google Analytics allows custom dimensions to be sent along w/ events, however they are named incrementally w/o customization.
    // Here we track own keywords/keys and transform to Google-Analytics incremented keys.
    "dimensionNameMap" : {
        "currentFilters"    : 1,
        "name"              : 2,
        "field"             : 3,
        "term"              : 4,
        "experimentType"    : 5,
        "userGroups"        : 6
    },
    "metricNameMap" : {
        "filesize"          : 1,
        "downloads"         : 2
    },
    "anonymizeTypes"     : ["User"],
    "excludeAdminTrackingOnHostnames" : ["data.4dnucleome.org"],
    "reduxStore" : null
};

let state = null;

/** Calls `ga`, ensuring it is present on window. */
function ga2(){
    try {
        return window.ga.apply(window.ga, Array.from(arguments));
    } catch (e) {
        console.error('Could not track event. Fine if this is a test.', e, Array.from(arguments));
    }
}


/**
 * Initialize Google Analytics tracking. Call this from app.js on initial mount perhaps.
 *
 * @export
 * @param {string} [trackingID] - Google Analytics ID.
 * @param {Object} [context] - Current page content / JSON, to get details about Item, etc.
 * @param {Object} [options] - Extra options.
 * @returns {boolean} true if initialized.
 */
export function initializeGoogleAnalytics(trackingID = null, appOptions = {}){

    if (trackingID === null || typeof trackingID !== 'string'){
        throw new Error("No tracking ID provided");
    }

    if (isServerSide()) return false;

    const {
        initialContext = null,
        initialHref = null,
        ...appOpts
    } = appOptions;
    const options = { ...defaultOptions, ...appOpts };

    // TODO: Check for user-scoped 'do not track' flag, set state.enabled=false
    const {
        uuid: userUUID,
        groups: userGroups = []
    } = JWT.getUserDetails() || {};

    if (!options.isAnalyticsScriptOnPage){
        // If true, we already have <script src="...analytics.js">, e.g. in app.js so should skip this.
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    }

    state = _.clone(options);

    // TODO check localStorage for device-scoped 'do not track' flag, set state.enabled=false

    if (!shouldTrack()){
        console.error("EXITING ANALYTICS INITIALIZATION.");
        return false;
    }

    ga2('create', trackingID, 'auto');
    ga2(function(tracker){
        const clientID = tracker.get('clientId');
        console.log("Got client id", clientID);
        if (clientID){
            // Used on backend to associate downloads with user sessions when possible.
            // (previous cookies are *not* overwritten)
            document.cookie = "clientIdentifier=" + clientID + "; path=/";
            console.info("GA: Loaded Tracker & Updated Client ID Cookie");
        }
    });

    if (options.enhancedEcommercePlugin){
        ga2('require', 'ec');
        console.info("GA: Enhanced ECommerce Plugin");
    }

    if (userUUID) {
        setUserID(userUUID);
        event('Authentication', 'ExistingSessionLogin', {
            userUUID,
            name: userUUID,
            userGroups: userGroups && JSON.stringify(userGroups.slice().sort()),
            eventLabel: 'Authenticated ServerSide'
        });
    }

    console.info("GA: Initialized");

    if (initialContext){
        registerPageView(initialHref, initialContext);
    }

    return true;
}


var lastRegisteredPageViewRealPathNameAndSearch = null;

/**
 * Register a pageview.
 * Used in app.js in App.componentDidUpdate(pastProps, ...).
 *
 * @export
 * @param {string} [href=null] - Page href, defaults to window.location.href.
 * @param {Object} [context={}] - The context prop; JSON representation of page.
 * @returns {boolean} True if success.
 */
export function registerPageView(href = null, context = null){

    if (!shouldTrack()) return false;

    // Take heed of this notice if it is visible somewhere.
    if (!href) {
        href = window.location && window.location.href;
        console.error("No HREF provided, check.. something. Will still send pageview event to window href", href);
    }

    context = context || (state.reduxStore && state.reduxStore.getState().context) || null;

    // Options to send with GA pageview event.
    const parts = url.parse(href, true);
    const pageViewObject = { ...eventObjectFromCtx(context), hitType : 'pageview' };
    const origHref = href; // Store orig href in case we need it later

    const {
        accession: ctxAccession = null,
        '@type': itemType = [], // Should be present on all context responses.
        uuid: ctxUUID,
        '@graph' : searchResponseResults = null,
        filters: searchResponseFilters = null,
        code = null
    } = context || {};

    // Should be present on all Item responses - except Errors (HTTPForbidden, etc.).
    // Errors would have 'title' such as 'Forbidden'. Or maybe 'Browse'.

    /**
     * Convert pathname with a 'UUID', 'Accession', or 'name' to having a
     * literal "uuid", "accession", or "name" and track the display_title, title, or accession as a
     * separate GA dimension.
     *
     * @private
     * @param {string} pathName - Path part of href being navigated to. Use url.parse to get.
     * @return {string} Adjusted pathName.
     */
    function adjustPageViewPath(pathName){
        const pathParts = pathName.split('/').filter(function(pathPart){ // Gen path array to adjust href further if needed.
            return pathPart.length > 0;
        });
        const [ possibleItemTypePathPart, possibleItemUniqueKeyPathPath ] = pathParts;
        let newPathName = null;

        if (possibleItemUniqueKeyPathPath && typeof possibleItemUniqueKeyPathPath === 'string'){
            // Remove Accession, UUID, and Name from URL and save it to Item name dimension instead.
            if (
                (typeof ctxAccession === 'string' && possibleItemUniqueKeyPathPath === ctxAccession)
                || object.isAccessionRegex(possibleItemUniqueKeyPathPath)
            ){
                // We gots an accessionable Item. Lets remove its Accession from the path to get nicer Behavior Flows in GA.
                // And let product tracking / Shopping Behavior handle Item details.
                pathParts[1] = 'accession';
                newPathName = '/' + pathParts.join('/') + '/';
            } else if (
                (typeof ctxUUID === 'string' && possibleItemUniqueKeyPathPath === ctxUUID)
                || object.isUUID(possibleItemUniqueKeyPathPath)
            ){
                pathParts[1] = 'uuid';
                newPathName = '/' + pathParts.join('/') + '/';
            } else if (typeof context.name === 'string' && possibleItemUniqueKeyPathPath === context.name){
                // Most likely case for Lab, Project, etc.
                pathParts[1] = 'name';
                newPathName = '/' + pathParts.join('/') + '/';
            } else {
                newPathName = pathName;
            }
        } else {
            newPathName = pathName;
        }

        // Add 'q' and 'type' params back to pathname; they'll be parsed and filtered out by Google Analytics to be used for 'search query' and 'search category' analytics.
        // Other URL params are extracted out and supplied via "current filters" / "dimension1" as JSON.
        if (parts.query && (parts.query.q || parts.query.type)) {
            const qs = queryString.stringify({ 'q' : parts.query.q, 'type' : parts.query.type });
            newPathName = pathName + (qs ? '?' + qs : '');
        }

        return newPathName;
    }

    /**
     * Check for Items (aka Products) - either a results graph on /browse/, /search/, or collections pages, or an Item page.
     * If any are present, impression list views or detail view accordingly.
     *
     * @private
     * @returns {boolean|Object|Object[]} Representation of what was tracked, or false if nothing was.
     */
    function registerProductView(){

        if (!shouldTrack()) return false;

        if (state.enhancedEcommercePlugin !== true){
            console.warn("Enhanced ECommerce is not enabled. Will -not- register product views.");
            return false;
        }

        if (Array.isArray(searchResponseResults)){ // We have a results page of some kind. Likely, browse, search, or collection.

            // If browse or search page, get current filters and add to pageview event for 'dimension1'.
            if (searchResponseFilters && state.dimensionNameMap.currentFilters) {
                pageViewObject["dimension" + state.dimensionNameMap.currentFilters] = getStringifiedCurrentFilters(searchResponseFilters);
            }

            if (searchResponseResults.length > 0){
                // We have some results, lets impression them as product list views.
                return impressionListOfItems(searchResponseResults, parts, null, context);
            }

            return false;
        } else if (itemType.indexOf("Item") > -1){

            // We got an Item view, lets track some details about it.
            const productObj = itemToProductTransform(context);
            console.info("Item Page View (probably). Will track as product:", productObj);

            ga2('ec:addProduct', productObj);
            ga2('ec:setAction', 'detail', productObj);
            return productObj;
        }
    }

    // Clear query & hostname from HREF & convert accessions, uuids, and certain names to literals.
    const adjustedPathName = adjustPageViewPath(parts.pathname);

    // Ensure is not the same page but with a new hash or something (RARE - should only happen for Help page table of contents navigation).
    if (lastRegisteredPageViewRealPathNameAndSearch === (parts.pathname + parts.search)){
        console.warn('Page did not change, canceling PageView tracking for this navigation.');
        return false;
    }

    lastRegisteredPageViewRealPathNameAndSearch = parts.pathname + parts.search;
    ga2('set', 'page', adjustedPathName); // Set it as current page
    if (shouldAnonymize(itemType)){ // Override page title
        pageViewObject.title = ctxAccession || ctxUUID || "[Anonymized Title]";
    }
    pageViewObject.page = adjustedPathName; // Don't need to do re: 'set' 'page', but redundant for safety.
    pageViewObject.location = url.resolve(href, adjustedPathName);
    pageViewObject.hitCallback = function(){
        console.info('Successfuly sent pageview event.', adjustedPathName, pageViewObject);
    };
    registerProductView();

    ga2('send', 'pageview', pageViewObject);

    if (code === 403) {
        // HTTPForbidden Access Denied - save original URL
        event("Navigation", "HTTPForbidden", { eventLabel: parts.pathname });
    }

    return true;
}

export function eventObjectFromCtx(context){
    if (!context) return {};
    const {
        '@type' : ctxTypes = [],
        filters = null,
        display_title, title, accession,
        uuid, name,
    } = context || {};
    // `display_title` should be present on all Item responses - except Errors (HTTPForbidden, etc.).
    // Errors would have 'title' such as 'Forbidden'. Or maybe 'Browse'.
    const eventObj = { name: display_title || title || accession || name || uuid || "UNKNOWN NAME" };
    if (shouldAnonymize(ctxTypes)){
        eventObj.name = accession || uuid || "[Anonymized Title]";
    }
    if (filters) { // If search response context, add these.
        eventObj.currentFilters = getStringifiedCurrentFilters(filters);
    }
    return eventObj;
}

/**
 * Primarily for UI interaction events.
 *
 * Rough Guidelines:
 * - For category, try to use name of React Component by which are grouping events by.
 * - For action, try to standardize name to existing ones (search through files for instances of `analytics.event(`).
 *   - For example, "Set Filter", "Unset Filter" for UI interactions which change one or more filters (even if multiple, use '.. Filter')
 * - For fields.eventLabel, try to standardize similarly to action.
 * - For fields.eventValue - do whatever makes sense I guess. Perhaps time vector from previous interaction.
 *
 * @see eventLabelFromChartNode()
 *
 * @param {string} category - Event Category
 * @param {string} action - Event Action
 * @param {Object} fields - Additional fields.
 * @param {string} fields.eventLabel - Event Label, e.g. 'play'.
 * @param {number} [fields.eventValue] - Event Value, must be an integer.
 * @param {Object} [fields.currentFilters] - Current filters set in portal, if on a search page.
 * @param {string} [fields.name] - Name of Item we're on, if any.
 * @param {string} [fields.field] - Name of field being acted on, if any.
 * @param {string} [fields.term] - Name of term being acted on or changed, if any.
 */
export function event(category, action, fields = {}, useTimeout = true){
    if (!shouldTrack()) return false;

    const eventObj = _.extend({}, fields, {
        'hitType'       : 'event',
        'eventCategory' : category,
        'eventAction'   : action
    });

    // Convert internal dimension names to Google Analytics ones.
    _.pairs(eventObj).forEach(function([key, value]){
        if (typeof state.dimensionNameMap[key] !== 'undefined'){
            eventObj["dimension" + state.dimensionNameMap[key]] = value;
            delete eventObj[key];
        } else if (typeof state.metricNameMap[key] !== 'undefined'){
            eventObj["metric" + state.metricNameMap[key]] = value;
            delete eventObj[key];
        }
    });

    eventObj.hitCallback = function(){
        console.info('Successfuly sent UI event.', eventObj);
    };

    if (useTimeout){
        setTimeout(function(){
            ga2('send', eventObj);
        }, 0);
    } else {
        ga2('send', eventObj);
    }
}

export function setUserID(userUUID){
    if (!shouldTrack()) {
        return false;
    }
    ga2('set', 'userId', userUUID);
    console.info("Set analytics user id to", userUUID);
    return true;
}


export function productClick(item, extraData = {}, callback = null, context = null){
    if (!shouldTrack()) {
        if (typeof callback === 'function') callback();
        return true;
    }
    context = context || (state.reduxStore && state.reduxStore.getState().context) || null;
    const pObj = _.extend(itemToProductTransform(item), extraData);
    const href = extraData.href || window.location.href;
    const evtFromCtx = eventObjectFromCtx(context);
    const eventObj = {
        ...evtFromCtx,
        'hitType' : 'event',
        'eventCategory' : evtFromCtx.currentFilters ? 'Search Result Link' : 'Product List Link',
        'eventAction' : 'click',
        'eventLabel' : pObj.id || pObj.name,
        'hitCallback' : function(){
            console.info('Successfully sent product click event.', eventObj, pObj);
            if (typeof callback === 'function'){
                callback();
            }
        }
    };

    if (!pObj.list) {
        pObj.list = hrefToListName(href);
    }

    ga2('ec:addProduct', pObj);
    ga2('ec:setAction', 'click',  _.pick(pObj, 'list'));

    // Convert internal dimension names to Google Analytics ones.
    _.forEach(_.pairs(eventObj), function([key, value]){
        if (typeof state.dimensionNameMap[key] !== 'undefined'){
            eventObj["dimension" + state.dimensionNameMap[key]] = value;
            delete eventObj[key];
        } else if (typeof state.metricNameMap[key] !== 'undefined'){
            eventObj["metric" + state.metricNameMap[key]] = value;
            delete eventObj[key];
        }
    });

    ga2('send', eventObj);
    return true;
}

/**
 * Can be used needed. E.g. in 4DN is used for metadata.tsv download.
 * Does _NOT_ also send a GA event. This must be done outside of func.
 */
export function productsAddToCart(items, extraData = {}){
    if (!shouldTrack(items)) return false;
    const count = addProductsEE(items, extraData);
    console.info(`Adding ${count} items to cart.`);
    ga2('ec:setAction', 'add');
}

export function productsRemoveFromCart(items, extraData = {}){
    if (!shouldTrack(items)) return false;
    const count = addProductsEE(items, extraData);
    ga2('ec:setAction', 'remove');
    console.info(`Removing ${count} items from cart.`);
}

/**
 * Can be used needed. E.g. in 4DN is used for metadata.tsv download.
 * Does _NOT_ also send a GA event. This must be done outside of func.
 */
export function productsCheckout(items, extraData = {}){
    if (!shouldTrack(items)) return false;
    const { step = 1, option = null, ...extData } = extraData || {};
    const count = addProductsEE(items, extData);
    ga2('ec:setAction', 'checkout', { step, option });
    console.info(`Checked out ${count} items.`);
}

export function productAddDetailViewed(item, context = null, extraData = {}){
    if (!shouldTrack()) return false;
    const productObj = _.extend(itemToProductTransform(item), extraData);
    console.info("Item Details Viewed. Will track as product:", productObj);
    if (context && context.filters && state.dimensionNameMap.currentFilters){
        productObj["dimension" + state.dimensionNameMap.currentFilters] = getStringifiedCurrentFilters(context.filters);
    }
    ga2('ec:addProduct', productObj);
    ga2('ec:setAction', 'detail', productObj);
}


/**
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
 */
export function exception(message, fatal = false){
    // Doesn't test whether should track or not -- assume always track errors.
    const excObj = {
        'hitType'       : 'exception',
        'exDescription' : message,
        'exFatal'       : fatal
    };
    excObj.hitCallback = function(){
        console.info('Successfully sent exception', excObj);
    };
    ga2('send', excObj);
    return true;
}


/**
 * Given a 'node' object with a field, term, and potential parent node, generate a descriptive string to use as event label.
 *
 * @param {{ field : string, term : string }} node - Node object with at least 'field' and 'term'.
 * @param {boolean} [includeParentInfo=true] - Whether to add text for Parent Field and Parent Term (if any).
 * @returns {string} Label for analytics event.
 */
export function eventLabelFromChartNode(node, includeParentInfo = true){
    if (!node || typeof node !== 'object') return null;
    var labelData = [];
    if (node.field)     labelData.push('Field: ' + node.field);
    if (node.term)      labelData.push('Term: ' + node.term);
    if (includeParentInfo && node.parent && node.parent.field)   labelData.push('Parent Field: ' + node.parent.field);
    if (includeParentInfo && node.parent && node.parent.term)    labelData.push('Parent Term: ' + node.parent.term);
    return labelData.join(', ');
}


export function eventLabelFromChartNodes(nodes){
    return nodes.map(eventLabelFromChartNode).join('; ');
}


/**
 * Converts expSetFilters object or href with query (as string) to stringified JSON representation.
 *
 * @param {Object} expSetFilters - expSetFilters object.
 * @returns {string} Stringified JSON to be saved to analytics.
 */
export function getStringifiedCurrentFilters(contextFilters){
    if (!contextFilters) return null;
    // Deprecated naming and data structure; we can refactor to get rid of notion of expset filters.
    const expSetFilters = contextFiltersToExpSetFilters(contextFilters);
    return JSON.stringify( expSetFiltersToJSON(expSetFilters), _.keys(expSetFilters).sort() );
}


export function getGoogleAnalyticsTrackingData(key = null){
    var allData = null;
    try {
        allData = window.ga.getAll()[0].b.data.values;
    } catch (e){
        console.error('Could not get data from current GA tracker.');
        return null;
    }
    if (allData !== null && key === null) return allData;
    if (typeof key === 'string' && typeof allData === 'object' && allData){
        try {
            return allData[':' + key];
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}

/**
 * Generates a list name for analytics "list" property based on href pathname.
 */
export function hrefToListName(href){
    const hrefParts = url.parse(href, false);
    let strippedPathName = hrefParts.pathname;
    if (strippedPathName.charAt(0) === "/"){
        strippedPathName = strippedPathName.slice(1);
    }
    if (strippedPathName.charAt(strippedPathName.length - 1) === "/"){
        strippedPathName = strippedPathName.slice(0, -1);
    }
    if (hrefParts.search && (
        hrefParts.search.indexOf('currentAction=selection') > -1 ||
        hrefParts.search.indexOf('currentAction=multiselect') >-1)
    ){
        strippedPathName += " - Selection Action";
    }
    return strippedPathName;
}


/*********************
 * Private Functions *
 *********************/

function shouldTrack(itemList){

    // 1. Ensure we're initialized

    if (!state) {
        console.error("Google Analytics is not initialized. Fine if this appears in a test.");
        return false;
    }

    if (!state.enabled) {
        console.warn("Google Analytics is not enabled. Fine if expected, else check config.");
        return false;
    }

    if (isServerSide()){
        console.warn("Google Analytics will not be sent events while serverside. Fine if this appears in a test.");
        return false;
    }

    if (typeof window.ga === 'undefined') {
        console.error("Google Analytics library is not loaded/available. Fine if disabled via AdBlocker, else check `analytics.js` loading.");
        return false;
    }

    if (itemList && Array.isArray(itemList) && itemList.length > 50) {
        console.info(`Google Analytics do not respond well when items count exceeds 50. Tracking is disabled since list has ${itemList.length} items.`);
        return false;
    }

    // 2. TODO: Check if User wants to be excluded from tracking


    // 2. TODO: Make sure not logged in as admin on a production site.
    // if (JWT.getUserGroups().indexOf('admin') > -1){
    //     const urlParts = url.parse(window.location.href);
    //     if (
    //         Array.isArray(state.excludeAdminTrackingOnHostnames) &&
    //         state.excludeAdminTrackingOnHostnames.indexOf(urlParts.host) > -1
    //     ){
    //         console.warn(`Logged in as admin on ${urlParts.host} - will NOT track.`);
    //         return false;
    //     } else {
    //         console.info(`Logged in as admin but ${urlParts.host} is not an excluded hostname - WILL track (for testing).`); // Too verbose ?
    //     }
    // }

    return true;
}

function shouldAnonymize(itemTypes){
    const anonymizeMap = {};
    state.anonymizeTypes.forEach(function(anonType){
        anonymizeMap[anonType] = true;
    });
    let i = (itemTypes || []).length;
    for (i = itemTypes.length; i > -1; i--){
        if (anonymizeMap[itemTypes[i]]){
            return true;
        }
    }
    return false;
}

function itemToProductTransform(item){
    const { '@type' : itemTypes = [], accession, uuid } = item;
    const prodItem = state.itemToProductTransform(item);
    if (shouldAnonymize(itemTypes)){
        prodItem.name = accession || uuid || "[Anonymized Title]";
    }
    return prodItem;
}

function addProductsEE(items, extData = {}){
    if (items && !Array.isArray(items)){
        items = [items];
    }
    let count = 0;
    const seen = {}; // Prevent duplicates
    items.forEach(function(item){
        const {
            display_title,
            '@id' : id,
            '@type' : itemType,
            error
        } = item;
        if (!id || !display_title || !Array.isArray(itemType)) {
            if (error) {
                // Likely no view permissions, ok.
                return false;
            }
            const errMsg = "Analytics Product Tracking: Could not access necessary product/item fields";
            exception(errMsg);
            console.error(errMsg, item);
            return false;
        }
        if (seen[id]){
            return;
        }
        seen[id] = true;
        const pObj = _.extend(itemToProductTransform(item), extData);
        if (typeof pObj.id !== "string") {
            console.error("No product id available, cannot track", pObj);
            return;
        }
        ga2('ec:addProduct', { ...pObj, quantity: 1 });
        count++;
    });
    return count;
}

/**
 * Exported, but use with care. There must be an event or pageview sent immediately afterwards.
 *
 * @returns {Object[]} Representation of what was sent.
 */
export function impressionListOfItems(itemList, href = null, listName = null, context = null){
    if (!shouldTrack(itemList)) return false;
    context = context || (state && state.reduxStore && state.reduxStore.getState().context) || null;
    var from = 0;
    if (typeof href === 'string'){ // Convert to URL parts.
        href = url.parse(href, true);
        if (!isNaN(parseInt(href.query.from))) from = parseInt(href.query.from);
    }

    href = href || window.location.href;

    const commonProductObj = { "list" : listName || (href && hrefToListName(href)) };

    if (context && context.filters && state.dimensionNameMap.currentFilters) {
        commonProductObj["dimension" + state.dimensionNameMap.currentFilters] = getStringifiedCurrentFilters(context.filters);
    }

    const resultsImpressioned = itemList.filter(function(item){
        // Ensure we have permissions, can get product SKU, etc.
        const { display_title, '@id': id, error = null, '@type' : itemType } = item;
        if (!id || !display_title || !Array.isArray(itemType)) {
            if (error) {
                // Likely no view permissions, ok.
                return false;
            }
            const errMsg = "Analytics Product Tracking: Could not access necessary product/item fields";
            exception(errMsg);
            console.error(errMsg, item);
            return false;
        }
        return true;
    }).map(function(item, i){
        const pObj = _.extend(itemToProductTransform(item), commonProductObj, { 'position' : from + i + 1 });
        ga2('ec:addImpression', pObj);
        return pObj;
    });

    console.info(`Impressioned ${resultsImpressioned.length} items starting at position ${from + 1} in list "${commonProductObj.list}"`);
    return resultsImpressioned;
}
