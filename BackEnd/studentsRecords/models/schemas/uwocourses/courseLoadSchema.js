/**
 * Created by darryl on 2017-02-15.
 */

var mongoose = require('./../../studentsRecordsDB').mongoose;

var courseLoadSchema = mongoose.Schema(
    {
        load: {type: String, required: true},   // Fulltime/parttime enumeration
        levels: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}]   // In a many-to-many relation; ProgramRecords stores connections
    }
);

var CourseLoads = mongoose.model('courseLoad', courseLoadSchema);

module.exports = CourseLoads;
