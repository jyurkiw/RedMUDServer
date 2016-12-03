/**
 * Login controller.
 * 
 * @namespace login-controller
 * @returns An access object.
 */
function LoginController() {
    var lib = require('redmudlib')();
    var ccodes = require('../util/confirmation-codes');

    /**
     * Login POST.
     * Expects the following data struture in the body:
     * <code><pre>
     * {
     *      username: {string},
     *      pwhash: {string}
     * }
     * </pre></code>
     * 
     * @param {any} request A request object.
     * @param {any} response A response object.
     */
    function loginPOST(request, response) {
        var loginData = request.body;

        return lib.user.async.checkPassword(loginData.username, loginData.pwhash)
            .then(function(success) {
                var data = {
                    success: success
                };

                if (success) {
                    data.clientCode = ccodes.storeCode(loginData.username);
                    response.json(data);
                } else {
                    response.status(500);
                    response.json(data);
                }
            })
            .catch(function(err) {
                response.status(500);
                response.json(err);
            });
    }

    return {
        loginPOST: loginPOST
    };
}

module.exports = LoginController();