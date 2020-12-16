'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Fade from 'react-bootstrap/esm/Fade';

import { stackDotsInContainer } from './../../../viz/utilities';
import { PartialList } from './../../../ui/PartialList';
import { ExtendedDescriptionPopoverIcon } from './ExtendedDescriptionPopoverIcon';


/**
 * Used in FacetList
 * @deprecated
 */
export function anyTermsSelected(terms = [], facet, filters = []){
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

/**
 * Used in FacetList for TermsFacet/FacetTermsList only.
 *
 * @param {*} facets - Must be in final extended form (containing full 'terms' incl selected ones w/ 0 counts)
 * @param {*} filters - List of active filters.
 * @returns {Object<string, number>} Counts of selected terms per facet.field.
 */
export function countActiveTermsByField(filters) {
    const activeTermsByField = {};

    filters.forEach(function({ field: rawField, term }){
        const lastCharIdx = rawField.length - 1;
        const field = rawField.charAt(lastCharIdx) === "!" ? rawField.slice(0, lastCharIdx) : rawField;
        activeTermsByField[field] = activeTermsByField[field] || new Set();
        activeTermsByField[field].add(term);
    });

    const countTermsByField = {};
    _.keys(activeTermsByField).forEach(function(field){
        countTermsByField[field] = activeTermsByField[field].size;
    });

    return countTermsByField;
}

/**
 * Used in FacetList
 */
export function mergeTerms(facet, filters){
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

    terms.forEach(function({ key }){
        delete activeTermsForField[key];
    });

    // Filter out type=Item for now (hardcode)
    if (facet.field === "type"){
        terms = terms.filter(function(t){ return t !== 'Item' && t && t.key !== 'Item'; });
    }

    // These are terms which might have been manually defined in URL but are not present in data at all.
    // Include them so we can unselect them.
    const unseenTerms = _.keys(activeTermsForField).map(function(term){
        return { key: term, doc_count: 0 };
    });

    return terms.concat(unseenTerms);
}

function segmentComponentsByStatus(termComponents){
    const groups = {};
    termComponents.forEach(function(t){
        const { props: { status } } = t;
        if (!Array.isArray(groups[status])) {
            groups[status] = [];
        }
        groups[status].push(t);
    });
    return groups;
}

function getRangeStatus(range, toVal, fromVal) {
    const { from = null, to = null } = range || {};
    if (to === toVal && from === fromVal) {
        return "selected";
    }
    return "none";
}


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
        const { term, facet, status, termTransformFxn } = this.props;
        const { filtering } = this.state;
        const selected = (status !== 'none');
        const count = (term && term.doc_count) || 0;
        let title = termTransformFxn(facet.field, term.key) || term.key;
        let icon = null;

        if (filtering) {
            icon = <i className="icon fas icon-circle-notch icon-spin icon-fw" />;
        } else if (status === 'selected' || status === 'omitted') {
            icon = <i className="icon icon-check-square icon-fw fas" />;
        } else {
            icon = <i className="icon icon-square icon-fw unselected far" />;
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

    constructor(props){
        super(props);
        this.handleOpenToggleClick = this.handleOpenToggleClick.bind(this);
        this.handleExpandListToggleClick = this.handleExpandListToggleClick.bind(this);
        this.state = { 'expanded' : false };
    }

    handleOpenToggleClick(e) {
        e.preventDefault();
        const { onToggleOpen, facet: { field }, facetOpen = false } = this.props;
        onToggleOpen(field, !facetOpen);
    }

    handleExpandListToggleClick(e){
        e.preventDefault();
        this.setState(function({ expanded }){
            return { 'expanded' : !expanded };
        });
    }

    render(){
        const {
            facet,
            fieldSchema,
            isStatic,
            anyTermsSelected: anySelected,
            termsSelectedCount,
            persistentCount,
            onTermClick,
            getTermStatus,
            termTransformFxn,
            facetOpen,
            openPopover,
            setOpenPopover
        } = this.props;
        const { description: facetSchemaDescription = null, field, title: facetTitle, terms = [] } = facet;
        const { expanded } = this.state;
        const termsLen = terms.length;
        const allTermsSelected = termsSelectedCount === termsLen;
        const { title: fieldTitle, description: fieldSchemaDescription } = fieldSchema || {}; // fieldSchema not present if no schemas loaded yet or if fake/calculated 'field'/column.
        const title = facetTitle || fieldTitle || field;

        let indicator;

        // @todo: much of this code (including mergeTerms and anyTermsSelected above) were moved to index; consider moving these too
        if (isStatic || termsLen === 1){
            indicator = ( // Small indicator to help represent how many terms there are available for this Facet.
                <Fade in={!facetOpen}>
                    <span className={"closed-terms-count col-auto px-0" + (anySelected ? " some-selected" : "")}
                        data-tip={"No useful options (1 total)" + (anySelected ? "; is selected" : "")}
                        data-place="right" data-any-selected={anySelected}>
                        <CountIndicator count={termsLen} countActive={termsSelectedCount} />
                    </span>
                </Fade>
            );
        } else {
            indicator = ( // Small indicator to help represent how many terms there are available for this Facet.
                <Fade in={!facetOpen}>
                    <span className={"closed-terms-count col-auto px-0" + (anySelected ? " some-selected" : "")}
                        data-tip={`${termsLen} options with ${termsSelectedCount} selected`}
                        data-place="right" data-any-selected={anySelected}>
                        <CountIndicator count={termsLen} countActive={termsSelectedCount} />
                    </span>
                </Fade>
            );
        }

        // List of terms
        return (
            <div className={"facet" + (facetOpen || allTermsSelected ? ' open' : ' closed')} data-field={facet.field}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw icon-" + (allTermsSelected ? "dot-circle far" : (facetOpen ? "minus" : "plus") + " fas")}/>
                    </span>
                    <div className="col px-0 line-height-1">
                        <span data-tip={facetSchemaDescription || fieldSchemaDescription} data-html data-place="right">{ title }</span>
                        <ExtendedDescriptionPopoverIcon {...{ fieldSchema, facet, openPopover, setOpenPopover }} />
                    </div>
                    { indicator }
                </h5>
                <ListOfTerms {...{ facet, facetOpen, terms, persistentCount, onTermClick, expanded, getTermStatus, termTransformFxn }} onToggleExpanded={this.handleExpandListToggleClick} />
            </div>
        );
    }
}
FacetTermsList.defaultProps = {
    'persistentCount' : 10
};


const ListOfTerms = React.memo(function ListOfTerms(props){
    const { facet, facetOpen, facetClosing, terms, persistentCount, onTermClick, expanded, onToggleExpanded, getTermStatus, termTransformFxn } = props;
    console.log("listOfRanges props", props);
    /** Create term components and sort by status (selected->omitted->unselected) */
    const {
        termComponents, activeTermComponents, unselectedTermComponents,
        totalLen, selectedLen, omittedLen, unselectedLen,
        persistentTerms = null,
        collapsibleTerms = null,
        collapsibleTermsCount = 0,
        collapsibleTermsItemCount = 0
    } = useMemo(function(){
        const {
            selected: selectedTermComponents    = [],
            omitted : omittedTermComponents     = [],
            none    : unselectedTermComponents  = []
        } = segmentComponentsByStatus(terms.map(function(term){
            return <Term {...{ facet, term, termTransformFxn }} onClick={onTermClick} key={term.key} status={getTermStatus(term, facet)} />;
        }));
        const selectedLen = selectedTermComponents.length;
        const omittedLen = omittedTermComponents.length;
        const unselectedLen = unselectedTermComponents.length;
        const totalLen = selectedLen + omittedLen + unselectedLen;
        const termComponents = selectedTermComponents.concat(omittedTermComponents).concat(unselectedTermComponents);
        const activeTermComponents = termComponents.slice(0, selectedLen + omittedLen);

        const retObj = { termComponents, activeTermComponents, unselectedTermComponents, selectedLen, omittedLen, unselectedLen, totalLen };

        if (totalLen <= Math.max(persistentCount, selectedLen + omittedLen)) {
            return retObj;
        }

        const unselectedStartIdx = selectedLen + omittedLen;
        retObj.persistentTerms = []; //termComponents.slice(0, unselectedStartIdx);

        var i;
        for (i = unselectedStartIdx; i < persistentCount; i++){
            retObj.persistentTerms.push(termComponents[i]);
        }

        retObj.collapsibleTerms = termComponents.slice(i);
        retObj.collapsibleTermsCount = totalLen - i;
        retObj.collapsibleTermsItemCount = retObj.collapsibleTerms.reduce(function(m, termComponent){
            return m + (termComponent.props.term.doc_count || 0);
        }, 0);

        return retObj;

    }, [ terms, persistentCount ]);

    const commonProps = {
        "data-any-active" : !!(selectedLen || omittedLen),
        "data-all-active" : totalLen === (selectedLen + omittedLen),
        "data-open" : facetOpen,
        "className" : "facet-list",
        "key" : "facetlist"
    };

    if (Array.isArray(collapsibleTerms)){

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
                    <i className="icon icon-fw icon-plus fas"/> View { collapsibleTermsCount } More
                    <span className="pull-right">{ collapsibleTermsItemCount }</span>
                </span>
            );
        }

        return (
            <div {...commonProps}>
                <PartialList className="mb-0 active-terms-pl" open={facetOpen} persistent={activeTermComponents} collapsible={
                    <React.Fragment>
                        <PartialList className="mb-0" open={expanded} persistent={persistentTerms} collapsible={collapsibleTerms} />
                        <div className="pt-08 pb-0">
                            <div className="view-more-button" onClick={onToggleExpanded}>{ expandButtonTitle }</div>
                        </div>
                    </React.Fragment>
                } />
            </div>
        );
    } else {
        return (
            <div {...commonProps}>
                <PartialList className="mb-0 active-terms-pl" open={facetOpen} persistent={activeTermComponents} collapsible={unselectedTermComponents} />
            </div>
        );
    }
});


