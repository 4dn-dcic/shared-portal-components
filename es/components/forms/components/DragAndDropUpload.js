"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragAndDropZone = exports.DragAndDropUploadFileUploadController = exports.DragAndDropUploadSubmissionViewController = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _util = require("./../../util");

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DragAndDropUploadSubmissionViewController =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DragAndDropUploadSubmissionViewController, _React$Component);

  function DragAndDropUploadSubmissionViewController() {
    _classCallCheck(this, DragAndDropUploadSubmissionViewController);

    return _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropUploadSubmissionViewController).apply(this, arguments));
  }

  return DragAndDropUploadSubmissionViewController;
}(_react["default"].Component);

exports.DragAndDropUploadSubmissionViewController = DragAndDropUploadSubmissionViewController;

var PromiseQueue =
/*#__PURE__*/
function () {
  function PromiseQueue() {
    _classCallCheck(this, PromiseQueue);
  }

  _createClass(PromiseQueue, null, [{
    key: "enqueue",
    value: function enqueue(promise) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.queue.push({
          promise: promise,
          resolve: resolve,
          reject: reject
        });

        _this.dequeue();
      });
    }
  }, {
    key: "dequeue",
    value: function dequeue() {
      var _this2 = this;

      if (this.workingOnPromise) {
        return false;
      }

      if (this.stop) {
        this.queue = [];
        this.stop = false;
        return;
      }

      var item = this.queue.shift();

      if (!item) {
        return false;
      }

      try {
        this.workingOnPromise = true;
        item.promise().then(function (value) {
          _this2.workingOnPromise = false;
          item.resolve(value);

          _this2.dequeue();
        })["catch"](function (err) {
          _this2.workingOnPromise = false;
          item.reject(err);

          _this2.dequeue();
        });
      } catch (err) {
        this.workingOnPromise = false;
        item.reject(err);
        this.dequeue();
      }

      return true;
    }
  }]);

  return PromiseQueue;
}();
/**
 * Main component for independent drag and drop file upload. Note: Files are uploaded one after another due to
 * use of PromiseQueue. This will help with managing state updates if we ever choose to get more granular in
 * how upload/error status is indicated (perhaps on a per-file basis).
 */


_defineProperty(PromiseQueue, "queue", []);

_defineProperty(PromiseQueue, "pendingPromise", false);

_defineProperty(PromiseQueue, "stop", false);

