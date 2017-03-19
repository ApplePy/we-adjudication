/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let hsSubjectSchema = mongoose.Schema(
    {
        name: {type: String, unique: true},
        description: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: 'HSCourses'}]
    }
);

let HSSubjects = mongoose.model('hsSubject', hsSubjectSchema);

module.exports = HSSubjects;
