/**
 * Created by darryl on 2017-02-13.
 */

var CourseCodes = require('../../models/schemas/uwocourses/courseCodeSchema');
var ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        CourseCodes,
        'course-code',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Map all affected program records to null
            ProgramRecords.update(
                {courseInfo: req.params.mongo_id},
                {$set: {courseInfo: null}},
                {multi: true},
                function (error, records) {
                    if (error) res.status(500).send({error: error});
                    else {
                        // All program records mapped successfully, continue deletion
                        next();
                    }
                });
        },
        undefined
    );
