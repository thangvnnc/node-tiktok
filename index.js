'use strict';
var PORT = process.env.PORT || 99;
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var ejsYield = require('ejs-yield');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(ejsYield);

app.use(cookieParser('secretString'));
app.use(session({
    secret: 'aBcDeF',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Set body parser json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var department = require('./src/controller/department');
app.use('/department', department);

var user = require('./src/controller/user');
app.use('/user', user);

app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Server started in port: ' + PORT);
});