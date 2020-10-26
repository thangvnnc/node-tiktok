'use strict'
var Base = require('./Base');

class Shift extends Base {}
Shift.getWithEmployeeIdBetweenStartDate = function(employeeId, startDate, endDate) {
    return Shift.query(
        'select * from shift WHERE employee_id = ? AND start >= ? AND start <= ? AND start < end',
        [employeeId, startDate, endDate],
        Shift);
}
module.exports = Shift;