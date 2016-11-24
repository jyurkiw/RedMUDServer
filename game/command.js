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
function Command(_gamePhase, _commandPhase) {
    function register(socket, username) {
        console.log('registering ' + username + ' for command events.');
        socket.on('command', parseCommand);
    }

    function parseCommand(command) {
        var socket = this;
        var playerPhase = _gamePhase[socket.id];
        console.log('received command ' + command + ' from ' + playerPhase.username);
    }

    return {
        register: register
    };
}

module.exports = Command;