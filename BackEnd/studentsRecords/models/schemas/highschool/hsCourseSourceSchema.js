/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var hscourseSourceSchema = mongoose.Schema(
    {
        code: {type: String, unique: true},
        courses: [{type: mongoose.Schema.ObjectId, ref: 'HSCourses'}]
    }
);

var HSCourseSources = mongoose.model('hsCourseSource', hscourseSourceSchema);

module.exports = HSCourseSources;
