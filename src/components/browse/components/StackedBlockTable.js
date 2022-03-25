import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import _ from 'underscore';
import Collapse from 'react-bootstrap/esm/Collapse';
import ReactTooltip from 'react-tooltip';

import { object, typedefs } from './../../util';


// eslint-disable-next-line no-unused-vars
const { Item } = typedefs;


/**
 * @todo:
 * - improve/cleanup code
 * - remove references to selectedFiles & similar props but ensure still works from 4DN/file-tables
 *   - maybe pass in selectedFiles props directly to FileEntryBlock (& similar)
 *   - or pass them thru props here
 */


export function StackedBlockNameLabel(props){
    const { title, subtitle, accession, className, subtitleVisible } = props;
    const cls = (
        "label-ext-info" + (className? ' ' + className : '') +
        (subtitle || accession ? ' has-subtitle' : '' ) +
        (subtitleVisible ? ' subtitle-visible' : '')
    );

    return (
        <div className={cls} key="label">
            <div className="label-title">{ title }</div>
            { subtitle || accession ?
                <div className={"ext" + (accession ? ' is-accession' : '')}>
                    { accession ?
                        <object.CopyWrapper value={accession} key="copy-accession">{ accession || subtitle }</object.CopyWrapper>
                        : subtitle }
                </div>
                : null }
        </div>
    );
}

StackedBlockNameLabel.propTypes = {
    /** Subtitle/label will appear more opaque when not hovered over */
    'subtitleVisible' : PropTypes.bool,
    'className' : PropTypes.string,
    'title' : PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    'subtitle' : PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    // Pass in place of or in addition to subtitle (takes precedence).
    'accession' : PropTypes.string
};

/** Name element to be put inside of StackedBlocks as the first child. */
export class StackedBlockName extends React.PureComponent {

    static Label = StackedBlockNameLabel

    render(){
        const { children, style, relativePosition, colWidthStyles, columnClass, label, className } = this.props;

        const useStyle = {};
        const colWidthStyle = colWidthStyles[columnClass];

        if (style)              _.extend(useStyle, style);
        if (colWidthStyle)      _.extend(useStyle, colWidthStyle);
        if (relativePosition)   useStyle.position = 'relative';

        return (
            <div className={"name col-" + columnClass + (className ? " " + className : "")} style={useStyle}>
                {/* label ? <StackedBlockName.Label {...label} /> : null */}
                { label }
                { children }
            </div>
        );
    }

}

/**
 * Button to toggle collapse/visible of longer StacedkBlockLists. Used in StackedBlockLists.
 */
export class StackedBlockListViewMoreButton extends React.PureComponent {

    static propTypes = {
        'collapsibleChildren' : PropTypes.array,
        'collapsed' : PropTypes.bool,
        'handleCollapseToggle' : PropTypes.func,
        'preventExpand' : PropTypes.bool,
        'showMoreExtTitle' : PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        // + those from parent .List
    };

    render(){
        const { collapsibleChildren, collapsed, title, showMoreExtTitle, handleCollapseToggle, preventExpand = false } = this.props;
        const collapsibleChildrenLen = collapsibleChildren.length;

        if (collapsibleChildrenLen === 0) return null;

        if (preventExpand) {
            // Show information label instead of button.
            return (
                <div className="view-more-button">
                    <i className="icon fas icon-plus mr-1 ml-02 small"/>
                    { collapsibleChildrenLen + " More" + (title ? ' ' + title : '') }
                    { showMoreExtTitle ? <span className="ext text-400"> { showMoreExtTitle }</span> : null }
                </div>
            );
        }

        const titleStr = (
            (collapsed ? (preventExpand ? collapsibleChildrenLen + " More" : `Show ${collapsibleChildrenLen} More`) : "Show Fewer") +
            (title ? ' ' + title : '')
        );

        const cls = "view-more-button" + (preventExpand ? "" : " clickable");

        return (
            <div className={cls} onClick={preventExpand ? null : handleCollapseToggle}>
                <i className={"mr-1 icon fas icon-" + (collapsed ? 'plus': 'minus')}/>
                { titleStr }
                { showMoreExtTitle ? <span className="ext text-400"> { showMoreExtTitle }</span> : null }
            </div>
        );
    }
}

