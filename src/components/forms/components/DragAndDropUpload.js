import React from 'react';
import Modal from 'react-bootstrap/esm/Modal';
import PropTypes from 'prop-types';
import { ajax } from './../../util';
import _ from 'underscore';

export class DragAndDropUploadSubmissionViewController extends React.Component {
    /* Will become a submission-view specific version of the standalone controller to wrap
    it and pass through unique versions of onUploadStart, patchToParent, etc f(x)s in DragAndDropFileUploadController */
}

/**
 * A class utility for executing promise-chains in a sequential manner. Includes some
 * scaffolding for aborting promises; needs more work in future.
 *
 * In drag-and-drop upload, this class ensures that each Item is uploaded and linked
 * before starting the upload of the next item, so that the new atIds can be collected
 * and patched to the parent together.
 */
class PromiseQueue {
    constructor() {
        this.queue = [];
        this.pendingPromise = false;
        this.stop = false;
    }

    enqueue(promise) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }

    dequeue() {
        if (this.pendingPromise) {
            return false;
        }
        if (this.stop) {
            this.queue = [];
            this.stop = false;
            return;
        }
        const item = this.queue.shift();
        if (!item) {
            return false;
        }
        try {
            this.pendingPromise = true;
            item.promise()
                .then((value) => {
                    this.pendingPromise = false;
                    item.resolve(value);
                    this.dequeue();
                })
                .catch((err) => {
                    this.pendingPromise = false;
                    item.reject(err);
                    this.dequeue();
                });
        } catch (err) {
            this.pendingPromise = false;
            item.reject(err);
            this.dequeue();
        }
        return true;
    }
}

/**
 * Main component for independent drag and drop file upload. May eventually be updated to take a prop
 * for onUploadStart... OR patchToParent, to update SV SAYTAJAX interface via SV-onchange or SV-selectcomplete.
 *
 * Note: Files are uploaded one after another due to
 * use of PromiseQueue. This will help with managing state updates if we ever choose to get more granular in
 * how upload/error status is indicated (i.e. on a per-file basis in UI rather than via alerts).
 *
 * Heavily reworked from this reference: https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929
 */
export class DragAndDropFileUploadController extends React.Component {
    static propTypes = {
        files: PropTypes.array.isRequired,          // File objects containing already-linked files (will eventually be updated via websockets)
        fileSchema: PropTypes.object.isRequired,    // Used to validate extension types on drop
        individualId: PropTypes.string.isRequired,  // AtID of the parent item to link the new File object to
        fieldType: PropTypes.string.isRequired,     // Item field type (e.g. "related_documents", "images")
        fieldName: PropTypes.string.isRequired,     // Item name (e.g. "Documents")
        fieldDisplayTitle: PropTypes.string,        // Display title of field (e.g. "Related Documents")
        cls: PropTypes.string,                      // Classes to apply to the main "Quick Upload" button
        multiselect: PropTypes.bool,                // Can field link multiple files at once?/Is array field?
        // award: PropTypes.string,                    // Will be required for 4DN SV
        // lab: PropTypes.string,                      // Will be required for 4DN SV
        // institution: PropTypes.object,              // Will be required for CGAP SV
        // project: PropTypes.object,                  // Will be required for CGAP SV
    }

    static defaultProps = {
        cls: "btn",
        multiselect: true
    }

    constructor(props) {
        super(props);
        this.state = {
            files: [], // Always in an array, even if multiselect disabled
            isLoading: false
        };

        console.log("DragAndDropUploadFileControlller props", props);

        this.handleAddFile = this.handleAddFile.bind(this);
        this.handleRemoveFile = this.handleRemoveFile.bind(this);
        this.handleClearAllFiles = this.handleClearAllFiles.bind(this);

        this.onUploadStart = this.onUploadStart.bind(this);
    }

