/**
 * Created by darryl on 2017-02-09.
 */
var mongoose = require('./../../studentsRecordsDB').mongoose;

var departmentSchema = mongoose.Schema(
    {
        name: String,
        faculty: {type: mongoose.Schema.ObjectId, ref: "Faculties"},
        administrators: [{type: mongoose.Schema.ObjectId, ref: 'ProgramAdministrations'}]
    }
);

var Departments = mongoose.model('department', departmentSchema);

module.exports = Departments;
