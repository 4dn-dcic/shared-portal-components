'use strict';

import React from 'react';
import memoize from 'memoize-one';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import Collapse from 'react-bootstrap/esm/Collapse';
import { AboveTablePanelWrapper } from './AboveTablePanelWrapper';
import { RightButtonsSection } from './RightButtonsSection';
import { CustomColumnSelector } from './../CustomColumnController';



/**
 * This component must be fed props from CustomColumnController (for columns UI), SelectedFilesController (for selected files read-out).
 * Some may need to be transformed to exclude certain non-user-controlled columns (e.g. @type) and such.
 */
export class AboveTableControlsBase extends React.PureComponent {

    static getCustomColumnSelectorPanelMapDefinition(props){
        return {
            "customColumns" : {
                "title" : (
                    <React.Fragment>
                        <i className="icon icon-fw icon-gear fas"/>
                        <span className="title-contents">Configure Visible Columns</span>
                    </React.Fragment>
                ),
                "body" : <CustomColumnSelector {..._.pick(props, 'hiddenColumns', 'addHiddenColumn', 'removeHiddenColumn', 'columnDefinitions')} />,
                "className" : "visible-columns-selector-panel"
            }
        };
    }

    static getDerivedStateFromProps(props, state){
        // Close panel if needed (as told by panelMap 'close' bool field)
        if (state.open && typeof state.open === 'string'){
            const currPanelDefinition = props.panelMap[state.open];
            if (currPanelDefinition && currPanelDefinition.close){
                return { "open" : false, "reallyOpen" : false };
            }
        }
        return null;
    }

    constructor(props){
        super(props);
        this.handleOpenToggle = _.throttle(this.handleOpenToggle.bind(this), 350);
        this.handleClose = this.handleOpenToggle.bind(this, false);
        this.handleOpenColumnsSelectionPanel = this.handleOpenToggle.bind(this, 'customColumns');

        this.panelToggleFxns = {};
        _.forEach(_.keys(props.panelMap), (key)=>{
            this.panelToggleFxns[key] = this.handleOpenToggle.bind(this, key);
        });

        /**
         * @property {boolean} state.open - Whether panel is open.
         * @property {boolean} state.reallyOpen - Extra check for if open, will remain true until 'closing' transition is complete.
         * @property {string[]} state.fileTypeFilters - List of file_type_detailed strings that we filter selected files down to.
         */
        this.state = {
            'open' : false,
            'reallyOpen' : false
        };
    }

    componentDidUpdate(prevProps, prevState){
        const { open } = this.state;
        if (open && prevState.open !== open){
            ReactTooltip.rebuild();
        }
    }

    handleOpenToggle(value){
        if (this.timeout){
            clearTimeout(this.timeout);
            delete this.timeout;
        }
        this.setState(function({ open }){
            const nextState = {};
            if (typeof value === 'string' && open === value){
                nextState.open = false;
            } else {
                nextState.open = value;
            }
            if (nextState.open){
                nextState.reallyOpen = nextState.open;
            }
            return nextState;
        }, ()=>{
            const { open, reallyOpen } = this.state;
            setTimeout(ReactTooltip.rebuild, 100);
            if (!open && reallyOpen){
                this.timeout = setTimeout(()=>{
                    this.setState({ 'reallyOpen' : false });
                }, 400);
            }
        });
    }

    render(){
        const { children, panelMap = {} } = this.props;
        const { open, reallyOpen } = this.state;
        const extendedChildren = React.Children.map(children, (child) =>
            React.cloneElement(child, {
                "panelToggleFxns" : this.panelToggleFxns,
                "onClosePanel" : this.handleClose,
                "currentOpenPanel" : open || reallyOpen
            })
        );

        const panelDefinition = panelMap[open] || panelMap[reallyOpen] || null;
        const { title: panelTitle, body: panelBody, className: panelCls } = panelDefinition || {};

        return (
            <div className="above-results-table-row">
                <div className="row">
                    { extendedChildren }
                    <RightButtonsSection {..._.pick(this.props, 'isFullscreen', 'windowWidth', 'toggleFullScreen')}
                        currentOpenPanel={open || reallyOpen} onColumnsBtnClick={this.panelToggleFxns.customColumns} />
                </div>
                { panelDefinition ?
                    <Collapse in={!!(open)} appear>
                        <AboveTablePanelWrapper className={panelCls} onClose={this.handleClose} title={panelTitle}>
                            { panelBody }
                        </AboveTablePanelWrapper>
                    </Collapse>
                    : null }
            </div>
        );
    }
}
AboveTableControlsBase.defaultProps = {
    "panelMap" : {
        // Fake -- form correct component and pass down from `getCustomColumnSelectorPanelMapDefinition`
        "customColumns" : {
            "title" : <span><i className="icon icon-fw icon-gear fas"/> hello world</span>,
            "body" : "Hello World",
            "className" : "visible-columns-selector-panel"
        }
    }
};
