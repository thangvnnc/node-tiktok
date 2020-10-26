var moment = require('moment');

'use strict'
class Common {}

Common.FORMAT_DATE_YYYY_MM_DD_HH_mm_ss = 'YYYY-MM-DD HH:mm:ss';
Common.FORMAT_DATE_YYYY_MM_DD = 'YYYY-MM-DD';

Common.getFirstDateTimeInWeek = function(date) {
    var firstDayInWeek = date.getDate() - date.getDay() + 1;
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    var firstDate = new Date(date.setDate(firstDayInWeek));
    return firstDate;
}

Common.getLastDateTimeInWeek = function(date) {
    var firstDayInWeek = date.getDate() - date.getDay();
    var lastDayInWeek = firstDayInWeek + 6 + 1;
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    var lastDate = new Date(date.setDate(lastDayInWeek));
    return lastDate;
}

Common.parseDateFromString = function(stringDate, withFormat) {
    var date = moment(stringDate, withFormat).toDate();
    return date;
}

Common.formatDateToString = function(date, withFormat) {
    var stringDate = moment(date).format(withFormat);
    return stringDate;
}

Common.compareDateTime = function(dateTimeBefore, dateTimeAfter) {
    if (dateTimeAfter.getTime() > dateTimeBefore.getTime()) {
        return 1;
    }
    if (dateTimeBefore.getTime() > dateTimeAfter.getTime()) {
        return -1;
    }
    return 0;
}

module.exports = Common;