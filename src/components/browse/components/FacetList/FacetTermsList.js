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
    let unseenTerms = [];
    if (!facet.has_group_by) {
        unseenTerms = _.keys(activeTermsForField).map(function (term) {
            return { key: term, doc_count: 0 };
        });
    }

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
        if(t.props.facet.has_group_by) {
            if (!Array.isArray(groups['none'])) {
                groups['none'] = [];
            }
            groups['none'].push(t);
        } else {
            groups[status].push(t);
        }
    });
    return groups;
}


/**
 * Used to render individual terms in FacetList.
 */
export class Term extends React.PureComponent {

    static propTypes = {
        'facet'             : PropTypes.shape({
            'field'             : PropTypes.string.isRequired
        }).isRequired,
        'term'              : PropTypes.shape({
            'key'               : PropTypes.string.isRequired,
            'doc_count'         : PropTypes.number,
            'is_parent'         : PropTypes.bool,
            'terms'             : PropTypes.array
        }).isRequired,
        'isFiltering'       : PropTypes.bool,
        'filteringFieldTerm': PropTypes.shape({ field: PropTypes.string, term: PropTypes.string }),
        'onClick'           : PropTypes.func.isRequired,
        'status'            : PropTypes.oneOf(["none", "selected", "omitted"]),
        'getTermStatus'     : PropTypes.func.isRequired,
        'termTransformFxn'  : PropTypes.func,
        'useRadioIcon'      : PropTypes.bool.isRequired,
        'hasParent'         : PropTypes.bool,
        'facetSearchActive' : PropTypes.bool,
        'textFilteredTerms'     : PropTypes.object,
        'textFilteredSubTerms'  : PropTypes.object,
        'tooltip'           : PropTypes.string,
    };

    static defaultProps = {
        'useRadioIcon': false
    };

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
        const {
            term, facet, status, getTermStatus, termTransformFxn, isFiltering, onClick, useRadioIcon = false,
            hasParent, facetSearchActive = false, textFilteredTerms, textFilteredSubTerms, tooltip
        } = this.props;

        const selected = (status !== 'none');
        const count = (term && term.doc_count) || 0;

        let title = termTransformFxn(facet.field, term.key) || term.key;
        let icon = null;

        if (isFiltering) {
            icon = <i className="icon fas icon-circle-notch icon-spin icon-fw" />;
        } else if (status === "omitted"){
            icon = <i className={"icon icon-fw fas " + (!useRadioIcon ? "icon-minus-square" : "icon-dot-circle")} />;
        } else if (status === "selected") {
            icon = <i className={"icon icon-fw fas " + (!useRadioIcon ? "icon-check-square" : "icon-dot-circle")} />;
        } else {
            icon = <i className={"icon icon-fw unselected far " + (!useRadioIcon ? "icon-square" : "icon-circle")} />;
        }

        if (!title || title === 'null' || title === 'undefined'){
            title = 'None';
        }

        const statusClassName = (status !== 'none' ? (status === 'selected' ? " selected" : " omitted") : '');
        const { is_parent : isParent = false } = term;
        let subTerms = null;
        if (isParent && term.terms && Array.isArray(term.terms) && term.terms.length > 0){
            const childProps = { facet, getTermStatus, termTransformFxn, isFiltering, onClick, useRadioIcon, hasParent: true, facetSearchActive };
            let filteredTerms = term.terms;
            if (typeof textFilteredSubTerms !== 'undefined' && textFilteredSubTerms !== null) {
                filteredTerms = _.filter(filteredTerms, function (t) { return textFilteredSubTerms[t.key]; });
            }
            subTerms = filteredTerms.map(function (t) { return (<Term key={t.key} term={t} {...childProps} status={status === 'selected' ? 'selected' : getTermStatus(t, facet)} />); });
        }
        if (isParent && textFilteredTerms && textFilteredTerms[term.key] === 'hidden') {
            return subTerms;
        }
        return (
            <React.Fragment>
                <li className={"facet-list-element " + statusClassName + (hasParent && !facetSearchActive ? " pl-3" : "")} key={term.key} data-key={term.key}>
                    <a className="term" data-selected={selected} href="#" onClick={this.handleClick} data-term={term.key}>
                        <span className="facet-selector" data-tip={tooltip} data-multiline={true}>{icon}</span>
                        <span className={"facet-item" + (isParent ? " facet-item-group-header" : "")} data-tip={title.length > 30 ? title : null}>{title}</span>
                        {(isParent && subTerms) ? null : <span className="facet-count">{count}</span>}
                    </a>
                </li>
                {subTerms}
            </React.Fragment>
        );
    }

}


