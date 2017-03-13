let Adjudications = require('../../models/schemas/uwoadjudication/adjudicationSchema');
let Route = require('../genericRouting').Route;


module.exports =
    new Route(
        Adjudications,
        'adjudication',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
