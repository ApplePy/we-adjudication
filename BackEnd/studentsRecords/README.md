# WE Adjudication Back End
This is the back end code for the WE Adjudication system written by the
Digital Panda team.

## Layout
| Folder        | Contents                                                                    |
|---------------|-----------------------------------------------------------------------------|
| miscellaneous | Contains scripts used to populate the Mongo database.                       |
| models        | Contains the Mongoose models used, plus the DB connection logic.            |
| routes        | Provides the publically accessible API routes to access the Mongo database. |
| tests         | Contains the tests that verify the functionality of the routes.             |

## Structure
Routes follow a generic structure outlined in `genericRouting.js`, which exports a `Route`
 function. Routes can be quickly created by specifying needs in the Setup parameters.

 A `PropertyValidator` *queryHook* function is also exported for convienience. This function 
 takes an array of strings that correspond to property names that must exist on the model 
 object to be accepted.

A `MapToNull` *pre-delete* function is also exported for convenience. This function takes a
model and a property name, and sets the property *property* to **null** on all objects of 
type *model* if the property matches the Mongo ID sent in the route URL.
 
### Route function parameters:

| Parameter Name     | Type                                              | Returns (Optional)                     | Description                                                                                                    |
|--------------------|---------------------------------------------------|----------------------------------------|----------------------------------------------------------------------------------------------------------------|
| Model              | Mongoose Model Object                             |                                        | The model to construct a route for.                                                                            |
| modelNameEmberized | String                                            |                                        | The ember version of the model's name that it expects in JSON responses.                                       |
| enablePaginate     | Boolean                                           |                                        | For equipped modules, enables pagination functionality for both GET all and filtered GETs.                     |
| verifyHook         | Function(request, response, model)                | Success=0, Failure=array of error msgs | The hook to verify that the received model is properly filled out.                                             |
| queryHook          | Function(request, response, filter)               |                                        | The hook for custom processing of queries containing a 'filter' parameter. **MUST HANDLE RESPONSE TO CLIENT.** |
| postPostHook       | Function(request, response, new model)            |                                        | Hook called after a successful post and response. Used for additional updating of backend structures.          |
| postPutHook        | Function(request, response, old model, new model) |                                        | Hook called after a successful put and response. Used for additional updating of backend structures.           |
| preDeleteHook      | Function(request, response, next, err)            |                                        | Hook called before deleting a model. Used for updating other dependent structures to null. Can be an array.    |
| deleteCleanupHook  | Function(request, response, deleted model)        |                                        | Hook called after successful deletion and response. Used for additional updating of backend structures.        |
