'use strict';

import React, { useMemo, useCallback } from 'react';
import _ from 'underscore';
import { Alerts } from './../../ui/Alerts';
import { itemUtil } from './../../util/object';
import { isSelectAction } from './../../util/misc';
import * as logger from '../../util/logger';
import { DisplayTitleColumnWrapper, DisplayTitleColumnDefault } from './../../browse/components/table-commons/basicColumnExtensionMap';
import { getSchemaTypeFromSearchContext, getTitleForType } from './../../util/schema-transforms';
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
            logger.error('Unexpecter error -- browser may not support postMessage', err);
        }
    }

    // Nonstandard - in case browser doesn't support postMessage but does support other cross-window events (unlikely).
    window.dispatchEvent(new CustomEvent('fourfrontselectionclick', { 'detail' : eventJSON }));
}



export class SelectedItemsController extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleSelectItem = this.handleSelectItem.bind(this);
        this.handleResetSelectedItems = this.handleResetSelectedItems.bind(this);
        this.state = { "selectedItems": new Map() };
    }

    /**
     * This function add/or removes the selected item into an Map in state,
     * if `props.currentAction` is set to "multiselect" or "selection".
     */
    handleSelectItem(result, isMultiSelect) {
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

    handleResetSelectedItems(initialResults = null){
        const selectedItems = new Map();
        if (Array.isArray(initialResults)) {
            initialResults.forEach(function(result){
                const atId = itemUtil.atId(result);
                selectedItems.set(atId, result);
            });
        }
        this.setState({ selectedItems });
    }


    /**
     * If in selection mode and a `props.columnExtensionMap` is present,
     * extends columnExtensionMap's display_title render function.
     * Adds in a checkbox element which controls selectedItems state entry.
     */
    columnExtensionMapWithSelectButton(){
        const {
            columnExtensionMap: originalColumnExtensionMap,
            currentAction = null
        } = this.props;

        // Check if `currentAction` is one of "selection" | "multiselect"
        const inSelectionMode = isSelectAction(currentAction);

        if (!inSelectionMode || !originalColumnExtensionMap){
            return originalColumnExtensionMap;
        }

        // Kept for reference in case we want to re-introduce constrain that for 'select' button(s) to be visible in search result rows, there must be parent window.
        //var isThereParentWindow = inSelectionMode && typeof window !== 'undefined' && window.opener && window.opener.fourfront && window.opener !== window;

        // Render out button and add to title render output for "Select" if we have a 'selection' currentAction.
        // Also add the popLink/target=_blank functionality to links
        // Remove lab.display_title and type columns on selection
        const newColumnExtensionMap = _.clone(originalColumnExtensionMap);
        newColumnExtensionMap.display_title = {
            ...newColumnExtensionMap.display_title,
            'minColumnWidth' : (originalColumnExtensionMap.display_title.minColumnWidth || 100) + 20,
            'render' : (result, parentProps) => {
                const { selectedItems } = this.state;
                const { rowNumber, detailOpen, toggleDetailOpen, href, context } = parentProps;
                return (
                    <DisplayTitleColumnWrapper {...{ result, href, context, rowNumber, detailOpen, toggleDetailOpen }}>
                        <SelectionItemCheckbox {...{ selectedItems }} onSelectItem={this.handleSelectItem}
                            isMultiSelect={currentAction === 'multiselect'} />
                        <DisplayTitleColumnDefault />
                    </DisplayTitleColumnWrapper>
                );
            }
        };
        return newColumnExtensionMap;
    }

    render(){
        const { children, ...remainingProps } = this.props;
        const { selectedItems } = this.state;
        const propsToPass = {
            ...remainingProps,
            selectedItems,
            columnExtensionMap      : this.columnExtensionMapWithSelectButton(),
            onSelectItem            : this.handleSelectItem,
            onResetSelectedItems    : this.handleResetSelectedItems
        };

        return React.Children.map(children, function(child){
            if (!React.isValidElement(child)){
                throw new Error('SelectedItemsSearchController expects props.children to be a valid React component instance(s).');
            }
            return React.cloneElement(child, propsToPass);
        });
    }

}

export const SelectionItemCheckbox = React.memo(function SelectionItemCheckbox(props){
    const { selectedItems, result, isMultiSelect, onSelectItem } = props;
    const isChecked = selectedItems.has(itemUtil.atId(result));
    const onChange = useMemo(function(){
        return onSelectItem.bind(onSelectItem, result, isMultiSelect);
    }, [ onSelectItem, result, isMultiSelect ]);
    return <input type="checkbox" checked={isChecked} onChange={onChange} className="mr-2" />;
});

/** Move to own file later maybe. Especially if functionality expands. */
export const SelectStickyFooter = React.memo(function SelectStickyFooter(props){
    const { context, schemas, selectedItems, currentAction } = props;


    /** This function sends selected items to parent window. */
    const onComplete = useCallback(function(){
        const itemsWrappedWithID = [];
        for (const [key, value] of selectedItems){
            itemsWrappedWithID.push({ "id": key, "json": value });
        }
        sendDataToParentWindow(itemsWrappedWithID);
    }, [ selectedItems ]);


    const onCancel = useCallback(function(){
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
            logger.error("Couldn't access opener window.");
        }
    }, [ selectedItems ]);

    const itemTypeFriendlyName = getTitleForType(getSchemaTypeFromSearchContext(context), schemas);
    const selectedItemDisplayTitle = currentAction === 'selection' && selectedItems.size === 1 ? selectedItems.entries().next().value[1].display_title : "Nothing";
    return (
        <StickyFooter>
            <div className="row selection-controls-footer">
                <div className="col mb-05 mt-05">
                    {currentAction === 'multiselect' ?
                        <div className="row">
                            <h3 className="mt-0 mb-0 col-auto text-600">{ selectedItems.size }</h3>
                            <h4 className="mt-0 mb-0 text-muted col-auto text-400 px-0">
                                { itemTypeFriendlyName + (selectedItems.size === 1 ? '' : 's') } selected
                            </h4>
                        </div>
                        :
                        <div className="row">
                            <h4 className="mt-0 mb-0 col-auto text-400">{ selectedItemDisplayTitle }</h4>
                            <h4 className="mt-0 mb-0 text-muted col-auto text-400 px-0">selected</h4>
                        </div>
                    }
                </div>
                <div className="col-12 col-md-auto">
                    <button type="button" className="btn btn-success" onClick={onComplete} disabled={selectedItems.size === 0} data-tip="Select checked items and close window">
                        <i className="icon icon-fw fas icon-check"></i>&nbsp; Apply
                    </button>
                    <button type="button" className="btn btn-outline-warning ml-1" onClick={onCancel} data-tip="Cancel selection and close window">
                        <i className="icon icon-fw fas icon-times"></i>&nbsp; Cancel
                    </button>
                </div>
            </div>
        </StickyFooter>
    );
});

/**
 * General purpose sticky footer component
 * TODO: Component can be moved to a separate file.
 */
export function StickyFooter({ children, ...passProps }) {
    return (
        <div className="sticky-page-footer" {...passProps}>
            <div className="container">{ children }</div>
        </div>
    );
}
