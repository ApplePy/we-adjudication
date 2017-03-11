/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let facultySchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        assessmentCodes: [{type: mongoose.Schema.ObjectId, ref: "AssessmentCodes"}],
        departments: [{type: mongoose.Schema.ObjectId, ref: 'Departments'}]
    }
);

let Faculties = mongoose.model('faculty', facultySchema);

module.exports = Faculties;
