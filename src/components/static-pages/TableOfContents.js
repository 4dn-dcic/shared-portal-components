'use strict';

import React from 'react';
import * as d3 from 'd3';
import _ from 'underscore';
import memoize from 'memoize-one';
import Collapse from 'react-bootstrap/esm/Collapse';
import { getElementTop, animateScrollTo, getScrollingOuterElement, getPageVerticalScrollPosition } from './../util/layout';
import { navigate } from './../util/navigate';
import { isServerSide } from './../util/misc';
import { CopyWrapper, itemUtil } from './../util/object';


class TableEntry extends React.Component {

    static getChildHeaders = memoize(function(content, maxHeaderDepth, currentDepth){
        if (!TableOfContents.isContentJSX(content) || !content.props || !content.props.children) return [];
        return content.props.children.filter(function(child,i,a){
            return TableOfContents.isHeaderComponent(child, maxHeaderDepth || 6) && (child.props.type === 'h' + (currentDepth + 1));
        });
    });

    static defaultProps = {
        'title' : 'Table of Content Entry',
        'link'  : 'sample-link',
        'style' : 'normal',
        'className' : null,
        'offsetBeforeTarget' : 72,
        'pageScrollTop' : 0,
        'depth' : null,
        'listStyleTypes' : null,
        'mounted' : null,
        'content' : null,
        'nextHeader' : null,
        'recurDepth' : 1
    };

    constructor(props){
        super(props);
        this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
        this.getTargetElement = this.getTargetElement.bind(this);
        this.getNextHeaderElement = this.getNextHeaderElement.bind(this);
        this.handleClick = _.throttle(this.handleClick.bind(this), 300);
        this.determineIfActive = this.determineIfActive.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);

        this.targetElement = null; // Header element we scroll to is cached here. Not in state as does not change.
        if (props.collapsible){
            this.state = { 'open' : false };
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if (
            nextProps.mounted !== this.props.mounted ||
            nextProps.pageScrollTop !== this.props.pageScrollTop ||
            (this && this.state && nextState && nextState.open !== this.state.open)
        ){
            return true;
        }
        return false;
    }

    getTargetElement(link = this.props.link){
        if (typeof document === 'undefined' || !document || !window) return null; // Not clientside.
        if (!this.targetElement){
            // Cache it for performance. Doesn't needa be in state as won't change.
            this.targetElement = d3.select('[id="' + link + '"]').node();
        }
        return this.targetElement;
    }

    getNextHeaderElement(props = this.props){
        if (!props.nextHeader || typeof document === 'undefined' || !document || !window) return null; // Not clientside or no header.
        var id = null;
        if (props.nextHeader === 'bottom'){
            id = 'page-footer';
        } else if (typeof props.nextHeader === 'string') {
            id = props.nextHeader;
        } else if (TableOfContents.isContentJSX(props.nextHeader)) {
            id = props.nextHeader.type.prototype.getID.call(props.nextHeader);
        }
        if (!id) return null;
        return d3.select('[id="' + id + '"]').node() || null;
    }

    handleClick(){
        const { link, offsetBeforeTarget, navigate: propNavigate } = this.props;
        TableOfContents.scrollToLink(link, offsetBeforeTarget, propNavigate, this.getTargetElement());
    }

    determineIfActive(props = this.props){
        const { mounted, depth, link, nextHeader, pageScrollTop, offsetBeforeTarget } = props;

        if (!mounted) return false;

        const scrollingOuterElement = getScrollingOuterElement();
        let targetElem;
        let elemTop;

        if (depth === 0 && mounted){
            elemTop = 0;
        } else {
            targetElem = this.getTargetElement(link);
            elemTop = getElementTop(targetElem);
            if (mounted && scrollingOuterElement && scrollingOuterElement.scrollHeight && window && window.innerHeight){
                // Try to prevent from trying to scroll past max scrollable height.
                elemTop = Math.min(scrollingOuterElement.scrollHeight - window.innerHeight, elemTop);
            }
        }

        if (typeof elemTop !== 'number') return null;

        if (nextHeader) {
            let nextHeaderTop = null;
            if (typeof nextHeader === 'number'){
                nextHeaderTop = nextHeader;
            } else {
                const nextHeaderElement = this.getNextHeaderElement(props);
                if (nextHeaderElement) {
                    nextHeaderTop = getElementTop(nextHeaderElement);
                }
            }
            if (
                nextHeaderTop &&
                pageScrollTop >= Math.max(depth > 0 ? 40 : 0, elemTop - offsetBeforeTarget - 120) &&
                pageScrollTop < (nextHeaderTop - offsetBeforeTarget - 120)
            ) return true;
            else return false;
        } else if (targetElem && targetElem.className.split(' ').indexOf('static-section-entry') > -1) {
            const elemStyle = (targetElem.computedStyle || window.getComputedStyle(targetElem));
            if (
                pageScrollTop >= (elemTop - offsetBeforeTarget - 120) &&
                pageScrollTop < (elemTop + parseInt(elemStyle.marginTop) + targetElem.offsetHeight - offsetBeforeTarget - 120)
            ) return true;
            else return false;
        } else if (depth === 0){
            if (mounted && pageScrollTop >= 0 && pageScrollTop < 40) return true;
        }
        return false;
    }

