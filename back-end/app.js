var express = require('express');
// app will handle the basic configuration
var app = express();
// make sur the app connect to the database
var db = require('./db');

var UserController = require('./user/UserController');
// map the route /users to the user controller
app.use('/users', UserController);

// Retrieve the authentication controller
var AuthController = require('./auth/AuthController');
// map the route /auth to the auth controller
app.use('/auth', AuthController);


module.exports = app;