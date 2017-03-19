let AdvancedStandings = require('../../models/schemas/studentinfo/advancedStandingSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;


module.exports =
    new Route(
        AdvancedStandings,
        'advancedStanding',
        true,
        new PropertyValidator("recipient"),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
