var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')

    // New award entry
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var award = new models.Awards(request.body.award);
        award.save(function (error) {
            if (error) response.send(error);
            response.json({award: award});
        });
    })

    // Get awards
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        if (!Student) {
            models.Awards.find(function (error, residencies) {
                if (error) response.send(error);
                response.json({award: residencies});
            });
        } else {
            models.Awards.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({award: students});
            });
        }
    });

router.route('/:award_id')
    // Get award by id
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Awards.findById(request.params.award_id, function (error, award) {
            if (error) response.send(error);
            response.json({award: award});
        })
    })

    // Update award
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Awards.findById(request.params.award_id, function (error, award) {
            if (error) {
                response.send({error: error});
            }
            else {
                award.name = request.body.award.name;
                award.students = request.body.award.students;

                award.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({award: award});
                    }
                });
            }
        })
    });

module.exports = router;
