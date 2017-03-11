/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let termCodeSchema = mongoose.Schema(
    {
        name: {type: String, unique: true},
        terms: [{type: mongoose.Schema.ObjectId, ref: 'Terms'}]
    }
);

let TermCodes = mongoose.model('termCode', termCodeSchema);

module.exports = TermCodes;
