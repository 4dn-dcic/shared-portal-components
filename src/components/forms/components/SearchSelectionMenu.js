import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';


export class SearchSelectionMenu extends React.PureComponent {

    static defaultProps = {
        titleRenderFunction: function(option){
            return option;
        }
    };

    constructor(props){
        super(props);
        this.onToggleOpen = this.onToggleOpen.bind(this);
        this.state = {
            dropOpen: false
        };
        this.dropdown = React.createRef();
        this.shouldAlignDropRight = this.shouldAlignDropRight.bind(this);
    }

    componentDidMount() {
        this.shouldAlignDropRight();
    }

    onToggleOpen(){
        this.setState(function({ dropOpen }){
            return { dropOpen: !dropOpen };
        }, ()=>{
            const { onToggleOpen } = this.props;
            const { dropOpen } = this.state;
            if (typeof onToggleOpen === "function"){
                onToggleOpen(dropOpen);
            }
        });
    }

    shouldAlignDropRight() {
        // todo: use ref to use with dom window methods (offset or getBoundingClientRect) to get the distance 
        // from window edge. then if distance < certain threshold, align to right vs left. Update on component update, too
        // const domNode = this.dropdown.current;
        // console.log(domNode.getBoundingClientRect());
    }

    render(){
        const {
            currentTextValue = "", // Temporary text value
            value = "", // Saved value. Would be === to currentTextValue if allowCustomValue is true.
            options = [],
            optionRenderFunction = null,
            titleRenderFunction,
            onDropdownSelect,
            onTextInputChange,
            optionsHeader,
            optionsFooter,
            className,
            alignRight = false // todo: decide if i hate this or not
        } = this.props;
        const { dropOpen } = this.state;
        const cls = "search-selection-menu" + (className? " " + className : "");
        const showValue = (value && titleRenderFunction(value)) || <span className="text-300">No value</span>;
        return (
            <Dropdown drop="down" alignRight={alignRight} flip={false} onToggle={this.onToggleOpen} show={dropOpen} className={cls}>
                <Dropdown.Toggle variant="outline-dark" data-tip={value}>{ showValue }</Dropdown.Toggle>
                <Dropdown.Menu as={SearchSelectionMenuBody} {...{ onTextInputChange, optionsHeader, optionsFooter, currentTextValue }}
                    drop="down" flip={false} show={dropOpen} onTextInputChange={onTextInputChange} toggleOpen={this.onToggleOpen}
                    alignRight={alignRight} ref={this.dropdown}>
                    {
                        options.map(function(option, idx){
                            const renderedOption = typeof optionRenderFunction === "function" ?
                                optionRenderFunction(option) : option;
                            function onClick(evt){
                                evt.preventDefault();
                                evt.stopPropagation();
                                onDropdownSelect(option);
                            }
                            return (
                                <Dropdown.Item data-index={idx} onClick={onClick} key={idx} eventKey={idx} className="text-ellipsis-container" tabIndex="3">
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
