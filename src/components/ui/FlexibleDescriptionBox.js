'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { isServerSide } from './../util/misc';
import { patchedConsoleInstance as console } from './../util/patched-console';
import { gridContainerWidth, textContentWidth } from './../util/layout';
import { requestAnimationFrame as raf } from './../viz/utilities';
import { EditableField, FieldSet } from '../forms/components/EditableField';


export class FlexibleCharacterCountBox extends React.Component {

    static propTypes = {
        'characters' : PropTypes.number.isRequired,
        'string' : PropTypes.string.isRequired,
        'icon' : PropTypes.element
    }

    constructor(props){
        super(props);
        this.render = this.render.bind(this);
        this.onClick = _.debounce(this.onClick.bind(this), 300, true);
        this.state = {
            'expanded' : props.defaultExpanded || false
        };
    }

    onClick(){
        this.setState(function({ expanded }){
            return { "expanded" : !expanded };
        });
    }

    render(){
        const { string, characters, expandCharacters, icon } = this.props;
        const { expanded } = this.state;
        const expandable = string.length > (characters || expandCharacters);
        if (!expandable){
            return <span>{ string }</span>;
        }
        const visibleIcon = (
            icon && React.cloneElement(icon, {
                'onClick' : this.onClick,
                'expanded' : expanded,
                'data-expanded' : expanded
            }) || <i className={"icon fas icon-" + (expanded ? 'minus' : 'plus')} onClick={this.onClick} />
        );

        return (
            <span>
                <FlexibleCharacterCountString
                    string={string}
                    expanded={expanded}
                    expandCharacters={characters || expandCharacters}
                /> &nbsp; { visibleIcon }
            </span>
        );
    }

}


class FlexibleCharacterCountString extends React.Component {

    static propTypes = {
        'string' : PropTypes.string,
        'expanded' : PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func
        ]),
        'expandCharacters' : PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.func
        ]),
    }

    static defaultProps = {
        'expanded' : false
    }

    isExpanded(props = this.props){
        if (typeof props.expanded === 'boolean') return props.expanded;
        if (typeof props.expanded === 'function') return props.expanded(props);
    }

    render(){
        var expanded = this.isExpanded(this.props);
        if (expanded) return this.props.string;
        else {
            if (typeof this.props.expandCharacters === 'number' && typeof this.props.string === 'string'){
                return this.props.string.slice(0, this.props.expandCharacters);
            } else {
                throw new Error('props.string must be a string and props.expandCharacters must be a number.');
            }
        }
    }

}

/**
 * Works by calculating height of text content using a temporary off-screen container element.
 * Not related to FlexibleCharacterCount.. classes above.
 */
export class FlexibleDescriptionBox extends React.Component {

    static defaultDimensions = {
        'paddingWidth'  : 0,
        'paddingHeight' : 0,
        'buttonWidth'   : 30,
        'initialHeight' : 19
    }

