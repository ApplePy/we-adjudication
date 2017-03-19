/**
 * Created by darryl on 2017-02-13.
 */

let ProgramStatuses = require('../../models/schemas/uwocourses/programStatusSchema');
let ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        ProgramStatuses,
        'programStatus',
        false,
        new PropertyValidator("status"),
        undefined,
        undefined,
        undefined,
        new MapToNull(ProgramRecords, "status"),
        undefined
    );
