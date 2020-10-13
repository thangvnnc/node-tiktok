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
MysqlExtension.query = function(sql, params, TypeObjectParse = null) {
    var pool = this.getInstance();
    return new Promise(function (resolve, reject) {
        pool.query(sql, params, function (error, results) {
            if (error) {
                reject(new MysqlException(error));
                return;
            }

            if (TypeObjectParse !== null) {
                var arrResult = [];
                results.forEach(result => {
                    let object = new TypeObjectParse(result);
                    arrResult.push(object);
                });

                resolve(arrResult);
            }
            resolve(results);
        });
    })
}

// let MysqlExtension = (function () {
//     let instance;
//
//     function createInstance() {
//         return mysql.createPool(dbInfo);
//     }
//
//     return {
//         MysqlException: MysqlException,
//         getInstance: function () {
//             if (!instance) {
//                 instance = createInstance();
//             }
//             return instance;
//         },
//         query: function(sql, params) {
//             var pool = this.getInstance();
//             return new Promise(function (resolve, reject) {
//                 pool.query(sql, params, function (error, results) {
//                     if (error) {
//                         reject(new MysqlException(error));
//                     }
//                     resolve(results);
//                 });
//             })
//         }
//     };
// })();

module.exports = MysqlExtension;