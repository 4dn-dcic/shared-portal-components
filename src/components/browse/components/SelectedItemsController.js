'use strict';

import React from 'react';
import _ from 'underscore';
import { Alerts } from './../../ui/Alerts';
import { itemUtil } from './../../util/object';
import { patchedConsoleInstance as console } from './../../util/patched-console';



/**
 * Utility function to post message to parent window
 * @param {Array} selectedItems: array of {id:ID of selected Item, if any, json:JSON of selected Item, if present (NOT GUARANTEED TO BE PROVIDED)} object
 * set selectedItems as empty array ([]) to close child window
 */
export function sendDataToParentWindow(itemsListWrappedWithID) {
    if (!itemsListWrappedWithID || itemsListWrappedWithID.length === 0) {
        return;
    }

    const eventJSON = { 'items': itemsListWrappedWithID, 'eventType': 'fourfrontselectionclick' };

    // Standard - postMessage
    try {
        window.opener.postMessage(eventJSON, '*');
    } catch (err){
        // Check for presence of parent window and alert if non-existent.
        if (!(typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window)){
            Alerts.queue({
                'title' : 'Failed to send data to parent window.',
                'message' : 'Please ensure there is a parent window to which this selection is being sent to. Alternatively, try to drag & drop the Item over instead.'
            });
        } else {
            console.err('Unexpecter error -- browser may not support postMessage', err);
        }
    }

    // Nonstandard - in case browser doesn't support postMessage but does support other cross-window events (unlikely).
    window.dispatchEvent(new CustomEvent('fourfrontselectionclick', { 'detail' : eventJSON }));
}



export class SelectedItemsController extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleSelectItemClick = this.handleSelectItemClick.bind(this);
        this.handleSelectItemCompleteClick = this.handleSelectItemCompleteClick.bind(this);
        this.handleSelectCancelClick = this.handleSelectCancelClick.bind(this);

        this.state = {
            selectedItems : new Map()
        };
    }

    /**
     * This function add/or removes the selected item into an Map in state,
     * if `props.currentAction` is set to "multiselect" or "selection".
     */
    handleSelectItemClick(result, isMultiSelect, evt) {
        this.setState(function({ selectedItems: prevItems }){
            const nextItems = new Map(prevItems);
            const resultID = itemUtil.atId(result);
            if (nextItems.has(resultID)) {
                nextItems.delete(resultID);
            } else {
                if (!isMultiSelect) {
                    nextItems.clear();
                }
                nextItems.set(resultID, result);
            }
            return { selectedItems: nextItems };
        });
    }

    /**
     * This function sends selected items to parent window for if `props.currentAction` is set to "multiselect" or "singleselect".
     */
    handleSelectItemCompleteClick(evt){
        const { selectedItems } = this.state;
        const itemsWrappedWithID = [];
        for (const [key, value] of selectedItems){
            itemsWrappedWithID.push({ id: key, json: value });
        }
        sendDataToParentWindow(itemsWrappedWithID);
    }

    /**
     * This function cancels the selection if `props.currentAction` is set to "multiselect".
     */
    handleSelectCancelClick(evt){
        const { selectedItems } = this.state;
        if (selectedItems.size > 0) {
            if (!window.confirm('Leaving will cause all selected item(s) to be lost. Are you sure you want to proceed?')) {
                return;
            }
        }

        window.dispatchEvent(new Event('fourfrontcancelclick'));
        // CURRENT: If we have parent window, post a message to it as well.
        if (window.opener){
            window.opener.postMessage({ 'eventType': 'fourfrontcancelclick' }, '*');
        } else {
            console.error("Couldn't access opener window.");
        }
    }

    render(){
        const { children, ...propsToPass } = this.props;
        const { selectedItems } = this.state;
        if (!React.isValidElement(children)){
            throw new Error('CustomColumnController expects props.children to be a valid React component instance.');
        }
        _.extend(propsToPass, {
            selectedItems,
            onSelectItem            : this.handleSelectItemClick,
            onCancelSelection       : this.handleSelectCancelClick,
            onCompleteSelection     : this.handleSelectItemCompleteClick
        });

        return React.Children.map(children, function(child){
            if (!React.isValidElement(child)){
                throw new Error('SelectedItemsSearchController expects props.children to be a valid React component instance(s).');
            }
            return React.cloneElement(child, propsToPass);
        });
    }

}



