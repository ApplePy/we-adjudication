/**
 * Created by darryl on 2017-02-13.
 */

var HSGrades = require('../../models/schemas/highschool/hsGradeSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        HSGrades,
        'hsGrade',
        true,
        (req, res, mod) => {
            if (!mod.mark || !mod.recipient)
                return ["Mark and recipient must be specified"];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
