/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var hsSubjectSchema = mongoose.Schema(
    {
        name: String,
        description: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: 'HSCourses'}]
    }
);

var HSSubjects = mongoose.model('hsSubject', hsSubjectSchema);

module.exports = HSSubjects;
