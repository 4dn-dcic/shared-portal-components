import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'underscore';
import { requestAnimationFrame as raf } from './../../viz/utilities';

import { Fade } from './../../ui/Fade';

/*
Button scrolling code adapted from:
https://tj.ie/scrollable-container-controls-with-react/

This component is used by:
    - SearchSelectionMenu.js
*/
export class VerticalScrollContainer extends React.PureComponent {

    static defaultProps = {
        'scrollRate' : 40
    }

    constructor(props) {
        super(props);

        this.state = {
            hasOverflow: false,
            canScrollUp: false,
            canScrollDown: false,
            scrollingDirection: null
        };

        this.scrollContainer = React.createRef();

        this.onMouseDownScrollUp = this.onMouseDownScrollUp.bind(this);
        this.onMouseDownScrollDown = this.onMouseDownScrollDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.performScrollAction = this.performScrollAction.bind(this);
        this.checkForOverflow = this.checkForOverflow.bind(this);
        this.checkForScrollPosition = this.checkForScrollPosition.bind(this);
        this.checkArrowKeyScrollPosition = this.checkArrowKeyScrollPosition.bind(this);

        this.debounceCheckforOverflow = debounce(this.checkForOverflow, 500, true);
        this.debounceCheckForScrollPosition = debounce(this.checkForScrollPosition, 100, false);
        this.debounceCheckForScrollPositionImmediate = debounce(this.checkForScrollPosition, 100, true);
    }

    componentDidMount() {
        this.checkForOverflow();
        this.checkForScrollPosition();

        // handle both arrow key and touch screen scroll
        this.scrollContainer.current.addEventListener('scroll', this.debounceCheckForScrollPosition);
        this.scrollContainer.current.addEventListener('keyup', this.checkArrowKeyScrollPosition);
    }

    componentDidUpdate(prevProps, prevState) {
        const { items = [] } = this.props;
        const { canScrollUp, canScrollDown, scrollingDirection } = this.state;
        const { items : prevItems = [] } = prevProps;
        const { canScrollUp : couldScrollUp, canScrollDown : couldScrollDown } = prevState;
        if (prevItems.length !== items.length) {
            this.checkForOverflow();
            this.checkForScrollPosition();
        } else if (
            // fix for this bug: https://gyazo.com/a0bc3353ddcb6066c5d494e5a7e6d837 that occurs when a button component
            // unmounts as a result of reaching top/bottom of scroll container without calling onMouseUp (mouse is on button until unmounted)
            (couldScrollUp && !canScrollUp || couldScrollDown && !canScrollDown ) && scrollingDirection !== null
        ) {
            this.setState({ scrollingDirection : null });
        }
    }

    componentWillUnmount() {
        this.scrollContainer.current.removeEventListener('scroll',
            this.debounceCheckForScrollPosition);
        this.scrollContainer.current.removeEventListener('keyup', this.checkArrowKeyScrollPosition);
        this.debounceCheckforOverflow.cancel();
    }

    checkArrowKeyScrollPosition(e) {
        // for lists scrollable via arrowkey, update button state after keypress ends
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            this.debounceCheckForScrollPosition();
        }
    }

    checkForScrollPosition() {
        // updates state when clientHeight touches the top or bottom bounds of scrollHeight
        const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer.current;
        this.setState({
            canScrollUp : scrollTop >= 5,
            canScrollDown: scrollTop !== scrollHeight - clientHeight
        });
    }

    checkForOverflow() {
        // compare height of all items (scrollHeight) to height of containing div (clientHeight)
        const { scrollHeight, clientHeight } = this.scrollContainer.current;
        const hasOverflow = scrollHeight > clientHeight;
        this.setState({ hasOverflow });
    }

    onMouseDownScrollUp(){
        this.setState({ scrollingDirection : -1 }, () => {
            raf(this.performScrollAction);
        });
    }

    onMouseDownScrollDown(){
        this.setState({ scrollingDirection : 1 }, () => {
            raf(this.performScrollAction);
        });
    }

    onMouseUp(){
        this.setState({ scrollingDirection : null });
        this.checkForScrollPosition();
    }

    performScrollAction() {
        const { scrollRate } = this.props;
        const { scrollingDirection = null } = this.state;
        const scrollSettings = { behavior: 'smooth', top: scrollRate * scrollingDirection };

        if (scrollingDirection === null) return false;

        this.scrollContainer.current.scrollBy(scrollSettings);

        raf(this.performScrollAction);
    }

    render() {
        const { items = [], header, footer } = this.props;
        const { hasOverflow, canScrollUp, canScrollDown } = this.state;

        return (
            <div className="vertical-scroll-container">
                <Fade in={hasOverflow && canScrollUp} timeout="500" mountOnEnter={true} unmountOnExit={true}>
                    <button type="button" className="button-scroll arrow-up d-block text-center w-100"
                        onMouseOver={this.onMouseDownScrollUp} onMouseOut={this.onMouseUp} disabled={!canScrollUp}>
                        <i className="icon fas icon-angle-up"></i>
                    </button>
                </Fade>
                <div className="scrollable-list-container" ref={this.scrollContainer}>
                    <ul className="scroll-items list-unstyled my-0">
                        { header }
                        { items }
                        { footer }
                    </ul>
                </div>
                <Fade in={hasOverflow && canScrollDown} timeout="500" mountOnEnter={true} unmountOnExit={true}>
                    <button type="button" className="button-scroll arrow-down d-block text-center w-100"
                        onMouseOver={this.onMouseDownScrollDown} onMouseOut={this.onMouseUp} disabled={!canScrollDown}>
                        <i className="icon fas icon-angle-down"></i>
                    </button>
                </Fade>
            </div>
        );
    }
}
VerticalScrollContainer.propTypes = {
    scrollRate: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.any),
    header: PropTypes.any,
    footer: PropTypes.any
};
