/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var awardsSchema = mongoose.Schema(
    {
        note: {type: String, required: true},
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);
awardsSchema.plugin(mongoosePaginate);

var Awards = mongoose.model('awards', awardsSchema);

module.exports = Awards;
