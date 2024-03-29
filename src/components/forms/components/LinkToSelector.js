import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import url from 'url';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { itemUtil } from './../../util/object';
import { storeExists } from '../../util/misc';

/**
 * Global variable which holds reference to child window, if any.
 * Is re-used if one is open to prevent additional windows being created.
 */
let linkedObjChildWindow = null;

/**
 * Use to help select Items from a second/child window's SearchView.
 *
 * While `props.isSelecting` is true, this component will keep window event listeners active to
 * listen for ondrag/ondrop events as well as for 'message' events (e.g. from other window(s)).
 *
 * Upon receiving a drop or message of an Item, `props.onSelect` is called with the Item's @ID and
 * its context (if available) as parameters. `props.onSelect` is expected to handle setting `props.isSelecting`
 * to false and/or unmounting this component.
 *
 * Upon `props.isSelecting` becoming true (or component mounted with
 * that value), component will initialize/open a child window which will be
 * kept open until is closed or `props.isSelecting` becomes false (or this component becomes
 * unmounted).
 *
 * This component does not render any of its own JSX/HTML, but will render children if any are passed in.
 */
export class LinkToSelector extends React.PureComponent {

    static propTypes = {
        /** Whether component should be listening for Item to be selected */
        'isSelecting'       : PropTypes.bool.isRequired,
        /** Callback called when Items are received. Should accept array of {id:@ID, json:Item context (not guaranteed)} object and endDataPost (bool) as param */
        'onSelect': PropTypes.func.isRequired,
        /** Search URL to direct child window to */
        'searchURL'         : PropTypes.string.isRequired,
        /** Optional alert to show in child window upon initialization. Not guaranteed to appear in all browsers. */
        'childWindowAlert'  : PropTypes.shape({
            'title'             : PropTypes.string.isRequired,
            'message'           : PropTypes.any.isRequired,
            'style'             : PropTypes.string
        }),
        /** Optional callback called with no params when child window is closed. Could/should unset `props.isSelecting`. */
        'onCloseChildWindow': PropTypes.func, // When used with SV, will generally be the IndvObject.selectCancel method
        /** If true, then allows to drag & drop Item to window */
        'enableWindowDrop'  : PropTypes.bool.isRequired,
        /** Text content of message filling window when being dragged over */
        'dropMessage'       : PropTypes.string.isRequired
    };

    static defaultProps = {
        'isSelecting'       : false,
        'onSelect'          : function(selectedItems, endDataPost){
            console.log("Selected", selectedItems, endDataPost);
        },
        'onCloseChildWindow': function(){
            console.log("Closed child window");
        },
        'searchURL'         : '/search/?currentAction=selection&type=Item',
        'childWindowAlert'  : {
            'title' : "Selecting Item...",
            'message' : (
                <div>
                    <p className="mb-0">
                        Please either <b>drag and drop</b> an Item (row) from this window into the parent window or click its corresponding select (checkbox) button.
                    </p>
                    <p className="mb-0">You may also browse around and drag & drop a link into the parent window as well.</p>
                </div>
            ),
            'style' : "info"
        },
        'dropMessage'       : "Drop Item Here",
        'enableWindowDrop'  : true
    };

    constructor(props){
        super(props);
        this.showAlertInChildWindow         = this.showAlertInChildWindow.bind(this);
        this.setChildWindowMessageHandler   = this.setChildWindowMessageHandler.bind(this);
        this.handleChildWindowMessage       = this.handleChildWindowMessage.bind(this);
        this.receiveData                    = this.receiveData.bind(this);
    }

    componentDidMount(){
        this.manageChildWindow({ 'isSelecting' : false }, this.props);

        //clear storage
        if (storeExists()) {
            localStorage.removeItem("selected_items");
        }
    }

    componentDidUpdate(pastProps){
        if (pastProps.isSelecting !== this.props.isSelecting) {
            this.manageChildWindow(pastProps, this.props);
        }
    }

    componentWillUnmount(){
        this.manageChildWindow(this.props, { 'isSelecting' : false }, true);
    }

