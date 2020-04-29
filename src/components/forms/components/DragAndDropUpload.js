import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ajax } from './../../util';
import { s3UploadFile } from '@hms-dbmi-bgm/shared-portal-components/es/components/util/aws';
/* webpackChunkName: "aws-utils" */
/* webpackMode: "lazy" */

import { object } from '@hms-dbmi-bgm/shared-portal-components/es/components/util';
import _ from 'underscore';

export class DragAndDropUploadSubmissionViewController extends React.Component {
    /* Will become a submission-view specific version of the standalone controller to wrap
    it and pass through the appropriate functions */
}


export class DragAndDropUploadFileUploadController extends React.Component {
    static propTypes = {
        fileSchema: PropTypes.object.isRequired, // Used to validate extension types
        fieldType: PropTypes.string.isRequired,
        individualId: PropTypes.string.isRequired,
        fieldName: PropTypes.string, // If this isn't passed in, use fieldtype instead
        award: PropTypes.string, // Required for 4DN
        lab: PropTypes.string, // Required for 4DN
        institution: PropTypes.object, // Required for CGAP
        project: PropTypes.object, // Required for CGAP
        cls: PropTypes.string,
        multiselect: PropTypes.bool // Should you be able to upload/link multiple files at once?
    }

    static defaultProps = {
        // award: "/awards/1U01CA200059-01/", // for testing
        // lab: "/labs/4dn-dcic-lab", // for testing
        cls: "btn",
        multiselect: true
    }

    constructor(props) {
        super(props);
        this.state = {
            files: [] // Always in an array, even if multiselect enabled
            // file object will start as a simple 
        };

        this.handleAddFile = this.handleAddFile.bind(this);
        this.handleRemoveFile = this.handleRemoveFile.bind(this);
        this.handleClearAllFiles = this.handleClearAllFiles.bind(this);

        this.onUploadStart = this.onUploadStart.bind(this);
    }
    // /* Will become a generic data controller for managing upload state */

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
        const { multiselect } = this.props;

        if (multiselect) {
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
        } else {
            this.handleClearAllFiles();
        }
    }

    handleClearAllFiles() {
        this.setState({ files: [] });
    }

    /**
     * Uses file information to generate an alias, and constructs payload from props. If
     * this is a payload for PATCH request with attachment, set attachmentPresent to true.
     * @param {object} file                  A single file object, equivalent to something in this.state.files[i]
     * @param {boolean} attachmentPresent    Is this a PATCH request/are you uploading a file? If so, set this to yes.
     */
    generatePayload(file, attachmentPresent) {
        const { award, lab, institution, project } = this.props;

        const aliasFilename = file.name.split(' ').join('');
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
            payloadObj.attachment = attachment;
        }
        console.log("Payload:", payloadObj);

        return payloadObj;
    }

    validateItem(file) {
        const { fieldType } = this.props;

        const destination = `/${fieldType}/?check_only=true`; // testing only

        const payloadObj = this.generatePayload(file, false);
        const payload = JSON.stringify(payloadObj);

        return ajax.promise(destination, 'POST', {}, payload).then((response) => {
            console.log("validateItem response", response);
            return response;
        });
    }

    createItem(file) {
        const { fieldType } = this.props;

        const destination = `/${fieldType}/`;

        // Build a payload with info to create metadata Item
        const payloadObj = this.generatePayload(file, false);
        const payload = JSON.stringify(payloadObj);

        return ajax.promise(destination, 'POST', {}, payload).then((response) => {
            console.log("createItem response", response);
            return response;
            // here you could attach some onchange function from submission view
        });
    }


    /**
     * 
     * @param {*} file 
     * @param {*} atId             submitted_at_id = object.itemUtil.atId(response['@graph'][responseData]);
     * @param {*} credentials      Data from responseData.upload_credentials from item creation POST request
     */
    patchItem(file, atId, credentials) {
        const upload_manager = s3UploadFile(file, credentials);

        if (upload_manager === null){
            // bad upload manager. Cause an alert
            alert("Something went wrong while initializing the file upload. Please contact the 4DN-DCIC team.");
        } else {
            // this will set off a chain of aync events.
            // first, md5 will be calculated and then the
            // file will be uploaded to s3. If all of this
            // is succesful, call finishRoundTwo.
            stateToSet.uploadStatus = null;
            this.setState(stateToSet);
            this.updateUpload(upload_manager);
        }
    }

    patchToParent(createItemResponse) {
        const { individualId } = this.props;
        const { 0: responseData } = createItemResponse['@graph'];

        console.log(responseData);
        const submitted_at_id = responseData['@id'];
        console.log("submittedAtid=", submitted_at_id);

        return ajax.promise(individualId, "PATCH", { }, JSON.stringify({ related_documents: [submitted_at_id] })).then(
            (response) =>  {
                console.log(response);
                return response;
            }
        );
    }

    //     if (response.status && response.status !== 'success'){ // error
    //         stateToSet.keyValid[inKey] = 2;
    //         if(!suppressWarnings){
    //             var errorList = response.errors || [response.detail] || [];
    //             // make an alert for each error description
    //             stateToSet.errorCount = errorList.length;
    //             for(i = 0; i<errorList.length; i++){
    //                 var detail = errorList[i].description || errorList[i] || "Unidentified error";
    //                 if (errorList[i].name){
    //                     detail += ('. ' + errorList[i].name + ' in ' + keyDisplay[inKey]);
    //                 } else {
    //                     detail += ('. See ' + keyDisplay[inKey]);
    //                 }
    //                 Alerts.queue({
    //                     'title' : "Validation error " + parseInt(i + 1),
    //                     'message': detail,
    //                     'style': 'danger'
    //                 });
    //             }
    //             setTimeout(layout.animateScrollTo(0), 100); // scroll to top
    //         }
    //         this.setState(stateToSet);
    //     } else { // response successful
    //         let responseData;
    //         let submitted_at_id;
    //         if (test){
    //             stateToSet.keyValid[inKey] = 3;
    //             this.setState(stateToSet);
    //             return;
    //         } else {
    //             [ responseData ] = response['@graph'];
    //             submitted_at_id = object.itemUtil.atId(responseData);
    //             console.log("submittedAtid=",submitted_at_id);
    //         }
    // }

    onUploadStart(files) {
        files.forEach((file) => {
            console.log("Attempting to upload file... ", file);
            this.validateItem(file)
                .then((response) => {
                    if (response.status && response.status !== 'success') {
                        alert("validation failed");
                    } else {
                        console.log("validation succeeded");
                    }
                    return this.createItem(file);
                })
                .then((resp) => {
                    if (resp.status && resp.status !== 'success') {
                        alert("item creation failed");
                    } else {
                        console.log("create item succeded");
                    }
                    return this.patchToParent(resp);
                })
                .catch((error) => {
                    console.log("error occurred", error);
                });
        });
    }

    render() {
        const { cls, fieldName, fieldType } = this.props;
        const { files } = this.state;

        return <DragAndDropUploadButton {...{ cls, fieldName, fieldType, files }}
            onUploadStart={this.onUploadStart} handleAddFile={this.handleAddFile}
            handleClearAllFiles={this.handleClearAllFiles} handleRemoveFile={this.handleRemoveFile} />;
    }
}

