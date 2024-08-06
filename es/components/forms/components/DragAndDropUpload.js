import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
function _callSuper(_this, derived, args) {
  derived = _getPrototypeOf(derived);
  return _possibleConstructorReturn(_this, function () {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      return !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (e) {
      return false;
    }
  }() ? Reflect.construct(derived, args || [], _getPrototypeOf(_this).constructor) : derived.apply(_this, args));
}
import React from 'react';
import Modal from 'react-bootstrap/esm/Modal';
import PropTypes from 'prop-types';
import { ajax } from './../../util';
import _ from 'underscore';
export var DragAndDropUploadSubmissionViewController = /*#__PURE__*/function (_React$Component) {
  function DragAndDropUploadSubmissionViewController() {
    _classCallCheck(this, DragAndDropUploadSubmissionViewController);
    return _callSuper(this, DragAndDropUploadSubmissionViewController, arguments);
  }
  _inherits(DragAndDropUploadSubmissionViewController, _React$Component);
  return _createClass(DragAndDropUploadSubmissionViewController);
}(React.Component);

/**
 * Main component for independent drag and drop file upload. May eventually be updated to take a prop
 * for onUploadStart... OR patchToParent, to update SV SAYTAJAX interface via SV-onchange or SV-selectcomplete.
 *
 * Note: Files are uploaded one after another due to use of PromiseQueue (now in SPC util.ajax)
 * This will help with managing state updates if we ever choose to get more granular in
 * how upload/error status is indicated (i.e. on a per-file basis in UI rather than via alerts).
 *
 * Heavily reworked from this reference: https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929
 */
