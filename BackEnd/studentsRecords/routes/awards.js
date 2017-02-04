var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

// TODO: WARNING: PUT/POST does not check for missing data

router.route('/')

    // New award entry
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var award = new models.Awards(request.body.award);
        award.save(function (error) {
            if (error) response.status(500).send(error);
            else response.status(201).json({award: award});
        });
    })

    // Get awards
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        // Get all awards
        if (!Student) {
            models.Awards.find(function (error, residencies) {
                if (error) response.status(500).send(error);
                else response.json({award: residencies});
            });
        }

        // Get awards for a student
        else {
            models.Awards.find({"recipient": Student.student}, function (error, students) {
                if (error) response.status(500).send(error);
                else response.json({award: students});
            });
        }
    });

router.route('/:award_id')
    // Get award by id
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Awards.findById(request.params.award_id, function (error, award) {
            if (error) response.status(404).send(error);
            else response.json({award: award});
        })
    })

    // Update award
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Awards.findById(request.params.award_id, function (error, award) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                award.note = request.body.award.note;
                award.recipient = request.body.award.recipient;

                award.save(function (error) {
                    if (error) {
                        response.status(500).send({error: error});
                    }
                    else {
                        response.json({award: award});
                    }
                });
            }
        });
    })

    // Delete award
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.Awards.findByIdAndRemove(request.params.award_id,
            function (error, deleted) {
                if (error) response.status(500).send({error: error});
                else response.json({award: deleted});
            }
        );
    });

module.exports = router;
