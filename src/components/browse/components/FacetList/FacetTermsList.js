'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';

import { stackDotsInContainer } from './../../../viz/utilities';
import { Collapse } from './../../../ui/Collapse';
import { Fade } from './../../../ui/Fade';
import { PartialList } from './../../../ui/PartialList';


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
 * Used in FacetList
 */
export function countTermsSelected(terms = [], facet, filters = []){
    const activeTermsForField = {};
    let count = 0;
    filters.forEach(function(f){
        if (f.field !== facet.field) return;
        activeTermsForField[f.term] = true;
    });

    for (let i = 0; i < terms.length; i++){
        if (activeTermsForField[terms[i].key]) {
            count++;
        }
    }
    return count;
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
    }

    componentDidUpdate(pastProps, pastState){
        const { anyTermsSelected: anySelected, mounted, defaultFacetOpen, isStatic } = this.props;
        const { mounted: pastMounted, defaultFacetOpen: pastDefaultOpen, isStatic: pastStatic } = pastProps;

        this.setState(({ facetOpen: currFacetOpen }) => {
            if (!pastMounted && mounted && typeof defaultFacetOpen === 'boolean' && defaultFacetOpen !== pastDefaultOpen) {
                return { 'facetOpen' : true };
            }
            if (defaultFacetOpen === true && !pastDefaultOpen && !currFacetOpen){
                return { 'facetOpen' : true };
            }
            if (currFacetOpen && isStatic && !pastStatic && !anySelected){
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
        const { facet, terms, tooltip, title, isStatic, anyTermsSelected: anySelected, termsSelectedCount } = this.props;
        const { facetOpen, facetClosing } = this.state;
        const termsLen = terms.length;
        let indicator;

        // @todo: much of this code (including mergeTerms and anyTermsSelected above) were moved to index; consider moving these too
        if (isStatic || termsLen === 1){
            indicator = ( // Small indicator to help represent how many terms there are available for this Facet.
                <Fade in={facetClosing || !facetOpen}>
                    <span className={"closed-terms-count col-auto px-0" + (anySelected ? " some-selected" : "")}
                        data-tip={"No useful options (1 total)" + (anySelected ? "; is selected" : "")}
                        data-place="right" data-any-selected={anySelected}>
                        <CountIndicator count={termsLen} countActive={termsSelectedCount} />
                    </span>
                </Fade>
            );
        } else {
            indicator = ( // Small indicator to help represent how many terms there are available for this Facet.
                <Fade in={facetClosing || !facetOpen}>
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



export const CountIndicator = React.memo(function CountIndicator({ count = 1, countActive = 0, height = 16, width = 40 }){
    const dotCountToShow = Math.min(count, 21);
    const dotCoords = stackDotsInContainer(dotCountToShow, height, 4, 2, false);
    const dots = dotCoords.map(function([ x, y ], idx){
        const colIdx = Math.floor(idx / 3);
        // Flip both axes so going bottom right to top left.
        return (
            <circle cx={width - x + 1} cy={height - y + 1} r={2} key={idx} data-original-index={idx}
                style={{ opacity: 1 - (colIdx * .125) }} className={(count - idx) <= countActive ? "active" : null} />
        );
    });
    return (
        <svg className="svg-count-indicator" viewBox={`0 0 ${width + 2} ${height + 2}`} width={width + 2} height={height + 2}>
            { dots }
        </svg>
    );
});

