/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let assessmentCodeSchema = mongoose.Schema(
    {
        code: {type: String, unique: true},
        name: {type: String, required: true},
        faculty: {type: mongoose.Schema.ObjectId, ref: 'Faculties'},
        adjudications: [{type: mongoose.Schema.ObjectId, ref: "Adjudications"}],
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: "LogicalExpressions"}]
    }
);

let AssessmentCodes = mongoose.model('assessmentCode', assessmentCodeSchema);

module.exports = AssessmentCodes;
