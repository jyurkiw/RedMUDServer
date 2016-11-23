var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should();
var assert = require('assert');
var sinon = require('sinon');

var lib = require('redmudlib')();
var client = lib.client.instance();

var server = require('../server');
var sha256 = require('js-sha256').sha256;
var data = require('./test-data/login-data.js');

describe('Login API Testing', function() {
    before(function() {
        sinon.stub(Date, 'now').returns(1);
    });

    after(function() {
        Date.now.restore();
        return client.flushallAsync();
    });

    describe('Login controller', function() {
        beforeEach(function() {
            var op = client.flushallAsync();
            return op.then(function() {
                return client.hmsetAsync('USER:' + data.user1login.username, 'pwhash', data.user1login.pwhash);
            });
        });

        afterEach(function() {
            return client.flushallAsync();
        });

        it('POST login attempt', function() {
            return chai.request(server)
                .post('/api/login')
                .send(data.user1login)
                .then(function(response) {
                    response.status.should.equal(200);
                    expect(response.body.success).to.equal(true);
                    expect(response.body.clientCode).to.equal(data.user1ccode);
                });
        });
    });
});