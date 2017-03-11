/**
 * Created by darryl on 2017-02-13.
 */

let HSGrades = require('../../models/schemas/highschool/hsGradeSchema');
let Route = require('../genericRouting').Route;
let PropertyValidator = require('../genericRouting').PropertyValidator;


module.exports =
    new Route(
        HSGrades,
        'hsGrade',
        true,
        new PropertyValidator("mark", "recipient"),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
    );
