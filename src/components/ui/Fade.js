import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Transition, { ENTERED, ENTERING } from 'react-transition-group/Transition';
import onEnd from 'dom-helpers/transition/end';

const fadeStyles = {
    [ENTERING]: 'show',
    [ENTERED]: 'show in',
};

export class Fade extends React.Component {

    static defaultProps = {
        in: false,
        timeout: 300,
        mountOnEnter: false,
        unmountOnExit: false,
        appear: false,
    };

    constructor(props){
        super(props);
        this.handleEnter = this.handleEnter.bind(this);
    }

    handleEnter(node){
        const { onEnter } = this.props;
        node.offsetHeight;
        if (typeof onEnter === 'function') onEnter(node);
    }

    render() {
        const { className, children, ...props } = this.props;
        return (
            <Transition addEndListener={onEnd} {...props} onEnter={this.handleEnter}>
                {
                    (status, innerProps) => {
                        const cls = _.filter([ 'fade', className, fadeStyles[status], children.props.className ]).join(' ');
                        return React.cloneElement(children, { ...innerProps, className : cls });
                    }
                }
            </Transition>
        );
    }
}
