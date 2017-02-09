var express = require('express');
var router = express.Router();
var Residencies = require('../models/residencySchema');
var Students = require('../models/studentsSchema');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();


router.route('/')
    // Post a new residency
    .post(parseUrlencoded, parseJSON, function (request, response) {
        // The body of the request will be { residency: {*content} }
        var residency = new Residencies(request.body.residency);

        residency.save(function (error) {
            if (error) response.status(500).send(error);
            else response.status(201).json({residency: residency});
        });
    })

    // Get all residencies, or the residency that a student belongs to
    .get(parseUrlencoded, parseJSON, function (request, response) {
        // Get query object
        var filter = request.query.filter;

        // If no query, return all
        if (!filter) {
            Residencies.find(function (error, residencies) {
                if (error) response.status(500).send(error);
                else response.json({residency: residencies});
            });
        }

        // A query was submitted for the residency of a student
        else if (filter.student) {
            Students.findById(filter.student, function (error, student) {
                if (error || student == null) response.status(404).send(error);
                else {
                    Residencies.findById(student.resInfo, function(error, res) {
                        if (error) response.status(404).send(error);
                        response.json({residency: res});
                    });
                }
            });
        }

        // A query was submitted for a specific residency name
        else if (filter.name) {
            Residencies.find({"name": filter.name}, function (error, students) {
                if (error) response.status(500).send(error);
                else response.json({residency: students});
            });
        }
    });

// Manipulate residency by its Mongo id
router.route('/:residency_id')

    // Get a specific residency by Mongo id
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Residencies.findById(request.params.residency_id, function (error, residency) {
            if (error) response.status(404).send(error);
            else response.json({residency: residency});
        })
    })

    // Update a specific residency
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Residencies.findById(request.params.residency_id, function (error, residency) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                residency.name = request.body.residency.name;
                residency.students = request.body.residency.students;

                residency.save(function (error) {
                    if (error) {
                        response.status(500).send({error: error});
                    }
                    else {
                        response.json({residency: residency});
                    }
                });
            }
        })
    })

    // Delete a residency
    .delete(parseUrlencoded, parseJSON, function (request, response) {

        // Map all affected students to null
        Students.update(
            {resInfo: request.params.residency_id},
            {$set: {resInfo: null}},
            {multi: true},
            function (error, students) {
                if (error) response.status(500).send({error: error});
                else {
                    // All students mapped successfully, delete residency
                    Residencies.findByIdAndRemove(request.params.residency_id, function(error, residency) {
                       if (error) response.status(500).send({error: error});
                       else response.json({residency: residency});
                    });
                }
            });
    });

module.exports = router;
