"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragAndDropZone = exports.DragAndDropUploadFileUploadController = exports.DragAndDropUploadSubmissionViewController = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _util = require("./../../util");

var _aws = require("@hms-dbmi-bgm/shared-portal-components/es/components/util/aws");

var _util2 = require("@hms-dbmi-bgm/shared-portal-components/es/components/util");

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

var DragAndDropUploadFileUploadController =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(DragAndDropUploadFileUploadController, _React$Component2);

  function DragAndDropUploadFileUploadController(props) {
    var _this;

    _classCallCheck(this, DragAndDropUploadFileUploadController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropUploadFileUploadController).call(this, props));
    _this.state = {
      files: [] // Always in an array, even if multiselect enabled
      // file object will start as a simple 

    };
    _this.handleAddFile = _this.handleAddFile.bind(_assertThisInitialized(_this));
    _this.handleRemoveFile = _this.handleRemoveFile.bind(_assertThisInitialized(_this));
    _this.handleClearAllFiles = _this.handleClearAllFiles.bind(_assertThisInitialized(_this));
    _this.onUploadStart = _this.onUploadStart.bind(_assertThisInitialized(_this));
    return _this;
  } // /* Will become a generic data controller for managing upload state */


  _createClass(DragAndDropUploadFileUploadController, [{
    key: "handleAddFile",
    value: function handleAddFile(evt) {
      var _evt$dataTransfer = evt.dataTransfer,
          items = _evt$dataTransfer.items,
          files = _evt$dataTransfer.files;
      var multiselect = this.props.multiselect;
      var currFiles = this.state.files;

      if (items && items.length > 0) {
        if (multiselect) {
          // Add all dragged items
          var fileArr = []; // Populate an array with all of the new files

          for (var i = 0; i < files.length; i++) {
            console.log(files[i]);
            fileArr.push(files[i]);
          } // Concat with current array


          var allFiles = currFiles.concat(fileArr); // Filter out duplicates (based on just filename for now; may need more criteria in future)

          var dedupedFiles = _underscore["default"].uniq(allFiles, false, function (file) {
            return file.name;
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
    value: function handleRemoveFile(id) {
      var multiselect = this.props.multiselect;

      if (multiselect) {
        var files = this.state.files;

        var _id$split = id.split("|"),
            name = _id$split[0],
            size = _id$split[1],
            lastModified = _id$split[2]; // Filter to remove the clicked file by ID parts


        var newFiles = files.filter(function (file) {
          if (file.name === name && file.size === parseInt(size) && file.lastModified === parseInt(lastModified)) {
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
     * Uses file information to generate an alias, and constructs payload from props. If
     * this is a payload for PATCH request with attachment, set attachmentPresent to true.
     * @param {object} file                  A single file object, equivalent to something in this.state.files[i]
     * @param {boolean} attachmentPresent    Is this a PATCH request/are you uploading a file? If so, set this to yes.
     */

  }, {
    key: "generatePayload",
    value: function generatePayload(file, attachmentPresent) {
      var _this$props = this.props,
          award = _this$props.award,
          lab = _this$props.lab,
          institution = _this$props.institution,
          project = _this$props.project;
      var aliasFilename = file.name.split(' ').join('');
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
        payloadObj.attachment = attachment;
      }

      console.log("Payload:", payloadObj);
      return payloadObj;
    }
  }, {
    key: "validateItem",
    value: function validateItem(file) {
      var fieldType = this.props.fieldType;
      var destination = "/".concat(fieldType, "/?check_only=true"); // testing only

      var payloadObj = this.generatePayload(file, false);
      var payload = JSON.stringify(payloadObj);
      return _util.ajax.promise(destination, 'POST', {}, payload).then(function (response) {
        console.log("validateItem response", response);
        return response;
      });
    }
  }, {
    key: "createItem",
    value: function createItem(file) {
      var fieldType = this.props.fieldType;
      var destination = "/".concat(fieldType, "/"); // Build a payload with info to create metadata Item

      var payloadObj = this.generatePayload(file, false);
      var payload = JSON.stringify(payloadObj);
      return _util.ajax.promise(destination, 'POST', {}, payload).then(function (response) {
        console.log("createItem response", response);
        return response; // here you could attach some onchange function from submission view
      });
    }
    /**
     * 
     * @param {*} file 
     * @param {*} atId             submitted_at_id = object.itemUtil.atId(response['@graph'][responseData]);
     * @param {*} credentials      Data from responseData.upload_credentials from item creation POST request
     */

  }, {
    key: "patchWithImage",
    value: function patchWithImage(file, atId, credentials) {
      var upload_manager = (0, _aws.s3UploadFile)(file, credentials);

      if (upload_manager === null) {
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
  }, {
    key: "patchToParent",
    value: function patchToParent(createItemResponse) {
      var _this$props2 = this.props,
          individualId = _this$props2.individualId,
          files = _this$props2.files,
          fieldName = _this$props2.fieldName;
      var responseData = createItemResponse['@graph'][0];
      console.log(responseData);
      var submitted_at_id = responseData['@id'];
      console.log("submittedAtid=", submitted_at_id);
      var current_docs = [];
      files.forEach(function (file) {
        return current_docs.push(file["@id"]);
      });
      current_docs.push(submitted_at_id);
      current_docs = _underscore["default"].uniq(current_docs);
      return _util.ajax.promise(individualId, "PATCH", {}, JSON.stringify(_defineProperty({}, fieldName, current_docs))).then(function (response) {
        console.log(response);
        return response;
      });
    }
  }, {
    key: "onUploadStart",
    value: function onUploadStart(files) {
      var _this2 = this;

      files.forEach(function (file) {
        console.log("Attempting to upload file... ", file);

        _this2.validateItem(file).then(function (response) {
          if (response.status && response.status !== 'success') {
            alert("validation failed");
          } else {
            console.log("validation succeeded");
          }

          return _this2.createItem(file);
        }).then(function (resp) {
          if (resp.status && resp.status !== 'success') {
            alert("item creation failed");
          } else {
            console.log("create item succeded");
          }

          return _this2.patchToParent(resp);
        })["catch"](function (error) {
          console.log("error occurred", error);
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          cls = _this$props3.cls,
          fieldDisplayTitle = _this$props3.fieldDisplayTitle,
          fieldType = _this$props3.fieldType;
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
  // Required for 4DN
  lab: _propTypes["default"].string,
  // Required for 4DN
  institution: _propTypes["default"].object,
  // Required for CGAP
  project: _propTypes["default"].object,
  // Required for CGAP
  cls: _propTypes["default"].string,
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
    var _this3;

    _classCallCheck(this, DragAndDropUploadButton);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropUploadButton).call(this, props));
    _this3.state = {
      showModal: false
    };
    _this3.onHide = _this3.onHide.bind(_assertThisInitialized(_this3));
    _this3.onShow = _this3.onShow.bind(_assertThisInitialized(_this3));
    _this3.handleHideModal = _this3.handleHideModal.bind(_assertThisInitialized(_this3));
    return _this3;
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
      var _this$props4 = this.props,
          onUploadStart = _this$props4.onUploadStart,
          handleAddFile = _this$props4.handleAddFile,
          handleRemoveFile = _this$props4.handleRemoveFile,
          handleClearAllFiles = _this$props4.handleClearAllFiles,
          fieldType = _this$props4.fieldType,
          cls = _this$props4.cls,
          fieldDisplayTitle = _this$props4.fieldDisplayTitle,
          files = _this$props4.files;
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
      var _this$props5 = this.props,
          show = _this$props5.show,
          onUploadStart = _this$props5.onUploadStart,
          fieldType = _this$props5.fieldType,
          fieldDisplayTitle = _this$props5.fieldDisplayTitle,
          handleAddFile = _this$props5.handleAddFile,
          handleRemoveFile = _this$props5.handleRemoveFile,
          files = _this$props5.files,
          handleHideModal = _this$props5.handleHideModal;
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
        onClick: function onClick() {
          return onUploadStart(files);
        },
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
    var _this4;

    _classCallCheck(this, DragAndDropZone);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropZone).call(this, props));
    _this4.state = {
      dragging: false
    };
    _this4.dropZoneRef = _react["default"].createRef();
    _this4.cleanUpEventListeners = _this4.cleanUpEventListeners.bind(_assertThisInitialized(_this4));
    _this4.setUpEventListeners = _this4.setUpEventListeners.bind(_assertThisInitialized(_this4));
    _this4.handleDrop = _this4.handleDrop.bind(_assertThisInitialized(_this4));
    return _this4;
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
      var _this$props6 = this.props,
          files = _this$props6.files,
          handleRemoveFile = _this$props6.handleRemoveFile;
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
        var fileId = "".concat(file.name, "|").concat(file.size, "|").concat(file.lastModified);
        return _react["default"].createElement("li", {
          key: fileId,
          className: "m-1"
        }, _react["default"].createElement(FileIcon, _extends({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileId: fileId
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
      fileId = props.fileId,
      handleRemoveFile = props.handleRemoveFile;
  return _react["default"].createElement("div", {
    style: {
      flexDirection: "column",
      width: "150px",
      display: "flex"
    }
  }, _react["default"].createElement("i", {
    onClick: function onClick() {
      return handleRemoveFile(fileId);
    },
    className: "icon fas icon-window-close text-danger"
  }), _react["default"].createElement("i", {
    className: "icon far icon-2x icon-".concat(function (mimetype) {
      if (mimetype.match('^image/')) {
        return 'file-image';
      } else if (mimetype.match('^text/html')) {
        return 'file-code';
      } else if (mimetype.match('^text/plain')) {
        return 'file-alt';
      } else {
        return 'file';
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