import React from 'react';
import PropTypes from 'prop-types';

export class VerticalScrollContainer extends React.PureComponent {

    // static defaultProps = {
    //     'scrollRate' : 10
    // }

    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         scrollPosition: 0,
    //     };

    //     this.scrolling = false;
    // }

    // handleScrollUpHoverStart(e) {
    //     this.scrolling = true;
    //     this.performScrollAction("up");
    // }

    // handleScrollDownHoverStart(e) {
    //     this.scrolling = true;
    //     this.performScrollAction("down");
    // }

    // handleScrollDownHoverEnd(e) {
    //     this.scrolling = false;
    // }

    // performScrollAction(direction) {
    //     // todo: handle scroll
    // }

    render() {
        const { items = [], header, footer } = this.props;
        // const { scrollPosition } = this.state;
        console.log(items);
        const enoughItems = items.length > 5;
        // todo: update to take into account individual item heights
        // and see how many will fill the container

        const showUpButton = false; // todo: confirm logic is correct
        const showDownButton = enoughItems && true; // todo: add some logic


        return (
            <div className="arrow-scroll-container">
                { showUpButton ?
                    <a className="button-scroll arrow-up d-block text-center"
                        style={{ boxShadow: "0 10px 10px 3px rgba(200,200,200,0.2)", color: "#cccccc" }}>
                        <i className="icon fas icon-angle-up"></i>
                    </a>
                    : null }
                <div className="scrollable-list-container">
                    <ul className="scroll-items list-unstyled mb-0 py-2">
                        { header }
                        { items }
                        { footer }
                    </ul>
                </div>
                { showDownButton ?
                    <a className="button-scroll arrow-down d-block text-center"
                        style={{ boxShadow: "0 -10px 10px 30px rgba(200,200,200,0.2)", color: "#cccccc" }}>
                        <i className="icon fas icon-angle-down"></i>
                    </a>
                    : null }
            </div>
        );
    }
}
VerticalScrollContainer.propTypes = {
    items: PropTypes.arrayOf(PropTypes.any),
    header: PropTypes.any,
    footer: PropTypes.any
};
