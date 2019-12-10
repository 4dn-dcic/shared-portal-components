import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, FormControl } from 'react-bootstrap';

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
const CustomMenu = React.forwardRef(
    ({ // props
        filterMethod,
        onChangeFx,
        toggleOpen,
        children,
        style,
        className,
        'aria-labelledby': labeledBy
    },
    ref) => {
        const [value, setValue] = useState('');

        function escapeRegExp(string) { // todo: maybe move to util?
            // escapes regex characters from strings
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // handle escapable characters in regexp
        }

        function getRegexQuery() {
            switch (filterMethod) {
                case "includes":
                    return escapeRegExp(value.toLowerCase()) + "(.+)$";
                case "startsWith":
                default:
                    return "^" + escapeRegExp(value.toLowerCase()) + "(.+)$";
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
    },
);

export class SearchAsYouTypeLocal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropOpen: false,
        };
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    toggleOpen() {
        const { dropOpen } = this.state;
        this.setState({ dropOpen: !dropOpen });
    }

    render() {
        const { searchList, value, onChange, filterMethod } = this.props;
        const { dropOpen } = this.state;
        return (
            <Dropdown drop="down" flip={false} onToggle={this.toggleOpen} show={dropOpen}>
                <Dropdown.Toggle as={CustomToggle}>
                    { value || <span className="text-300">No value</span>}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ maxWidth: "240px", minHeight: "75px" }} as={CustomMenu} drop="down"
                    flip={false} show={dropOpen} onChangeFx={onChange} toggleOpen={this.toggleOpen}
                    filterMethod={filterMethod}>
                    { searchList.map((string, i) =>
                        <Dropdown.Item key={string} onSelect={(e) => { onChange(e); }} eventKey={string}
                            className={`text-ellipsis-container ${i === 0 ? "mt-1" : null}`} tabIndex="4">
                            {string}
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
SearchAsYouTypeLocal.propTypes = {
    searchList : PropTypes.arrayOf(PropTypes.string).isRequired,
    value : PropTypes.string,
    onChange : PropTypes.func.isRequired,
    filterMethod : PropTypes.string // "startsWith", "includes" (can add more in future if necessary) -- defaults to startsWith
};