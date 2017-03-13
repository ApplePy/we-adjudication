/**
 * Created by darryl on 2017-02-13.
 */

let ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
let Terms = require('../../models/schemas/uwocourses/termSchema');
let Route = require('../genericRouting').Route;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        ProgramRecords,
        'programRecord',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        new MapToNull(Terms, "programRecords"),
        undefined
    );
