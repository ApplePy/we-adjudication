/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var departmentSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        faculty: {type: mongoose.Schema.ObjectId, ref: "Faculties"},
        administrators: [{type: mongoose.Schema.ObjectId, ref: 'ProgramAdministrations'}]
    }
);

var Departments = mongoose.model('department', departmentSchema);

module.exports = Departments;
