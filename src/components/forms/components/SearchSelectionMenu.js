import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';


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
            optionsFooter,
            className
        } = this.props;
        const { dropOpen } = this.state;
        const cls = "search-selection-menu" + (className? " " + className : "");
        return (
            <Dropdown drop="down" flip={false} onToggle={this.onToggleOpen} show={dropOpen} onSelect={onDropdownSelect} className={cls}>

                <Dropdown.Toggle variant="outline-dark">
                    { value || <span className="text-300">No value</span>}
                </Dropdown.Toggle>

                <Dropdown.Menu as={SearchSelectionMenuBody} {...{ onTextInputChange, optionsHeader, optionsFooter, currentTextValue }} drop="down"
                    flip={false} show={dropOpen} onTextInputChange={onTextInputChange} toggleOpen={this.onToggleOpen}>
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
        currentTextValue,
        show = false,
        onTextInputChange,
        children,
        className,
        inputPlaceholder = "Type to filter...",
        'aria-labelledby': labeledBy,
        optionsHeader = null,
        optionsFooter = null
    } = props;

    const cls = "search-selection-menu-body" + (className ? " " + className : "");

    return (
        <div ref={ref} className={cls} aria-labelledby={labeledBy}>
            <div className="inner-container">
                <div className="px-3 py-3 text-input-container">
                    { show ?
                        <input type="text" autoFocus value={currentTextValue} onChange={onTextInputChange} placeholder={inputPlaceholder} tabIndex="3"
                            className="form-control"/>
                        : null }
                </div>
                <div className="scrollable-list-container">
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
