let Departments = require('../../models/schemas/uwoadjudication/departmentSchema');
let ProgramAdministrations = require('../../models/schemas/uwoadjudication/programAdministrationSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        Departments,
        'department',
        false,
        new PropertyValidator("name"),
        undefined,
        undefined,
        undefined,
        new MapToNull(ProgramAdministrations, "department"),
        undefined
    );
