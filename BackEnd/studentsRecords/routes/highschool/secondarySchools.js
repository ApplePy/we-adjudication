/**
 * Created by darryl on 2017-02-13.
 */

let SecondarySchools = require('../../models/schemas/highschool/secondarySchoolSchema');
let HSCourses = require('../../models/schemas/highschool/hsCourseSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        SecondarySchools,
        'secondarySchool',
        true,
        new PropertyValidator("name"),
        undefined,
        undefined,
        undefined,
        new MapToNull(HSCourses, "school"),
        undefined
    );
