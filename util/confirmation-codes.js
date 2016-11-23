/**
 * Manages hash codes for the server.
 * 
 * @returns an access object
 */
function ConfirmationCodes() {
    var _userIOCodes = {};

    /**
     * Store an id code for a user.
     * This code is used to confirm a user's connection over socket.io
     * 
     * @param {string} username A username.
     * @returns The generated code.
     */
    function storeCode(username) {
        var sha256 = require('js-sha256').sha256;
        var conf = require('../config/conf');
        _userIOCodes[username] = {
            code: sha256(username + Date.now() + conf.ioCodeSalt),
            expiery: Date.now() + 30000
        };

        return _userIOCodes[username].code.slice();
    }

    /**
     * Get a code from the code collection for the passed username.
     * 
     * @param {string} username A username.
     * @returns a code or null.
     */
    function getCode(username) {
        return _userIOCodes[username].code.slice();
    }

    /**
     * Check the passed code against the user's code.
     * If match, remove the code from the store and return true.
     * Otherwise return false.
     * 
     * @param {string} username A username.
     * @param {string} code The code to check.
     * @returns True if the code matches.
     */
    function checkCode(username, code) {
        if (_userIOCodes[username].code == code) {
            var goodCode = Date.now() <= _userIOCodes[username].expiery;
            delete _userIOCodes[username];

            return goodCode;
        } else {
            return false;
        }
    }

    return {
        storeCode: storeCode,
        getCode: getCode,
        checkCode: checkCode
    };
}

module.exports = ConfirmationCodes();