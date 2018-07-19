var jwt = require('jsonwebtoken');
// Retrieve the secret key
var config = require('../config');


//This function is used as a middleware to enable acces or not to the db
function verifyToken(req, res, next){
    var token = req.headers['x-access-token'];
    // Check wether a token in founded
    if(!token) return res.status(403).send({ auth: false, message: 'No token provided'});

    // verify the token
    jwt.verify(token, config.secretKey, function(err ,decoded) {
        if(err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        console.log("User's token verified");
        //If the verification is ok, the id is added to the request and it goes to the next function
        req.userID = decoded.id;
        next();
    });
};

module.exports = verifyToken;