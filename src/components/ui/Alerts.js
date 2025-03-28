import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Fade from 'react-bootstrap/esm/Fade';
import { AlertObj } from './../util/typedefs';


const defaultNavigateDisappearThreshold = 1;

const alertNavigatationCountMap = {};


let store = null;
let reduxIsLegacy = true;

/**
 * A Component and utility (via Component's 'statics' property & functions) to
 * queue and dequeue alerts from appearing at top of pages. Alerts, once queued, will persist until they are closed by
 * the end user, which is the same functionality as calling Alerts.deQueue(alert) from anywhere in application, supplying the same
 * title for alert that was queued.
 */
export class Alerts extends React.Component {

    /**
     * This must be called with the current Redux store for the app before Alerts can be used.
     * @param {*} useStore
     * @param {*} isLegacy pass false to use new redux v5 dispatcher call ({ type: 'STRING', payload: ... })
     */
    static setStore(useStore, isLegacy){
        store = useStore;
        if (typeof isLegacy === 'boolean') {
            reduxIsLegacy = isLegacy;
        }
    }

    /**
     * Open an alert box.
     * More specifically, saves a new alert to Redux store 'alerts' field.
     *
     * @public
     * @param {AlertObj} alert              Object used to represent alert message element contents at top of page.
     * @param {function} [callback]         Optional function to be ran after queuing.
     * @param {AlertObj[]} [currentAlerts]  Current alerts, if any. Pass in for performance, else will retrieve them from Redux.
     * @returns {void} Nothing
     */
    static queue(alert, callback, currentAlerts = null){
        if (!store){
            console.error("no store available. canceling.");
            return;
        }
        if (!Array.isArray(currentAlerts)){
            currentAlerts = store.getState().alerts;
        }
        const duplicateTitleAlertIdx = _.findIndex(currentAlerts, { 'title' : alert.title });
        const newAlerts = currentAlerts.slice(0);

        if (typeof duplicateTitleAlertIdx === 'number' && duplicateTitleAlertIdx > -1){
            // Same alert already set, lets update it instead of adding new one.
            newAlerts.splice(duplicateTitleAlertIdx, 1, alert);
        } else {
            newAlerts.push(alert);
        }
        if (reduxIsLegacy) {
            store.dispatch({ type: { 'alerts': newAlerts } });
        } else {
            store.dispatch({ type: 'SET_ALERTS', payload: newAlerts });
        }
    }

    /**
     * Close an alert box.
     *
     * @todo Allow `alert` param to be an array to deque multiple alerts at once.
     *
     * @public
     * @param {AlertObj|AlertObj[]} alert - Object or list of objects with at least 'title'.
     * @param {AlertObj[]} [currentAlerts] - Current alerts, if any. Pass in for performance, else will retrieve them from Redux.
     * @returns {void} Nothing
     */
    static deQueue(alert, currentAlerts = null){
        if (!store){
            console.error("no store available. canceling.");
            return;
        }

        if (!Array.isArray(currentAlerts)) currentAlerts = store.getState().alerts;

        const alertsToRemove = Array.isArray(alert) ? alert : [ alert ];
        const nextAlerts = currentAlerts.slice(0);

        alertsToRemove.forEach(function(alertToRemove){
            const idxToDelete = nextAlerts.findIndex(function(a){
                return (a === alertToRemove || a.title === alertToRemove.title);
            });
            if (idxToDelete > -1) {
                nextAlerts.splice(idxToDelete, 1);
            }
        });

        if (nextAlerts.length < currentAlerts.length) {
            if (reduxIsLegacy) {
                store.dispatch({ type: { 'alerts': nextAlerts } });
            } else {
                store.dispatch({ type: 'SET_ALERTS', payload: nextAlerts });
            }
        }
    }

    /**
     * This is called after each navigation within the portal.
     * It increments counter per each alert title, and if counter exceeds
     * limit of any `alert.navigateDisappearThreshold`, the alerts is dequeued.
     *
     * @static
     * @param {AlertObj[]} [currentAlerts=null] Current alerts, if any. Pass in for performance, else will retrieve them from Redux.
     * @returns {undefined} Nothing
     */
    static updateCurrentAlertsTitleMap(currentAlerts = null){
        if (!Array.isArray(currentAlerts)) currentAlerts = store.getState().alerts;
        var titles = _.pluck(currentAlerts, 'title').sort();
        var removedTitles = _.difference(_.keys(alertNavigatationCountMap).sort(), titles);
        removedTitles.forEach(function(rt){
            delete alertNavigatationCountMap[rt];
        });
        currentAlerts.forEach(function(a){
            if (typeof alertNavigatationCountMap[a.title] === 'undefined'){
                alertNavigatationCountMap[a.title] = [ 1, a.navigateDisappearThreshold || defaultNavigateDisappearThreshold ];
            } else {
                alertNavigatationCountMap[a.title][0]++;
            }
            if (alertNavigatationCountMap[a.title][0] >= alertNavigatationCountMap[a.title][1]){
                Alerts.deQueue(a, currentAlerts);
            }
        });
    }

