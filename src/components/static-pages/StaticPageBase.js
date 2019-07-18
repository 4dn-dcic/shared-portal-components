'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import url from 'url';
import memoize from 'memoize-one';

import { Collapse } from './../ui/Collapse';
import { Alerts } from './../ui/Alerts';
import { TableOfContents, HeaderWithLink } from './TableOfContents';
import { layout, console } from './../util';



/**
 * Converts links to other files into links to sections from a React element and its children (recursively).
 *
 * @param {*} elem                                      A high-level React element representation of some content which might have relative links.
 * @param {{ content: { name: string }}} context        Backend-provided data.
 * @param {number} [depth=0]                            Current depth.
 * @returns {JSX.Element} Copy of original 'elem' param with corrected links.
 */
export function correctRelativeLinks(elem, context, depth=0){
    if (typeof elem !== 'object' || !elem) return elem; // Could be a string, or null.
    if (elem.type === 'a'){
        var href = elem.props.href;
        if (
            typeof href === 'string' &&
            href.charAt(0) !== '#' &&
            href.charAt(0) !== '/' &&
            href.slice(0,4) !== 'http' &&
            href.slice(0,7) !== 'mailto:'
        ){ // We have a relative href link.
            if (href.indexOf('#') > -1){ // It references a title on some other page or section. Likely, this is section is on same page, so we can just use that.
                var parts = href.split('#');
                if (parts.length > 1){
                    href = '#' + parts[1];
                }
            } else { // Check if is name of a section, and if so, correct.
                var filenameWithoutExtension = href.split('.').slice(0, -1).join('.');
                if (typeof _.find(context.content, { 'name' : filenameWithoutExtension }) !== 'undefined'){
                    href = '#' + filenameWithoutExtension;
                }
            }
        }

        if (href !== elem.props.href || href.charAt(0) === '#'){
            return React.cloneElement(
                elem,
                _.extend(_.omit(elem.props, 'children'), {
                    'href' : href,
                    'onClick' : href.charAt(0) !== '#' ? null : function(e){
                        e.preventDefault();
                        layout.animateScrollTo(href.slice(1));
                    }
                }),
                elem.props.children || null
            );
        } else return elem;
    } else if (elem.props.children && typeof elem.type === 'string') {
        return React.cloneElement(
            elem,
            _.omit(elem.props, 'children'),
            React.Children.map(elem.props.children, function(child){
                return correctRelativeLinks(child, context, depth + 1);
            })
        );
    } else return elem;
}




const Wrapper = React.memo(function Wrapper(props){
    const { children, tableOfContents, title, context } = props;
    const toc = (context && context['table-of-contents']) || (tableOfContents && typeof tableOfContents === 'object' ? tableOfContents : null);
    const pageTitle = title || (context && context.title) || null;
    const tocExists = toc && toc.enabled !== false;

    return (
        <div className="container" id="content">
            <div className="static-page row" key="wrapper">
                { tocExists ? (
                    <div key="toc-wrapper" className="col-12 col-xl-3 order-1 order-xl-3">
                        <TableOfContents pageTitle={pageTitle} fixedGridWidth={3} maxHeaderDepth={toc['header-depth'] || 6}
                            {..._.pick(props, 'navigate', 'windowWidth', 'windowHeight', 'context', 'href', 'registerWindowOnScrollHandler')}
                            // skipDepth={1} includeTop={toc['include-top-link']} listStyleTypes={['none'].concat((toc && toc['list-styles']) || this.props.tocListStyles)}
                        />
                    </div>
                ) : null }
                <div key="main-column" className={"order-2 col-12 col-xl-" + (tocExists ? '9': '12')}>{ children }</div>
            </div>
        </div>
    );
});
Wrapper.defaultProps = {
    //'contentColSize' : 12,
    'tableOfContents' : false,
    'tocListStyles' : ['decimal', 'lower-alpha', 'lower-roman']
};


export class StaticEntry extends React.PureComponent {

    static defaultProps = {
        'section'   : null,
        'content'   : null,
        'entryType' : 'help',
        'className' : null
    };

    static propTypes = {
        'childComponent' : PropTypes.elementType
    };

    constructor(props){
        super(props);
        this.toggleOpen = _.throttle(this.toggleOpen.bind(this), 1000);

        const options = (props.section && props.section.options) || {};
        this.state = {
            'open' : options.default_open,
            'closing' : false
        };
    }

    toggleOpen(open, e){
        this.setState(function(currState){
            if (typeof open !== 'boolean'){
                open = !currState.open;
            }
            var closing = !open && currState.open;
            return { open, closing };
        }, ()=>{
            setTimeout(()=>{
                this.setState(function(currState){
                    if (!currState.open && currState.closing){
                        return { 'closing' : false };
                    }
                    return null;
                });
            }, 500);
        });
    }