    toggleOpen(){
        this.setState(function({ open }){
            return { 'open' : !open };
        });
    }

    render(){
        const {
            recurDepth, link, content, maxHeaderDepth, depth, collapsible, mounted,
            listStyleTypes, pageScrollTop, nextHeader, children, skipDepth, className,
            navigate : propNavigate
        } = this.props;
        let { title } = this.props;
        const { open } = (this.state || {});
        const active = this.determineIfActive();
        const childHeaders = TableEntry.getChildHeaders(content, maxHeaderDepth, depth);

        let collapsibleButton;
        if (collapsible && childHeaders.length > 0){
            collapsibleButton = <i
                className={"d-inline-block icon icon-fw fas icon-" + (open ? 'minus' : 'plus')}
                onClick={this.toggleOpen}
            />;
        }

        if (typeof link === 'string' && link.length > 0){
            title = (
                <div className="title-link-wrapper">
                    { collapsibleButton }
                    <a className={depth === 0 ? 'text-500' : 'text-400'} href={(link.charAt(0) === '/' ? '' : '#') + link} onClick={(e)=>{ e.preventDefault(); this.handleClick(); }}>{ title }</a>
                </div>
            );
        }

        if (depth === 0){
            title = (
                <span title="Up to page listing" className="top-of-page visible-lg-block visible-lg">
                    <i className="icon fas icon-angle-up"></i>
                    { title }
                </span>
            );
        }

        return (
            <li className={
                "table-content-entry" +
                (className ? ' ' + className : '') +
                (depth === 0 ? ' top' : '') +
                (active ? ' active' : '')
            } data-depth={depth} data-recursion-depth={recurDepth}>
                { title }
                <Collapse in={!this.state || open && mounted}>
                    <div>
                        <TableEntryChildren navigate={propNavigate} parentClosed={this.state && !open}
                            {...{ active, content, childHeaders, depth, mounted, listStyleTypes,
                                pageScrollTop, nextHeader, children, link, maxHeaderDepth, skipDepth, recurDepth }} />
                    </div>
                </Collapse>
            </li>
        );
    }

}


class TableEntryChildren extends React.Component {

    static getHeadersFromContent = memoize(function(jsxContent, maxHeaderDepth, currentDepth){
        if (Array.isArray(jsxContent)) {
            // As of html-react-parser v1.2.8, we may get back array of content, including "\n" or similar.
            return jsxContent.reduce(function(m, c){
                const res = TableEntryChildren.getHeadersFromContent(c, maxHeaderDepth, currentDepth);
                m.childDepth = Math.max(res.childDepth, m.childDepth);
                m.childrenForDepth = m.childrenForDepth.concat(res.childrenForDepth);
                return m;
            }, { childDepth: currentDepth, childrenForDepth: [] });
        }
        if (!TableOfContents.isContentJSX(jsxContent)) return [];
        let depthToFind = currentDepth;
        let childrenForDepth = [];
        while (depthToFind <= Math.min(maxHeaderDepth, 5) && childrenForDepth.length === 0){
            childrenForDepth = _.filter(jsxContent.props.children, function(child,i,a){
                return TableOfContents.isHeaderComponent(child, maxHeaderDepth || 6) && child.props.type === 'h' + (depthToFind + 1);
            });
            if (childrenForDepth.length === 0){
                depthToFind++;
            }
        }
        return {
            'childDepth' : depthToFind,
            'childHeaders' : childrenForDepth
        };
    });

