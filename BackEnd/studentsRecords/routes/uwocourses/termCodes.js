/**
 * Created by darryl on 2017-02-13.
 */

var TermCodes = require('../../models/schemas/uwocourses/termCodeSchema');
var Terms = require('../../models/schemas/uwocourses/termSchema');
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
        (request, response, next) => {
            // Map all affected students to null
            Terms.update(
                {termCode: request.params.mongo_id},
                {$set: {termCode: null}},
                {multi: true},
                function (error, terms) {
                    if (error) response.status(500).send({error: error});
                    else {
                        // All students mapped successfully, delete residency
                        next();
                    }
                });
        },
        undefined
    );