var DragAndDropUploadFileUploadController =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(DragAndDropUploadFileUploadController, _React$Component2);

  function DragAndDropUploadFileUploadController(props) {
    var _this3;

    _classCallCheck(this, DragAndDropUploadFileUploadController);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropUploadFileUploadController).call(this, props));
    _this3.state = {
      files: [] // Always in an array, even if multiselect disabled

    };
    _this3.handleAddFile = _this3.handleAddFile.bind(_assertThisInitialized(_this3));
    _this3.handleRemoveFile = _this3.handleRemoveFile.bind(_assertThisInitialized(_this3));
    _this3.handleClearAllFiles = _this3.handleClearAllFiles.bind(_assertThisInitialized(_this3));
    _this3.onUploadStart = _this3.onUploadStart.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(DragAndDropUploadFileUploadController, [{
    key: "handleAddFile",
    value: function handleAddFile(evt) {
      var _this4 = this;

      var _evt$dataTransfer = evt.dataTransfer,
          items = _evt$dataTransfer.items,
          files = _evt$dataTransfer.files;
      var _this$props = this.props,
          multiselect = _this$props.multiselect,
          fileSchema = _this$props.fileSchema;
      var currFiles = this.state.files;

      if (items && items.length > 0) {
        if (multiselect) {
          // Add all dragged items
          var fileArr = []; // Populate an array with all of the new files

          var _loop = function () {
            var attachment = {};
            var file = files[i]; // Check that file type is in schema (TODO: Is this too strict? MIME-types can get complicated...)

            var acceptableFileTypes = fileSchema.properties.attachment.properties.type["enum"];

            if (_underscore["default"].indexOf(acceptableFileTypes, file.type) === -1) {
              var listOfTypes = acceptableFileTypes.toString();
              alert("FILE NOT ADDED: File \"".concat(file.name, "\" is not of the correct file type for this field.\nMust be of type: ").concat(listOfTypes, "."));
              return "continue";
            }

            attachment.type = file.type; // TODO: Figure out how best to check/limit file size pre-attachment...

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
              }
            }.bind(_this4); // console.log(attachment, files[i]);


            fileArr.push(attachment);
          };

          for (var i = 0; i < files.length; i++) {
            var fileReader;

            var _ret = _loop();

            if (_ret === "continue") continue;
          } // Concat with previous files


          var allFiles = currFiles.concat(fileArr); // Filter out duplicates (based on just filename for now; may need more criteria in future)

          var dedupedFiles = _underscore["default"].uniq(allFiles, false, function (file) {
            return file.download;
          });

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
  }, {
    key: "handleRemoveFile",
    value: function handleRemoveFile(filename) {
      var multiselect = this.props.multiselect;

      if (multiselect) {
        var files = this.state.files; // Filter to remove the clicked file by name (assuming no duplicate filenames)

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
      var payloadObj = {}; // If on 4DN, use lab and award data (institution/project should be null)

      if (lab && award) {
        // Generate an alias for the file
        var aliasLab = lab.split('/')[2];
        alias = aliasLab + ":" + aliasFilename + Date.now();
        payloadObj.award = award;
        payloadObj.lab = lab;
        payloadObj.aliases = [alias]; // on CGAP, use this data instead (lab & award should be null)
      } else if (institution && project) {
        payloadObj.institution = institution['@id'];
        payloadObj.project = project['@id'];
      } // Add attachment, if provided


      if (attachmentPresent) {
        payloadObj.attachment = file;
      } // console.log("Generated payload:", payloadObj);


      return payloadObj;
    }
    /**
     * Returns a promise that resolves when Item has been successfully validated. Might consolidate with
     * createItem, since they share similar code.
     */

  }, {
    key: "validateItem",
    value: function validateItem(file) {
      var fieldType = this.props.fieldType;
      var destination = "/".concat(fieldType, "/?check_only=true");
      var payloadObj = this.generatePayload(file, true);
      var payload = JSON.stringify(payloadObj);
      return _util.ajax.promise(destination, 'POST', {}, payload).then(function (response) {
        console.log("validateItem response", response); // for testing

        return response;
      });
    }
  }, {
    key: "createItem",
    value: function createItem(file) {
      var fieldType = this.props.fieldType;
      var destination = "/".concat(fieldType, "/"); // Build a payload with info to create metadata Item

      var payloadObj = this.generatePayload(file, true);
      var payload = JSON.stringify(payloadObj);
      return _util.ajax.promise(destination, 'POST', {}, payload).then(function (response) {
        console.log("createItem response", response); // for testing

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
          fieldName = _this$props3.fieldName;
      var _createItemResponse$ = createItemResponse['@graph'],
          graph = _createItemResponse$ === void 0 ? [] : _createItemResponse$;
      var responseData = graph[0];
      console.log(responseData);
      var submitted_at_id = responseData['@id'];
      console.log("submittedAtid=", submitted_at_id);
      var current_docs = []; // Add items that were loaded from db w/individual

      files.forEach(function (file) {
        return current_docs.push(file["@id"]);
      }); // Add recently created items to the list of items to patch

      if (recentlyCreatedItems && recentlyCreatedItems.length > 0) {
        recentlyCreatedItems.forEach(function (atId) {
          return current_docs.push(atId);
        });
      } // Add the current item


      current_docs.push(submitted_at_id);
      current_docs = _underscore["default"].uniq(current_docs);
      return _util.ajax.promise(individualId, "PATCH", {}, JSON.stringify(_defineProperty({}, fieldName, current_docs))).then(function (response) {
        console.log(response);
        return response;
      });
    }
  }, {
    key: "onUploadStart",
    value: function onUploadStart() {
      var _this5 = this;

      var files = this.state.files;
      var previouslySubmittedAtIds = [];

      var newFileSubmit = function (file) {
        console.log("Attempting to upload file... ", file);
        return _this5.validateItem(file).then(function (response) {
          if (response.status && response.status !== 'success') {
            var errorMessage = "Validation failed!\n\n".concat(response.description, " ").concat(response.detail);
            throw new Error(errorMessage);
          } else {
            console.log("validation succeeded");
            return _this5.createItem(file);
          }
        }).then(function (resp) {
          if (resp.status && resp.status !== 'success') {
            var errorMessage = "Create item failed!\n\n".concat(resp.description, " ").concat(resp.detail);
            alert(errorMessage);
            throw new Error(errorMessage);
          } else {
            console.log("Create item succeeded");
            var responseData = resp['@graph'][0];
            var submitted_at_id = responseData['@id']; // Also pass through the atIds of other new files

            previouslySubmittedAtIds.push(submitted_at_id);
            return _this5.patchToParent(resp, previouslySubmittedAtIds);
          }
        }).then(function (res) {
          if (res.status && res.status !== 'success') {
            var errorMessage = "Link Item to Individual failed!\n\n".concat(res.description, " ").concat(res.detail);
            alert(errorMessage);
            throw new Error(errorMessage);
          } else {
            alert("".concat(file.download, " uploaded and linked successfully."));

            _this5.handleRemoveFile(file.download);
          }
        })["catch"](function (error) {
          console.log("Error occurred", error);
        });
      }; // Add each file submission chain to the queue, so each file uploads sequentially


      files.forEach(function (file) {
        return PromiseQueue.enqueue(function () {
          return newFileSubmit(file);
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          cls = _this$props4.cls,
          fieldDisplayTitle = _this$props4.fieldDisplayTitle,
          fieldType = _this$props4.fieldType;
      var files = this.state.files;
      return _react["default"].createElement(DragAndDropUploadButton, _extends({
        cls: cls,
        fieldDisplayTitle: fieldDisplayTitle,
        fieldType: fieldType,
        files: files
      }, {
        onUploadStart: this.onUploadStart,
        handleAddFile: this.handleAddFile,
        handleClearAllFiles: this.handleClearAllFiles,
        handleRemoveFile: this.handleRemoveFile
      }));
    }
  }]);

  return DragAndDropUploadFileUploadController;
}(_react["default"].Component);

exports.DragAndDropUploadFileUploadController = DragAndDropUploadFileUploadController;

_defineProperty(DragAndDropUploadFileUploadController, "propTypes", {
  files: _propTypes["default"].array.isRequired,
  fileSchema: _propTypes["default"].object.isRequired,
  // Used to validate extension types
  fieldType: _propTypes["default"].string.isRequired,
  individualId: _propTypes["default"].string.isRequired,
  fieldName: _propTypes["default"].string.isRequired,
  fieldDisplayTitle: _propTypes["default"].string,
  // If this isn't passed in, use fieldtype instead
  award: _propTypes["default"].string,
  // Will be required for 4DN SV
  lab: _propTypes["default"].string,
  // Will be required for 4DN SV
  institution: _propTypes["default"].object,
  // Will be required for CGAP SV
  project: _propTypes["default"].object,
  // Will be required for CGAP SV
  cls: _propTypes["default"].string,
  // Classes to apply to the main "Quick Upload" button
  multiselect: _propTypes["default"].bool // Should you be able to upload/link multiple files at once?

});

_defineProperty(DragAndDropUploadFileUploadController, "defaultProps", {
  // award: "/awards/1U01CA200059-01/", // for testing
  // lab: "/labs/4dn-dcic-lab", // for testing
  cls: "btn",
  multiselect: true
});

var DragAndDropUploadButton =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(DragAndDropUploadButton, _React$Component3);

  function DragAndDropUploadButton(props) {
    var _this6;

    _classCallCheck(this, DragAndDropUploadButton);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropUploadButton).call(this, props));
    _this6.state = {
      showModal: false
    };
    _this6.onHide = _this6.onHide.bind(_assertThisInitialized(_this6));
    _this6.onShow = _this6.onShow.bind(_assertThisInitialized(_this6));
    _this6.handleHideModal = _this6.handleHideModal.bind(_assertThisInitialized(_this6));
    return _this6;
  }

  _createClass(DragAndDropUploadButton, [{
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
      var _this$state = this.state,
          show = _this$state.showModal,
          multiselect = _this$state.multiselect;
      var _this$props5 = this.props,
          onUploadStart = _this$props5.onUploadStart,
          handleAddFile = _this$props5.handleAddFile,
          handleRemoveFile = _this$props5.handleRemoveFile,
          handleClearAllFiles = _this$props5.handleClearAllFiles,
          fieldType = _this$props5.fieldType,
          cls = _this$props5.cls,
          fieldDisplayTitle = _this$props5.fieldDisplayTitle,
          files = _this$props5.files;
      return _react["default"].createElement("div", null, _react["default"].createElement(DragAndDropModal, _extends({
        handleHideModal: this.handleHideModal
      }, {
        multiselect: multiselect,
        show: show,
        onUploadStart: onUploadStart,
        fieldType: fieldType,
        fieldDisplayTitle: fieldDisplayTitle,
        handleAddFile: handleAddFile,
        handleRemoveFile: handleRemoveFile,
        handleClearAllFiles: handleClearAllFiles,
        files: files
      })), _react["default"].createElement("button", {
        type: "button",
        onClick: this.onShow,
        className: cls
      }, _react["default"].createElement("i", {
        className: "icon icon-upload fas"
      }), " Quick Upload a new ", fieldType));
    }
  }]);

  return DragAndDropUploadButton;
}(_react["default"].Component);

_defineProperty(DragAndDropUploadButton, "propTypes", {
  onUploadStart: _propTypes["default"].func.isRequired,
  // Actions to take upon upload; exact status of upload controlled by data controller wrapper
  handleAddFile: _propTypes["default"].func.isRequired,
  handleRemoveFile: _propTypes["default"].func.isRequired,
  files: _propTypes["default"].array,
  handleClearAllFiles: _propTypes["default"].func.isRequired,
  fieldType: _propTypes["default"].string,
  // Schema-formatted type (Ex. Item, Document, etc)
  fieldDisplayTitle: _propTypes["default"].string,
  // Name of specific field (Ex. Related Documents)
  multiselect: _propTypes["default"].bool,
  cls: _propTypes["default"].string
});

_defineProperty(DragAndDropUploadButton, "defaultProps", {
  // TODO: Double check that these assumptions make sense...
  fieldType: "Document",
  multiselect: false
});

var DragAndDropModal =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(DragAndDropModal, _React$Component4);

  function DragAndDropModal() {
    _classCallCheck(this, DragAndDropModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropModal).apply(this, arguments));
  }

  _createClass(DragAndDropModal, [{
    key: "render",

    /*
        Drag and Drop File Manager Component that accepts an onHide and onContainerKeyDown function
        Functions for hiding, and handles files.
    */
    value: function render() {
      var _this$props6 = this.props,
          show = _this$props6.show,
          onUploadStart = _this$props6.onUploadStart,
          fieldType = _this$props6.fieldType,
          fieldDisplayTitle = _this$props6.fieldDisplayTitle,
          handleAddFile = _this$props6.handleAddFile,
          handleRemoveFile = _this$props6.handleRemoveFile,
          files = _this$props6.files,
          handleHideModal = _this$props6.handleHideModal,
          uploading = _this$props6.uploading;
      return _react["default"].createElement(_reactBootstrap.Modal, _extends({
        centered: true
      }, {
        show: show
      }, {
        onHide: handleHideModal,
        className: "submission-view-modal"
      }), _react["default"].createElement(_reactBootstrap.Modal.Header, {
        closeButton: true
      }, _react["default"].createElement(_reactBootstrap.Modal.Title, {
        className: "text-500"
      }, "Upload a ", fieldType, " ", fieldDisplayTitle && fieldType !== fieldDisplayTitle ? "for " + fieldDisplayTitle : null)), _react["default"].createElement(_reactBootstrap.Modal.Body, null, _react["default"].createElement(DragAndDropZone, _extends({
        files: files
      }, {
        handleAddFile: handleAddFile,
        handleRemoveFile: handleRemoveFile
      }))), _react["default"].createElement(_reactBootstrap.Modal.Footer, null, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-danger",
        onClick: handleHideModal
      }, _react["default"].createElement("i", {
        className: "icon fas icon-close"
      }), " Cancel"), _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-primary",
        onClick: onUploadStart,
        disabled: files.length === 0
      }, _react["default"].createElement("i", {
        className: "icon fas icon-upload"
      }), " Upload ", fieldDisplayTitle)));
    }
  }]);

  return DragAndDropModal;
}(_react["default"].Component);

