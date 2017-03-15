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
        (req, res, model) => {
            let list = [];
            if (!model.level)
                list.push("Course level must be specified.");
            if (typeof model.unit !== "number")
                list.push("Course unit must be specified.");
            if (list.length > 0)
                return list;
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        undefined,
        (req, res, deleted) => {
            // Delete associated grades
            HSGrades.remove({course: deleted._id}, err => {});
        }
    );
