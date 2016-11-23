/**
 * The socket.io server that runs the actual MUD.
 * Sets up the verification event handlers, and starts up the game loop.
 * 
 * @namespace red-mud-server
 * @param {any} httpServer
 * @returns An access object.
 */
function RedMUDServer(httpServer) {
    var io = require('socket.io')(httpServer);
    var ccodes = require('../util/confirmation-codes');
    var conf = require('../config/conf');
    var linq = require('linq');
    var gameloop = require('node-gameloop');

    var loopid = null;

    var _connectionPhase = {};
    var _gamePhase = {};
    var _commandPhase = [];

    /**
     * Initialize the MUD.
     * Load all class modules.
     * Load all spell and effect modules.
     * 
     * @memberof red-mud-server
     */
    function initMUD() {
        console.log('Loading command handlers.');
        console.log('Loading classes.');
        console.log('Loading spells and effects.');
        console.log('MUD Initialization complete.');
    }

    /**
     * Verify the user over a socket connection.
     * The login controller will give the client a string code.
     * That code needs to be passed to the server via a socket through the "verify" event.
     * If the code is verified, the server will emit a response through the verify event
     * that is either true or false.
     * 
     * The userData argument is an object with the following structure:
     * <code><pre>
     * {
     *      username:   {string},
     *      code:       {string}
     * }
     * </pre></code>
     * 
     * When a user is successfully verified, a game phase object is added to the _gamePhase
     * collection to handle their character data, command queue, and keep track of their socket.
     * 
     * The game phase object has the following structure:
     * <code><pre>
     * {
     *      socket:         {object},
     *      commandQueue:   {array},
     *      character:      {object}
     * }
     * </pre></code>
     * 
     * @memberof red-mud-server
     * @param {any} userData
     */
    function verifyConnection(userData) {
        var socket = this;
        var username = userData.username;
        var code = userData.code;

        // Don't bother checking for expiery here. It can be handled inside the game loop.
        if (ccodes.checkCode(username, code)) {
            socket.emit('verify', true);
            _gamePhase[username] = {
                socket: _connectionPhase[socket.id].socket,
                commandQueue: [],
                character: {}
            };
            _commandPhase.push(username);
            _connectionPhase[socket.id].verified = true;
        } else {
            socket.emit('verify', false);
        }
    }

    /**
     * Start the game loop.
     * 
     * @memberof red-mud-server
     */
    function start() {
        loopid = gameloop.setGameLoop(function(delta) {
            console.log('in the mud loop');
            connectionPhaseHandler();
        }, conf.turnDuration);
    }

    /**
     * Handle the collection phase in the game loop.
     * Remove connected and verified connections and
     * unregister them from the verified event.
     * 
     * @memberof red-mud-server
     */
    function connectionPhaseHandler() {
        Object.keys(_connectionPhase).forEach(function(id) {
            var conn = _connectionPhase[id];
            if (Date.now() > conn.expiery && !conn.verified) {
                conn.socket.disconnect(0);
                conn.socket.removeListener('verify', verifyConnection);
            }
        });

        _connectionPhase = linq.from(_connectionPhase).where(function(conn) { return !conn.disconnected; }).toArray();
    }

    /**
     * Stop the game loop.
     * Notify all player clients that the server is stopped.
     * Disconnect and un-sub all socket connections.
     * 
     * @memberof red-mud-server
     */
    function stop() {
        if (loopid !== null) {
            gameloop.clearGameLoop(loopid);
            console.log('MUD stopped.');

            _commandPhase.forEach(function(username) {
                _gamePhase[username].socket.emit('server', "The server is shut down.");
                _gamePhase[username].socket.disconnect('chat');
                _gamePhase[username].socket.disconnect('queued');
                _gamePhase[username].socket.disconnect('instant');
                _gamePhase[username].socket.disconnect('server');
            });
        }
    }

    // Socket connection event handler.
    // Add the socket to the connection phase
    // collection with a 10 second expiery
    // and register the verify event for connection
    // verification.
    io.on('connection', function(socket) {
        console.log(socket.id + ' connected.');
        _connectionPhase[socket.id] = {
            socket: socket,
            expiery: Date.now() + 10000,
            verified: false
        };

        socket.on('verify', verifyConnection);
    });

    return {
        initMUD: initMUD,
        start: start,
        stop: stop,
        unverifiedConnectionCount: function() { return Object.keys(_connectionPhase).length; },
        playerCount: function() { return _commandPhase.length; }
    };
}

module.exports = RedMUDServer;