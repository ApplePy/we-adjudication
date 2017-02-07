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
describe('Genders', () => {
    let host = "http://localhost:3700";     // This is the Node.js server

    //Before each test we empty the database
    beforeEach((done) => {
        // Clear out all Residences and Students then call done
        Models.Genders.remove({}, (err) => {
            if (err) throw "Error cleaning out Genders";
            Models.Students.remove({}, (err) => {
                if (err) throw "Error cleaning out Students";
                done()
            });
        });
    });

    /*
     * Test the /GET routes
     */
    describe('/GET genders', () => {
        it('it should GET all genders ', (done) => {
            // Request all residencies
            chai.request(server)
                .get('/api/genders')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('gender');
                    expect(res.body.gender.length).to.be.eq(0);
                    done();
                });
        });

        it('it should GET all genders when data exists', (done) => {

            // Set up mock data
            let testGender = new Models.Genders({
                name: "Male"
            });
            testGender.save((err) => {
                if (err) throw err;

                // Make residency request
                chai.request(server)
                    .get('/api/genders')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('gender');
                        expect(res.body.gender.length).to.be.eq(1);
                        expect(res.body.gender[0]).to.have.property('name');
                        expect(res.body.gender[0].name).to.equal(testGender.name);
                        done();
                    });
            });
        });

        // it('it should GET the gender of a student', (done) => {
        //
        //     // Set up mock data
        //
        //     let testGender = new Models.Genders({
        //         name: "Male"
        //     });
        //     testGender.save((err) => {
        //         if (err) throw err;
        //
        //         let testGender2 = new Models.Genders({
        //             name: "Female"
        //         });
        //         testGender2.save((err) => {
        //             if (err) throw err;
        //
        //             let testStudent1 = new Models.Students({number: 12345, name: "Johnny Test", genderInfo: testGender});
        //             testStudent1.save((err) => {
        //                 if (err) throw err;
        //
        //                 let testStudent2 = new Models.Students({number: 12346, name: "Jane Test", genderInfo: testGender2});
        //                 testStudent2.save((err) => {
        //                     if (err) throw err;
        //
        //                     // Request residency
        //                     chai.request(server)
        //                         .get('/api/genders?filter[student]=' + testStudent1._id.toString())
        //                         .end((err, res) => {
        //                             expect(res).to.have.status(200);
        //                             expect(res).to.be.json;
        //                             expect(res.body).to.have.property('gender');
        //                             expect(res.body.gender).to.have.property('name');
        //                             expect(res.body.gender.name).to.equal(testGender.name);
        //                             done();
        //                         });
        //                 });
        //             });
        //         });
        //     });
        // });
        //
        // it('it should 404 if a student doesn\'t have a gender', (done) => {
        //
        //     // Set up mock data
        //     let testGender = new Models.Genders({
        //         name: "Gender"
        //     });
        //     testGender.save((err) => {
        //         if (err) throw err;
        //
        //         let testStudent1 = new Models.Students({number: 12345, name: "Johnny Test", genderInfo: testGender});
        //         testStudent1.save((err) => {
        //             if (err) throw err;
        //
        //             let testStudent2 = new Models.Students({number: 12346, name: "George Test", genderInfo: testGender});
        //             testStudent2.save((err) => {
        //                 if (err) throw err;
        //
        //                 let testStudent3 = new Models.Students({number:12347, name: "Eve Test"});
        //                 testStudent2.save((err) => {
        //                     if (err) throw err;
        //
        //                     // Make request
        //                     chai.request(server)
        //                         .get('/api/genders?filter[student]=' + testStudent3._id.toString())
        //                         .end((err, res) => {
        //                             expect(res).to.have.status(404);
        //                             done();
        //                         });
        //                 });
        //             });
        //         });
        //     });
        // });

        it('it should GET the gender by name', (done) => {

            // Set up mock data
            let testGender = new Models.Genders({
                name: "Male"
            });
            testGender.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .get('/api/genders?filter[name]=' + "Male")
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('gender');
                        expect(res.body.gender.length).to.be.eq(1);
                        expect(res.body.gender[0]).to.have.property('name');
                        expect(res.body.gender[0].name).to.equal(testGender.name);
                        done();
                    });
            });
        });

        it('it should GET nothing if a the name does not exist', (done) => {

            // Set up mock data
            let testGender = new Models.Genders({
                name: "Male"
            });
            testGender.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .get('/api/genders?filter[name]=' + "Female")
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('gender');
                        expect(res.body.gender.length).to.be.eq(0);
                        done();
                    });
            });
        });

        it('it should GET gender when given ID', (done) => {

            // Set up mock data
            let testGender = new Models.Genders({
                    name: "Male"
                });

            testGender.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .get('/api/genders/' + testGender._id.toString())
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('gender');
                        expect(res.body.gender).to.be.a('object');
                        expect(res.body.gender).to.have.property('name');
                        expect(res.body.gender.name).to.equal(testGender.name);
                        done();
                    });
            });
        });

        it('it should 404 for gender when given bad ID', (done) => {

            // Set up mock data
            let testGender = new Models.Genders({
                name: "Male"
            });
            testGender.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .get('/api/genders/453535')
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        done();
                    });
            });
        });
    });

    /*
     * Test the /PUT routes
     */
    describe('/PUT genders', () => {
        it('it should PUT an updated gender', (done) => {

            // Set up mock data
            var genderData = {
                name: "Male"
            };
            let testGender = new Models.Genders(genderData);
            testGender.save((err) => {
                if (err) throw err;

                genderData.name = "Female";

                // Make request
                chai.request(server)
                    .put('/api/genders/' + testGender._id)
                    .send({gender: genderData})
                    .end((err, res) => {
                        // Test server response
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('gender');
                        expect(res.body.gender).to.be.a('object');
                        expect(res.body.gender).to.have.property('name');
                        expect(res.body.gender.name).to.equal(genderData.name);

                        // Test mongo for changes
                        Models.Genders.find(genderData, (err, res) => {
                            expect(err).to.be.null;
                            expect(res.length).to.equal(1);
                            expect(res[0].name).to.equal(genderData.name);
                            done();
                        });
                    });
            });
        });

        it('it should 500 on PUT a gender with duplicate name', (done) => {

            // Set up mock data
            var genderData = {
                name: "Male"
            };

            // Create first residence
            let testGender = new Models.Genders(genderData);
            testGender.save((err) => {
                if (err) throw err;

                // Create second residence
                genderData.name = "Female";
                let testGender2 = new Models.Genders(genderData);
                testGender2.save((err) => {
                   if (err) throw err;

                    // Make bad request
                    chai.request(server)
                        .put('/api/genders/' + testGender._id)
                        .send({gender: genderData})
                        .end((err, res) => {
                            // Test server response
                            expect(res).to.have.status(500);

                            // Test mongo for changes
                            Models.Genders.findById(testGender._id, (err, res) => {
                                expect(err).to.be.null;
                                expect(res.name).to.equal("Male");
                                done();
                            });
                        });
                });
            });
        });

        it('it should 404 on PUT a nonexistent gender', (done) => {

            // Set up mock data
            var genderData = {
                name: "Male"
            };
            let testGender = new Models.Genders(genderData);
            testGender.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .put('/api/genders/' + '4534234')
                    .send({gender: genderData})
                    .end((err, res) => {
                        expect(res).to.have.status(404);
                        done();
                    });
            });
        });
    });

    /*
     * Test the /POST routes
     */
    describe('/POST a gender', () => {
        it('it should POST successfully', (done) => {

            // Set up mock data
            let genderData = {
                gender: {
                    name: "Male"
                }
            };

            // Make request
            chai.request(server)
                .post('/api/genders')
                .send(genderData)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('gender');
                    expect(res.body.gender.name).to.equal(genderData.gender.name);

                    Models.Genders.findById(res.body.gender._id, function (error, gender) {
                        expect(error).to.be.null;
                        expect(gender.name).to.equal(genderData.gender.name);
                        done();
                    });
                });
        });

        it('it should 500 on POST with duplicate gender name', (done) => {

            // Set up mock data
            let genderData = {
                gender: {
                    name: "Male"
                }
            };
            let testGender = new Models.Genders(genderData.gender);
            testGender.save((err) => {
               if (err) throw err;

                // Make request
                chai.request(server)
                    .post('/api/genders')
                    .send(genderData)
                    .end((err, res) => {
                        expect(res).to.have.status(500);

                        // Ensure no new residency was created
                        Models.Genders.find(genderData.gender, function (error, gender) {
                            expect(error).to.be.null;
                            expect(gender.length).to.equal(1);
                            done();
                        });
                    });
            });
        });
    });

    /*
     * Test the /DELETE routes
     */
    describe('/DELETE a gender', () => {
        it('it should DELETE successfully and unlink all students', (done) => {

            // Set up mock data
            let genderData = {
                name: "Male"
            };
            let testGender = new Models.Genders(genderData);
            testGender.save((err) => {
                if (err) throw err;

                let testStudent = new Models.Students(
                    {
                        name: "Johnny Test",
                        genderInfo: testGender
                    });
                testStudent.save((err) => {
                    if (err) throw err;

                    // Make request
                    chai.request(server)
                        .delete('/api/genders/' + testGender._id)
                        .end((err, res) => {
                            expect(res).to.have.status(200);

                            Models.Genders.findById(testGender._id, function (error, gender) {
                                expect(error).to.be.null;
                                expect(gender).to.be.null;

                                Models.Students.findById(testStudent._id, function(error, student) {
                                    expect(error).to.be.null;
                                    expect(student.genderInfo).to.be.null;
                                    done();
                                });
                            });
                        });
                });
            });
        });
    });
});
