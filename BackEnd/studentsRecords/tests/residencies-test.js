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
describe('Residencies', () => {
    let host = "http://localhost:3700";     // This is the Node.js server

    //Before each test we empty the database
    beforeEach((done) => {
        // Clear out all Residences and Students then call done
        Models.Residencies.remove({}, (err) => {
            if (err) throw "Error cleaning out Residencies";
            Models.Students.remove({}, (err) => {
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
                .get('/residencies')
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
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err) => {
                if (err) throw err;

                let testRes = new Models.Residencies({
                    name: "Johnny Test House",
                    students: [testStudent]
                });
                testRes.save((err) => {
                    if (err) throw err;

                    // Make residency request
                    chai.request(server)
                        .get('/residencies')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.have.property('residency');
                            expect(res.body.residency.length).to.be.eq(1);
                            expect(res.body.residency[0]).to.have.property('name');
                            expect(res.body.residency[0].name).to.equal(testRes.name);
                            expect(res.body.residency[0].students[0]).to.equal(testStudent._id.toString());
                            done();
                        });
                });
            });
        });

        it('it should GET the residency of a student', (done) => {

            // Set up mock data
            let testStudent1 = new Models.Students({name: "Johnny Test"});
            testStudent1.save((err) => {
                if (err) throw err;

                let testStudent2 = new Models.Students({name: "Jane Test"});
                testStudent2.save((err) => {
                    if (err) throw err;

                    let testRes = new Models.Residencies({
                        name: "Johnny Test House",
                        students: [testStudent1]
                    });
                    testRes.save((err) => {
                        if (err) throw err;

                        let testRes2 = new Models.Residencies({
                            name: "Johnny Not House",
                            students: [testStudent2]
                        });
                        testRes2.save((err) => {
                            if (err) throw err;

                            // Request residency
                            chai.request(server)
                                .get('/residencies?filter[student]=' + testStudent1._id.toString())
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
                });
            });
        });

        it('it should GET nothing if a student doesn\'t have a residence', (done) => {

            // Set up mock data
            let testStudent1 = new Models.Students({name: "Johnny Test"});
            testStudent1.save((err) => {
                if (err) throw err;

                let testStudent2 = new Models.Students({name: "Jane Test"});
                testStudent2.save((err) => {
                    if (err) throw err;

                    let testStudent3 = new Models.Students({name: "Eve Test"});
                    testStudent2.save((err) => {
                        if (err) throw err;

                        let testRes = new Models.Residencies({
                            name: "Johnny Test House",
                            students: [testStudent1, testStudent2]
                        });
                        testRes.save((err) => {
                            if (err) throw err;

                            // Make request
                            chai.request(server)
                                .get('/residencies?filter[student]=' + testStudent3._id.toString())
                                .end((err, res) => {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property('residency');
                                    expect(res.body.residency.length).to.be.eq(0);
                                    done();
                                });
                        });
                    });
                });
            });
        });

        it('it should GET the residency by name', (done) => {

            // Set up mock data
            let testStudent1 = new Models.Students({name: "Johnny Test"});
            testStudent1.save((err) => {
                if (err) throw err;

                let testRes = new Models.Residencies({
                    name: "Johnny Test House",
                    students: [testStudent1]
                });
                testRes.save((err) => {
                    if (err) throw err;

                    // Make request
                    chai.request(server)
                        .get('/residencies?filter[name]=' + "Johnny Test House")
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
        });

        it('it should GET nothing if a the name does not exist', (done) => {

            // Set up mock data
            let testStudent1 = new Models.Students({name: "Johnny Test"});
            testStudent1.save((err) => {
                if (err) throw err;

                let testRes = new Models.Residencies({
                    name: "Johnny Test House",
                    students: [testStudent1]
                });
                testRes.save((err) => {
                    if (err) throw err;

                    // Make request
                    chai.request(server)
                        .get('/residencies?filter[name]=' + "Johnny Test House2")
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.have.property('residency');
                            expect(res.body.residency.length).to.be.eq(0);
                            done();
                        });
                });
            });
        });

        it('it should GET residency when given ID', (done) => {

            // Set up mock data
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err) => {
                if (err) throw err;

                let testRes = new Models.Residencies({
                    name: "Johnny Test House",
                    students: [testStudent]
                });
                testRes.save((err) => {
                    if (err) throw err;

                    // Make request
                    chai.request(server)
                        .get('/residencies/' + testRes._id.toString())
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.have.property('residency');
                            expect(res.body.residency).to.be.a('object');
                            expect(res.body.residency).to.have.property('name');
                            expect(res.body.residency.name).to.equal(testRes.name);
                            expect(res.body.residency.students[0]).to.equal(testStudent._id.toString());
                            done();
                        });
                });
            });
        });

        it('it should 404 for residency when given bad ID', (done) => {

            // Set up mock data
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err) => {
                if (err) throw err;

                let testRes = new Models.Residencies({
                    name: "Johnny Test House",
                    students: [testStudent]
                });
                testRes.save((err) => {
                    if (err) throw err;

                    // Make request
                    chai.request(server)
                        .get('/residencies/453535')
                        .end((err, res) => {
                            expect(res).to.have.status(404);
                            done();
                        });
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
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err) => {
                if (err) throw err;

                var resData = {
                    name: "Johnny Test House",
                    students: [testStudent]
                };
                let testRes = new Models.Residencies();
                testRes.save((err) => {
                    if (err) throw err;

                    resData.name = "Johnny Test Shack";

                    // Make request
                    chai.request(server)
                        .put('/residencies/' + testRes._id)
                        .send({residency: resData})
                        .end((err, res) => {
                            // Test server response
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.have.property('residency');
                            expect(res.body.residency).to.be.a('object');
                            expect(res.body.residency).to.have.property('name');
                            expect(res.body.residency.name).to.equal(resData.name);
                            expect(res.body.residency.students[0]).to.equal(resData.students[0]._id.toString());

                            // Test mongo for changes
                            Models.Residencies.find(resData, (err, res) => {
                                expect(err).to.be.null;
                                expect(res.length).to.equal(1);
                                expect(res[0].name).to.equal(resData.name);
                                done();
                            });
                        });
                });
            });
        });

        it('it should 404 on PUT a nonexistent residency', (done) => {

            // Set up mock data
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err) => {
                if (err) throw err;

                var resData = {
                    name: "Johnny Test House",
                    students: [testStudent]
                };
                let testRes = new Models.Residencies();
                testRes.save((err) => {
                    if (err) throw err;

                    // Make request
                    chai.request(server)
                        .put('/residencies/' + '4534234')
                        .send({residency: resData})
                        .end((err, res) => {
                            expect(res).to.have.status(404);
                            done();
                        });
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
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err) => {
                if (err) throw err;

                let residency = {
                    residency: {
                        name: "Johnny Test Residence",
                        students: [testStudent._id.toString()]
                    }
                };

                // Make request
                chai.request(server)
                    .post('/residencies')
                    .send(residency)
                    .end((err, res) => {
                        expect(res).to.have.status(201);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('residency');
                        expect(res.body.residency).to.be.a('object');
                        expect(res.body.residency).to.have.property("_id");
                        expect(res.body.residency).to.have.property("students");
                        expect(res.body.residency.students).to.be.a("array");
                        expect(res.body.residency.students).contains(testStudent._id.toString());

                        Models.Residencies.findById(res.body.residency._id, function (error, residency) {
                            expect(error || residency.length === 0).to.be.false;
                            done();
                        });
                    });
            });
        });
    });
});