class DragAndDropUploadButton extends React.Component {
    static propTypes = {
        onUploadStart: PropTypes.func.isRequired,     // Actions to take upon upload; exact status of upload controlled by data controller wrapper
        handleAddFile: PropTypes.func.isRequired,
        handleRemoveFile: PropTypes.func.isRequired,
        files: PropTypes.array,
        handleClearAllFiles: PropTypes.func.isRequired,
        fieldType: PropTypes.string,                  // Schema-formatted type (Ex. Item, Document, etc)
        fieldName: PropTypes.string,                  // Name of specific field (Ex. Related Documents)
        multiselect: PropTypes.bool,
        cls: PropTypes.string
    }

    static defaultProps = {
        // TODO: Double check that these assumptions make sense...
        fieldType: "Document",
        multiselect: false
    }

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };

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
            fieldType, cls, fieldName, files } = this.props;

        return (
            <div>
                <DragAndDropModal handleHideModal={this.handleHideModal}
                    {...{ multiselect, show, onUploadStart, fieldType, fieldName, handleAddFile, handleRemoveFile,
                        handleClearAllFiles, files }}
                />
                <button type="button" onClick={this.onShow} className={cls}><i className="icon icon-upload fas"></i> Quick Upload a new {fieldType}</button>
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
        handleAddFile: PropTypes.func.isRequired,
        handleRemoveFile: PropTypes.func.isRequired,
        handleClearAllFiles: PropTypes.func.isRequired,
        handleHideModal: PropTypes.func.isRequired,
        files: PropTypes.array,
        onUploadStart: PropTypes.func.isRequired,       // Should trigger the creation of a new object, and start upload
        show: PropTypes.bool,                           // Controlled by state method onHide passed in as prop
        fieldType: PropTypes.string,
        fieldName: PropTypes.string
    }

    static defaultProps = {
        show: false,
    }

    render(){
        const {
            show, onUploadStart, fieldType, fieldName, handleAddFile, handleRemoveFile, files, handleHideModal
        } = this.props;

        let showFieldName = fieldName && fieldType !== fieldName;

        return (
            <Modal centered {...{ show }} onHide={handleHideModal} className="submission-view-modal">
                <Modal.Header closeButton>
                    <Modal.Title className="text-500">
                        Upload a {fieldType} { showFieldName ? "for " + fieldName : null}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DragAndDropZone {...{ files }}
                        handleAddFile={handleAddFile}
                        handleRemoveFile={handleRemoveFile} />
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-danger" onClick={handleHideModal}>
                        <i className="icon fas icon-close"></i> Cancel
                    </button>
                    {/* TODO: Controlled file inputs are complicated... maybe wait to implement this
                    // Refer to https://medium.com/trabe/controlled-file-input-components-in-react-3f0d42f901b8
                    <input type="files" name="filesFromBrowse[]" className="btn btn-primary">
                        <i className="icon fas icon-folder-open"></i> Browse
                    </input> */}
                    <button type="button" className="btn btn-primary" onClick={() => onUploadStart(files)}
                        disabled={files.length === 0}>
                        <i className="icon fas icon-upload"></i> Upload {fieldName}
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
            <i onClick={() => handleRemoveFile(fileId)} className="icon fas icon-window-close text-danger"></i>
            <i className={`icon far icon-2x icon-${getFileIconClass(fileType)}`} style={{ marginBottom: "5px", color: "#444444" }}></i>
            <span style={{ fontSize: "12px" }}>{fileName}</span>
            <span style={{ fontSize: "10px" }}>{fileSize} bytes</span>
        </div>
    );
}