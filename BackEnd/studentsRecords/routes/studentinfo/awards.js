let Awards = require('../../models/schemas/studentinfo/awardSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;


module.exports =
    new Route(
        Awards,
        'award',
        true,
        new PropertyValidator("recipient", "note"),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
