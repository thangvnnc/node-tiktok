'use strict'
var Base = require('./Base');

class Store extends Base {}
Store.perPage = 20;
Store.tableName = 'store';
Store.getAll = function() {
    return Store.query('select * from store', [], Store);
}
Store.getStoreWithUserId = function(userId) {
    return Store.query(
        'SELECT s.* FROM users u ' +
        'JOIN employee e ON u.`employee_id` = e.id ' +
        'JOIN store s ON s.id = e.store_id ' +
        'WHERE u.id = ?', [userId], Store);
}
module.exports = Store;