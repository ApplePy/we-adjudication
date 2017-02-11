/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var hscourseSchema = mongoose.Schema(
    {
        level: String,
        unit: Number,
        source: {type: mongoose.Schema.ObjectId, ref: 'HSCourseSources'},
        school: {type: mongoose.Schema.ObjectId, ref: 'SecondarySchools'},
        subject: {type: mongoose.Schema.ObjectId, ref: 'HSSubjects'},
        grades: [{type: mongoose.Schema.ObjectId, ref: 'HSGrades'}]
    }
);

var HSCourses = mongoose.model('hsCourse', hscourseSchema);

module.exports = HSCourses;
