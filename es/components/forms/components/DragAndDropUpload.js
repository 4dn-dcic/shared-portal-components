"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragAndDropZone = exports.DragAndDropUploadStandaloneController = exports.DragAndDropUploadSubmissionViewController = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _util = require("./../../util");

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var DragAndDropUploadStandaloneController =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(DragAndDropUploadStandaloneController, _React$Component2);

  function DragAndDropUploadStandaloneController(props) {
    var _this;

    _classCallCheck(this, DragAndDropUploadStandaloneController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropUploadStandaloneController).call(this, props));
    _this.state = {// TODO: Figure out exactly how granular we can get with upload state
    };
    _this.onUploadStart = _this.onUploadStart.bind(_assertThisInitialized(_this));
    return _this;
  } // /* Will become a generic data controller for managing upload state */


  _createClass(DragAndDropUploadStandaloneController, [{
    key: "createItem",
    value: function createItem(file) {
      var _this$props = this.props,
          fieldType = _this$props.fieldType,
          award = _this$props.award,
          lab = _this$props.lab;
      var destination = "/".concat(fieldType, "/?check_only=true"); // testing only
      // Generate an alias for the file

      var aliasLab = lab.split('/')[2];
      var aliasFilename = file.name.split(' ').join('-');
      var alias = aliasLab + ":" + aliasFilename + "-" + Date.now(); // Build a payload with info from the various files

      var payload = JSON.stringify({
        award: award,
        lab: lab,
        attachment: file,
        aliases: [alias]
      });
      return _util.ajax.promise(destination, 'POST', {}, payload).then(function (response) {
        console.log("response", response);

        if (response.status && response.status !== 'success') {
          // error
          console.log("ERROR");
        } else {
          var responseData;
          var submitted_at_id;

          var _response$Graph = _slicedToArray(response['@graph'], 1);

          responseData = _response$Graph[0];
          submitted_at_id = object.itemUtil.atId(responseData);
          console.log("submittedAtid=", submitted_at_id); // here you would attach some onchange function from submission view
        }
      }); //     if (response.status && response.status !== 'success'){ // error
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
      //         // handle submission for round two
      //         if (roundTwo){
      //             // there is a file
      //             if (file && responseData.upload_credentials){
      //                 // add important info to result from finalizedContext
      //                 // that is not added from /types/file.py get_upload
      //                 const creds = responseData.upload_credentials;
      //                 import(
      //                     /* webpackChunkName: "aws-utils" */
      //                     /* webpackMode: "lazy" */
      //                     '../util/aws'
      //                 ).then(({ s3UploadFile })=>{
      //                     //const awsUtil = require('../util/aws');
      //                     const upload_manager = s3UploadFile(file, creds);
      //                     if (upload_manager === null){
      //                         // bad upload manager. Cause an alert
      //                         alert("Something went wrong initializing the upload. Please contact the 4DN-DCIC team.");
      //                     } else {
      //                         // this will set off a chain of aync events.
      //                         // first, md5 will be calculated and then the
      //                         // file will be uploaded to s3. If all of this
      //                         // is succesful, call finishRoundTwo.
      //                         stateToSet.uploadStatus = null;
      //                         this.setState(stateToSet);
      //                         this.updateUpload(upload_manager);
      //                     }
      //                 });
      //             } else {
      //                 // state cleanup for this key
      //                 // this.finishRoundTwo();
      //                 this.setState(stateToSet);
      //             }
      //     }
      // }
    }
  }, {
    key: "onUploadStart",
    value: function onUploadStart(files) {
      var _this2 = this;

      console.log("Attempting to start upload with files... ", files);
      var promises = [];
      files.forEach(function (file) {
        promises.push(_this2.createItem(file));
      });
      console.log(promises);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          cls = _this$props2.cls,
          fieldName = _this$props2.fieldName,
          fieldType = _this$props2.fieldType;
      return _react["default"].createElement(DragAndDropUploadButton, _extends({
        cls: cls,
        fieldName: fieldName,
        fieldType: fieldType
      }, {
        onUploadStart: this.onUploadStart
      }));
    }
  }]);

  return DragAndDropUploadStandaloneController;
}(_react["default"].Component);

exports.DragAndDropUploadStandaloneController = DragAndDropUploadStandaloneController;

_defineProperty(DragAndDropUploadStandaloneController, "propTypes", {
  fieldType: _propTypes["default"].string,
  fieldName: _propTypes["default"].string,
  // If this isn't passed in, use fieldtype instead
  award: _propTypes["default"].string.isRequired,
  lab: _propTypes["default"].string.isRequired,
  cls: _propTypes["default"].string
});

