function LoginData() {
    var sha256 = require('js-sha256').sha256;
    var conf = require('../../config/conf');

    var user1login = {
        username: 'testUser1',
        pwhash: sha256('testPassword12345')
    };

    return {
        user1login: user1login,
        user1ccode: sha256(user1login.username + 1 + conf.ioCodeSalt)
    };
}

module.exports = LoginData();