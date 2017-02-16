var Students = require('../../models/schemas/studentinfo/studentSchema');
var Awards = require('../../models/schemas/studentinfo/awardSchema');
var AdvancedStandings = require('../../models/schemas/studentinfo/advancedStandingSchema');
var Grades = require('../../models/schemas/uwocourses/gradeSchema');
var ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
var HSGrades = require('../../models/schemas/highschool/hsGradeSchema');
var Setup = require('../genericRouting');

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
                    // Remove high school grades
                    HSGrades.remove({recipient: deleted._id}, (err3, removed3) => {
                        // Find university grades and their records to delete
                        Grades.find({student: deleted._id}, (err4, grades) => {
                            if (err) return;    // Just silently fail

                            // Get program records
                            let programIds = grades.map((el, idx, arr) => el.level);

                            // Delete program records and grades
                            ProgramRecords.remove({_id: {$in: programIds}});
                            Grades.remove({student: deleted._id});
                        });
                    });
                });
            });
        }
    );
