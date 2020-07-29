'use strict';

import React from 'react';
import _ from 'underscore';
import { console } from './../util';


/**
 * Reusable Component for showing Aliases, External References, etc.
 * Shown at bottom of Item pages.
 *
 * @class ItemFooterRow
 * @type {Component}
 * @prop {Object} context - JSON representation of current Item object. Should be available through Redux store's context.
 * @prop {Object} schemas - JSON representation of sitewide schemas.
 */
export const ItemFooterRow = React.memo(function ItemFooterRow({ context, schemas, external_references = [] }) {
    const { aliases = [], actions = [], alternate_accessions = [] } = context || {};
    const externalReferences = external_references || context.external_references || [];

    if (externalReferences.length === 0 && alternate_accessions.length === 0) {
        return null;
    }

    return (
        <React.Fragment>
            <hr className="mb-08 mt-1"/>
            <div className="row">
                <ExternalReferencesSection context={context} externalReferences={externalReferences} />
                {/* <AliasesSection context={context} aliases={aliases} actions={actions} /> */}
                <AlternateAccessionSection context={context} alternateAccessions={alternate_accessions} />
            </div>
        </React.Fragment>
    );
});


function ExternalReferencesSection({ externalReferences }) {
    if (externalReferences.length === 0) {
        return null;
    }

    let content = null;

    const anyTitleFound = _.any(externalReferences, (ef) => ef.title);
    if (!anyTitleFound) {
        content = (
            <ul>
                {_.map(externalReferences, function (extRef, i) {
                    return (
                        <React.Fragment>
                            <li key={i}>
                                {typeof extRef.ref === 'string' ?
                                    <ExternalReferenceLink uri={extRef.uri || null}>{extRef.ref}</ExternalReferenceLink> : extRef
                                }
                            </li>
                        </React.Fragment>
                    );
                })}
            </ul>);
    }
    else {
        const externalReferencesGroupedByTitle = _.groupBy(externalReferences, (ef) => ef.title || null);
        const titles = _.keys(externalReferencesGroupedByTitle);

        content = _.map(titles, (title) => {
            const subContent = (
                <ul>
                    {_.map(externalReferencesGroupedByTitle[title], function (extRef, i) {
                        return (

                            <li key={i}>
                                {typeof extRef.ref === 'string' ?
                                    <ExternalReferenceLink uri={extRef.uri || null}>{extRef.ref}</ExternalReferenceLink> : extRef
                                }
                            </li>

                        );
                    })}
                </ul>
            );
            return (
                <React.Fragment>
                    <h6 className="info-panel-label">{title}</h6>
                    {subContent}
                </React.Fragment>
            );
        });
        // <ul>
        //     {_.map(externalReferences, function (extRef, i) {
        //         return (
        //             <React.Fragment>
        //                 <li key={i}>
        //                     {typeof extRef.ref === 'string' ?
        //                         <ExternalReferenceLink uri={extRef.uri || null}>{extRef.ref}</ExternalReferenceLink> : extRef
        //                     }
        //                 </li>
        //             </React.Fragment>
        //         );
        //     })}
        // </ul>);
    }
    return (
        <div className="col col-12 col-md-6">
            <h4 className="text-300">External References</h4>
            <div className={anyTitleFound ? 'formatted-info-panel' : null}>{content}</div>
        </div>
    );
}

function AlternateAccessionSection({ alternateAccessions }){
    if (alternateAccessions.length === 0){
        return null;
    }
    return (
        <div className="col col-12 col-md-6">
            <h4 className="text-300">Alternate Accessions</h4>
            <div>
                <ul>
                    { _.map(alternateAccessions, function(altAccession, i){
                        return (
                            <li key={i}>{ altAccession }</li>
                        );
                    }) }
                </ul>
            </div>
        </div>
    );
}

function AliasesSection({ aliases, actions }){
    if (aliases.length === 0) return null;

    if (!_.find(actions, { 'name' : 'edit' })) return null; // No 'Edit' action for this Item.

    return (
        <div>
            <h4 className="text-500">Aliases</h4>
            <div>
                <ul>
                    { _.map(aliases, function(alias, i){
                        return (
                            <li key={i}>{ alias }</li>
                        );
                    }) }
                </ul>
            </div>
        </div>
    );
}


/**
 * Used to display an external reference link.
 *
 * @prop {Component[]|Element[]|string[]} children - Inner contents or title of link.
 * @prop {string} uri - The href for the link.
 */
export function ExternalReferenceLink({ uri, children }){
    if (!uri || (typeof uri === 'string' && uri.length < 8)){
        // < 8 because that's minimum we need for a URL (e.g. 'http://' is first 7 chars)
        return <span className="external-reference">{ children }</span>;
    }

    return (
        <a href={uri} target="_blank" rel="noopener noreferrer" className="external-reference">{ children }</a>
    );
}
