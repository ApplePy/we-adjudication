/**
 * Created by darryl on 2017-02-13.
 */

let HSCourses = require('../../models/schemas/highschool/hsCourseSchema');
let HSGrades = require('../../models/schemas/highschool/hsGradeSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;


module.exports =
    new Route(
        HSCourses,
        'hsCourse',
        true,
        new PropertyValidator("level", "unit"),
        undefined,
        undefined,
        undefined,
        undefined,
        (req, res, deleted) => {
            // Delete associated grades
            HSGrades.remove({course: deleted._id}, () => {});
        }
    );
