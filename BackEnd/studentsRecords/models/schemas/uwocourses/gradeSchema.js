/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var gradeSchema = mongoose.Schema(
    {
        mark: {type: Number, required: true},
        note: String,
        level: {type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'},
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);

var Grades = mongoose.model('grade', gradeSchema);

module.exports = Grades;
