var ResourceChangedEvents = require('../');
var EventEmitter = require('events').EventEmitter;
var should = require('should');

describe('Basic Structure', function() {
	it('ResourceChangedEvents should exist', function() {
		should.exist(ResourceChangedEvents);
	});
	it('ResourceChangedEvents should be a function', function() {
		(typeof ResourceChangedEvents).should.equal('function');
	});
	it('ResourceChangedEvents should take one argument', function() {
		ResourceChangedEvents.length.should.equal(1);
	});
	it('ResourceChangedEvents should be an EventEmitter', function() {
		(new ResourceChangedEvents() instanceof EventEmitter).should.equal(true);
	});
});