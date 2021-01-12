
'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import Collapse from 'react-bootstrap/esm/Collapse';
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Fade from 'react-bootstrap/esm/Fade';

import Popover from 'react-bootstrap/esm/Popover';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';

import { LocalizedTime } from './../../../ui/LocalizedTime';
import { PartialList } from './../../../ui/PartialList';
import { decorateNumberWithCommas } from './../../../util/value-transforms';
import { getSchemaProperty } from './../../../util/schema-transforms';
import { patchedConsoleInstance as console } from './../../../util/patched-console';
import { segmentComponentsByStatus } from './FacetTermsList';

import { ExtendedDescriptionPopoverIcon } from './ExtendedDescriptionPopoverIcon';

function getRangeStatus(range, toVal, fromVal) {
    const { from = null, to = null } = range || {};
    if (to === toVal && from === fromVal) {
        return "selected";
    }
    return "none";
}

export function getRangeValuesFromFiltersByField(facets = [], filters = []){
    const facetsByFilterField = {};
    const valuesByField = {};
    facets.forEach(function(f){
        if (f.aggregation_type !== "stats" && f.aggregation_type !== "range") {
            return; // Skip
        }
        facetsByFilterField[f.field + ".to"] = f;
        facetsByFilterField[f.field + ".from"] = f;
    });
    filters.forEach(function(f){
        const {
            field: filterField,
            term: strValue
        } = f; // filterField would have .to and .from appended.
        const facet = facetsByFilterField[filterField];
        if (!facet) return; // Skip, not range facet.
        const {
            field: facetField,
            field_type = "number" // aggregation_type = range doesn't always have a field_type
        } = facet;
        valuesByField[facetField] = valuesByField[facetField] || {};
        const value = (
            // Convert to float if numerical field type or leave as string if datetime, etc.
            field_type === "integer" ? parseInt(strValue)
                : field_type === "number" ? parseFloat(strValue)
                    : strValue
        );
        if (facetField + ".to" === filterField) {
            valuesByField[facetField].toVal = value;
        } else if (facetField + ".from" === filterField) {
            valuesByField[facetField].fromVal = value;
        } else {
            throw new Error("Unexpected range facet filter value or type");
        }
    });
    return valuesByField;
}


export class RangeFacet extends React.PureComponent {

    static parseAndValidate(facet, value){
        const {
            aggregation_type,
            field_type = aggregation_type === "range" ? "number" : "integer",
            number_step = "any"
        } = facet;

        if (value === "" || value === null){
            return null;
        }

        if (field_type === "date") {
            // Todo check if valid date string and set state.valid === false, upon which
            // to deny ability to apply.
            return value.toString();
        }

        let numVal = (field_type === "integer") ? parseInt(value) : parseFloat(value);

        if (isNaN(numVal)) {
            throw new Error("Is not a number - " + numVal);
        }

        if (number_step === "any") {
            return numVal;
        }

        if (typeof number_step !== "number" || isNaN(number_step) || number_step <= 0){
            console.error("Expected number_step to be a positive number");
            return numVal;
        }

        // Remove trailing decimals (if any) (round down)
        // Be careful re: float operations (imprecise) and favor integers
        if (number_step >= 1) {
            numVal = Math.floor(numVal / number_step) * number_step;
        } else {
            const diviser = Math.round(1 / number_step);
            numVal = Math.floor(numVal * diviser) / diviser;
        }

        return numVal;
    }

    static validIncrements(facet){
        const { min, max, increments } = facet;

        function ensureWithinRange(increment){
            if (typeof min === "number" && increment < min) return false;
            if (typeof max === "number" && increment > max) return false;
            return true;
        }

        if (Array.isArray(increments)) {
            const validIncrements = increments.filter(ensureWithinRange);
            return {
                "fromIncrements": validIncrements,
                "toIncrements": validIncrements
            };
        }

        const {
            from: fromIncrementsOrig = [],
            to: toIncrementsOrig = []
        } = increments || {};

        return {
            "fromIncrements": fromIncrementsOrig.filter(ensureWithinRange),
            "toIncrements": toIncrementsOrig.filter(ensureWithinRange)
        };
    }

