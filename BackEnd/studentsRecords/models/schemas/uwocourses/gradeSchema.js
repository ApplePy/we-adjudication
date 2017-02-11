/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var gradeSchema = mongoose.Schema(
    {
        mark: Number,
        note: String,
        programRecord: {type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'},
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);

var Grades = mongoose.model('grade', gradeSchema);

module.exports = Grades;
