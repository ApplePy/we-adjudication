//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Students = require('../models/schemas/studentinfo/studentSchema');
let Awards = require('../models/schemas/studentinfo/awardSchema');
let AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');
let Genders = require('../models/schemas/studentinfo/genderSchema');
let Residencies = require('../models/schemas/studentinfo/residencySchema');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let expect = chai.expect;

chai.use(chaiHttp);

// Our parent block - stores the test
describe('Students', () => {
    let host = "http://localhost:3700";     // This is the Node.js server

    //Before each test we empty the database
    beforeEach((done) => {
        // Clear out all Genders, Residences and Students then call done
        Genders.remove({}, (err) => {
            if (err) throw "Error cleaning out Genders";
            Residencies.remove({}, (err) => {
                if (err) throw "Error cleaning out Residencies";
                Students.remove({}, (err) => {
                    if (err) throw "Error cleaning out Students";
                    Awards.remove({}, (err) => {
                        if (err) throw "Error cleaning out Awards";
                        AdvancedStandings.remove({}, (err) => {
                            if (err) throw "Error cleaning out Advanced Standings";
                            done()
                        });
                    });
                });
            });
        });
    });

    /*
     * Test the /GET routes
     */
    describe('/GET students', () => {
        it('it should GET all students ', (done) => {
            // Request all students
            chai.request(server)
                .get('/api/students')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('student');
                    expect(res.body.student.length).to.be.eq(0);
                    done();
                });
        });

        it('it should GET 5 students starting with the second', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;


            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
               if (err) throw err;
            });

            let firstNumber = 594265372;
            var studentData = {
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            // Create 15 students
            var count = 0;
            for (var num = 0; num < 15; num++) {
                studentData.number = firstNumber + num;
                let testStudent = new Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    // Start testing once all students are created
                    if (++count == 15) {
                        // Make request
                        chai.request(server)
                            .get('/api/students')
                            .query({limit: 5, offset: 1})
                            .end((err, res) => {
                                expect(res).to.have.status(200);
                                expect(res).to.be.json;
                                expect(res.body).to.have.property('student');
                                expect(res.body.student.length).to.be.eq(5);
                                for (var num = 0; num < 5; num++) {
                                    // Can't test student number, since order is not assured.
                                    //expect(res.body.student[num].number).to.equal(firstNumber + num + 1);
                                    expect(res.body.student[num].firstName).to.equal(studentData.firstName);
                                    expect(res.body.student[num].lastName).to.equal(studentData.lastName);
                                    expect(res.body.student[num].genderInfo).to.equal(testGender._id.toString());
                                    expect(res.body.student[num].DOB).to.equal(studentData.DOB);
                                    expect(res.body.student[num].photo).to.equal(studentData.photo);
                                    expect(res.body.student[num].registrationComments).to.equal(studentData.registrationComments);
                                    expect(res.body.student[num].basisOfAdmission).to.equal(studentData.basisOfAdmission);
                                    expect(res.body.student[num].admissionAverage).to.equal(studentData.admissionAverage);
                                    expect(res.body.student[num].admissionComments).to.equal(studentData.admissionComments);
                                    expect(res.body.student[num].resInfo).to.equal(testRes._id.toString());
                                    expect(res.body.student[num].awards.length).to.be.eq(0);
                                    expect(res.body.student[num].advancedStandings.length).to.be.eq(0);
                                }
                                done();
                            });
                    }
                });
            }
        });

        it('it should GET a student by number', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            let firstNumber = 594265372;
            var studentData = {
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            // Create 15 students
            var count = 0;
            for (var num = 0; num < 15; num++) {
                studentData.number = firstNumber + num;
                let testStudent = new Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    // Start testing once all students are created
                    if (++count == 15) {
                        // Make request
                        chai.request(server)
                            .get('/api/students')
                            .query({filter: {number: firstNumber + 3}})
                            .end((err, res) => {
                                expect(res).to.have.status(200);
                                expect(res).to.be.json;
                                expect(res.body).to.have.property('student');
                                expect(res.body.student.length).to.be.eq(1);
                                expect(res.body.student[0].number).to.equal(firstNumber + 3);
                                expect(res.body.student[0].firstName).to.equal(studentData.firstName);
                                expect(res.body.student[0].lastName).to.equal(studentData.lastName);
                                expect(res.body.student[0].genderInfo).to.equal(testGender._id.toString());
                                expect(res.body.student[0].DOB).to.equal(studentData.DOB);
                                expect(res.body.student[0].photo).to.equal(studentData.photo);
                                expect(res.body.student[0].registrationComments).to.equal(studentData.registrationComments);
                                expect(res.body.student[0].basisOfAdmission).to.equal(studentData.basisOfAdmission);
                                expect(res.body.student[0].admissionAverage).to.equal(studentData.admissionAverage);
                                expect(res.body.student[0].admissionComments).to.equal(studentData.admissionComments);
                                expect(res.body.student[0].resInfo).to.equal(testRes._id.toString());
                                expect(res.body.student[0].awards.length).to.be.eq(0);
                                expect(res.body.student[0].advancedStandings.length).to.be.eq(0);
                                done();
                            });
                    }
                });
            }
        });

        it('it should GET nothing if student does not exist', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            let firstNumber = 594265372;
            var studentData = {
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            // Create 15 students
            var count = 0;
            for (var num = 0; num < 15; num++) {
                studentData.number = firstNumber + num;
                let testStudent = new Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    // Start testing once all students are created
                    if (++count == 15) {
                        // Make residency request
                        chai.request(server)
                            .get('/api/students')
                            .query({filter: {number: 102}})
                            .end((err, res) => {
                                expect(res).to.have.status(200);
                                expect(res).to.be.json;
                                expect(res.body).to.have.property('student');
                                expect(res.body.student.length).to.be.eq(0);
                                done();
                            });
                    }
                });
            }
        });

        it('it should GET student when given ID', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            let firstNumber = 594265372;
            var studentData = {
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            // Create 14 students
            var count = 0;
            for (var num = 0; num < 14; num++) {
                studentData.number = firstNumber + num;
                let testStudent = new Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    // Start testing once all students are created
                    if (++count == 14) {
                        // Create last student
                        studentData.number = firstNumber + 14;
                        let testStudent = new Students(studentData);
                        testStudent.save((err) => {
                            if (err) throw err;

                            // Make request
                            chai.request(server)
                                .get('/api/students/' + testStudent._id.toString())
                                .end((err, res) => {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property('student');
                                    expect(res.body.student.number).to.equal(firstNumber + 14);
                                    expect(res.body.student.firstName).to.equal(studentData.firstName);
                                    expect(res.body.student.lastName).to.equal(studentData.lastName);
                                    expect(res.body.student.genderInfo).to.equal(testGender._id.toString());
                                    expect(res.body.student.DOB).to.equal(studentData.DOB);
                                    expect(res.body.student.photo).to.equal(studentData.photo);
                                    expect(res.body.student.registrationComments).to.equal(studentData.registrationComments);
                                    expect(res.body.student.basisOfAdmission).to.equal(studentData.basisOfAdmission);
                                    expect(res.body.student.admissionAverage).to.equal(studentData.admissionAverage);
                                    expect(res.body.student.admissionComments).to.equal(studentData.admissionComments);
                                    expect(res.body.student.resInfo).to.equal(testRes._id.toString());
                                    expect(res.body.student.awards.length).to.be.eq(0);
                                    expect(res.body.student.advancedStandings.length).to.be.eq(0);
                                    done();
                                });
                        });
                    }
                });
            }
        });

        it('it should 404 for residency when given bad ID', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            let firstNumber = 594265372;
            var studentData = {
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            // Create 15 students
            var count = 0;
            for (var num = 0; num < 15; num++) {
                studentData.number = firstNumber + num;
                let testStudent = new Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    // Start testing once all students are created
                    if (++count == 15) {
                        // Make request
                        chai.request(server)
                            .get('/api/students/453535')
                            .end((err, res) => {
                                expect(res).to.have.status(404);
                                done();
                            });
                    }
                });
            }
        });
    });

    /*
     * Test the /PUT routes
     */
    describe('/PUT students', () => {
        it('it should PUT an updated student', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            let testGender2 = new Genders({name: "Female"});
            testGender2.save((err) => {
                if (err) throw err;
            });

            let firstNumber = 594265372;
            var studentData = {
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            // Create first student
            studentData.number = firstNumber;
            let testStudent = new Students(studentData);
            testStudent.save((err) => {
                if (err) throw err;

                // Create 14 students
                var count = 0;
                for (var num = 1; num < 15; num++) {
                    studentData.number = firstNumber + num;
                    let otherStudent = new Students(studentData);
                    otherStudent.save((err) => {
                        if (err) throw err;

                        // Start testing once all students are created
                        if (++count == 14) {
                            // Modify data
                            studentData = {
                                number: firstNumber,
                                firstName: "Tester",
                                lastName: "Tester",
                                genderInfo: testGender2,
                                DOB: new Date().toISOString(),
                                photo: "/some/link/new",
                                registrationComments: "No other comment",
                                basisOfAdmission: "Because 2",
                                admissionAverage: 91,
                                admissionComments: "None2",
                                resInfo: null
                            };

                            // Make request
                            chai.request(server)
                                .put('/api/students/' + testStudent._id.toString())
                                .send({student: studentData})
                                .end((err, res) => {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property('student');
                                    expect(res.body.student.number).to.equal(firstNumber);
                                    expect(res.body.student.firstName).to.equal(studentData.firstName);
                                    expect(res.body.student.lastName).to.equal(studentData.lastName);
                                    expect(res.body.student.genderInfo).to.equal(studentData.genderInfo._id.toString());
                                    expect(res.body.student.DOB).to.equal(studentData.DOB);
                                    expect(res.body.student.photo).to.equal(studentData.photo);
                                    expect(res.body.student.registrationComments).to.equal(studentData.registrationComments);
                                    expect(res.body.student.basisOfAdmission).to.equal(studentData.basisOfAdmission);
                                    expect(res.body.student.admissionAverage).to.equal(studentData.admissionAverage);
                                    expect(res.body.student.admissionComments).to.equal(studentData.admissionComments);
                                    expect(res.body.student.resInfo).to.be.null;

                                    // Test mongo to ensure it was written
                                    Students.findById(testStudent._id, (error, res) => {
                                        expect(error || res.length === 0).to.be.false;
                                        expect(res.number).to.equal(firstNumber);
                                        expect(res.firstName).to.equal(studentData.firstName);
                                        expect(res.lastName).to.equal(studentData.lastName);
                                        expect(res.genderInfo.toString()).to.equal(studentData.genderInfo._id.toString());
                                        expect(res.DOB.toISOString()).to.equal(studentData.DOB);
                                        expect(res.photo).to.equal(studentData.photo);
                                        expect(res.registrationComments).to.equal(studentData.registrationComments);
                                        expect(res.basisOfAdmission).to.equal(studentData.basisOfAdmission);
                                        expect(res.admissionAverage).to.equal(studentData.admissionAverage);
                                        expect(res.admissionComments).to.equal(studentData.admissionComments);
                                        expect(res.resInfo).to.be.null;
                                        done();
                                    });
                                });
                        }
                    });
                }
            });
        });

        it('it should 500 on PUT a student with duplicate number', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            let firstNumber = 594265372;
            var studentData = {
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            // Create first student
            studentData.number = firstNumber;
            let testStudent = new Students(studentData);
            testStudent.save((err) => {
                if (err) throw err;

                // Create 14 students
                var count = 0;
                for (var num = 1; num < 15; num++) {
                    studentData.number = firstNumber + num;
                    let otherStudent = new Students(studentData);
                    otherStudent.save((err) => {
                        if (err) throw err;

                        // Start testing once all students are created
                        if (++count == 14) {
                            // Modify data
                            studentData.number = firstNumber + 4;

                            // Make request
                            chai.request(server)
                                .put('/api/students/' + testStudent._id.toString())
                                .send({student: studentData})
                                .end((err, res) => {
                                    expect(res).to.have.status(500);

                                    // Test mongo to ensure nothing was written
                                    Students.findById(testStudent._id, (error, res) => {
                                        expect(error || res.length === 0).to.be.false;
                                        expect(res.number).to.equal(firstNumber);
                                        expect(res.firstName).to.equal(studentData.firstName);
                                        expect(res.lastName).to.equal(studentData.lastName);
                                        expect(res.genderInfo.toString()).to.equal(testGender._id.toString());
                                        expect(res.DOB.toISOString()).to.equal(studentData.DOB);
                                        expect(res.photo).to.equal(studentData.photo);
                                        expect(res.registrationComments).to.equal(studentData.registrationComments);
                                        expect(res.basisOfAdmission).to.equal(studentData.basisOfAdmission);
                                        expect(res.admissionAverage).to.equal(studentData.admissionAverage);
                                        expect(res.admissionComments).to.equal(studentData.admissionComments);
                                        expect(res.resInfo.toString()).to.equal(testRes._id.toString());
                                        done();
                                    });
                                });
                        }
                    });
                }
            });
        });

        it('it should 404 on PUT a nonexistent student', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            let firstNumber = 594265372;
            var studentData = {
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            // Create 15 students
            var count = 0;
            for (var num = 0; num < 15; num++) {
                studentData.number = firstNumber + num;
                let testStudent = new Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    // Start testing once all students are created
                    if (++count == 15) {
                        // Make request
                        chai.request(server)
                            .put('/api/students/' + '4534234')
                            .send({student: studentData})
                            .end((err, res) => {
                                expect(res).to.have.status(404);
                                done();
                            });
                    }
                });
            }
        });
    });

    /*
     * Test the /POST routes
     */
    describe('/POST a student', () => {
        it('it should POST successfully', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            var studentData = {
                number: 594265372,
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes._id.toString()
            };

            // Make request
            chai.request(server)
                .post('/api/students')
                .send({student: studentData})
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('student');
                    expect(res.body.student.number).to.equal(studentData.number);
                    expect(res.body.student.firstName).to.equal(studentData.firstName);
                    expect(res.body.student.lastName).to.equal(studentData.lastName);
                    expect(res.body.student.genderInfo).to.equal(testGender._id.toString());
                    expect(res.body.student.DOB).to.equal(studentData.DOB);
                    expect(res.body.student.photo).to.equal(studentData.photo);
                    expect(res.body.student.registrationComments).to.equal(studentData.registrationComments);
                    expect(res.body.student.basisOfAdmission).to.equal(studentData.basisOfAdmission);
                    expect(res.body.student.admissionAverage).to.equal(studentData.admissionAverage);
                    expect(res.body.student.admissionComments).to.equal(studentData.admissionComments);
                    expect(res.body.student.resInfo).to.equal(testRes._id.toString());

                    // Check underlying database
                    Students.findById(res.body.student._id, function (error, student) {
                        expect(error).to.be.null;
                        expect(student).to.not.be.null;
                        expect(student.number).to.equal(studentData.number);
                        expect(student.firstName).to.equal(studentData.firstName);
                        expect(student.lastName).to.equal(studentData.lastName);
                        expect(student.genderInfo.toString()).to.equal(testGender._id.toString());
                        expect(student.DOB.toISOString()).to.equal(studentData.DOB);
                        expect(student.photo).to.equal(studentData.photo);
                        expect(student.registrationComments).to.equal(studentData.registrationComments);
                        expect(student.basisOfAdmission).to.equal(studentData.basisOfAdmission);
                        expect(student.admissionAverage).to.equal(studentData.admissionAverage);
                        expect(student.admissionComments).to.equal(studentData.admissionComments);
                        expect(student.resInfo.toString()).to.equal(testRes._id.toString());

                        done();
                    });
                });
        });

        it('it should 500 on POST of student with duplicate number', (done) => {

            // Set up mock data
            let testRes = new Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            var studentData = {
                number: 594265372,
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes._id.toString()
            };
            let testStudent = new Students(studentData);
            testStudent.save((err) => {
                if (err) throw err;
                
                // Modify data
                studentData.firstName = "Josh";
                
                // Make request
                chai.request(server)
                    .post('/api/students')
                    .send({student: studentData})
                    .end((err, res) => {
                        expect(res).to.have.status(500);
                        done();
                    });
            });
        });

    });

    /*
     * Test the /DELETE routes
     */
    describe('/DELETE a student', () => {
        it('it should DELETE successfully and delete linked awards and advanced standings', (done) => {

            let testGender = new Genders({name: "Male"});
            testGender.save((err) => {
                if (err) throw err;
            });

            // Set up mock data
            var studentData = {
                number: 594265372,
                firstName: "Johnny",
                lastName: "Test",
                genderInfo: testGender,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None"
            };
            let testStudent = new Students(studentData);
            testStudent.save((err) => {
                if (err) throw err;

                var awardData = {
                    note: "test",
                    recipient: testStudent
                };
                let testAward = new Awards(awardData);
                testAward.save((err) => {
                   if (err) throw err;

                    var standingData = {
                        course: "BASKWV 1000",
                        description: "Basket weaving",
                        grade: 100,
                        from: "UBC",
                        recipient: testStudent
                    };
                    let testStanding = new AdvancedStandings(standingData);
                    testStanding.save((err) => {
                        if (err) throw err;

                        // Make request
                        chai.request(server)
                            .delete('/api/students/' + testStudent._id.toString())
                            .end((err, res) => {
                                expect(res).to.have.status(200);

                                // Check underlying database
                                Students.findById(testStudent._id, function (error, student) {
                                    expect(error).to.be.null;
                                    expect(student).to.be.null;

                                    Awards.findById(testAward._id, function(error, award) {
                                       expect(error).to.be.null;
                                       expect(award).to.be.null;

                                       AdvancedStandings.findById(testStanding._id, function(error, standing) {
                                          expect(error).to.be.null;
                                          expect(standing).to.be.null;

                                          done();
                                       });
                                    });
                                });
                            });
                    });
                });
            });
        });

    });

});