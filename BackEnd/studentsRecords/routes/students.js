var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var student = new models.Students(request.body.student);
        student.save(function (error) {
            if (error) response.send(error);
            response.json({student: student});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var l = parseInt(request.query.limit) ;
        var o = parseInt(request.query.offset);
        try {
            var StudentNo = request.query.filter.number;
            console.log(request.query.filter);
            console.log(request.query.filter.number);
        }
        catch (err) {
            // TODO: Fix this, dirty hack
        }
        if (!StudentNo) {
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
            //        if (Student == "residency")
            console.log('in here');
            models.Students.findOne({number: StudentNo}, function (error, students) {
                if (error) response.send(error);
                console.log(students);
                response.json({student: students});
            });
        }
    });

router.route('/:student_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        //models.Students.findById(request.params.student_id, function (error, student)
        console.log("params id: " + request.params.student_id);
        models.Students.findOne({'number': request.params.student_id}, function (error, student)
        {
        console.log('hello world');
            if (error) {
                console.log("error!");
                response.send({error: error});
            }
            else {
                console.log({student: student});
                response.json({student: student});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Students.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send({error: error});
            }
            else {
                student.number = request.body.student.number;
                student.firstName = request.body.student.firstName;
                student.lastName = request.body.student.lastName;
                student.gender = request.body.student.gender;
                student.DOB = request.body.student.DOB;
                student.photo = request.body.student.photo;
                student.resInfo = request.body.student.resInfo;

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
