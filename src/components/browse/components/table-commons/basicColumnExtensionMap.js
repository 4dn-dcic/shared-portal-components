import React, { useMemo } from 'react';
import url from 'url';
import queryString from 'querystring';
import { navigate as globalPageNavigate } from './../../../util/navigate';
import { getItemType, getTitleForType } from './../../../util/schema-transforms';
import { getNestedProperty, itemUtil } from './../../../util/object';
import { productClick as trackProductClick, hrefToListName } from './../../../util/analytics';
import { LocalizedTime } from './../../../ui/LocalizedTime';
import { elementIsChildOfLink } from '../../../../../es/components/util/layout';


export const DEFAULT_WIDTH_MAP = { 'lg' : 200, 'md' : 180, 'sm' : 120, 'xs' : 120 };

export const basicColumnExtensionMap = {
    'display_title' : {
        'title' : "Title",
        'widthMap' : { 'lg' : 280, 'md' : 250, 'sm' : 200 },
        'minColumnWidth' : 90,
        'order' : -100,
        'render' : function renderDisplayTitleColumn(result, parentProps){
            const { href, context, rowNumber, detailOpen, toggleDetailOpen, targetTabKey } = parentProps;
            const { '@type' : itemTypeList = ["Item"] } = result;
            let renderElem;
            if (itemTypeList[0] === "User") {
                renderElem = <DisplayTitleColumnUser {...{ result }}/>;
            } else {
                renderElem = <DisplayTitleColumnDefault {...{ result, targetTabKey }}/>;
            }
            return (
                <DisplayTitleColumnWrapper {...{ result, href, context, rowNumber, detailOpen, toggleDetailOpen }}>
                    { renderElem }
                </DisplayTitleColumnWrapper>
            );
        }
    },
    '@type' : {
        'noSort' : true,
        'order' : -80,
        'render' : function(result, props){
            if (!Array.isArray(result['@type'])) return null;
            const { schemas = null, href = null, navigate: propNavigate = null } = props;
            const leafItemType = getItemType(result);
            const itemTypeTitle = getTitleForType(leafItemType, schemas);
            const onClick = function(e){
                // Preserve search query, if any, but remove filters (which are usually per-type).
                if (!href || href.indexOf('/search/') === -1) return;
                e.preventDefault();
                e.stopPropagation();
                const urlParts = url.parse(href, true);
                const query = { ...urlParts.query, 'type' : leafItemType };
                if (urlParts.query.q) query.q = urlParts.query.q;
                const nextHref = '/search/?' + queryString.stringify(query);
                // We use props.navigate here first which may refer to VirtualHrefController.virtualNavigate
                // since we're navigating to a search href here.
                (propNavigate || globalPageNavigate)(nextHref);
            };

            return (
                <React.Fragment>
                    <div className="icon-container">
                        <i className="icon icon-fw fas icon-filter clickable mr-08" onClick={onClick} data-tip={"Filter down to only " + itemTypeTitle}/>
                    </div>
                    <span className="item-type-title value">{ itemTypeTitle }</span>
                </React.Fragment>
            );
        }
    },
    'date_created' : {
        'title' : 'Date Created',
        'colTitle' : 'Date Created',
        'widthMap' : { 'lg' : 140, 'md' : 120, 'sm' : 120 },
        'render' : function dateCreatedTitle(result, props){
            const { date_created } = result;
            if (!date_created) return null;
            return (
                <span className="value text-right">
                    <LocalizedTime timestamp={result.date_created} formatType="date-sm" />
                </span>
            );
        },
        'order' : 510
    },
    'last_modified.date_modified' : {
        'title' : 'Date Modified',
        'colTitle' : 'Date Modified',
        'widthMap' : { 'lg' : 140, 'md' : 120, 'sm' : 120 },
        'render' : function lastModifiedDate(result, props){
            const { last_modified : { date_modified = null } = {} } = result;
            if (!date_modified) return null;
            return (
                <span className="value text-right">
                    <LocalizedTime timestamp={date_modified} formatType="date-sm" />
                </span>
            );
        },
        'order' : 515
    }
};



