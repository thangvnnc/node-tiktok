'use strict';
var mysql = require('mysql');
var connection = require('./mysql-connection');
var MysqlException = require('./mysql-exception');

class MysqlExtension {
    // function
}
MysqlExtension.instance = undefined;
MysqlExtension.MysqlException = MysqlException;
MysqlExtension.createInstance = function () {
    return mysql.createPool(connection);
}
MysqlExtension.getInstance = function () {
    if (!this.instance) {
        this.instance = this.createInstance();
    }
    return this.instance;
}
module.exports = MysqlExtension;