    render(){
        const { section, entryType, sectionName, className, context, childComponent } = this.props;
        const { open, closing } = this.state;
        const id              = TableOfContents.elementIDFromSectionName(sectionName);
        const options         = (section && section.options) || {};
        let outerClassName  = entryType + "-entry static-section-entry";

        const renderedChildComponent = React.createElement(childComponent, this.props);

        if (options.collapsible){
            outerClassName += ' can-collapse ' + (open ? 'open' : 'closed');
            return (
                <div className={outerClassName} id={id}>
                    { section && section.title ?
                        <HeaderWithLink className={"section-title can-collapse " + (open ? 'open' : 'closed')} link={id} context={context} onClick={this.toggleOpen}>
                            <i className={"icon icon-fw fas icon-" + (open ? 'minus' : 'plus')}/>&nbsp;&nbsp;
                            { section.title }
                        </HeaderWithLink>
                        : null }
                    <Collapse in={open}>
                        <div className="inner">
                            { (open || closing) ? renderedChildComponent : null }
                        </div>
                    </Collapse>
                </div>
            );
        }

        return (
            <div className={outerClassName} id={id}>
                { section && section.title ?
                    <HeaderWithLink className="section-title" link={id} context={context}>{ section.title }</HeaderWithLink>
                    : null }
                { renderedChildComponent }
            </div>
        );
    }

}

/**
 * This component shows an alert on mount if have been redirected from a different page, and
 * then renders out a list of StaticEntry components within a Wrapper in its render() method.
 * May be used by extending and then overriding the render() method.
 */
export class StaticPageBase extends React.PureComponent {

    static Wrapper = Wrapper

    static renderSections(renderMethod, parsedContent, props){
        if (!parsedContent || !parsedContent.content || !Array.isArray(parsedContent.content)){
            console.error('No content defined for page', parsedContent);
            return null;
        }
        return _.map(
            parsedContent.content,
            function(section){
                return renderMethod(section.id || section.name, section, props);
            }
        );
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

        /**
         * Default function for rendering out parsed section(s) content.
         *
         * @param {string} sectionName - Unique identifier of the section. Use to navigate to via '#<sectionName>' in URL.
         * @param {{ content : string|JSX.Element }} section - Object with parsed content, title, etc.
         * @param {Object} props - Collection of props passed down from BodyElement.
         */
        'entryRenderFxn' : memoize(function(sectionName, section, props){
            return (
                <StaticEntry {...props} key={sectionName} sectionName={sectionName} section={section} />
            );
        })
    };

    static propTypes = {
        'context' : PropTypes.shape({
            "title" : PropTypes.string,
            "content" : PropTypes.any.isRequired,
            "table-of-contents" : PropTypes.object
        }).isRequired,
        'entryRenderFxn' : PropTypes.func.isRequired,
        'contentParseFxn' : PropTypes.func.isRequired,
        'href' : PropTypes.string
    };

    constructor(props){
        super(props);
        this.maybeSetRedirectedAlert = this.maybeSetRedirectedAlert.bind(this);
    }

    componentDidMount(){
        this.maybeSetRedirectedAlert();
    }

    /**
     * A simpler form (minus AJAX request) of DefaultItemView's similar method.
     */
    maybeSetRedirectedAlert(){
        const { href } = this.props;
        if (!href) return;

        const hrefParts = url.parse(href, true);
        const redirected_from = hrefParts.query && hrefParts.query.redirected_from;

        if (redirected_from){
            setTimeout(function(){
                Alerts.queue({
                    'title' : "Redirected",
                    'message': <span>You have been redirected from old page <span className="text-500">{ redirected_from }</span> to <span className="text-500">{ hrefParts.pathname }</span>. Please update your bookmarks.</span>,
                    'style': 'warning'
                });
            }, 0);
        }
    }

    render(){
        const { context, entryRenderFxn, contentParseFxn } = this.props;
        let parsedContent = null;
        try {
            parsedContent = contentParseFxn(context);
        } catch (e) {
            console.dir(e);
            parsedContent = _.extend({}, context, { 'content' : [ { 'content' : '<h4>Error - ' + e.message + '</h4>Check Page content/sections.', 'name' : 'error' } ] });
        }
        const tableOfContents = (parsedContent && parsedContent['table-of-contents'] && parsedContent['table-of-contents'].enabled) ? parsedContent['table-of-contents'] : false;
        return (
            <Wrapper
                {..._.pick(this.props, 'navigate', 'windowWidth', 'windowHeight', 'registerWindowOnScrollHandler', 'href')}
                key="page-wrapper" title={parsedContent.title}
                tableOfContents={tableOfContents} context={parsedContent}>
                { StaticPageBase.renderSections(entryRenderFxn, parsedContent, this.props) }
            </Wrapper>
        );
    }
}
