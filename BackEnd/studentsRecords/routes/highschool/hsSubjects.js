/**
 * Created by darryl on 2017-02-13.
 */

var HSSubjects = require('../../models/schemas/highschool/hsSubjectSchema');
var HSCourses = require('../../models/schemas/highschool/hsCourseSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        HSSubjects,
        'hsSubject',
        false,
        (req, res, model) => {
            if (!model.name)
                return ["A subject name must be specified"];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Remap course subjects to null
            HSCourses.update(
                {subject: req.params.mongo_id},
                {$set: {subject: null}},
                {multi: true},
                function (error, courses) {
                    if (error) res.status(500).send({error: error});
                    // All courses mapped successfully, delete source
                    else next();
                }
            );
        },
        undefined
    );
