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
describe('Advanced Standings', () => {
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
    describe('/GET advanced standings', () => {
        it('it should GET all advanced standings ', (done) => {
            // Request all advanced standings
            chai.request(server)
                .get('/advanced-standings')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('advanced-standing');
                    expect(res.body['advanced-standing'].length).to.be.eq(0);
                    done();
                });
        });

        it('it should GET all advanced standings when created', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make advanced standings for the students, then query for all
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

                    var standingData = {
                        course: "BASKWV 1000",
                        description: "Basket weaving",
                        grade: 100,
                        from: "UBC",
                        recipient: testStudent
                    };

                    // Create 15 advanced standings
                    var count = 0;
                    for (var num = 0; num < 15; num++) {
                        standingData.units = num.toString();
                        let testStanding = new Models.AdvancedStandings(standingData);
                        testStanding.save((err) => {
                            if (err) throw err;

                            // Start testing once all advanced standings are created
                            if (++count == 15) {
                                // Make request
                                chai.request(server)
                                    .get('/advanced-standings')
                                    .end((err, res) => {
                                        expect(res).to.have.status(200);
                                        expect(res).to.be.json;
                                        expect(res.body).to.have.property('advanced-standing');
                                        expect(res.body['advanced-standing'].length).to.eq(15);
                                        for (var num = 0; num < 5; num++) {
                                            expect(res.body['advanced-standing'][num].course).to.eq(standingData.course);
                                            expect(res.body['advanced-standing'][num].description).to.eq(standingData.description);
                                            expect(res.body['advanced-standing'][num].grade).to.eq(standingData.grade);
                                            expect(res.body['advanced-standing'][num].from).to.eq(standingData.from);
                                            expect(res.body['advanced-standing'][num].units).to.equal(num);
                                            expect(res.body['advanced-standing'][num].recipient).to.equal(testStudent._id.toString());
                                        }
                                        done();
                                    });
                            }
                        });
                    }
                });
            });
        });

        it('it should GET an advanced standing by recipient', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make advanced standings for the students, then query for all
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

                    var standingData = {
                        course: "BASKWV 1000",
                        description: "Basket weaving",
                        grade: 100,
                        from: "UBC",
                        recipient: testStudent
                    };

                    // Create 15 advanced standings
                    var count = 0;
                    for (var num = 0; num < 15; num++) {
                        standingData.units = num;
                        let testStanding = new Models.AdvancedStandings(standingData);
                        testStanding.save((err) => {
                            if (err) throw err;

                            // Start testing once all advanced standings are created
                            if (++count == 15) {
                                // Make request
                                chai.request(server)
                                    .get('/advanced-standings')
                                    .query({filter: {student: testStudent._id.toString()}})
                                    .end((err, res) => {
                                        expect(res).to.have.status(200);
                                        expect(res).to.be.json;
                                        expect(res.body).to.have.property('advanced-standing');
                                        expect(res.body['advanced-standing'].length).to.eq(15);
                                        for (var num = 0; num < 15; num++) {
                                            expect(res.body['advanced-standing'][num].course).to.eq(standingData.course);
                                            expect(res.body['advanced-standing'][num].description).to.eq(standingData.description);
                                            expect(res.body['advanced-standing'][num].grade).to.eq(standingData.grade);
                                            expect(res.body['advanced-standing'][num].from).to.eq(standingData.from);
                                            //expect(res.body['advanced-standing'][num].units).to.equal(num);
                                            expect(res.body['advanced-standing'][num].recipient).to.equal(testStudent._id.toString());
                                        }
                                        done();
                                    });
                            }
                        });
                    }
                });
            });
        });

        it('it should GET nothing if student has no advanced standing', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make advanced standings for the students (except one), then query for all
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

                        var standingData = {
                            course: "BASKWV 1000",
                            description: "Basket weaving",
                            grade: 100,
                            from: "UBC",
                            recipient: otherStudent
                        };

                        // Create 15 advanced standings
                        var count = 0;
                        for (var num = 0; num < 15; num++) {
                            standingData.units = num;
                            let testStanding = new Models.AdvancedStandings(standingData);
                            testStanding.save((err) => {
                                if (err) throw err;

                                // Start testing once all advanced standings are created
                                if (++count == 15) {
                                    // Make request
                                    chai.request(server)
                                        .get('/advanced-standings')
                                        .query({filter: {student: testStudent._id.toString()}})
                                        .end((err, res) => {
                                            expect(res).to.have.status(200);
                                            expect(res).to.be.json;
                                            expect(res.body).to.have.property('advanced-standing');
                                            expect(res.body['advanced-standing'].length).to.be.equal(0);
                                            done();
                                        });
                                }
                            });
                        }
                    });
                });
            });
        });

        it('it should GET advanced standing when given ID', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make advanced standings for the students, then query for all
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

                    var standingData = {
                        course: "BASKWV 1000",
                        description: "Basket weaving",
                        grade: 100,
                        from: "UBC",
                        recipient: testStudent
                    };

                    // Create 15 advanced standings
                    var count = 0;
                    for (var num = 0; num < 15; num++) {
                        standingData.units = num;
                        let testStanding = new Models.AdvancedStandings(standingData);
                        testStanding.save((err) => {
                            if (err) throw err;

                            // Start testing once all advanced standings are created
                            if (++count == 15) {
                                // Make request
                                chai.request(server)
                                    .get('/advanced-standings/' + testStanding._id.toString())
                                    .end((err, res) => {
                                        expect(res).to.have.status(200);
                                        expect(res).to.be.json;
                                        expect(res.body).to.have.property('advanced-standing');
                                        expect(res.body['advanced-standing'].course).to.eq(standingData.course);
                                        expect(res.body['advanced-standing'].description).to.eq(standingData.description);
                                        expect(res.body['advanced-standing'].grade).to.eq(standingData.grade);
                                        expect(res.body['advanced-standing'].from).to.eq(standingData.from);
                                        expect(res.body['advanced-standing'].units).to.equal(testStanding.units);
                                        expect(res.body['advanced-standing'].recipient).to.equal(testStudent._id.toString());
                                        done();
                                    });
                            }
                        });
                    }
                });
            });
        });

        it('it should 404 for advanced standing when given bad ID', (done) => {

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

                    var standingData = {
                        course: "BASKWV 1000",
                        description: "Basket weaving",
                        grade: 100,
                        from: "UBC",
                        recipient: testStudent
                    };

                    // Create 15 advanced standings
                    var count = 0;
                    for (var num = 0; num < 15; num++) {
                        standingData.units = num;
                        let testStanding = new Models.AdvancedStandings(standingData);
                        testStanding.save((err) => {
                            if (err) throw err;

                            // Start testing once all advanced standings are created
                            if (++count == 15) {
                                // Make request
                                chai.request(server)
                                    .get('/advanced-standings/53425353')
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
    describe('/PUT advanced standings', () => {
        it('it should PUT an updated advanced standing', (done) => {

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
            testStudent.save((err) => {
                if (err) throw err;

                var standingData = {
                    course: "BASKWV 1000",
                    description: "Basket weaving",
                    grade: 100,
                    from: "UBC",
                    recipient: testStudent
                };

                // Create first advanced standing
                standingData.units = 0;
                let testStanding = new Models.AdvancedStandings(standingData);
                testStanding.save((err) => {
                    if (err) throw err;

                    // Create 14 advanced standings
                    var count = 0;
                    for (var num = 1; num < 15; num++) {
                        standingData.units = num;
                        let otherStandings = new Models.AdvancedStandings(standingData);
                        otherStandings.save((err) => {
                            if (err) throw err;

                            // Start testing once all awards are created
                            if (++count == 14) {

                                // Modify data
                                standingData.units = 9001;

                                // Make request
                                chai.request(server)
                                    .put('/advanced-standings/' + testStanding._id.toString())
                                    .send({'advanced-standing': standingData})
                                    .end((err, res) => {
                                        expect(res).to.have.status(200);
                                        expect(res).to.be.json;
                                        expect(res.body).to.have.property('advanced-standing');
                                        expect(res.body['advanced-standing'].course).to.eq(standingData.course);
                                        expect(res.body['advanced-standing'].description).to.eq(standingData.description);
                                        expect(res.body['advanced-standing'].grade).to.eq(standingData.grade);
                                        expect(res.body['advanced-standing'].from).to.eq(standingData.from);
                                        expect(res.body['advanced-standing'].units).to.equal(standingData.units);
                                        expect(res.body['advanced-standing'].recipient).to.equal(testStudent._id.toString());

                                        // Test mongo to ensure it was written
                                        Models.AdvancedStandings.findById(testStanding._id, (error, res) => {
                                            expect(error || res.length === 0).to.be.false;
                                            expect(res.course).to.eq(standingData.course);
                                            expect(res.description).to.eq(standingData.description);
                                            expect(res.grade).to.eq(standingData.grade);
                                            expect(res.from).to.eq(standingData.from);
                                            expect(res.units).to.equal(standingData.units);
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

        it('it should 404 on PUT a nonexistent advanced standing', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;

                // Make some students, then make advanced standings for the students, then query for all
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

                    var standingData = {
                        course: "BASKWV 1000",
                        description: "Basket weaving",
                        grade: 100,
                        from: "UBC",
                        recipient: testStudent
                    };

                    // Create 15 advanced standings
                    var count = 0;
                    for (var num = 0; num < 15; num++) {
                        standingData.units = num;
                        let testStanding = new Models.AdvancedStandings(standingData);
                        testStanding.save((err) => {
                            if (err) throw err;

                            // Start testing once all advanced standings are created
                            if (++count == 15) {
                                // Make request
                                chai.request(server)
                                    .get('/advanced-standings/4765437876543')
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
     * Test the /POST routes
     */
    describe('/POST an advanced standings', () => {
        it('it should POST successfully', (done) => {

            // Set up mock data
            let studentData = {
                number: 594265372
            };
            let testStudent = new Models.Students(studentData);

            let standingData = {
                course: "BASKWV 1000",
                description: "Basket weaving",
                grade: 100,
                units: 1,
                from: "UBC",
                recipient: testStudent
            };

            // Save mock
            testStudent.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .post('/advanced-standings')
                    .send({'advanced-standing': standingData})
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('advanced-standing');
                        expect(res.body['advanced-standing'].course).to.eq(standingData.course);
                        expect(res.body['advanced-standing'].description).to.eq(standingData.description);
                        expect(res.body['advanced-standing'].grade).to.eq(standingData.grade);
                        expect(res.body['advanced-standing'].from).to.eq(standingData.from);
                        expect(res.body['advanced-standing'].units).to.equal(standingData.units);
                        expect(res.body['advanced-standing'].recipient).to.equal(testStudent._id.toString());

                        // Check underlying database
                        Models.AdvancedStandings.findById(res.body['advanced-standing']._id, function (error, standing) {
                            expect(error).to.be.null;
                            expect(standing).to.not.be.null;
                            expect(res.body).to.have.property('advanced-standing');
                            expect(standing.course).to.eq(standingData.course);
                            expect(standing.description).to.eq(standingData.description);
                            expect(standing.grade).to.eq(standingData.grade);
                            expect(standing.from).to.eq(standingData.from);
                            expect(standing.units).to.equal(standingData.units);
                            expect(standing.recipient.toString()).to.equal(testStudent._id.toString());

                            done();
                        });
                    });
            });
        });

    });

    /*
     * Test the /DELETE routes
     */
    describe('/DELETE an award', () => {
        it('it should DELETE successfully and remove links', (done) => {

            // Set up mock data
            let studentData = {
                number: 594265372
            };
            let testStudent = new Models.Students(studentData);

            let standingData = {
                course: "BASKWV 1000",
                description: "Basket weaving",
                grade: 100,
                units: 1,
                from: "UBC",
                recipient: testStudent
            };

            // Save mock student
            testStudent.save((err) => {
                if (err) throw err;

                // save advanced standing
                let testStanding = new Models.AdvancedStandings(standingData);
                testStanding.save((err) => {
                    if (err) throw err;


                    // Make request
                    chai.request(server)
                        .delete('/advanced-standings/' + testStanding._id.toString())
                        .send({'advanced-standing': standingData})
                        .end((err, res) => {
                            expect(res).to.have.status(200);

                            // Check underlying database
                            Models.AdvancedStandings.findById(testStanding._id, function (error, award) {
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