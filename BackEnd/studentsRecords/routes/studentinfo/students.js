var Students = require('../../models/schemas/studentinfo/studentSchema');
var Awards = require('../../models/schemas/studentinfo/awardSchema');
var AdvancedStandings = require('../../models/schemas/studentinfo/advancedStandingSchema');
var Terms = require('../../models/schemas/uwocourses/termSchema');
var CourseCodes = require('../../models/schemas/uwocourses/courseCodeSchema');
var HSGrades = require('../../models/schemas/highschool/hsGradeSchema');
var Setup = require('../genericRouting');

module.exports =
    Setup(
        Students,
        'student',
        true,
        (req, res, model) => {
            let errors = [];
            if (!model.number)
                errors.push("A number must be specified");
            if (!model.resInfo)
                errors.push("A residency must be specified");
            if (!model.genderInfo)
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
                    // Remove high school grades
                    HSGrades.remove({recipient: deleted._id}, (err3, removed3) => {
                        // Find attached terms
                        Terms.find({student: deleted._id}, (err4, termsRes) => {
                            if (err) return;    // Just silently fail

                            let terms = termsRes.map(el => el._id);

                            // Remove attached courses and terms
                            CourseCodes.remove({termInfo: {$in: terms}}, err5 => {});
                            Terms.remove({student: deleted._id}, err6 => {});
                        });
                    });
                });
            });
        }
    );
