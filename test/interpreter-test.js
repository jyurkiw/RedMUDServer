var chai = require('chai');
chai.use(require('chai-http'));
var expect = chai.expect;
var should = chai.should();
var assert = require('assert');
var sinon = require('sinon');

var interpreter = require('../game/interpreter')(true);

describe('Test interpretRawCommand()', function() {
    before(function() {
        interpreter.test = 'test';
        interpreter.t = 'test';
    });

    it('Test zero-length raw command', function() {
        var cmd = interpreter.interpretRawCommand('');
        expect(cmd).to.equal(null);
    });

    it('Test base t command. No args', function() {
        var cmd = interpreter.interpretRawCommand('t');
        expect(cmd.command).to.be.an('string');
        expect(cmd.command).to.equal('test');
        expect(cmd.argument.length).to.equal(0);
    });

    it('test base t command, n arg', function() {
        var cmd = interpreter.interpretRawCommand('t n');
        expect(cmd.command).to.be.an('string');
        expect(cmd.command).to.equal('test');
        expect(cmd.argument).to.be.an('string');
        expect(cmd.argument).to.equal('n');
    });
});