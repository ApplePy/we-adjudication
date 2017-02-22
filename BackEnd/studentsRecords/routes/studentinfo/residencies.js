var Residencies = require('../../models/schemas/studentinfo/residencySchema');
var Students = require('../../models/schemas/studentinfo/studentSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        Residencies,
        'residency',
        false,
        (req, res, mod) => {
            if (!mod.name)
                return ["name must be specified"];
            else
                return 0
        },
        undefined,
        undefined,
        undefined,
        (request, response, next) => {
            // Map all affected students to null
            Students.update(
                {resInfo: request.params.mongo_id},
                {$set: {resInfo: null}},
                {multi: true},
                function (error, students) {
                    if (error) response.status(500).send({error: error});
                    else {
                        // All students mapped successfully, delete residency
                        next();
                    }
                });
        },
        undefined
    );
