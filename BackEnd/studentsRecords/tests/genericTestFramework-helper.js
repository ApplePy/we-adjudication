/**
 * Created by darryl on 2017-02-12.
 */
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let faker = require('faker');
let times = require('async/times');
let each = require('async/each');
let eachSeries = require('async/eachSeries');

let Students = require('../models/schemas/studentinfo/studentSchema');
let Residencies = require('../models/schemas/studentinfo/residencySchema');
let Genders = require('../models/schemas/studentinfo/genderSchema');
let Awards = require('../models/schemas/studentinfo/awardSchema');
let AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');

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
    hsGradesList: [],
    hsCoursesList: []
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
        // Query operand can be an object or a function that resolves into an object
        getAll: function (emberName, emberPluralized, modelType, modelArray, queryOperand = null) {
            return it('it should GET all models', function (done) {
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
                            expect(new modelType(res.body[emberName][num]).equals(comparison)).to.be.true;

                        }
                        done();
                    });
            });
        },

        getPagination: function(emberName, emberPluralized, modelType, modelArray, pageSize = 5) {
            return it('it should GET all models, one page at a time', function(done) {

                let remainingModels = new Set(modelArray.map(el => el._id.toString()));

                times(Math.ceil(modelArray.length / 5), function (n, next) {
                    // Request all advanced standings
                    chai.request(server)
                        .get('/api/' + emberPluralized)
                        .query({offset: n * pageSize, limit: pageSize})
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.have.property(emberName);
                            expect(res.body[emberName]).to.have.length.at.most(pageSize);

                            // Remove model from remaining models
                            for (let num = 0; num < res.body[emberName].length; num++) {
                                expect(remainingModels.delete(res.body[emberName][num]._id.toString())).to.be.true;
                            }
                            next();
                        });
                }, function (err, results) {
                    if (err) throw err;
                    expect(remainingModels.size).to.equal(0);
                    done();
                });

            });
        },

        // element selection calls the passed callback with argument [{... filter contents ...}, [expected data object(s)]]
        // Query operand can be an object or a function that resolves into an object
        getByFilterSuccess: function (emberName, emberPluralized, modelType, elementSelection, descriptionText = "", queryOperand = null) {
            return it('it should GET a model by a filter' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selections => {
                    // Resolve query operands
                    if (typeof queryOperand === "function")
                        queryOperand = queryOperand();

                    // Make request
                    chai.request(server)
                        .get('/api/' + emberPluralized)
                        .query(Object.assign({filter: selections[0]}, queryOperand))
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res).to.be.json;
                            expect(res.body).to.have.property(emberName);
                            expect(res.body[emberName]).to.have.length(selections[1].length);
                            for (let num = 0; num < selections[1].length; num++) {
                                // Get matching object
                                let comparison = selections[1].find((el) => el._id.toString() === res.body[emberName][num]._id.toString());
                                expect(comparison).to.be.ok;
                                expect(new modelType(res.body[emberName][num]).equals(comparison)).to.be.true;
                            }
                            done();
                        });
                });
            });
        },

        // element selection calls the passed callback with the data object as the argument
        getByID: function (emberName, emberPluralized, modelType, elementSelection, descriptionText = "") {
            return it('it should GET a model by id' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .get(['/api', emberPluralized, selection._id.toString()].join('/'))
                        .end((err, res) => {
                            // Find model, expect a 404 if nothing was found
                            modelType.findById(selection._id, function (err, found) {
                                if (err) throw err;

                                if (!found) {
                                    try {
                                        expect(res).to.have.status(404);
                                    } catch(staterr) {
                                        expect(res).to.have.status(500);
                                    }
                                }
                                else {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property(emberName);
                                    expect(new modelType(res.body[emberName]).equals(selection)).to.be.true;
                                }
                                done();
                            });
                        });
                });
            });
        }
    },

    PutTests: {
        // Element selection supplies: [{updated data}, expected model]
        putUpdated: function (emberName, emberPluralized, modelType, elementSelection, requiredElements = [], descriptionText = "", postPutVerify = (cb, res) => cb()) {
            return it('it should PUT an updated model and update all fields' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {

                    // Make request
                    chai.request(server)
                        .put(['/api', emberPluralized, selection[1]._id.toString()].join('/'))
                        .send({[emberName]: selection[0]})
                        .end((err, res) => {
                            modelType.findById(selection[1]._id, function (err, data) {
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
                                    try {
                                        expect(res).to.have.status(404);
                                    } catch(staterr) {
                                        expect(res).to.have.status(500);
                                    }
                                    done();
                                }
                                else {
                                    expect(res).to.have.status(200);
                                    expect(res).to.be.json;
                                    expect(res.body).to.have.property(emberName);

                                    // Check to make sure returned value matches expected
                                    expect(new modelType(res.body[emberName]).equals(selection[1])).to.be.true;
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

        // Element selection supplies: [{updated data}, id of model to update]
        putNotUnique: function (emberName, emberPluralized, modelType, elementSelection, requiredElements = [], descriptionText = "", postPutVerify = (cb, res) => cb()) {
            return it('it should PUT an updated model and update all fields' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {

                    // Make request
                    chai.request(server)
                        .put(['/api', emberPluralized, selection[1].toString()].join('/'))
                        .send({[emberName]: selection[0]})
                        .end((err, res) => {
                            modelType.findById(selection[1], function (err, data) {
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
                                    try {
                                        expect(res).to.have.status(404);
                                    } catch(staterr) {
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
        // Element selection supplies: [{updated data}, expected model]
        postNew: function (emberName, emberPluralized, modelType, elementSelection, requiredElements = [], descriptionText = "", postPostVerify = (cb, res) => cb()) {
            return it('it should POST' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .post(['/api', emberPluralized].join('/'))
                        .send({[emberName]: selection[0]})
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
                                expect(new modelType(res.body[emberName]).equals(selection[1])).to.be.true;

                                // Check underlying database
                                modelType.findById(res.body[emberName]._id, function (error, data) {
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

        // Element selection supplies: {new data}
        postNotUnique: function (emberName, emberPluralized, modelType, elementSelection, requiredElements = [], descriptionText = "", postPostVerify = (cb, res) => cb()) {
            return it('it should POST' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .post(['/api', emberPluralized].join('/'))
                        .send({[emberName]: selection})
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
        // Element selection supplies the id to delete
        deleteExisting: function(emberName, emberPluralized, modelType, elementSelection, descriptionText = "", postDeleteVerify = (cb, res) => cb()) {
            return it('it should DELETE and cleanup if applicable' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .delete(['/api', emberPluralized, selection].join('/'))
                        .end((err, res) => {
                            expect(res).to.have.status(200);

                            // Check underlying database
                            modelType.findById(selection._id, function (error, obj) {
                                expect(error).to.be.null;
                                expect(obj).to.be.null;
                                postDeleteVerify(done, res);
                            });
                        });
                });
            });
        },

        // Element selection supplies the id to delete
        deleteNonexistent: function(emberName, emberPluralized, modelType, elementSelection, descriptionText = "", postDeleteVerify = (cb, res) => cb()) {
            return it('it should fail to DELETE with error 404' + (descriptionText ? ": " : "") + descriptionText, function (done) {
                elementSelection.bind(this)(selection => {
                    // Make request
                    chai.request(server)
                        .delete(['/api', emberPluralized, selection].join('/'))
                        .end((err, res) => {
                            try {
                                expect(res).to.have.status(404);
                            } catch(staterr) {
                                expect(res).to.have.status(500);
                            }

                            // Check underlying database
                            modelType.findById(selection._id, function (error, obj) {
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
let regenAllData = function(done) {
    // This may be a slow operation
    this.timeout(6000);

    // Wipe the database of all data
    each([Residencies, Students, Awards, AdvancedStandings, Genders], (mod, cb) => {
        // Delete all data from the given model, call cb(err) if something happens.
        mod.remove({}, (err) => err ? cb(err) : cb());
    }, (err) => {
        // Catch wipe errors
        if (err) throw err;

        // Wipe all model data arrays
        Lists.residencyList.length = 0;
        Lists.genderList.length = 0;
        Lists.studentList.length = 0;
        Lists.awardList.length = 0;
        Lists.standingList.length = 0;

        // Generate male and female genders
        each(["Male", "Female"], generateGender, (err) => {
            // Catch generation errors
            if (err) throw err;

            let executions = [
                [5, generateResidency],
                [15, generateStudent],
                [50, generateAward],
                [50, generateStanding],
            ];
            eachSeries (executions, (item, cb) => {
                times(item[0], item[1], (err) => {
                    // Catch generation errors
                    if (err) cb(err);
                    else cb();
                });
            }, (err) => {
                if (err) throw err;
                else done();
            });
        });
    });
};


/// HELPERS ///

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
    })(callback);
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
    })(callback);
};
let generateStudent = (number, callback) => {
  genBase(Students, Lists.studentList, {
      number: faker.random.number(100000000, 999999999),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      DOB: faker.date.past(),   // TODO: this is wrong format
      registrationComments: faker.lorem.paragraph(),
      basisOfAdmission: faker.lorem.paragraph(),
      admissionAverage: faker.random.number(100),
      admissionComments: faker.lorem.paragraph(),
      resInfo: Lists.residencyList[faker.random.number(Lists.residencyList.length - 1)],
      genderInfo: Lists.genderList[faker.random.number(Lists.genderList.length - 1)],
  })(callback);
};
let generateGender = (name, cb) => {
    // Create and save gender, then put on list
    genBase(Genders, Lists.genderList, {name: name})(cb);
};
let generateResidency = (number, callback) => {
    // Create and save residency, then put on list
    genBase(Residencies, Lists.residencyList, {name: faker.lorem.words()})(callback);
};
/**
 * Save a generic model to the database and add the object to a specified list.
 * @param model         The model to save.
 * @param list          The list to append the new model onto.
 * @param contents      The contents of the model.
 * @returns {Function}  Returns a function to call that accepts a callback when complete.
 */
let genBase = (model, list, contents) => {
    return function (callback) {
        let modelObj = new model(contents);
        modelObj.save(function (err, res) {
            if (err) return callback(err);
            list.push(res);
            callback(null, modelObj);
        });
    }
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



// /**
//  * Given a flat API output (no nested objects that contain Mongo OIDs), compare against a model for equality.
//  * @param apiOutput     The output returned by the API.
//  * @param model         The model the API output is supposed to match
//  * @param objIdKeys     The keys in the model that are actually Mongo OIDs that need to be handled specially.
//  * @param excludeKeys   The keys for Mongo OID-containing nested data structures that need to be excluded from comparison.
//  */
// let checkForEquality = (apiOutput, model, objIdKeys, excludeKeys) => {
//     // Strip off _id, __v, and other excluded keys since it causes problems
//     delete apiOutput._id;
//     delete apiOutput.__v;
//     excludeKeys.forEach((el) => delete apiOutput[el]);
//
//     // Convert API return into array
//     let experiment = convertObjToArray(apiOutput);
//
//     // Convert objIds into strings
//     model = convertModelToArray(model);
//     model.forEach((el, idx, arr) => {
//         let key = Object.keys(el)[0];
//         if(objIdKeys.includes(key)) el[key] = el[key].toString();
//     });
//
//     // Check all members for equality
//     expect(experiment).to.deep.include.members(model);
// };
// let convertObjToArray = (obj) => {
//     return Object.keys(obj).map(key => {return {[key]: obj[key]}});
// };
// let convertModelToArray = (model) => {
//     return Object.keys(model.schema.obj).map(key => {return {[key]: model[key]}});
// };