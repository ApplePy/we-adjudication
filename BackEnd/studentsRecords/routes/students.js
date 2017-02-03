var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

// TODO: WARNING: PUT/POST does not check for missing data
// TODO: Also, residencies/awards/standings and students are not properly linked both ways

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var student = new models.Students(request.body.student);
        student.save(function (error) {
            if (error) response.send(error);
            response.status(201).json({student: student});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var l = parseInt(request.query.limit) ;
        var o = parseInt(request.query.offset);

        if (!request.query.filter) {
            //models.Students.find(function (error, students) {
            //    if (error) response.send(error);
            //    response.json({student: students});
            //});
            models.Students.paginate({}, { offset: o, limit: l },
                function (error, students) {
                    if (error) response.send(error);
                    response.json({student: students.docs});
                });
        } else {
            var StudentNo = request.query.filter.number;
            // TODO: This causes a deprecation warning from Ember, should not return an array
            models.Students.find({number: StudentNo}, function (error, students) {
                if (error) response.send(error);
                response.json({student: students});
            });
        }
    });

router.route('/:student_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Students.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                response.json({student: student});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Students.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                student.number = request.body.student.number;
                student.firstName = request.body.student.firstName;
                student.lastName = request.body.student.lastName;
                student.gender = request.body.student.gender;
                student.DOB = request.body.student.DOB;
                student.photo = request.body.student.photo;
                student.resInfo = request.body.student.resInfo;
                student.registrationComments = request.body.student.registrationComments;
                student.basisOfAdmission = request.body.student.basisOfAdmission;
                student.admissionAverage = request.body.student.admissionAverage;
                student.admissionComments = request.body.student.admissionComments;
                student.awards = request.body.student.awards;
                student.advancedStandings = request.body.student.advancedStandings;

                student.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({student: student});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.Students.findByIdAndRemove(request.params.student_id,
            function (error, deleted) {
                if (!error) {
                    response.json({student: deleted});
                }
            }
        );
    });

module.exports = router;
