let Genders = require('../../models/schemas/studentinfo/genderSchema');
let Students = require('../../models/schemas/studentinfo/studentSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;

module.exports =
    new Route(
        Genders,
        'gender',
        false,
        new PropertyValidator("name"),
        undefined,
        undefined,
        undefined,
        new MapToNull(Students, "genderInfo"),
        undefined
    );
