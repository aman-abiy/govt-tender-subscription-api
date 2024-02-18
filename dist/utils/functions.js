"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStartEndDate = exports.extendDateTime = void 0;
const extendDateTime = (initialDate, extendBy) => {
    let newDate = initialDate;
    let _hour = initialDate.getHours() + extendBy.hours;
    let _minutes = initialDate.getMinutes() + extendBy.minutes;
    let _seconds = initialDate.getSeconds() + extendBy.seconds;
    newDate.setHours(_hour);
    newDate.setMinutes(_minutes);
    newDate.setSeconds(_seconds);
    return newDate;
};
exports.extendDateTime = extendDateTime;
const getStartEndDate = () => {
    let date = new Date();
    // set time to midnight
    date.setUTCHours(0, 0, 0, 0);
    var dateToday = date.toISOString().split('T')[0];
    var timeToday = date.toISOString().split('T')[1].split('.')[0];
    var endDate = `${dateToday} ${timeToday}`;
    // move date to yestarday
    date.setDate(date.getDate() - 1);
    var dateYestarday = date.toISOString().split('T')[0];
    var timeYesterday = date.toISOString().split('T')[1].split('.')[0];
    var startDate = `${dateYestarday} ${timeYesterday}`;
    return {
        startDate,
        endDate,
        today: dateToday
    };
};
exports.getStartEndDate = getStartEndDate;
