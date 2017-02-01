var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var advancedStandingSchema = mongoose.Schema(
    {

        course: String,
        description: String,
        units: Number,
        grade: Number,
        from: String,
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);

var awardsSchema = mongoose.Schema(
    {
        note: String,
        recipient: {type: mongoose.Schema.ObjectId, ref: 'Students'}
    }
);

var studentsSchema = mongoose.Schema(
    {
        number: String,
        firstName: String,
        lastName: String,
        gender: Number,
        DOB: Date,
        photo: String,
        registrationComments: String,
        basisOfAdmission: String,
        admissionAverage: Number,
        admissionComments: String,
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residencies'},
        awards: [{type: mongoose.Schema.ObjectId, ref: 'Awards'}],
        advancedStandings: [{type: mongoose.Schema.ObjectId, ref: 'AdvancedStandings'}]
    }
);
studentsSchema.plugin(mongoosePaginate);

var residencySchema = mongoose.Schema(
    {
        name: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    }
);

var Students = mongoose.model('student', studentsSchema);
var Residencies = mongoose.model('residency', residencySchema);
var AdvancedStandings = mongoose.model('advancedStanding', advancedStandingSchema);
var Awards = mongoose.model('awards', awardsSchema);


mongoose.connect('mongodb://localhost/studentsRecords');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    exports.Students = Students;
    exports.Residencies = Residencies;
    exports.AdvancedStandings = AdvancedStandings;
    exports.Awards = Awards;

});



