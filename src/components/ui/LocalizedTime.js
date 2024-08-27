import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { parseISO, format as formatDate, isValid } from "date-fns";
import { format as localFormat, zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { enUS } from "date-fns/locale";
import { isServerSide } from './../util/misc';

export class LocalizedTime extends React.Component {

    constructor(props){
        super(props);
        this.memoized = {
            getDateFns: memoize(function(dateFnsDate, timestamp) {
                const parsedTime = zonedTimeToUtc(timestamp);
                // console.log("parsedTime", parsedTime);
                if (dateFnsDate) return dateFnsDate;
                if (timestamp) return parsedTime;
                return new Date();
            })
        };
        this.state = { 'mounted' : false };
    }

    componentDidMount(){
        this.setState({ 'mounted' : true });
    }

    render(){
        const {
            formatType,
            dateTimeSeparator,
            localize,
            customOutputFormat,
            className,
            dateFnsDate,
            timestamp
        } = this.props;
        const { mounted } = this.state;
        const selfDateFns = this.memoized.getDateFns(dateFnsDate, timestamp);
        if (!mounted || isServerSide()) {
            return (
                <span className={className + ' utc'} suppressHydrationWarning={true}>
                    { display(selfDateFns, formatType, dateTimeSeparator, false, customOutputFormat) }
                </span>
            );
        } else {
            return (
                <span className={className + (localize ? ' local' : ' utc')} suppressHydrationWarning={true}>
                    { display(selfDateFns, formatType, dateTimeSeparator, localize, customOutputFormat) }
                </span>
            );
        }
    }
}
LocalizedTime.propTypes = {
    dateFnsDate : function(props, propName, componentName){
        if (props[propName] && !isValid(props[propName])){
            return new Error("dateFnsDate must be an instance of date-fns.");
        }
    },
    // Timestamp can be any of the following according to: https://github.com/marnusw/date-fns-tz#zonedtimetoutc
    timestamp : PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    formatType : PropTypes.string,
    dateTimeSeparator : PropTypes.string,
    customOutputFormat : PropTypes.string,
    fallback : PropTypes.string,
    className : PropTypes.string
};
LocalizedTime.defaultProps = {
    dateFnsDate : null,
    timestamp : null,
    formatType : 'date-md',
    dateTimeSeparator : ' ',
    customOutputFormat : null,
    fallback : "N/A",
    className : "localized-date-time",
    localize : true
};

/**
 * @see https://date-fns.org/v2.28.0/docs/format
 */
export function preset(formatType = 'date-md', dateTimeSeparator = " "){

    function date(ft){
        switch(ft){
            case 'date-file':
                return "yyyy-MM-dd";
            case 'date-xs':
                // 11/03/2016 (for USA, localized for other places)
                return "P";
            case 'date-sm':
                // Nov 3rd, 2016
                return "MMM do, yyyy";
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

    function time(ft){
        switch(ft){
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

    if (formatType.indexOf('date-time-') > -1){
        return date(formatType.replace('time-','')) + "'" + dateTimeSeparator.concat() + "'" + time(formatType.replace('date-',''));
    } else if (formatType.indexOf('date-') > -1){
        return date(formatType);
    } else if (formatType.indexOf('time-') > -1){
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
export function format(timestamp, formatType = 'date-md', dateTimeSeparator = " ", localize = false, customOutputFormat = null){
    return display(parseISO(timestamp), formatType, dateTimeSeparator, localize, customOutputFormat);
}

export function display(dateObj, formatType = 'date-md', dateTimeSeparator = " ", localize = false, customOutputFormat = null){
    if (!isValid(dateObj)) return null;

    var outputFormat;
    if (customOutputFormat) {
        outputFormat = customOutputFormat;
    } else {
        outputFormat = preset(formatType, dateTimeSeparator);
    }
    if (localize){
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
export function formatPublicationDate(utcDate, includeMonth = true, includeDay = true){
    var yearString, monthString, monthIndex, dayString, dayInteger;
    if (typeof utcDate !== 'string' || utcDate.length < 4){
        throw new Error('Expected a date string.');
    }
    yearString = utcDate.slice(0,4);
    if (includeMonth && utcDate.length >= 7){
        monthString = utcDate.slice(5,7);
        monthIndex = parseInt(monthString) - 1; // 0-based.
        monthString = enUS.localize.month(monthIndex);
        if (includeDay && utcDate.length >= 10){
            dayString = utcDate.slice(8, 10);
            dayInteger = parseInt(dayString);
            dayString = enUS.localize.ordinalNumber(dayInteger);
            return monthString + ' ' + dayString + ', ' + yearString;
        }
        return monthString + ' ' + yearString;
    }
    return yearString;
}
