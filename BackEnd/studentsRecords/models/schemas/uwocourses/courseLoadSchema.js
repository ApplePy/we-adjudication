/**
 * Created by darryl on 2017-02-15.
 */

let mongoose = require('./../../studentsRecordsDB').mongoose;

let courseLoadSchema = mongoose.Schema(
    {
        load: {type: String, unique: true},   // Fulltime/parttime enumeration
        levels: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}]   // In a many-to-many relation; ProgramRecords stores connections
    }
);

let CourseLoads = mongoose.model('courseLoad', courseLoadSchema);

module.exports = CourseLoads;
