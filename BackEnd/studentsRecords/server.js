
let express = require('express');
let path = require('path');
let logger = require('./logger');
let app = express();

let students = require('./routes/studentinfo/students');
let residencies = require('./routes/studentinfo/residencies');
let genders = require('./routes/studentinfo/genders');
let awards = require('./routes/studentinfo/awards');
let advancedStandings = require('./routes/studentinfo/advancedStandings');
let hsGrades = require('./routes/highschool/hsGrades');
let hsCourses = require('./routes/highschool/hsCourses');
let hsCourseSources = require('./routes/highschool/hsCourseSources');
let secondarySchools = require('./routes/highschool/secondarySchools');
let hsSubjects = require('./routes/highschool/hsSubjects');
let termCodes = require('./routes/uwocourses/termCodes');
let terms = require('./routes/uwocourses/terms');
let grades = require('./routes/uwocourses/grades');
let courseCodes = require('./routes/uwocourses/courseCodes');
let courseLoads = require('./routes/uwocourses/courseLoads');
let programStatuses = require('./routes/uwocourses/programStatuses');
let programRecords = require('./routes/uwocourses/programRecords');
let planCodes = require('./routes/uwocourses/planCodes');
let adjudications = require('./routes/uwoadjudication/adjudications');
let assessmentCodes = require('./routes/uwoadjudication/assessmentCodes');
let departments = require('./routes/uwoadjudication/departments');
let faculties = require('./routes/uwoadjudication/faculties');
let logicalExpressions = require('./routes/uwoadjudication/logicalExpressions');
let programAdministrations = require('./routes/uwoadjudication/programAdministrations');
let logins = require('./routes/authentication/logins');
let passwords = require('./routes/authentication/passwords');
let roleCodes = require('./routes/authentication/roleCodes');
let rolePermissions = require('./routes/authentication/rolePermissions');
let roots = require('./routes/authentication/roots');
let userRoles = require('./routes/authentication/userRoles');
let users = require('./routes/authentication/users');


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
let api = express.Router();
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
api.use('/adjudications', adjudications);
api.use('/assessmentCodes', assessmentCodes);
api.use('/departments', departments);
api.use('/faculties', faculties);
api.use('/logicalExpressions', logicalExpressions);
api.use('/programAdministrations', programAdministrations);

//For authentication
api.use('/users', users);
api.use('/passwords', passwords);
api.use('/roleCodes', roleCodes);
api.use('/userRoles', userRoles);
api.use('/rolePermissions', rolePermissions);
api.use('/logins', logins);
api.use('/roots', roots);

app.use("/favicon.ico", (req, res) => res.sendFile(path.join(__dirname+'/assets','favicon.ico')));

// Set default serve
if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static('dist'));
    app.get('/*', (req, res) => res.sendFile(path.join(__dirname+'/dist','index.html')));
}

// Function to handle client errors
app.use(function(req, res, next) {
    res.sendStatus(404);
});

// Base error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
});

// Port to listen on
let port = 3700;

// Change port to 80 in production
if (process.env.NODE_ENV === 'production') port = 80;

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

module.exports = app;   // For supporting tests