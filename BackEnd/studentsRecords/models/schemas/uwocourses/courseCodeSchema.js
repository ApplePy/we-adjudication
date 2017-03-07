/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var courseCodeSchema = mongoose.Schema(
    {
        courseLetter: {type: String, required: true},
        courseNumber: {type: String, required: true},
        name: String,
        unit: Number,
        termInfo: {type: mongoose.Schema.ObjectId, ref: 'Terms'},
        gradeInfo: {type: mongoose.Schema.ObjectId, ref: 'Grades'}
    }
);
courseCodeSchema.plugin(mongoosePaginate);

var CourseCodes = mongoose.model('courseCode', courseCodeSchema);

module.exports = CourseCodes;
