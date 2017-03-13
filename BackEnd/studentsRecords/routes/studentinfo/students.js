let Students = require('../../models/schemas/studentinfo/studentSchema');
let Awards = require('../../models/schemas/studentinfo/awardSchema');
let AdvancedStandings = require('../../models/schemas/studentinfo/advancedStandingSchema');
let Terms = require('../../models/schemas/uwocourses/termSchema');
let CourseCodes = require('../../models/schemas/uwocourses/courseCodeSchema');
let HSGrades = require('../../models/schemas/highschool/hsGradeSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;

module.exports =
    new Route(
        Students,
        'student',
        true,
        new PropertyValidator("number", "resInfo", "genderInfo"),
        undefined,
        undefined,
        undefined,
        undefined,
        (req, res, deleted) => {
            // Delete all awards associated with student
            Awards.remove({recipient: deleted._id}, (err) => {
                // Delete all advanced standings associated with student
                AdvancedStandings.remove({recipient: deleted._id}, () => {
                    // Remove high school grades
                    HSGrades.remove({recipient: deleted._id}, () => {
                        // Find attached terms
                        Terms.find({student: deleted._id}, (err4, termsRes) => {
                            if (err) console.error(err);    // Just silently fail

                            let terms = termsRes.map(el => el._id);

                            // Remove attached courses and terms
                            CourseCodes.remove({termInfo: {$in: terms}}, () => {});
                            Terms.remove({student: deleted._id}, () => {});
                        });
                    });
                });
            });
        }
    );
