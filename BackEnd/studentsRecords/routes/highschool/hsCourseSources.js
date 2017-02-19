/**
 * Created by darryl on 2017-02-13.
 */

var HSCourseSources = require('../../models/schemas/highschool/hsCourseSourceSchema');
var HSCourses = require('../../models/schemas/highschool/hsCourseSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        HSCourseSources,
        'hsCourseSource',
        false,
        (req, res, model) => {
            if (!model.code)
                return ["Source code must be specified."];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Remap course sources to null
            HSCourses.update(
                {source: req.params.mongo_id},
                {$set: {source: null}},
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
