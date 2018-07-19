// Retrieve router from the express middleware
var express = require('express');
var router = express.Router();

// Request the body parser
var bodyParser = require('body-parser');
// parse urlencoded data, true use qs, fals querystring
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

// Retrieve the receipe model
var Receipe = require('./Receipe');

// Retrieved the verification middleware
var VerifyToken = require('../auth/VerifyToken');


// Grant access to any origin
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// CRUD routes :

// READ all the receipes in the database
router.get('/', function(req, res){
    Receipe.find({}, function(err, receipes) {
        if(err) return res.status(500).send("There was a problem finding the receipes.");
        res.status(200).send(receipes);
    });
});

// READ a single receipe
router.get('/:id', function(req, res){

    Receipe.findById(req.params.id, function (err, receipe) {
        if(err) return res.status(500).send("There was a problem finding the receipe.");
        if(!receipe) return res.status(404).send("No receipe found.");
        res.status(200).send(receipe);
    });
});

// The verify token middleware will be 
// used to create, update and delete receipes

// CREATE a new receipe
router.post('/', VerifyToken, function(req, res) {
    console.log("Trying to post receipe :"+req.body.name);
    Receipe.create(req.body, function(err, receipe) {
        if(err) return res.status(500).send("There was a problem adding information to the database.");
        res.status(200).send(receipe);
        
    });
});


// DELETE a single receipe from the database
router.delete('/:id', VerifyToken, function(req, res){

    Receipe.findByIdAndRemove(req.params.id, function(err, receipe){
        if (err) return res.status(500).send("There was a problem deleting the receipe.");
        res.status(200).send("receipe "+receipe.name+" was deleted");
    });
});

// UPDATE a single receipe in the database
router.put('/:id', VerifyToken, function(req, res) {

    Receipe.findByIdAndUpdate(req.params.id, req.body, {new: true}, 
    function(err, receipe) {
        if (err) return res.status(500).send("There was a probleme updating the receipe.");
        res.status(200).send(receipe);
    });
});


module.exports = router;