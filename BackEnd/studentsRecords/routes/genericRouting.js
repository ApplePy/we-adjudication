let express = require('express');
let bodyParser = require('body-parser');
let parseUrlencoded = bodyParser.urlencoded({extended: false});
let parseJSON = bodyParser.json();


/**
 * A generic API route to be customized by each model
 *
 * @param {object} Model                                            Mongoose Model Object. The model to construct a route for.
 * @param {string} modelNameEmberized                               String. The ember version of the model's name.
 * @param {boolean} enablePaginate                                  Boolean. For equipped modules, enables pagination functionality.
 * @param {function(object, object, object)} verifyHook             Function(request, response, model). The hook to verify that the received model is properly filled out. Returns 0 on success, or an array of error messages.
 * @param {function(object, object, object)} queryHook              Function(request, response, filter). The hook for custom processing of queries containing a 'filter' parameter. MUST HANDLE RESPONSE TO CLIENT.
 * @param {function(object, object, object)} postPostHook           Function(request, response, new model). Hook called after a successful post and response. Used for additional updating of backend structures.
 * @param {function(object, object, object, object)} postPutHook    Function(request, response, old model, new model). Hook called after a successful put and response. Used for additional updating of backend structures.
 * @param {function(object, object, object)} preDeleteHook          Function (express middleware format). Hook called before deleting a model. Used for updating other dependent structures to null. Can be an array.
 * @param {function(object, object, object)} deleteCleanupHook      Function(request, response, deleted model). Hook called after successful deletion and response. Used for additional updating of backend structures.
 */
let Route = function(Model,
                     modelNameEmberized,
                     enablePaginate = false,
                     verifyHook = () => 0,
                     queryHook = null,
                     postPostHook = ()=>{},
                     postPutHook = () => {},
                     preDeleteHook = (req, res, next) => next(),
                     deleteCleanupHook = () => {}) {
    let router = express.Router();

    // Add universal middleware
    router.use(parseUrlencoded, parseJSON);

    router.route('/')

    // New model entry
        .post(function (request, response) {
            // Create model
            delete request.body[modelNameEmberized]._id;
            let modelObj = new Model(request.body[modelNameEmberized]);

            // Check to ensure contents are good
            let verRes = null;
            if ((verRes = verifyHook(request, response, modelObj)) !== 0)
                return response.status(400).json({errors: {messages: verRes, request: request.body}});

            modelObj.save(function (error) {
                if (error) response.status(500).send({errors: error, request: request.body});
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
            let p = parseInt(request.query.page);
            let filter = request.query.filter;

            // Get all model objects
            if (!filter) {
                // Return models in pages
                if (enablePaginate) {
                    // Set default limit
                    if (typeof l !== 'number' || isNaN(l)) l = 0;

                    // Calculate offset from page number
                        if (typeof p === 'number' && isNaN(p) === false) {
                            o = (p - 1) * l;    // Pages start at 1
                        }

                    // Add default offset
                    if (typeof o !== 'number' || isNaN(o)) o = 0;
                    

                    Model.paginate({}, {offset: o, limit: l},
                        function (error, modelObjs) {
                            if (error) response.status(500).send({errors: error});
                            else response.json({
                                [modelNameEmberized]: modelObjs.docs,
                                 meta:
                                 {
                                     total: modelObjs.total,
                                     limit: modelObjs.limit,
                                     offset: modelObjs.offset,
                                     total_pages: Math.ceil(modelObjs.total / modelObjs.limit)
                                 }
                            });
                        });
                }
                // Return all models
                else {
                    Model.find(function (error, modresults) {
                        if (error) response.status(500).send({errors: error});
                        else response.json({[modelNameEmberized]: modresults});
                    });
                }
            }
            // Get models matching the filter
            else {
                if (queryHook === null) {
                    if (enablePaginate){
                        // Set default limit
                        if (typeof l !== 'number' || isNaN(l)) l = 1;

                        // Calculate offset from page number
                        if (typeof p === 'number' && isNaN(p) === false) {
                            o = (p - 1) * l;    // Pages start at 1
                        }

                        // Add default offset
                        if (typeof o !== 'number' || isNaN(o)) o = 0;

                        Model.paginate(filter, {offset: o, limit: l},
                            function (error, modelObjs) {
                                if (error) response.status(500).send({errors: error});
                                else response.json({
                                    [modelNameEmberized]: modelObjs.docs,
                                    meta:
                                    {
                                        total: modelObjs.total,
                                        limit: modelObjs.limit,
                                        offset: modelObjs.offset,
                                        total_pages: Math.ceil(modelObjs.total / modelObjs.limit)
                                    }
                                });
                            });
                    }
                    else {
                        Model.find(filter, function (error, queryResults) {
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
            Model.findById(request.params.mongo_id, function (error, modelObj) {
                if (error) response.status(500).send({errors: error});
                else if (!modelObj) response.sendStatus(404);
                else response.json({[modelNameEmberized]: modelObj});
            });
        })

        // Update model
        .put(function (request, response) {
            Model.findById(request.params.mongo_id, function (error, modelObj) {
                if (error) {
                    response.status(500).send({errors: error});
                }
                else if (!modelObj) response.sendStatus(404);
                else {
                    // Check to ensure that all fields in new version exist properly before updating
                    let verRes = null;
                    if ((verRes = verifyHook(request, response, request.body[modelNameEmberized])) !== 0)
                        return response.status(400).json({errors: {messages: verRes, request: request.body}});

                    // Get all the fields of the model
                    let modelKeys = Object.keys(Model.schema.obj);

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
                            response.status(500).send({errors: error, request: request.body});
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
            Model.findByIdAndRemove(request.params.mongo_id,
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

/**
 * A rudimentary property validation function.
 * 
 * Checks that specified properties exist in the passed model *mod*.
 * 
 * @param {...string} properties An array of strings that the passed model must have.
 */
let PropertyValidator = function(...properties) {
    return (req, res, mod) => {
            let results = [];

            // Check that the needed properties exist
            for (let property of properties)
            if (typeof mod[property] === "undefined")
                results.push(property + " must be specified.");

            if (results.length > 0)
                return results;
            else
                return 0;
        };
};


/**
 * An Express middleware that maps a Model's property to *null* if it matches
 * the ID passed in the route URL.
 * 
 * @param {object} Model        A Mongoose Model.
 * @param {string} property     The property to map to null.
 */
let MapToNull = function(Model, property) {
    return (req, res, next) => {
            // Map all affected program records to null
            Model.update(
                {[property]: req.params.mongo_id},
                {$set: {[property]: null}},
                {multi: true},
                function (error) {
                    if (error) res.status(500).send({error: error});
                    else {
                        // All program records mapped successfully, continue deletion
                        next();
                    }
                });
        };
};

module.exports.Route = Route;
module.exports.PropertyValidator = PropertyValidator;
module.exports.MapToNull = MapToNull;