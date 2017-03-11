/**
 * Created by darryl on 2017-02-13.
 */

let Terms = require('../../models/schemas/uwocourses/termSchema');
let Route = require('../genericRouting').Route;


module.exports =
    new Route(
        Terms,
        'term',
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
