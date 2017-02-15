var AdvancedStandings = require('../models/schemas/studentinfo/advancedStandingSchema');
var Setup = require('./genericRouting');


module.exports =
    Setup(
        AdvancedStandings,
        'advancedStanding',
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
