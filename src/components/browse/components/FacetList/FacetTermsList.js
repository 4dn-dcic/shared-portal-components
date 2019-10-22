'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';

import { Collapse } from './../../../ui/Collapse';
import { Fade } from './../../../ui/Fade';
import { PartialList } from './../../../ui/PartialList';



/**
 * Used to render individual terms in FacetList.
 */
export class Term extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleClick = _.debounce(this.handleClick.bind(this), 500, true);
        this.state = {
            'filtering' : false
        };
    }

    handleClick(e) {
        var { facet, term, onClick } = this.props;
        e.preventDefault();
        this.setState({ 'filtering' : true }, () => {
            onClick(facet, term, e, () => this.setState({ 'filtering' : false }));
        });
    }

    /**
     * INCOMPLETE -
     *   For future, in addition to making a nice date range title, we should
     *   also ensure that can send a date range as a filter and be able to parse it on
     *   back-end.
     * Handle date fields, etc.
     */
    /*
    customTitleRender(){
        const { facet, term, termTransformFxn } = this.props;

        if (facet.aggregation_type === 'range'){
            return (
                (typeof term.from !== 'undefined' ? termTransformFxn(facet.field, term.from, true) : '< ') +
                (typeof term.from !== 'undefined' && typeof term.to !== 'undefined' ? ' - ' : '') +
                (typeof term.to !== 'undefined' ? termTransformFxn(facet.field, term.to, true) : ' >')
            );
        }

        if (facet.aggregation_type === 'date_histogram'){
            var interval = Filters.getDateHistogramIntervalFromFacet(facet);
            if (interval === 'month'){
                return <DateUtility.LocalizedTime timestamp={term.key} formatType="date-month" localize={false} />;
            }
        }

        return null;
    }
    */

    render() {
        const { term, facet, getTermStatus, termTransformFxn } = this.props;
        const { filtering } = this.state;
        const status = getTermStatus(term, facet);
        const selected = (status !== 'none');
        const count = (term && term.doc_count) || 0;
        let title = termTransformFxn(facet.field, term.key) || term.key;
        let icon = null;

        if (filtering) {
            icon = <i className="icon fas icon-circle-notch icon-spin icon-fw" />;
        } else if (status === 'selected') {
            icon = <i className="icon icon-times-circle icon-fw fas" />;
        } else if (status === 'omitted') {
            icon = <i className="icon icon-minus-circle icon-fw fas" />;
        } else {
            icon = <i className="icon icon-circle icon-fw unselected far" />;
        }

        if (!title || title === 'null' || title === 'undefined'){
            title = 'None';
        }

        const statusClassName = (status !== 'none' ? (status === 'selected' ? " selected" : " omitted") : '');
        return (
            <li className={"facet-list-element " + statusClassName} key={term.key} data-key={term.key}>
                <a className="term" data-selected={selected} href="#" onClick={this.handleClick} data-term={term.key}>
                    <span className="facet-selector">{icon}</span>
                    <span className="facet-item" data-tip={title.length > 30 ? title : null}>{title}</span>
                    <span className="facet-count">{count}</span>
                </a>
            </li>
        );
    }

}
Term.propTypes = {
    'facet'             : PropTypes.shape({
        'field'             : PropTypes.string.isRequired
    }).isRequired,
    'term'              : PropTypes.shape({
        'key'               : PropTypes.string.isRequired,
        'doc_count'         : PropTypes.number
    }).isRequired,
    'getTermStatus'     : PropTypes.func.isRequired,
    'onClick'           : PropTypes.func.isRequired
};


export class FacetTermsList extends React.PureComponent {

    static anyTermsSelected(terms = [], facet, filters = []){
        const activeTermsForField = {};
        filters.forEach(function(f){
            if (f.field !== facet.field) return;
            activeTermsForField[f.term] = true;
        });

        for (let i = 0; i < terms.length; i++){
            if (activeTermsForField[terms[i].key]) {
                return true;
            }
        }
        return false;
    }

    static filterTerms(facet, filters){
        const activeTermsForField = {};
        filters.forEach(function(f){
            if (f.field !== facet.field) return;
            activeTermsForField[f.term] = true;
        });

        // Filter out terms w/ 0 counts (in case).
        let terms = facet.terms.filter(function(term){
            if (term.doc_count > 0) return true;
            if (activeTermsForField[term.key]) return true;
            return false;
        });
        // Filter out type=Item for now (hardcode)
        if (facet.field === "type"){
            terms = terms.filter(function(t){ return t !== 'Item' && t && t.key !== 'Item'; });
        }
        return terms;
    }

    constructor(props){
        super(props);
        this.handleOpenToggleClick = this.handleOpenToggleClick.bind(this);
        this.handleExpandListToggleClick = this.handleExpandListToggleClick.bind(this);
        this.renderTerms = this.renderTerms.bind(this);
        this.state = {
            'facetOpen'     : typeof props.defaultFacetOpen === 'boolean' ? props.defaultFacetOpen : true,
            'facetClosing'  : false,
            'expanded'      : false
        };
        this.memoized = {
            anyTermsSelected: memoize(FacetTermsList.anyTermsSelected),
            filterTerms: memoize(FacetTermsList.filterTerms)
        };
    }

