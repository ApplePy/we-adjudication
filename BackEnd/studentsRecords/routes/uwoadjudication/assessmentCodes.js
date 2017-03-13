let AssessmentCodes = require('../../models/schemas/uwoadjudication/assessmentCodeSchema');
let Adjudications = require('../../models/schemas/uwoadjudication/adjudicationSchema');
let LogicalExpressions = require('../../models/schemas/uwoadjudication/logicalExpressionSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        AssessmentCodes,
        'assessmentCode',
        false,
        new PropertyValidator("name", "code"),
        undefined,
        undefined,
        undefined,
        [new MapToNull(Adjudications, "assessmentCode"), new MapToNull(LogicalExpressions, "assessmentCode")],  // TODO: Should these be deleted instead?
        undefined
    );
