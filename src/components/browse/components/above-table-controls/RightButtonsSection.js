import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { SearchResultTable } from './../SearchResultTable';



export const RightButtonsSection = React.memo(function RightButtonsSection(props){
    const { currentOpenPanel, onColumnsBtnClick, onMultiColumnSortBtnClick, windowWidth, isFullscreen, toggleFullScreen, showMultiColumnSort = true } = props;
    const showToggleLayoutBtn = (typeof windowWidth === 'number' && typeof isFullscreen === 'boolean' && typeof toggleFullScreen === 'function');
    return (
        <div className="right-buttons col-auto">
            <ConfigureVisibleColumnsButton onClick={onColumnsBtnClick} open={currentOpenPanel === "customColumns"} />
            { showMultiColumnSort ? <MultiColumnSortButton onClick={onMultiColumnSortBtnClick} open={currentOpenPanel === "multiColumnSort"} /> : null}
            { showToggleLayoutBtn ? <ToggleLayoutButton {...{ windowWidth, isFullscreen, toggleFullScreen }} /> : null }
        </div>
    );
});



export const ConfigureVisibleColumnsButton = React.memo(function ConfigureVisibleColumnsButton({ open, onClick, className }){
    return (
        <button type="button" key="toggle-visible-columns" data-tip="Configure visible columns" data-event-off="click"
            active={open.toString()} onClick={onClick} className={(className || "") + (open ? " active" : "")}>
            <i className="icon icon-fw icon-table fas" />
            <i className="icon icon-fw icon-angle-down ml-03 fas"/>
        </button>
    );
});
ConfigureVisibleColumnsButton.defaultProps = {
    "className" : "btn btn-outline-primary"
};

export const MultiColumnSortButton = React.memo(function MultiColumnSortButton({ open, onClick, className }){
    return (
        <button type="button" key="toggle-visible-columns" data-tip="Sort multiple columns" data-event-off="click"
            active={open.toString()} onClick={onClick} className={(className || "") + (open ? " active" : "")}>
            <i className="icon icon-fw icon-sort fas" />
            <i className="icon icon-fw icon-angle-down ml-03 fas"/>
        </button>
    );
});
MultiColumnSortButton.defaultProps = {
    "className" : "btn btn-outline-primary"
};

/** Toggles between regular & full screen views */
export class ToggleLayoutButton extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleLayoutToggle = _.throttle(this.handleLayoutToggle.bind(this), 350);
    }

    handleLayoutToggle(evt){
        const { windowWidth, isFullscreen, toggleFullScreen } = this.props;
        if (!SearchResultTable.isDesktopClientside(windowWidth)) return null;
        if (typeof toggleFullScreen !== 'function'){
            console.error('No toggleFullscreen function passed in.');
            return null;
        }
        setTimeout(toggleFullScreen, 0, !isFullscreen);
    }

    render(){
        const { isFullscreen, className } = this.props;
        const cls = className + " expand-layout-button" + (!isFullscreen ? '' : ' expanded');
        return (
            <button type="button" className={cls}
                onClick={this.handleLayoutToggle} data-tip={(!isFullscreen ? 'Expand' : 'Collapse') + " table width"}>
                <i className={"icon icon-fw fas icon-" + (!isFullscreen ? 'arrows-alt-h icon-expand' : 'compress')}/>
                <span className="ml-05 d-none d-xl-inline">
                    { !isFullscreen ? "Full Screen" : "Collapse Table Width" }
                </span>
            </button>
        );
    }
}
ToggleLayoutButton.propTypes = {
    'windowWidth' : PropTypes.number.isRequired,
    'isFullscreen' : PropTypes.bool.isRequired,
    'toggleFullScreen' : PropTypes.func.isRequired,
    'className' : PropTypes.string
};
ToggleLayoutButton.defaultProps = {
    'className' : "btn btn-outline-primary"
};

