/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let courseCodeSchema = mongoose.Schema(
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

let CourseCodes = mongoose.model('courseCode', courseCodeSchema);

module.exports = CourseCodes;
