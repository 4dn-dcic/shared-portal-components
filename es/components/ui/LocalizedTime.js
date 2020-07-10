'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preset = preset;
exports.format = format;
exports.display = display;
exports.formatPublicationDate = formatPublicationDate;
exports.LocalizedTime = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _moment = _interopRequireDefault(require("moment"));

var _misc = require("./../util/misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var LocalizedTime = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(LocalizedTime, _React$PureComponent);

  var _super = _createSuper(LocalizedTime);

  function LocalizedTime(props) {
    var _this;

    _classCallCheck(this, LocalizedTime);

    _this = _super.call(this, props);
    _this.memoized = {
      getMoment: (0, _memoizeOne["default"])(function (momentDate, timestamp) {
        if (momentDate) return momentDate;
        if (timestamp) return _moment["default"].utc(timestamp);
        return _moment["default"].utc();
      })
    };
    _this.state = {
      'mounted': false
    };
    return _this;
  }

  _createClass(LocalizedTime, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        'mounted': true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          formatType = _this$props.formatType,
          dateTimeSeparator = _this$props.dateTimeSeparator,
          localize = _this$props.localize,
          customOutputFormat = _this$props.customOutputFormat,
          className = _this$props.className,
          momentDate = _this$props.momentDate,
          timestamp = _this$props.timestamp;
      var mounted = this.state.mounted;
      var selfMoment = this.memoized.getMoment(momentDate, timestamp);

      if (!mounted || (0, _misc.isServerSide)()) {
        return /*#__PURE__*/_react["default"].createElement("span", {
          className: className + ' utc'
        }, display(stateMoment, formatType, dateTimeSeparator, false, customOutputFormat));
      } else {
        return /*#__PURE__*/_react["default"].createElement("span", {
          className: className + (localize ? ' local' : ' utc')
        }, display(stateMoment, formatType, dateTimeSeparator, localize, customOutputFormat));
      }
    }
  }]);

  return LocalizedTime;
}(_react["default"].Component);

exports.LocalizedTime = LocalizedTime;
LocalizedTime.propTypes = {
  momentDate: function momentDate(props, propName) {
    if (props[propName] && !_moment["default"].isMoment(props[propName])) {
      return new Error("momentDate must be an instance of Moment.");
    }
  },
  timestamp: _propTypes["default"].string,
  localize: _propTypes["default"].bool,
  formatType: _propTypes["default"].string,
  dateTimeSeparator: _propTypes["default"].string,
  customOutputFormat: _propTypes["default"].string,
  fallback: _propTypes["default"].string,
  className: _propTypes["default"].string
};
LocalizedTime.defaultProps = {
  momentDate: null,
  timestamp: null,
  formatType: 'date-md',
  dateTimeSeparator: ' ',
  customOutputFormat: null,
  fallback: "N/A",
  className: "localized-date-time",
  localize: true
};

function preset() {
  var formatType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'date-md';
  var dateTimeSeparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : " ";

  function date(ft) {
    switch (ft) {
      case 'date-file':
        return "YYYY-MM-DD";

      case 'date-xs':
        // 11/03/2016
        return "MM/DD/YYYY";

      case 'date-sm':
        // Nov 3rd, 2016
        return "MMM Do, YYYY";

      case 'date-md':
        // November 3rd, 2016   (default)
        return "MMMM Do, YYYY";

      case 'date-lg':
        // Thursday, November 3rd, 2016
        return "dddd, MMMM Do, YYYY";

      case 'date-month':
        // November 2016
        return "MMMM YYYY";

      case 'date-year':
        // November 2016
        return "YYYY";
    }
  }

  function time(ft) {
    switch (ft) {
      case 'time-file':
        return "HH[h]-mm[m]";

      case 'time-xs':
        // 12pm
        return "ha";

      case 'time-sm':
      case 'time-md':
        // 12:27pm
        return "h:mma";

      case 'time-lg':
        // 12:27:34 pm
        return "h:mm:ss a";
    }
  }

  if (formatType.indexOf('date-time-') > -1) {
    return date(formatType.replace('time-', '')) + '[' + dateTimeSeparator + ']' + time(formatType.replace('date-', ''));
  } else if (formatType.indexOf('date-') > -1) {
    return date(formatType);
  } else if (formatType.indexOf('time-') > -1) {
    return time(formatType);
  }

  return null;
}
/**
 * Presets for date/time output formats for 4DN.
 * Uses bootstrap grid sizing name convention, so may utilize with responsiveGridState
 * to set responsively according to screen size, e.g. in a (debounced/delayed) window
 * resize event listener.
 *
 * @see responsiveGridState
 * @param {string} [formatType] - Key for date/time format to display. Defaults to 'date-md'.
 * @param {string} [dateTimeSeparator] - Separator between date and time if formatting a date-time. Defaults to ' '.
 */


function format(timestamp) {
  var formatType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'date-md';
  var dateTimeSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : " ";
  var localize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var customOutputFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  return display(_moment["default"].utc(timestamp), formatType, dateTimeSeparator, localize, customOutputFormat);
}

function display(momentObj) {
  var formatType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'date-md';
  var dateTimeSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : " ";
  var localize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var customOutputFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var outputFormat;

  if (customOutputFormat) {
    outputFormat = customOutputFormat;
  } else {
    outputFormat = preset(formatType, dateTimeSeparator);
  }

  if (localize) {
    return momentObj.local().format(outputFormat);
  }

  return momentObj.format(outputFormat);
}
/**
 * This function is meant to accept a UTC/GMT date string
 * and return a formatted version of it _without_ performing
 * any timezone conversion. Only returns year and (optionally)
 * month.
 *
 * @param {string} utcDate - UTC/system-formatted date string.
 * @param {boolean} [includeMonth] - If false, only year will be returned.
 * @return {string} Formatted year and possibly month.
 */


function formatPublicationDate(utcDate) {
  var includeMonth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var includeDay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var yearString, monthString, monthIndex, dayString, dayInteger;

  if (typeof utcDate !== 'string' || utcDate.length < 4) {
    throw new Error('Expected a date string.');
  }

  yearString = utcDate.slice(0, 4);

  if (includeMonth && utcDate.length >= 7) {
    monthString = utcDate.slice(5, 7);
    monthIndex = parseInt(monthString) - 1; // 0-based.
    // @see https://momentjs.com/docs/#/i18n/listing-months-weekdays/

    monthString = _moment["default"].months()[monthIndex];

    if (includeDay && utcDate.length >= 10) {
      dayString = utcDate.slice(8, 10);
      dayInteger = parseInt(dayString); // @see https://momentjs.com/docs/#/i18n/locale-data/

      dayString = _moment["default"].localeData().ordinal(dayInteger);
      return monthString + ' ' + dayString + ', ' + yearString;
    }

    return monthString + ' ' + yearString;
  }

  return yearString;
}