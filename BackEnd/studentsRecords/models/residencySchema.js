/**
 * Created by darryl on 2017-02-09.
 */
var MongooseVariables = require('mongoose');
var mongoose = require('./studentsRecordsDB').mongoose;

var residencySchema = MongooseVariables.Schema(
    {
        name: {type: String, index: {unique: true}},
        students: [{type: MongooseVariables.Schema.ObjectId, ref: ('Students')}]
    }
);

var Residencies = mongoose.model('residency', residencySchema);

module.exports = Residencies;
