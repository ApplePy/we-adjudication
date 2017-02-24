/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var studentsSchema = mongoose.Schema(
    {
        number: {type: Number, index: {unique: true}},
        firstName: String,
        lastName: String,
        DOB: Date,
        photo: String,
        registrationComments: String,
        basisOfAdmission: String,
        admissionAverage: String,
        admissionComments: String,
        hsGrades: [{type: mongoose.Schema.ObjectId, ref: 'HSGrades'}],
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residencies'},
        genderInfo: {type: mongoose.Schema.ObjectId, ref: 'Genders'},
        terms: [{type: mongoose.Schema.ObjectId, ref: 'TermCodes'}],
        awards: [{type: mongoose.Schema.ObjectId, ref: 'Awards'}],
        advancedStandings: [{type: mongoose.Schema.ObjectId, ref: 'AdvancedStandings'}]
    }
);
studentsSchema.plugin(mongoosePaginate);

var Students = mongoose.model('student', studentsSchema);

module.exports = Students;