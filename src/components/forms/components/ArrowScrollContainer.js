import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'underscore';

export class VerticalScrollContainer extends React.PureComponent {

    static defaultProps = {
        'scrollRate' : 10
    }

    constructor(props) {
        super(props);

        this.state = {
            hasOverflow: false,
            canScrollUp: false,
            canScrollDown: false
        };

        this.scrollContainer = React.createRef();

        this.handleScrollDown = this.handleScrollDown.bind(this);
        this.handleScrollUp = this.handleScrollUp.bind(this);
        this.performScrollAction = this.performScrollAction.bind(this);
        this.checkForOverflow = this.checkForOverflow.bind(this);
        this.checkForScrollPosition = this.checkForScrollPosition.bind(this);

        this.debounceCheckforOverflow = debounce(this.checkForOverflow, 200, false);
        this.debounceCheckForScrollPosition = debounce(this.checkForScrollPosition, 200, true);
    }

    componentDidMount() {
        this.checkForOverflow();
        this.checkForScrollPosition();

        this.scrollContainer.current.addEventListener('scroll', this.debounceCheckForScrollPosition);
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
        this.debounceCheckforOverflow.cancel();
    }

    checkForScrollPosition() {
        const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer.current;
        // console.log(this.scrollContainer.current);
        console.log("scrollHeight: ", scrollHeight);
        console.log("clientHeight: ", clientHeight);
        console.log("scrollTop", scrollTop);
        this.setState({
            canScrollUp : scrollTop > 0,
            canScrollDown: scrollTop !== scrollHeight - clientHeight
        });
    }

    checkForOverflow() {
        console.log("checkforoverflow");
        // take into account individual item heights
        // and see how many will fill the container
        const { scrollHeight, clientHeight } = this.scrollContainer.current;
        const hasOverflow = scrollHeight > clientHeight;
        this.setState({ hasOverflow });
    }

    handleScrollUp(e) {
        console.log("handleScrollUp");
        this.scrolling = true;
        this.performScrollAction("up");
    }

    handleScrollDown(e) {
        console.log("handleScrollDown");
        this.scrolling = true;
        this.performScrollAction("down");
    }

    performScrollAction(direction) {
        const { scrollRate } = this.props;
        const nonAbsScrollRate = direction === "up" ? scrollRate : -scrollRate;
        const scrollSettings = { behavior: 'smooth', up: nonAbsScrollRate };
        this.scrollContainer.current.scrollBy(scrollSettings);
    }

    render() {
        const { items = [], header, footer } = this.props;
        const { hasOverflow, canScrollUp, canScrollDown } = this.state;

        return (
            <div className="arrow-scroll-container">
                { hasOverflow && canScrollUp ?
                    <button className="button-scroll arrow-up d-block text-center w-100"
                        style={{
                            boxShadow: "0 10px 10px 3px rgba(200,200,200,0.2)",
                            color: "#cccccc",
                            border: "none"
                        }}
                        onClick={this.handleScrollUp} type="button">
                        <i className="icon fas icon-angle-up"></i>
                    </button>
                    : null }
                <div className="scrollable-list-container" ref={this.scrollContainer}>
                    <ul className="scroll-items list-unstyled mb-0 py-2">
                        { header }
                        { items }
                        { footer }
                    </ul>
                </div>
                { hasOverflow && canScrollDown ?
                    <button className="button-scroll arrow-down d-block text-center w-100"
                        style={{
                            boxShadow: "0 -10px 10px 30px rgba(200,200,200,0.2)",
                            color: "#cccccc",
                            border: "none"
                        }} onClick={this.handleScrollDown} type="button">
                        <i className="icon fas icon-angle-down"></i>
                    </button>
                    : null }
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
