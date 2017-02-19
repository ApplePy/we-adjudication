/**
 * Created by darryl on 2017-02-13.
 */

var Grades = require('../../models/schemas/uwocourses/gradeSchema');
var CourseCodes = require('../../models/schemas/uwocourses/courseCodeSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        Grades,
        'grade',
        true,
        (req, res, mod) => {
            if (!mod.mark)
                return ["Mark must be specified"];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Map all affected courses to null
            CourseCodes.update(
                {gradeInfo: req.params.mongo_id},
                {$set: {gradeInfo: null}},
                {multi: true},
                function (error, courses) {
                    if (error) res.status(500).send({error: error});
                    else {
                        // All courses mapped successfully, delete grade
                        next();
                    }
                });
        },
        undefined
    );
