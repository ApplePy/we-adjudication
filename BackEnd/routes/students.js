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

    })
    .get('/last', function(request, response) {

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

    })
    .get('/previous', function(request, response) {

    });

module.exports = router;
