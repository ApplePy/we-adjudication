/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: Number,
        load: Number,
        status: String, // TODO: is this an enumeration?
        termCode: {type: mongoose.Schema.ObjectId, ref: 'TermCodes'},
        grades: [{type: mongoose.Schema.ObjectId, ref: 'Grades'}],
        courseCodes: {type: mongoose.Schema.ObjectId, ref: 'CourseCodes'},
        planCodes: [{type: mongoose.Schema.ObjectId, ref: 'PlanCodes'}]
    }
);

var ProgramRecords = mongoose.model('programRecord', programRecordSchema);

module.exports = ProgramRecords;
