/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: Number,  // Student year
        load: {type: mongoose.Schema.ObjectId, ref: 'CourseLoads'},             // Fulltime/parttime enumeration
        status: {type: mongoose.Schema.ObjectId, ref: 'ProgramStatuses'},       // Active, completed, discontinued, etc.
        semesters: [{type: mongoose.Schema.ObjectId, ref: 'TermCodes'}],
        plan: [{type: mongoose.Schema.ObjectId, ref: 'PlanCodes'}]              // NOTE: In a many-to-many relationship, this WILL store data.
    }
);
programRecordSchema.plugin(mongoosePaginate);

var ProgramRecords = mongoose.model('programRecord', programRecordSchema);

module.exports = ProgramRecords;
