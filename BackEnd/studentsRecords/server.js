
var express = require('express');
var logger = require('./logger');
var app = express();

var students = require('./routes/studentinfo/students');
var residencies = require('./routes/studentinfo/residencies');
var genders = require('./routes/studentinfo/genders');
var awards = require('./routes/studentinfo/awards');
var advancedStandings = require('./routes/studentinfo/advancedStandings');
var hsGrades = require('./routes/highschool/hsGrades');
var hsCourses = require('./routes/highschool/hsCourses');
var hsCourseSources = require('./routes/highschool/hsCourseSources');
var secondarySchools = require('./routes/highschool/secondarySchools');
var hsSubjects = require('./routes/highschool/hsSubjects');
var termCodes = require('./routes/uwocourses/termCodes');
var terms = require('./routes/uwocourses/terms');
var grades = require('./routes/uwocourses/grades');
var courseCodes = require('./routes/uwocourses/courseCodes');
var courseLoads = require('./routes/uwocourses/courseLoads');
var programStatuses = require('./routes/uwocourses/programStatuses');
var programRecords = require('./routes/uwocourses/programRecords');
var planCodes = require('./routes/uwocourses/planCodes');


app.use(function (request, response, next) {
    // Leave the dual server system in place for everything except production
    if (process.env.NODE_ENV !== 'production') {
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    }
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});

// Shut off logging if testing
if (process.env.NODE_ENV !== 'test') {
    app.use(logger);
}

// Set API namespace
var api = express.Router();
app.use('/api', api);

// Set json header and API routes
api.use((req, res, next)=>{res.setHeader('Content-Type', 'application/json'); next();});
api.use('/students', students);
api.use('/residencies', residencies);
api.use('/genders', genders);
api.use('/awards', awards);
api.use('/advancedStandings', advancedStandings);
api.use('/hsGrades', hsGrades);
api.use('/hsCourses', hsCourses);
api.use('/hsCourseSources', hsCourseSources);
api.use('/secondarySchools', secondarySchools);
api.use('/hsSubjects', hsSubjects);
api.use('/termCodes', termCodes);
api.use('/terms', terms);
api.use('/grades', grades);
api.use('/courseCodes', courseCodes);
api.use('/courseLoads', courseLoads);
api.use('/programStatuses', programStatuses);
api.use('/programRecords', programRecords);
api.use('/planCodes', planCodes);

// Set default serve
if (process.env.NODE_ENV === 'production') app.use(express.static('dist'));

// Port to listen on
var port = 3700;

// Change port to 80 in production
if (process.env.NODE_ENV === 'production') port = 80;

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

module.exports = app;   // For supporting tests