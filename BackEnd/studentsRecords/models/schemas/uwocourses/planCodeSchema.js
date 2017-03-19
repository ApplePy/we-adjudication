/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let planCodeSchema = mongoose.Schema(
    {
        name: {type: String, unique: true},
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecords'}]
    }
);

let PlanCodes = mongoose.model('planCode', planCodeSchema);

module.exports = PlanCodes;
