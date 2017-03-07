/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var termCodeSchema = mongoose.Schema(
    {
        name: {type: String, unique: true},
        terms: [{type: mongoose.Schema.ObjectId, ref: 'Terms'}]
    }
);

var TermCodes = mongoose.model('termCode', termCodeSchema);

module.exports = TermCodes;
