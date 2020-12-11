import React from 'react';
// import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/esm/Dropdown';
import { VerticalScrollContainer } from './VerticalScrollContainer';


export class SearchSelectionMenu extends React.PureComponent {

    static defaultProps = {
        titleRenderFunction: function(option){
            return option;
        }
    };

    constructor(props){
        super(props);
        this.state = {
            dropOpen: false,
            refreshKey: 0 // incremented to force a refresh of dropdown
        };
        this.dropdown = React.createRef();
        this.onToggleOpen = this.onToggleOpen.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { options: oldOptions = [] } = prevProps;
        const { options: newOptions = [] } = this.props;
        const { refreshKey } = this.state;

        if ((oldOptions.length !== 0) && (oldOptions.length !== newOptions.length))
        {
            // TODO: calling setState in componentDidUpdate toggles SAYTAjax dropdown as closed
            // in the first click. We actually prevent entering this block by adding (oldOptions.length !== 0) condition.
            // We are not sure whether to remove this block at all in the future. (https://twitter.com/dan_abramov/status/977181473424932864)

            // used to force Popper.js to refresh and reposition the dropdown
            // if the length of results changes (drop may no longer align correctly, esp.
            // if dropping "up" to avoid collision with bottom of window)
            // TODO: add some more checks to make this more specific to ONLY cases
            // where the drop no longer aligns w/button
            this.setState({ refreshKey: refreshKey + 1 });
        }
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

    onKeyDown(e) {
        const { options, allowCustomValue } = this.props;
        if (e.key === "Enter") {
            // create the illusion of "submitting the value"; really just close the window
            if (allowCustomValue) {
                e.preventDefault();
                this.onToggleOpen();
            }
        } else if ((e.key === "ArrowDown") && options.length !== 0) {
            // add focus to the first item in filtered items
            const x = document.querySelector(".dropdown > .dropdown-menu.show .list-unstyled");
            if (x.childNodes[0]) {
                x.childNodes[0].focus();
                e.preventDefault();
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            this.onToggleOpen();
        }
        // otherwise handle as default
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
            variant = "outline-secondary",
            showTips = false
        } = this.props;
        const { dropOpen, refreshKey } = this.state;
        const cls = "search-selection-menu" + (className? " " + className : "");
        const showValue = (value && titleRenderFunction(value)) || <span className="text-300">No value</span>;
        return (
            <Dropdown flip onToggle={this.onToggleOpen} show={dropOpen} className={cls}>
                <Dropdown.Toggle {...{ variant }} data-tip={showTips ? value : null}>{ showValue }</Dropdown.Toggle>
                <Dropdown.Menu key={refreshKey} as={SearchSelectionMenuBody} {...{ onTextInputChange, optionsHeader, optionsFooter, currentTextValue }}
                    flip show={dropOpen} onTextInputChange={onTextInputChange} toggleOpen={this.onToggleOpen} ref={this.dropdown} onKeyDown={this.onKeyDown}>
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
                                <Dropdown.Item data-index={idx} onClick={onClick} key={idx} eventKey={idx} className="text-truncate" tabIndex="3">
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
        onKeyDown,
        children,
        className,
        inputPlaceholder = "Type to filter...",
        'aria-labelledby': labeledBy,
        optionsHeader = null,
        optionsFooter = null,
        style // required for popper.js to position the menu
    } = props;

    const cls = "search-selection-menu-body" + (className ? " " + className : "");

    return (
        <div ref={ref} className={cls} aria-labelledby={labeledBy} style={style}>
            <div className="inner-container">
                <div className="px-3 py-3 text-input-container">
                    { show ?
                        <input type="text" autoFocus value={currentTextValue} onChange={onTextInputChange}
                            onKeyDown={onKeyDown} placeholder={inputPlaceholder} tabIndex="3"
                            className="form-control" />
                        : null }
                </div>
                <VerticalScrollContainer header={optionsHeader} footer={optionsFooter} items={children} />
            </div>
        </div>
    );
});