    handleAddFile(evt) {
        const { items, files } = evt.dataTransfer;
        const { multiselect, fileSchema } = this.props;
        const { files: currFiles } = this.state;

        if (items && items.length > 0) {
            // Add all dragged items
            const fileArr = [];

            const fileLimit = multiselect ? files.length : 1;
            // Populate an array with all of the new files
            for (var i = 0; i < fileLimit; i++) {
                const attachment = {};
                const file = files[i];

                // Check that file type is in schema (TODO: Is this too strict? MIME-types can get complicated...)
                const acceptableFileTypes = fileSchema.properties.attachment.properties.type.enum;
                if (_.indexOf(acceptableFileTypes, file.type) === -1) {
                    const listOfTypes = acceptableFileTypes.toString();
                    alert(`FILE NOT ADDED: File "${file.name}" is not of the correct file type for this field.\n\nMust be of type: ${listOfTypes}.`);
                    continue;
                }
                attachment.type = file.type;

                // TODO: Figure out how best to check/limit file size pre-attachment...
                if (file.size) { attachment.size = file.size; }
                if (file.name) { attachment.download = file.name; }

                var fileReader = new window.FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onloadend = function (e) {
                    if (e.target.result){
                        attachment.href = e.target.result;
                    } else {
                        alert('ERROR: There was a problem reading the given file. Please try again.');
                        return;
                    }
                }.bind(this);

                fileArr.push(attachment);
            }

            // Concat with previous files
            const allFiles = currFiles.concat(fileArr);

            // Filter out duplicates (based on just filename for now; may need more criteria in future)
            const dedupedFiles = _.uniq(allFiles, false, (file) => file.download);

            this.setState({
                files: dedupedFiles
            });
        }
    }

    handleRemoveFile(filename) {
        const { multiselect } = this.props;

        if (multiselect) {
            const { files } = this.state;

            // Filter to remove the clicked file by name (assuming no duplicate filenames)
            const newFiles = files.filter((file) => {
                if ((file.download === filename)) {
                    return false;
                }
                return true;
            });

            this.setState({ files: newFiles });
        } else {
            this.handleClearAllFiles();
        }
    }

    handleClearAllFiles() {
        this.setState({ files: [] });
    }

    /**
     * Constructs payload from props. If this is a payload for PATCH request with attachment, set attachmentPresent to true.
     * @param {object} file                  A single file object, equivalent to something in this.state.files[i]
     * @param {boolean} attachmentPresent    Is this a PATCH request/are you uploading a file? If so, set this to yes.
     *
     * Note: Started updating to use file information to auto-generate an alias for objects on 4DN & CGAP submission view;
     * this isn't necessary in the current non-SV implementation, so has been left in a half-working state until that
     * functionality is needed. In non-SV cases on CGAP pedigreeviz, this will skip those conditionals.
     */
    generatePayload(file, attachmentPresent) {
        const { award, lab, institution, project } = this.props;

        const aliasFilename = file.download.split(' ').join('');
        let alias;

        const payloadObj = {};

        // If on 4DN, use lab and award data (institution/project should be null)
        if (lab && award) {

            // Generate an alias for the file
            const aliasLab = lab.split('/')[2];
            alias = aliasLab + ":" + aliasFilename + Date.now();

            payloadObj.award = award;
            payloadObj.lab = lab;
            payloadObj.aliases = [alias];

        // on CGAP, use this data instead (lab & award should be null)
        } else if (institution && project) {
            payloadObj.institution = institution['@id'];
            payloadObj.project = project['@id'];
        }

        // Add attachment, if provided
        if (attachmentPresent) {
            payloadObj.attachment = file;
        }

        // console.log("Generated payload:", payloadObj);
        return payloadObj;
    }

    /**
     * Returns a promise that resolves when Item has been successfully validated/submitted
     */
    createItem(file, isValidationTest) {
        const { fieldName } = this.props;

        let destination = `/${fieldName}/`;
        if (isValidationTest) {
            destination = `/${fieldName}/?check_only=true`;
        }

        const payloadObj = this.generatePayload(file, true);
        const payload = JSON.stringify(payloadObj);

        return ajax.promise(destination, 'POST', {}, payload).then((response) => {
            console.log("validateItem response", response); // for testing
            return response;
        });
    }