_defineProperty(DragAndDropModal, "propTypes", {
  handleAddFile: _propTypes["default"].func.isRequired,
  handleRemoveFile: _propTypes["default"].func.isRequired,
  handleClearAllFiles: _propTypes["default"].func.isRequired,
  handleHideModal: _propTypes["default"].func.isRequired,
  files: _propTypes["default"].array,
  onUploadStart: _propTypes["default"].func.isRequired,
  // Should trigger the creation of a new object, and start upload
  show: _propTypes["default"].bool,
  // Controlled by state method onHide passed in as prop
  fieldType: _propTypes["default"].string,
  fieldDisplayTitle: _propTypes["default"].string
});

_defineProperty(DragAndDropModal, "defaultProps", {
  show: false
});

var DragAndDropZone =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(DragAndDropZone, _React$Component5);

  function DragAndDropZone(props) {
    var _this7;

    _classCallCheck(this, DragAndDropZone);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropZone).call(this, props));
    _this7.state = {
      dragging: false
    };
    _this7.dropZoneRef = _react["default"].createRef();
    _this7.cleanUpEventListeners = _this7.cleanUpEventListeners.bind(_assertThisInitialized(_this7));
    _this7.setUpEventListeners = _this7.setUpEventListeners.bind(_assertThisInitialized(_this7));
    _this7.handleDrop = _this7.handleDrop.bind(_assertThisInitialized(_this7));
    return _this7;
  }

  _createClass(DragAndDropZone, [{
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
    } // TODO: Consider making handlers props for even more modularity

  }, {
    key: "handleDrop",
    value: function handleDrop(evt) {
      evt.preventDefault();
      evt.stopPropagation(); // Add dropped files to the file manager

      var handleAddFile = this.props.handleAddFile;
      handleAddFile(evt);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          files = _this$props7.files,
          handleRemoveFile = _this$props7.handleRemoveFile;
      return _react["default"].createElement("div", {
        className: "panel text-center",
        style: {
          backgroundColor: '#eee',
          border: "1px solid #efefef",
          height: "30vh",
          flexDirection: "row",
          display: "flex",

          /*overflowY: "auto",*/
          overflowX: "hidden",
          justifyContent: "center"
        },
        ref: this.dropZoneRef
      }, _react["default"].createElement("span", {
        style: {
          alignSelf: "center"
        }
      }, files.length === 0 ? "Drag a file here to upload" : null), _react["default"].createElement("ul", {
        style: {
          listStyleType: "none",
          display: "flex",
          margin: "0",
          paddingTop: "10px",
          paddingLeft: "0",
          flexWrap: "wrap",
          justifyContent: "center"
        }
      }, files.map(function (file) {
        return _react["default"].createElement("li", {
          key: file.download,
          className: "m-1"
        }, _react["default"].createElement(FileIcon, _extends({
          fileName: file.download,
          fileSize: file.size,
          fileType: file.type
        }, {
          handleRemoveFile: handleRemoveFile
        })));
      })));
    }
  }]);

  return DragAndDropZone;
}(_react["default"].Component);

