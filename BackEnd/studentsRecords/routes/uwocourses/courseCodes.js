/**
 * Created by darryl on 2017-02-13.
 */

let CourseCodes = require('../../models/schemas/uwocourses/courseCodeSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;


module.exports =
    new Route(
        CourseCodes,
        'courseCode',
        true,
        new PropertyValidator("courseNumber", "courseLetter"),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
