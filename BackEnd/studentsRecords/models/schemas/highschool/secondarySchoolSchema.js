/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var secondarySchoolSchema = mongoose.Schema(
    {
        name: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: 'HSCourses'}]
    }
);

var SecondarySchools = mongoose.model('secondarySchool', secondarySchoolSchema);

module.exports = SecondarySchools;
