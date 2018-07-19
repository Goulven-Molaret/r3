var express = require('express');
// app will handle the basic configuration
var app = express();
// make sur the app connect to the database
var db = require('./db');

// Retrieve the authentication controller
var AuthController = require('./auth/AuthController');
// map the route /auth to the auth controller
app.use('/auth', AuthController);
console.log("authentication routes '/auth' enabled");

// Retrieve the receipe controller
var ReceipeController = require('./receipe/ReceipeController');
// map the route /receipe to the receipe controller
app.use('/receipe', ReceipeController);
console.log("receipe routes '/receipe' enabled");


module.exports = app;