/**
 * Created by darryl on 2017-02-13.
 */

var ProgramStatuses = require('../../models/schemas/uwocourses/programStatusSchema');
var ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        ProgramStatuses,
        'programStatus',
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Map all affected program records to null status
            ProgramRecords.update(
                {status: req.params.mongo_id},
                {$set: {status: null}},
                {multi: true},
                function (error, records) {
                    if (error) res.status(500).send({error: error});
                    else {
                        // All records mapped successfully, delete residency
                        next();
                    }
                });
        },
        undefined
    );
