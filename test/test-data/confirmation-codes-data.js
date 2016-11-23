function ConfirmationCodesData() {
    var conf = require('../../config/conf');
    var sha256 = require('js-sha256');

    var username1 = 'testUser1';
    var username2 = 'testUser2';
    var username3 = 'testUser3';
    var username4 = 'testUser4';

    return {
        username1: username1,
        usercode1: sha256(username1 + 1 + conf.ioCodeSalt),
        userexpiery1: 30000 + 1,
        username2: username2,
        usercode2: sha256(username2 + 1 + conf.ioCodeSalt),
        userexpiery2: 30000 + 1,
        username3: username3,
        usercode3: sha256(username3 + 1 + conf.ioCodeSalt),
        userexpiery3: 30000 + 1,
        username4: username4,
        usercode4: sha256(username4 + 1 + conf.ioCodeSalt),
        userexpiery4: 30000 + 1
    };
}

module.exports = ConfirmationCodesData();