/**
 * Created by darryl on 2017-02-12.
 */

// Due to all the chai assertions and dynamic searches, shut off expr and loopfunc for the entire file
/* jshint expr: true, loopfunc: true */

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let faker = require('faker');
let times = require('async/times');
let each = require('async/each');
let eachSeries = require('async/eachSeries');
let timesSeries = require('async/timesSeries');

// StudentInfo imports
let Students = require('../models/schemas/studentinfo/studentSchema');
let Residencies = require('../models/schemas/studentinfo/residencySchema');
let Genders = require('../models/schemas/studentinfo/genderSchema');
let Awards = require('../models/schemas/studentinfo/awardSchema');
let AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');

// High school data imports
let HSGrades = require('../models/schemas/highschool/hsGradeSchema');
let HSCourses = require('../models/schemas/highschool/hsCourseSchema');
let HSCourseSources = require('../models/schemas/highschool/hsCourseSourceSchema');
let SecondarySchools = require('../models/schemas/highschool/secondarySchoolSchema');
let HSSubjects = require('../models/schemas/highschool/hsSubjectSchema');

// UWO courses imports
let Terms = require('../models/schemas/uwocourses/termSchema');
let TermCodes = require('../models/schemas/uwocourses/termCodeSchema');
let CourseCodes = require('../models/schemas/uwocourses/courseCodeSchema');
let CourseLoads = require('../models/schemas/uwocourses/courseLoadSchema');
let Grades = require('../models/schemas/uwocourses/gradeSchema');
let ProgramRecords = require('../models/schemas/uwocourses/programRecordSchema');
let ProgramStatuses = require('../models/schemas/uwocourses/programStatusSchema');
let PlanCodes = require('../models/schemas/uwocourses/planCodeSchema');

// UWO adjudication imports
let Adjudications = require('../models/schemas/uwoadjudication/adjudicationSchema');
let AssessmentCodes = require('../models/schemas/uwoadjudication/assessmentCodeSchema');
let Departments = require('../models/schemas/uwoadjudication/departmentSchema');
let Faculties = require('../models/schemas/uwoadjudication/facultySchema');
let LogicalExpressions = require('../models/schemas/uwoadjudication/logicalExpressionSchema');
let ProgramAdministrations = require('../models/schemas/uwoadjudication/programAdministrationSchema');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let expect = chai.expect;

chai.use(chaiHttp);

let host = "http://localhost:3700";     // This is the Node.js server

// Array of DB elements
let Lists = {
    residencyList: [],
    genderList: [],
    studentList: [],
    awardList: [],
    standingList: [],
    hsGradeList: [],
    hsCourseList: [],
    hsCourseSourceList: [],
    hsSubjectList: [],
    secondarySchoolList: [],
    termList: [],
    termCodeList: [],
    courseCodeList: [],
    courseLoadList: [],
    gradeList: [],
    programRecordList: [],
    programStatusList: [],
    planCodeList: [],
    adjudicationList: [],
    assessmentCodeList: [],
    departmentList: [],
    facultyList: [],
    logicalExpressionList: [],
    programAdministrationList: []
};

/**
 * Selects a random array element.
 *
 * @param min   The minimum index that can be used
 * @param max   The maximum index that can be used
 * @returns     An object from the array
 */
Array.prototype.randomObject = function (min = 0, max = null) {
    // Sanitize inputs
    min = parseInt(min);
    max = parseInt(max);
    if (isNaN(max) || max > this.length) max = this.length;
    if (isNaN(min) || min < 0) min = 0;

    // Return object min <= index < max
    return this[Math.floor(Math.random() * (max - min) + min)];
};

//////

// ANY PREREQUISITE TESTS BEFORE A ROUTE TEST BEGINS CAN BE PLACED HERE

/////


////////

// NOTE: remember to not use () => {} functions inside mocha tests due to the 'this' binding - it breaks Mocha!

////////