    static getSubsequentChildHeaders = memoize(function(header, jsxContent, maxHeaderDepth, currentDepth){
        if (!TableOfContents.isContentJSX(jsxContent)) return null;

        let getNext = null;
        let nextMajorHeader = null;
        const nextHeaderComponents = jsxContent.props.children.reduce(function(m, child){
            if (getNext === null && child === header){
                getNext = true;
                return m;
            }
            if (getNext && TableOfContents.isHeaderComponent(child, maxHeaderDepth || 6)){
                if (
                    child.props.type === 'h' + Math.max(currentDepth + 1, 1) ||
                    child.props.type === 'h' + Math.max(currentDepth    , 1) ||
                    child.props.type === 'h' + Math.max(currentDepth - 1, 1) ||
                    child.props.type === 'h' + Math.max(currentDepth - 2, 1)
                ){
                    nextMajorHeader = child;
                    getNext = false;
                } else {
                    m.push(child);
                }
            }
            return m;
        }, /* m = */ []);

        return {
            'content' : React.cloneElement(jsxContent, {}, nextHeaderComponents),
            'nextMajorHeader' : nextMajorHeader
        };
    });

    static renderChildrenElements(childHeaders, currentDepth, jsxContent, opts={ 'skipDepth' : 0, 'nextHeader' : null }){
        const { skipDepth, maxHeaderDepth, listStyleTypes, pageScrollTop, mounted, nextHeader, recurDepth } = opts;

        if (Array.isArray(childHeaders) && childHeaders.length > 0){
            return childHeaders.map(function(h, index){

                const childContent = TableEntryChildren.getSubsequentChildHeaders(h, jsxContent, maxHeaderDepth, currentDepth);

                if (skipDepth > currentDepth){
                    return TableEntryChildren.renderChildrenElements(
                        childHeaders, currentDepth + 1, childContent.content, _.extend({}, opts, { 'nextHeader' : childContent.nextMajorHeader || nextHeader || null })
                    );
                }

                const hAttributes = MarkdownHeading.getAttributes(h.props.children);
                let linkTitle = TableOfContents.textFromReactChildren(h.props.children);

                // We must have this to be equal to the ID of the element we're navigating to.
                // A custom ID might be set in Markdown 'attributes' which we prefer over the one passed to explicitly via props.
                let link = (hAttributes && hAttributes.id) || h.props.id || null;

                if (hAttributes && hAttributes.matchedString){
                    linkTitle = linkTitle.replace(hAttributes.matchedString, '').trim();
                }

                /** @deprecated */
                if (!link) link = TableOfContents.slugify(linkTitle); // Fallback -- attempt to not use -- may fail.

                const collapsible = currentDepth >= 1 + skipDepth;
                return (
                    <TableEntry
                        link={link}
                        title={linkTitle}
                        key={link}
                        depth={(currentDepth || 0) + 1}
                        listStyleTypes={listStyleTypes}
                        pageScrollTop={pageScrollTop}
                        mounted={mounted}
                        content={childContent.content}
                        nextHeader={childContent.nextMajorHeader || nextHeader || null}
                        navigate={navigate}
                        maxHeaderDepth={maxHeaderDepth}
                        collapsible={collapsible}
                        skipDepth={skipDepth}
                        recurDepth={(recurDepth || 0) + 1}
                    />
                );
            });
        }
        return null;
    }

    constructor(props){
        super(props);
        this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
        this.getHeadersFromContent = this.getHeadersFromContent.bind(this);
        this.children = this.children.bind(this);
        this.render = this.render.bind(this);
    }

    shouldComponentUpdate(nextProps){
        if (nextProps.active) return true;
        if (nextProps.depth === 0) return true;
        if (nextProps.mounted !== this.props.mounted) return true;
        if (nextProps.active !== this.props.active) return true;
        if (nextProps.parentClosed !== this.props.parentClosed) return true;
        return false;
    }

    getHeadersFromContent(){
        return TableEntryChildren.getHeadersFromContent(this.props.content, this.props.maxHeaderDepth, this.props.depth);
    }