    static propTypes = {
        'description'   : PropTypes.any.isRequired,
        'dimensions'    : PropTypes.shape({
            'paddingWidth'  : PropTypes.number,
            'paddingHeight' : PropTypes.number,
            'buttonWidth'   : PropTypes.number,
            'initialHeight' : PropTypes.number
        }),
        'fitTo'         : PropTypes.oneOf(['grid', 'parent', 'self']),
        'includeButton' : PropTypes.bool,   // If false, must use refs and call this.toggleDescriptionExpand manually
        'className'     : PropTypes.string,
        'textClassName' : PropTypes.string,
        'textElement'   : PropTypes.oneOf(['p', 'span', 'div', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
        'textStyle'     : PropTypes.object,
        'expanded'      : PropTypes.bool,
        'windowWidth'   : PropTypes.number.isRequired,
        'context'       : PropTypes.object
    }

    static defaultProps = {
        'dimensions' : null,
        'fitTo' : 'self',
        'includeButton' : true,
        'className' : null,
        'textClassName' : null,
        'textElement' : 'p',
        'textStyle' : null,
        'debug' : false,
        'linesOfText' : 1,
        'lineHeight' : 19,
        'defaultExpanded' : false,
        'collapsedHeight' : null
    }

    constructor(props){
        super(props);
        this.dimensions = this.dimensions.bind(this);
        this.checkWillDescriptionFitOneLineAndUpdateHeight = this.checkWillDescriptionFitOneLineAndUpdateHeight.bind(this);
        this.toggleDescriptionExpand = this.toggleDescriptionExpand.bind(this);
        this.makeShortContent = this.makeShortContent.bind(this);
        this.havePermissionToEdit = this.havePermissionToEdit.bind(this);
        this.descriptionHeight = null;
        this.state = {
            'descriptionExpanded' : props.defaultExpanded,
            'descriptionWillFitOneLine' : true,
            'descriptionWhiteSpace' : this.props.linesOfText > 1 ? 'normal' : 'nowrap',
            'shortContent' : null,
            'mounted' : false
        };
    }

    componentDidUpdate(pastProps, pastState){
        // Handle window resize
        if (pastProps.windowWidth !== this.props.windowWidth){ // Recalculate some layouting stuff

            raf(()=>{

                this.setState((currState, currProps)=>{

                    const oldHeight = this.descriptionHeight;
                    const willDescriptionFitAtNewWindowSize = this.checkWillDescriptionFitOneLineAndUpdateHeight();

                    return {
                        'descriptionWillFitOneLine' : willDescriptionFitAtNewWindowSize,
                        'shortContent' : this.props.linesOfText > 1 ? this.makeShortContent() : null
                    };
                });

            });

        }
    }

    componentDidMount(){
        if (this.props.debug) console.info("Mounted FlexibleDescriptionBox");
        if (!isServerSide()){

            // Create throttled version of toggleDescriptionExpand for button.
            this.throttledToggleDescriptionExpand = _.throttle(this.toggleDescriptionExpand, 350);

            setTimeout(()=>{
                var willDescriptionFitAtCurrentSize = this.checkWillDescriptionFitOneLineAndUpdateHeight();
                this.setState({
                    'descriptionWillFitOneLine' : willDescriptionFitAtCurrentSize,
                    'mounted' : true,
                    'shortContent' : this.props.linesOfText > 1 ? this.makeShortContent() : null
                });
            }, 50);
        }

    }

    componentWillUnmount(){
        if (typeof window != 'undefined'){
            delete this.throttledToggleDescriptionExpand;
        }
    }

    makeShortContent(){
        var charsToKeep = 0.133 * (this.props.linesOfText * (this.descriptionWidth || 20));
        return this.props.description.slice(0, charsToKeep) + (!this.props.description.charAt(charsToKeep) ? '' : '...');
    }

    dimensions(){
        if (this.props.dimensions) return _.extend({}, FlexibleDescriptionBox.defaultDimensions, this.props.dimensions);
        else return _.clone(FlexibleDescriptionBox.defaultDimensions);
    }

    checkWillDescriptionFitOneLineAndUpdateHeight(){
        const { description, textElement, textClassName, textStyle, windowWidth, linesOfText, lineHeight, fitTo } = this.props;
        if (isServerSide()) return true;
        const boxRef = (this.boxRef && this.boxRef.current) || null;

        if (!boxRef){
            console.error("boxRef not available");
        }

        const dims = this.dimensions();
        let containerWidth;

        if (fitTo === 'grid'){
            containerWidth = gridContainerWidth(windowWidth || null);
        } else if (fitTo === 'parent'){
            containerWidth = (boxRef && boxRef.parentElement && boxRef.parentElement.offsetWidth) || gridContainerWidth(windowWidth || null);
        } else if (fitTo === 'self'){
            containerWidth = (boxRef && boxRef.offsetWidth) || gridContainerWidth(windowWidth || null);
        }

        containerWidth -= dims.paddingWidth; // Account for inner padding & border.

        const tcw = textContentWidth(
            description, textElement, textClassName,
            containerWidth - dims.buttonWidth, // Account for expand button.
            textStyle
        );

        if (!tcw) return true;

        this.descriptionHeight = tcw.containerHeight + dims.paddingHeight; // Account for padding, border.
        this.descriptionWidth = containerWidth;

        // If we want more than 1 line, calculate if descriptionheight / lineheight > linesWanted.
        if (typeof linesOfText === 'number' && linesOfText > 1 && typeof lineHeight === 'number'){
            var divRes = Math.ceil(this.descriptionHeight / lineHeight);
            if (divRes > linesOfText) {
                return false;
            }
            return true;
        }

        if (tcw.textWidth < containerWidth){
            this.descriptionHeight = lineHeight + dims.paddingHeight; // unset if calcd higher val above
            return true;
        }
        return false;
    }

    toggleDescriptionExpand(){
        this.setState(function({ descriptionExpanded }){
            return {
                "descriptionWhiteSpace" : "normal",
                "descriptionExpanded" : !descriptionExpanded
            };
        }, ()=>{
            const { linesOfText } = this.props;
            const { descriptionExpanded } = this.state;
            if (!descriptionExpanded && linesOfText === 1) {
                // Delay whiteSpace style since can't transition it w/ CSS3
                setTimeout(()=>{
                    this.setState({
                        "descriptionWhiteSpace" : 'nowrap'
                    });
                }, 350);
            } else if (!descriptionExpanded){
                // Nada
            }
        });
    }
    havePermissionToEdit() {
        const {  context: { actions = [] } } = this.props;
        return !!(_.findWhere(actions, { 'name': 'edit' }));
    }
    render(){
        const {
            debug, expanded: propExpanded,
            showOnMount, lineHeight, linesOfText, collapsedHeight, className, textElement, textClassName, textStyle, description, fitTo
        } = this.props;
        const { descriptionWillFitOneLine, descriptionExpanded, mounted, shortContent, descriptionWhiteSpace } = this.state;
        if (debug) console.log('render FlexibleDescriptionBox');

        let expandButton;
        const expanded = descriptionExpanded || propExpanded;

        if (!descriptionWillFitOneLine && typeof propExpanded !== 'boolean'){
            expandButton = (
                <button type="button" className="description-expand-button right" onClick={this.throttledToggleDescriptionExpand}>
                    <i className={"icon fas icon-" + (expanded ? 'minus' : 'plus' )} />
                </button>
            );
        }

        const containerHeightSet = (expanded ?
            this.descriptionHeight
            :
            !mounted && showOnMount ? (
                0
            ) : collapsedHeight || Math.min(
                Math.max(
                    this.dimensions().initialHeight,
                    lineHeight * (linesOfText || 1)
                ),
                (mounted && this.descriptionHeight) || 1000
            )
        );

        // Add boxRef to our instance only if we need to.
        // Moved from componentWillReceiveProps as this lifecycle method is being deprecated.
        if (!this.boxRef && (fitTo === 'self' || fitTo === 'parent')){
            this.boxRef = React.createRef();
        }

        const { children, subtitle, windowWidth, title, schemas, href, subTitleClassName, context, isInlineEditable } = this.props;

        if(isInlineEditable && this.havePermissionToEdit())
        {
            return (
                <div ref={this.boxRef}
                    className={"flexible-description-box " + (className ? className : '') + (expandButton ? (expanded ? ' expanded' : ' collapsed') : ' not-expandable')}
                    style={{
                        'height': containerHeightSet,
                        'whiteSpace': expanded ? 'normal' : descriptionWhiteSpace,
                        'visibility': !mounted && showOnMount ? 'hidden' : null
                    }}>
                    {expandButton}
                    <FieldSet context={context}
                        className={textClassName}
                        style={textStyle}
                        schemas={schemas} href={href}>
                        <EditableField className={textClassName} labelID="description" style="row-without-label" placeholder="description" fallbackText="click to add new description" fieldType="text" buttonAlwaysVisible={true}>
                        </EditableField>
                    </FieldSet>
                </div>
            );
        }
        return (
            <div ref={this.boxRef}
                className={"flexible-description-box " + (className ? className : '') + (expandButton ? (expanded ? ' expanded' : ' collapsed') : ' not-expandable') }
                style={{
                    'height': containerHeightSet,
                    'whiteSpace': expanded ? 'normal' : descriptionWhiteSpace,
                    'visibility': !mounted && showOnMount ? 'hidden' : null
                }}>
                {expandButton}
                {React.createElement(textElement, { 'className': textClassName, 'style': textStyle }, expanded ? description : shortContent || description)}
            </div>
        );
    }

}
