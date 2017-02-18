let DB = require('../models/studentsRecordsDB');
let mongoose = DB.mongoose;

let Residencies = require('../models/schemas/studentinfo/residencySchema');
let Students = require('../models/schemas/studentinfo/studentSchema');

let faker = require('faker');
let Common = require('./genericTestFramework-helper');
let chai = Common.chai;
let expect = chai.expect;


////////

// NOTE: remember to not use () => {} functions inside mocha tests due to the 'this' binding - it breaks Mocha!

////////


describe('Residencies', function() {

    describe('/GET functions', function() {
        before(Common.regenAllData);

        Common.Tests.GetTests.getAll("residency", "residencies", Residencies, Common.DBElements.residencyList);

        Common.Tests.GetTests.getByFilterSuccess("residency", "residencies", Residencies, function(next) {
            // Pick random residency for data
            let residency = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];
            next([{name: residency.name}, Common.DBElements.residencyList.filter((el) => el.name == residency.name)]);
        }, "Search by 'name'");

        Common.Tests.GetTests.getByFilterSuccess("residency", "residencies", Residencies, function(next) {
            next([{name: "NonExistent"}, []]);
        }, "Search for a nonexistent residency");

        Common.Tests.GetTests.getByID("residency", "residencies", Residencies, function(next) {
            next(Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)]);
        });

        Common.Tests.GetTests.getByID("residency", "residencies", Residencies, function(next) {
            next(new Residencies({}));
        }, "This ID does not exist, should 404.");
    });

    describe('/PUT functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PutTests.putUpdated("residency", "residencies", Residencies, function(next) {
            // Get a random residency and make random updates
            let residency = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];
            let updates = {
                name: faker.random.word(),
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => residency[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, residency]);
        }, ['name']);

        Common.Tests.PutTests.putUpdated("residency", "residencies", Residencies, function(next) {
            // Get a random residency and make random updates
            let residency = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];
            let updates = {
                name: faker.random.word(),
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => residency[key] = updates[key]);

            // Try to change the id
            updates._id = mongoose.Types.ObjectId();

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, residency]);
        }, ['name'], "This should succeed and ignore attempted ID change.");

        Common.Tests.PutTests.putNotUnique("residency", "residencies", Residencies, function(next) {
            // Get a random residency and make random updates
            let residency1 = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];
            let residency2 = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];

            // Loop until residencies are different
            while (residency1.name === residency2.name) {
                residency2 = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];
            }

            // Try to update to create a duplicate residency
            residency1.name = residency2.name;

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([residency1, residency1._id]);
        }, ['name'], "Posting with duplicate of a unique field, should 500.");

        Common.Tests.PutTests.putUpdated("residency", "residencies", Residencies, function(next) {
            // Get a random residency and make random updates
            let residency = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];
            let updates = {
                name: null
            };
            // Update the object with the new random values
            Object.keys(updates).forEach(key => residency[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, residency]);
        }, ['name'], "Missing name, this should 400.");

        Common.Tests.PutTests.putUpdated("residency", "residencies", Residencies, function(next) {
            // Get a random residency and make random updates
            let updates = {
                name: faker.random.word(),
            };
            let residency = new Residencies(updates);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, residency]);
        }, ['name'], "This residency does not exist yet, this should 404.");
    });

    describe('/POST functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PostTests.postNew("residency", "residencies", Residencies, function(next) {
            // Get a random residency and make random updates
            let newContent = {
                name: faker.random.word(),
            };
            let residency = new Residencies(newContent);
            next([newContent, residency])
        }, ['name']);

        Common.Tests.PostTests.postNew("residency", "residencies", Residencies, function(next) {
            // Get a random residency and make random updates
            let newContent = {
                name: null
            };
            let residency = new Residencies(newContent);
            next([newContent, residency])
        }, ['name'], "Missing name, this should 400.");

        let idFerry = null;

        Common.Tests.PostTests.postNew("residency", "residencies", Residencies,function(next) {
                let residency = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];
                let residencyObj = {
                    name: faker.random.word()
                };
                residencyObj._id = residency._id;
                idFerry = residency._id;

                next([residencyObj, residency]);
            }, ['name'], "POSTing a record with an ID that already exists. Should ignore the new ID.",
            function(next, res) {
                // Make sure the ID is different
                expect (res.body.residency._id).to.not.equal(idFerry.toString());

                // Make sure the creation was successful anyways
                Residencies.findById(res.body.residency._id, function (err, results) {
                    expect(err).to.be.null;
                    expect(results).to.not.be.null;
                    next();
                });
            });

        Common.Tests.PostTests.postNotUnique("residency", "residencies", Residencies,function(next) {
            let residency = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];

            next([residency, residency]);
        }, ['name'], "POSTing a record with duplicate data, should 500.");
    });

    describe('/DELETE functions', function(){
        beforeEach(Common.regenAllData);

        let elementFerry = null;

        Common.Tests.DeleteTests.deleteExisting("residency", "residencies", Residencies, function(next){
            elementFerry = Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)];
            next(elementFerry._id);
        }, undefined, function(next, res) {
            // Check that all dependent objects got deassociated
            Students.find({resInfo: elementFerry._id}, (err, students) => {
                expect(err).to.be.null;
                expect(students).to.be.empty;
                next();
            });
        });
        Common.Tests.DeleteTests.deleteNonexistent("residency", "residencies", Residencies, function(next) {
            next(mongoose.Types.ObjectId());
        });
    });

});
