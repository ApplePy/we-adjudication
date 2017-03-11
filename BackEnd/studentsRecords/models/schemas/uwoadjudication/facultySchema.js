/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var facultySchema = mongoose.Schema(
    {
        name: String,
        assessmentCodes: [{type: mongoose.Schema.ObjectId, ref: "AssessmentCodes"}],
        departments: [{type: mongoose.Schema.ObjectId, ref: 'Departments'}]
    }
);

var Faculties = mongoose.model('faculty', facultySchema);

module.exports = Faculties;
