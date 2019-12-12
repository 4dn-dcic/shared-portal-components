import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { Dropdown, FormControl } from 'react-bootstrap';

import { valueTransforms } from './../../util';

/*
Custom Bootstrap Dropdown code adapted from:
https://react-bootstrap.github.io/components/dropdowns/#custom-dropdown-components
*/

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a href="#" ref={ref} className="btn btn-outline-dark dropdown-toggle"
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}>
        { children }
    </a>
));


export class SearchAsYouTypeLocal extends React.PureComponent {

    static getRegexQuery(value, filterMethod) {
        switch (filterMethod) {
            case "includes":
                return valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)$";
            case "startsWith":
            default:
                return "^" + valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)$";
        }
    }

    static filterOptions(currTextValue, allResults = [], filterMethod = "startsWith"){
        const regexQuery = SearchAsYouTypeLocal.getRegexQuery(currTextValue, filterMethod);
        return allResults.filter(function(optStr){
            return !!(optStr.toLowerCase().match(regexQuery));
        });
    }

    constructor(props) {
        super(props);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onDropdownSelect = this.onDropdownSelect.bind(this);

        this.state = {
            currentTextValue : props.value || ""
        };

        this.memoized = {
            filterOptions : memoize(SearchAsYouTypeLocal.filterOptions)
        };
    }

    onTextInputChange(evt){
        const { onChange, allowCustomValue = false } = this.props;
        const value = evt.target.value;
        if (allowCustomValue) {
            onChange(value);
        }
        this.setState({ currentTextValue: value });
        return false;
    }

    onDropdownSelect(eventKey, evt){
        const { onChange } = this.props;
        onChange(eventKey);
    }

    render() {
        const { searchList, filterMethod = "startsWith", ...passProps } = this.props;
        const { currentTextValue } = this.state;
        let filteredOptions;
        let optionsHeader;
        let optionsFooter;

        if (!Array.isArray(searchList)){
            // Likely, schemas are not yet loaded?
            filteredOptions = [];
            optionsHeader = (
                <div className="text-center py-2">
                    <i className="icon icon-spin icon-circle-notch fas"/>
                </div>
            );
        } else {
            filteredOptions = this.memoized.filterOptions(currentTextValue, searchList, filterMethod);
            if (filteredOptions.length === 0) {
                optionsHeader = <em className="d-block text-center px-4">Adding new entry</em>;
            }
        }

        return (
            <SearchSelectionMenu {...passProps} {...{ optionsHeader, optionsFooter, currentTextValue }}
                options={filteredOptions}
                onTextInputChange={this.onTextInputChange}
                onDropdownSelect={this.onDropdownSelect}/>
        );
    }
}
SearchAsYouTypeLocal.propTypes = {
    searchList : PropTypes.arrayOf(PropTypes.string).isRequired,
    value : PropTypes.string,
    onChange : PropTypes.func.isRequired,
    filterMethod : PropTypes.string, // "startsWith", "includes" (can add more in future if necessary) -- defaults to startsWith
    allowCustomValue: PropTypes.bool
};


export class SearchSelectionMenu extends React.PureComponent {
    constructor(props){
        super(props);
        this.onToggleOpen = this.onToggleOpen.bind(this);
        this.state = {
            dropOpen: false
        };
    }

    onToggleOpen(){
        this.setState(function({ dropOpen }){
            return { dropOpen: !dropOpen };
        });
    }

    render(){
        const {
            currentTextValue = "", // Temporary text value
            value = "", // Saved value. Would be === to currentTextValue if allowCustomValue is true.
            options = [],
            optionRenderFunction = null,
            onDropdownSelect,
            onTextInputChange,
            optionsHeader,
            optionsFooter
        } = this.props;
        const { dropOpen } = this.state;
        return (
            <Dropdown drop="down" flip={false} onToggle={this.onToggleOpen} show={dropOpen} onSelect={onDropdownSelect}>

                <Dropdown.Toggle as={CustomToggle}>
                    { value || <span className="text-300">No value</span>}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ maxWidth: "240px", minHeight: "75px" }} as={SearchSelectionMenuBody} drop="down"
                    flip={false} show={dropOpen} onTextInputChange={onTextInputChange} toggleOpen={this.onToggleOpen}
                    {...{ onTextInputChange, optionsHeader, optionsFooter }}>
                    {
                        options.map(function(optStr, idx){
                            const renderedOption = typeof optionRenderFunction === "function" ?
                                optionRenderFunction(optStr) : optStr;
                            return (
                                <Dropdown.Item key={optStr} eventKey={optStr} className="text-ellipsis-container" tabIndex="3">
                                    { renderedOption }
                                </Dropdown.Item>
                            );
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

const SearchSelectionMenuBody = React.forwardRef(function(props, ref){
    const {
        value,
        show = false,
        onTextInputChange,
        children,
        style,
        className,
        inputPlaceholder = "Type to filter...",
        'aria-labelledby': labeledBy,
        optionsHeader = null,
        optionsFooter = null
    } = props;

    const cls = "search-selection-menu" + (className ? " " + className : "");

    return (
        <div ref={ref} style={style, { overflowY: "hidden", width: "240px", transform: "translate3d(0,0,0)", padding: 0 }}
            className={cls} aria-labelledby={labeledBy}>
            <div className="inner-container">
                <div className="d-flex align-items-center text-input-container" style={{ borderBottom: "1px solid #eee" }}>
                    <div className="px-3 py-3" style={{ width: "100%" }}>
                        { show ?
                            <input type="text" autoFocus value={value} onChange={onTextInputChange} placeholder={inputPlaceholder} tabIndex="3"
                                className="form-control"/>
                            : null }
                    </div>
                </div>
                <div className="scrollable-list-container" style={{ overflowY: "auto", maxHeight: "250px" }}>
                    <ul className="list-unstyled mb-0 py-2">
                        { optionsHeader }
                        { children }
                        { optionsFooter }
                    </ul>
                </div>
            </div>
        </div>
    );
});
