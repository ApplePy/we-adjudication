/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;


let genderSchema = mongoose.Schema(
    {
        name: {type: String, index: {unique: true}},
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    }
);

let Genders = mongoose.model('gender', genderSchema);

module.exports = Genders;
