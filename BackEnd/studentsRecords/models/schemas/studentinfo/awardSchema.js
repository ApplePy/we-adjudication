/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var awardsSchema = mongoose.Schema(
    {
        note: String,
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);

var Awards = mongoose.model('awards', awardsSchema);

module.exports = Awards;
