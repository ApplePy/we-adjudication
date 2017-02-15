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
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}]
    }
);

var CourseCodes = mongoose.model('courseCode', courseCodeSchema);

module.exports = CourseCodes;
