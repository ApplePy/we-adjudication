/**
 * Created by Abdelkader on 2017-02-23.
 */
let mongoose = require('./../../studentsRecordsDB').mongoose;
var rolePermissionSchema = mongoose.Schema(
    {
        code: String,
        sysFeature: String,
        roleCodes: [{type: mongoose.Schema.ObjectId, ref: ('RoleCode')}]
    }
);

var RolePermissions = mongoose.model('rolePermission', rolePermissionSchema);
exports.Model = RolePermissions;