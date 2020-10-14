'use strict';
class MysqlException extends Error {
    constructor(error) {
        super(error.message);
        this.name = 'MysqlException';
    }
}
module.exports = MysqlException;