//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Models = require('../models/studentsRecordsDB');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let expect = chai.expect;

chai.use(chaiHttp);

// Our parent block - stores the test
describe('Awards', () => {
    let host = "http://localhost:3700";     // This is the Node.js server

    //Before each test we empty the database
    beforeEach((done) => {
        // Clear out all Residences and Students then call done
        Models.Residencies.remove({}, (err) => {
            if (err) throw "Error cleaning out Residencies";
            Models.Students.remove({}, (err) => {
                if (err) throw "Error cleaning out Students";
                Models.Awards.remove({}, (err) => {
                    if (err) throw "Error cleaning out Awards";
                    Models.AdvancedStandings.remove({}, (err) => {
                        if (err) throw "Error cleaning out Advanced Standings";
                        done()
                    });
                });
            });
        });
    });

    /*
     * Test the /GET routes
     */
    describe('/GET awards', () => {
        it('it should GET all awards ', (done) => {
            // Request all awards
            chai.request(server)
                .get('/api/awards')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('award');
                    expect(res.body.award.length).to.be.eq(0);
                    done();
                });
        });

        it('it should GET all awards when created', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make awards for the students, then query for all
                var studentData = {
                    number: 594265372,
                    firstName: "Johnny",
                    lastName: "Test",
                    gender: 1,
                    DOB: new Date().toISOString(),
                    photo: "/some/link",
                    registrationComments: "No comment",
                    basisOfAdmission: "Because",
                    admissionAverage: 90,
                    admissionComments: "None",
                    resInfo: testRes
                };
                let testStudent = new Models.Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    var awardData = {
                        recipient: testStudent
                    };

                    // Create 15 awards
                    var count = 0;
                    for (var num = 0; num < 15; num++) {
                        awardData.note = num.toString();
                        let testAward = new Models.Awards(awardData);
                        testAward.save((err) => {
                            if (err) throw err;

                            // Start testing once all awards are created
                            if (++count == 15) {
                                // Make request
                                chai.request(server)
                                    .get('/api/awards')
                                    .end((err, res) => {
                                        expect(res).to.have.status(200);
                                        expect(res).to.be.json;
                                        expect(res.body).to.have.property('award');
                                        expect(res.body.award.length).to.be.eq(15);
                                        for (var num = 0; num < 15; num++) {
                                            // Cannot test note value, since there's no guarantee that they're in order
                                            expect(res.body.award[num].recipient).to.equal(testStudent._id.toString());
                                        }
                                        done();
                                    });
                            }
                        });
                    }
                });
            });
        });

        it('it should GET a award by recipient', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make awards for the students, then query for all
                var studentData = {
                    number: 594265372,
                    firstName: "Johnny",
                    lastName: "Test",
                    gender: 1,
                    DOB: new Date().toISOString(),
                    photo: "/some/link",
                    registrationComments: "No comment",
                    basisOfAdmission: "Because",
                    admissionAverage: 90,
                    admissionComments: "None",
                    resInfo: testRes
                };
                let testStudent = new Models.Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    // Create second student
                    studentData.number += 1;
                    let testStudent2 = new Models.Students(studentData);
                    testStudent.save((err) => {
                        if (err) throw err;

                        var awardData = {
                            recipient: testStudent
                        };

                        // Create 15 awards
                        var count = 0;
                        for (var num = 0; num < 15; num++) {
                            awardData.note = num.toString();
                            awardData.recipient = (num % 2 == 0) ? testStudent : testStudent2; // Test student gets even awards
                            let testAward = new Models.Awards(awardData);
                            testAward.save((err) => {
                                if (err) throw err;

                                // Start testing once all awards are created
                                if (++count == 15) {
                                    // Race condition here doesn't matter, as all runs will still get 15 results returned

                                    // Make request
                                    chai.request(server)
                                        .get('/api/awards')
                                        .query({filter: {recipient: testStudent._id.toString()}})
                                        .end((err, res) => {
                                            expect(res).to.have.status(200);
                                            expect(res).to.be.json;
                                            expect(res.body).to.have.property('award');
                                            expect(res.body.award.length).to.be.equal(8);
                                            for (var num = 0; num < 8; num++) {
                                                expect(res.body.award[num].recipient).to.equal(testStudent._id.toString());
                                            }
                                            done();
                                        });
                                }
                            });
                        }
                    });
                });
            });
        });

        it('it should GET nothing if student has no award', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make awards for the students (except one), then query for all
                var studentData = {
                    number: 594265372,
                    firstName: "Johnny",
                    lastName: "Test",
                    gender: 1,
                    DOB: new Date().toISOString(),
                    photo: "/some/link",
                    registrationComments: "No comment",
                    basisOfAdmission: "Because",
                    admissionAverage: 90,
                    admissionComments: "None",
                    resInfo: testRes
                };
                let testStudent = new Models.Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    studentData.number = 541354335;
                    let otherStudent = new Models.Students(studentData);
                    otherStudent.save((err) => {
                        if (err) throw err;

                        var awardData = {
                            recipient: otherStudent
                        };

                        // Create 15 awards
                        var count = 0;
                        for (var num = 0; num < 15; num++) {
                            awardData.note = num.toString();
                            let testAward = new Models.Awards(awardData);
                            testAward.save((err) => {
                                if (err) throw err;

                                // Start testing once all awards are created
                                if (++count == 15) {
                                    // Race condition here doesn't matter, as all runs will still get 0 results returned

                                    // Make request
                                    chai.request(server)
                                        .get('/api/awards')
                                        .query({filter: {recipient: testStudent._id.toString()}})
                                        .end((err, res) => {
                                            expect(res).to.have.status(200);
                                            expect(res).to.be.json;
                                            expect(res.body).to.have.property('award');
                                            expect(res.body.award.length).to.be.equal(0);
                                            done();
                                        });
                                }
                            });
                        }
                    });
                });
            });
        });

        it('it should GET award when given ID', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make awards for the students, then query for all
                var studentData = {
                    number: 594265372,
                    firstName: "Johnny",
                    lastName: "Test",
                    gender: 1,
                    DOB: new Date().toISOString(),
                    photo: "/some/link",
                    registrationComments: "No comment",
                    basisOfAdmission: "Because",
                    admissionAverage: 90,
                    admissionComments: "None",
                    resInfo: testRes
                };
                let testStudent = new Models.Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    var awardData = {
                        recipient: testStudent
                    };

                    // Create 15 awards
                    var count = 0;
                    for (var num = 0; num < 15; num++) {
                        awardData.note = num.toString();
                        let testAward = new Models.Awards(awardData);
                        testAward.save((err) => {
                            if (err) throw err;

                            // Start testing once all awards are created
                            if (++count == 15) {
                                // Race condition here doesn't matter, as we already know that the latest version of testAward saved

                                // Make request
                                chai.request(server)
                                    .get('/api/awards/' + testAward._id.toString())
                                    .end((err, res) => {
                                        expect(res).to.have.status(200);
                                        expect(res).to.be.json;
                                        expect(res.body).to.have.property('award');
                                        expect(res.body.award.note).to.equal(testAward.note.toString());
                                        expect(res.body.award.recipient).to.equal(testAward.recipient.toString());
                                        done();
                                    });
                            }
                        });
                    }
                });
            });
        });

        it('it should 404 for award when given bad ID', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make awards for the students, then query for all
                var studentData = {
                    number: 594265372,
                    firstName: "Johnny",
                    lastName: "Test",
                    gender: 1,
                    DOB: new Date().toISOString(),
                    photo: "/some/link",
                    registrationComments: "No comment",
                    basisOfAdmission: "Because",
                    admissionAverage: 90,
                    admissionComments: "None",
                    resInfo: testRes
                };
                let testStudent = new Models.Students(studentData);
                testStudent.save((err) => {
                    if (err) throw err;

                    var awardData = {
                        recipient: testStudent
                    };

                    // Create 15 awards
                    var count = 0;
                    for (var num = 0; num < 15; num++) {
                        awardData.note = num.toString();
                        let testAward = new Models.Awards(awardData);
                        testAward.save((err) => {
                            if (err) throw err;

                            // Start testing once all awards are created
                            if (++count == 15) {
                                // Race condition here doesn't matter, as none will have this ID
                                // Make request
                                chai.request(server)
                                    .get('/api/awards/53425353')
                                    .end((err, res) => {
                                        expect(res).to.have.status(404);
                                        done();
                                    });
                            }
                        });
                    }
                });
            });
        });
    });

    /*
     * Test the /PUT routes
     */
    describe('/PUT awards', () => {
        it('it should PUT an updated award', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            var studentData = {
                number: 594265372,
                firstName: "Johnny",
                lastName: "Test",
                gender: 1,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            let testStudent = new Models.Students(studentData);
            testStudent.save((err) =>{
                if (err) throw err;

                var awardData = {
                    recipient: null
                };


                // Create first award
                awardData.note = 0;
                let testAward = new Models.Awards(awardData);
                testAward.save((err) => {
                    if (err) throw err;

                    // Create 14 awards
                    var count = 0;
                    for (var num = 1; num < 15; num++) {
                        awardData.note = num;
                        let otherAwards = new Models.Awards(awardData);
                        otherAwards.save((err) => {
                            if (err) throw err;

                            // Start testing once all awards are created
                            if (++count == 14) {
                                // Race condition here doesn't matter, as the modified data is being tested

                                // Modify data
                                awardData.note = "success";
                                awardData.recipient = testStudent;

                                // Make request
                                chai.request(server)
                                    .put('/api/awards/' + testAward._id.toString())
                                    .send({award: awardData})
                                    .end((err, res) => {
                                        expect(res).to.have.status(200);
                                        expect(res).to.be.json;
                                        expect(res.body).to.have.property('award');
                                        expect(res.body.award.note).to.equal(awardData.note);
                                        expect(res.body.award.recipient).to.equal(testStudent._id.toString());

                                        // Test mongo to ensure it was written
                                        Models.Awards.findById(testAward._id, (error, res) => {
                                            expect(error || res.length === 0).to.be.false;
                                            expect(res.note).to.equal(awardData.note);
                                            expect(res.recipient.toString()).to.equal(testStudent._id.toString());
                                            done();
                                        });
                                    });
                            }
                        });
                    }
                });
            });
        });

        it('it should 400 on PUT an award with no recipient', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            var studentData = {
                number: 594265372,
                firstName: "Johnny",
                lastName: "Test",
                gender: 1,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            let testStudent = new Models.Students(studentData);
            testStudent.save((err) =>{
                if (err) throw err;

                var awardData = {
                    recipient: testStudent
                };


                // Create first award
                awardData.note = 0;
                let testAward = new Models.Awards(awardData);
                testAward.save((err) => {
                    if (err) throw err;

                    // Create 14 awards
                    var count = 0;
                    for (var num = 1; num < 15; num++) {
                        awardData.note = num;
                        let otherAwards = new Models.Awards(awardData);
                        otherAwards.save((err) => {
                            if (err) throw err;

                            // Start testing once all awards are created
                            if (++count == 14) {
                                // Race condition here doesn't matter, as the modified data is being tested

                                // Modify data
                                awardData.note = "success";
                                awardData.recipient = null;

                                // Make request
                                chai.request(server)
                                    .put('/api/awards/' + testAward._id.toString())
                                    .send({award: awardData})
                                    .end((err, res) => {
                                        expect(res).to.have.status(400);

                                        Models.Awards.findById(testAward._id, (err, result) => {
                                            expect(err).to.be.null;
                                            expect(result.recipient).to.not.be.null;
                                            done();
                                        });
                                    });
                            }
                        });
                    }
                });
            });
        });

        it('it should 404 on PUT a nonexistent award', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            let firstNumber = 594265372;
            var awardData = {
                firstName: "Johnny",
                lastName: "Test",
                gender: 1,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
                resInfo: testRes
            };

            // Create 15 awards
            var count = 0;
            for (var num = 0; num < 15; num++) {
                awardData.number = firstNumber + num;
                let testAward = new Models.Awards(awardData);
                testAward.save((err) => {
                    if (err) throw err;

                    // Start testing once all awards are created
                    if (++count == 15) {
                        // Race condition here doesn't matter, as the queried ID will not exist
                        // Make request
                        chai.request(server)
                            .put('/api/awards/' + '4534234')
                            .send({award: awardData})
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
    describe('/POST an award', () => {
        it('it should POST successfully', (done) => {

            // Set up mock data
            let studentData = {
                number: 594265372
            };
            let testStudent = new Models.Students(studentData);

            let awardData ={
                note: "A note",
                recipient: testStudent
            };

            // Save mock
            testStudent.save((err) => {
               if(err) throw err;

                // Make request
                chai.request(server)
                    .post('/api/awards')
                    .send({award: awardData})
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('award');
                        expect(res.body.award.note).to.be.a('String');
                        expect(res.body.award.recipient).to.equal(testStudent._id.toString());

                        // Check underlying database
                        Models.Awards.findById(res.body.award._id, function (error, award) {
                            expect(error).to.be.null;
                            expect(award).to.not.be.null;
                            expect(award.note).to.be.a('String');
                           expect(award.recipient.toString()).to.equal(testStudent._id.toString());

                            done();
                        });
                    });
            });
        });

        it('it should 400 on POST with no recipient', (done) => {

            // Set up mock data
            let studentData = {
                number: 594265372
            };
            let testStudent = new Models.Students(studentData);

            let awardData ={
                note: "A note"
            };

            // Save mock
            testStudent.save((err) => {
                if(err) throw err;

                // Make request
                chai.request(server)
                    .post('/api/awards')
                    .send({award: awardData})
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        done();
                    });
            });
        });
    });

    /*
     * Test the /DELETE routes
     */
    describe('/DELETE an award', () => {
        it('it should DELETE successfully and remove associated link from Student', (done) => {

            // Set up mock data
            // Create student
            var studentData = {
                number: 594265372,
                firstName: "Johnny",
                lastName: "Test",
                gender: 1,
                DOB: new Date().toISOString(),
                photo: "/some/link",
                registrationComments: "No comment",
                basisOfAdmission: "Because",
                admissionAverage: 90,
                admissionComments: "None",
            };
            let testStudent = new Models.Students(studentData);
            testStudent.save((err) => {
                if (err) throw err;

                // Create award
                var awardData = {
                    note: "Test",
                    recipient: testStudent
                };
                let testAward = new Models.Awards(awardData);
                testAward.save((err) => {
                    if (err) throw err;

                    // Link student to award
                    testStudent.awards = [testAward];
                    testStudent.save((err) => {
                        if (err) throw err;

                        // Make request
                        chai.request(server)
                            .delete('/api/awards/' + testAward._id.toString())
                            .end((err, res) => {
                                expect(res).to.have.status(200);

                                // Check underlying database
                                Models.Awards.findById(testAward._id, function (error, award) {
                                    expect(error).to.be.null;
                                    expect(award).to.be.null;
                                    done();
                                });
                            });
                    });
                });
            });
        });

    });

});