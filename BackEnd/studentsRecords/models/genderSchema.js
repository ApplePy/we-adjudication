/**
 * Created by darryl on 2017-02-09.
 */
var MongooseVariables = require('mongoose');
var mongoose = require('./studentsRecordsDB').mongoose;


var genderSchema = mongoose.Schema(
    {
        name: {type: String, index: {unique: true}},
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    }
);

var Genders = mongoose.model('gender', genderSchema);

module.exports = Genders;
