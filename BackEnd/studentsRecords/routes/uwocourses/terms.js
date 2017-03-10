/**
 * Created by darryl on 2017-02-13.
 */

var Terms = require('../../models/schemas/uwocourses/termSchema');
var Setup = require('../genericRouting');


module.exports =
    Setup(
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