/**
 * @param {*} facetTerms        : facet's terms array
 * @param {*} searchText        : search text from basic search input
 * @param {*} includeSubTerms   : include sub terms
 * @returns {Object}            : returns { filteredTerms, filteredSubTerms }
 */
export function getFilteredTerms(facetTerms, searchText, includeSubTerms) {
    const filteredTerms = {};
    const filteredSubTerms = {};
    if (!facetTerms || !Array.isArray(facetTerms)) {
        return filteredTerms;
    }

    const lcSearchText = searchText && typeof searchText === 'string' && searchText.length > 0 ? searchText.toLocaleLowerCase() : '';

    _.forEach(facetTerms, function (term) {
        const { key = '' } = term || {};
        if (typeof key === 'string' && key.length > 0) {
            const isFiltered = lcSearchText.length > 0 ? key.toLocaleLowerCase().includes(lcSearchText) : true;
            //search sub terms
            const tmpFilteredSubTerms = {};
            if (includeSubTerms) {
                _.forEach(term.terms || [], function (sub) {
                    const { key: subKey = '' } = sub || {};
                    /*if (isFiltered) {
                        tmpFilteredSubTerms[subKey] = true;
                    } else */if (typeof subKey === 'string' && subKey.length > 0) {
                        const isSubFiltered = lcSearchText.length > 0 ? subKey.toLocaleLowerCase().includes(lcSearchText) : true;
                        if (isSubFiltered) {
                            tmpFilteredSubTerms[subKey] = true;
                        }
                    }
                });
            }
            if (isFiltered) {
                filteredTerms[key] = true;
            } else if (includeSubTerms && _.keys(tmpFilteredSubTerms).length > 0) {
                filteredTerms[key] = 'hidden';
            }
            _.extend(filteredSubTerms, tmpFilteredSubTerms);
        }
    });

    return { filteredTerms, filteredSubTerms };
}

