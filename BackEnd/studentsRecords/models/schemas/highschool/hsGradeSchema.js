/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var hsGradeSchema = mongoose.Schema(
    {
        mark: {type: String, required: true},
        course: {type: mongoose.Schema.ObjectId, ref: 'HSCourses'},
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);
hsGradeSchema.plugin(mongoosePaginate);

var HSGrades = mongoose.model('hsGrade', hsGradeSchema);

module.exports = HSGrades;
