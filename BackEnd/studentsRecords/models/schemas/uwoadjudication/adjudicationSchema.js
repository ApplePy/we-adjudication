/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let adjudicationSchema = mongoose.Schema(
    {
        date: Date,
        termAVG: Number,
        termUnitsPassed: Number,
        termUnitsTotal: Number,
        term: {type: mongoose.Schema.ObjectId, ref: 'Terms'},
        assessmentCode: {type: mongoose.Schema.ObjectId, ref: "AssessmentCodes"}
    }
);
adjudicationSchema.plugin(mongoosePaginate);

let Adjudications = mongoose.model('adjudication', adjudicationSchema);

module.exports = Adjudications;
