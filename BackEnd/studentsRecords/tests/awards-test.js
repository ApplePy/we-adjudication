process.env.NODE_ENV = 'test';

let each = require('async/each');

let faker = require('faker');
let Common = require('./genericTestFramework-helper');
let chai = Common.chai;
let expect = chai.expect;

let DB = require('../models/studentsRecordsDB');
let mongoose = DB.mongoose;

////////

// NOTE: remember to not use () => {} functions inside mocha tests due to the 'this' binding - it breaks Mocha!

////////

///// THINGS TO CHANGE ON COPYPASTA /////
let Awards = require('../models/schemas/studentinfo/awardSchema');

let emberName = "award";
let emberNamePluralized = "awards";
let itemList = Common.DBElements.awardList;
let EmberModel = Awards;
let newModel = Common.Generators.Award;
let testName = "Awards";
let filterValueSearches = ['note', 'recipient'];
let requiredValues = ['note', 'recipient'];
let uniqueValues = [];

// Remember to change QueryOperand functions and postPut/postPost/postDelete hooks as appropriate

/////////////////////////////////////////


// Little patch to ensure that newModel does not violate uniqueness
newModel = (function() {
    // Save the original newModel function
    let originalModel = newModel;

    // Create the wrapped function
    return function(...args) {
        let unique = true;  // Flag var to signal uniqueness
        let newObject = null;
        let failCount = 0;
        do {
            newObject = originalModel(...args);

            // Check that no unique values are being violated
            for (let uniqueValue of uniqueValues) {
                /* jshint loopfunc: true */
                unique = itemList.findIndex(element => element[uniqueValue] === newObject[uniqueValue]) === -1;

                // Stop processing once found to be not unique
                if (unique !== true) {
                    failCount += 1;
                    if (failCount > 10) {
                        throw Error("A unique object could not be created!");
                    }
                    break;
                }
            }
        } while(unique !== true);

        return newObject;
    };
})();


