'use strict'
class Middleware {}
Middleware.authLogin = function(req, res, next) {
    var employeeId = req.session.employeeId
    var departmentId = req.session.departmentId;
    var sessionUser = req.session.sessionUser;
    if (employeeId && departmentId && sessionUser) {
        next();
        return;
    }

    res.redirect('/login');
}
module.exports = Middleware;