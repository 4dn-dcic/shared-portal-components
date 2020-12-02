'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';

import { getSchemaProperty } from './../../../util/schema-transforms';
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

    constructor(props){
        super(props);
        this.handleStaticClick = this.handleStaticClick.bind(this);
        this.handleTermClick = this.handleTermClick.bind(this);

        this.state = { 'filtering' : false };
        this.memoized = {
            fieldSchema: memoize(getSchemaProperty)
        };
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
        const { onFilter } = this.props;
        onFilter(facet, term, callback);
    }

    render() {
        const {
            facet, getTermStatus, extraClassname, termTransformFxn, separateSingleTermFacets,
            isStatic, schemas, itemTypeForSchemas
        } = this.props;
        const { field, terms } = facet;
        const { filtering } = this.state;
        // `fieldSchema` may be null esp. if field is 'fake'.
        const fieldSchema = this.memoized.fieldSchema(field, schemas, itemTypeForSchemas);

        if (separateSingleTermFacets && isStatic){
            // Only one term exists.
            return (
                <StaticSingleTerm {...{ fieldSchema, facet, filtering, getTermStatus, extraClassname, termTransformFxn }}
                    term={terms[0]} onClick={this.handleStaticClick} />
            );
        } else {
            return <FacetTermsList {...this.props} fieldSchema={fieldSchema} onTermClick={this.handleTermClick} />;
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
    'windowWidth'           : PropTypes.number
};