// Generic Tests
let Tests = {
    GetTests: {
        /**
         * Attempts to retrieve all models from the API endpoint and makes sure that it successfully received all data.
         *
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param modelArray        An array containing ModelType objects that is expected from the API call
         * @param queryOperand      Query operand can be a URL query object or a function that resolves into a URL query object
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        getAll: function (emberName, emberPluralized, ModelType, modelArray, queryOperand = null, itWrap = null) {
            if (itWrap === null) itWrap = it;
            return itWrap('it should GET all models', function (done) {
                // Resolve query operands
                if (typeof queryOperand === "function")
                    queryOperand = queryOperand();

                // Request all advanced standings
                chai.request(server)
                    .get('/api/' + emberPluralized)
                    .query(queryOperand)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property(emberName);
                        expect(res.body[emberName]).to.have.length(modelArray.length);

                        // Check contents for correctness
                        for (let num = 0; num < modelArray.length; num++) {
                            // Get matching object
                            let comparison = modelArray.find((el) => el._id.toString() === res.body[emberName][num]._id.toString());
                            expect(comparison).to.be.ok;
                            expect(new ModelType(res.body[emberName][num]).equals(comparison)).to.be.true;

                        }
                        done();
                    });
            });
        },

        /**
         * Attempts to retrieve all models from the API endpoint, one page at a time, and makes sure that it successfully received all data.
         * 
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param modelArray        An array containing ModelType objects that is expected from the API call
         * @param pageSize          The size of the page to use
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        getPagination: function (emberName, emberPluralized, ModelType, modelArray, pageSize = 5, itWrap = null) {
            if (itWrap === null) itWrap = it;
            itWrap('it should GET all models, one page at a time', function (done) {

                let remainingModels = new Set(modelArray.map(el => el._id.toString()));

                times(Math.ceil(modelArray.length / 5), function (n, next) {
                    // Request all advanced standings
                    chai.request(server)
                        .get('/api/' + emberPluralized)
                        .query({ offset: n * pageSize, limit: pageSize })
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.have.property(emberName);
                            expect(res.body).to.have.property("meta");
                            expect(res.body.meta.total).to.equal(modelArray.length);
                            expect(res.body.meta.limit).to.equal(pageSize);
                            expect(res.body.meta.offset).to.equal(n * pageSize);
                            expect(res.body[emberName]).to.have.length.at.most(pageSize);

                            // Remove model from remaining models
                            for (let num = 0; num < res.body[emberName].length; num++) {
                                expect(remainingModels.delete(res.body[emberName][num]._id.toString())).to.be.true;
                            }
                            next();
                        });
                }, function (err) {
                    if (err) throw err;
                    expect(remainingModels.size).to.equal(0);
                    done();
                });

            });

            return itWrap('it should GET nothing when the offset is too large', function (done) {
                // Request all advanced standings
                chai.request(server)
                    .get('/api/' + emberPluralized)
                    .query({ offset: modelArray.length, limit: pageSize })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property(emberName);
                        expect(res.body).to.have.property("meta");
                        expect(res.body.meta.total).to.equal(modelArray.length);
                        expect(res.body.meta.limit).to.equal(pageSize);
                        expect(res.body.meta.offset).to.equal(modelArray.length);
                        expect(res.body[emberName]).to.have.length(0);

                        done();
                    });
            });
        },

        /**
         * Attempts to retrieve all models from an API endpoint that match a filter query, and makes sure that it successfully received all matching data.
         *
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param elementSelection  A function that calls the passed callback with argument [{... filter contents ...}, [expected data object(s)]]
         * @param descriptionText   A custom message to append onto the test name to explain the specifics that it is achieving
         * @param queryOperand      Query operand can be a URL query object or a function that resolves into a URL query object
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        getByFilterSuccess: function (emberName, emberPluralized, ModelType, elementSelection, descriptionText = "", queryOperand = null, itWrap = null) {
            if (itWrap === null) itWrap = it;
            return itWrap('it should GET a model by a filter' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selections => {
                    // Resolve query operands
                    if (typeof queryOperand === "function")
                        queryOperand = queryOperand();

                    // Make request
                    chai.request(server)
                        .get('/api/' + emberPluralized)
                        .query(Object.assign({ filter: selections[0] }, queryOperand))
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.have.property(emberName);
                            expect(res.body[emberName]).to.have.length(selections[1].length);
                            for (let num = 0; num < selections[1].length; num++) {
                                // Get matching object
                                let comparison = selections[1].find((el) => el._id.toString() === res.body[emberName][num]._id.toString());
                                expect(comparison).to.be.ok;
                                expect(new ModelType(res.body[emberName][num]).equals(comparison)).to.be.true;
                            }
                            done();
                        });
                });
            });
        },

        /**
         * Attempts to retrieve a specific model from an API endpoint, and makes sure that it successfully received the requested data.
         * 
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param elementSelection  A function that calls the passed callback with the data object as the argument
         * @param descriptionText   A custom message to append onto the test name to explain the specifics that it is achieving
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        getByID: function (emberName, emberPluralized, ModelType, elementSelection, descriptionText = "", itWrap = null) {
            if (itWrap === null) itWrap = it;
            return itWrap('it should GET a model by id' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .get(['/api', emberPluralized, selection._id.toString()].join('/'))
                        .end((err, res) => {
                            // Find model, expect a 404 if nothing was found
                            ModelType.findById(selection._id, function (err, found) {
                                if (err) throw err;

                                if (!found) {
                                    // Sometimes a user fault causes a fail so bad that the server 500s instead. Catch both.
                                    try {
                                        expect(res).to.have.status(404);
                                    } catch (staterr) {
                                        expect(res).to.have.status(500);
                                    }
                                }
                                else {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property(emberName);
                                    expect(new ModelType(res.body[emberName]).equals(selection)).to.be.true;
                                }
                                done();
                            });
                        });
                });
            });
        }
    },

    PutTests: {
        /**
         * Attempts to update a given object with new values through an API endpoint, and makes sure that the model was updated successfully, or failed in an expected manner.
         * 
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param elementSelection  A function that calls the passed callback with argument [{updated data}, expected model]
         * @param requiredElements  An array that the new model requires to have, otherwise the API call will error 400
         * @param descriptionText   A custom message to append onto the test name to explain the specifics that it is achieving
         * @param postPutVerify     A function that receives (next, API result) to allow additional checks to be made before declaring the PUT a success
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        putUpdated: function (emberName, emberPluralized, ModelType, elementSelection, requiredElements = [], descriptionText = "", postPutVerify = (cb) => cb(), itWrap = null) {
            if (itWrap === null) itWrap = it;
            return itWrap('it should PUT an updated model and update all fields' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {

                    // Make request
                    chai.request(server)
                        .put(['/api', emberPluralized, selection[1]._id.toString()].join('/'))
                        .send({ [emberName]: selection[0] })
                        .end((err, res) => {
                            ModelType.findById(selection[1]._id, function (err, data) {
                                if (err) throw err;


                                // Check to make sure all required elements are present
                                let expect400 = false;
                                for (let element of requiredElements) if (!selection[0][element]) expect400 = true;

                                // Check conditions to expect certain error codes
                                if (expect400) {
                                    expect(res).to.have.status(400);
                                    done();
                                }
                                else if (!data) {
                                    // Sometimes a user fault causes a fail so bad that the server 500s instead. Catch both.
                                    try {
                                        expect(res).to.have.status(404);
                                    } catch (staterr) {
                                        expect(res).to.have.status(500);
                                    }
                                    done();
                                }
                                else {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property(emberName);

                                    // Check to make sure returned value matches expected
                                    expect(new ModelType(res.body[emberName]).equals(selection[1])).to.be.true;
                                    expect(err).to.be.null;
                                    expect(data).to.be.ok;
                                    expect(data.equals(selection[1])).to.be.true;
                                    postPutVerify(done, res);
                                }
                            });
                        });
                });
            });
        },

        /**
         * Attempts to update a given object with new values through an API endpoint that cause a uniqueness conflict, and makes sure that the update fails in an expected manner.
         *
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param elementSelection  A function that calls the passed callback with argument [{updated data}, id of model to update]
         * @param requiredElements  An array that the new model requires to have, otherwise the API call will error 400
         * @param descriptionText   A custom message to append onto the test name to explain the specifics that it is achieving
         * @param postPutVerify     A function that receives (next, API result) to allow additional checks to be made before declaring the PUT a success
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        putNotUnique: function (emberName, emberPluralized, ModelType, elementSelection, requiredElements = [], descriptionText = "", postPutVerify = (cb) => cb(), itWrap = null) {
            if (itWrap === null) itWrap = it;
            return itWrap('it should PUT an updated model and update all fields' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {

                    // Make request
                    chai.request(server)
                        .put(['/api', emberPluralized, selection[1].toString()].join('/'))
                        .send({ [emberName]: selection[0] })
                        .end((err, res) => {
                            ModelType.findById(selection[1], function (err, data) {
                                if (err) throw err;


                                // Check to make sure all required elements are present
                                let expect400 = false;
                                for (let element of requiredElements) if (!selection[0][element]) expect400 = true;

                                // Check conditions to expect certain error codes
                                if (expect400) {
                                    expect(res).to.have.status(400);
                                    done();
                                }
                                else if (!data) {
                                    // Sometimes a user fault causes a fail so bad that the server 500s instead. Catch both.
                                    try {
                                        expect(res).to.have.status(404);
                                    } catch (staterr) {
                                        expect(res).to.have.status(500);
                                    }
                                    done();
                                }
                                else {
                                    expect(res).to.have.status(500);
                                    postPutVerify(done, res);
                                }
                            });
                        });
                });
            });
        },
    },

    PostTests: {

        /**
         * Attempts to create a given object with through an API endpoint, and makes sure that the model was created successfully, or failed in an expected manner.
         *
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param elementSelection  A function that calls the passed callback with argument [{updated data}, expected model]
         * @param requiredElements  An array that the new model requires to have, otherwise the API call will error 400
         * @param descriptionText   A custom message to append onto the test name to explain the specifics that it is achieving
         * @param postPostVerify    A function that receives (next, API result) to allow additional checks to be made before declaring the POST a success
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        postNew: function (emberName, emberPluralized, ModelType, elementSelection, requiredElements = [], descriptionText = "", postPostVerify = (cb) => cb(), itWrap = null) {
            if (itWrap === null) itWrap = it;
            return itWrap('it should POST' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .post(['/api', emberPluralized].join('/'))
                        .send({ [emberName]: selection[0] })
                        .end((err, res) => {
                            // Check to make sure all required elements are present
                            let expect400 = false;
                            for (let element of requiredElements) if (!selection[0][element]) expect400 = true;

                            // Check conditions to expect certain error codes
                            if (expect400) {
                                expect(res).to.have.status(400);
                                done();
                            }
                            else {
                                expect(res).to.have.status(201);
                                expect(res).to.be.json;
                                expect(res.body).to.have.property(emberName);

                                // Check to make sure returned value matches expected
                                selection[1]._id = res.body[emberName]._id;     // Swap out ID to make it match
                                expect(new ModelType(res.body[emberName]).equals(selection[1])).to.be.true;

                                // Check underlying database
                                ModelType.findById(res.body[emberName]._id, function (error, data) {
                                    expect(error).to.be.null;
                                    expect(data).to.be.ok;
                                    expect(data.equals(selection[1])).to.be.true;
                                    postPostVerify(done, res);
                                });
                            }
                        });
                });
            });
        },

        /**
         * Attempts to create a given object with new values through an API endpoint that cause a uniqueness conflict, and makes sure that the creation fails in an expected manner.
         *
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param elementSelection  A function that calls the passed callback with argument {new data}
         * @param requiredElements  An array that the new model requires to have, otherwise the API call will error 400
         * @param descriptionText   A custom message to append onto the test name to explain the specifics that it is achieving
         * @param postPostVerify    A function that receives (next, API result) to allow additional checks to be made before declaring the POST a success
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        postNotUnique: function (emberName, emberPluralized, ModelType, elementSelection, requiredElements = [], descriptionText = "", postPostVerify = (cb) => cb(), itWrap = null) {
            if (itWrap === null) itWrap = it;
            return itWrap('it should POST' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .post(['/api', emberPluralized].join('/'))
                        .send({ [emberName]: selection })
                        .end((err, res) => {
                            // Check to make sure all required elements are present
                            let expect400 = false;
                            for (let element of requiredElements) if (!selection[element]) expect400 = true;

                            // Check conditions to expect certain error codes
                            if (expect400) {
                                expect(res).to.have.status(400);
                                done();
                            }
                            else {
                                expect(res).to.have.status(500);
                                postPostVerify(done, res);
                            }
                        });
                });
            });
        },
    },

    DeleteTests: {

        /**
         * Attempts to delete a given object ID through an API endpoint, and makes sure that the deletion succeeded.
         *
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param elementSelection  A function that calls the passed callback with argument "id of object to delete"
         * @param descriptionText   A custom message to append onto the test name to explain the specifics that it is achieving
         * @param postDeleteVerify  A function that receives (next, API result) to allow additional checks to be made before declaring the DELETE a success
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        deleteExisting: function (emberName, emberPluralized, ModelType, elementSelection, descriptionText = "", postDeleteVerify = (cb) => cb(), itWrap = null) {
            if (itWrap === null) itWrap = it;
            return itWrap('it should DELETE and cleanup if applicable' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .delete(['/api', emberPluralized, selection].join('/'))
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property(emberName);

                            // Check underlying database
                            ModelType.findById(selection._id, function (error, obj) {
                                expect(error).to.be.null;
                                expect(obj).to.be.null;
                                postDeleteVerify(done, res);
                            });
                        });
                });
            });
        },

        /**
         * Attempts to delete a non-existent object ID through an API endpoint, and makes sure that the deletion failed in an expected manner.
         * 
         * @param emberName         A string representing the name to be expected as the content-containing key in the API call route response
         * @param emberPluralized   A string representing the name to be used in the API call route
         * @param ModelType         A model that matches the type returned by the API call
         * @param elementSelection  A function that calls the passed callback with argument  "id of object to delete"
         * @param descriptionText   A custom message to append onto the test name to explain the specifics that it is achieving
         * @param postDeleteVerify  A function that receives (next, API result) to allow additional checks to be made before declaring the DELETE a success
         * @param itWrap            Change the function that is called for a test - defaults to mocha 'it'
         */
        deleteNonexistent: function (emberName, emberPluralized, ModelType, elementSelection, descriptionText = "", postDeleteVerify = (cb) => cb(), itWrap = null) {
            if (itWrap === null) itWrap = it;
            return itWrap('it should fail to DELETE with error 404' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .delete(['/api', emberPluralized, selection].join('/'))
                        .end((err, res) => {
                            // Sometimes a user fault causes a fail so bad that the server 500s instead. Catch both.
                            try {
                                expect(res).to.have.status(404);
                            } catch (staterr) {
                                expect(res).to.have.status(500);
                            }

                            // Check underlying database
                            ModelType.findById(selection._id, function (error, obj) {
                                expect(error).to.be.null;
                                expect(obj).to.be.null;
                                postDeleteVerify(done, res);
                            });
                        });
                });
            });
        }
    }
};



