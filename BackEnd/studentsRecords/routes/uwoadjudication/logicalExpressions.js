let LogicalExpressions = require('../../models/schemas/uwoadjudication/logicalExpressionSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        LogicalExpressions,
        'logicalExpression',
        true,
        new PropertyValidator("booleanExp"),
        undefined,
        undefined,
        undefined,
        new MapToNull(LogicalExpressions, "parentExpression"),  // TODO: Should these be deleted instead?
        undefined
    );