    manageChildWindow(pastProps, nextProps, willUnmount = false){

        if (!window) {
            console.error('No window object available. Fine if this appears in a test.');
            return;
        }

        const { searchURL, value, onCloseChildWindow } = this.props;
        const { isSelecting: pastInSelection } = pastProps;
        const { isSelecting: nowInSelection } = nextProps;
        const hasUnsetInSelection = pastInSelection && !nowInSelection;
        const hasSetInSelection = !pastInSelection && nowInSelection;

        if (hasSetInSelection){

            if (linkedObjChildWindow && !linkedObjChildWindow.closed && linkedObjChildWindow.fourfront && typeof linkedObjChildWindow.fourfront.navigate === 'function'){
                // We have access to the JS of our child window.
                // Call app.navigate(URL) directly instead of reloading entire HTML.
                // MAY NOT WORK FOR SOME BROWSERS --- if so, should be caught by if check
                this.windowObjectReference = linkedObjChildWindow;
                this.windowObjectReference.fourfront.navigate(searchURL, {}, this.showAlertInChildWindow);
                this.windowObjectReference.focus();
            } else {
                var windowFeaturesStr = "menubar=0,toolbar=1,location=0,resizable=1,scrollbars=1,status=1,navigation=1",
                    desktopScreenWidth  = window && window.screen && (window.screen.availWidth || window.screen.width), // Screen dimensions, not window dimensions.
                    desktopScreenHeight = window && window.screen && (window.screen.availHeight || window.screen.height),
                    childWindowHeight   = 600, // Defaults if can't get screen dimensions
                    childWindowWidth    = 1010;

                if (typeof desktopScreenWidth === 'number' && !isNaN(desktopScreenWidth)){
                    childWindowWidth = Math.max(Math.min(1200, desktopScreenWidth - 200), 800);
                    windowFeaturesStr += ',left=' + (desktopScreenWidth - childWindowWidth) / 2;
                }

                if (typeof desktopScreenHeight === 'number' && !isNaN(desktopScreenHeight)){
                    childWindowHeight = Math.max(Math.min(800, desktopScreenHeight - 200), 400);
                    windowFeaturesStr += ',top=' + (desktopScreenHeight - childWindowHeight) / 2;
                }

                windowFeaturesStr += ',width=' + childWindowWidth + ',height=' + childWindowHeight;

                this.windowObjectReference = linkedObjChildWindow = window.open("about:blank", "selection-search", windowFeaturesStr);
                setTimeout(()=>{
                    this.windowObjectReference && this.windowObjectReference.location.assign(searchURL);
                }, 100);
            }

            this.setChildWindowMessageHandler();

            this.childWindowClosedInterval = setInterval(()=>{
                // Check every 1s if our child window is still open.
                // If not, stop checking & cleanup event handlers.
                if (!this || !this.windowObjectReference || this.windowObjectReference.closed) {
                    clearInterval(this.childWindowClosedInterval);
                    delete this.childWindowClosedInterval;
                    if (this && this.windowObjectReference && this.windowObjectReference.closed){
                        if (typeof onCloseChildWindow === 'function'){
                            onCloseChildWindow(value);
                        }
                    }
                    this.cleanChildWindowEventHandlers();
                    this.windowObjectReference = linkedObjChildWindow = null;
                }
            }, 1000);

        } else if (hasUnsetInSelection){

            if (this.childWindowClosedInterval){
                clearInterval(this.childWindowClosedInterval);
                delete this.childWindowClosedInterval;
                if (willUnmount){
                    this.cleanChildWindow();
                } else {
                    this.cleanChildWindowEventHandlers();
                }
            }

        }

    }

    /**
     * This functioned is used as a listener/handler for messages received to this window.
     * Messages might be sent from child window directly to this parent window via e.g. `window.opener.postMessage(message, origin, ...)`
     *
     * @param {MessageEvent} evt - See https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent.
     */
    handleChildWindowMessage(evt){
        const { value, onCloseChildWindow } = this.props;
        const eventType = evt && evt.data && evt.data.eventType;

        if (!eventType) {
            // We require an 'eventType' to be present in cross-window messages to help ID what the message is.
            console.error("No eventType specified in message. Canceling.");
            return;
        }

        // Authenticate message origin to prevent XSS attacks.
        const eventOriginParts = url.parse(evt.origin);
        if (window.location.host !== eventOriginParts.host){
            console.error('Received message from unauthorized host. Canceling.');
            return;
        }
        if (window.location.protocol !== eventOriginParts.protocol){
            console.error('Received message from unauthorized protocol. Canceling.');
            return;
        }

        // The meat of this function/handler. This is what we listen to / expect.
        if (eventType === 'fourfrontselectionclick') {
            const items = (evt.data && evt.data.items) || (evt.detail && evt.detail.items) || null;
            if (items && Array.isArray(items) && (items.length > 0) && _.every(items, function (item) { return item.id && typeof item.id === 'string' && item.json; })) {
                return this.receiveData(items);
            }
            return null;
        }
        if (eventType === 'fourfrontcancelclick') {
            this.cleanChildWindow();
            onCloseChildWindow(value);
        }

        // If we have a `props.childWindowAlert`, show it once child window lets us know it has initialized it JS environment.
        if (eventType === 'fourfrontinitialized') {
            return this.showAlertInChildWindow();
        }
    }

