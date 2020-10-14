'use strict';
var MysqlException = require('../base/mysql-extension');
class Base extends MysqlException{
    constructor(row) {
        super();
        for(var propertyName in row) {
            // propertyName is what you want
            // you can get the value like this: myObject[propertyName]
            this[propertyName] = row[propertyName];
        }
    }
    printObjectInfo() {
        for(var propertyName in this) {
            console.log(propertyName + ":" + this[propertyName]);
        }
    }
    printPropertyNames() {
        for(var propertyName in this) {
            console.log(propertyName);
        }
    }
    printPropertyValues() {
        for(var propertyName in this) {
            console.log(this[propertyName]);
        }
    }
}

// Base.MysqlException = SqlExt.MysqlException;
// Base.SqlExt = SqlExt;
module.exports = Base;