    static defaultProps = {
        "className" : "alerts mt-2"
    };

    /** @ignore */
    constructor(props){
        super(props);
        this.setDismissing = this.setDismissing.bind(this);

        /**
         * State object for component.
         *
         * @type {Object}
         * @private
         * @property {AlertObj[]} state.dismissing - List of alerts currently being faded out.
         */
        this.state = {
            'dismissing' : []
        };
    }

    /**
     * Called when 'fade out' of an alert is initialized.
     * @private
     */
    setDismissing(dismissing){
        this.setState({ dismissing });
    }

    /**
     * Renders out Bootstrap Alerts for any queued alerts.
     *
     * @private
     * @returns {JSX.Element} A `<div>` element containing AlertItems as children.
     */
    render(){
        const { alerts, children, ...passProps } = this.props;
        const { dismissing } = this.state;
        if (alerts.length === 0) return null;
        return (
            <div { ...passProps }>
                { _.map(alerts, (alert, index, alerts) =>
                    <AlertItem {...{ alert, index, alerts }} setDismissing={this.setDismissing} dismissing={dismissing} key={index} />
                )}
            </div>
        );
    }
}
Alerts.propTypes = {
    /**
     * List of Alert objects currently being displayed. Should be passed down from Redux store from App.
     *
     * @type {AlertObj[]}
     */
    'alerts' : PropTypes.arrayOf(PropTypes.shape({
        'title' : PropTypes.string.isRequired,
        'message' : PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]).isRequired,
        'style' : PropTypes.oneOf(["warning", "danger", "success", "info", "primary", "secondary", "light", "dark"]),
        'navigationDissappearThreshold' : PropTypes.number
    }))
};



/**
 * Reusable Alert Definitions
 */

export const LoggedOut = Alerts.LoggedOut = {
    "title"     : "Logged Out",
    "message"   : "You have been logged out.",
    "style"     : 'danger',
    'navigateDisappearThreshold' : 2
};

export const NoFilterResults = Alerts.NoFilterResults = {
    'title'     : "No Results",
    'message'   : "Selecting this filter returned no results so it was deselected.",
    'style'     : "warning",
    'navigateDisappearThreshold' : 3
};

export const ConnectionError = Alerts.ConnectionError = {
    "title" : "Connection Error",
    "message" : "Check your internet connection",
    "style" : "danger",
    'navigateDisappearThreshold' : 1
};

export const LoginFailed = Alerts.LoginFailed = {
    "title" : "Login Failed",
    "message" : "Your attempt to login failed - please check your credentials or try again later.",
    "style" : "danger",
    'navigateDisappearThreshold' : 1
};

/**
 * Component which renders out an individual Alert.
 * Rendered by `Alerts` component.
 *
 * @ignore
 * @private
 */
class AlertItem extends React.PureComponent {

    constructor(props){
        super(props);
        this.dismiss = this.dismiss.bind(this);
        this.finishDismiss = this.finishDismiss.bind(this);
    }

    dismiss(e){
        e.stopPropagation();
        e.preventDefault();
        const { alert, dismissing, setDismissing } = this.props;
        const nextDismissing = dismissing.slice(0);
        if (_.findIndex(nextDismissing, alert) === -1){
            nextDismissing.push(alert);
        }
        setDismissing(nextDismissing);
    }

    finishDismiss(){
        const { alert, dismissing, setDismissing, alerts } = this.props;
        setDismissing(_.without(dismissing, alert));
        if (reduxIsLegacy) {
            store.dispatch({ type: { 'alerts': _.without(alerts, alert) } });
        } else {
            store.dispatch({ type: 'SET_ALERTS', payload: _.without(alerts, alert) });
        }
    }

    render(){
        const { alert, dismissing } = this.props;
        const { style : bsStyle, noCloseButton, title, message } = alert;
        const hasMessage = !!message;
        return (
            <Fade timeout={500} in={ _.findIndex(dismissing, alert) === -1 } onExited={this.finishDismiss} unmountOnExit={true}>
                <div className={"alert alert-dismissable alert-" + (bsStyle || 'danger') + (noCloseButton === true ? ' no-close-button' : '')}>
                    { noCloseButton !== true ?
                        <button type="button" className="btn-close float-end" onClick={this.dismiss}>
                            <span className="visually-hidden">Close alert</span>
                        </button>
                        : null }
                    <h4 className={"alert-heading mt-0" + (hasMessage ? " mb-05" : " mb-0")}>{ title }</h4>
                    {hasMessage ? <div className="mb-0">{message}</div> : null}
                </div>
            </Fade>
        );
    }

}
