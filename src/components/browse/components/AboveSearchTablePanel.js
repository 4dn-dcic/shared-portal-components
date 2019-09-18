'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import _ from 'underscore';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { load } from './../../util/ajax';
import { getAbstractTypeForType } from './../../util/schema-transforms';

/** TODO IMPROVE */

class AboveSearchTablePanelStaticContentPane extends React.Component {

    static isTargetHrefValid(targetHref){
        if (typeof targetHref === 'string') return true;
        return false;
    }

    constructor(props){
        super(props);
        this.state = { 'content' : null, 'title' : null };
        this.loadStaticContent();
    }

    componentDidUpdate(pastProps, pastState){
        if (AboveSearchTablePanelStaticContentPane.isTargetHrefValid(this.props.targetHref) && this.props.targetHref !== pastProps.targetHref){
            this.loadStaticContent();
        }
    }

    loadStaticContent(){
        const { targetHref } = this.props;
        if (!AboveSearchTablePanelStaticContentPane.isTargetHrefValid(targetHref)){ return null; }

        const callback = (resp) => {
            if (!resp || (resp.code && (resp.code === 403 || resp.code === 404))){
                this.setState(function({ content }){
                    if (content !== null){
                        return { content : null, title : null };
                    }
                    return null;
                });
                return null;
            }

            let content = null;
            let title = null;
            // TODO: Likely need to adjust for static block once we have those (once it exists it wont have sections).

            if (resp && resp.content){
                if (resp.content && typeof resp.content !== 'string' && resp['@type'].indexOf('StaticPage') > -1){ // Case: Static Page
                    var contentSectionKeys = _.keys(resp.content);
                    if (contentSectionKeys.length > 0){
                        // Use first section only, at moment.
                        var contentSectionToUse = _.find(resp.content, function(c){ return c.order === 0; }) || resp.content[contentSectionKeys[0]];
                        content = contentSectionToUse.content;
                        title = contentSectionToUse.title || resp.title || resp.display_title;
                    }
                } else if (typeof resp.content === 'string'){ // Case: Static Block
                    content = resp.content;
                    title = resp.display_title || resp.title;
                }
            }

            if (content){
                this.setState({ content, title });
            }
        };

        load(targetHref, callback, 'GET', callback);
    }

    render(){
        if (!this.state.content || !AboveSearchTablePanelStaticContentPane.isTargetHrefValid(this.props.targetHref)) return null;

        var title = null;
        if (this.state.title){
            title = (
                <h4 className="text-300">
                    { this.state.title }
                </h4>
            );
        }

        return (
            <div className="row mt-1">
                <div className="col-12 col-lg-9 pull-right">
                    { title }
                    <div dangerouslySetInnerHTML={{ __html : this.state.content }} />
                </div>
            </div>
        );
    }

}

let cachedMapping = null;

export class AboveSearchTablePanel extends React.PureComponent {

    static currentItemTypesFromHrefParts(urlParts, schemas){
        var searchItemType = 'Item', abstractType;
        if (typeof urlParts.query.type === 'string') { // Non-empty
            if (urlParts.query.type !== 'Item') {
                searchItemType = urlParts.query.type;
            }
        }

        abstractType = getAbstractTypeForType(searchItemType, schemas);
        return { searchItemType, abstractType };
    }

    constructor(props){
        super(props);
        this.state = {
            'mapping' : cachedMapping || null
        };
    }

    componentDidMount(){
        if (!this.state.mapping && typeof this.props.mappingLocation === 'string'){
            load(this.props.mappingLocation, (resp)=>{
                if (resp && resp.mapping && _.keys(resp.mapping).length > 0){
                    this.setState({
                        'mapping' : resp.mapping
                    });
                    if (this.props.cacheMappingGlobally) {
                        cachedMapping = resp.mapping;
                    }
                }
            });
        }
    }

    routeStaticContentHref(){
        const { href: contextHref, context, schemas } = this.props;
        const { mapping: lookupMap } = this.state;
        let targetHref = null; // Our return val. Null by default.

        // 1. By Type v. lookup map
        const urlParts = url.parse(contextHref, true);
        const { searchItemType, abstractType } = AboveSearchTablePanel.currentItemTypesFromHrefParts(urlParts, schemas);
        targetHref = (lookupMap && (lookupMap[abstractType] || lookupMap[searchItemType])) || null;
        if (typeof targetHref === 'string'){
            return targetHref;
        }

        // 2. TBD. By URL or other parameters or something.


        // 3. Fallback/default/null
        return null;

    }

    render(){

        // TODO: Add in custom front-end controls if/when applicable.
        // If we migrate 'full screen', 'select x for download' etc buttons/controls here (desireable) we need to make sure it communicates with external state container for the SearchResultTable.
        // SearchResultTable would likely need to expose some functions which would be accessible via instance reference to SearchResultTable and passed up as callback props into this one.

        return (
            <div className="above-table-panel">
                <AboveSearchTablePanelStaticContentPane targetHref={this.routeStaticContentHref()} />
            </div>
        );
    }
}

AboveSearchTablePanel.propTypes = {
    'href' : PropTypes.string.isRequired,
    'context' : PropTypes.object.isRequired,
    'mappingLocation' : PropTypes.any, // String or null
    'cacheMappingGlobally' : PropTypes.bool
};

AboveSearchTablePanel.defaultProps = {
    "mappingLocation" : "/sysinfos/search-header-mappings/",
    "cacheMappingGlobally" : true
};
