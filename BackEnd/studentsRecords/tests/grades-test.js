/**
 * Created by darryl on 2017-02-19.
 */

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
let Grades = require('../models/schemas/uwocourses/gradeSchema');
let CourseCodes = require('../models/schemas/uwocourses/courseCodeSchema');


let emberName = "grade";
let emberNamePluralized = "grades";
let itemList = Common.DBElements.gradeList;
let emberModel = Grades;
let newModel = () => {
    return {
        mark: faker.random.number(100).toString(),
        note: faker.lorem.paragraph(),
    }
};
let filterValueSearches = [
    'mark',
    'note'
];
let requiredValues = ['mark'];
let uniqueValues = [];

// Remember to change QueryOperand functions and postPut/postPost/postDelete hooks as appropriate

/////////////////////////////////////////


describe('Grades', function() {

    describe('/GET functions', function() {
        before(Common.regenAllData);

        // Make sure that you can retrieve all values
        Common.Tests.GetTests.getAll(
            emberName,
            emberNamePluralized,
            emberModel,
            itemList,
            function() {
                let limit = itemList.length;
                return {offset: 0, limit: limit};
            });

        // Make sure that you can retrieve all values one page at a time
        Common.Tests.GetTests.getPagination(
            emberName,
            emberNamePluralized,
            emberModel,
            itemList);

        // Check that you can search by all non-array elements
        each(
            filterValueSearches,
            function (element, cb) {
                Common.Tests.GetTests.getByFilterSuccess(
                    emberName,
                    emberNamePluralized,
                    emberModel,
                    function (next) {
                        // Pick random model for data
                        let model = itemList[faker.random.number(itemList.length - 1)];

                        // Convert MongoID into a string before attempting search
                        let param = (model[element] instanceof mongoose.Types.ObjectId) ? model[element].toString() : model[element];

                        next([{[element]: param}, itemList.filter((el) => el[element] == model[element])]);
                    },
                    "Search by " + element,
                    function () {
                        let limit = itemList.length;
                        return {offset: 0, limit: limit};
                    });
                cb();
            },
            err => {});

        // Make sure that searches for a nonexistent object returns nothing but succeeds
        Common.Tests.GetTests.getByFilterSuccess(
            emberName,
            emberNamePluralized,
            emberModel,
            function (next) {
                next([{name: "NonExistent"}, []]);
            },
            "Search for a nonexistent model",
            function() {
                let limit = itemList.length;
                return {offset: 0, limit: limit};
            });

        // Ensure you can search by ID
        Common.Tests.GetTests.getByID(
            emberName,
            emberNamePluralized,
            emberModel,
            function(next) {
                next(itemList[faker.random.number(itemList.length - 1)]);
            });

        // Make sure that searches fail with 404 when the ID doesn't exist
        Common.Tests.GetTests.getByID(
            emberName,
            emberNamePluralized,
            emberModel,
            function(next) {
                next(new emberModel({}));
            },
            "This ID does not exist, should 404.");
    });

    describe('/PUT functions', function() {
        beforeEach(Common.regenAllData);

        // Make sure PUTs work correctly
        Common.Tests.PutTests.putUpdated(
            emberName,
            emberNamePluralized,
            emberModel,
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
            emberModel,
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
                    emberModel,
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
            err => {});

        // Make sure that attempts to not supply required values fails
        each(
            requiredValues,
            function (value, cb) {
                Common.Tests.PutTests.putUpdated(
                    emberName,
                    emberNamePluralized,
                    emberModel,
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
            err => {});

        // Make sure that attempts to push to a non-existent object fails
        Common.Tests.PutTests.putUpdated(
            emberName,
            emberNamePluralized,
            emberModel,
            function (next) {
                // Get a random model and make random updates
                let updates = newModel();
                let model = new emberModel(updates);

                // Pass the updated object and the PUT contents to the tester to make sure the changes happen
                next([updates, model]);
            },
            requiredValues,
            "This model does not exist yet, this should 404.");
    });

    describe('/POST functions', function() {
        beforeEach(Common.regenAllData);

        // Make sure POSTs work correctly
        Common.Tests.PostTests.postNew(
            emberName,
            emberNamePluralized,
            emberModel,
            function (next) {
                // Get a random model and make random updates
                let newContent = newModel();
                let model = new emberModel(newContent);
                next([newContent, model])
            },
            requiredValues);

        let idFerry = null;

        // Make sure that attempts to set IDs are ignored
        Common.Tests.PostTests.postNew(
            emberName,
            emberNamePluralized,
            emberModel,
            function(next) {
                // Select a model and then attempt to set the new object's ID to the already-existing object
                let model = itemList[faker.random.number(itemList.length - 1)];
                let modelObj = newModel();
                modelObj._id = model._id;
                idFerry = model._id;

                next([modelObj, model]);
            },
            requiredValues,
            "POSTing a record with an ID that already exists. Should ignore the new ID.",
            function(next, res) {
                // Make sure the ID is different
                expect (res.body[emberName]._id).to.not.equal(idFerry.toString());

                // Make sure the creation was successful anyways
                emberModel.findById(res.body[emberName]._id, function (err, results) {
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
                    emberModel,
                    function (next) {
                        // Get a random model and make random updates
                        let newContent = newModel();

                        // Delete a required value
                        delete newContent[value];

                        let model = new emberModel(newContent);
                        next([newContent, model])
                    },
                    requiredValues,
                    "Missing " + value + ", this should 400.");
                cb();
            },
            err => {});

        // Make sure attempts to post duplicate data fails
        // TODO: I'm not sure if this test is appropriate...
        Common.Tests.PostTests.postNotUnique(
         emberName,
         emberNamePluralized,
         emberModel,
         function (next) {
         let model = itemList[faker.random.number(itemList.length - 1)];

         next([model, model]);
         },
         requiredValues,
         "POSTing a record with duplicate data, should 500.",
         undefined,
         it.skip);
    });

    describe('/DELETE functions', function(){
        beforeEach(Common.regenAllData);

        let elementFerry = null;

        // Make sure that DELETEs are successful
        Common.Tests.DeleteTests.deleteExisting(
            emberName,
            emberNamePluralized,
            emberModel,
            function (next) {
                elementFerry = itemList[faker.random.number(itemList.length - 1)];
                next(elementFerry._id);
            },
            undefined,
            function (next, res) {
                // Check that all dependent objects got deassociated
                each([
                        [CourseCodes, "gradeInfo"],
                    ],
                    function (value, next) {
                        value[0].find(
                            {[value[1]]: elementFerry._id},
                            (err, students) => {
                                expect(err).to.be.null;
                                expect(students).to.be.empty;

                                next();
                            });
                    },
                    err => {
                        expect(err).to.be.null;
                        next();
                    });
            });

        // Make sure that attempts to delete a non-existent object fails
        Common.Tests.DeleteTests.deleteNonexistent(
            emberName,
            emberNamePluralized,
            emberModel,
            function (next) {
                next(mongoose.Types.ObjectId());
            });
    });
});
