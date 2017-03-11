let ProgramAdministrations = require('../../models/schemas/uwoadjudication/programAdministrationSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;


module.exports =
    new Route(
        ProgramAdministrations,
        'programAdministration',
        false,
        new PropertyValidator("name", "position"),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
