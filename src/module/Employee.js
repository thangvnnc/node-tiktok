'use strict'
var Base = require('./Base');

class Employee extends Base {}
Employee.perPage = 20;
Employee.tableName = 'employee';
module.exports = Employee;