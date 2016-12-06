"use strict";

let express = require('express');
let router = express.Router();
let models = require('../models/studentDB');


router.route('/')

    // Get all students, sorted ascending by studentNo
    .get(function (request, response) {
        models.Student
            .find({})
            .sort({studentNo: 1})
            .then(
                results => {
                    let newResults = [];

                    // Convert the mongoose object to a regular object, and update the data to be Ember-friendly
                    results.forEach((piece, index, theArray) => {
                        let part = piece.toObject();
                        part.id = part.studentNo;
                        delete part._id;
                       newResults.push(part);
                    });

                    // Send new results
                    response.send({"students": newResults});
                },
                err => response.status(500).send("Unable to retrieve all students. Error: " + err)
            );
    });

//Get the first student
router.get('/first', function (request, response) {
    //Order studentNO ascending and take the first student
    models.Student.find({}).sort({studentNo: 1}).limit(1).then(
        students => {
            if (students.length > 0) {
                response.send(students[0])
            } else {
                response.status(404).send("No first student found.");
            }
        },
        err => response.status(500).send("First student error.")
    );
});


//Get the last student
router.get('/last', function (request, response) {
    //Order studentNo descending and take the last student
    models.Student.find({}).sort({studentNo: -1}).limit(1).then(
        students => {
            if (students.length > 0) {
                response.send(students[0])
            } else {
                response.status(404).send("No last student found.");
            }
        },
        err => response.status(500).send("Last student error.")
    );
});


router.route('/:studentNo')


//Get student
    .get(function (request, response) {
        let studentNo = request.params.studentNo;
        models.Student
            .find({studentNo: studentNo})
            .then(
                results => {
                    if (results.length > 0) response.send(results[0]);
                    else response.status(404).send("Student " + studentNo + " not found.");
                },
                err => response.status(500).send("Unable to retrieve student " + studentNo + ". Error: " + err)
            );
    })


    // Save new student info (create new student if required)
    .put(function (req, response) {

        if (!checkValidity(sanitize(req.body.firstName), "string") || !checkValidity(sanitize(req.body.lastName), "string") || !checkValidity(req.body.dob, "string", /(\d{2}\/){2}\d{4}/))
            return response.status(400).send("Missing or invalid parameter.");

        let student = {};
        student.studentNo = parseInt(req.params.studentNo);
        student.firstName = req.body.firstName;
        student.lastName = req.body.lastName;
        student.dob = req.body.dob;
        student.native = Boolean(req.body.native);
        student.gender = Boolean(req.body.gender);


        models.Student
            .update({studentNo: student.studentNo}, student, {upsert: true, setDefaultsOnInsert: true, overwrite: true})
            .then(
                success => response.status(201).location(req.originalUrl).send(),
                error => response.status(500).send("Error saving student. Error: " + error)
            );
    });

//Get the next student given a current studentNo
router.get('/:studentNo/next', function (request, response) {
    let studentNo = request.params.studentNo;
    //Get all student numbers greater than the current studentNo and order ascending
    //Take the first studentNo
    models.Student.find({studentNo: {$gt: studentNo}}).sort({studentNo: 1}).limit(1).then(
        students => {
            if (students.length > 0) {
                response.send(students[0])
            } else {
                response.status(404).send("No next student found.");
            }
        },
        err => response.status(500).send("Next student error.")
    );
});

//Get the prevous student given a current studentNo
router.get('/:studentNo/previous', function (request, response) {
    let studentNo = request.params.studentNo;

    //Get all the student numbers less than the current studentNO and order descending
    //Take the first studentNo
    models.Student.find({studentNo: {$lt: studentNo}}).sort({studentNo: -1}).limit(1).then(
        students => {
            if (students.length > 0) {
                response.send(students[0])
            } else {
                response.status(404).send("No previous student found.");
            }
        },
        err => response.status(500).send("Previous student error.")
    );
});

module.exports = router;


// ---- HELPERS ---- //

/** Check the validity of a variable based on it's type and an optional regex.
 *
 * @param variable      The variable to check
 * @param type          The type the variable is expected to be.
 * @param regex         (Optional) the regex to be used to test strings (an object will do, as long as it implements .test(variable)
 * @returns {boolean}   Returns validity
 */
function checkValidity(variable, type, regex) {
    if (typeof variable != type) return false;
    if (type === "boolean") return true;
    if (type === "string" && regex) return regex.test(variable);
    return Boolean(variable);
}


/** Sanitizes a string. Is idempotent.
 *
 * @param str           The string to sanitize.
 * @returns {string}    Returns the sanitized string.
 */
function sanitize(str) {
    if (typeof str != "string") throw new Error("Input is not a string!");
    return str
        .replace(/&(?!amp;)/g, '&amp;')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;');
}
