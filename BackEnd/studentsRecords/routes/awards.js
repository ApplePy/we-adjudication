var express = require('express');
var router = express.Router();
var Awards = require('../models/awardsSchema');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();


router.route('/')

    // New award entry
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var award = new Awards(request.body.award);
        if (!award.recipient) response.status(400).json({error: {message: "Recipient must be specified."}});
        else award.save(function (error) {
            if (error) response.status(500).send(error);
            else response.status(201).json({award: award});
        });
    })

    // Get awards
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        // Get all awards
        if (!Student) {
            Awards.find(function (error, residencies) {
                if (error) response.status(500).send(error);
                else response.json({award: residencies});
            });
        }

        // Get awards for a student
        else {
            Awards.find({"recipient": Student.recipient}, function (error, students) {
                if (error) response.status(500).send(error);
                else response.json({award: students});
            });
        }
    });

router.route('/:award_id')
    // Get award by id
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Awards.findById(request.params.award_id, function (error, award) {
            if (error) response.status(404).send(error);
            else response.json({award: award});
        })
    })

    // Update award
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Awards.findById(request.params.award_id, function (error, award) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                award.note = request.body.award.note;
                award.recipient = request.body.award.recipient;

                if (!award.recipient) response.status(400).json({error: {message: "Recipient must be specified."}});
                else award.save(function (error) {
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
        Awards.findByIdAndRemove(request.params.award_id,
            function (error, deleted) {
                if (error) response.status(500).send({error: error});
                else response.json({award: deleted});
            }
        );
    });

module.exports = router;
