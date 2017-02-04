var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

// Use native promises
mongoose.Promise = global.Promise;


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
        number: {type: Number, index: {unique: true}},
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
        name: {type: String, index: {unique: true}},
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    }
);

var Students = mongoose.model('student', studentsSchema);
var Residencies = mongoose.model('residency', residencySchema);
var AdvancedStandings = mongoose.model('advancedStanding', advancedStandingSchema);
var Awards = mongoose.model('awards', awardsSchema);


// Dynamically control where to contact the DB, and wrap the db with mockgoose if testing
if (typeof (process.env.MONGO_DB_HOST) != "undefined") {
    // Production
    mongoose.connect('mongodb://' + process.env.MONGO_DB_HOST + '/studentsRecords');
}
else {
    // Production
    mongoose.connect('mongodb://localhost/studentsRecords');
}

var db = mongoose.connection;
db.on('error', function() {
    console.error.bind(console, 'connection error:');
    throw "connection error";
});

exports.Students = Students;
exports.Residencies = Residencies;
exports.AdvancedStandings = AdvancedStandings;
exports.Awards = Awards;

