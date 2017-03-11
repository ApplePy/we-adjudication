/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let logicalExpressionSchema = mongoose.Schema(
    {
        booleanExp: String,
        logicalLink: String,
        assessmentCode: {type: mongoose.Schema.ObjectId, ref: 'AssessmentCodes'},
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: "LogicalExpressions"}]
    }
);

let LogicalExpressions = mongoose.model('logicalExpression', logicalExpressionSchema);

module.exports = LogicalExpressions;
