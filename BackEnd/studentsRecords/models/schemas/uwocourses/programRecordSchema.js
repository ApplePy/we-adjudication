/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: Number,  // Student year
        load: {type: mongoose.Schema.ObjectId, ref: 'CourseLoads'},             // Fulltime/parttime enumeration
        status: {type: mongoose.Schema.ObjectId, ref: 'ProgramStatuses'},       // Active, completed, discontinued, etc.
        semester: {type: mongoose.Schema.ObjectId, ref: 'TermCodes'},
        grades: [{type: mongoose.Schema.ObjectId, ref: 'Grades'}],
        courseInfo: {type: mongoose.Schema.ObjectId, ref: 'CourseCodes'},
        plan: [{type: mongoose.Schema.ObjectId, ref: 'PlanCodes'}]              // NOTE: In a many-to-many relationship, this WILL store data.
    }
);

var ProgramRecords = mongoose.model('programRecord', programRecordSchema);

module.exports = ProgramRecords;