    children(){
        const { content, depth, children: propChildren } = this.props;
        const { childHeaders, childDepth } = this.getHeadersFromContent();
        if (childHeaders && childHeaders.length){
            const opts = _.pick(this.props, 'maxHeaderDepth', 'pageScrollTop', 'listStyleTypes', 'skipDepth', 'nextHeader', 'mounted', 'recurDepth');
            return TableEntryChildren.renderChildrenElements(childHeaders, childDepth, content, opts);
        } else {
            return propChildren;
        }
    }

    render(){
        const { listStyleTypes, depth = 0 } = this.props;
        // Removed: 'collapse' children if not over them (re: negative feedback)
        //if (this.props.depth >= 3 && !this.props.active) return null;
        const renderedChildren = this.children();
        if (!renderedChildren) return null;
        return <ol className="inner" style={{ 'listStyleType' : listStyleTypes[depth + 1] }}>{ renderedChildren }</ol>;
    }
}


export class TableOfContents extends React.Component {

    /** Taken from https://gist.github.com/mathewbyrne/1280286 */
    /** @deprecated */
    static slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    /** @deprecated */
    static slugifyReactChildren(children){ return TableOfContents.slugify(TableOfContents.textFromReactChildren(children)); }

    static textFromReactChildren(children){
        if (typeof children === 'string') return children;
        if (children && typeof children === 'object' && children.props && children.props.children) return TableOfContents.textFromReactChildren(children.props.children);
        if (Array.isArray(children) && children.length > 0){
            var childrenWithChildren = _.filter(children, function(c){ return typeof c === 'string' || (c && c.props && c.props.children); });
            var childPrimaryElemIfAny = _.find(childrenWithChildren, function(c){ return c && typeof c === 'object' && c.props && (c.type === 'code' || c.type === 'strong' || c.type === 'b'); });
            if (childPrimaryElemIfAny){
                return TableOfContents.textFromReactChildren(childPrimaryElemIfAny);
            } else {
                return _.map(children, TableOfContents.textFromReactChildren).join('');
            }
        }
        return '';
    }

    static isHeaderComponent(c, maxHeaderDepth = 6){
        return (
            c && c.props &&
            typeof c.props.type === 'string' &&
            c.props.type.charAt(0).toLowerCase() === 'h' &&
            _.range(1, maxHeaderDepth + 1).indexOf(parseInt(c.props.type.charAt(1))) > -1
        );
    }

    static isContentJSX(content){
        if (!content || typeof content !== 'object') return false;
        return React.isValidElement(content);
        // const proto = Object.getPrototypeOf(content);
        // return proto && proto.isPrototypeOf(React.Component.prototype);
    }

    static elementIDFromSectionName(sectionName){
        let sectionParts;
        let idToUse = sectionName;
        if (sectionName.indexOf('#') > -1){
            sectionParts = sectionName.split('#');
            idToUse = sectionParts[sectionParts.length - 1];
        } else if (sectionName.indexOf('.') > -1){
            sectionParts = sectionName.split('.');
            idToUse = sectionParts[sectionParts.length - 1];
        }
        return idToUse;
    }

    static scrollToLink(link, offsetBeforeTarget = 72, navigateFunc = navigate, targetElement = null){
        let elementTop;
        if (link === "top") {
            elementTop = 0;
        } else if (typeof link === 'string' && link){
            if (link.charAt(0) === '/'){
                navigateFunc(link);
                return;
            } else {
                elementTop = getElementTop( targetElement || document.getElementById(link) );
            }
        } else {
            return null;
        }

        const pageScrollTop = getPageVerticalScrollPosition();

        animateScrollTo(elementTop, 750, offsetBeforeTarget, ()=>{
            if (typeof navigateFunc === 'function'){
                setTimeout(()=>{
                    if (link === 'top' || link === 'bottom') link = '';
                    navigateFunc('#' + link, { 'replace' : true, 'skipRequest' : true });
                }, link === 'top' || (typeof pageScrollTop === 'number' && pageScrollTop <= 40) ? 800 : 0);
            }
        });

        return;
    }

    static defaultProps = {
        "context" : {
            "title" : "Page Title",
            "content" : {
                "sectionNameID1" : {
                    "order"      : 0,
                    "title"      : "Section Title 1",
                    "content"    : "<h2>Hello</h2>",
                    "filetype"   : "html"
                },
                "sectionNameID2" : {
                    "order"      : 1,
                    "title"      : "Section Title 2",
                    "content"    : "<h2>World</h2>",
                    "filetype"   : "html"
                }
            }
        },
        'populateAnchors' : true,
        'title' : "Contents",
        'pageTitle' : 'Introduction',
        'includeTop' : true,
        'includeNextPreviousPages' : true,
        'listStyleTypes' : ['none', 'decimal', 'lower-alpha', 'lower-roman'],
        'maxHeaderDepth' : 3
    };

