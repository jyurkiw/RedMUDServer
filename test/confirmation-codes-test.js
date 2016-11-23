var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');

var ccodes = require('../util/confirmation-codes');
var sha256 = require('js-sha256').sha256;

var data = require('./test-data/confirmation-codes-data');

describe('Confirmation Codes', function() {
    before(function() {
        sinon.stub(Date, 'now').returns(1);
    });

    after(function() {
        Date.now.restore();
    });

    it('Store Code for ' + data.username1, function() {
        var code = ccodes.storeCode(data.username1);

        code.should.equal(data.usercode1);
    });

    it('Get Code for ' + data.username2, function() {
        ccodes.storeCode(data.username2);

        var code = ccodes.getCode(data.username2);
        code.should.equal(data.usercode2);
    });

    it('Check Code for ' + data.username3, function() {
        ccodes.storeCode(data.username3);

        var check = ccodes.checkCode(data.username3, data.usercode3);
        check.should.equal(true);
    });

    if ('Check Code Twice for ' + data.username4, function() {
            ccodes.storeCode(data.username4);
            var check = ccodes.checkCode(data.username4, data.usercode4);
            expect(check).to.equal(true);

            check = ccodes.checkCode(data.username4, data.usercode4);
            expect(check).to.equal(false);
        });
});