/**
 * List which can be put inside a StackedBlock, after a StackedBlockName, and which holds other StackedBlocks.
 */
export class StackedBlockList extends React.PureComponent {

    static ViewMoreButton = StackedBlockListViewMoreButton;

    static propTypes = {
        'showMoreExtTitle'          : PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        'collapseLimit'             : PropTypes.number,
        'collapseShow'              : PropTypes.number,
        'collapseLongLists'         : PropTypes.bool,
        'defaultCollapsed'          : PropTypes.bool,
        'children'                  : PropTypes.arrayOf(PropTypes.node),
        'stackDepth'                : PropTypes.number,
        'preventExpand'             : PropTypes.bool,
        'incrementalExpandLimit'    : PropTypes.number,
        'incrementalExpandStep'     : PropTypes.number
    };

    constructor(props){
        super(props);
        this.adjustedChildren = this.adjustedChildren.bind(this);
        this.handleCollapseToggle = this.handleCollapseToggle.bind(this);
        this.state = { 'collapsed': props.defaultCollapsed, 'incrementalExpandVisibleCount': props.collapseShow };
    }

    adjustedChildren(){
        const { children, stackDepth, colWidthStyles, columnHeaders, columnClass } = this.props;
        return React.Children.map(children, (c)=>{

            //if (c.type.displayName !== 'StackedBlock') return c; // Only add props to StackedBlocks
            // TODO: TEST MIGRATION FROM _.PICK
            const childProps = { colWidthStyles, columnHeaders, stackDepth : stackDepth + 1 };
            //const childProps = _.pick(this.props, 'colWidthStyles', 'selectedFiles', 'columnHeaders', 'handleFileCheckboxChange');

            _.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed', 'incrementalExpandLimit'], (prop)=>{
                if (typeof c.props[prop] === 'undefined'){
                    childProps[prop] = this.props[prop] || null;
                }
            });

            _.forEach(_.keys(this.props), (prop)=>{
                if (typeof c.props[prop] === 'undefined' &&
                    typeof childProps[prop] === 'undefined' &&
                    !StackedBlock.excludedPassedProps.has(prop)){
                    childProps[prop] = this.props[prop];
                }
            });

            return React.cloneElement(c, childProps, c.props.children);
        });
    }

    handleCollapseToggle(){
        this.setState(function({ collapsed }){
            return { 'collapsed' : !collapsed };
        });
    }

    handleIncrementalExpandClick(count){
        this.setState(function(){
            return { 'incrementalExpandVisibleCount' : count };
        });
    }

    componentDidUpdate(pastProps, pastState){
        if (this.state.collapsed === false && pastState.collapsed === true) {
            ReactTooltip.rebuild();
        }
    }

    render(){
        const { collapseLongLists, stackDepth, collapseLimit, collapseShow, title = 'Items', className, colWidthStyles, columnClass, preventExpand, incrementalExpandLimit, incrementalExpandStep } = this.props;
        const { collapsed, incrementalExpandVisibleCount } = this.state;
        const children = this.adjustedChildren();
        const useStyle = colWidthStyles["list:" + columnClass]; // columnClass here is of parent StackedBlock, not of its children.
        const cls = "s-block-list " + (className || '') + (' stack-depth-' + stackDepth);

        if (collapseLongLists === false || !Array.isArray(children) || children.length <= collapseLimit) {
            // Don't have enough items for collapsible element, return plain list.
            return <div className={cls} style={useStyle}>{ children }</div>;
        }

        const isIncrementalExpand = (children.length > incrementalExpandLimit) && !preventExpand;

        const collapsibleChildren = !isIncrementalExpand ? children.slice(collapseShow) : children.slice(collapseShow, incrementalExpandVisibleCount);
        const collapsibleChildrenLen =  collapsibleChildren.length;

        let collapsibleChildrenElemsList;
        if (collapsibleChildrenLen > Math.min(collapseShow, 10) || isIncrementalExpand) { // Don't transition
            collapsibleChildrenElemsList = !collapsed || (isIncrementalExpand && collapsibleChildrenLen > 0) ? <div className="collapsible-s-block-ext">{collapsibleChildren}</div> : null;
        } else {
            collapsibleChildrenElemsList = (
                <Collapse in={!collapsed}>
                    <div className="collapsible-s-block-ext">{collapsibleChildren}</div>
                </Collapse>
            );
        }

        let viewMoreButton = null;
        if (isIncrementalExpand) {
            let titleStr, nextCount;
            if (collapsibleChildrenLen + collapseShow >= children.length) {
                titleStr = `Show Fewer ${title}`;
                nextCount = collapseShow;
            } else if (incrementalExpandVisibleCount + incrementalExpandStep > children.length) {
                titleStr = `Show ${children.length - collapsibleChildren.length - collapseShow} More ${title}`;
                nextCount = children.length;
            } else {
                titleStr = `Show ${incrementalExpandStep} More ${title} (Total ${children.length - collapsibleChildren.length - collapseShow} ${title} to Show)`;
                nextCount = incrementalExpandVisibleCount + incrementalExpandStep;
            }
            viewMoreButton = (
                <div className="view-more-button clickable" onClick={this.handleIncrementalExpandClick.bind(this, nextCount)}>
                    <i className={"mr-1 icon fas icon-" + (nextCount >= incrementalExpandVisibleCount ? "plus" : "minus")} />
                    {<span> {titleStr} </span>}
                </div>);
        } else {
            viewMoreButton = (
                <StackedBlockListViewMoreButton {...this.props} collapsibleChildren={collapsibleChildren}
                    collapsed={collapsed} handleCollapseToggle={this.handleCollapseToggle}
                />);
        }

        return (
            <div className={cls} data-count-collapsed={collapsibleChildren.length} style={useStyle}>
                { children.slice(0, collapseShow)}
                { collapsibleChildrenElemsList }
                { viewMoreButton }
            </div>
        );
    }

}

