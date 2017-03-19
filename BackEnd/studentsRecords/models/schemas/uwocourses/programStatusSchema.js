/**
 * Created by darryl on 2017-02-15.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let programStatusSchema = mongoose.Schema(
    {
        status: {type: String, unique: true}, // Active, completed, discontinued, active with conditions, etc.
        levels: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}]
    }
);

let ProgramStatuses = mongoose.model('programStatus', programStatusSchema);

module.exports = ProgramStatuses;       // TODO: I have no idea how the ember inflector will handle the plural of status
