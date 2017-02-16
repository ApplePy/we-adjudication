/**
 * Created by darryl on 2017-02-13.
 */

var HSCourses = require('../../models/schemas/highschool/hsCourseSchema');
var HSGrades = require('../../models/schemas/highschool/hsGradeSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        HSCourses,
        'hsCourse',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        (req, res, deleted) => {
            // Delete associated grades
            HSGrades.remove({course: deleted._id});
        }
    );
