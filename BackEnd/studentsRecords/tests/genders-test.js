let DB = require('../models/studentsRecordsDB');
let mongoose = DB.mongoose;

let Genders = require('../models/schemas/studentinfo/genderSchema');
let Students = require('../models/schemas/studentinfo/studentSchema');

let faker = require('faker');
let Common = require('./genericTestFramework-helper');
let chai = Common.chai;
let expect = chai.expect;


////////

// NOTE: remember to not use () => {} functions inside mocha tests due to the 'this' binding - it breaks Mocha!

////////


describe('Genders', function() {

    describe('/GET functions', function() {
        before(Common.regenAllData);

        Common.Tests.GetTests.getAll("gender", "genders", Genders, Common.DBElements.genderList);

        // Common.Tests.GetTests.getByFilterSuccess("gender", "genders", Genders, function(next) {
        //     // Pick student
        //     let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
        //     next([{recipient: student._id.toString()}, Common.DBElements.genderList.filter((el) => el.recipient == student._id)]);
        // }, "Search by student");

        Common.Tests.GetTests.getByFilterSuccess("gender", "genders", Genders, function(next) {
            // Pick random gender for data
            let gender = Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)];
            next([{name: gender.name}, Common.DBElements.genderList.filter((el) => el.name == gender.name)]);
        }, "Search by 'name'");

        // Common.Tests.GetTests.getByFilterSuccess("gender", "genders", Genders, function(next) {
        //     next([{grade: {$gt: 90}}, Common.DBElements.genderList.filter((el) => el.grade > 90)]);
        // }, "Search by minimum grade above 90");

        Common.Tests.GetTests.getByFilterSuccess("gender", "genders", Genders, function(next) {
            next([{name: "NonExistent"}, []]);
        }, "Search for a nonexistent gender");

        Common.Tests.GetTests.getByID("gender", "genders", Genders, function(next) {
            next(Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)]);
        });

        Common.Tests.GetTests.getByID("gender", "genders", Genders, function(next) {
            next(new Genders({}));
        }, "This ID does not exist, should 404.");
    });

    describe('/PUT functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PutTests.putUpdated("gender", "genders", Genders, function(next) {
            // Get a random gender and make random updates
            let gender = Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)];
            let updates = {
                name: faker.random.word(),
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => gender[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, gender]);
        }, ['name']);

        Common.Tests.PutTests.putUpdated("gender", "genders", Genders, function(next) {
            // Get a random gender and make random updates
            let gender = Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)];
            let updates = {
                name: faker.random.word(),
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => gender[key] = updates[key]);

            // Try to change the id
            updates._id = mongoose.Types.ObjectId();

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, gender]);
        }, ['name'], "This should succeed and ignore attempted ID change.");

        Common.Tests.PutTests.putNotUnique("gender", "genders", Genders, function(next) {
            // Get a random gender and make random updates
            let gender1 = Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)];
            let gender2 = Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)];

            // Try to update to create a duplicate gender
            gender1.name = gender2.name;

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([gender1, gender1._id]);
        }, ['name'], "Posting with duplicate of a unique field, should 500.");

        Common.Tests.PutTests.putUpdated("gender", "genders", Genders, function(next) {
            // Get a random gender and make random updates
            let gender = Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)];
            let updates = {
                name: null
            };
            // Update the object with the new random values
            Object.keys(updates).forEach(key => gender[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, gender]);
        }, ['name'], "Missing name, this should 400.");

        Common.Tests.PutTests.putUpdated("gender", "genders", Genders, function(next) {
            // Get a random gender and make random updates
            let updates = {
                name: faker.random.word(),
            };
            let gender = new Genders(updates);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, gender]);
        }, ['name'], "This gender does not exist yet, this should 404.");
    });

    describe('/POST functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PostTests.postNew("gender", "genders", Genders, function(next) {
            // Get a random gender and make random updates
            let newContent = {
                name: faker.random.word(),
            };
            let gender = new Genders(newContent);
            next([newContent, gender])
        }, ['name']);

        Common.Tests.PostTests.postNew("gender", "genders", Genders, function(next) {
            // Get a random gender and make random updates
            let newContent = {
                name: null
            };
            let gender = new Genders(newContent);
            next([newContent, gender])
        }, ['name'], "Missing name, this should 400.");

        let idFerry = null;

        Common.Tests.PostTests.postNew("gender", "genders", Genders,function(next) {
                let gender = Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)];
                let genderObj = {
                    name: faker.random.word()
                };
                genderObj._id = gender._id;
                idFerry = gender._id;

                next([genderObj, gender]);
            }, ['name'], "POSTing a record with an ID that already exists. Should ignore the new ID.",
            function(next, res) {
                // Make sure the ID is different
                expect (res.body.gender._id).to.not.equal(idFerry.toString());

                // Make sure the creation was successful anyways
                Genders.findById(res.body.gender._id, function (err, results) {
                    expect(err).to.be.null;
                    expect(results).to.not.be.null;
                    next();
                });
            });

        Common.Tests.PostTests.postNotUnique("gender", "genders", Genders,function(next) {
                let gender = Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)];

                next([gender, gender]);
            }, ['name'], "POSTing a record with duplicate data, should 500.");
    });

    describe('/DELETE functions', function(){
        beforeEach(Common.regenAllData);

        let elementFerry = null;

        Common.Tests.DeleteTests.deleteExisting("gender", "genders", Genders, function(next){
            elementFerry = Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)];
            next(elementFerry._id);
        }, undefined, function(next, res) {
            // Check that all dependent objects got deassociated
            Students.find({genderInfo: elementFerry._id}, (err, students) => {
                expect(err).to.be.null;
                expect(students).to.be.empty;
                next();
            });
        });

        Common.Tests.DeleteTests.deleteNonexistent("gender", "genders", Genders, function(next) {
            next(mongoose.Types.ObjectId());
        });
    });

});
