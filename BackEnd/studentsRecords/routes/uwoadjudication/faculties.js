let Faculties = require('../../models/schemas/uwoadjudication/facultySchema');
let Departments = require('../../models/schemas/uwoadjudication/departmentSchema');
let AssessmentCodes = require('../../models/schemas/uwoadjudication/assessmentCodeSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        Faculties,
        'faculty',
        false,
        new PropertyValidator("name"),
        undefined,
        undefined,
        undefined,
        [new MapToNull(Departments, "faculty"), new MapToNull(AssessmentCodes, "faculty")],
        undefined
    );
