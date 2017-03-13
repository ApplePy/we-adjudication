/**
 * Created by darryl on 2017-02-13.
 */

let CourseLoads = require('../../models/schemas/uwocourses/courseLoadSchema');
let ProgramRecords = require('../../models/schemas/uwocourses/programRecordSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        CourseLoads,
        'courseLoad',
        false,
        new PropertyValidator("load"),
        undefined,
        undefined,
        undefined,
        new MapToNull(ProgramRecords, "load"),
        undefined
    );
