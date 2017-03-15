var express = require('express');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();


/**
 * A generic API route to be customized by each model
 *
 * @param model                 Mongoose Model Object. The model to construct a route for.
 * @param modelNameEmberized    String. The ember version of the model's name.
 * @param enablePaginate        Boolean. For equipped modules, enables pagination functionality.
 * @param verifyHook            Function(request, response, model). The hook to verify that the received model is properly filled out. Returns 0 on success, or an array of error messages.
 * @param queryHook             Function(request, response, filter). The hook for custom processing of queries containing a 'filter' parameter. MUST HANDLE RESPONSE TO CLIENT.
 * @param postPostHook          Function(request, response, new model). Hook called after a successful post and response. Used for additional updating of backend structures.
 * @param postPutHook           Function(request, response, old model, new model). Hook called after a successful put and response. Used for additional updating of backend structures.
 * @param preDeleteHook         Function (express middleware format). Hook called before deleting a model. Used for updating other dependent structures to null.
 * @param deleteCleanupHook     Function(request, response, deleted model). Hook called after successful deletion and response. Used for additional updating of backend structures.
 */
var Setup = function(model,
                     modelNameEmberized,
                     enablePaginate = false,
                     verifyHook = () => 0,
                     queryHook = null,
                     postPostHook = ()=>{},
                     postPutHook = () => {},
                     preDeleteHook = (req, res, next) => {next()},
                     deleteCleanupHook = () => {}) {
    let router = express.Router();

    // Add universal middleware
    router.use(parseUrlencoded, parseJSON);

    router.route('/')

    // New model entry
        .post(function (request, response) {
            // Create model
            delete request.body[modelNameEmberized]._id;
            let modelObj = new model(request.body[modelNameEmberized]);

            // Check to ensure contents are good
            if ((verRes = verifyHook(request, response, modelObj)) !== 0)
                return response.status(400).json({errors: {messages: verRes, request: request.body}});

            modelObj.save(function (error) {
                if (error) response.status(500).send({errors: error});
                else {
                    // Send success and call post hook
                    response.status(201).json({[modelNameEmberized]: modelObj});
                    postPostHook(request, response, modelObj);
                }
            });
        })

        // Get model objects
        .get(function (request, response) {
            let l = parseInt(request.query.limit);
            let o = parseInt(request.query.offset);
            let filter = request.query.filter;

            // Get all model objects
            if (!filter) {
                // Return models in pages
                if (enablePaginate) {
                    // Add default limits
                    if (typeof o !== 'number' || isNaN(o)) o = 0;
                    if (typeof l !== 'number' || isNaN(l)) l = 0;

                    model.paginate({}, {offset: o, limit: l},
                        function (error, modelObjs) {
                            if (error) response.status(500).send({errors: error});
                            else response.json({[modelNameEmberized]: modelObjs.docs});
                        });
                }
                // Return all models
                else {
                    model.find(function (error, modresults) {
                        if (error) response.status(500).send({errors: error});
                        else response.json({[modelNameEmberized]: modresults});
                    });
                }
            }
            // Get models matching the filter
            else {
                if (queryHook === null) {
                    if (enablePaginate){
                        // Add default limits
                        if (typeof o !== 'number' || isNaN(o)) o = 0;
                        if (typeof l !== 'number' || isNaN(l)) l = 1;

                        model.paginate(filter, {offset: o, limit: l},
                            function (error, modelObjs) {
                                if (error) response.status(500).send({errors: error});
                                else response.json({[modelNameEmberized]: modelObjs.docs});
                            });
                    }
                    else {
                        model.find(filter, function (error, queryResults) {
                            if (error) response.status(500).send({errors: error});
                            else response.json({[modelNameEmberized]: queryResults});
                        });
                    }
                } else {
                    // Custom model filtering
                    queryHook(request, response, filter);
                }
            }
        });

    router.route('/:mongo_id')

    // Get model by id
        .get(function (request, response) {
            model.findById(request.params.mongo_id, function (error, modelObj) {
                if (error) response.status(500).send({errors: error});
                else if (!modelObj) response.sendStatus(404);
                else response.json({[modelNameEmberized]: modelObj});
            })
        })

        // Update model
        .put(function (request, response) {
            model.findById(request.params.mongo_id, function (error, modelObj) {
                if (error) {
                    response.status(500).send({errors: error});
                }
                else if (!modelObj) response.sendStatus(404);
                else {
                    // Check to ensure that all fields in new version exist properly before updating
                    if ((verRes = verifyHook(request, response, request.body[modelNameEmberized])) !== 0)
                        return response.status(400).json({errors: {messages: verRes, request: request.body}});

                    // Get all the fields of the model
                    let modelKeys = Object.keys(model.schema.obj);

                    // Save old version of the model
                    let oldModel = {};

                    // Update all model fields
                    for (let key of modelKeys)
                    {
                        oldModel[key] = modelObj[key];
                        modelObj[key] = request.body[modelNameEmberized][key];
                    }

                    modelObj.save(function (error) {
                        if (error) {
                            // Ends up here if the recipient specified is bad
                            response.status(500).send({errors: error});
                        }
                        else {
                            // Send success and call post hook
                            response.json({[modelNameEmberized]: modelObj});
                            postPutHook(request, response, oldModel, modelObj);
                        }
                    });
                }
            });
        })

        // Delete model
        .delete(preDeleteHook, function (request, response) {
            model.findByIdAndRemove(request.params.mongo_id,
                function (error, deleted) {
                    if (error) response.status(500).send({errors: error});
                    else if (!deleted) response.sendStatus(404);
                    else {
                        // Send success and call cleanup hook
                        response.json({[modelNameEmberized]: deleted});
                        deleteCleanupHook(request, response, deleted);
                    }
                }
            );
        });

    return router;
};

module.exports = Setup;