
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { DropdownButton, DropdownItem } from 'react-bootstrap';

import { patchedConsoleInstance as console } from './../../../util/patched-console';

import { Collapse } from './../../../ui/Collapse';

export class RangeFacet extends React.PureComponent {

    static parseNumber(facet, value){
        const { type = "integer" } = facet;

        if (value === "" || value === null){
            return null;
        }

        const numVal = type === "integer" ? parseInt(value) : parseFloat(value);

        if (isNaN(numVal)) {
            throw new Error("Is not a number - " + numVal);
        }

        return numVal;
    }

    static parseAndValidate(facet, value){
        const { min, max } = facet;

        const numVal = RangeFacet.parseNumber(facet, value);

        if (numVal === null) {
            return null;
        }
        if (typeof min === "number"){
            if (min === numVal) {
                return null;
            }
            if (numVal < min){
                return min;
            }
        }
        if (typeof max === "number"){
            if (max === numVal) {
                return null;
            }
            if (numVal > max){
                return max;
            }
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

    static getValueFromFilters(facet, filters = []){
        const { field } = facet;
        const toFilter = _.findWhere(filters, { field: field + ".to" });
        const fromFilter = _.findWhere(filters, { field: field + ".from" });
        let fromVal = null;
        let toVal = null;
        if (fromFilter) {
            fromVal = RangeFacet.parseNumber(facet, fromFilter.term);
        }
        if (toFilter) {
            toVal = RangeFacet.parseNumber(facet, toFilter.term);
        }
        return { fromVal, toVal };
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

        this.memoized = {
            validIncrements: memoize(RangeFacet.validIncrements),
            getValueFromFilters: memoize(RangeFacet.getValueFromFilters)
        };

        this.state = {
            facetOpen : props.defaultFacetOpen || false,
            facetClosing: false,
            ...this.memoized.getValueFromFilters(props.facet, props.filters)
        };
    }

    componentDidUpdate(pastProps){
        const { facet, filters, mounted, defaultFacetOpen } = this.props;
        const { facet: pastFacet, filters: pastFilters, mounted: pastMounted, defaultFacetOpen: pastDefOpen } = pastProps;
        if (facet !== pastFacet || filters !== pastFilters){
            this.setState(this.memoized.getValueFromFilters(facet, filters));
        }

        const { facetOpen } = this.state;
        if (
            (
                !pastMounted && mounted && typeof defaultFacetOpen === 'boolean' && defaultFacetOpen !== pastDefOpen
            ) || (
                defaultFacetOpen === true && !pastDefOpen && !facetOpen
            )
        ){
            this.setState({ 'facetOpen' : true });
        }
    }

    setFrom(value, callback){
        const { facet } = this.props;
        const { min, max } = facet;
        try {
            let fromVal = RangeFacet.parseAndValidate(facet, value);
            this.setState(function({ toVal }){
                if (fromVal === null || fromVal === min) {
                    return { fromVal: null };
                }
                if (typeof toVal === "number" && toVal < fromVal){
                    fromVal = toVal;
                }
                if (typeof min === "number" && fromVal < min){
                    fromVal = min;
                }
                if (typeof max === "number" && fromVal > max){
                    fromVal = max;
                }
                return { fromVal };
            }, callback);
        } catch (e){
            console.error("Couldn't set value", e);
        }
    }

    setTo(value, callback){
        const { facet } = this.props;
        const { min, max } = facet;
        try {
            let toVal = RangeFacet.parseAndValidate(facet, value);
            this.setState(function({ fromVal }){
                if (toVal === null || toVal === max) {
                    return { toVal: null };
                }
                if (typeof fromVal === "number" && fromVal > toVal){
                    toVal = fromVal;
                }
                if (typeof min === "number" && toVal < min){
                    toVal = min;
                }
                if (typeof max === "number" && toVal > max){
                    toVal = max;
                }
                return { toVal };
            }, callback);
        } catch (e){
            console.error("Couldn't set value", e);
        }
    }

    performUpdateFrom(){
        const { onFilter, facet } = this.props;
        const { fromVal } = this.state;
        onFilter(
            { ...facet, field: facet.field + ".from" },
            { key: fromVal },
            null,
            false
        );
    }

    performUpdateTo(){
        const { onFilter, facet } = this.props;
        const { toVal } = this.state;
        onFilter(
            { ...facet, field: facet.field + ".to" },
            { key: toVal },
            null,
            false
        );
    }

    resetFrom(){
        this.setFrom(null, this.performUpdateFrom);
    }

    resetTo(){
        this.setTo(null, this.performUpdateTo);
    }

    handleOpenToggleClick(){
        this.setState(function({ facetOpen }){
            return { facetOpen: !facetOpen };
        });
    }

    render(){
        const { facet, title, tooltip, termTransformFxn, filters } = this.props;
        const { field, min, max } = facet;
        const { facetOpen, facetClosing, fromVal, toVal } = this.state;
        const { fromIncrements, toIncrements } = this.memoized.validIncrements(facet);
        const { fromVal: savedFromVal, toVal: savedToVal } = this.memoized.getValueFromFilters(facet, filters);

        return (
            <div className={"facet range-facet" + (facetOpen ? ' open' : ' closed') + (facetClosing ? ' closing' : '')} data-field={facet.field}>
                <h5 className="facet-title" onClick={this.handleOpenToggleClick}>
                    <span className="expand-toggle col-auto px-0">
                        <i className={"icon icon-fw fas " + (facetOpen && !facetClosing ? "icon-minus" : "icon-plus")}/>
                    </span>
                    <span className="inline-block col px-0" data-tip={tooltip} data-place="right">{ title }</span>
                    <span className="icon-container col-auto px-0">
                        <i className="icon icon-fw icon-hashtag fas" />
                    </span>
                </h5>
                <Collapse in={facetOpen && !facetClosing}>
                    <div className="inner-panel">
                        <div className="row">
                            <label className="col-auto mb-0">
                                <i className="icon icon-fw icon-greater-than-equal fas small"/>
                            </label>
                            <RangeDropdown title={termTransformFxn(facet.field, typeof fromVal === 'number' ? fromVal : min, true)}
                                value={fromVal} onSelect={this.setFrom} max={toVal || null} increments={fromIncrements}
                                variant={typeof fromVal === "number" || savedFromVal ? "primary" : "outline-dark"} savedValue={savedFromVal}
                                {...{ termTransformFxn, facet }} id={"from_" + field} update={this.performUpdateFrom} />
                            <div className={"clear-icon-container col-auto" + (fromVal === null ? " disabled" : " clickable")}
                                onClick={fromVal !== null ? this.resetFrom : null}>
                                <i className={"icon icon-fw fas icon-" + (fromVal === null ? "pencil" : "times-circle")}/>
                            </div>
                        </div>
                        <div className="row">
                            <label className="col-auto mb-0">
                                <i className="icon icon-fw icon-less-than-equal fas small"/>
                            </label>
                            <RangeDropdown title={termTransformFxn(facet.field, typeof toVal === 'number' ? toVal : max, true)}
                                value={toVal} onSelect={this.setTo} min={fromVal || null} increments={toIncrements}
                                variant={typeof toVal === "number" || savedToVal ? "primary" : "outline-dark"} savedValue={savedToVal}
                                {...{ termTransformFxn, facet }} id={"to_" + field} update={this.performUpdateTo} />
                            <div className={"clear-icon-container col-auto" + (toVal === null ? " disabled" : " clickable")}
                                onClick={toVal !== null ? this.resetTo : null}>
                                <i className={"icon icon-fw fas icon-" + (toVal === null ? "pencil" : "times-circle")}/>
                            </div>
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
            placeholder = "Type...", title,
            termTransformFxn, id,
            facet, increments = []
        } = this.props;

        const { min: fMin, max: fMax } = facet;
        const min = typeof propMin === "number" ? propMin
            : typeof fMin === "number" ? fMin
                : 0;
        const max = propMax || fMax || null;

        const menuOptions = [...(
            [].concat([min]).concat(increments).concat([max])
                .sort(function(a, b){
                    return a - b;
                })
                .reduce(function(m, incr){
                    if (typeof incr !== "number") {
                        return m;
                    }
                    m.add(incr); // Handles duplicates.
                    return m;
                }, new Set())
        )].map(function(increment, indx){
            const active = increment === savedValue;
            const disabled = (typeof min === "number" && increment < min) || (typeof max === "number" && increment > max);
            return (
                <DropdownItem disabled={disabled} key={increment} eventKey={increment} active={active}>
                    { termTransformFxn(facet.field, increment, true) }
                    { increment === min ? <small> (min)</small> : null }
                    { increment === max ? <small> (max)</small> : null }
                </DropdownItem>
            );
        });

        console.log("RRRRR", savedValue, value);

        const updateAble = (savedValue !== value);

        return (
            <DropdownButton {...{ variant, disabled, className, title, size, id }} alignRight onSelect={this.onDropdownSelect}>
                <form className="inline-input-container" onSubmit={this.onTextInputFormSubmit}>
                    <input type="number" className="form-control" {...{ min, max, value, placeholder }} onChange={this.onTextInputChange} />
                    <button type="submit" disabled={!updateAble} className="btn">
                        <i className="icon icon-fw icon-check fas"/>
                    </button>
                </form>
                { menuOptions }
            </DropdownButton>
        );
    }
}

