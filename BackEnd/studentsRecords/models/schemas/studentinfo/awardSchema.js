/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
let mongoosePaginate = require('mongoose-paginate');

let awardsSchema = mongoose.Schema(
    {
        note: {type: String, required: true},
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);
awardsSchema.plugin(mongoosePaginate);

let Awards = mongoose.model('awards', awardsSchema);

module.exports = Awards;
