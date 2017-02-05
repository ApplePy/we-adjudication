var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var gender = new models.Genders(request.body.gender);
        gender.save(function (error) {
            if (error) response.status(500).send(error);
            else response.status(201).json({gender: gender});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Gender = request.query.filter;
        if (!Gender) {
            models.Genders.find(function (error, genders) {
                if (error) response.status(500).send(error);
                else response.json({gender: genders});
            });
        } else {
            models.Genders.find({"name": Gender.name}, function (error, genders) {
                if (error) response.status(500).send(error);
                else response.json({gender: genders});
            });
        }
    });

router.route('/:gender_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Genders.findById(request.params.gender_id, function (error, gender) {
            if (error) response.status(404).send(error);
            else response.json({gender: gender});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Genders.findById(request.params.gender_id, function (error, gender) {
            if (error) {
                response.status(404).send({error: error});
            }
            else {
                gender.name = request.body.gender.name;
                gender.students = request.body.gender.students;     // TODO: Review later since this array is empty in ember? O.o

                gender.save(function (error) {
                    if (error) {
                        response.status(500).send({error: error});
                    }
                    else {
                        response.json({gender: gender});
                    }
                });
            }
        })
    })

    // Delete a residency
    .delete(parseUrlencoded, parseJSON, function (request, response) {

        // Map all affected students to null
        models.Students.update(
            {genderInfo: request.params.gender_id},
            {$set: {genderInfo: null}},
            {multi: true},
            function (error, students) {
                if (error) response.status(500).send({error: error});
                else {
                    // All students mapped successfully, delete residency
                    models.Genders.findByIdAndRemove(request.params.gender_id, function (error, gender) {
                        if (error) response.status(500).send({error: error});
                        else response.json({gender: gender});
                    });
                }
            });
    });

module.exports = router;