function Move() {
    var lib = require('redmudlib');

    function move(character, command, argument, socket) {
        
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