exports.DragAndDropZone = DragAndDropZone;

_defineProperty(DragAndDropZone, "propTypes", {
  /** Callback called when Item is received. Should accept @ID and Item context (not guaranteed) as params. */
  'handleAddFile': _propTypes["default"].func.isRequired,
  'handleRemoveFile': _propTypes["default"].func.isRequired,
  'files': _propTypes["default"].array
});

_defineProperty(DragAndDropZone, "defaultProps", {
  'files': []
});

function FileIcon(props) {
  var fileType = props.fileType,
      fileName = props.fileName,
      fileSize = props.fileSize,
      handleRemoveFile = props.handleRemoveFile,
      _props$thisUploading = props.thisUploading,
      thisUploading = _props$thisUploading === void 0 ? false : _props$thisUploading;
  return _react["default"].createElement("div", {
    style: {
      flexDirection: "column",
      width: "150px",
      display: "flex"
    }
  }, thisUploading ? _react["default"].createElement("i", {
    className: "icon icon-spin icon-circle-notch fas"
  }) : _react["default"].createElement("i", {
    onClick: function onClick() {
      return handleRemoveFile(fileName);
    },
    className: "icon fas icon-window-close text-danger"
  }), _react["default"].createElement("i", {
    className: "icon far icon-2x icon-".concat(function (mimetype) {
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
    }(fileType)),
    style: {
      marginBottom: "5px",
      color: "#444444"
    }
  }), _react["default"].createElement("span", {
    style: {
      fontSize: "12px"
    }
  }, fileName), _react["default"].createElement("span", {
    style: {
      fontSize: "10px"
    }
  }, fileSize, " bytes"));
}