    componentDidUpdate(pastProps, pastState){
        const { mounted, defaultFacetOpen, isStatic, facet, filters } = this.props;

        this.setState(({ facetOpen: currFacetOpen }) => {
            if (!pastProps.mounted && mounted && typeof defaultFacetOpen === 'boolean' && defaultFacetOpen !== pastProps.defaultFacetOpen) {
                return { 'facetOpen' : true };
            }
            if (defaultFacetOpen === true && !pastProps.defaultFacetOpen && !currFacetOpen){
                return { 'facetOpen' : true };
            }
            if (currFacetOpen && isStatic && !pastProps.isStatic && !this.memoized.anyTermsSelected(this.memoized.filterTerms(facet, filters), facet, filters)){
                return { 'facetOpen' : false };
            }
            return null;
        }, ()=>{
            const { facetOpen } = this.state;
            if (pastState.facetOpen !== facetOpen){
                ReactTooltip.rebuild();
            }
        });
    }

    handleOpenToggleClick(e) {
        e.preventDefault();
        this.setState(function({ facetOpen }){
            const willBeOpen = !facetOpen;
            if (willBeOpen) {
                return { 'facetOpen': true };
            } else {
                return { 'facetClosing': true };
            }
        }, ()=>{
            setTimeout(()=>{
                this.setState(function({ facetOpen, facetClosing }){
                    if (facetClosing){
                        return { 'facetOpen' : false, 'facetClosing' : false };
                    }
                    return null;
                });
            }, 350);
        });
    }

    handleExpandListToggleClick(e){
        e.preventDefault();
        this.setState(function({ expanded }){
            return { 'expanded' : !expanded };
        });
    }


    renderTerms(terms){
        const { facet, persistentCount, onTermClick } = this.props;
        const { expanded } = this.state;
        const makeTermComponent = (term) => (
            <Term {...this.props} onClick={onTermClick} key={term.key} term={term} total={facet.total} />
        );

        if (terms.length > persistentCount){
            const persistentTerms     = terms.slice(0, persistentCount);
            const collapsibleTerms    = terms.slice(persistentCount);
            const remainingTermsCount = !expanded ? _.reduce(collapsibleTerms, function(m, term){
                return m + (term.doc_count || 0);
            }, 0) : null;
            let expandButtonTitle;

            if (expanded){
                expandButtonTitle = (
                    <span>
                        <i className="icon icon-fw icon-minus fas"/> Collapse
                    </span>
                );
            } else {
                expandButtonTitle = (
                    <span>
                        <i className="icon icon-fw icon-plus fas"/> View {terms.length - persistentCount} More
                        <span className="pull-right">{ remainingTermsCount }</span>
                    </span>
                );
            }

            return (
                <div className="facet-list">
                    <PartialList open={expanded} persistent={ _.map(persistentTerms,  makeTermComponent)} collapsible={_.map(collapsibleTerms, makeTermComponent)} />
                    <div className="view-more-button" onClick={this.handleExpandListToggleClick}>{ expandButtonTitle }</div>
                </div>
            );
        } else {
            return (
                <div className="facet-list">{ _.map(terms, makeTermComponent) }</div>
            );
        }
    }

    render(){
        const { facet, filters, tooltip, title, isStatic } = this.props;
        const { facetOpen, facetClosing } = this.state;
        const terms = this.memoized.filterTerms(facet, filters);
        const anyTermsSelected = this.memoized.anyTermsSelected(terms, facet, filters);
        const termsLen = terms.length;
        let indicator;

        if (isStatic || termsLen === 1){
            indicator = ( // Small indicator to help represent how many terms there are available for this Facet.
                <Fade in={facetClosing || !facetOpen}>
                    <span className={"closed-terms-count col-auto px-0" + (anyTermsSelected ? " some-selected" : "")}
                        data-tip={"No useful options (1 total)" + (anyTermsSelected ? "; is selected" : "")}
                        data-any-selected={anyTermsSelected}>
                        <i className={"icon fas icon-" + (anyTermsSelected ? "circle" : "minus-circle")}
                            style={{ opacity: anyTermsSelected ? 0.75 : 0.25 }}/>
                    </span>
                </Fade>
            );
        } else {
            indicator = ( // Small indicator to help represent how many terms there are available for this Facet.
                <Fade in={facetClosing || !facetOpen}>
                    <span className={"closed-terms-count col-auto px-0" + (anyTermsSelected ? " some-selected" : "")}
                        data-tip={termsLen + " options" + (anyTermsSelected ? " with at least one selected" : "")}
                        data-any-selected={anyTermsSelected}>
                        { _.range(0, Math.min(Math.ceil(termsLen / 3), 8)).map((c)=>
                            <i className="icon icon-ellipsis-v fas" key={c}
                                style={{ opacity : ((c + 1) / 5) * (0.67) + 0.33 }} />
                        )}
                    </span>
                </Fade>
            );
        }

        // List of terms
        return (
            <div className={"facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : '')} data-field={facet.field}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")}/>
                    </span>
                    <span className="inline-block col px-0" data-tip={tooltip} data-place="right">{ title }</span>
                    { indicator }
                </h5>
                <Collapse in={facetOpen && !facetClosing}>{ this.renderTerms(terms) }</Collapse>
            </div>
        );
    }
}
FacetTermsList.defaultProps = {
    'persistentCount' : 10
};