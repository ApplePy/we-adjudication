/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let logicalExpressionSchema = mongoose.Schema(
    {
        booleanExp: {type: String, required: true},
        logicalLink: {type: String, required: true},
        assessmentCode: {type: mongoose.Schema.ObjectId, ref: 'AssessmentCodes'},
        parentExpression: {type: mongoose.Schema.ObjectId, ref: "LogicalExpressions"},
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: "LogicalExpressions"}]
    }
);
logicalExpressionSchema.plugin(mongoosePaginate);

let LogicalExpressions = mongoose.model('logicalExpression', logicalExpressionSchema);

module.exports = LogicalExpressions;
