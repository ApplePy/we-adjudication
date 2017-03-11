/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var programAdministrationSchema = mongoose.Schema(
    {
        name: String,
        position: String,
        department: {type: mongoose.Schema.ObjectId, ref: 'Departments'}
    }
);

var ProgramAdministrations = mongoose.model('programAdministration', programAdministrationSchema);

module.exports = ProgramAdministrations;
