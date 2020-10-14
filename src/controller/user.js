'use strict'
var User = require('../module/User');
var Verify = require('../common/verify');
var express = require('express');
var router = express.Router();

router.get('/',async function (req, res) {
    var page = Verify.isUInt(req.query.page) ? parseInt(req.query.page) : 1;
    var users = await User.paginate(req, "id", User.perPage, page);
    console.log(users.links());
    // console.log(users);

    res.layout('../views/department/index', {
        layout: '../views/layout/apps',
        title: 'user'
    });
})

module.exports = router