export class StackedBlock extends React.PureComponent {

    static Name = StackedBlockName;

    static List = StackedBlockList;

    /** TODO MAYBE USE HERE & ON LIST */
    static excludedPassedProps = new Set([
        'stripe', 'hideNameOnHover', 'keepLabelOnHover', 'className', 'children', 'showMoreExtTitle'
    ]);

    constructor(props){
        super(props);
        this.adjustedChildren = this.adjustedChildren.bind(this);
    }

    adjustedChildren(){
        const { children, columnClass, columnHeaders, label, stackDepth, colWidthStyles } = this.props;
        return React.Children.map(children, (c, index) => {
            if (c === null) return null;

            const childProps = { columnClass, columnHeaders, label, stackDepth, colWidthStyles };
            /*
            const childProps = _.pick(this.props,
                'columnClass', 'colWidthStyles', 'label', 'stackDepth',
                'selectedFiles', 'columnHeaders', 'handleFileCheckboxChange'
            );
            */

            _.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed', 'preventExpand', 'incrementalExpandLimit'], (prop)=>{
                if (typeof c.props[prop] === 'undefined'){
                    childProps[prop] = this.props[prop];
                }
            });

            _.forEach(_.keys(this.props), (prop)=>{
                if (typeof c.props[prop] === 'undefined' &&
                    typeof childProps[prop] === 'undefined' &&
                    !StackedBlock.excludedPassedProps.has(prop)){
                    childProps[prop] = this.props[prop];
                }
            });

            if (_.keys(childProps).length > 0){
                return React.cloneElement(c, childProps, c.props.children);
            } else return c;
        });
    }

    render(){
        const { columnClass, className, stackDepth, stripe, hideNameOnHover, keepLabelOnHover } = this.props;
        const classNames = [
            "s-block",
            "stack-depth-" + stackDepth,
            columnClass || null,
            hideNameOnHover ? ' hide-name-on-block-hover' : null,
            keepLabelOnHover ? ' keep-label-on-name-hover' : null,
            className || null,
            typeof stripe !== 'undefined' && stripe !== null ?
                (stripe === true || stripe === "even") ? "even" : "odd"
                : null
        ];
        return <div className={_.filter(classNames).join(' ')}>{ this.adjustedChildren() }</div>;
    }

}



