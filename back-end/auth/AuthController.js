// Retrieve router from the express middleware
var express = require('express');
var router = express.Router();

// Request the body parser
var bodyParser = require('body-parser');
// parse urlencoded data, true use qs, fals querystring
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

// Retrieve the user model
var User = require('../user/User');

// Retrieve the json web token, bcrypt middleware
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// load the config -- currently only have the secret key
var config = require('../config');

// Retrieved the verification middleware
var VerifyToken = require('./VerifyToken');


// Auth routes

// Register a user
router.post('/register', function(req, res) {
    
    // Encrypt the password with bcrypt hashing methods
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword, //Only the hashed password is save in the db
    },
    function(err, user) {
        if(err) return res.status(500).send("There was a problem registering the user.");

        //If there is no error, a token is created
        var token = jwt.sign({ id: user._id}, config.secretKey, {
            expiresIn: 86400 // expires in 24 hours
        });

        //response having the token
        res.status(200).send({auth: true, token : token});
    });
});


// Find a user and verify if the password is correct 
router.post('/login', function(req, res) {

    
    User.findOne({ email: req.body.email }, function(err, user) {

        // First check if the user is founded
        if(err) return res.status(500).send('Error on the server.');
        if(!user) return res.status(404).send('No user found.');

        // Use bcrypt to compare the provided password and the user password
        var passwordIsValide = bcrypt.compareSync(req.body.password, user.password);
        if(!passwordIsValide) return res.status(401).send({auth : false, token: null});

        // Create the token for this user for 24 hours
        var token = jwt.sign({id : user._id}, config.secretKey, {
            expiresIn: 86400 //expires in 24 hours
        });

        res.status(200).send({auth: true, token: token});
    });
});

// Basic logout endpoint, however the logout is done at client side
router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null});
});


router.get('/me', VerifyToken, function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secretKey, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      User.findById(decoded.id, { password : 0},
        function(err, user){
            if(err) return res.status(500).send("There was a problem finding the user.");
            if(!user) return res.status(404).send("No user found");

            res.status(200).send(user);
        });
    });
  });



  // export the router 
  module.exports = router;