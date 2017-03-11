var Faculties = require('../../models/schemas/uwoadjudication/facultySchema');
var Departments = require('../../models/schemas/uwoadjudication/departmentSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        Faculties,
        'faculty',
        false,
        (req, res, mod) => {
            let results = [];

            // Check that the needed properties exist
            if (!mod.name)
                results.push("Faculty name must be specified.");

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
            Departments.update(
                {faculty: request.params.mongo_id},
                {$set: {faculty: null}},
                {multi: true},
                function (error, departments) {
                    if (error) response.status(500).send({error: error});
                    else {
                        // All departments mapped successfully, delete residency
                        next();
                    }
                });
        },
        undefined
    );
