'use strict';

import React from 'react';
import _ from 'underscore';


/**
 * Renders out a single "facet - term" box for when only 1 term
 * is available (not filterable) at bottom of FacetList.
 */
export const StaticSingleTerm = React.memo(function StaticSingleTerm({ term, facet, showTitle, filtering, onClick, getTermStatus, extraClassname, termTransformFxn }){
    const { description = null, field } = facet;
    const status = getTermStatus(term, facet);
    const selectedOrOmitted = (status !== 'none');
    const statusClassName = selectedOrOmitted ? (status === 'selected' ? 'selected' : 'omitted') : '';
    let termName = termTransformFxn(field, term.key);

    if (!termName || termName === 'null' || termName === 'undefined'){
        termName = 'None';
    }

    return (
        <div className={"facet static " + statusClassName + ( filtering ? ' filtering' : '') + ( extraClassname ? ' ' + extraClassname : '' )}
            data-field={field}>
            <div className="facet-static-row clearfix">
                <h5 className="facet-title">
                    <span className="inline-block" data-tip={description} data-place="right">&nbsp;{ showTitle }</span>
                </h5>
                <div className={ "facet-item term " + statusClassName + (filtering ? ' filtering' : '')}>
                    <span onClick={onClick} title={
                        'All results ' + (status !== 'omitted' ? 'have ' : 'omitted ') +
                        term.key +
                        (status !== 'omitted' ? ' as their ' : ' from their ') +
                        showTitle.toLowerCase() + '; ' +
                        (selectedOrOmitted ?
                            'currently active as portal-wide filter.' :
                            'not currently active as portal-wide filter.'
                        )
                    }>
                        <i className={"icon icon-fw " +
                            (filtering ? 'icon-spin icon-circle-notch' :
                                ( selectedOrOmitted ? (status === 'selected' ? 'icon-times-circle fas' : 'icon-minus-circle fas') : 'icon-circle fas' )
                            )
                        }/>
                        { termName }
                    </span>
                </div>
            </div>
        </div>
    );
});