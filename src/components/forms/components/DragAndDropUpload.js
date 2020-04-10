import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'underscore';

function createAndSubmitItem(fieldType, files) {

}



export class DragAndDropFileUploadModal extends React.Component {
    /*
        Drag and Drop File Manager Component that accepts an onHide and onContainerKeyDown function
        Functions for hiding, and handles files.
    */
    static propTypes = {
        show: PropTypes.bool,
        multiselect: PropTypes.bool
        // onHide: PropTypes.func.isRequired,
        // onContainerKeyDown: PropTypes.func.isRequired
    }
    static defaultProps = {
        show: true,
        multiselect: true
    }

    constructor(props){
        super(props);
        this.state = {
            files: [] // Always in an array, even if multiselect enabled
        };

        this.handleAddFile = this.handleAddFile.bind(this);
        this.handleRemoveFile = this.handleRemoveFile.bind(this);
    }

    handleAddFile(evt) {
        const { items, files } = evt.dataTransfer;
        const { multiselect } = this.props;
        const { files: currFiles } = this.state;

        if (items && items.length > 0) {
            if (multiselect) {
                // Add all dragged items
                const fileArr = [];

                // Populate an array with all of the new files
                for (var i = 0; i < files.length; i++) {
                    console.log(files[i]);
                    fileArr.push(files[i]);
                }

                // Concat with current array
                const allFiles = currFiles.concat(fileArr);

                // Filter out duplicates (based on just filename for now; may need more criteria in future)
                const dedupedFiles = _.uniq(allFiles, false, (file) => file.name);

                this.setState({
                    files: dedupedFiles
                });
            } else {
                // Select only one file at a time
                this.setState({
                    files: [files[0]]
                });
            }
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

    render(){
        const {
            // onHide,
            // onContainerKeyDown,
            show
        } = this.props;
        const { files } = this.state;
        return (
            <Modal centered {...{ show }} className="submission-view-modal">
                <Modal.Header closeButton>
                    <Modal.Title className="text-500">
                        Upload a [Field Type] for [Field Name Here]
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DragAndDropZone {...{ files }}
                        handleAddFile={this.handleAddFile}
                        handleRemoveFile={this.handleRemoveFile} />
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-danger">
                        <i className="icon fas icon-close"></i> Cancel
                    </button>
                    {/* TODO: Controlled file inputs are complicated... maybe wait to implement this
                    // Refer to https://medium.com/trabe/controlled-file-input-components-in-react-3f0d42f901b8
                    <input type="files" name="filesFromBrowse[]" className="btn btn-primary">
                        <i className="icon fas icon-folder-open"></i> Browse
                    </input> */}
                    <button type="button" className="btn btn-primary"
                        disabled={files.length === 0}>
                        <i className="icon fas icon-upload"></i> Upload Files
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export class DragAndDropZone extends React.Component {
    static propTypes = {
        /** Callback called when Item is received. Should accept @ID and Item context (not guaranteed) as params. */
        'handleAddFile'          : PropTypes.func.isRequired,
        'handleRemoveFile'       : PropTypes.func.isRequired,
        'files'                  : PropTypes.array
    };

    static defaultProps = {
        'files'             : []
    };

    constructor(props){
        super(props);
        this.state = {
            dragging: false
        };
        this.dropZoneRef = React.createRef();
        this.cleanUpEventListeners = this.cleanUpEventListeners.bind(this);
        this.setUpEventListeners = this.setUpEventListeners.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
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

    // TODO: Consider making handlers props for even more modularity
    handleDrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        // Add dropped files to the file manager
        const { handleAddFile } = this.props;
        handleAddFile(evt);
    }

    render() {
        const { files, handleRemoveFile } = this.props;

        return (
            <div
                className="panel text-center"
                style={{
                    backgroundColor: '#eee',
                    border: "1px solid #efefef",
                    height: "30vh",
                    flexDirection: "row",
                    display: "flex",
                    /*overflowY: "auto",*/
                    overflowX: "hidden",
                    justifyContent: "center"
                }}
                ref={this.dropZoneRef}
            >
                <span style={{ alignSelf: "center" }}>
                    { files.length === 0 ? "Drag a file here to upload" : null }
                </span>
                {/* TODO: Consider making the file list a separate component...
                think about potential future features like listing files without icons/in rows
                or even sorting... would be best to have this be separate if implementing those */}
                <ul style={{
                    listStyleType: "none",
                    display: "flex",
                    margin: "0",
                    paddingTop: "10px",
                    paddingLeft: "0",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    { files.map(
                        (file) => {
                            const fileId = `${file.name}|${file.size}|${file.lastModified}`;

                            return (
                                <li key={fileId} className="m-1">
                                    <FileIcon fileName={file.name} fileSize={file.size}
                                        fileType={file.type} fileId={fileId} {...{ handleRemoveFile }} />
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