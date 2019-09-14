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

var _moment = _interopRequireDefault(require("moment"));

var _misc = require("./../util/misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function (obj) { return typeof obj; }; } else { _typeof = function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function (o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function (o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LocalizedTime = function (_React$Component) {
  _inherits(LocalizedTime, _React$Component);

  function LocalizedTime(props) {
    var _this;

    _classCallCheck(this, LocalizedTime);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LocalizedTime).call(this, props));
    _this.state = {
      moment: props.momentDate ? props.momentDate : props.timestamp ? _moment.default.utc(props.timestamp) : _moment.default.utc(),
      mounted: false
    };
    return _this;
  }

  _createClass(LocalizedTime, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        mounted: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          formatType = _this$props.formatType,
          dateTimeSeparator = _this$props.dateTimeSeparator,
          localize = _this$props.localize,
          customOutputFormat = _this$props.customOutputFormat;

      if (!this.state.mounted || (0, _misc.isServerSide)()) {
        return _react.default.createElement("span", {
          className: this.props.className + ' utc'
        }, display(this.state.moment, formatType, dateTimeSeparator, false, customOutputFormat));
      } else {
        return _react.default.createElement("span", {
          className: this.props.className + (localize ? ' local' : ' utc')
        }, display(this.state.moment, formatType, dateTimeSeparator, localize, customOutputFormat));
      }
    }
  }]);

  return LocalizedTime;
}(_react.default.Component);

exports.LocalizedTime = LocalizedTime;
LocalizedTime.propTypes = {
  momentDate: function momentDate(props, propName) {
    if (props[propName] && !_moment.default.isMoment(props[propName])) {
      return new Error("momentDate must be an instance of Moment.");
    }
  },
  timestamp: _propTypes.default.string,
  formatType: _propTypes.default.string,
  dateTimeSeparator: _propTypes.default.string,
  customOutputFormat: _propTypes.default.string,
  fallback: _propTypes.default.string,
  className: _propTypes.default.string
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
        return "MM/DD/YYYY";

      case 'date-sm':
        return "MMM Do, YYYY";

      case 'date-md':
        return "MMMM Do, YYYY";

      case 'date-lg':
        return "dddd, MMMM Do, YYYY";

      case 'date-month':
        return "MMMM YYYY";
    }
  }

  function time(ft) {
    switch (ft) {
      case 'time-file':
        return "HH[h]-mm[m]";

      case 'time-xs':
        return "ha";

      case 'time-sm':
      case 'time-md':
        return "h:mma";

      case 'time-lg':
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

function format(timestamp) {
  var formatType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'date-md';
  var dateTimeSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : " ";
  var localize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var customOutputFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  return display(_moment.default.utc(timestamp), formatType, dateTimeSeparator, localize, customOutputFormat);
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
    monthIndex = parseInt(monthString) - 1;
    monthString = _moment.default.months()[monthIndex];

    if (includeDay && utcDate.length >= 10) {
      dayString = utcDate.slice(8, 10);
      dayInteger = parseInt(dayString);
      dayString = _moment.default.localeData().ordinal(dayInteger);
      return monthString + ' ' + dayString + ', ' + yearString;
    }

    return monthString + ' ' + yearString;
  }

  return yearString;
}