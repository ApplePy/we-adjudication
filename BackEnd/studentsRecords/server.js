
var express = require('express');
var logger = require('./logger');
var app = express();

var students = require('./routes/students');
var residencies = require('./routes/residencies');
var genders = require('./routes/genders');
var awards = require('./routes/awards');
var advancedStandings = require('./routes/advancedStandings');


app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

// Shut off logging if testing
if (process.env.NODE_ENV !== 'test') {
    app.use(logger);
}
//app.use(express.static('public'));

// Set json header
app.use((req, res, next)=>{res.setHeader('Content-Type', 'application/json'); next();});

app.use('/students', students);
app.use('/residencies', residencies);
app.use('/genders', genders);
app.use('/awards', awards);
app.use('/advancedStandings', advancedStandings);


app.listen(3700, function () {
    console.log('Listening on port 3700');
});

module.exports = app;   // For supporting tests