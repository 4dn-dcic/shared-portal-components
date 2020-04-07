import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

export class DragAndDropFileUploadModal extends React.Component {
    /*
        Stateless Drag and Drop Component that accepts an onHide and onContainerKeyDown function
        Functions for hiding
    */
    static propTypes = {
        show: PropTypes.bool,
        // onHide: PropTypes.func.isRequired,
        // onContainerKeyDown: PropTypes.func.isRequired
    }
    static defaultProps = {
        show: true
    }

    // constructor(props){
    //     super(props);
    // }

    render(){
        const {
            // onHide,
            // onContainerKeyDown,
            show
        } = this.props;
        return (
            <Modal centered {...{ show }} className="submission-view-modal">
                <Modal.Header closeButton>
                    <Modal.Title className="text-500">
                        Upload a [Field Type] for [Field Name Here]
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="panel text-center" style={{
                        backgroundColor: '#eee',
                        border: "1px solid #efefef",
                        height: "30vh",
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        Drag a file here to upload
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-danger">
                        Cancel
                    </button>
                    <button type="button" className="btn btn-primary">
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}
