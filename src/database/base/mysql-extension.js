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
    var pool = mysql.createPool(connection);
    // pool.getConnection((err, con) =>
    // {
    //     try
    //     {
    //         if (con)
    //         {
    //             con.release();
    //         }
    //         else {
    //             console.log('Error connecting to MySQL.');
    //         }
    //     }
    //     catch (err)
    //     {
    //         console.log(`MySQL error. ${err}`);
    //     }
    // });
    return pool;
}
MysqlExtension.getInstance = function () {
    if (!this.instance) {
        this.instance = this.createInstance();
    }
    return this.instance;
}
module.exports = MysqlExtension;