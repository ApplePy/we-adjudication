var Awards = require('../models/schemas/studentinfo/awardSchema');
var Setup = require('./genericRouting');


module.exports =
    Setup(
        Awards,
        'award',
        false,
        (req, res, mod) => {
            if (!mod.recipient)
                return ["Recipient must be specified"];
            else
                return 0
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
