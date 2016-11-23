var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should();
var assert = require('assert');
var sinon = require('sinon');

var lib = require('redmudlib')();
var client = lib.client.instance();

var server = require('../server');

var io = require('socket.io-client');

var loginData = require('./test-data/login-data.js');

describe('RedMUDServer testing', function() {
    before(function() {
        sinon.stub(Date, 'now').returns(1);
        var op = client.flushallAsync();
        return op.then(function() {
            return client.hmsetAsync('USER:' + loginData.user1login.username, 'pwhash', loginData.user1login.pwhash);
        });
    });

    after(function() {
        Date.now.restore();
        return client.flushallAsync();
    });

    it('Login as a user, and verify your connection', function(done) {
        chai.request(server)
            .post('/api/login')
            .send(loginData.user1login)
            .then(function(response) {
                response.status.should.equal(200);
                expect(response.body.success).to.equal(true);
                expect(response.body.clientCode).to.equal(loginData.user1ccode);

                var ioc = io.connect('http://localhost:8080');

                ioc.on('verify', function(success) {
                    expect(success).to.equal(true);
                    done();
                });

                ioc.emit('verify', { username: loginData.user1login.username, code: response.body.clientCode });
            });
    });
});