    constructor(props){
        super(props);
        this.onPageScroll = this.onPageScroll.bind(this);
        this.onToggleWidthBound = this.onToggleWidthBound.bind(this);
        this.state = {
            'scrollTop' : 0,
            'mounted' : false,
            'widthBound' : true
        };
    }

    componentDidMount(e){
        if (window && !isServerSide()){
            this.setState(
                { 'mounted' : true, 'scrollTop' : parseInt(getPageVerticalScrollPosition()) },
            );
            this.unsubFromScrollEventsFxn = this.props.registerWindowOnScrollHandler(this.onPageScroll);
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if (this.updateQueued){
            this.updateQueued = false;
            return true;
        }
        if (nextProps.windowWidth !== this.props.windowWidth) return true;
        if (nextState.mounted !== this.state.mounted) return true;
        if (nextState.scrollTop !== this.state.scrollTop) return true;
        if (nextState.widthBound !== this.state.widthBound) return true;
        return false;
    }

    componentDidUpdate(pastProps, pastState){
        if (pastProps.windowWidth !== this.props.windowWidth){
            // Recalculate new position on page etc.
            this.updateQueued = true;
            setTimeout(()=>{
                this.setState({ 'scrollTop' : parseInt(getPageVerticalScrollPosition()) });
            }, 0);
        }
    }

    componentWillUnmount(){
        if (typeof this.unsubFromScrollEventsFxn === 'function'){
            this.unsubFromScrollEventsFxn();
        }
    }

    onPageScroll(scrollTop, scrollVector, evt){
        this.setState({ scrollTop });
    }

    onToggleWidthBound(){
        this.setState(function({ widthBound }){
            return { 'widthBound' : !widthBound };
        });
    }

    parentLink(windowInnerWidth){
        const { context } = this.props;
        const { widthBound } = this.state;
        const cols = [];
        cols.push(
            <div key="parent-link" className={"col col-xs-" + (windowInnerWidth && windowInnerWidth >= 1600 ? '9' : '12')}>
                <a className="text-500" href={context.parent['@id']}>{ context.parent['display_title'] }</a>
            </div>
        );
        if (windowInnerWidth && windowInnerWidth >= 1600){
            cols.push(
                <div key="expand-btn" className="col col-xs-3 text-right expand-button-container">
                    <button type="button" className="btn btn-xs btn-outline-dark" onClick={this.onToggleWidthBound}>
                        { widthBound ?
                            <span><i className="icon icon-fw fas icon-angle-left"/></span> :
                            <span><i className="icon icon-fw fas icon-angle-right"/></span>
                        }
                    </button>
                </div>
            );
        }
        return (
            <li className="table-content-entry parent-entry" data-depth="0" key="parent-link">
                <span title="Up to page listing" className="top-of-page with-border-bottom visible-lg-block visible-lg">
                    <div className="row">{ cols }</div>
                </span>
            </li>
        );
    }

    render(){
        const {
            context, maxHeaderDepth, includeTop, fixedGridWidth, includeNextPreviousPages, listStyleTypes,
            windowWidth, windowHeight, maxHeight, navigate: propNavigate,
            fixedPositionBreakpoint = 1200
        } = this.props;
        const { mounted, scrollTop, widthBound } = this.state;
        const contents = [];
        let skipDepth = 0;

        let previousEncounteredSection = null;
        // Don't make top-level section entries if not all sections have a section title.
        const excludeSectionsFromTOC = context.content.filter(function(section){ return section.title || section['toc-title']; }).length < 2;
        const renderedSections = _.sortBy(context.content, function(s){ return s.order || 99; })
            .map(function(section, i, all){
                const { name } = section;
                const link = TableOfContents.elementIDFromSectionName(name);
                if (previousEncounteredSection){
                    previousEncounteredSection.nextHeader = link;
                }
                previousEncounteredSection = section;
                const sectionCopy = { ...section, link };
                if (all.length - 1 === i){
                    sectionCopy.nextHeader = 'bottom';
                }
                return sectionCopy;
            })
            .map(function(section, i, all){
                const { content, link, nextHeader, 'toc-title': tocTitle, title } = section;
                if (excludeSectionsFromTOC){
                    skipDepth = 1;
                    const { childHeaders, childDepth } = TableEntryChildren.getHeadersFromContent(content, maxHeaderDepth, 1);
                    const opts = _.extend({ childHeaders, maxHeaderDepth, listStyleTypes, skipDepth }, {
                        mounted, nextHeader, 'pageScrollTop' : scrollTop
                    });
                    return TableEntryChildren.renderChildrenElements(childHeaders, childDepth, content, opts);
                }
                return (
                    <TableEntry {...{ link, content, listStyleTypes, mounted, nextHeader, skipDepth, maxHeaderDepth }}
                        title={tocTitle || title || _.map(link.split('-'), function(w){ return w.charAt(0).toUpperCase() + w.slice(1); } ).join(' ') }
                        key={link} depth={1} pageScrollTop={scrollTop} navigate={propNavigate} />
                );
            });

        // Might have `null` or 2 in there from `renderChildrenElements`.
        const renderedSectionsFlattened = _.flatten(renderedSections).filter(function(rs){ return !!rs; });

        if (context && context.parent && context.parent['@id']){
            contents.push(
                this.parentLink(windowWidth)
            );
        }

        const [ { props: { link: firstSectionLink = null } = {} } = {} ] = renderedSectionsFlattened;

        contents.push(
            <TableEntry link="top"
                title={context.display_title || 'Top of Page' || null}
                key="top" depth={0} listStyleTypes={listStyleTypes}
                pageScrollTop={scrollTop} mounted={mounted} navigate={propNavigate}
                nextHeader={firstSectionLink || null}
                maxHeaderDepth={maxHeaderDepth} skipDepth={skipDepth || 0}>
                { renderedSectionsFlattened }
            </TableEntry>
        );

        let marginTop = 0; // Account for test warning
        if (windowWidth){
            if (typeof scrollTop === 'number' && scrollTop < 80 && windowWidth >= 1200){
                var testWarningElem = document.getElementsByClassName('navbar-container test-warning-visible');
                marginTop = (testWarningElem[0] && testWarningElem[0].offsetHeight) || marginTop;
            } else if (windowWidth < 1200) {
                marginTop = -12; // Account for spacing between title and first section
            }
        }

        const isEmpty = (Array.isArray(contents) && !_.filter(contents).length) || !contents;

        function generateFixedWidth(){
            const containerWidth = fixedPositionBreakpoint - 60;
            return containerWidth * (fixedGridWidth / 12) + (windowWidth - containerWidth) / 2 - 10;
        }

        return (
            <div key="toc" className={"table-of-contents" + (widthBound ? ' width-bounded' : '')} style={{
                'width' : windowWidth ?
                    windowWidth >= fixedPositionBreakpoint ? generateFixedWidth() || 'inherit'
                        :'inherit'
                    : 285,
                'height' :
                    (windowWidth && windowHeight ?
                        windowWidth >= fixedPositionBreakpoint ?
                            ( maxHeight || scrollTop >= 40 ? windowHeight - 42 : windowHeight - 82 )
                            : null
                        : 1000),
                marginTop : marginTop
            }}>
                {/* !isEmpty ? <h4 className="toc-title">{ this.props.title }</h4> : null */}
                { !isEmpty ?
                    <ol className="inner" style={{ 'listStyleType' : listStyleTypes[0], 'paddingLeft' : 0 }}>{ contents }</ol>
                    : null }
                { includeNextPreviousPages && (context.next || context.previous) ? <NextPreviousPageSection context={context} windowInnerWidth={windowWidth} /> : <br/> }
            </div>
        );
    }

}


export const NextPreviousPageSection = React.memo(function NextPreviousPageSection(props){
    const { context, className, previousTitle, nextTitle } = props;
    const { next, previous } = context;
    if (!next && !previous) return null;
    const colSize = previous && next ? 6 : 12;
    return (
        <div className={"next-previous-pages-section" + ((className && ' ' + className) || '')}>
            <div className="row">
                { previous ?
                    <div className={"previous-section text-right col-" + colSize}>
                        <h6 className="text-400 mb-02 mt-12"><i className="icon icon-fw fas icon-angle-left"/> { previousTitle }</h6>
                        <h6 className="text-500 mt-0"><a href={previous['@id'] || '/' + previous.name}>{ previous.display_title }</a></h6>
                    </div>
                    : null }
                { next ?
                    <div className={"next-section col-" + colSize}>
                        <h6 className="text-400 mb-02 mt-12">{ nextTitle } <i className="icon fas icon-fw icon-angle-right"/></h6>
                        <h6 className="text-500 mt-0"><a href={next['@id'] || '/' + next.name}>{ next.display_title }</a></h6>
                    </div>
                    : null }
            </div>
        </div>
    );
});
NextPreviousPageSection.defaultProps = {
    'previousTitle' : 'Previous',
    'nextTitle' : 'Next'
};


/** @todo We can probably have this work with HTML-type content as well. */
export class MarkdownHeading extends React.PureComponent {

