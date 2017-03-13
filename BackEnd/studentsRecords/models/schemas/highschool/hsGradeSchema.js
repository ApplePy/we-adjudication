/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let hsGradeSchema = mongoose.Schema(
    {
        mark: {type: String, required: true},
        course: {type: mongoose.Schema.ObjectId, ref: 'HSCourses'},
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);
hsGradeSchema.plugin(mongoosePaginate);

let HSGrades = mongoose.model('hsGrade', hsGradeSchema);

module.exports = HSGrades;
