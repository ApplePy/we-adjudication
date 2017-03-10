/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var termSchema = mongoose.Schema(
    {
        termCode: {type: mongoose.Schema.ObjectId, ref: 'Terms'},
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'},
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}],  // NOTE: In a many-to-many relationship, this WILL store data.
        courses: [{type: mongoose.Schema.ObjectId, ref: 'CourseCodes'}]
    }
);
termSchema.plugin(mongoosePaginate);

var Terms = mongoose.model('term', termSchema);

module.exports = Terms;
