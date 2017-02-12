var Students = require('../models/schemas/studentinfo/studentSchema');
var Awards = require('../models/schemas/studentinfo/awardSchema');
var AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');
var Setup = require('./genericRouting');

module.exports =
    Setup(
        Students,
        'student',
        true,
        (req, res, model) => {
            let errors = [];
            if (!model.resInfo && model.resInfo !== null)
                errors.push("A residency must be specified");
            if (!model.genderInfo && model.genderInfo !== null)
                errors.push("A gender must be specified");
            if (errors.length != 0)
                return errors;
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        undefined,
        (req, res, deleted) => {
            // Delete all awards associated with student
            Awards.remove({recipient: deleted._id}, (err, removed) => {
                // Delete all advanced standings associated with student
                AdvancedStandings.remove({recipient: deleted._id}, (err2, removed2) => {
                });
            });
        }
    );
