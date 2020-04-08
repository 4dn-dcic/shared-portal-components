import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'underscore';

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
                        Upload Files
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
        this.state = {
            dragging: false,
            files: []
        };
        this.dropZoneRef = React.createRef();
        this.cleanUpEventListeners = this.cleanUpEventListeners.bind(this);
        this.setUpEventListeners = this.setUpEventListeners.bind(this);

        this.handleDrop = this.handleDrop.bind(this);
        this.handleRemoveFile = this.handleRemoveFile.bind(this);
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
    }

    handleDragIn(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    handleDragOut(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    handleDrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const { items, files } = evt.dataTransfer;

        if (items && items.length > 0) {
            const fileArr = [];
            for (var i = 0; i < files.length; i++) {
                console.log(files[i]);
                fileArr.push(files[i]);
            }

            this.setState({
                files: fileArr
            });
        }
    }

    handleRemoveFile(id) {
        const { files } = this.state;
        const { 0: name, 1: size, 2: lastModified } = id.split("|");

        // Filter to remove the clicked file by ID parts
        const newFiles = files.filter((file) => {
            if ((file.name === name) &&
                (file.size === parseInt(size)) &&
                (file.lastModified === parseInt(lastModified))
            ) {
                return false;
            }
            return true;
        });

        this.setState({ files: newFiles });
    }

    render() {
        const { files } = this.state;

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
                { files.length === 0 ? "Drag a file here to upload" : null }
                <ul style={{ listStyleType: "none", display: "flex" }}>
                    { files.map(
                        (file) => {
                            const fileId = `${file.name}|${file.size}|${file.lastModified}`;

                            return (
                                <li key={fileId} className="m-1">
                                    <FileIcon fileName={file.name} fileSize={file.size}
                                        fileType={file.type} fileId={fileId} handleRemoveFile={this.handleRemoveFile} />
                                </li>
                            );
                        }
                    )}
                </ul>
            </div>
        );
    }
}

function FileIcon(props) {
    const { fileType, fileName, fileSize, fileId, handleRemoveFile } = props;

    function getFileIconClass(mimetype){
        if (mimetype.match('^image/')) {
            return 'file-image';
        } else if (mimetype.match('^text/html')) {
            return 'file-code';
        } else if (mimetype.match('^text/plain')) {
            return 'file-alt';
        } else {
            return 'file';
        }
    }

    return (
        <div style={{ flexDirection: "column", width: "150px", display: "flex" }}>
            <i onClick={() => handleRemoveFile(fileId)} className="icon fas icon-close text-danger"></i>
            <i className={`icon far icon-2x icon-${getFileIconClass(fileType)}`} style={{ marginBottom: "5px", color: "#444444" }}></i>
            <span style={{ fontSize: "12px" }}>{fileName}</span>
            <span style={{ fontSize: "10px" }}>{fileSize} bytes</span>
        </div>
    );
}