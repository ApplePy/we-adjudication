/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let secondarySchoolSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        courses: [{type: mongoose.Schema.ObjectId, ref: 'HSCourses'}]
    }
);
secondarySchoolSchema.plugin(mongoosePaginate);

let SecondarySchools = mongoose.model('secondarySchool', secondarySchoolSchema);

module.exports = SecondarySchools;
