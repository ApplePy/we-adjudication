var Residencies = require('../../models/schemas/studentinfo/residencySchema');
var Students = require('../../models/schemas/studentinfo/studentSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        Residencies,
        'residency',
        false,
        undefined,
        (request, response, filter) => {
            // A query was submitted for the residency of a student
            if (filter.student) {
                Students.findById(filter.student, function (error, student) {
                    if (error || student == null) response.status(404).send(error);
                    else {
                        Residencies.findById(student.resInfo, function (error, res) {
                            if (error) response.status(404).send(error);
                            response.json({residency: res});
                        });
                    }
                });
            }

            // A query was submitted for a specific residency name
            else if (filter.name) {
                Residencies.find({"name": filter.name}, function (error, students) {
                    if (error) response.status(500).send(error);
                    else response.json({residency: students});
                });
            }
        },
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
