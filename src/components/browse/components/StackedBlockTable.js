'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import _ from 'underscore';

import { Collapse } from './../../ui/Collapse';
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

        var useStyle = {};
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
        'handleCollapseToggle' : PropTypes.func
        // + those from parent .List
    };

    render(){
        const { collapsibleChildren, collapsed, title, showMoreExtTitle, handleCollapseToggle } = this.props;
        const collapsibleChildrenLen = collapsibleChildren.length;

        if (collapsibleChildrenLen === 0) return null;

        const titleStr = (
            (collapsed? "Show " + collapsibleChildrenLen + " More" : "Show Fewer") +
            (title? ' ' + title : '')
        );

        return (
            <div className="view-more-button" onClick={handleCollapseToggle}>
                <i className={"icon fas icon-" + (collapsed ? 'plus': 'minus')}/>
                { titleStr }
                { showMoreExtTitle ? <span className="ext text-400">{ showMoreExtTitle }</span> : null }
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
        'showMoreExtTitle'    : PropTypes.string,
        'collapseLimit'       : PropTypes.number,
        'collapseShow'        : PropTypes.number,
        'collapseLongLists'   : PropTypes.bool,
        'defaultCollapsed'    : PropTypes.bool,
        'children'            : PropTypes.arrayOf(PropTypes.node),
        'stackDepth'          : PropTypes.number
    };

    constructor(props){
        super(props);
        this.adjustedChildren = this.adjustedChildren.bind(this);
        this.handleCollapseToggle = this.handleCollapseToggle.bind(this);
        this.state = { 'collapsed' : props.defaultCollapsed };
    }

    adjustedChildren(){
        const { children, stackDepth, colWidthStyles, columnHeaders, columnClass } = this.props;
        return React.Children.map(children, (c)=>{

            //if (c.type.displayName !== 'StackedBlock') return c; // Only add props to StackedBlocks
            // TODO: TEST MIGRATION FROM _.PICK
            const childProps = { colWidthStyles, columnHeaders, stackDepth : stackDepth + 1 };
            //const childProps = _.pick(this.props, 'colWidthStyles', 'selectedFiles', 'columnHeaders', 'handleFileCheckboxChange');

            _.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed'], (prop)=>{
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

    render(){
        const { collapseLongLists, stackDepth, collapseLimit, collapseShow, className } = this.props;
        const children = this.adjustedChildren();
        const cls = "s-block-list " + (className || '') + (' stack-depth-' + stackDepth);

        if (collapseLongLists === false || !Array.isArray(children) || children.length <= collapseLimit) {
            // Don't have enough items for collapsible element, return plain list.
            return <div className={cls}>{ children }</div>;
        }

        const collapsibleChildren = children.slice(collapseShow);
        const collapsibleChildrenLen = collapsibleChildren.length;

        var collapsibleChildrenElemsList;

        if (collapsibleChildrenLen > Math.min(collapseShow, 10)) { // Don't transition
            collapsibleChildrenElemsList = this.state.collapsed ? null : <div className="collapsible-s-block-ext">{ collapsibleChildren }</div>;
        } else {
            collapsibleChildrenElemsList = (
                <Collapse in={!this.state.collapsed}>
                    <div className="collapsible-s-block-ext">{ collapsibleChildren }</div>
                </Collapse>
            );
        }

        return (
            <div className={cls} data-count-collapsed={collapsibleChildren.length}>
                { children.slice(0, collapseShow) }
                { collapsibleChildrenElemsList }
                <StackedBlockListViewMoreButton {...this.props} collapsibleChildren={collapsibleChildren}
                    collapsed={this.state.collapsed} handleCollapseToggle={this.handleCollapseToggle} />
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

            _.forEach(['collapseLongLists', 'collapseLimit', 'collapseShow', 'defaultCollapsed'], (prop)=>{
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

    static totalColumnsWidth(columnHeaders, defaultInitialColumnWidth){
        var origColumnWidths = StackedBlockTable.getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth);
        return _.reduce(origColumnWidths, function(m,v){ return m + v; }, 0);
    }

    /**
     * Returns array of column widths, aligned to columnHeaders, which are scaled up to
     * fit `width`, or original/initial widths if total is > props.width.
     */
    static scaledColumnWidths(width, columnHeaders, defaultInitialColumnWidth){
        if (!width) {
            width = 960; // 960 = fallback for tests
        }

        const origColumnWidths = StackedBlockTable.getOriginalColumnWidthArray(columnHeaders, defaultInitialColumnWidth);
        const totalOrigColsWidth = StackedBlockTable.totalColumnsWidth(columnHeaders, defaultInitialColumnWidth);

        if (totalOrigColsWidth > width){
            return origColumnWidths;
        }

        const scale = (width / totalOrigColsWidth) || 1;
        const newColWidths = _.map(origColumnWidths, function(c){
            return Math.floor(c * scale);
        });
        const totalNewColsWidth = _.reduce(newColWidths, function(m,v){ return m + v; }, 0);
        const remainder = width - totalNewColsWidth;

        // Adjust first column by few px to fit perfectly.
        newColWidths[0] += Math.floor(remainder - 0.5);

        return newColWidths;
    }

    static colWidthStyles(columnWidths, columnHeaders){
        // { 'experiment' : { width } , 'biosample' : { width }, ... }
        return _.object(
            _.map(columnHeaders, function(col, index){
                var key;
                if (col.columnClass === 'file-detail'){
                    key = col.field || col.title || 'file-detail';
                } else {
                    key = col.columnClass;
                }
                return [key, { 'width' : columnWidths[index] }];
            })
        );
    }

    static propTypes = {
        'columnHeaders' : PropTypes.arrayOf(PropTypes.shape({
            'columnClass' : PropTypes.string.isRequired,
            'className' : PropTypes.string,
            'title' : PropTypes.string.isRequired,
            'visibleTitle' : PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
            'initialWidth' : PropTypes.number
        })).isRequired,
        'width' : PropTypes.number.isRequired
    };

    static defaultProps = {
        'columnHeaders' : [
            { columnClass: 'biosample',     className: 'text-left',     title: 'Biosample',     initialWidth: 115   },
            { columnClass: 'experiment',    className: 'text-left',     title: 'Experiment',    initialWidth: 145   },
            { columnClass: 'file-group',                                title: 'File Group',     initialWidth: 40,   visibleTitle : <i className="icon fas icon-download"></i> },
            { columnClass: 'file',                                      title: 'File',          initialWidth: 125   }
        ],
        'width': null,
        'defaultInitialColumnWidth' : 120,
        'collapseLimit'     : 4,
        'collapseShow'      : 3,
        'collapseLongLists' : true,
        'defaultCollapsed'  : true
    };

    constructor(props){
        super(props);

        this.totalColumnsWidthMemoized = memoize(StackedBlockTable.totalColumnsWidth);
        this.scaledColumnWidthsMemoized = memoize(StackedBlockTable.scaledColumnWidths);
        this.colWidthStylesMemoized = memoize(StackedBlockTable.colWidthStyles);

        this.adjustedChildren = this.adjustedChildren.bind(this);
        this.colWidthStyles = this.colWidthStyles.bind(this);
        this.setCollapsingState = _.throttle(this.setCollapsingState.bind(this));

        this.state = {
            'mounted' : false
        };
    }

    componentDidMount(){
        this.setState({ 'mounted' : true });
    }

    colWidthStyles(){
        const { width, columnHeaders, defaultInitialColumnWidth } = this.props;
        const columnWidths = this.scaledColumnWidthsMemoized(width, columnHeaders, defaultInitialColumnWidth);
        return this.colWidthStylesMemoized(columnWidths, columnHeaders);
    }

    setCollapsingState(collapsing){
        this.setState({ collapsing });
    }

    adjustedChildren(){
        const { children, columnHeaders } = this.props;
        const colWidthStyles = this.colWidthStyles();

        return React.Children.map(children, (c)=>{
            // Includes handleFileCheckboxChange, selectedFiles, etc. if present
            const addedProps = _.omit(this.props, 'columnHeaders', 'stackDepth', 'colWidthStyles');

            // REQUIRED & PASSED DOWN TO STACKEDBLOCKLIST
            addedProps.colWidthStyles      = colWidthStyles;
            addedProps.stackDepth          = 0;
            addedProps.columnHeaders       = columnHeaders;

            return React.cloneElement(c, addedProps, c.props.children);
        });
    }

    render(){
        const { width , fadeIn, columnHeaders, className, children, defaultInitialColumnWidth } = this.props;
        const { mounted } = this.state;

        if (!children){
            return <h6 className="text-center text-400"><em>No Results</em></h6>;
        }

        const totalColsWidth = this.totalColumnsWidthMemoized(columnHeaders, defaultInitialColumnWidth);
        const minTotalWidth = Math.max(width || 0, totalColsWidth);

        // Includes width, columnHeaders, defaultColumnWidth, [handleFileCheckboxChange, allFiles, selectedFiles, etc.] if present
        const tableHeaderProps = _.omit(this.props, 'fadeIn', 'className', 'children', 'stackDepth', 'colWidthStyles');

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
    const { columnHeaders, width, defaultInitialColumnWidth } = props;
    const columnWidths = StackedBlockTable.scaledColumnWidths(width, columnHeaders, defaultInitialColumnWidth);

    const headers = _.map(columnHeaders, function(colHeader, index){
        let visibleTitle = colHeader.visibleTitle || colHeader.title;
        if (typeof visibleTitle === 'function') visibleTitle = visibleTitle(props);
        const colWidth = columnWidths[index] || colHeader.initialWidth || defaultInitialColumnWidth;
        const key = colHeader.field || index;
        const cls = "heading-block col-" + colHeader.columnClass + (colHeader.className ? ' ' + colHeader.className : '');

        return (
            <div className={cls} key={key} style={{ 'width' : colWidth }} data-column-class={colHeader.columnClass}>
                { visibleTitle }
            </div>
        );
    });

    return <div className="headers stacked-block-table-headers">{ headers }</div>;
}
TableHeaders.propTypes = {
    /** Basic props */
    'columnHeaders' : PropTypes.array.isRequired,
    'width' : PropTypes.number.isRequired,
    'defaultInitialColumnWidth' : PropTypes.number,

    /** Below needed to feed into visibleTitle func for e.g. checkbox in column title. */
    'allFiles' : PropTypes.arrayOf(PropTypes.object),
    'selectedFiles' : PropTypes.arrayOf(PropTypes.object),
    'handleFileCheckboxChange' : PropTypes.func.isRequired
};

