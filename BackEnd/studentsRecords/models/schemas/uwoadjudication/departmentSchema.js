/**
 * Created by darryl on 2017-02-09.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;

let departmentSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        faculty: {type: mongoose.Schema.ObjectId, ref: "Faculties"},
        administrators: [{type: mongoose.Schema.ObjectId, ref: 'ProgramAdministrations'}]
    }
);

let Departments = mongoose.model('department', departmentSchema);

module.exports = Departments;
