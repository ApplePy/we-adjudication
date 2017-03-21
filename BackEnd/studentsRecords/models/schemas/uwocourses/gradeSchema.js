/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let gradeSchema = mongoose.Schema(
    {
        mark: String,   // Apparently blank is an acceptable grade
        note: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: 'CourseCodes'}]
    }
);
gradeSchema.plugin(mongoosePaginate);

let Grades = mongoose.model('grade', gradeSchema);

module.exports = Grades;
