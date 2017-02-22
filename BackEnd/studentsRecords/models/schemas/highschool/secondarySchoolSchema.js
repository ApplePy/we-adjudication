/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var secondarySchoolSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        courses: [{type: mongoose.Schema.ObjectId, ref: 'HSCourses'}]
    }
);
secondarySchoolSchema.plugin(mongoosePaginate);

var SecondarySchools = mongoose.model('secondarySchool', secondarySchoolSchema);

module.exports = SecondarySchools;
