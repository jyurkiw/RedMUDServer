var app = require('express')();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
//var io = require('socket.io')(server);

var redMUDServer = require('./game/red-mud-server')(server);
redMUDServer.initMUD();
redMUDServer.start();

//var socketServer = require('http').createServer().listen(8081, function() { console.log('listening on port 8081.'); });
//var io = require('socket.io').listen(socketServer);

var port = 8080;
var apiPreface = '/api';

// Configure the application

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

app.use(apiPreface, require('./routes/login'));

server.listen(port);
console.log('server running...');

module.exports = app; // for testing