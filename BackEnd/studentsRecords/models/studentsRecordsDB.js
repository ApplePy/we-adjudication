var MongooseVariables = require('mongoose');
var mongoose = new MongooseVariables.Mongoose;
if (process.env.NODE_ENV === 'test') var mockgoose = require('mockgoose');


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

exports.MongooseVariables = MongooseVariables;
exports.mongoose = mongoose;
