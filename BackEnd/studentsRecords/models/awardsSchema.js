/**
 * Created by darryl on 2017-02-09.
 */
var MongooseVariables = require('mongoose');
var mongoose = require('./studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var awardsSchema = MongooseVariables.Schema(
    {
        note: String,
        recipient: {type: MongooseVariables.Schema.ObjectId, ref: 'Students'}
    }
);

var Awards = mongoose.model('awards', awardsSchema);

module.exports = Awards;
