'use strict'
var Base = require('./Base');

class Department extends Base {}
Department.perPage = 20;
Department.tableName = 'department';
Department.insert = function(departmentName) {
    return Department.execute("INSERT INTO department (name) VALUES (?)", [departmentName]);
}
Department.update = function(departmentName, withDepartmentId) {
    return Department.execute("UPDATE department SET name = ? WHERE id = ?", [departmentName, withDepartmentId]);
}
Department.delete = function(withDepartmentId) {
    return Department.execute("DELETE FROM department WHERE id = ?", [withDepartmentId]);
}
module.exports = Department;