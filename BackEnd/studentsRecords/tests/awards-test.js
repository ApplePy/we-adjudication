let DB = require('../models/studentsRecordsDB');
let mongoose = DB.mongoose;

let Awards = require('../models/schemas/studentinfo/awardSchema');

let faker = require('faker');
let Common = require('./genericTestFramework-helper');
let chai = Common.chai;
let expect = chai.expect;


////////

// NOTE: remember to not use () => {} functions inside mocha tests due to the 'this' binding - it breaks Mocha!

////////


describe('Awards', function() {

    describe('/GET functions', function() {
        before(Common.regenAllData);

        Common.Tests.GetTests.getAll("award", "awards", Awards, Common.DBElements.awardList);

        Common.Tests.GetTests.getByFilterSuccess("award", "awards", Awards, function(next) {
            // Pick student
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            next([{recipient: student._id.toString()}, Common.DBElements.awardList.filter((el) => el.recipient == student._id)]);
        }, "Search by student");

        Common.Tests.GetTests.getByFilterSuccess("award", "awards", Awards, function(next) {
            // Pick random award for data
            let award = Common.DBElements.awardList[faker.random.number(Common.DBElements.awardList.length - 1)];
            next([{note: award.note}, Common.DBElements.awardList.filter((el) => el.note == award.note)]);
        }, "Search by 'note'");

        Common.Tests.GetTests.getByFilterSuccess("award", "awards", Awards, function(next) {
            next([{grade: {$gt: 90}}, Common.DBElements.awardList.filter((el) => el.grade > 90)]);
        }, "Search by minimum grade above 90");

        Common.Tests.GetTests.getByFilterSuccess("award", "awards", Awards, function(next) {
            let awardlessStudent = Common.DBElements.studentList.find(
                el => Common.DBElements.awardList.findIndex(el2 => el2.recipient == el._id) == -1
            );

            try {
                // A student may not be generated without an award. Generate a new one.
                expect(awardlessStudent).to.be.ok;
                next([{recipient: awardlessStudent._id.toString()}, []]);
            } catch(err) {
                //Create a new student without an award with which to do the test
                Common.Generators.generateStudent(0, (err, model) => {
                    next([{recipient: model._id.toString()}, []]);
                });
            }
        }, "Search for a award by a student without an award");

        Common.Tests.GetTests.getByID("award", "awards", Awards, function(next) {
            next(Common.DBElements.awardList[faker.random.number(Common.DBElements.awardList.length - 1)]);
        }, "This should succeed.");

        Common.Tests.GetTests.getByID("award", "awards", Awards, function(next) {
            next(new Awards({}));
        }, "This ID does not exist, should 404.");
    });

    describe('/PUT functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PutTests.putUpdated("award", "awards", Awards, function(next) {
            // Get a random award and make random updates
            let award = Common.DBElements.awardList[faker.random.number(Common.DBElements.awardList.length - 1)];
            let updates = {
                note: faker.random.words(5),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => award[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, award]);
        }, ['recipient']);

        Common.Tests.PutTests.putUpdated("award", "awards", Awards, function(next) {
            // Get a random award and make random updates
            let award = Common.DBElements.awardList[faker.random.number(Common.DBElements.awardList.length - 1)];
            let updates = {
                note: faker.random.words(10),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => award[key] = updates[key]);

            // Try to change the id
            updates._id = mongoose.Types.ObjectId();

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, award]);
        }, ['recipient'], "This should succeed and ignore attempted ID change.");

        Common.Tests.PutTests.putUpdated("award", "awards", Awards, function(next) {
            // Get a random award and make random updates
            let award = Common.DBElements.awardList[faker.random.number(Common.DBElements.awardList.length - 1)];
            let updates = {
                course: faker.random.words(1),
                description: faker.random.words(5),
                units: faker.random.number(100)/50,
                grade: faker.random.number(100),
                from: faker.random.word()
            };
            // Update the object with the new random values
            Object.keys(updates).forEach(key => award[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, award]);
        }, ['recipient'], "Missing recipient, this should 400.");

        Common.Tests.PutTests.putUpdated("award", "awards", Awards, function(next) {
            // Get a random award and make random updates
            let updates = {
                note: faker.random.words(10),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };
            let award = new Awards(updates);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, award]);
        }, ['recipient'], "This award does not exist yet, this should 404.");
    });

    describe('/POST functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PostTests.postNew("award", "awards", Awards, function(next) {
            // Get a random award and make random updates
            let newContent = {
                note: faker.random.words(10),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };
            let award = new Awards(newContent);
            next([newContent, award])
        }, ['recipient']);

        Common.Tests.PostTests.postNew("award", "awards", Awards, function(next) {
            // Get a random award and make random updates
            let newContent = {
                note: faker.random.words(5),
                recipient: null
            };
            let award = new Awards(newContent);
            next([newContent, award])
        }, ['recipient'], "Missing recipient, this should 400.");

        let idFerry = null;

        Common.Tests.PostTests.postNew("award", "awards", Awards,function(next) {
            let award = Common.DBElements.awardList[faker.random.number(Common.DBElements.awardList.length - 1)];
            let awardObj = {};
            Object.keys(Awards.schema.obj).forEach(el => awardObj[el] = award[el]);
            awardObj.recipient = award.recipient.toString();
            awardObj._id = award._id;
            idFerry = award._id;

            next([awardObj, award]);
        }, ['recipient'], "POSTing a record with an ID that already exists. Should ignore the new ID.",
            function(next, res) {
            // Make sure the ID is different
            expect (res.body.award._id).to.not.equal(idFerry.toString());

            // Make sure the creation was successful anyways
            Awards.findById(res.body.award._id, function (err, results) {
                expect(err).to.be.null;
                expect(results).to.not.be.null;
                next();
            });
        });
    });

    describe('/DELETE functions', function(){
        beforeEach(Common.regenAllData);

        Common.Tests.DeleteTests.deleteExisting("award", "awards", Awards, function(next){
            next(Common.DBElements.awardList[faker.random.number(Common.DBElements.awardList.length - 1)]._id);
        });

        Common.Tests.DeleteTests.deleteNonexistent("award", "awards", Awards, function(next) {
            next(mongoose.Types.ObjectId());
        });
    });

});
