/**
 * Created by darryl on 2017-02-13.
 */

var Grades = require('../../models/schemas/uwocourses/gradeSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        Grades,
        'grade',
        true,
        (req, res, mod) => {
            if (!mod.mark)
                return ["Mark must be specified"];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
