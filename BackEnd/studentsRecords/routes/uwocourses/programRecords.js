/**
 * Created by darryl on 2017-02-13.
 */

var ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
var Grades = require('../../models/schemas/uwocourses/gradeSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        ProgramRecords,
        'programRecord',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        (req, res, deleted) => {
            // Clear out related grades
            Grades.remove({level: deleted._id}, (err) => {});
        }
    );
