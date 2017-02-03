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
                .get('/awards')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('award');
                    expect(res.body.award.length).to.be.eq(0);
                    done();
                });
        });

        it('it should GET 5 awards starting with the second', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err;


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
                        // Make request
                        chai.request(server)
                            .get('/awards')
                            .query({limit: 5, offset: 1})
                            .end((err, res) => {
                                expect(res).to.have.status(200);
                                expect(res).to.be.json;
                                expect(res.body).to.have.property('award');
                                expect(res.body.award.length).to.be.eq(5);
                                for (var num = 0; num < 5; num++) {
                                    expect(res.body.award[num].number).to.equal(firstNumber + num + 1);
                                    expect(res.body.award[num].firstName).to.equal(awardData.firstName);
                                    expect(res.body.award[num].lastName).to.equal(awardData.lastName);
                                    expect(res.body.award[num].gender).to.equal(awardData.gender);
                                    expect(res.body.award[num].DOB).to.equal(awardData.DOB);
                                    expect(res.body.award[num].photo).to.equal(awardData.photo);
                                    expect(res.body.award[num].registrationComments).to.equal(awardData.registrationComments);
                                    expect(res.body.award[num].basisOfAdmission).to.equal(awardData.basisOfAdmission);
                                    expect(res.body.award[num].admissionAverage).to.equal(awardData.admissionAverage);
                                    expect(res.body.award[num].admissionComments).to.equal(awardData.admissionComments);
                                    expect(res.body.award[num].resInfo).to.equal(testRes._id.toString());
                                    expect(res.body.award[num].awards.length).to.be.eq(0);
                                    expect(res.body.award[num].advancedStandings.length).to.be.eq(0);
                                }
                                done();
                            });
                    }
                });
            }
        });

        it('it should GET a award by number', (done) => {

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
                        // Make request
                        chai.request(server)
                            .get('/awards')
                            .query({filter: {number: firstNumber + 3}})
                            .end((err, res) => {
                                expect(res).to.have.status(200);
                                expect(res).to.be.json;
                                expect(res.body).to.have.property('award');
                                expect(res.body.award.length).to.be.eq(1);
                                expect(res.body.award[0].number).to.equal(firstNumber + 3);
                                expect(res.body.award[0].firstName).to.equal(awardData.firstName);
                                expect(res.body.award[0].lastName).to.equal(awardData.lastName);
                                expect(res.body.award[0].gender).to.equal(awardData.gender);
                                expect(res.body.award[0].DOB).to.equal(awardData.DOB);
                                expect(res.body.award[0].photo).to.equal(awardData.photo);
                                expect(res.body.award[0].registrationComments).to.equal(awardData.registrationComments);
                                expect(res.body.award[0].basisOfAdmission).to.equal(awardData.basisOfAdmission);
                                expect(res.body.award[0].admissionAverage).to.equal(awardData.admissionAverage);
                                expect(res.body.award[0].admissionComments).to.equal(awardData.admissionComments);
                                expect(res.body.award[0].resInfo).to.equal(testRes._id.toString());
                                expect(res.body.award[0].awards.length).to.be.eq(0);
                                expect(res.body.award[0].advancedStandings.length).to.be.eq(0);
                                done();
                            });
                    }
                });
            }
        });

        it('it should GET nothing if award does not exist', (done) => {

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
                        // Make award request
                        chai.request(server)
                            .get('/awards')
                            .query({filter: {number: 102}})
                            .end((err, res) => {
                                expect(res).to.have.status(200);
                                expect(res).to.be.json;
                                expect(res.body).to.have.property('award');
                                expect(res.body.award.length).to.be.eq(0);
                                done();
                            });
                    }
                });
            }
        });

        it('it should GET award when given ID', (done) => {

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

            // Create 14 awards
            var count = 0;
            for (var num = 0; num < 14; num++) {
                awardData.number = firstNumber + num;
                let testAward = new Models.Awards(awardData);
                testAward.save((err) => {
                    if (err) throw err;

                    // Start testing once all awards are created
                    if (++count == 14) {
                        // Create last award
                        awardData.number = firstNumber + 14;
                        let testAward = new Models.Awards(awardData);
                        testAward.save((err) => {
                            if (err) throw err;

                            // Make request
                            chai.request(server)
                                .get('/awards/' + testAward._id.toString())
                                .end((err, res) => {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property('award');
                                    expect(res.body.award.number).to.equal(firstNumber + 14);
                                    expect(res.body.award.firstName).to.equal(awardData.firstName);
                                    expect(res.body.award.lastName).to.equal(awardData.lastName);
                                    expect(res.body.award.gender).to.equal(awardData.gender);
                                    expect(res.body.award.DOB).to.equal(awardData.DOB);
                                    expect(res.body.award.photo).to.equal(awardData.photo);
                                    expect(res.body.award.registrationComments).to.equal(awardData.registrationComments);
                                    expect(res.body.award.basisOfAdmission).to.equal(awardData.basisOfAdmission);
                                    expect(res.body.award.admissionAverage).to.equal(awardData.admissionAverage);
                                    expect(res.body.award.admissionComments).to.equal(awardData.admissionComments);
                                    expect(res.body.award.resInfo).to.equal(testRes._id.toString());
                                    expect(res.body.award.awards.length).to.be.eq(0);
                                    expect(res.body.award.advancedStandings.length).to.be.eq(0);
                                    done();
                                });
                        });
                    }
                });
            }
        });

        it('it should 404 for award when given bad ID', (done) => {

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
                        // Make request
                        chai.request(server)
                            .get('/awards/453535')
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
    describe('/PUT awards', () => {
        it('it should PUT an updated award', (done) => {

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

            // Create first award
            awardData.number = firstNumber;
            let testAward = new Models.Awards(awardData);
            testAward.save((err) => {
                if (err) throw err;

                // Create 14 awards
                var count = 0;
                for (var num = 1; num < 15; num++) {
                    awardData.number = firstNumber + num;
                    let testAward = new Models.Awards(awardData);
                    testAward.save((err) => {
                        if (err) throw err;

                        // Start testing once all awards are created
                        if (++count == 14) {
                            // Modify data
                            awardData.number = firstNumber;
                            awardData.gender = 0;

                            // Make request
                            chai.request(server)
                                .put('/awards/' + testAward._id.toString())
                                .send({award: awardData})
                                .end((err, res) => {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property('award');
                                    expect(res.body.award.number).to.equal(firstNumber);
                                    expect(res.body.award.firstName).to.equal(awardData.firstName);
                                    expect(res.body.award.lastName).to.equal(awardData.lastName);
                                    expect(res.body.award.gender).to.equal(awardData.gender);
                                    expect(res.body.award.DOB).to.equal(awardData.DOB);
                                    expect(res.body.award.photo).to.equal(awardData.photo);
                                    expect(res.body.award.registrationComments).to.equal(awardData.registrationComments);
                                    expect(res.body.award.basisOfAdmission).to.equal(awardData.basisOfAdmission);
                                    expect(res.body.award.admissionAverage).to.equal(awardData.admissionAverage);
                                    expect(res.body.award.admissionComments).to.equal(awardData.admissionComments);
                                    expect(res.body.award.resInfo).to.equal(testRes._id.toString());

                                    // Test mongo to ensure it was written
                                    Models.Awards.findById(testAward._id, (error, res) => {
                                        expect(error || res.length === 0).to.be.false;
                                        expect(res.number).to.equal(firstNumber);
                                        expect(res.firstName).to.equal(awardData.firstName);
                                        expect(res.lastName).to.equal(awardData.lastName);
                                        expect(res.gender).to.equal(awardData.gender);
                                        expect(res.DOB.toISOString()).to.equal(awardData.DOB);
                                        expect(res.photo).to.equal(awardData.photo);
                                        expect(res.registrationComments).to.equal(awardData.registrationComments);
                                        expect(res.basisOfAdmission).to.equal(awardData.basisOfAdmission);
                                        expect(res.admissionAverage).to.equal(awardData.admissionAverage);
                                        expect(res.admissionComments).to.equal(awardData.admissionComments);
                                        expect(res.resInfo.toString()).to.equal(testRes._id.toString());
                                        done();
                                    });
                                });
                        }
                    });
                }
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
                        // Make request
                        chai.request(server)
                            .put('/awards/' + '4534234')
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
                    .post('/awards')
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

    });

    /*
     * Test the /DELETE routes
     */
    describe('/DELETE an award', () => {
        it('it should DELETE successfully', (done) => {

            // Set up mock data
            let testRes = new Models.Residencies({name: "Johnny Test House"});
            testRes.save((err) => {
                if (err) throw err
            });

            var awardData = {
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
                resInfo: testRes._id.toString()
            };
            let testAward = new Models.Awards(awardData);
            testAward.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .delete('/awards/' + testAward._id.toString())
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