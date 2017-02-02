var mongoose = require('mongoose');
if (process.env.NODE_ENV === 'test') var mockgoose = require('mockgoose');
var mongoosePaginate = require('mongoose-paginate');

// Use native promises
mongoose.Promise = global.Promise;

var studentsSchema = mongoose.Schema(
    {
        number: String,
        firstName: String,
        lastName: String,
        gender: Number,
        DOB: Date,
        photo: String,
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residencies'}
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


// Dynamically control where to contact the DB, and wrap the db with mockgoose if testing
if (typeof (process.env.MONGO_DB_HOST) != "undefined") {
    // Production
    if (process.env.NODE_ENV !== 'test')
        mongoose.connect('mongodb://' + process.env.MONGO_DB_HOST + '/studentsRecords');

    // Testing
    else
        mockgoose(mongoose).then(function() {
            // mongoose connection
            mongoose.connect('mongodb://' + process.env.MONGO_DB_HOST + '/studentsRecords');
        });

}
else {
    // Production
    if (process.env.NODE_ENV !== 'test')
        mongoose.connect('mongodb://localhost/studentsRecords');
    // Testing
    else
        mockgoose(mongoose).then(function() {
            // mongoose connection
            mongoose.connect('mongodb://' + process.env.MONGO_DB_HOST + '/studentsRecords');
        });

}

var db = mongoose.connection;
db.on('error', function() {
    console.error.bind(console, 'connection error:');
    throw "connection error";
});
db.once('open', function() {

    exports.Students = Students;
    exports.Residencies = Residencies;

});



