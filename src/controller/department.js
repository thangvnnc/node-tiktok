'use strict'
var Department = require('../module/Department');
var Verify = require('../common/verify');
var express = require('express');
var router = express.Router();

router.get('/',async function (req, res) {
    var page = Verify.isUInt(req.query.page) ? parseInt(req.query.page) : 1;
    var departments = await Department.paginate(req, "id", Department.perPage, page);

    res.layout('../views/department/index', {
        layout: '../views/layout/apps',
        title: 'Department',
        backErrors: req.flash('backErrors'),
        continueSucceses: req.flash('continueSucceses'),
        departments: departments
    });
});

router.post('/', async function (req, res) {
    var body = req.body;
    var results = await Department.insert(body.name);
    if (results.affectedRows > 0) {
        req.flash('continueSucceses', 'Item has been added!')
    } else {
        req.flash('backErrors', 'Item cannot added, try again!')
    }
    res.redirect('/department');
})

router.post('/update', async function (req, res) {
    var body = req.body;
    var results = await Department.update(body.name, body.departmentId);
    if (results.affectedRows > 0) {
        req.flash('continueSucceses', 'Item updated')
    } else {
        req.flash('backErrors', 'Update fail, try again!')
    }
    res.redirect('/department');
})

router.get('/delete/:id', async function(req, res) {
    var params = req.params;
    var results = await Department.delete(params.id);
    if (results.affectedRows > 0) {
        req.flash('continueSucceses', 'Item deleted')
    } else {
        req.flash('backErrors', 'Cannot delete item, try again!')
    }
    res.redirect('/department');
})

module.exports = router