    static initialStateValues(props){
        const {
            fromVal,
            toVal,
            facet: { field_type = "number" }
        } = props;

        const state = { fromVal, toVal };

        if (field_type === "date") {
            // Convert to strings so e.g. "2018" doesn't get interpreted as unix timestamp.
            state.fromVal = (fromVal && fromVal.toString()) || null;
            state.toVal = (toVal && toVal.toString()) || null;
        }

        return state;
    }

    constructor(props){
        super(props);
        this.handleOpenToggleClick = this.handleOpenToggleClick.bind(this);
        this.handleExpandListToggleClick = this.handleExpandListToggleClick.bind(this);
        this.setFrom = this.setFrom.bind(this);
        this.setTo = this.setTo.bind(this);
        this.setToAndFrom = this.setToAndFrom.bind(this);
        this.selectRange = this.selectRange.bind(this);
        this.resetFrom = this.resetFrom.bind(this);
        this.resetTo = this.resetTo.bind(this);
        this.resetToAndFrom = this.resetToAndFrom.bind(this); // tentative - will likely be replaced with a prop
        this.performUpdateFrom = this.performUpdateFrom.bind(this);
        this.performUpdateTo = this.performUpdateTo.bind(this);
        this.performUpdateToAndFrom = this.performUpdateToAndFrom.bind(this);
        this.termTitle = this.termTitle.bind(this);

        this.memoized = {
            fieldSchema: memoize(getSchemaProperty),
            validIncrements: memoize(RangeFacet.validIncrements)
        };

        this.state = { ...RangeFacet.initialStateValues(props), "facetClosing": false, "expanded": false };
    }

    componentDidUpdate(pastProps, pastState) {
        const { toVal: previousToVal, fromVal: previousFromVal } = pastProps;
        const { toVal, fromVal } = this.props;

        if ((toVal !== previousToVal) || (fromVal !== previousFromVal)) {
            // console.log("update occurred! toVal ", previousToVal, " -> ", toVal);
            // console.log("update occurred! fromVal ", previousFromVal, " -> ", fromVal);
            // force manual update TODO: update for specific filter block switch circumstances
            this.setState({ toVal, fromVal });
        }
    }

    setFrom(value, callback){
        const { facet } = this.props;
        // console.log("setFrom called with", value);
        try {
            const fromVal = RangeFacet.parseAndValidate(facet, value);
            this.setState({ fromVal }, callback);
        } catch (e){
            console.error("Couldn't set value", e);
        }
    }

    setTo(value, callback){
        const { facet } = this.props;
        // console.log("setTo called with", value);
        try {
            const toVal = RangeFacet.parseAndValidate(facet, value);
            this.setState({ toVal }, callback);
        } catch (e){
            console.error("Couldn't set value", e);
        }
    }

    setToAndFrom(toValue, fromValue, callback) {
        const { facet } = this.props;
        try {
            const fromVal = RangeFacet.parseAndValidate(facet, fromValue);
            const toVal = RangeFacet.parseAndValidate(facet, toValue);
            this.setState({ toVal, fromVal }, callback);
        } catch (e) {
            console.error("Couldn't set value", e);
        }
    }

    performUpdateFrom(){
        const { onFilter, facet } = this.props;
        const { fromVal } = this.state;
        // console.log("performUpdateFrom", fromVal);
        onFilter(
            { ...facet, field: facet.field + ".from" },
            { key: fromVal }
        );
    }

    performUpdateTo(){
        const { onFilter, facet } = this.props;
        const { toVal } = this.state;
        // console.log("performUpdateTo", toVal);
        onFilter(
            { ...facet, field: facet.field + ".to" },
            { key: toVal }
        );
    }

    performUpdateToAndFrom() {
        const { onFilterMultiple, facet } = this.props;
        const { toVal, fromVal } = this.state;
        // console.log("performUpdate", toVal, fromVal);
        onFilterMultiple(
            [{
                facet: { ...facet, field: facet.field + ".from" },
                term: { key: fromVal }
            },
            {
                facet: { ...facet, field: facet.field + ".to" },
                term: { key: toVal }
            }]
        );
    }

    resetFrom(e){
        e.stopPropagation();
        this.setFrom(null, this.performUpdateFrom);
    }

