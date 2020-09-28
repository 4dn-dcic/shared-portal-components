'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FacetListPopoverController = FacetListPopoverController;
exports.ExtendedDescriptionPopoverIcon = void 0;

var _react = _interopRequireWildcard(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _Fade = _interopRequireDefault(require("react-bootstrap/esm/Fade"));

var _Popover = _interopRequireDefault(require("react-bootstrap/esm/Popover"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function FacetListPopoverController(props) {
  var children = props.children; // In this state we will store the entirety of the Popover JSX to display
  // to allow flexibility in what to display in Popover contents
  // in case we add more types of Popovers later.

  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      openPopoverID = _useState2[0],
      setOpenPopoverID = _useState2[1];

  var adjustedChildren = _react["default"].Children.map(children, function (child) {
    return /*#__PURE__*/_react["default"].cloneElement(child, {
      openPopoverID: openPopoverID,
      setOpenPopoverID: setOpenPopoverID
    });
  });

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, adjustedChildren);
}
/**
 * @todo Potentially refactor to use ReactDOM.createPortal along w. semi-opaque dark background that will close this onClick.
 * @todo Alternatively if we don't want the background, could attach event listener to window maybe..
 */


var ExtendedDescriptionPopoverIcon = /*#__PURE__*/_react["default"].memo(function (props) {
  var facet = props.facet,
      _props$fieldSchema = props.fieldSchema,
      fieldSchema = _props$fieldSchema === void 0 ? null : _props$fieldSchema,
      openPopover = props.openPopover,
      setOpenPopover = props.setOpenPopover;
  var facetTitle = facet.title,
      field = facet.field,
      _facet$extended_descr = facet.extended_description,
      facetExtendedDescription = _facet$extended_descr === void 0 ? null : _facet$extended_descr;

  var _ref = fieldSchema || {},
      fieldTitle = _ref.title,
      _ref$extended_descrip = _ref.extended_description,
      fieldExtendedDescription = _ref$extended_descrip === void 0 ? null : _ref$extended_descrip; // May be null for 'calculated' or 'fake' fields.


  var target = (0, _react.useRef)(null);
  var extendedDescription = facetExtendedDescription || fieldExtendedDescription;
  var idToUse = "extended_description_for_field_" + field;

  var _ref2 = openPopover || {},
      _ref2$id = _ref2.id,
      openPopoverID = _ref2$id === void 0 ? null : _ref2$id,
      openPoverTarget = _ref2.target;

  var isOpen = openPopover && (openPoverTarget === target || openPopoverID === idToUse);

  if (!extendedDescription) {
    return null;
  } // WARNING: extended_description is not sanitized, we control it, but todo: maybe run it through BasicStaticSectionBody or something.


  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-inline-block px-1",
    "data-tip": isOpen ? "Click to close" : "Click for more information",
    ref: target,
    onClick: function onIconClick(e) {
      e.stopPropagation();

      function dismissPopover() {
        setOpenPopover(null);
      }

      if (!!isOpen) {
        dismissPopover();
      } else {
        setOpenPopover({
          id: idToUse,
          ref: target,
          // By time icon is clicked, this will be mounted.
          popover: /*#__PURE__*/_react["default"].createElement(_Popover["default"], null, /*#__PURE__*/_react["default"].createElement(_Popover["default"].Title, {
            as: "div"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "row align-items-center"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "col"
          }, /*#__PURE__*/_react["default"].createElement("h5", {
            className: "text-600 my-0"
          }, facetTitle || fieldTitle || field)), /*#__PURE__*/_react["default"].createElement("div", {
            className: "col-auto clickable",
            onClick: dismissPopover
          }, /*#__PURE__*/_react["default"].createElement("i", {
            className: "icon icon-times fas"
          })))), /*#__PURE__*/_react["default"].createElement(_Popover["default"].Content, null, /*#__PURE__*/_react["default"].createElement("div", {
            className: "popover-content-inner",
            dangerouslySetInnerHTML: {
              __html: extendedDescription
            }
          })))
        });
      }
    }
  }, /*#__PURE__*/_react["default"].createElement("i", {
    className: "icon icon-info-circle fas" + (isOpen ? " text-primary" : "")
  }));
});

exports.ExtendedDescriptionPopoverIcon = ExtendedDescriptionPopoverIcon;