    /**
     * Makes a patch request to link new file metadata object to the current Individual (or other Item).
     * @param {object}  createItemResponse      JSON response from server post-Item creation.
     * @param {array}   recentlyCreatedItems    Array of atIDs of other items created in this batch of uploads
     * Note: This method is meant to chain off of a f(x) like this.createItem.
     */
    patchToParent(createItemResponse, recentlyCreatedItems) {
        const { individualId, files, fieldType, multiselect } = this.props;
        const { '@graph': graph = [] } = createItemResponse;
        const { 0: responseData } = graph;

        const submitted_at_id = responseData['@id'];

        // Update with passed down items, other items that were just created
        let current_docs = [];
        if (multiselect) {
            // Add items that were loaded from db w/individual
            files.forEach((file) => current_docs.push(file["@id"]));

            // Add recently created items to the list of items to patch
            if (recentlyCreatedItems && recentlyCreatedItems.length > 0) {
                recentlyCreatedItems.forEach((atId) => current_docs.push(atId));
            }
        }

        // Add the current item
        current_docs.push(submitted_at_id);

        // Ensure no duplicates (obviously more relevant in multiselect cases)
        current_docs = _.uniq(current_docs);

        return ajax.promise(individualId, "PATCH", { }, JSON.stringify({ [fieldType]: current_docs }));
    }

    onUploadStart() {
        const { files } = this.state;
        const previouslySubmittedAtIds = [];

        const newFileSubmit = (file) => {
            console.log("Attempting to upload file... ", file);
            return this.createItem(file, true) // Validate
                .then((response) => {
                    if (response.status && response.status !== 'success') {
                        const errorMessage = `Validation failed!\n\n${response.description} ${response.detail}`;
                        throw new Error(errorMessage);
                    } else {
                        console.log("validation succeeded");
                        return this.createItem(file, false); // Submit item
                    }
                })
                .then((resp) => {
                    if (resp.status && resp.status !== 'success') {
                        const errorMessage = `Create item failed!\n\n${resp.description} ${resp.detail}`;
                        alert(errorMessage);
                        throw new Error(errorMessage);
                    } else {
                        console.log("Create item succeeded");
                        const { 0: responseData } = resp['@graph'];
                        const submitted_at_id = responseData['@id'];

                        // Also pass through the atIds of other new files
                        previouslySubmittedAtIds.push(submitted_at_id);
                        return this.patchToParent(resp, previouslySubmittedAtIds);
                    }
                })
                .then((res) => {
                    if (res.status && res.status !== 'success') {
                        const errorMessage = `Link Item to Individual failed!\n\n${res.description} ${res.detail}`;
                        alert(errorMessage);
                        throw new Error(errorMessage);
                    } else {
                        alert(`${file.download} uploaded and linked successfully.`);
                        this.handleRemoveFile(file.download);
                    }
                })
                .catch((error) => {
                    console.log("Error occurred", error);
                });
        };

        this.setState({ isLoading: true }, () => {
            const promiseQueue = new PromiseQueue();
            const allPromises = [];
            // Add each file submission chain to the queue, so each file uploads sequentially
            files.forEach((file) => {
                allPromises.push(promiseQueue.enqueue(() => newFileSubmit(file)));
            });

            // Update loading state once everything is resolved
            Promise.all(allPromises)
                .then((result) => {
                    console.log("Completed all uploads!", result);
                })
                .catch((error) => {
                    console.log("May not have completed all uploads!", error);
                })
                .finally(() => {
                    this.setState({ isLoading: false });
                });
        });
    }

    render() {
        const { cls, fieldDisplayTitle, fieldName } = this.props;
        const { files, isLoading } = this.state;

        return <DragAndDropUploadButton {...{ cls, fieldDisplayTitle, fieldName, files, isLoading }}
            onUploadStart={this.onUploadStart} handleAddFile={this.handleAddFile}
            handleClearAllFiles={this.handleClearAllFiles} handleRemoveFile={this.handleRemoveFile} />;
    }
}

