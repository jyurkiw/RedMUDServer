/**
 * Module used to manage and process a player's command queue.
 * This includes interpreting un-parsed commands received
 * from the client.
 * <br/>
 * The command queue is used to manage time-dependent commands issued
 * by the player, as their execution is bound to the ticks of the
 * mud gameloop.
 * 
 * Time sensitive commands include:
 * <ol>
 *      <li>Movment</li>
 *      <li>Combat</li>
 * </ol> 
 * 
 * @namespace command
 */
function Commander(_gamePhase, _commandPhase, noLoad) {
    // Default noLoad to false if not passed
    if (noLoad === null || noLoad === undefined) {
        noLoad = false;
    }

    var constants = require('../util/constants');
    var interpreter = require('./interpreter')();
    var fs = require('fs');
    var linq = require('linq');

    var commandObj = {};

    /**
     * Register a socket to the command event.
     * 
     * @memberof command
     * @param {any} socket A socket.
     * @param {any} username The verified user.
     */
    function register(socket, username) {
        console.log('registering ' + username + ' for command events and displaying current room.');

        playerPhase = _gamePhase[socket.id];
        commandObj.look(playerPhase.character, "look", "", socket);

        socket.on(constants.sock.cmd, parseCommand);
    }

    /**
     * Handle an incomming command from the client.
     * 
     * @memberof command
     * @param {string} rawCommand The raw text command.
     */
    function parseCommand(rawCommand) {
        var socket = this;
        var playerPhase = _gamePhase[socket.id];
        console.log('received command ' + rawCommand + ' from ' + playerPhase.username);

        // Parse the command into an object with the signature
        // { command: {string}, argument: {string} }
        var parsedCmd = interpreter.interpretRawCommand(rawCommand);

        // if parsedCmd is null, the raw command was not a valid command.
        // If parsedCmd is not present in the commandObj, it's not a valid command.
        if (parsedCmd !== null && commandObj[parsedCmd.command] !== undefined) {
            console.log('interpreted ' + rawCommand + ' as ' + parsedCmd.command);
            if (commandObj[parsedCmd.command].instant) {
                // Command is instant. Execute immediately.
                commandObj[parsedCmd.command](playerPhase.character, parsedCmd.command, parsedCmd.argument, socket);
            } else {
                // Command is turn-bound. Place in player's command queue.
                playerPhase.commandQueue.push(parsedCmd);
            }
        } else {
            console.log('command ' + rawCommand + ' was shit');
        }
    }

    /**
     * Execute one queued command per player.
     * 
     * @memberof command
     */
    function executeQueuedCommands() {
        console.log('executing queued commands');

        _commandPhase.forEach(function(playerKey) {
            var playerPhase = _gamePhase[playerKey];
            var parsedCmd = playerPhase.commandQueue.shift();

            if (parsedCmd !== undefined) {
                var commandFunction = commandObj[parsedCmd.command];
                commandFunction(playerPhase.character, parsedCmd.command, parsedCmd.argument, playerPhase.socket)
            }
        });
    }

    if (!noLoad) {
        // Build the commandObj
        linq.from(fs.readdirSync('./game/command-modules'))
            .where(function(name) { return name.substr(-3) === '.js'; })
            .select(function(filename) { return require('./command-modules/' + filename); })
            .toArray()
            .forEach(function(commandWrapper) {
                Object.keys(commandWrapper).forEach(function(commandKey) {
                    if (commandObj[commandKey] === undefined) {
                        commandObj[commandKey] = commandWrapper[commandKey];
                    } else {
                        console.log('shit/dupe command detected for ' + commandKey);
                    }
                });
            });
    }

    return {
        register: register,
        executeQueuedCommands: executeQueuedCommands
    };
}

module.exports = Commander;