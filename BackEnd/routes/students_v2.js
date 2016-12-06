"use strict";

let express = require('express');
let router = express.Router();
let models = require('../models/studentDB');


router.route('/')

    // Get all students, sorted ascending by studentNo
    .get(function (request, response) {

        if (request.query.filter) {
            if (request.query.filter.after)
                return getAdjacentRecord(request, response, request.query.filter.after, "$gt");
            else if (request.query.filter.before)
                return getAdjacentRecord(request, response, request.query.filter.before, "$lt");
            else
                return response.status(400).send("Bad parameter.");
        }

        models.Student
            .find({})
            .sort({studentNo: 1})
            .then(
                results => response.send(convertList(results)),
                err => response.status(500).send("Unable to retrieve all students. Error: " + err)
            );
    })

    // Create and save new student info
    .post(function (req, response) {

        if (!checkValidity(sanitize(req.body.student.firstName), "string") ||
            !checkValidity(sanitize(req.body.student.lastName), "string") ||
            !checkValidity(req.body.student.dob, "string", /\d{4}-\d{2}-\d{2}/))        //Does not do a good job
            return response.status(400).send("Missing or invalid parameter.");

        let student = {};
        // TODO: Control studentNo length
        student.studentNo = parseInt(req.body.student.studentNo);
        student.firstName = sanitize(req.body.student.firstName);
        student.lastName = sanitize(req.body.student.lastName);
        student.dob = req.body.student.dob;
        student.residency = parseInt(req.body.student.residency);
        student.gender = Boolean(req.body.student.gender);

        models.Student
            .create(student)
            .then(
                success => response.status(201).location(req.originalUrl).send(convertObj(success)),
                error => response.status(500).send("Error saving student. Error: " + error)
            );
    });


//Get the first student
router.get('/first', function (request, response) {
    //Order studentNO ascending and take the first student
    models.Student.find({}).sort({studentNo: 1}).limit(1).then(
        students => {
            if (students.length > 0) {
                response.send(convertObj(students[0]))
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
                response.send(convertObj(students[0]))
            } else {
                response.status(404).send("No last student found.");
            }
        },
        err => response.status(500).send("Last student error.")
    );
});


// TODO: Control studentNo length
router.route('/:studentNo')

    //Get student
    .get(function (request, response) {
        let studentNo = request.params.studentNo;

        models.Student
            .find({studentNo: studentNo})
            .then(
                results => {
                    if (results.length > 0) response.send(convertObj(results[0]));
                    else response.status(404).send("Student " + studentNo + " not found.");
                },
                err => response.status(500).send("Unable to retrieve student " + studentNo + ". Error: " + err)
            );
    })


    // Save new student info (create new student if required)
    .put(function (req, response) {

        // Check incoming data
        if (!checkValidity(sanitize(req.body.student.firstName), "string") ||
            !checkValidity(sanitize(req.body.student.lastName), "string") ||
            !checkValidity(req.body.student.dob, "string", /\d{4}-\d{2}-\d{2}/))    // Does not do good job
            return response.status(400).send("Missing or invalid parameter.");

        let student = {};
        student.studentNo = parseInt(req.params.studentNo);
        student.firstName = sanitize(req.body.student.firstName);
        student.lastName = sanitize(req.body.student.lastName);
        student.dob = req.body.student.dob;
        student.residency = parseInt(req.body.student.residency);
        student.gender = Boolean(req.body.student.gender);


        models.Student
            .update({studentNo: student.studentNo}, student, {upsert: true, setDefaultsOnInsert: true, overwrite: true})
            .then(
                success => response.status(201).location(req.originalUrl).send(),
                error => response.status(500).send("Error saving student. Error: " + error)
            );
    })

    // Delete student
    .delete(function(req, response) {
        response.sendStatus(403);
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
        .replace(/&(?![A-Za-z#]{2,4};)/g, '&amp;')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;');
}


/** Convert a list of mongo results to "ember format".
 *
 * @param data      The array to change.
 * @returns {{students: Array}}
 */
function convertList(data) {
    let newResults = [];

    // Convert the mongoose object to a regular object, and update the data to be Ember-friendly
    data.forEach((piece, index, theArray) => {
        let part = piece.toObject();
        part.id = part.studentNo;
        delete part._id;
        newResults.push(part);
    });

    return {'students': newResults};
}


/** Convert a single mongo result to "ember format"
 *
 * @param data      The data object to change
 * @returns {{student: Object}}
 */
function convertObj(data) {
    // Convert the mongoose object to a regular object, and update the data to be Ember-friendly
    let part = data.toObject();
    part.id = part.studentNo;
    delete part._id;

    return {'student': part};
}


function getAdjacentRecord(request, response, studentNum, filter) {
    let studentNo = parseInt(studentNum);

    //Get all student numbers greater(or less than) than the current studentNo and order ascending
    let filterParams = {studentNo: {}};

    filterParams.studentNo[filter] = studentNo;

    models.Student.find(filterParams).sort({studentNo: 1}).limit(1).then(
        students => {
            if (students.length > 0) {
                response.send(convertObj(students[0]))
            } else {
                response.status(404).send("No adjacent student found.");
            }
        },
        err => response.status(500).send("Adjacent student error.")
    );
}
