
var express = require('express');
var logger = require('./logger');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mlogger = require('morgan'); // helps log all requests
var students = require('./routes/students');
var v2 = require('./routes/students_v2');


app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'https://dontstealourcode-etarlton.c9users.io');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(mlogger('dev'));

app.use(logger);

app.use('/api/v2/students', v2);
app.use('/api/students', students);

app.use(express.static(path.join(__dirname, '..', 'FrontEnd', 'dist')));    // To pull ember build straight from build foler.
app.get('/*', function(req, res) {res.sendFile(path.join(__dirname, '..' , 'FrontEnd', 'dist','index.html'))});
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, function () {
    console.log('Listening on port 8080');
});
