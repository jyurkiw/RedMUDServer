/**
 * Commands to look at something.
 * 
 * @namespace command-modules
 * @returns An access object.
 */
function Look() {
    var lib = require('redmudlib')();
    var constants = require('../../util/constants');
    var direction = require('../interpreter-modules/direction');

    /**
     * Base look command.
     * <br/>
     * Takes zero or one argument.
     * 
     * @memberof command-modules
     * @param {any} character The character object.
     * @param {any} command The command string.
     * @param {string} argument The argument string.
     * @param {any} socket The communication socket.
     */
    function look(character, command, argument, socket) {
        // handle base look
        lib.room.async.getRoomByCode(character.room)
            .then(function(room) {
                if (argument.length === 0) {
                    socket.emit(constants.sock.ins, room);
                } else {
                    console.log('additional args found');
                    if (argument.indexOf(' ') === -1) {
                        var interpreter = require('../interpreter')();

                        var arg = interpreter.interpretRawCommand(argument);
                        if (arg !== null) {
                            if (room.exits[arg.command] !== undefined) {
                                lib.room.async.getRoomByCode(room.exits[arg.command])
                                    .then(function(adjacentRoom) {
                                        socket.emit(constants.sock.ins, adjacentRoom);
                                    });
                            } else {
                                socket.emit(constants.sock.ins, constants.errors.noExitErr);
                            }
                        }
                    }
                }
            });

    }

    var lookFunc = look;
    lookFunc.baseCall = true;
    lookFunc.instant = true;

    return {
        look: lookFunc
    };
}

module.exports = Look();