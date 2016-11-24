/**
 * Handle interpretation of commands from the command line.
 * 
 * @namespace interpreter
 * @returns An interpreter object.
 */
function Interpreter() {
    var fs = require('fs');
    var linq = require('linq');
    var constants = require('../util/constants');

    var commandObj = {};

    /**
     * Interpret a raw command from the user based on the fully-formed command object.
     * This function does not attempt to match partial command names unless they have
     * been specifically defined in the command module.
     * 
     * @memberof interpreter
     * @param {string} rawCommand
     * @returns A command/argument object.
     */
    function interpretRawCommand(rawCommand) {
        if (rawCommand.length === 0) {
            return null;
        }

        var command = rawCommand.substr(0, rawCommand.indexOf(' '));

        if (rawCommand.indexOf(' ') == -1) {
            command = rawCommand;
        }

        var argument = rawCommand.substr(command.length + 1);

        return { command: commandObj[command], argument: argument };
    }
    commandObj.interpretRawCommand = interpretRawCommand;

    // grab all files in the interpreter-modules directory
    linq.from(fs.readdirSync('./game/interpreter-modules'))
        .where(function(name) { return name.substr(-3) === '.js'; })
        .select(function(filename) { return require('./interpreter-modules/' + filename); })
        .orderBy(function(mod) { return mod.priority; })
        .toArray()
        .forEach(function(module) {
            Object.keys(module.commands).forEach(function(command) {
                if (commandObj[command] === undefined) {
                    commandObj[command] = module.commands[command];
                } else {
                    throw constants.errors.dupCmdErr + '(' + command + ')';
                }
            });
        });

    return commandObj;
}

module.exports = Interpreter();