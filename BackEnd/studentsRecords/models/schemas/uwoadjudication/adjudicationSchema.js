/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var adjudicationSchema = mongoose.Schema(
    {
        date: Date,
        termAVG: Number,
        termUnitsPassed: Number,
        termUnitsTotal: Number,
        term: {type: mongoose.Schema.ObjectId, ref: 'Terms'},
        assessmentCode: {type: mongoose.Schema.ObjectId, ref: "AssessmentCodes"}
    }
);

var Adjudications = mongoose.model('adjudication', adjudicationSchema);

module.exports = Adjudications;
