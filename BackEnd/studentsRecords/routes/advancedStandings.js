var express = require('express');
var router = express.Router();
var AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')

    // New advanced standing entry
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var advancedStanding = new AdvancedStandings(request.body.advancedStanding);

        if (!advancedStanding.recipient) response.status(400).json({error: {message: "Recipient must be specified."}});
        else advancedStanding.save(function (error) {
            if (error) response.status(500).send(error);
            else response.status(201).json({advancedStanding: advancedStanding});
        });
    })

    // Get advanced standings
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        var l = parseInt(request.query.limit);
        var o = parseInt(request.query.offset);

        // Get all advanced standings
        if (!Student) {
            AdvancedStandings.paginate({}, {offset: o, limit: l},
                function (error, advancedStandings) {
                    if (error) response.status(500).send(error);
                    else response.json({advancedStanding: advancedStandings.docs});
                });
        }
        // Get advanced standings for a student
        else {
            AdvancedStandings.find({"recipient": Student.recipient}, function (error, students) {
                if (error) response.status(500).send(error);
                else response.json({advancedStanding: students});
            });
        }
    });

router.route('/:advancedStanding_id')

    // Get advanced standing by id
    .get(parseUrlencoded, parseJSON, function (request, response) {
        AdvancedStandings.findById(request.params.advancedStanding_id, function (error, advancedStanding) {
            if (error) response.status(404).send(error);
            else response.json({advancedStanding: advancedStanding});
        })
    })

    // Update advanced standing
    .put(parseUrlencoded, parseJSON, function (request, response) {
        AdvancedStandings.findById(request.params.advancedStanding_id, function (error, advancedStanding) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                advancedStanding.course = request.body.advancedStanding.course;
                advancedStanding.description = request.body.advancedStanding.description;
                advancedStanding.grade = request.body.advancedStanding.grade;
                advancedStanding.from = request.body.advancedStanding.from;
                advancedStanding.units = request.body.advancedStanding.units;
                advancedStanding.recipient = request.body.advancedStanding.recipient;

                if (!advancedStanding.recipient) response.status(400).json({error: {message: "Recipient must be specified."}});
                else advancedStanding.save(function (error) {
                    if (error) {
                        // Ends up here if the recipient specified is bad
                        response.status(500).send({error: error});
                    }
                    else {
                        response.json({advancedStanding: advancedStanding});
                    }
                });
            }
        });
    })

    // Delete award
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        AdvancedStandings.findByIdAndRemove(request.params.advancedStanding_id,
            function (error, deleted) {
                if (error) response.status(500).send({error: error});
                else response.json({advancedStanding: deleted});
            }
        );
    });

module.exports = router;
