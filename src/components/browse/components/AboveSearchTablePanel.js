'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { BasicStaticSectionBody } from './../../static-pages/BasicStaticSectionBody';


export const AboveSearchTablePanel = React.memo(function AboveSearchTablePanel({ context, placeholderReplacementFxn }) {
    const { search_header } = context;

    if (!search_header) return null;

    // TODO: Add in custom front-end controls if/when applicable.
    // If we migrate 'full screen', 'select x for download' etc buttons/controls here (desireable) we need to make sure it communicates with external state container for the SearchResultTable.
    // SearchResultTable would likely need to expose some functions which would be accessible via instance reference to SearchResultTable and passed up as callback props into this one.

    return (
        <div className="above-table-panel">
            <SearchHeaderSection {...search_header} placeholderReplacementFxn={placeholderReplacementFxn} />
        </div>
    );
});
AboveSearchTablePanel.propTypes = {
    'href' : PropTypes.string.isRequired,
    'context' : PropTypes.object.isRequired,
    'placeholderReplacementFxn' : PropTypes.func
};



function SearchHeaderSection({ title: propTitle, content: propContent, filetype, placeholderReplacementFxn }) {
    const title = (propTitle ? <h4 className="text-300">{propTitle}</h4> : null);
    const content = (propContent ? <BasicStaticSectionBody {...{ content: propContent, placeholderReplacementFxn }} filetype={filetype || 'txt'} /> : null);

    return content ? (
        <div className="row mt-1">
            <div className="col-12 col-lg-9 pull-right">
                {title}
                {content}
            </div>
        </div>
    ) : null;
}
