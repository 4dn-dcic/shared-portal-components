'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import { FacetTermsList } from './FacetTermsList';
import { StaticSingleTerm } from './StaticSingleTerm';

/**
 * Component to render out the FacetList for the Browse and ExperimentSet views.
 * It can work with AJAX-ed in back-end data, as is used for the Browse page, or
 * with client-side data from back-end-provided Experiments, as is used for the ExperimentSet view.
 *
 * Some of this code is not super clean and eventually could use some refactoring.
 *
 * @module {Component} facetlist
 */



/**
 * Used to render individual facet fields and their available terms in FacetList.
 */
export class TermsFacet extends React.PureComponent {

    static isStatic(facet){
        const { terms = null, total = 0 } = facet;
        return (
            Array.isArray(terms) &&
            terms.length === 1 &&
            total <= _.reduce(terms, function(m, t){ return m + (t.doc_count || 0); }, 0)
        );
    }

    constructor(props){
        super(props);
        this.handleStaticClick = this.handleStaticClick.bind(this);
        this.handleTermClick = this.handleTermClick.bind(this);

        this.state = { 'filtering' : false };
    }

    /**
     * For cases when there is only one option for a facet - we render a 'static' row.
     * This may change in response to design.
     * Unlike in `handleTermClick`, we handle own state/UI here.
     *
     * @todo Allow to specify interval for histogram & date_histogram in schema instead of hard-coding 'month' interval.
     */
    handleStaticClick(e) {
        const { facet, isStatic } = this.props;
        const term = facet.terms[0]; // Would only have 1

        e.preventDefault();
        if (!isStatic) return false;

        this.setState({ 'filtering' : true }, () => {
            this.handleTermClick(facet, term, e, () =>
                this.setState({ 'filtering' : false })
            );
        });

    }

    /**
     * Each Term component instance provides their own callback, we just route the navigation request.
     *
     * @todo Allow to specify interval for histogram & date_histogram in schema instead of hard-coding 'month' interval.
     */
    handleTermClick(facet, term, e, callback) {
        const { onFilter, href } = this.props;
        onFilter(facet, term, callback, false, href);
    }

    render() {
        const {
            facet, terms, getTermStatus, extraClassname, termTransformFxn, separateSingleTermFacets,
            isStatic
        } = this.props;
        const { filtering } = this.state;
        const { field, title, description = null } = facet || {};

        const showTitle = title || field;

        if (separateSingleTermFacets && isStatic){
            // Only one term exists.
            return <StaticSingleTerm {...{ facet, term : terms[0], filtering, showTitle, onClick : this.handleStaticClick, getTermStatus, extraClassname, termTransformFxn }} />;
        } else {
            return <FacetTermsList {...this.props} onTermClick={this.handleTermClick} tooltip={description} title={showTitle} />;
        }

    }
}
TermsFacet.propTypes = {
    'facet'                 : PropTypes.shape({
        'field'                 : PropTypes.string.isRequired,    // Name of nested field property in experiment objects, using dot-notation.
        'title'                 : PropTypes.string,               // Human-readable Facet Term
        'total'                 : PropTypes.number,               // Total experiments (or terms??) w/ field
        'terms'                 : PropTypes.array.isRequired,     // Possible terms,
        'description'           : PropTypes.string,
        'aggregation_type'      : PropTypes.oneOf(["stats", "terms"])
    }),
    'defaultFacetOpen'      : PropTypes.bool,
    'onFilter'              : PropTypes.func,           // Executed on term click
    'extraClassname'        : PropTypes.string,
    'schemas'               : PropTypes.object,
    'getTermStatus'         : PropTypes.func.isRequired,
    'href'                  : PropTypes.string.isRequired,
    'filters'               : PropTypes.arrayOf(PropTypes.object).isRequired,
    'mounted'               : PropTypes.bool
};
