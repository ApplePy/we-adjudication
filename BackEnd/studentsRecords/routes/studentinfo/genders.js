var Genders = require('../../models/schemas/studentinfo/genderSchema');
var Students = require('../../models/schemas/studentinfo/studentSchema');
var Setup = require('../genericRouting');

module.exports =
    Setup(
        Genders,
        'gender',
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
        (req, res, next) => {
            // Map all affected students to null
            Students.update(
                {genderInfo: req.params.mongo_id},
                {$set: {genderInfo: null}},
                {multi: true},
                function (error, students) {
                    if (error) res.status(500).send({error: error});
                    else {
                        // All students mapped successfully, delete residency
                        next();
                    }
                });
        },
        undefined
    );