/////// Data Generation ///////

/**
 * This function wipes and regenerates new random data in the database for the next test.
 * @param done  The callback to be called when regeneration is finished.
 */
let regenAllData = function (done) {
    // This may be a slow operation
    this.timeout(6000);

    // Wipe the database of all data
    each([
        Residencies,
        Students,
        Awards,
        AdvancedStandings,
        Genders,
        HSGrades,
        HSCourses,
        HSCourseSources,
        SecondarySchools,
        HSSubjects,
        Terms,
        TermCodes,
        CourseCodes,
        CourseLoads,
        Grades,
        ProgramRecords,
        ProgramStatuses,
        PlanCodes,
        ProgramAdministrations,
        LogicalExpressions,
        Faculties,
        Departments,
        AssessmentCodes,
        Adjudications,
        LogicalExpressions
    ], (mod, cb) => {
        // Delete all data from the given model, call cb(err) if something happens.
        mod.remove({}, (err) => err ? cb(err) : cb());
    }, (err) => {
        // Catch wipe errors
        if (err) throw err;

        // Wipe all model data arrays
        Object.keys(Lists).forEach(el => Lists[el].length = 0);

        // Generate male and female genders
        each(["Male", "Female"], generateGender, (err) => {
            // Catch generation errors
            if (err) throw err;

            let executions = [
                [5, generateResidency],
                [25, generateStudent],
                [50, generateAward],
                [50, generateStanding],
                [5, generateSecondarySchool],
                [2, generateHsCourseSource],
                [5, generateHsSubject],
                [10, generateHsCourse],
                [50, generateHsGrade],
                [10, generatePlanCode],
                [50, generateGrade],
                [2, generateCourseLoad],
                [10, generateCourseCode],
                [3, generateProgramStatus],
                [75, generateProgramRecord],
                [3, generateTerm],
                [5, generateTermCode],
                [2, generateFaculties],
                [8, generateDepartments],
                [20, generateProgramAdministrations],
                [30, generateAssessmentCodes],
                [85, generateAdjudications],
                [1, (_, cb) => timesSeries(100, generateLogicalExpressions, cb)]
            ];
            eachSeries(executions, (item, cb) => {
                times(item[0], item[1], cb);
            }, (err) => {
                if (err) throw err;
                else done();
            });
        });
    });
};


