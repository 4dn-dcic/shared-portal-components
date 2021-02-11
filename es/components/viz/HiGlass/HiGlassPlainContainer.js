'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HiGlassLoadingIndicator = HiGlassLoadingIndicator;
exports.HiGlassPlainContainer = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _util = require("./../../util");

var _utilities = require("./../utilities");

var _packageLock = _interopRequireDefault(require("./../../../../package-lock.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Functional component to display loading indicator.
 *
 * @param {{ icon: string, title: JSX.Element|string }} props Props passed into this Component.
 */
function HiGlassLoadingIndicator(props) {
  var icon = props.icon,
      title = props.title;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("h3", null, /*#__PURE__*/_react["default"].createElement("i", {
    className: "icon icon-lg icon-" + (icon || "tv fas")
  })), title || "Initializing");
}
/** Loaded upon componentDidMount; HiGlassComponent is not supported server-side. */


var HiGlassComponent = null;
var StackedBarTrack = null;
var higlassRegister = null;

var HiGlassPlainContainer = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(HiGlassPlainContainer, _React$PureComponent);

  var _super = _createSuper(HiGlassPlainContainer);

  _createClass(HiGlassPlainContainer, null, [{
    key: "correctTrackDimensions",
    value: function correctTrackDimensions(hiGlassComponent) {
      (0, _utilities.requestAnimationFrame)(function () {
        _underscore["default"].forEach(hiGlassComponent.tiledPlots, function (tp) {
          return tp && tp.measureSize();
        });
      });
    }
  }]);

  function HiGlassPlainContainer(props) {
    var _this;

    _classCallCheck(this, HiGlassPlainContainer);

    _this = _super.call(this, props);
    _this.instanceContainerRefFunction = _this.instanceContainerRefFunction.bind(_assertThisInitialized(_this));
    _this.correctTrackDimensions = _this.correctTrackDimensions.bind(_assertThisInitialized(_this));
    _this.getHiGlassComponent = _this.getHiGlassComponent.bind(_assertThisInitialized(_this));
    _this.state = {
      'mounted': false,
      'mountCount': 0,
      'hasRuntimeError': false
    };
    _this.hgcRef = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }

  _createClass(HiGlassPlainContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          mountDelay = _this$props.mountDelay,
          onViewConfigUpdated = _this$props.onViewConfigUpdated;

      var finish = function () {
        _this2.setState(function (currState) {
          return {
            'mounted': true,
            'mountCount': currState.mountCount + 1
          };
        }, function () {
          setTimeout(_this2.correctTrackDimensions, 500);

          if (onViewConfigUpdated && typeof onViewConfigUpdated === 'function') {
            var hgc = _this2.getHiGlassComponent();

            if (hgc) {
              hgc.api.on("viewConfig", onViewConfigUpdated);
            }
          }
        });
      };

      setTimeout(function () {
        // Allow tab CSS transition to finish (the render afterwards lags browser a little bit).
        if (!HiGlassComponent) {
          window.fetch = window.fetch || _util.ajax.fetchPolyfill; // Browser compatibility polyfill
          // Load in HiGlass libraries as separate JS file due to large size.
          // @see https://webpack.js.org/api/module-methods/#requireensure
          // TODO figure out how to use import() syntax to load multiple dependencies, to keep HiGlass working.

          require.ensure(['higlass/dist/hglib', 'higlass-register', 'higlass-multivec/es/StackedBarTrack'], function (require) {
            HiGlassComponent = require('higlass/dist/hglib').HiGlassComponent;
            higlassRegister = require('higlass-register')["default"];
            StackedBarTrack = require('higlass-multivec/es/StackedBarTrack')["default"];

            _util.console.log("LOADED\na:\n", HiGlassComponent, "\n:b\n", higlassRegister, "\nc:\n", StackedBarTrack); // Possible todo: use pluginTracks prop to pass `"horizontal-stacked-bar" : StackedBarTrack`
            // in render method instead.


            higlassRegister({
              name: 'StackedBarTrack',
              track: StackedBarTrack,
              config: StackedBarTrack.config
            });
            finish();
          }, "higlass-utils-bundle");
        } else {
          finish();
        }
      }, mountDelay || 500);
    }
  }, {
    key: "correctTrackDimensions",
    value: function correctTrackDimensions() {
      var hgc = this.getHiGlassComponent();

      if (hgc) {
        HiGlassPlainContainer.correctTrackDimensions(hgc);
      } else {
        _util.console.error('NO HGC');
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState({
        'mounted': false
      });
    }
  }, {
    key: "componentDidCatch",
    value: function componentDidCatch() {
      this.setState({
        'hasRuntimeError': true
      });
    }
    /**
     * Fade in div element containing HiGlassComponent after HiGlass initiates & loads in first tile etc. (about 500ms).
     * For prettiness only.
     */

  }, {
    key: "instanceContainerRefFunction",
    value: function instanceContainerRefFunction(element) {
      if (element) {
        setTimeout(function () {
          (0, _utilities.requestAnimationFrame)(function () {
            element.style.transition = null; // Use transition as defined in stylesheet

            element.style.opacity = 1;
          });
        }, 500);
      }
    }
  }, {
    key: "getHiGlassComponent",
    value: function getHiGlassComponent() {
      return this && this.hgcRef && this.hgcRef.current || null;
    }
    /**
     * This returns the viewconfig currently stored in PlainContainer _state_.
     * We should adjust this to instead return `JSON.parse(hgc.api.exportViewConfigAsString())`,
     * most likely, to be of any use because HiGlassComponent keeps its own representation of the
     * viewConfig.
     *
     * @todo Change to the above once needed. Don't rely on until then.
     */

  }, {
    key: "getCurrentViewConfig",
    value: function getCurrentViewConfig() {
      var hgc = this.getHiGlassComponent();
      return hgc && hgc.state.viewConfig || null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          disabled = _this$props2.disabled,
          isValidating = _this$props2.isValidating,
          tilesetUid = _this$props2.tilesetUid,
          height = _this$props2.height,
          width = _this$props2.width,
          options = _this$props2.options,
          style = _this$props2.style,
          className = _this$props2.className,
          viewConfig = _this$props2.viewConfig,
          placeholder = _this$props2.placeholder;
      var _this$state = this.state,
          mounted = _this$state.mounted,
          mountCount = _this$state.mountCount,
          hasRuntimeError = _this$state.hasRuntimeError;
      var higlassVersionUsed = _packageLock["default"].dependencies.higlass.version;
      var hiGlassInstance = null;
      var outerKey = "mount-number-" + mountCount;

      if (isValidating || !mounted) {
        var placeholderStyle = {};

        if (typeof height === 'number' && height >= 140) {
          placeholderStyle.height = height;
          placeholderStyle.paddingTop = height / 2 - 40;
        }

        hiGlassInstance = /*#__PURE__*/_react["default"].createElement("div", {
          className: "text-center",
          style: placeholderStyle,
          key: outerKey
        }, placeholder);
      } else if (disabled) {
        hiGlassInstance = /*#__PURE__*/_react["default"].createElement("div", {
          className: "text-center",
          key: outerKey,
          style: placeholderStyle
        }, /*#__PURE__*/_react["default"].createElement("h4", {
          className: "text-400"
        }, "Not Available"));
      } else if (hasRuntimeError) {
        hiGlassInstance = /*#__PURE__*/_react["default"].createElement("div", {
          className: "text-center",
          key: outerKey,
          style: placeholderStyle
        }, /*#__PURE__*/_react["default"].createElement("h4", {
          className: "text-400"
        }, "Runtime Error"));
      } else {
        hiGlassInstance = /*#__PURE__*/_react["default"].createElement("div", {
          key: outerKey,
          className: "higlass-instance",
          style: {
            'transition': 'none',
            height: height,
            'width': width || null
          },
          ref: this.instanceContainerRefFunction
        }, /*#__PURE__*/_react["default"].createElement(HiGlassComponent, _extends({
          options: options,
          viewConfig: viewConfig,
          width: width,
          height: height
        }, {
          ref: this.hgcRef
        })));
      }
      /**
       * TODO: Some state + UI functions to make higlass view full screen.
       * Should try to make as common as possible between one for workflow tab & this. Won't be 100% compatible since adjust workflow detail tab inner elem styles, but maybe some common func for at least width, height, etc.
       */


      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "higlass-view-container" + (className ? ' ' + className : ''),
        style: style
      }, /*#__PURE__*/_react["default"].createElement("link", {
        type: "text/css",
        rel: "stylesheet",
        href: "https://unpkg.com/higlass@".concat(higlassVersionUsed, "/dist/hglib.css"),
        crossOrigin: "true"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "higlass-wrapper"
      }, hiGlassInstance));
    }
  }]);

  return HiGlassPlainContainer;
}(_react["default"].PureComponent);

exports.HiGlassPlainContainer = HiGlassPlainContainer;

_defineProperty(HiGlassPlainContainer, "propTypes", {
  'viewConfig': _propTypes["default"].object.isRequired,
  'isValidating': _propTypes["default"].bool,
  'height': _propTypes["default"].number,
  'mountDelay': _propTypes["default"].number.isRequired,
  'onViewConfigUpdated': _propTypes["default"].func
});

_defineProperty(HiGlassPlainContainer, "defaultProps", {
  'options': {
    'bounded': true
  },
  'isValidating': false,
  'disabled': false,
  'height': 500,
  'viewConfig': null,
  'mountDelay': 500,
  'placeholder': /*#__PURE__*/_react["default"].createElement(HiGlassLoadingIndicator, null)
});