class DragAndDropUploadButton extends React.Component {
    static propTypes = {
        onUploadStart: PropTypes.func.isRequired,       // Actions to take upon upload; exact status of upload controlled by data controller wrapper
        handleAddFile: PropTypes.func.isRequired,       // DragAndDropUploadFileUploadController method for adding multiple files
        handleRemoveFile: PropTypes.func.isRequired,    // DragAndDropUploadFileUploadController method for removing single files
        handleClearAllFiles: PropTypes.func.isRequired, // DragAndDropUploadFileUploadController method for removing all files
        files: PropTypes.array,                         // File objects containing files currently in the dropzone workspace
        fieldName: PropTypes.string,                    // Human readable type (Ex. Item, Document, Image, etc)
        fieldDisplayTitle: PropTypes.string,            // Name of specific field (Ex. Related Documents)
        multiselect: PropTypes.bool,                    // Can field link multiple files at once?/Is array field?
        cls: PropTypes.string,                          // Classes to apply to the main "Quick Upload" button
        isLoading: PropTypes.bool                       // Are items currently being uploaded?
    }

    static defaultProps = {
        fieldName: "Document",
        multiselect: false,
        files: []
    }

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };

        console.log("props, ", props);
        this.onHide = this.onHide.bind(this);
        this.onShow = this.onShow.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
    }

    onHide() {
        const { showModal } = this.state;
        if (showModal) {
            this.setState({ showModal: false });
        }
    }

    onShow() {
        const { showModal } = this.state;
        if (!showModal) {
            this.setState({ showModal: true });
        }
    }

    handleHideModal() {
        // Force to clear files before hiding modal, so each time it is opened
        // anew, user doesn't have to re-clear it.
        const { handleClearAllFiles } = this.props;

        handleClearAllFiles();
        this.onHide();
    }

    render() {
        const { showModal: show, multiselect } = this.state;
        const { onUploadStart, handleAddFile, handleRemoveFile, handleClearAllFiles,
            fieldName, cls, fieldDisplayTitle, files, isLoading } = this.props;

        return (
            <div>
                <DragAndDropModal handleHideModal={this.handleHideModal}
                    {...{ multiselect, show, onUploadStart, fieldName, fieldDisplayTitle, handleAddFile, handleRemoveFile,
                        handleClearAllFiles, files, isLoading }}
                />
                <button type="button" onClick={this.onShow} className={cls}>
                    <i className="icon icon-upload fas"></i> Quick Upload a new {fieldName}
                </button>
            </div>
        );
    }
}

class DragAndDropModal extends React.Component {
    /*
        Drag and Drop File Manager Component that accepts an onHide and onContainerKeyDown function
        Functions for hiding, and handles files.
    */
    static propTypes = {
        handleAddFile: PropTypes.func.isRequired,       // DragAndDropUploadFileUploadController method for adding multiple files
        handleRemoveFile: PropTypes.func.isRequired,    // DragAndDropUploadFileUploadController method for removing single files
        handleClearAllFiles: PropTypes.func.isRequired, // DragAndDropUploadFileUploadController method for removing all files
        onUploadStart: PropTypes.func.isRequired,       // DragAndDropUploadFileUploadController method for starting upload promise chain
        handleHideModal: PropTypes.func.isRequired,     // DragAndDropUploadButton method for editing show state of modal
        files: PropTypes.array,                         // Files currently in the dropzone workspace. Controlled by DragAndDropFileUploadController
        show: PropTypes.bool,                           // Show state of modal; edited in DragAndDropUploadButton
        fieldName: PropTypes.string,                    // Human readable type (Ex. Item, Document, Image, etc)
        fieldDisplayTitle: PropTypes.string,            // Name of specific field (Ex. Related Documents)
        isLoading: PropTypes.bool                       // Are items currently being uploaded?
    }

    static defaultProps = {
        show: false,
        isLoading: false
    }

