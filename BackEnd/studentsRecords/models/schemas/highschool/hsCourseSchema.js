/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let hsCourseSchema = mongoose.Schema(
    {
        level: {type: Number, required: true},
        unit: {type: Number, required: true},
        source: {type: mongoose.Schema.ObjectId, ref: 'HSCourseSources'},
        school: {type: mongoose.Schema.ObjectId, ref: 'SecondarySchools'},
        subject: {type: mongoose.Schema.ObjectId, ref: 'HSSubjects'},
        hsGrades: [{type: mongoose.Schema.ObjectId, ref: 'HSGrades'}]
    }
);
hsCourseSchema.plugin(mongoosePaginate);

let HSCourses = mongoose.model('hsCourse', hsCourseSchema);

module.exports = HSCourses;
