
var express = require('express');
var logger = require('./logger');
var app = express();
var posts = require('./routes/posts');


app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
    next();
});
app.use(logger);
//app.use(express.static('public'));

app.use('/posts', posts);

app.listen(3700, function () {
    console.log('Listening on port 3700');
});
