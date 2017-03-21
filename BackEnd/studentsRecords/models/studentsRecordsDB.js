let MongooseVariables = require('mongoose');
/*jshint -W058:false*/
let mongoose = new MongooseVariables.Mongoose;
if (process.env.NODE_ENV === 'test') var mockgoose = require('mockgoose');


//-------- SERVER CONNECTION --------//

// Dynamically set mongodb location
let mongoDBHost = 'localhost';
if (typeof (process.env.MONGO_DB_HOST) !== "undefined") mongoDBHost = process.env.MONGO_DB_HOST;
let mongoConnectFunc = () => mongoose.connect('mongodb://' + mongoDBHost + '/studentsRecords');

// Connect to database
if (process.env.NODE_ENV === 'test') {
    console.log('Testing mode activated. Mockgoose write filter initializing...');
    mockgoose(mongoose).then(mongoConnectFunc);    // Testing with mockgoose
}
else mongoConnectFunc();                                                            // Production database

let db = mongoose.connection;
db.on('error', function() {
    console.error.bind(console, 'connection error:');
    throw "connection error";
});


//-------- DB SETUP --------//

// Use native promises
mongoose.Promise = global.Promise;

exports.mongoose = mongoose;
