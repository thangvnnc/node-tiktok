'use strict'
var Permissions = require('../../src/define/permissions');
var Verify = require('../common/verify');
var Store = require('../module/Store');
var Employee = require('../module/Employee');
var Shift = require('../module/Shift');
var Common = require('../common/common');
var Middleware = require('./middleware');
var express = require('express');
var router = express.Router();

router.get('/attendance', Middleware.authLogin, reportAttendance2);

async function reportAttendance2(req, res) {
    var stores = [];
    var employees = [];
    if (Permissions.isSupperAdmin(req.session.departmentId) === true) {
        stores = await Store.getAll();
        if (req.query.store) {
            var storeId = Verify.parseNumberPage(req.query.store);
            employees = await Employee.getWithStoreId(storeId);
        }
        else {
            employees = await Employee.getAll();
        }
    }
    else {
        stores = await Store.getStoreWithUserId(req.session.sessionUser.id);
        var store;
        if (stores.length > 0) {
            store = stores[0];
        }

        employees = await Employee.getWithStoreIdAndDepartmentId(storeId, store.department_id);
    }


    var currentDate = new Date();
    var first = Common.getFirstDateTimeInWeek(currentDate);
    var last = Common.getLastDateTimeInWeek(currentDate);
    var firstDate = Common.formatDateToString(first, Common.FORMAT_DATE_YYYY_MM_DD_HH_mm_ss);
    var lastDate =  Common.formatDateToString(last, Common.FORMAT_DATE_YYYY_MM_DD_HH_mm_ss);
    if (req.query.start) {
        firstDate = Common.formatDateToString(Common.parseDateFromString(req.query.start, Common.FORMAT_DATE_YYYY_MM_DD_HH_mm_ss), Common.FORMAT_DATE_YYYY_MM_DD_HH_mm_ss);
    }
    if (req.query.end) {
        lastDate = Common.formatDateToString(Common.parseDateFromString(req.query.end, Common.FORMAT_DATE_YYYY_MM_DD_HH_mm_ss), Common.FORMAT_DATE_YYYY_MM_DD_HH_mm_ss);
    }

    var employee = req.query.employee;
    var reports = [];

    if (employee) {
        var employeeShifts = await Shift.getWithEmployeeIdBetweenStartDate(employee, firstDate, lastDate);
        reports['Monday']['weekdayHour'] = 0.0;
        reports['Monday']['weekendHour'] = 0.0;
        reports['Monday']['extraHour'] = 0.0;
        reports['Tuesday']['weekdayHour'] = 0.0;
        reports['Tuesday']['weekendHour'] = 0.0;
        reports['Tuesday']['extraHour'] = 0.0;
        reports['Wednesday']['weekdayHour'] = 0.0;
        reports['Wednesday']['weekendHour'] = 0.0;
        reports['Wednesday']['extraHour'] = 0.0;
        reports['Thursday']['weekdayHour'] = 0.0;
        reports['Thursday']['weekendHour'] = 0.0;
        reports['Thursday']['extraHour'] = 0.0;
        reports['Friday']['weekdayHour'] = 0.0;
        reports['Friday']['weekendHour'] = 0.0;
        reports['Friday']['extraHour'] = 0.0;
        reports['Saturday']['weekdayHour'] = 0.0;
        reports['Saturday']['weekendHour'] = 0.0;
        reports['Saturday']['extraHour'] = 0.0;
        reports['Sunday']['weekdayHour'] = 0.0;
        reports['Sunday']['weekendHour'] = 0.0;
        reports['Sunday']['extraHour'] = 0.0;

        var weekdayHours = 0.0;
        var weekendHours = 0.0;
        var extraHours = 0.0;

        for (let idxEmployeeShift = 0; idxEmployeeShift < employeeShifts.length; idxEmployeeShift++) {
            var shift = employeeShifts[idxEmployeeShift];
            var startDateTime = Common.parseDateFromString(req.query.start, Common.FORMAT_DATE_YYYY_MM_DD);
            var endDateTime = Common.parseDateFromString(req.query.end, Common.FORMAT_DATE_YYYY_MM_DD);
            var compareDate = Common.compareDateTime(endDateTime, startDateTime);

            var start = Common.formatDateToString(startDateTime, Common.FORMAT_DATE_YYYY_MM_DD);
            var end = Common.formatDateToString(endDateTime, Common.FORMAT_DATE_YYYY_MM_DD);

            if (compareDate === 0) {
                var hour = calculateShiftHour(shift);
                reports[shift.weekday]['weekdayHour'] += hour['weekdayHour'];
                reports[shift.weekday]['weekendHour'] += hour['weekendHour'];
                reports[shift.weekday]['extraHour'] += hour['extraHour'];

                weekdayHours += hour['weekdayHour'];
                weekendHours += hour['weekendHour'];
                extraHours += hour['extraHour'];
            }
            else if (compareDate === 1) {
                
            }
        }
    }

    res.layout('../views/report/attendance2', {
        layout: '../views/layout/apps',
        title: 'Attendance Report'
    });
}

async function calculateShiftHour(shift) {
    var employeeId = shift.employee_id;
}

module.exports = router