'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import Fade from 'react-bootstrap/esm/Fade';

import { stackDotsInContainer } from './../../../viz/utilities';
import { PartialList } from './../../../ui/PartialList';
import { ExtendedDescriptionPopoverIcon } from './ExtendedDescriptionPopoverIcon';
import { SearchAsYouTypeAjax } from '../../../forms/components/SearchAsYouTypeAjax';
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

    let terms = facet.terms.slice();

    // Leave in terms which aren't present in facet.terms but are in filters.
    // This might happen because of limit=~100 of terms returned from backend aggs.
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

/* Used in ListOfTerms and ListOfRanges (RangeFacet) */
export function segmentComponentsByStatus(termComponents){
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


/**
 * Used to render individual terms in FacetList.
 */
export class Term extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        const { facet, term, onClick } = this.props;
        e.preventDefault();
        onClick(facet, term, e);
    }

    render() {
        const { term, facet, status, termTransformFxn, isFiltering, useRadioIcon = false } = this.props;

        const selected = (status !== 'none');
        const count = (term && term.doc_count) || 0;
        let title = termTransformFxn(facet.field, term.key) || term.key;
        let icon = null;

        if (isFiltering) {
            icon = <i className="icon fas icon-circle-notch icon-spin icon-fw" />;
        } else if (status === 'selected' || status === 'omitted') {
            icon = <i className={"icon icon-fw fas " + (!useRadioIcon ? "icon-check-square" : "icon-dot-circle")} />;
        } else {
            icon = <i className={"icon icon-fw unselected far " + (!useRadioIcon ? "icon-square" : "icon-circle")} />;
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
    'isFiltering'       : PropTypes.bool,
    'filteringFieldTerm': PropTypes.shape({ field: PropTypes.string, term: PropTypes.string }),
    'getTermStatus'     : PropTypes.func.isRequired,
    'onClick'           : PropTypes.func.isRequired,
    'status'            : PropTypes.oneOf(["none", "selected", "omitted"]),
    'termTransformFxn'  : PropTypes.func,
    'useRadioIcon'     : PropTypes.bool.isRequired
};
Term.defaultProps = {
    'useRadioIcon': false
};

/**
 * @param {*} facetTerms : facet's terms array
 * @param {*} searchText : search text from basic search input
 */
export function getFilteredTerms(facetTerms, searchText) {
    const retDict = {};
    if (!facetTerms || !Array.isArray(facetTerms)) {
        return retDict;
    }

    const lcSearchText = searchText && typeof searchText === 'string' && searchText.length > 0 ? searchText.toLocaleLowerCase() : '';

    _.forEach(facetTerms, function (term) {
        const { key = '' } = term || {};
        if (typeof key === 'string' && key.length > 0) {
            const isFiltered = lcSearchText.length > 0 ? key.toLocaleLowerCase().includes(lcSearchText) : true;
            if (isFiltered) { retDict[key] = true; }
        }
    });

    return retDict;
}

export class FacetTermsList extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleOpenToggleClick = this.handleOpenToggleClick.bind(this);
        this.handleExpandListToggleClick = this.handleExpandListToggleClick.bind(this);
        this.handleBasicTermSearch = this.handleBasicTermSearch.bind(this);
        this.handleSaytTermSearch = this.handleSaytTermSearch.bind(this);
        this.state = { 'expanded': false, 'searchText': '', };
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

    handleBasicTermSearch(e) {
        e.preventDefault();
        const newValue = e.target.value;
        this.setState({ 'searchText': newValue });
    }

    handleSaytTermSearch(e) {
        var { facet,onTermClick } = this.props;
        const key = { 'key': e.display_title };
        onTermClick(facet,key);
    }

    render(){
        const {
            facet,
            fieldSchema,
            isStatic,
            anyTermsSelected: anySelected,
            termsSelectedCount,
            persistentCount,
            basicSearchAutoDisplayLimit,
            onTermClick,
            getTermStatus,
            termTransformFxn,
            facetOpen,
            openPopover,
            filteringFieldTerm,
            setOpenPopover,
            useRadioIcon,
            persistSelectedTerms,
            context,
            schemas,
        } = this.props;
        const { description: facetSchemaDescription = null, field, title: facetTitle, terms = [] } = facet;
        const { expanded, searchText } = this.state;
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
                <ListOfTerms
                    {...{ facet, facetOpen, terms, onTermClick, expanded, getTermStatus, termTransformFxn, searchText, schemas, persistentCount, basicSearchAutoDisplayLimit, useRadioIcon, persistSelectedTerms, filteringFieldTerm }}
                    onSaytTermSearch={this.handleSaytTermSearch} onBasicTermSearch={this.handleBasicTermSearch} onToggleExpanded={this.handleExpandListToggleClick} />
            </div>
        );
    }
}
FacetTermsList.defaultProps = {
    'persistentCount' : 10,
    'basicSearchAutoDisplayLimit': 15
};

