// Retrieve the app
var app = require('./app');

// Find the port to listen to
var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
    console.log('Express server is listenning on port '+ port);
})