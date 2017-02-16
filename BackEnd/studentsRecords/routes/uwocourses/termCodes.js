/**
 * Created by darryl on 2017-02-13.
 */

var TermCodes = require('../../models/schemas/uwocourses/termCodeSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        TermCodes,
        'termCode',
        false,
        (req, res, mod) => {
            if (!mod.name)
                return ["Term name must be specified"];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Map all affected program records to null status
            ProgramRecords.update(
                {semester: req.params.mongo_id},
                {$set: {semester: null}},
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
