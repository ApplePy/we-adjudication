/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var courseCodeSchema = mongoose.Schema(
    {
        courseLetter: String,
        courseNumber: Number,
        name: String,
        unit: Number,
        termInfo: {type: mongoose.Schema.ObjectId, ref: 'TermCodes'},
        gradeInfo: {type: mongoose.Schema.ObjectId, ref: 'Grades'}
    }
);

var CourseCodes = mongoose.model('courseCode', courseCodeSchema);

module.exports = CourseCodes;
