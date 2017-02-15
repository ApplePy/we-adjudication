//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Students = require('../models/schemas/studentinfo/studentSchema');
let Residencies = require('../models/schemas/studentinfo/residencySchema');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let expect = chai.expect;

chai.use(chaiHttp);

// Our parent block - stores the test
describe('Residencies', () => {
    let host = "http://localhost:3700";     // This is the Node.js server

    //Before each test we empty the database
    beforeEach((done) => {
        // Clear out all Residences and Students then call done
        Residencies.remove({}, (err) => {
            if (err) throw "Error cleaning out Residencies";
            Students.remove({}, (err) => {
                if (err) throw "Error cleaning out Students";
                done()
            });
        });
    });

    /*
     * Test the /GET routes
     */
    describe('/GET residencies', () => {
        it('it should GET all residencies ', (done) => {
            // Request all residencies
            chai.request(server)
                .get('/api/residencies')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('residency');
                    expect(res.body.residency.length).to.be.eq(0);
                    done();
                });
        });

        it('it should GET all residencies when data exists', (done) => {

            // Set up mock data
            let testRes = new Residencies({
                name: "Johnny Test House"
            });
            testRes.save((err) => {
                if (err) throw err;

                // Make residency request
                chai.request(server)
                    .get('/api/residencies')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('residency');
                        expect(res.body.residency.length).to.be.eq(1);
                        expect(res.body.residency[0]).to.have.property('name');
                        expect(res.body.residency[0].name).to.equal(testRes.name);
                        done();
                    });
            });
        });

        it('it should GET the residency of a student', (done) => {

            // Set up mock data

            let testRes = new Residencies({
                name: "Johnny Test House"
            });
            testRes.save((err) => {
                if (err) throw err;

                let testRes2 = new Residencies({
                    name: "Johnny Not House"
                });
                testRes2.save((err) => {
                    if (err) throw err;

                    let testStudent1 = new Students({number: 12345, name: "Johnny Test", resInfo: testRes});
                    testStudent1.save((err) => {
                        if (err) throw err;

                        let testStudent2 = new Students({number: 12346, name: "Jane Test", resInfo: testRes2});
                        testStudent2.save((err) => {
                            if (err) throw err;

                            // Request residency
                            chai.request(server)
                                .get('/api/residencies?filter[student]=' + testStudent1._id.toString())
                                .end((err, res) => {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property('residency');
                                    expect(res.body.residency).to.have.property('name');
                                    expect(res.body.residency.name).to.equal(testRes.name);
                                    done();
                                });
                        });
                    });
                });
            });
        });

        it('it should 404 if a student doesn\'t have a residence', (done) => {

            // Set up mock data
            let testRes = new Residencies({
                name: "Johnny Test House"
            });
            testRes.save((err) => {
                if (err) throw err;

                let testStudent1 = new Students({number: 12345, name: "Johnny Test", resInfo: testRes});
                testStudent1.save((err) => {
                    if (err) throw err;

                    let testStudent2 = new Students({number: 12346, name: "Jane Test", resInfo: testRes});
                    testStudent2.save((err) => {
                        if (err) throw err;

                        let testStudent3 = new Students({number:12347, name: "Eve Test"});
                        testStudent2.save((err) => {
                            if (err) throw err;

                            // Make request
                            chai.request(server)
                                .get('/api/residencies?filter[student]=' + testStudent3._id.toString())
                                .end((err, res) => {
                                    expect(res).to.have.status(404);
                                    done();
                                });
                        });
                    });
                });
            });
        });

        it('it should GET the residency by name', (done) => {

            // Set up mock data
            let testRes = new Residencies({
                name: "Johnny Test House"
            });
            testRes.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .get('/api/residencies?filter[name]=' + "Johnny Test House")
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('residency');
                        expect(res.body.residency.length).to.be.eq(1);
                        expect(res.body.residency[0]).to.have.property('name');
                        expect(res.body.residency[0].name).to.equal(testRes.name);
                        done();
                    });
            });
        });

        it('it should GET nothing if a the name does not exist', (done) => {

            // Set up mock data
            let testRes = new Residencies({
                name: "Johnny Test House"
            });
            testRes.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .get('/api/residencies?filter[name]=' + "Johnny Test House2")
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('residency');
                        expect(res.body.residency.length).to.be.eq(0);
                        done();
                    });
            });
        });

        it('it should GET residency when given ID', (done) => {

            // Set up mock data
            let testRes = new Residencies({
                    name: "Johnny Test House"
                });

            testRes.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .get('/api/residencies/' + testRes._id.toString())
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('residency');
                        expect(res.body.residency).to.be.a('object');
                        expect(res.body.residency).to.have.property('name');
                        expect(res.body.residency.name).to.equal(testRes.name);
                        done();
                    });
            });
        });

        it('it should 404 for residency when given bad ID', (done) => {

            // Set up mock data
            let testRes = new Residencies({
                name: "Johnny Test House"
            });
            testRes.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .get('/api/residencies/453535')
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
    describe('/PUT residencies', () => {
        it('it should PUT an updated residency', (done) => {

            // Set up mock data
            var resData = {
                name: "Johnny Test House"
            };
            let testRes = new Residencies(resData);
            testRes.save((err) => {
                if (err) throw err;

                resData.name = "Johnny Test Shack";

                // Make request
                chai.request(server)
                    .put('/api/residencies/' + testRes._id)
                    .send({residency: resData})
                    .end((err, res) => {
                        // Test server response
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('residency');
                        expect(res.body.residency).to.be.a('object');
                        expect(res.body.residency).to.have.property('name');
                        expect(res.body.residency.name).to.equal(resData.name);

                        // Test mongo for changes
                        Residencies.find(resData, (err, res) => {
                            expect(err).to.be.null;
                            expect(res.length).to.equal(1);
                            expect(res[0].name).to.equal(resData.name);
                            done();
                        });
                    });
            });
        });

        it('it should 500 on PUT a residency with duplicate name', (done) => {

            // Set up mock data
            var resData = {
                name: "Johnny Test House"
            };

            // Create first residence
            let testRes = new Residencies(resData);
            testRes.save((err) => {
                if (err) throw err;

                // Create second residence
                resData.name = "Johnny Test Shack";
                let testRes2 = new Residencies(resData);
                testRes2.save((err) => {
                   if (err) throw err;

                    // Make bad request
                    chai.request(server)
                        .put('/api/residencies/' + testRes._id)
                        .send({residency: resData})
                        .end((err, res) => {
                            // Test server response
                            expect(res).to.have.status(500);

                            // Test mongo for changes
                            Residencies.findById(testRes._id, (err, res) => {
                                expect(err).to.be.null;
                                expect(res.name).to.equal("Johnny Test House");
                                done();
                            });
                        });
                });
            });
        });

        it('it should 404 on PUT a nonexistent residency', (done) => {

            // Set up mock data
            var resData = {
                name: "Johnny Test House"
            };
            let testRes = new Residencies(resData);
            testRes.save((err) => {
                if (err) throw err;

                // Make request
                chai.request(server)
                    .put('/api/residencies/' + '4534234')
                    .send({residency: resData})
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
    describe('/POST a residency', () => {
        it('it should POST successfully', (done) => {

            // Set up mock data
            let residencyData = {
                residency: {
                    name: "Johnny Test Residence"
                }
            };

            // Make request
            chai.request(server)
                .post('/api/residencies')
                .send(residencyData)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('residency');
                    expect(res.body.residency.name).to.equal(residencyData.residency.name);

                    Residencies.findById(res.body.residency._id, function (error, residency) {
                        expect(error).to.be.null;
                        expect(residency.name).to.equal(residencyData.residency.name);
                        done();
                    });
                });
        });

        it('it should 500 on POST with duplicate residency name', (done) => {

            // Set up mock data
            let residencyData = {
                residency: {
                    name: "Johnny Test Residence"
                }
            };
            let testRes = new Residencies(residencyData.residency);
            testRes.save((err) => {
               if (err) throw err;

                // Make request
                chai.request(server)
                    .post('/api/residencies')
                    .send(residencyData)
                    .end((err, res) => {
                        expect(res).to.have.status(500);

                        // Ensure no new residency was created
                        Residencies.find(residencyData.residency, function (error, residency) {
                            expect(error).to.be.null;
                            expect(residency.length).to.equal(1);
                            done();
                        });
                    });
            });
        });
    });

    /*
     * Test the /DELETE routes
     */
    describe('/DELETE a residency', () => {
        it('it should DELETE successfully and unlink all students', (done) => {

            // Set up mock data
            let residencyData = {
                name: "Johnny Test Residence"
            };
            let testRes = new Residencies(residencyData);
            testRes.save((err) => {
                if (err) throw err;

                let testStudent = new Students(
                    {
                        name: "Johnny Test",
                        resInfo: testRes
                    });
                testStudent.save((err) => {
                    if (err) throw err;

                    // Make request
                    chai.request(server)
                        .delete('/api/residencies/' + testRes._id)
                        .end((err, res) => {
                            expect(res).to.have.status(200);

                            Residencies.findById(testRes._id, function (error, residency) {
                                expect(error).to.be.null;
                                expect(residency).to.be.null;

                                Students.findById(testStudent._id, function(error, student) {
                                    expect(error).to.be.null;
                                    expect(student.resInfo).to.be.null;
                                    done();
                                });
                            });
                        });
                });
            });
        });
    });
});
