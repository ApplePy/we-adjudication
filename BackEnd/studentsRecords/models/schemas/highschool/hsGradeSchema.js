/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var hsgradeSchema = mongoose.Schema(
    {
        mark: Number,
        course: {type: mongoose.Schema.ObjectId, ref: 'HSCourses'},
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);

var HSGrades = mongoose.model('hsGrade', hsgradeSchema);

module.exports = HSGrades;
