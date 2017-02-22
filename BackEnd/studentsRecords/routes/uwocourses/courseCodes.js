/**
 * Created by darryl on 2017-02-13.
 */

var CourseCodes = require('../../models/schemas/uwocourses/courseCodeSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        CourseCodes,
        'courseCode',
        true,
        (req, res, model) => {
            let list = [];
            if (!model.courseNumber)
                list.push("The course number must be specified.");
            if (!model.courseLetter)
                list.push("The course letter must be specified.");
            if (list.length)
                return list;
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
