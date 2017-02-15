/**
 * Created by darryl on 2017-02-15.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var programStatusSchema = mongoose.Schema(
    {
        status: String, // Active, completed, discontinued, active with conditions, etc.
        levels: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}]
    }
);

var ProgramStatuses = mongoose.model('programStatus', programStatusSchema);

module.exports = ProgramStatuses;       // TODO: I have no idea how the ember inflector will handle the plural of status
