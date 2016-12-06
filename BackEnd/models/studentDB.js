var mongoose = require('mongoose');
var studentSchema = mongoose.Schema(
    {
        studentNo: Number,
        firstName: String,
        lastName: String,
        dob: String,
        residency: Number,
        gender: Boolean
    }
);

var Student = mongoose.model('students', studentSchema);

mongoose.connect('mongodb://localhost/students');
mongoose.Promise = Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    exports.Student = Student;
});



