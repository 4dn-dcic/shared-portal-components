import React from 'react';
import _ from 'underscore';
import { AboveTableControlsBase } from './AboveTableControlsBase';


/** This left section for Search should be made prettier, either kept in 4DN or re-used. */
export const AboveSearchViewTableControls = React.memo(function AboveSearchViewTableControls(props){
    const { context, currentAction, topLeftChildren, isFullscreen, windowWidth, toggleFullScreen, sortBy } = props;
    const { total: showTotalResults = 0 } = context || {};

    // Case if on SearchView
    let total = null;
    if (typeof showTotalResults === 'number') {
        total = (
            <div className="d-inline-block">
                <span className="text-500" id="results-count">
                    { showTotalResults }
                </span> Results
            </div>
        );
    }

    // FOR NOW, we'll stick 'add' button here. -- IF NO SELECTED FILES CONTROLS
    let addButton = null;
    // don't show during submission search "selecting existing"
    if (context && Array.isArray(context.actions) && !currentAction){
        const addAction = _.findWhere(context.actions, { 'name' : 'add' });
        if (addAction && typeof addAction.href === 'string'){
            addButton = (
                <a className={"btn btn-primary btn-xs" + (total ? " ms-1" : "")} href={addAction.href} data-skiprequest="true">
                    <i className="icon icon-fw icon-plus fas me-03 fas"/>
                    Create New
                    &nbsp;
                </a>
            );
        }
    }

    return (
        // TODO refactor out panelMap stuff.
        <AboveTableControlsBase {...{ isFullscreen, windowWidth, toggleFullScreen, sortBy }}
            panelMap={AboveTableControlsBase.getCustomColumnSelectorPanelMapDefinition(props)}>
            <LeftSectionControls {...{ total, addButton, topLeftChildren }} />
        </AboveTableControlsBase>
    );
});

function LeftSectionControls({ total, addButton, topLeftChildren, panelToggleFxns, onClosePanel, currentOpenPanel }) {
    if (!total && !addButton && !topLeftChildren) return null;
    return (
        <div className="col box results-count flex-grow-1 d-flex align-items-end">
            { total }{ topLeftChildren || addButton }
        </div>
    );
}