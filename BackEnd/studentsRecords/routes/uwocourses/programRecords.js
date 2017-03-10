/**
 * Created by darryl on 2017-02-13.
 */

var ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
var Terms = require('../../models/schemas/uwocourses/termSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        ProgramRecords,
        'programRecord',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Map all affected term codes to null
            Terms.update(
                {programRecords: {$in: [req.params.mongo_id]}},
                {$pull: {programRecords: req.params.mongo_id}},
                {multi: true},
                function (error) {
                    if (error) res.status(500).send({error: error});
                    else {
                        // All courses mapped successfully, delete grade
                        next();
                    }
                });
        },
        undefined
    );
