/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var planCodeSchema = mongoose.Schema(
    {
        name: String,
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}]
    }
);

var PlanCodes = mongoose.model('planCode', planCodeSchema);

module.exports = PlanCodes;
