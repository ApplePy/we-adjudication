/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var gradeSchema = mongoose.Schema(
    {
        mark: {type: Number, required: true},
        note: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: 'CourseCodes'}]
    }
);

var Grades = mongoose.model('grade', gradeSchema);

module.exports = Grades;
