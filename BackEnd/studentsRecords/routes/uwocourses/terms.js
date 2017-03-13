/**
 * Created by darryl on 2017-02-13.
 */

let Terms = require('../../models/schemas/uwocourses/termSchema');
let Adjudications = require('../../models/schemas/uwoadjudication/adjudicationSchema');
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
        (req, res, deleted) => {
            // Delete all Adjudications associated with Term
            Adjudications.remove({term: deleted._id}, (err) => {
                if (err) console.error(err);    // Just silently fail
            });
        }
    );
