/**
 * Created by darryl on 2017-02-13.
 */

let PlanCodes = require('../../models/schemas/uwocourses/planCodeSchema');
let ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        PlanCodes,
        'planCode',
        false,
        new PropertyValidator("name"),
        undefined,
        undefined,
        undefined,
        new MapToNull(ProgramRecords, "plan"),
        undefined
    );
