/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var gradeSchema = mongoose.Schema(
    {
        mark: {type: String, required: true},
        note: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: 'CourseCodes'}]
    }
);
gradeSchema.plugin(mongoosePaginate);

var Grades = mongoose.model('grade', gradeSchema);

module.exports = Grades;