_defineProperty(DragAndDropUploadStandaloneController, "defaultProps", {
  award: "/awards/1U01CA200059-01/",
  lab: "/labs/4dn-dcic-lab",
  cls: "btn"
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
    key: "render",
    value: function render() {
      var _this$state = this.state,
          show = _this$state.showModal,
          multiselect = _this$state.multiselect;
      var _this$props3 = this.props,
          onUploadStart = _this$props3.onUploadStart,
          fieldType = _this$props3.fieldType,
          cls = _this$props3.cls,
          fieldName = _this$props3.fieldName;
      return _react["default"].createElement("div", null, _react["default"].createElement(DragAndDropFileUploadModal, _extends({
        onHide: this.onHide
      }, {
        multiselect: multiselect,
        show: show,
        onUploadStart: onUploadStart,
        fieldType: fieldType,
        fieldName: fieldName
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
  fieldType: _propTypes["default"].string,
  // Schema-formatted type (Ex. Item, Document, etc)
  fieldName: _propTypes["default"].string,
  // Name of specific field (Ex. Related Documents)
  multiselect: _propTypes["default"].bool,
  cls: _propTypes["default"].string
});

_defineProperty(DragAndDropUploadButton, "defaultProps", {
  // TODO: Double check that these assumptions make sense...
  fieldType: "Document",
  multiselect: false
});

var DragAndDropFileUploadModal =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(DragAndDropFileUploadModal, _React$Component4);

  /*
      Drag and Drop File Manager Component that accepts an onHide and onContainerKeyDown function
      Functions for hiding, and handles files.
  */
  function DragAndDropFileUploadModal(props) {
    var _this4;

    _classCallCheck(this, DragAndDropFileUploadModal);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropFileUploadModal).call(this, props));
    _this4.state = {
      files: [] // Always in an array, even if multiselect enabled

    };
    _this4.handleAddFile = _this4.handleAddFile.bind(_assertThisInitialized(_this4));
    _this4.handleRemoveFile = _this4.handleRemoveFile.bind(_assertThisInitialized(_this4));
    _this4.handleClearAllFiles = _this4.handleClearAllFiles.bind(_assertThisInitialized(_this4));
    _this4.handleHideModal = _this4.handleHideModal.bind(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(DragAndDropFileUploadModal, [{
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
    }
  }, {
    key: "handleClearAllFiles",
    value: function handleClearAllFiles() {
      this.setState({
        files: []
      });
    }
  }, {
    key: "handleHideModal",
    value: function handleHideModal() {
      // Force to clear files before hiding modal, so each time it is opened
      // anew, user doesn't have to re-clear it.
      var propsOnHideFxn = this.props.onHide;
      this.handleClearAllFiles();
      propsOnHideFxn();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          show = _this$props4.show,
          onUploadStart = _this$props4.onUploadStart,
          fieldType = _this$props4.fieldType,
          fieldName = _this$props4.fieldName;
      var files = this.state.files;
      return _react["default"].createElement(_reactBootstrap.Modal, _extends({
        centered: true
      }, {
        show: show
      }, {
        onHide: this.handleHideModal,
        className: "submission-view-modal"
      }), _react["default"].createElement(_reactBootstrap.Modal.Header, {
        closeButton: true
      }, _react["default"].createElement(_reactBootstrap.Modal.Title, {
        className: "text-500"
      }, "Upload a ", fieldType, " ", fieldName && fieldType !== fieldName ? "for " + fieldName : null)), _react["default"].createElement(_reactBootstrap.Modal.Body, null, _react["default"].createElement(DragAndDropZone, _extends({
        files: files
      }, {
        handleAddFile: this.handleAddFile,
        handleRemoveFile: this.handleRemoveFile
      }))), _react["default"].createElement(_reactBootstrap.Modal.Footer, null, _react["default"].createElement("button", {
        type: "button",
        className: "btn btn-danger",
        onClick: this.handleHideModal
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
      }), " Upload ", fieldName)));
    }
  }]);

  return DragAndDropFileUploadModal;
}(_react["default"].Component);

_defineProperty(DragAndDropFileUploadModal, "propTypes", {
  onHide: _propTypes["default"].func.isRequired,
  // Should control show state/prop below
  onUploadStart: _propTypes["default"].func.isRequired,
  // Should trigger the creation of a new object, and start upload
  show: _propTypes["default"].bool,
  // Controlled by state method onHide passed in as prop
  multiselect: _propTypes["default"].bool,
  // Passed in from Schema, along with field and item types
  fieldType: _propTypes["default"].string,
  fieldName: _propTypes["default"].string
});

_defineProperty(DragAndDropFileUploadModal, "defaultProps", {
  show: true,
  multiselect: true
});

var DragAndDropZone =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(DragAndDropZone, _React$Component5);

  function DragAndDropZone(props) {
    var _this5;

    _classCallCheck(this, DragAndDropZone);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(DragAndDropZone).call(this, props));
    _this5.state = {
      dragging: false
    };
    _this5.dropZoneRef = _react["default"].createRef();
    _this5.cleanUpEventListeners = _this5.cleanUpEventListeners.bind(_assertThisInitialized(_this5));
    _this5.setUpEventListeners = _this5.setUpEventListeners.bind(_assertThisInitialized(_this5));
    _this5.handleDrop = _this5.handleDrop.bind(_assertThisInitialized(_this5));
    return _this5;
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
      var _this$props5 = this.props,
          files = _this$props5.files,
          handleRemoveFile = _this$props5.handleRemoveFile;
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