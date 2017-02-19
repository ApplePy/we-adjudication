/**
 * Created by darryl on 2017-02-13.
 */

var TermCodes = require('../../models/schemas/uwocourses/termCodeSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        TermCodes,
        'termCode',
        true,
        (req, res, mod) => {
            if (!mod.name)
                return ["Term name must be specified"];
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
