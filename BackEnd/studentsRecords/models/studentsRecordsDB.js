var MongooseVariables = require('mongoose');
var mongoose = new MongooseVariables.Mongoose;
if (process.env.NODE_ENV === 'test') var mockgoose = require('mockgoose');
var mongoosePaginate = require('mongoose-paginate');


//-------- SERVER CONNECTION --------//

// Dynamically set mongodb location
var mongoDBHost = 'localhost';
if (typeof (process.env.MONGO_DB_HOST) != "undefined") mongoDBHost = process.env.MONGO_DB_HOST;
var mongoConnectFunc = () => mongoose.connect('mongodb://' + mongoDBHost + '/studentsRecords');

// Connect to database
if (process.env.NODE_ENV === 'test') mockgoose(mongoose).then(mongoConnectFunc);    // Testing with mockgoose
else mongoConnectFunc();                                                            // Production database

var db = mongoose.connection;
db.on('error', function() {
    console.error.bind(console, 'connection error:');
    throw "connection error";
});


//-------- DB SETUP --------//

// Use native promises
mongoose.Promise = global.Promise;

var advancedStandingSchema = MongooseVariables.Schema(
    {
        course: String,
        description: String,
        units: Number,
        grade: Number,
        from: String,
        recipient: {type: MongooseVariables.Schema.ObjectId, ref: 'Students'}
    }
);

var awardsSchema = MongooseVariables.Schema(
    {
        note: String,
        recipient: {type: MongooseVariables.Schema.ObjectId, ref: 'Students'}
    }
);


var studentsSchema = MongooseVariables.Schema(
    {
        number: {type: Number, index: {unique: true}},
        firstName: String,
        lastName: String,
        DOB: Date,
        photo: String,
        registrationComments: String,
        basisOfAdmission: String,
        admissionAverage: Number,
        admissionComments: String,
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residencies'},
        genderInfo: {type: mongoose.Schema.ObjectId, ref: 'Genders'},
        awards: [{type: mongoose.Schema.ObjectId, ref: 'Awards'}],
        advancedStandings: [{type: mongoose.Schema.ObjectId, ref: 'AdvancedStandings'}]
    }
);
studentsSchema.plugin(mongoosePaginate);

var residencySchema = MongooseVariables.Schema(
    {
        name: {type: String, index: {unique: true}},
        students: [{type: MongooseVariables.Schema.ObjectId, ref: ('Students')}]
    }
);

var genderSchema = mongoose.Schema(
    {
        name: {type: String, index: {unique: true}},
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    }
);

var Students = mongoose.model('student', studentsSchema);
var Residencies = mongoose.model('residency', residencySchema);
var Genders = mongoose.model('gender', genderSchema);
var AdvancedStandings = mongoose.model('advancedStanding', advancedStandingSchema);
var Awards = mongoose.model('awards', awardsSchema);


exports.Students = Students;
exports.Residencies = Residencies;
exports.Genders = Genders;
exports.AdvancedStandings = AdvancedStandings;
exports.Awards = Awards;
