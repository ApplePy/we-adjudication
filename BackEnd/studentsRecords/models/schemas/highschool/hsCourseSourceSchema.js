/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var hscourseSourceSchema = mongoose.Schema(
    {
        code: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: 'HSCourses'}]
    }
);

var HSCourseSources = mongoose.model('hsCourseSource', hscourseSourceSchema);

module.exports = HSCourseSources;
