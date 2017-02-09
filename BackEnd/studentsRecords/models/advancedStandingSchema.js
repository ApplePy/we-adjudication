/**
 * Created by darryl on 2017-02-09.
 */
var MongooseVariables = require('mongoose');
var mongoose = require('./studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var advancedStandingSchema = MongooseVariables.Schema(
    {
        course: String,
        description: String,
        units: Number,
        grade: Number,
        from: String,
        recipient: {type: MongooseVariables.Schema.ObjectId, ref: 'Students'}
    }
);

var AdvancedStandings = mongoose.model('advancedStanding', advancedStandingSchema);

module.exports = AdvancedStandings;
