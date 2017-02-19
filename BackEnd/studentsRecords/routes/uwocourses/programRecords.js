/**
 * Created by darryl on 2017-02-13.
 */

var ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        ProgramRecords,
        'programRecord',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
