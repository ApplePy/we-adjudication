"use strict";

let express = require('express');
let router = express.Router();
let models = require('../models/studentDB');

router.route('/')


    // Get all students
    .get(function (request, response) {
            models.Student
                .find({})
                .then(
                    results => response.send(results),
                    err => response.status(500).send("Unable to retrieve all students. Error: " + err)
                );
    });


router.get('/first', function(request, response) {

    });


router.get('/last', function(request, response) {

    });



router.route('/:studentNo')


    //Get student
    .get(function (request, response) {
        let studentNo = request.params.studentNo;
        models.Student
            .find({studentNo: studentNo})
            .then(
                results => {
                    if (results.length > 1) response.send(results);
                    else response.status(404).send("Student " + studentNo + " not found.");
                },
                err => response.status(500).send("Unable to retrieve student " + studentNo + ". Error: " + err)
            );
    })


    // Save new student info (create new student if required)
    .put(function (req, response) {

        if (!checkValidity(req.body.firstName, "string") ||
            !checkValidity(req.body.lastName, "string") ||
            !checkValidity(req.body.dob, "string") ||
            !checkValidity(req.body.native, "boolean") ||
            !checkValidity(req.body.gender, "boolean"))
            return response.status(400).send("Missing or invalid parameter.");

        let student = {};
        student.studentNo   = parseInt(req.params.studentNo);
        student.firstName   = req.body.firstName;
        student.lastName    = req.body.lastName;
        student.dob         = req.body.dob;
        student.native      = Boolean(req.body.native);
        student.gender      = Boolean(req.body.gender);


        models.Student
            .update({studentNo: studentNo}, student, {upsert: true, setDefaultsOnInsert: true, overwrite: true})
            .then(
                success => response.status(201).location(req.originalUrl),
                error => response.status(500).send("Error saving student. Error: " + error)
            );
    });


router.get('/:studentNo/next', function (request, response) {

    });


router.get('/:studentNo/previous', function(request, response) {

    });

module.exports = router;


// ---- HELPERS ---- //

function checkValidity(variable, type) {
    if (typeof variable != type) return false;
    if (type === "boolean") return true;
    return Boolean(variable);
}
