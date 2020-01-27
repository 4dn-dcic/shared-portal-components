'use strict';

import React from 'react';
import _ from 'underscore';
import { AboveTableControlsBase } from './AboveTableControlsBase';


/** This left section for Search should be made prettier, either kept in 4DN or re-used. */
export const AboveSearchViewTableControls = React.memo(function AboveSearchViewTableControls(props){
    const { context, currentAction, showTotalResults, topLeftChildren } = props;

    // Case if on SearchView
    let total = null;
    if (showTotalResults) {
        total = (
            <div style={{ 'verticalAlign' : 'bottom' }} className="inline-block">
                <span className="text-500">
                    {
                        typeof showTotalResults === 'number' ? showTotalResults
                            : context && typeof context.total === 'number' ? context.total
                                : null
                    }
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
                <a className={"btn btn-primary btn-xs" + (total ? " ml-1" : "")} href={addAction.href} data-skiprequest="true">
                    <i className="icon icon-fw icon-plus fas mr-03 fas"/>
                    Create New
                    &nbsp;
                </a>
            );
        }
    }

    return (
        <AboveTableControlsBase panelMap={AboveTableControlsBase.getCustomColumnSelectorPanelMapDefinition(props)}
            {..._.pick(props, 'isFullscreen', 'windowWidth', 'toggleFullScreen', 'parentForceUpdate')}>
            <LeftSectionControls {...{ total, addButton, topLeftChildren }} />
        </AboveTableControlsBase>
    );
});

function LeftSectionControls({ total, addButton, topLeftChildren, panelToggleFxns, onClosePanel, currentOpenPanel }) {
    if (!total && !addButton && !topLeftChildren) return null;
    return (
        <div key="total-count" className="pull-left pt-11 box results-count">
            {total}{topLeftChildren || addButton}
        </div>
    );
}