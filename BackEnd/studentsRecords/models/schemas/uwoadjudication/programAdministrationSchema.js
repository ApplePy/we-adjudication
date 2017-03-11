/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let programAdministrationSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        position: {type: String, required: true},
        department: {type: mongoose.Schema.ObjectId, ref: 'Departments'}
    }
);

let ProgramAdministrations = mongoose.model('programAdministration', programAdministrationSchema);

module.exports = ProgramAdministrations;
