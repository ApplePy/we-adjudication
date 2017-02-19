/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var termCodeSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'},
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}],  // NOTE: In a many-to-many relationship, this WILL store data.
        courses: [{type: mongoose.Schema.ObjectId, ref: 'CourseCodes'}]
    }
);
termCodeSchema.plugin(mongoosePaginate);

var TermCodes = mongoose.model('termCode', termCodeSchema);

module.exports = TermCodes;
