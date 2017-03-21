/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let hsSubjectSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        courses: [{type: mongoose.Schema.ObjectId, ref: 'HSCourses'}]
    }
);
hsSubjectSchema.index({name: 1, description: 1}, {unique: true});   // TODO: Test this

let HSSubjects = mongoose.model('hsSubject', hsSubjectSchema);

module.exports = HSSubjects;
