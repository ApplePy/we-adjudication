/**
 * Created by darryl on 2017-02-13.
 */

let TermCodes = require('../../models/schemas/uwocourses/termCodeSchema');
let Terms = require('../../models/schemas/uwocourses/termSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;
let MapToNull = require('../genericRouting').MapToNull;


module.exports =
    new Route(
        TermCodes,
        'termCode',
        false,
        new PropertyValidator("name"),
        undefined,
        undefined,
        undefined,
        new MapToNull(Terms, "termCode"),
        undefined
    );
