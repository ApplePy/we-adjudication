/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./studentsRecordsDB').mongoose;

var advancedStandingSchema = mongoose.Schema(
    {
        course: String,
        description: String,
        units: Number,
        grade: Number,
        from: String,
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);

var AdvancedStandings = mongoose.model('advancedStanding', advancedStandingSchema);

module.exports = AdvancedStandings;
