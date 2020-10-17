'use strict'
var Verify = require('../common/verify');
var User = require('../module/User');
var Employee = require('../module/Employee');
var Middleware = require('./middleware');
var express = require('express');
var router = express.Router();

router.get('/', Middleware.authLogin, index);
router.get('/login', login);
router.post('/login', postLogin);

async function login(req, res) {
    var employeeId = req.session.employeeId
    var departmentId = req.session.departmentId;
    var sessionUser = req.session.sessionUser;
    if (employeeId && departmentId && sessionUser) {
        res.redirect('/');
        return;
    }

    res.render('../views/auth/login', {
        backErrors: req.flash('backErrors'),
    });
}

async function postLogin(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var users = await User.query('select * from users WHERE username = ? AND password = ?', [username, password], User)
    if (users.length === 0) {
        req.flash('backErrors', 'Login failed!')
        res.redirect('/login');
        return;
    }
    var user = users[0];
    var employees = await Employee.query('select * from employee WHERE id = ?', [user.employee_id], Employee);
    if (employees.length === 0) {
        req.flash('backErrors', 'Login failed!')
        res.redirect('/login');
        return;
    }
    var employee = employees[0];
    req.session.employeeId = employee.id;
    req.session.departmentId = employee.department_id;
    req.session.sessionUser = user;

    res.redirect('/');
}

async function index(req, res) {
    res.layout('../views/index', {
        layout: '../views/layout/apps',
        title: 'TikTocSystem'
    });
}

module.exports = router