    setChildWindowMessageHandler(){
        setTimeout(()=>{
            window && window.addEventListener('message', this.handleChildWindowMessage);
            console.log('Updated \'message\' event handler');
        }, 200);
    }

    cleanChildWindowEventHandlers(){
        window.removeEventListener('message', this.handleChildWindowMessage);
        if (!this || !this.windowObjectReference) {
            console.warn('Child window no longer available to unbind event handlers. Fine if closed.');
            return;
        }

        //clear storage
        if (storeExists()) {
            localStorage.removeItem("selected_items");
        }
    }

    cleanChildWindow(){
        if (this && this.windowObjectReference){
            if (!this.windowObjectReference.closed) this.windowObjectReference.close();
            this.cleanChildWindowEventHandlers();
            this.windowObjectReference = linkedObjChildWindow = null;
        }
    }

    /**
     *
     * @param {Array} items - array of {id:ID of selected Item, if any, json:JSON of selected Item, if present (NOT GUARANTEED TO BE PROVIDED)} object
     */
    receiveData(items) {
        this.cleanChildWindow();
        this.props.onSelect(items, true);
    }

    /**
     * THIS MAY NOT WORK FOR ALL BROWSERS
     */
    showAlertInChildWindow(){
        var childWindowAlert = this.props.childWindowAlert;
        if (!childWindowAlert) return;
        if (typeof childWindowAlert === 'function'){
            childWindowAlert = childWindowAlert(this.props);
        }
        var childAlerts = this.windowObjectReference && this.windowObjectReference.fourfront && this.windowObjectReference.fourfront.alerts;
        if (!childAlerts) return;
        childAlerts.queue(childWindowAlert);
    }

    render(){
        if (this.props.enableWindowDrop){
            return <WindowDropReceiver {...this.props} />;
        }
        return null;
    }

}




export class WindowDropReceiver extends React.PureComponent {

    static propTypes = {
        /** Whether component should be listening for Item to be selected */
        'isSelecting'       : PropTypes.bool.isRequired,
        /** Callback called when Item is received. Should accept @ID and Item context (not guaranteed) as params. */
        'onSelect'          : PropTypes.func.isRequired,
        /** Text content of message filling window when being dragged over */
        'dropMessage'       : PropTypes.string.isRequired
    };

    static defaultProps = {
        'isSelecting'       : false,
        'onSelect': function (items, endDataPost) {
            console.log("Selected", items, endDataPost);
        },
        'dropMessage'       : "Drop Item Here"
    };

    constructor(props){
        super(props);
        this.handleWindowDragOver       = this.handleWindowDragOver.bind(this);
        this.refreshWindowDropReceiver  = _.throttle(this.refreshWindowDropReceiver.bind(this), 300);
        this.closeWindowDropReceiver    = this.closeWindowDropReceiver.bind(this);
        this.handleDrop                 = this.handleDrop.bind(this);
        this.receiveData                = this.receiveData.bind(this);

        this.windowDropReceiverHideTimeout = null;
    }

    componentDidMount(){
        this.manageWindowOnDragHandler({ 'isSelecting' : false }, this.props);
    }

    componentDidUpdate(pastProps){
        if (pastProps.isSelecting !== this.props.isSelecting) {
            this.manageWindowOnDragHandler(pastProps, this.props);
        }
    }

    componentWillUnmount(){
        this.manageWindowOnDragHandler(this.props, { 'isSelecting' : false });
    }

