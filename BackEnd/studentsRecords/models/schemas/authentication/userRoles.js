/**
 * Created by Abdelkader on 2017-02-23.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
var userRoleSchema = mongoose.Schema(
    {
        dateAssigned: Date,
        user: {type: mongoose.Schema.ObjectId, ref: ('Users')},
        role: {type: mongoose.Schema.ObjectId, ref: ('RoleCode')}
    }
);

var UserRoles = mongoose.model('userRole', userRoleSchema);
exports.Model = UserRoles;