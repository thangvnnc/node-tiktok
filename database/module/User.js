'use strict'
var Base = require('./Base');

class User extends Base {}

User.getAll = function() {
    return User.query('select * from users', [], User);
}
module.exports = User;