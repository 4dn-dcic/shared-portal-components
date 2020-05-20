/* eslint-disable no-invalid-this */
import React from 'react';
import { WindowClickEventDelegator } from './../util/WindowClickEventDelegator';

// THIS IS A WORK IN PROGRESS

// TODO: create a "DropdownWindowClickManager" or similarly-named global singleton class
// Will keep track of all DropdownButtons mounted in view to ensure only one open ever at once.
// Will be similar to WindowClickEventDelegator BUT should be more performant
// (else can just use WindowClickEventDelegator directly, as is in code below now)
// by only iterating over clicked element's ancestors (to see if clicked elem is child of _the only_ open dropdown menu) once re: all dropdowns.

export class DropdownButton extends React.PureComponent {

    static defaultProps = {
        'children' : [
            <a className="dropdown-item" href="#" key={1}>Action</a>,
            <a className="dropdown-item" href="#" key={2}>Another action</a>,
            <a className="dropdown-item" href="#" key={3}>Something else here</a>
        ],
        'title' : "Hello World"
    };

    constructor(props){
        super(props);
        this.onWindowClick = this.onWindowClick.bind(this);
        this.state = { 'open' : false };
    }

    componentDidMount(){
        WindowClickEventDelegator.addHandler(this.onWindowClick);
    }

    componentWillUnmount(){
        WindowClickEventDelegator.removeHandler(this.onWindowClick);
    }

    /** Close dropdown on window click unless click within menu. */
    onWindowClick(evt){
        // TODO check event target, see if parent of it is our dropdown-menu, if so cancel, else close.
        // Funcs already exist for this in utils/layout
    }

    render(){
        const { children, title, variant, size } = this.props;
        const { open } = this.state;
        const cls = ( // TODO finish handling other props
            "dropdown-toggle btn" +
            ("btn-" + (variant || "primary")) +
            ("btn-" + (size || "md"))
        );
        return (
            <div className="dropdown">
                <button type="button" className={cls} role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    { title }
                </button>
                <DropdownMenu {...{ children, open }} />
            </div>
        );
    }

}


export const DropdownMenu = React.memo(function DropdownMenu(props){
    const { children, open } = props;
    if (!open) return null;
    return (
        <div className="dropdown-menu show">
            { children }
        </div>
    );
});

// TODO create plain Dropdown. Or not. Idk. Can easily create (more) custom Dropdown togglers and whatnot by emulating the above DropdownButton so not sure is worth adding more complexity...

