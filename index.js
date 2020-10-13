'use strict';
var PORT = process.env.PORT || 99;
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var blueBird = require('bluebird');
var fs = require('fs');
var dbInfo = require('./database/define');

app.set('view engine', 'ejs');
app.set('views', './views');

// Set body parser json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
   res.send(dbInfo.HOST);
});

app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Server started in port: ' + PORT);
});