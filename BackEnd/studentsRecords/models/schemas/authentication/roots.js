/**
 * Created by Abdelkader on 2017-02-23.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
var rootsSchema = mongoose.Schema(
    {
        password: String,
        nonce: String,
        response: String,
        wrongPassword: Boolean,
        sessionIsActive: Boolean
    }
);

var Roots = mongoose.model('root', rootsSchema);
exports.Model = Roots;