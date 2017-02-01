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

        // Wait until the db connection is up
        new Promise((resolve, reject) => {
            // Busy-wait for existence
            while (typeof(Models.Residencies) == "undefined" || typeof(Models.Students) == "undefined");
            resolve();

        }).then(
            // Clear out all Residences then call done
            () => Models.Residencies.remove({}, (err) => done()));
    });

    /*
     * Test the /GET routes
     */
    describe('/GET residencies', () => {
        it('it should GET all residencies ', (done) => {
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
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err)=>{if (err) throw err});

            let testRes = new Models.Residencies({
                name: "Johnny Test House",
                students: [testStudent]
            });
            testRes.save((err)=>{if (err) throw err});

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

        it('it should GET the residency of a student', (done) => {
            let testStudent1 = new Models.Students({name: "Johnny Test"});
            testStudent1.save((err)=>{if (err) throw err});

            let testStudent2 = new Models.Students({name: "Jane Test"});
            testStudent2.save((err)=>{if (err) throw err});

            let testRes = new Models.Residencies({
                name: "Johnny Test House",
                students: [testStudent1, testStudent2]
            });
            testRes.save((err)=>{if (err) throw err});

            chai.request(server)
                .get('/residencies?filter[student]=' + testStudent2._id.toString())
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

        it('it should GET nothing if a student doesn\'t have a residence', (done) => {
            let testStudent1 = new Models.Students({name: "Johnny Test"});
            testStudent1.save((err)=>{if (err) throw err});

            let testStudent2 = new Models.Students({name: "Jane Test"});
            testStudent2.save((err)=>{if (err) throw err});

            let testStudent3 = new Models.Students({name: "Eve Test"});
            testStudent2.save((err)=>{if (err) throw err});

            let testRes = new Models.Residencies({
                name: "Johnny Test House",
                students: [testStudent1, testStudent2]
            });
            testRes.save((err)=>{if (err) throw err});

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

        it('it should GET residency when given ID', (done) => {
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err)=>{if (err) throw err});

            let testRes = new Models.Residencies({
                name: "Johnny Test House",
                students: [testStudent]
            });
            testRes.save((err)=>{if (err) throw err});

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

        it('it should 404 for residency when given bad ID', (done) => {
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err)=>{if (err) throw err});

            let testRes = new Models.Residencies({
                name: "Johnny Test House",
                students: [testStudent]
            });
            testRes.save((err)=>{if (err) throw err});

            chai.request(server)
                .get('/residencies/453535')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        it('it should PUT a new residency', (done) => {
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err)=>{if (err) throw err});

            let testRes = new Models.Residencies({
                name: "Johnny Test House",
                students: [testStudent]
            });
            testRes.save((err)=>{if (err) throw err});

            chai.request(server)
                .get('/residencies/453535')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });

    /*
     * Test the /POST routes
     */
    describe('/POST a residency', () => {
        it('it should POST successfully', (done) => {
            let testStudent = new Models.Students({name: "Johnny Test"});
            testStudent.save((err)=>{if (err) throw err});

            let residency = {
                residency: {
                    name: "Johnny Test Residence",
                    students: [testStudent._id.toString()]
                }
            };
            chai.request(server)
                .post('/residencies')
                .send(residency)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('residency');
                    expect(res.body.residency).to.be.a('object');
                    expect(res.body.residency).to.have.property("_id");
                    expect(res.body.residency).to.have.property("students");
                    expect(res.body.residency.students).to.be.a("array");
                    expect(res.body.residency.students).contains(testStudent._id.toString());

                    Models.Residencies.findById(res.body.residency._id, function(error, residency) {
                       if (error || residency.length === 0)
                           throw "Record was not written successfully.";
                        else
                            done();
                    });
                });
        });

    });

});