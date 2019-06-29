import React from 'react';
import PropTypes from 'prop-types';
import css from 'dom-helpers/style';
import onEnd from 'dom-helpers/transition/end';
import _ from 'underscore';
import { createChainedFunction } from './bootstrap-utils';
import Transition, { EXITED, ENTERED, ENTERING, EXITING } from 'react-transition-group/Transition';


/** TAKEN FROM https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Collapse.js **/

const MARGINS = {
    height: ['marginTop', 'marginBottom'],
    width: ['marginLeft', 'marginRight'],
};

function getDimensionValue(dimension, elem) {
    const offset = `offset${dimension[0].toUpperCase()}${dimension.slice(1)}`;
    const value = elem[offset];
    const margins = MARGINS[dimension];

    return (
        value +
        parseInt(  css(elem, margins[0]  ), 10) +
        parseInt(  css(elem, margins[1]  ), 10)
    );
}

const collapseStyles = {
    [EXITED]: 'collapse',
    [EXITING]: 'collapsing',
    [ENTERING]: 'collapsing',
    [ENTERED]: 'collapse show in',
};

export class Collapse extends React.PureComponent {

    constructor(props){
        super(props);
        _.bindAll(this, 'getDimension', 'handleEnter', 'handleEntering', 'handleEntered',
            'handleExit', 'handleExiting');
    }

    getDimension() {
        const { dimension } = this.props;
        return typeof dimension === 'function' ? dimension() : dimension;
    }

    /* -- Expanding -- */
    handleEnter(elem){
        elem.style[this.getDimension()] = '0';
    }

    handleEntering(elem){
        const dimension = this.getDimension();
        elem.style[dimension] = this._getScrollDimensionValue(elem, dimension);
    }

    handleEntered(elem){
        elem.style[this.getDimension()] = null;
    }

    /* -- Collapsing -- */
    handleExit(elem){
        const dimension = this.getDimension();
        const { getDimensionValue } = this.props;
        elem.style[dimension] = `${getDimensionValue(dimension, elem)}px`;
        elem.offsetHeight;
    }

    handleExiting(elem){
        elem.style[this.getDimension()] = null;
    }

    // for testing
    _getScrollDimensionValue(elem, dimension) {
        const scroll = `scroll${dimension[0].toUpperCase()}${dimension.slice(1)}`;
        return `${elem[scroll]}px`;
    }

    render() {
        const { onEnter, onEntering, onEntered, onExit, onExiting, className, children, ...props } = this.props;

        delete props.dimension;
        delete props.getDimensionValue;

        const handleEnter = createChainedFunction(this.handleEnter, onEnter);
        const handleEntering = createChainedFunction(this.handleEntering, onEntering);
        const handleEntered = createChainedFunction(this.handleEntered, onEntered);
        const handleExit = createChainedFunction(this.handleExit, onExit);
        const handleExiting = createChainedFunction(this.handleExiting, onExiting);

        return (
            <Transition
                addEndListener={onEnd} {...props}
                aria-expanded={props.role ? props.in : null}
                onEnter={handleEnter}
                onEntering={handleEntering}
                onEntered={handleEntered}
                onExit={handleExit}
                onExiting={handleExiting}>
                {(state, innerProps) => {
                    const cls = _.filter(
                        [className, children.props.className, collapseStyles[state], this.getDimension() === 'width' && 'width']
                    ).join(' ');
                    return React.cloneElement(children, { ...innerProps, className: cls });
                }}
            </Transition>
        );
    }
}
Collapse.defaultProps = {
    in: false,
    timeout: 300,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,

    dimension: 'height',
    getDimensionValue,
};

