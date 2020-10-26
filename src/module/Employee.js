'use strict'
var Base = require('./Base');

class Employee extends Base {}
Employee.perPage = 20;
Employee.tableName = 'employee';
Employee.getAll = function() {
    return Employee.query('select * from employee', [], Employee);
}
Employee.getWithStoreId = function(storeId) {
    return Employee.query('select * from employee WHERE store_id = ?', [storeId], Employee);
}
Employee.getWithStoreIdAndDepartmentId = function(storeId, departmentId) {
    return Employee.query('select * from employee WHERE store_id = ? AND department_id = ?', [storeId, departmentId], Employee);
}
module.exports = Employee;