export class FacetTermsList extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleOpenToggleClick = this.handleOpenToggleClick.bind(this);
        this.handleExpandListToggleClick = this.handleExpandListToggleClick.bind(this);
        this.handleSaytTermSearch = this.handleSaytTermSearch.bind(this);
        this.state = { 'expanded': false };
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

    handleSaytTermSearch(e) {
        const { facet, onTermClick } = this.props;
        const key = { 'key': e.display_title };
        onTermClick(facet, key);
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
            persistSelectedTerms: propPersistSelectedTerms,
            context,
            schemas,
            searchText,
            handleBasicTermSearch
        } = this.props;
        const { description: facetSchemaDescription = null, field, title: facetTitle, terms = [], persist_selected_terms: facetPersistSelectedTerms } = facet;
        // if it's defined within facet, override global persis selected terms
        const persistSelectedTerms = (typeof facetPersistSelectedTerms === 'boolean') ? facetPersistSelectedTerms : propPersistSelectedTerms;
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
                        <i className={"icon icon-fw icon-" + (allTermsSelected && useRadioIcon === false ? "dot-circle far" : (facetOpen ? "minus" : "plus") + " fas")}/>
                    </span>
                    <div className="col px-0 line-height-1">
                        <span data-tip={facetSchemaDescription || fieldSchemaDescription} data-html data-place="right">{ title }</span>
                        <ExtendedDescriptionPopoverIcon {...{ fieldSchema, facet, openPopover, setOpenPopover }} />
                    </div>
                    { indicator }
                </h5>
                <ListOfTerms
                    {...{ facet, facetOpen, terms, onTermClick, expanded, getTermStatus, termTransformFxn, searchText, schemas, persistentCount, basicSearchAutoDisplayLimit, useRadioIcon, persistSelectedTerms, filteringFieldTerm }}
                    onSaytTermSearch={this.handleSaytTermSearch} onBasicTermSearch={handleBasicTermSearch} onToggleExpanded={this.handleExpandListToggleClick} />
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
        basicSearchAutoDisplayLimit, useRadioIcon, persistSelectedTerms: propPersistSelectedTerms = true
    } = props;
    let { search_type: searchType = 'none' } = facet;
    const { persist_selected_terms: facetPersistSelectedTerms } = facet;

    // if it's defined within facet, override global persis selected terms
    const persistSelectedTerms = (typeof facetPersistSelectedTerms === 'boolean') ? facetPersistSelectedTerms : propPersistSelectedTerms;
    /**
     * even if search type is not defined, display basic search option when terms count
     * is greater than basicSearchAutoDisplayLimit (for persistSelectedTerms is true)
     */
    if (!persistSelectedTerms) {
        //searchType = 'none'; //override
    } else if (searchType === 'none') {
        const termsLength = !facet.has_group_by ? terms.length : _.reduce(terms, function (memo, term) { return memo + 1 + (term.terms || []).length; }, 0);
        if (termsLength >= basicSearchAutoDisplayLimit) {
            searchType = 'basic';
        }
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

        const facetSearchActive = searchType === 'basic' && searchText && typeof searchText === 'string' && searchText.length > 0;
        const {
            filteredTerms: textFilteredTerms = {},
            filteredSubTerms : textFilteredSubTerms = null
        } = facetSearchActive ? getFilteredTerms(terms, searchText, facet.has_group_by || false) : {};

        const allTermComponents = terms.map(function (term){
            const { field: currFilteringField, term: currFilteringTerm } = filteringFieldTerm || {};
            const isFiltering = field === currFilteringField && term.key === currFilteringTerm;
            // build tooltip sentence
            let tooltip = null;
            if (facetSearchActive && textFilteredTerms[term.key] === true && term.terms && textFilteredSubTerms) {
                const termName = facet.tooltip_term_substitue || 'term';
                const filteredTerms = _.filter(term.terms, function (t) { return textFilteredSubTerms[t.key]; });
                const status = getTermStatus(term, facet);
                const diff = term.terms.length - filteredTerms.length;
                tooltip = `Warning: ${term.terms.length} ${termName}${term.terms.length > 1 ? 's' : ''} ${status == 'none' ? 'will be' : 'are'} selected`;
                if (diff > 0) {
                    if (status !== 'none') {
                        tooltip += ` (${diff} currently selected ${termName}${diff > 1 ? 's are' : ' is'} hidden)`;
                    }
                    tooltip += `<br />To see all ${facet.tooltip_term_substitue || 'term'}s in this group clear the search filter`;
                }
            }
            return <Term {...{ facet, term, termTransformFxn, isFiltering, useRadioIcon, getTermStatus, textFilteredTerms, textFilteredSubTerms, facetSearchActive, tooltip }} onClick={onTermClick} key={term.key} status={getTermStatus(term, facet)} />;
        });
        const segments = segmentComponentsByStatus(allTermComponents);

        const { selected: selectedTermComponents = [], omitted : omittedTermComponents = [] } = segments;
        let { none : unselectedTermComponents  = [] } = segments;

        //filter unselected terms
        if (facetSearchActive) {
            unselectedTermComponents = _.filter(unselectedTermComponents, function (term) { return textFilteredTerms[term.key] === true || textFilteredTerms[term.key] === 'hidden'; });
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
                        name="q" onChange={onBasicTermSearch} value={searchText} key="facet-search-input" />
                </div>);
        } else if ((searchType === 'sayt') || (searchType === 'sayt_without_terms')) {
            let { sayt_item_type: itemType = '' } = facet || {};
            itemType = typeof itemType === 'string' && (itemType.length > 0) ? itemType : 'Item';
            const baseHref = "/search/?type=" + itemType;
            facetSearch = (
                <div className="d-flex flex-wrap text-small p-2">
                    <SearchAsYouTypeAjax baseHref={baseHref} showTips={true} onChange={onSaytTermSearch} key={itemType} />
                </div>
            );
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
                            { facetSearch }
                            <PartialList className="mb-0" open={expanded} persistent={persistentTerms} collapsible={collapsibleTerms} />
                            <div className="pt-08 pb-0">
                                <div className="view-more-button" onClick={onToggleExpanded}>{expandButtonTitle}</div>
                            </div>
                        </React.Fragment>
                    } />
                </div>
            );
        } else {
            // TODO: Finish later maybe, or remove
            // if (!facetSearch && termComponents.length === 0) {
            //     // No options/terms available; usually only case where no results found.
            //     return (
            //         <div {...commonProps}>
            //             <em className="text-secondary small">No options.</em>
            //         </div>
            //     );
            // }
            return (
                <div {...commonProps}>
                    <PartialList className="mb-0 active-terms-pl" open={facetOpen} persistent={activeTermComponents} collapsible={
                        <React.Fragment>
                            { facetSearch }
                            { unselectedTermComponents }
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