export var DragAndDropFileUploadController = /*#__PURE__*/function (_React$Component2) {
  function DragAndDropFileUploadController(props) {
    var _this2;
    _classCallCheck(this, DragAndDropFileUploadController);
    _this2 = _callSuper(this, DragAndDropFileUploadController, [props]);
    _this2.state = {
      files: [],
      // Always in an array, even if multiselect disabled
      isLoading: false
    };
    console.log("DragAndDropUploadFileControlller props", props);
    _this2.handleAddFile = _this2.handleAddFile.bind(_this2);
    _this2.handleRemoveFile = _this2.handleRemoveFile.bind(_this2);
    _this2.handleClearAllFiles = _this2.handleClearAllFiles.bind(_this2);
    _this2.onUploadStart = _this2.onUploadStart.bind(_this2);
    return _this2;
  }
  _inherits(DragAndDropFileUploadController, _React$Component2);
  return _createClass(DragAndDropFileUploadController, [{
    key: "handleAddFile",
    value: function handleAddFile(evt) {
      var _this3 = this;
      var _evt$dataTransfer = evt.dataTransfer,
        items = _evt$dataTransfer.items,
        files = _evt$dataTransfer.files;
      var _this$props = this.props,
        multiselect = _this$props.multiselect,
        fileSchema = _this$props.fileSchema;
      var currFiles = this.state.files;
      if (items && items.length > 0) {
        // Add all dragged items
        var fileArr = [];
        var fileLimit = multiselect ? files.length : 1;
        // Populate an array with all of the new files
        var _loop = function _loop() {
            var attachment = {};
            var file = files[i];

            // Check that file type is in schema (TODO: Is this too strict? MIME-types can get complicated...)
            var acceptableFileTypes = fileSchema.properties.attachment.properties.type["enum"];
            if (_.indexOf(acceptableFileTypes, file.type) === -1) {
              var listOfTypes = acceptableFileTypes.toString();
              alert("FILE NOT ADDED: File \"".concat(file.name, "\" is not of the correct file type for this field.\n\nMust be of type: ").concat(listOfTypes, "."));
              return 1; // continue
            }
            attachment.type = file.type;

            // TODO: Figure out how best to check/limit file size pre-attachment...
            if (file.size) {
              attachment.size = file.size;
            }
            if (file.name) {
              attachment.download = file.name;
            }
            fileReader = new window.FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = function (e) {
              if (e.target.result) {
                attachment.href = e.target.result;
              } else {
                alert('ERROR: There was a problem reading the given file. Please try again.');
                return;
              }
            }.bind(_this3);
            fileArr.push(attachment);
          },
          fileReader;
        for (var i = 0; i < fileLimit; i++) {
          if (_loop()) continue;
        }

        // Concat with previous files
        var allFiles = currFiles.concat(fileArr);

        // Filter out duplicates (based on just filename for now; may need more criteria in future)
        var dedupedFiles = _.uniq(allFiles, false, function (file) {
          return file.download;
        });
        this.setState({
          files: dedupedFiles
        });
      }
    }
  }, {
    key: "handleRemoveFile",
    value: function handleRemoveFile(filename) {
      var multiselect = this.props.multiselect;
      if (multiselect) {
        var files = this.state.files;

        // Filter to remove the clicked file by name (assuming no duplicate filenames)
        var newFiles = files.filter(function (file) {
          if (file.download === filename) {
            return false;
          }
          return true;
        });
        this.setState({
          files: newFiles
        });
      } else {
        this.handleClearAllFiles();
      }
    }
  }, {
    key: "handleClearAllFiles",
    value: function handleClearAllFiles() {
      this.setState({
        files: []
      });
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
  }, {
    key: "generatePayload",
    value: function generatePayload(file, attachmentPresent) {
      var _this$props2 = this.props,
        award = _this$props2.award,
        lab = _this$props2.lab,
        institution = _this$props2.institution,
        project = _this$props2.project;
      var aliasFilename = file.download.split(' ').join('');
      var alias;
      var payloadObj = {};

      // If on 4DN, use lab and award data (institution/project should be null)
      if (lab && award) {
        // Generate an alias for the file
        var aliasLab = lab.split('/')[2];
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
  }, {
    key: "createItem",
    value: function createItem(file, isValidationTest) {
      var fieldName = this.props.fieldName;
      var destination = "/".concat(fieldName, "/");
      if (isValidationTest) {
        destination = "/".concat(fieldName, "/?check_only=true");
      }
      var payloadObj = this.generatePayload(file, true);
      var payload = JSON.stringify(payloadObj);
      return ajax.promise(destination, 'POST', {}, payload).then(function (response) {
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
  }, {
    key: "patchToParent",
    value: function patchToParent(createItemResponse, recentlyCreatedItems) {
      var _this$props3 = this.props,
        individualId = _this$props3.individualId,
        files = _this$props3.files,
        fieldType = _this$props3.fieldType,
        multiselect = _this$props3.multiselect;
      var _createItemResponse$ = createItemResponse['@graph'],
        graph = _createItemResponse$ === void 0 ? [] : _createItemResponse$;
      var responseData = graph[0];
      var submitted_at_id = responseData['@id'];

      // Update with passed down items, other items that were just created
      var current_docs = [];
      if (multiselect) {
        // Add items that were loaded from db w/individual
        files.forEach(function (file) {
          return current_docs.push(file["@id"]);
        });

        // Add recently created items to the list of items to patch
        if (recentlyCreatedItems && recentlyCreatedItems.length > 0) {
          recentlyCreatedItems.forEach(function (atId) {
            return current_docs.push(atId);
          });
        }
      }

      // Add the current item
      current_docs.push(submitted_at_id);

      // Ensure no duplicates (obviously more relevant in multiselect cases)
      current_docs = _.uniq(current_docs);
      return ajax.promise(individualId, "PATCH", {}, JSON.stringify(_defineProperty({}, fieldType, current_docs)));
    }
  }, {
    key: "onUploadStart",
    value: function onUploadStart() {
      var _this4 = this;
      var files = this.state.files;
      var previouslySubmittedAtIds = [];
      var newFileSubmit = function newFileSubmit(file) {
        console.log("Attempting to upload file... ", file);
        return _this4.createItem(file, true) // Validate
        .then(function (response) {
          if (response.status && response.status !== 'success') {
            var _response$errors = response.errors,
              _response$errors2 = _response$errors === void 0 ? {} : _response$errors,
              _response$errors2$ = _response$errors2[0],
              _response$errors2$2 = _response$errors2$ === void 0 ? {} : _response$errors2$,
              description = _response$errors2$2.description,
              respDescription = response.description;
            var errorMessage = "Validation failed!\n\n".concat(respDescription, " ").concat(description);
            throw new Error(errorMessage);
          } else {
            console.log("validation succeeded");
            return _this4.createItem(file, false); // Submit item
          }
        }).then(function (resp) {
          if (resp.status && resp.status !== 'success') {
            var _resp$errors = resp.errors,
              _resp$errors2 = _resp$errors === void 0 ? {} : _resp$errors,
              _resp$errors2$ = _resp$errors2[0],
              _resp$errors2$2 = _resp$errors2$ === void 0 ? {} : _resp$errors2$,
              description = _resp$errors2$2.description,
              respDescription = resp.description;
            var errorMessage = "Create item failed!\n\n".concat(respDescription, " ").concat(description);
            alert(errorMessage);
            throw new Error(errorMessage);
          } else {
            console.log("Create item succeeded");
            var responseData = resp['@graph'][0];
            var submitted_at_id = responseData['@id'];

            // Also pass through the atIds of other new files
            previouslySubmittedAtIds.push(submitted_at_id);
            return _this4.patchToParent(resp, previouslySubmittedAtIds);
          }
        }).then(function (res) {
          if (res.status && res.status !== 'success') {
            var _res$errors = res.errors,
              _res$errors2 = _res$errors === void 0 ? {} : _res$errors,
              _res$errors2$ = _res$errors2[0],
              _res$errors2$2 = _res$errors2$ === void 0 ? {} : _res$errors2$,
              description = _res$errors2$2.description,
              respDescription = res.description;
            var errorMessage = "Link Item to Individual failed!\n\n".concat(respDescription, " ").concat(description);
            alert(errorMessage);
            throw new Error(errorMessage);
          } else {
            alert("".concat(file.download, " uploaded and linked successfully."));
            _this4.handleRemoveFile(file.download);
          }
        })["catch"](function (error) {
          console.log("Error occurred", error);
        });
      };
      this.setState({
        isLoading: true
      }, function () {
        var promiseQueue = new ajax.PromiseQueue();
        var allPromises = [];
        // Add each file submission chain to the queue, so each file uploads sequentially
        files.forEach(function (file) {
          allPromises.push(promiseQueue.enqueue(function () {
            return newFileSubmit(file);
          }));
        });

        // Update loading state once everything is resolved
        Promise.all(allPromises).then(function (result) {
          console.log("Completed all uploads!", result);
        })["catch"](function (error) {
          console.log("May not have completed all uploads!", error);
        })["finally"](function () {
          _this4.setState({
            isLoading: false
          });
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
        cls = _this$props4.cls,
        fieldDisplayTitle = _this$props4.fieldDisplayTitle,
        fieldName = _this$props4.fieldName,
        requestVerificationMsg = _this$props4.requestVerificationMsg,
        multiselect = _this$props4.multiselect;
      var _this$state = this.state,
        files = _this$state.files,
        isLoading = _this$state.isLoading;
      return /*#__PURE__*/React.createElement(DragAndDropUploadButton, {
        cls: cls,
        fieldDisplayTitle: fieldDisplayTitle,
        fieldName: fieldName,
        files: files,
        isLoading: isLoading,
        requestVerificationMsg: requestVerificationMsg,
        multiselect: multiselect,
        onUploadStart: this.onUploadStart,
        handleAddFile: this.handleAddFile,
        handleClearAllFiles: this.handleClearAllFiles,
        handleRemoveFile: this.handleRemoveFile
      });
    }
  }]);
}(React.Component);
_defineProperty(DragAndDropFileUploadController, "propTypes", {
  files: PropTypes.array.isRequired,
  // File objects containing already-linked files (will eventually be updated via websockets)
  fileSchema: PropTypes.object.isRequired,
  // Used to validate extension types on drop
  individualId: PropTypes.string.isRequired,
  // AtID of the parent item to link the new File object to
  fieldType: PropTypes.string.isRequired,
  // Item field type (e.g. "related_documents", "images")
  fieldName: PropTypes.string.isRequired,
  // Item name (e.g. "Documents")
  fieldDisplayTitle: PropTypes.string,
  // Display title of field (e.g. "Related Documents")
  cls: PropTypes.string,
  // Classes to apply to the main "Quick Upload" button
  multiselect: PropTypes.bool,
  // Can field link multiple files at once?/Is array field?
  requestVerificationMsg: PropTypes.element // JSX message to be displayed on verification request
  // award: PropTypes.string,                    // Will be required for 4DN SV
  // lab: PropTypes.string,                      // Will be required for 4DN SV
  // institution: PropTypes.object,              // Will be required for CGAP SV
  // project: PropTypes.object,                  // Will be required for CGAP SV
});
_defineProperty(DragAndDropFileUploadController, "defaultProps", {
  cls: "btn"
});
var DragAndDropUploadButton = /*#__PURE__*/function (_React$Component3) {
  function DragAndDropUploadButton(props) {
    var _this5;
    _classCallCheck(this, DragAndDropUploadButton);
    _this5 = _callSuper(this, DragAndDropUploadButton, [props]);
    _this5.state = {
      showModal: false
    };
    console.log("props, ", props);
    _this5.onHide = _this5.onHide.bind(_this5);
    _this5.onShow = _this5.onShow.bind(_this5);
    _this5.handleHideModal = _this5.handleHideModal.bind(_this5);
    return _this5;
  }
  _inherits(DragAndDropUploadButton, _React$Component3);
  return _createClass(DragAndDropUploadButton, [{
    key: "onHide",
    value: function onHide() {
      var showModal = this.state.showModal;
      if (showModal) {
        this.setState({
          showModal: false
        });
      }
    }
  }, {
    key: "onShow",
    value: function onShow() {
      var showModal = this.state.showModal;
      if (!showModal) {
        this.setState({
          showModal: true
        });
      }
    }
  }, {
    key: "handleHideModal",
    value: function handleHideModal() {
      // Force to clear files before hiding modal, so each time it is opened
      // anew, user doesn't have to re-clear it.
      var handleClearAllFiles = this.props.handleClearAllFiles;
      handleClearAllFiles();
      this.onHide();
    }
  }, {
    key: "render",
    value: function render() {
      var show = this.state.showModal;
      var _this$props5 = this.props,
        onUploadStart = _this$props5.onUploadStart,
        handleAddFile = _this$props5.handleAddFile,
        handleRemoveFile = _this$props5.handleRemoveFile,
        handleClearAllFiles = _this$props5.handleClearAllFiles,
        multiselect = _this$props5.multiselect,
        fieldName = _this$props5.fieldName,
        cls = _this$props5.cls,
        fieldDisplayTitle = _this$props5.fieldDisplayTitle,
        files = _this$props5.files,
        isLoading = _this$props5.isLoading,
        requestVerificationMsg = _this$props5.requestVerificationMsg;
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DragAndDropModal, {
        handleHideModal: this.handleHideModal,
        multiselect: multiselect,
        show: show,
        onUploadStart: onUploadStart,
        fieldName: fieldName,
        fieldDisplayTitle: fieldDisplayTitle,
        handleAddFile: handleAddFile,
        handleRemoveFile: handleRemoveFile,
        handleClearAllFiles: handleClearAllFiles,
        files: files,
        isLoading: isLoading,
        requestVerificationMsg: requestVerificationMsg
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: this.onShow,
        className: cls
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-upload fas"
      }), " Quick Upload a new ", fieldName));
    }
  }]);
}(React.Component);
_defineProperty(DragAndDropUploadButton, "propTypes", {
  onUploadStart: PropTypes.func.isRequired,
  // Actions to take upon upload; exact status of upload controlled by data controller wrapper
  handleAddFile: PropTypes.func.isRequired,
  // DragAndDropUploadFileUploadController method for adding multiple files
  handleRemoveFile: PropTypes.func.isRequired,
  // DragAndDropUploadFileUploadController method for removing single files
  handleClearAllFiles: PropTypes.func.isRequired,
  // DragAndDropUploadFileUploadController method for removing all files
  files: PropTypes.array,
  // File objects containing files currently in the dropzone workspace
  fieldName: PropTypes.string,
  // Human readable type (Ex. Item, Document, Image, etc)
  fieldDisplayTitle: PropTypes.string,
  // Name of specific field (Ex. Related Documents)
  multiselect: PropTypes.bool,
  // Can field link multiple files at once?/Is array field?
  cls: PropTypes.string,
  // Classes to apply to the main "Quick Upload" button
  isLoading: PropTypes.bool,
  // Are items currently being uploaded?
  requestVerificationMsg: PropTypes.element // HTML message to be displayed on verification request (uses dangerouslySetInnerHtml -- should be OK since this is not user-generated)
});
_defineProperty(DragAndDropUploadButton, "defaultProps", {
  fieldName: "Document",
  files: []
});
var DragAndDropModal = /*#__PURE__*/function (_React$Component4) {
  function DragAndDropModal(props) {
    var _this6;
    _classCallCheck(this, DragAndDropModal);
    _this6 = _callSuper(this, DragAndDropModal, [props]);
    _this6.state = {
      isVerified: false
    };
    _this6.toggleCheckbox = _this6.toggleCheckbox.bind(_this6);
    _this6.disableCheckbox = _this6.toggleCheckbox.bind(_this6);
    _this6.handleAddFileAndResetVerification = _this6.handleAddFileAndResetVerification.bind(_this6);
    return _this6;
  }
  _inherits(DragAndDropModal, _React$Component4);
  return _createClass(DragAndDropModal, [{
    key: "toggleCheckbox",
    value: function toggleCheckbox() {
      var isVerified = this.state.isVerified;
      this.setState({
        isVerified: !isVerified
      });
    }
  }, {
    key: "disableCheckbox",
    value: function disableCheckbox() {
      var isVerified = this.state.isVerified;
      if (isVerified) {
        this.setState({
          isVerified: false
        });
      }
    }

    /**
     * Basically just wraps the handleAddFile f(x) from props in the case verification is enabled and resets checkbox if new files are added
     * @param {Object} evt  The click event to be passed to handleAddFile
     */
  }, {
    key: "handleAddFileAndResetVerification",
    value: function handleAddFileAndResetVerification(evt) {
      var _this$props6 = this.props,
        handleAddFile = _this$props6.handleAddFile,
        requestVerificationMsg = _this$props6.requestVerificationMsg;
      var isVerified = this.state.isVerified;
      if (isVerified && requestVerificationMsg) {
        // reset verification status on add new files if already checked
        this.setState({
          isVerified: false
        }, handleAddFile(evt));
      } else {
        handleAddFile(evt);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var isVerified = this.state.isVerified;
      var _this$props7 = this.props,
        show = _this$props7.show,
        onUploadStart = _this$props7.onUploadStart,
        fieldName = _this$props7.fieldName,
        fieldDisplayTitle = _this$props7.fieldDisplayTitle,
        handleAddFile = _this$props7.handleAddFile,
        handleRemoveFile = _this$props7.handleRemoveFile,
        files = _this$props7.files,
        handleHideModal = _this$props7.handleHideModal,
        isLoading = _this$props7.isLoading,
        requestVerificationMsg = _this$props7.requestVerificationMsg,
        multiselect = _this$props7.multiselect;
      // console.log("isLoading:", isLoading);

      var showFieldName = fieldDisplayTitle && fieldName !== fieldDisplayTitle;
      var allowUpload = files.length > 0 && (requestVerificationMsg && isVerified || !requestVerificationMsg);
      return /*#__PURE__*/React.createElement(Modal, {
        centered: true,
        show: show,
        onHide: handleHideModal,
        className: "submission-view-modal drag-and-drop-upload",
        size: "lg"
      }, /*#__PURE__*/React.createElement(Modal.Header, {
        closeButton: true
      }, /*#__PURE__*/React.createElement(Modal.Title, {
        className: "text-500"
      }, "Upload a ", fieldName, " ", showFieldName ? "for " + fieldDisplayTitle : null)), /*#__PURE__*/React.createElement(Modal.Body, null, isLoading ? /*#__PURE__*/React.createElement("div", {
        className: "is-loading-overlay-cont"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
        className: "icon icon-spin icon-circle-notch fas"
      })))) : null, /*#__PURE__*/React.createElement(DragAndDropZone, {
        files: files,
        multiselect: multiselect,
        handleAddFile: requestVerificationMsg ? this.handleAddFileAndResetVerification : handleAddFile,
        handleRemoveFile: handleRemoveFile
      }), requestVerificationMsg ? /*#__PURE__*/React.createElement(RequestVerification, {
        requestVerificationMsg: requestVerificationMsg,
        isVerified: isVerified,
        toggleVerification: this.toggleCheckbox
      }) : null), /*#__PURE__*/React.createElement(Modal.Footer, null, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-danger",
        onClick: handleHideModal
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-close"
      }), " Cancel"), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-primary",
        onClick: onUploadStart,
        disabled: !allowUpload,
        "data-tip": requestVerificationMsg && !allowUpload ? "Verify your files by clicking the checkbox." : null
      }, /*#__PURE__*/React.createElement("i", {
        className: "icon fas icon-upload"
      }), " Upload ", fieldDisplayTitle)));
    }
  }]);
}(React.Component);
/*
    Drag and Drop File Manager Component that accepts an onHide and onContainerKeyDown function
    Functions for hiding, and handles files.
*/
_defineProperty(DragAndDropModal, "propTypes", {
  handleAddFile: PropTypes.func.isRequired,
  // DragAndDropUploadFileUploadController method for adding multiple files
  handleRemoveFile: PropTypes.func.isRequired,
  // DragAndDropUploadFileUploadController method for removing single files
  handleClearAllFiles: PropTypes.func.isRequired,
  // DragAndDropUploadFileUploadController method for removing all files
  onUploadStart: PropTypes.func.isRequired,
  // DragAndDropUploadFileUploadController method for starting upload promise chain
  handleHideModal: PropTypes.func.isRequired,
  // DragAndDropUploadButton method for editing show state of modal
  files: PropTypes.array,
  // Files currently in the dropzone workspace. Controlled by DragAndDropFileUploadController
  show: PropTypes.bool,
  // Show state of modal; edited in DragAndDropUploadButton
  fieldName: PropTypes.string,
  // Human readable type (Ex. Item, Document, Image, etc)
  fieldDisplayTitle: PropTypes.string,
  // Name of specific field (Ex. Related Documents)
  isLoading: PropTypes.bool,
  // Are items currently being uploaded?
  requestVerificationMsg: PropTypes.element,
  // HTML message to be displayed on verification request (uses dangerouslySetInnerHtml -- should be OK since this is not user-generated)
  multiselect: PropTypes.bool // Can you select more than one file at a time for upload?
});
_defineProperty(DragAndDropModal, "defaultProps", {
  show: false,
  isLoading: false
});
function RequestVerification(props) {
  var _props$isVerified = props.isVerified,
    isVerified = _props$isVerified === void 0 ? true : _props$isVerified,
    requestVerificationMsg = props.requestVerificationMsg,
    toggleVerification = props.toggleVerification;
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-1 mt-2 text-center"
  }, /*#__PURE__*/React.createElement("input", {
    name: "file-verification",
    type: "checkbox",
    checked: isVerified,
    onChange: toggleVerification
  }), /*#__PURE__*/React.createElement("label", {
    className: "d-inline ml-05",
    htmlFor: "file-verification"
  }, requestVerificationMsg, " "));
}
export var DragAndDropZone = /*#__PURE__*/function (_React$Component5) {
  function DragAndDropZone(props) {
    var _this7;
    _classCallCheck(this, DragAndDropZone);
    _this7 = _callSuper(this, DragAndDropZone, [props]);
    _this7.state = {
      dragging: false
    };
    _this7.dropZoneRef = /*#__PURE__*/React.createRef();
    _this7.fileUploadRef = /*#__PURE__*/React.createRef();
    _this7.cleanUpEventListeners = _this7.cleanUpEventListeners.bind(_this7);
    _this7.setUpEventListeners = _this7.setUpEventListeners.bind(_this7);
    _this7.handleDrop = _this7.handleDrop.bind(_this7);
    _this7.handleDropzoneClick = _this7.handleDropzoneClick.bind(_this7);
    return _this7;
  }
  _inherits(DragAndDropZone, _React$Component5);
  return _createClass(DragAndDropZone, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setUpEventListeners();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cleanUpEventListeners();
    }
  }, {
    key: "setUpEventListeners",
    value: function setUpEventListeners() {
      var div = this.dropZoneRef.current;
      div.addEventListener('dragenter', this.handleDragIn);
      div.addEventListener('dragleave', this.handleDragOut);
      div.addEventListener('dragover', this.handleDrag);
      div.addEventListener('drop', this.handleDrop);
    }
  }, {
    key: "cleanUpEventListeners",
    value: function cleanUpEventListeners() {
      var div = this.dropZoneRef.current;
      div.removeEventListener('dragenter', this.handleDragIn);
      div.removeEventListener('dragleave', this.handleDragOut);
      div.removeEventListener('dragover', this.handleDrag);
      div.removeEventListener('drop', this.handleDrop);
    }
  }, {
    key: "handleDrag",
    value: function handleDrag(evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }, {
    key: "handleDragIn",
    value: function handleDragIn(evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }, {
    key: "handleDragOut",
    value: function handleDragOut(evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }, {
    key: "handleDrop",
    value: function handleDrop(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      // Add dropped files to the file manager
      var handleAddFile = this.props.handleAddFile;
      handleAddFile(evt);
    }
  }, {
    key: "handleDropzoneClick",
    value: function handleDropzoneClick(evt) {
      evt.stopPropagation();
      console.log("fileuploadref", this.fileUploadRef);
      this.fileUploadRef.current.click();
    }
  }, {
    key: "handleAddFromBrowse",
    value: function handleAddFromBrowse(evt) {
      var handleAddFile = this.props.handleAddFile;
      var files = evt.target.files;
      var numFiles = files.length;
      var items = [];
      for (var i = 0; i < numFiles; i++) {
        items.push(files[i]);
      }
      var obj = {
        dataTransfer: {
          items: items,
          files: evt.target.files
        }
      };
      handleAddFile(obj);
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;
      var _this$props8 = this.props,
        files = _this$props8.files,
        handleRemoveFile = _this$props8.handleRemoveFile,
        multiselect = _this$props8.multiselect;
      return /*#__PURE__*/React.createElement("div", {
        className: "dropzone panel text-center d-flex flex-row justify-content-center",
        ref: this.dropZoneRef,
        onClick: this.handleDropzoneClick
      }, /*#__PURE__*/React.createElement("input", {
        type: "file",
        ref: this.fileUploadRef,
        multiple: multiselect,
        onChange: function onChange(e) {
          return _this8.handleAddFromBrowse(e);
        },
        name: "filesFromBrowse",
        className: "d-none"
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          alignSelf: "center"
        }
      }, files.length === 0 ? "Click or drag a file here to upload" : null), /*#__PURE__*/React.createElement("ul", {
        className: "d-flex flex-wrap m-0 pt-1 pl-0 justify-content-center"
      }, files.map(function (file) {
        return /*#__PURE__*/React.createElement("li", {
          key: file.download,
          className: "m-1"
        }, /*#__PURE__*/React.createElement(FileIcon, {
          fileName: file.download,
          fileSize: file.size,
          fileType: file.type,
          handleRemoveFile: handleRemoveFile
        }));
      })));
    }
  }]);
}(React.Component);
_defineProperty(DragAndDropZone, "propTypes", {
  /** Callback called when Item is received. Should accept @ID and Item context (not guaranteed) as params. */
  'handleAddFile': PropTypes.func.isRequired,
  'handleRemoveFile': PropTypes.func.isRequired,
  'files': PropTypes.array,
  'multiselect': PropTypes.bool
});
_defineProperty(DragAndDropZone, "defaultProps", {
  'files': []
});
function FileIcon(props) {
  // Note: thisUploading not yet in use; currently just a placeholder for potential future per-file loading indicator
  var fileType = props.fileType,
    fileName = props.fileName,
    fileSize = props.fileSize,
    handleRemoveFile = props.handleRemoveFile,
    _props$thisUploading = props.thisUploading,
    thisUploading = _props$thisUploading === void 0 ? false : _props$thisUploading;
  function getFileIconClass(mimetype) {
    if (mimetype.match('^image/')) {
      return 'file-image';
    } else {
      switch (mimetype) {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column",
    style: {
      width: "150px"
    }
  }, thisUploading ? /*#__PURE__*/React.createElement("i", {
    className: "icon icon-spin icon-circle-notch fas"
  }) : /*#__PURE__*/React.createElement("i", {
    onClick: function onClick(e) {
      e.stopPropagation();
      handleRemoveFile(fileName);
    },
    className: "icon fas icon-window-close text-danger"
  }), /*#__PURE__*/React.createElement("i", {
    className: "icon far icon-2x icon-".concat(getFileIconClass(fileType), " mb-05 text-dark")
  }), /*#__PURE__*/React.createElement("span", {
    className: "filename text-break"
  }, fileName), /*#__PURE__*/React.createElement("span", {
    className: "filesize"
  }, fileSize, " bytes"));
}