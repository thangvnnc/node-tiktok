'use strict';
var mysql = require('mysql');
var dbInfo = require('./define');

class MysqlException extends Error {
    constructor(error) {
        super(error.message);
        this.name = 'MysqlException';
    }
}

let MysqlExtension = (function () {
    let instance;

    function createInstance() {
        return mysql.createPool(dbInfo);
    }

    return {
        MysqlException: MysqlException,
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
        query: function(sql, params) {
            var pool = this.getInstance();
            return new Promise(function (resolve, reject) {
                pool.query(sql, params, function (error, results) {
                    if (error) {
                        reject(new MysqlException(error));
                    }
                    resolve(results);
                });
            })
        }
    };
})();

module.exports = MysqlExtension;

// module.exports = function () {
//     var connection = mysql.createConnection({
//         host     : dbInfo.HOST,
//         user     : dbInfo.USER,
//         password : dbInfo.PASS,
//         database : dbInfo.DBNAME,
//         port     : dbInfo.PORT,
//     });
//
//     connection.connect();
//
//     connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//         if (error) throw error;
//         console.log('The solution is: ', results[0].solution);
//     });
//
//     connection.end();
// }