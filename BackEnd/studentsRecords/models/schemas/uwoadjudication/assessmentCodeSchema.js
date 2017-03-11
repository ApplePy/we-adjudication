/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var assessmentCodeSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        faculty: {type: mongoose.Schema.ObjectId, ref: 'Faculties'},
        adjudications: [{type: mongoose.Schema.ObjectId, ref: "Adjudications"}],
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: "LogicalExpressions"}]
    }
);

var AssessmentCodes = mongoose.model('assessmentCode', assessmentCodeSchema);

module.exports = AssessmentCodes;
