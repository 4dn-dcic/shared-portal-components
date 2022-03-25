import React from 'react';
import _ from 'underscore';


/**
 * Renders out a single "facet - term" box for when only 1 term
 * is available (not filterable) at bottom of FacetList.
 *
 * @todo
 * Implement/use ExtendedDescriptionPopoverIcon (mostly layouting task here), @see FacetTermsList' layout.
 * Deferred until we actually have any extended_descriptions in 4DN, which is only place where StaticSingleTerm
 * is used.
 */
export const StaticSingleTerm = React.memo(function StaticSingleTerm(props){
    const { fieldSchema, term, facet, filtering, onClick, getTermStatus, extraClassname, termTransformFxn } = props;
    const { title: facetTitle, description: facetSchemaDescription = null, field } = facet;
    const status = getTermStatus(term, facet);
    const selectedOrOmitted = (status !== 'none');
    const statusClassName = selectedOrOmitted ? (status === 'selected' ? 'selected' : 'omitted') : '';
    let termName = termTransformFxn(field, term.key);


    const { title: fieldTitle, description: fieldSchemaDescription } = fieldSchema || {}; // fieldSchema not present if no schemas loaded yet or if fake/calculated 'field'/column.
    const title = facetTitle || fieldTitle || field;
    const cls = "facet static " + statusClassName + ( filtering ? ' filtering' : '') + ( extraClassname ? ' ' + extraClassname : '' );
    const iconCls = (
        "icon icon-fw " +
        (filtering ? 'icon-spin icon-circle-notch' :
            ( selectedOrOmitted ? (status === 'selected' ? 'icon-times-circle fas' : 'icon-minus-circle fas') : 'icon-circle fas' )
        )
    );

    if (!termName || termName === 'null' || termName === 'undefined'){
        termName = 'None';
    }

    return (
        <div className={cls} data-field={field}>
            <div className="facet-static-row clearfix">
                <h5 className="facet-title">
                    <span className="d-inline-block" data-tip={facetSchemaDescription || fieldSchemaDescription} data-place="right">
                        &nbsp;{ title }
                    </span>
                </h5>
                <div className={ "facet-item term " + statusClassName + (filtering ? ' filtering' : '')}>
                    <span onClick={onClick} title={
                        'All results ' + (status !== 'omitted' ? 'have ' : 'omitted ') +
                        term.key +
                        (status !== 'omitted' ? ' as their ' : ' from their ') +
                        title.toLowerCase() + '; ' +
                        (selectedOrOmitted ?
                            'currently active as portal-wide filter.' :
                            'not currently active as portal-wide filter.'
                        )
                    }>
                        <i className={iconCls}/>{ termName }
                    </span>
                </div>
            </div>
        </div>
    );
});