/**
 * To be used within Experiments Set View/Page, or
 * within a collapsible row on the browse page.
 *
 * Shows experiments only, not experiment sets.
 *
 * Allows either table component itself to control state of "selectedFiles"
 * or for a parentController (passed in as a prop) to take over management
 * of "selectedFiles" Set and "checked", for integration with other pages/UI.
 */


export class StackedBlockTable extends React.PureComponent {

    static StackedBlock = StackedBlock;

    static getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth){
        return _.map(columnHeaders, function(c){ return c.initialWidth || defaultInitialColumnWidth; });
    }

    static totalColumnsMinWidth(columnHeaders, defaultInitialColumnWidth){
        return StackedBlockTable.getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth).reduce(function(m,v){
            return m + v;
        }, 0);
    }

    static colWidthStyles(columnHeaders, defaultInitialColumnWidth){
        // { 'experiment' : { width } , 'biosample' : { width }, ... }

        const orderedMapList = columnHeaders.map(function(col, index){
            const { field, title, columnClass, initialWidth } = col;
            const width = initialWidth || defaultInitialColumnWidth;
            let key;
            if (columnClass === 'file-detail'){
                key = field || title || 'file-detail';
            } else {
                key = columnClass;
            }
            return [
                key,
                {
                    flex: "1 0 " + width + "px",
                    minWidth: width
                }
            ];
        });

        const retObj = _.object(orderedMapList);

        columnHeaders.slice().reverse().reduce(function(m, col, idx){
            const { columnClass, initialWidth } = col;
            if (columnClass !== 'file-detail' && columnClass !== 'file'){
                retObj["list:" + columnClass] = {
                    flex: `${idx} 0 ${m}px`,
                    minWidth: m
                };
            }
            m += (initialWidth || defaultInitialColumnWidth);
            return m;
        }, 0);

        return retObj;
    }

    static propTypes = {
        'columnHeaders' : PropTypes.arrayOf(PropTypes.shape({
            'columnClass' : PropTypes.string.isRequired,
            'className' : PropTypes.string,
            'title' : PropTypes.string.isRequired,
            'visibleTitle' : PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
            'initialWidth' : PropTypes.number
        })).isRequired,
        'preventExpand' : PropTypes.bool
    };

    static defaultProps = {
        'columnHeaders' : [
            { columnClass: 'biosample',     className: 'text-left',     title: 'Biosample',     initialWidth: 115   },
            { columnClass: 'experiment',    className: 'text-left',     title: 'Experiment',    initialWidth: 145   },
            { columnClass: 'file-group',                                title: 'File Group',    initialWidth: 40,   visibleTitle : <i className="icon fas icon-download"></i> },
            { columnClass: 'file',                                      title: 'File',          initialWidth: 125   }
        ],
        'defaultInitialColumnWidth' : 120,
        'collapseLimit'             : 4,
        'collapseShow'              : 3,
        'preventExpand'             : false,
        'collapseLongLists'         : true,
        'incrementalExpandLimit'    : 100,
        'incrementalExpandStep'     : 100,
        'defaultCollapsed'          : true
    };

    constructor(props){
        super(props);

        this.adjustedChildren = this.adjustedChildren.bind(this);
        this.setCollapsingState = _.throttle(this.setCollapsingState.bind(this));

        this.memoized = {
            totalColumnsMinWidth: memoize(StackedBlockTable.totalColumnsMinWidth),
            colWidthStyles: memoize(StackedBlockTable.colWidthStyles)
        };

        this.state = {
            'mounted' : false
        };
    }

    componentDidMount(){
        this.setState({ 'mounted' : true });
    }

    setCollapsingState(collapsing){
        this.setState({ collapsing });
    }

    adjustedChildren(){
        const { children, columnHeaders, defaultInitialColumnWidth } = this.props;
        const colWidthStyles = this.memoized.colWidthStyles(columnHeaders, defaultInitialColumnWidth);

        return React.Children.map(children, (c)=>{
            // Includes handleFileCheckboxChange, selectedFiles, etc. if present
            const addedProps = _.omit(this.props, 'columnHeaders', 'stackDepth', 'colWidthStyles', 'width');

            // REQUIRED & PASSED DOWN TO STACKEDBLOCKLIST
            addedProps.colWidthStyles = colWidthStyles;
            addedProps.stackDepth = 0;
            addedProps.columnHeaders = columnHeaders;

            return React.cloneElement(c, addedProps, c.props.children);
        });
    }

    render(){
        const { width = 0, fadeIn, columnHeaders, className, children, defaultInitialColumnWidth } = this.props;
        const { mounted } = this.state;

        if (!children){
            return <h6 className="text-center text-400"><em>No Results</em></h6>;
        }

        const totalColsWidth = this.memoized.totalColumnsMinWidth(columnHeaders, defaultInitialColumnWidth);
        const minTotalWidth = Math.max(width, totalColsWidth);

        // Includes width, columnHeaders, defaultColumnWidth, [handleFileCheckboxChange, allFiles, selectedFiles, etc.] if present
        const tableHeaderProps = _.omit(this.props, 'fadeIn', 'className', 'children', 'stackDepth', 'colWidthStyles', 'width');

        return (
            <div style={{ 'width' : minTotalWidth }} className={
                "stacked-block-table" + (mounted ? ' mounted' : '') +
                (fadeIn ? ' fade-in' : '') + (typeof className === 'string' ? ' ' + className : '')}>
                <TableHeaders {...tableHeaderProps} />
                <div className="body clearfix">{ this.adjustedChildren() }</div>
            </div>
        );
    }
}