const ListOfTerms = React.memo(function ListOfTerms(props){
    const {
        facet, facetOpen,
        terms, onTermClick, filteringFieldTerm,
        expanded, onToggleExpanded, persistentCount,
        getTermStatus,
        termTransformFxn,
        searchText, onBasicTermSearch, onSaytTermSearch,
        basicSearchAutoDisplayLimit, useRadioIcon, persistSelectedTerms = true
    } = props;
    let { search_type: searchType = 'none' } = facet;

    /**
     * even if search type is not defined, display basic search option when terms count
     * is greater than basicSearchAutoDisplayLimit (for persistSelectedTerms is true)
     */
    if (!persistSelectedTerms) {
        searchType = 'none'; //override
    } else if (searchType === 'none' && terms.length >= basicSearchAutoDisplayLimit) {
        searchType = 'basic';
    }
    /** Create term components and sort by status (selected->omitted->unselected) */
    const {
        termComponents, activeTermComponents, unselectedTermComponents,
        totalLen, selectedLen, omittedLen, unselectedLen,
        persistentTerms = null,
        collapsibleTerms = null,
        collapsibleTermsCount = 0,
        collapsibleTermsItemCount = 0
    } = useMemo(function(){
        const { field } = facet;

        const allTermComponents = terms.map(function(term){
            const { field: currFilteringField, term: currFilteringTerm } = filteringFieldTerm || {};
            const isFiltering = field === currFilteringField && term.key === currFilteringTerm;
            return <Term {...{ facet, term, termTransformFxn, isFiltering, useRadioIcon }} onClick={onTermClick} key={term.key} status={getTermStatus(term, facet)} />;
        });
        const segments = segmentComponentsByStatus(allTermComponents);

        const { selected: selectedTermComponents = [], omitted : omittedTermComponents = [] } = segments;
        let { none : unselectedTermComponents  = [] } = segments;

        //filter unselected terms
        if (searchType === 'basic' && searchText && typeof searchText === 'string' && searchText.length > 0) {
            const dict = getFilteredTerms(terms, searchText);
            unselectedTermComponents = _.filter(unselectedTermComponents, function (term) { return dict[term.key]; });
        } else if (searchType === 'sayt_without_terms') {
            unselectedTermComponents = [];
        }

        const selectedLen = selectedTermComponents.length;
        const omittedLen = omittedTermComponents.length;
        const unselectedLen = unselectedTermComponents.length;
        const totalLen = selectedLen + omittedLen + unselectedLen;

        if (!persistSelectedTerms) {
            return { termComponents: allTermComponents, selectedLen, omittedLen, unselectedLen, totalLen };
        }

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

    }, [ facet, terms, persistentCount, searchText, filteringFieldTerm, persistSelectedTerms ]);

    const commonProps = {
        "data-any-active" : !!(selectedLen || omittedLen),
        "data-all-active" : totalLen === (selectedLen + omittedLen),
        "data-persist-terms": persistSelectedTerms,
        "data-open" : facetOpen,
        "className" : "facet-list",
        "key" : "facetlist"
    };

    if (!persistSelectedTerms) {
        return (
            <div {...commonProps}>
                <PartialList className="mb-0 active-terms-pl" open={facetOpen} persistent={null} collapsible={
                    <React.Fragment>
                        {termComponents}
                    </React.Fragment>
                } />
            </div>
        );
    } else {
        // show simple text input for basic search (search within returned values)
        // or show SAYT control if item search is available
        let facetSearch = null;
        if (searchType === 'basic') {
            facetSearch = (
                <div className="text-small p-2">
                    <input className="form-control" autoComplete="off" type="search" placeholder="Search"
                        name="q" onChange={onBasicTermSearch} key="facet-search-input" />
                </div>);
        } else if ((searchType === 'sayt') || (searchType === 'sayt_without_terms')) {
            let { sayt_item_type: itemType = '' } = facet || {};
            itemType = typeof itemType === 'string' && (itemType.length > 0) ? itemType : 'Item';
            const baseHref = "/search/?type=" + itemType;
            facetSearch = (
                <div className="d-flex flex-wrap text-small p-2">
                    <SearchAsYouTypeAjax baseHref={baseHref} showTips={true} onChange={onSaytTermSearch} key={itemType} />
                </div>);
        }

        if (Array.isArray(collapsibleTerms)) {
            let expandButtonTitle;

            if (expanded) {
                expandButtonTitle = (
                    <span>
                        <i className="icon icon-fw icon-minus fas" /> Collapse
                    </span>
                );
            } else {
                expandButtonTitle = (
                    <span>
                        <i className="icon icon-fw icon-plus fas" /> View {collapsibleTermsCount} More
                        <span className="pull-right">{collapsibleTermsItemCount}</span>
                    </span>
                );
            }

            return (
                <div {...commonProps}>
                    <PartialList className="mb-0 active-terms-pl" open={facetOpen} persistent={activeTermComponents} collapsible={
                        <React.Fragment>
                            {facetSearch}
                            <PartialList className="mb-0" open={expanded} persistent={persistentTerms} collapsible={collapsibleTerms} />
                            <div className="pt-08 pb-0">
                                <div className="view-more-button" onClick={onToggleExpanded}>{expandButtonTitle}</div>
                            </div>
                        </React.Fragment>
                    } />
                </div>
            );
        } else {
            return (
                <div {...commonProps}>
                    <PartialList className="mb-0 active-terms-pl" open={facetOpen} persistent={activeTermComponents} collapsible={
                        <React.Fragment>
                            {facetSearch}
                            {unselectedTermComponents}
                        </React.Fragment>
                    } />
                </div>
            );
        }
    }
});


export const CountIndicator = React.memo(function CountIndicator(props){
    const {
        count = 1,
        countActive = 0,
        height = 16,
        width = 40,
        ltr = false,
        className = null,
        ...passProps
    } = props;
    const dotCountToShow = Math.min(count, 21);
    const dotCoords = stackDotsInContainer(dotCountToShow, height, 4, 2, false);
    const currColCounter = new Set();
    const dots = dotCoords.map(function([ x, y ], idx){
        currColCounter.add(x);
        const colIdx = currColCounter.size - 1;
        // Flip both axes so going bottom right to top left.
        const cx = ltr ? x + 1 : width - x + 1;
        const cy = ltr ? y + 1 : height - y + 1;
        return (
            <circle {...{ cx, cy }} r={2} key={idx} data-original-index={idx}
                style={{ opacity: 1 - (colIdx * .125) }} className={(dotCountToShow - idx) <= countActive ? "active" : null} />
        );
    });
    const cls = "svg-count-indicator" + (className ? " " + className : "");
    return (
        <svg {...passProps} className={cls} viewBox={`0 0 ${width + 2} ${height + 2}`} width={width + 2} height={height + 2}>
            { dots}
        </svg>
    );
});
