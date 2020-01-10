import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'underscore';
import { requestAnimationFrame as raf } from './../../viz/utilities';

import { Fade } from './../../ui/Fade';

/*
Button scrolling code adapted from:
https://tj.ie/scrollable-container-controls-with-react/
*/
export class VerticalScrollContainer extends React.PureComponent {

    static defaultProps = {
        'scrollRate' : 10
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
    }

    componentDidMount() {
        this.checkForOverflow();
        this.checkForScrollPosition();

        this.scrollContainer.current.addEventListener('scroll', this.debounceCheckForScrollPosition);
        this.scrollContainer.current.addEventListener('keyup', this.checkArrowKeyScrollPosition);
    }

    componentDidUpdate(prevProps) {
        const { items = [] } = this.props;
        const { items : prevItems = [] } = prevProps;
        if (prevItems.length !== items.length) {
            this.checkForOverflow();
            this.checkForScrollPosition();
        }
    }

    componentWillUnmount() {
        this.scrollContainer.current.removeEventListener('scroll',
            this.debounceCheckForScrollPosition);
        this.scrollContainer.current.removeEventListener('keyup', this.checkArrowKeyScrollPosition);
        this.debounceCheckforOverflow.cancel();
    }

    checkArrowKeyScrollPosition(e) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            this.debounceCheckForScrollPosition();
        }
    }

    checkForScrollPosition() {
        // console.log("checking for scroll position");
        const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer.current;
        // console.log(this.scrollContainer.current);
        // console.log("scrollHeight: ", scrollHeight);
        // console.log("clientHeight: ", clientHeight);
        // console.log("scrollTop", scrollTop);
        this.setState({
            canScrollUp : scrollTop >= 5,
            canScrollDown: scrollTop !== scrollHeight - clientHeight
        });
    }

    checkForOverflow() {
        // take into account individual item heights
        // and see how many will fill the container
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

    performScrollAction(scrollNum) {
        const { scrollingDirection = null } = this.state;
        const scrollSettings = { behavior: 'smooth', top: scrollNum * scrollingDirection };

        if (scrollingDirection === null) return false;

        this.scrollContainer.current.scrollBy(scrollSettings);

        raf(this.performScrollAction);
    }

    render() {
        const { items = [], header, footer } = this.props;
        const { hasOverflow, canScrollUp, canScrollDown } = this.state;

        return (
            <div className="arrow-scroll-container">
                <Fade in={hasOverflow && canScrollUp} timeout="500" mountOnEnter={true} unmountOnExit={true}>
                    <button className="button-scroll arrow-up d-block text-center w-100"
                        style={{
                            boxShadow: "0 10px 10px 3px rgba(200,200,200,0.2)",
                            color: "#cccccc",
                            border: "unset",
                            borderBottom: "#eeeeee solid 1px",
                            backgroundColor: "#f8f8f8"
                        }}
                        onMouseDown={this.onMouseDownScrollUp} onMouseUp={this.onMouseUp} type="button" disabled={!canScrollUp}>
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
                    <button className="button-scroll arrow-down d-block text-center w-100"
                        style={{
                            boxShadow: "0 -10px 10px 30px rgba(200,200,200,0.2)",
                            color: "#cccccc",
                            border: "unset",
                            borderTop: "#eeeeee solid 1px",
                            backgroundColor: "#f8f8f8"
                        }} onMouseDown={this.onMouseDownScrollDown} onMouseUp={this.onMouseUp} type="button" disabled={!canScrollDown}>
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