export const DisplayTitleColumnUser = React.memo(function DisplayTitleColumnUser({ result, link, onClick }){
    const { email = null } = result;

    // `href` and `context` reliably refer to search href and context here, i.e. will be passed in from VirtualHrefController.
    let title = itemUtil.getTitleStringFromContext(result); // Gets display_title || title || accession || ...

    const tooltip = (typeof title === "string" && title.length > 20 && title) || null;
    let hasPhoto = false;

    if (link){ // This should be the case always
        title = <a key="title" href={link || '#'} onClick={onClick}>{ title }</a>;
        if (typeof email === 'string' && email.indexOf('@') > -1){
            // Specific case for User items. May be removed or more cases added, if needed.
            hasPhoto = true;
            title = (
                <React.Fragment>
                    { itemUtil.User.gravatar(email, 32, { 'className' : 'in-search-table-title-image', 'data-tip' : email }, 'mm') }
                    { title }
                </React.Fragment>
            );
        }
    }

    const cls = (
        "title-block"
        + (hasPhoto ? " has-photo d-flex align-items-center" : " text-truncate")
    );

    return (
        <div key="title-container" className={cls} data-tip={tooltip} data-delay-show={750}>
            { title }
        </div>
    );

});

/**
 * @todo
 * Think about how to more easily customize this for different Item types.
 * Likely make reusable component containing handleClick and most of its UI...
 * which this and portals can use for "display_title" column, and then have per-type
 * overrides/extensions.
 */
export const DisplayTitleColumnDefault = React.memo(function DisplayTitleColumnDefault(props){
    const { result, link: propLink, onClick, className = null, targetTabKey = null } = props;

    let title = itemUtil.getTitleStringFromContext(result); // Gets display_title || title || accession || ...

    // Monospace accessions, file formats
    const shouldMonospace = (itemUtil.isDisplayTitleAccession(result, title) || (result.file_format && result.file_format === title));
    const tooltip = (typeof title === "string" && title.length > 20 && title) || null;

    if (propLink){ // This should be the case always
        let link = propLink;
        if (targetTabKey && typeof targetTabKey === 'string'){
            link = `${propLink}#${targetTabKey}`;
        }
        title = <a key="title" href={link || '#'} onClick={onClick}>{title}</a>;
    }

    const cls = (
        "title-block text-truncate"
        + (shouldMonospace ? " text-monospace text-small" : "")
        + (className ? " " + className : "")
    );

    return (
        <div key="title-container" className={cls} data-tip={tooltip} data-delay-show={750}>
            { title }
        </div>
    );
});

export const DisplayTitleColumnWrapper = React.memo(function(props){
    const {
        result,
        children,
        //columnDefinition, termTransformFxn, width,
        href = null,
        context,
        rowNumber, detailOpen, toggleDetailOpen
    } = props;

    const link = itemUtil.atId(result);

    /** Registers a list click event for Google Analytics then performs navigation. */
    const onClick = useMemo(function(){
        return function handleClick(evt){
            const { target = null } = evt || {};
            let targetUrl;

            if (target && target.href) {
                targetUrl = target.href;
            } else if (target && !target.href) {
                // Check parent for hrefs if none found on current evt.target
                const linkElement = elementIsChildOfLink(target);
                const { href = null } = linkElement || {};
                if (href) { targetUrl = href; }
            }

            const navTarget = targetUrl || link; // Fallback to atId if no href found
            evt.preventDefault();
            evt.stopPropagation();
            const useHref = href || (window && window.location.href) || null;
            trackProductClick(
                result,
                { list : hrefToListName(useHref), position: rowNumber + 1 },
                function(){
                    // We explicitly use globalPageNavigate here and not props.navigate, as props.navigate might refer
                    // to VirtualHrefController.virtualNavigate and would not bring you to new page.
                    globalPageNavigate(navTarget);
                },
                context
            );
            return false;
        };
    }, [ link, rowNumber ]);

    const renderChildren = React.Children.map(children, function(child){
        if (!React.isValidElement(child) || typeof child.type === "string") {
            return child;
        }
        return React.cloneElement(child, { link, onClick, result });
    });

    return (
        <React.Fragment>
            <TableRowToggleOpenButton open={detailOpen} onClick={toggleDetailOpen} />
            { renderChildren }
        </React.Fragment>
    );
});


/** Button shown in first column (display_title) to open/close detail pane. */
export const TableRowToggleOpenButton = React.memo(function TableRowToggleOpenButton({ onClick, toggleDetailOpen, open }){
    return (
        <div className="toggle-detail-button-container">
            <button type="button" className="toggle-detail-button" onClick={onClick || toggleDetailOpen}>
                <div className="icon-container">
                    <i className={"icon icon-fw fas icon-" + (open ? 'minus' : 'plus') }/>
                </div>
            </button>
        </div>
    );
});

