/**
 * Created by darryl on 2017-02-13.
 */

var PlanCodes = require('../../models/schemas/uwocourses/planCodeSchema');
var ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        PlanCodes,
        'planCode',
        false,
        (req, res, model) => {
            if (!model.name)
                return ["A name must be specified"];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        (req, res, next) => {
            // Remove plan from affected Program Records
            ProgramRecords.update(
                {plan: {$in: [req.params.mongo_id]}},
                {$pull: {plan: req.params.mongo_id}},
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
