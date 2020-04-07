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
                    <DragAndDropZone />
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

export class DragAndDropZone extends React.Component {
    // static propTypes = {
    //     /** Whether component should be listening for Item to be selected */
    //     'isSelecting'       : PropTypes.bool.isRequired,
    //     /** Callback called when Item is received. Should accept @ID and Item context (not guaranteed) as params. */
    //     'onSelect'          : PropTypes.func.isRequired,
    // };

    // static defaultProps = {
    //     'isSelecting'       : false,
    //     'onSelect': function (items, endDataPost) {
    //         console.log("Selected", items, endDataPost);
    //     },
    //     'dropMessage'       : "Drop Item Here"
    // };

    constructor(props){
        super(props);
        this.dropZoneRef = React.createRef();
        this.cleanUpEventListeners = this.cleanUpEventListeners.bind(this);
        this.setUpEventListeners = this.setUpEventListeners.bind(this);
    }

    componentDidMount() {
        this.setUpEventListeners();
    }

    componentWillUnmount() {
        this.cleanUpEventListeners();
    }

    setUpEventListeners() {
        const div = this.dropZoneRef.current;
        div.addEventListener('dragenter', this.handleDragIn);
        div.addEventListener('dragleave', this.handleDragOut);
        div.addEventListener('dragover', this.handleDrag);
        div.addEventListener('drop', this.handleDrop);
    }

    cleanUpEventListeners() {
        const div = this.dropZoneRef.current;
        div.removeEventListener('dragenter', this.handleDragIn);
        div.removeEventListener('dragleave', this.handleDragOut);
        div.removeEventListener('dragover', this.handleDrag);
        div.removeEventListener('drop', this.handleDrop);
    }

    handleDrag(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.dataTransfer.items && evt.dataTransfer.items.length > 0) {
            const data = evt.dataTransfer.files;
            for (var i = 0; i < data.length; i++) {
                console.log("data", data[i]);
            }
        }
    }

    handleDragIn(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    handleDragOut = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
    }

    handleDrop = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.dataTransfer.items && evt.dataTransfer.items.length > 0) {
            const data = evt.dataTransfer.files;
            for (var i = 0; i < data.length; i++) {
                console.log("data", data[i]);
            }
        }
    }

    render() {
        return (
            <div
                className="panel text-center"
                style={{
                    backgroundColor: '#eee',
                    border: "1px solid #efefef",
                    height: "30vh",
                    flexDirection: "column",
                    display: "flex",
                    justifyContent: "center"
                }}
                ref={this.dropZoneRef}
            >
                Drag a file here to upload
            </div>
        );
    }
}