describe(testName, function () {

    describe('/GET functions', function () {
        before(Common.regenAllData);

        // Make sure that you can retrieve all values
        Common.Tests.GetTests.getAll(
            emberName,
            emberNamePluralized,
            EmberModel,
            itemList,
            function () {
                let limit = itemList.length;
                return { offset: 0, limit: limit };
            });

        // Make sure that you can retrieve all values one page at a time
        Common.Tests.GetTests.getPagination(
            emberName,
            emberNamePluralized,
            EmberModel,
            itemList);

        // Check that you can search by all non-array elements
        each(
            filterValueSearches,
            function (element, cb) {
                Common.Tests.GetTests.getByFilterSuccess(emberName, emberNamePluralized, EmberModel, function (next) {
                    // Pick random model for data
                    let model = itemList[faker.random.number(itemList.length - 1)];

                    // Convert MongoID into a string before attempting search
                    let param = (model[element] instanceof mongoose.Types.ObjectId) ? model[element].toString() : model[element];

                    next([{ [element]: param }, itemList.filter((el) => el[element] === model[element])]);
                }, "Search by " + element, function () {
                    let limit = itemList.length;
                    return { offset: 0, limit: limit };
                });
                cb();
            },
            () => { });

        // Make sure that searches for a nonexistent object returns nothing but succeeds
        Common.Tests.GetTests.getByFilterSuccess(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                next([{ name: "NonExistent" }, []]);
            },
            "Search for a nonexistent model",
            function () {
                let limit = itemList.length;
                return { offset: 0, limit: limit };
            });

        // Ensure you can search by ID
        Common.Tests.GetTests.getByID(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                next(itemList[faker.random.number(itemList.length - 1)]);
            });

        // Make sure that searches fail with 404 when the ID doesn't exist
        Common.Tests.GetTests.getByID(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                next(new EmberModel({}));
            },
            "This ID does not exist, should 404.");
    });

    describe('/PUT functions', function () {
        beforeEach(Common.regenAllData);

        // Make sure PUTs work correctly
        Common.Tests.PutTests.putUpdated(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                // Get a random model and make random updates
                let model = itemList[faker.random.number(itemList.length - 1)];
                let updates = newModel();

                // Update the object with the new random values
                Object.keys(updates).forEach(key => model[key] = updates[key]);

                // Pass the updated object and the PUT contents to the tester to make sure the changes happen
                next([updates, model]);
            },
            requiredValues);

        // Make sure that attempted ID changes are ignored
        Common.Tests.PutTests.putUpdated(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                // Get a random model and make random updates
                let model = itemList[faker.random.number(itemList.length - 1)];
                let updates = {
                    name: faker.random.word(),
                };

                // Update the object with the new random values
                Object.keys(updates).forEach(key => model[key] = updates[key]);

                // Try to change the id
                updates._id = mongoose.Types.ObjectId();

                // Pass the updated object and the PUT contents to the tester to make sure the changes happen
                next([updates, model]);
            },
            requiredValues,
            "This should succeed and ignore attempted ID change.");

        // Make sure that attempts to violate uniqueness fails
        each(
            uniqueValues,
            function (value, cb) {
                Common.Tests.PutTests.putNotUnique(
                    emberName,
                    emberNamePluralized,
                    EmberModel,
                    function (next) {
                        // Get a random model and make random updates
                        let model1 = itemList[faker.random.number(itemList.length - 1)];
                        let model2 = itemList[faker.random.number(itemList.length - 1)];

                        // Loop until models are different
                        while (model1[value] === model2[value]) {
                            model2 = itemList[faker.random.number(itemList.length - 1)];
                        }

                        // Try to update to create a duplicate value
                        model1[value] = model2[value];

                        // Pass the updated object and the PUT contents to the tester to make sure the changes happen
                        next([model1, model1._id]);
                    },
                    requiredValues,
                    "Posting with duplicate of unique field " + value + ", should 500.");
                cb();
            },
            () => { });

        // Make sure that attempts to not supply required values fails
        each(
            requiredValues,
            function (value, cb) {
                Common.Tests.PutTests.putUpdated(
                    emberName,
                    emberNamePluralized,
                    EmberModel,
                    function (next) {
                        // Get a random model and make random updates
                        let model = itemList[faker.random.number(itemList.length - 1)];
                        let updates = newModel();

                        // Remove a required value
                        delete updates[value];

                        // Update the object with the new random values
                        Object.keys(updates).forEach(key => model[key] = updates[key]);

                        // Pass the updated object and the PUT contents to the tester to make sure the changes happen
                        next([updates, model]);
                    },
                    requiredValues,
                    "Missing " + value + ", this should 400.");
                cb();
            },
            () => { });

        // Make sure that attempts to push to a non-existent object fails
        Common.Tests.PutTests.putUpdated(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                // Get a random model and make random updates
                let updates = newModel();
                let model = new EmberModel(updates);

                // Pass the updated object and the PUT contents to the tester to make sure the changes happen
                next([updates, model]);
            },
            requiredValues,
            "This model does not exist yet, this should 404.");
    });

    describe('/POST functions', function () {
        beforeEach(Common.regenAllData);

        // Make sure POSTs work correctly
        Common.Tests.PostTests.postNew(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                // Get a random model and make random updates
                let newContent = newModel();
                let model = new EmberModel(newContent);
                next([newContent, model]);
            },
            requiredValues);

        let idFerry = null;

        // Make sure that attempts to set IDs are ignored
        Common.Tests.PostTests.postNew(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                // Select a model and then attempt to set the new object's ID to the already-existing object
                let model = itemList[faker.random.number(itemList.length - 1)];
                let modelObj = newModel();
                modelObj._id = model._id;
                idFerry = model._id;

                next([modelObj, model]);
            },
            requiredValues,
            "POSTing a record with an ID that already exists. Should ignore the new ID.",
            function (next, res) {
                // Make sure the ID is different
                expect(res.body[emberName]._id).to.not.equal(idFerry.toString());

                // Make sure the creation was successful anyways
                EmberModel.findById(res.body[emberName]._id, function (err, results) {
                    /* jshint expr: true */
                    expect(err).to.be.null;
                    expect(results).to.not.be.null;
                    next();
                });
            });

        // Make sure that attempts to not supply required values fails
        each(
            requiredValues,
            function (value, cb) {
                Common.Tests.PostTests.postNew(
                    emberName,
                    emberNamePluralized,
                    EmberModel,
                    function (next) {
                        // Get a random model and make random updates
                        let newContent = newModel();

                        // Delete a required value
                        delete newContent[value];

                        let model = new EmberModel(newContent);
                        next([newContent, model]);
                    },
                    requiredValues,
                    "Missing " + value + ", this should 400.");
                cb();
            },
            () => { });

        // Make sure attempts to post duplicate data fails
        // TODO: I'm not sure if this test is appropriate...
        Common.Tests.PostTests.postNotUnique(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                let model = itemList[faker.random.number(itemList.length - 1)];

                next([model, model]);
            },
            requiredValues,
            "POSTing a record with duplicate data, should 500.",
            undefined,
            it.skip);
    });

    describe('/DELETE functions', function () {
        beforeEach(Common.regenAllData);

        let elementFerry = null;

        // Make sure that DELETEs are successful
        Common.Tests.DeleteTests.deleteExisting(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                elementFerry = itemList[faker.random.number(itemList.length - 1)];
                next(elementFerry._id);
            });

        // Make sure that attempts to delete a non-existent object fails
        Common.Tests.DeleteTests.deleteNonexistent(
            emberName,
            emberNamePluralized,
            EmberModel,
            function (next) {
                next(mongoose.Types.ObjectId());
            });
    });
});
