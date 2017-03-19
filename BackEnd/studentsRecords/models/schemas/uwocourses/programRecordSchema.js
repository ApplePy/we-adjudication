/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: Number,  // Student year
        load: {type: mongoose.Schema.ObjectId, ref: 'CourseLoads'},             // Fulltime/parttime enumeration
        status: {type: mongoose.Schema.ObjectId, ref: 'ProgramStatuses'},       // Active, completed, discontinued, etc.
        semesters: [{type: mongoose.Schema.ObjectId, ref: 'Terms'}],
        plan: [{type: mongoose.Schema.ObjectId, ref: 'PlanCodes'}]              // NOTE: In a many-to-many relationship, this WILL store data.
    }
);
programRecordSchema.plugin(mongoosePaginate);

let ProgramRecords = mongoose.model('programRecord', programRecordSchema);

module.exports = ProgramRecords;
