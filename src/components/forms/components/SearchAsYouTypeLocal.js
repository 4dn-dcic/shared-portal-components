import React, { useState } from 'react';
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
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        className="btn btn-outline-dark dropdown-toggle"
    >
        {children}
    </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(function(props, ref){
    const {
        filterMethod,
        onChangeFx,
        toggleOpen,
        children,
        style,
        className,
        'aria-labelledby': labeledBy
    } = props;

    const [value, setValue] = useState('');

    function getRegexQuery() {
        switch (filterMethod) {
            case "includes":
                return valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)$";
            case "startsWith":
            default:
                return "^" + valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)$";
        }
    }

    const filteredItems = React.Children.toArray(children).filter((child) => {
        // as person types, generate a regex filter based on their input
        const regex = new RegExp(getRegexQuery());
        // show/hide entries depending on regex match
        return (child.props.children.toLowerCase()||"").match(regex);
    });

    function onSubmitNewEntry() {
        onChangeFx(value);
        toggleOpen();
    }

    function onKeyDown(e) {
        if (e.key === "Enter") {
            onSubmitNewEntry();
        } else if ((e.key === "ArrowDown" || e.key === "Tab") && filteredItems.length !== 0) {
            // add focus to the first item in filtered items
            const x = document.querySelector(".dropdown > .dropdown-menu.show > .list-unstyled");
            if (x.childNodes[0]) {
                x.childNodes[0].focus();
                e.preventDefault();
            }
        }
    }

    return (
        <div
            ref={ref}
            style={style, { overflowY: "hidden", width: "240px" }}
            className={className}
            aria-labelledby={labeledBy}
        >
            <div className="d-flex align-items-center">
                <div className="col">
                    <FormControl
                        autoFocus
                        placeholder="Type to filter..."
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => onKeyDown(e)}
                        value={value}
                        tabIndex="3"
                    />
                </div>
                {filteredItems.length === 0 && value.length > 0 ?
                    <div className="col-auto remove-button-container">
                        <button className="btn-success btn" type="button"
                            onClick={() => onSubmitNewEntry()}>
                            <i className="icon icon-plus fas"></i>
                        </button>
                    </div>
                    : null}
            </div>
            {filteredItems.length > 0 ?
                <ul className="list-unstyled" style={{ overflowY: "scroll", maxHeight: "250px",
                    marginBottom: "0" }}>
                    {filteredItems}
                </ul>
                : null}
        </div>
    );
});

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
        if (allowCustomValue) {// IDK maybe get rid of later.
            onChange(value);
        }

        console.log('ABCD', value, this.state.currentTextValue);
        this.setState({ currentTextValue: value });
        return false;
    }

    onDropdownSelect(eventKey){
        const { onChange } = this.props;
        onChange(eventKey);
    }

    render() {
        const { searchList, filterMethod = "startsWith", ...passProps } = this.props;
        const { currentTextValue } = this.state;
        let filteredOptions;
        let optionsHeader;

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
        }

        return (
            <SearchSelectionMenu {...passProps}
                options={filteredOptions}
                value={currentTextValue}
                optionsHeader={optionsHeader}
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


const SearchSelectionMenuBody = React.forwardRef(function(props, ref){
    const {
        value,
        onTextInputChange,
        onSelect,
        children,
        style,
        className,
        inputPlaceholder = "Type to filter...",
        allowCustomValue = false,
        onKeyDown,
        'aria-labelledby': labeledBy,
        optionsHeader
    } = props;

    return (
        <div
            ref={ref}
            style={style, { overflowY: "hidden", width: "240px" }}
            className={className}
            aria-labelledby={labeledBy}>
            <div className="d-flex align-items-center">
                <div className="col">
                    <FormControl autoFocus {...{ value }} onChange={onTextInputChange} placeholder={inputPlaceholder} tabIndex="3"/>
                </div>

                { allowCustomValue && value.length > 0 ?
                    <div className="col-auto remove-button-container">
                        <button className="btn-success btn" type="button"
                            onClick={null/*() => onSubmitNewEntry()   ????? should be onSelect maybe; hook in onKeyDown for Enter btn to call onSelect also */}>
                            <i className="icon icon-plus fas"></i>
                        </button>
                    </div>
                    : null }

            </div>
            { optionsHeader }
            <ul className="list-unstyled mb-0" style={{ overflowY: "scroll", maxHeight: "250px" }}>
                { children }
            </ul>
        </div>
    );
});



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
            value = "",
            options = [],
            optionRenderFunction = null,
            allowCustomValue = false,
            onDropdownSelect,
            onTextInputChange
        } = this.props;
        const { dropOpen } = this.state;
        return (
            <Dropdown drop="down" flip={false} onToggle={this.onToggleOpen} show={dropOpen}>

                <Dropdown.Toggle as={CustomToggle}>
                    { value || <span className="text-300">No value</span>}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ maxWidth: "240px", minHeight: "75px" }} as={SearchSelectionMenuBody} drop="down"
                    flip={false} show={dropOpen} onTextInputChange={onTextInputChange} toggleOpen={this.onToggleOpen}
                    onSelect={onDropdownSelect} allowCustomValue={allowCustomValue}>
                    {
                        options.map(function(optStr, idx){
                            const renderedOption = typeof optionRenderFunction === "function" ?
                                optionRenderFunction(optStr) : optStr;
                            return (
                                <Dropdown.Item key={optStr} eventKey={optStr} className="text-ellipsis-container" tabIndex="4">
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
