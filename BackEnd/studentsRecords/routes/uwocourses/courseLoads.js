/**
 * Created by darryl on 2017-02-13.
 */

var CourseLoads = require('../../models/schemas/uwocourses/courseLoadSchema');
var ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
var Setup = require('./../genericRouting');


module.exports =
    Setup(
        CourseLoads,
        'courseLoad',
        false,
        (req, res, mod) => {
            if (!mod.load)
                return ["Load name must be specified"];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Map all affected program records to null
            ProgramRecords.update(
                {load: req.params.mongo_id},
                {$set: {load: null}},
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
