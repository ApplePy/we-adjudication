/**
 * Created by darryl on 2017-02-13.
 */

let HSCourseSources = require('../../models/schemas/highschool/hsCourseSourceSchema');
let HSCourses = require('../../models/schemas/highschool/hsCourseSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        HSCourseSources,
        'hsCourseSource',
        false,
        new PropertyValidator("code"),
        undefined,
        undefined,
        undefined,
        new MapToNull(HSCourses, "source"),
        undefined
    );
