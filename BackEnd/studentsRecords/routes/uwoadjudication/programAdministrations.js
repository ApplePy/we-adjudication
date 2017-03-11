var ProgramAdministrations = require('../../models/schemas/uwoadjudication/programAdministrationSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
        ProgramAdministrations,
        'programAdministration',
        false,
        (req, res, mod) => {
            let results = [];

            // Check that the needed properties exist
            if (!mod.name)
                results.push("Administrator's name must be specified.");
            if (!mod.position)
                results.push("Administrator's position must be specified.");

            if (results !== [])
                return results;
            else
                return 0;
        },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
