var mongoose = require('mongoose');
//TODO: Connect to the receipeDB
var dbUrl = 'mongodb://localhost/test';
mongoose.connect(dbUrl);

console.log("Mongoose connected to the database : "+dbUrl);