var Departments = require('../../models/schemas/uwoadjudication/departmentSchema');
var ProgramAdministrations = require('../../models/schemas/uwoadjudication/programAdministrationSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        Departments,
        'department',
        false,
        (req, res, mod) => {
            let results = [];

            // Check that the needed properties exist
            if (!mod.name)
                results.push("Department's name must be specified.");

            if (results !== [])
                return results;
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        (request, response, next) => {
            // Map all affected students to null
            ProgramAdministrations.update(
                {department: request.params.mongo_id},
                {$set: {department: null}},
                {multi: true},
                function (error, administrators) {
                    if (error) response.status(500).send({error: error});
                    else {
                        // All administrators mapped successfully, delete residency
                        next();
                    }
                });
        },
        undefined
    );
