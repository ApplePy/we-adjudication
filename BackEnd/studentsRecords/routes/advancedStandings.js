var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')

    // New advanced standing entry
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var advancedStanding = new models.AdvancedStandings(request.body['advanced-standing']);
        advancedStanding.save(function (error) {
            if (error) response.status(500).send(error);
            else response.status(201).json({'advanced-standing': advancedStanding});
        });
    })

    // Get advanced standings
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;

        // Get all advanced standings
        if (!Student) {
            models.AdvancedStandings.find(function (error, advancedStanding) {
                if (error) response.status(500).send(error);
                response.json({'advanced-standing': advancedStanding});
            });
        }
        // Get advanced standings for a student
        else {
            models.AdvancedStandings.find({"recipient": Student.student}, function (error, students) {
                if (error) response.status(500).send(error);
                response.json({'advanced-standing': students});
            });
        }
    });

router.route('/:advancedStanding_id')

    // Get advanced standing by id
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.AdvancedStandings.findById(request.params.advancedStanding_id, function (error, advancedStanding) {
            if (error) response.status(404).send(error);
            else response.json({'advanced-standing': advancedStanding});
        })
    })

    // Update advanced standing
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.AdvancedStandings.findById(request.params.advancedStanding_id, function (error, advancedStanding) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                advancedStanding.course = request.body['advanced-standing'].course;
                advancedStanding.description = request.body['advanced-standing'].description;
                advancedStanding.grade = request.body['advanced-standing'].grade;
                advancedStanding.from = request.body['advanced-standing'].from;
                advancedStanding.units = request.body['advanced-standing'].units;
                advancedStanding.recipient = request.body['advanced-standing'].recipient;

                advancedStanding.save(function (error) {
                    if (error) {
                        // Ends up here if the recipient specified is bad
                        response.status(500).send({error: error});
                    }
                    else {
                        response.json({'advanced-standing': advancedStanding});
                    }
                });
            }
        });
    })

    // Delete award
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.AdvancedStandings.findByIdAndRemove(request.params.advancedStanding_id,
            function (error, deleted) {
                if (error) response.status(500).send({error: error});
                else response.json({'advanced-standing': deleted});
            }
        );
    });

module.exports = router;