    manageWindowOnDragHandler(pastProps, nextProps){

        if (!window) {
            console.error('No window object available. Fine if this appears in a test.');
            return;
        }

        var pastInSelection       = pastProps.isSelecting,
            nowInSelection        = nextProps.isSelecting,
            hasUnsetInSelection   = pastInSelection && !nowInSelection,
            hasSetInSelection     = !pastInSelection && nowInSelection;

        if (hasUnsetInSelection){
            window.removeEventListener('dragenter', this.handleWindowDragEnter);
            window.removeEventListener('dragover',  this.handleWindowDragOver);
            window.removeEventListener('drop',      this.handleDrop);
            this.closeWindowDropReceiver();
            console.log('Removed window event handlers for WindowDropReceiver');
        } else if (hasSetInSelection){
            var _this = this;
            setTimeout(function(){
                if (!_this || !_this.props.isSelecting) return false;
                //if (!_this || !_this.isInSelectionField(_this.props)) return false;
                window.addEventListener('dragenter', _this.handleWindowDragEnter);
                window.addEventListener('dragover',  _this.handleWindowDragOver);
                window.addEventListener('drop',      _this.handleDrop);
                console.log('Added window event handlers for WindowDropReceiver');
            }, 250);
        } else {
            // No action occurred
        }
    }

    /**
     * Handles drop event for the (temporarily-existing-while-dragging-over) window drop receiver element.
     * Grabs @ID of Item from evt.dataTransfer, attempting to grab from 'text/4dn-item-id', 'text/4dn-item-json', or 'text/plain'.
     *
     * @see Notes and inline comments for handleChildFourFrontSelectionClick re isValidAtId.
     * @param {DragEvent} Drag event.
     */
    handleDrop(evt){
        evt.preventDefault();
        evt.stopPropagation();
        const draggedContext  = evt.dataTransfer && evt.dataTransfer.getData('text/4dn-item-json');
        const draggedURI      = evt.dataTransfer && evt.dataTransfer.getData('text/plain');
        const draggedID       = evt.dataTransfer && evt.dataTransfer.getData('text/4dn-item-id');
        const atId            = draggedID || (draggedContext & itemUtil.atId(draggedContext)) || url.parse(draggedURI).pathname || null;

        this.receiveData(atId, draggedContext);
    }

    handleWindowDragEnter(evt){
        evt.preventDefault();
        evt.stopPropagation();
    }

    handleWindowDragOver(evt){
        evt.preventDefault();
        evt.stopPropagation();
        this.refreshWindowDropReceiver(evt);
    }

    closeWindowDropReceiver(evt){
        var elem = this.windowDropReceiverElement;
        if (!elem) return;
        elem.style.opacity = 0;
        setTimeout(()=>{
            document.body.removeChild(elem);
            this.windowDropReceiverElement = null;
            this.windowDropReceiverHideTimeout = null;
        }, 250);
    }

    refreshWindowDropReceiver(evt){
        if (!document || !document.createElement) return;

        if (this.windowDropReceiverHideTimeout !== null) {
            clearTimeout(this.windowDropReceiverHideTimeout);
            this.windowDropReceiverHideTimeout = setTimeout(this.closeWindowDropReceiver, 500);
            return;
        }

        var { dropMessage } = this.props,
            element     = document.createElement('div');

        element.className = "full-window-drop-receiver";

        var innerText       = dropMessage, //"Drop " + (itemType || "Item") + " for field '" + (prettyTitle || nestedField) +  "'",
            innerBoldElem   = document.createElement('h2');

        innerBoldElem.appendChild(document.createTextNode(innerText));
        element.appendChild(innerBoldElem);
        element.appendChild(document.createElement('br'));
        document.body.appendChild(element);
        this.windowDropReceiverElement = element;

        setTimeout(()=>{
            this.windowDropReceiverElement.style.opacity = 1;
        }, 10);

        this.windowDropReceiverHideTimeout = setTimeout(this.closeWindowDropReceiver, 500);
    }

    receiveData(itemAtID, itemContext){
        if (typeof itemContext === 'string' && itemContext){
            try {
                itemContext = JSON.parse(itemContext);
            } catch (e) {
                console.warn("Could not parse itemContext into JS data.");
                console.error(e);
            }
        }
        this.props.onSelect([{ 'id': itemAtID, 'json': itemContext }], false);
    }

    render(){
        return null;
    }

}



