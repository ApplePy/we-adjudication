/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let termSchema = mongoose.Schema(
    {
        termCode: {type: mongoose.Schema.ObjectId, ref: 'TermCodes'},
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'},
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}],  // NOTE: In a many-to-many relationship, this WILL store data.
        courses: [{type: mongoose.Schema.ObjectId, ref: 'CourseCodes'}],
        adjudications: [{type: mongoose.Schema.ObjectId, ref: 'Adjudications'}]
    }
);
termSchema.plugin(mongoosePaginate);

let Terms = mongoose.model('term', termSchema);

module.exports = Terms;
