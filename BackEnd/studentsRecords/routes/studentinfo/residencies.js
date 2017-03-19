let Residencies = require('../../models/schemas/studentinfo/residencySchema');
let Students = require('../../models/schemas/studentinfo/studentSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        Residencies,
        'residency',
        false,
        new PropertyValidator("name"),
        undefined,
        undefined,
        undefined,
        new MapToNull(Students, "resInfo"),
        undefined
    );
