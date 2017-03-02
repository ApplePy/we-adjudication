/**
 * Created by darryl on 2017-02-13.
 */

var SecondarySchools = require('../../models/schemas/highschool/secondarySchoolSchema');
var HSCourses = require('../../models/schemas/highschool/hsCourseSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        SecondarySchools,
        'secondarySchool',
        true,
        (req, res, model) => {
            if (!model.name)
                return ["A school name must be specified"];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Remap course school to null
            HSCourses.update(
                {school: req.params.mongo_id},
                {$set: {school: null}},
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
