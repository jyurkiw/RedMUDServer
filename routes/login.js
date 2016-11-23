function LoginRoute() {
    var express = require('express');
    var router = express.Router();

    var controller = require('../controllers/login');

    // Login controller binding
    router.post('/login', controller.loginPOST);

    return router;
}

module.exports = LoginRoute();