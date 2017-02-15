var express = require('express');
var router = express.Router();
var Students = require('../models/schemas/studentinfo/studentSchema');
var Awards = require('../models/schemas/studentinfo/awardSchema');
var AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();


router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var student = new Students(request.body.student);
        student.save(function (error) {
            if (error) response.status(500).send(error);
            else response.status(201).json({student: student});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var l = parseInt(request.query.limit) ;
        var o = parseInt(request.query.offset);

        if (!request.query.filter) {
            Students.paginate({}, { offset: o, limit: l },
                function (error, students) {
                    if (error) response.status(500).send(error);
                    else response.json({student: students.docs});
                });
        } else {
            var StudentNo = request.query.filter.number;
            Students.find({number: StudentNo}, function (error, students) {
                if (error) response.status(500).send(error);
                else response.json({student: students});
            });
        }
    });

router.route('/:student_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Students.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                response.json({student: student});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Students.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                student.number = request.body.student.number;
                student.firstName = request.body.student.firstName;
                student.lastName = request.body.student.lastName;
                student.genderInfo = request.body.student.genderInfo;
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
                        response.status(500).send({error: error});
                    }
                    else {
                        response.json({student: student});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Students.findByIdAndRemove(request.params.student_id,
            function (error, deleted) {
                if (!error) {
                    // Delete all awards associated with student
                    Awards.remove({recipient: deleted._id}, (err, removed) => {
                        // Delete all advanced standings associated with student
                        AdvancedStandings.remove({recipient: deleted._id}, (err2, removed2) => {
                            response.json({student: deleted});
                        });
                    });
                }
            }
        );
    });

module.exports = router;
