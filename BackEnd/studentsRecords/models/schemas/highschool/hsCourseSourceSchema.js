/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let hscourseSourceSchema = mongoose.Schema(
    {
        code: {type: String, unique: true},
        courses: [{type: mongoose.Schema.ObjectId, ref: 'HSCourses'}]
    }
);

let HSCourseSources = mongoose.model('hsCourseSource', hscourseSourceSchema);

module.exports = HSCourseSources;
