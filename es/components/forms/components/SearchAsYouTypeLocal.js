"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchAsYouTypeLocal = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactBootstrap = require("react-bootstrap");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
Custom Bootstrap Dropdown code adapted from:
https://react-bootstrap.github.io/components/dropdowns/#custom-dropdown-components
*/
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
var CustomToggle = _react["default"].forwardRef(function (_ref, ref) {
  var children = _ref.children,
      _onClick = _ref.onClick;
  return _react["default"].createElement("a", {
    href: "",
    ref: ref,
    onClick: function onClick(e) {
      e.preventDefault();

      _onClick(e);
    },
    className: "btn btn-outline-dark dropdown-toggle"
  }, children);
}); // forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it


var CustomMenu = _react["default"].forwardRef(function (_ref2, ref) {
  var filterMethod = _ref2.filterMethod,
      onChangeFx = _ref2.onChangeFx,
      toggleOpen = _ref2.toggleOpen,
      children = _ref2.children,
      style = _ref2.style,
      className = _ref2.className,
      labeledBy = _ref2['aria-labelledby'];

  var _useState = (0, _react.useState)(''),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  function escapeRegExp(string) {
    // todo: maybe move to util?
    // escapes regex characters from strings
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // handle escapable characters in regexp
  }

  function getRegexQuery() {
    switch (filterMethod) {
      case "includes":
        return escapeRegExp(value.toLowerCase()) + "(.+)$";

      case "startsWith":
      default:
        return "^" + escapeRegExp(value.toLowerCase()) + "(.+)$";
    }
  }

  var filteredItems = _react["default"].Children.toArray(children).filter(function (child) {
    // as person types, generate a regex filter based on their input
    var regex = new RegExp(getRegexQuery()); // show/hide entries depending on regex match

    return (child.props.children.toLowerCase() || "").match(regex);
  });

  function onSubmitNewEntry() {
    onChangeFx(value);
    toggleOpen();
  }

  function _onKeyDown(e) {
    if (e.key === "Enter") {
      onSubmitNewEntry();
    } else if ((e.key === "ArrowDown" || e.key === "Tab") && filteredItems.length !== 0) {
      // add focus to the first item in filtered items
      var x = document.querySelector(".dropdown > .dropdown-menu.show > .list-unstyled");

      if (x.childNodes[0]) {
        x.childNodes[0].focus();
        e.preventDefault();
      }
    }
  }

  return _react["default"].createElement("div", {
    ref: ref,
    style: (style, {
      overflowY: "hidden",
      width: "240px"
    }),
    className: className,
    "aria-labelledby": labeledBy
  }, _react["default"].createElement("div", {
    className: "d-flex align-items-center"
  }, _react["default"].createElement("div", {
    className: "col"
  }, _react["default"].createElement(_reactBootstrap.FormControl, {
    autoFocus: true,
    className: "mx-3 my-2",
    placeholder: "Type to filter...",
    onChange: function onChange(e) {
      return setValue(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      return _onKeyDown(e);
    },
    value: value,
    tabIndex: "3"
  })), _react["default"].createElement("div", {
    className: "col-auto remove-button-container",
    "data-tip": "Select '".concat(value, "'")
  }, filteredItems.length === 0 && value.length > 0 ? _react["default"].createElement("button", {
    className: "btn-success btn",
    type: "button",
    onClick: function onClick() {
      return onSubmitNewEntry();
    }
  }, _react["default"].createElement("i", {
    className: "icon icon-plus fas"
  })) : null)), filteredItems.length > 0 ? _react["default"].createElement("ul", {
    className: "list-unstyled",
    style: {
      overflowY: "scroll",
      maxHeight: "250px",
      marginBottom: "0"
    }
  }, filteredItems) : null);
});

var SearchAsYouTypeLocal =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SearchAsYouTypeLocal, _React$Component);

  function SearchAsYouTypeLocal(props) {
    var _this;

    _classCallCheck(this, SearchAsYouTypeLocal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchAsYouTypeLocal).call(this, props));
    _this.state = {
      dropOpen: false
    };
    _this.toggleOpen = _this.toggleOpen.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SearchAsYouTypeLocal, [{
    key: "toggleOpen",
    value: function toggleOpen() {
      var dropOpen = this.state.dropOpen;
      this.setState({
        dropOpen: !dropOpen
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          searchList = _this$props.searchList,
          value = _this$props.value,
          onChange = _this$props.onChange,
          filterMethod = _this$props.filterMethod;
      var dropOpen = this.state.dropOpen;
      return _react["default"].createElement(_reactBootstrap.Dropdown, {
        drop: "down",
        flip: false,
        onToggle: this.toggleOpen,
        show: dropOpen
      }, _react["default"].createElement(_reactBootstrap.Dropdown.Toggle, {
        as: CustomToggle
      }, value || _react["default"].createElement("span", {
        className: "text-300"
      }, "No value")), _react["default"].createElement(_reactBootstrap.Dropdown.Menu, {
        style: {
          maxWidth: "240px",
          minHeight: "75px"
        },
        as: CustomMenu,
        drop: "down",
        flip: false,
        show: dropOpen,
        onChangeFx: onChange,
        toggleOpen: this.toggleOpen,
        filterMethod: filterMethod
      }, searchList.map(function (string) {
        return _react["default"].createElement(_reactBootstrap.Dropdown.Item, {
          key: string,
          onSelect: function onSelect(e) {
            onChange(e);
          },
          eventKey: string,
          className: "text-ellipsis-container",
          tabIndex: "4"
        }, string);
      })));
    }
  }]);

  return SearchAsYouTypeLocal;
}(_react["default"].Component);

exports.SearchAsYouTypeLocal = SearchAsYouTypeLocal;
SearchAsYouTypeLocal.propTypes = {
  searchList: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  value: _propTypes["default"].string,
  onChange: _propTypes["default"].func.isRequired,
  filterMethod: _propTypes["default"].string // "startsWith", "includes" (can add more in future if necessary) -- defaults to startsWith

};