    static getAttributes(childrenParam){
        const children = Array.isArray(childrenParam) ? childrenParam : [childrenParam];
        const attr = { 'id': null, 'className': null, 'matchedString': null };

        const childrenOuterText = _.filter(children, function(c){ return typeof c === 'string'; }).join(' ');
        let attrMatch = childrenOuterText.match(/({:[.-\w#]+})/g);

        if (attrMatch && attrMatch.length){
            attr.matchedString = attrMatch[0];
            attrMatch = attrMatch[0].replace('{:', '').replace('}', '');
            let idMatch = attrMatch.match(/(#[-\w]+)/g);
            if (idMatch && idMatch.length){
                idMatch = idMatch[0].replace('#', '');
                attr.id = idMatch;
                attrMatch = attrMatch.replace('#' + idMatch, '');
            }
            attr.className = attrMatch.split('.').join(' ').trim();
        }
        return attr;
    }

    static defaultProps = {
        'type' : 'h1',
        'id' : null
    };

    constructor(props){
        super(props);
        this.getID = this.getID.bind(this);
    }

    getID(set = false, id = null){
        if (typeof this.id === 'string') return this.id;
        /** slugifyReactChildren is deprecated and should never be called now as we always get props.id passed in (?) */
        var idToSet = id || (this.props && this.props.id) || TableOfContents.slugifyReactChildren(this.props.children);
        if (set){
            this.id = idToSet;
        }
        return idToSet;
    }

    componentWillUnmount(){ delete this.id; }

    render(){
        const { type, children: propChildren } = this.props;
        const children = Array.isArray(propChildren) ? propChildren : [propChildren];
        const propsToPass = {
            'children' : children,
            'id' : null,
            'type' : type
        };

        const attributes = MarkdownHeading.getAttributes(children);

        if (attributes && attributes.matchedString){
            propsToPass.children = _.map(children, function(c){
                if (typeof c === 'string') return c.replace(attributes.matchedString, '');
                return c;
            });
            if (attributes.id) {
                propsToPass.id = this.getID(true, attributes.id);
            }
            if (attributes.className) {
                propsToPass.className = attributes.className;
            }
        }
        if (!propsToPass.id) propsToPass.id = this.getID(true);
        return <HeaderWithLink {...propsToPass} />;
        //return React.createElement(type, propsToPass);
    }
}

export class HeaderWithLink extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleLinkClick = this.handleLinkClick.bind(this);
    }

    handleLinkClick(e){
        const { link, id: propID, context } = this.props;
        if (!(!isServerSide() && typeof window !== 'undefined' && document)) return null;
        const id = link || propID;
        let itemAtID;
        if (context) itemAtID = itemUtil.atId(context);
        else itemAtID = window.location.pathname;

        if (itemAtID){
            const linkToCopy = (
                window.location.protocol + '//' + window.location.host
                + itemAtID + '#' + id
            );
            CopyWrapper.copyToClipboard(linkToCopy);
            TableOfContents.scrollToLink(id);
        }
    }

    render(){
        const { link, id: propID, type, children } = this.props;
        if (!propID && !link) {
            throw new Error('HeaderWithLink needs a link or ID attribute/prop.');
        }
        return React.createElement(type || 'h2', _.omit(this.props, 'type', 'children', 'link', 'context'), [
            children,
            <i key="icon-link" className="icon icon-fw icon-link fas" onClick={this.handleLinkClick} title="Copy link to clipboard"/>
        ]);
    }
}
