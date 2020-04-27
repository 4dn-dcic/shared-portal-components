import React, { useMemo } from 'react';
import url from 'url';
import queryString from 'querystring';
import { navigate as globalPageNavigate } from './../../../util/navigate';
import { getItemType, getTitleForType } from './../../../util/schema-transforms';
import { getNestedProperty, itemUtil } from './../../../util/object';
import { productClick as trackProductClick, hrefToListName } from './../../../util/analytics';
import { LocalizedTime } from './../../../ui/LocalizedTime';


export const DEFAULT_WIDTH_MAP = { 'lg' : 200, 'md' : 180, 'sm' : 120, 'xs' : 120 };

export const basicColumnExtensionMap = {
    'display_title' : {
        'title' : "Title",
        'widthMap' : { 'lg' : 280, 'md' : 250, 'sm' : 200 },
        'minColumnWidth' : 90,
        'order' : -100,
        'render' : function renderDisplayTitleColumn(result, parentProps){
            return <DisplayTitleColumn {...parentProps} result={result} />;
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
        'colTitle' : 'Created',
        'widthMap' : { 'lg' : 140, 'md' : 120, 'sm' : 120 },
        'render' : function dateCreatedTitle(result, props){
            if (!result.date_created) return null;
            return (
                <span className="value">
                    <LocalizedTime timestamp={result.date_created} formatType="date-sm" />
                </span>
            );
        },
        'order' : 510
    },
    'last_modified.date_modified' : {
        'title' : 'Date Modified',
        'widthMap' : { 'lg' : 140, 'md' : 120, 'sm' : 120 },
        'render' : function lastModifiedDate(result, props){
            const { last_modified : { date_modified = null } = {} } = result;
            if (!date_modified) return null;
            return (
                <span className="value">
                    <LocalizedTime timestamp={date_modified} formatType="date-sm" />
                </span>
            );
        },
        'order' : 515
    }
};


/**
 * @todo
 * Think about how to more easily customize this for different Item types.
 * Likely make reusable component containing handleClick and most of its UI...
 * which this and portals can use for "display_title" column, and then have per-type
 * overrides/extensions.
 */
export const DisplayTitleColumn = React.memo(function DisplayTitleColumn(props){
    const {
        result,
        columnDefinition, termTransformFxn, width,
        href, context, rowNumber, detailOpen, toggleDetailOpen
    } = props;

    // `href` and `context` reliably refer to search href and context here, i.e. will be passed in from VirtualHrefController.
    let title = itemUtil.getTitleStringFromContext(result); // Gets display_title || title || accession || ...

    // Monospace accessions, file formats
    const shouldMonospace = (itemUtil.isDisplayTitleAccession(result, title) || (result.file_format && result.file_format === title));
    const link = itemUtil.atId(result);
    const tooltip = (title && (title.length > 20 || width < 100) && title) || null;
    let hasPhoto = false;


    /** Registers a list click event for Google Analytics then performs navigation. */
    const onClick = useMemo(function(){
        return function handleClick(evt){
            evt.preventDefault();
            evt.stopPropagation();
            trackProductClick(
                result,
                { list : hrefToListName(href), position: rowNumber + 1 },
                function(){
                    // We explicitly use globalPageNavigate here and not props.navigate, as props.navigate might refer
                    // to VirtualHrefController.virtualNavigate and would not bring you to new page.
                    globalPageNavigate(link);
                },
                context
            );
            return false;
        };
    }, [ link, rowNumber ]);

    if (link){ // This should be the case always
        title = <a key="title" href={link || '#'} onClick={onClick}>{ title }</a>;
        if (typeof result.email === 'string' && result.email.indexOf('@') > -1){
            // Specific case for User items. May be removed or more cases added, if needed.
            hasPhoto = true;
            title = (
                <React.Fragment>
                    { itemUtil.User.gravatar(result.email, 32, { 'className' : 'in-search-table-title-image', 'data-tip' : result.email }, 'mm') }
                    { title }
                </React.Fragment>
            );
        }
    }

    const cls = (
        "title-block"
        + (hasPhoto ? " has-photo d-flex align-items-center"
            : " text-ellipsis-container"
        )
        + (shouldMonospace ? " text-monospace text-small" : "")
    );

    return (
        <React.Fragment>
            <TableRowToggleOpenButton open={detailOpen} onClick={toggleDetailOpen} />
            <div key="title-container" className={cls} data-tip={tooltip}>
                { title }
            </div>
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

