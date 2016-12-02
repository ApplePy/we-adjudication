"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models/studentDB');

router.route('/')
    // TODO: Get all students
    .get(function (request, response) {
            models.Student.find(function (error, posts) {
                if (error) response.send(error);
                response.json({post: posts});
            });
    })
    .get('/first', function(request, response) {
        models.Student.sort({studentNo: 1}).limit(1).then(
            students => {
                if (students.length > 0) {
                    response.send(students[0])
                } else {
                    response.status(404).send("No first student found.");
                }
            },
            err => response.status(500).send("First student error.")
        );
    })
    .get('/last', function(request, response) {
        models.Student.sort({studentNo: -1}).limit(1).then(
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
    // TODO: Get students
    .get(function (request, response) {
        models.Student.findById(request.params.post_id, function (error, post) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({post: post});
            }
        });
    })
    // TODO: Save new student info
    .put(function (request, response) {
        models.Student.findById(request.params.post_id, function (error, post) {
            if (error) {
                response.send({error: error});
            }
            else {
                post.title = request.body.post.title;
                post.body = request.body.post.body;
                post.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({post: post});
                    }
                });
            }
        });
    })
    .get('/next', function (request, response) {

        let studentNo = request.params.studentNo;

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

    })
    .get('/previous', function(request, response) {

        let studentNo = request.params.studentNo;

        models.Student.find({studentNo: {$gt: studentNo}}).sort({studentNo: -1}).limit(1).then(
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