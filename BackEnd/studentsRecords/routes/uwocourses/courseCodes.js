/**
 * Created by darryl on 2017-02-13.
 */

var CourseCodes = require('../../models/schemas/uwocourses/courseCodeSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        CourseCodes,
        'course-code',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