    resetTo(e){
        e.stopPropagation();
        this.setTo(null, this.performUpdateTo);
    }

    resetToAndFrom(e) {
        e.stopPropagation();
        this.setToAndFrom(null, null, this.performUpdateToAndFrom);
    }

    selectRange(to, from, e) {
        // console.log("selectRange", to, from);
        e.stopPropagation();
        this.setToAndFrom(to, from, this.performUpdateToAndFrom);
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

    /**
     * If no other transformations specified, and have a large number, then
     * condense it using `toExponential`.
     */
    termTitle(fieldName, value, allowJSX = true, toPrecision = true){
        const {
            facet: { field_type = "number" },
            termTransformFxn
        } = this.props;

        if (field_type === "date"){
            return <LocalizedTime timestamp={value} localize={false} />;
        }

        if (field_type !== "number" && field_type !== "integer") {
            throw new Error("Expect field_type to be 'number' or 'date'.");
        }

        const transformedValue = termTransformFxn(fieldName, value, allowJSX);
        if (typeof transformedValue !== "number") {
            return transformedValue;
        }
        const absVal = Math.abs(transformedValue);
        if (absVal.toString().length <= 6){
            // Else is too long and will go thru toPrecision or toExponential.
            if (absVal >= 1000) {
                return decorateNumberWithCommas(transformedValue);
            } else {
                return transformedValue;
            }
        }

        if (toPrecision) { return transformedValue.toPrecision(3); }
        return transformedValue.toExponential(3);
    }

    render(){
        const {
            schemas,
            itemTypeForSchemas,
            facet,
            title: propTitle,
            isStatic,
            fromVal: savedFromVal,
            toVal: savedToVal,
            facetOpen,
            openPopover,
            setOpenPopover
        } = this.props;
        const {
            aggregation_type,
            field_type = "number",
            field,
            ranges = [],
            min: minValue = null,
            min_as_string: minDateTime = null,
            max: maxValue = null,
            max_as_string: maxDateTime = null,
            title: facetTitle = null,
            description: facetSchemaDescription = null
        } = facet;
        const fieldSchema = this.memoized.fieldSchema(field, schemas, itemTypeForSchemas);
        const { description: fieldSchemaDescription } = fieldSchema || {}; // fieldSchema not present if no schemas loaded yet.
        const { fromVal, toVal, expanded } = this.state;
        const { fromIncrements, toIncrements } = this.memoized.validIncrements(facet);
        const title = propTitle || facetTitle || field;

        let fromTitle, toTitle;

        if (field_type === "number" || field_type === "integer") {
            if (aggregation_type === "stats") {
                fromTitle = (typeof fromVal === 'number' ? this.termTitle(facet.field, fromVal)
                    : typeof minValue === "number" ? this.termTitle(facet.field, minValue)
                        : <em>-Infinite</em>
                );
                toTitle = (typeof toVal === 'number' ? this.termTitle(facet.field, toVal)
                    : typeof maxValue === "number" ? this.termTitle(facet.field, maxValue)
                        : <em>Infinite</em>
                );
            } else if (aggregation_type === "range"){
                const { 0: firstRange = null } = ranges;
                const lastRange = ranges[ranges.length - 1] || {};
                fromTitle = (typeof fromVal === 'number' ? this.termTitle(facet.field, fromVal)
                    : typeof firstRange.from === "number" ? this.termTitle(facet.field, firstRange.from)
                        : <em>-Infinite</em>
                );
                toTitle = (typeof toVal === 'number' ? this.termTitle(facet.field, toVal)
                    : typeof lastRange.to === "number" ? this.termTitle(facet.field, lastRange.to)
                        : <em>Infinite</em>
                );
            }

        } else if (field_type === "date") {
            fromTitle = this.termTitle(facet.field, fromVal && typeof fromVal === 'string' ? fromVal : minDateTime || 0);
            toTitle = this.termTitle(facet.field, toVal && typeof toVal === 'string' ? toVal : maxDateTime) || <em>None</em>;
            console.log("DATE VALS", fromVal, facet.field, minDateTime, 0, fromTitle, toTitle);
        } else {
            throw new Error("Expected number|integer or date field_type. " + field + ' ' + field_type);
        }

        const isOpen = facetOpen || savedFromVal !== null || savedToVal !== null;


        const fromVariant = savedFromVal === null ? "outline-dark" : "primary";
        const toVariant = savedToVal === null ? "outline-dark" : "primary";

        return (
            <div className={"facet range-facet" + (facetOpen ? ' open' : ' closed')} data-field={facet.field}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw icon-" + (facetOpen ? "minus fas" : "plus fas")}/>
                    </span>
                    <div className="col px-0 line-height-1">
                        <span data-tip={facetSchemaDescription || fieldSchemaDescription} data-place="right">{ title }</span>
                        <ExtendedDescriptionPopoverIcon {...{ fieldSchema, facet, openPopover, setOpenPopover }} />
                    </div>
                    <Fade in={!isOpen}>
                        <span className={"closed-terms-count col-auto px-0" + (savedFromVal !== null || savedToVal !== null ? " some-selected" : "")}>
                            { isStatic?
                                <i className={"icon fas icon-" + (savedFromVal !== null || savedToVal !== null ? "circle" : "minus-circle")}
                                    style={{ opacity: savedFromVal !== null || savedToVal !== null ? 0.75 : 0.25 }}/>
                                : <i className="icon icon-fw icon-greater-than-equal fas" /> }
                        </span>
                    </Fade>
                </h5>

                <PartialList className="inner-panel" open={facetOpen}
                    persistent={[
                        <RangeClear {...{ fromTitle, toTitle, savedFromVal, savedToVal, facet, fieldSchema }} resetAll={this.resetToAndFrom} termTransformFxn={this.termTitle}
                            resetFrom={fromVal !== null ? this.resetFrom : null} resetTo={toVal !== null ? this.resetTo : null} key={0} />
                    ]}
                    collapsible={[
                        <div className="range-drop-group" key={0}>
                            <div className="range-drop">
                                <label className="mb-0 small">
                                    From:
                                </label>
                                <RangeDropdown
                                    title={fromTitle} value={fromVal} savedValue={savedFromVal}
                                    max={toVal || null} increments={fromIncrements} variant={fromVariant + " btn-xs"}
                                    onSelect={this.setFrom} update={this.performUpdateFrom} termTransformFxn={this.termTitle}
                                    facet={facet} id={"from_" + field} reset={fromVal !== null ? this.resetFrom : null} />
                                {/*
                                <div className={"clear-icon-container col-auto" + (fromVal === null ? " disabled" : " clickable")}
                                    onClick={fromVal !== null ? this.resetFrom : null}>
                                    <i className={"icon icon-fw fas icon-" + (fromVal === null ? "pencil" : "times-circle")}/>
                                </div>
                                */}
                            </div>
                            <div className="range-drop ml-05">
                                <label className="mb-0 small">
                                    To:
                                </label>
                                <RangeDropdown
                                    title={toTitle} value={toVal} savedValue={savedToVal}
                                    min={fromVal || null} increments={toIncrements} termTransformFxn={this.termTitle}
                                    variant={toVariant + " btn-xs"} onSelect={this.setTo} update={this.performUpdateTo}
                                    facet={facet} id={"to_" + field} reset={toVal !== null ? this.resetTo : null} />
                                {/*
                                <div className={"clear-icon-container col-auto" + (toVal === null ? " disabled" : " clickable")}
                                    onClick={toVal !== null ? this.resetTo : null}>
                                    <i className={"icon icon-fw fas icon-" + (toVal === null ? "pencil-alt" : "times-circle")}/>
                                </div>
                                */}
                            </div>
                        </div>,
                        (ranges && ranges.length > 0) ? <ListOfRanges {...this.props} {...{ expanded }} onToggleExpanded={this.handleExpandListToggleClick} onTermClick={this.selectRange} resetAll={this.resetToAndFrom}/> : null
                    ]} />
            </div>
        );
    }

}


const ListOfRanges = React.memo(function ListOfRanges(props){
    const { facet, facetOpen, facetClosing, persistentCount = 10, onTermClick, expanded, onToggleExpanded, termTransformFxn, toVal, fromVal, resetAll } = props;
    const { ranges = [] } = facet;

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
            (typeof from !== 'undefined' ? from : '<= ') +
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

        let displayLabel;
        if (label && label.includes("(")) { // if there are parenthesis, don't add another set
            displayLabel = label;
        } else if (label) {
            displayLabel = "(" + label + ")";
        } else {
            displayLabel = null;
        }

        return (
            <li className={"facet-list-element "} key={label} data-key={label}>
                <a className="term" data-selected={selected} href="#" onClick={status === "selected" ? resetAll : this.handleClick} data-term={label}>
                    <span className="facet-selector">{icon}</span>
                    <span className="facet-item" data-tip={title.length > 30 ? title : null}>{title} {displayLabel}</span>
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
    'onClick'           : PropTypes.func.isRequired
};

const RangeClear = React.memo(function RangeClear(props){
    const {
        savedFromVal,
        savedToVal,
        resetTo,
        resetFrom,
        resetAll,
        facet,
        termTransformFxn,
        fieldSchema = null
    } = props;

    const {
        field: facetField,
        title: facetTitle,
        abbreviation: facetAbbreviation = null
    } = facet;

    const { abbreviation: fieldAbbreviation = null } = fieldSchema || {};
    const abbreviatedTitle = facetAbbreviation || fieldAbbreviation || facetTitle;

    const savedFromTitle = termTransformFxn(facetField, savedFromVal, true);
    const savedToTitle = termTransformFxn(facetField, savedToVal, true);

    if (savedFromVal === null && savedToVal === null) {
        return null;
    } else if (savedFromVal !== null && savedToVal !== null) { // To and From present
        // Commented out b.c. not used atm:
        // const invalidRange = savedToVal < savedFromVal;
        // const btnVariant = invalidRange ? "btn-warning" : "btn-primary";
        return (
            <div className="range-clear">
                <li className="selected facet-list-element clickable">
                    <a onClick={resetAll}>
                        <span className="facet-selector">
                            <i className="icon icon-fw fas icon-minus-circle"/>
                        </span>
                        <span className="facet-item text-center" style={{ marginLeft: "-5px" }}>
                            {savedFromTitle} <i className="icon fas icon-less-than-equal icon-xs px-1"/> {abbreviatedTitle} <i className="icon fas icon-less-than-equal icon-xs px-1"/> {savedToTitle}
                        </span>
                    </a>
                </li>
            </div>
        );
    } else { // Only To or From present
        return (
            <div className="range-clear">
                <li className="selected facet-list-element clickable">
                    <a onClick={resetTo === null ? resetFrom : resetTo}>
                        <span className="facet-selector">
                            <i className="icon icon-fw fas icon-minus-circle"/>
                        </span>
                        <span className="facet-item text-center" style={{ marginLeft: "-5px" }}>
                            { savedToVal !== null ?
                                <React.Fragment>{abbreviatedTitle} <i className="icon fas icon-less-than-equal icon-xs px-1"/> {savedToTitle}</React.Fragment>
                                : null }
                            { savedFromVal !== null ?
                                <React.Fragment>{savedFromTitle} <i className="icon fas icon-less-than-equal icon-xs px-1"/> {abbreviatedTitle}</React.Fragment>
                                : null }
                        </span>
                    </a>
                </li>
            </div>
        );
    }
});


class RangeDropdown extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            showMenu : false,
            toggling: false
        };
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onDropdownSelect = this.onDropdownSelect.bind(this);
        this.onTextInputFormSubmit = this.onTextInputFormSubmit.bind(this);
        this.onTextInputKeyDown = this.onTextInputKeyDown.bind(this);
        this.toggleDrop = this.toggleDrop.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onTextInputChange(evt){
        const { onSelect } = this.props;
        const nextValue = evt.target.value;
        onSelect(nextValue);
    }

    /** Handles _numbers_ only. */
    onDropdownSelect(evtKey){
        const { onSelect, update, savedValue } = this.props;
        if (parseFloat(evtKey) === savedValue){
            return false;
        }
        onSelect(evtKey, update);
    }

    onTextInputFormSubmit(evt){
        const { update, savedValue, value } = this.props;
        const updateAble = (savedValue !== value);
        evt.preventDefault();
        evt.stopPropagation();
        if (!updateAble) {
            return;
        }
        update();
        this.toggleDrop();
    }

    onTextInputKeyDown(evt) {
        if (evt.key === "Enter" || evt.keyCode === 13) {
            this.onTextInputFormSubmit(evt);
            this.toggleDrop();
        }
        console.log("evt.key", evt.key);
        console.log("evt.keycode", evt.keyCode);
    }

    toggleDrop() {
        const { showMenu, toggling } = this.state;
        // Note: toggling state addresses bug where state updates stack and end up resulting in no state change
        if (!toggling) {
            this.setState({ showMenu : !showMenu, toggling: true }, () => {
                this.setState({ toggling: false });
            } );
        }
    }

    onBlur(evt) { // Update saved value with current value of input when clicking off
        this.onTextInputFormSubmit(evt);
    }

    render(){
        const { showMenu } = this.state;
        const {
            variant = "outline-dark", size = "sm", disabled = false,
            className = "range-dropdown-container col",
            min: propMin, max: propMax,
            value, savedValue,
            placeholder = "Type...",
            title,
            termTransformFxn, id,
            facet,
            increments = [],
            reset = null,
            tooltip
        } = this.props;
        const updateAble = (savedValue !== value);
        const {
            field_type = "number",
            min: fMin,
            max: fMax,
            number_step: step = "any"
        } = facet;

        const emptyValue = <span className="mx-1">-</span>;
        const showTitle = (
            <div className="d-flex">
                <div className="col px-0">{ value !== null ? title : emptyValue}</div>
            </div>
        );

        if (field_type === "date") {
            return (
                <DropdownButton {...{ variant, disabled, className, size, id }} alignRight title={showTitle} show={showMenu}
                    onToggle={this.toggleDrop} onBlur={this.onBlur} data-tip={tooltip} data-html>
                    <form className="inline-input-container pb-0 mb-0 border-0" onSubmit={this.onTextInputFormSubmit}>
                        <div className="input-element-container">
                            <input type="date" className="form-control" value={value} data-value={value}
                                onKeyDown={this.onTextInputKeyDown} onChange={this.onTextInputChange} />
                        </div>
                        <button type="submit" disabled={!updateAble} className="btn">
                            <i className="icon icon-fw icon-check fas"/>
                        </button>
                    </form>
                </DropdownButton>
            );

        } else if (field_type === "number" || field_type === "integer") {

            const min = (
                typeof propMin === "number" ? propMin
                    : typeof fMin === "number" ? fMin
                        : 0
            );
            const max = propMax || fMax || null;

            const menuOptsSet = [...increments].concat([min]).concat([max])
                .sort(function(a, b){
                    return a - b;
                })
                .reduce(function(m, incr){
                    if (typeof incr !== "number") {
                        return m;
                    }
                    m.add(incr); // Handles duplicates.
                    return m;
                }, new Set());

            const menuOptions = [...menuOptsSet].map(function(increment, indx){
                const active = increment === savedValue;
                return (
                    <DropdownItem disabled={disabled} key={increment} eventKey={increment === 0 ? increment.toString() : increment} active={active}>
                        { termTransformFxn(facet.field, increment, true) }
                        { increment === min ? <small> (min)</small> : null }
                        { increment === max ? <small> (max)</small> : null }
                    </DropdownItem>
                );
            });

            return (
                <DropdownButton {...{ variant, disabled, className, size, id }} alignRight onSelect={this.onDropdownSelect}
                    title={showTitle} show={showMenu} onToggle={this.toggleDrop} onBlur={this.onBlur} data-tip={tooltip} data-html>
                    <form className="inline-input-container" onSubmit={this.onTextInputFormSubmit}>
                        <div className="input-element-container">
                            <input type="number" className="form-control" {...{ value, placeholder, step }}
                                onKeyDown={this.onTextInputKeyDown} onChange={this.onTextInputChange} />
                        </div>
                        <button type="submit" disabled={!updateAble} className="btn">
                            <i className="icon icon-fw icon-check fas"/>
                        </button>
                    </form>
                    { menuOptions }
                </DropdownButton>
            );

        } else {
            throw new Error("Expected number, integer, or date field type.");
        }

    }
}

