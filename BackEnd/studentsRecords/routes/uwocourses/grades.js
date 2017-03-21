/**
 * Created by darryl on 2017-02-13.
 */

let Grades = require('../../models/schemas/uwocourses/gradeSchema');
let CourseCodes = require('../../models/schemas/uwocourses/courseCodeSchema');
let Route = require('../genericRouting').Route;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        Grades,
        'grade',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        new MapToNull(CourseCodes, "gradeInfo"),
        undefined
    );
