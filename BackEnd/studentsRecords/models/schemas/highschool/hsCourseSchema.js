/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var hsCourseSchema = mongoose.Schema(
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

var HSCourses = mongoose.model('hsCourse', hsCourseSchema);

module.exports = HSCourses;
