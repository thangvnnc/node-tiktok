'use strict';
var PORT = process.env.PORT || 99;
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var sqlExt = require('./database/mysql-extension');

function getAllUser() {
    return sqlExt.query('select * from users', []);
}

getAllUser()
    .then(function (users){
        console.log(users);
    })
    .catch(function (err) {
        if (err instanceof sqlExt.MysqlException) {
            console.log(err);
        }
    });



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