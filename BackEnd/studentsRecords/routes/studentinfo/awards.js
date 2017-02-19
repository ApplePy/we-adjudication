var Awards = require('../../models/schemas/studentinfo/awardSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        Awards,
        'award',
        true,
        (req, res, mod) => {
            if (!mod.recipient || !mod.note)
                return ["Recipient and note must be specified"];
            else
                return 0
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
