import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
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
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { parseISO, format as formatDate, isValid } from "date-fns";
import { format as localFormat, zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { enUS } from "date-fns/locale";
import { isServerSide } from './../util/misc';
export var LocalizedTime = /*#__PURE__*/function (_React$Component) {
  function LocalizedTime(props) {
    var _this2;
    _classCallCheck(this, LocalizedTime);
    _this2 = _callSuper(this, LocalizedTime, [props]);
    _this2.memoized = {
      getDateFns: memoize(function (dateFnsDate, timestamp, localize) {
        if (dateFnsDate) return dateFnsDate;
        if (timestamp) {
          var d = zonedTimeToUtc(timestamp);
          // shift the date to the local timezone if it is not zoned
          if (!LocalizedTime.isZoned(timestamp) && !localize) {
            d = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
          }
          return d;
        }
        return new Date();
      })
    };
    _this2.state = {
      'mounted': false
    };
    return _this2;
  }
  _inherits(LocalizedTime, _React$Component);
  return _createClass(LocalizedTime, [{
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
        dateFnsDate = _this$props.dateFnsDate,
        timestamp = _this$props.timestamp;
      var mounted = this.state.mounted;
      var selfDateFns = this.memoized.getDateFns(dateFnsDate, timestamp, localize);
      if (!mounted || isServerSide()) {
        return /*#__PURE__*/React.createElement("span", {
          className: className + ' utc',
          suppressHydrationWarning: true
        }, display(selfDateFns, formatType, dateTimeSeparator, false, customOutputFormat));
      } else {
        return /*#__PURE__*/React.createElement("span", {
          className: className + (localize ? ' local' : ' utc'),
          suppressHydrationWarning: true
        }, display(selfDateFns, formatType, dateTimeSeparator, localize, customOutputFormat));
      }
    }
  }], [{
    key: "isZoned",
    value:
    // Function to check if the date string contains timezone information
    function isZoned(dateString) {
      // Checks if the string ends with "Z" or an offset (+HH:mm or -HH:mm)
      return /Z$|[+-]\d{2}:\d{2}$/.test(dateString);
    }
  }]);
}(React.Component);
LocalizedTime.propTypes = {
  dateFnsDate: function dateFnsDate(props, propName) {
    if (props[propName] && !isValid(props[propName])) {
      return new Error("dateFnsDate must be an instance of date-fns.");
    }
  },
  // Timestamp can be any of the following according to: https://github.com/marnusw/date-fns-tz#zonedtimetoutc
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  formatType: PropTypes.string,
  dateTimeSeparator: PropTypes.string,
  customOutputFormat: PropTypes.string,
  fallback: PropTypes.string,
  className: PropTypes.string
};
LocalizedTime.defaultProps = {
  dateFnsDate: null,
  timestamp: null,
  formatType: 'date-md',
  dateTimeSeparator: ' ',
  customOutputFormat: null,
  fallback: "N/A",
  className: "localized-date-time",
  localize: true
};

/**
 * @see https://date-fns.org/v2.28.0/docs/format
 */
export function preset() {
  var formatType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'date-md';
  var dateTimeSeparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : " ";
  function date(ft) {
    switch (ft) {
      case 'date-file':
        return "yyyy-MM-dd";
      case 'date-xs':
        // 11/03/2016 (for USA, localized for other places)
        return "P";
      case 'date-sm':
        // Nov 3rd, 2016
        return "MMM do, yyyy";
      case 'date-sm-compact':
        // Nov 3, 2016
        return "MMM d, yyyy";
      case 'date-md':
        // November 3rd, 2016   (default)
        return "MMMM do, yyyy";
      case 'date-lg':
        // Thursday, November 3rd, 2016
        return "dddd, MMMM do, yyyy";
      case 'date-month':
        // November 2016
        return "MMMM yyyy";
      case 'date-year':
        // November 2016
        return "yyyy";
    }
  }
  function time(ft) {
    switch (ft) {
      case 'time-file':
        return "HH'h'-mm'm'";
      case 'time-xs':
        // 12pm
        return "haaa";
      case 'time-sm':
      case 'time-md':
        // 12:27pm
        return "h:mmaaa";
      case 'time-lg':
        // 12:27:34 pm
        return "h:mm:ss aaa";
    }
  }
  if (formatType.indexOf('date-time-') > -1) {
    return date(formatType.replace('time-', '')) + "'" + dateTimeSeparator.concat() + "'" + time(formatType.replace('date-', ''));
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
export function format(timestamp) {
  var formatType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'date-md';
  var dateTimeSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : " ";
  var localize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var customOutputFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  return display(parseISO(timestamp), formatType, dateTimeSeparator, localize, customOutputFormat);
}
export function display(dateObj) {
  var formatType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'date-md';
  var dateTimeSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : " ";
  var localize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var customOutputFormat = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  if (!isValid(dateObj)) return null;
  var outputFormat;
  if (customOutputFormat) {
    outputFormat = customOutputFormat;
  } else {
    outputFormat = preset(formatType, dateTimeSeparator);
  }
  if (localize) {
    return localFormat(utcToZonedTime(dateObj), outputFormat);
  }
  return formatDate(dateObj, outputFormat);
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
export function formatPublicationDate(utcDate) {
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
    monthString = enUS.localize.month(monthIndex);
    if (includeDay && utcDate.length >= 10) {
      dayString = utcDate.slice(8, 10);
      dayInteger = parseInt(dayString);
      dayString = enUS.localize.ordinalNumber(dayInteger);
      return monthString + ' ' + dayString + ', ' + yearString;
    }
    return monthString + ' ' + yearString;
  }
  return yearString;
}