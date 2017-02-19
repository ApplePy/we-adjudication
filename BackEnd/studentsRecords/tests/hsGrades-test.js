/**
 * Created by darryl on 2017-02-18.
 */
process.env.NODE_ENV = 'test';

let faker = require('faker');
let Common = require('./genericTestFramework-helper');
let chai = Common.chai;
let expect = chai.expect;

let DB = require('../models/studentsRecordsDB');
let mongoose = DB.mongoose;

let HSGrades = require('../models/schemas/highschool/hsGradeSchema');


////////

// NOTE: remember to not use () => {} functions inside mocha tests due to the 'this' binding - it breaks Mocha!

////////


describe('HSGrades', function() {

    describe('/GET functions', function() {
        before(Common.regenAllData);

        Common.Tests.GetTests.getAll("hsGrade", "hsGrades", HSGrades, Common.DBElements.hsGradeList, function() {
            let limit = Common.DBElements.hsGradeList.length;
            return {offset: 0, limit: limit};
        });

        let gradeFerry = null;

        Common.Tests.GetTests.getByFilterSuccess("hsGrade", "hsGrades", HSGrades, function(next) {
            // Pick student
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            let grades = Common.DBElements.hsGradeList.filter((el) => el.recipient == student._id);

            // Copy the grades over to the gradeFerry to be accessible to the queryOperand
            gradeFerry = grades;

            next([{recipient: student._id.toString()}, grades]);
        }, "Search by student", function() {
            return {offset: 0, limit: gradeFerry.length};
        });

        Common.Tests.GetTests.getByFilterSuccess("hsGrade", "hsGrades", HSGrades, function(next) {
            // Pick random hsGrade for data
            let hsGrade = Common.DBElements.hsGradeList[faker.random.number(Common.DBElements.hsGradeList.length - 1)];
            let matching = Common.DBElements.hsGradeList.filter((el) => el.note == hsGrade.note);

            // Copy the matching array over to the ferry to be accessible to the queryOperand
            gradeFerry = matching;

            next([{note: hsGrade.note}, matching]);
        }, "Search by 'note'", function() {
            return {offset: 0, limit: gradeFerry.length};
        });

        Common.Tests.GetTests.getByFilterSuccess("hsGrade", "hsGrades", HSGrades, function(next) {
            next([{grade: {$gt: 90}}, Common.DBElements.hsGradeList.filter((el) => el.grade > 90)]);
        }, "Search by minimum grade above 90");

        Common.Tests.GetTests.getByFilterSuccess("hsGrade", "hsGrades", HSGrades, function(next) {
            let hsGradelessStudent = Common.DBElements.studentList.find(
                el => Common.DBElements.hsGradeList.findIndex(el2 => el2.recipient == el._id) == -1
            );

            try {
                // A student may not be generated without an hsGrade. Generate a new one.
                expect(hsGradelessStudent).to.be.ok;
                next([{recipient: hsGradelessStudent._id.toString()}, []]);
            } catch(err) {
                //Create a new student without an hsGrade with which to do the test
                Common.Generators.generateStudent(0, (err, model) => {
                    next([{recipient: model._id.toString()}, []]);
                });
            }
        }, "Search for a hsGrade by a student without an hsGrade");

        Common.Tests.GetTests.getByID("hsGrade", "hsGrades", HSGrades, function(next) {
            next(Common.DBElements.hsGradeList[faker.random.number(Common.DBElements.hsGradeList.length - 1)]);
        }, "This should succeed.");

        Common.Tests.GetTests.getByID("hsGrade", "hsGrades", HSGrades, function(next) {
            next(new HSGrades({}));
        }, "This ID does not exist, should 404.");
    });

    describe('/PUT functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PutTests.putUpdated("hsGrade", "hsGrades", HSGrades, function(next) {
            // Get a random hsGrade and make random updates
            let hsGrade = Common.DBElements.hsGradeList[faker.random.number(Common.DBElements.hsGradeList.length - 1)];
            let updates = {
                mark: faker.random.number(100),
                note: faker.random.words(5),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => hsGrade[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, hsGrade]);
        }, ['mark', 'recipient']);

        Common.Tests.PutTests.putUpdated("hsGrade", "hsGrades", HSGrades, function(next) {
            // Get a random hsGrade and make random updates
            let hsGrade = Common.DBElements.hsGradeList[faker.random.number(Common.DBElements.hsGradeList.length - 1)];
            let updates = {
                mark: faker.random.number(100),
                note: faker.random.words(10),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => hsGrade[key] = updates[key]);

            // Try to change the id
            updates._id = mongoose.Types.ObjectId();

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, hsGrade]);
        }, ['mark', 'recipient'], "This should succeed and ignore attempted ID change.");

        Common.Tests.PutTests.putUpdated("hsGrade", "hsGrades", HSGrades, function(next) {
            // Get a random hsGrade and make random updates
            let hsGrade = Common.DBElements.hsGradeList[faker.random.number(Common.DBElements.hsGradeList.length - 1)];
            let updates = {
                mark: faker.random.number(100),
                note: faker.random.words(10)
            };
            // Update the object with the new random values
            Object.keys(updates).forEach(key => hsGrade[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, hsGrade]);
        }, ['mark', 'recipient'], "Missing recipient, this should 400.");

        Common.Tests.PutTests.putUpdated("hsGrade", "hsGrades", HSGrades, function(next) {
            // Get a random hsGrade and make random updates
            let hsGrade = Common.DBElements.hsGradeList[faker.random.number(Common.DBElements.hsGradeList.length - 1)];
            let updates = {
                note: faker.random.words(10),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };
            // Update the object with the new random values
            Object.keys(updates).forEach(key => hsGrade[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, hsGrade]);
        }, ['mark', 'recipient'], "Missing mark, this should 400.");

        Common.Tests.PutTests.putUpdated("hsGrade", "hsGrades", HSGrades, function(next) {
            // Get a random hsGrade and make random updates
            let updates = {
                mark: faker.random.number(100),
                note: faker.random.words(10),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };
            let hsGrade = new HSGrades(updates);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, hsGrade]);
        }, ['mark', 'recipient'], "This hsGrade does not exist yet, this should 404.");
    });

    describe('/POST functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PostTests.postNew("hsGrade", "hsGrades", HSGrades, function(next) {
            // Get a random hsGrade and make random updates
            let newContent = {
                mark: faker.random.number(100),
                note: faker.random.words(10),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };
            let hsGrade = new HSGrades(newContent);
            next([newContent, hsGrade])
        }, ['mark', 'recipient']);

        Common.Tests.PostTests.postNew("hsGrade", "hsGrades", HSGrades, function(next) {
            // Get a random hsGrade and make random updates
            let newContent = {
                mark: faker.random.number(100),
                note: faker.random.words(5),
                recipient: null
            };
            let hsGrade = new HSGrades(newContent);
            next([newContent, hsGrade])
        }, ['mark', 'recipient'], "Missing recipient, this should 400.");

        Common.Tests.PostTests.postNew("hsGrade", "hsGrades", HSGrades, function(next) {
            // Get a random hsGrade and make random updates
            let newContent = {
                mark: null,
                note: faker.random.words(5),
                recipient: Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]._id
            };
            let hsGrade = new HSGrades(newContent);
            next([newContent, hsGrade])
        }, ['mark', 'recipient'], "Missing mark, this should 400.");

        let idFerry = null;

        Common.Tests.PostTests.postNew("hsGrade", "hsGrades", HSGrades,function(next) {
                let hsGrade = Common.DBElements.hsGradeList[faker.random.number(Common.DBElements.hsGradeList.length - 1)];
                let hsGradeObj = {};
                Object.keys(HSGrades.schema.obj).forEach(el => hsGradeObj[el] = hsGrade[el]);
                hsGradeObj.recipient = hsGrade.recipient.toString();
                hsGradeObj._id = hsGrade._id;
                idFerry = hsGrade._id;

                next([hsGradeObj, hsGrade]);
            }, ['mark', 'recipient'], "POSTing a record with an ID that already exists. Should ignore the new ID.",
            function(next, res) {
                // Make sure the ID is different
                expect (res.body.hsGrade._id).to.not.equal(idFerry.toString());

                // Make sure the creation was successful anyways
                HSGrades.findById(res.body.hsGrade._id, function (err, results) {
                    expect(err).to.be.null;
                    expect(results).to.not.be.null;
                    next();
                });
            });
    });

    describe('/DELETE functions', function(){
        beforeEach(Common.regenAllData);

        Common.Tests.DeleteTests.deleteExisting("hsGrade", "hsGrades", HSGrades, function(next){
            next(Common.DBElements.hsGradeList[faker.random.number(Common.DBElements.hsGradeList.length - 1)]._id);
        });

        Common.Tests.DeleteTests.deleteNonexistent("hsGrade", "hsGrades", HSGrades, function(next) {
            next(mongoose.Types.ObjectId());
        });
    });

});