export const CountIndicator = React.memo(function CountIndicator({ count = 1, countActive = 0, height = 16, width = 40 }){
    const dotCountToShow = Math.min(count, 21);
    const dotCoords = stackDotsInContainer(dotCountToShow, height, 4, 2, false);
    const dots = dotCoords.map(function([ x, y ], idx){
        const colIdx = Math.floor(idx / 3);
        // Flip both axes so going bottom right to top left.
        return (
            <circle cx={width - x + 1} cy={height - y + 1} r={2} key={idx} data-original-index={idx}
                style={{ opacity: 1 - (colIdx * .125) }} className={(dotCountToShow - idx) <= countActive ? "active" : null} />
        );
    });
    return (
        <svg className="svg-count-indicator" viewBox={`0 0 ${width + 2} ${height + 2}`} width={width + 2} height={height + 2}>
            { dots }
        </svg>
    );
});



export const ListOfRanges = React.memo(function ListOfRanges(props){
    const { facet, facetOpen, facetClosing, persistentCount = 2, onTermClick, expanded, onToggleExpanded, termTransformFxn, toVal, fromVal, resetAll } = props;
    const { ranges = [] } = facet;
    console.log("listOfRanges props", props);
    console.log("facet", facet);

    /** Create range components and sort by status (selected->omitted->unselected) */
    const { termComponents, activeTermComponents, unselectedTermComponents,
        totalLen, selectedLen, omittedLen, unselectedLen,
        persistentTerms = null,
        collapsibleTerms = null,
        collapsibleTermsCount = 0,
        collapsibleTermsItemCount = 0
    } = useMemo(function(){
        const {
            selected: selectedTermComponents    = [],
            omitted : omittedTermComponents     = [],
            none    : unselectedTermComponents  = []
        } = segmentComponentsByStatus(ranges.map(function(range){
            return <RangeTerm {...{ facet, range, termTransformFxn, resetAll }} onClick={onTermClick} key={`${range.to}-${range.from}`} status={getRangeStatus(range, toVal, fromVal)} />;
        }));

        const selectedLen = selectedTermComponents.length;
        const omittedLen = omittedTermComponents.length;
        const unselectedLen = unselectedTermComponents.length;
        const totalLen = selectedLen + omittedLen + unselectedLen;
        const termComponents = selectedTermComponents.concat(omittedTermComponents).concat(unselectedTermComponents);
        const activeTermComponents = termComponents.slice(0, selectedLen + omittedLen);

        const retObj = { termComponents, activeTermComponents, unselectedTermComponents, selectedLen, omittedLen, unselectedLen, totalLen };

        if (totalLen <= Math.max(persistentCount, selectedLen + omittedLen)) {
            return retObj;
        }

        const unselectedStartIdx = selectedLen + omittedLen;
        retObj.persistentTerms = []; //termComponents.slice(0, unselectedStartIdx);

        var i;
        for (i = unselectedStartIdx; i < persistentCount; i++){
            retObj.persistentTerms.push(termComponents[i]);
        }

        retObj.collapsibleTerms = termComponents.slice(i);
        retObj.collapsibleTermsCount = totalLen - i;
        retObj.collapsibleTermsItemCount = retObj.collapsibleTerms.reduce(function(m, termComponent){
            return m + (termComponent.props.range.doc_count || 0);
        }, 0);

        return retObj;

    }, [ ranges, persistentCount, toVal, fromVal ]);



    const commonProps = {
        "data-any-active" : !!(selectedLen || omittedLen),
        "data-all-active" : totalLen === (selectedLen + omittedLen),
        "data-open" : facetOpen,
        "className" : "facet-list",
        "key" : "facetlist"
    };

    if (Array.isArray(collapsibleTerms) && collapsibleTerms.length > 0){

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
                    <i className="icon icon-fw icon-plus fas"/> View { collapsibleTermsCount } More
                    <span className="pull-right">{ collapsibleTermsItemCount }</span>
                </span>
            );
        }

        return (
            <div {...commonProps}>
                <PartialList className="mb-0 active-terms-pl" open={facetOpen} persistent={activeTermComponents} collapsible={
                    <React.Fragment>
                        <PartialList className="mb-0" open={expanded} persistent={persistentTerms} collapsible={collapsibleTerms} />
                        <div className="pt-08 pb-0">
                            <div className="view-more-button" onClick={onToggleExpanded}>{ expandButtonTitle }</div>
                        </div>
                    </React.Fragment>
                } />
            </div>
        );
    } else {
        return (
            <div {...commonProps}>
                <PartialList className="mb-0 active-terms-pl" open={facetOpen} persistent={activeTermComponents} collapsible={unselectedTermComponents} />
            </div>
        );
    }
});

