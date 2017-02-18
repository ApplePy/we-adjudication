/**
 * Created by darryl on 2017-02-13.
 */
process.env.NODE_ENV = 'test';

let faker = require('faker');
let Common = require('./genericTestFramework-helper');
let chai = Common.chai;
let expect = chai.expect;

let DB = require('../models/studentsRecordsDB');
var mongoose = DB.mongoose;

let AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');


////////

// NOTE: remember to not use () => {} functions inside mocha tests due to the 'this' binding - it breaks Mocha!

////////


describe('Advanced Standings', function() {

    describe('/GET functions', function() {
        before(Common.regenAllData);

        Common.Tests.GetTests.getAll("advancedStanding", "advancedStandings", AdvancedStandings, Common.DBElements.standingList);

        Common.Tests.GetTests.getByFilterSuccess("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            // Pick student
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            next([{recipient: student._id.toString()}, Common.DBElements.standingList.filter((el) => el.recipient == student._id)]);
        }, "Search by student");

        Common.Tests.GetTests.getByFilterSuccess("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            // Pick random standing for data
            let advStand = Common.DBElements.standingList[faker.random.number(Common.DBElements.standingList.length - 1)];
            next([{from: advStand.from.toString()}, Common.DBElements.standingList.filter((el) => el.from == advStand.from)]);
        }, "Search by 'from' location");

        Common.Tests.GetTests.getByFilterSuccess("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            next([{grade: {$gt: 90}}, Common.DBElements.standingList.filter((el) => el.grade > 90)]);
        }, "Search by minimum grade above 90");

        Common.Tests.GetTests.getByFilterSuccess("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            let standinglessStudent = Common.DBElements.studentList.find(
                el => Common.DBElements.standingList.findIndex(el2 => el2.recipient == el._id) == -1
            );

            try {
                // A student may not be generated without an advanced standing. Generate a new one.
                expect(standinglessStudent).to.be.ok;
                next([{recipient: standinglessStudent._id.toString()}, []]);
            } catch(err) {
                //Create a new student without an advanced standing with which to do the test
                Common.Generators.generateStudent(0, (err, model) => {
                    next([{recipient: model._id.toString()}, []]);
                });
            }
        }, "Search for a standing by a student without an advanced standing");

        Common.Tests.GetTests.getByID("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            next(Common.DBElements.standingList[faker.random.number(Common.DBElements.standingList.length - 1)]);
        });

        Common.Tests.GetTests.getByID("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            next(new AdvancedStandings({}));
        }, "This ID does not exist, should 404.");
    });

    describe('/PUT functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PutTests.putUpdated("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            // Get a random standing and make random updates
            let advStand = Common.DBElements.standingList[faker.random.number(Common.DBElements.standingList.length - 1)];
            let updates = {
                course: faker.random.words(1),
                description: faker.random.words(5),
                units: faker.random.number(100)/50,
                grade: faker.random.number(100),
                from: faker.random.word(),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => advStand[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, advStand]);
        }, ['recipient']);

        Common.Tests.PutTests.putUpdated("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            // Get a random standing and make random updates
            let advStand = Common.DBElements.standingList[faker.random.number(Common.DBElements.standingList.length - 1)];
            let updates = {
                course: faker.random.words(1),
                description: faker.random.words(5),
                units: faker.random.number(100)/50,
                grade: faker.random.number(100),
                from: faker.random.word(),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => advStand[key] = updates[key]);

            // Try to change the id
            updates._id = mongoose.Types.ObjectId();

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, advStand]);
        }, ['recipient'], "This should succeed and ignore attempted ID change.");

        Common.Tests.PutTests.putUpdated("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            // Get a random standing and make random updates
            let advStand = Common.DBElements.standingList[faker.random.number(Common.DBElements.standingList.length - 1)];
            let updates = {
                course: faker.random.words(1),
                description: faker.random.words(5),
                units: faker.random.number(100)/50,
                grade: faker.random.number(100),
                from: faker.random.word()
            };
            // Update the object with the new random values
            Object.keys(updates).forEach(key => advStand[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, advStand]);
        }, ['recipient'], "Missing recipient, this should 400.");

        Common.Tests.PutTests.putUpdated("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            // Get a random standing and make random updates
            let updates = {
                course: faker.random.words(1),
                description: faker.random.words(5),
                units: faker.random.number(100)/50,
                grade: faker.random.number(100),
                from: faker.random.word(),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };
            let advStand = new AdvancedStandings(updates);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, advStand]);
        }, ['recipient'], "This standing does not exist yet, this should 404.");
    });

    describe('/POST functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PostTests.postNew("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            // Get a random standing and make random updates
            let newContent = {
                course: faker.random.words(1),
                description: faker.random.words(5),
                units: faker.random.number(100)/50,
                grade: faker.random.number(100),
                from: faker.random.word(),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };
            let advStand = new AdvancedStandings(newContent);
            next([newContent, advStand])
        }, ['recipient']);

        Common.Tests.PostTests.postNew("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            // Get a random standing and make random updates
            let newContent = {
                course: faker.random.words(1),
                description: faker.random.words(5),
                units: faker.random.number(100)/50,
                grade: faker.random.number(100),
                from: faker.random.word(),
                recipient: null
            };
            let advStand = new AdvancedStandings(newContent);
            next([newContent, advStand])
        }, ['recipient'], "Missing recipient, this should 400.");

        let idFerry = null;

        Common.Tests.PostTests.postNew("advancedStanding", "advancedStandings", AdvancedStandings,function(next) {
            let award = Common.DBElements.standingList[faker.random.number(Common.DBElements.standingList.length - 1)];
            let awardObj = {};
            Object.keys(AdvancedStandings.schema.obj).forEach(el => awardObj[el] = award[el]);
            awardObj.recipient = award.recipient.toString();
            awardObj._id = award._id;
            idFerry = award._id;

            next([awardObj, award]);
        }, ['recipient'], "POSTing a record with an ID that already exists. Should ignore the new ID.", function(next, res) {
            // Make sure the ID is different
            expect (res.body.advancedStanding._id).to.not.equal(idFerry.toString());

            // Make sure the creation was successful anyways
            AdvancedStandings.findById(res.body.advancedStanding._id, function (err, results) {
                expect(err).to.be.null;
                expect(results).to.not.be.null;
                next();
            });
        });
    });

    describe('/DELETE functions', function(){
        beforeEach(Common.regenAllData);

        Common.Tests.DeleteTests.deleteExisting("advancedStanding", "advancedStandings", AdvancedStandings, function(next){
            next(Common.DBElements.standingList[faker.random.number(Common.DBElements.standingList.length - 1)]._id);
        });

        Common.Tests.DeleteTests.deleteNonexistent("advancedStanding", "advancedStandings", AdvancedStandings, function(next) {
            next(mongoose.Types.ObjectId());
        });
    });
});
