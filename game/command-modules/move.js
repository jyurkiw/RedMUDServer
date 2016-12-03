function Move() {
    var lib = require('redmudlib')();
    var constants = require('../../util/constants');

    function move(character, command, argument, socket) {
        console.log(character);
        lib.room.async.getRoomByCode(character.room)
            .then(function(currentRoom) {
                if (currentRoom.exits !== undefined && currentRoom.exits[command] !== undefined) {
                    lib.room.async.getRoomByCode(currentRoom.exits[command])
                        .then(function(room) {
                            var newRoom = lib.util.buildRoomCode(room.areacode, room.roomnumber);
                            lib.character.async.updateCharacterRoom(character.name, newRoom)
                                .then(function(success) {
                                    if (success) {
                                        character.room = newRoom;
                                        socket.emit(constants.sock.ins, room);
                                    } else {
                                        socket.emit(constants.sock.ins, constants.errors.noExitErr);
                                    }
                                });
                        });
                } else {
                    socket.emit(constants.sock.ins, constants.errors.noExitErr);
                }
            });
    }

    var moveFunc = move;
    moveFunc.baseCall = true;
    moveFunc.instant = false;

    return {
        north: moveFunc,
        south: moveFunc,
        east: moveFunc,
        west: moveFunc,
        northwest: moveFunc,
        northeast: moveFunc,
        southwest: moveFunc,
        southeast: moveFunc
    };
}

module.exports = Move();