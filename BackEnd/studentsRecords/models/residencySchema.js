/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./studentsRecordsDB').mongoose;

var residencySchema = mongoose.Schema(
    {
        name: {type: String, index: {unique: true}},
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    }
);

var Residencies = mongoose.model('residency', residencySchema);

module.exports = Residencies;