    render(){
        const {
            show, onUploadStart, fieldName, fieldDisplayTitle, handleAddFile, handleRemoveFile, files, handleHideModal, isLoading
        } = this.props;
        console.log("isLoading:", isLoading);

        const showFieldName = fieldDisplayTitle && fieldName !== fieldDisplayTitle;

        return (
            <Modal centered {...{ show }} onHide={handleHideModal} className="submission-view-modal drag-and-drop-upload">
                <Modal.Header closeButton>
                    <Modal.Title className="text-500">
                        Upload a {fieldName} { showFieldName ? "for " + fieldDisplayTitle : null}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { isLoading ?
                        <div className="is-loading-overlay-cont">
                            <div>
                                <div><i className="icon icon-spin icon-circle-notch fas"></i></div>
                            </div>
                        </div> : null}
                    <DragAndDropZone {...{ files }}
                        handleAddFile={handleAddFile}
                        handleRemoveFile={handleRemoveFile} />
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-danger" onClick={handleHideModal}>
                        <i className="icon fas icon-close"></i> Cancel
                    </button>
                    {/* TODO: Controlled file inputs are complicated... maybe wait to implement this
                    // Refer to https://medium.com/trabe/controlled-file-input-components-in-react-3f0d42f901b8 */}
                   
                    <button type="button" className="btn btn-primary" onClick={onUploadStart}
                        disabled={files.length === 0 }>
                        <i className="icon fas icon-upload"></i> Upload {fieldDisplayTitle}
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
        this.fileUploadRef = React.createRef();
        this.cleanUpEventListeners = this.cleanUpEventListeners.bind(this);
        this.setUpEventListeners = this.setUpEventListeners.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDropzoneClick = this.handleDropzoneClick.bind(this);
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

        // Add dropped files to the file manager
        const { handleAddFile } = this.props;
        handleAddFile(evt);
    }

    handleDropzoneClick(evt) {
        evt.stopPropagation();
        console.log("fileuploadref", this.fileUploadRef);
        this.fileUploadRef.current.click();
    }

    handleAddFromBrowse(evt) {
        const { handleAddFile } = this.props;
        const { files } = evt.target;
        const numFiles = files.length;
        const items = [];

        for (let i = 0; i < numFiles; i++) {
            items.push(files[i]);
        }

        const obj = {
            dataTransfer: {
                items,
                files: evt.target.files
            }
        };

        handleAddFile(obj);
    }

    render() {
        const { files, handleRemoveFile } = this.props;

        return (
            <div
                className="dropzone panel text-center d-flex flex-row justify-content-center"
                ref={this.dropZoneRef}
                onClick={this.handleDropzoneClick}
            >
                <input type="file" ref={this.fileUploadRef} multiple
                    onChange={(e) => this.handleAddFromBrowse(e)}
                    name="filesFromBrowse" className="d-none" />
                <span style={{ alignSelf: "center" }}>
                    { files.length === 0 ? "Click or drag a file here to upload" : null }
                </span>
                {/* TODO: Consider making the file list a separate component...
                think about potential future features like listing files without icons/in rows
                or even sorting... would be best to have this be separate if implementing those */}
                <ul className="d-flex flex-wrap m-0 pt-1 pl-0 justify-content-center">
                    { files.map((file) => (
                        <li key={file.download} className="m-1">
                            <FileIcon fileName={file.download} fileSize={file.size}
                                fileType={file.type} {...{ handleRemoveFile }} />
                        </li> ))}
                </ul>
            </div>
        );
    }
}

function FileIcon(props) {
    // Note: thisUploading not yet in use; currently just a placeholder for potential future per-file loading indicator
    const { fileType, fileName, fileSize, handleRemoveFile, thisUploading = false } = props;

    function getFileIconClass(mimetype){
        if (mimetype.match('^image/')) {
            return 'file-image';
        } else {
            switch(mimetype) {
                case 'text/html':
                    return 'file-code';
                case 'text/plain':
                    return 'file-alt';
                case 'application/msword':
                    return 'file-word';
                case 'application/vnd.ms-excel':
                    return 'file-excel';
                case 'application/pdf':
                    return 'file-pdf';
                default:
                    return 'file';
            }
        }
    }

    return (
        <div className="d-flex flex-column" style={{ width: "150px" }}>
            { thisUploading ?
                <i className="icon icon-spin icon-circle-notch fas"></i> :
                <i onClick={(e) => { e.stopPropagation(); handleRemoveFile(fileName);}} className="icon fas icon-window-close text-danger"></i> }
            <i className={`icon far icon-2x icon-${getFileIconClass(fileType)}`} style={{ marginBottom: "5px", color: "#444444" }}></i>
            <span className="filename">{fileName}</span>
            <span className="filesize">{fileSize} bytes</span>
        </div>
    );
}