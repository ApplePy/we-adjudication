let DB = require('../models/studentsRecordsDB');
let mongoose = DB.mongoose;

let Students = require('../models/schemas/studentinfo/studentSchema');
let Awards = require('../models/schemas/studentinfo/awardSchema');
let AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');

let faker = require('faker');
let Common = require('./genericTestFramework-helper');
let chai = Common.chai;
let expect = chai.expect;


////////

// NOTE: remember to not use () => {} functions inside mocha tests due to the 'this' binding - it breaks Mocha!

////////


describe('Students', function() {

    describe('/GET functions', function() {
        before(Common.regenAllData);

        Common.Tests.GetTests.getAll("student", "students", Students, Common.DBElements.studentList, function() {
            let limit = Common.DBElements.studentList.length;
            return {offset: 0, limit: limit};
        });

        Common.Tests.GetTests.getPagination("student", "students", Students, Common.DBElements.studentList);

        Common.Tests.GetTests.getByFilterSuccess("student", "students", Students, function(next) {
            // Pick random student for data
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            next([{number: student.number}, Common.DBElements.studentList.filter((el) => el.number == student.number)]);
        }, "Search by 'number'");

        let studentFerry = null;

        Common.Tests.GetTests.getByFilterSuccess("student", "students", Students, function(next) {
            // Pick random student for data
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            studentFerry = student;
            next([{admissionAverage: student.admissionAverage}, Common.DBElements.studentList.filter((el) => el.admissionAverage == student.admissionAverage)]);
        }, "Search by 'admissionAverage'", function() {
            let limit = Common.DBElements.studentList.filter((el) => el.admissionAverage == studentFerry.admissionAverage).length;
            return {offset: 0, limit: limit};
        });

        Common.Tests.GetTests.getByFilterSuccess("student", "students", Students, function(next) {
            next([{number: faker.random.number(100000000, 999999999)}, []]);
        }, "Search for a nonexistent student");

        Common.Tests.GetTests.getByID("student", "students", Students, function(next) {
            next(Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)]);
        });

        Common.Tests.GetTests.getByID("student", "students", Students, function(next) {
            next(new Students({}));
        }, "This ID does not exist, should 404.");
    });

    describe('/PUT functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PutTests.putUpdated("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            let updates = {
                number: faker.random.number(100000000, 999999999),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => student[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, student]);
        }, ['number', 'resInfo', 'genderInfo']);

        Common.Tests.PutTests.putUpdated("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            let updates = {
                number: faker.random.number(100000000, 999999999),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };

            // Update the object with the new random values
            Object.keys(updates).forEach(key => student[key] = updates[key]);

            // Try to change the id
            updates._id = mongoose.Types.ObjectId();

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, student]);
        }, ['number', 'resInfo', 'genderInfo'], "This should succeed and ignore attempted ID change.");

        Common.Tests.PutTests.putNotUnique("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let student1 = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            let student2 = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];

            // Loop until students are different
            while (student1.number === student2.number) {
                student2 = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            }

            // Try to update to create a duplicate student
            student1.number = student2.number;

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([student1, student1._id]);
        }, ['number', 'resInfo', 'genderInfo'], "Posting with duplicate of a unique field, should 500.");

        Common.Tests.PutTests.putUpdated("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            let updates = {
                //number: faker.random.number(100000000, 999999999),
                number: null,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };
            // Update the object with the new random values
            Object.keys(updates).forEach(key => student[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, student]);
        }, ['number', 'resInfo', 'genderInfo'], "Missing number, this should 400.");

        Common.Tests.PutTests.putUpdated("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            let updates = {
                number: faker.random.number(100000000, 999999999),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: null
                //genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };
            // Update the object with the new random values
            Object.keys(updates).forEach(key => student[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, student]);
        }, ['number', 'resInfo', 'genderInfo'], "Missing genderInfo, this should 400.");

        Common.Tests.PutTests.putUpdated("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            let updates = {
                number: faker.random.number(100000000, 999999999),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: null,
                //resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };
            // Update the object with the new random values
            Object.keys(updates).forEach(key => student[key] = updates[key]);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, student]);
        }, ['number', 'resInfo', 'genderInfo'], "Missing resInfo, this should 400.");

        Common.Tests.PutTests.putUpdated("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let updates = {
                number: faker.random.number(100000000, 999999999),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };
            let student = new Students(updates);

            // Pass the updated object and the PUT contents to the tester to make sure the changes happen
            next([updates, student]);
        }, ['number', 'resInfo', 'genderInfo'], "This student does not exist yet, this should 404.");
    });

    describe('/POST functions', function() {
        beforeEach(Common.regenAllData);

        Common.Tests.PostTests.postNew("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let newContent = {
                number: faker.random.number(100000000, 999999999),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };
            let student = new Students(newContent);
            next([newContent, student])
        }, ['number', 'resInfo', 'genderInfo']);

        Common.Tests.PostTests.postNew("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let newContent = {
                //number: faker.random.number(100000000, 999999999),
                number: null,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };
            let student = new Students(newContent);
            next([newContent, student])
        }, ['number', 'resInfo', 'genderInfo'], "Missing number, this should 400.");

        Common.Tests.PostTests.postNew("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let newContent = {
                number: faker.random.number(100000000, 999999999),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: null,
                //resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };
            let student = new Students(newContent);
            next([newContent, student])
        }, ['number', 'resInfo', 'genderInfo'], "Missing resInfo, this should 400.");

        Common.Tests.PostTests.postNew("student", "students", Students, function(next) {
            // Get a random student and make random updates
            let newContent = {
                number: faker.random.number(100000000, 999999999),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                DOB: faker.date.past(),   // TODO: this is wrong format
                registrationComments: faker.lorem.paragraph(),
                basisOfAdmission: faker.lorem.paragraph(),
                admissionAverage: faker.random.number(100),
                admissionComments: faker.lorem.paragraph(),
                resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                genderInfo: null
                //genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
            };
            let student = new Students(newContent);
            next([newContent, student])
        }, ['number', 'resInfo', 'genderInfo'], "Missing genderInfo, this should 400.");

        let idFerry = null;

        Common.Tests.PostTests.postNew("student", "students", Students,function(next) {
                let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
                let studentObj = {
                    number: faker.random.number(100000000, 999999999),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    DOB: faker.date.past(),   // TODO: this is wrong format
                    registrationComments: faker.lorem.paragraph(),
                    basisOfAdmission: faker.lorem.paragraph(),
                    admissionAverage: faker.random.number(100),
                    admissionComments: faker.lorem.paragraph(),
                    resInfo: Common.DBElements.residencyList[faker.random.number(Common.DBElements.residencyList.length - 1)],
                    genderInfo: Common.DBElements.genderList[faker.random.number(Common.DBElements.genderList.length - 1)],
                };
                studentObj._id = student._id;
                idFerry = student._id;

                next([studentObj, student]);
            }, ['number', 'resInfo', 'genderInfo'], "POSTing a record with an ID that already exists. Should ignore the new ID.",
            function(next, res) {
                // Make sure the ID is different
                expect (res.body.student._id).to.not.equal(idFerry.toString());

                // Make sure the creation was successful anyways
                Students.findById(res.body.student._id, function (err, results) {
                    expect(err).to.be.null;
                    expect(results).to.not.be.null;
                    next();
                });
            });

        Common.Tests.PostTests.postNotUnique("student", "students", Students,function(next) {
            let student = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];

            next([student, student]);
        }, ['number', 'resInfo', 'genderInfo'], "POSTing a record with duplicate data, should 500.");
    });

    describe('/DELETE functions', function(){
        beforeEach(Common.regenAllData);

        let elementFerry = null;

        Common.Tests.DeleteTests.deleteExisting("student", "students", Students, function(next){
            elementFerry = Common.DBElements.studentList[faker.random.number(Common.DBElements.studentList.length - 1)];
            next(elementFerry._id);
        }, undefined, function(next, res) {
            // Check that all dependent objects got deassociated
            Awards.find({recipient: elementFerry._id}, (err, awards) => {
                expect(err).to.be.null;
                expect(awards).to.be.empty;
                AdvancedStandings.find({recipient: elementFerry._id}, (err, standings) => {
                    expect(err).to.be.null;
                    expect(standings).to.be.empty;
                    next();
                });
            });
        });

        Common.Tests.DeleteTests.deleteNonexistent("student", "students", Students, function(next) {
            next(mongoose.Types.ObjectId());
        });
    });

});
