'use strict'
class Permissions {}

Permissions.isSupperAdmin = function(department_id) {
    return department_id === 4;
}

module.exports = Permissions;
