/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let advancedStandingSchema = mongoose.Schema(
    {
        course: String,
        description: String,
        units: Number,
        grade: String,
        from: String,
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);
advancedStandingSchema.plugin(mongoosePaginate);

let AdvancedStandings = mongoose.model('advancedStanding', advancedStandingSchema);

module.exports = AdvancedStandings;
