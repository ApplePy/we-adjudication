/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var logicalExpressionSchema = mongoose.Schema(
    {
        booleanExp: String,
        logicalLink: String,
        assessmentCode: {type: mongoose.Schema.ObjectId, ref: 'AssessmentCodes'},
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: "LogicalExpressions"}]
    }
);

var LogicalExpressions = mongoose.model('logicalExpression', logicalExpressionSchema);

module.exports = LogicalExpressions;
