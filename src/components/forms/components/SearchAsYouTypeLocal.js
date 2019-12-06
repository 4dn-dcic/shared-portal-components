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
    ({ onChangeFx, toggleOpen, children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        function escapeRegExp(string) { // todo: maybe move to util?
            // escapes regex characters from strings
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // handle escapable characters in regexp
        }

        const filteredItems = React.Children.toArray(children).filter((child) => {
            // as person types, generate a regex filter based on their input
            const regex = new RegExp("^" + escapeRegExp(value.toLowerCase()) + "(.+)$");
            // show/hide entries depending on regex match
            return (child.props.children.toLowerCase()||"").match(regex);
        });

        function onSubmitNewEntry(e) {
            console.log("attempting to submit new entry");
            onChangeFx(value);
            toggleOpen();
        }

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />

                {filteredItems.length > 0 ?  <ul className="list-unstyled">{filteredItems}</ul> : null}
                {filteredItems.length === 0 && value.length > 0 ? <button type="button" onClick={(e) => onSubmitNewEntry(e)}>+</button>: null}
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
        console.log("toggling state of drop down");
        const { dropOpen } = this.state;
        this.setState({ dropOpen: !dropOpen });
    }

    render() {
        const { searchList, value, onChange } = this.props;
        const { dropOpen } = this.state;
        return (
            <Dropdown drop="down" flip={false} onToggle={this.toggleOpen} show={dropOpen}>
                <Dropdown.Toggle as={CustomToggle}>
                    { value || <span className="text-300">No value</span>}
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu} drop="down" flip={false} focusFirstItemOnShow="keyboard" show={dropOpen} onChangeFx={onChange} toggleOpen={this.toggleOpen}>
                    { searchList.map((string, i) => <Dropdown.Item key={string} onSelect={(e) => { onChange(e); }} eventKey={string}>{string}</Dropdown.Item> )}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
SearchAsYouTypeLocal.propTypes = {
    searchList : PropTypes.array.isRequired,
    value : PropTypes.string,
    onChange : PropTypes.func.isRequired
};