/**
 * Used to render a term with range functionality in FacetList. Basically same as FacetTermsList > Term... maybe merge later
 */
export class RangeTerm extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleClick = _.debounce(this.handleClick.bind(this), 500, true);
        this.state = {
            'filtering' : false
        };
    }

    handleClick(e) {
        var { range, onClick } = this.props;
        var { to = null, from = null } = range;
        e.preventDefault();
        this.setState({ 'filtering' : true }, () => {
            onClick(to, from, e, () => this.setState({ 'filtering' : false }));
        });
    }

    render() {
        const { range, facet, status, termTransformFxn, resetAll } = this.props;
        const { doc_count, from, to, label } = range;
        const { filtering } = this.state;
        const selected = (status !== 'none');
        let icon = null;

        let title = (
            (typeof from !== 'undefined' ? from : '< ') +
            (typeof from !== 'undefined' && typeof to !== 'undefined' ? ' - ' : '') +
            (typeof to !== 'undefined' ? to : '+ ')
        );

        if (filtering) {
            icon = <i className="icon fas icon-circle-notch icon-spin icon-fw" />;
        } else if (status === 'selected' || status === 'omitted') {
            icon = <i className="icon icon-dot-circle icon-fw fas" />;
        } else {
            icon = <i className="icon icon-circle icon-fw unselected far" />;
        }

        if (!title || title === 'null' || title === 'undefined'){
            title = 'None';
        }

        return (
            <li className={"facet-list-element "} key={label} data-key={label}>
                <a className="term" data-selected={selected} href="#" onClick={status === "selected" ? resetAll : this.handleClick} data-term={label}>
                    <span className="facet-selector">{icon}</span>
                    <span className="facet-item" data-tip={title.length > 30 ? title : null}>{title} {label ? `(${label})` : null}</span>
                    <span className="facet-count">{doc_count || 0}</span>
                </a>
            </li>
        );
    }

}
RangeTerm.propTypes = {
    'facet'             : PropTypes.shape({
        'field'             : PropTypes.string.isRequired
    }).isRequired,
    'range'              : PropTypes.shape({
        'from'              : PropTypes.number,
        'to'                : PropTypes.number,
        'label'             : PropTypes.string,
        'doc_count'         : PropTypes.number
    }).isRequired,
    // 'getTermStatus'     : PropTypes.func.isRequired,
    'onClick'           : PropTypes.func.isRequired
};