'use strict'
var Verify = require('../common/verify');
var express = require('express');
var router = express.Router();

router.get('/attendance', reportAttendance2);

async function reportAttendance2(req, res) {
    console.log(1);
    // console.log(users);

    res.layout('../views/report/attendance2', {
        layout: '../views/layout/apps',
        title: 'Attendance Report'
    });
}

module.exports = router