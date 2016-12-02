
var express = require('express');
var logger = require('./logger');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mlogger = require('morgan'); // helps log all requests
var students = require('./routes/students');


app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // TODO: Allow localhost 3700
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(mlogger('dev'));

app.use(logger);
app.use(express.static(path.join(__dirname, '..', 'FrontEnd', 'dist')));    // To pull ember build straight from build foler.
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/students', students);

app.listen(3700, function () {
    console.log('Listening on port 3700');
});
