var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')

    // New advanced standing entry
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var advancedStanding = new models.AdvancedStandings(request.body.advancedStanding);
        advancedStanding.save(function (error) {
            if (error) response.send(error);
            response.json({advancedStanding: advancedStanding});
        });
    })

    // Get advanced standings
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;

        // Get all advanced standings
        if (!Student) {
            models.AdvancedStandings.find(function (error, advancedStanding) {
                if (error) response.send(error);
                response.json({advancedStanding: advancedStanding});
            });
        }
        // Get advanced standing for a student
        else {
            models.AdvancedStandings.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({advancedStanding: students});
            });
        }
    });

router.route('/:advancedStanding_id')

    // Get advanced standing by id
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.AdvancedStandings.findById(request.params.advancedStanding_id, function (error, advancedStanding) {
            if (error) response.send(error);
            response.json({advancedStanding: advancedStanding});
        })
    })

    // Update advanced standing
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.AdvancedStandings.findById(request.params.advancedStanding_id, function (error, advancedStanding) {
            if (error) {
                response.send({error: error});
            }
            else {
                advancedStanding.note = request.body.advancedStanding.note;
                advancedStanding.recipient = request.body.advancedStanding.recipient;

                advancedStanding.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({advancedStanding: advancedStanding});
                    }
                });
            }
        })
    });

module.exports = router;