/// HELPERS ///
let generateAdjudications = (number, callback) => {
    let termTotal = faker.random.number(14)/2;    
    genBase(Adjudications, Lists.adjudicationList, {
        date: faker.date.past(10),
        termAVG: faker.random.number(100),
        termUnitsPassed: faker.random.number(termTotal * 2) / 2,
        termUnitsTotal: termTotal,
        note: faker.lorem.paragraph(),
        term: Lists.termList.randomObject(),
        assessmentCode: Lists.termList.randomObject()
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateAdjudications(number - 1, callback);
        }
        else callback();
    });
};
let generateAssessmentCodes = (number, callback) => {
    genBase(AssessmentCodes, Lists.assessmentCodeList, {
        code: faker.lorem.word(),
        name: faker.lorem.words(5),
        faculty: Lists.facultyList.randomObject(),
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateAssessmentCodes(number - 1, callback);
        }
        else callback();
    });
};
let generateDepartments = (number, callback) => {
    genBase(Departments, Lists.departmentList, {
        name: faker.lorem.words(5),
        faculty: Lists.facultyList.randomObject()
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateDepartments(number - 1, callback);
        }
        else callback();
    });
};
let generateFaculties = (number, callback) => {
    genBase(Faculties, Lists.facultyList, {
        name: faker.lorem.words(5)
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateFaculties(number - 1, callback);
        }
        else callback();
    });
};
let generateLogicalExpressions = (number, callback) => {
    // NOTE: Because this is self-referential, multiple calls must be called in series
    genBase(LogicalExpressions, Lists.logicalExpressionList, {
        booleanExp: faker.lorem.words(5),
        logicalLink: faker.lorem.words(5),
        assessmentCode: Lists.assessmentCodeList.randomObject(),
        parentExpression: Lists.logicalExpressionList.randomObject()
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateLogicalExpressions(number - 1, callback);
        }
        else callback();
    });
};
let generateProgramAdministrations = (number, callback) => {
    genBase(ProgramAdministrations, Lists.programAdministrationList, {
        name: faker.name.findName(),
        position: faker.name.jobDescriptor(),
        department: Lists.departmentList.randomObject()
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateProgramAdministrations(number - 1, callback);
        }
        else callback();
    });
};
let generatePlanCode = (number, callback) => {
    genBase(PlanCodes, Lists.planCodeList, {
        name: faker.random.words(1, 3)
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generatePlanCode(number - 1, callback);
        }
        else callback();
    });
};
let generateProgramStatus = (number, callback) => {
    genBase(ProgramStatuses, Lists.programStatusList, {
        status: faker.random.words(1, 3)
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateProgramStatus(number - 1, callback);
        }
        else callback();
    });
};
let generateProgramRecord = (number, callback) => {
    let plans = Lists.planCodeList.filter(() => Math.random() * 10 > 8);
    if (plans.length === 0)
        plans.push(Lists.planCodeList.randomObject());

    genBase(ProgramRecords, Lists.programRecordList, {
        name: faker.random.words(1, 3),
        level: faker.random.number(9),
        load: Lists.courseLoadList.randomObject(),
        status: Lists.programStatusList.randomObject(),
        plan: plans
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateProgramRecord(number - 1, callback);
        }
        else callback();
    });
};
let generateGrade = (number, callback) => {
    genBase(Grades, Lists.gradeList, {
        mark: faker.random.number(100).toString(),
        note: faker.lorem.paragraph()
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateGrade(number - 1, callback);
        }
        else callback();
    });
};
let generateCourseLoad = (number, callback) => {
    genBase(CourseLoads, Lists.courseLoadList, {
        load: faker.random.words(1, 3)
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateCourseLoad(number - 1, callback);
        }
        else callback();
    });
};
let generateCourseCode = (number, callback) => {
    genBase(CourseCodes, Lists.courseCodeList, {
        courseLetter: faker.random.word(),
        courseNumber: faker.random.word(),
        name: faker.random.words(2),
        unit: faker.random.number(4) / 2,
        termInfo: Lists.termList.randomObject(),
        gradeInfo: Lists.gradeList.randomObject()
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateCourseCode(number - 1, callback);
        }
        else callback();
    });
};
let generateTerm = (number, callback) => {
    let records = Lists.programRecordList.filter(() => Math.random() * 10 > 8);
    if (records.length === 0)
        records.push(Lists.programRecordList.randomObject());

    genBase(Terms, Lists.termList, {
        termCode: Lists.termCodeList.randomObject(),
        student: Lists.studentList.randomObject(),
        programRecords: records
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateTerm(number - 1, callback);
        }
        else callback();
    });
};
let generateTermCode = (number, callback) => {
    genBase(TermCodes, Lists.termCodeList, {
        name: faker.random.words(1, 3),
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateTermCode(number - 1, callback);
        }
        else callback();
    });
};
let generateSecondarySchool = (number, callback) => {
    genBase(SecondarySchools, Lists.secondarySchoolList, {
        name: faker.random.words(2, 5)
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateSecondarySchool(number - 1, callback);
        }
        else callback();
    });
};
let generateHsSubject = (number, callback) => {
    genBase(HSSubjects, Lists.hsSubjectList, {
        name: faker.random.words(1, 2),
        description: faker.lorem.paragraphs(2)
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateHsSubject(number - 1, callback);
        }
        else callback();
    });
};
let generateHsCourseSource = (number, callback) => {
    genBase(HSCourseSources, Lists.hsCourseSourceList, {
        code: faker.random.word()
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateHsCourseSource(number - 1, callback);
        }
        else callback();
    });
};
let generateHsCourse = (number, callback) => {
    genBase(HSCourses, Lists.hsCourseList, {
        level: faker.random.number(9, 12),
        unit: faker.random.number(1, 4) / 2,
        source: Lists.hsCourseSourceList[faker.random.number(Lists.hsCourseSourceList.length - 1)],
        school: Lists.secondarySchoolList[faker.random.number(Lists.secondarySchoolList.length - 1)],
        subject: Lists.hsSubjectList[faker.random.number(Lists.hsSubjectList.length - 1)]
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateHsCourse(number - 1, callback);
        }
        else callback();
    });
};
let generateHsGrade = (number, callback) => {
    genBase(HSGrades, Lists.hsGradeList, {
        mark: faker.random.number(100).toString(),
        course: Lists.hsCourseList[faker.random.number(Lists.hsCourseList.length - 1)],
        recipient: Lists.studentList[faker.random.number(Lists.studentList.length - 1)]
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateHsGrade(number - 1, callback);
        }
        else callback();
    });
};
let generateStanding = (number, callback) => {
    let courses = [
        {
            course: 'BASKWEAV 1000',
            description: "Intro to Basket Weaving"
        },
        {
            course: 'SE 3350',
            description: "Software Design"
        },
        {
            course: 'SE 3351',
            description: "Project Management"
        },
        {
            course: 'SE 2250',
            description: "Intro to Basket Weaving"
        },
        {
            course: 'SE 2203',
            description: "Software Design"
        },
        {
            course: 'SE 2205',
            description: "Algorithms"
        },
        {
            course: 'ECE 3375',
            description: "Microprocessors"
        },
        {
            course: 'SE 3314',
            description: "Network Applications"
        },
        {
            course: 'SE 3310',
            description: "Theory of Computing"
        },
        {
            course: 'SE 3353',
            description: "HCI"
        },
    ];
    let fromData = [
        'UBC',
        'Brock',
        'Harvard',
        'MIT',
        'Stanford',
        'UoT',
        'Waterloo',
        'Laurier',
        'Ottawa',
        'McMaster',
        'Guelph',
        'Windsor'
    ];

    // Pick a random course
    let course = courses[faker.random.number(courses.length - 1)];

    genBase(AdvancedStandings, Lists.standingList, {
        course: course.course,
        description: course.description,
        units: Math.floor(Math.random() * 4) / 2 + 0.5, // Either 0, 0.5, 1, 1.5, or 2
        grade: Math.floor(Math.random() * 101), // From 0-100
        from: fromData[Math.floor(Math.random() * fromData.length)],
        recipient: Lists.studentList[faker.random.number(Lists.studentList.length - 1)]
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateStanding(number - 1, callback);
        }
        else callback();
    });
};
let generateAward = (number, callback) => {
    let awardNames = [
        'Excellence in Academia',
        'Making the Difference',
        'Completion',
        'Star Student',
        'Honor Roll',
        'Best in Class',
        'Honors Award',
        'Certified in Life',
        'Certified Smile Maker',
        'Energizer Bunny Award',
        'Money Maker Award',
        'Needle Mover Award',
        'Most Improved',
        'Hard Worker Award',
        'Ember Champion',
        'Mountain Mover',
        'Commitment to Excellence',
        'Commitment to Service',
        'Commitment to Education',
        'Commitment to Kids',
        'Behind the Scenes Award',
        'Top Team',
        'Teamwork Award',
        'Mission Possible Award',
        'Customer Service Award',
        'Pat on the Back Award',
        'Volunteer of the Year',
        'Teacher of the Year',
        'Student of the Year',
        'Student of the Month',
        'You Make the Difference',
        'Shining Star',
        'Certificate of Recognition',
        'Certificate of Achievement',
        'Certificate of Excellence',
        'Certificate of Completion',
        'Academic Star',
        'Perfect Attendance',
        'Responsibility Award',
        'Outstanding Achievement',
        'Rookie of the Year',
        'Outstanding Leadership',
        'Leading By Example',
        'Above & Beyond',
        'Key to Success',
        'Dedicated Service',
        '9001 Years of Service',
        'Helping Hand Award',
        'Caught in the Act of Caring Award',
        'Made My Day Award'
    ];
    genBase(Awards, Lists.awardList, {
        note: awardNames[faker.random.number(awardNames.length - 1)],
        recipient: Lists.studentList[faker.random.number(Lists.studentList.length - 1)]
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateAward(number - 1, callback);
        }
        else callback();
    });
};
let generateStudent = (number, callback) => {
    genBase(Students, Lists.studentList, {
        number: faker.random.number(100000000, 999999999),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        DOB: faker.date.past(),   // TODO: this is wrong format
        registrationComments: faker.lorem.paragraph(),
        basisOfAdmission: faker.lorem.paragraph(),
        admissionAverage: faker.lorem.paragraph(),
        admissionComments: faker.lorem.paragraph(),
        resInfo: Lists.residencyList[faker.random.number(Lists.residencyList.length - 1)],
        genderInfo: Lists.genderList[faker.random.number(Lists.genderList.length - 1)],
    })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateStudent(number - 1, callback);
        }
        else callback();
    });
};
let generateGender = (name, cb) => {
    // Create and save gender, then put on list
    genBase(Genders, Lists.genderList, { name: name })(cb);
};
let generateResidency = (number, callback) => {
    // Create and save residency, then put on list
    genBase(Residencies, Lists.residencyList, { name: faker.lorem.words(1, 5) })(err => {
        // Retry a few times in case random generation causes duplicate
        if (err) {
            if (number < -1) callback(err);
            else generateResidency(number - 1, callback);
        }
        else callback();
    });
};
/**
 * Save a generic model to the database and add the object to a specified list.
 * @param Model         The model to save.
 * @param list          The list to append the new model onto.
 * @param contents      The contents of the model.
 * @returns {Function}  Returns a function to call that accepts a callback when complete.
 */
let genBase = (Model, list, contents) => {
    return function (callback) {
        let modelObj = new Model(contents);
        modelObj.save(function (err, res) {
            if (err) return callback(err);
            list.push(res);
            callback(null, modelObj);
        });
    };
};


////// EXPORTS //////

exports.regenAllData = regenAllData;
exports.host = host;
exports.chai = chai;
exports.server = server;

exports.DBElements = Lists;

exports.Generators = {};
exports.Generators.generateStanding = generateStanding;
exports.Generators.generateAward = generateAward;
exports.Generators.generateStudent = generateStudent;
exports.Generators.generateGender = generateGender;
exports.Generators.generateResidency = generateResidency;


exports.Tests = Tests;
