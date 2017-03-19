/**
 * Created by darryl on 2017-02-13.
 */

let HSSubjects = require('../../models/schemas/highschool/hsSubjectSchema');
let HSCourses = require('../../models/schemas/highschool/hsCourseSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        HSSubjects,
        'hsSubject',
        false,
        new PropertyValidator("name", "description"),
        undefined,
        undefined,
        undefined,
        new MapToNull(HSCourses, "subject"),
        undefined
    );