function TableHeaders(props){
    const { columnHeaders, defaultInitialColumnWidth } = props;

    const headers = _.map(columnHeaders, function(colHeader, index){
        const { field, title, visibleTitle: vTitle, title_tooltip, initialWidth, columnClass, className } = colHeader;
        let visibleTitle = vTitle || title;
        if (typeof visibleTitle === 'function') visibleTitle = visibleTitle(props);
        const colWidth = initialWidth || defaultInitialColumnWidth;
        const key = field || index;
        const cls = "heading-block col-" + columnClass + (className ? ' ' + className : '');

        let tooltip;
        if (title_tooltip && typeof title_tooltip === 'string' && title_tooltip.length > 0) {
            tooltip = title_tooltip;
        } else {
            tooltip = typeof visibleTitle === 'string' ? visibleTitle : typeof title === 'string' ? title : null;
        }
        if (tooltip && tooltip.length < 6) {
            tooltip = null;
        }

        return (
            <div className={cls} key={key} style={{ flex: "1 0 " + colWidth + "px", minWidth: colWidth  }} data-column-class={columnClass} data-tip={tooltip}>
                { visibleTitle }
            </div>
        );
    });

    return <div className="headers stacked-block-table-headers">{ headers }</div>;
}
TableHeaders.propTypes = {
    /** Basic props */
    'columnHeaders' : PropTypes.array.isRequired,
    'defaultInitialColumnWidth' : PropTypes.number,

    /** Below needed to feed into visibleTitle func for e.g. checkbox in column title. */
    'allFiles' : PropTypes.arrayOf(PropTypes.object),
    'selectedFiles' : PropTypes.objectOf(PropTypes.oneOfType([ PropTypes.object, PropTypes.bool ])),
    'handleFileCheckboxChange' : PropTypes.func
};

