
'use strict';

import React from 'react';
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
import { decorateNumberWithCommas } from './../../../util/value-transforms';
import { getSchemaProperty } from './../../../util/schema-transforms';
import { patchedConsoleInstance as console } from './../../../util/patched-console';

import { ExtendedDescriptionPopoverIcon } from './ExtendedDescriptionPopoverIcon';



export function getRangeValuesFromFiltersByField(facets = [], filters = []){
    const facetsByFilterField = {};
    const valuesByField = {};
    facets.forEach(function(f){
        if (f.aggregation_type !== "stats") {
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
            field_type
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
            field_type = "integer",
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
        this.setFrom = this.setFrom.bind(this);
        this.setTo = this.setTo.bind(this);
        this.resetFrom = this.resetFrom.bind(this);
        this.resetTo = this.resetTo.bind(this);
        this.performUpdateFrom = this.performUpdateFrom.bind(this);
        this.performUpdateTo = this.performUpdateTo.bind(this);
        this.termTitle = this.termTitle.bind(this);

        this.memoized = {
            fieldSchema: memoize(getSchemaProperty),
            validIncrements: memoize(RangeFacet.validIncrements)
        };

        this.state = { ...RangeFacet.initialStateValues(props), "facetClosing": false };
    }

    /**
     * Resets state fromVal and toVal if value from props changes (new filters, etc. received).
     * Example is if different filter block in CGAP FilterSetUI is selected.
     */
    componentDidUpdate(pastProps){
        const { fromVal, toVal } = this.props;
        const { fromVal: pastFromVal, toVal: pastToVal } = pastProps;
        if (fromVal !== pastFromVal || toVal !== pastToVal) {
            this.setState(RangeFacet.initialStateValues(this.props));
        }
    }

    setFrom(value, callback){
        const { facet } = this.props;
        try {
            const fromVal = RangeFacet.parseAndValidate(facet, value);
            this.setState({ fromVal }, callback);
        } catch (e){
            console.error("Couldn't set value", e);
        }
    }

    setTo(value, callback){
        const { facet } = this.props;
        try {
            const toVal = RangeFacet.parseAndValidate(facet, value);
            this.setState({ toVal }, callback);
        } catch (e){
            console.error("Couldn't set value", e);
        }
    }

    performUpdateFrom(){
        const { onFilter, facet } = this.props;
        const { fromVal } = this.state;
        onFilter(
            { ...facet, field: facet.field + ".from" },
            { key: fromVal }
        );
    }

    performUpdateTo(){
        const { onFilter, facet } = this.props;
        const { toVal } = this.state;
        onFilter(
            { ...facet, field: facet.field + ".to" },
            { key: toVal }
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

    handleOpenToggleClick(e) {
        e.preventDefault();
        const { onToggleOpen, facet: { field }, facetOpen = false } = this.props;
        onToggleOpen(field, !facetOpen);
    }

    /**
     * If no other transformations specified, and have a large number, then
     * condense it using `toExponential`.
     */
    termTitle(fieldName, value, allowJSX = true){
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
        if (absVal.toString().length <= 7){
            // Else is too long and will go thru toPrecision or toExponential.
            if (absVal >= 1000) {
                return decorateNumberWithCommas(transformedValue);
            } else {
                return transformedValue;
            }
        }
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
            field_type = "number",
            field,
            min: minValue = null,
            min_as_string: minDateTime = null,
            max: maxValue = null,
            max_as_string: maxDateTime = null,
            title: facetTitle = null,
            description: facetSchemaDescription = null
        } = facet;
        const fieldSchema = this.memoized.fieldSchema(field, schemas, itemTypeForSchemas);
        const { description: fieldSchemaDescription } = fieldSchema || {}; // fieldSchema not present if no schemas loaded yet.
        const { fromVal, toVal } = this.state;
        const { fromIncrements, toIncrements } = this.memoized.validIncrements(facet);
        const title = propTitle || facetTitle || field;

        let fromTitle, toTitle;

        if (field_type === "number" || field_type === "integer") {
            fromTitle = (typeof fromVal === 'number' ? this.termTitle(facet.field, fromVal)
                : typeof minValue === "number" ? this.termTitle(facet.field, minValue)
                    : <em>-Infinite</em>
            );
            toTitle = (typeof toVal === 'number' ? this.termTitle(facet.field, toVal)
                : typeof maxValue === "number" ? this.termTitle(facet.field, maxValue)
                    : <em>Infinite</em>
            );
        } else if (field_type === "date") {
            fromTitle = this.termTitle(facet.field, fromVal && typeof fromVal === 'string' ? fromVal : minDateTime || 0);
            toTitle = this.termTitle(facet.field, toVal && typeof toVal === 'string' ? toVal : maxDateTime) || <em>None</em>;
            console.log("DATE VALS", fromVal, facet.field, minDateTime, 0, fromTitle, toTitle);
        } else {
            throw new Error("Expected number|integer or date field_type. " + field + ' ' + field_type);
        }

        const isOpen = facetOpen || savedFromVal !== null || savedToVal !== null;

        return (
            <div className={"facet range-facet" + (isOpen ? ' open' : ' closed')} data-field={facet.field}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw icon-" + (savedFromVal !== null || savedToVal !== null ? "dot-circle far" : (isOpen ? "minus fas" : "plus fas"))}/>
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
                <Collapse in={isOpen}>
                    <div className="inner-panel">
                        <div className="row">
                            <label className="col-auto mb-0">
                                <i className="icon icon-fw icon-greater-than-equal fas small"/>
                            </label>
                            <RangeDropdown
                                title={fromTitle} value={fromVal} savedValue={savedFromVal}
                                max={toVal || null} increments={fromIncrements}
                                variant={typeof fromVal === "number" || savedFromVal ? "primary" : "outline-dark"}
                                onSelect={this.setFrom} update={this.performUpdateFrom} termTransformFxn={this.termTitle}
                                facet={facet} id={"from_" + field} reset={fromVal !== null ? this.resetFrom : null} />
                            {/*
                            <div className={"clear-icon-container col-auto" + (fromVal === null ? " disabled" : " clickable")}
                                onClick={fromVal !== null ? this.resetFrom : null}>
                                <i className={"icon icon-fw fas icon-" + (fromVal === null ? "pencil" : "times-circle")}/>
                            </div>
                            */}
                        </div>
                        <div className="row">
                            <label className="col-auto mb-0">
                                <i className="icon icon-fw icon-less-than-equal fas small"/>
                            </label>
                            <RangeDropdown
                                title={toTitle} value={toVal} savedValue={savedToVal}
                                min={fromVal || null} increments={toIncrements}
                                variant={typeof toVal === "number" || savedToVal ? "primary" : "outline-dark"}
                                onSelect={this.setTo} update={this.performUpdateTo} termTransformFxn={this.termTitle}
                                facet={facet} id={"to_" + field} reset={toVal !== null ? this.resetTo : null} />
                            {/*
                            <div className={"clear-icon-container col-auto" + (toVal === null ? " disabled" : " clickable")}
                                onClick={toVal !== null ? this.resetTo : null}>
                                <i className={"icon icon-fw fas icon-" + (toVal === null ? "pencil-alt" : "times-circle")}/>
                            </div>
                            */}
                        </div>
                    </div>
                </Collapse>
            </div>
        );
    }

}

class RangeDropdown extends React.PureComponent {

    constructor(props){
        super(props);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onDropdownSelect = this.onDropdownSelect.bind(this);
        this.onTextInputFormSubmit = this.onTextInputFormSubmit.bind(this);
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
    }

    render(){
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
            reset = null
        } = this.props;
        const updateAble = (savedValue !== value);
        const {
            field_type = "number",
            min: fMin,
            max: fMax,
            number_step: step = "any"
        } = facet;

        let showTitle = title;

        if (typeof reset === "function") {
            showTitle = (
                <div className="d-flex">
                    <div className="clear-icon-container col-auto clickable d-flex align-items-center" onClick={reset}
                        data-tip="Click to unset">
                        <i className="icon icon-fw fas icon-minus-circle"/>
                    </div>
                    <div className="col px-0">{ title }</div>
                </div>
            );
        }

        if (field_type === "date") {
            return (
                <DropdownButton {...{ variant, disabled, className, size, id }} alignRight title={showTitle}>
                    <form className="inline-input-container pb-0 mb-0 border-0" onSubmit={this.onTextInputFormSubmit}>
                        <div className="input-element-container">
                            <input type="date" className="form-control"
                                value={value} data-value={value} onChange={this.onTextInputChange} />
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
                    <DropdownItem disabled={disabled} key={increment} eventKey={increment} active={active}>
                        { termTransformFxn(facet.field, increment, true) }
                        { increment === min ? <small> (min)</small> : null }
                        { increment === max ? <small> (max)</small> : null }
                    </DropdownItem>
                );
            });

            return (
                <DropdownButton {...{ variant, disabled, className, size, id }} alignRight onSelect={this.onDropdownSelect} title={showTitle}>
                    <form className="inline-input-container" onSubmit={this.onTextInputFormSubmit}>
                        <div className="input-element-container">
                            <input type="number" className="form-control" {...{ value, placeholder, step }} onChange={this.onTextInputChange} />
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

